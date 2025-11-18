/*
============================================================================
PROFESSIONAL SET PIECE BEHAVIOR SYSTEM v6.0
Champions League Grade Tactical AI - ENHANCED EDITION
============================================================================
Key Improvements v6.0:
1. Position-specific tactical intelligence (defenders defend, attackers attack)
2. Ball possession awareness - dynamic positioning based on team having ball
3. Professional spacing and movement patterns matching real football
4. Enhanced throw-in tactical system with position-based roles
5. Improved corner and free kick variations with attacking mentality
6. Formation-aware positioning - players maintain team shape
7. Context-aware decision making based on game state and position
============================================================================
*/

const GAME_CONFIG_SPB_DEFAULT = {
    PITCH_WIDTH: 800,
    PITCH_HEIGHT: 600,
    MIN_PLAYER_SPACING: 30,
    GOAL_Y_TOP: 240,
    GOAL_Y_BOTTOM: 360
};

// ============================================================================
// POSITION-BASED TACTICAL INTELLIGENCE SYSTEM
// ============================================================================
/**
 * Determines player's tactical mindset based on their position
 * Returns attacking, defensive, or balanced mentality
 */
function getPlayerTacticalMentality(player) {
    if (!player || !player.role) return 'balanced';

    const role = player.role.toUpperCase();

    // Attacking positions
    if (['ST', 'CF', 'RW', 'LW', 'CAM'].some(r => role.includes(r))) {
        return 'attacking';
    }

    // Defensive positions
    if (['CB', 'RB', 'LB', 'CDM', 'GK'].some(r => role.includes(r))) {
        return 'defensive';
    }

    // Balanced positions (central midfielders, wide midfielders)
    return 'balanced';
}

/**
 * Calculate if player should commit forward or stay back during set pieces
 * Based on position, game state, and tactical context
 */
function shouldPlayerCommitForward(player, gameState, isAttackingSetPiece) {
    if (!player || !gameState) return false;

    const mentality = getPlayerTacticalMentality(player);
    const context = new TacticalContext(gameState, gameState.status);

    // Attacking players always commit forward when attacking
    if (mentality === 'attacking' && isAttackingSetPiece) {
        return true;
    }

    // Defensive players generally stay back
    if (mentality === 'defensive') {
        // Only commit forward if desperate for a goal
        if (isAttackingSetPiece && context.urgency === 'DESPERATE') {
            return player.role !== 'GK'; // Everyone except GK
        }
        return false;
    }

    // Balanced players - depends on game state
    if (mentality === 'balanced' && isAttackingSetPiece) {
        // Commit forward if need goal or moderate urgency
        return context.urgency === 'HIGH' || context.urgency === 'DESPERATE' ||
               context.urgency === 'MODERATE';
    }

    return false;
}

/**
 * Get professional spacing distance based on set piece type and player role
 * Ensures realistic distances between players like in professional football
 */
function getProfessionalSpacing(setPieceType, playerRole, isAttacking) {
    const spacingMap = {
        'CORNER_KICK': {
            attacking: { min: 25, preferred: 40, max: 60 },
            defending: { min: 20, preferred: 30, max: 45 }
        },
        'FREE_KICK': {
            attacking: { min: 30, preferred: 45, max: 65 },
            defending: { min: 25, preferred: 35, max: 50 }
        },
        'THROW_IN': {
            attacking: { min: 20, preferred: 35, max: 55 },
            defending: { min: 25, preferred: 40, max: 60 }
        },
        'GOAL_KICK': {
            attacking: { min: 35, preferred: 50, max: 70 },
            defending: { min: 30, preferred: 45, max: 65 }
        }
    };

    const defaults = { min: 25, preferred: 35, max: 50 };
    const typeSpacing = spacingMap[setPieceType] || { attacking: defaults, defending: defaults };
    return isAttacking ? typeSpacing.attacking : typeSpacing.defending;
}

/**
 * Enhanced position manager with professional spacing
 */
function getPositionWithProfessionalSpacing(basePosition, setPieceType, isAttacking, posManager) {
    const spacing = getProfessionalSpacing(setPieceType, null, isAttacking);
    if (posManager && typeof posManager.findValidPosition === 'function') {
        return posManager.findValidPosition(basePosition, spacing.preferred);
    }
    return basePosition;
}

