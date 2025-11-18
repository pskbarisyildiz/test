// SetPieceIntegration.js (TAM KOD - v2.1)

// ============================================================================
// ENHANCED SET PIECE INTEGRATION LAYER v2.1 (Aligned with v2.8 Behaviors)
// ============================================================================
// Bridges SetPieceBehaviorSystem v2.8+ with game engine
// Ensures proper set piece placement and execution
// ============================================================================

const SET_PIECE_RULES = {
    MIN_DISTANCE_PIXELS: 70,    // Approx 9.15 meters (10 yards)
    THROW_IN_DISTANCE_PIXELS: 15 // Approx 2 meters
};
/**
 * PROPER SET PIECE BALL PLACEMENT
 */
function ensureCorrectSetPiecePlacement(gameState) {
  try {
    const sp = gameState?.setPiece;
    if (!sp?.position) return;

    const W = CFG().PITCH_WIDTH;
    const H = CFG().PITCH_HEIGHT;

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

    if (!keep) gameState.ballTrajectory = null;

  } catch (err) {
    console.error("ensureCorrectSetPiecePlacement failed", err);
  }
}

function assignSetPieceKicker(player) {
    if (typeof gameState === 'undefined' || !gameState || !gameState.setPiece) {
        return;
    }

    gameState.setPiece.kicker = player || null;
}
/**
 * Calculate correct corner kick position
 */
function getCornerKickPosition(isLeftCorner, isTopCorner) {
    const CORNER_MARGIN = 5; // Köşe bayrağına uzaklık
    const pitchWidth = GAME_CONFIG.PITCH_WIDTH || 800;
    const pitchHeight = GAME_CONFIG.PITCH_HEIGHT || 600;

    return {
        x: isLeftCorner ? CORNER_MARGIN : pitchWidth - CORNER_MARGIN,
        y: isTopCorner ? CORNER_MARGIN : pitchHeight - CORNER_MARGIN
    };
}

/**
 * Calculate correct goal kick position
 */
function getGoalKickPosition(goalX, preferredSide = 'center') {
    const GOAL_KICK_DISTANCE = 52; // Kale çizgisinden uzaklık (6 yarda çizgisi)
    const direction = Math.sign((GAME_CONFIG.PITCH_WIDTH / 2 || 400) - goalX);
    const goalYTop = GAME_CONFIG.GOAL_Y_TOP || 240;
    const goalYBottom = GAME_CONFIG.GOAL_Y_BOTTOM || 360;
    const pitchHeight = GAME_CONFIG.PITCH_HEIGHT || 600;

    let y = pitchHeight / 2; // Varsayılan orta
    if (preferredSide === 'left') y = goalYTop + 20; // 260
    else if (preferredSide === 'right') y = goalYBottom - 20; // 340

    return {
        x: goalX + direction * GOAL_KICK_DISTANCE,
        y: y
    };
}

// ============================================================================
// UNIFIED SET PIECE POSITIONING
// ============================================================================

/**
 * Master function that handles all set piece positioning
 */
