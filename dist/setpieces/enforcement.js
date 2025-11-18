/**
 * ============================================================================
 * SET PIECE ENFORCEMENT SYSTEM v1.0
 * ============================================================================
 * [setpiece-fix] [defenders-fix] [gk-protection]
 *
 * Enforces professional set-piece rules:
 * 1. Taker-first action: Only taker can initiate play
 * 2. Opponent distance: Opponents must stay 100px away until first action
 * 3. Goalkeeper protection: GK cannot be tackled
 * 4. Set-piece state machine: Clear phases for execution
 * ============================================================================
 *
 * @module setpieces/enforcement
 * @migrated-from js/setpieces/setPieceEnforcement.js
 */
import { distance as getDistance } from '../utils/math';
import { getAttackingGoalX } from '../utils/ui';
import { GAME_CONFIG } from '../config';
// ============================================================================
// CONFIGURATION
// ============================================================================
const SET_PIECE_ENFORCEMENT = {
    OPPONENT_MIN_DISTANCE: 100, // 100 pixels minimum distance
    GK_PROTECTION_ENABLED: true, // Goalkeeper protection always on
    TAKER_PROTECTION_TIME: 2000, // Taker protected for 2 seconds
    WALL_MIN_DISTANCE: 92 // Wall distance for free kicks (10 yards)
};
// ============================================================================
// SET PIECE STATE MACHINE
// ============================================================================
const SET_PIECE_STATES = {
    POSITIONING: 'POSITIONING', // Players moving to positions
    WAIT_FOR_TAKER_ACTION: 'WAIT_FOR_TAKER_ACTION', // Waiting for taker to act
    EXECUTING: 'EXECUTING', // Ball in motion
    COMPLETED: 'COMPLETED' // Set piece finished
};
/**
 * Get current set-piece state
 */
function getSetPieceState(gameState) {
    if (!gameState || !gameState.setPiece)
        return null;
    const setPiece = gameState.setPiece;
    // Check if already executed
    if (setPiece.executed || gameState.ballTrajectory) {
        return SET_PIECE_STATES.COMPLETED;
    }
    // Check if execution time reached
    const now = Date.now();
    const executionTime = setPiece.executionTime || now + 3000;
    if (now >= executionTime && !setPiece.executed) {
        return SET_PIECE_STATES.WAIT_FOR_TAKER_ACTION;
    }
    return SET_PIECE_STATES.POSITIONING;
}
// ============================================================================
// [setpiece-fix] TAKER-FIRST ACTION ENFORCEMENT
// ============================================================================
/**
 * Check if player is the designated taker
 */
function isSetPieceTaker(player, gameState) {
    if (!gameState || !gameState.setPiece)
        return false;
    const kicker = gameState.setPiece.kicker;
    if (!kicker)
        return false;
    return String(player.id) === String(kicker.id);
}
/**
 * [setpiece-fix] Freeze opponents until taker acts
 * Enforces 100px minimum distance rule
 * [kick-off-fix] Also freezes non-taker teammates for kick-offs
 * [kick-off-half-fix] Enforces players stay in own half before kick-off
 */
function freezeOpponentsUntilKick(player, gameState, _allPlayers) {
    if (!gameState || !gameState.setPiece || !gameState.ballPosition)
        return false;
    const state = getSetPieceState(gameState);
    // Only enforce during WAIT_FOR_TAKER_ACTION phase
    if (state !== SET_PIECE_STATES.WAIT_FOR_TAKER_ACTION)
        return false;
    const takingTeam = gameState.setPiece.team;
    const takingTeamIsHome = (typeof takingTeam === 'boolean') ? takingTeam : (takingTeam === 'home');
    // Is this player an opponent?
    const isOpponent = player.isHome !== takingTeamIsHome;
    const isTaker = isSetPieceTaker(player, gameState);
    // [kick-off-fix] For kick-offs, freeze ALL non-takers (including same team)
    // This prevents the second taker from running before the first taker passes
    if (gameState.status === 'KICK_OFF' && !isTaker) {
        // Freeze position - no movement allowed until taker acts
        player.targetX = player.x;
        player.targetY = player.y;
        player.vx = 0;
        player.vy = 0;
        return true; // Blocked
    }
    if (!isOpponent)
        return false;
    // Calculate distance to ball
    const distToBall = getDistance(player, gameState.ballPosition);
    // [setpiece-fix] ENFORCE 100px MINIMUM DISTANCE
    if (distToBall < SET_PIECE_ENFORCEMENT.OPPONENT_MIN_DISTANCE) {
        // Push opponent back to minimum distance
        const dx = player.x - gameState.ballPosition.x;
        const dy = player.y - gameState.ballPosition.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const ratio = SET_PIECE_ENFORCEMENT.OPPONENT_MIN_DISTANCE / dist;
        player.x = gameState.ballPosition.x + dx * ratio;
        player.y = gameState.ballPosition.y + dy * ratio;
        player.targetX = player.x;
        player.targetY = player.y;
        player.vx = 0;
        player.vy = 0;
        return true; // Blocked
    }
    return false; // Not blocked
}
/**
 * [kick-off-half-fix] CRITICAL: Enforce players stay in own half before kick-off
 * This runs during POSITIONING and WAIT phases to prevent players crossing center line
 */
