import type { Player, GameState } from '../types';
import { getDistance } from '../utils/ui';
import { gameState } from '../globalExports';
import { GAME_CONFIG } from '../config';
import { SetPieceBehaviorSystem } from './SetPieceBehaviorSystem';
import {
    executeCornerKick_Enhanced,
    executeFreeKick_Enhanced,
    executeThrowIn_Enhanced,
    executeGoalKick_Enhanced,
    executeSetPiece_Router
} from './execution';
import {
    configureSetPieceRoutines,
    executeSetPiece_PreConfiguration
} from './config';

declare const PITCH_WIDTH: number;
declare const PITCH_HEIGHT: number;

export const SET_PIECE_RULES = {
    MIN_DISTANCE_PIXELS: 70,
    THROW_IN_DISTANCE_PIXELS: 15
};

export function ensureCorrectSetPiecePlacement(gameState: GameState): void {
    try {
        const sp = gameState?.setPiece;
        if (!sp?.position) return;

        const W = GAME_CONFIG.PITCH_WIDTH;
        const H = GAME_CONFIG.PITCH_HEIGHT;

        let x = Number(sp.position.x);
        let y = Number(sp.position.y);

        if (!isFinite(x) || !isFinite(y)) {
            x = W / 2;
            y = H / 2;
        }

        const M = 6;
        x = Math.min(W - M, Math.max(M, x));
        y = Math.min(H - M, Math.max(M, y));

        sp.position.x = x;
        sp.position.y = y;

        gameState.ballPosition = { x, y };
        gameState.ballVelocity = { x: 0, y: 0 };

        const t = (sp as any).executionTime;
        const traj = gameState.ballTrajectory;
        const keep = !!(traj && typeof traj.startTime === "number" && typeof t === "number" && (t - traj.startTime) <= 200);

        if (!keep) gameState.ballTrajectory = null;

    } catch (err) {
        console.error("ensureCorrectSetPiecePlacement failed", err);
    }
}

export function assignSetPieceKicker(player: Player): void {
    if (typeof gameState === 'undefined' || !gameState || !gameState.setPiece) {
        return;
    }

    (gameState.setPiece as any).kicker = player || null;
}

export function getCornerKickPosition(isLeftCorner: boolean, isTopCorner: boolean): { x: number; y: number } {
    const CORNER_MARGIN = 5;
    const pitchWidth = GAME_CONFIG.PITCH_WIDTH || 800;
    const pitchHeight = GAME_CONFIG.PITCH_HEIGHT || 600;

    return {
        x: isLeftCorner ? CORNER_MARGIN : pitchWidth - CORNER_MARGIN,
        y: isTopCorner ? CORNER_MARGIN : pitchHeight - CORNER_MARGIN
    };
}

export function getGoalKickPosition(goalX: number, preferredSide = 'center'): { x: number; y: number } {
    const GOAL_KICK_DISTANCE = 52;
    const direction = Math.sign((GAME_CONFIG.PITCH_WIDTH / 2 || 400) - goalX);
    const goalYTop = GAME_CONFIG.GOAL_Y_TOP || 240;
    const goalYBottom = GAME_CONFIG.GOAL_Y_BOTTOM || 360;
    const pitchHeight = GAME_CONFIG.PITCH_HEIGHT || 600;

    let y = pitchHeight / 2;
    if (preferredSide === 'left') y = goalYTop + 20;
    else if (preferredSide === 'right') y = goalYBottom - 20;

    return {
        x: goalX + direction * GOAL_KICK_DISTANCE,
        y: y
    };
}

