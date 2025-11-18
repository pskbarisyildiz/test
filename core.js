// ============================================================================
// ✅ FIX #17: SEPARATION OF CONCERNS - Module Responsibility Boundaries
// ============================================================================
// THIS MODULE (core.js) IS RESPONSIBLE FOR:
// 1. Ball physics simulation and trajectory updates
// 2. Possession changes based on ballHolder
// 3. Game loop orchestration and timing
// 4. Calling updatePlayerAI_V2 for each player
// 5. Goal detection and score updates
// 6. Match state management (time, status)
// 7. Rendering and visual updates
//
// PLAYERAI MODULE IS RESPONSIBLE FOR:
// 1. Player movement decisions (x, y, vx, vy)
// 2. Action selection (pass, shoot, dribble, move)
// 3. Setting ballHolder (possession)
// 4. Creating ballTrajectory for passes/shots
// 5. All tactical AI decisions
//
// CONSTRAINT: playerAI MUST NOT call functions from core.js
// This prevents circular dependencies and ensures clean module boundaries.
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

            if (row >= 0 && row < rows && col >= 0 && col < cols) {
                this.grid[row][col].push(player);
            }
        });
    }

    getNearbyPlayers(player, radius) {
        if (!this.grid) return [];

        const col = Math.floor(player.x / this.cellSize);
        const row = Math.floor(player.y / this.cellSize);
        const cellRadius = Math.ceil(radius / this.cellSize);

        const nearby = [];

        for (let r = row - cellRadius; r <= row + cellRadius; r++) {
            for (let c = col - cellRadius; c <= col + cellRadius; c++) {
                if (r >= 0 && r < this.grid.length && c >= 0 && c < this.grid[0].length) {
                    nearby.push(...this.grid[r][c]);
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
                const force = strength * 2.5;
                forceX += (dx / dist) * force;
                forceY += (dy / dist) * force;
            }
        });

        return { x: forceX, y: forceY };
    }
}

const spatialSystem = new SpatialAwarenessSystem();

class ActionDecisionSystem {
    decideBestAction(player, teammates, opponents, gameState) {
        const goalX = getAttackingGoalX(player.isHome, gameState.currentHalf);

        // PRIORITY 1: SHOOT
        if (this.shouldShootNow(player, opponents, gameState)) {
            if (window.DEBUG_AI) {
                console.log(`[AI] ${player.name}: SHOOT decision (goalX=${goalX})`);
            }
            return { action: 'SHOOT', target: { x: goalX, y: 300 } };
        }

        // PRIORITY 2: PASS
        const bestPass = this.findBestPassTarget(player, teammates, opponents, goalX);
        if (bestPass && bestPass.score > 60) {
            if (window.DEBUG_AI) {
                console.log(`[AI] ${player.name}: PASS decision (score=${bestPass.score}, target=${bestPass.teammate.name})`);
            }
            return { action: 'PASS', target: bestPass.teammate };
        }

        // PRIORITY 3: DRIBBLE
        if (this.hasSpaceToDribble(player, opponents, goalX)) {
            if (window.DEBUG_AI) {
                console.log(`[AI] ${player.name}: DRIBBLE decision (to goalX=${goalX})`);
            }
            return { action: 'DRIBBLE', target: { x: goalX, y: player.y } };
        }

        // DEFAULT:
        if (bestPass) {
            if (window.DEBUG_AI) {
                console.log(`[AI] ${player.name}: PASS decision (fallback, score=${bestPass.score})`);
            }
            return { action: 'PASS', target: bestPass.teammate };
        }

        if (window.DEBUG_AI) {
            console.log(`[AI] ${player.name}: HOLD decision (no viable options)`);
        }
        return { action: 'HOLD', target: null };
    }