function positionForSetPiece_Unified(player, allPlayers) {
    // Initialize telemetry counters if not exists
    if (!window.SET_PIECE_TELEMETRY) {
        window.SET_PIECE_TELEMETRY = {
            systemNotLoaded: 0,
            noGameState: 0,
            invalidPosition: 0,
            successfulPositions: 0
        };
    }

    // DEVELOPMENT MODE: Loud validation
    if (typeof SetPieceBehaviorSystem === 'undefined' || !SetPieceBehaviorSystem.getSetPiecePosition) {
        window.SET_PIECE_TELEMETRY.systemNotLoaded++;
        console.error(`❌ CRITICAL: SetPieceBehaviorSystem not loaded! Falling back to legacy positioning for ${player.name}`);
        console.error(`   This should NEVER happen - check script load order! (Count: ${window.SET_PIECE_TELEMETRY.systemNotLoaded})`);
        return positionForSetPiece_Legacy(player, allPlayers);
    }

    if (!gameState || !gameState.setPiece) {
        window.SET_PIECE_TELEMETRY.noGameState++;
        console.warn(`⚠️ positionForSetPiece_Unified called without gameState or setPiece for ${player.name}`);
        console.warn(`   gameState exists: ${!!gameState}, setPiece exists: ${!!gameState?.setPiece} (Count: ${window.SET_PIECE_TELEMETRY.noGameState})`);
        return positionForSetPiece_Legacy(player, allPlayers);
    }

    const position = SetPieceBehaviorSystem.getSetPiecePosition(player, gameState);

    if (!position || typeof position.x !== 'number' || typeof position.y !== 'number' || isNaN(position.x) || isNaN(position.y)) {
        window.SET_PIECE_TELEMETRY.invalidPosition++;
        console.error(`❌ getSetPiecePosition INVALID POSITION for ${player.name} (${player.role}) during ${gameState.setPiece.type}`);
        console.error(`   Returned position:`, position);
        console.error(`   Expected: {x: number, y: number}, got: {x: ${typeof position?.x}, y: ${typeof position?.y}} (Count: ${window.SET_PIECE_TELEMETRY.invalidPosition})`);
        return positionForSetPiece_Legacy(player, allPlayers);
    }

    window.SET_PIECE_TELEMETRY.successfulPositions++;
    if (window.DEBUG_SET_PIECES && window.SET_PIECE_TELEMETRY.successfulPositions % 50 === 0) {
        console.log(`[SetPiece] Telemetry: ${window.SET_PIECE_TELEMETRY.successfulPositions} successful positions, ${window.SET_PIECE_TELEMETRY.invalidPosition} invalid, ${window.SET_PIECE_TELEMETRY.noGameState} missing state, ${window.SET_PIECE_TELEMETRY.systemNotLoaded} system not loaded`);
    }

    player.targetX = position.x;
    player.targetY = position.y;
    player.setPieceTarget = { x: position.x, y: position.y }; // CRITICAL FIX: Set target for enhancement function

    const timeUntilExecution = gameState.setPiece.executionTime ?
        gameState.setPiece.executionTime - Date.now() : 3000; 

    const isUrgent = timeUntilExecution < 2000;
    const movementTag = typeof position.movement === 'string' ? position.movement.toLowerCase() : '';
    const isKickerOrThrower =
        movementTag.includes('kicker') ||
        movementTag.includes('thrower') ||
        movementTag.includes('take_kick');
    
    // IMPROVED: No hard locking during positioning - players move smoothly
    if (isKickerOrThrower) {
        player.speedBoost = 2.0;
        // Only lock if already at position
        player.setPieceLocked = getDistance(player, gameState.setPiece.position) < 8;
    } else if (isUrgent) {
        player.speedBoost = 1.8; // Move faster when execution is near
        player.setPieceLocked = false; // NO lock - let them move
    } else {
        player.speedBoost = 1.5; // Move to position
        player.setPieceLocked = false; // NO lock - smooth movement
    }

    player.setPieceMovement = position.movement;
    player.setPieceRole = position.role;

    if (position.targetX && position.targetY) {
        player.setPieceRunTarget = { x: position.targetX, y: position.targetY };
    } else {
         player.setPieceRunTarget = null; 
    }
}

/**
 * Legacy fallback for compatibility
 */
function positionForSetPiece_Legacy(player, allPlayers) {
    const status = gameState.status;

    // Orijinal fonksiyonlar yedeklenmiş mi kontrol et
    if (typeof window === 'undefined' || !window._originalSetPieceFunctions) {
        // console.warn('⚠️ Original set piece functions not backed up or not in browser env.');
        // Fallback: Oyuncuyu mevcut pozisyonunda tut
        player.targetX = player.x;
        player.targetY = player.y;
        return;
    }

    const originals = window._originalSetPieceFunctions;

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
             // Bilinmeyen veya yedeklenmemiş durum için fallback
             player.targetX = player.x;
             player.targetY = player.y;
        }
    } catch (error) {
         console.error(`❌ Error executing legacy function for ${status}:`, error);
         player.targetX = player.x;
         player.targetY = player.y;
    }
}

// ============================================================================
// ENHANCED AI UPDATE FOR SET PIECES
// ============================================================================

/**
 * Enhanced AI update with late run timing
 */
