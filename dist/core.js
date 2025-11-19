/**
 * @file core.ts
 * @migrated-from js/core.js
 *
 * Core Game Logic and Update Functions
 *
 * THIS MODULE IS RESPONSIBLE FOR:
 * 1. Ball physics simulation and trajectory updates
 * 2. Possession changes based on ballHolder
 * 3. Game loop orchestration and timing
 * 4. Calling updatePlayerAI_V2 for each player
 * 5. Goal detection and score updates
 * 6. Match state management (time, status)
 * 7. Rendering and visual updates
 *
 * CONSTRAINT: This module coordinates all systems but doesn't handle individual
 * player decisions (that's in ai module)
 */
import { distance, pointToLineDistance } from './utils/math';
import { getPlayerActivePosition, applyMarkingAndPressing } from './ai';
import { updateGoalkeeperAI_Advanced } from './ai';
import { initiatePass, initiateDribble, passBall } from './ai';
import { action_attemptTackle } from './rules/ballControl';
import { assignBallChasers, validateBallHolder, updatePhysics } from './physics';
import { renderGame } from './rendering';
import { GAME_CONFIG, TACTICS, GAME_LOOP } from './config';
import { gameState } from './globalExports';
import { EVENT_TYPES } from './types';
import { eventBus } from './eventBus';
import { getAttackingGoalX, calculateXG, isSetPieceStatus } from './utils/ui';
import { resetAfterGoal, handleShotAttempt, removePlayerFromMatch, handleFreeKick, processPendingEvents } from './main';
import * as SetPieceIntegration from './setpieces/integration';
import { SetPieceEnforcement } from './setpieces/enforcement';
import { getVisibleTeammates } from './ai/playerVision';
import { selectBestAttackingMovement } from './ai/MovementPatterns';
import { canPlayerActOnBall } from './ai/playerFirstTouch';
// Debug flag (replaces window.DEBUG_AI)
const DEBUG_AI = false;
// ============================================================================
// SPATIAL AWARENESS SYSTEM
// ============================================================================
class SpatialAwarenessSystem {
    constructor() {
        this.grid = null;
        this.cellSize = 50;
    }
    buildGrid(allPlayers, width, height) {
        const cols = Math.ceil(width / this.cellSize);
        const rows = Math.ceil(height / this.cellSize);
        this.grid = Array(rows).fill(null).map(() => Array(cols).fill(null).map(() => []));
        allPlayers.forEach(player => {
            const col = Math.floor(player.x / this.cellSize);
            const row = Math.floor(player.y / this.cellSize);
            if (this.grid && row >= 0 && row < rows && col >= 0 && col < cols && this.grid[row] && this.grid[row][col]) {
                this.grid[row][col].push(player);
            }
        });
    }
    getNearbyPlayers(player, radius) {
        if (!this.grid || this.grid.length === 0)
            return [];
        const col = Math.floor(player.x / this.cellSize);
        const row = Math.floor(player.y / this.cellSize);
        const cellRadius = Math.ceil(radius / this.cellSize);
        const nearby = [];
        for (let r = row - cellRadius; r <= row + cellRadius; r++) {
            for (let c = col - cellRadius; c <= col + cellRadius; c++) {
                if (this.grid && r >= 0 && r < this.grid.length && this.grid[0] && c >= 0 && c < this.grid[0].length) {
                    const gridRow = this.grid[r];
                    if (gridRow) {
                        const cell = gridRow[c];
                        if (cell) {
                            nearby.push(...cell);
                        }
                    }
                }
            }
        }
        return nearby.filter(p => {
            if (p.id === player.id)
                return false;
            const dx = p.x - player.x;
            const dy = p.y - player.y;
            return Math.sqrt(dx * dx + dy * dy) < radius;
        });
    }
    calculateSpacingForce(player, teammates) {
        const personalSpace = ['CB', 'RB', 'LB'].includes(player.role) ? 35 : 25;
        const nearby = this.getNearbyPlayers(player, personalSpace * 2).filter(p => teammates.some(t => t.id === p.id));
        let forceX = 0;
        let forceY = 0;
        nearby.forEach(teammate => {
            const dx = player.x - teammate.x;
            const dy = player.y - teammate.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < personalSpace && dist > 0) {
                const strength = (personalSpace - dist) / personalSpace;
                // IMPROVED: Reduced from 2.5 to 1.0 - less aggressive spacing
                // Players will still avoid overlap but won't create unnatural gaps
                const force = strength * 1.0;
                forceX += (dx / dist) * force;
                forceY += (dy / dist) * force;
            }
        });
        return { x: forceX, y: forceY };
    }
}
export const spatialSystem = new SpatialAwarenessSystem();
class ActionDecisionSystem {
    decideBestAction(player, teammates, opponents, gameState) {
        const goalX = getAttackingGoalX(player.isHome, gameState.currentHalf);
        // PRIORITY 1: SHOOT
        if (this.shouldShootNow(player, opponents, gameState)) {
            if (DEBUG_AI) {
                console.log(`[AI] ${player.name}: SHOOT decision (goalX=${goalX})`);
            }
            return { action: 'SHOOT', target: { x: goalX, y: 300 } };
        }
        // PRIORITY 2: PASS
        const bestPass = this.findBestPassTarget(player, teammates, opponents, goalX);
        if (bestPass && bestPass.score > 60) {
            if (DEBUG_AI) {
                console.log(`[AI] ${player.name}: PASS decision (score=${bestPass.score}, target=${bestPass.teammate.name})`);
            }
            return { action: 'PASS', target: bestPass.teammate };
        }
        // PRIORITY 3: DRIBBLE
        if (this.hasSpaceToDribble(player, opponents, goalX)) {
            if (DEBUG_AI) {
                console.log(`[AI] ${player.name}: DRIBBLE decision (to goalX=${goalX})`);
            }
            return { action: 'DRIBBLE', target: { x: goalX, y: player.y } };
        }
        // DEFAULT:
        if (bestPass) {
            if (DEBUG_AI) {
                console.log(`[AI] ${player.name}: PASS decision (fallback, score=${bestPass.score})`);
            }
            return { action: 'PASS', target: bestPass.teammate };
        }
        if (DEBUG_AI) {
            console.log(`[AI] ${player.name}: HOLD decision (no viable options)`);
        }
        return { action: 'HOLD', target: null };
    }
    shouldShootNow(player, opponents, gameState) {
        try {
            // Prevent shooting immediately after kick-off
            if (gameState.postKickOffCalmPeriod && gameState.kickOffCompletedTime) {
                const timeSinceKickOff = Date.now() - gameState.kickOffCompletedTime;
                if (timeSinceKickOff < 4000) { // 4 seconds calm period
                    return false;
                }
                // Clear flag after calm period expires
                if (timeSinceKickOff >= 4000) {
                    gameState.postKickOffCalmPeriod = false;
                }
            }
            const goalX = getAttackingGoalX(player.isHome, gameState.currentHalf);
            // Validate goalX calculation
            if (typeof goalX !== 'number' || !isFinite(goalX)) {
                console.warn(`Invalid goalX in shouldShootNow: ${goalX}`);
                return false;
            }
            const distToGoal = Math.abs(player.x - goalX);
            if (distToGoal > 250)
                return false;
            const xG = calculateXG(player, goalX, player.y, opponents);
            // Validate xG result
            if (typeof xG !== 'number' || !isFinite(xG)) {
                console.warn(`Invalid xG calculation: ${xG}, defaulting to no shot`);
                return false;
            }
            return xG > 0.1;
        }
        catch (err) {
            console.error('shouldShootNow error:', err);
            return false;
        }
    }
    findBestPassTarget(player, teammates, opponents, goalX) {
        const visibleTeammates = getVisibleTeammates(player, [...teammates, player]);
        let bestOption = null;
        let bestScore = -1;
        visibleTeammates.forEach((teammate) => {
            const distToTeammate = distance(player, teammate);
            if (distToTeammate < 30 || distToTeammate > 250)
                return;
            let score = 0;
            if (Math.sign(teammate.x - player.x) === Math.sign(goalX - player.x)) {
                score += 40;
            }
            const space = opponents.length > 0
                ? Math.min(...opponents.map(o => distance(teammate, o)))
                : 1000;
            score += Math.max(0, space - 20);
            const isBlocked = opponents.some(opp => pointToLineDistance(opp, player, teammate) < 20 && distance(player, opp) < distToTeammate);
            if (isBlocked)
                score = 0;
            if (score > bestScore) {
                bestScore = score;
                bestOption = { teammate, score };
            }
        });
        return bestOption;
    }
    hasSpaceToDribble(player, opponents, goalX) {
        const dribbleCheckPos = {
            x: player.x + Math.sign(goalX - player.x) * 50,
            y: player.y
        };
        const spaceAhead = opponents.length > 0
            ? Math.min(...opponents.map(o => distance(dribbleCheckPos, o)))
            : 1000;
        return spaceAhead > 40;
    }
}
export const actionDecision = new ActionDecisionSystem();
// ============================================================================
// SMART TACKLE SYSTEM
// ============================================================================
class SmartTackleSystem {
    shouldAttemptTackle(defender, ballCarrier, gameState) {
        const dist = Math.sqrt(Math.pow(defender.x - ballCarrier.x, 2) +
            Math.pow(defender.y - ballCarrier.y, 2));
        if (dist > 18)
            return false;
        const inPenaltyBox = this.isInPenaltyBox(defender, gameState);
        if (inPenaltyBox) {
            const defenderSkill = (defender.defending / 100);
            return Math.random() < (defenderSkill * 0.2);
        }
        const defenderSkill = (defender.defending / 100);
        return Math.random() < (defenderSkill * 0.6);
    }
    isInPenaltyBox(player, gameState) {
        const pitchWidth = GAME_CONFIG.PITCH_WIDTH;
        const boxWidth = 160;
        const boxHeight = 400;
        const centerY = 300;
        const attackingGoalX = getAttackingGoalX(!player.isHome, gameState.currentHalf);
        if (attackingGoalX < pitchWidth / 2) {
            return player.x < boxWidth &&
                player.y > (centerY - boxHeight / 2) &&
                player.y < (centerY + boxHeight / 2);
        }
        else {
            return player.x > (pitchWidth - boxWidth) &&
                player.y > (centerY - boxHeight / 2) &&
                player.y < (centerY + boxHeight / 2);
        }
    }
    checkForPenalty(foul, gameState) {
        const fouledInBox = this.isInPenaltyBox(foul.fouled, gameState);
        if (!fouledInBox || foul.severity <= 0.5) {
            return { awarded: false };
        }
        const PITCH_WIDTH = GAME_CONFIG.PITCH_WIDTH;
        const boxWidth = 160;
        const inLeftBox = foul.fouled.x < boxWidth;
        const inRightBox = foul.fouled.x > (PITCH_WIDTH - boxWidth);
        const homeAttackingGoalX = getAttackingGoalX(true, gameState.currentHalf);
        let foulInHomeDefensiveBox, foulInAwayDefensiveBox;
        if (homeAttackingGoalX < PITCH_WIDTH / 2) {
            foulInHomeDefensiveBox = inRightBox;
            foulInAwayDefensiveBox = inLeftBox;
        }
        else {
            foulInHomeDefensiveBox = inLeftBox;
            foulInAwayDefensiveBox = inRightBox;
        }
        const fouledPlayerIsHome = foul.fouled.isHome;
        const foulerPlayerIsHome = foul.fouler.isHome;
        let penaltyAwarded = false;
        if (fouledPlayerIsHome && foulInAwayDefensiveBox) {
            penaltyAwarded = true;
        }
        else if (!fouledPlayerIsHome && foulInHomeDefensiveBox) {
            penaltyAwarded = true;
        }
        if (penaltyAwarded) {
            return {
                awarded: true,
                attackingTeam: fouledPlayerIsHome ? 'home' : 'away',
                defendingTeam: foulerPlayerIsHome ? 'home' : 'away'
            };
        }
        return { awarded: false };
    }
}
export const tackleSystem = new SmartTackleSystem();
class PenaltySystem {
    constructor() {
        this.state = null;
    }
    initiate(attackingTeam, defendingTeam, gameState) {
        const shooter = attackingTeam
            .filter(p => p.role !== 'GK')
            .sort((a, b) => b.shooting - a.shooting)[0];
        if (!shooter)
            return null;
        const goalkeeper = defendingTeam.find(p => p.role === 'GK');
        if (!goalkeeper)
            return null;
        const goalX = getAttackingGoalX(shooter.isHome, gameState.currentHalf);
        const penaltySpotX = goalX < 400 ? 110 : 690;
        this.state = {
            shooter,
            goalkeeper,
            goalX,
            penaltySpotX,
            spotY: 300,
            phase: 'SETUP',
            startTime: Date.now()
        };
        gameState.status = 'PENALTY';
        gameState.ballHolder = null;
        gameState.ballTrajectory = null;
        console.log(`🎯 PENALTY AWARDED! ${shooter.name} to take`);
        return this.state;
    }
    update(gameState) {
        if (!this.state)
            return null;
        const elapsed = Date.now() - this.state.startTime;
        switch (this.state.phase) {
            case 'SETUP':
                this.positionPlayers(gameState);
                if (elapsed > 2000) {
                    this.state.phase = 'READY';
                }
                break;
            case 'READY':
                if (elapsed > 3000) {
                    this.state.phase = 'SHOOTING';
                    return this.executeShot(gameState);
                }
                break;
        }
        return null;
    }
    positionPlayers(gameState) {
        if (!this.state)
            return;
        const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
        // Position shooter
        this.state.shooter.x = this.state.penaltySpotX;
        this.state.shooter.y = this.state.spotY;
        // Position goalkeeper
        this.state.goalkeeper.x = this.state.goalX;
        this.state.goalkeeper.y = this.state.spotY;
        // Position ball
        gameState.ballPosition.x = this.state.penaltySpotX;
        gameState.ballPosition.y = this.state.spotY;
        // Clear everyone else from box
        allPlayers.forEach(p => {
            if (this.state && p.id !== this.state.shooter.id && p.id !== this.state.goalkeeper.id) {
                if (tackleSystem.isInPenaltyBox(p, gameState)) {
                    p.x = 400;
                    p.targetX = 400;
                }
            }
        });
    }
    executeShot(gameState) {
        if (!this.state)
            return null;
        const state = this.state; // Local reference for type safety
        const shooterSkill = state.shooter.shooting / 100;
        const gkSkill = state.goalkeeper.goalkeeping / 100;
        const teamStats = state.shooter.isHome ? gameState.stats.home : gameState.stats.away;
        const oppositionStats = state.shooter.isHome ? gameState.stats.away : gameState.stats.home;
        const PENALTY_XG = 0.76;
        teamStats.xGTotal += PENALTY_XG;
        const corners = [
            { y_offset: -40, name: 'top' },
            { y_offset: 40, name: 'bottom' },
            { y_offset: -20, name: 'mid-top' },
            { y_offset: 20, name: 'mid-bottom' }
        ];
        const targetCorner = corners[Math.floor(Math.random() * corners.length)] || corners[0];
        const targetY = state.spotY + (targetCorner?.y_offset || 0);
        const gkDiveY = state.spotY + (Math.random() < 0.5 ? -40 : 40);
        const accuracy = shooterSkill + (Math.random() * 0.3 - 0.15);
        const onTarget = accuracy > 0.4;
        const correctDive = Math.abs(targetY - gkDiveY) < 50;
        const saved = onTarget && correctDive && (gkSkill + Math.random() * 0.3) > 0.7;
        passBall(state.shooter, state.penaltySpotX, state.spotY, state.goalX, targetY, 1.0, 900, true);
        state.goalkeeper.targetY = gkDiveY;
        let result;
        if (!onTarget) {
            result = {
                outcome: 'MISS',
                message: `❌ ${state.shooter.name} misses the target!`
            };
            teamStats.shotsOffTarget++;
        }
        else if (saved) {
            result = {
                outcome: 'SAVE',
                message: `🧤 ${state.goalkeeper.name} saves the penalty!`
            };
            teamStats.shotsOnTarget++;
            if (oppositionStats.saves !== undefined) {
                oppositionStats.saves++;
            }
        }
        else {
            result = {
                outcome: 'GOAL',
                message: `⚽ GOAL! ${state.shooter.name} scores from the spot!`
            };
            teamStats.shotsOnTarget++;
            if (state.shooter.isHome) {
                gameState.homeScore++;
            }
            else {
                gameState.awayScore++;
            }
            gameState.lastGoalScorer = state.shooter.isHome ? 'home' : 'away';
            gameState.goalEvents.push({
                time: Math.floor(gameState.timeElapsed),
                scorer: state.shooter.name,
                isHome: state.shooter.isHome,
                xG: PENALTY_XG
            });
        }
        gameState.commentary.push({
            text: `${Math.floor(gameState.timeElapsed)}' ${result.message}`,
            type: result.outcome === 'GOAL' ? 'goal' : 'save'
        });
        setTimeout(() => {
            this.reset();
            gameState.status = 'playing';
            if (result.outcome === 'GOAL') {
                if (typeof resetAfterGoal === 'function') {
                    resetAfterGoal();
                }
            }
            else {
                gameState.ballHolder = state.goalkeeper;
                state.goalkeeper.hasBallControl = true;
                state.goalkeeper.ballReceivedTime = Date.now();
            }
        }, 3000);
        return result;
    }
    reset() {
        this.state = null;
    }
}
export const penaltySystem = new PenaltySystem();
// ============================================================================
// V2 PLAYER UPDATE - Integrates All Systems
// ============================================================================
export function updatePlayerAI_V2(player, ball, allPlayers, gameState) {
    const now = Date.now();
    // Set piece lock guard
    if (player.lockUntil && now < player.lockUntil) {
        if (player.setPieceTarget && player.isKicker) {
            player.x = player.setPieceTarget.x;
            player.y = player.setPieceTarget.y;
            player.targetX = player.setPieceTarget.x;
            player.targetY = player.setPieceTarget.y;
            player.vx = 0;
            player.vy = 0;
            player.intent = "SET_PIECE_HOLD";
            return;
        }
        player.lockUntil = 0;
    }
    if (player.lockUntil && now >= player.lockUntil) {
        player.lockUntil = 0;
        player.setPieceTarget = null;
        player.isInWall = false;
        player.isDefCBLine = false;
        player.isMarker = false;
        player.isKicker = false;
    }
    // Let set-piece enhancement run first
    if (SetPieceIntegration?.updatePlayerAI_V2_SetPieceEnhancement) {
        if (SetPieceIntegration.updatePlayerAI_V2_SetPieceEnhancement(player, allPlayers, gameState)) {
            return;
        }
    }
    // Decision throttle
    const updateInterval = player.isChasingBall ? 50 : 200;
    if (now - (player.lastDecisionTime || 0) < updateInterval)
        return;
    player.lastDecisionTime = now;
    // Special-state handling
    const specialStateActive = ['PENALTY', 'KICK_OFF', 'FREE_KICK', 'CORNER_KICK', 'THROW_IN', 'GOAL_KICK']
        .includes(gameState.status);
    if (specialStateActive) {
        if (gameState.status === 'PENALTY' && penaltySystem.state) {
            penaltySystem.update(gameState);
            return;
        }
    }
    // Normal AI below
    const teammates = allPlayers.filter(p => p.isHome === player.isHome);
    const opponents = allPlayers.filter(p => p.isHome !== player.isHome);
    const spacingForce = spatialSystem.calculateSpacingForce(player, teammates);
    // ON-THE-BALL LOGIC
    if (gameState.ballHolder?.id === player.id && player.hasBallControl) {
        if (!canPlayerActOnBall(player)) {
            player.targetX = player.x;
            player.targetY = player.y;
            return;
        }
        const decision = actionDecision.decideBestAction(player, teammates, opponents, gameState);
        if (decision.action === 'SHOOT') {
            const target = decision.target;
            handleShotAttempt(player, target.x, allPlayers);
        }
        else if (decision.action === 'PASS') {
            initiatePass(player, decision.target);
        }
        else if (decision.action === 'DRIBBLE') {
            const target = decision.target;
            initiateDribble(player, target.x);
        }
        else {
            player.targetX = player.x;
            player.targetY = player.y;
        }
        return;
    }
    // OFF-THE-BALL LOGIC
    if (player.role === 'GK') {
        updateGoalkeeperAI_Advanced(player, ball, opponents);
        return;
    }
    if (!gameState.ballHolder && !gameState.ballTrajectory && player.isChasingBall) {
        player.targetX = ball.x;
        player.targetY = ball.y;
        player.speedBoost = 1.5;
        return;
    }
    const ballCarrier = gameState.ballHolder;
    // DEFENDING
    if (ballCarrier && distance(player, ballCarrier) < 50 && (!player.stunnedUntil || now > player.stunnedUntil)) {
        // IMPROVED: More realistic tackle conditions - check distance, angle, and timing
        const distToCarrier = distance(player, ballCarrier);
        const shouldAttemptTackle = distToCarrier < 25 && (!player.stunnedUntil || now > player.stunnedUntil);
        if (shouldAttemptTackle) {
            // Check if defender is approaching from good angle
            const dx = ballCarrier.x - player.x;
            const dy = ballCarrier.y - player.y;
            const approachAngle = Math.atan2(dy, dx);
            // Check ball carrier's movement direction
            const carrierVx = ballCarrier.vx || 0;
            const carrierVy = ballCarrier.vy || 0;
            const carrierAngle = Math.atan2(carrierVy, carrierVx);
            // Calculate angle difference (0 = head-on, PI = from behind)
            let angleDiff = Math.abs(approachAngle - carrierAngle);
            if (angleDiff > Math.PI)
                angleDiff = 2 * Math.PI - angleDiff;
            // Only tackle if approaching from front or side (not from behind)
            // Or if defender has much better defending stats
            const isGoodAngle = angleDiff < Math.PI * 0.75; // Within 135 degrees
            const hasDefendingAdvantage = player.defending > ballCarrier.dribbling + 15;
            if (isGoodAngle || hasDefendingAdvantage) {
                action_attemptTackle(player, allPlayers);
            }
        }
        else if (distToCarrier < 50) {
            const markingResult = applyMarkingAndPressing(player, ball, opponents, getPlayerActivePosition(player, gameState.currentHalf), getAttackingGoalX(!player.isHome, gameState.currentHalf), TACTICS[player.isHome ? gameState.homeTactic : gameState.awayTactic], player.isHome ? gameState.homeTeamState : gameState.awayTeamState);
            player.targetX = markingResult.x + spacingForce.x;
            player.targetY = markingResult.y + spacingForce.y;
            player.speedBoost = markingResult.shouldPress ? 1.3 : 1.1;
        }
        return;
    }
    // ATTACKING
    if (ballCarrier && ballCarrier.isHome === player.isHome) {
        const activePosition = getPlayerActivePosition(player, gameState.currentHalf);
        const opponentGoalX = getAttackingGoalX(player.isHome, gameState.currentHalf);
        const supportMove = selectBestAttackingMovement(player, ballCarrier, teammates, opponents, activePosition, opponentGoalX, gameState);
        if (supportMove.shouldLock) {
            const distToCurrentTarget = Math.sqrt(Math.pow(player.targetX - player.x, 2) +
                Math.pow(player.targetY - player.y, 2));
            if (player.targetLocked && now - player.targetLockTime < 2000 && distToCurrentTarget > 15) {
                return;
            }
            player.targetX = supportMove.x + spacingForce.x;
            player.targetY = supportMove.y + spacingForce.y;
            player.speedBoost = supportMove.speedBoost;
            player.targetLocked = true;
            player.targetLockTime = now;
        }
        else {
            player.targetX = supportMove.x + spacingForce.x;
            player.targetY = supportMove.y + spacingForce.y;
            player.speedBoost = supportMove.speedBoost;
        }
        return;
    }
    // NEUTRAL
    const activePos = getPlayerActivePosition(player, gameState.currentHalf);
    player.targetX = activePos.x + spacingForce.x;
    player.targetY = activePos.y + spacingForce.y;
    player.speedBoost = 1.0;
}
export function handleFoul_V2(fouler, fouled) {
    gameState.fouls++;
    gameState.ballHolder = null;
    gameState.ballTrajectory = null;
    console.log(`⚠️ FAUL: ${fouler.name} -> ${fouled.name}`);
    eventBus.publish(EVENT_TYPES.FOUL_COMMITTED, { fouler: fouler, fouled: fouled });
    const severity = Math.random();
    const alreadyBooked = gameState.yellowCards.some((card) => card.player === fouler.name);
    // Second yellow -> red
    if (alreadyBooked && severity > 0.80) {
        console.log(`🟥 İKİNCİ SARI KART! ${fouler.name} oyundan atıldı.`);
        removePlayerFromMatch(fouler);
        gameState.cardEvents.push({ player: fouler.name, time: Math.floor(gameState.timeElapsed), type: 'second_yellow' });
    }
    else if (severity > 0.85) {
        // Direct red
        if (severity > 0.97) {
            console.log(`🟥 DİREKT KIRMIZI KART! ${fouler.name} oyundan atıldı.`);
            removePlayerFromMatch(fouler);
            gameState.cardEvents.push({ player: fouler.name, time: Math.floor(gameState.timeElapsed), type: 'direct_red' });
        }
        else if (!alreadyBooked) {
            console.log(`🟨 SARI KART! ${fouler.name}`);
            gameState.cardEvents.push({ player: fouler.name, time: Math.floor(gameState.timeElapsed), type: 'yellow' });
        }
    }
    // Penalty check
    const penaltyCheck = tackleSystem.checkForPenalty({ fouler, fouled, severity: severity }, gameState);
    if (penaltyCheck.awarded) {
        console.log(`🎯 PENALTI! Faul: ${fouler.name}`);
        const attackingTeam = fouled.isHome ? gameState.homePlayers : gameState.awayPlayers;
        const defendingTeam = fouler.isHome ? gameState.homePlayers : gameState.awayPlayers;
        penaltySystem.initiate(attackingTeam, defendingTeam, gameState);
        return;
    }
    // Free kick
    handleFreeKick({ x: fouled.x, y: fouled.y }, fouler.isHome);
}
// ============================================================================
// SHOT STATE CLEANUP
// ============================================================================
export function cleanupShotState(gameState) {
    if (!gameState.ballTrajectory || gameState.ballHolder) {
        if (gameState.shotInProgress) {
            console.log(`Shot ended: ${gameState.shooter?.name || 'unknown'}`);
        }
        gameState.shotInProgress = false;
        gameState.shooter = null;
        gameState.currentShotXG = null;
    }
}
// ============================================================================
// DYNAMIC DEFENSIVE LINE
// ============================================================================
export function updateDefensiveLines(gameState) {
    const calculateDefensiveLine = (team) => {
        const players = team === 'home' ? gameState.homePlayers : gameState.awayPlayers;
        const defenders = players.filter(p => ['CB', 'RB', 'LB', 'CDM'].includes(p.role));
        if (defenders.length === 0)
            return team === 'home' ? 200 : 600;
        const mostBack = team === 'home' ?
            Math.max(...defenders.map(d => d.x)) :
            Math.min(...defenders.map(d => d.x));
        return mostBack;
    };
    gameState.homeDefensiveLine = calculateDefensiveLine('home');
    gameState.awayDefensiveLine = calculateDefensiveLine('away');
}
// ============================================================================
// PHYSICS TIMESTEP SCALING
// ============================================================================
export function getScaledTimestep() {
    const GAME_SPEED = GAME_CONFIG.GAME_SPEED || 1.0;
    const baseTimestep = 3 / 60;
    return baseTimestep / GAME_SPEED;
}
// ============================================================================
// PARTICLE CLEANUP
// ============================================================================
export function updateParticlesWithCleanup(gameState) {
    if (!gameState.particles || gameState.particles.length === 0)
        return;
    const now = Date.now();
    const PARTICLE_TIMEOUT = 5000;
    const VIEWPORT_MARGIN = 100;
    const MAX_PARTICLES = 150;
    gameState.particles = gameState.particles.filter(particle => {
        if (now - particle.createdAt > PARTICLE_TIMEOUT)
            return false;
        if (particle.x < -VIEWPORT_MARGIN || particle.x > 900)
            return false;
        if (particle.y < -VIEWPORT_MARGIN || particle.y > 700)
            return false;
        return true;
    });
    if (gameState.particles.length > MAX_PARTICLES) {
        gameState.particles = gameState.particles.slice(-MAX_PARTICLES);
        console.log(`⚠️ Particle count capped at ${MAX_PARTICLES} (performance protection)`);
    }
}
// ============================================================================
// MAIN GAME LOOP V2
// ============================================================================
let lastFrameTime = 0;
let physicsAccumulator = 0;
let gameTime = 0;
export function gameLoop_V2(timestamp) {
    if (!lastFrameTime)
        lastFrameTime = timestamp;
    if (!gameState.contexts || !gameState.contexts.game) {
        if (gameState.status !== 'finished') {
            requestAnimationFrame(gameLoop_V2);
        }
        return;
    }
    let dt = (timestamp - lastFrameTime) / 1000;
    lastFrameTime = timestamp;
    dt = Math.max(0, Math.min(dt, GAME_LOOP.MAX_FRAME_TIME));
    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    spatialSystem.buildGrid(allPlayers, 800, 600);
    if (gameState.status === 'playing' && !gameState.ballHolder?.hasBallControl && !gameState.ballTrajectory) {
        assignBallChasers(allPlayers);
    }
    const isGameActive = gameState.status === 'playing';
    const isSetPiece = isSetPieceStatus(gameState.status);
    const runPhysics = isGameActive || isSetPiece;
    if (runPhysics) {
        allPlayers.forEach(player => {
            updatePlayerAI_V2(player, gameState.ballPosition, allPlayers, gameState);
        });
    }
    if (isSetPiece) {
        if (SetPieceEnforcement?.updateSetPieceEnforcement) {
            SetPieceEnforcement.updateSetPieceEnforcement(gameState, allPlayers);
        }
        if (gameState.setPiece && gameState.setPiece.executionTime) {
            const timeUntilExecution = gameState.setPiece.executionTime - Date.now();
            if (timeUntilExecution <= 100 && !gameState.setPiece.executed) {
                if (SetPieceIntegration?.executeSetPiece_Router) {
                    SetPieceIntegration.executeSetPiece_Router(gameState);
                }
            }
        }
    }
    if (gameState.status === 'PENALTY' && penaltySystem.state) {
        penaltySystem.update(gameState);
    }
    if (runPhysics) {
        if (gameState.status === 'playing') {
            gameTime += dt;
            processPendingEvents(gameTime);
        }
        const scaledTimestep = getScaledTimestep();
        physicsAccumulator += dt;
        let steps = 0;
        const maxSteps = 5;
        while (physicsAccumulator >= scaledTimestep && steps < maxSteps) {
            updatePhysics(scaledTimestep);
            physicsAccumulator -= scaledTimestep;
            steps++;
        }
        if (steps >= maxSteps) {
            physicsAccumulator = 0;
        }
        cleanupShotState(gameState);
        updateDefensiveLines(gameState);
        updateParticlesWithCleanup(gameState);
    }
    // Possession tracking
    const holder = validateBallHolder(gameState.ballHolder);
    if (holder) {
        if (holder.isHome) {
            gameState.stats.home.possessionTime += dt;
        }
        else {
            gameState.stats.away.possessionTime += dt;
        }
    }
    const totalPossession = gameState.stats.home.possessionTime + gameState.stats.away.possessionTime;
    if (totalPossession > 0) {
        gameState.stats.home.possession = Math.round((gameState.stats.home.possessionTime / totalPossession) * 100);
        gameState.stats.away.possession = 100 - gameState.stats.home.possession;
    }
    renderGame();
    if (gameState.status !== 'finished') {
        requestAnimationFrame(gameLoop_V2);
    }
}
//# sourceMappingURL=core.js.map