    shouldShootNow(player, opponents, gameState) {
        try {
            // ✅ FIX: Prevent shooting immediately after kick-off
            // Allow 4-5 seconds for players to settle into play
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

            // ✅ FIX #18: Validate goalX calculation
            if (typeof goalX !== 'number' || !isFinite(goalX)) {
                console.warn(`Invalid goalX in shouldShootNow: ${goalX}`);
                return false;
            }

            const distToGoal = Math.abs(player.x - goalX);
            if (distToGoal > 250) return false;

            const xG = calculateXG(player, goalX, player.y, opponents);

            // ✅ FIX #18: Validate xG result
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

    findBestPassTarget(player, teammates, opponents, goalX) {
        // DÜZELTME: getVisibleTeammates global olmalı (playerAI.js'den)
        const visibleTeammates = (typeof getVisibleTeammates === 'function') ? 
            getVisibleTeammates(player, [...teammates, player]) : 
            teammates.filter(t => t.id !== player.id); // Fallback

        let bestOption = null;
        let bestScore = -1;

        visibleTeammates.forEach(teammate => {
            const distToTeammate = getDistance(player, teammate);
            if (distToTeammate < 30 || distToTeammate > 250) return;

            let score = 0;

            if (Math.sign(teammate.x - player.x) === Math.sign(goalX - player.x)) {
                score += 40;
            }

            const space = opponents.length > 0
                ? Math.min(...opponents.map(o => getDistance(teammate, o)))
                : 1000; // No opponents = lots of space
            score += Math.max(0, space - 20);

            const isBlocked = opponents.some(opp => pointToLineDistance(opp, player, teammate) < 20 && getDistance(player, opp) < distToTeammate);
            if (isBlocked) score = 0;

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
            ? Math.min(...opponents.map(o => getDistance(dribbleCheckPos, o)))
            : 1000; // No opponents = lots of space
        return spaceAhead > 40;
    }
}

const actionDecision = new ActionDecisionSystem();

class SmartTackleSystem {
    shouldAttemptTackle(defender, ballCarrier, gameState) {
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

    isInPenaltyBox(player, gameState) {
        // DÜZELTME: GAME_CONFIG global olmalı
        const PITCH_WIDTH = (typeof GAME_CONFIG !== 'undefined') ? GAME_CONFIG.PITCH_WIDTH : 800;
        const pitchWidth = PITCH_WIDTH;
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

    checkForPenalty(foul, gameState) {
        // [penalty-fix] Check if fouled player is in the FOULER'S defensive box
        // A penalty should only be awarded if the foul happens in the defending team's box
        const fouledInBox = this.isInPenaltyBox(foul.fouled, gameState);

        if (!fouledInBox || foul.severity <= 0.5) {
            return { awarded: false };
        }

        // Determine which penalty box the fouled player is in
        const PITCH_WIDTH = (typeof GAME_CONFIG !== 'undefined') ? GAME_CONFIG.PITCH_WIDTH : 800;
        const boxWidth = 160;

        // Check if fouled player is in left box or right box
        const inLeftBox = foul.fouled.x < boxWidth;
        const inRightBox = foul.fouled.x > (PITCH_WIDTH - boxWidth);

        // Get the attacking goals for each team
        const homeAttackingGoalX = getAttackingGoalX(true, gameState.currentHalf);
        const awayAttackingGoalX = getAttackingGoalX(false, gameState.currentHalf);

        // Determine which box corresponds to which team's defensive box
        // If home attacks left, then left box is away's defensive box
        // If home attacks right, then right box is away's defensive box
        let foulInHomeDefensiveBox, foulInAwayDefensiveBox;

        if (homeAttackingGoalX < PITCH_WIDTH / 2) {
            // Home attacks left, so right box is home's defensive box
            foulInHomeDefensiveBox = inRightBox;
            foulInAwayDefensiveBox = inLeftBox;
        } else {
            // Home attacks right, so left box is home's defensive box
            foulInHomeDefensiveBox = inLeftBox;
            foulInAwayDefensiveBox = inRightBox;
        }

        // [penalty-fix] Only award penalty if foul is in the FOULER'S defensive box
        // i.e., the fouled player must be attacking in the opponent's box
        const fouledPlayerIsHome = foul.fouled.isHome;
        const foulerPlayerIsHome = foul.fouler.isHome;

        // If fouled player is home and foul is in away's defensive box -> penalty to home
        // If fouled player is away and foul is in home's defensive box -> penalty to away
        let penaltyAwarded = false;

        if (fouledPlayerIsHome && foulInAwayDefensiveBox) {
            penaltyAwarded = true; // Home player fouled in away's box -> penalty to home
        } else if (!fouledPlayerIsHome && foulInHomeDefensiveBox) {
            penaltyAwarded = true; // Away player fouled in home's box -> penalty to away
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

const tackleSystem = new SmartTackleSystem();

// ============================================================================
// PENALTY KICK SYSTEM - Complete Implementation
// ============================================================================

class PenaltySystem {
    constructor() {
        this.state = null;
    }

    initiate(attackingTeam, defendingTeam, gameState) {
        // Select penalty taker (highest shooting)
        const shooter = attackingTeam
            .filter(p => p.role !== 'GK')
            .sort((a, b) => b.shooting - a.shooting)[0];

        const goalkeeper = defendingTeam.find(p => p.role === 'GK');

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

    positionPlayers(gameState) {
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
            if (p.id !== this.state.shooter.id && p.id !== this.state.goalkeeper.id) {
                if (tackleSystem.isInPenaltyBox(p, gameState)) {
                    p.x = 400; // Move to center circle
                    p.targetX = 400;
                }
            }
        });
    }

    executeShot(gameState) {
        const shooterSkill = this.state.shooter.shooting / 100;
        const gkSkill = this.state.goalkeeper.goalkeeping / 100;
        
        // --- STATS SETUP ---
        const teamStats = this.state.shooter.isHome ? gameState.stats.home : gameState.stats.away;
        const oppositionStats = this.state.shooter.isHome ? gameState.stats.away : gameState.stats.home;
        const PENALTY_XG = 0.76; // Standard xG value for a penalty kick
        
        // Add penalty xG to the team's total
        teamStats.xGTotal += PENALTY_XG;
        // -----------------

        // Shooter picks corner
        const corners = [
            { y_offset: -40, name: 'top' },
            { y_offset: 40, name: 'bottom' },
            { y_offset: -20, name: 'mid-top' },
            { y_offset: 20, name: 'mid-bottom' }
        ];

        const targetCorner = corners[Math.floor(Math.random() * corners.length)];
        const targetY = this.state.spotY + targetCorner.y_offset;

        // GK dives
        const gkDiveY = this.state.spotY + (Math.random() < 0.5 ? -40 : 40);

        // Calculate outcome
        const accuracy = shooterSkill + (Math.random() * 0.3 - 0.15);
        const onTarget = accuracy > 0.4;
        const correctDive = Math.abs(targetY - gkDiveY) < 50;
        const saved = onTarget && correctDive && (gkSkill + Math.random() * 0.3) > 0.7;

        // Animate shot
        passBall(
            this.state.shooter,
            this.state.penaltySpotX,
            this.state.spotY,
            this.state.goalX,
            targetY,
            1.0,
            900,
            true
        );

        // Animate GK dive
        this.state.goalkeeper.targetY = gkDiveY;

        let result;
        if (!onTarget) {
            result = {
                outcome: 'MISS',
                message: `❌ ${this.state.shooter.name} misses the target!`
            };
            // --- STATS UPDATE ---
            teamStats.shotsOffTarget++;
            
        } else if (saved) {
            result = {
                outcome: 'SAVE',
                message: `🧤 ${this.state.goalkeeper.name} saves the penalty!`
            };
            // --- STATS UPDATE ---
            teamStats.shotsOnTarget++;
            oppositionStats.saves++; // Credit the goalkeeper
            
            // createSaveEffect(this.state.goalX, targetY);
        } else {
            result = {
                outcome: 'GOAL',
                message: `⚽ GOAL! ${this.state.shooter.name} scores from the spot!`
            };

            // --- STATS UPDATE ---
            teamStats.shotsOnTarget++;
            
            // Award goal
            if (this.state.shooter.isHome) {
                gameState.homeScore++;
            } else {
                gameState.awayScore++;
            }

            gameState.lastGoalScorer = this.state.shooter.isHome ? 'home' : 'away';
            
            // --- ADD TO MATCH SUMMARY ---
            gameState.goalEvents.push({
                time: Math.floor(gameState.timeElapsed),
                scorer: this.state.shooter.name,
                isHome: this.state.shooter.isHome,
                xG: PENALTY_XG
            });
            
            // createGoalExplosion(this.state.goalX, targetY, this.state.shooter.isHome ? gameState.homeJerseyColor : gameState.awayJerseyColor);
        }

        gameState.commentary.push({
            text: `${Math.floor(gameState.timeElapsed)}' ${result.message}`,
            type: result.outcome === 'GOAL' ? 'goal' : 'save'
        });

        // Reset after delay
        setTimeout(() => {
            this.reset();
            gameState.status = 'playing';

            if (result.outcome === 'GOAL') {
                resetAfterGoal();
            } else {
                // GK has ball after save/miss
                gameState.ballHolder = this.state.goalkeeper;
                this.state.goalkeeper.hasBallControl = true;
                this.state.goalkeeper.ballReceivedTime = Date.now();
            }
        }, 3000);

        return result;
    }

    reset() {
        this.state = null;
    }
}

const penaltySystem = new PenaltySystem();

// ============================================================================
// V2 PLAYER UPDATE - Integrates All Systems
// ============================================================================

function updatePlayerAI_V2(player, ball, allPlayers, gameState) {
    const now = Date.now();

    // 0) --- SET PIECE LOCK GUARD (IMPROVED - Minimal locking) ---
    // Only lock kickers right before execution for precision
    if (player.lockUntil && now < player.lockUntil) {
        if (player.setPieceTarget && player.isKicker) {
            // Only lock kickers - everyone else moves smoothly
            player.x = player.setPieceTarget.x;
            player.y = player.setPieceTarget.y;
            player.targetX = player.setPieceTarget.x;
            player.targetY = player.setPieceTarget.y;
            player.vx = 0;
            player.vy = 0;
            player.intent = "SET_PIECE_HOLD";
            return; // block normal AI while locked
        }
        // Non-kickers: clear lock and let them move naturally
        player.lockUntil = 0;
    }

    // clean-up flags once lock expires
    if (player.lockUntil && now >= player.lockUntil) {
        player.lockUntil = 0;
        player.setPieceTarget = null;
        player.isInWall = false;
        player.isDefCBLine = false;
        player.isMarker = false;
        player.isKicker = false;
    }

    // 1) Let set-piece enhancement run first; if it handles this player, stop here
    if (typeof SetPieceIntegration !== 'undefined' &&
        typeof SetPieceIntegration.updatePlayerAI_V2_SetPieceEnhancement === 'function') {
        if (SetPieceIntegration.updatePlayerAI_V2_SetPieceEnhancement(player, ball, allPlayers, gameState)) {
            return; // enhancement fully handled this tick for this player
        }
    }

    // 2) Decision throttle (unchanged)
    const updateInterval = player.isChasingBall ? 50 : 200;
    if (now - (player.lastDecisionTime || 0) < updateInterval) return;
    player.lastDecisionTime = now;

    // 3) Special-state handling (FREE_KICK, etc.)
    //    DO NOT blanket-return; HOLD if we have a set-piece target, otherwise idle.
    const specialStateActive = ['PENALTY', 'KICK_OFF', 'FREE_KICK', 'CORNER_KICK', 'THROW_IN', 'GOAL_KICK']
        .includes(gameState.status);

    if (specialStateActive) {
        if (gameState.status === 'PENALTY' && typeof penaltySystem !== 'undefined' && penaltySystem.state) {
            penaltySystem.update(gameState);
            return; // Penalty system handles its own AI
        }

        // CRITICAL FIX: Don't teleport or block AI during set pieces
        // Let SetPieceIntegration.updatePlayerAI_V2_SetPieceEnhancement handle smooth positioning
        // It was called earlier (line 514) and returns true if it handled the player
        // If we reach here, the enhancement didn't block, so continue with normal flow
    }

    // ---------------- NORMAL AI BELOW ----------------

    const teammates = allPlayers.filter(p => p.isHome === player.isHome);
    const opponents = allPlayers.filter(p => p.isHome !== player.isHome);
    const spacingForce = spatialSystem.calculateSpacingForce(player, teammates);

    // 1. ON-THE-BALL LOGIC
    if (gameState.ballHolder?.id === player.id && player.hasBallControl) {
        if (typeof canPlayerActOnBall !== 'undefined' && !canPlayerActOnBall(player)) {
            player.targetX = player.x;
            player.targetY = player.y;
            return;
        }
        const decision = actionDecision.decideBestAction(player, teammates, opponents, gameState);

        if (decision.action === 'SHOOT' && typeof handleShotAttempt === 'function') {
             handleShotAttempt(player, decision.target.x, allPlayers);
        } else if (decision.action === 'PASS' && typeof initiatePass === 'function') {
             initiatePass(player, decision.target);
        } else if (decision.action === 'DRIBBLE' && typeof initiateDribble === 'function') {
             initiateDribble(player, decision.target.x);
        } else {
            player.targetX = player.x;
            player.targetY = player.y;
        }
        return;
    }

    // 2. OFF-THE-BALL LOGIC
    if (player.role === 'GK') {
        if (typeof updateGoalkeeperAI_Advanced === 'function') {
            updateGoalkeeperAI_Advanced(player, ball, opponents);
        }
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
    if (ballCarrier && ballCarrier.isHome !== player.isHome) {
        if (getDistance(player, ballCarrier) < 35 && (!player.stunnedUntil || now > player.stunnedUntil)) {
            if (typeof action_attemptTackle === 'function') {
                action_attemptTackle(player, ball, allPlayers);
            }
        } else {
            if (typeof applyMarkingAndPressing === 'function' && typeof TACTICS !== 'undefined') {
                const markingResult = applyMarkingAndPressing(
                    player,
                    ball,
                    opponents,
                    getPlayerActivePosition(player, gameState.currentHalf),
                    getAttackingGoalX(!player.isHome, gameState.currentHalf),
                    TACTICS[player.isHome ? gameState.homeTactic : gameState.awayTactic],
                    player.isHome ? gameState.homeTeamState : gameState.awayTqdmState
                );
                player.targetX = markingResult.x + spacingForce.x;
                player.targetY = markingResult.y + spacingForce.y;
                player.speedBoost = markingResult.shouldPress ? 1.3 : 1.1;
            }
        }
        return;
    }

    // ATTACKING
    if (ballCarrier && ballCarrier.isHome === player.isHome) {
        if (typeof selectBestAttackingMovement === 'function') {
            const activePosition = getPlayerActivePosition(player, gameState.currentHalf);
            const opponentGoalX = getAttackingGoalX(player.isHome, gameState.currentHalf);
            const supportMove = selectBestAttackingMovement(
                player, ballCarrier, teammates, opponents, activePosition, opponentGoalX, gameState
            );

            // ✅ FIX: Implement shouldLock to prevent forward player oscillation
            // Only update target if not locked or lock has expired
            if (supportMove.shouldLock) {
                const distToCurrentTarget = Math.sqrt(
                    Math.pow(player.targetX - player.x, 2) +
                    Math.pow(player.targetY - player.y, 2)
                );

                // If player is already moving to a locked target and is making progress, don't change target
                if (player.targetLocked && now - player.targetLockTime < 2000 && distToCurrentTarget > 15) {
                    // Keep current target, don't recalculate
                    return;
                }

                // Set new target and lock it
                player.targetX = supportMove.x + spacingForce.x;
                player.targetY = supportMove.y + spacingForce.y;
                player.speedBoost = supportMove.speedBoost;
                player.targetLocked = true;
                player.targetLockTime = now;
            } else {
                // Not a locked target, update normally
                player.targetX = supportMove.x + spacingForce.x;
                player.targetY = supportMove.y + spacingForce.y;
                player.speedBoost = supportMove.speedBoost;
            }
        }
        return;
    }

    // NEUTRAL
    const activePos = getPlayerActivePosition(player, gameState.currentHalf);
    player.targetX = activePos.x + spacingForce.x;
    player.targetY = activePos.y + spacingForce.y;
    player.speedBoost = 1.0;
}
function handleFoul_V2(fouler, fouled) {
    // 1. OYUNU DURDUR VE FAULÜ KAYDET
    gameState.fouls++;
    gameState.ballHolder = null;
    gameState.ballTrajectory = null;

    console.log(`⚠️ FAUL: ${fouler.name} -> ${fouled.name}`);
    
    // DÜZELTME: eventBus global olmalı (main.js'den alındı)
    if (typeof eventBus !== 'undefined' && typeof EVENT_TYPES !== 'undefined') {
        eventBus.publish(EVENT_TYPES.FOUL_COMMITTED, { fouler: fouler, fouled: fouled });
    }

    // 2. KART MANTIĞINI ÇALIŞTIR (main.js'den taşındı)
    const severity = Math.random(); // Faulün ciddiyeti
    const alreadyBooked = gameState.yellowCards.some(card => card.player === fouler.name);
    let cardIssued = 'none'; // 'yellow', 'red'

    // 2a. İKİNCİ SARI KART -> Kırmızı
    if (alreadyBooked && severity > 0.80) { // %80 üzeri ciddiyet (Yüksek eşik)
        console.log(`🟥 İKİNCİ SARI KART! ${fouler.name} oyundan atıldı.`);
        // DÜZELTME: removePlayerFromMatch global olmalı (main.js'den)
        if (typeof removePlayerFromMatch === 'function') {
            removePlayerFromMatch(fouler);
        }
        gameState.redCards.push({ player: fouler.name, time: Math.floor(gameState.timeElapsed), type: 'second_yellow' });
        cardIssued = 'red';
    
    // 2b. CİDDİ FAUL (Sarı veya Kırmızı)
    } else if (severity > 0.85) { // %85 üzeri ciddiyet
        
        // 2c. DİREKT KIRMIZI KART
        if (severity > 0.97) { // %97 üzeri ciddiyet (Çok nadir)
            console.log(`🟥 DİREKT KIRMIZI KART! ${fouler.name} oyundan atıldı.`);
            // DÜZELTME: removePlayerFromMatch global olmalı (main.js'den)
            if (typeof removePlayerFromMatch === 'function') {
                removePlayerFromMatch(fouler);
            }
            gameState.redCards.push({ player: fouler.name, time: Math.floor(gameState.timeElapsed), type: 'direct_red' });
            cardIssued = 'red';
        
        // 2d. SARI KART (Eğer zaten kartı yoksa)
        } else if (!alreadyBooked) {
            console.log(`🟨 SARI KART! ${fouler.name}`);
            gameState.yellowCards.push({ player: fouler.name, time: Math.floor(gameState.timeElapsed) });
            cardIssued = 'yellow';
        }
    }

    // 3. PENALTI KONTROLÜ (Kart verildikten *sonra*)
    const penaltyCheck = tackleSystem.checkForPenalty(
        { fouler, fouled, severity: severity }, // Ciddiyeti penaltı sistemine de yolla
        gameState
    );

    if (penaltyCheck.awarded) {
        console.log(`🎯 PENALTI! Faul: ${fouler.name}`);
        const attackingTeam = fouled.isHome ? gameState.homePlayers : gameState.awayPlayers;
        const defendingTeam = fouler.isHome ? gameState.homePlayers : gameState.awayPlayers;

        if (typeof penaltySystem !== 'undefined') {
            penaltySystem.initiate(attackingTeam, defendingTeam, gameState);
        }
        // Penaltı başlatıldı, fonksiyondan çık
        return; 
    }

    // 4. SERBEST VURUŞ KONTROLÜ (Penaltı değilse)
    // Faulü yapan takımın TERSİNE serbest vuruş ver
    // DÜZELTME: handleFreeKick global olmalı (main.js'den)
    if (typeof handleFreeKick === 'function') {
        handleFreeKick({ x: fouled.x, y: fouled.y }, fouler.isHome);
    } else {
        console.error("handleFoul_V2 -> handleFreeKick is not defined!");
    }
}

// ============================================================================
// ✅ FIX #13: SHOT STATE CLEANUP
// ============================================================================
function cleanupShotState(gameState) {
    // Clear shot if: goal scored, ball intercepted, out of bounds
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
// ✅ FIX #14: DYNAMIC DEFENSIVE LINE
// ============================================================================
function updateDefensiveLines(gameState) {
    const calculateDefensiveLine = (team) => {
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
// ✅ FIX #7: PHYSICS TIMESTEP SCALING (GAME SPEED AWARE)
// ============================================================================
function getScaledTimestep() {
    const GAME_SPEED = (typeof GAME_CONFIG !== 'undefined') ? GAME_CONFIG.GAME_SPEED || 1.0 : 1.0;
    const baseTimestep = 3/60;
    return baseTimestep / GAME_SPEED;
}

// ============================================================================
// ✅ FIX #6: PARTICLE CLEANUP WITH DENSITY CAP
// ============================================================================
function updateParticlesWithCleanup(gameState) {
    if (!gameState.particles || gameState.particles.length === 0) return;

    const now = Date.now();
    const PARTICLE_TIMEOUT = 5000; // 5 seconds max lifetime
    const VIEWPORT_MARGIN = 100;
    const MAX_PARTICLES = 150; // ✅ NEW: Prevent memory leak from particle explosion

    // Filter out expired and off-screen particles
    gameState.particles = gameState.particles.filter(particle => {
        // Check if particle expired
        if (now - particle.createdAt > PARTICLE_TIMEOUT) return false;

        // Check if off-screen
        if (particle.x < -VIEWPORT_MARGIN || particle.x > 900) return false;
        if (particle.y < -VIEWPORT_MARGIN || particle.y > 700) return false;

        return true;
    });

    // ✅ NEW: Cap total particle count (keep newest particles)
    if (gameState.particles.length > MAX_PARTICLES) {
        gameState.particles = gameState.particles.slice(-MAX_PARTICLES);
        console.log(`⚠️ Particle count capped at ${MAX_PARTICLES} (performance protection)`);
    }
}

function gameLoop_V2(timestamp) {
    if (!lastFrameTime) lastFrameTime = timestamp;
    if (!gameState.contexts.game) {
        if (gameState.status !== 'finished') {
            animationFrameId = requestAnimationFrame(gameLoop_V2);
        }
        return;
    }

    // --- Config and Delta Time Setup ---
    const GAME_LOOP_DEFAULT = { MAX_FRAME_TIME: 0.05, GAME_SPEED: 1, FIXED_TIMESTEP: 0.01666 };
    const GAME_LOOP = (typeof window !== 'undefined' && typeof window.GAME_LOOP !== 'undefined')
        ? window.GAME_LOOP
        : GAME_LOOP_DEFAULT;
    let dt = (timestamp - lastFrameTime) / 1000;
    lastFrameTime = timestamp;
    dt = Math.max(0, Math.min(dt, GAME_LOOP.MAX_FRAME_TIME));
    // ✅ FIX: Don't multiply dt by GAME_SPEED for physics!
    // GAME_SPEED is for the game clock (in main.js), not physics simulation
    // Player movement should run at normal speed regardless of game clock speed
    // dt *= GAME_LOOP.GAME_SPEED; // REMOVED - was causing players to move too slow
    // --- End Config ---

    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    spatialSystem.buildGrid(allPlayers, 800, 600);

    // Assign chasers ONLY if status is 'playing'
   if (gameState.status === 'playing' && !gameState.ballHolder?.hasBallControl && !gameState.ballTrajectory) {
        assignBallChasers(allPlayers);
    }

    // --- DETERMINE IF AI/PHYSICS SHOULD RUN ---
const isGameActive = gameState.status === 'playing'; // Only 'playing' is considered truly active now
    const isSetPiece = (typeof isSetPieceStatus === 'function')
        ? isSetPieceStatus(gameState.status)
        : ['GOAL_KICK', 'CORNER_KICK', 'THROW_IN', 'FREE_KICK', 'PENALTY', 'KICK_OFF'].includes(gameState.status);
    const runPhysics = isGameActive || isSetPiece; // Physics MUST run for set piece positioning
    const runMainAI = isGameActive; // Main AI ONLY runs during 'playing'
    // --- END DETERMINATION ---

    // --- RUN PLAYER AI (Only if runAI is true) ---
   if (runPhysics) { 
        allPlayers.forEach(player => {
            updatePlayerAI_V2(player, gameState.ballPosition, allPlayers, gameState);
        });
    }

       if (isSetPiece) {
    // [setpiece-fix] Update enforcement system (taker-first action, 100px distance, GK protection)
    if (typeof SetPieceEnforcement !== 'undefined' && SetPieceEnforcement.updateSetPieceEnforcement) {
        SetPieceEnforcement.updateSetPieceEnforcement(gameState, allPlayers);
    }

    // ✅ Only execute when time is reached
    if (gameState.setPiece && gameState.setPiece.executionTime) {
        const timeUntilExecution = gameState.setPiece.executionTime - Date.now();

        // Execute when time arrives (with small buffer)
        if (timeUntilExecution <= 100 && !gameState.setPiece.executed) {
            if (typeof SetPieceIntegration !== 'undefined' && SetPieceIntegration.executeSetPiece_Router) {
                SetPieceIntegration.executeSetPiece_Router(gameState);
            }
}
}
    }
if (gameState.status === 'PENALTY' && typeof penaltySystem !== 'undefined' && penaltySystem.state) {
        penaltySystem.update(gameState); // Ensure penalty system updates even if main AI is paused
    }
    // --- END AI BLOCK ---

    // --- UPDATE PHYSICS (Only if runPhysics is true) ---
   if (runPhysics) {
        // --- Game Time advancement (Only during 'playing') ---
        if (gameState.status === 'playing') {
            gameTime += dt;
            processPendingEvents(gameTime); // Process events only when time advances
        }

        // --- Physics Accumulator Logic (With Fixes #7, #13, #14) ---
        // ✅ FIX #7: Use scaled timestep based on GAME_SPEED
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
        // --- End Physics Accumulator ---

        // ✅ FIX #13: Cleanup shot state after physics
        cleanupShotState(gameState);

        // ✅ FIX #14: Update defensive lines dynamically
        updateDefensiveLines(gameState);

        // ✅ FIX #6: Clean up old particles
        updateParticlesWithCleanup(gameState);
    }
    // --- END PHYSICS BLOCK ---

    // --- Possession Tracking (With Fix #4 - Single Representation) ---
    // ✅ FIX #4: Use ONLY canonical possession representation
    const holder = (typeof validateBallHolder === 'function') ? validateBallHolder(gameState.ballHolder) : gameState.ballHolder;
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
    // --- End Possession ---

    // --- Rendering (Unchanged) ---
    if (typeof renderGame === 'function') {
        renderGame();
    }
    // --- End Rendering ---

    // Request next frame if game not finished
    if (gameState.status !== 'finished') {
        animationFrameId = requestAnimationFrame(gameLoop_V2);
    }
}

if (typeof window !== 'undefined') {
    window.spatialSystem = spatialSystem;
    window.actionDecision = actionDecision;
    window.tackleSystem = tackleSystem;
    window.penaltySystem = penaltySystem;
    window.updatePlayerAI_V2 = updatePlayerAI_V2;
    window.handleFoul_V2 = handleFoul_V2;
    window.gameLoop_V2 = gameLoop_V2;

    // ✅ Phase 2 Exports
    window.cleanupShotState = cleanupShotState;
    window.updateDefensiveLines = updateDefensiveLines;
    window.getScaledTimestep = getScaledTimestep;
    window.updateParticlesWithCleanup = updateParticlesWithCleanup;

    console.log('✅ V2 UNIFIED CORE LOADED (with Phase 2 fixes)');
}