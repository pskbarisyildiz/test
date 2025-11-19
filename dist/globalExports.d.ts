/**
 * Global Exports for Browser Compatibility
 * Exports all configuration and systems to window object
 *
 * This module ensures backward compatibility with the existing JavaScript architecture
 * that relies on global window object access
 */
import { GAME_LOOP, PHYSICS, BALL_PHYSICS, GAME_CONFIG, POSITION_CONFIGS, TACTICS, TEAM_STATE_MODIFIERS, BT_CONFIG, FORMATIONS, positionToRoleMap, getRoleFromPosition, drawGroundShadow, toggleOrientation, validatePhysicsRealism } from './config';
import type { GameState } from './types';
import { selectBestTeam, selectBestTactic, selectBestFormation, initializePlayers, getFormationPositions, applyFormationConstraint, getFormationPosition, initializeGameSetup } from './gameSetup';
import { getVisibleTeammates } from './ai/playerVision';
import { canPlayerActOnBall } from './ai/playerFirstTouch';
import { selectBestAttackingMovement } from './ai/MovementPatterns';
import { initFirstTouchStats } from './ai/playerFirstTouch';
import { ensureCorrectSetPiecePlacement, assignSetPieceKicker, getCornerKickPosition, getGoalKickPosition, positionForSetPiece_Unified, updatePlayerAI_V2_SetPieceEnhancement, executeSetPiece_PostExecution } from './setpieces/integration';
import { configureSetPieceRoutines, executeSetPiece_PreConfiguration } from './setpieces/config';
import { executeSetPiece_Router } from './setpieces/execution';
import { updatePlayerAI_V2 } from './core';
import { updatePhysics, assignBallChasers } from './physics';
import { getPlayerActivePosition } from './ai/movement';
import { getAttackingGoalX } from './utils/ui';
import { processPendingEvents, updateMatchStats, switchSides, resetAfterGoal, handleShotAttempt } from './main';
import { switchSummaryTab } from './ui/uiComponents';
import { switchSimulationMode, addMatchToBatch } from './ui/uiScreens';
import { CustomFixtureSimulator } from './batch-simulator';
import { startMatch, resetMatch, handleFileUpload, handleBallOutOfBounds, handleThrowIn } from './main';
declare global {
    interface Window {
        GAME_LOOP: typeof GAME_LOOP;
        PHYSICS: typeof PHYSICS;
        BALL_PHYSICS: typeof BALL_PHYSICS;
        GAME_CONFIG: typeof GAME_CONFIG;
        POSITION_CONFIGS: typeof POSITION_CONFIGS;
        TACTICS: typeof TACTICS;
        TEAM_STATE_MODIFIERS: typeof TEAM_STATE_MODIFIERS;
        BT_CONFIG: typeof BT_CONFIG;
        FORMATIONS: typeof FORMATIONS;
        positionToRoleMap: typeof positionToRoleMap;
        getRoleFromPosition: typeof getRoleFromPosition;
        drawGroundShadow: typeof drawGroundShadow;
        toggleOrientation: typeof toggleOrientation;
        validatePhysicsRealism: typeof validatePhysicsRealism;
        selectBestTeam: typeof selectBestTeam;
        selectBestTactic: typeof selectBestTactic;
        selectBestFormation: typeof selectBestFormation;
        initializePlayers: typeof initializePlayers;
        getFormationPositions: typeof getFormationPositions;
        applyFormationConstraint: typeof applyFormationConstraint;
        getFormationPosition: typeof getFormationPosition;
        initializeGameSetup: typeof initializeGameSetup;
        getVisibleTeammates: typeof getVisibleTeammates;
        canPlayerActOnBall: typeof canPlayerActOnBall;
        selectBestAttackingMovement: typeof selectBestAttackingMovement;
        initFirstTouchStats: typeof initFirstTouchStats;
        ensureCorrectSetPiecePlacement: typeof ensureCorrectSetPiecePlacement;
        assignSetPieceKicker: typeof assignSetPieceKicker;
        getCornerKickPosition: typeof getCornerKickPosition;
        getGoalKickPosition: typeof getGoalKickPosition;
        executeSetPiece_PostExecution: typeof executeSetPiece_PostExecution;
        positionForSetPiece_Unified: typeof positionForSetPiece_Unified;
        updatePlayerAI_V2_SetPieceEnhancement: typeof updatePlayerAI_V2_SetPieceEnhancement;
        configureSetPieceRoutines: typeof configureSetPieceRoutines;
        executeSetPiece_PreConfiguration: typeof executeSetPiece_PreConfiguration;
        executeSetPiece_Router: typeof executeSetPiece_Router;
        SetPieceIntegration: {
            positionForSetPiece_Unified: typeof positionForSetPiece_Unified;
            updatePlayerAI_V2_SetPieceEnhancement: typeof updatePlayerAI_V2_SetPieceEnhancement;
            executeSetPiece_PostExecution: typeof executeSetPiece_PostExecution;
            ensureCorrectSetPiecePlacement: typeof ensureCorrectSetPiecePlacement;
            configureSetPieceRoutines: typeof configureSetPieceRoutines;
            executeSetPiece_Router: typeof executeSetPiece_Router;
            [key: string]: any;
        };
        SetPieceEnforcement: any;
        updatePlayerAI_V2: typeof updatePlayerAI_V2;
        updatePhysics: typeof updatePhysics;
        assignBallChasers: typeof assignBallChasers;
        getPlayerActivePosition: typeof getPlayerActivePosition;
        getAttackingGoalX: typeof getAttackingGoalX;
        processPendingEvents: typeof processPendingEvents;
        updateMatchStats: typeof updateMatchStats;
        switchSides: typeof switchSides;
        resetAfterGoal: typeof resetAfterGoal;
        handleShotAttempt: typeof handleShotAttempt;
        switchSummaryTab: typeof switchSummaryTab;
        switchSimulationMode: typeof switchSimulationMode;
        addMatchToBatch: typeof addMatchToBatch;
        CustomFixtureSimulator: typeof CustomFixtureSimulator;
        startMatch: typeof startMatch;
        resetMatch: typeof resetMatch;
        handleFileUpload: typeof handleFileUpload;
        handleBallOutOfBounds: typeof handleBallOutOfBounds;
        handleThrowIn: typeof handleThrowIn;
        gameState: GameState;
    }
}
/**
 * Initialize global game state
 * Creates the central game state object if it doesn't exist
 */
export declare function initializeGameState(): GameState;
/**
 * Export all configuration to window object for browser compatibility
 */
export declare function exportToWindow(): void;
export declare const gameState: GameState;
//# sourceMappingURL=globalExports.d.ts.map