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

import type { Player, GameState, Foul } from './types';
import { distance, pointToLineDistance } from './utils/math';
import { getPlayerActivePosition, applyMarkingAndPressing } from './ai';
import { updateGoalkeeperAI_Advanced } from './ai';
import { initiatePass, initiateDribble, passBall } from './ai';
import { action_attemptTackle } from './rules/ballControl';
import { assignBallChasers, validateBallHolder, updatePhysics } from './physics';
import { renderGame } from './rendering';
import { GAME_CONFIG, TACTICS } from './config';
import { gameState } from './globalExports';
import { EVENT_TYPES } from './types';
import { eventBus } from './eventBus';
import { getAttackingGoalX, calculateXG } from './utils/ui';

import { getVisibleTeammates } from './ai/playerVision';
import { selectBestAttackingMovement } from './ai/MovementPatterns';
import { canPlayerActOnBall } from './ai/playerFirstTouch';

// ============================================================================
// SPATIAL AWARENESS SYSTEM
// ============================================================================

class SpatialAwarenessSystem {
    private grid: Player[][][] | null = null;
    private cellSize: number = 50;

    buildGrid(allPlayers: Player[], width: number, height: number): void {
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

    getNearbyPlayers(player: Player, radius: number): Player[] {
        if (!this.grid || this.grid.length === 0) return [];

        const col = Math.floor(player.x / this.cellSize);
        const row = Math.floor(player.y / this.cellSize);
        const cellRadius = Math.ceil(radius / this.cellSize);

        const nearby: Player[] = [];

        for (let r = row - cellRadius; r <= row + cellRadius; r++) {
            for (let c = col - cellRadius; c <= col + cellRadius; c++) {
                if (this.grid && r >= 0 && r < this.grid.length && this.grid[0] && c >= 0 && c < this.grid[0].length) {
                    const row = this.grid[r];
                    if (row) {
                        const cell = row[c];
                        if (cell) {
                            nearby.push(...cell);
                        }
                    }
                }
            }
        }

        return nearby.filter(p => {
            if (p.id === player.id) return false;
            const dx = p.x - player.x;
            const dy = p.y - player.y;
            return Math.sqrt(dx * dx + dy * dy) < radius;
        });
    }

    calculateSpacingForce(player: Player, teammates: Player[]): { x: number; y: number } {
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
                const force = strength * 2.5;
                forceX += (dx / dist) * force;
                forceY += (dy / dist) * force;
            }
        });

        return { x: forceX, y: forceY };
    }
}

export const spatialSystem = new SpatialAwarenessSystem();

// ============================================================================
// ACTION DECISION SYSTEM
// ============================================================================

interface ActionDecision {
    action: 'SHOOT' | 'PASS' | 'DRIBBLE' | 'HOLD';
    target: Player | { x: number; y: number } | null;
}

class ActionDecisionSystem {
    decideBestAction(player: Player, teammates: Player[], opponents: Player[], gameState: GameState): ActionDecision {
        const goalX = getAttackingGoalX(player.isHome, gameState.currentHalf);

        // PRIORITY 1: SHOOT
        if (this.shouldShootNow(player, opponents, gameState)) {
            if ((window as any).DEBUG_AI) {
                console.log(`[AI] ${player.name}: SHOOT decision (goalX=${goalX})`);
            }
            return { action: 'SHOOT', target: { x: goalX, y: 300 } };
        }

        // PRIORITY 2: PASS
        const bestPass = this.findBestPassTarget(player, teammates, opponents, goalX);
        if (bestPass && bestPass.score > 60) {
            if ((window as any).DEBUG_AI) {
                console.log(`[AI] ${player.name}: PASS decision (score=${bestPass.score}, target=${bestPass.teammate.name})`);
            }
            return { action: 'PASS', target: bestPass.teammate };
        }

        // PRIORITY 3: DRIBBLE
        if (this.hasSpaceToDribble(player, opponents, goalX)) {
            if ((window as any).DEBUG_AI) {
                console.log(`[AI] ${player.name}: DRIBBLE decision (to goalX=${goalX})`);
            }
            return { action: 'DRIBBLE', target: { x: goalX, y: player.y } };
        }

        // DEFAULT:
        if (bestPass) {
            if ((window as any).DEBUG_AI) {
                console.log(`[AI] ${player.name}: PASS decision (fallback, score=${bestPass.score})`);
            }
            return { action: 'PASS', target: bestPass.teammate };
        }

        if ((window as any).DEBUG_AI) {
            console.log(`[AI] ${player.name}: HOLD decision (no viable options)`);
        }
        return { action: 'HOLD', target: null };
    }

