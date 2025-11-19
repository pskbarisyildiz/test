import type { Player, BallTrajectory } from '../types';
import { getDistance } from '../utils/ui';
import { gameState } from '../globalExports';
import { eventBus } from '../eventBus';
import { EVENT_TYPES } from '../types';
import { assignBallChasers } from '../physics';
import { getPlayerFacingDirection } from './playerVision';

export const FIRST_TOUCH_CONFIG = {
    // Control quality thresholds
    PERFECT_TOUCH_THRESHOLD: 0.85,    // Takes ball in stride
    GOOD_TOUCH_THRESHOLD: 0.70,       // Controls but slows
    POOR_TOUCH_THRESHOLD: 0.30,       // Heavy touch, ball gets away
    // Below 0.50 = complete loss of control

    // Speed penalties after control
    PERFECT_TOUCH_SPEED: 1.0,         // No slowdown
    GOOD_TOUCH_SPEED: 0.7,            // Slows to control
    POOR_TOUCH_SPEED: 0.4,            // Nearly stops

    // Time to settle ball
    PERFECT_TOUCH_SETTLE_TIME: 0,     // Immediate
    GOOD_TOUCH_SETTLE_TIME: 300,      // ms
    POOR_TOUCH_SETTLE_TIME: 600,      // ms

    // Bounce distances for failed control
    MIN_BOUNCE_DISTANCE: 30,          // pixels
    MAX_BOUNCE_DISTANCE: 70,         // pixels

    // Ball speed thresholds (pixels/second)
    SLOW_PASS_SPEED: 200,
    FAST_PASS_SPEED: 450,

    // Pressure effect
    PRESSURE_DISTANCE: 30,            // Opponent this close affects control
    PRESSURE_PENALTY_PER_OPP: 0.12    // Each opponent reduces control
};

function calculateFirstTouchQuality(player: Player, ballSpeed: number, nearbyOpponents: Player[]): number {
    const baseAbility = player.dribbling / 100;

    const realStats = player.realStats || {};
    const ballControlBonus = realStats.dribblesSucceeded ?
        (realStats.dribblesSucceeded / 90) * 0.15 : 0;

    // Calculate speed difficulty with safe division to prevent division by zero
    const denominator = FIRST_TOUCH_CONFIG.FAST_PASS_SPEED - FIRST_TOUCH_CONFIG.SLOW_PASS_SPEED;
    const speedDifficulty = denominator > 0
        ? Math.min((ballSpeed - FIRST_TOUCH_CONFIG.SLOW_PASS_SPEED) / denominator, 1.0)
        : 0;
    const speedPenalty = speedDifficulty * 0.25; // Up to 25% harder

    const opponentsInRange = nearbyOpponents.filter(opp =>
        getDistance(player, opp) < FIRST_TOUCH_CONFIG.PRESSURE_DISTANCE
    );
    const pressurePenalty = opponentsInRange.length *
        FIRST_TOUCH_CONFIG.PRESSURE_PENALTY_PER_OPP;

    const fatiguePenalty = (100 - player.stamina) / 90 * 0.15;

    const ballAngle = Math.atan2(
        gameState.ballPosition.y - player.y,
        gameState.ballPosition.x - player.x
    );
    const facingAngle = player.facingAngle || getPlayerFacingDirection(player);
    let angleDiff = Math.abs(ballAngle - facingAngle);
    if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;

    const bodyPositionPenalty = (angleDiff / Math.PI) * 0.2;

    let quality = baseAbility + ballControlBonus + 0.1 - // Base + bonus + slight advantage
        speedPenalty -
        pressurePenalty -
        fatiguePenalty -
        bodyPositionPenalty;

    const variance = (Math.random() - 0.5) * 0.15;
    quality += variance;

    // Clamp to 0-1
    return Math.max(0, Math.min(1, quality));
}


