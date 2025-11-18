import type { Player, BallTrajectory } from '../types';
import { distance } from '../utils/math';
import { isSetPieceStatus } from '../utils/ui';
import { gameState } from '../globalExports';
import { assignBallChasers } from '../physics';
import { applyFirstTouch, handleFailedFirstTouch, handlePoorFirstTouch, handleSuccessfulFirstTouch } from '../ai/playerFirstTouch';
import { checkOffsidePenalty, awardOffsideFreeKick } from './offside';
import { handleFoul_V2 } from '../core';
import { SetPieceEnforcement } from '../setpieces/enforcement';
import { PHYSICS } from '../config';

export function resolveBallControl(allPlayers: Player[]): void {
    const isSetPiece = isSetPieceStatus(gameState.status);

    if (isSetPiece) {
        return;
    }

    if (!gameState.ballPosition || !Array.isArray(allPlayers) || allPlayers.length === 0) {
        return;
    }
    if (gameState.ballTrajectory || (gameState.ballHolder && gameState.ballHolder.hasBallControl)) {
        return;
    }

    const eligiblePlayers = allPlayers.filter(p => !((p as any).stunnedUntil && Date.now() < (p as any).stunnedUntil));
    if (eligiblePlayers.length === 0) return;

    const BALL_CONTROL_DISTANCE = (typeof PHYSICS !== 'undefined') ? PHYSICS.BALL_CONTROL_DISTANCE : 25;

    const controlCandidates = eligiblePlayers.map(player => {
        const distToBall = distance(player, gameState.ballPosition);
        let effectiveControlDistance = BALL_CONTROL_DISTANCE * (player.isChasingBall ? 2.0 : 1.0);
        if (distToBall > effectiveControlDistance) {
            return { player, score: 0, distToBall };
        }
        let score = Math.max(0, 150 - distToBall);
        score += (player.dribbling / 100) * 20;
        if (player.isChasingBall) score += 200;
        return { player, score, distToBall };
    }).filter(item => item.score > 50).sort((a, b) => b.score - a.score);

    if (controlCandidates.length === 0) return;

    let controllingPlayer;

    const vel = gameState.ballVelocity;
    const ballSpeed = vel ? Math.sqrt(vel.x ** 2 + vel.y ** 2) : 0;
    // Check for 50/50 duel scenario: slow ball with two close contenders
    if (ballSpeed < 5 && controlCandidates.length >= 2 &&
        controlCandidates[0]!.distToBall < 30 &&
        controlCandidates[1]!.distToBall < 30) {
        const contender1 = controlCandidates[0]!.player;
        const contender2 = controlCandidates[1]!.player;

        const p1_strength = (contender1.physicality * 0.6) + (contender1.pace * 0.2) + (Math.random() * 20);
        const p2_strength = (contender2.physicality * 0.6) + (contender2.pace * 0.2) + (Math.random() * 20);

        if (p1_strength >= p2_strength) {
            controllingPlayer = contender1;
            (contender2 as any).stunnedUntil = Date.now() + 250;
        } else {
            controllingPlayer = contender2;
            (contender1 as any).stunnedUntil = Date.now() + 250;
        }
    } else if (controlCandidates.length > 0) {
        controllingPlayer = controlCandidates[0]!.player;
    }

    if (!controllingPlayer) return;

    gameState.lastTouchedBy = controllingPlayer;

    if (gameState.status === 'playing' && typeof checkOffsidePenalty === 'function') {
        if (checkOffsidePenalty(controllingPlayer)) {
            if (typeof awardOffsideFreeKick === 'function') {
                awardOffsideFreeKick(controllingPlayer);
            } else {
                console.error("awardOffsideFreeKick is not defined!");
            }
            return;
        }
    }

    const touchResult = applyFirstTouch(controllingPlayer, null, allPlayers);
    if (touchResult.outcome === 'failed') {
        handleFailedFirstTouch(controllingPlayer, allPlayers);
    } else if (touchResult.outcome === 'poor') {
        handlePoorFirstTouch(controllingPlayer, touchResult);
    } else {
        handleSuccessfulFirstTouch(controllingPlayer, touchResult);
    }
}