    shouldShootNow(player: Player, opponents: Player[], gameState: GameState): boolean {
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
            if (distToGoal > 250) return false;

            const xG = calculateXG(player, goalX, player.y, opponents);

            // Validate xG result
            if (typeof xG !== 'number' || !isFinite(xG)) {
                console.warn(`Invalid xG calculation: ${xG}, defaulting to no shot`);
                return false;
            }

            return xG > 0.1;
        } catch (err) {
            console.error('shouldShootNow error:', err);
            return false;
        }
    }

    findBestPassTarget(player: Player, teammates: Player[], opponents: Player[], goalX: number): { teammate: Player; score: number } | null {
        const visibleTeammates = getVisibleTeammates(player, [...teammates, player]);

        let bestOption: { teammate: Player; score: number } | null = null;
        let bestScore = -1;

        visibleTeammates.forEach((teammate: Player) => {
            const distToTeammate = distance(player, teammate);
            if (distToTeammate < 30 || distToTeammate > 250) return;

            let score = 0;

            if (Math.sign(teammate.x - player.x) === Math.sign(goalX - player.x)) {
                score += 40;
            }

            const space = opponents.length > 0
                ? Math.min(...opponents.map(o => distance(teammate, o)))
                : 1000;
            score += Math.max(0, space - 20);

            const isBlocked = opponents.some(opp => pointToLineDistance(opp, player, teammate) < 20 && distance(player, opp) < distToTeammate);
            if (isBlocked) score = 0;

            if (score > bestScore) {
                bestScore = score;
                bestOption = { teammate, score };
            }
        });

        return bestOption;
    }

    hasSpaceToDribble(player: Player, opponents: Player[], goalX: number): boolean {
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
    shouldAttemptTackle(defender: Player, ballCarrier: Player, gameState: GameState): boolean {
        const dist = Math.sqrt(
            Math.pow(defender.x - ballCarrier.x, 2) +
            Math.pow(defender.y - ballCarrier.y, 2)
        );

        if (dist > 18) return false;

        const inPenaltyBox = this.isInPenaltyBox(defender, gameState);

        if (inPenaltyBox) {
            const defenderSkill = (defender.defending / 100);
            return Math.random() < (defenderSkill * 0.2);
        }

        const defenderSkill = (defender.defending / 100);
        return Math.random() < (defenderSkill * 0.6);
    }

    isInPenaltyBox(player: Player, gameState: GameState): boolean {
        const pitchWidth = GAME_CONFIG.PITCH_WIDTH;
        const boxWidth = 160;
        const boxHeight = 400;
        const centerY = 300;

        const attackingGoalX = getAttackingGoalX(!player.isHome, gameState.currentHalf);

        if (attackingGoalX < pitchWidth / 2) {
            return player.x < boxWidth &&
                player.y > (centerY - boxHeight / 2) &&
                player.y < (centerY + boxHeight / 2);
        } else {
            return player.x > (pitchWidth - boxWidth) &&
                player.y > (centerY - boxHeight / 2) &&
                player.y < (centerY + boxHeight / 2);
        }
    }

    checkForPenalty(foul: Foul, gameState: GameState): { awarded: boolean; attackingTeam?: string; defendingTeam?: string } {
        const fouledInBox = this.isInPenaltyBox(foul.fouled, gameState);

        if (!fouledInBox || foul.severity <= 0.5) {
            return { awarded: false };
        }

        const PITCH_WIDTH = GAME_CONFIG.PITCH_WIDTH;
        const boxWidth = 160;

        const inLeftBox = foul.fouled.x < boxWidth;
        const inRightBox = foul.fouled.x > (PITCH_WIDTH - boxWidth);

        const homeAttackingGoalX = getAttackingGoalX(true, gameState.currentHalf);

        let foulInHomeDefensiveBox: boolean, foulInAwayDefensiveBox: boolean;

        if (homeAttackingGoalX < PITCH_WIDTH / 2) {
            foulInHomeDefensiveBox = inRightBox;
            foulInAwayDefensiveBox = inLeftBox;
        } else {
            foulInHomeDefensiveBox = inLeftBox;
            foulInAwayDefensiveBox = inRightBox;
        }

        const fouledPlayerIsHome = foul.fouled.isHome;
        const foulerPlayerIsHome = foul.fouler.isHome;

        let penaltyAwarded = false;

        if (fouledPlayerIsHome && foulInAwayDefensiveBox) {
            penaltyAwarded = true;
        } else if (!fouledPlayerIsHome && foulInHomeDefensiveBox) {
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

// ============================================================================
// PENALTY KICK SYSTEM
// ============================================================================

interface PenaltyState {
    shooter: Player;
    goalkeeper: Player;
    goalX: number;
    penaltySpotX: number;
    spotY: number;
    phase: 'SETUP' | 'READY' | 'SHOOTING';
    startTime: number;
}

class PenaltySystem {
    state: PenaltyState | null = null;

    initiate(attackingTeam: Player[], defendingTeam: Player[], gameState: GameState): PenaltyState | null {
        const shooter = attackingTeam
            .filter(p => p.role !== 'GK')
            .sort((a, b) => b.shooting - a.shooting)[0];

        if (!shooter) return null;

        const goalkeeper = defendingTeam.find(p => p.role === 'GK');
        if (!goalkeeper) return null;

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

    update(gameState: GameState): { outcome: string; message: string } | null {
        if (!this.state) return null;

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

    positionPlayers(gameState: GameState): void {
        if (!this.state) return;
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

    executeShot(gameState: GameState): { outcome: string; message: string } | null {
        if (!this.state) return null;
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

        passBall(
            state.shooter,
            state.penaltySpotX,
            state.spotY,
            state.goalX,
            targetY,
            1.0,
            900,
            true
        );

        state.goalkeeper.targetY = gkDiveY;

        let result: { outcome: string; message: string };
        if (!onTarget) {
            result = {
                outcome: 'MISS',
                message: `❌ ${state.shooter.name} misses the target!`
            };
            teamStats.shotsOffTarget++;

        } else if (saved) {
            result = {
                outcome: 'SAVE',
                message: `🧤 ${state.goalkeeper.name} saves the penalty!`
            };
            teamStats.shotsOnTarget++;
            if (oppositionStats.saves !== undefined) {
                oppositionStats.saves++;
            }

        } else {
            result = {
                outcome: 'GOAL',
                message: `⚽ GOAL! ${state.shooter.name} scores from the spot!`
            };

            teamStats.shotsOnTarget++;

            if (state.shooter.isHome) {
                gameState.homeScore++;
            } else {
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

        const resetAfterGoal = (window as any).resetAfterGoal;

        setTimeout(() => {
            this.reset();
            gameState.status = 'playing';

            if (result.outcome === 'GOAL') {
                if (typeof resetAfterGoal === 'function') {
                    resetAfterGoal();
                }
            } else {
                gameState.ballHolder = state.goalkeeper;
                state.goalkeeper.hasBallControl = true;
                state.goalkeeper.ballReceivedTime = Date.now();
            }
        }, 3000);

        return result;
    }

    reset(): void {
        this.state = null;
    }
}

export const penaltySystem = new PenaltySystem();

// ============================================================================
// V2 PLAYER UPDATE - Integrates All Systems
// ============================================================================

export function updatePlayerAI_V2(player: Player, ball: { x: number; y: number }, allPlayers: Player[], gameState: GameState): void {
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
    const SetPieceIntegration = (window as any).SetPieceIntegration;
    if (SetPieceIntegration?.updatePlayerAI_V2_SetPieceEnhancement) {
        if (SetPieceIntegration.updatePlayerAI_V2_SetPieceEnhancement(player, ball, allPlayers, gameState)) {
            return;
        }
    }

    // Decision throttle
    const updateInterval = player.isChasingBall ? 50 : 200;
    if (now - (player.lastDecisionTime || 0) < updateInterval) return;
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
            const target = decision.target as { x: number; y: number };
            const handleShotAttempt = (window as any).handleShotAttempt;
            if (typeof handleShotAttempt === 'function') {
                handleShotAttempt(player, target.x, allPlayers);
            }
        } else if (decision.action === 'PASS') {
            initiatePass(player, decision.target as Player);
        } else if (decision.action === 'DRIBBLE') {
            const target = decision.target as { x: number; y: number };
            initiateDribble(player, target.x);
        } else {
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
    if (distance(player, ballCarrier) < 50 && (!player.stunnedUntil || now > player.stunnedUntil)) {
        if (distance(player, ballCarrier) < 35 && (!player.stunnedUntil || now > player.stunnedUntil)) {
            action_attemptTackle(player, allPlayers);
        } else {
            const markingResult = applyMarkingAndPressing(
                player,
                ball,
                opponents,
                getPlayerActivePosition(player, gameState.currentHalf),
                getAttackingGoalX(!player.isHome, gameState.currentHalf),
                TACTICS[player.isHome ? gameState.homeTactic : gameState.awayTactic],
                player.isHome ? gameState.homeTeamState : gameState.awayTeamState
            );
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
        const supportMove = selectBestAttackingMovement(
            player, ballCarrier, teammates, opponents, activePosition, opponentGoalX, gameState
        );

        if (supportMove.shouldLock) {
            const distToCurrentTarget = Math.sqrt(
                Math.pow(player.targetX - player.x, 2) +
                Math.pow(player.targetY - player.y, 2)
            );

            if (player.targetLocked && now - player.targetLockTime < 2000 && distToCurrentTarget > 15) {
                return;
            }

            player.targetX = supportMove.x + spacingForce.x;
            player.targetY = supportMove.y + spacingForce.y;
            player.speedBoost = supportMove.speedBoost;
            player.targetLocked = true;
            player.targetLockTime = now;
        } else {
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

export function handleFoul_V2(fouler: Player, fouled: Player): void {
    gameState.fouls++;
    gameState.ballHolder = null;
    gameState.ballTrajectory = null;

    console.log(`⚠️ FAUL: ${fouler.name} -> ${fouled.name}`);

    eventBus.publish(EVENT_TYPES.FOUL_COMMITTED, { fouler: fouler, fouled: fouled });

    const severity = Math.random();
    const alreadyBooked = gameState.yellowCards.some((card: any) => card.player === fouler.name);

    // Second yellow -> red
    if (alreadyBooked && severity > 0.80) {
        console.log(`🟥 İKİNCİ SARI KART! ${fouler.name} oyundan atıldı.`);
        const removePlayerFromMatch = (window as any).removePlayerFromMatch;
        if (typeof removePlayerFromMatch === 'function') {
            removePlayerFromMatch(fouler);
        }
        gameState.cardEvents.push({ player: fouler.name, time: Math.floor(gameState.timeElapsed), type: 'second_yellow' });

    } else if (severity > 0.85) {
        // Direct red
        if (severity > 0.97) {
            console.log(`🟥 DİREKT KIRMIZI KART! ${fouler.name} oyundan atıldı.`);
            const removePlayerFromMatch = (window as any).removePlayerFromMatch;
            if (typeof removePlayerFromMatch === 'function') {
                removePlayerFromMatch(fouler);
            }
            gameState.cardEvents.push({ player: fouler.name, time: Math.floor(gameState.timeElapsed), type: 'direct_red' });

        } else if (!alreadyBooked) {
            console.log(`🟨 SARI KART! ${fouler.name}`);
            gameState.cardEvents.push({ player: fouler.name, time: Math.floor(gameState.timeElapsed), type: 'yellow' });
        }
    }

    // Penalty check
    const penaltyCheck = tackleSystem.checkForPenalty(
        { fouler, fouled, severity: severity },
        gameState
    );

    if (penaltyCheck.awarded) {
        console.log(`🎯 PENALTI! Faul: ${fouler.name}`);
        const attackingTeam = fouled.isHome ? gameState.homePlayers : gameState.awayPlayers;
        const defendingTeam = fouler.isHome ? gameState.homePlayers : gameState.awayPlayers;

        penaltySystem.initiate(attackingTeam, defendingTeam, gameState);
        return;
    }

    // Free kick
    const handleFreeKick = (window as any).handleFreeKick;
    if (typeof handleFreeKick === 'function') {
        handleFreeKick({ x: fouled.x, y: fouled.y }, fouler.isHome);
    } else {
        console.error("handleFoul_V2 -> handleFreeKick is not defined!");
    }
}

// ============================================================================
// SHOT STATE CLEANUP
// ============================================================================

export function cleanupShotState(gameState: GameState): void {
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

export function updateDefensiveLines(gameState: GameState): void {
    const calculateDefensiveLine = (team: 'home' | 'away') => {
        const players = team === 'home' ? gameState.homePlayers : gameState.awayPlayers;
        const defenders = players.filter(p => ['CB', 'RB', 'LB', 'CDM'].includes(p.role));

        if (defenders.length === 0) return team === 'home' ? 200 : 600;

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

export function getScaledTimestep(): number {
    const GAME_SPEED = GAME_CONFIG.GAME_SPEED || 1.0;
    const baseTimestep = 3/60;
    return baseTimestep / GAME_SPEED;
}

// ============================================================================
// PARTICLE CLEANUP
// ============================================================================

export function updateParticlesWithCleanup(gameState: GameState): void {
    if (!gameState.particles || gameState.particles.length === 0) return;

    const now = Date.now();
    const PARTICLE_TIMEOUT = 5000;
    const VIEWPORT_MARGIN = 100;
    const MAX_PARTICLES = 150;

    gameState.particles = gameState.particles.filter(particle => {
        if (now - particle.createdAt > PARTICLE_TIMEOUT) return false;
        if (particle.x < -VIEWPORT_MARGIN || particle.x > 900) return false;
        if (particle.y < -VIEWPORT_MARGIN || particle.y > 700) return false;
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

export function gameLoop_V2(timestamp: number): void {
    if (!lastFrameTime) lastFrameTime = timestamp;
    if (!gameState.contexts || !gameState.contexts.game) {
        if (gameState.status !== 'finished') {
            requestAnimationFrame(gameLoop_V2);
        }
        return;
    }

    const GAME_LOOP_DEFAULT = { MAX_FRAME_TIME: 0.05, GAME_SPEED: 1, FIXED_TIMESTEP: 0.01666 };
    const GAME_LOOP = (window as any).GAME_LOOP || GAME_LOOP_DEFAULT;
    let dt = (timestamp - lastFrameTime) / 1000;
    lastFrameTime = timestamp;
    dt = Math.max(0, Math.min(dt, GAME_LOOP.MAX_FRAME_TIME));

    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    spatialSystem.buildGrid(allPlayers, 800, 600);

    if (gameState.status === 'playing' && !gameState.ballHolder?.hasBallControl && !gameState.ballTrajectory) {
        assignBallChasers(allPlayers);
    }

    const isGameActive = gameState.status === 'playing';
    const isSetPieceStatus = (window as any).isSetPieceStatus;
    const isSetPiece = (typeof isSetPieceStatus === 'function')
        ? isSetPieceStatus(gameState.status)
        : ['GOAL_KICK', 'CORNER_KICK', 'THROW_IN', 'FREE_KICK', 'PENALTY', 'KICK_OFF'].includes(gameState.status);
    const runPhysics = isGameActive || isSetPiece;

    if (runPhysics) {
        allPlayers.forEach(player => {
            updatePlayerAI_V2(player, gameState.ballPosition, allPlayers, gameState);
        });
    }

    if (isSetPiece) {
        const SetPieceEnforcement = (window as any).SetPieceEnforcement;
        if (SetPieceEnforcement?.updateSetPieceEnforcement) {
            SetPieceEnforcement.updateSetPieceEnforcement(gameState, allPlayers);
        }

        if (gameState.setPiece && gameState.setPiece.executionTime) {
            const timeUntilExecution = gameState.setPiece.executionTime - Date.now();

            if (timeUntilExecution <= 100 && !gameState.setPiece.executed) {
                const SetPieceIntegration = (window as any).SetPieceIntegration;
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
            const processPendingEvents = (window as any).processPendingEvents;
            if (typeof processPendingEvents === 'function') {
                processPendingEvents(gameTime);
            }
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
        } else {
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

// ============================================================================
// BROWSER EXPORTS
// ============================================================================

if (typeof window !== 'undefined') {
    (window as any).spatialSystem = spatialSystem;
    (window as any).actionDecision = actionDecision;
    (window as any).tackleSystem = tackleSystem;
    (window as any).penaltySystem = penaltySystem;
    (window as any).updatePlayerAI_V2 = updatePlayerAI_V2;
    (window as any).handleFoul_V2 = handleFoul_V2;
    (window as any).gameLoop_V2 = gameLoop_V2;
    (window as any).cleanupShotState = cleanupShotState;
    (window as any).updateDefensiveLines = updateDefensiveLines;
    (window as any).getScaledTimestep = getScaledTimestep;
    (window as any).updateParticlesWithCleanup = updateParticlesWithCleanup;

    console.log('✅ V2 UNIFIED CORE LOADED (TypeScript)');
}