export function applyFirstTouch(player: Player, trajectory: BallTrajectory | null, allPlayers: Player[]): { outcome: string; quality: number; settleTime: number; speedMultiplier: number; } {
    const ballSpeed = trajectory ?
        Math.sqrt(
            Math.pow((trajectory.endX - trajectory.startX) / (trajectory.duration / 1000), 2) +
            Math.pow((trajectory.endY - trajectory.startY) / (trajectory.duration / 1000), 2)
        ) : 200; // Default for loose balls

    const opponents = allPlayers.filter(p => p.isHome !== player.isHome);
    const nearbyOpponents = opponents.filter(opp =>
        getDistance(player, opp) < FIRST_TOUCH_CONFIG.PRESSURE_DISTANCE * 1.5
    );

    // Calculate touch quality
    const touchQuality = calculateFirstTouchQuality(player, ballSpeed, nearbyOpponents);

    // Determine outcome based on quality
    let outcome;
    let settleTime;
    let speedMultiplier;

    if (touchQuality >= FIRST_TOUCH_CONFIG.PERFECT_TOUCH_THRESHOLD) {
        outcome = 'perfect';
        settleTime = FIRST_TOUCH_CONFIG.PERFECT_TOUCH_SETTLE_TIME;
        speedMultiplier = FIRST_TOUCH_CONFIG.PERFECT_TOUCH_SPEED;
    } else if (touchQuality >= FIRST_TOUCH_CONFIG.GOOD_TOUCH_THRESHOLD) {
        outcome = 'good';
        settleTime = FIRST_TOUCH_CONFIG.GOOD_TOUCH_SETTLE_TIME;
        speedMultiplier = FIRST_TOUCH_CONFIG.GOOD_TOUCH_SPEED;
    } else if (touchQuality >= FIRST_TOUCH_CONFIG.POOR_TOUCH_THRESHOLD) {
        outcome = 'poor';
        settleTime = FIRST_TOUCH_CONFIG.POOR_TOUCH_SETTLE_TIME;
        speedMultiplier = FIRST_TOUCH_CONFIG.POOR_TOUCH_SPEED;
    } else {
        outcome = 'failed';
        settleTime = 0;
        speedMultiplier = 0;
    }

    (player as any).firstTouchQuality = touchQuality;
    (player as any).firstTouchTime = Date.now();
    (player as any).ballSettleTime = settleTime;
    player.speedBoost = speedMultiplier;

    console.log(`¯ ${player.name} first touch: ${outcome} (${(touchQuality * 100).toFixed(0)}%)`);

    return {
        outcome: outcome,
        quality: touchQuality,
        settleTime: settleTime,
        speedMultiplier: speedMultiplier
    };
}

export function handleFailedFirstTouch(player: Player, allPlayers: Player[]): void {
    console.log(` ${player.name} loses control completely!`);

    const ballDirection = Math.random() * Math.PI * 2;
    const bounceSpeed = 150 + Math.random() * 100;
    gameState.ballVelocity.x = Math.cos(ballDirection) * bounceSpeed;
    gameState.ballVelocity.y = Math.sin(ballDirection) * bounceSpeed;

    gameState.ballPosition.x = player.x + Math.cos(ballDirection) * 25;
    gameState.ballPosition.y = player.y + Math.sin(ballDirection) * 25;

    gameState.ballTrajectory = null;
    gameState.ballHolder = null;
    gameState.currentPassReceiver = null;
    player.hasBallControl = false;

    gameState.commentary.push({
        text: `${Math.floor(gameState.timeElapsed)}' ${player.name} loses control!`,
        type: 'attack'
    });

    if (typeof eventBus !== 'undefined') {
        eventBus.publish(EVENT_TYPES.BALL_LOST, {
            player: player,
            reason: 'poor_first_touch'
        });
    }
    assignBallChasers(allPlayers, player);
}

export function handlePoorFirstTouch(player: Player, touchResult: { outcome: string; quality: number; settleTime: number; speedMultiplier: number; }): void {
    console.log(` ${player.name} heavy touch`);

    const movementAngle = player.facingAngle || getPlayerFacingDirection(player);
    const pushDistance = 40 + Math.random() * 30;

    gameState.ballPosition.x = player.x + Math.cos(movementAngle) * pushDistance;
    gameState.ballPosition.y = player.y + Math.sin(movementAngle) * pushDistance;

    // Player still has control but it's not ideal
    gameState.ballTrajectory = null;
    gameState.ballHolder = player;
    player.hasBallControl = true;
    (player as any).ballReceivedTime = Date.now();
    gameState.ballChasers.clear();

    player.speedBoost = touchResult.speedMultiplier;

    setTimeout(() => {
        if (player.hasBallControl) {
            player.speedBoost = 1.0;
            delete (player as any).ballSettleTime;
        }
    }, touchResult.settleTime);
}

