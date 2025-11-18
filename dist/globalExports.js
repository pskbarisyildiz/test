/**
 * Global Exports for Browser Compatibility
 * Exports all configuration and systems to window object
 *
 * This module ensures backward compatibility with the existing JavaScript architecture
 * that relies on global window object access
 */
import { GAME_LOOP, PHYSICS, BALL_PHYSICS, GAME_CONFIG, POSITION_CONFIGS, TACTICS, TEAM_STATE_MODIFIERS, BT_CONFIG, FORMATIONS, positionToRoleMap, getRoleFromPosition, drawGroundShadow, toggleOrientation, validatePhysicsRealism } from './config';
import { selectBestTeam, selectBestTactic, selectBestFormation, initializePlayers, getFormationPositions, applyFormationConstraint, getFormationPosition, initializeGameSetup } from './gameSetup';
// Phase 9: Player Vision System
import { getVisibleTeammates } from './ai/playerVision';
import { canPlayerActOnBall } from './ai/playerFirstTouch';
import { selectBestAttackingMovement } from './ai/MovementPatterns';
// Phase 9: First Touch System
import { initFirstTouchStats } from './ai/playerFirstTouch';
// Phase 9: Set Piece Integration
import { ensureCorrectSetPiecePlacement, assignSetPieceKicker, getCornerKickPosition, getGoalKickPosition, positionForSetPiece_Unified, updatePlayerAI_V2_SetPieceEnhancement, executeSetPiece_PostExecution } from './setpieces/integration';
import { configureSetPieceRoutines, executeSetPiece_PreConfiguration } from './setpieces/config';
import { executeSetPiece_Router } from './setpieces/execution';
// Phase 10: UI Components and Main Functions (for dynamic onclick handlers)
import { switchSummaryTab } from './ui/uiComponents';
import { switchSimulationMode, addMatchToBatch } from './ui/uiScreens';
import { CustomFixtureSimulator } from './batch-simulator';
import { startMatch, resetMatch, handleFileUpload } from './main';
// ============================================================================
// GAME STATE INITIALIZATION
// ============================================================================
/**
 * Initialize global game state
 * Creates the central game state object if it doesn't exist
 */
export function initializeGameState() {
    const initialState = {
        status: 'upload',
        players: [],
        teams: [],
        teamJerseys: {},
        teamCoaches: {},
        teamLogos: {},
        homeTeam: '',
        awayTeam: '',
        homeFormation: '4-3-3',
        awayFormation: '4-3-3',
        homeTactic: 'balanced',
        awayTactic: 'balanced',
        homeTacticManuallySet: false,
        awayTacticManuallySet: false,
        homePlayers: [],
        awayPlayers: [],
        homeScore: 0,
        awayScore: 0,
        timeElapsed: 0,
        currentHalf: 1,
        ballPosition: { x: 400, y: 300 },
        ballVelocity: { x: 0, y: 0 },
        ballHeight: 0,
        ballTrajectory: null,
        ballHolder: null,
        ballChasers: new Set(),
        currentPassReceiver: null,
        lastTouchedBy: null,
        commentary: [],
        particles: [],
        stats: {
            home: {
                possession: 0,
                possessionTime: 0,
                passesCompleted: 0,
                passesAttempted: 0,
                shotsOnTarget: 0,
                shotsOffTarget: 0,
                tackles: 0,
                interceptions: 0,
                xGTotal: 0
            },
            away: {
                possession: 0,
                possessionTime: 0,
                passesCompleted: 0,
                passesAttempted: 0,
                shotsOnTarget: 0,
                shotsOffTarget: 0,
                tackles: 0,
                interceptions: 0,
                xGTotal: 0
            },
            possession: { home: 50, away: 50 },
            possessionTimer: { home: 0, away: 0 },
            lastPossessionUpdate: Date.now()
        },
        homeDefensiveLine: 200,
        awayDefensiveLine: 600,
        homeTeamState: 'BALANCED',
        awayTeamState: 'BALANCED',
        lastTeamStateUpdate: Date.now(),
        lastPossessionChange: 0,
        possessionChanges: 0,
        postKickOffCalmPeriod: false,
        kickOffCompletedTime: 0,
        totalPasses: 0,
        totalShots: 0,
        totalTackles: 0,
        shotInProgress: false,
        shooter: null,
        currentShotXG: null,
        fouls: 0,
        yellowCards: [],
        redCards: [],
        lastGoalScorer: null,
        goalEvents: [],
        cardEvents: [],
        setPiece: null,
        setPieceExecuting: false,
        lastControlAttempt: 0,
        lastEventTime: Date.now(),
        canvases: { background: null, game: null, ui: null },
        contexts: { background: null, game: null, ui: null },
        backgroundDrawn: false,
        gameUIDisplayed: false,
        summaryDrawn: false,
        isVertical: false,
        orientationChanged: false,
        commentaryFadeTimeout: null,
        offscreenPitch: null,
        homeJerseyColor: '#ef4444',
        awayJerseyColor: '#3b82f6',
        cameraShake: 0,
        _teamCacheVersion: 0
    };
    return initialState;
}
// ============================================================================
// BROWSER EXPORT
// ============================================================================
/**
 * Export all configuration to window object for browser compatibility
 */