function enforceKickOffHalfRule(player, gameState) {
    if (!gameState || gameState.status !== 'KICK_OFF' || !gameState.setPiece) {
        return false; // Not a kick-off
    }
    const state = getSetPieceState(gameState);
    // Only enforce before execution (during POSITIONING and WAIT phases)
    if (state === SET_PIECE_STATES.EXECUTING || state === SET_PIECE_STATES.COMPLETED) {
        return false; // Kick-off already taken, players can cross
    }
    const centerX = GAME_CONFIG.PITCH_WIDTH / 2;
    // Determine own goal position
    const ownGoalX = getAttackingGoalX(!player.isHome, gameState.currentHalf);
    const ownHalfIsLeft = ownGoalX < centerX;
    // Check if player is in wrong half (with 5px tolerance for floating-point errors)
    let inWrongHalf = false;
    if (ownHalfIsLeft && player.x > centerX + 5) {
        inWrongHalf = true; // Should be left, but is right
    }
    else if (!ownHalfIsLeft && player.x < centerX - 5) {
        inWrongHalf = true; // Should be right, but is left
    }
    if (inWrongHalf) {
        // CRITICAL: Push player back to own half
        const margin = 30; // Safe margin from center line
        if (ownHalfIsLeft) {
            player.x = Math.min(player.x, centerX - margin);
            player.targetX = Math.min(player.targetX || player.x, centerX - margin);
        }
        else {
            player.x = Math.max(player.x, centerX + margin);
            player.targetX = Math.max(player.targetX || player.x, centerX + margin);
        }
        // Stop movement towards wrong half
        player.vx = 0;
        player.vy = 0;
        return true; // Position corrected
    }
    return false; // Player in correct half
}
/**
 * [setpiece-fix] Resume play after taker action
 */
function resumeAfterTakerAction(gameState) {
    if (!gameState || !gameState.setPiece)
        return;
    // Mark as executed
    gameState.setPiece.executed = true;
    gameState.setPiece.executionTime = Date.now();
    console.log('✅ Set piece: Taker action detected, opponents released');
}
// ============================================================================
// [gk-protection] GOALKEEPER PROTECTION
// ============================================================================
/**
 * [gk-protection] Check if player is a goalkeeper
 */
function isGoalkeeper(player) {
    if (!player)
        return false;
    return player.role === 'GK' || player.role === 'goalkeeper';
}
/**
 * [gk-protection] Prevent tackling the goalkeeper
 * Returns true if tackle should be blocked
 */
function protectGoalkeeper(tackler, target, gameState) {
    if (!SET_PIECE_ENFORCEMENT.GK_PROTECTION_ENABLED)
        return false;
    // Check if target is goalkeeper
    if (!isGoalkeeper(target))
        return false;
    // [gk-protection] BLOCK TACKLE ATTEMPT
    console.log(`🚫 [gk-protection] Tackle blocked: ${tackler.name} cannot tackle goalkeeper ${target.name}`);
    // Instead of tackling, assign marking behavior
    assignDefensiveMarking(tackler, target, gameState);
    return true; // Block tackle
}
/**
 * [gk-protection] Assign defensive marking instead of tackling GK
 */
function assignDefensiveMarking(marker, target, gameState) {
    if (!marker || !target)
        return;
    // Find nearest passing option to mark
    const allPlayers = [...(gameState?.homePlayers || []), ...(gameState?.awayPlayers || [])];
    const teammates = allPlayers.filter(p => p.isHome === target.isHome && p.id !== target.id);
    // Find closest teammate to mark
    const nearestTeammate = teammates
        .filter(p => !isGoalkeeper(p))
        .sort((a, b) => getDistance(marker, a) - getDistance(marker, b))[0];
    if (nearestTeammate) {
        // Mark the nearest passing option
        marker.targetX = nearestTeammate.x;
        marker.targetY = nearestTeammate.y;
        marker.intent = 'MARK_PASSING_OPTION';
        console.log(`  → ${marker.name} marking ${nearestTeammate.name} instead`);
    }
    else {
        // Cover space near goal
        const ownGoalX = getAttackingGoalX(!marker.isHome, gameState?.currentHalf || 1);
        const direction = Math.sign(ownGoalX - 400);
        marker.targetX = ownGoalX + direction * 60;
        marker.targetY = 300;
        marker.intent = 'COVER_SPACE';
    }
}
// ============================================================================
// [setpiece-fix] SET PIECE STATE MANAGEMENT
// ============================================================================
/**
 * Initialize set piece with proper state
 */