function updatePlayerAI_V2_SetPieceEnhancement(player, ball, allPlayers, gameState) {

    if (!gameState?.setPiece || !gameState.setPiece?.type) {
        // DEVELOPMENT MODE: Log why we're not handling this player
        if (gameState?.status && ['KICK_OFF', 'FREE_KICK', 'CORNER_KICK', 'THROW_IN', 'GOAL_KICK', 'PENALTY'].includes(gameState.status)) {
            console.warn(`⚠️ SET-PIECE AI: Set-piece status (${gameState.status}) active but no setPiece object for player ${player.name}`);
        }
        return false;
    }

    // CRITICAL FIX: ALWAYS set positioning data during set pieces, not just when configured
    // This ensures players have targets immediately and don't fall back to formation positions
    if (!player.setPieceTarget) {
        positionForSetPiece_Unified(player, allPlayers);

        // DEVELOPMENT MODE: Validate that positioning worked
        if (!player.setPieceTarget) {
            console.error(`❌ SET-PIECE AI ERROR: positionForSetPiece_Unified FAILED for ${player.name} (${player.role}) during ${gameState.setPiece.type}`);
            console.error(`   Player:`, { id: player.id, isHome: player.isHome, x: player.x, y: player.y });
            console.error(`   SetPiece:`, gameState.setPiece);
        }
    }

    const type = gameState.setPiece.type;
    const now = Date.now();
    const executionTime = gameState.setPiece.executionTime || now;
    const timeUntilKick = executionTime - now;

    // IMPROVED: Only hard lock kickers right before execution
    if (player.lockUntil && now < player.lockUntil) {
        if (player.setPieceTarget) {
            // Teleport ONLY if kicker and very close to execution
            const isKickerLocked = player.isKicker && timeUntilKick < 500;
            if (isKickerLocked) {
                player.x = player.setPieceTarget.x;
                player.y = player.setPieceTarget.y;
                player.targetX = player.setPieceTarget.x;
                player.targetY = player.setPieceTarget.y;
                player.vx = 0;
                player.vy = 0;
                player.intent = "SET_PIECE_HOLD";
                return true; // block normal AI for kicker only
            }
        }
    }

    // Unlock + cleanup (ONLY clear setPieceTarget if set piece is executed)
    if (player.lockUntil && now >= player.lockUntil) {
        player.lockUntil = 0;
        // CRITICAL FIX: Don't clear setPieceTarget while set piece is still active
        // This prevents stuttering where target is cleared then immediately recalculated
        if (gameState.setPiece.executed || gameState.status === 'playing') {
            player.setPieceTarget = null;
        }
        player.isInWall = false;
        player.isDefCBLine = false;
        player.isMarker = false;
        player.isKicker = false;
        return false;
    }

    // Kicker approach - move to ball smoothly
    if (player.isKicker && timeUntilKick <= 800 && timeUntilKick > -200) {
        const bx = gameState.ballPosition.x;
        const by = gameState.ballPosition.y;
        const dx = player.x - bx;
        const dy = player.y - by;
        const dist = Math.hypot(dx,dy);

        if (dist > 8) {
            // SMOOTH MOVEMENT to ball instead of teleport
            player.targetX = bx;
            player.targetY = by;
            player.speedBoost = 2.5;
            player.intent = "KICKER_APPROACHING";
            return true; // Override normal AI
        } else {
            // Only snap when very close
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

    // CRITICAL FIX: ALWAYS use setPieceTarget during set pieces to prevent normal AI override
    // Previously only worked if timeUntilKick > -200, but during initial setup this can be negative
    if (player.setPieceTarget) {
        const dist = Math.hypot(player.x - player.setPieceTarget.x, player.y - player.setPieceTarget.y);

        // CRITICAL FIX: Use hysteresis to prevent stuttering from overshoot
        // If player was already "close" last frame, use a smaller threshold to prevent toggling
        const wasCloseLastFrame = player._setPieceWasClose || false;
        const threshold = wasCloseLastFrame ? 3 : 8; // Smaller threshold when already close

        if (dist > threshold) {
            // SMOOTH MOVEMENT to target position
            player.targetX = player.setPieceTarget.x;
            player.targetY = player.setPieceTarget.y;
            // CRITICAL FIX: Reduce speed boost for better control and less overshoot
            player.speedBoost = dist > 50 ? 1.8 : 1.3; // Slower when close
            player.intent = "SET_PIECE_POSITIONING";
            player._setPieceWasClose = false;
            // NO TELEPORT - let physics move them naturally
            return true; // Override normal AI
        } else {
            // Close enough - hold position gently
            player.targetX = player.setPieceTarget.x;
            player.targetY = player.setPieceTarget.y;
            player.intent = "SET_PIECE_READY";
            player._setPieceWasClose = true; // Mark as close for next frame
            return true;
        }
    }

    // DEVELOPMENT MODE: This should NEVER happen - log loudly if it does
    console.error(`❌ SET-PIECE AI CRITICAL: Player ${player.name} has NO setPieceTarget during ${gameState.setPiece.type}!`);
    console.error(`   This means positionForSetPiece_Unified failed silently. THIS IS A BUG.`);
    console.error(`   Player:`, { id: player.id, role: player.role, isHome: player.isHome, x: player.x, y: player.y });
    console.error(`   SetPiece:`, gameState.setPiece);
    console.error(`   Stack:`, new Error().stack);

    // Still block normal AI to prevent formation override, but this is a BUG
    player.targetX = player.x;
    player.targetY = player.y;
    return true; // BLOCK normal AI during set pieces
}
// ============================================================================
// ENHANCED SET PIECE EXECUTION (passBall bağımlılığı içerir)
// ============================================================================


// ============================================================================
// POST-EXECUTION CLEANUP
// ============================================================================

/**
 * Clean up after set piece execution
 */
// SetPieceIntegration.js - POST-EXECUTION CLEANUP (ENHANCED VERSION)
function executeSetPiece_PostExecution() {
    const setPieceToClear = gameState.setPiece;

    // ✅ FIX #11: Validate game state before cleanup
    if (!setPieceToClear) {
        console.warn("⚠️ PostExecution: setPiece already null, skipping cleanup");
        gameState.setPieceExecuting = false;
        // Ensure status is playing to avoid stuck states
        if (gameState.status !== 'playing' && gameState.status !== 'finished' && gameState.status !== 'halftime') {
            gameState.status = 'playing';
        }
        return;
    }

    // ✅ FIX #12: Mark as executed IMMEDIATELY
    setPieceToClear.executed = true;
    gameState.setPieceExecuting = false;

    // ✅ FIX #13: Clean up old trajectory ONLY if it's from a previous set piece
    if (gameState.ballTrajectory) {
        const trajectory = gameState.ballTrajectory;
        const hasValidStartTime = typeof trajectory.startTime === 'number' && !isNaN(trajectory.startTime);
        const executionTime = setPieceToClear?.executionTime;

        // Only clear trajectory if it's stale (from before this execution)
        const shouldClearTrajectory =
            !hasValidStartTime ||
            (typeof executionTime === 'number' && trajectory.startTime < executionTime - 200);

        if (shouldClearTrajectory) {
            console.log("Clearing stale ball trajectory");
            gameState.ballTrajectory = null;
        }
    }

    console.log(`✓ Set piece ${setPieceToClear.type} executed. Transitioning to playing...`);

    // ✅ FIX #14: IMMEDIATE state transition for kick-off and goal-kick (no delay)
    const needsImmediateTransition = ['KICK_OFF', 'GOAL_KICK'].includes(setPieceToClear.type);
    const CLEANUP_DELAY_MS = needsImmediateTransition ? 0 : 150; // Instant for restart set pieces

    // ✅ FIX #15: Use requestAnimationFrame for immediate cleanup instead of setTimeout
    const cleanupFunction = () => {
        // Only clear setPiece if it's still the same object (not replaced by new set piece)
        if (gameState.setPiece === setPieceToClear) {
            gameState.setPiece = null;
        }

        // ✅ FIX #16: Only transition to playing if not already in another state
        if (gameState.status === setPieceToClear.type) {
            gameState.status = 'playing';
        }

        // Clear player flags
        const allPlayers = [...(gameState.homePlayers || []), ...(gameState.awayPlayers || [])];
        allPlayers.forEach(player => {
            if (player) {
                // ✅ FIX #17: Comprehensive flag cleanup
                player.setPieceLocked = false;
                player.setPieceMovement = null;
                player.setPieceRole = null;
                player.setPieceRunTarget = null;
                player.setPieceTarget = null;
                player._setPieceWasClose = false; // Clear hysteresis flag
                player.speedBoost = 1.0;
                player.lockUntil = 0;
                player.isKicker = false;
                player.isInWall = false;
                player.isDefCBLine = false;
                player.isMarker = false;
            }
        });

        // MEMORY MANAGEMENT: Clean up set piece position managers
        cleanupSetPieceManagers();

        console.log(`✅ Set piece cleanup complete. Status: ${gameState.status}`);
    };

    // Execute cleanup immediately or after short delay
    if (CLEANUP_DELAY_MS === 0) {
        // Use requestAnimationFrame for immediate cleanup on next frame
        if (typeof requestAnimationFrame !== 'undefined') {
            requestAnimationFrame(cleanupFunction);
        } else {
            cleanupFunction(); // Fallback for non-browser environments
        }
    } else {
        setTimeout(cleanupFunction, CLEANUP_DELAY_MS);
    }
}

// ============================================================================
// MEMORY MANAGEMENT: SET PIECE CLEANUP
// ============================================================================
function cleanupSetPieceManagers() {
    // Clear position managers to free memory
    delete gameState._fkAttPosManager;
    delete gameState._fkDefPosManager;
    delete gameState._cornerPosManager;
    delete gameState._cornerDefPosManager;
    delete gameState._goalKickPosManager;
    delete gameState._goalKickDefPosManager;
    delete gameState._throwInPosManager;

    // Clear assignment maps
    delete gameState._fkJobAssignments;
    delete gameState._fkDefJobAssignments;
    delete gameState._cornerJobAssignments;
    delete gameState._cornerDefJobAssignments;
    delete gameState._goalKickJobAssignments;
    delete gameState._goalKickDefJobAssignments;
    delete gameState._throwInJobAssignments;

    // Clear opponent maps
    delete gameState._fkOpponentMap;
    delete gameState._cornerOpponentMap;
    delete gameState._goalKickOpponentMap;

    // Clear wall size tracking
    delete gameState._currentWallSize;
}

// ============================================================================
// EXPORTS
// ============================================================================
if (typeof window !== 'undefined') {
    window.SetPieceIntegration = {
        // Core functions
        positionForSetPiece_Unified,
 executeSetPiece_PreConfiguration,
        updatePlayerAI_V2_SetPieceEnhancement,
        // Configuration
        configureSetPieceRoutines,
        executeSetPiece_PreConfiguration,
        executeSetPiece_Router,
        executeSetPiece_PostExecution,
        ensureCorrectSetPiecePlacement,
        assignSetPieceKicker,
        // Enhanced execution
        executeCornerKick_Enhanced,
        executeFreeKick_Enhanced,
        executeThrowIn_Enhanced,
        executeGoalKick_Enhanced,
        // Utilities
        getCornerKickPosition,
        getGoalKickPosition,
        // Visualization
        // System management
    };

    // Auto-initialize (Sayfa yüklendiğinde çalıştır)
    // DOM hazır olduğunda çalıştırmak daha güvenli olabilir
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        if (typeof resolveSystemConflicts === 'function') {
            resolveSystemConflicts();
        }
    }


    console.log('✅ ENHANCED SET PIECE INTEGRATION LAYER v2.1 LOADED (Aligned with v2.8 Behaviors)');
    console.log('   ✓ Unified positioning system active');
    console.log('   ✓ Enhanced execution routines ready');
    console.log('   ✓ Setup caching for ALL set pieces (via BehaviorSystem v2.8)');
    console.log('   ✓ Optimized marking & stacking (via BehaviorSystem v2.8)');
}

// Auto-initialize game state (Eğer gameState zaten varsa)
if (typeof gameState !== 'undefined' && gameState) {
    gameState.setPieceSystemReady = true;
}

// Enable debug mode in console with: window.DEBUG_SET_PIECES = true;