export function exportToWindow() {
    if (typeof window === 'undefined') {
        console.warn('⚠️ Not in browser environment, skipping window exports');
        return;
    }
    // Export configuration objects
    window.GAME_LOOP = window.GAME_LOOP || GAME_LOOP;
    window.PHYSICS = window.PHYSICS || PHYSICS;
    window.BALL_PHYSICS = window.BALL_PHYSICS || BALL_PHYSICS;
    window.GAME_CONFIG = window.GAME_CONFIG || GAME_CONFIG;
    window.POSITION_CONFIGS = window.POSITION_CONFIGS || POSITION_CONFIGS;
    window.FORMATIONS = window.FORMATIONS || FORMATIONS;
    window.TACTICS = window.TACTICS || TACTICS;
    window.TEAM_STATE_MODIFIERS = window.TEAM_STATE_MODIFIERS || TEAM_STATE_MODIFIERS;
    window.BT_CONFIG = window.BT_CONFIG || BT_CONFIG;
    // Export functions and mappings
    window.positionToRoleMap = positionToRoleMap;
    window.getRoleFromPosition = getRoleFromPosition;
    window.drawGroundShadow = drawGroundShadow;
    window.toggleOrientation = toggleOrientation;
    window.validatePhysicsRealism = validatePhysicsRealism;
    // Export game setup functions
    window.selectBestTeam = selectBestTeam;
    window.selectBestTactic = selectBestTactic;
    window.selectBestFormation = selectBestFormation;
    window.initializePlayers = initializePlayers;
    window.getFormationPositions = getFormationPositions;
    window.applyFormationConstraint = applyFormationConstraint;
    window.getFormationPosition = getFormationPosition;
    window.initializeGameSetup = initializeGameSetup;
    // Phase 9: Export vision, first touch, and set piece integration functions
    window.getVisibleTeammates = getVisibleTeammates;
    window.canPlayerActOnBall = canPlayerActOnBall;
    window.selectBestAttackingMovement = selectBestAttackingMovement;
    window.initFirstTouchStats = initFirstTouchStats;
    window.ensureCorrectSetPiecePlacement = ensureCorrectSetPiecePlacement;
    window.assignSetPieceKicker = assignSetPieceKicker;
    window.getCornerKickPosition = getCornerKickPosition;
    window.getGoalKickPosition = getGoalKickPosition;
    window.executeSetPiece_PostExecution = executeSetPiece_PostExecution;
    window.positionForSetPiece_Unified = positionForSetPiece_Unified;
    window.updatePlayerAI_V2_SetPieceEnhancement = updatePlayerAI_V2_SetPieceEnhancement;
    window.configureSetPieceRoutines = configureSetPieceRoutines;
    window.executeSetPiece_PreConfiguration = executeSetPiece_PreConfiguration;
    window.executeSetPiece_Router = executeSetPiece_Router;
    // Export SetPieceIntegration object for compatibility
    window.SetPieceIntegration = {
        positionForSetPiece_Unified,
        executeSetPiece_PreConfiguration,
        updatePlayerAI_V2_SetPieceEnhancement,
        executeSetPiece_PostExecution,
        ensureCorrectSetPiecePlacement,
        assignSetPieceKicker,
        getCornerKickPosition,
        getGoalKickPosition,
        configureSetPieceRoutines,
        executeSetPiece_Router
    };
    // Phase 10: Export UI components and main functions for dynamic onclick handlers
    window.switchSummaryTab = switchSummaryTab;
    window.switchSimulationMode = switchSimulationMode;
    window.addMatchToBatch = addMatchToBatch;
    window.CustomFixtureSimulator = CustomFixtureSimulator;
    window.startMatch = startMatch;
    window.resetMatch = resetMatch;
    window.handleFileUpload = handleFileUpload;
    // Initialize game state if it doesn't exist
    if (typeof window.gameState === 'undefined') {
        window.gameState = initializeGameState();
        console.log('✓ Game state initialized (TypeScript)');
    }
    // Validate physics realism in development
    if (window.location.hostname === 'localhost') {
        validatePhysicsRealism();
    }
    console.log('✅ Configuration exported to window (TypeScript)');
}
// Auto-export to window when module loads
exportToWindow();
// Export gameState for direct TypeScript module imports
export const gameState = typeof window !== 'undefined' && window.gameState
    ? window.gameState
    : initializeGameState();
//# sourceMappingURL=globalExports.js.map