export function canControlBall(player: Player, ball: { x: number, y: number }): boolean {
    const BALL_CONTROL_DISTANCE = (typeof PHYSICS !== 'undefined') ? PHYSICS.BALL_CONTROL_DISTANCE : 25;
    const dist = distance(player, ball);

    const isSetPiece = ['GOAL_KICK', 'FREE_KICK', 'CORNER_KICK', 'THROW_IN', 'KICK_OFF', 'PENALTY'].includes(gameState.status);
    if (isSetPiece && gameState.setPiece && !(gameState.setPiece as any).executed) {
        const isDesignatedTaker = (player as any).setPieceRole && (
            (player as any).setPieceRole.includes('KICKER') ||
            (player as any).setPieceRole.includes('THROWER') ||
            (player as any).setPieceRole === 'CORNER_KICKER' ||
            (player as any).setPieceRole === 'PRIMARY_KICKER'
        );
        const isGoalkeeper = player.role === 'GK' || (player as any).role === 'goalkeeper';

        if (!isDesignatedTaker && !isGoalkeeper) {
            return false;
        }
    }

    return dist < BALL_CONTROL_DISTANCE && !gameState.ballTrajectory;
}

export function action_attemptTackle(player: Player, allPlayers: Player[]): boolean {
    const isRestart = isSetPieceStatus(gameState.status);
    if (isRestart) {
        return false;
    }
    const attacker = gameState.ballHolder;
    if (!attacker) return false;

    if (attacker.role === 'GK' || (attacker as any).role === 'goalkeeper') {
        if (typeof SetPieceEnforcement !== 'undefined' && SetPieceEnforcement.protectGoalkeeper) {
            SetPieceEnforcement.protectGoalkeeper(player, attacker, gameState);
        } else {
            console.log(`🚫 [gk-protection] ${player.name} cannot tackle goalkeeper ${attacker.name}`);
        }
        return false;
    }

    const defenderStat = (player.defending * 0.6) + (player.physicality * 0.4);
    const attackerStat = (attacker.dribbling * 0.6) + (attacker.pace * 0.4);
    const successChance = 0.5 + ((defenderStat - attackerStat) / 120);
    const teamStats = player.isHome ? gameState.stats.home : gameState.stats.away;

    if (!teamStats) return false;

    const outcome = Math.random();

    if (outcome < successChance) {
        if (Math.random() < 0.6) {
            gameState.ballHolder = player;
            player.hasBallControl = true;
            (player as any).ballReceivedTime = Date.now();
            gameState.commentary.push({ text: `${Math.floor(gameState.timeElapsed)}' ${player.name} wins the ball!`, type: 'attack' });
        } else {
            gameState.ballHolder = null;
            gameState.ballTrajectory = null;
            const angle = Math.atan2(attacker.y - player.y, attacker.x - player.x);
            if (gameState.ballVelocity) {
                gameState.ballVelocity.x = Math.cos(angle) * 150;
                gameState.ballVelocity.y = Math.sin(angle) * 150;
            }
            gameState.commentary.push({ text: `${Math.floor(gameState.timeElapsed)}' 50/50 challenge! The ball is loose!`, type: 'attack' });
            assignBallChasers(allPlayers);
        }
        if (teamStats.tackles !== undefined) {
            teamStats.tackles++;
        }
    } else {
        (player as any).stunnedUntil = Date.now() + 750;
        attacker.speedBoost = 1.2;

        if (Math.random() < 0.15) {
            if (typeof handleFoul_V2 === 'function') {
                handleFoul_V2(player, attacker);
            } else {
                console.error("handleFoul_V2 is not defined!");
            }
        } else {
            gameState.commentary.push({ text: `${Math.floor(gameState.timeElapsed)}' ${attacker.name} skips past ${player.name}!`, type: 'attack' });
        }
    }
    return true;
}

