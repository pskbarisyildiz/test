import type { Player } from '../types';
import { getDistance, getAttackingGoalX } from '../utils/ui';
import { gameState } from '../globalExports';
import { eventBus } from '../eventBus';
import { EVENT_TYPES } from '../types/events';
import { executeSetPiece_PostExecution } from '../setpieces/integration';

export const offsideTracker = {
    lastPassTime: 0,
    playersOffsideWhenBallPlayed: new Set<string>(),
    lastPassingTeam: null as 'home' | 'away' | null
};

export function isPlayerInOffsidePosition(player: Player, ball: { x: number; y: number }, opponents: Player[]): boolean {
    const opponentGoalX = getAttackingGoalX(player.isHome, gameState.currentHalf);
    const ownGoalX = getAttackingGoalX(!player.isHome, gameState.currentHalf);

    const attackingDirection = opponentGoalX > ownGoalX ? 1 : -1;
    const isInOpponentHalf = attackingDirection > 0 ?
        player.x > 400 :
        player.x < 400;

    if (!isInOpponentHalf) {
        return false;
    }

    const isBehindBall = attackingDirection > 0 ?
        player.x <= ball.x :
        player.x >= ball.x;

    if (isBehindBall) {
        return false;
    }

    const opponentsAheadOfPlayer = opponents.filter(opp => {
        if (opp.role === 'GK') return false;

        const oppDistToGoal = attackingDirection > 0 ?
            opp.x :
            800 - opp.x;
        const playerDistToGoal = attackingDirection > 0 ?
            player.x :
            800 - player.x;

        return oppDistToGoal < playerDistToGoal;
    });

    return opponentsAheadOfPlayer.length < 2;
}

export function recordOffsidePositions(passingPlayer: Player, allPlayers: Player[]): void {
    if (!passingPlayer || !Array.isArray(allPlayers) || allPlayers.length === 0) {
        return;
    }

    allPlayers.forEach(p => {
        if ((p as any).wasOffsideWhenBallPlayed) {
            delete (p as any).wasOffsideWhenBallPlayed;
        }
    });

    offsideTracker.lastPassTime = Date.now();
    offsideTracker.lastPassingTeam = passingPlayer.isHome ? 'home' : 'away';
    offsideTracker.playersOffsideWhenBallPlayed.clear();

    const teammates = allPlayers.filter(p =>
        p.isHome === passingPlayer.isHome &&
        p.id !== passingPlayer.id
    );
    const opponents = allPlayers.filter(p => p.isHome !== passingPlayer.isHome);

    if (!gameState.ballPosition) {
        return;
    }

    teammates.forEach(teammate => {
        if (isPlayerInOffsidePosition(teammate, gameState.ballPosition, opponents)) {
            offsideTracker.playersOffsideWhenBallPlayed.add(String(teammate.id));
            (teammate as any).wasOffsideWhenBallPlayed = true;
        }
    });
}

export function checkOffsidePenalty(player: Player): boolean {
    if (!player || !offsideTracker.playersOffsideWhenBallPlayed) {
        return false;
    }

    if (!offsideTracker.playersOffsideWhenBallPlayed.has(String(player.id))) {
        return false;
    }

    return true;
}