export function positionForSetPiece_Unified(player: Player, allPlayers: Player[]): void {
    if (!(window as any).SET_PIECE_TELEMETRY) {
        (window as any).SET_PIECE_TELEMETRY = {
            systemNotLoaded: 0,
            noGameState: 0,
            invalidPosition: 0,
            successfulPositions: 0
        };
    }

    if (typeof SetPieceBehaviorSystem === 'undefined' || !SetPieceBehaviorSystem.getSetPiecePosition) {
        (window as any).SET_PIECE_TELEMETRY.systemNotLoaded++;
        console.error(`❌ CRITICAL: SetPieceBehaviorSystem not loaded! Falling back to legacy positioning for ${player.name}`);
        console.error(`   This should NEVER happen - check script load order! (Count: ${(window as any).SET_PIECE_TELEMETRY.systemNotLoaded})`);
        return positionForSetPiece_Legacy(player, allPlayers);
    }

    if (!gameState || !gameState.setPiece) {
        (window as any).SET_PIECE_TELEMETRY.noGameState++;
        console.warn(`⚠️ positionForSetPiece_Unified called without gameState or setPiece for ${player.name}`);
        console.warn(`   gameState exists: ${!!gameState}, setPiece exists: ${!!gameState?.setPiece} (Count: ${(window as any).SET_PIECE_TELEMETRY.noGameState})`);
        return positionForSetPiece_Legacy(player, allPlayers);
    }

    const position = SetPieceBehaviorSystem.getSetPiecePosition(player, gameState);

    if (!position || typeof position.x !== 'number' || typeof position.y !== 'number' || isNaN(position.x) || isNaN(position.y)) {
        (window as any).SET_PIECE_TELEMETRY.invalidPosition++;
        console.error(`❌ getSetPiecePosition INVALID POSITION for ${player.name} (${player.role}) during ${gameState.setPiece.type}`);
        console.error(`   Returned position:`, position);
        console.error(`   Expected: {x: number, y: number}, got: {x: ${typeof (position as any)?.x}, y: ${typeof (position as any)?.y}} (Count: ${(window as any).SET_PIECE_TELEMETRY.invalidPosition})`);
        return positionForSetPiece_Legacy(player, allPlayers);
    }

    (window as any).SET_PIECE_TELEMETRY.successfulPositions++;
    if ((window as any).DEBUG_SET_PIECES && (window as any).SET_PIECE_TELEMETRY.successfulPositions % 50 === 0) {
        console.log(`[SetPiece] Telemetry: ${(window as any).SET_PIECE_TELEMETRY.successfulPositions} successful positions, ${(window as any).SET_PIECE_TELEMETRY.invalidPosition} invalid, ${(window as any).SET_PIECE_TELEMETRY.noGameState} missing state, ${(window as any).SET_PIECE_TELEMETRY.systemNotLoaded} system not loaded`);
    }

    player.targetX = position.x;
    player.targetY = position.y;
    (player as any).setPieceTarget = { x: position.x, y: position.y };

    const timeUntilExecution = (gameState.setPiece as any).executionTime ?
        (gameState.setPiece as any).executionTime - Date.now() : 3000;

    const isUrgent = timeUntilExecution < 2000;
    const movementTag = typeof (position as any).movement === 'string' ? (position as any).movement.toLowerCase() : '';
    const isKickerOrThrower =
        movementTag.includes('kicker') ||
        movementTag.includes('thrower') ||
        movementTag.includes('take_kick');

    if (isKickerOrThrower) {
        player.speedBoost = 2.0;
        (player as any).setPieceLocked = getDistance(player, (gameState.setPiece as any).position) < 8;
    } else if (isUrgent) {
        player.speedBoost = 1.8;
        (player as any).setPieceLocked = false;
    } else {
        player.speedBoost = 1.5;
        (player as any).setPieceLocked = false;
    }

    (player as any).setPieceMovement = (position as any).movement;
    (player as any).setPieceRole = (position as any).role;

    if ((position as any).targetX && (position as any).targetY) {
        (player as any).setPieceRunTarget = { x: (position as any).targetX, y: (position as any).targetY };
    } else {
        (player as any).setPieceRunTarget = null;
    }
}

export function positionForSetPiece_Legacy(player: Player, allPlayers: Player[]): void {
    const status = gameState.status;

    if (typeof window === 'undefined' || !(window as any)._originalSetPieceFunctions) {
        player.targetX = player.x;
        player.targetY = player.y;
        return;
    }

    const originals = (window as any)._originalSetPieceFunctions;

    try {
        if (status === 'CORNER_KICK' && typeof originals.positionForCornerKick === 'function') {
            originals.positionForCornerKick(player, allPlayers);
        } else if (status === 'FREE_KICK' && typeof originals.positionForFreeKick === 'function') {
            originals.positionForFreeKick(player, allPlayers);
        } else if (status === 'THROW_IN' && typeof originals.positionForThrowIn === 'function') {
            originals.positionForThrowIn(player, allPlayers);
        } else if (status === 'GOAL_KICK' && typeof originals.positionForGoalKick === 'function') {
            originals.positionForGoalKick(player, allPlayers);
        } else {
            player.targetX = player.x;
            player.targetY = player.y;
        }
    } catch (error) {
        console.error(`❌ Error executing legacy function for ${status}:`, error);
        player.targetX = player.x;
        player.targetY = player.y;
    }
}