// ============================================================================
// OFSAYT KONTROL SİSTEMİ
// ============================================================================





// ============================================================================
// MAIN FUNCTIONS
// ============================================================================
function handleGoalkeeperSetPiecePosition(player, gameState, setPieceType, isAttacking, ownGoalX, setPiecePos) {
    try {
        const opponentGoalX = window.getAttackingGoalX(player.isHome, gameState.currentHalf);
        
        switch (setPieceType) {
            case SET_PIECE_TYPES.CORNER_KICK:
                if (!isAttacking) {
                    const isRightCorner = setPiecePos.y < (PITCH_HEIGHT / 2);
                    const gkY = isRightCorner ? activeConfig.GOAL_Y_TOP + 50 : activeConfig.GOAL_Y_BOTTOM - 50;
                    return sanitizePosition({ x: ownGoalX, y: gkY, movement: 'gk_corner_positioning', role: 'GK' }, { player });
                }
                break;

            case SET_PIECE_TYPES.FREE_KICK:
                if (!isAttacking) {
                    const offsetY = setPiecePos.y > 300 ? -20 : 20;
                    return sanitizePosition({ x: ownGoalX, y: 300 + offsetY, movement: 'gk_fk_positioning', role: 'GK' }, { player });
                }
                break;

            case SET_PIECE_TYPES.PENALTY:
                return PenaltyKickBehaviors.getPenaltyArcPosition(player, setPiecePos, isAttacking, gameState);

            case SET_PIECE_TYPES.GOAL_KICK:
                const teammates = getValidPlayers(player.isHome ? gameState.homePlayers : gameState.awayPlayers);
                const opponents = getValidPlayers(player.isHome ? gameState.awayPlayers : gameState.homePlayers);
                const teamTactic = player.isHome ? gameState.homeTactic : gameState.awayTactic;
                
                return isAttacking ?
                    ProfessionalGoalKickBehaviors.getGoalKickPosition(player, ownGoalX, teamTactic, true, gameState, teammates) :
                    ProfessionalGoalKickBehaviors.getDefendingGoalKickPosition(player, opponentGoalX, ownGoalX, gameState, opponents, teammates);
        }

        return sanitizePosition({ x: ownGoalX, y: 300, movement: 'gk_default' }, { player });
    } catch (error) {
        console.error(`GK positioning error:`, error);
        const fallbackGoalX = window.getAttackingGoalX(!player.isHome, gameState?.currentHalf ?? 1);
        return sanitizePosition({ x: fallbackGoalX, y: 300, movement: 'gk_error' }, { player });
    }
}

function getSafeFallbackPosition(player, reason, gameState) {
    const activePos = window.getPlayerActivePosition(player, gameState?.currentHalf ?? 1);
    return sanitizePosition(
        { x: activePos?.x ?? PITCH_WIDTH / 2, y: activePos?.y ?? PITCH_HEIGHT / 2, movement: `fallback_${reason}` },
        { player, behavior: 'Fallback' }
    );
}