function initializeSetPieceState(gameState) {
    if (!gameState || !gameState.setPiece)
        return;
    const setPiece = gameState.setPiece;
    // Set initial state
    setPiece.state = SET_PIECE_STATES.POSITIONING;
    setPiece.executed = false;
    setPiece.configuredTime = Date.now();
    // Set execution time if not set
    if (!setPiece.executionTime) {
        setPiece.executionTime = Date.now() + 2500; // 2.5 seconds for positioning
    }
    console.log(`✅ Set piece initialized: ${setPiece.type} (execution in ${(setPiece.executionTime - Date.now()) / 1000}s)`);
}
/**
 * Update set piece state machine
 */
function updateSetPieceState(gameState) {
    if (!gameState || !gameState.setPiece)
        return;
    const setPiece = gameState.setPiece;
    const currentState = getSetPieceState(gameState);
    // Update state if changed
    if (setPiece.state !== currentState) {
        const oldState = setPiece.state;
        setPiece.state = currentState;
        console.log(`⚡ Set piece state: ${oldState} → ${currentState}`);
        // Handle state transitions
        if (currentState === SET_PIECE_STATES.WAIT_FOR_TAKER_ACTION) {
            console.log('⏳ Waiting for taker action...');
        }
        else if (currentState === SET_PIECE_STATES.EXECUTING) {
            console.log('🚀 Set piece executing...');
        }
        else if (currentState === SET_PIECE_STATES.COMPLETED) {
            console.log('✅ Set piece completed');
        }
    }
}
/**
 * Check if set piece action is allowed
 */
function canPlayerActOnSetPiece(player, gameState) {
    if (!gameState || !gameState.setPiece)
        return true;
    const state = getSetPieceState(gameState);
    // During WAIT_FOR_TAKER_ACTION, only taker can act
    if (state === SET_PIECE_STATES.WAIT_FOR_TAKER_ACTION) {
        return isSetPieceTaker(player, gameState);
    }
    // During positioning, no one can act
    if (state === SET_PIECE_STATES.POSITIONING) {
        return false;
    }
    return true;
}
// ============================================================================
// MAIN UPDATE FUNCTION
// ============================================================================
/**
 * Main enforcement update - call this every frame
 */
function updateSetPieceEnforcement(gameState, allPlayers) {
    if (!gameState || !gameState.setPiece)
        return;
    // Update state machine
    updateSetPieceState(gameState);
    const state = getSetPieceState(gameState);
    // [kick-off-half-fix] CRITICAL: Enforce players stay in own half before kick-off
    // This runs during POSITIONING and WAIT phases
    if (gameState.status === 'KICK_OFF' &&
        (state === SET_PIECE_STATES.POSITIONING || state === SET_PIECE_STATES.WAIT_FOR_TAKER_ACTION)) {
        allPlayers.forEach(player => {
            enforceKickOffHalfRule(player, gameState);
        });
    }
    // During WAIT_FOR_TAKER_ACTION phase, enforce rules
    if (state === SET_PIECE_STATES.WAIT_FOR_TAKER_ACTION) {
        // Freeze all opponents
        allPlayers.forEach(player => {
            freezeOpponentsUntilKick(player, gameState, allPlayers);
        });
    }
}
// ============================================================================
// EXPORTS
// ============================================================================
export const SetPieceEnforcement = {
    // Configuration
    SET_PIECE_ENFORCEMENT,
    SET_PIECE_STATES,
    // State management
    getSetPieceState,
    initializeSetPieceState,
    updateSetPieceState,
    canPlayerActOnSetPiece,
    // Taker-first action
    isSetPieceTaker,
    freezeOpponentsUntilKick,
    enforceKickOffHalfRule,
    resumeAfterTakerAction,
    // Goalkeeper protection
    isGoalkeeper,
    protectGoalkeeper,
    assignDefensiveMarking,
    // Main update
    updateSetPieceEnforcement
};
// Browser exports - now using ES6 modules
console.log('✅ SET PIECE ENFORCEMENT SYSTEM v1.0 LOADED');
console.log('   ✓ [setpiece-fix] Taker-first action logic');
console.log('   ✓ [setpiece-fix] 100px opponent distance enforcement');
console.log('   ✓ [kick-off-half-fix] Players stay in own half before kick-off');
console.log('   ✓ [gk-protection] Goalkeeper protection enabled');
console.log('   ✓ [setpiece-fix] State machine (WAIT_FOR_TAKER_ACTION)');
//# sourceMappingURL=enforcement.js.map