export function handleBallInterception(progress: number): void {
    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    const trajectory = gameState.ballTrajectory;
    if (!trajectory) return;

    const HEADER_HEIGHT_THRESHOLD = (typeof PHYSICS !== 'undefined') ? PHYSICS.HEADER_HEIGHT_THRESHOLD : 0.6;
    const PASS_INTERCEPT_DISTANCE = (typeof PHYSICS !== 'undefined') ? PHYSICS.PASS_INTERCEPT_DISTANCE : 25;

    const isAerial = trajectory.passType === 'aerial';
    const isHeaderOpportunity = isAerial && gameState.ballHeight > HEADER_HEIGHT_THRESHOLD;

    if (progress >= 1 || progress < 0.2) return;

    if (isHeaderOpportunity) {
        const contenders = allPlayers.filter(player =>
            !((player as any).stunnedUntil && Date.now() < (player as any).stunnedUntil)
        ).map(player => ({
            player,
            dist: distance(player, gameState.ballPosition)
        })).filter(c => c.dist < 28);

        if (contenders.length > 1) {
            contenders.sort((a, b) => {
                const aScore = (a.player.physicality * 0.7) + (Math.random() * 30);
                const bScore = (b.player.physicality * 0.7) + (Math.random() * 30);
                return bScore - aScore;
            });

            const winner = contenders[0]?.player;
            const loser = contenders[1]?.player;

            if (winner) {
                handleWonHeader(winner);
            }
            if (loser) {
                (loser as any).stunnedUntil = Date.now() + 500;
            }

            if (winner && loser) {
                const headerText = `${Math.floor(gameState.timeElapsed)}' ${winner.name} wins the header against ${loser.name}!`;
                gameState.commentary.push({ text: headerText, type: 'attack' });
            }

            return;
        }
    }

    for (const player of allPlayers) {
        if ((player as any).stunnedUntil && Date.now() < (player as any).stunnedUntil) continue;
        if (gameState.currentPassReceiver && player.id === gameState.currentPassReceiver.id) continue;

        const distToBall = distance(player, gameState.ballPosition);

        if (!isAerial && distToBall < PASS_INTERCEPT_DISTANCE) {
            const interceptionChance = calculateInterceptionChance(player, distToBall, trajectory);
            if (Math.random() < interceptionChance) {
                handleInterception(player);
                const teamStats = player.isHome ? gameState.stats.home : gameState.stats.away;
                teamStats.interceptions++;
                break;
            }
        }
    }
}

function calculateInterceptionChance(player: Player, ballDistance: number, trajectory: BallTrajectory): number {
    const realStats = player.realStats || {};
    const baseDefending = player.defending / 100;
    const interceptionModifier = realStats.interceptions > 0 ? Math.min(realStats.interceptions / 15, 0.3) : 0;
    const recoveryBonus = realStats.recoveries > 0 ? Math.min(realStats.recoveries / 20, 0.15) : 0;
    const ratingBonus = (player.rating - 6.5) / 10;
    const distancePenalty = Math.min(ballDistance / 100, 0.3);
    const passQualityBonus = (trajectory as any).passQuality ? (1.0 - (trajectory as any).passQuality) * 0.4 : 0;
    const interceptionChance = baseDefending + interceptionModifier + recoveryBonus + ratingBonus - distancePenalty + passQualityBonus;
    return Math.max(0.05, Math.min(0.8, interceptionChance));
}

function handleInterception(player: Player): void {
    gameState.ballTrajectory = null;
    gameState.ballHolder = player;
    player.hasBallControl = true;
    (player as any).ballReceivedTime = Date.now();
    if (gameState.ballChasers) {
        gameState.ballChasers.clear();
    }
    gameState.lastPossessionChange = Date.now();
    gameState.currentPassReceiver = null;

    const interceptText = `${Math.floor(gameState.timeElapsed)}' ${player.name} intercepts!`;
    if (gameState.commentary) {
        gameState.commentary.push({ text: interceptText, type: 'attack' });
        gameState.commentary = gameState.commentary.slice(-6);
    }
}

function handleWonHeader(player: Player): void {
    const opponentGoalX = (window as any).getAttackingGoalX(player.isHome, gameState.currentHalf);
    const directionToGoal = Math.sign(opponentGoalX - player.x);

    gameState.ballTrajectory = null;
    gameState.ballHolder = null;
    gameState.ballHeight = 0;

    if (gameState.ballPosition) {
        gameState.ballPosition.x = player.x + directionToGoal * 15;
        gameState.ballPosition.y = player.y;
    }
    if (gameState.ballVelocity) {
        gameState.ballVelocity.x = directionToGoal * 50;
        gameState.ballVelocity.y = (Math.random() - 0.5) * 30;
    }

    const allPlayers = [...(gameState.homePlayers || []), ...(gameState.awayPlayers || [])];
    assignBallChasers(allPlayers, player);
}