function calculateSetPiecePositionWithSafety(player, gameState, setPieceType, isAttacking, setPiecePos) {
    const ownGoalX = window.getAttackingGoalX(!player.isHome, gameState.currentHalf);
    const opponentGoalX = window.getAttackingGoalX(player.isHome, gameState.currentHalf);
    const teammates = getValidPlayers(player.isHome ? gameState.homePlayers : gameState.awayPlayers);
    const opponents = getValidPlayers(player.isHome ? gameState.awayPlayers : gameState.homePlayers);

    try {
        switch (setPieceType) {
            case SET_PIECE_TYPES.FREE_KICK:
                const distToGoal = window.getDistance(setPiecePos, { x: (isAttacking ? opponentGoalX : ownGoalX), y: 300 });
                return isAttacking ?
                    ProfessionalFreeKickBehaviors.getAttackingFreeKickPosition(player, setPiecePos, opponentGoalX, distToGoal, null, gameState, teammates) :
                    ProfessionalFreeKickBehaviors.getDefendingFreeKickPosition(player, setPiecePos, ownGoalX, distToGoal, null, opponents, gameState, teammates);

            case SET_PIECE_TYPES.CORNER_KICK:
                return isAttacking ?
                    ProfessionalCornerBehaviors.getAttackingCornerPosition(player, setPiecePos, opponentGoalX, teammates, null, gameState.setPiece?.routine, gameState) :
                    ProfessionalCornerBehaviors.getDefendingCornerPosition(player, setPiecePos, ownGoalX, opponents, null, gameState.setPiece?.defensiveSystem, gameState, teammates);

            case SET_PIECE_TYPES.THROW_IN:
                return ThrowInBehaviors.getThrowInPosition(player, setPiecePos, ownGoalX, opponentGoalX, gameState, teammates, opponents);

            case SET_PIECE_TYPES.GOAL_KICK:
                const teamTactic = player.isHome ? gameState.homeTactic : gameState.awayTactic;
                return isAttacking ?
                    ProfessionalGoalKickBehaviors.getGoalKickPosition(player, ownGoalX, teamTactic, true, gameState, teammates) :
                    ProfessionalGoalKickBehaviors.getDefendingGoalKickPosition(player, opponentGoalX, ownGoalX, gameState, opponents, teammates);

            case SET_PIECE_TYPES.PENALTY:
                if (isAttacking) {
                    const isKicker = gameState.setPiece.kicker && String(gameState.setPiece.kicker.id) === String(player.id);
                    if (isKicker) {
                        return PenaltyKickBehaviors.getKickerPosition(setPiecePos);
                    }
                }
                return PenaltyKickBehaviors.getPenaltyArcPosition(player, setPiecePos, isAttacking, gameState);

            case SET_PIECE_TYPES.KICK_OFF:
                if (typeof KickoffBehaviors !== 'undefined') {
                    const kickingTeamIsHome = typeof gameState.setPiece.team === 'boolean'
                        ? gameState.setPiece.team
                        : gameState.setPiece.team === 'home';
                    const isKickingTeam = player.isHome === kickingTeamIsHome;
                    return KickoffBehaviors.getKickoffPosition(player, setPiecePos, isKickingTeam, gameState);
                }
                // Fallback if KickoffBehaviors not loaded
                return sanitizePosition({ x: player.x, y: player.y, movement: 'kickoff_fallback', role: player.role }, { player, gameState });

            default:
                return getSafeFallbackPosition(player, `unknown_type_${setPieceType}`, gameState);
        }
    } catch (error) {
        console.error(`Set piece calculation error:`, error);
        return getSafeFallbackPosition(player, `calculation_error`, gameState);
    }
}

function getSetPiecePosition(player, gameState) {
    try {
        if (!gameState || !player || !gameState.setPiece || !gameState.setPiece.position) {
            return getSafeFallbackPosition(player, 'invalid_state', gameState);
        }

        const setPieceType = gameState.status;
        const isAttacking = isPlayerAttacking(player, gameState);
        const setPiecePos = gameState.setPiece.position;

        if (player.role === 'GK' || player.role === 'goalkeeper') {
            const ownGoalX = window.getAttackingGoalX(!player.isHome, gameState.currentHalf);
            return handleGoalkeeperSetPiecePosition(player, gameState, setPieceType, isAttacking, ownGoalX, setPiecePos);
        }

        let position = calculateSetPiecePositionWithSafety(player, gameState, setPieceType, isAttacking, setPiecePos);

        // Apply formation-aware positioning discipline
        position = getFormationAwarePosition(player, position, gameState, isAttacking);

        return sanitizePosition(position, {
            player,
            setPieceType,
            behavior: 'MainSetPieceDispatch',
            role: position?.role || player?.role || 'UNKNOWN',
            gameState
        });

    } catch (error) {
        console.error('Critical error in getSetPiecePosition:', error);
        return getSafeFallbackPosition(player, 'critical_error', gameState);
    }
}

function shouldLockSetPiecePosition(player, gameState) {
    if (!gameState || !player || !gameState.setPiece) return false;

    // SPECIAL CASE: KICKOFF - ALL players must be locked in position
    // until execution to enforce the "players in own half" rule
    if (gameState.status === 'KICK_OFF') {
        return true; // Lock everyone during kickoff setup
    }

    const movement = player.setPieceMovement || getSetPieceMovementType(player, gameState);
    const movementLower = typeof movement === 'string' ? movement.toLowerCase() : '';

    const lockKeywords = ['kicker', 'thrower', 'wall'];
    if (lockKeywords.some(keyword => movementLower.includes(keyword))) {
        return window.getDistance(player, gameState.setPiece.position) < 15;
    }

    if (!gameState.setPiece.executionTime) return false;
    const timeUntilExecution = gameState.setPiece.executionTime - Date.now();
    return timeUntilExecution < 1500 && timeUntilExecution > -500;
}