export function awardOffsideFreeKick(offsidePlayer: Player): void {
    const offenseTeam = offsidePlayer.isHome ? 'home' : 'away';

    console.log(`ðŸš© OFFSIDE! ${offsidePlayer.name} was in offside position`);

    gameState.ballTrajectory = null;
    gameState.ballHolder = null;
    gameState.shotInProgress = false;
    gameState.ballVelocity = { x: 0, y: 0 };

    gameState.commentary.push({
        text: `${Math.floor(gameState.timeElapsed)}' OFFSIDE - ${offsidePlayer.name}`,
        type: 'attack'
    });

    if (typeof eventBus !== 'undefined' && typeof EVENT_TYPES !== 'undefined') {
        eventBus.publish(EVENT_TYPES.OFFSIDE_CALLED, {
            player: offsidePlayer,
            time: Math.floor(gameState.timeElapsed)
        });
    }

    if (typeof recordOffsideStatistic === 'function') {
        recordOffsideStatistic(offsidePlayer);
    }

    const freeKickX = Math.max(50, Math.min(750, offsidePlayer.x));
    const freeKickY = Math.max(50, Math.min(550, offsidePlayer.y));

    const defenders = offenseTeam === 'home' ?
        gameState.awayPlayers :
        gameState.homePlayers;

    if (!defenders || defenders.length === 0) {
        console.error('No defenders available to take the offside free kick.');

        // Ensure proper cleanup if transitioning from set piece
        if (gameState.setPiece) {
            executeSetPiece_PostExecution();
        }

        gameState.status = 'playing';
        offsideTracker.playersOffsideWhenBallPlayed.clear();
        return;
    }

    const freeKickTaker = defenders
        .filter(p => p && p.x !== undefined && p.y !== undefined)
        .reduce((closest, current) => {
            const distToClosest = getDistance(closest, { x: freeKickX, y: freeKickY });
            const distToCurrent = getDistance(current, { x: freeKickX, y: freeKickY });
            return distToCurrent < distToClosest ? current : closest;
        });

    if (!freeKickTaker) {
        console.error('Could not find a suitable free kick taker.');

        // Ensure proper cleanup if transitioning from set piece
        if (gameState.setPiece) {
            executeSetPiece_PostExecution();
        }

        gameState.status = 'playing';
        offsideTracker.playersOffsideWhenBallPlayed.clear();
        return;
    }

    const offsideCallTime = Date.now();
    setTimeout(() => {
        // Validate game state hasn't changed significantly
        if (gameState.status === 'finished' || gameState.status === 'goal_scored') {
            return;
        }

        // Only proceed if no new possession or set piece has started
        if (gameState.ballHolder && gameState.ballHolder.id !== freeKickTaker.id) {
            return;
        }

        gameState.ballPosition.x = freeKickX;
        gameState.ballPosition.y = freeKickY;
        gameState.ballVelocity.x = 0;
        gameState.ballVelocity.y = 0;
        gameState.ballHolder = freeKickTaker;
        freeKickTaker.hasBallControl = true;
        (freeKickTaker as any).ballReceivedTime = offsideCallTime;
        offsideTracker.playersOffsideWhenBallPlayed.clear();
    }, 1000);
}

// IMPROVED: Frame counter for performance optimization
let offsideDrawFrameCounter = 0;

export function drawOffsideLines(ctx: CanvasRenderingContext2D): void {
    if (!gameState.contexts || !gameState.contexts.game) return;

    // PERFORMANCE: Only draw every 5th frame (12 FPS at 60 FPS) - still smooth but 5x less CPU
    offsideDrawFrameCounter++;
    if (offsideDrawFrameCounter % 5 !== 0) return;

    // Optional: Only draw if enabled in debug mode
    // Uncomment the following line to disable offside lines in production:
    // if (!(window as any).DEBUG_OFFSIDE) return;

    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];

    const awayDefenders = gameState.awayPlayers
        .filter(p => p.role !== 'GK')
        .sort((a, b) => a.x - b.x);

    if (awayDefenders.length >= 2) {
        const secondLastDefender = awayDefenders[1];
        if (secondLastDefender) {
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(secondLastDefender.x, 0);
            ctx.lineTo(secondLastDefender.x, 600);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

    const homeDefenders = gameState.homePlayers
        .filter(p => p.role !== 'GK')
        .sort((a, b) => b.x - a.x);

    if (homeDefenders.length >= 2) {
        const secondLastDefender = homeDefenders[1];
        if (secondLastDefender) {
            ctx.strokeStyle = 'rgba(0, 0, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(secondLastDefender.x, 0);
            ctx.lineTo(secondLastDefender.x, 600);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

    allPlayers.forEach(player => {
        if ((player as any).wasOffsideWhenBallPlayed) {
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
            ctx.lineWidth = 3;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.arc(player.x, player.y, 20, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    });
}

export function shouldAvoidOffside(player: Player, ball: { x: number; y: number }, opponents: Player[]): boolean {
    const opponentGoalX = getAttackingGoalX(player.isHome, gameState.currentHalf);
    const distToGoal = Math.abs(player.x - opponentGoalX);

    if (distToGoal > 300) return false;

    if (isPlayerInOffsidePosition(player, ball, opponents)) {
        const distToBall = getDistance(player, ball);

        if (distToBall < 150) {
            return true;
        }
    }

    return false;
}

export function initOffsideStats(): void {
    (gameState.stats.home as any).offsides = 0;
    (gameState.stats.away as any).offsides = 0;
}

export function recordOffsideStatistic(player: Player): void {
    const teamStats = player.isHome ? gameState.stats.home : gameState.stats.away;
    (teamStats as any).offsides++;
}
