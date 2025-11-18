/**
 * Set Piece Configuration System - TypeScript Migration
 *
 * Handles tactical routine selection and configuration for set pieces:
 * - Corner kick routines (standard, inswinger, outswinger, short)
 * - Defensive systems (zonal, man marking)
 * - Goal kick strategies (short/long)
 * - Execution timing based on danger level
 *
 * @module setpieces/config
 * @migrated-from js/setpieces/setPieceConfig.js
 */
import { getAttackingGoalX } from '../utils/ui';
import { SetPieceEnforcement } from './enforcement';
import { TACTICS, GAME_CONFIG } from '../config';
import { gameState as globalGameState } from '../globalExports';
// ============================================================================
// ROUTINE SELECTION
// ============================================================================
/**
 * Select routine based on weighted probabilities
 */
function selectWeightedRoutine(weights) {
    const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
    if (total <= 0)
        return 'standard';
    let random = Math.random() * total;
    for (const [routine, weight] of Object.entries(weights)) {
        random -= weight;
        if (random <= 0)
            return routine;
    }
    return 'standard';
}
// ============================================================================
// SET PIECE CONFIGURATION
// ============================================================================
/**
 * Intelligent routine selection based on team tactics
 */
export function configureSetPieceRoutines(gameState) {
    if (!gameState) {
        console.error("Config SetPiece: gameState is missing!");
        return;
    }
    if (!gameState.setPiece) {
        gameState.setPiece = {};
    }
    // Get team and tactic information safely
    const takingTeam = gameState.setPiece.team; // true for home, false for away
    const homeTacticKey = gameState.homeTactic || 'balanced';
    const awayTacticKey = gameState.awayTactic || 'balanced';
    const tactic = takingTeam === true ?
        (TACTICS[homeTacticKey] || TACTICS['balanced']) :
        (TACTICS[awayTacticKey] || TACTICS['balanced']);
    const opposingTactic = takingTeam === true ?
        (TACTICS[awayTacticKey] || TACTICS['balanced']) :
        (TACTICS[homeTacticKey] || TACTICS['balanced']);
    // Corner kick routine selection
    if (gameState.status === 'CORNER_KICK') {
        // Default weights
        const routineWeights = {
            standard: 40,
            inswinger: 25,
            outswinger: 25,
            short: 10
        };
        if (tactic) {
            // High possession tactics prefer short corners
            if (tactic.possessionPriority > 0.7) {
                routineWeights.short = 25;
                routineWeights.standard = 30;
            }
        }
        gameState.setPiece.routine = selectWeightedRoutine(routineWeights);
        // Defensive system
        if (opposingTactic) {
            // High defensive organization prefers zonal
            gameState.setPiece.defensiveSystem =
                (opposingTactic.compactness > 0.65 || opposingTactic.defensiveLineDepth < 0.4)
                    ? 'zonal' : 'man_marking';
        }
        else {
            gameState.setPiece.defensiveSystem = 'zonal';
        }
    }
    // Goal kick strategy
    if (gameState.status === 'GOAL_KICK') {
        gameState.setPiece.playShort = tactic && tactic.possessionPriority > 0.6;
    }
    // Set execution time based on set piece type and danger level
    if (!gameState.setPiece.executionTime || gameState.setPiece.executionTime < Date.now()) {
        let delay = 1000 + Math.random() * 800; // Default: 1.0-1.8 seconds
        // Dangerous free kicks need longer positioning time (professional realism)
        if (gameState.status === 'FREE_KICK' && gameState.setPiece && gameState.setPiece.position) {
            const fkPos = gameState.setPiece.position;
            const takingTeamIsHome = (typeof gameState.setPiece.team === 'boolean')
                ? gameState.setPiece.team
                : (gameState.setPiece.team === 'home');
            // Calculate goal position and distance
            const opponentGoalX = getAttackingGoalX(takingTeamIsHome, gameState.currentHalf);
            const distToGoal = Math.hypot(fkPos.x - opponentGoalX, fkPos.y - 300);
            const angleToGoal = Math.abs(fkPos.y - 300);
            // Dangerous free kick: close to goal (<280px) and good angle (<130px)
            const isDangerous = distToGoal < 280 && angleToGoal < 130;
            if (isDangerous) {
                // Dangerous: 2.5-3.5 seconds for wall/positioning setup
                delay = 2500 + Math.random() * 1000;
            }
            else {
                // Non-dangerous: 0.5-1.0 seconds (quick play)
                delay = 500 + Math.random() * 500;
            }
        }
        gameState.setPiece.executionTime = Date.now() + delay;
    }
    gameState.setPiece.configured = true;
}
// ============================================================================
// PRE-CONFIGURATION
// ============================================================================
/**
 * Pre-configuration hook (Called before positioning players)
 * This simply ensures ball placement and execution time - positioning is handled by SetPieceBehaviorSystem
 */
export function executeSetPiece_PreConfiguration() {
    try {
        const gameState = globalGameState;
        const sp = gameState?.setPiece;
        if (!sp || !sp.type || !sp.position)
            return;
        // Ensure ball is placed correctly (inline logic to avoid circular dependency)
        const W = GAME_CONFIG.PITCH_WIDTH;
        const H = GAME_CONFIG.PITCH_HEIGHT;
        const M = 6;
        sp.position.x = Math.min(W - M, Math.max(M, Number(sp.position.x) || W / 2));
        sp.position.y = Math.min(H - M, Math.max(M, Number(sp.position.y) || H / 2));
        gameState.ballPosition = { x: sp.position.x, y: sp.position.y };
        gameState.ballVelocity = { x: 0, y: 0 };
        // Configure tactical routines if needed (for corner kicks, free kicks)
        if (sp.type === 'CORNER_KICK' || sp.type === 'FREE_KICK' || sp.type === 'GOAL_KICK') {
            configureSetPieceRoutines(gameState);
        }
        // Ensure execution time is set
        if (!sp.executionTime || sp.executionTime < Date.now()) {
            sp.executionTime = Date.now() + 1000 + Math.random() * 800;
        }
        // Initialize enforcement system state machine
        if (SetPieceEnforcement.initializeSetPieceState) {
            SetPieceEnforcement.initializeSetPieceState(gameState);
        }
        // Mark as configured - positioning will be handled by SetPieceBehaviorSystem
        sp.configured = true;
        console.log(`✓ Set piece pre-configured: ${sp.type} at (${Math.round(sp.position.x)}, ${Math.round(sp.position.y)})`);
    }
    catch (e) {
        console.error('executeSetPiece_PreConfiguration failed:', e);
    }
}
// ============================================================================
// BROWSER EXPORTS
// ============================================================================
// Functions are now exported via ES6 modules - no window exports needed
//# sourceMappingURL=config.js.map