export function handleSuccessfulFirstTouch(player: Player, touchResult: { outcome: string; quality: number; settleTime: number; speedMultiplier: number; }): void {
    const wasPerfect = touchResult.outcome === 'perfect';

    if (wasPerfect) {
        console.log(`¨ ${player.name} perfect touch!`);
    }

    // Track possession change
    const previousHolder = gameState.ballHolder;
    if (!previousHolder || previousHolder.isHome !== player.isHome) {
        gameState.lastPossessionChange = Date.now();
        gameState.possessionChanges++;
    }

    // Update pass statistics
    if (previousHolder && previousHolder.isHome === player.isHome && previousHolder.id !== player.id) {
        const teamStats = player.isHome ? gameState.stats.home : gameState.stats.away;
        teamStats.passesCompleted++;
    }

    // FIXED: Clear all control-related states
    gameState.ballTrajectory = null;
    gameState.ballHolder = player;
    player.hasBallControl = true;
    (player as any).ballReceivedTime = Date.now();
    gameState.ballChasers.clear();
    gameState.currentPassReceiver = null;

    // FIXED: Clear chase flags from all players
    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    allPlayers.forEach(p => {
        if (p.id !== player.id) {
            p.isChasingBall = false;
            (p as any).chaseStartTime = null;
        }
    });

    // Apply speed modifier
    player.speedBoost = touchResult.speedMultiplier;

    // Perfect touch? Can immediately move at full speed
    if (wasPerfect) {
        player.speedBoost = 1.0; // No penalty
        // Bonus: Slightly ahead of original position (takes ball in stride)
        const moveAngle = player.facingAngle || getPlayerFacingDirection(player);
        gameState.ballPosition.x = player.x + Math.cos(moveAngle) * 15;
        gameState.ballPosition.y = player.y + Math.sin(moveAngle) * 15;
    } else {
        // Good touch: Need time to settle
        setTimeout(() => {
            if (player.hasBallControl && gameState.ballHolder === player) {
                player.speedBoost = 1.0;
                delete (player as any).ballSettleTime;
                delete (player as any).firstTouchTime;
            }
        }, touchResult.settleTime);
    }
}

export function canPlayerActOnBall(player: Player): boolean {
    if (!player.hasBallControl) return false;

    // Still settling the ball?
    if ((player as any).ballSettleTime && (player as any).firstTouchTime) {
        const timeSinceTouch = Date.now() - (player as any).firstTouchTime;
        if (timeSinceTouch < (player as any).ballSettleTime) {
            return false; // Still controlling, can't pass/shoot yet
        }
    }

    return true;
}

export function drawFirstTouchIndicator(ctx: CanvasRenderingContext2D, player: Player): void {
    if (!(player as any).firstTouchTime) return;

    const timeSinceTouch = Date.now() - (player as any).firstTouchTime;
    const maxDisplayTime = 1000; // Show for 1 second

    if (timeSinceTouch > maxDisplayTime) {
        delete (player as any).firstTouchTime;
        delete (player as any).firstTouchQuality;
        return;
    }

    const quality = (player as any).firstTouchQuality || 0;
    const alpha = 1 - (timeSinceTouch / maxDisplayTime);

    // Color based on quality
    let color;
    if (quality >= 0.85) {
        color = `rgba(34, 197, 94, ${alpha})`; // Green - perfect
    } else if (quality >= 0.70) {
        color = `rgba(59, 130, 246, ${alpha})`; // Blue - good
    } else if (quality >= 0.50) {
        color = `rgba(251, 191, 36, ${alpha})`; // Yellow - poor
    } else {
        color = `rgba(239, 68, 68, ${alpha})`; // Red - failed
    }

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(player.x, player.y, 22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
}

export function initFirstTouchStats(): void {
    (gameState.stats.home as any).firstTouches = {
        perfect: 0,
        good: 0,
        poor: 0,
        failed: 0,
        total: 0
    };
    (gameState.stats.away as any).firstTouches = {
        perfect: 0,
        good: 0,
        poor: 0,
        failed: 0,
        total: 0
    };
}

export function recordFirstTouchStatistic(player: Player, outcome: string): void {
    const teamStats = player.isHome ? gameState.stats.home : gameState.stats.away;
    (teamStats as any).firstTouches[outcome]++;
    (teamStats as any).firstTouches.total++;
}
