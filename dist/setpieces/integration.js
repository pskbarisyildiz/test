import { getDistance } from '../utils/ui';
import { gameState } from '../globalExports';
import { GAME_CONFIG } from '../config';
import { SetPieceBehaviorSystem } from './SetPieceBehaviorSystem';
// Re-export for external use
export { executeSetPiece_Router } from './execution';
export const SET_PIECE_RULES = {
    MIN_DISTANCE_PIXELS: 70,
    THROW_IN_DISTANCE_PIXELS: 15
};
// Module-level telemetry tracking (replaces window.SET_PIECE_TELEMETRY)
const SET_PIECE_TELEMETRY = {
    systemNotLoaded: 0,
    noGameState: 0,
    invalidPosition: 0,
    successfulPositions: 0
};
// Debug flag (replaces window.DEBUG_SET_PIECES)
const DEBUG_SET_PIECES = false;
// Original function backup (replaces window._originalSetPieceFunctions)
let _originalSetPieceFunctions = null;
export function ensureCorrectSetPiecePlacement(gameState) {
    try {
        const sp = gameState?.setPiece;
        if (!sp?.position)
            return;
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
        const t = sp.executionTime;
        const traj = gameState.ballTrajectory;
        const keep = !!(traj && typeof traj.startTime === "number" && typeof t === "number" && (t - traj.startTime) <= 200);
        if (!keep)
            gameState.ballTrajectory = null;
    }
    catch (err) {
        console.error("ensureCorrectSetPiecePlacement failed", err);
    }
}
export function assignSetPieceKicker(player) {
    if (typeof gameState === 'undefined' || !gameState || !gameState.setPiece) {
        return;
    }
    gameState.setPiece.kicker = player || null;
}
export function getCornerKickPosition(isLeftCorner, isTopCorner) {
    const CORNER_MARGIN = 5;
    const pitchWidth = GAME_CONFIG.PITCH_WIDTH || 800;
    const pitchHeight = GAME_CONFIG.PITCH_HEIGHT || 600;
    return {
        x: isLeftCorner ? CORNER_MARGIN : pitchWidth - CORNER_MARGIN,
        y: isTopCorner ? CORNER_MARGIN : pitchHeight - CORNER_MARGIN
    };
}
export function getGoalKickPosition(goalX, preferredSide = 'center') {
    const GOAL_KICK_DISTANCE = 52;
    const direction = Math.sign((GAME_CONFIG.PITCH_WIDTH / 2 || 400) - goalX);
    const goalYTop = GAME_CONFIG.GOAL_Y_TOP || 240;
    const goalYBottom = GAME_CONFIG.GOAL_Y_BOTTOM || 360;
    const pitchHeight = GAME_CONFIG.PITCH_HEIGHT || 600;
    let y = pitchHeight / 2;
    if (preferredSide === 'left')
        y = goalYTop + 20;
    else if (preferredSide === 'right')
        y = goalYBottom - 20;
    return {
        x: goalX + direction * GOAL_KICK_DISTANCE,
        y: y
    };
}
export function positionForSetPiece_Unified(player, allPlayers) {
    if (typeof SetPieceBehaviorSystem === 'undefined' || !SetPieceBehaviorSystem.getSetPiecePosition) {
        SET_PIECE_TELEMETRY.systemNotLoaded++;
        console.error(`❌ CRITICAL: SetPieceBehaviorSystem not loaded! Falling back to legacy positioning for ${player.name}`);
        console.error(`   This should NEVER happen - check script load order! (Count: ${SET_PIECE_TELEMETRY.systemNotLoaded})`);
        return positionForSetPiece_Legacy(player, allPlayers);
    }
    if (!gameState || !gameState.setPiece) {
        SET_PIECE_TELEMETRY.noGameState++;
        console.warn(`⚠️ positionForSetPiece_Unified called without gameState or setPiece for ${player.name}`);
        console.warn(`   gameState exists: ${!!gameState}, setPiece exists: ${!!gameState?.setPiece} (Count: ${SET_PIECE_TELEMETRY.noGameState})`);
        return positionForSetPiece_Legacy(player, allPlayers);
    }
    const position = SetPieceBehaviorSystem.getSetPiecePosition(player, gameState);
    if (!position || typeof position.x !== 'number' || typeof position.y !== 'number' || isNaN(position.x) || isNaN(position.y)) {
        SET_PIECE_TELEMETRY.invalidPosition++;
        console.error(`❌ getSetPiecePosition INVALID POSITION for ${player.name} (${player.role}) during ${gameState.setPiece.type}`);
        console.error(`   Returned position:`, position);
        console.error(`   Expected: {x: number, y: number}, got: {x: ${typeof position?.x}, y: ${typeof position?.y}} (Count: ${SET_PIECE_TELEMETRY.invalidPosition})`);
        return positionForSetPiece_Legacy(player, allPlayers);
    }
    SET_PIECE_TELEMETRY.successfulPositions++;
    if (DEBUG_SET_PIECES && SET_PIECE_TELEMETRY.successfulPositions % 50 === 0) {
        console.log(`[SetPiece] Telemetry: ${SET_PIECE_TELEMETRY.successfulPositions} successful positions, ${SET_PIECE_TELEMETRY.invalidPosition} invalid, ${SET_PIECE_TELEMETRY.noGameState} missing state, ${SET_PIECE_TELEMETRY.systemNotLoaded} system not loaded`);
    }
    player.targetX = position.x;
    player.targetY = position.y;
    player.setPieceTarget = { x: position.x, y: position.y };
    const timeUntilExecution = gameState.setPiece.executionTime ?
        gameState.setPiece.executionTime - Date.now() : 3000;
    const isUrgent = timeUntilExecution < 2000;
    const movementTag = typeof position.movement === 'string' ? position.movement.toLowerCase() : '';
    const isKickerOrThrower = movementTag.includes('kicker') ||
        movementTag.includes('thrower') ||
        movementTag.includes('take_kick');
    if (isKickerOrThrower) {
        player.speedBoost = 2.0;
        player.setPieceLocked = getDistance(player, gameState.setPiece.position) < 8;
    }
    else if (isUrgent) {
        player.speedBoost = 1.8;
        player.setPieceLocked = false;
    }
    else {
        player.speedBoost = 1.5;
        player.setPieceLocked = false;
    }
    player.setPieceMovement = position.movement;
    player.setPieceRole = position.role;
    if (position.targetX && position.targetY) {
        player.setPieceRunTarget = { x: position.targetX, y: position.targetY };
    }
    else {
        player.setPieceRunTarget = null;
    }
}
export function positionForSetPiece_Legacy(player, allPlayers) {
    const status = gameState.status;
    if (!_originalSetPieceFunctions) {
        player.targetX = player.x;
        player.targetY = player.y;
        return;
    }
    const originals = _originalSetPieceFunctions;
    try {
        if (status === 'CORNER_KICK' && typeof originals['positionForCornerKick'] === 'function') {
            originals['positionForCornerKick'](player, allPlayers);
        }
        else if (status === 'FREE_KICK' && typeof originals['positionForFreeKick'] === 'function') {
            originals['positionForFreeKick'](player, allPlayers);
        }
        else if (status === 'THROW_IN' && typeof originals['positionForThrowIn'] === 'function') {
            originals['positionForThrowIn'](player, allPlayers);
        }
        else if (status === 'GOAL_KICK' && typeof originals['positionForGoalKick'] === 'function') {
            originals['positionForGoalKick'](player, allPlayers);
        }
        else {
            player.targetX = player.x;
            player.targetY = player.y;
        }
    }
    catch (error) {
        console.error(`❌ Error executing legacy function for ${status}:`, error);
        player.targetX = player.x;
        player.targetY = player.y;
    }
}
export function updatePlayerAI_V2_SetPieceEnhancement(player, allPlayers, gameState) {
    if (!gameState?.setPiece || !gameState.setPiece?.type) {
        if (gameState?.status && ['KICK_OFF', 'FREE_KICK', 'CORNER_KICK', 'THROW_IN', 'GOAL_KICK', 'PENALTY'].includes(gameState.status)) {
            console.warn(`⚠️ SET-PIECE AI: Set-piece status (${gameState.status}) active but no setPiece object for player ${player.name}`);
        }
        return false;
    }
    if (!player.setPieceTarget) {
        positionForSetPiece_Unified(player, allPlayers);
        if (!player.setPieceTarget) {
            console.error(`❌ SET-PIECE AI ERROR: positionForSetPiece_Unified FAILED for ${player.name} (${player.role}) during ${gameState.setPiece.type}`);
            console.error(`   Player:`, { id: player.id, isHome: player.isHome, x: player.x, y: player.y });
            console.error(`   SetPiece:`, gameState.setPiece);
        }
    }
    const now = Date.now();
    const executionTime = gameState.setPiece.executionTime || now;
    const timeUntilKick = executionTime - now;
    if (player.lockUntil && now < player.lockUntil) {
        if (player.setPieceTarget) {
            const isKickerLocked = player.isKicker && timeUntilKick < 500;
            if (isKickerLocked) {
                player.x = player.setPieceTarget.x;
                player.y = player.setPieceTarget.y;
                player.targetX = player.setPieceTarget.x;
                player.targetY = player.setPieceTarget.y;
                player.vx = 0;
                player.vy = 0;
                player.intent = "SET_PIECE_HOLD";
                return true;
            }
        }
    }
    if (player.lockUntil && now >= player.lockUntil) {
        player.lockUntil = 0;
        if (gameState.setPiece.executed || gameState.status === 'playing') {
            player.setPieceTarget = null;
        }
        player.isInWall = false;
        player.isDefCBLine = false;
        player.isMarker = false;
        player.isKicker = false;
        return false;
    }
    if (player.isKicker && timeUntilKick <= 800 && timeUntilKick > -200) {
        const bx = gameState.ballPosition.x;
        const by = gameState.ballPosition.y;
        const dx = player.x - bx;
        const dy = player.y - by;
        const dist = Math.hypot(dx, dy);
        if (dist > 8) {
            player.targetX = bx;
            player.targetY = by;
            player.speedBoost = 2.5;
            player.intent = "KICKER_APPROACHING";
            return true;
        }
        else {
            player.x = bx;
            player.y = by;
            player.targetX = bx;
            player.targetY = by;
            player.vx = 0;
            player.vy = 0;
            player.intent = "KICKER_READY";
            return true;
        }
    }
    if (player.setPieceTarget) {
        const dist = Math.hypot(player.x - player.setPieceTarget.x, player.y - player.setPieceTarget.y);
        const wasCloseLastFrame = player._setPieceWasClose || false;
        const threshold = wasCloseLastFrame ? 3 : 8;
        if (dist > threshold) {
            player.targetX = player.setPieceTarget.x;
            player.targetY = player.setPieceTarget.y;
            player.speedBoost = dist > 50 ? 1.8 : 1.3;
            player.intent = "SET_PIECE_POSITIONING";
            player._setPieceWasClose = false;
            return true;
        }
        else {
            player.targetX = player.setPieceTarget.x;
            player.targetY = player.setPieceTarget.y;
            player.intent = "SET_PIECE_READY";
            player._setPieceWasClose = true;
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
export function executeSetPiece_PostExecution() {
    const setPieceToClear = gameState.setPiece;
    if (!setPieceToClear) {
        console.warn("⚠️ PostExecution: setPiece already null, skipping cleanup");
        gameState.setPieceExecuting = false;
        if (gameState.status !== 'playing' && gameState.status !== 'finished' && gameState.status !== 'halftime') {
            gameState.status = 'playing';
        }
        return;
    }
    setPieceToClear.executed = true;
    gameState.setPieceExecuting = false;
    if (gameState.ballTrajectory) {
        const trajectory = gameState.ballTrajectory;
        const hasValidStartTime = typeof trajectory.startTime === 'number' && !isNaN(trajectory.startTime);
        const executionTime = setPieceToClear?.executionTime;
        const shouldClearTrajectory = !hasValidStartTime ||
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
                player.setPieceLocked = false;
                player.setPieceMovement = null;
                player.setPieceRole = null;
                player.setPieceRunTarget = null;
                player.setPieceTarget = null;
                player._setPieceWasClose = false;
                player.speedBoost = 1.0;
                player.lockUntil = 0;
                player.isKicker = false;
                player.isInWall = false;
                player.isDefCBLine = false;
                player.isMarker = false;
            }
        });
        cleanupSetPieceManagers();
        console.log(`✅ Set piece cleanup complete. Status: ${gameState.status}`);
    };
    if (CLEANUP_DELAY_MS === 0) {
        if (typeof requestAnimationFrame !== 'undefined') {
            requestAnimationFrame(cleanupFunction);
        }
        else {
            cleanupFunction();
        }
    }
    else {
        setTimeout(cleanupFunction, CLEANUP_DELAY_MS);
    }
}
function cleanupSetPieceManagers() {
    delete gameState._fkAttPosManager;
    delete gameState._fkDefPosManager;
    delete gameState._cornerPosManager;
    delete gameState._cornerDefPosManager;
    delete gameState._goalKickPosManager;
    delete gameState._goalKickDefPosManager;
    delete gameState._throwInPosManager;
    delete gameState._fkJobAssignments;
    delete gameState._fkDefJobAssignments;
    delete gameState._cornerJobAssignments;
    delete gameState._cornerDefJobAssignments;
    delete gameState._goalKickJobAssignments;
    delete gameState._goalKickDefJobAssignments;
    delete gameState._throwInJobAssignments;
    delete gameState._fkOpponentMap;
    delete gameState._cornerOpponentMap;
    delete gameState._goalKickOpponentMap;
    delete gameState._currentWallSize;
}
// Functions are now exported via ES6 modules - no window exports needed
//# sourceMappingURL=integration.js.map