export function updatePlayerAI_V2_SetPieceEnhancement(player: Player, allPlayers: Player[], gameState: GameState): boolean {
    if (!gameState?.setPiece || !(gameState.setPiece as any)?.type) {
        if (gameState?.status && ['KICK_OFF', 'FREE_KICK', 'CORNER_KICK', 'THROW_IN', 'GOAL_KICK', 'PENALTY'].includes(gameState.status)) {
            console.warn(`⚠️ SET-PIECE AI: Set-piece status (${gameState.status}) active but no setPiece object for player ${player.name}`);
        }
        return false;
    }

    if (!(player as any).setPieceTarget) {
        positionForSetPiece_Unified(player, allPlayers);

        if (!(player as any).setPieceTarget) {
            console.error(`❌ SET-PIECE AI ERROR: positionForSetPiece_Unified FAILED for ${player.name} (${player.role}) during ${gameState.setPiece.type}`);
            console.error(`   Player:`, { id: player.id, isHome: player.isHome, x: player.x, y: player.y });
            console.error(`   SetPiece:`, gameState.setPiece);
        }
    }

    const now = Date.now();
    const executionTime = (gameState.setPiece as any).executionTime || now;
    const timeUntilKick = executionTime - now;

    if ((player as any).lockUntil && now < (player as any).lockUntil) {
        if ((player as any).setPieceTarget) {
            const isKickerLocked = (player as any).isKicker && timeUntilKick < 500;
            if (isKickerLocked) {
                player.x = (player as any).setPieceTarget.x;
                player.y = (player as any).setPieceTarget.y;
                player.targetX = (player as any).setPieceTarget.x;
                player.targetY = (player as any).setPieceTarget.y;
                player.vx = 0;
                player.vy = 0;
                (player as any).intent = "SET_PIECE_HOLD";
                return true;
            }
        }
    }

    if ((player as any).lockUntil && now >= (player as any).lockUntil) {
        (player as any).lockUntil = 0;
        if ((gameState.setPiece as any).executed || gameState.status === 'playing') {
            (player as any).setPieceTarget = null;
        }
        (player as any).isInWall = false;
        (player as any).isDefCBLine = false;
        (player as any).isMarker = false;
        (player as any).isKicker = false;
        return false;
    }

    if ((player as any).isKicker && timeUntilKick <= 800 && timeUntilKick > -200) {
        const bx = gameState.ballPosition.x;
        const by = gameState.ballPosition.y;
        const dx = player.x - bx;
        const dy = player.y - by;
        const dist = Math.hypot(dx, dy);

        if (dist > 8) {
            player.targetX = bx;
            player.targetY = by;
            player.speedBoost = 2.5;
            (player as any).intent = "KICKER_APPROACHING";
            return true;
        } else {
            player.x = bx;
            player.y = by;
            player.targetX = bx;
            player.targetY = by;
            player.vx = 0;
            player.vy = 0;
            (player as any).intent = "KICKER_READY";
            return true;
        }
    }

    if ((player as any).setPieceTarget) {
        const dist = Math.hypot(player.x - (player as any).setPieceTarget.x, player.y - (player as any).setPieceTarget.y);

        const wasCloseLastFrame = (player as any)._setPieceWasClose || false;
        const threshold = wasCloseLastFrame ? 3 : 8;

        if (dist > threshold) {
            player.targetX = (player as any).setPieceTarget.x;
            player.targetY = (player as any).setPieceTarget.y;
            player.speedBoost = dist > 50 ? 1.8 : 1.3;
            (player as any).intent = "SET_PIECE_POSITIONING";
            (player as any)._setPieceWasClose = false;
            return true;
        } else {
            player.targetX = (player as any).setPieceTarget.x;
            player.targetY = (player as any).setPieceTarget.y;
            (player as any).intent = "SET_PIECE_READY";
            (player as any)._setPieceWasClose = true;
            return true;
        }
    }

    console.error(`❌ SET-PIECE AI CRITICAL: Player ${player.name} has NO setPieceTarget during ${gameState.setPiece.type}!`);
    console.error(`   This means positionForSetPiece_Unified failed silently. THIS IS A BUG.`);
    console.error(`   Player:`, { id: player.id, role: player.role, isHome: player.isHome, x: player.x, y: player.y });
    console.error(`   SetPiece:`, gameState.setPiece);
    console.error(`   Stack:`, new Error().stack);

    player.targetX = player.x;
    player.targetY = player.y;
    return true;
}