function getSetPieceMovementType(player, gameState) {
    if (!gameState || !player) return 'standard_position';
    if (player.setPieceMovement) return player.setPieceMovement;
    
    const position = getSetPiecePosition(player, gameState);
    const movement = position?.movement || 'standard_position';
    player.setPieceMovement = movement;
    return movement;
}

function isSetPieceActive(gameState) {
    if (!gameState || !gameState.status) return false;
    
    if (typeof window.isSetPieceStatus === 'function') {
        return window.isSetPieceStatus(gameState.status);
    }
    
    return [
        SET_PIECE_TYPES.CORNER_KICK,
        SET_PIECE_TYPES.FREE_KICK,
        SET_PIECE_TYPES.THROW_IN,
        SET_PIECE_TYPES.GOAL_KICK,
        SET_PIECE_TYPES.PENALTY,
        SET_PIECE_TYPES.KICK_OFF
    ].includes(gameState.status);
}


const activeConfig = (typeof GAME_CONFIG !== 'undefined') ? GAME_CONFIG : GAME_CONFIG_SPB_DEFAULT;

const SET_PIECE_TYPES = {
    CORNER_KICK: 'CORNER_KICK',
    FREE_KICK: 'FREE_KICK',
    THROW_IN: 'THROW_IN',
    GOAL_KICK: 'GOAL_KICK',
    PENALTY: 'PENALTY',
    KICK_OFF: 'KICK_OFF'
};

const PITCH_WIDTH = activeConfig.PITCH_WIDTH;
const PITCH_HEIGHT = activeConfig.PITCH_HEIGHT;

// ============================================================================
// TACTICAL CONTEXT ANALYZER
// ============================================================================

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================


// ============================================================================
// POSITION MANAGER WITH INTELLIGENT SPACING
// ============================================================================



// ============================================================================
// ✅ FIX #12: OFFSIDE AUDIT TRAIL - Return detailed audit information
// ============================================================================


// ============================================================================
// EXPORTS (Moved to end to avoid hoisting issues)
// ============================================================================
if (typeof window !== 'undefined') {
    window.SetPieceBehaviorSystem = {
        getSetPiecePosition,
        shouldLockSetPiecePosition,
        getSetPieceMovementType,
        isSetPieceActive,
        checkAndAdjustOffsidePosition,
        checkAndAdjustOffsidePositionWithAudit,
        ProfessionalCornerBehaviors,
        ProfessionalFreeKickBehaviors,
        ThrowInBehaviors,
        ProfessionalGoalKickBehaviors,
        PenaltyKickBehaviors,
        KickoffBehaviors: typeof KickoffBehaviors !== 'undefined' ? KickoffBehaviors : null,
        SET_PIECE_TYPES,
        determineSetPieceTeam,
        isPlayerAttacking,
        getFormationAwarePosition,
        sanitizePosition,
        getSafeFallbackPosition,
        handleGoalkeeperSetPiecePosition,
        calculateSetPiecePositionWithSafety,
        getValidPlayers,
        getSortedLists
    };

    // ✅ FIX #8: EXPLICIT DEPENDENCY REGISTRATION
    if (typeof DependencyRegistry !== 'undefined') {
        DependencyRegistry.register('SetPieceBehaviorSystem', window.SetPieceBehaviorSystem);
    }

    console.log('✅ PROFESSIONAL SET PIECE BEHAVIOR SYSTEM v6.0 (World Class) LOADED');
    console.log('   ✓ Formation-aware positioning');
    console.log('   ✓ Professional throw-in system');
    console.log('   ✓ Enhanced corner & free kick patterns');
    console.log('   ✓ FIX #8: Registered with DependencyRegistry');
    console.log('   ✓ FIX #12: Offside audit trail enabled');
    console.log('   ✓ Modern goal kick build-up play');
}