export function executeSetPiece_PostExecution(): void {
    const setPieceToClear = gameState.setPiece;

    if (!setPieceToClear) {
        console.warn("⚠️ PostExecution: setPiece already null, skipping cleanup");
        (gameState as any).setPieceExecuting = false;
        if (gameState.status !== 'playing' && gameState.status !== 'finished' && gameState.status !== 'halftime') {
            gameState.status = 'playing';
        }
        return;
    }

    (setPieceToClear as any).executed = true;
    (gameState as any).setPieceExecuting = false;

    if (gameState.ballTrajectory) {
        const trajectory = gameState.ballTrajectory;
        const hasValidStartTime = typeof trajectory.startTime === 'number' && !isNaN(trajectory.startTime);
        const executionTime = (setPieceToClear as any)?.executionTime;

        const shouldClearTrajectory =
            !hasValidStartTime ||
            (typeof executionTime === 'number' && trajectory.startTime < executionTime - 200);

        if (shouldClearTrajectory) {
            console.log("Clearing stale ball trajectory");
            gameState.ballTrajectory = null;
        }
    }

    console.log(`✓ Set piece ${setPieceToClear.type} executed. Transitioning to playing...`);

    const needsImmediateTransition = ['KICK_OFF', 'GOAL_KICK'].includes(setPieceToClear.type);
    const CLEANUP_DELAY_MS = needsImmediateTransition ? 0 : 150;

    const cleanupFunction = () => {
        if (gameState.setPiece === setPieceToClear) {
            gameState.setPiece = null;
        }

        if (gameState.status === setPieceToClear.type) {
            gameState.status = 'playing';
        }

        const allPlayers = [...(gameState.homePlayers || []), ...(gameState.awayPlayers || [])];
        allPlayers.forEach(player => {
            if (player) {
                (player as any).setPieceLocked = false;
                (player as any).setPieceMovement = null;
                (player as any).setPieceRole = null;
                (player as any).setPieceRunTarget = null;
                (player as any).setPieceTarget = null;
                (player as any)._setPieceWasClose = false;
                player.speedBoost = 1.0;
                (player as any).lockUntil = 0;
                (player as any).isKicker = false;
                (player as any).isInWall = false;
                (player as any).isDefCBLine = false;
                (player as any).isMarker = false;
            }
        });

        cleanupSetPieceManagers();

        console.log(`✅ Set piece cleanup complete. Status: ${gameState.status}`);
    };

    if (CLEANUP_DELAY_MS === 0) {
        if (typeof requestAnimationFrame !== 'undefined') {
            requestAnimationFrame(cleanupFunction);
        } else {
            cleanupFunction();
        }
    } else {
        setTimeout(cleanupFunction, CLEANUP_DELAY_MS);
    }
}

function cleanupSetPieceManagers(): void {
    delete (gameState as any)._fkAttPosManager;
    delete (gameState as any)._fkDefPosManager;
    delete (gameState as any)._cornerPosManager;
    delete (gameState as any)._cornerDefPosManager;
    delete (gameState as any)._goalKickPosManager;
    delete (gameState as any)._goalKickDefPosManager;
    delete (gameState as any)._throwInPosManager;

    delete (gameState as any)._fkJobAssignments;
    delete (gameState as any)._fkDefJobAssignments;
    delete (gameState as any)._cornerJobAssignments;
    delete (gameState as any)._cornerDefJobAssignments;
    delete (gameState as any)._goalKickJobAssignments;
    delete (gameState as any)._goalKickDefJobAssignments;
    delete (gameState as any)._throwInJobAssignments;

    delete (gameState as any)._fkOpponentMap;
    delete (gameState as any)._cornerOpponentMap;
    delete (gameState as any)._goalKickOpponentMap;

    delete (gameState as any)._currentWallSize;
}

if (typeof window !== 'undefined') {
    (window as any).SetPieceIntegration = {
        positionForSetPiece_Unified,
        executeSetPiece_PreConfiguration,
        updatePlayerAI_V2_SetPieceEnhancement,
        configureSetPieceRoutines,
        executeSetPiece_Router,
        executeSetPiece_PostExecution,
        ensureCorrectSetPiecePlacement,
        assignSetPieceKicker,
        executeCornerKick_Enhanced,
        executeFreeKick_Enhanced,
        executeThrowIn_Enhanced,
        executeGoalKick_Enhanced,
        getCornerKickPosition,
        getGoalKickPosition,
    };
}
