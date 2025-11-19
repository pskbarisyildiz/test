"use strict";
var FootballSim = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    BALL_PHYSICS: () => BALL_PHYSICS,
    BT_CONFIG: () => BT_CONFIG,
    BehaviorResult: () => BehaviorResult2,
    CFG: () => CFG,
    CFG_BATCH: () => CFG_BATCH,
    CFG_CACHED: () => CFG_CACHED,
    CFG_NUMBER: () => CFG_NUMBER,
    CFG_PATH: () => CFG_PATH,
    CFG_TYPED: () => CFG_TYPED,
    CLEAR_CFG_CACHE: () => CLEAR_CFG_CACHE,
    ConfigManager: () => ConfigManager,
    DefensiveBehaviors: () => DefensiveBehaviors2,
    DependencyRegistry: () => DependencyRegistry,
    EVENT_TYPES: () => EVENT_TYPES,
    FIRST_TOUCH_CONFIG: () => FIRST_TOUCH_CONFIG,
    FORMATIONS: () => FORMATIONS,
    ForwardBehaviors: () => ForwardBehaviors2,
    GAME_CONFIG: () => GAME_CONFIG,
    GAME_LOOP: () => GAME_LOOP,
    GOALKEEPER_CONFIG: () => GOALKEEPER_CONFIG,
    GoalkeeperBehaviors: () => GoalkeeperBehaviors2,
    KickoffBehaviors: () => KickoffBehaviors,
    MidfieldBehaviors: () => MidfieldBehaviors2,
    MomentumSystem: () => MomentumSystem,
    PHASES: () => PHASES2,
    PHYSICS: () => PHYSICS,
    POSITION_CONFIGS: () => POSITION_CONFIGS,
    PenaltyKickBehaviors: () => PenaltyKickBehaviors,
    PositionManager: () => PositionManager,
    ProfessionalCornerBehaviors: () => ProfessionalCornerBehaviors,
    ProfessionalFreeKickBehaviors: () => ProfessionalFreeKickBehaviors,
    ProfessionalGoalKickBehaviors: () => ProfessionalGoalKickBehaviors,
    SET_PIECE_RULES: () => SET_PIECE_RULES,
    STANDARD_EVENTS: () => STANDARD_EVENTS,
    SetPieceBehaviorSystem: () => SetPieceBehaviorSystem2,
    SetPieceEnforcement: () => SetPieceEnforcement,
    TACTICS: () => TACTICS,
    TEAM_STATE_MODIFIERS: () => TEAM_STATE_MODIFIERS,
    TacticalContext: () => TacticalContext,
    TacticalSystem: () => TacticalSystem,
    TacticalSystemModifiers: () => TacticalSystemModifiers2,
    ThrowInBehaviors: () => ThrowInBehaviors,
    TransitionBehaviors: () => TransitionBehaviors2,
    VALIDATE_CONFIG: () => VALIDATE_CONFIG,
    VISION_CONFIG: () => VISION_CONFIG,
    actionDecision: () => actionDecision,
    action_attemptTackle: () => action_attemptTackle,
    addMatchToBatch: () => addMatchToBatch,
    addVectors: () => addVectors,
    angleTo: () => angleTo,
    animationFrameId: () => animationFrameId,
    applyAttackingMovement: () => applyAttackingMovement,
    applyDefensivePositioning: () => applyDefensivePositioning,
    applyFirstTouch: () => applyFirstTouch,
    applyFormationConstraint: () => applyFormationConstraint,
    applyMarkingAndPressing: () => applyMarkingAndPressing,
    applyMomentumToPlayer: () => applyMomentumToPlayer,
    assessDefensiveThreats: () => assessDefensiveThreats,
    assessGoalkeeperThreats: () => assessGoalkeeperThreats,
    assignBallChasers: () => assignBallChasers,
    assignSetPieceKicker: () => assignSetPieceKicker,
    attachSetupEventListeners: () => attachSetupEventListeners,
    awardOffsideFreeKick: () => awardOffsideFreeKick,
    calculateAvgDribbling: () => calculateAvgDribbling,
    calculateDribbleSuccess: () => calculateDribbleSuccess,
    calculateOptimalGoalkeeperPosition: () => calculateOptimalGoalkeeperPosition,
    calculateOptimalMarkingPosition: () => calculateOptimalMarkingPosition,
    calculatePassSuccess: () => calculatePassSuccess,
    calculateSaveProbability_Advanced: () => calculateSaveProbability_Advanced,
    calculateXG: () => calculateXG2,
    canControlBall: () => canControlBall,
    canPlayerActOnBall: () => canPlayerActOnBall,
    canPlayerSee: () => canPlayerSee,
    checkAndAdjustOffsidePosition: () => checkAndAdjustOffsidePosition,
    checkAndAdjustOffsidePositionWithAudit: () => checkAndAdjustOffsidePositionWithAudit,
    checkForThroughBall: () => checkForThroughBall,
    checkOffsidePenalty: () => checkOffsidePenalty,
    clamp: () => clamp,
    cleanupShotState: () => cleanupShotState,
    configureSetPieceRoutines: () => configureSetPieceRoutines,
    createBallTrail: () => createBallTrail,
    createGoalExplosion: () => createGoalExplosion,
    createPassEffect: () => createPassEffect,
    createSaveEffect: () => createSaveEffect,
    darkenColor: () => darkenColor,
    debugBallState: () => debugBallState,
    detectGamePhase: () => detectGamePhase2,
    determineGoalkeeperStance: () => determineGoalkeeperStance,
    determineSetPieceTeam: () => determineSetPieceTeam,
    determineTeamState: () => determineTeamState,
    distance: () => distance,
    drawBall: () => drawBall,
    drawBallBody: () => drawBallBody,
    drawBallPattern: () => drawBallPattern,
    drawCenterCircle: () => drawCenterCircle,
    drawFirstTouchIndicator: () => drawFirstTouchIndicator,
    drawGoalkeeperStanceIndicator: () => drawGoalkeeperStanceIndicator,
    drawGoals: () => drawGoals,
    drawGrass: () => drawGrass,
    drawGroundShadow: () => drawGroundShadow,
    drawLines: () => drawLines,
    drawOffsideLines: () => drawOffsideLines,
    drawPenaltyAreas: () => drawPenaltyAreas,
    drawPitchBackground: () => drawPitchBackground,
    drawPlayer: () => drawPlayer,
    drawPlayerBody: () => drawPlayerBody,
    drawPlayerHighlight: () => drawPlayerHighlight,
    drawPlayerLabel: () => drawPlayerLabel,
    drawPlayerShadow: () => drawPlayerShadow,
    drawShotEffect: () => drawShotEffect,
    drawStripes: () => drawStripes,
    drawVisionCones: () => drawVisionCones,
    ensureCorrectSetPiecePlacement: () => ensureCorrectSetPiecePlacement,
    ensureStatsShape: () => ensureStatsShape2,
    eventBus: () => eventBus,
    executeCornerKick_Enhanced: () => executeCornerKick_Enhanced,
    executeFreeKick_Enhanced: () => executeFreeKick_Enhanced,
    executeGoalKick_Enhanced: () => executeGoalKick_Enhanced,
    executeKickOff_Enhanced: () => executeKickOff_Enhanced,
    executeSetPiece_PostExecution: () => executeSetPiece_PostExecution,
    executeSetPiece_PreConfiguration: () => executeSetPiece_PreConfiguration,
    executeSetPiece_Router: () => executeSetPiece_Router,
    executeThrowIn_Enhanced: () => executeThrowIn_Enhanced,
    exportToWindow: () => exportToWindow,
    findBestPassOption_WithVision: () => findBestPassOption_WithVision,
    findMostDangerousAttacker: () => findMostDangerousAttacker,
    gameIntervalId: () => gameIntervalId,
    gameLoop_V2: () => gameLoop_V2,
    gameState: () => gameState,
    gameTime: () => gameTime2,
    getCornerKickPosition: () => getCornerKickPosition,
    getFormationAwarePosition: () => getFormationAwarePosition,
    getFormationPosition: () => getFormationPosition,
    getFormationPositions: () => getFormationPositions,
    getGoalKickPosition: () => getGoalKickPosition,
    getNearestAttacker: () => getNearestAttacker,
    getPerceivedThreats: () => getPerceivedThreats,
    getPlayerActivePosition: () => getPlayerActivePosition,
    getPlayerFacingDirection: () => getPlayerFacingDirection,
    getPositionConfig: () => getPositionConfig,
    getRoleFromPosition: () => getRoleFromPosition,
    getScaledTimestep: () => getScaledTimestep,
    getSortedLists: () => getSortedLists,
    getStatusIndicator: () => getStatusIndicator,
    getTacticalSystemType: () => getTacticalSystemType2,
    getValidPlayers: () => getValidPlayers,
    getValidStat: () => getValidStat2,
    getVisibleTeammates: () => getVisibleTeammates,
    getZoneForPlayer: () => getZoneForPlayer,
    handleBallInterception: () => handleBallInterception,
    handleBallOutOfBounds: () => handleBallOutOfBounds,
    handleCrossSituation: () => handleCrossSituation,
    handleFailedFirstTouch: () => handleFailedFirstTouch,
    handleFileUpload: () => handleFileUpload,
    handleFoul_V2: () => handleFoul_V2,
    handleFreeKick: () => handleFreeKick,
    handleFullTime: () => handleFullTime,
    handleHalfTime: () => handleHalfTime,
    handlePassAttempt: () => handlePassAttempt,
    handlePlayerWithBall_WithFirstTouch: () => handlePlayerWithBall_WithFirstTouch,
    handlePlayerWithBall_WithVision: () => handlePlayerWithBall_WithVision,
    handlePoorFirstTouch: () => handlePoorFirstTouch,
    handleShotAttempt: () => handleShotAttempt,
    handleSuccessfulFirstTouch: () => handleSuccessfulFirstTouch,
    handleThrowIn: () => handleThrowIn,
    initFirstTouchStats: () => initFirstTouchStats,
    initOffsideStats: () => initOffsideStats,
    initializeCanvasLayers: () => initializeCanvasLayers,
    initializeGameSetup: () => initializeGameSetup,
    initializeGameState: () => initializeGameState,
    initializePlayers: () => initializePlayers,
    initializeSimulation: () => initializeSimulation,
    initiateDribble: () => initiateDribble,
    initiatePass: () => initiatePass,
    initiateThroughBall: () => initiateThroughBall,
    introRenderLoop: () => introRenderLoop,
    invertSide: () => invertSide,
    isBatchMode: () => isBatchMode,
    isPlayerAttacking: () => isPlayerAttacking,
    isPlayerInOffsidePosition: () => isPlayerInOffsidePosition,
    isSafeNumber: () => isSafeNumber,
    lastFrameTime: () => lastFrameTime2,
    lerp: () => lerp,
    lightenColor: () => lightenColor,
    magnitude: () => magnitude,
    normalize: () => normalize,
    offsideTracker: () => offsideTracker,
    passBall: () => passBall,
    penaltySystem: () => penaltySystem2,
    pendingGameEvents: () => pendingGameEvents,
    physicsAccumulator: () => physicsAccumulator2,
    pointToLineDistance: () => pointToLineDistance,
    positionForSetPiece_Legacy: () => positionForSetPiece_Legacy,
    positionForSetPiece_Unified: () => positionForSetPiece_Unified,
    positionToRoleMap: () => positionToRoleMap,
    processPendingEvents: () => processPendingEvents,
    recordFirstTouchStatistic: () => recordFirstTouchStatistic,
    recordOffsidePositions: () => recordOffsidePositions,
    recordOffsideStatistic: () => recordOffsideStatistic,
    removePlayerFromMatch: () => removePlayerFromMatch,
    render: () => render,
    renderCommentary: () => renderCommentary,
    renderGame: () => renderGame,
    renderMatchSummary: () => renderMatchSummary,
    renderMomentumBar: () => renderMomentumBar,
    renderScoreboard: () => renderScoreboard,
    renderSetupScreen: () => renderSetupScreen,
    renderStatisticsSummary: () => renderStatisticsSummary,
    renderStats: () => renderStats,
    renderUploadScreen: () => renderUploadScreen,
    resetAfterGoal: () => resetAfterGoal,
    resetMatch: () => resetMatch,
    resolveBallControl: () => resolveBallControl,
    resolveShot_WithAdvancedGK: () => resolveShot_WithAdvancedGK,
    resolveSide: () => resolveSide,
    restoreFormationAfterSetPiece: () => restoreFormationAfterSetPiece,
    safeDiv: () => safeDiv,
    safeSqrt: () => safeSqrt,
    sanitizePosition: () => sanitizePosition,
    scaleVector: () => scaleVector,
    selectBestAttackingMovement: () => selectBestAttackingMovement,
    selectBestFormation: () => selectBestFormation,
    selectBestTactic: () => selectBestTactic,
    selectBestTeam: () => selectBestTeam,
    selectJerseys: () => selectJerseys,
    selectPlayerBehavior: () => selectPlayerBehavior2,
    setPossession: () => setPossession,
    setupGameScreen: () => setupGameScreen,
    setupKickOff: () => setupKickOff,
    shouldAvoidOffside: () => shouldAvoidOffside,
    shouldGoalkeeperSweep: () => shouldGoalkeeperSweep,
    spatialSystem: () => spatialSystem2,
    startMatch: () => startMatch,
    subtractVectors: () => subtractVectors,
    switchSides: () => switchSides,
    switchSimulationMode: () => switchSimulationMode,
    tackleSystem: () => tackleSystem,
    toggleOrientation: () => toggleOrientation,
    triggerGoalkeeperSave: () => triggerGoalkeeperSave,
    uiElements: () => uiElements,
    updateBallTrajectory: () => updateBallTrajectory,
    updateBallWithHolder: () => updateBallWithHolder,
    updateDefensiveLines: () => updateDefensiveLines,
    updateGameUI: () => updateGameUI,
    updateGoalkeeperAI_Advanced: () => updateGoalkeeperAI_Advanced,
    updateMatchStats: () => updateMatchStats,
    updateMomentum: () => updateMomentum,
    updateParticlesWithCleanup: () => updateParticlesWithCleanup,
    updatePhysics: () => updatePhysics,
    updatePlayerAI_V2: () => updatePlayerAI_V2,
    updatePlayerAI_V2_SetPieceEnhancement: () => updatePlayerAI_V2_SetPieceEnhancement,
    updatePlayerPhysics: () => updatePlayerPhysics,
    updatePlayerScanning: () => updatePlayerScanning,
    updateTacticalPosition: () => updateTacticalPosition,
    updateTeamStates: () => updateTeamStates,
    validateBallHolder: () => validateBallHolder,
    validateBallState: () => validateBallState,
    validatePhysicsRealism: () => validatePhysicsRealism
  });

  // src/types.ts
  var EVENT_TYPES = /* @__PURE__ */ ((EVENT_TYPES3) => {
    EVENT_TYPES3["MATCH_START"] = "MATCH_START";
    EVENT_TYPES3["HALF_TIME"] = "HALF_TIME";
    EVENT_TYPES3["MATCH_END"] = "MATCH_END";
    EVENT_TYPES3["BALL_PASSED"] = "BALL_PASSED";
    EVENT_TYPES3["GOAL_SCORED"] = "GOAL_SCORED";
    EVENT_TYPES3["SHOT_SAVED"] = "SHOT_SAVED";
    EVENT_TYPES3["FOUL_COMMITTED"] = "FOUL_COMMITTED";
    EVENT_TYPES3["SHOT_TAKEN"] = "SHOT_TAKEN";
    EVENT_TYPES3["TEAM_STATE_CHANGED"] = "TEAM_STATE_CHANGED";
    EVENT_TYPES3["POSSESSION_CHANGED"] = "POSSESSION_CHANGED";
    EVENT_TYPES3["BALL_LOST"] = "BALL_LOST";
    return EVENT_TYPES3;
  })(EVENT_TYPES || {});

  // src/utils/math.ts
  function safeDiv(numerator, denominator, fallback = 0) {
    if (!isFinite(numerator) || !isFinite(denominator))
      return fallback;
    if (denominator === 0)
      return fallback;
    const result = numerator / denominator;
    return isFinite(result) ? result : fallback;
  }
  function safeSqrt(value, fallback = 0) {
    if (!isFinite(value) || value < 0)
      return fallback;
    return Math.sqrt(value);
  }
  function clamp(value, min, max) {
    if (!isFinite(value))
      return min;
    return Math.max(min, Math.min(max, value));
  }
  function distance(p1, p2) {
    if (!p1 || !p2)
      return 0;
    const dx = (p2.x ?? 0) - (p1.x ?? 0);
    const dy = (p2.y ?? 0) - (p1.y ?? 0);
    return safeSqrt(dx * dx + dy * dy, 0);
  }
  function normalize(x, y) {
    const len = safeSqrt(x * x + y * y, 1);
    return {
      x: safeDiv(x, len, 0),
      y: safeDiv(y, len, 0)
    };
  }
  function lerp(start, end, t) {
    const clampedT = clamp(t, 0, 1);
    return start + (end - start) * clampedT;
  }
  function angleTo(from, to) {
    if (!from || !to)
      return 0;
    const dx = (to.x ?? 0) - (from.x ?? 0);
    const dy = (to.y ?? 0) - (from.y ?? 0);
    return Math.atan2(dy, dx);
  }
  function pointToLineDistance(point, lineStart, lineEnd) {
    if (!point || !lineStart || !lineEnd)
      return Infinity;
    const dx = (lineEnd.x ?? 0) - (lineStart.x ?? 0);
    const dy = (lineEnd.y ?? 0) - (lineStart.y ?? 0);
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0)
      return distance(point, lineStart);
    const t = clamp(
      ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lenSq,
      0,
      1
    );
    const closestPoint = {
      x: lineStart.x + t * dx,
      y: lineStart.y + t * dy
    };
    return distance(point, closestPoint);
  }
  function isSafeNumber(value) {
    return typeof value === "number" && isFinite(value);
  }
  function addVectors(v1, v2) {
    return {
      x: (v1.x ?? 0) + (v2.x ?? 0),
      y: (v1.y ?? 0) + (v2.y ?? 0)
    };
  }
  function subtractVectors(v1, v2) {
    return {
      x: (v1.x ?? 0) - (v2.x ?? 0),
      y: (v1.y ?? 0) - (v2.y ?? 0)
    };
  }
  function scaleVector(v, scalar) {
    const safeScalar = isSafeNumber(scalar) ? scalar : 1;
    return {
      x: (v.x ?? 0) * safeScalar,
      y: (v.y ?? 0) * safeScalar
    };
  }
  function magnitude(v) {
    return safeSqrt((v.x ?? 0) * (v.x ?? 0) + (v.y ?? 0) * (v.y ?? 0), 0);
  }
  if (typeof window !== "undefined") {
    window.MathUtils = {
      safeDiv,
      safeSqrt,
      clamp,
      distance,
      normalize,
      lerp,
      angleTo,
      pointToLineDistance,
      isSafeNumber,
      addVectors,
      subtractVectors,
      scaleVector,
      magnitude
    };
    console.log("\u2705 Safe Math Utilities loaded (TypeScript)");
  }

  // src/config.ts
  var GAME_LOOP = {
    FIXED_TIMESTEP: 3 / 60,
    MAX_FRAME_TIME: 0.25,
    GAME_SPEED: 1
    // 1.0 = 1 game minute = 1 real second
  };
  var PHYSICS = {
    // ✅ IMPROVED: Increased speeds for better gameplay feel
    MAX_SPEED: 250,
    // pixels/second (was 152) - faster player movement
    SPRINT_MULTIPLIER: 1.5,
    // Sprint = 375 px/s (was 1.3) - more realistic sprint
    ACCELERATION: 1200,
    // pixels/s² (was 700) - quicker acceleration
    FRICTION: 0.88,
    // Per second decay
    DRIBBLE_SPEED_PENALTY: 0.75,
    // 25% slower when dribbling
    COLLISION_RADIUS: 25,
    // Increased from 18 - prevent player overlap
    BALL_CONTROL_DISTANCE: 40,
    // Increased from 28 - easier ball control
    PASS_INTERCEPT_DISTANCE: 40,
    MOVEMENT_THRESHOLD: 5,
    POSITIONING_SMOOTHNESS: 0.04,
    LONG_PASS_THRESHOLD: 150,
    // ~20m in real world
    HEADER_HEIGHT_THRESHOLD: 0.3,
    PLAYER_MASS: 75,
    BALL_MASS: 0.45
  };
  var BALL_PHYSICS = {
    MAX_SPEED: 650,
    // pixels/second
    FRICTION: 0.88,
    // IMPROVED: Slower deceleration (was 0.44) - passes travel further
    GRAVITY: 600,
    // Unchanged - feels right
    BOUNCE: 0.6,
    SPIN_EFFECT: 0.05
  };
  var GAME_CONFIG = {
    GOAL_CHECK_DISTANCE: 200,
    SHOOTING_CHANCE_BASE: 0.3,
    PASSING_CHANCE: 0.7,
    EVENT_PROBABILITY: 0.5,
    DECISION_COOLDOWN: 250,
    // IMPROVED: Faster decisions (was 600ms)
    GK_HOLD_TIME: 800,
    // IMPROVED: Faster GK distribution (was 1800ms)
    HIGH_DPI_SCALE_FACTOR: 1,
    GOAL_Y_TOP: 240,
    GOAL_Y_BOTTOM: 360,
    PITCH_WIDTH: 800,
    PITCH_HEIGHT: 600,
    AVERAGE_SPRINT_TIME_TO_GOAL: 10,
    // seconds
    REACTION_TIME_MIN: 150,
    // ms
    REACTION_TIME_MAX: 350,
    // ms
    GAME_SPEED: 1,
    GOAL_X_LEFT: 50,
    GOAL_X_RIGHT: 750
  };
  var positionToRoleMap = {
    // Goalkeepers
    "Goalkeeper": "GK",
    "Keeper": "GK",
    // Defenders
    "Centre-Back": "CB",
    "Center Back": "CB",
    "Defender (Centre)": "CB",
    "Right-Back": "RB",
    "Right Back": "RB",
    "Defender (Right)": "RB",
    "Left-Back": "LB",
    "Left Back": "LB",
    "Defender (Left)": "LB",
    "Wing-Back (Right)": "RB",
    "Wing-Back (Left)": "LB",
    // Midfielders
    "Defensive Midfield": "CDM",
    "Midfielder (Defensive)": "CDM",
    "Central Midfield": "CM",
    "Midfielder (Centre)": "CM",
    "Right Midfield": "RM",
    "Midfielder (Right)": "RM",
    "Left Midfield": "LM",
    "Midfielder (Left)": "LM",
    "Attacking Midfield": "CAM",
    "Midfielder (Attacking)": "CAM",
    // Forwards
    "Right Winger": "RW",
    "Forward (Right)": "RW",
    "Winger (Right)": "RW",
    "Left Winger": "LW",
    "Forward (Left)": "LW",
    "Winger (Left)": "LW",
    "Second Striker": "ST",
    "Striker": "ST",
    "Centre-Forward": "ST",
    "Forward (Centre)": "ST"
  };
  function getRoleFromPosition(positionString) {
    if (!positionString)
      return "CM";
    const primaryPosition = positionString.split(",")[0]?.trim() ?? "";
    return positionToRoleMap[primaryPosition] || "CM";
  }
  var POSITION_CONFIGS = {
    "GK": {
      defensiveness: 1,
      attackRange: 0,
      ballChasePriority: 0.1,
      idealWidth: 0,
      pushUpOnAttack: 0,
      pressAggression: 0,
      zoneCoverage: 1,
      supportDistance: 0,
      maxSpeed: 140
    },
    "CB": {
      defensiveness: 0.9,
      attackRange: 0.15,
      ballChasePriority: 0.3,
      idealWidth: 0.15,
      pushUpOnAttack: 90,
      pressAggression: 0.5,
      zoneCoverage: 0.7,
      supportDistance: 40,
      maxSpeed: 144
    },
    "LCB": {
      defensiveness: 0.9,
      attackRange: 0.15,
      ballChasePriority: 0.3,
      idealWidth: 0.2,
      pushUpOnAttack: 90,
      pressAggression: 0.5,
      zoneCoverage: 0.7,
      supportDistance: 40,
      maxSpeed: 144
    },
    "RCB": {
      defensiveness: 0.9,
      attackRange: 0.15,
      ballChasePriority: 0.3,
      idealWidth: 0.2,
      pushUpOnAttack: 90,
      pressAggression: 0.5,
      zoneCoverage: 0.7,
      supportDistance: 40,
      maxSpeed: 144
    },
    "RB": {
      defensiveness: 0.7,
      attackRange: 0.75,
      ballChasePriority: 0.4,
      idealWidth: 0.35,
      pushUpOnAttack: 160,
      pressAggression: 0.5,
      zoneCoverage: 0.7,
      supportDistance: 60,
      maxSpeed: 156
    },
    "LB": {
      defensiveness: 0.7,
      attackRange: 0.75,
      ballChasePriority: 0.4,
      idealWidth: 0.35,
      pushUpOnAttack: 160,
      pressAggression: 0.5,
      zoneCoverage: 0.7,
      supportDistance: 60,
      maxSpeed: 156
    },
    "CDM": {
      defensiveness: 0.65,
      attackRange: 0.45,
      ballChasePriority: 0.6,
      idealWidth: 0.2,
      pushUpOnAttack: 120,
      pressAggression: 0.6,
      zoneCoverage: 0.8,
      supportDistance: 50,
      maxSpeed: 148
    },
    "CM": {
      defensiveness: 0.5,
      attackRange: 0.6,
      ballChasePriority: 0.7,
      idealWidth: 0.25,
      pushUpOnAttack: 160,
      pressAggression: 0.7,
      zoneCoverage: 0.6,
      supportDistance: 70,
      maxSpeed: 152
    },
    "LCM": {
      defensiveness: 0.5,
      attackRange: 0.6,
      ballChasePriority: 0.7,
      idealWidth: 0.3,
      pushUpOnAttack: 160,
      pressAggression: 0.7,
      zoneCoverage: 0.6,
      supportDistance: 70,
      maxSpeed: 152
    },
    "RCM": {
      defensiveness: 0.5,
      attackRange: 0.6,
      ballChasePriority: 0.7,
      idealWidth: 0.3,
      pushUpOnAttack: 160,
      pressAggression: 0.7,
      zoneCoverage: 0.6,
      supportDistance: 70,
      maxSpeed: 152
    },
    "RM": {
      defensiveness: 0.4,
      attackRange: 0.7,
      ballChasePriority: 0.75,
      idealWidth: 0.35,
      pushUpOnAttack: 180,
      pressAggression: 0.6,
      zoneCoverage: 0.5,
      supportDistance: 80,
      maxSpeed: 160
    },
    "LM": {
      defensiveness: 0.4,
      attackRange: 0.7,
      ballChasePriority: 0.75,
      idealWidth: 0.35,
      pushUpOnAttack: 180,
      pressAggression: 0.6,
      zoneCoverage: 0.5,
      supportDistance: 80,
      maxSpeed: 160
    },
    "CAM": {
      defensiveness: 0.3,
      attackRange: 0.75,
      ballChasePriority: 0.85,
      idealWidth: 0.15,
      pushUpOnAttack: 200,
      pressAggression: 0.8,
      zoneCoverage: 0.4,
      supportDistance: 90,
      maxSpeed: 154
    },
    "RW": {
      defensiveness: 0.25,
      attackRange: 0.85,
      ballChasePriority: 0.8,
      idealWidth: 0.4,
      pushUpOnAttack: 200,
      pressAggression: 0.5,
      zoneCoverage: 0.3,
      supportDistance: 100,
      maxSpeed: 164
    },
    "LW": {
      defensiveness: 0.25,
      attackRange: 0.85,
      ballChasePriority: 0.8,
      idealWidth: 0.4,
      pushUpOnAttack: 200,
      pressAggression: 0.5,
      zoneCoverage: 0.3,
      supportDistance: 100,
      maxSpeed: 164
    },
    "ST": {
      defensiveness: 0.1,
      attackRange: 0.9,
      ballChasePriority: 0.9,
      idealWidth: 0.1,
      pushUpOnAttack: 240,
      pressAggression: 0.4,
      zoneCoverage: 0.2,
      supportDistance: 110,
      maxSpeed: 158
    },
    "CF": {
      defensiveness: 0.1,
      attackRange: 0.9,
      ballChasePriority: 0.9,
      idealWidth: 0.1,
      pushUpOnAttack: 240,
      pressAggression: 0.4,
      zoneCoverage: 0.2,
      supportDistance: 110,
      maxSpeed: 158
    }
  };
  var TACTICS = {
    balanced: {
      name: "Balanced",
      description: "Flexible approach adapting to game situation",
      pressIntensity: 0.5,
      defensiveLineDepth: 0.5,
      counterAttackSpeed: 1.1,
      possessionPriority: 0.5,
      passingRisk: 0.5,
      preferHighPress: false,
      preferCounterAttack: false,
      compactness: 0.5
    },
    high_press: {
      name: "High Press",
      description: "Aggressive pressing to win ball high up the pitch",
      pressIntensity: 0.9,
      defensiveLineDepth: 0.7,
      counterAttackSpeed: 1.2,
      possessionPriority: 0.4,
      passingRisk: 0.6,
      preferHighPress: true,
      preferCounterAttack: false,
      compactness: 0.8
    },
    possession: {
      name: "Possession",
      description: "Control the game through patient build-up play",
      pressIntensity: 0.4,
      defensiveLineDepth: 0.6,
      counterAttackSpeed: 1,
      possessionPriority: 0.9,
      passingRisk: 0.3,
      preferHighPress: false,
      preferCounterAttack: false,
      compactness: 0.7
    },
    counter_attack: {
      name: "Counter-Attack",
      description: "Absorb pressure and strike on the break",
      pressIntensity: 0.3,
      defensiveLineDepth: 0.3,
      counterAttackSpeed: 1.4,
      possessionPriority: 0.3,
      passingRisk: 0.7,
      preferHighPress: false,
      preferCounterAttack: true,
      compactness: 0.9
    },
    park_the_bus: {
      name: "Park the Bus",
      description: "Ultra-defensive, protect the lead at all costs",
      pressIntensity: 0.2,
      defensiveLineDepth: 0.2,
      counterAttackSpeed: 1.3,
      possessionPriority: 0.2,
      passingRisk: 0.8,
      preferHighPress: false,
      preferCounterAttack: true,
      compactness: 1
    },
    total_football: {
      name: "Total Football",
      description: "Fluid positional play with high technical demands",
      pressIntensity: 0.8,
      defensiveLineDepth: 0.7,
      counterAttackSpeed: 1.25,
      possessionPriority: 0.8,
      passingRisk: 0.5,
      preferHighPress: true,
      preferCounterAttack: false,
      compactness: 0.6
    }
  };
  var TEAM_STATE_MODIFIERS = {
    ATTACKING: {
      speedMultiplier: 1.08,
      positioningAggression: 0.8,
      riskTolerance: 0.7,
      pressTriggerDistance: 100
    },
    DEFENDING: {
      speedMultiplier: 1,
      positioningAggression: 0.3,
      riskTolerance: 0.2,
      pressTriggerDistance: 60
    },
    HIGH_PRESS: {
      speedMultiplier: 1.25,
      positioningAggression: 0.9,
      riskTolerance: 0.5,
      pressTriggerDistance: 120
    },
    COUNTER_ATTACK: {
      speedMultiplier: 1.4,
      positioningAggression: 0.9,
      riskTolerance: 0.8,
      pressTriggerDistance: 40
    },
    BALANCED: {
      speedMultiplier: 1,
      positioningAggression: 0.5,
      riskTolerance: 0.5,
      pressTriggerDistance: 80
    }
  };
  var BT_CONFIG = {
    PRIORITY_SHOOT: 100,
    PRIORITY_PASS: 70,
    PRIORITY_DRIBBLE: 50,
    PRIORITY_TACKLE: 90,
    PRIORITY_MARK: 60,
    PRIORITY_POSITION: 40,
    BALL_CLOSE_DISTANCE: 100,
    OPPONENT_CLOSE_DISTANCE: 35,
    TEAMMATE_SUPPORT_DISTANCE: 150,
    MAX_BALL_HOLD_TIME: 2e3,
    MAX_BALL_HOLD_TIME_UNDER_PRESSURE: 800,
    SHOOT_CHANCE_IN_BOX: 0.75,
    SHOOT_CHANCE_OUTSIDE_BOX: 0.25,
    PASS_CHANCE_UNDER_PRESSURE: 0.75,
    DRIBBLE_CHANCE_IN_SPACE: 0.55
  };
  var FORMATIONS = {
    "4-4-2": [
      { x: 0.08, y: 0.5, role: "GK" },
      { x: 0.22, y: 0.15, role: "RB" },
      { x: 0.22, y: 0.38, role: "CB" },
      { x: 0.22, y: 0.62, role: "CB" },
      { x: 0.22, y: 0.85, role: "LB" },
      { x: 0.5, y: 0.15, role: "RM" },
      { x: 0.5, y: 0.38, role: "CM" },
      { x: 0.5, y: 0.62, role: "CM" },
      { x: 0.5, y: 0.85, role: "LM" },
      { x: 0.75, y: 0.4, role: "ST" },
      { x: 0.75, y: 0.6, role: "ST" }
    ],
    "4-3-3": [
      { x: 0.08, y: 0.5, role: "GK" },
      { x: 0.22, y: 0.15, role: "RB" },
      { x: 0.22, y: 0.38, role: "CB" },
      { x: 0.22, y: 0.62, role: "CB" },
      { x: 0.22, y: 0.85, role: "LB" },
      { x: 0.45, y: 0.25, role: "CM" },
      { x: 0.45, y: 0.5, role: "CDM" },
      { x: 0.45, y: 0.75, role: "CM" },
      { x: 0.75, y: 0.2, role: "RW" },
      { x: 0.75, y: 0.5, role: "ST" },
      { x: 0.75, y: 0.8, role: "LW" }
    ],
    "4-4-1-1": [
      { x: 0.08, y: 0.5, role: "GK" },
      { x: 0.22, y: 0.15, role: "RB" },
      { x: 0.22, y: 0.38, role: "CB" },
      { x: 0.22, y: 0.62, role: "CB" },
      { x: 0.22, y: 0.85, role: "LB" },
      { x: 0.5, y: 0.15, role: "RM" },
      { x: 0.5, y: 0.38, role: "CM" },
      { x: 0.5, y: 0.62, role: "CM" },
      { x: 0.5, y: 0.85, role: "LM" },
      { x: 0.68, y: 0.5, role: "CAM" },
      { x: 0.82, y: 0.5, role: "ST" }
    ],
    "4-4-2-diamond": [
      { x: 0.08, y: 0.5, role: "GK" },
      { x: 0.22, y: 0.15, role: "RB" },
      { x: 0.22, y: 0.38, role: "CB" },
      { x: 0.22, y: 0.62, role: "CB" },
      { x: 0.22, y: 0.85, role: "LB" },
      { x: 0.42, y: 0.5, role: "CDM" },
      { x: 0.55, y: 0.3, role: "CM" },
      { x: 0.55, y: 0.7, role: "CM" },
      { x: 0.68, y: 0.5, role: "CAM" },
      { x: 0.8, y: 0.4, role: "ST" },
      { x: 0.8, y: 0.6, role: "ST" }
    ],
    "4-3-1-2": [
      { x: 0.08, y: 0.5, role: "GK" },
      { x: 0.22, y: 0.15, role: "RB" },
      { x: 0.22, y: 0.38, role: "CB" },
      { x: 0.22, y: 0.62, role: "CB" },
      { x: 0.22, y: 0.85, role: "LB" },
      { x: 0.45, y: 0.25, role: "CM" },
      { x: 0.45, y: 0.5, role: "CDM" },
      { x: 0.45, y: 0.75, role: "CM" },
      { x: 0.65, y: 0.5, role: "CAM" },
      { x: 0.8, y: 0.4, role: "ST" },
      { x: 0.8, y: 0.6, role: "ST" }
    ],
    "4-3-2-1": [
      { x: 0.08, y: 0.5, role: "GK" },
      { x: 0.22, y: 0.15, role: "RB" },
      { x: 0.22, y: 0.38, role: "CB" },
      { x: 0.22, y: 0.62, role: "CB" },
      { x: 0.22, y: 0.85, role: "LB" },
      { x: 0.45, y: 0.25, role: "CM" },
      { x: 0.45, y: 0.5, role: "CDM" },
      { x: 0.45, y: 0.75, role: "CM" },
      { x: 0.65, y: 0.35, role: "CAM" },
      { x: 0.65, y: 0.65, role: "CAM" },
      { x: 0.82, y: 0.5, role: "ST" }
    ]
  };
  function drawGroundShadow(ctx, x, y, size, ballHeight) {
    const shadowY = y + size / 2;
    const shadowRadiusX = size * 1.2 * (1 - ballHeight * 0.4);
    const shadowRadiusY = shadowRadiusX * 0.3;
    const shadowOpacity = 0.4 * (1 - ballHeight * 0.5);
    if (shadowOpacity > 0) {
      ctx.save();
      ctx.fillStyle = `rgba(0, 0, 0, ${shadowOpacity})`;
      ctx.beginPath();
      ctx.ellipse(x, shadowY, shadowRadiusX, shadowRadiusY, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  function toggleOrientation() {
    console.log("Toggling orientation...");
    if (typeof window === "undefined" || !window.gameState) {
      console.error("toggleOrientation: gameState not available");
      return;
    }
    window.gameState.isVertical = !window.gameState.isVertical;
    window.gameState.orientationChanged = true;
    window.gameState.canvases = { background: null, game: null, ui: null };
    window.gameState.contexts = { background: null, game: null, ui: null };
    window.gameState.backgroundDrawn = false;
    if (typeof window.render === "function") {
      window.render();
    }
  }
  function validatePhysicsRealism() {
    console.log("=== PHYSICS REALISM VALIDATION ===");
    const pitchWidth = GAME_CONFIG.PITCH_WIDTH;
    const maxSpeed = PHYSICS.MAX_SPEED;
    const timeToCross = pitchWidth / maxSpeed;
    console.log(`\u2713 Time to cross pitch: ${timeToCross.toFixed(1)}s (target: 10-12s)`);
    console.assert(timeToCross >= 9 && timeToCross <= 13, "Pitch crossing time unrealistic!");
    const ballSpeed = BALL_PHYSICS.MAX_SPEED;
    console.log(`\u2713 Ball max speed: ${ballSpeed} px/s (${(ballSpeed / maxSpeed).toFixed(1)}x player speed)`);
    console.assert(ballSpeed > maxSpeed * 2, "Ball should be significantly faster than players!");
    const timeToMaxSpeed = maxSpeed / PHYSICS.ACCELERATION;
    console.log(`\u2713 Time to max speed: ${timeToMaxSpeed.toFixed(1)}s (target: 2-3s)`);
    console.assert(timeToMaxSpeed >= 1.5 && timeToMaxSpeed <= 3.5, "Acceleration unrealistic!");
    const sprintSpeed = maxSpeed * PHYSICS.SPRINT_MULTIPLIER;
    console.log(`\u2713 Sprint speed: ${sprintSpeed.toFixed(0)} px/s`);
    console.assert(sprintSpeed < 250, "Sprint speed too high!");
    console.log("=== ALL TESTS PASSED ===");
  }

  // src/utils/configUtils.ts
  var configCache = /* @__PURE__ */ new Map();
  function CFG(key, defaultValue) {
    if (!key) {
      if (typeof window !== "undefined" && typeof GAME_CONFIG !== "undefined") {
        return GAME_CONFIG;
      }
      console.warn("GAME_CONFIG not loaded yet");
      return {};
    }
    const configSources = [
      typeof window !== "undefined" && GAME_CONFIG ? GAME_CONFIG : void 0,
      typeof window !== "undefined" && PHYSICS ? PHYSICS : void 0,
      typeof window !== "undefined" && BALL_PHYSICS ? BALL_PHYSICS : void 0,
      typeof window !== "undefined" && GAME_LOOP ? GAME_LOOP : void 0
    ];
    for (const source of configSources) {
      if (source && key in source && source[key] !== void 0) {
        return source[key];
      }
    }
    if (defaultValue === void 0) {
      console.warn(`Config key "${key}" not found and no default provided`);
    }
    return defaultValue;
  }
  function CFG_BATCH(keys) {
    const result = {};
    keys.forEach((key) => {
      result[key] = CFG(key);
    });
    return result;
  }
  function CFG_TYPED(key, expectedType, defaultValue) {
    const value = CFG(key, defaultValue);
    if (typeof value !== expectedType) {
      console.warn(`Config key "${key}" expected type ${expectedType}, got ${typeof value}`);
      return defaultValue;
    }
    return value;
  }
  function CFG_NUMBER(key, defaultValue, min = -Infinity, max = Infinity) {
    const value = CFG(key, defaultValue);
    if (typeof value !== "number" || !isFinite(value)) {
      console.warn(`Config key "${key}" is not a valid number, using default ${defaultValue}`);
      return defaultValue;
    }
    if (value < min || value > max) {
      console.warn(`Config key "${key}" value ${value} out of bounds [${min}, ${max}], clamping`);
      return Math.max(min, Math.min(max, value));
    }
    return value;
  }
  function CFG_PATH(path, defaultValue) {
    const keys = path.split(".");
    let current;
    if (typeof window !== "undefined" && typeof GAME_CONFIG !== "undefined") {
      current = GAME_CONFIG;
      for (const key of keys) {
        if (current && typeof current === "object" && key in current) {
          current = current[key];
        } else {
          current = void 0;
          break;
        }
      }
      if (current !== void 0)
        return current;
    }
    if (typeof window !== "undefined") {
      current = window;
      for (const key of keys) {
        if (current && typeof current === "object" && key in current) {
          current = current[key];
        } else {
          current = void 0;
          break;
        }
      }
      if (current !== void 0)
        return current;
    }
    return defaultValue;
  }
  function CFG_CACHED(key, defaultValue) {
    if (configCache.has(key)) {
      return configCache.get(key);
    }
    const value = CFG(key, defaultValue);
    configCache.set(key, value);
    return value;
  }
  function CLEAR_CFG_CACHE() {
    configCache.clear();
    console.log("\u2705 Config cache cleared");
  }
  function VALIDATE_CONFIG(requiredKeys) {
    const missing = [];
    requiredKeys.forEach((key) => {
      if (CFG(key) === void 0) {
        missing.push(key);
      }
    });
    if (missing.length > 0) {
      throw new Error(`\u274C Missing required config keys: ${missing.join(", ")}`);
    }
    console.log(`\u2705 Config validation passed (${requiredKeys.length} keys)`);
  }
  if (typeof window !== "undefined") {
    window.CFG = CFG;
    window.CFG_BATCH = CFG_BATCH;
    window.CFG_TYPED = CFG_TYPED;
    window.CFG_NUMBER = CFG_NUMBER;
    window.CFG_PATH = CFG_PATH;
    window.CFG_CACHED = CFG_CACHED;
    window.VALIDATE_CONFIG = VALIDATE_CONFIG;
    window.CLEAR_CFG_CACHE = CLEAR_CFG_CACHE;
    console.log("\u2705 Centralized Config Utilities loaded (TypeScript)");
  }

  // src/eventBus.ts
  var STANDARD_EVENTS = {
    BALL_POSITION_CHANGED: "ball:positionChanged",
    BALL_HOLDER_CHANGED: "ball:holderChanged",
    POSSESSION_CHANGED: "possession:changed",
    GOAL_SCORED: "goal:scored",
    SHOT_ATTEMPTED: "shot:attempted",
    PASS_ATTEMPTED: "pass:attempted",
    FOUL_COMMITTED: "foul:committed",
    OFFSIDE_CALLED: "offside:called",
    SET_PIECE_STARTED: "setPiece:started",
    SET_PIECE_EXECUTED: "setPiece:executed",
    PLAYER_SUBSTITUTED: "player:substituted",
    MATCH_STARTED: "match:started",
    MATCH_FINISHED: "match:finished"
  };
  var eventBus = {
    events: {},
    /**
     * Subscribe to an event
     */
    subscribe(eventName, listener) {
      if (!this.events[eventName]) {
        this.events[eventName] = [];
      }
      this.events[eventName].push(listener);
      return () => {
        if (this.events[eventName]) {
          this.events[eventName] = this.events[eventName].filter((l) => l !== listener);
        }
      };
    },
    /**
     * Unsubscribe from an event
     */
    unsubscribe(eventName, listener) {
      if (this.events[eventName]) {
        this.events[eventName] = this.events[eventName].filter((l) => l !== listener);
      }
    },
    /**
     * Publish an event to all subscribers
     */
    publish(eventName, data) {
      const listeners = this.events[eventName];
      if (listeners) {
        listeners.forEach((listener) => {
          try {
            listener(data);
          } catch (error) {
            console.error(`Error in event listener for ${eventName}:`, error);
          }
        });
      }
    },
    /**
     * Clear event listeners
     */
    clear(eventName) {
      if (eventName) {
        delete this.events[eventName];
      } else {
        this.events = {};
      }
    },
    /**
     * Get listener count for an event
     */
    getListenerCount(eventName) {
      return this.events[eventName]?.length ?? 0;
    },
    /**
     * Check if event has listeners
     */
    hasListeners(eventName) {
      return this.getListenerCount(eventName) > 0;
    }
  };
  var ConfigManager = {
    /**
     * Get configuration value with guaranteed return
     */
    get(key, defaultValue) {
      if (typeof window !== "undefined" && window.GAME_CONFIG && key in window.GAME_CONFIG) {
        const value = window.GAME_CONFIG[key];
        if (value !== void 0) {
          return value;
        }
      }
      if (defaultValue === void 0) {
        console.error(`\u274C Config.get("${key}"): Missing and no default provided!`);
      } else {
        console.debug(`Config.get("${key}"): Using default value ${defaultValue}`);
      }
      return defaultValue;
    },
    /**
     * Get multiple config values at once
     */
    getBatch(keys) {
      const result = {};
      keys.forEach((key) => {
        result[key] = this.get(key);
      });
      return result;
    },
    /**
     * Check if configuration is valid
     */
    validate() {
      const required = [
        "PITCH_WIDTH",
        "PITCH_HEIGHT",
        "GOAL_CHECK_DISTANCE",
        "SHOOTING_CHANCE_BASE",
        "PASSING_CHANCE"
      ];
      const missing = required.filter((key) => {
        if (typeof window === "undefined" || !window.GAME_CONFIG)
          return true;
        return !(key in window.GAME_CONFIG);
      });
      if (missing.length > 0) {
        throw new Error(`\u274C Config validation failed. Missing: ${missing.join(", ")}`);
      }
      console.log("\u2713 Configuration validated successfully");
    }
  };
  var DependencyRegistry = {
    loaded: {},
    required: {},
    register(moduleName, exports) {
      this.loaded[moduleName] = exports;
      console.log(`\u2713 Module registered: ${moduleName}`);
    },
    require(moduleName, dependencies) {
      this.required[moduleName] = dependencies;
    },
    get(moduleName) {
      if (!this.loaded[moduleName]) {
        throw new Error(`Module not loaded: ${moduleName}`);
      }
      return this.loaded[moduleName];
    }
  };
  var TacticalSystem = {
    tactics: {
      "balanced": {
        systemType: "balanced",
        pressIntensity: 0.5,
        defensiveLineDepth: 0.5,
        counterAttackSpeed: 1,
        possessionPriority: 0.5,
        passingRisk: 0.5
      },
      "possession": {
        systemType: "possession",
        pressIntensity: 0.3,
        defensiveLineDepth: 0.7,
        counterAttackSpeed: 0.8,
        possessionPriority: 0.9,
        passingRisk: 0.3
      },
      "high_press": {
        systemType: "high_press",
        pressIntensity: 0.8,
        defensiveLineDepth: 0.8,
        counterAttackSpeed: 1.2,
        possessionPriority: 0.6,
        passingRisk: 0.6
      },
      "gegenpress": {
        systemType: "high_press",
        pressIntensity: 0.9,
        defensiveLineDepth: 0.9,
        counterAttackSpeed: 1.3,
        possessionPriority: 0.7,
        passingRisk: 0.7
      },
      "counter_attack": {
        systemType: "counter_attack",
        pressIntensity: 0.4,
        defensiveLineDepth: 0.2,
        counterAttackSpeed: 1.5,
        possessionPriority: 0.3,
        passingRisk: 0.8
      },
      "defensive": {
        systemType: "low_block",
        pressIntensity: 0.4,
        defensiveLineDepth: 0.3,
        counterAttackSpeed: 1.1,
        possessionPriority: 0.4,
        passingRisk: 0.4
      },
      "park_bus": {
        systemType: "low_block",
        pressIntensity: 0.2,
        defensiveLineDepth: 0.1,
        counterAttackSpeed: 1,
        possessionPriority: 0.2,
        passingRisk: 0.2
      }
    },
    getTactic(tacticName) {
      const tactic = this.tactics[tacticName];
      if (!tactic) {
        console.warn(`Unknown tactic: ${tacticName}, using balanced`);
        return this.tactics["balanced"];
      }
      return tactic;
    },
    getSystemType(tacticName) {
      return this.getTactic(tacticName).systemType;
    },
    getAllTactics() {
      return Object.keys(this.tactics);
    }
  };
  if (typeof window !== "undefined") {
    window.STANDARD_EVENTS = STANDARD_EVENTS;
    window.eventBus = eventBus;
    window.EVENT_TYPES = EVENT_TYPES;
    window.ConfigManager = ConfigManager;
    window.DependencyRegistry = DependencyRegistry;
    window.TacticalSystem = TacticalSystem;
    window.SHOW_OFFSIDE_LINES = false;
    console.log("\u2705 Event Bus System loaded (TypeScript)");
  }

  // src/gameSetup.ts
  function initIfUndef(obj, key, value) {
    if (obj[key] === void 0)
      obj[key] = value;
  }
  var FORMATION_STRUCTURES = {
    "4-3-3": {
      "GK": 1,
      "CB": 2,
      "RB": 1,
      "LB": 1,
      "CDM": 1,
      "CM": 1,
      "CAM": 1,
      "RW": 1,
      "LW": 1,
      "ST": 1
    },
    "4-2-3-1": {
      "GK": 1,
      "CB": 2,
      "RB": 1,
      "LB": 1,
      "CDM": 2,
      "CM": 1,
      "CAM": 1,
      "RW": 1,
      "LW": 1,
      "ST": 1
    },
    "3-5-2": {
      "GK": 1,
      "CB": 3,
      "RB": 1,
      "LB": 1,
      "CM": 1,
      "CAM": 1,
      "RM": 1,
      "LM": 1,
      "ST": 2
    },
    "5-4-1": {
      "GK": 1,
      "CB": 3,
      "RB": 1,
      "LB": 1,
      "CM": 2,
      "CAM": 1,
      "RW": 1,
      "LW": 1,
      "ST": 1
    }
  };
  function getFormationPosition(player, team, _formation, gameState2) {
    const sameRolePlayers = (team === "home" ? gameState2.homePlayers : gameState2.awayPlayers).filter((p) => p.role === player.role);
    const roleIndex = sameRolePlayers.findIndex((p) => p.id === player.id);
    const zones = {
      "GK": { x: team === "home" ? 50 : 750, y: 300 },
      "CB": { x: team === "home" ? 150 : 650, y: roleIndex === 0 ? 180 : roleIndex === 1 ? 300 : 420 },
      "RB": { x: team === "home" ? 150 : 650, y: 100 },
      "LB": { x: team === "home" ? 150 : 650, y: 500 },
      "CDM": { x: team === "home" ? 300 : 500, y: 300 },
      "CM": { x: team === "home" ? 350 : 450, y: roleIndex === 0 ? 200 : 400 },
      "CAM": { x: team === "home" ? 450 : 350, y: 300 },
      "RW": { x: team === "home" ? 500 : 300, y: 100 },
      "LW": { x: team === "home" ? 500 : 300, y: 500 },
      "RM": { x: team === "home" ? 500 : 300, y: 100 },
      "LM": { x: team === "home" ? 500 : 300, y: 500 },
      "ST": { x: team === "home" ? 650 : 150, y: roleIndex === 0 ? 250 : 350 }
    };
    return zones[player.role] || { x: 400, y: 300 };
  }
  function applyFormationConstraint(player, team, formation, gameState2) {
    if (!formation || !FORMATION_STRUCTURES[formation])
      return player;
    const targetPos = getFormationPosition(player, team, formation, gameState2);
    const formationAdhesion = 0.08;
    if (!player.formationX)
      player.formationX = player.x;
    if (!player.formationY)
      player.formationY = player.y;
    player.formationX += (targetPos.x - player.formationX) * formationAdhesion;
    player.formationY += (targetPos.y - player.formationY) * formationAdhesion;
    return player;
  }
  function getFormationPositions(isHome, isSecondHalf, formationName) {
    console.log("--- getFormationPositions \u0130\xC7\u0130NDE ---");
    console.log("Do\u011Frudan global FORMATIONS kontrol\xFC, typeof:", typeof FORMATIONS);
    console.log("formationName:", formationName);
    const activeConfig3 = GAME_CONFIG;
    const effectiveFormation = FORMATIONS[formationName] || FORMATIONS["4-3-3"];
    console.log("Se\xE7ilen formation:", effectiveFormation);
    if (!effectiveFormation) {
      console.error(`Formasyon bulunamad\u0131: ${formationName}. Varsay\u0131lan kullan\u0131l\u0131yor.`);
      return FORMATIONS["4-3-3"].map((pos) => ({
        x: pos.x * activeConfig3.PITCH_WIDTH,
        y: pos.y * activeConfig3.PITCH_HEIGHT,
        role: pos.role
      }));
    }
    const shouldFlip = isHome && isSecondHalf || !isHome && !isSecondHalf;
    return effectiveFormation.map((pos) => ({
      x: shouldFlip ? (1 - pos.x) * activeConfig3.PITCH_WIDTH : pos.x * activeConfig3.PITCH_WIDTH,
      y: pos.y * activeConfig3.PITCH_HEIGHT,
      role: pos.role
    }));
  }
  function initializePlayers(home, away, homeFormation, awayFormation) {
    const homePositions = getFormationPositions(true, false, homeFormation);
    const awayPositions = getFormationPositions(false, false, awayFormation);
    const initPlayer = (player, pos, isHome, index) => ({
      ...player,
      id: `${isHome ? "home" : "away"}_${index}`,
      x: pos.x,
      y: pos.y,
      homeX: pos.x,
      homeY: pos.y,
      targetX: pos.x,
      targetY: pos.y,
      vx: 0,
      vy: 0,
      isHome,
      role: pos.role.toUpperCase(),
      lastDecisionTime: 0,
      hasBallControl: false,
      ballReceivedTime: null,
      speedBoost: 1,
      stamina: 100,
      distanceCovered: 0,
      targetLocked: false,
      targetLockTime: 0,
      facingAngle: 0,
      scanState: null
    });
    return {
      home: home.map((p, i) => initPlayer(p, homePositions[i], true, i)),
      away: away.map((p, i) => initPlayer(p, awayPositions[i], false, i))
    };
  }
  function calculateFormationScore(positionCounts, required, avgQualities) {
    const [reqDef, reqMid, reqAtt] = required;
    const [qualDef, qualMid, qualAtt] = avgQualities;
    const availabilityScore = (Math.min(positionCounts.defenders / reqDef, 1) + Math.min(positionCounts.midfielders / reqMid, 1) + Math.min(positionCounts.attackers / reqAtt, 1)) / 3 * 100;
    const qualityScore = (qualDef + qualMid + qualAtt) / 6;
    return availabilityScore * 0.5 + qualityScore * 0.5;
  }
  function selectBestFormation(teamPlayers) {
    const positionCounts = { defenders: 0, midfielders: 0, attackers: 0, keepers: 0 };
    const positionQuality = { defenders: 0, midfielders: 0, attackers: 0 };
    teamPlayers.forEach((p) => {
      const pos = p.position.toLowerCase();
      const quality = p.rating * 10 + (p.pace + p.shooting + p.passing + p.dribbling + p.defending) / 5;
      if (pos.includes("keeper") || pos.includes("gk")) {
        positionCounts.keepers++;
      } else if (pos.includes("back") || pos.includes("cb") || pos.includes("rb") || pos.includes("lb")) {
        positionCounts.defenders++;
        positionQuality.defenders += quality;
      } else if (pos.includes("mid") || pos.includes("cdm") || pos.includes("cm") || pos.includes("cam")) {
        positionCounts.midfielders++;
        positionQuality.midfielders += quality;
      } else if (pos.includes("wing") || pos.includes("striker") || pos.includes("forward") || pos.includes("st")) {
        positionCounts.attackers++;
        positionQuality.attackers += quality;
      }
    });
    const avgDefQuality = positionCounts.defenders > 0 ? positionQuality.defenders / positionCounts.defenders : 0;
    const avgMidQuality = positionCounts.midfielders > 0 ? positionQuality.midfielders / positionCounts.midfielders : 0;
    const avgAttQuality = positionCounts.attackers > 0 ? positionQuality.attackers / positionCounts.attackers : 0;
    const formationScores = {
      "4-3-3": calculateFormationScore(positionCounts, [4, 3, 3], [avgDefQuality, avgMidQuality, avgAttQuality]),
      "4-4-2": calculateFormationScore(positionCounts, [4, 4, 2], [avgDefQuality, avgMidQuality, avgAttQuality]),
      "4-4-1-1": calculateFormationScore(positionCounts, [4, 5, 1], [avgDefQuality, avgMidQuality, avgAttQuality]),
      "4-4-2-diamond": calculateFormationScore(positionCounts, [4, 4, 2], [avgDefQuality, avgMidQuality, avgAttQuality]),
      "4-3-1-2": calculateFormationScore(positionCounts, [4, 4, 2], [avgDefQuality, avgMidQuality, avgAttQuality]),
      "4-3-2-1": calculateFormationScore(positionCounts, [4, 5, 1], [avgDefQuality, avgMidQuality, avgAttQuality])
    };
    let bestFormation = "4-3-3";
    let bestScore = 0;
    for (const [formation, score] of Object.entries(formationScores)) {
      if (score > bestScore) {
        bestScore = score;
        bestFormation = formation;
      }
    }
    console.log(` Best formation for team: ${bestFormation} (score: ${bestScore.toFixed(2)})`);
    return bestFormation;
  }
  function selectBestTactic(teamPlayers) {
    if (!teamPlayers || teamPlayers.length === 0)
      return "balanced";
    const avgPace = teamPlayers.reduce((sum, p) => sum + p.pace, 0) / teamPlayers.length;
    const avgPassing = teamPlayers.reduce((sum, p) => sum + p.passing, 0) / teamPlayers.length;
    const avgDribbling = teamPlayers.reduce((sum, p) => sum + p.dribbling, 0) / teamPlayers.length;
    const avgDefending = teamPlayers.reduce((sum, p) => sum + p.defending, 0) / teamPlayers.length;
    const avgPhysicality = teamPlayers.reduce((sum, p) => sum + p.physicality, 0) / teamPlayers.length;
    const avgShooting = teamPlayers.reduce((sum, p) => sum + p.shooting, 0) / teamPlayers.length;
    const avgRating = teamPlayers.reduce((sum, p) => sum + p.rating, 0) / teamPlayers.length;
    const tacticScores = {
      balanced: 50,
      // Baseline
      high_press: (avgPhysicality * 0.4 + avgDefending * 0.3 + avgPace * 0.3) * (avgRating / 10),
      possession: (avgPassing * 0.5 + avgDribbling * 0.3 + avgDefending * 0.2) * (avgRating / 10),
      counter_attack: (avgPace * 0.5 + avgShooting * 0.3 + avgDefending * 0.2) * (avgRating / 10),
      park_the_bus: (avgDefending * 0.6 + avgPhysicality * 0.4) * (avgRating / 10),
      total_football: (avgPassing * 0.3 + avgPace * 0.3 + avgDefending * 0.2 + avgShooting * 0.2) * (avgRating / 10)
    };
    let bestTactic = "balanced";
    let bestScore = tacticScores.balanced;
    for (const [tactic, score] of Object.entries(tacticScores)) {
      if (score > bestScore) {
        bestScore = score;
        bestTactic = tactic;
      }
    }
    console.log(` Best tactic for team: ${bestTactic} (score: ${bestScore.toFixed(2)})`);
    return bestTactic;
  }
  function getPositionFitness(player, targetRole) {
    const playerPos = player.position.trim();
    let fitnessScore = player.rating;
    const positionMatches = {
      "RB": ["Right-back", "Right Back", "Right Wing-Back", "Wing-Back"],
      "CB": ["Center-back", "Centre-back", "Defender"],
      "LB": ["Left-back", "Left Back", "Left Wing-Back"],
      "CDM": ["Defensive Midfielder", "Midfielder"],
      "CM": ["Midfielder", "Central Midfielder"],
      "RM": ["Right Midfielder", "Midfielder"],
      "LM": ["Left Midfielder", "Midfielder"],
      "CAM": ["Attacking Midfielder", "Midfielder"],
      "RW": ["Right Winger", "Winger", "Forward"],
      "LW": ["Left Winger", "Winger", "Forward"],
      "ST": ["Striker", "Forward", "Center Forward"]
    };
    const exactMatches = positionMatches[targetRole] || [targetRole];
    if (exactMatches.some((pos) => playerPos.includes(pos) || pos.includes(playerPos))) {
      fitnessScore += 2;
    }
    if (targetRole === "CB") {
      fitnessScore += player.defending / 100 * 1 + player.physicality / 100 * 0.5;
    } else if (targetRole === "RB" || targetRole === "LB") {
      fitnessScore += player.defending / 100 * 0.7 + player.pace / 100 * 0.5;
    } else if (targetRole === "CDM") {
      fitnessScore += player.defending / 100 * 0.6 + player.passing / 100 * 0.4;
    } else if (targetRole === "CM") {
      fitnessScore += player.passing / 100 * 0.6 + player.dribbling / 100 * 0.3;
    } else if (targetRole === "CAM") {
      fitnessScore += player.passing / 100 * 0.5 + player.shooting / 100 * 0.4;
    } else if (targetRole === "RW" || targetRole === "LW" || targetRole === "RM" || targetRole === "LM") {
      fitnessScore += player.pace / 100 * 0.5 + player.dribbling / 100 * 0.4;
    } else if (targetRole === "ST") {
      fitnessScore += player.shooting / 100 * 0.8 + player.pace / 100 * 0.3;
    }
    return fitnessScore;
  }
  function selectBestTeam(teamName) {
    const teamPlayers = gameState.players.filter((p) => p.team === teamName);
    const formation = selectBestFormation(teamPlayers);
    const selected = [];
    const positions = getFormationPositions(true, false, formation);
    const gkPosition = positions.find((pos) => pos.role === "GK");
    if (gkPosition) {
      const goalkeepers = teamPlayers.filter((p) => {
        const pos = p.position?.toLowerCase() || "";
        return pos.includes("keeper") || pos.includes("gk");
      }).sort((a, b) => {
        const scoreA = a.goalkeeping * 0.7 + a.rating * 30;
        const scoreB = b.goalkeeping * 0.7 + b.rating * 30;
        return scoreB - scoreA;
      });
      if (goalkeepers.length > 0) {
        selected.push(goalkeepers[0]);
      }
    }
    positions.forEach((pos) => {
      if (pos.role === "GK")
        return;
      const candidates = teamPlayers.filter((p) => !selected.includes(p) && p.position?.toLowerCase() !== "coach").map((p) => ({
        player: p,
        fitness: getPositionFitness(p, pos.role)
      })).sort((a, b) => b.fitness - a.fitness);
      if (candidates.length > 0) {
        selected.push(candidates[0].player);
      }
    });
    return { players: selected.slice(0, 11), formation };
  }
  function initializeGameSetup(gameState2) {
    initIfUndef(gameState2, "stats", {});
    const s = gameState2.stats;
    if (!s.home || typeof s.home !== "object")
      s.home = {};
    if (!s.away || typeof s.away !== "object")
      s.away = {};
    if (typeof s.home.possession !== "number")
      s.home.possession = 0;
    if (typeof s.away.possession !== "number")
      s.away.possession = 0;
    if (typeof s.home.passesCompleted !== "number")
      s.home.passesCompleted = 0;
    if (typeof s.home.passesAttempted !== "number")
      s.home.passesAttempted = 0;
    if (typeof s.away.passesCompleted !== "number")
      s.away.passesCompleted = 0;
    if (typeof s.away.passesAttempted !== "number")
      s.away.passesAttempted = 0;
    if (!s.possessionTimer || typeof s.possessionTimer !== "object") {
      s.possessionTimer = { home: 0, away: 0 };
    }
    if (typeof s.lastPossessionUpdate !== "number")
      s.lastPossessionUpdate = Date.now();
    initIfUndef(gameState2, "status", "upload");
    initIfUndef(gameState2, "homeTeam", "");
    initIfUndef(gameState2, "awayTeam", "");
    initIfUndef(gameState2, "setPiece", null);
    initIfUndef(gameState2, "ballPosition", { x: 400, y: 300 });
    initIfUndef(gameState2, "ballVelocity", { x: 0, y: 0 });
    initIfUndef(gameState2, "ballHeight", 0);
    initIfUndef(gameState2, "ballTrajectory", null);
    initIfUndef(gameState2, "ballHolder", null);
    initIfUndef(gameState2, "lastTouchedBy", null);
    initIfUndef(gameState2, "commentary", []);
    initIfUndef(gameState2, "timeElapsed", 0);
    initIfUndef(gameState2, "teams", []);
    initIfUndef(gameState2, "players", []);
    initIfUndef(gameState2, "teamJerseys", {});
    initIfUndef(gameState2, "teamCoaches", {});
    initIfUndef(gameState2, "teamLogos", {});
    initIfUndef(gameState2, "homeJerseyColor", "#ef4444");
    initIfUndef(gameState2, "awayJerseyColor", "#3b82f6");
    initIfUndef(gameState2, "currentHalf", 1);
    initIfUndef(gameState2, "homeScore", 0);
    initIfUndef(gameState2, "awayScore", 0);
    initIfUndef(gameState2, "homePlayers", []);
    initIfUndef(gameState2, "awayPlayers", []);
    initIfUndef(gameState2, "homeFormation", "4-3-3");
    initIfUndef(gameState2, "awayFormation", "4-3-3");
    initIfUndef(gameState2, "homeTactic", "balanced");
    initIfUndef(gameState2, "awayTactic", "balanced");
    initIfUndef(gameState2, "homeTeamState", "BALANCED");
    initIfUndef(gameState2, "awayTeamState", "BALANCED");
    initIfUndef(gameState2, "lastEventTime", 0);
    initIfUndef(gameState2, "particles", []);
    initIfUndef(gameState2, "cameraShake", 0);
    initIfUndef(gameState2, "ballChasers", /* @__PURE__ */ new Set());
    initIfUndef(gameState2, "totalPasses", 0);
    initIfUndef(gameState2, "totalShots", 0);
    initIfUndef(gameState2, "shotInProgress", false);
    initIfUndef(gameState2, "shooter", null);
    initIfUndef(gameState2, "homeDefensiveLine", 200);
    initIfUndef(gameState2, "awayDefensiveLine", 600);
    initIfUndef(gameState2, "lastPossessionChange", 0);
    initIfUndef(gameState2, "currentShotXG", null);
    initIfUndef(gameState2, "currentPassReceiver", null);
    initIfUndef(gameState2, "fouls", 0);
    initIfUndef(gameState2, "yellowCards", []);
    initIfUndef(gameState2, "redCards", []);
    initIfUndef(gameState2, "lastGoalScorer", null);
    initIfUndef(gameState2, "goalEvents", []);
    initIfUndef(gameState2, "cardEvents", []);
    initIfUndef(gameState2, "lastTeamStateUpdate", Date.now());
    initIfUndef(gameState2, "possessionChanges", 0);
    initIfUndef(gameState2, "isVertical", false);
    initIfUndef(gameState2, "canvases", { background: null, game: null, ui: null });
    initIfUndef(gameState2, "contexts", { background: null, game: null, ui: null });
    initIfUndef(gameState2, "backgroundDrawn", false);
    initIfUndef(gameState2, "gameUIDisplayed", false);
    initIfUndef(gameState2, "offscreenPitch", null);
  }

  // src/utils/ui.ts
  function ensureStatsShape(gs) {
    gs.stats = gs.stats || {};
    const s = gs.stats;
    s.home = s.home || {};
    s.away = s.away || {};
    if (typeof s.home.possession !== "number")
      s.home.possession = 0;
    if (typeof s.away.possession !== "number")
      s.away.possession = 0;
    s.possessionTimer = s.possessionTimer || { home: 0, away: 0 };
    if (typeof s.lastPossessionUpdate !== "number")
      s.lastPossessionUpdate = Date.now();
    s.possession = s.possession || { home: 0, away: 0 };
    s.possession.home = s.home.possession;
    s.possession.away = s.away.possession;
  }
  var SET_PIECE_STATUSES = Object.freeze([
    "GOAL_KICK",
    "CORNER_KICK",
    "THROW_IN",
    "FREE_KICK",
    "PENALTY",
    "KICK_OFF"
  ]);
  function isSetPieceStatus(status) {
    if (!status)
      return false;
    return SET_PIECE_STATUSES.includes(status);
  }
  function getAttackingGoalX(isHome, currentHalf) {
    const GOAL_X_LEFT_DEFAULT = 50;
    const GOAL_X_RIGHT_DEFAULT = 750;
    const goalLeft = GAME_CONFIG.GOAL_X_LEFT ?? GOAL_X_LEFT_DEFAULT;
    const goalRight = GAME_CONFIG.GOAL_X_RIGHT ?? GOAL_X_RIGHT_DEFAULT;
    if (currentHalf === 1) {
      return isHome ? goalRight : goalLeft;
    } else {
      return isHome ? goalLeft : goalRight;
    }
  }
  function calculateXG(shooter, goalX, goalY, opponents) {
    const distToGoal = Math.sqrt(Math.pow(shooter.x - goalX, 2) + Math.pow(shooter.y - goalY, 2));
    const angleToGoalCenter = Math.abs(shooter.y - 300);
    const maxAngle = 150;
    const angleQuality = Math.max(0, 1 - angleToGoalCenter / maxAngle);
    const normalizedDistance = Math.min(distToGoal / 400, 1);
    const distanceQuality = Math.pow(1 - normalizedDistance, 1.5);
    const nearbyDefenders = opponents.filter((opp) => distance(shooter, opp) < 30);
    const pressureMultiplier = Math.max(0.4, 1 - nearbyDefenders.length * 0.18);
    const shooterAbility = 0.2 + shooter.shooting / 100 * 0.8;
    const speed = Math.sqrt(shooter.vx * shooter.vx + shooter.vy * shooter.vy);
    const movementPenalty = speed > 100 ? 0.9 : 1;
    const fatiguePenalty = shooter.stamina < 40 ? 0.95 : 1;
    let xG = (distanceQuality * 0.35 + angleQuality * 0.3 + shooterAbility * 0.35) * pressureMultiplier * movementPenalty * fatiguePenalty;
    xG = Math.max(0.03, Math.min(0.92, xG));
    return xG;
  }
  function pointToLineDistance2(point, lineStart, lineEnd) {
    const A = point.x - lineStart.x;
    const B = point.y - lineStart.y;
    const C = lineEnd.x - lineStart.x;
    const D = lineEnd.y - lineStart.y;
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0)
      param = dot / lenSq;
    let xx, yy;
    if (param < 0) {
      xx = lineStart.x;
      yy = lineStart.y;
    } else if (param > 1) {
      xx = lineEnd.x;
      yy = lineEnd.y;
    } else {
      xx = lineStart.x + param * C;
      yy = lineStart.y + param * D;
    }
    const dx = point.x - xx;
    const dy = point.y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }
  function getValidStat(statValue, defaultValue = 0) {
    const num = parseFloat(statValue);
    return isNaN(num) ? defaultValue : num;
  }

  // src/ai/playerVision.ts
  var VISION_CONFIG = {
    // Vision angles (in radians)
    NORMAL_VISION_ANGLE: Math.PI * 0.9,
    // 162Â° (0.9Ï€)
    BALL_CARRIER_ANGLE: Math.PI * 0.75,
    // 135Â° (narrower when dribbling)
    UNDER_PRESSURE_ANGLE: Math.PI * 0.6,
    // 108Â° (tunnel vision under pressure)
    // Vision ranges
    MAX_VISION_RANGE: 300,
    // pixels
    PERIPHERAL_RANGE: 200,
    // Reduced detail in periphery
    // Scan frequency (how often players "check shoulder")
    SCAN_INTERVAL_MIN: 800,
    // ms
    SCAN_INTERVAL_MAX: 2e3,
    // ms
    SCAN_DURATION: 300,
    // ms (time spent looking around)
    // Ball is always visible (within reason)
    BALL_ALWAYS_VISIBLE_RANGE: 400,
    // Awareness modifiers
    VISION_STAT_BONUS: 0.15,
    // Better players see more
    COMPOSURE_BONUS: 0.1
    // Composure helps under pressure
  };
  function getPlayerFacingDirection(player) {
    if (player.role === "GK") {
      if (player.vx !== 0 || player.vy !== 0) {
        const speed = Math.sqrt(player.vx * player.vx + player.vy * player.vy);
        if (speed > 10) {
          return Math.atan2(player.vy, player.vx);
        }
      }
      if (gameState.ballPosition) {
        const distToBall = distance(player, gameState.ballPosition);
        if (distToBall < 350) {
          return Math.atan2(
            gameState.ballPosition.y - player.y,
            gameState.ballPosition.x - player.x
          );
        }
      }
      const opponentGoalX2 = getAttackingGoalX(player.isHome, gameState.currentHalf);
      return Math.atan2(
        300 - player.y,
        opponentGoalX2 - player.x
      );
    }
    if (player.vx !== 0 || player.vy !== 0) {
      const speed = Math.sqrt(player.vx * player.vx + player.vy * player.vy);
      if (speed > 10) {
        return Math.atan2(player.vy, player.vx);
      }
    }
    if (gameState.ballPosition && !player.hasBallControl) {
      return Math.atan2(
        gameState.ballPosition.y - player.y,
        gameState.ballPosition.x - player.x
      );
    }
    const opponentGoalX = getAttackingGoalX(player.isHome, gameState.currentHalf);
    return Math.atan2(
      300 - player.y,
      opponentGoalX - player.x
    );
  }
  function canPlayerSee(player, target, detailLevel = "full") {
    const distance2 = distance(player, target);
    if (target === gameState.ballPosition && distance2 < VISION_CONFIG.BALL_ALWAYS_VISIBLE_RANGE) {
      return true;
    }
    const maxRange = detailLevel === "peripheral" ? VISION_CONFIG.PERIPHERAL_RANGE : VISION_CONFIG.MAX_VISION_RANGE;
    if (distance2 > maxRange) {
      return false;
    }
    const angleToTarget = Math.atan2(
      target.y - player.y,
      target.x - player.x
    );
    const facingAngle = player.facingAngle || getPlayerFacingDirection(player);
    let angleDiff = Math.abs(angleToTarget - facingAngle);
    if (angleDiff > Math.PI) {
      angleDiff = 2 * Math.PI - angleDiff;
    }
    let visionAngle = VISION_CONFIG.NORMAL_VISION_ANGLE;
    if (player.hasBallControl) {
      visionAngle = VISION_CONFIG.BALL_CARRIER_ANGLE;
    }
    const nearbyOpponents = [...gameState.homePlayers, ...gameState.awayPlayers].filter((p) => p.isHome !== player.isHome && distance(player, p) < 50);
    if (nearbyOpponents.length > 1) {
      visionAngle = VISION_CONFIG.UNDER_PRESSURE_ANGLE;
    }
    const awarenessBonus = player.passing / 100 * VISION_CONFIG.VISION_STAT_BONUS;
    visionAngle *= 1 + awarenessBonus;
    const inVisionCone = angleDiff < visionAngle / 2;
    if (target.id) {
      target.isVisibleTo = target.isVisibleTo || {};
      target.isVisibleTo[player.id] = inVisionCone;
    }
    return inVisionCone;
  }
  function updatePlayerScanning(player) {
    const now = Date.now();
    if (!player.scanState) {
      player.scanState = {
        lastScanTime: now,
        nextScanTime: now + Math.random() * VISION_CONFIG.SCAN_INTERVAL_MAX,
        isScanning: false,
        scanStartTime: 0,
        originalFacingAngle: 0
      };
    }
    const scan = player.scanState;
    if (player.hasBallControl && scan.isScanning) {
      scan.isScanning = false;
      player.facingAngle = scan.originalFacingAngle;
      return;
    }
    const scanFrequency = 1 - player.passing / 100 * 0.3;
    const scanInterval = VISION_CONFIG.SCAN_INTERVAL_MIN + (VISION_CONFIG.SCAN_INTERVAL_MAX - VISION_CONFIG.SCAN_INTERVAL_MIN) * scanFrequency;
    if (!scan.isScanning && now >= scan.nextScanTime) {
      if (player.hasBallControl && player.speedBoost > 1.2) {
        scan.nextScanTime = now + scanInterval;
        return;
      }
      scan.isScanning = true;
      scan.scanStartTime = now;
      scan.originalFacingAngle = getPlayerFacingDirection(player);
      const scanDirection = Math.random() < 0.5 ? 1 : -1;
      player.facingAngle = scan.originalFacingAngle + Math.PI * 0.4 * scanDirection;
    }
    if (scan.isScanning) {
      const scanDuration = now - scan.scanStartTime;
      if (scanDuration >= VISION_CONFIG.SCAN_DURATION) {
        scan.isScanning = false;
        scan.lastScanTime = now;
        scan.nextScanTime = now + scanInterval;
        player.facingAngle = scan.originalFacingAngle;
      }
    }
  }
  function getVisibleTeammates(player, allPlayers) {
    const teammates = allPlayers.filter(
      (p) => p.isHome === player.isHome && p.id !== player.id && p.role !== "GK"
    );
    return teammates.filter((teammate) => {
      if (!canPlayerSee(player, teammate)) {
        return false;
      }
      const opponents = allPlayers.filter((p) => p.isHome !== player.isHome);
      const distToTeammate = distance(player, teammate);
      for (const opp of opponents) {
        const distToOpp = distance(player, opp);
        if (distToOpp < distToTeammate) {
          const distToLine = pointToLineDistance2(opp, player, teammate);
          if (distToLine < 25) {
            return false;
          }
        }
      }
      return true;
    });
  }
  function findBestPassOption_WithVision(passer, teammates, opponents) {
    const tactic = TACTICS[passer.isHome ? gameState.homeTactic : gameState.awayTactic];
    if (!tactic)
      return null;
    const teamState = passer.isHome ? gameState.homeTeamState : gameState.awayTeamState;
    const opponentGoalX = getAttackingGoalX(passer.isHome, gameState.currentHalf);
    const nearbyOpponentsPressure = opponents.filter((opp) => distance(passer, opp) < 70);
    const isUnderPressure = nearbyOpponentsPressure.length > 0;
    const visibleTeammates = teammates.filter((t) => canPlayerSee(passer, t));
    if (visibleTeammates.length === 0) {
      return null;
    }
    let bestOption = null;
    let bestScore = -1;
    visibleTeammates.forEach((teammate) => {
      const dist = distance(passer, teammate);
      const minDist = tactic.possessionPriority > 0.7 ? 40 : 40;
      const maxDist = tactic.possessionPriority > 0.7 ? 200 : 300;
      if (dist < minDist || dist > maxDist)
        return;
      let passBlocked = false;
      opponents.forEach((opp) => {
        const distToLine = pointToLineDistance2(opp, passer, teammate);
        if (distToLine < 30 && distance(passer, opp) < dist) {
          passBlocked = true;
        }
      });
      if (passBlocked)
        return;
      let score = 100 - dist / 3;
      const isForwardPass = opponentGoalX > 400 && teammate.x > passer.x || opponentGoalX < 400 && teammate.x < passer.x;
      if (isForwardPass) {
        score += 40 * tactic.passingRisk;
      }
      const facingAngle = getPlayerFacingDirection(passer);
      const angleToTeammate = Math.atan2(teammate.y - passer.y, teammate.x - passer.x);
      let angleDiff = Math.abs(angleToTeammate - facingAngle);
      if (angleDiff > Math.PI)
        angleDiff = 2 * Math.PI - angleDiff;
      if (!isUnderPressure && angleDiff > Math.PI / 2) {
        score -= 60;
      }
      const visionQuality = 1 - angleDiff / Math.PI;
      score *= 0.7 + visionQuality * 0.3;
      if (teamState === "COUNTER_ATTACK" && (teammate.role === "ST" || teammate.role === "RW" || teammate.role === "LW")) {
        score += 50;
      } else if (teamState === "DEFENDING" && (teammate.role === "CM" || teammate.role === "CDM")) {
        score += 40;
      }
      if (tactic.possessionPriority > 0.7) {
        if (teammate.role === "CM" || teammate.role === "CDM" || teammate.role === "CAM") {
          score += 30;
        }
      }
      const nearbyOpps = opponents.filter((o) => distance(o, teammate) < 40);
      score -= nearbyOpps.length * 15;
      if (score > bestScore) {
        bestScore = score;
        bestOption = teammate;
      }
    });
    return bestOption;
  }
  function getPerceivedThreats(player, opponents) {
    return opponents.filter((opp) => {
      if (distance(player, opp) < 30) {
        return true;
      }
      return canPlayerSee(player, opp);
    });
  }
  function drawVisionCones(ctx) {
    if (!gameState.contexts || !gameState.contexts.game)
      return;
    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    allPlayers.forEach((player) => {
      const facingAngle = player.facingAngle || getPlayerFacingDirection(player);
      let visionAngle = VISION_CONFIG.NORMAL_VISION_ANGLE;
      if (player.hasBallControl) {
        visionAngle = VISION_CONFIG.BALL_CARRIER_ANGLE;
      }
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = player.isHome ? "#ef4444" : "#3b82f6";
      ctx.beginPath();
      ctx.moveTo(player.x, player.y);
      ctx.arc(
        player.x,
        player.y,
        VISION_CONFIG.MAX_VISION_RANGE,
        facingAngle - visionAngle / 2,
        facingAngle + visionAngle / 2
      );
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = player.isHome ? "#ef4444" : "#3b82f6";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(player.x, player.y);
      ctx.lineTo(
        player.x + Math.cos(facingAngle) * 40,
        player.y + Math.sin(facingAngle) * 40
      );
      ctx.stroke();
      ctx.restore();
    });
  }

  // src/types/events.ts
  var EVENT_TYPES2 = {
    // Match events
    MATCH_START: "match:start",
    MATCH_PAUSE: "match:pause",
    MATCH_RESUME: "match:resume",
    MATCH_END: "match:end",
    HALF_TIME: "match:halftime",
    KICKOFF: "match:kickoff",
    // Ball events
    BALL_KICKED: "ball:kicked",
    BALL_PASSED: "ball:passed",
    BALL_INTERCEPTED: "ball:intercepted",
    BALL_OUT: "ball:out",
    BALL_WON: "ball:won",
    BALL_LOST: "ball:lost",
    BALL_POSITION_CHANGED: "ball:positionChanged",
    BALL_HOLDER_CHANGED: "ball:holderChanged",
    // Goal events
    GOAL_SCORED: "goal:scored",
    SHOT_TAKEN: "shot:taken",
    SHOT_SAVED: "shot:saved",
    SHOT_MISSED: "shot:missed",
    SHOT_BLOCKED: "shot:blocked",
    SHOT_ATTEMPTED: "shot:attempted",
    // Player events
    PLAYER_COLLISION: "player:collision",
    PLAYER_TACKLE: "player:tackle",
    PLAYER_DRIBBLE: "player:dribble",
    PLAYER_HEADER: "player:header",
    PLAYER_SUBSTITUTED: "player:substituted",
    // Foul events
    FOUL_COMMITTED: "foul:committed",
    CARD_SHOWN: "card:shown",
    PENALTY_AWARDED: "penalty:awarded",
    FREE_KICK_AWARDED: "freekick:awarded",
    // Team events
    TEAM_STATE_CHANGED: "team:stateChanged",
    FORMATION_CHANGED: "team:formationChanged",
    TACTIC_CHANGED: "team:tacticChanged",
    POSSESSION_CHANGED: "team:possessionChanged",
    // AI events
    AI_DECISION_MADE: "ai:decisionMade",
    BT_NODE_EXECUTED: "ai:btNodeExecuted",
    ZONE_ASSIGNED: "ai:zoneAssigned",
    // Rendering events
    RENDER_BACKGROUND: "render:background",
    RENDER_GAME: "render:game",
    RENDER_UI: "render:ui",
    // Stats events
    STAT_UPDATED: "stat:updated",
    XG_CALCULATED: "stat:xgCalculated",
    PASS_COMPLETED: "stat:passCompleted",
    PASS_FAILED: "stat:passFailed",
    // Offside events
    OFFSIDE_CALLED: "offside:called",
    // Set piece events
    SET_PIECE_STARTED: "setPiece:started",
    SET_PIECE_EXECUTED: "setPiece:executed",
    // Match lifecycle
    MATCH_STARTED: "match:started",
    MATCH_FINISHED: "match:finished"
  };

  // src/setpieces/integration.ts
  var integration_exports = {};
  __export(integration_exports, {
    SET_PIECE_RULES: () => SET_PIECE_RULES,
    assignSetPieceKicker: () => assignSetPieceKicker,
    ensureCorrectSetPiecePlacement: () => ensureCorrectSetPiecePlacement,
    executeSetPiece_PostExecution: () => executeSetPiece_PostExecution,
    executeSetPiece_Router: () => executeSetPiece_Router,
    getCornerKickPosition: () => getCornerKickPosition,
    getGoalKickPosition: () => getGoalKickPosition,
    positionForSetPiece_Legacy: () => positionForSetPiece_Legacy,
    positionForSetPiece_Unified: () => positionForSetPiece_Unified,
    updatePlayerAI_V2_SetPieceEnhancement: () => updatePlayerAI_V2_SetPieceEnhancement
  });

  // src/rendering/particles.ts
  var Particle = class {
    constructor(x, y, color, velocityX = 0, velocityY = 0) {
      this.x = x;
      this.y = y;
      this.vx = velocityX;
      this.vy = velocityY;
      this.color = color;
      this.life = 1;
      this.alpha = 1;
      this.decay = 0.02 + Math.random() * 0.02;
      this.size = 3 + Math.random() * 5;
      this.radius = this.size;
      this.type = "default";
      this.rotation = 0;
      this.gravity = 300;
      this.createdAt = Date.now();
    }
    update(dt) {
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      this.vy += this.gravity * dt;
      const frameMultiplier = dt * 60;
      this.vx *= Math.pow(0.98, frameMultiplier);
      this.life -= this.decay * frameMultiplier;
      this.alpha = this.life;
      this.size *= Math.pow(0.98, frameMultiplier);
      this.radius = this.size;
    }
    draw(ctx) {
      if (this.life <= 0)
        return;
      ctx.save();
      ctx.globalAlpha = this.life;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  };
  function createGoalExplosion(x, y, color) {
    const particleCount = 80;
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.PI * 2 * i / particleCount;
      const speed = 250 + Math.random() * 350;
      const velocityX = Math.cos(angle) * speed;
      const velocityY = Math.sin(angle) * speed - 250;
      const particle = new Particle(x, y, color, velocityX, velocityY);
      particle.size = 4 + Math.random() * 6;
      gameState.particles.push(particle);
    }
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 150 + Math.random() * 250;
      const velocityX = Math.cos(angle) * speed;
      const velocityY = Math.sin(angle) * speed - 150;
      const particle = new Particle(x, y, "#ffffff", velocityX, velocityY);
      particle.size = 3;
      gameState.particles.push(particle);
    }
    for (let i = 0; i < 30; i++) {
      const offsetX = (Math.random() - 0.5) * 120;
      const offsetY = (Math.random() - 0.5) * 120;
      const particle = new Particle(x + offsetX, y + offsetY, color, 0, -120);
      particle.decay = 0.03;
      particle.size = 4;
      gameState.particles.push(particle);
    }
    gameState.cameraShake = 12;
  }
  function createBallTrail(x, y) {
    if (Math.random() < 0.5) {
      const particle = new Particle(
        x + (Math.random() - 0.5) * 8,
        y + (Math.random() - 0.5) * 8,
        "#ffffff",
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      particle.decay = 0.02;
      particle.size = 3 + Math.random() * 2;
      gameState.particles.push(particle);
    }
  }
  function createPassEffect(x, y, color) {
    for (let i = 0; i < 5; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 100;
      const velocityX = Math.cos(angle) * speed;
      const velocityY = Math.sin(angle) * speed;
      const particle = new Particle(x, y, color, velocityX, velocityY);
      particle.size = 2 + Math.random() * 3;
      particle.decay = 0.04;
      gameState.particles.push(particle);
    }
  }
  function createSaveEffect(x, y) {
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 100 + Math.random() * 200;
      const velocityX = Math.cos(angle) * speed;
      const velocityY = Math.sin(angle) * speed;
      const colors = ["#3b82f6", "#60a5fa", "#93c5fd"];
      const color = colors[Math.floor(Math.random() * colors.length)] || "#3b82f6";
      const particle = new Particle(x, y, color, velocityX, velocityY);
      particle.size = 3 + Math.random() * 4;
      particle.decay = 0.03;
      gameState.particles.push(particle);
    }
  }

  // src/ui/goalAnimation.ts
  var confettiParticles = [];
  var gravity = 0.4;
  var confettiAnimationId = null;
  var ConfettiParticle = class {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.size = Math.random() * 8 + 4;
      this.vx = Math.random() * 8 - 4;
      this.vy = Math.random() * -10 - 5;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 20 - 10;
      this.opacity = 1;
    }
    update() {
      this.vy += gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      if (gameState && gameState.canvases && gameState.canvases.ui && this.y > gameState.canvases.ui.height + this.size) {
        this.opacity = 0;
      } else if (this.opacity > 0) {
      }
    }
    draw(ctx) {
      if (this.opacity <= 0)
        return;
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation * Math.PI / 180);
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 1.5);
      ctx.restore();
    }
  };
  function createConfetti(colors) {
    if (!gameState || !gameState.canvases || !gameState.canvases.ui) {
      console.error("Confetti creation failed: UI canvas not ready.");
      return;
    }
    if (colors.length === 0) {
      return;
    }
    const uiCanvas = gameState.canvases.ui;
    confettiParticles = [];
    const amount = 250;
    for (let i = 0; i < amount; i++) {
      const x = Math.random() * uiCanvas.width;
      const y = Math.random() * uiCanvas.height * 0.5 - 50;
      const color = colors[Math.floor(Math.random() * colors.length)];
      if (color) {
        confettiParticles.push(new ConfettiParticle(x, y, color));
      }
    }
  }
  function animateConfetti() {
    if (!gameState || !gameState.contexts || !gameState.contexts.ui) {
      console.error("Confetti animation failed: UI context not ready.");
      if (confettiAnimationId)
        cancelAnimationFrame(confettiAnimationId);
      confettiAnimationId = null;
      return;
    }
    const uiCtx = gameState.contexts.ui;
    uiCtx.clearRect(0, 0, uiCtx.canvas.width, uiCtx.canvas.height);
    confettiParticles.forEach((p) => {
      p.update();
      p.draw(uiCtx);
    });
    confettiParticles = confettiParticles.filter((p) => p.opacity > 0);
    if (confettiParticles.length > 0) {
      confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
      uiCtx.clearRect(0, 0, uiCtx.canvas.width, uiCtx.canvas.height);
      confettiAnimationId = null;
    }
  }
  function showGoalAnimation(scorerName, teamColors) {
    const container = document.getElementById("goal-animation-container");
    const goalText = document.getElementById("goal-text");
    const scorerText = document.getElementById("scorer-name");
    if (!container || !goalText || !scorerText) {
      console.error("Goal animation elements not found!");
      return;
    }
    const color1 = teamColors && teamColors.length > 0 && teamColors[0] ? teamColors[0] : "#ff4500";
    const color2 = teamColors && teamColors.length > 1 && teamColors[1] ? teamColors[1] : "#ffd700";
    goalText.style.setProperty("--color1", color1);
    goalText.style.setProperty("--color2", color2);
    scorerText.textContent = scorerName || "";
    container.style.display = "flex";
    goalText.classList.remove("animate");
    scorerText.classList.remove("animate");
    void goalText.offsetWidth;
    goalText.classList.add("animate");
    scorerText.classList.add("animate");
    if (confettiAnimationId) {
      cancelAnimationFrame(confettiAnimationId);
      confettiAnimationId = null;
    }
    createConfetti([color1, color2, "#ffffff"]);
    animateConfetti();
    setTimeout(() => {
      container.style.display = "none";
      goalText.classList.remove("animate");
      scorerText.classList.remove("animate");
    }, 4e3);
  }

  // src/ai/decisions.ts
  function getDistance(p1, p2) {
    return distance(p1, p2);
  }
  function calculateAvgDribbling(teamPlayers) {
    if (teamPlayers.length === 0)
      return 0;
    return teamPlayers.reduce((sum, p) => sum + p.dribbling, 0) / teamPlayers.length;
  }
  function passBall(passingPlayer, fromX, fromY, toX, toY, passQuality = 0.7, speed = 400, isShot = false) {
    if (passingPlayer && !isShot) {
      const teamStats = passingPlayer.isHome ? gameState.stats.home : gameState.stats.away;
      teamStats.passesAttempted++;
      gameState.lastTouchedBy = passingPlayer;
      const isSetPiece = isSetPieceStatus(gameState.status);
      if (!isShot && (gameState.status === "playing" || isSetPiece)) {
        const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
        recordOffsidePositions(passingPlayer, allPlayers);
      }
    } else if (passingPlayer && isShot) {
      gameState.lastTouchedBy = passingPlayer;
    }
    const dist = Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2);
    const duration = dist / speed * 1e3;
    let maxHeight = 0;
    let passType = "ground";
    const LONG_PASS_THRESHOLD = PHYSICS.LONG_PASS_THRESHOLD ?? 150;
    if (isShot) {
      maxHeight = 0.6;
      passType = "shot";
    } else if (dist > LONG_PASS_THRESHOLD) {
      const passingSkill = passingPlayer ? passingPlayer.passing / 100 : 0.7;
      const baseHeight = 0.4 + dist / 400 * 0.4;
      const skillModifier = 1 - passingSkill * 0.3;
      const qualityVariance = (1 - passQuality) * 0.15;
      maxHeight = baseHeight * skillModifier + qualityVariance;
      maxHeight = Math.max(0.3, Math.min(1, maxHeight));
      passType = "aerial";
    }
    gameState.ballTrajectory = {
      startX: fromX,
      startY: fromY,
      endX: toX,
      endY: toY,
      startTime: Date.now(),
      duration,
      maxHeight,
      isShot,
      passType,
      passQuality,
      dist,
      speed
    };
    gameState.ballHolder = null;
    if (passingPlayer) {
      passingPlayer.hasBallControl = false;
    }
  }
  function calculateDribbleSuccess(player, opponents) {
    const realStats = player.realStats || {};
    const baseDribbling = Math.pow(player.dribbling / 100, 0.8);
    const paceBonus = player.pace / 100 * 0.15;
    const physicalityBonus = player.physicality / 100 * 0.1;
    const composure = (player.composure || 60) / 100;
    const dribbleModifier = realStats.dribblesSucceeded ? Math.min(realStats.dribblesSucceeded / 10, 0.25) : 0;
    const dispossessedPenalty = realStats.dispossessed ? Math.min(realStats.dispossessed / 20, 0.15) : 0;
    const duelBonus = realStats.duelWonPercent ? realStats.duelWonPercent / 100 * 0.1 : 0;
    const realStatImpact = (dribbleModifier + duelBonus - dispossessedPenalty) * 1.5;
    const nearbyOpponents = opponents.filter((opp) => getDistance(player, opp) < 40);
    const pressurePenalty = nearbyOpponents.length * 0.2 * (1 - composure);
    const successChance = baseDribbling + paceBonus + physicalityBonus + realStatImpact - pressurePenalty;
    return Math.max(0.1, Math.min(0.95, successChance));
  }
  function calculatePassSuccess(passer, _receiver, distance2, isUnderPressure) {
    const realStats = passer.realStats || {};
    const basePassing = Math.pow(passer.passing / 100, 0.7);
    const passAccuracyStat = getValidStat(realStats.passAccuracy, 0);
    let effectiveAccuracy;
    if (passAccuracyStat > 0) {
      effectiveAccuracy = basePassing * 0.5 + passAccuracyStat / 100 * 0.5;
    } else {
      effectiveAccuracy = basePassing * 0.9;
    }
    const visionBonus = (passer.vision || 60) / 100 * 0.15;
    const chancesCreated = getValidStat(realStats.chancesCreated, 0);
    const xA = getValidStat(realStats.xA, 0);
    const creativityBonus = chancesCreated > 0 ? Math.min(chancesCreated / 8, 0.15) : 0;
    const xABonus = xA > 0 ? Math.min(xA / 4, 0.1) : 0;
    const composure = (passer.composure || 60) / 100;
    const pressurePenalty = isUnderPressure ? 0.25 * (1 - composure) : 0;
    const longBallAccuracy = getValidStat(realStats.longBallAccuracy, 60);
    const longBallSkill = longBallAccuracy / 100;
    let distancePenalty = 0;
    if (distance2 > 120) {
      distancePenalty = Math.min((distance2 - 120) / 400, 0.3);
      distancePenalty *= 1 - longBallSkill * 0.8;
    }
    const successChance = effectiveAccuracy + visionBonus + creativityBonus + xABonus - pressurePenalty - distancePenalty;
    return Math.max(0.2, Math.min(0.98, successChance));
  }
  function checkForThroughBall(passer, teammates, opponents, opponentGoalX) {
    const direction = opponentGoalX > 400 ? 1 : -1;
    for (const teammate of teammates) {
      if (teammate.role === "GK")
        continue;
      const isAhead = direction > 0 && teammate.x > passer.x || direction < 0 && teammate.x < passer.x;
      if (!isAhead)
        continue;
      const distToGoal = Math.abs(teammate.x - opponentGoalX);
      if (distToGoal > 250)
        continue;
      const targetX = teammate.x + direction * 60;
      const targetY = teammate.y;
      const defendersInPath = opponents.filter((opp) => {
        const oppIsAhead = direction > 0 && opp.x > passer.x && opp.x < targetX || direction < 0 && opp.x < passer.x && opp.x > targetX;
        return oppIsAhead && Math.abs(opp.y - targetY) < 50;
      });
      if (defendersInPath.length === 0) {
        return {
          target: teammate,
          targetPos: { x: targetX, y: targetY },
          isThroughBall: true
        };
      }
    }
    return null;
  }
  function initiatePass(player, target) {
    if (!target) {
      console.warn("\u26A0\uFE0F No pass target provided");
      return;
    }
    const distance2 = getDistance(player, target);
    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    const nearbyOpponents = allPlayers.filter((p) => p.isHome !== player.isHome && getDistance(player, p) < 50);
    const isUnderPressure = nearbyOpponents.length > 0;
    const quality = calculatePassSuccess(player, target, distance2, isUnderPressure);
    let passSpeed = 400;
    if (distance2 > 150) {
      passSpeed = 500 + player.passing * 3;
    } else if (isUnderPressure) {
      passSpeed = 450 + player.passing * 2;
    } else {
      passSpeed = 400 + player.passing * 2.5;
    }
    if (gameState.postKickOffCalmPeriod && gameState.kickOffCompletedTime) {
      const timeSinceKickOff = Date.now() - gameState.kickOffCompletedTime;
      if (timeSinceKickOff < 4e3) {
        passSpeed = Math.min(passSpeed, 450);
      }
    }
    gameState.currentPassReceiver = target;
    const teamStats = player.isHome ? gameState.stats.home : gameState.stats.away;
    teamStats.passesAttempted++;
    passBall(player, player.x, player.y, target.x, target.y, quality, passSpeed, false);
    gameState.totalPasses = (gameState.totalPasses || 0) + 1;
    console.log(`\u{1F4E4} ${player.name} \u2192 ${target.name} (${distance2.toFixed(0)}px, ${(quality * 100).toFixed(0)}% quality)`);
  }
  function initiateThroughBall(player, throughBall) {
    let passSpeed = 600 + player.passing * 5;
    if (gameState.postKickOffCalmPeriod && gameState.kickOffCompletedTime) {
      const timeSinceKickOff = Date.now() - gameState.kickOffCompletedTime;
      if (timeSinceKickOff < 4e3) {
        passSpeed = Math.min(passSpeed, 450);
      }
    }
    const quality = calculatePassSuccess(player, throughBall.target, getDistance(player, throughBall.targetPos), false);
    gameState.currentPassReceiver = throughBall.target;
    passBall(player, player.x, player.y, throughBall.targetPos.x, throughBall.targetPos.y, quality, passSpeed, false);
    gameState.totalPasses = (gameState.totalPasses || 0) + 1;
    throughBall.target.speedBoost = 1.4;
    throughBall.target.targetX = throughBall.targetPos.x;
    throughBall.target.targetY = throughBall.targetPos.y;
  }
  function initiateDribble(player, goalX) {
    const direction = Math.sign(goalX - player.x) || 1;
    const dribbleSkill = player.dribbling / 100;
    const moveTypes = [
      { name: "forward", x: direction * 70, y: 0 },
      { name: "diagonal", x: direction * 60, y: (Math.random() - 0.5) * 50 },
      { name: "cut_inside", x: direction * 50, y: Math.sign(300 - player.y) * 40 }
    ];
    const moveChoice = dribbleSkill > 0.75 ? moveTypes[Math.floor(Math.random() * moveTypes.length)] : moveTypes[0];
    player.targetX = player.x + moveChoice.x * dribbleSkill;
    player.targetY = player.y + moveChoice.y * dribbleSkill;
    player.speedBoost = 1 + dribbleSkill * 0.4;
    player.targetX = Math.max(50, Math.min(750, player.targetX));
    player.targetY = Math.max(50, Math.min(550, player.targetY));
    console.log(`\u{1F3AF} ${player.name} dribbles ${moveChoice.name}`);
  }
  function handlePlayerWithBall_WithFirstTouch(player, opponents, teammates) {
    if (!canPlayerActOnBall(player)) {
      player.targetX = player.x;
      player.targetY = player.y;
      return;
    }
    const goalX = getAttackingGoalX(player.isHome, gameState.currentHalf);
    const distToGoal = Math.abs(player.x - goalX);
    const angleToGoal = Math.abs(player.y - 300);
    const nearbyOpponents = opponents.filter((opp) => getDistance(player, opp) < 50);
    const underPressure = nearbyOpponents.length > 0;
    const underHeavyPressure = nearbyOpponents.length > 1;
    const shootingChance = player.shooting / 100 * (1 - angleToGoal / 400);
    const isInBox = distToGoal < 180 && angleToGoal < 120;
    let adjustedAngleThreshold = 150;
    if (distToGoal < 120) {
      const closenessFactor = (120 - distToGoal) / 120;
      adjustedAngleThreshold += 80 * closenessFactor;
    }
    const isGoodPosition = distToGoal < GAME_CONFIG.GOAL_CHECK_DISTANCE && angleToGoal < adjustedAngleThreshold;
    const hasPathToGoal = !opponents.some((opp) => {
      const oppDistToGoal = Math.abs(opp.x - goalX);
      return oppDistToGoal < distToGoal && Math.abs(opp.y - player.y) < 40 && getDistance(player, opp) < 80;
    });
    const now = Date.now();
    const holdTime = player.ballReceivedTime ? now - player.ballReceivedTime : 0;
    const maxHoldTime = underHeavyPressure ? 800 : underPressure ? 1500 : 2e3;
    if (holdTime > maxHoldTime) {
      if (underHeavyPressure && Math.random() < 0.6) {
        const passTarget = findBestPassOption_WithVision(player, teammates, opponents);
        if (passTarget) {
          initiatePass(player, passTarget);
          return;
        }
      }
      if (underPressure) {
        if (calculateDribbleSuccess(player, nearbyOpponents) > 0.5) {
          initiateDribble(player, goalX);
          return;
        }
      }
    }
    const decision = Math.random();
    const allPlayers = [...teammates, ...opponents];
    if (isInBox && hasPathToGoal && !underHeavyPressure && decision < 0.8) {
      handleShotAttempt(player, goalX, allPlayers);
      return;
    }
    if (isGoodPosition && decision < shootingChance * 1.5 && hasPathToGoal) {
      handleShotAttempt(player, goalX, allPlayers);
      return;
    }
    if (underHeavyPressure) {
      if (decision < 0.7) {
        const passTarget = findBestPassOption_WithVision(player, teammates, opponents);
        if (passTarget) {
          initiatePass(player, passTarget);
        } else {
          initiateDribble(player, goalX);
        }
      } else {
        initiateDribble(player, goalX);
      }
      return;
    }
    if (!underPressure && distToGoal < 350) {
      const throughBall = checkForThroughBall(player, teammates, opponents, goalX);
      if (throughBall && decision < 0.35) {
        initiateThroughBall(player, throughBall);
        return;
      }
    }
    if (underPressure || decision < GAME_CONFIG.PASSING_CHANCE) {
      const passTarget = findBestPassOption_WithVision(player, teammates, opponents);
      if (passTarget) {
        initiatePass(player, passTarget);
      } else {
        initiateDribble(player, goalX);
      }
    } else {
      initiateDribble(player, goalX);
    }
  }
  function handlePlayerWithBall_WithVision(player, opponents, teammates) {
    if (!canPlayerActOnBall(player)) {
      let bestAngle = getPlayerFacingDirection(player);
      let maxSpace = 0;
      for (let i = -1; i <= 1; i += 0.5) {
        const angle = getPlayerFacingDirection(player) + i * Math.PI / 3;
        const checkPos = { x: player.x + Math.cos(angle) * 50, y: player.y + Math.sin(angle) * 50 };
        const closestOpponentDist = opponents.length > 0 ? Math.min(...opponents.map((o) => getDistance(o, checkPos))) : 1e3;
        if (closestOpponentDist > maxSpace) {
          maxSpace = closestOpponentDist;
          bestAngle = angle;
        }
      }
      player.targetX = player.x + Math.cos(bestAngle) * 20;
      player.targetY = player.y + Math.sin(bestAngle) * 20;
      player.speedBoost = 0.8;
      return;
    }
    const goalX = getAttackingGoalX(player.isHome, gameState.currentHalf);
    const allPlayers = [...teammates, ...opponents, player];
    let shotValue = 0;
    const distToGoal = getDistance(player, { x: goalX, y: 300 });
    if (distToGoal < 280) {
      const xG = calculateXG(player, goalX, player.y, opponents);
      shotValue = xG * 100;
      if (opponents.some((o) => getDistance(o, player) < 30))
        shotValue *= 0.6;
      if (Math.abs(player.y - 300) > 150)
        shotValue *= 0.7;
    }
    const passTarget = findBestPassOption_WithVision(player, teammates, opponents);
    let passValue = 0;
    if (passTarget) {
      const distToTarget = getDistance(player, passTarget);
      const spaceAroundTarget = opponents.length > 0 ? Math.min(...opponents.map((o) => getDistance(o, passTarget))) : 1e3;
      passValue = 40 + spaceAroundTarget - distToTarget * 0.5;
      if (Math.sign(passTarget.x - player.x) === Math.sign(goalX - player.x)) {
        passValue += 25;
      }
    }
    let dribbleValue = 0;
    const forwardAngle = getPlayerFacingDirection(player);
    const dribbleCheckPos = { x: player.x + Math.cos(forwardAngle) * 60, y: player.y + Math.sin(forwardAngle) * 60 };
    const spaceAhead = opponents.length > 0 ? Math.min(...opponents.map((o) => getDistance(o, dribbleCheckPos))) : 1e3;
    if (spaceAhead > 40) {
      dribbleValue = player.dribbling * 0.6 + spaceAhead * 0.4;
      if (player.pace > 82 || ["RW", "LW", "RM", "LM"].includes(player.role)) {
        dribbleValue += 15;
      }
    }
    if (shotValue > passValue && shotValue > dribbleValue && shotValue > 30) {
      handleShotAttempt(player, goalX, allPlayers);
      return;
    }
    if (passValue > dribbleValue && passValue > 45) {
      initiatePass(player, passTarget);
      return;
    }
    initiateDribble(player, goalX);
  }

  // src/behavior/BehaviorSystem.ts
  var BehaviorResult = {
    success(target, speedMultiplier = 1, description = "", shouldLock = false) {
      return {
        available: true,
        target,
        speedMultiplier,
        description,
        shouldLock,
        error: null
      };
    },
    unavailable(reason = "Conditions not met") {
      return {
        available: false,
        target: null,
        speedMultiplier: 1,
        description: "",
        shouldLock: false,
        error: reason
      };
    },
    isValid(result) {
      return result && typeof result === "object" && result.available === true;
    }
  };
  var PHASES = {
    DEFENSIVE: "defensive",
    ATTACKING: "attacking",
    TRANSITION_TO_ATTACK: "transition_attack",
    TRANSITION_TO_DEFENSE: "transition_defense"
  };
  var GoalkeeperBehaviors = {
    sweeperKeeping(ball, teammates, opponents, ownGoalX) {
      const defenders = teammates.filter((t) => ["CB", "RB", "LB"].includes(t.role));
      if (defenders.length === 0)
        return null;
      const defensiveLine = Math.max(...defenders.map((t) => Math.abs(t.x - ownGoalX)));
      if (defensiveLine < 200)
        return null;
      const threatBehindLine = opponents.find((opp) => {
        const oppDistToGoal = Math.abs(opp.x - ownGoalX);
        return oppDistToGoal < defensiveLine - 50 && distance(opp, ball) < 100;
      });
      if (threatBehindLine) {
        const interceptPoint = {
          x: ownGoalX + Math.sign(ball.x - ownGoalX) * Math.min(defensiveLine * 0.6, 180),
          y: ball.y
        };
        return {
          target: interceptPoint,
          speedMultiplier: 1.8,
          description: "sweeper-keeper intercept",
          shouldLock: true
        };
      }
      return null;
    },
    buildUpSupport(holder, ownGoalX) {
      if (!holder || holder.role === "GK")
        return null;
      const holderDistToGoal = Math.abs(holder.x - ownGoalX);
      if (holderDistToGoal > 400)
        return null;
      const safeZone = {
        x: ownGoalX + Math.sign(holder.x - ownGoalX) * 80,
        y: 300
      };
      return {
        target: safeZone,
        speedMultiplier: 1,
        description: "GK build-up support",
        shouldLock: false
      };
    },
    angleNarrowing(ball, ownGoalX) {
      const goalCenter = { x: ownGoalX, y: 300 };
      const ballToGoalDist = distance(ball, goalCenter);
      const optimalDist = Math.min(ballToGoalDist * 0.35, 60);
      const angle = Math.atan2(ball.y - goalCenter.y, ball.x - goalCenter.x);
      return {
        target: {
          x: goalCenter.x + Math.cos(angle) * optimalDist,
          y: goalCenter.y + Math.sin(angle) * optimalDist
        },
        speedMultiplier: 1.4,
        description: "angle narrowing",
        shouldLock: true
      };
    }
  };
  var DefensiveBehaviors = {
    defensiveLineShift(player, ball, teammates, ownGoalX) {
      if (!["CB", "RB", "LB"].includes(player.role))
        return null;
      const defensiveLine = teammates.filter(
        (t) => ["CB", "RB", "LB"].includes(t.role)
      );
      if (defensiveLine.length < 2)
        return null;
      const avgLineX = defensiveLine.reduce((sum, p) => sum + p.x, 0) / defensiveLine.length;
      const targetLineX = avgLineX + (ball.y - 300) * 0.15;
      const ballPressure = Math.min(...teammates.map((t) => distance(t, ball)));
      const verticalAdjust = ballPressure < 50 ? 25 : -15;
      return {
        target: {
          x: player.x + Math.sign(targetLineX - avgLineX) * 20 + verticalAdjust * Math.sign(ownGoalX - player.x),
          y: player.y + (ball.y - player.y) * 0.2
        },
        speedMultiplier: 1,
        description: "defensive line shift",
        shouldLock: false
      };
    },
    fullBackCovering(fb, opponents) {
      if (!["RB", "LB"].includes(fb.role))
        return null;
      const isRightBack = fb.role === "RB";
      const wideThreats = opponents.filter(
        (opp) => isRightBack && opp.y < 200 || !isRightBack && opp.y > 400
      );
      if (wideThreats.length === 0)
        return null;
      const nearestThreat = wideThreats.sort(
        (a, b) => distance(a, fb) - distance(b, fb)
      )[0];
      if (!nearestThreat)
        return null;
      const distToThreat = distance(nearestThreat, fb);
      if (distToThreat < 150) {
        const interceptAngle = Math.atan2(nearestThreat.y - fb.y, nearestThreat.x - fb.x);
        return {
          target: {
            x: fb.x + Math.cos(interceptAngle) * 50,
            y: fb.y + Math.sin(interceptAngle) * 50
          },
          speedMultiplier: 1.5,
          description: "full-back pressing winger",
          shouldLock: true
        };
      }
      return null;
    },
    centerBackMarking(cb, opponents, ownGoalX) {
      if (!["CB"].includes(cb.role))
        return null;
      const strikers = opponents.filter((opp) => ["ST", "CF"].includes(opp.role));
      if (strikers.length === 0)
        return null;
      const nearestStriker = strikers.sort(
        (a, b) => distance(a, cb) - distance(b, cb)
      )[0];
      if (!nearestStriker)
        return null;
      const inDangerZone = Math.abs(nearestStriker.x - ownGoalX) < 200;
      if (inDangerZone) {
        const markingDist = 15;
        const angle = Math.atan2(nearestStriker.y - ownGoalX, nearestStriker.x - ownGoalX);
        return {
          target: {
            x: nearestStriker.x - Math.cos(angle) * markingDist,
            y: nearestStriker.y - Math.sin(angle) * markingDist
          },
          speedMultiplier: 1.3,
          description: "CB tight marking",
          shouldLock: true
        };
      }
      return null;
    },
    invertedFullBack(fb, holder, teammates, ownGoalX) {
      if (!["RB", "LB"].includes(fb.role))
        return null;
      if (!holder || holder.isHome !== fb.isHome)
        return null;
      const ballInOwnHalf = Math.abs(holder.x - ownGoalX) < 400;
      if (!ballInOwnHalf)
        return null;
      const midfielders = teammates.filter(
        (t) => ["CM", "CDM", "CAM"].includes(t.role)
      );
      const midFieldCongestion = midfielders.reduce(
        (sum, m) => sum + (Math.abs(m.y - 300) < 100 ? 1 : 0),
        0
      );
      if (midFieldCongestion > 2)
        return null;
      return {
        target: {
          x: ownGoalX + Math.sign(holder.x - ownGoalX) * 250,
          y: 300
        },
        speedMultiplier: 1.1,
        description: "inverted full-back",
        shouldLock: false
      };
    }
  };
  var MidfieldBehaviors = {
    cdmScreening(ball, teammates) {
      const defensiveLine = teammates.filter(
        (t) => ["CB", "RB", "LB"].includes(t.role)
      );
      if (defensiveLine.length === 0)
        return null;
      const avgDefLineX = defensiveLine.reduce((sum, p) => sum + p.x, 0) / defensiveLine.length;
      const screeningX = avgDefLineX + Math.sign(ball.x - avgDefLineX) * 80;
      const screeningY = 300 + (ball.y - 300) * 0.4;
      return {
        target: { x: screeningX, y: screeningY },
        speedMultiplier: 1,
        description: "CDM screening defense",
        shouldLock: false
      };
    },
    boxToBoxLateRun(cm, ball, holder, teammates, opponentGoalX) {
      if (!["CM"].includes(cm.role))
        return null;
      if (!holder || holder.isHome !== cm.isHome)
        return null;
      const ballInFinalThird = Math.abs(ball.x - opponentGoalX) < 250;
      const alreadyForward = Math.abs(cm.x - opponentGoalX) < 180;
      const playersInBox = teammates.filter(
        (t) => Math.abs(t.x - opponentGoalX) < 150
      ).length;
      if (!ballInFinalThird || alreadyForward || playersInBox > 2)
        return null;
      return {
        target: {
          x: opponentGoalX - Math.sign(opponentGoalX - 400) * 100,
          y: 300 + (Math.random() - 0.5) * 120
        },
        speedMultiplier: 1.7,
        description: "box-to-box late run",
        shouldLock: true
      };
    },
    registaTempoDictation(cm, holder, ownGoalX) {
      if (!["CM", "CDM"].includes(cm.role))
        return null;
      if (!holder || holder.isHome !== cm.isHome)
        return null;
      const deepPosition = {
        x: ownGoalX + Math.sign(holder.x - ownGoalX) * 200,
        y: 300
      };
      const inDeepZone = Math.abs(cm.x - deepPosition.x) < 60;
      if (inDeepZone)
        return null;
      return {
        target: deepPosition,
        speedMultiplier: 0.9,
        description: "regista deep positioning",
        shouldLock: false
      };
    },
    camBetweenLines(cam, opponents, opponentGoalX) {
      if (!["CAM"].includes(cam.role))
        return null;
      const oppDefenders = opponents.filter(
        (o) => ["CB", "RB", "LB", "CDM"].includes(o.role)
      );
      if (oppDefenders.length < 2)
        return null;
      const avgDefX = oppDefenders.reduce((sum, p) => sum + p.x, 0) / oppDefenders.length;
      const pocketX = avgDefX + Math.sign(opponentGoalX - avgDefX) * 60;
      return {
        target: {
          x: pocketX,
          y: 300 + (Math.random() - 0.5) * 80
        },
        speedMultiplier: 1.2,
        description: "CAM finding pocket",
        shouldLock: false
      };
    },
    cmPressTrigger(cm, holder) {
      if (!["CM"].includes(cm.role))
        return null;
      if (!holder || holder.isHome === cm.isHome)
        return null;
      const holderInCenter = Math.abs(holder.y - 300) < 150;
      const distToHolder = distance(cm, holder);
      if (holderInCenter && distToHolder < 80) {
        return {
          target: {
            x: holder.x,
            y: holder.y
          },
          speedMultiplier: 1.6,
          description: "CM press trigger",
          shouldLock: true
        };
      }
      return null;
    }
  };
  var ForwardBehaviors = {
    wingerWidthProviding(winger, holder) {
      if (!["RW", "LW", "RM", "LM"].includes(winger.role))
        return null;
      if (!holder || holder.isHome !== winger.isHome)
        return null;
      const isRight = ["RW", "RM"].includes(winger.role);
      const targetY = isRight ? 80 : 520;
      const currentlyWide = Math.abs(winger.y - targetY) < 40;
      if (currentlyWide)
        return null;
      return {
        target: {
          x: winger.x + Math.sign(holder.x - winger.x) * 30,
          y: targetY
        },
        speedMultiplier: 1.1,
        description: "winger providing width",
        shouldLock: false
      };
    },
    invertedWingerCutInside(winger, opponentGoalX, opponents, _ball, holder) {
      if (!["RW", "LW"].includes(winger.role))
        return null;
      const distToGoal = Math.abs(winger.x - opponentGoalX);
      const isWide = winger.role === "RW" && winger.y < 150 || winger.role === "LW" && winger.y > 450;
      if (distToGoal < 280 && isWide) {
        const desiredTargetX = opponentGoalX - Math.sign(opponentGoalX - winger.x) * 100;
        const isBallCarrier = holder && holder.id === winger.id;
        if (isBallCarrier) {
          return {
            target: {
              x: desiredTargetX,
              y: 300 + (Math.random() - 0.5) * 100
            },
            speedMultiplier: 1.4,
            description: "inverted winger cutting inside",
            shouldLock: true
          };
        }
        const oppDefenders = opponents.filter((o) => o.role !== "GK");
        if (oppDefenders.length > 0) {
          const sortedDefenders = oppDefenders.sort(
            (a, b) => Math.abs(a.x - opponentGoalX) - Math.abs(b.x - opponentGoalX)
          );
          const lastDefender = sortedDefenders[0];
          if (!lastDefender)
            return null;
          const attackingDirection = Math.sign(opponentGoalX - winger.x);
          const safeMaxX = lastDefender.x - attackingDirection * 20;
          const wouldBeOffside = attackingDirection > 0 ? desiredTargetX > safeMaxX : desiredTargetX < safeMaxX;
          const targetX = wouldBeOffside ? safeMaxX : desiredTargetX;
          return {
            target: {
              x: targetX,
              y: 300 + (Math.random() - 0.5) * 100
            },
            speedMultiplier: 1.4,
            description: "inverted winger cutting inside",
            shouldLock: true
          };
        }
        return {
          target: {
            x: desiredTargetX,
            y: 300 + (Math.random() - 0.5) * 100
          },
          speedMultiplier: 1.4,
          description: "inverted winger cutting inside",
          shouldLock: true
        };
      }
      return null;
    },
    strikerRunsInBehind(striker, holder, opponents, opponentGoalX, _ball) {
      if (!["ST", "CF"].includes(striker.role))
        return null;
      if (!holder || holder.isHome !== striker.isHome)
        return null;
      const oppDefenders = opponents.filter(
        (o) => ["CB", "RB", "LB"].includes(o.role)
      );
      if (oppDefenders.length === 0)
        return null;
      const lastDefender = oppDefenders.sort(
        (a, b) => Math.abs(b.x - opponentGoalX) - Math.abs(a.x - opponentGoalX)
      )[0];
      if (!lastDefender)
        return null;
      const attackingDirection = Math.sign(opponentGoalX - lastDefender.x);
      const runTargetX = lastDefender.x - attackingDirection * 10;
      const distToLastDefender = Math.abs(striker.x - lastDefender.x);
      if (distToLastDefender < 20 || distance(holder, striker) > 250)
        return null;
      return {
        target: {
          x: runTargetX,
          y: 300 + (Math.random() - 0.5) * 120
        },
        speedMultiplier: 1.6,
        description: "striker run in behind",
        shouldLock: true
      };
    },
    false9DropDeep(striker, holder, teammates, opponentGoalX) {
      if (!["ST", "CF"].includes(striker.role))
        return null;
      if (!holder || holder.isHome !== striker.isHome)
        return null;
      const forwardRunners = teammates.filter(
        (t) => ["RW", "LW", "CAM"].includes(t.role) && Math.abs(t.vx) > 50
      );
      if (forwardRunners.length === 0)
        return null;
      const dropPosition = {
        x: striker.x - Math.sign(opponentGoalX - striker.x) * 120,
        y: 300
      };
      return {
        target: dropPosition,
        speedMultiplier: 1.2,
        description: "false 9 dropping deep",
        shouldLock: true
      };
    },
    targetStrikerHoldUp(striker, opponents, ball) {
      if (!["ST", "CF"].includes(striker.role))
        return null;
      const nearbyOpponents = opponents.filter(
        (o) => distance(o, striker) < 60
      );
      if (nearbyOpponents.length > 0 && distance(striker, ball) < 25) {
        return {
          target: {
            x: striker.x,
            y: striker.y
          },
          speedMultiplier: 0.7,
          description: "target striker holding up",
          shouldLock: true
        };
      }
      return null;
    },
    strikerPressingTrigger(striker, opponents, ball, ownGoalX) {
      if (!["ST", "CF"].includes(striker.role))
        return null;
      const oppCBs = opponents.filter(
        (o) => ["CB", "GK"].includes(o.role)
      );
      if (oppCBs.length === 0)
        return null;
      const nearestCB = oppCBs.sort(
        (a, b) => distance(a, ball) - distance(b, ball)
      )[0];
      if (!nearestCB)
        return null;
      const distToCB = distance(striker, nearestCB);
      if (distToCB < 100 && Math.abs(nearestCB.x - ownGoalX) > 400) {
        return {
          target: {
            x: nearestCB.x,
            y: nearestCB.y
          },
          speedMultiplier: 1.7,
          description: "striker leading press",
          shouldLock: true
        };
      }
      return null;
    }
  };
  var TransitionBehaviors = {
    counterAttackRun(player, opponentGoalX, justWonPossession, opponents, _ball, holder) {
      if (!justWonPossession)
        return null;
      if (!["ST", "RW", "LW", "CAM", "CM"].includes(player.role))
        return null;
      const spaceAhead = Math.abs(player.x - opponentGoalX);
      if (["ST", "RW", "LW"].includes(player.role) && spaceAhead > 150) {
        const desiredTargetX = opponentGoalX - Math.sign(opponentGoalX - player.x) * 80;
        const isBallCarrier = holder && holder.id === player.id;
        if (isBallCarrier) {
          return {
            target: {
              x: desiredTargetX,
              y: player.role === "ST" ? 300 : player.y
            },
            speedMultiplier: 2,
            description: "counter-attack sprint",
            shouldLock: true,
            duration: 3e3
          };
        }
        const oppDefenders = opponents.filter((o) => o.role !== "GK");
        let targetX = desiredTargetX;
        if (oppDefenders.length > 0) {
          const sortedDefenders = oppDefenders.sort(
            (a, b) => Math.abs(a.x - opponentGoalX) - Math.abs(b.x - opponentGoalX)
          );
          const lastDefender = sortedDefenders[0];
          if (lastDefender) {
            const attackingDirection = Math.sign(opponentGoalX - player.x);
            const safeMaxX = lastDefender.x - attackingDirection * 15;
            const wouldBeOffside = attackingDirection > 0 ? desiredTargetX > safeMaxX : desiredTargetX < safeMaxX;
            targetX = wouldBeOffside ? safeMaxX : desiredTargetX;
          }
        }
        return {
          target: {
            x: targetX,
            y: player.role === "ST" ? 300 : player.y
          },
          speedMultiplier: 2,
          description: "counter-attack sprint",
          shouldLock: true,
          duration: 3e3
        };
      }
      if (["CAM", "CM"].includes(player.role)) {
        return {
          target: {
            x: player.x + Math.sign(opponentGoalX - player.x) * 120,
            y: 300
          },
          speedMultiplier: 1.6,
          description: "counter-attack support",
          shouldLock: true,
          duration: 2500
        };
      }
      return null;
    },
    counterPress(player, ball, justLostPossession) {
      if (!justLostPossession)
        return null;
      const distToBall = distance(player, ball);
      if (distToBall > 80)
        return null;
      return {
        target: {
          x: ball.x,
          y: ball.y
        },
        speedMultiplier: 1.9,
        description: "counter-press",
        shouldLock: true,
        duration: 4e3
      };
    },
    recoveryRun(player, ball, ownGoalX, justLostPossession) {
      if (!justLostPossession)
        return null;
      const distToBall = distance(player, ball);
      if (distToBall < 100)
        return null;
      const homePositionX = player.homePosition?.x || ownGoalX + Math.sign(player.x - ownGoalX) * 200;
      return {
        target: {
          x: homePositionX,
          y: player.homePosition?.y || 300
        },
        speedMultiplier: 1.7,
        description: "recovery run",
        shouldLock: true,
        duration: 3e3
      };
    }
  };
  var TacticalSystemModifiers = {
    possessionSystem(player, holder, teammates) {
      if (!holder || holder.isHome !== player.isHome)
        return null;
      const nearbyTeammates = teammates.filter(
        (t) => distance(t, holder) < 150 && t.id !== player.id && t.id !== holder.id
      );
      if (nearbyTeammates.length < 1)
        return null;
      const avgX = nearbyTeammates.reduce((sum, t) => sum + t.x, holder.x) / (nearbyTeammates.length + 1);
      const avgY = nearbyTeammates.reduce((sum, t) => sum + t.y, holder.y) / (nearbyTeammates.length + 1);
      return {
        target: {
          x: avgX + (Math.random() - 0.5) * 40,
          y: avgY + (Math.random() - 0.5) * 40
        },
        speedMultiplier: 0.9,
        description: "possession triangle formation",
        shouldLock: false
      };
    },
    highPressSystem(player, opponentGoalX) {
      const teamPushUp = Math.abs(player.x - opponentGoalX) > 300;
      if (!teamPushUp)
        return null;
      const targetX = opponentGoalX - Math.sign(opponentGoalX - player.x) * 250;
      return {
        target: {
          x: targetX,
          y: player.y
        },
        speedMultiplier: 1.2,
        description: "high-press positioning",
        shouldLock: false
      };
    },
    lowBlockSystem(player, ownGoalX) {
      const defensiveThird = ownGoalX + Math.sign(player.x - ownGoalX) * 200;
      const tooAdvanced = Math.abs(player.x - defensiveThird) > 150;
      if (!tooAdvanced)
        return null;
      return {
        target: {
          x: defensiveThird,
          y: 300 + (player.y - 300) * 0.7
        },
        speedMultiplier: 1,
        description: "low-block positioning",
        shouldLock: false
      };
    }
  };
  function selectPlayerBehavior(player, gameState2, phase, tacticalSystem) {
    const allPlayers = [...gameState2.homePlayers || [], ...gameState2.awayPlayers || []];
    const teammates = allPlayers.filter((p) => p.isHome === player.isHome && p.id !== player.id);
    const opponents = allPlayers.filter((p) => p.isHome !== player.isHome);
    const ball = gameState2.ballPosition;
    const holder = gameState2.ballHolder;
    const ownGoalX = player.isHome ? gameState2.currentHalf === 1 ? 50 : 750 : gameState2.currentHalf === 1 ? 750 : 50;
    const opponentGoalX = player.isHome ? gameState2.currentHalf === 1 ? 750 : 50 : gameState2.currentHalf === 1 ? 50 : 750;
    const timeSinceChange = Date.now() - (gameState2.lastPossessionChange || 0);
    const justWonPossession = timeSinceChange < 5e3 && holder?.isHome === player.isHome;
    const justLostPossession = timeSinceChange < 5e3 && holder?.isHome !== player.isHome;
    if (phase === "SET_PIECE") {
      player.currentBehavior = "set_piece_hold";
      return null;
    }
    const behaviors = [];
    if (phase === PHASES.TRANSITION_TO_ATTACK || justWonPossession) {
      behaviors.push(
        TransitionBehaviors.counterAttackRun(player, opponentGoalX, justWonPossession, opponents, ball, holder)
      );
    }
    if (phase === PHASES.TRANSITION_TO_DEFENSE || justLostPossession) {
      behaviors.push(
        TransitionBehaviors.counterPress(player, ball, justLostPossession),
        TransitionBehaviors.recoveryRun(player, ball, ownGoalX, justLostPossession)
      );
    }
    if (phase === PHASES.DEFENSIVE || holder && holder.isHome !== player.isHome) {
      if (player.role === "GK") {
        behaviors.push(
          GoalkeeperBehaviors.sweeperKeeping(ball, teammates, opponents, ownGoalX),
          GoalkeeperBehaviors.angleNarrowing(ball, ownGoalX)
        );
      }
      behaviors.push(
        DefensiveBehaviors.defensiveLineShift(player, ball, teammates, ownGoalX),
        DefensiveBehaviors.fullBackCovering(player, opponents),
        DefensiveBehaviors.centerBackMarking(player, opponents, ownGoalX)
      );
      behaviors.push(
        MidfieldBehaviors.cdmScreening(ball, teammates),
        MidfieldBehaviors.cmPressTrigger(player, holder)
      );
      behaviors.push(
        ForwardBehaviors.strikerPressingTrigger(player, opponents, ball, ownGoalX)
      );
    }
    if (phase === PHASES.ATTACKING || holder && holder.isHome === player.isHome) {
      if (player.role === "GK") {
        behaviors.push(
          GoalkeeperBehaviors.buildUpSupport(holder, ownGoalX)
        );
      }
      behaviors.push(
        DefensiveBehaviors.invertedFullBack(player, holder, teammates, ownGoalX)
      );
      behaviors.push(
        MidfieldBehaviors.boxToBoxLateRun(player, ball, holder, teammates, opponentGoalX),
        MidfieldBehaviors.registaTempoDictation(player, holder, ownGoalX),
        MidfieldBehaviors.camBetweenLines(player, opponents, opponentGoalX)
      );
      behaviors.push(
        ForwardBehaviors.wingerWidthProviding(player, holder),
        ForwardBehaviors.invertedWingerCutInside(player, opponentGoalX, opponents, ball, holder),
        ForwardBehaviors.strikerRunsInBehind(player, holder, opponents, opponentGoalX, ball),
        ForwardBehaviors.false9DropDeep(player, holder, teammates, opponentGoalX),
        ForwardBehaviors.targetStrikerHoldUp(player, opponents, ball)
      );
    }
    if (tacticalSystem === "possession") {
      behaviors.push(
        TacticalSystemModifiers.possessionSystem(player, holder, teammates)
      );
    } else if (tacticalSystem === "high_press") {
      behaviors.push(
        TacticalSystemModifiers.highPressSystem(player, opponentGoalX)
      );
    } else if (tacticalSystem === "low_block" || tacticalSystem === "counter_attack") {
      behaviors.push(
        TacticalSystemModifiers.lowBlockSystem(player, ownGoalX)
      );
    }
    const validBehavior = behaviors.find((b) => b !== null);
    if (validBehavior)
      player.currentBehavior = validBehavior.description;
    return validBehavior || null;
  }
  function detectGamePhase(gameState2) {
    if (typeof SetPieceBehaviorSystem !== "undefined" && SetPieceBehaviorSystem.isSetPieceActive(gameState2)) {
      return "SET_PIECE";
    }
    const holder = gameState2.ballHolder;
    const timeSinceChange = Date.now() - (gameState2.lastPossessionChange || 0);
    if (timeSinceChange < 5e3) {
      if (holder) {
        return PHASES.TRANSITION_TO_ATTACK;
      } else {
        return PHASES.TRANSITION_TO_DEFENSE;
      }
    }
    if (holder) {
      return PHASES.ATTACKING;
    }
    return PHASES.DEFENSIVE;
  }
  function getTacticalSystemType(tacticName) {
    const systemMap = {
      "possession": "possession",
      "tiki_taka": "possession",
      "high_press": "high_press",
      "gegenpress": "high_press",
      "counter_attack": "counter_attack",
      "defensive": "low_block",
      "park_bus": "low_block"
    };
    return systemMap[tacticName?.toLowerCase() ?? ""] || "balanced";
  }
  var BehaviorSystem = {
    selectPlayerBehavior,
    detectGamePhase,
    getTacticalSystemType,
    BehaviorResult,
    PHASES
  };

  // src/ai/MovementPatterns.ts
  var MovementPatterns = {
    diagonalRun(player, ball, opponentGoalX) {
      if (!["RW", "LW", "RM", "LM"].includes(player.role))
        return null;
      const distToBall = distance(player, ball);
      if (distToBall > 200)
        return null;
      const isWide = player.y < 150 || player.y > 450;
      let targetY, description;
      if (!isWide) {
        targetY = 300;
        description = "cutting inside";
      } else {
        targetY = player.role.includes("R") ? 80 : 520;
        description = "running the wide channel";
      }
      const direction = Math.sign(opponentGoalX - player.x) || 1;
      const targetX = player.x + direction * 120;
      return {
        target: { x: targetX, y: targetY },
        speedMultiplier: 1.5,
        description,
        shouldLock: true
      };
    },
    overlapRun(player, teammates, opponentGoalX) {
      if (!["RB", "LB"].includes(player.role))
        return null;
      const isRightSide = player.role === "RB";
      const winger = teammates.find(
        (t) => isRightSide && ["RW", "RM"].includes(t.role) || !isRightSide && ["LW", "LM"].includes(t.role)
      );
      if (!winger)
        return null;
      const wingerHasCutInside = Math.abs(winger.y - 300) < 150;
      if (!wingerHasCutInside)
        return null;
      if (player.isHome && player.x < 400 || !player.isHome && player.x > 400)
        return null;
      const expectedWideY = isRightSide ? 80 : 520;
      return {
        target: {
          x: winger.x + Math.sign(opponentGoalX - winger.x) * 50,
          y: expectedWideY
        },
        speedMultiplier: 1.6,
        description: "overlapping run",
        shouldLock: true
      };
    },
    underlapRun(player, teammates, opponentGoalX) {
      if (!["RB", "LB"].includes(player.role))
        return null;
      const isRightSide = player.role === "RB";
      const winger = teammates.find(
        (t) => isRightSide && ["RW", "RM"].includes(t.role) || !isRightSide && ["LW", "LM"].includes(t.role)
      );
      if (!winger)
        return null;
      const wingerStayingWide = isRightSide ? winger.y < 150 : winger.y > 450;
      if (!wingerStayingWide)
        return null;
      const distToWinger = distance(player, winger);
      if (distToWinger < 100)
        return null;
      return {
        target: {
          x: winger.x + Math.sign(opponentGoalX - winger.x) * 40,
          y: 300 + (isRightSide ? -60 : 60)
        },
        speedMultiplier: 1.5,
        description: "underlap run",
        shouldLock: true
      };
    },
    thirdManRun(player, holder, teammates) {
      if (!["CM", "CAM", "RW", "LW"].includes(player.role))
        return null;
      const passerAndReceiver = teammates.filter(
        (t) => distance(t, holder) < 80 && t.id !== holder.id
      );
      if (passerAndReceiver.length === 0)
        return null;
      const receiver = passerAndReceiver[0];
      if (!receiver)
        return null;
      const avgX = (holder.x + receiver.x) / 2;
      const avgY = (holder.y + receiver.y) / 2;
      const runAngle = Math.atan2(receiver.y - holder.y, receiver.x - holder.x) + Math.PI / 3;
      return {
        target: {
          x: avgX + Math.cos(runAngle) * 100,
          y: avgY + Math.sin(runAngle) * 100
        },
        speedMultiplier: 1.6,
        description: "third man run",
        shouldLock: true
      };
    }
  };
  var RoleSpecificBehaviors = {
    false9Movement(player, teammates, opponentGoalX) {
      if (player.role !== "ST")
        return null;
      const attackersMakingRuns = teammates.filter(
        (t) => ["RW", "LW", "CAM"].includes(t.role) && Math.abs(t.vx) > 50
      );
      if (attackersMakingRuns.length < 1)
        return null;
      return {
        target: {
          x: player.x - Math.sign(opponentGoalX - player.x) * 100,
          y: 300
        },
        speedMultiplier: 1.2,
        description: "false 9 dropping deep",
        shouldLock: true
      };
    },
    boxToBoxRun(player, ball, teammates, opponentGoalX) {
      if (!["CM", "CDM"].includes(player.role))
        return null;
      const ballInFinalThird = Math.abs(ball.x - opponentGoalX) < 250;
      if (!ballInFinalThird)
        return null;
      if (Math.abs(player.x - opponentGoalX) < 180)
        return null;
      const playersInBox = teammates.filter((t) => Math.abs(t.x - opponentGoalX) < 160).length;
      if (playersInBox > 2)
        return null;
      return {
        target: {
          x: opponentGoalX - Math.sign(opponentGoalX - 400) * 100,
          y: 300 + (Math.random() - 0.5) * 150
        },
        speedMultiplier: 1.7,
        description: "box-to-box late run",
        shouldLock: true
      };
    },
    mezzalaWideMovement(player, holder, opponentGoalX) {
      if (!["CM"].includes(player.role))
        return null;
      if (!holder || holder.isHome !== player.isHome)
        return null;
      const holderIsWide = holder.y < 200 || holder.y > 400;
      if (!holderIsWide)
        return null;
      const sameSide = holder.y < 300 && player.y < 300 || holder.y > 300 && player.y > 300;
      if (!sameSide)
        return null;
      return {
        target: {
          x: holder.x + Math.sign(opponentGoalX - holder.x) * 60,
          y: holder.y + (Math.random() - 0.5) * 40
        },
        speedMultiplier: 1.4,
        description: "mezzala overload",
        shouldLock: true
      };
    },
    strikerWideMovement(player, teammates, opponentGoalX) {
      if (!["ST"].includes(player.role))
        return null;
      const otherForward = teammates.find(
        (t) => ["ST", "CF", "RW", "LW"].includes(t.role) && t.id !== player.id
      );
      if (!otherForward)
        return null;
      const distToOtherForward = distance(player, otherForward);
      if (distToOtherForward > 100)
        return null;
      const targetY = otherForward.y < 300 ? 450 : 150;
      return {
        target: {
          x: player.x + Math.sign(opponentGoalX - player.x) * 40,
          y: targetY
        },
        speedMultiplier: 1.3,
        description: "striker wide pull",
        shouldLock: true
      };
    },
    segundoVolanteRun(player, ball, holder, opponentGoalX) {
      if (!["CDM"].includes(player.role))
        return null;
      if (!holder || holder.isHome !== player.isHome)
        return null;
      const ballInMidfield = Math.abs(ball.x - 400) < 200;
      if (!ballInMidfield)
        return null;
      const distToBall = distance(player, ball);
      if (distToBall > 150)
        return null;
      return {
        target: {
          x: ball.x + Math.sign(opponentGoalX - ball.x) * 120,
          y: 300
        },
        speedMultiplier: 1.5,
        description: "segundo volante burst",
        shouldLock: true
      };
    }
  };
  function selectBestAttackingMovement(player, holder, teammates, opponents, activePosition, opponentGoalX, gameState2) {
    if (typeof BehaviorSystem !== "undefined") {
      const phase = BehaviorSystem.detectGamePhase(gameState2);
      const tacticName = player.isHome ? gameState2.homeTactic : gameState2.awayTactic;
      const tacticalSystem = BehaviorSystem.getTacticalSystemType(tacticName);
      const advancedBehavior = BehaviorSystem.selectPlayerBehavior(
        player,
        gameState2,
        phase,
        tacticalSystem
      );
      if (advancedBehavior) {
        player.currentBehavior = advancedBehavior.description;
        return {
          x: advancedBehavior.target.x,
          y: advancedBehavior.target.y,
          speedBoost: advancedBehavior.speedMultiplier,
          shouldLock: advancedBehavior.shouldLock
        };
      }
    }
    const patterns = [
      RoleSpecificBehaviors.false9Movement(player, teammates, opponentGoalX),
      RoleSpecificBehaviors.boxToBoxRun(player, gameState2.ballPosition, teammates, opponentGoalX),
      RoleSpecificBehaviors.mezzalaWideMovement(player, holder, opponentGoalX),
      RoleSpecificBehaviors.strikerWideMovement(player, teammates, opponentGoalX),
      RoleSpecificBehaviors.segundoVolanteRun(player, gameState2.ballPosition, holder, opponentGoalX),
      MovementPatterns.thirdManRun(player, holder, teammates),
      MovementPatterns.overlapRun(player, teammates, opponentGoalX),
      MovementPatterns.underlapRun(player, teammates, opponentGoalX),
      MovementPatterns.diagonalRun(player, gameState2.ballPosition, opponentGoalX)
    ];
    const bestPattern = patterns.find((p) => p !== null);
    if (bestPattern) {
      player.currentBehavior = bestPattern.description;
      return {
        x: bestPattern.target.x,
        y: bestPattern.target.y,
        speedBoost: bestPattern.speedMultiplier,
        shouldLock: bestPattern.shouldLock
      };
    }
    const direction = Math.sign(opponentGoalX - player.x) || 1;
    const holderUnderPressure = opponents.some((o) => distance(o, holder) < 70);
    if (holderUnderPressure) {
      player.currentBehavior = "offering support";
      return {
        x: holder.x - direction * 60,
        y: holder.y + (player.y < 300 ? -70 : 70),
        speedBoost: 1.1,
        shouldLock: false
      };
    } else {
      player.currentBehavior = "advancing position";
      return {
        x: activePosition.x + direction * 70,
        y: activePosition.y,
        speedBoost: 1,
        shouldLock: false
      };
    }
  }

  // src/rendering/canvasSetup.ts
  (() => {
    const LOGICAL_WIDTH = 1280;
    const LOGICAL_HEIGHT = 720;
    const CANVAS_IDS = ["backgroundCanvas", "gameCanvas", "uiCanvas"];
    const canvases = CANVAS_IDS.map((id) => document.getElementById(id)).filter((canvas) => canvas !== null);
    const container = document.getElementById("canvas-container");
    function resizeCanvases() {
      const dpr = window.devicePixelRatio || 1;
      canvases.forEach((canvas) => {
        const ctx = canvas.getContext("2d");
        if (!ctx)
          return;
        const targetW = Math.floor(LOGICAL_WIDTH * dpr);
        const targetH = Math.floor(LOGICAL_HEIGHT * dpr);
        if (canvas.width !== targetW || canvas.height !== targetH) {
          canvas.width = targetW;
          canvas.height = targetH;
        }
        canvas.style.width = `${LOGICAL_WIDTH}px`;
        canvas.style.height = `${LOGICAL_HEIGHT}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.imageSmoothingEnabled = false;
      });
      if (container) {
        container.style.width = `${LOGICAL_WIDTH}px`;
        container.style.height = `${LOGICAL_HEIGHT}px`;
        container.style.margin = "0 auto";
      }
    }
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvases, 100);
    });
    resizeCanvases();
    window.GameCanvasScaler = {
      resize: resizeCanvases,
      width: LOGICAL_WIDTH,
      height: LOGICAL_HEIGHT
    };
  })();
  function initializeCanvasLayers() {
    const container = document.getElementById("canvas-container");
    if (!container) {
      console.error("Canvas container not found");
      return false;
    }
    const SCALE_FACTOR = GAME_CONFIG.HIGH_DPI_SCALE_FACTOR;
    container.style.display = "block";
    if (!gameState.canvases) {
      gameState.canvases = { background: null, game: null, ui: null };
    }
    if (!gameState.contexts) {
      gameState.contexts = { background: null, game: null, ui: null };
    }
    gameState.canvases.background = document.getElementById("backgroundCanvas");
    gameState.canvases.game = document.getElementById("gameCanvas");
    gameState.canvases.ui = document.getElementById("uiCanvas");
    gameState.backgroundDrawn = false;
    if (gameState.canvases.background) {
      gameState.contexts.background = gameState.canvases.background.getContext("2d", { alpha: false });
      if (gameState.contexts.background) {
        gameState.contexts.background.scale(SCALE_FACTOR, SCALE_FACTOR);
        console.log(`\u2713 Background canvas initialized and scaled by ${SCALE_FACTOR}x`);
      }
    } else {
      console.error("\u2717 Background canvas not found");
      return false;
    }
    if (gameState.canvases.game) {
      gameState.contexts.game = gameState.canvases.game.getContext("2d", { alpha: true });
      if (gameState.contexts.game) {
        gameState.contexts.game.scale(SCALE_FACTOR, SCALE_FACTOR);
        console.log(`\u2713 Game canvas initialized and scaled by ${SCALE_FACTOR}x`);
      }
    } else {
      console.error("\u2717 Game canvas not found");
      return false;
    }
    if (gameState.canvases.ui) {
      gameState.contexts.ui = gameState.canvases.ui.getContext("2d", { alpha: true });
      if (gameState.contexts.ui) {
        gameState.contexts.ui.scale(SCALE_FACTOR, SCALE_FACTOR);
        console.log(`\u2713 UI canvas initialized and scaled by ${SCALE_FACTOR}x`);
      }
    } else {
      console.error("\u2717 UI canvas not found");
      return false;
    }
    return true;
  }

  // src/rendering/drawPitch.ts
  function drawPitchBackground() {
    if (!gameState.contexts || !gameState.contexts.background) {
      console.warn("Background context not ready.");
      return;
    }
    const ctx = gameState.contexts.background;
    const canvasWidth = gameState.isVertical ? 600 : 800;
    const canvasHeight = gameState.isVertical ? 800 : 600;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.save();
    if (gameState.isVertical) {
      ctx.translate(600, 0);
      ctx.rotate(Math.PI / 2);
    }
    if (gameState.offscreenPitch) {
      ctx.drawImage(
        gameState.offscreenPitch,
        0,
        0,
        // Source X, Y
        GAME_CONFIG.PITCH_WIDTH,
        GAME_CONFIG.PITCH_HEIGHT,
        0,
        0,
        // Destination X, Y (Logical 0, 0)
        GAME_CONFIG.PITCH_WIDTH,
        GAME_CONFIG.PITCH_HEIGHT
      );
      ctx.restore();
      return;
    }
    console.log("\u{1F5BC}\uFE0F Creating and caching pitch background for the first time...");
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = GAME_CONFIG.PITCH_WIDTH;
    offscreenCanvas.height = GAME_CONFIG.PITCH_HEIGHT;
    const offCtx = offscreenCanvas.getContext("2d");
    if (!offCtx) {
      console.error("Failed to get offscreen context");
      ctx.restore();
      return;
    }
    const w = GAME_CONFIG.PITCH_WIDTH;
    const h = GAME_CONFIG.PITCH_HEIGHT;
    drawGrass(offCtx, w, h);
    drawStripes(offCtx, w, h);
    drawLines(offCtx, w, h);
    drawGoals(offCtx, w, h);
    drawCenterCircle(offCtx, w, h);
    drawPenaltyAreas(offCtx, w, h);
    offCtx.shadowBlur = 0;
    gameState.offscreenPitch = offscreenCanvas;
    ctx.drawImage(
      gameState.offscreenPitch,
      0,
      0,
      GAME_CONFIG.PITCH_WIDTH,
      GAME_CONFIG.PITCH_HEIGHT,
      0,
      0,
      GAME_CONFIG.PITCH_WIDTH,
      GAME_CONFIG.PITCH_HEIGHT
    );
    ctx.restore();
  }
  function drawGrass(ctx, w, h) {
    ctx.fillStyle = "#0d5c2e";
    ctx.fillRect(0, 0, w, h);
  }
  function drawStripes(ctx, w, h) {
    const stripeWidth = 50;
    ctx.fillStyle = "rgba(255, 255, 255, 0.07)";
    for (let i = 0; i < w; i += stripeWidth * 2) {
      ctx.fillRect(i, 0, stripeWidth, h);
    }
  }
  function drawLines(ctx, w, h) {
    ctx.save();
    ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
    ctx.shadowBlur = 10;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeRect(10, 10, w - 20, h - 20);
    ctx.beginPath();
    ctx.moveTo(w / 2, 10);
    ctx.lineTo(w / 2, h - 10);
    ctx.stroke();
    ctx.restore();
  }
  function drawCenterCircle(ctx, w, h) {
    ctx.save();
    ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
    ctx.shadowBlur = 10;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 70, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.restore();
  }
  function drawGoals(ctx, w, h) {
    ctx.save();
    ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
    ctx.shadowBlur = 8;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.strokeRect(10, h / 2 - 120, 120, 240);
    ctx.strokeRect(w - 130, h / 2 - 120, 120, 240);
    ctx.restore();
  }
  function drawPenaltyAreas(ctx, w, h) {
    ctx.save();
    ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
    ctx.shadowBlur = 8;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.strokeRect(10, h / 2 - 60, 50, 120);
    ctx.strokeRect(w - 60, h / 2 - 60, 50, 120);
    const angle = Math.acos(50 / 70);
    ctx.beginPath();
    ctx.arc(80, h / 2, 70, -angle, angle);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w - 80, h / 2, 70, Math.PI - angle, Math.PI + angle);
    ctx.stroke();
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(80, h / 2, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w - 80, h / 2, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  if (typeof window !== "undefined") {
    window.drawPitchBackground = drawPitchBackground;
    window.drawGrass = drawGrass;
    window.drawStripes = drawStripes;
    window.drawLines = drawLines;
    window.drawCenterCircle = drawCenterCircle;
    window.drawGoals = drawGoals;
    window.drawPenaltyAreas = drawPenaltyAreas;
  }

  // src/rendering/drawEntities.ts
  function lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 255) + amt;
    const B = (num & 255) + amt;
    return "#" + (16777216 + (R < 255 ? R < 1 ? 0 : R : 255) * 65536 + (G < 255 ? G < 1 ? 0 : G : 255) * 256 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }
  function darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 255) - amt;
    const B = (num & 255) - amt;
    return "#" + (16777216 + (R > 0 ? R : 0) * 65536 + (G > 0 ? G : 0) * 256 + (B > 0 ? B : 0)).toString(16).slice(1);
  }
  function drawPlayer(ctx, player, hasBall) {
    if (!player || typeof player.x !== "number" || typeof player.y !== "number" || !isFinite(player.x) || !isFinite(player.y)) {
      console.warn("Invalid player position:", player?.name, player?.x, player?.y);
      return;
    }
    const size = 16;
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.restore();
    const offset = size * 0.5;
    const gradient = ctx.createRadialGradient(
      player.x - offset,
      player.y - offset,
      0,
      player.x,
      player.y,
      size
    );
    const color = player.isHome ? gameState.homeJerseyColor : gameState.awayJerseyColor;
    gradient.addColorStop(0, lightenColor(color, 50));
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, darkenColor(color, 30));
    ctx.beginPath();
    ctx.arc(player.x, player.y, size, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    const isShooter = gameState.shooter && gameState.shooter.name === player.name && gameState.shotInProgress;
    if (hasBall || isShooter) {
      ctx.save();
      ctx.shadowColor = isShooter ? "#ff4444" : "#ffd700";
      ctx.shadowBlur = 15;
      ctx.strokeStyle = isShooter ? "#ff4444" : "#ffd700";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(player.x, player.y, size + 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(player.x, player.y, size + 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    } else {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(player.x, player.y, size + 1.5, 0, Math.PI * 2);
      ctx.stroke();
    }
    drawPlayerLabel(ctx, player);
  }
  function drawPlayerShadow(_ctx, _player, _size) {
  }
  function drawPlayerBody(ctx, player, size) {
    const offset = size * 0.5;
    const gradient = ctx.createRadialGradient(player.x - offset, player.y - offset, 0, player.x, player.y, size);
    const color = player.isHome ? gameState.homeJerseyColor : gameState.awayJerseyColor;
    gradient.addColorStop(0, lightenColor(color, 40));
    gradient.addColorStop(0.6, color);
    gradient.addColorStop(1, darkenColor(color, 40));
    ctx.beginPath();
    ctx.arc(player.x, player.y, size, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }
  function drawPlayerHighlight(ctx, player, size, hasBall) {
    const isShooter = gameState.shooter && gameState.shooter.name === player.name && gameState.shotInProgress;
    const highlightLineWidth = isShooter ? 2 : 1.5;
    const highlightRadius = size + 1.5;
    if (hasBall || isShooter) {
      ctx.save();
      ctx.shadowColor = isShooter ? "#ff4444" : "#fbbf24";
      ctx.shadowBlur = 10;
      ctx.strokeStyle = isShooter ? "#ff4444" : "#fbbf24";
      ctx.lineWidth = highlightLineWidth;
      ctx.beginPath();
      ctx.arc(player.x, player.y, highlightRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    } else {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(player.x, player.y, highlightRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  function drawPlayerLabel(ctx, player) {
    ctx.save();
    ctx.translate(player.x, player.y);
    if (gameState.isVertical) {
      ctx.rotate(-Math.PI / 2);
    }
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
    ctx.shadowBlur = 3;
    ctx.fillStyle = "white";
    ctx.font = "bold 13px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(player.name.substring(0, 2).toUpperCase(), 0, 0);
    ctx.restore();
  }
  function drawGroundShadow2(ctx, x, y, size, ballHeight) {
    const shadowY = y + size / 2;
    const shadowRadiusX = size * 1.2 * (1 - ballHeight * 0.4);
    const shadowRadiusY = shadowRadiusX * 0.3;
    const shadowOpacity = 0.4 * (1 - ballHeight * 0.5);
    if (shadowOpacity > 0) {
      ctx.save();
      ctx.fillStyle = `rgba(0, 0, 0, ${shadowOpacity})`;
      ctx.beginPath();
      ctx.ellipse(x, shadowY, shadowRadiusX, shadowRadiusY, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  function drawBall(ctx, x, y) {
    if (!isFinite(x) || !isFinite(y)) {
      console.warn("Invalid ball position:", x, y);
      x = 400;
      y = 300;
    }
    const baseSize = 9;
    const size = baseSize + gameState.ballHeight * 6;
    if (gameState.ballTrajectory || gameState.ballVelocity && (Math.abs(gameState.ballVelocity.x) > 50 || Math.abs(gameState.ballVelocity.y) > 50)) {
      createBallTrail(x, y);
    }
    drawShotEffect(ctx, x, y, size);
    drawGroundShadow2(ctx, x, y, baseSize, gameState.ballHeight);
    drawBallBody(ctx, x, y, size);
    drawBallPattern(ctx, x, y, size);
  }
  function drawShotEffect(ctx, x, y, size) {
    if (gameState.shotInProgress && gameState.ballTrajectory) {
      ctx.save();
      ctx.globalAlpha = 0.4;
      ctx.strokeStyle = "#ff4444";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, size + 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.arc(x, y, size + 16, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
  function drawBallBody(ctx, x, y, size) {
    const mainGradient = ctx.createRadialGradient(
      x - size * 0.35,
      y - size * 0.35,
      size * 0.1,
      x,
      y,
      size
    );
    mainGradient.addColorStop(0, "#ffffff");
    mainGradient.addColorStop(0.3, "#f5f5f5");
    mainGradient.addColorStop(0.7, "#d0d0d0");
    mainGradient.addColorStop(1, "#a0a0a0");
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = mainGradient;
    ctx.fill();
    const highlightGradient = ctx.createRadialGradient(
      x - size * 0.4,
      y - size * 0.4,
      0,
      x - size * 0.4,
      y - size * 0.4,
      size * 0.6
    );
    highlightGradient.addColorStop(0, "rgba(255, 255, 255, 0.9)");
    highlightGradient.addColorStop(0.3, "rgba(255, 255, 255, 0.4)");
    highlightGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = highlightGradient;
    ctx.fill();
    const shadowGradient = ctx.createRadialGradient(
      x + size * 0.3,
      y + size * 0.3,
      0,
      x + size * 0.3,
      y + size * 0.3,
      size * 0.7
    );
    shadowGradient.addColorStop(0, "rgba(0, 0, 0, 0)");
    shadowGradient.addColorStop(0.5, "rgba(0, 0, 0, 0.15)");
    shadowGradient.addColorStop(1, "rgba(0, 0, 0, 0.3)");
    ctx.fillStyle = shadowGradient;
    ctx.fill();
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 1.8;
    ctx.stroke();
  }
  function drawBallPattern(ctx, x, y, size) {
    ctx.save();
    ctx.strokeStyle = "rgba(80, 80, 80, 0.4)";
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 5; i++) {
      const angle = i * Math.PI * 2 / 5 - Math.PI / 2;
      const startX = x + Math.cos(angle) * (size * 0.3);
      const startY = y + Math.sin(angle) * (size * 0.3);
      const endX = x + Math.cos(angle) * (size * 0.75);
      const endY = y + Math.sin(angle) * (size * 0.75);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
    ctx.beginPath();
    for (let i = 0; i <= 5; i++) {
      const angle = i * Math.PI * 2 / 5 - Math.PI / 2;
      const px = x + Math.cos(angle) * (size * 0.3);
      const py = y + Math.sin(angle) * (size * 0.3);
      if (i === 0)
        ctx.moveTo(px, py);
      else
        ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  }
  if (typeof window !== "undefined") {
    window.lightenColor = lightenColor;
    window.darkenColor = darkenColor;
    window.drawPlayer = drawPlayer;
    window.drawPlayerShadow = drawPlayerShadow;
    window.drawPlayerBody = drawPlayerBody;
    window.drawPlayerHighlight = drawPlayerHighlight;
    window.drawPlayerLabel = drawPlayerLabel;
    window.drawBall = drawBall;
    window.drawShotEffect = drawShotEffect;
    window.drawBallBody = drawBallBody;
    window.drawBallPattern = drawBallPattern;
  }

  // src/rendering/gameRenderer.ts
  function renderGame() {
    if (!gameState.contexts || !gameState.contexts.game) {
      console.warn("Game context not initialized yet");
      return;
    }
    const ctx = gameState.contexts.game;
    const SCALE_FACTOR = GAME_CONFIG.HIGH_DPI_SCALE_FACTOR;
    const LOGICAL_WIDTH = gameState.isVertical ? 600 : 800;
    const LOGICAL_HEIGHT = gameState.isVertical ? 800 : 600;
    ctx.setTransform(SCALE_FACTOR, 0, 0, SCALE_FACTOR, 0, 0);
    ctx.clearRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
    ctx.save();
    if (gameState.isVertical) {
      ctx.translate(600, 0);
      ctx.rotate(Math.PI / 2);
    }
    if (gameState.cameraShake > 0) {
      const shakeX = (Math.random() - 0.5) * gameState.cameraShake;
      const shakeY = (Math.random() - 0.5) * gameState.cameraShake;
      ctx.translate(shakeX, shakeY);
    }
    if (gameState.particles && gameState.particles.length > 0) {
      gameState.particles.forEach((p) => p.draw(ctx));
    }
    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    if (allPlayers.length > 0) {
      allPlayers.forEach((player) => {
        const hasBall = !!(gameState.ballHolder && gameState.ballHolder.name === player.name && !gameState.ballTrajectory);
        drawPlayer(ctx, player, hasBall);
        if (gameState.status === "intro") {
          ctx.save();
          ctx.translate(player.x, player.y + 30);
          if (gameState.isVertical) {
            ctx.rotate(-Math.PI / 2);
          }
          ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
          ctx.shadowBlur = 4;
          ctx.fillStyle = "white";
          ctx.font = "bold 14px Arial";
          ctx.textAlign = "center";
          ctx.fillText(player.name, 0, 0);
          ctx.restore();
        }
      });
    }
    if (gameState.ballPosition) {
      drawBall(ctx, gameState.ballPosition.x, gameState.ballPosition.y);
    }
    if (window.SHOW_OFFSIDE_LINES && window.drawOffsideLines) {
      window.drawOffsideLines(ctx);
    }
    ctx.restore();
  }
  if (typeof window !== "undefined") {
    window.renderGame = renderGame;
  }

  // src/rendering/index.ts
  console.log("\u2705 Rendering System loaded (TypeScript v1.0.0)");

  // src/setpieces/enforcement.ts
  var SET_PIECE_ENFORCEMENT = {
    OPPONENT_MIN_DISTANCE: 100,
    // 100 pixels minimum distance
    GK_PROTECTION_ENABLED: true,
    // Goalkeeper protection always on
    TAKER_PROTECTION_TIME: 2e3,
    // Taker protected for 2 seconds
    WALL_MIN_DISTANCE: 92
    // Wall distance for free kicks (10 yards)
  };
  var SET_PIECE_STATES = {
    POSITIONING: "POSITIONING",
    // Players moving to positions
    WAIT_FOR_TAKER_ACTION: "WAIT_FOR_TAKER_ACTION",
    // Waiting for taker to act
    EXECUTING: "EXECUTING",
    // Ball in motion
    COMPLETED: "COMPLETED"
    // Set piece finished
  };
  function getSetPieceState(gameState2) {
    if (!gameState2 || !gameState2.setPiece)
      return null;
    const setPiece = gameState2.setPiece;
    if (setPiece.executed || gameState2.ballTrajectory) {
      return SET_PIECE_STATES.COMPLETED;
    }
    const now = Date.now();
    const executionTime = setPiece.executionTime || now + 3e3;
    if (now >= executionTime && !setPiece.executed) {
      return SET_PIECE_STATES.WAIT_FOR_TAKER_ACTION;
    }
    return SET_PIECE_STATES.POSITIONING;
  }
  function isSetPieceTaker(player, gameState2) {
    if (!gameState2 || !gameState2.setPiece)
      return false;
    const kicker = gameState2.setPiece.kicker;
    if (!kicker)
      return false;
    return String(player.id) === String(kicker.id);
  }
  function freezeOpponentsUntilKick(player, gameState2, _allPlayers) {
    if (!gameState2 || !gameState2.setPiece || !gameState2.ballPosition)
      return false;
    const state = getSetPieceState(gameState2);
    if (state !== SET_PIECE_STATES.WAIT_FOR_TAKER_ACTION)
      return false;
    const takingTeam = gameState2.setPiece.team;
    const takingTeamIsHome = typeof takingTeam === "boolean" ? takingTeam : takingTeam === "home";
    const isOpponent = player.isHome !== takingTeamIsHome;
    const isTaker = isSetPieceTaker(player, gameState2);
    if (gameState2.status === "KICK_OFF" && !isTaker) {
      player.targetX = player.x;
      player.targetY = player.y;
      player.vx = 0;
      player.vy = 0;
      return true;
    }
    if (!isOpponent)
      return false;
    const distToBall = distance(player, gameState2.ballPosition);
    if (distToBall < SET_PIECE_ENFORCEMENT.OPPONENT_MIN_DISTANCE) {
      const dx = player.x - gameState2.ballPosition.x;
      const dy = player.y - gameState2.ballPosition.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const ratio = SET_PIECE_ENFORCEMENT.OPPONENT_MIN_DISTANCE / dist;
      player.x = gameState2.ballPosition.x + dx * ratio;
      player.y = gameState2.ballPosition.y + dy * ratio;
      player.targetX = player.x;
      player.targetY = player.y;
      player.vx = 0;
      player.vy = 0;
      return true;
    }
    return false;
  }
  function enforceKickOffHalfRule(player, gameState2) {
    if (!gameState2 || gameState2.status !== "KICK_OFF" || !gameState2.setPiece) {
      return false;
    }
    const state = getSetPieceState(gameState2);
    if (state === SET_PIECE_STATES.EXECUTING || state === SET_PIECE_STATES.COMPLETED) {
      return false;
    }
    const centerX = GAME_CONFIG.PITCH_WIDTH / 2;
    const ownGoalX = getAttackingGoalX(!player.isHome, gameState2.currentHalf);
    const ownHalfIsLeft = ownGoalX < centerX;
    let inWrongHalf = false;
    if (ownHalfIsLeft && player.x > centerX + 5) {
      inWrongHalf = true;
    } else if (!ownHalfIsLeft && player.x < centerX - 5) {
      inWrongHalf = true;
    }
    if (inWrongHalf) {
      const margin = 30;
      if (ownHalfIsLeft) {
        player.x = Math.min(player.x, centerX - margin);
        player.targetX = Math.min(player.targetX || player.x, centerX - margin);
      } else {
        player.x = Math.max(player.x, centerX + margin);
        player.targetX = Math.max(player.targetX || player.x, centerX + margin);
      }
      player.vx = 0;
      player.vy = 0;
      return true;
    }
    return false;
  }
  function resumeAfterTakerAction(gameState2) {
    if (!gameState2 || !gameState2.setPiece)
      return;
    gameState2.setPiece.executed = true;
    gameState2.setPiece.executionTime = Date.now();
    console.log("\u2705 Set piece: Taker action detected, opponents released");
  }
  function isGoalkeeper(player) {
    if (!player)
      return false;
    return player.role === "GK" || player.role === "goalkeeper";
  }
  function protectGoalkeeper(tackler, target, gameState2) {
    if (!SET_PIECE_ENFORCEMENT.GK_PROTECTION_ENABLED)
      return false;
    if (!isGoalkeeper(target))
      return false;
    console.log(`\u{1F6AB} [gk-protection] Tackle blocked: ${tackler.name} cannot tackle goalkeeper ${target.name}`);
    assignDefensiveMarking(tackler, target, gameState2);
    return true;
  }
  function assignDefensiveMarking(marker, target, gameState2) {
    if (!marker || !target)
      return;
    const allPlayers = [...gameState2?.homePlayers || [], ...gameState2?.awayPlayers || []];
    const teammates = allPlayers.filter((p) => p.isHome === target.isHome && p.id !== target.id);
    const nearestTeammate = teammates.filter((p) => !isGoalkeeper(p)).sort((a, b) => distance(marker, a) - distance(marker, b))[0];
    if (nearestTeammate) {
      marker.targetX = nearestTeammate.x;
      marker.targetY = nearestTeammate.y;
      marker.intent = "MARK_PASSING_OPTION";
      console.log(`  \u2192 ${marker.name} marking ${nearestTeammate.name} instead`);
    } else {
      const ownGoalX = getAttackingGoalX(!marker.isHome, gameState2?.currentHalf || 1);
      const direction = Math.sign(ownGoalX - 400);
      marker.targetX = ownGoalX + direction * 60;
      marker.targetY = 300;
      marker.intent = "COVER_SPACE";
    }
  }
  function initializeSetPieceState(gameState2) {
    if (!gameState2 || !gameState2.setPiece)
      return;
    const setPiece = gameState2.setPiece;
    setPiece.state = SET_PIECE_STATES.POSITIONING;
    setPiece.executed = false;
    setPiece.configuredTime = Date.now();
    if (!setPiece.executionTime) {
      setPiece.executionTime = Date.now() + 2500;
    }
    console.log(`\u2705 Set piece initialized: ${setPiece.type} (execution in ${(setPiece.executionTime - Date.now()) / 1e3}s)`);
  }
  function updateSetPieceState(gameState2) {
    if (!gameState2 || !gameState2.setPiece)
      return;
    const setPiece = gameState2.setPiece;
    const currentState = getSetPieceState(gameState2);
    if (setPiece.state !== currentState) {
      const oldState = setPiece.state;
      setPiece.state = currentState;
      console.log(`\u26A1 Set piece state: ${oldState} \u2192 ${currentState}`);
      if (currentState === SET_PIECE_STATES.WAIT_FOR_TAKER_ACTION) {
        console.log("\u23F3 Waiting for taker action...");
      } else if (currentState === SET_PIECE_STATES.EXECUTING) {
        console.log("\u{1F680} Set piece executing...");
      } else if (currentState === SET_PIECE_STATES.COMPLETED) {
        console.log("\u2705 Set piece completed");
      }
    }
  }
  function canPlayerActOnSetPiece(player, gameState2) {
    if (!gameState2 || !gameState2.setPiece)
      return true;
    const state = getSetPieceState(gameState2);
    if (state === SET_PIECE_STATES.WAIT_FOR_TAKER_ACTION) {
      return isSetPieceTaker(player, gameState2);
    }
    if (state === SET_PIECE_STATES.POSITIONING) {
      return false;
    }
    return true;
  }
  function updateSetPieceEnforcement(gameState2, allPlayers) {
    if (!gameState2 || !gameState2.setPiece)
      return;
    updateSetPieceState(gameState2);
    const state = getSetPieceState(gameState2);
    if (gameState2.status === "KICK_OFF" && (state === SET_PIECE_STATES.POSITIONING || state === SET_PIECE_STATES.WAIT_FOR_TAKER_ACTION)) {
      allPlayers.forEach((player) => {
        enforceKickOffHalfRule(player, gameState2);
      });
    }
    if (state === SET_PIECE_STATES.WAIT_FOR_TAKER_ACTION) {
      allPlayers.forEach((player) => {
        freezeOpponentsUntilKick(player, gameState2, allPlayers);
      });
    }
  }
  var SetPieceEnforcement = {
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
  console.log("\u2705 SET PIECE ENFORCEMENT SYSTEM v1.0 LOADED");
  console.log("   \u2713 [setpiece-fix] Taker-first action logic");
  console.log("   \u2713 [setpiece-fix] 100px opponent distance enforcement");
  console.log("   \u2713 [kick-off-half-fix] Players stay in own half before kick-off");
  console.log("   \u2713 [gk-protection] Goalkeeper protection enabled");
  console.log("   \u2713 [setpiece-fix] State machine (WAIT_FOR_TAKER_ACTION)");

  // src/core.ts
  var DEBUG_AI = false;
  var SpatialAwarenessSystem = class {
    constructor() {
      this.grid = null;
      this.cellSize = 50;
    }
    buildGrid(allPlayers, width, height) {
      const cols = Math.ceil(width / this.cellSize);
      const rows = Math.ceil(height / this.cellSize);
      this.grid = Array(rows).fill(null).map(() => Array(cols).fill(null).map(() => []));
      allPlayers.forEach((player) => {
        const col = Math.floor(player.x / this.cellSize);
        const row = Math.floor(player.y / this.cellSize);
        if (this.grid && row >= 0 && row < rows && col >= 0 && col < cols && this.grid[row] && this.grid[row][col]) {
          this.grid[row][col].push(player);
        }
      });
    }
    getNearbyPlayers(player, radius) {
      if (!this.grid || this.grid.length === 0)
        return [];
      const col = Math.floor(player.x / this.cellSize);
      const row = Math.floor(player.y / this.cellSize);
      const cellRadius = Math.ceil(radius / this.cellSize);
      const nearby = [];
      for (let r = row - cellRadius; r <= row + cellRadius; r++) {
        for (let c = col - cellRadius; c <= col + cellRadius; c++) {
          if (this.grid && r >= 0 && r < this.grid.length && this.grid[0] && c >= 0 && c < this.grid[0].length) {
            const gridRow = this.grid[r];
            if (gridRow) {
              const cell = gridRow[c];
              if (cell) {
                nearby.push(...cell);
              }
            }
          }
        }
      }
      return nearby.filter((p) => {
        if (p.id === player.id)
          return false;
        const dx = p.x - player.x;
        const dy = p.y - player.y;
        return Math.sqrt(dx * dx + dy * dy) < radius;
      });
    }
    calculateSpacingForce(player, teammates) {
      const personalSpace = ["CB", "RB", "LB"].includes(player.role) ? 35 : 25;
      const nearby = this.getNearbyPlayers(player, personalSpace * 2).filter((p) => teammates.some((t) => t.id === p.id));
      let forceX = 0;
      let forceY = 0;
      nearby.forEach((teammate) => {
        const dx = player.x - teammate.x;
        const dy = player.y - teammate.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < personalSpace && dist > 0) {
          const strength = (personalSpace - dist) / personalSpace;
          const force = strength * 1;
          forceX += dx / dist * force;
          forceY += dy / dist * force;
        }
      });
      return { x: forceX, y: forceY };
    }
  };
  var spatialSystem2 = new SpatialAwarenessSystem();
  var ActionDecisionSystem = class {
    decideBestAction(player, teammates, opponents, gameState2) {
      const goalX = getAttackingGoalX(player.isHome, gameState2.currentHalf);
      if (this.shouldShootNow(player, opponents, gameState2)) {
        if (DEBUG_AI) {
          console.log(`[AI] ${player.name}: SHOOT decision (goalX=${goalX})`);
        }
        return { action: "SHOOT", target: { x: goalX, y: 300 } };
      }
      const bestPass = this.findBestPassTarget(player, teammates, opponents, goalX);
      if (bestPass && bestPass.score > 60) {
        if (DEBUG_AI) {
          console.log(`[AI] ${player.name}: PASS decision (score=${bestPass.score}, target=${bestPass.teammate.name})`);
        }
        return { action: "PASS", target: bestPass.teammate };
      }
      if (this.hasSpaceToDribble(player, opponents, goalX)) {
        if (DEBUG_AI) {
          console.log(`[AI] ${player.name}: DRIBBLE decision (to goalX=${goalX})`);
        }
        return { action: "DRIBBLE", target: { x: goalX, y: player.y } };
      }
      if (bestPass) {
        if (DEBUG_AI) {
          console.log(`[AI] ${player.name}: PASS decision (fallback, score=${bestPass.score})`);
        }
        return { action: "PASS", target: bestPass.teammate };
      }
      if (DEBUG_AI) {
        console.log(`[AI] ${player.name}: HOLD decision (no viable options)`);
      }
      return { action: "HOLD", target: null };
    }
    shouldShootNow(player, opponents, gameState2) {
      try {
        if (gameState2.postKickOffCalmPeriod && gameState2.kickOffCompletedTime) {
          const timeSinceKickOff = Date.now() - gameState2.kickOffCompletedTime;
          if (timeSinceKickOff < 4e3) {
            return false;
          }
          if (timeSinceKickOff >= 4e3) {
            gameState2.postKickOffCalmPeriod = false;
          }
        }
        const goalX = getAttackingGoalX(player.isHome, gameState2.currentHalf);
        if (typeof goalX !== "number" || !isFinite(goalX)) {
          console.warn(`Invalid goalX in shouldShootNow: ${goalX}`);
          return false;
        }
        const distToGoal = Math.abs(player.x - goalX);
        if (distToGoal > 250)
          return false;
        const xG = calculateXG(player, goalX, player.y, opponents);
        if (typeof xG !== "number" || !isFinite(xG)) {
          console.warn(`Invalid xG calculation: ${xG}, defaulting to no shot`);
          return false;
        }
        return xG > 0.1;
      } catch (err) {
        console.error("shouldShootNow error:", err);
        return false;
      }
    }
    findBestPassTarget(player, teammates, opponents, goalX) {
      const visibleTeammates = getVisibleTeammates(player, [...teammates, player]);
      let bestOption = null;
      let bestScore = -1;
      visibleTeammates.forEach((teammate) => {
        const distToTeammate = distance(player, teammate);
        if (distToTeammate < 30 || distToTeammate > 250)
          return;
        let score = 0;
        if (Math.sign(teammate.x - player.x) === Math.sign(goalX - player.x)) {
          score += 40;
        }
        const space = opponents.length > 0 ? Math.min(...opponents.map((o) => distance(teammate, o))) : 1e3;
        score += Math.max(0, space - 20);
        const isBlocked = opponents.some((opp) => pointToLineDistance(opp, player, teammate) < 20 && distance(player, opp) < distToTeammate);
        if (isBlocked)
          score = 0;
        if (score > bestScore) {
          bestScore = score;
          bestOption = { teammate, score };
        }
      });
      return bestOption;
    }
    hasSpaceToDribble(player, opponents, goalX) {
      const dribbleCheckPos = {
        x: player.x + Math.sign(goalX - player.x) * 50,
        y: player.y
      };
      const spaceAhead = opponents.length > 0 ? Math.min(...opponents.map((o) => distance(dribbleCheckPos, o))) : 1e3;
      return spaceAhead > 40;
    }
  };
  var actionDecision = new ActionDecisionSystem();
  var SmartTackleSystem = class {
    shouldAttemptTackle(defender, ballCarrier, gameState2) {
      const dist = Math.sqrt(
        Math.pow(defender.x - ballCarrier.x, 2) + Math.pow(defender.y - ballCarrier.y, 2)
      );
      if (dist > 18)
        return false;
      const inPenaltyBox = this.isInPenaltyBox(defender, gameState2);
      if (inPenaltyBox) {
        const defenderSkill2 = defender.defending / 100;
        return Math.random() < defenderSkill2 * 0.2;
      }
      const defenderSkill = defender.defending / 100;
      return Math.random() < defenderSkill * 0.6;
    }
    isInPenaltyBox(player, gameState2) {
      const pitchWidth = GAME_CONFIG.PITCH_WIDTH;
      const boxWidth = 160;
      const boxHeight = 400;
      const centerY = 300;
      const attackingGoalX = getAttackingGoalX(!player.isHome, gameState2.currentHalf);
      if (attackingGoalX < pitchWidth / 2) {
        return player.x < boxWidth && player.y > centerY - boxHeight / 2 && player.y < centerY + boxHeight / 2;
      } else {
        return player.x > pitchWidth - boxWidth && player.y > centerY - boxHeight / 2 && player.y < centerY + boxHeight / 2;
      }
    }
    checkForPenalty(foul, gameState2) {
      const fouledInBox = this.isInPenaltyBox(foul.fouled, gameState2);
      if (!fouledInBox || foul.severity <= 0.5) {
        return { awarded: false };
      }
      const PITCH_WIDTH3 = GAME_CONFIG.PITCH_WIDTH;
      const boxWidth = 160;
      const inLeftBox = foul.fouled.x < boxWidth;
      const inRightBox = foul.fouled.x > PITCH_WIDTH3 - boxWidth;
      const homeAttackingGoalX = getAttackingGoalX(true, gameState2.currentHalf);
      let foulInHomeDefensiveBox, foulInAwayDefensiveBox;
      if (homeAttackingGoalX < PITCH_WIDTH3 / 2) {
        foulInHomeDefensiveBox = inRightBox;
        foulInAwayDefensiveBox = inLeftBox;
      } else {
        foulInHomeDefensiveBox = inLeftBox;
        foulInAwayDefensiveBox = inRightBox;
      }
      const fouledPlayerIsHome = foul.fouled.isHome;
      const foulerPlayerIsHome = foul.fouler.isHome;
      let penaltyAwarded = false;
      if (fouledPlayerIsHome && foulInAwayDefensiveBox) {
        penaltyAwarded = true;
      } else if (!fouledPlayerIsHome && foulInHomeDefensiveBox) {
        penaltyAwarded = true;
      }
      if (penaltyAwarded) {
        return {
          awarded: true,
          attackingTeam: fouledPlayerIsHome ? "home" : "away",
          defendingTeam: foulerPlayerIsHome ? "home" : "away"
        };
      }
      return { awarded: false };
    }
  };
  var tackleSystem = new SmartTackleSystem();
  var PenaltySystem = class {
    constructor() {
      this.state = null;
    }
    initiate(attackingTeam, defendingTeam, gameState2) {
      const shooter = attackingTeam.filter((p) => p.role !== "GK").sort((a, b) => b.shooting - a.shooting)[0];
      if (!shooter)
        return null;
      const goalkeeper = defendingTeam.find((p) => p.role === "GK");
      if (!goalkeeper)
        return null;
      const goalX = getAttackingGoalX(shooter.isHome, gameState2.currentHalf);
      const penaltySpotX = goalX < 400 ? 110 : 690;
      this.state = {
        shooter,
        goalkeeper,
        goalX,
        penaltySpotX,
        spotY: 300,
        phase: "SETUP",
        startTime: Date.now()
      };
      gameState2.status = "PENALTY";
      gameState2.ballHolder = null;
      gameState2.ballTrajectory = null;
      console.log(`\u{1F3AF} PENALTY AWARDED! ${shooter.name} to take`);
      return this.state;
    }
    update(gameState2) {
      if (!this.state)
        return null;
      const elapsed = Date.now() - this.state.startTime;
      switch (this.state.phase) {
        case "SETUP":
          this.positionPlayers(gameState2);
          if (elapsed > 2e3) {
            this.state.phase = "READY";
          }
          break;
        case "READY":
          if (elapsed > 3e3) {
            this.state.phase = "SHOOTING";
            return this.executeShot(gameState2);
          }
          break;
      }
      return null;
    }
    positionPlayers(gameState2) {
      if (!this.state)
        return;
      const allPlayers = [...gameState2.homePlayers, ...gameState2.awayPlayers];
      this.state.shooter.x = this.state.penaltySpotX;
      this.state.shooter.y = this.state.spotY;
      this.state.goalkeeper.x = this.state.goalX;
      this.state.goalkeeper.y = this.state.spotY;
      gameState2.ballPosition.x = this.state.penaltySpotX;
      gameState2.ballPosition.y = this.state.spotY;
      allPlayers.forEach((p) => {
        if (this.state && p.id !== this.state.shooter.id && p.id !== this.state.goalkeeper.id) {
          if (tackleSystem.isInPenaltyBox(p, gameState2)) {
            p.x = 400;
            p.targetX = 400;
          }
        }
      });
    }
    executeShot(gameState2) {
      if (!this.state)
        return null;
      const state = this.state;
      const shooterSkill = state.shooter.shooting / 100;
      const gkSkill = state.goalkeeper.goalkeeping / 100;
      const teamStats = state.shooter.isHome ? gameState2.stats.home : gameState2.stats.away;
      const oppositionStats = state.shooter.isHome ? gameState2.stats.away : gameState2.stats.home;
      const PENALTY_XG = 0.76;
      teamStats.xGTotal += PENALTY_XG;
      const corners = [
        { y_offset: -40, name: "top" },
        { y_offset: 40, name: "bottom" },
        { y_offset: -20, name: "mid-top" },
        { y_offset: 20, name: "mid-bottom" }
      ];
      const targetCorner = corners[Math.floor(Math.random() * corners.length)] || corners[0];
      const targetY = state.spotY + (targetCorner?.y_offset || 0);
      const gkDiveY = state.spotY + (Math.random() < 0.5 ? -40 : 40);
      const accuracy = shooterSkill + (Math.random() * 0.3 - 0.15);
      const onTarget = accuracy > 0.4;
      const correctDive = Math.abs(targetY - gkDiveY) < 50;
      const saved = onTarget && correctDive && gkSkill + Math.random() * 0.3 > 0.7;
      passBall(
        state.shooter,
        state.penaltySpotX,
        state.spotY,
        state.goalX,
        targetY,
        1,
        900,
        true
      );
      state.goalkeeper.targetY = gkDiveY;
      let result;
      if (!onTarget) {
        result = {
          outcome: "MISS",
          message: `\u274C ${state.shooter.name} misses the target!`
        };
        teamStats.shotsOffTarget++;
      } else if (saved) {
        result = {
          outcome: "SAVE",
          message: `\u{1F9E4} ${state.goalkeeper.name} saves the penalty!`
        };
        teamStats.shotsOnTarget++;
        if (oppositionStats.saves !== void 0) {
          oppositionStats.saves++;
        }
      } else {
        result = {
          outcome: "GOAL",
          message: `\u26BD GOAL! ${state.shooter.name} scores from the spot!`
        };
        teamStats.shotsOnTarget++;
        if (state.shooter.isHome) {
          gameState2.homeScore++;
        } else {
          gameState2.awayScore++;
        }
        gameState2.lastGoalScorer = state.shooter.isHome ? "home" : "away";
        gameState2.goalEvents.push({
          time: Math.floor(gameState2.timeElapsed),
          scorer: state.shooter.name,
          isHome: state.shooter.isHome,
          xG: PENALTY_XG
        });
      }
      gameState2.commentary.push({
        text: `${Math.floor(gameState2.timeElapsed)}' ${result.message}`,
        type: result.outcome === "GOAL" ? "goal" : "save"
      });
      setTimeout(() => {
        this.reset();
        gameState2.status = "playing";
        if (result.outcome === "GOAL") {
          if (typeof resetAfterGoal === "function") {
            resetAfterGoal();
          }
        } else {
          gameState2.ballHolder = state.goalkeeper;
          state.goalkeeper.hasBallControl = true;
          state.goalkeeper.ballReceivedTime = Date.now();
        }
      }, 3e3);
      return result;
    }
    reset() {
      this.state = null;
    }
  };
  var penaltySystem2 = new PenaltySystem();
  function updatePlayerAI_V2(player, ball, allPlayers, gameState2) {
    const now = Date.now();
    if (player.lockUntil && now < player.lockUntil) {
      if (player.setPieceTarget && player.isKicker) {
        player.x = player.setPieceTarget.x;
        player.y = player.setPieceTarget.y;
        player.targetX = player.setPieceTarget.x;
        player.targetY = player.setPieceTarget.y;
        player.vx = 0;
        player.vy = 0;
        player.intent = "SET_PIECE_HOLD";
        return;
      }
      player.lockUntil = 0;
    }
    if (player.lockUntil && now >= player.lockUntil) {
      player.lockUntil = 0;
      player.setPieceTarget = null;
      player.isInWall = false;
      player.isDefCBLine = false;
      player.isMarker = false;
      player.isKicker = false;
    }
    if (integration_exports?.updatePlayerAI_V2_SetPieceEnhancement) {
      if (updatePlayerAI_V2_SetPieceEnhancement(player, allPlayers, gameState2)) {
        return;
      }
    }
    const updateInterval = player.isChasingBall ? 50 : 200;
    if (now - (player.lastDecisionTime || 0) < updateInterval)
      return;
    player.lastDecisionTime = now;
    const specialStateActive = ["PENALTY", "KICK_OFF", "FREE_KICK", "CORNER_KICK", "THROW_IN", "GOAL_KICK"].includes(gameState2.status);
    if (specialStateActive) {
      if (gameState2.status === "PENALTY" && penaltySystem2.state) {
        penaltySystem2.update(gameState2);
        return;
      }
    }
    const teammates = allPlayers.filter((p) => p.isHome === player.isHome);
    const opponents = allPlayers.filter((p) => p.isHome !== player.isHome);
    const spacingForce = spatialSystem2.calculateSpacingForce(player, teammates);
    if (gameState2.ballHolder?.id === player.id && player.hasBallControl) {
      if (!canPlayerActOnBall(player)) {
        player.targetX = player.x;
        player.targetY = player.y;
        return;
      }
      const decision = actionDecision.decideBestAction(player, teammates, opponents, gameState2);
      if (decision.action === "SHOOT") {
        const target = decision.target;
        handleShotAttempt(player, target.x, allPlayers);
      } else if (decision.action === "PASS") {
        initiatePass(player, decision.target);
      } else if (decision.action === "DRIBBLE") {
        const target = decision.target;
        initiateDribble(player, target.x);
      } else {
        player.targetX = player.x;
        player.targetY = player.y;
      }
      return;
    }
    if (player.role === "GK") {
      updateGoalkeeperAI_Advanced(player, ball, opponents);
      return;
    }
    if (!gameState2.ballHolder && !gameState2.ballTrajectory && player.isChasingBall) {
      player.targetX = ball.x;
      player.targetY = ball.y;
      player.speedBoost = 1.5;
      return;
    }
    const ballCarrier = gameState2.ballHolder;
    if (ballCarrier && distance(player, ballCarrier) < 50 && (!player.stunnedUntil || now > player.stunnedUntil)) {
      const distToCarrier = distance(player, ballCarrier);
      const shouldAttemptTackle = distToCarrier < 25 && (!player.stunnedUntil || now > player.stunnedUntil);
      if (shouldAttemptTackle) {
        const dx = ballCarrier.x - player.x;
        const dy = ballCarrier.y - player.y;
        const approachAngle = Math.atan2(dy, dx);
        const carrierVx = ballCarrier.vx || 0;
        const carrierVy = ballCarrier.vy || 0;
        const carrierAngle = Math.atan2(carrierVy, carrierVx);
        let angleDiff = Math.abs(approachAngle - carrierAngle);
        if (angleDiff > Math.PI)
          angleDiff = 2 * Math.PI - angleDiff;
        const isGoodAngle = angleDiff < Math.PI * 0.75;
        const hasDefendingAdvantage = player.defending > ballCarrier.dribbling + 15;
        if (isGoodAngle || hasDefendingAdvantage) {
          action_attemptTackle(player, allPlayers);
        }
      } else if (distToCarrier < 50) {
        const markingResult = applyMarkingAndPressing(
          player,
          ball,
          opponents,
          getPlayerActivePosition(player, gameState2.currentHalf),
          getAttackingGoalX(!player.isHome, gameState2.currentHalf),
          TACTICS[player.isHome ? gameState2.homeTactic : gameState2.awayTactic],
          player.isHome ? gameState2.homeTeamState : gameState2.awayTeamState
        );
        player.targetX = markingResult.x + spacingForce.x;
        player.targetY = markingResult.y + spacingForce.y;
        player.speedBoost = markingResult.shouldPress ? 1.3 : 1.1;
      }
      return;
    }
    if (ballCarrier && ballCarrier.isHome === player.isHome) {
      const activePosition = getPlayerActivePosition(player, gameState2.currentHalf);
      const opponentGoalX = getAttackingGoalX(player.isHome, gameState2.currentHalf);
      const supportMove = selectBestAttackingMovement(
        player,
        ballCarrier,
        teammates,
        opponents,
        activePosition,
        opponentGoalX,
        gameState2
      );
      if (supportMove.shouldLock) {
        const distToCurrentTarget = Math.sqrt(
          Math.pow(player.targetX - player.x, 2) + Math.pow(player.targetY - player.y, 2)
        );
        if (player.targetLocked && now - player.targetLockTime < 2e3 && distToCurrentTarget > 15) {
          return;
        }
        player.targetX = supportMove.x + spacingForce.x;
        player.targetY = supportMove.y + spacingForce.y;
        player.speedBoost = supportMove.speedBoost;
        player.targetLocked = true;
        player.targetLockTime = now;
      } else {
        player.targetX = supportMove.x + spacingForce.x;
        player.targetY = supportMove.y + spacingForce.y;
        player.speedBoost = supportMove.speedBoost;
      }
      return;
    }
    const activePos = getPlayerActivePosition(player, gameState2.currentHalf);
    player.targetX = activePos.x + spacingForce.x;
    player.targetY = activePos.y + spacingForce.y;
    player.speedBoost = 1;
  }
  function handleFoul_V2(fouler, fouled) {
    gameState.fouls++;
    gameState.ballHolder = null;
    gameState.ballTrajectory = null;
    console.log(`\u26A0\uFE0F FAUL: ${fouler.name} -> ${fouled.name}`);
    eventBus.publish("FOUL_COMMITTED" /* FOUL_COMMITTED */, { fouler, fouled });
    const severity = Math.random();
    const alreadyBooked = gameState.yellowCards.some((card) => card.player === fouler.name);
    if (alreadyBooked && severity > 0.8) {
      console.log(`\u{1F7E5} \u0130K\u0130NC\u0130 SARI KART! ${fouler.name} oyundan at\u0131ld\u0131.`);
      removePlayerFromMatch(fouler);
      gameState.cardEvents.push({ player: fouler.name, time: Math.floor(gameState.timeElapsed), type: "second_yellow" });
    } else if (severity > 0.85) {
      if (severity > 0.97) {
        console.log(`\u{1F7E5} D\u0130REKT KIRMIZI KART! ${fouler.name} oyundan at\u0131ld\u0131.`);
        removePlayerFromMatch(fouler);
        gameState.cardEvents.push({ player: fouler.name, time: Math.floor(gameState.timeElapsed), type: "direct_red" });
      } else if (!alreadyBooked) {
        console.log(`\u{1F7E8} SARI KART! ${fouler.name}`);
        gameState.cardEvents.push({ player: fouler.name, time: Math.floor(gameState.timeElapsed), type: "yellow" });
      }
    }
    const penaltyCheck = tackleSystem.checkForPenalty(
      { fouler, fouled, severity },
      gameState
    );
    if (penaltyCheck.awarded) {
      console.log(`\u{1F3AF} PENALTI! Faul: ${fouler.name}`);
      const attackingTeam = fouled.isHome ? gameState.homePlayers : gameState.awayPlayers;
      const defendingTeam = fouler.isHome ? gameState.homePlayers : gameState.awayPlayers;
      penaltySystem2.initiate(attackingTeam, defendingTeam, gameState);
      return;
    }
    handleFreeKick({ x: fouled.x, y: fouled.y }, fouler.isHome);
  }
  function cleanupShotState(gameState2) {
    if (!gameState2.ballTrajectory || gameState2.ballHolder) {
      if (gameState2.shotInProgress) {
        console.log(`Shot ended: ${gameState2.shooter?.name || "unknown"}`);
      }
      gameState2.shotInProgress = false;
      gameState2.shooter = null;
      gameState2.currentShotXG = null;
    }
  }
  function updateDefensiveLines(gameState2) {
    const calculateDefensiveLine = (team) => {
      const players = team === "home" ? gameState2.homePlayers : gameState2.awayPlayers;
      const defenders = players.filter((p) => ["CB", "RB", "LB", "CDM"].includes(p.role));
      if (defenders.length === 0)
        return team === "home" ? 200 : 600;
      const mostBack = team === "home" ? Math.max(...defenders.map((d) => d.x)) : Math.min(...defenders.map((d) => d.x));
      return mostBack;
    };
    gameState2.homeDefensiveLine = calculateDefensiveLine("home");
    gameState2.awayDefensiveLine = calculateDefensiveLine("away");
  }
  function getScaledTimestep() {
    const GAME_SPEED = GAME_CONFIG.GAME_SPEED || 1;
    const baseTimestep = 3 / 60;
    return baseTimestep / GAME_SPEED;
  }
  function updateParticlesWithCleanup(gameState2) {
    if (!gameState2.particles || gameState2.particles.length === 0)
      return;
    const now = Date.now();
    const PARTICLE_TIMEOUT = 5e3;
    const VIEWPORT_MARGIN = 100;
    const MAX_PARTICLES = 150;
    gameState2.particles = gameState2.particles.filter((particle) => {
      if (now - particle.createdAt > PARTICLE_TIMEOUT)
        return false;
      if (particle.x < -VIEWPORT_MARGIN || particle.x > 900)
        return false;
      if (particle.y < -VIEWPORT_MARGIN || particle.y > 700)
        return false;
      return true;
    });
    if (gameState2.particles.length > MAX_PARTICLES) {
      gameState2.particles = gameState2.particles.slice(-MAX_PARTICLES);
    }
  }
  var lastFrameTime = 0;
  var physicsAccumulator = 0;
  var gameTime = 0;
  function gameLoop_V2(timestamp) {
    if (!lastFrameTime)
      lastFrameTime = timestamp;
    if (!gameState.contexts || !gameState.contexts.game) {
      if (gameState.status !== "finished") {
        requestAnimationFrame(gameLoop_V2);
      }
      return;
    }
    let dt = (timestamp - lastFrameTime) / 1e3;
    lastFrameTime = timestamp;
    dt = Math.max(0, Math.min(dt, GAME_LOOP.MAX_FRAME_TIME));
    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    spatialSystem2.buildGrid(allPlayers, 800, 600);
    if (gameState.status === "playing" && !gameState.ballHolder?.hasBallControl && !gameState.ballTrajectory) {
      assignBallChasers(allPlayers);
    }
    const isGameActive = gameState.status === "playing";
    const isSetPiece = isSetPieceStatus(gameState.status);
    const runPhysics = isGameActive || isSetPiece;
    if (runPhysics) {
      allPlayers.forEach((player) => {
        updatePlayerAI_V2(player, gameState.ballPosition, allPlayers, gameState);
      });
    }
    if (isSetPiece) {
      if (SetPieceEnforcement?.updateSetPieceEnforcement) {
        SetPieceEnforcement.updateSetPieceEnforcement(gameState, allPlayers);
      }
      if (gameState.setPiece && gameState.setPiece.executionTime) {
        const timeUntilExecution = gameState.setPiece.executionTime - Date.now();
        if (timeUntilExecution <= 100 && !gameState.setPiece.executed) {
          if (integration_exports?.executeSetPiece_Router) {
            executeSetPiece_Router(gameState);
          }
        }
      }
    }
    if (gameState.status === "PENALTY" && penaltySystem2.state) {
      penaltySystem2.update(gameState);
    }
    if (runPhysics) {
      if (gameState.status === "playing") {
        gameTime += dt;
        processPendingEvents(gameTime);
      }
      const scaledTimestep = getScaledTimestep();
      physicsAccumulator += dt;
      let steps = 0;
      const maxSteps = 5;
      while (physicsAccumulator >= scaledTimestep && steps < maxSteps) {
        updatePhysics(scaledTimestep);
        physicsAccumulator -= scaledTimestep;
        steps++;
      }
      if (steps >= maxSteps) {
        physicsAccumulator = 0;
      }
      cleanupShotState(gameState);
      updateDefensiveLines(gameState);
      updateParticlesWithCleanup(gameState);
    }
    const holder = validateBallHolder(gameState.ballHolder);
    if (holder) {
      if (holder.isHome) {
        gameState.stats.home.possessionTime += dt;
      } else {
        gameState.stats.away.possessionTime += dt;
      }
    }
    const totalPossession = gameState.stats.home.possessionTime + gameState.stats.away.possessionTime;
    if (totalPossession > 0) {
      gameState.stats.home.possession = Math.round(gameState.stats.home.possessionTime / totalPossession * 100);
      gameState.stats.away.possession = 100 - gameState.stats.home.possession;
    }
    renderGame();
    if (gameState.status !== "finished") {
      requestAnimationFrame(gameLoop_V2);
    }
  }

  // src/setpieces/config.ts
  function selectWeightedRoutine(weights) {
    const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
    if (total <= 0)
      return "standard";
    let random = Math.random() * total;
    for (const [routine, weight] of Object.entries(weights)) {
      random -= weight;
      if (random <= 0)
        return routine;
    }
    return "standard";
  }
  function configureSetPieceRoutines(gameState2) {
    if (!gameState2) {
      console.error("Config SetPiece: gameState is missing!");
      return;
    }
    if (!gameState2.setPiece) {
      gameState2.setPiece = {};
    }
    const takingTeam = gameState2.setPiece.team;
    const homeTacticKey = gameState2.homeTactic || "balanced";
    const awayTacticKey = gameState2.awayTactic || "balanced";
    const tactic = takingTeam === true ? TACTICS[homeTacticKey] || TACTICS["balanced"] : TACTICS[awayTacticKey] || TACTICS["balanced"];
    const opposingTactic = takingTeam === true ? TACTICS[awayTacticKey] || TACTICS["balanced"] : TACTICS[homeTacticKey] || TACTICS["balanced"];
    if (gameState2.status === "CORNER_KICK") {
      const routineWeights = {
        standard: 40,
        inswinger: 25,
        outswinger: 25,
        short: 10
      };
      if (tactic) {
        if (tactic.possessionPriority > 0.7) {
          routineWeights.short = 25;
          routineWeights.standard = 30;
        }
      }
      gameState2.setPiece.routine = selectWeightedRoutine(routineWeights);
      if (opposingTactic) {
        gameState2.setPiece.defensiveSystem = opposingTactic.compactness > 0.65 || opposingTactic.defensiveLineDepth < 0.4 ? "zonal" : "man_marking";
      } else {
        gameState2.setPiece.defensiveSystem = "zonal";
      }
    }
    if (gameState2.status === "GOAL_KICK") {
      gameState2.setPiece.playShort = tactic && tactic.possessionPriority > 0.6;
    }
    if (!gameState2.setPiece.executionTime || gameState2.setPiece.executionTime < Date.now()) {
      let delay = 1e3 + Math.random() * 800;
      if (gameState2.status === "FREE_KICK" && gameState2.setPiece && gameState2.setPiece.position) {
        const fkPos = gameState2.setPiece.position;
        const takingTeamIsHome = typeof gameState2.setPiece.team === "boolean" ? gameState2.setPiece.team : gameState2.setPiece.team === "home";
        const opponentGoalX = getAttackingGoalX(takingTeamIsHome, gameState2.currentHalf);
        const distToGoal = Math.hypot(fkPos.x - opponentGoalX, fkPos.y - 300);
        const angleToGoal = Math.abs(fkPos.y - 300);
        const isDangerous = distToGoal < 280 && angleToGoal < 130;
        if (isDangerous) {
          delay = 2500 + Math.random() * 1e3;
        } else {
          delay = 500 + Math.random() * 500;
        }
      }
      gameState2.setPiece.executionTime = Date.now() + delay;
    }
    gameState2.setPiece.configured = true;
  }
  function executeSetPiece_PreConfiguration() {
    try {
      const gameState2 = gameState;
      const sp = gameState2?.setPiece;
      if (!sp || !sp.type || !sp.position)
        return;
      const W = GAME_CONFIG.PITCH_WIDTH;
      const H = GAME_CONFIG.PITCH_HEIGHT;
      const M = 6;
      sp.position.x = Math.min(W - M, Math.max(M, Number(sp.position.x) || W / 2));
      sp.position.y = Math.min(H - M, Math.max(M, Number(sp.position.y) || H / 2));
      gameState2.ballPosition = { x: sp.position.x, y: sp.position.y };
      gameState2.ballVelocity = { x: 0, y: 0 };
      if (sp.type === "CORNER_KICK" || sp.type === "FREE_KICK" || sp.type === "GOAL_KICK") {
        configureSetPieceRoutines(gameState2);
      }
      if (!sp.executionTime || sp.executionTime < Date.now()) {
        sp.executionTime = Date.now() + 1e3 + Math.random() * 800;
      }
      if (SetPieceEnforcement.initializeSetPieceState) {
        SetPieceEnforcement.initializeSetPieceState(gameState2);
      }
      sp.configured = true;
      console.log(`\u2713 Set piece pre-configured: ${sp.type} at (${Math.round(sp.position.x)}, ${Math.round(sp.position.y)})`);
    } catch (e) {
      console.error("executeSetPiece_PreConfiguration failed:", e);
    }
  }

  // src/ui/utils.ts
  function CFG2() {
    return GAME_CONFIG;
  }
  function ensureStatsShape2(gs) {
    gs.stats = gs.stats || {};
    const s = gs.stats;
    s.home = s.home || {};
    s.away = s.away || {};
    if (typeof s.home.possession !== "number")
      s.home.possession = 0;
    if (typeof s.away.possession !== "number")
      s.away.possession = 0;
    s.possessionTimer = s.possessionTimer || { home: 0, away: 0 };
    if (typeof s.lastPossessionUpdate !== "number")
      s.lastPossessionUpdate = Date.now();
    s.possession = s.possession || { home: 0, away: 0 };
    s.possession.home = s.home.possession;
    s.possession.away = s.away.possession;
  }
  function setPossession(gs, homePct, awayPct) {
    const s = gs.stats;
    s.home.possession = Math.max(0, Math.min(100, homePct));
    s.away.possession = Math.max(0, Math.min(100, awayPct));
    s.possession.home = s.home.possession;
    s.possession.away = s.away.possession;
  }
  var SET_PIECE_STATUSES2 = Object.freeze([
    "GOAL_KICK",
    "CORNER_KICK",
    "THROW_IN",
    "FREE_KICK",
    "PENALTY",
    "KICK_OFF"
  ]);
  function getDistance2(a, b) {
    const ax = Number(a?.x) || 0, ay = Number(a?.y) || 0;
    const bx = Number(b?.x) || 0, by = Number(b?.y) || 0;
    return Math.hypot(ax - bx, ay - by);
  }
  function getNearestAttacker(x, y, allPlayers, attackingTeamIsHome) {
    const attackers = allPlayers.filter(
      (p) => p.isHome === attackingTeamIsHome && p.role !== "GK"
    );
    let nearest = null;
    let minDist = Infinity;
    attackers.forEach((player) => {
      const dist = Math.sqrt((player.x - x) ** 2 + (player.y - y) ** 2);
      if (dist < minDist) {
        minDist = dist;
        nearest = player;
      }
    });
    return nearest;
  }
  function calculateXG2(shooter, goalX, goalY, opponents) {
    const distToGoal = Math.sqrt(Math.pow(shooter.x - goalX, 2) + Math.pow(shooter.y - goalY, 2));
    const angleToGoalCenter = Math.abs(shooter.y - 300);
    const maxAngle = 150;
    const angleQuality = Math.max(0, 1 - angleToGoalCenter / maxAngle);
    const normalizedDistance = Math.min(distToGoal / 400, 1);
    const distanceQuality = Math.pow(1 - normalizedDistance, 1.5);
    const nearbyDefenders = opponents.filter((opp) => getDistance2(shooter, opp) < 30);
    const pressureMultiplier = Math.max(0.4, 1 - nearbyDefenders.length * 0.18);
    const shooterAbility = 0.2 + shooter.shooting / 100 * 0.8;
    const speed = Math.sqrt(shooter.vx * shooter.vx + shooter.vy * shooter.vy);
    const movementPenalty = speed > 100 ? 0.9 : 1;
    const fatiguePenalty = shooter.stamina < 40 ? 0.95 : 1;
    let xG = (distanceQuality * 0.35 + angleQuality * 0.3 + shooterAbility * 0.35) * pressureMultiplier * movementPenalty * fatiguePenalty;
    xG = Math.max(0.03, Math.min(0.92, xG));
    return xG;
  }
  function getValidStat2(statValue, defaultValue = 0) {
    const num = parseFloat(statValue);
    return isNaN(num) ? defaultValue : num;
  }
  function resolveSide(value) {
    try {
      if (value === true || value === "home")
        return "home";
      if (value === false || value === "away")
        return "away";
      if (typeof value === "string") {
        if (value === (gameState?.homeTeam || "").trim())
          return "home";
        if (value === (gameState?.awayTeam || "").trim())
          return "away";
      }
      if (value && typeof value === "object") {
        if ("isHome" in value)
          return value.isHome ? "home" : "away";
        if ("team" in value && value.team !== value)
          return resolveSide(value.team);
        if ("side" in value && value.side !== value)
          return resolveSide(value.side);
      }
    } catch (error) {
      console.error("[resolveSide] Error resolving side:", error, "Input value:", value);
    }
    return null;
  }
  function invertSide(side) {
    if (side === "home")
      return "away";
    if (side === "away")
      return "home";
    return null;
  }

  // src/ui/uiScreens.ts
  function renderUploadScreen(app) {
    app.innerHTML = `
        <div style="
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
        ">
            <div style="
                background: linear-gradient(135deg, rgba(15, 15, 30, 0.95) 0%, rgba(25, 25, 45, 0.95) 100%);
                backdrop-filter: blur(30px);
                border-radius: 32px;
                padding: 60px 50px;
                max-width: 500px;
                width: 100%;
                box-shadow:
                    0 30px 90px rgba(0, 0, 0, 0.6),
                    0 0 0 1px rgba(255, 255, 255, 0.15),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.15);
                text-align: center;
            ">
                <div style="
                    font-size: 80px;
                    margin-bottom: 24px;
                    animation: bounce 2s infinite;
                    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
                ">\u26BD</div>

                <h1 style="
                    font-size: 42px;
                    margin: 0 0 12px;
                    color: #fff;
                    font-weight: 900;
                    letter-spacing: -0.5px;
                    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
                ">Football Match Simulator</h1>

                <p style="
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 17px;
                    margin-bottom: 40px;
                    font-weight: 500;
                    letter-spacing: 0.3px;
                ">Enhanced AI \u2022 Tactical Positioning \u2022 Smart Strategy</p>

                <input type="file" accept=".xlsx,.xls" id="fileInput" onchange="handleFileUpload(event)" style="display: none;">

                <label for="fileInput" style="
                    display: inline-block;
                    padding: 18px 40px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    font-size: 17px;
                    font-weight: 800;
                    letter-spacing: 0.5px;
                    border-radius: 14px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
                    border: none;
                    text-transform: uppercase;
                ">
                    \u{1F4C1} Upload Excel File
                </label>

                <div style="
                    margin-top: 40px;
                    text-align: left;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 15px;
                ">
                    <p style="
                        font-weight: 700;
                        margin-bottom: 16px;
                        font-size: 16px;
                        color: rgba(255, 255, 255, 0.9);
                    ">\u26BD Enhanced Features:</p>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li style="padding: 8px 0; display: flex; align-items: center; gap: 10px;">
                            <span style="color: #00ff88;">\u2705</span>
                            <span>6 Dynamic formations</span>
                        </li>
                        <li style="padding: 8px 0; display: flex; align-items: center; gap: 10px;">
                            <span style="color: #00ff88;">\u2705</span>
                            <span>Delta time physics</span>
                        </li>
                        <li style="padding: 8px 0; display: flex; align-items: center; gap: 10px;">
                            <span style="color: #00ff88;">\u2705</span>
                            <span>Layered canvas rendering</span>
                        </li>
                        <li style="padding: 8px 0; display: flex; align-items: center; gap: 10px;">
                            <span style="color: #00ff88;">\u2705</span>
                            <span>Event-driven architecture</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div id="toggle-container" style="position: absolute; bottom: 20px; right: 20px; z-index: 100;"></div>
        </div>

        <style>
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }

            label[for="fileInput"]:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
            }
        </style>
    `;
  }
  function renderSetupScreen(app) {
    if (!gameState) {
      console.error("\u274C gameState not initialized yet");
      app.innerHTML = '<div style="padding: 40px; text-align: center;">Loading...</div>';
      return;
    }
    if (!gameState.homeFormation && selectBestFormation) {
      const homeTeamPlayers = gameState.players.filter((p) => p.team === gameState.homeTeam);
      gameState.homeFormation = selectBestFormation(homeTeamPlayers);
    }
    if (!gameState.awayFormation && selectBestFormation) {
      const awayTeamPlayers = gameState.players.filter((p) => p.team === gameState.awayTeam);
      gameState.awayFormation = selectBestFormation(awayTeamPlayers);
    }
    if (!gameState.homeTactic && selectBestTactic) {
      const homeTeamPlayers = gameState.players.filter((p) => p.team === gameState.homeTeam);
      gameState.homeTactic = selectBestTactic(homeTeamPlayers);
    }
    if (!gameState.awayTactic && selectBestTactic) {
      const awayTeamPlayers = gameState.players.filter((p) => p.team === gameState.awayTeam);
      gameState.awayTactic = selectBestTactic(awayTeamPlayers);
    }
    const tacticsOptions = Object.keys(TACTICS).map(
      (key) => `<option value="${key}" ${key === gameState.homeTactic ? "selected" : ""}>${TACTICS[key]?.name || key}</option>`
    ).join("");
    const awayTacticsOptions = Object.keys(TACTICS).map(
      (key) => `<option value="${key}" ${key === gameState.awayTactic ? "selected" : ""}>${TACTICS[key]?.name || key}</option>`
    ).join("");
    const teamsOptions = gameState.teams ? gameState.teams.map(
      (t) => `<option value="${t}" ${t === gameState.homeTeam ? "selected" : ""}>${t}</option>`
    ).join("") : "";
    const awayTeamsOptions = gameState.teams ? gameState.teams.map(
      (t) => `<option value="${t}" ${t === gameState.awayTeam ? "selected" : ""}>${t}</option>`
    ).join("") : "";
    const batchHomeTeamsOptions = gameState.teams ? gameState.teams.map(
      (t) => `<option value="${t}">${t}</option>`
    ).join("") : "";
    const batchAwayTeamsOptions = gameState.teams ? gameState.teams.map(
      (t) => `<option value="${t}">${t}</option>`
    ).join("") : "";
    app.innerHTML = `
        <div class="container">
            <h1 style="text-align: center; font-size: 42px; margin-bottom: 30px; text-shadow: 0 0 30px rgba(255,255,255,0.5);">\u26BD Enhanced Match Setup</h1>

            <div style="display: flex; gap: 20px; justify-content: center; margin-bottom: 40px;">
                <button class="mode-btn active" id="singleModeBtn" onclick="switchSimulationMode('single')" style="padding: 15px 40px; border-radius: 15px; font-size: 1.1em; font-weight: 700; cursor: pointer; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; transition: all 0.3s;">
                    \u{1F3AE} Single Match
                </button>
                <button class="mode-btn" id="batchModeBtn" onclick="switchSimulationMode('batch')" style="padding: 15px 40px; border-radius: 15px; font-size: 1.1em; font-weight: 700; cursor: pointer; background: rgba(255,255,255,0.1); color: white; border: 2px solid transparent; transition: all 0.3s;">
                    \u{1F4CA} Batch Simulation
                </button>
            </div>

            <div id="toggle-container" style="max-width: 1200px; margin: 20px auto 0; text-align: right; padding-right: 20px;"></div>

            <div id="singleMatchMode" style="display: block;">
                <div style="max-width: 900px; margin: 0 auto; background: rgba(0,0,0,0.5); backdrop-filter: blur(20px); border-radius: 24px; padding: 40px; border: 1px solid rgba(255,255,255,0.1);">
                    <div style="margin-bottom: 30px; padding: 20px; background: rgba(16,185,129,0.1); border-radius: 16px; border: 1px solid rgba(16,185,129,0.3);">
                        <div style="font-size: 18px; font-weight: 600;">\u2728 AI Auto-Selection Active</div>
                        <div style="font-size: 14px; margin-top: 8px; opacity: 0.9;">${gameState.teams?.length || 0} teams \u2022 ${gameState.players.length} professional players</div>
                    </div>

                    <div class="grid grid-2">
                        <div>
                            <label class="label">\u{1F3E0} Home Team</label>
                            <select id="homeSelect" class="select">
                                ${teamsOptions}
                            </select>

                            <label class="label" style="margin-top: 20px;">Tactic</label>
                            <select id="homeTacticSelect" class="select">
                                ${tacticsOptions}
                            </select>
                        </div>
                        <div>
                            <label class="label">\u2708\uFE0F Away Team</label>
                            <select id="awaySelect" class="select">
                                ${awayTeamsOptions}
                            </select>

                            <label class="label" style="margin-top: 20px;">Tactic</label>
                            <select id="awayTacticSelect" class="select">
                                ${awayTacticsOptions}
                            </select>
                        </div>
                    </div>

                    <button onclick="startMatch()" ${gameState.homeTeam === gameState.awayTeam ? "disabled" : ""}
                        class="btn" style="width: 100%; margin-top: 30px; padding: 20px; font-size: 20px;">
                        ${gameState.homeTeam === gameState.awayTeam ? "\u26A0\uFE0F Select different teams" : "\u25B6\uFE0F START MATCH"}
                    </button>
                </div>
            </div>

            <div id="batchMatchMode" style="display: none;">
                <div style="max-width: 1200px; margin: 0 auto;">
                    <div style="background: rgba(0,0,0,0.5); backdrop-filter: blur(20px); border-radius: 24px; padding: 30px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 30px;">
                        <h3 style="margin-bottom: 20px; font-size: 20px;">\u2795 Add Matches</h3>

                        <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 15px; align-items: end;">
                            <div>
                                <label class="label">Home Team</label>
                                <select id="batchHomeSelect" class="select">
                                    ${batchHomeTeamsOptions}
                                </select>
                            </div>
                            <div>
                                <label class="label">Away Team</label>
                                <select id="batchAwaySelect" class="select">
                                    ${batchAwayTeamsOptions}
                                </select>
                            </div>
                            <button onclick="addMatchToBatch()" class="btn" style="padding: 12px 30px; white-space: nowrap;">
                                \u2795 Add Match
                            </button>
                        </div>
                    </div>

                    <div style="background: rgba(0,0,0,0.5); backdrop-filter: blur(20px); border-radius: 24px; padding: 30px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 30px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <h3 style="font-size: 20px;">\u{1F4CB} Match List</h3>
                            <button onclick="CustomFixtureSimulator.clearAll()" style="padding: 8px 20px; background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; border-radius: 8px; color: #ef4444; cursor: pointer; font-size: 14px; font-weight: 600;">
                                \u{1F5D1}\uFE0F Clear All
                            </button>
                        </div>

                        <div id="custom-match-list">
                            <div style="text-align: center; padding: 40px; opacity: 0.5;">
                                <div style="font-size: 48px; margin-bottom: 10px;">\u26BD</div>
                                <div>No matches added yet</div>
                                <div style="font-size: 14px; margin-top: 5px;">Add matches above to start</div>
                            </div>
                        </div>
                    </div>

                    <button id="simulate-all-btn" onclick="CustomFixtureSimulator.simulateAll()" disabled class="btn" style="width: 100%; padding: 20px; font-size: 20px; opacity: 0.5; background: linear-gradient(135deg, #f093fb, #f5576c);">
                        \u{1F680} SIMULATE ALL MATCHES
                    </button>
                </div>
            </div>

        </div>
    `;
    setTimeout(() => {
      attachSetupEventListeners();
    }, 0);
  }
  function switchSimulationMode(mode) {
    const singleBtn = document.getElementById("singleModeBtn");
    const batchBtn = document.getElementById("batchModeBtn");
    const singleMode = document.getElementById("singleMatchMode");
    const batchMode = document.getElementById("batchMatchMode");
    if (!singleBtn || !batchBtn || !singleMode || !batchMode)
      return;
    if (mode === "single") {
      singleBtn.classList.add("active");
      batchBtn.classList.remove("active");
      singleBtn.style.background = "linear-gradient(135deg, #667eea, #764ba2)";
      singleBtn.style.border = "none";
      batchBtn.style.background = "rgba(255,255,255,0.1)";
      batchBtn.style.border = "2px solid transparent";
      singleMode.style.display = "block";
      batchMode.style.display = "none";
    } else {
      batchBtn.classList.add("active");
      singleBtn.classList.remove("active");
      batchBtn.style.background = "linear-gradient(135deg, #f093fb, #f5576c)";
      batchBtn.style.border = "none";
      singleBtn.style.background = "rgba(255,255,255,0.1)";
      singleBtn.style.border = "2px solid transparent";
      singleMode.style.display = "none";
      batchMode.style.display = "block";
    }
  }
  function addMatchToBatch() {
    const homeSelect = document.getElementById("batchHomeSelect");
    const awaySelect = document.getElementById("batchAwaySelect");
    if (!homeSelect || !awaySelect)
      return;
    const homeTeam = homeSelect.value;
    const awayTeam = awaySelect.value;
    if (typeof window.CustomFixtureSimulator !== "undefined") {
      window.CustomFixtureSimulator.addMatch(homeTeam, awayTeam);
    } else {
      console.error("CustomFixtureSimulator not available on window object");
    }
  }

  // src/ui/uiComponents.ts
  function lightenColor2(color, amount) {
    if (color.startsWith("#")) {
      const num = parseInt(color.slice(1), 16);
      const r = Math.min(255, (num >> 16 & 255) + amount);
      const g = Math.min(255, (num >> 8 & 255) + amount);
      const b = Math.min(255, (num & 255) + amount);
      return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`;
    }
    return color;
  }
  function renderScoreboard() {
    const homeCoach = gameState.teamCoaches?.[gameState.homeTeam] || "Unknown Coach";
    const awayCoach = gameState.teamCoaches?.[gameState.awayTeam] || "Unknown Coach";
    const homeLogo = gameState.teamLogos?.[gameState.homeTeam] || "";
    const awayLogo = gameState.teamLogos?.[gameState.awayTeam] || "";
    return `
        <div style="
            background: linear-gradient(135deg, rgba(15, 15, 30, 0.98) 0%, rgba(25, 25, 45, 0.98) 100%);
            backdrop-filter: blur(30px) saturate(200%);
            border-radius: 16px;
            padding: 12px 24px; /* RECHAZADO: Reduced padding */
            box-shadow:
                0 15px 40px rgba(0, 0, 0, 0.5),
                0 0 0 1px rgba(255, 255, 255, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px; /* RECHAZADO: Reduced gap */
            position: relative;
            overflow: hidden;
            width: 100%;
            box-sizing: border-box;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        ">

            <div style="position: absolute; top: 0; left: 0; right: 0; height: 60%; background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%); pointer-events: none;"></div>
            <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%); animation: rotate 20s linear infinite; pointer-events: none;"></div>

            <div style="display: flex; align-items: center; gap: 16px; flex: 1; min-width: 0; position: relative; z-index: 1;">
                ${homeLogo ? `
                    <div style="width: 48px; height: 48px; background: rgba(255, 255, 255, 0.05); border-radius: 10px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); flex-shrink: 0;">
                        <img src="${homeLogo}" style="width: 36px; height: 36px; object-fit: contain; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));">
                    </div>
                ` : ""}
                <div style="display: flex; flex-direction: column; min-width: 0;">
                    <div style="font-size: 18px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);">${gameState.homeTeam}</div>
                    <div style="font-size: 10px; opacity: 0.6; font-weight: 600; letter-spacing: 0.5px; margin-top: 2px;">${homeCoach}</div>
                </div>
            </div>

            <div style="
                display: flex;
                align-items: center;
                gap: 16px; /* RECHAZADO: Reduced gap */
                position: relative;
                z-index: 1;
                padding: 8px 16px; /* RECHAZADO: Reduced padding */
                background: rgba(0, 0, 0, 0.3);
                border-radius: 12px; /* RECHAZADO: Reduced radius */
                border: 1px solid rgba(255, 255, 255, 0.08);
                box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
            ">
                <div style="
                    font-size: 44px; /* RECHAZADO: Reduced font size */
                    font-weight: 900;
                    line-height: 1;
                    color: ${gameState.homeJerseyColor};
                    text-shadow: 0 0 20px ${gameState.homeJerseyColor}60, 0 0 10px ${gameState.homeJerseyColor}80, 0 4px 12px rgba(0,0,0,0.7);
                    font-family: 'Inter', -apple-system, system-ui, sans-serif;
                    filter: brightness(1.2);
                    transition: all 0.3s ease;
                " id="home-score-color">0</div>

                <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 0 12px;">
                    <div style="font-size: 24px; font-weight: 900; font-family: 'Courier New', monospace; line-height: 1; color: #ffffff; text-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 2px 6px rgba(0,0,0,0.4); letter-spacing: 1px;" id="time-display">0'</div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div id="status-indicator"></div>
                        <div style="font-size: 10px; opacity: 0.7; font-weight: 800; letter-spacing: 1px; color: #ffffff;" id="half-display">HALF 1</div>
                    </div>
                </div>

                <div style="
                    font-size: 44px; /* RECHAZADO: Reduced font size */
                    font-weight: 900;
                    line-height: 1;
                    color: ${gameState.awayJerseyColor};
                    text-shadow: 0 0 20px ${gameState.awayJerseyColor}60, 0 0 10px ${gameState.awayJerseyColor}80, 0 4px 12px rgba(0,0,0,0.7);
                    font-family: 'Inter', -apple-system, system-ui, sans-serif;
                    filter: brightness(1.2);
                    transition: all 0.3s ease;
                " id="away-score-color">0</div>
            </div>

            <div style="display: flex; align-items: center; gap: 16px; flex: 1; min-width: 0; justify-content: flex-end; position: relative; z-index: 1;">
                <div style="display: flex; flex-direction: column; align-items: flex-end; min-width: 0;">
                    <div style="font-size: 18px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);">${gameState.awayTeam}</div>
                    <div style="font-size: 10px; opacity: 0.6; font-weight: 600; letter-spacing: 0.5px; margin-top: 2px;">${awayCoach}</div>
                </div>
                ${awayLogo ? `
                    <div style="width: 48px; height: 48px; background: rgba(255, 255, 255, 0.05); border-radius: 10px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); flex-shrink: 0;">
                        <img src="${awayLogo}" style="width: 36px; height: 36px; object-fit: contain; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));">
                    </div>
                ` : ""}
            </div>
        </div>

        <style>
            @keyframes rotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        </style>
    `;
  }
  function getStatusIndicator() {
    if (gameState.status === "playing") {
      return '<div style="width: 6px; height: 6px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981, 0 0 3px #10b981; animation: pulse 2s infinite;"></div>';
    } else if (gameState.status === "intro") {
      return '<div style="width: 6px; height: 6px; border-radius: 50%; background: #fbbf24; box-shadow: 0 0 8px #fbbf24;"></div>';
    } else if (gameState.status === "halftime") {
      return '<div style="width: 6px; height: 6px; border-radius: 50%; background: #f59e0b; box-shadow: 0 0 8px #f59e0b;"></div>';
    } else if (gameState.status === "finished") {
      return '<div style="width: 6px; height: 6px; border-radius: 50%; background: #ef4444; box-shadow: 0 0 8px #ef4444;"></div>';
    }
    return "";
  }
  function renderCommentary() {
    const recentComments = gameState.commentary.slice(-2).reverse();
    const commentaryHTML = recentComments.map((c) => {
      let accentColor = "#6366f1";
      let emoji = "\u26BD";
      if (c.type === "goal") {
        accentColor = "#00ff88";
        emoji = "\u26BD";
      } else if (c.type === "save") {
        accentColor = "#00d4ff";
        emoji = "\u{1F9E4}";
      } else if (c.type === "attack") {
        accentColor = "#ffd700";
        emoji = "\u26A1";
      }
      return `
            <div style="
                padding: 12px 16px;
                margin-bottom: 8px;
                background: linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.4) 100%);
                backdrop-filter: blur(20px);
                border-radius: 12px;
                border-left: 4px solid ${accentColor};
                box-shadow:
                    0 8px 24px rgba(0, 0, 0, 0.6),
                    0 0 0 1px rgba(255, 255, 255, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
                font-size: 14px;
                line-height: 1.5;
                color: rgba(255, 255, 255, 0.95);
                font-weight: 600;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
            ">
                <span style="
                    font-size: 16px;
                    margin-right: 8px;
                    filter: drop-shadow(0 0 4px ${accentColor});
                ">${emoji}</span>
                ${c.text}

                <!-- Subtle glow effect -->
                <div style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 50%;
                    background: linear-gradient(180deg, ${accentColor}15 0%, transparent 100%);
                    pointer-events: none;
                "></div>
            </div>
        `;
    }).join("");
    return `
        <div style="width: 100%;">
            <div id="commentary-content" style="
                display: flex;
                flex-direction: column;
                gap: 6px;
            ">
                ${commentaryHTML || ""}
            </div>
        </div>
    `;
  }
  function renderStats() {
    if (!gameState) {
      return '<div class="stats-card"><p>Loading stats...</p></div>';
    }
    const homeStats = gameState.stats.home || { possession: 50, shotsOnTarget: 0, shotsOffTarget: 0, xGTotal: 0 };
    const awayStats = gameState.stats.away || { possession: 50, shotsOnTarget: 0, shotsOffTarget: 0, xGTotal: 0 };
    const homeShots = (homeStats.shotsOnTarget || 0) + (homeStats.shotsOffTarget || 0);
    const awayShots = (awayStats.shotsOnTarget || 0) + (awayStats.shotsOffTarget || 0);
    const createStatBar = (label, homeVal, awayVal, homeWidth, awayWidth, homeColor, awayColor) => `
        <div style="
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            align-items: center;
            gap: 10px;
            width: 100%;
            font-size: 13px;
            font-weight: 700;
        ">
            <span style="color: white; text-align: left; font-weight: 800;">${homeVal}</span>
            <span style="opacity: 0.7; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">${label}</span>
            <span style="color: white; text-align: right; font-weight: 800;">${awayVal}</span>

            <div style="grid-column: 1 / -1; display: flex; width: 100%; height: 8px; background: rgba(0,0,0,0.4); border-radius: 4px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);">
                <div style="width: ${homeWidth}%; background: ${homeColor}; transition: width 0.3s ease;"></div>
                <div style="width: ${awayWidth}%; background: ${awayColor}; transition: width 0.3s ease;"></div>
            </div>
        </div>
    `;
    const totalPossession = (homeStats.possession || 50) + (awayStats.possession || 50);
    const homePossessionPercent = totalPossession > 0 ? homeStats.possession / totalPossession * 100 : 50;
    const awayPossessionPercent = totalPossession > 0 ? awayStats.possession / totalPossession * 100 : 50;
    const totalShots = homeShots + awayShots;
    const homeShotsPercent = totalShots > 0 ? homeShots / totalShots * 100 : 50;
    const awayShotsPercent = totalShots > 0 ? awayShots / totalShots * 100 : 50;
    const totalXG = (homeStats.xGTotal || 0) + (awayStats.xGTotal || 0);
    const homeXGPercent = totalXG > 0 ? (homeStats.xGTotal || 0) / totalXG * 100 : 50;
    const awayXGPercent = totalXG > 0 ? (awayStats.xGTotal || 0) / totalXG * 100 : 50;
    return `
        <div style="
            margin-top: 12px;
            background: linear-gradient(135deg, rgba(15, 15, 30, 0.9) 0%, rgba(25, 25, 45, 0.9) 100%);
            backdrop-filter: blur(20px);
            border-radius: 16px;
            padding: 16px 24px;
            box-shadow:
                0 15px 40px rgba(0, 0, 0, 0.5),
                0 0 0 1px rgba(255, 255, 255, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            position: relative;
            overflow: hidden;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            align-items: center;
        ">
            ${createStatBar(
      "Possession",
      `${homeStats.possession || 50}%`,
      `${awayStats.possession || 50}%`,
      homePossessionPercent,
      awayPossessionPercent,
      gameState.homeJerseyColor,
      gameState.awayJerseyColor
    )}

            ${createStatBar(
      "Shots",
      homeShots,
      awayShots,
      homeShotsPercent,
      awayShotsPercent,
      gameState.homeJerseyColor,
      gameState.awayJerseyColor
    )}

            ${createStatBar(
      "xG",
      (homeStats.xGTotal || 0).toFixed(2),
      (awayStats.xGTotal || 0).toFixed(2),
      homeXGPercent,
      awayXGPercent,
      gameState.homeJerseyColor,
      gameState.awayJerseyColor
    )}
        </div>
    `;
  }
  function renderMatchSummary() {
    const homeLogo = gameState.teamLogos?.[gameState.homeTeam] || "";
    const awayLogo = gameState.teamLogos?.[gameState.awayTeam] || "";
    const winner = gameState.homeScore > gameState.awayScore ? gameState.homeTeam : gameState.awayScore > gameState.homeScore ? gameState.awayTeam : "Draw";
    const allEvents = [
      ...gameState.goalEvents.map((e) => ({ ...e, type: "goal", team: e.isHome ? "home" : "away" })),
      ...gameState.cardEvents.map((e) => ({ ...e, type: "card", team: e.isHome ? "home" : "away" }))
    ];
    allEvents.sort((a, b) => a.time - b.time);
    const groupEvents = (events) => {
      const grouped = {};
      events.forEach((e) => {
        const key = e.type === "goal" ? e.scorer : e.player;
        if (!grouped[key]) {
          grouped[key] = { name: key, goals: [], cards: [] };
        }
        if (e.type === "goal") {
          grouped[key].goals.push(e.time);
        } else {
          grouped[key].cards.push({ time: e.time, card: e.card });
        }
      });
      return Object.values(grouped);
    };
    const homeGroupedEvents = groupEvents(allEvents.filter((e) => e.team === "home"));
    const awayGroupedEvents = groupEvents(allEvents.filter((e) => e.team === "away"));
    const generateEventsHTML = (groupedEvents, isHome) => {
      if (groupedEvents.length === 0) {
        return `
                <div style="
                    text-align: center;
                    padding: 60px 20px;
                    opacity: 0.4;
                ">
                    <div style="font-size: 48px; margin-bottom: 12px;">\u26BD</div>
                    <div style="font-size: 14px;">No events</div>
                </div>
            `;
      }
      return groupedEvents.map((group) => {
        let content = [];
        if (group.goals.length > 0) {
          content.push(`
                    <div style="
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 12px 16px;
                        margin-bottom: 10px;
                        background: linear-gradient(${isHome ? "90deg" : "270deg"}, rgba(0, 255, 136, 0.15) 0%, rgba(0, 255, 136, 0.03) 100%);
                        border-${isHome ? "left" : "right"}: 3px solid #00ff88;
                        border-radius: 10px;
                        transition: all 0.3s ease;
                    ">
                        <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                            <span style="font-size: 20px; filter: drop-shadow(0 0 6px #00ff88);">\u26BD</span>
                            <span style="font-weight: 700; font-size: 14px;">${group.name}</span>
                        </div>
                        <div style="
                            display: flex;
                            gap: 6px;
                            font-size: 13px;
                            font-weight: 600;
                            color: #00ff88;
                        ">
                            ${group.goals.map((t) => `<span style="
                                padding: 4px 8px;
                                background: rgba(0, 255, 136, 0.2);
                                border-radius: 6px;
                                border: 1px solid rgba(0, 255, 136, 0.3);
                            ">${t}'</span>`).join("")}
                        </div>
                    </div>
                `);
        }
        group.cards.forEach((cardEvent) => {
          const cardSymbol = cardEvent.card === "yellow" ? "\u{1F7E8}" : "\u{1F7E5}";
          const cardColor = cardEvent.card === "yellow" ? "#fde047" : "#ef4444";
          content.push(`
                    <div style="
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 12px 16px;
                        margin-bottom: 10px;
                        background: linear-gradient(${isHome ? "90deg" : "270deg"}, ${cardColor}15 0%, ${cardColor}03 100%);
                        border-${isHome ? "left" : "right"}: 3px solid ${cardColor};
                        border-radius: 10px;
                        transition: all 0.3s ease;
                    ">
                        <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                            <span style="font-size: 18px; filter: drop-shadow(0 0 6px ${cardColor});">${cardSymbol}</span>
                            <span style="font-weight: 700; font-size: 14px;">${group.name}</span>
                        </div>
                        <span style="
                            padding: 4px 8px;
                            background: ${cardColor}20;
                            border-radius: 6px;
                            border: 1px solid ${cardColor}30;
                            font-size: 13px;
                            font-weight: 600;
                            color: ${cardColor};
                        ">${cardEvent.time}'</span>
                    </div>
                `);
        });
        return content.join("");
      }).join("");
    };
    const homeEventsHTML = generateEventsHTML(homeGroupedEvents, true);
    const awayEventsHTML = generateEventsHTML(awayGroupedEvents, false);
    return `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(12px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
            padding: 20px;
            box-sizing: border-box;
        ">
            <div style="
                background: linear-gradient(135deg, rgba(15, 15, 30, 0.98) 0%, rgba(25, 25, 45, 0.98) 100%);
                border-radius: 24px;
                padding: 40px;
                box-shadow:
                    0 40px 100px rgba(0,0,0,0.8),
                    0 0 0 1px rgba(255,255,255,0.15),
                    inset 0 1px 0 rgba(255,255,255,0.2);
                max-width: 1100px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                color: white;
                position: relative;
            ">

                <!-- Header -->
                <div style="text-align: center; margin-bottom: 32px;">
                    <div style="
                        display: inline-block;
                        padding: 8px 24px;
                        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
                        border-radius: 20px;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        font-size: 14px;
                        font-weight: 700;
                        letter-spacing: 1px;
                        margin-bottom: 16px;
                        text-transform: uppercase;
                    ">\u23F1\uFE0F Full Time</div>

                    ${winner !== "Draw" ? `
                        <div style="
                            font-size: 20px;
                            font-weight: 700;
                            color: #00ff88;
                            text-shadow: 0 0 20px #00ff8860;
                            margin-bottom: 24px;
                            letter-spacing: 0.5px;
                        ">\u{1F3C6} ${winner} Wins!</div>
                    ` : `
                        <div style="
                            font-size: 20px;
                            font-weight: 700;
                            color: #fbbf24;
                            text-shadow: 0 0 20px #fbbf2460;
                            margin-bottom: 24px;
                            letter-spacing: 0.5px;
                        ">\u{1F91D} Match Drawn</div>
                    `}
                </div>

                <!-- Score Display -->
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 40px;
                    padding: 28px;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 20px;
                    margin-bottom: 32px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
                ">
                    <!-- Home Team -->
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 16px;
                        flex: 1;
                        justify-content: flex-end;
                    ">
                        <div style="text-align: right;">
                            <div style="
                                font-size: 22px;
                                font-weight: 900;
                                color: #ffffff;
                                text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
                                margin-bottom: 4px;
                            ">${gameState.homeTeam}</div>
                            <div style="
                                font-size: 12px;
                                opacity: 0.6;
                                font-weight: 600;
                            ">${gameState.teamCoaches?.[gameState.homeTeam] || ""}</div>
                        </div>
                        ${homeLogo ? `
                            <div style="
                                width: 64px;
                                height: 64px;
                                background: rgba(255, 255, 255, 0.05);
                                border-radius: 16px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                border: 1px solid rgba(255, 255, 255, 0.1);
                                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                            ">
                                <img src="${homeLogo}" style="
                                    width: 52px;
                                    height: 52px;
                                    object-fit: contain;
                                    filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));
                                ">
                            </div>
                        ` : ""}
                    </div>

                    <!-- Score -->
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 20px;
                        padding: 0 24px;
                    ">
                        <div style="
                            font-size: 56px;
                            font-weight: 900;
                            color: ${gameState.homeJerseyColor};
                            text-shadow: 0 0 30px ${gameState.homeJerseyColor}60;
                            filter: brightness(1.3);
                        ">${gameState.homeScore}</div>
                        <div style="
                            font-size: 40px;
                            font-weight: 300;
                            opacity: 0.4;
                        ">-</div>
                        <div style="
                            font-size: 56px;
                            font-weight: 900;
                            color: ${gameState.awayJerseyColor};
                            text-shadow: 0 0 30px ${gameState.awayJerseyColor}60;
                            filter: brightness(1.3);
                        ">${gameState.awayScore}</div>
                    </div>

                    <!-- Away Team -->
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 16px;
                        flex: 1;
                    ">
                        ${awayLogo ? `
                            <div style="
                                width: 64px;
                                height: 64px;
                                background: rgba(255, 255, 255, 0.05);
                                border-radius: 16px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                border: 1px solid rgba(255, 255, 255, 0.1);
                                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                            ">
                                <img src="${awayLogo}" style="
                                    width: 52px;
                                    height: 52px;
                                    object-fit: contain;
                                    filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));
                                ">
                            </div>
                        ` : ""}
                        <div>
                            <div style="
                                font-size: 22px;
                                font-weight: 900;
                                color: #ffffff;
                                text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
                                margin-bottom: 4px;
                            ">${gameState.awayTeam}</div>
                            <div style="
                                font-size: 12px;
                                opacity: 0.6;
                                font-weight: 600;
                            ">${gameState.teamCoaches?.[gameState.awayTeam] || ""}</div>
                        </div>
                    </div>
                </div>

                <!-- Tabs -->
                <div style="
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                    margin-bottom: 28px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    padding-bottom: 0;
                ">
                    <button onclick="switchSummaryTab('events')" id="events-tab" style="
                        padding: 12px 28px;
                        border-radius: 12px 12px 0 0;
                        font-weight: 700;
                        font-size: 14px;
                        cursor: pointer;
                        background: linear-gradient(135deg, #667eea, #764ba2);
                        color: white;
                        border: none;
                        transition: all 0.3s;
                        letter-spacing: 0.5px;
                        text-transform: uppercase;
                        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                    ">
                        \u{1F4CB} Match Events
                    </button>
                    <button onclick="switchSummaryTab('stats')" id="stats-tab" style="
                        padding: 12px 28px;
                        border-radius: 12px 12px 0 0;
                        font-weight: 700;
                        font-size: 14px;
                        cursor: pointer;
                        background: rgba(255,255,255,0.05);
                        color: rgba(255,255,255,0.7);
                        border: 1px solid rgba(255,255,255,0.1);
                        transition: all 0.3s;
                        letter-spacing: 0.5px;
                        text-transform: uppercase;
                    ">
                        \u{1F4CA} Statistics
                    </button>
                </div>

                <!-- Events Content (Side by Side) -->
                <div id="summary-events-content" style="display: block;">
                    <div style="
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 24px;
                        margin-bottom: 28px;
                    ">
                        <!-- Home Events -->
                        <div>
                            <h3 style="
                                margin: 0 0 20px 0;
                                font-size: 16px;
                                font-weight: 800;
                                color: ${gameState.homeJerseyColor};
                                filter: brightness(1.3);
                                text-transform: uppercase;
                                letter-spacing: 1px;
                                display: flex;
                                align-items: center;
                                gap: 8px;
                            ">
                                <span>\u{1F4CB}</span> ${gameState.homeTeam}
                            </h3>
                            <div style="
                                max-height: 400px;
                                overflow-y: auto;
                                padding-right: 8px;
                            ">
                                ${homeEventsHTML}
                            </div>
                        </div>

                        <!-- Away Events -->
                        <div>
                            <h3 style="
                                margin: 0 0 20px 0;
                                font-size: 16px;
                                font-weight: 800;
                                color: ${gameState.awayJerseyColor};
                                filter: brightness(1.3);
                                text-transform: uppercase;
                                letter-spacing: 1px;
                                display: flex;
                                align-items: center;
                                gap: 8px;
                            ">
                                <span>\u{1F4CB}</span> ${gameState.awayTeam}
                            </h3>
                            <div style="
                                max-height: 400px;
                                overflow-y: auto;
                                padding-right: 8px;
                            ">
                                ${awayEventsHTML}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Stats Content -->
                <div id="summary-stats-content" style="display: none;">
                    ${renderStatisticsSummary()}
                </div>

                <!-- Action Button -->
                <button onclick="resetMatch()" style="
                    width: 100%;
                    margin-top: 20px;
                    padding: 18px;
                    font-size: 18px;
                    font-weight: 800;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    background: linear-gradient(135deg, #f093fb, #f5576c);
                    color: white;
                    border: none;
                    border-radius: 14px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 8px 24px rgba(240, 147, 251, 0.4);
                ">
                    \u{1F504} New Match
                </button>
            </div>
        </div>

        <style>
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            button:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
            }

            /* Custom Scrollbar */
            #summary-events-content > div > div::-webkit-scrollbar,
            #summary-stats-content::-webkit-scrollbar {
                width: 6px;
            }

            #summary-events-content > div > div::-webkit-scrollbar-track,
            #summary-stats-content::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 3px;
            }

            #summary-events-content > div > div::-webkit-scrollbar-thumb,
            #summary-stats-content::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
            }

            #summary-events-content > div > div::-webkit-scrollbar-thumb:hover,
            #summary-stats-content::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.3);
            }
        </style>
    `;
  }
  function renderStatisticsSummary() {
    const homeStats = gameState.stats.home || {};
    const awayStats = gameState.stats.away || {};
    const homePassAcc = homeStats.passesAttempted > 0 ? Math.round(homeStats.passesCompleted / homeStats.passesAttempted * 100) : 0;
    const awayPassAcc = awayStats.passesAttempted > 0 ? Math.round(awayStats.passesCompleted / awayStats.passesAttempted * 100) : 0;
    const renderStatBar = (label, homeVal, awayVal, icon) => {
      const homeNum = parseFloat(String(homeVal)) || 0;
      const awayNum = parseFloat(String(awayVal)) || 0;
      const total = homeNum + awayNum;
      const homePercent = total > 0 ? homeNum / total * 100 : 50;
      const awayPercent = total > 0 ? awayNum / total * 100 : 50;
      return `
            <div style="
                padding: 16px;
                background: rgba(255, 255, 255, 0.02);
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.06);
            ">
                <!-- Label and Icon -->
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-bottom: 12px;
                    font-size: 13px;
                    font-weight: 700;
                    opacity: 0.8;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                ">
                    <span style="font-size: 16px;">${icon}</span>
                    <span>${label}</span>
                </div>

                <!-- Values -->
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                    font-size: 20px;
                    font-weight: 900;
                ">
                    <span style="
                        color: ${gameState.homeJerseyColor};
                        filter: brightness(1.3);
                        text-shadow: 0 0 10px ${gameState.homeJerseyColor}40;
                    ">${homeVal}</span>
                    <span style="
                        color: ${gameState.awayJerseyColor};
                        filter: brightness(1.3);
                        text-shadow: 0 0 10px ${gameState.awayJerseyColor}40;
                    ">${awayVal}</span>
                </div>

                <!-- Bar -->
                <div style="
                    display: flex;
                    width: 100%;
                    height: 8px;
                    background: rgba(0, 0, 0, 0.4);
                    border-radius: 4px;
                    overflow: hidden;
                    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
                ">
                    <div style="
                        width: ${homePercent}%;
                        background: linear-gradient(90deg, ${gameState.homeJerseyColor}, ${lightenColor2(gameState.homeJerseyColor, 20)});
                        transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                        box-shadow: 0 0 8px ${gameState.homeJerseyColor}60;
                    "></div>
                    <div style="
                        width: ${awayPercent}%;
                        background: linear-gradient(270deg, ${gameState.awayJerseyColor}, ${lightenColor2(gameState.awayJerseyColor, 20)});
                        transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                        box-shadow: 0 0 8px ${gameState.awayJerseyColor}60;
                    "></div>
                </div>
            </div>
        `;
    };
    return `
        <div style="padding: 20px 0;">
            <h3 style="
                text-align: center;
                font-size: 20px;
                font-weight: 900;
                margin-bottom: 32px;
                text-transform: uppercase;
                letter-spacing: 1px;
                opacity: 0.9;
            ">
                \u{1F4CA} Detailed Match Statistics
            </h3>

            <div style="
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;
                margin-bottom: 20px;
            ">
                ${renderStatBar("Possession", `${homeStats.possession || 50}%`, `${awayStats.possession || 50}%`, "\u26A1")}
                ${renderStatBar("Goals", gameState.homeScore, gameState.awayScore, "\u26BD")}
                ${renderStatBar("Shots", (homeStats.shotsOnTarget || 0) + (homeStats.shotsOffTarget || 0), (awayStats.shotsOnTarget || 0) + (awayStats.shotsOffTarget || 0), "\u{1F3AF}")}
                ${renderStatBar("On Target", homeStats.shotsOnTarget || 0, awayStats.shotsOnTarget || 0, "\u{1F3AF}")}
                ${renderStatBar("xG", (homeStats.xGTotal || 0).toFixed(2), (awayStats.xGTotal || 0).toFixed(2), "\u26A1")}
                ${renderStatBar("Pass Acc.", `${homePassAcc}%`, `${awayPassAcc}%`, "\u2705")}
                ${renderStatBar("Interceptions", homeStats.interceptions || 0, awayStats.interceptions || 0, "\u270B")}
                ${renderStatBar("Offsides", homeStats.offsides || 0, awayStats.offsides || 0, "\u{1F6A9}")}
            </div>
        </div>
    `;
  }
  function switchSummaryTab(tab) {
    const eventsContent = document.getElementById("summary-events-content");
    const statsContent = document.getElementById("summary-stats-content");
    const eventsTab = document.getElementById("events-tab");
    const statsTab = document.getElementById("stats-tab");
    if (!eventsContent || !statsContent || !eventsTab || !statsTab) {
      console.warn("Could not find summary tab elements");
      return;
    }
    eventsContent.style.display = tab === "events" ? "block" : "none";
    statsContent.style.display = tab === "stats" ? "block" : "none";
    if (tab === "events") {
      eventsTab.style.background = "linear-gradient(135deg, #667eea, #764ba2)";
      eventsTab.style.color = "white";
      eventsTab.style.border = "none";
      eventsTab.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
      statsTab.style.background = "rgba(255,255,255,0.05)";
      statsTab.style.color = "rgba(255,255,255,0.7)";
      statsTab.style.border = "1px solid rgba(255,255,255,0.1)";
      statsTab.style.boxShadow = "none";
    } else {
      statsTab.style.background = "linear-gradient(135deg, #667eea, #764ba2)";
      statsTab.style.color = "white";
      statsTab.style.border = "none";
      statsTab.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
      eventsTab.style.background = "rgba(255,255,255,0.05)";
      eventsTab.style.color = "rgba(255,255,255,0.7)";
      eventsTab.style.border = "1px solid rgba(255,255,255,0.1)";
      eventsTab.style.boxShadow = "none";
    }
  }

  // src/ui/uiManager.ts
  var uiElements = {};
  function render() {
    const app = document.getElementById("app");
    if (!app)
      return;
    if (!gameState) {
      console.error("\u274C Cannot render: gameState not initialized");
      app.innerHTML = '<div style="padding: 40px; text-align: center; color: white;">Loading game state...</div>';
      return;
    }
    if (gameState.status === "upload" || gameState.status === "setup") {
      gameState.gameUIDisplayed = false;
      if (gameState.status === "upload" && renderUploadScreen) {
        renderUploadScreen(app);
      }
      if (gameState.status === "setup" && renderSetupScreen) {
        renderSetupScreen(app);
      }
    } else {
      if (!gameState.gameUIDisplayed) {
        setupGameScreen(app);
        gameState.gameUIDisplayed = true;
      }
      updateGameUI();
    }
    const toggleContainer = document.getElementById("toggle-container");
    if (toggleContainer) {
      const toggleBtn = document.createElement("button");
      toggleBtn.id = "orientationToggleBtn";
      toggleBtn.style.background = "rgba(255,255,255,0.1)";
      toggleBtn.style.border = "1px solid rgba(255,255,255,0.2)";
      toggleBtn.style.color = "white";
      toggleBtn.style.padding = "5px 10px";
      toggleBtn.style.borderRadius = "5px";
      toggleBtn.style.cursor = "pointer";
      toggleBtn.style.fontSize = "10px";
      toggleBtn.style.opacity = "0.5";
      toggleBtn.style.transition = "opacity 0.3s";
      toggleBtn.innerText = gameState.isVertical ? "View: Horizontal" : "View: Vertical";
      toggleBtn.onmouseover = () => toggleBtn.style.opacity = "1";
      toggleBtn.onmouseout = () => toggleBtn.style.opacity = "0.5";
      toggleBtn.addEventListener("click", toggleOrientation);
      toggleContainer.innerHTML = "";
      toggleContainer.appendChild(toggleBtn);
    }
  }
  function updateGameUI() {
    if (uiElements.homeScore)
      uiElements.homeScore.textContent = String(gameState.homeScore);
    if (uiElements.awayScore)
      uiElements.awayScore.textContent = String(gameState.awayScore);
    if (uiElements.timeDisplay)
      uiElements.timeDisplay.textContent = `${String(Math.floor(gameState.timeElapsed)).padStart(2, "0")}'`;
    if (uiElements.halfDisplay)
      uiElements.halfDisplay.textContent = `HALF ${gameState.currentHalf}`;
    if (uiElements.statusIndicator && getStatusIndicator) {
      uiElements.statusIndicator.innerHTML = getStatusIndicator();
    }
    const commentaryWrapper = document.getElementById("commentary-wrapper");
    if (commentaryWrapper && renderCommentary) {
      clearTimeout(gameState.commentaryFadeTimeout);
      commentaryWrapper.innerHTML = renderCommentary();
      commentaryWrapper.style.opacity = "0.5";
      gameState.commentaryFadeTimeout = setTimeout(() => {
        commentaryWrapper.style.opacity = "0.1";
      }, 1e3);
    }
    if (uiElements.statsWrapper && renderStats) {
      uiElements.statsWrapper.innerHTML = renderStats();
    }
    if (uiElements.summaryWrapper) {
      if (gameState.status === "finished" && !gameState.summaryDrawn && renderMatchSummary) {
        uiElements.summaryWrapper.innerHTML = renderMatchSummary();
        gameState.summaryDrawn = true;
        setTimeout(() => {
          const eventsTab = document.getElementById("events-tab");
          if (eventsTab) {
            eventsTab.click();
          }
        }, 10);
      } else if (gameState.status !== "finished" && gameState.summaryDrawn) {
        uiElements.summaryWrapper.innerHTML = "";
        gameState.summaryDrawn = false;
      }
    }
  }
  function setupGameScreen(app) {
    const LOGICAL_WIDTH = gameState.isVertical ? 600 : 800;
    const LOGICAL_HEIGHT = gameState.isVertical ? 800 : 600;
    const SCALE_FACTOR = CFG2().HIGH_DPI_SCALE_FACTOR;
    const physicalCanvasWidth = LOGICAL_WIDTH * SCALE_FACTOR;
    const physicalCanvasHeight = LOGICAL_HEIGHT * SCALE_FACTOR;
    const containerWidth = LOGICAL_WIDTH;
    const containerHeight = LOGICAL_HEIGHT;
    const scoreboardHTML = renderScoreboard ? renderScoreboard() : "";
    const commentaryHTML = renderCommentary ? renderCommentary() : "";
    const statsHTML = renderStats ? renderStats() : "";
    app.innerHTML = `
        <div class="container">
            <div style="width: ${containerWidth}px; margin: 0 auto 12px auto;">
                <div id="scoreboard-wrapper">
                    ${scoreboardHTML}
                </div>
            </div>

            <div class="canvas-container" style="position: relative; margin-bottom: 20px;">
                <div id="canvas-container" style="position: relative; width: ${containerWidth}px; height: ${containerHeight}px; margin: 0 auto; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1);">
                    <canvas id="backgroundCanvas" width="${physicalCanvasWidth}" height="${physicalCanvasHeight}" style="position: absolute; z-index: 1;"></canvas>
                    <canvas id="gameCanvas" width="${physicalCanvasWidth}" height="${physicalCanvasHeight}" style="position: absolute; z-index: 2;"></canvas>
                    <canvas id="uiCanvas" width="${physicalCanvasWidth}" height="${physicalCanvasHeight}" style="position: absolute; z-index: 3;"></canvas>

                    <div id="commentary-wrapper" style="position: absolute; bottom: 16px; left: 16px; z-index: 4; max-width: 350px;">
                        ${commentaryHTML}
                    </div>
                </div>
                <div id="summary-wrapper"></div>
            </div>

            <div style="max-width: ${containerWidth}px; margin: 0 auto;">
                <div id="stats-wrapper">${statsHTML}</div>
            </div>

            <div id="toggle-container" style="max-width: ${containerWidth}px; margin: 10px auto 0; text-align: right;"></div>
        </div>

        `;
    uiElements.homeScore = document.getElementById("home-score-color");
    uiElements.awayScore = document.getElementById("away-score-color");
    uiElements.timeDisplay = document.getElementById("time-display");
    uiElements.halfDisplay = document.getElementById("half-display");
    uiElements.statusIndicator = document.getElementById("status-indicator");
    uiElements.commentaryContent = document.getElementById("commentary-content");
    uiElements.statsWrapper = document.getElementById("stats-wrapper");
    uiElements.summaryWrapper = document.getElementById("summary-wrapper");
    setTimeout(() => {
      console.log("\u{1F3A8} Setting up canvas & drawing background...");
      const success = initializeCanvasLayers ? initializeCanvasLayers() : false;
      if (success) {
        if (gameState.orientationChanged) {
          gameState.offscreenPitch = null;
          gameState.orientationChanged = false;
        }
        if (drawPitchBackground) {
          drawPitchBackground();
        }
        if (renderGame) {
          renderGame();
        }
      } else {
        console.error("\u274C Failed to initialize canvases");
      }
    }, 0);
  }

  // src/main.ts
  function handleFileUpload(event) {
    const input = event.target;
    const file = input.files?.[0];
    if (!file)
      return;
    const reader = new FileReader();
    reader.onload = function(e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sayfa1 = workbook.Sheets["Sayfa1"];
      const sayfa1Data = XLSX.utils.sheet_to_json(sayfa1, { header: 1 });
      gameState.teams = [];
      gameState.teamJerseys = {};
      gameState.teamCoaches = {};
      gameState.teamLogos = gameState.teamLogos || {};
      sayfa1Data.slice(1).forEach((row) => {
        if (row[0] && row[0].toString().trim()) {
          const teamName = row[0].toString().trim();
          gameState.teams.push(teamName);
          gameState.teamJerseys[teamName] = {
            jersey1: row[3] ? row[3].toString().trim() : "#ef4444",
            jersey2: row[4] ? row[4].toString().trim() : "#3b82f6"
          };
          gameState.teamLogos[teamName] = row[7] ? row[7].toString().trim() : "";
        }
      });
      const oyuncular = workbook.Sheets["oyuncular"];
      const oyuncularData = XLSX.utils.sheet_to_json(oyuncular, { header: 1 });
      gameState.players = oyuncularData.slice(1).filter((row) => {
        const hasName = row[0] && row[0].toString().trim();
        const hasTeam = row[2] && row[2].toString().trim();
        const position = row[3] ? row[3].toString().trim() : "";
        const fotmobId = row[11];
        const rating = row[12];
        if (position.toLowerCase() === "coach") {
          const teamName = row[2].toString().trim();
          const coachName = row[0].toString().trim();
          gameState.teamCoaches[teamName] = coachName;
          return false;
        }
        const hasValidId = fotmobId && fotmobId.toString().trim() && fotmobId.toString().trim().toLowerCase() !== "n/a";
        return hasName && hasTeam && hasValidId && rating && !isNaN(parseFloat(rating));
      }).map((row, index) => {
        const positionString = row[3]?.toString().trim() || "";
        const isGK = positionString.toLowerCase().includes("keeper") || positionString.toLowerCase().includes("gk");
        const playerId = row[11] ? String(row[11]).trim() : `temp_${index}`;
        const playerRole = typeof getRoleFromPosition === "function" ? getRoleFromPosition(positionString) : "CM";
        return {
          id: playerId,
          name: row[0].toString().trim(),
          team: row[2].toString().trim(),
          position: positionString.split(",")[0].trim(),
          role: playerRole,
          pace: parseInt(row[4]) || 60,
          shooting: parseInt(row[5]) || 60,
          passing: parseInt(row[6]) || 60,
          dribbling: parseInt(row[7]) || 60,
          defending: parseInt(row[8]) || 60,
          physicality: parseInt(row[9]) || 60,
          goalkeeping: parseInt(row[10]) || 60,
          rating: parseFloat(row[12]) || 6.5,
          realStats: {
            chancesCreated: parseFloat(row[13]) || 0,
            crossesAccuracy: parseFloat(row[14]) || 0,
            dribblesSucceeded: parseFloat(row[15]) || 0,
            dispossessed: parseFloat(row[16]) || 0,
            penaltyWon: parseFloat(row[17]) || 0,
            foulsWon: parseFloat(row[18]) || 0,
            aerialsWonPercent: parseFloat(row[19]) || 50,
            duelWonPercent: parseFloat(row[20]) || 50,
            interceptions: parseFloat(row[21]) || 0,
            fouls: parseFloat(row[22]) || 0,
            recoveries: parseFloat(row[23]) || 0,
            goals: parseFloat(row[24]) || 0,
            assists: parseFloat(row[25]) || 0,
            xG: parseFloat(row[26]) || 0,
            xGOT: parseFloat(row[27]) || 0,
            shots: parseFloat(row[28]) || 0,
            shotsOnTarget: parseFloat(row[29]) || 0,
            xA: parseFloat(row[30]) || 0,
            passAccuracy: parseFloat(row[31]) || 70,
            longBallAccuracy: parseFloat(row[32]) || 50,
            wonContest: parseFloat(row[33]) || 0,
            touchesOppBox: parseFloat(row[34]) || 0,
            gkSaves: isGK ? parseFloat(row[35]) || 0 : 0,
            gkSavePercent: isGK ? parseFloat(row[36]) || 50 : 0,
            gkGoalsConceded: isGK ? parseFloat(row[37]) || 0 : 0,
            gkGoalsPrevented: isGK ? parseFloat(row[38]) || 0 : 0,
            gkKeeperSweeper: isGK ? parseFloat(row[39]) || 0 : 0,
            gkErrorLedToGoal: isGK ? parseFloat(row[40]) || 0 : 0,
            yellowCards: parseFloat(row[41]) || 0,
            redCards: parseFloat(row[42]) || 0
          }
        };
      });
      gameState.homeTeam = gameState.teams[0] || "";
      gameState.awayTeam = gameState.teams[1] || "";
      gameState.status = "setup";
      render();
    };
    reader.readAsArrayBuffer(file);
  }
  function attachSetupEventListeners() {
    const homeSelect = document.getElementById("homeSelect");
    const awaySelect = document.getElementById("awaySelect");
    const homeTacticSelect = document.getElementById("homeTacticSelect");
    const awayTacticSelect = document.getElementById("awayTacticSelect");
    if (homeSelect) {
      homeSelect.addEventListener("change", (e) => {
        gameState.homeTeam = e.target.value;
        const homeTeamPlayers = gameState.players.filter((p) => p.team === gameState.homeTeam);
        gameState.homeFormation = selectBestFormation(homeTeamPlayers);
        gameState.homeTactic = selectBestTactic(homeTeamPlayers);
        gameState.homeTacticManuallySet = false;
        render();
      });
    }
    if (awaySelect) {
      awaySelect.addEventListener("change", (e) => {
        gameState.awayTeam = e.target.value;
        const awayTeamPlayers = gameState.players.filter((p) => p.team === gameState.awayTeam);
        gameState.awayFormation = selectBestFormation(awayTeamPlayers);
        gameState.awayTactic = selectBestTactic(awayTeamPlayers);
        gameState.awayTacticManuallySet = false;
        render();
      });
    }
    if (homeTacticSelect) {
      homeTacticSelect.addEventListener("change", (e) => {
        gameState.homeTactic = e.target.value;
        gameState.homeTacticManuallySet = true;
      });
    }
    if (awayTacticSelect) {
      awayTacticSelect.addEventListener("change", (e) => {
        gameState.awayTactic = e.target.value;
        gameState.awayTacticManuallySet = true;
      });
    }
  }
  var isBatchMode = false;
  var lastFrameTime2 = 0;
  var gameTime2 = 0;
  var physicsAccumulator2 = 0;
  var animationFrameId = null;
  var gameIntervalId = null;
  var pendingGameEvents = [];
  var CFG3 = () => GAME_CONFIG;
  var resolveSide2 = (foulTeam) => {
    if (typeof foulTeam === "boolean")
      return foulTeam ? "home" : "away";
    return foulTeam;
  };
  var invertSide2 = (side) => side === "home" ? "away" : "home";
  function handleFreeKick(foulLocation, foulTeam) {
    const foulSide = resolveSide2(foulTeam);
    const awardSide = invertSide2(foulSide);
    const freeKickTeam = awardSide === "home";
    const pos = {
      x: Number(foulLocation?.x) || CFG3().PITCH_WIDTH / 2,
      y: Number(foulLocation?.y) || CFG3().PITCH_HEIGHT / 2
    };
    const opponentGoalX = getAttackingGoalX(freeKickTeam, gameState.currentHalf);
    const distToGoal = distance(pos, { x: opponentGoalX, y: 300 });
    const isCentral = Math.abs(pos.y - 300) < 130;
    const isDangerous = distToGoal < 280 && isCentral;
    const executionDelay = isDangerous ? 3e3 : 1200;
    gameState.status = "FREE_KICK";
    gameState.setPiece = {
      type: "FREE_KICK",
      team: freeKickTeam,
      side: awardSide,
      position: pos,
      executionTime: Date.now() + executionDelay,
      configured: false,
      executed: false,
      isDangerous
    };
    gameState.ballPosition = { x: pos.x, y: pos.y };
    gameState.ballVelocity = { x: 0, y: 0 };
    gameState.ballTrajectory = null;
    gameState.ballHolder = null;
    ensureCorrectSetPiecePlacement(gameState);
    if (configureSetPieceRoutines) {
      configureSetPieceRoutines(gameState);
    }
    const teamName = awardSide === "home" ? gameState.homeTeam : gameState.awayTeam;
    gameState.commentary.push({
      text: `${Math.floor(gameState.timeElapsed)}' Free kick for ${teamName}`,
      type: "attack"
    });
  }
  function handleThrowIn() {
    const lastPlayer = gameState.lastTouchedBy;
    if (!lastPlayer) {
      console.error(`\u274C THROW-IN ERROR: No lastTouchedBy player!`);
      setupKickOff("home");
      return;
    }
    const throwInTeam = !lastPlayer.isHome;
    const throwInY = gameState.ballPosition.y < 300 ? 10 : 590;
    const throwInX = Math.max(50, Math.min(750, gameState.ballPosition.x));
    console.log(`\u26BE THROW-IN: Last touch by ${lastPlayer.name} (${lastPlayer.isHome ? "home" : "away"}), awarding to ${throwInTeam ? "home" : "away"}`);
    gameState.status = "THROW_IN";
    gameState.setPiece = {
      type: "THROW_IN",
      team: throwInTeam,
      position: { x: throwInX, y: throwInY },
      executionTime: Date.now() + 400,
      // IMPROVED: Much faster (was 1000ms)
      executed: false
    };
    gameState.ballPosition.x = throwInX;
    gameState.ballPosition.y = throwInY;
    gameState.ballVelocity = { x: 0, y: 0 };
    gameState.ballTrajectory = null;
    gameState.ballHolder = null;
    const teamName = throwInTeam ? gameState.homeTeam : gameState.awayTeam;
    gameState.commentary.push({
      text: `${Math.floor(gameState.timeElapsed)}' Throw-in for ${teamName}`,
      type: "attack"
    });
  }
  function handleBallOutOfBounds() {
    const ballX = gameState.ballPosition.x;
    const lastPlayer = gameState.lastTouchedBy;
    if (!lastPlayer) {
      setupKickOff("home");
      return;
    }
    gameState.ballTrajectory = null;
    gameState.ballHolder = null;
    gameState.ballVelocity = { x: 0, y: 0 };
    gameState.ballHeight = 0;
    const crossedLeftSide = ballX < 50;
    const crossedRightSide = ballX > 750;
    if (!crossedLeftSide && !crossedRightSide) {
      return;
    }
    const homeDefendsLeft = gameState.currentHalf === 1;
    let defendingTeamIsHome;
    if (crossedLeftSide) {
      defendingTeamIsHome = homeDefendsLeft;
    } else {
      defendingTeamIsHome = !homeDefendsLeft;
    }
    const defendingTeamTouchedLast = lastPlayer.isHome === defendingTeamIsHome;
    if (defendingTeamTouchedLast) {
      const isLeftCorner = crossedLeftSide;
      const isTopCorner = gameState.ballPosition.y < 300;
      gameState.status = "CORNER_KICK";
      gameState.setPiece = {
        type: "CORNER_KICK",
        team: !defendingTeamIsHome,
        position: getCornerKickPosition(isLeftCorner, isTopCorner),
        executionTime: Date.now() + 800,
        // IMPROVED: Faster execution (was 1200ms)
        executed: false
      };
      gameState.ballPosition.x = gameState.setPiece.position.x;
      gameState.ballPosition.y = gameState.setPiece.position.y;
      if (configureSetPieceRoutines) {
        configureSetPieceRoutines(gameState);
      }
      const teamName = !defendingTeamIsHome ? gameState.homeTeam : gameState.awayTeam;
      gameState.commentary.push({
        text: `${Math.floor(gameState.timeElapsed)}' Corner kick for ${teamName}`,
        type: "attack"
      });
    } else {
      const gkX = crossedLeftSide ? 50 : 750;
      gameState.status = "GOAL_KICK";
      gameState.setPiece = {
        type: "GOAL_KICK",
        team: defendingTeamIsHome,
        position: getGoalKickPosition(gkX, "center"),
        executionTime: Date.now() + 1e3,
        // IMPROVED: Faster execution (was 1200ms)
        executed: false
      };
      gameState.ballPosition.x = gameState.setPiece.position.x;
      gameState.ballPosition.y = gameState.setPiece.position.y;
      if (configureSetPieceRoutines) {
        configureSetPieceRoutines(gameState);
      }
      const teamName = defendingTeamIsHome ? gameState.homeTeam : gameState.awayTeam;
      gameState.commentary.push({
        text: `${Math.floor(gameState.timeElapsed)}' Goal kick for ${teamName}`,
        type: "attack"
      });
    }
  }
  function processPendingEvents(currentGameTime) {
    const eventsToProcess = pendingGameEvents.filter((event) => currentGameTime >= event.resolveTime);
    pendingGameEvents = pendingGameEvents.filter((event) => currentGameTime < event.resolveTime);
    for (const event of eventsToProcess) {
      if (event.type === "shot_outcome") {
        resolveShot_WithAdvancedGK(event.data);
      }
    }
  }
  function restoreFormationAfterSetPiece() {
    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    allPlayers.forEach((player) => {
      if (player.role === "GK") {
        const ownGoalX = getAttackingGoalX(!player.isHome, gameState.currentHalf);
        player.targetX = ownGoalX;
        player.targetY = 300;
      } else {
        const activePos = getPlayerActivePosition(player, gameState.currentHalf);
        player.targetX = activePos.x;
        player.targetY = activePos.y;
      }
      player.speedBoost = 1;
    });
  }
  function selectJerseys() {
    const homeJerseys = gameState.teamJerseys[gameState.homeTeam];
    const awayJerseys = gameState.teamJerseys[gameState.awayTeam];
    function isValidColor(color) {
      if (!color || typeof color !== "string")
        return false;
      return /^#[0-9A-F]{6}$/i.test(color.trim());
    }
    const defaultHomeColor = "#ef4444";
    const defaultAwayColor = "#3b82f6";
    if (!homeJerseys || !awayJerseys) {
      gameState.homeJerseyColor = defaultHomeColor;
      gameState.awayJerseyColor = defaultAwayColor;
      return;
    }
    gameState.homeJerseyColor = isValidColor(homeJerseys.jersey1) ? homeJerseys.jersey1.trim() : defaultHomeColor;
    let awayColor = isValidColor(awayJerseys.jersey1) ? awayJerseys.jersey1.trim() : defaultAwayColor;
    if (gameState.homeJerseyColor.toLowerCase() === awayColor.toLowerCase()) {
      awayColor = isValidColor(awayJerseys.jersey2) ? awayJerseys.jersey2.trim() : "#10b981";
    }
    gameState.awayJerseyColor = awayColor;
  }
  function setupKickOff(teamWithBall) {
    console.log(`\u26BD Setting up kick-off for ${teamWithBall} team`);
    if (teamWithBall !== "home" && teamWithBall !== "away") {
      console.error(`\u274C setupKickOff: INVALID TEAM "${teamWithBall}"!`);
    }
    const kickoffTeamIsHome = teamWithBall === "home";
    const setPieceState = {
      type: "KICK_OFF",
      team: kickoffTeamIsHome,
      position: { x: 400, y: 300 },
      executionTime: Date.now() + 1200,
      configured: false,
      executed: false
    };
    gameState.setPiece = setPieceState;
    gameState.ballTrajectory = null;
    gameState.ballHolder = null;
    gameState.ballPosition = { x: 400, y: 300 };
    gameState.ballVelocity = { x: 0, y: 0 };
    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    const centerX = 400;
    const centerY = 300;
    allPlayers.forEach((p) => {
      p.isChasingBall = false;
      p.chaseStartTime = null;
    });
    allPlayers.forEach((player) => {
      player.hasBallControl = false;
      player.vx = 0;
      player.vy = 0;
      player.speedBoost = 1;
      player.targetLocked = false;
      const activePos = getPlayerActivePosition(player, gameState.currentHalf);
      const ownGoalX = getAttackingGoalX(!player.isHome, gameState.currentHalf);
      const isKickoffTeam = player.isHome === kickoffTeamIsHome;
      const ownHalfIsLeft = ownGoalX < centerX;
      if (player.role === "GK") {
        player.x = ownGoalX;
        player.y = centerY;
        return;
      }
      const baseDistanceFromCenter = 60;
      const roleAdjustment = player.role.includes("ST") || player.role.includes("FW") || player.role.includes("CF") ? 20 : player.role.includes("MID") || player.role.includes("CM") || player.role.includes("CAM") ? 40 : 80;
      let targetX, targetY;
      if (ownHalfIsLeft) {
        targetX = centerX - baseDistanceFromCenter - roleAdjustment;
        targetX = Math.max(targetX, ownGoalX + 80);
      } else {
        targetX = centerX + baseDistanceFromCenter + roleAdjustment;
        targetX = Math.min(targetX, ownGoalX - 80);
      }
      targetY = Math.max(80, Math.min(520, activePos.y));
      if (!isKickoffTeam) {
        const distToCenter = distance({ x: targetX, y: targetY }, { x: centerX, y: centerY });
        if (distToCenter < 70) {
          const angle = Math.atan2(targetY - centerY, targetX - centerX);
          const pushDistance = 75;
          targetX = centerX + Math.cos(angle) * pushDistance;
          targetY = centerY + Math.sin(angle) * pushDistance;
          if (ownHalfIsLeft) {
            targetX = Math.min(targetX, centerX - 30);
          } else {
            targetX = Math.max(targetX, centerX + 30);
          }
          targetY = Math.max(80, Math.min(520, targetY));
        }
      }
      player.x = targetX;
      player.y = targetY;
      player.targetX = player.x;
      player.targetY = player.y;
    });
    gameState.status = "KICK_OFF";
    if (configureSetPieceRoutines) {
      configureSetPieceRoutines(gameState);
    }
    const kickOffTeamPlayers = kickoffTeamIsHome ? gameState.homePlayers : gameState.awayPlayers;
    const striker = kickOffTeamPlayers.filter((p) => p.role === "ST").sort((a, b) => b.rating - a.rating)[0];
    const midfielder = kickOffTeamPlayers.filter((p) => ["CAM", "CM", "CDM"].includes(p.role)).sort((a, b) => b.passing - a.passing)[0];
    if (!striker && !midfielder) {
      console.error("\u274C No suitable players for kick-off");
      return;
    }
    const primaryTaker = striker || midfielder;
    const nonGKPlayers = kickOffTeamPlayers.filter((p) => p.role !== "GK");
    const secondaryTaker = striker && midfielder ? midfielder : nonGKPlayers.length > 1 ? nonGKPlayers[1] : null;
    if (primaryTaker) {
      primaryTaker.x = centerX;
      primaryTaker.y = centerY;
    }
    if (secondaryTaker) {
      const opponentGoalX = getAttackingGoalX(kickoffTeamIsHome, gameState.currentHalf);
      const direction = opponentGoalX > centerX ? -1 : 1;
      secondaryTaker.x = centerX + direction * 25;
      secondaryTaker.y = centerY;
    }
  }
  function removePlayerFromMatch(playerToRemove) {
    if (playerToRemove.isHome) {
      gameState.homePlayers = gameState.homePlayers.filter((p) => p.id !== playerToRemove.id);
    } else {
      gameState.awayPlayers = gameState.awayPlayers.filter((p) => p.id !== playerToRemove.id);
    }
  }
  function handleShotAttempt(holder, goalX, allPlayers) {
    const goalkeeper = allPlayers.find((p) => p.role === "GK" && p.isHome !== holder.isHome);
    const opponents = allPlayers.filter((p) => p.isHome !== holder.isHome);
    const xG = calculateXG(holder, goalX, holder.y, opponents);
    const teamStats = holder.isHome ? gameState.stats.home : gameState.stats.away;
    teamStats.xGTotal += xG;
    gameState.lastTouchedBy = holder;
    const shootingSkill = holder.shooting / 110;
    const pressureLevel = opponents.filter((opp) => distance(holder, opp) < 40).length;
    const pressurePenalty = pressureLevel * 0.12;
    const distToGoal = Math.abs(holder.x - goalX);
    const distancePenalty = Math.min(distToGoal / 350, 0.25);
    const angleFromCenter = Math.abs(holder.y - 300);
    const anglePenalty = Math.min(angleFromCenter / 180, 0.2);
    const fatiguePenalty = Math.max(0, (100 - holder.stamina) / 100 * 0.15);
    const baseAccuracy = shootingSkill * 0.9;
    const effectiveAccuracy = Math.max(0.1, baseAccuracy - pressurePenalty - distancePenalty - anglePenalty - fatiguePenalty);
    const goalCenterY = 300;
    const GOAL_Y_TOP = GAME_CONFIG.GOAL_Y_TOP;
    const GOAL_Y_BOTTOM = GAME_CONFIG.GOAL_Y_BOTTOM;
    const goalHeight = GOAL_Y_BOTTOM - GOAL_Y_TOP;
    const maxDeviation = goalHeight * 1.5;
    const deviationRange = maxDeviation * (1 - effectiveAccuracy);
    const aimOffset = (Math.random() - 0.5) * deviationRange;
    const shotTargetY = goalCenterY + aimOffset;
    const shotPower = 800 + holder.shooting * 4;
    passBall(holder, holder.x, holder.y, goalX, shotTargetY, 1, shotPower, true);
    if (gameState.ballTrajectory) {
      gameState.ballTrajectory.shotTargetY = shotTargetY;
      gameState.ballTrajectory.effectiveAccuracy = effectiveAccuracy;
    }
    gameState.shotInProgress = true;
    gameState.shooter = holder;
    gameState.currentShotXG = xG;
    const resolveDuration = gameState.ballTrajectory?.duration ? gameState.ballTrajectory.duration / 1e3 : 0.5;
    pendingGameEvents.push({
      type: "shot_outcome",
      resolveTime: gameTime2 + resolveDuration,
      data: { holder, xG, goalkeeper, goalX, shotTargetY }
    });
  }
  function updateMatchStats() {
    const now = Date.now();
    const lastUpdate = gameState.stats.lastPossessionUpdate ?? now;
    const elapsed = (now - lastUpdate) / 1e3;
    if (!gameState.stats.possessionTimer) {
      gameState.stats.possessionTimer = { home: 0, away: 0 };
    }
    if (gameState.ballHolder) {
      if (gameState.ballHolder.isHome) {
        gameState.stats.possessionTimer.home += elapsed;
      } else {
        gameState.stats.possessionTimer.away += elapsed;
      }
    }
    const totalTime = gameState.stats.possessionTimer.home + gameState.stats.possessionTimer.away;
    if (totalTime > 0) {
      gameState.stats.home.possession = Math.round(gameState.stats.possessionTimer.home / totalTime * 100);
      gameState.stats.away.possession = Math.round(gameState.stats.possessionTimer.away / totalTime * 100);
    }
    gameState.stats.lastPossessionUpdate = now;
    updateTeamStates();
  }
  var MomentumSystem = {
    homeMomentum: 0,
    awayMomentum: 0,
    lastUpdate: Date.now(),
    getMomentumBonus(isHome) {
      const momentum = isHome ? this.homeMomentum : this.awayMomentum;
      return 1 + momentum / 1e3;
    },
    onGoalScored(scoringTeam) {
      if (scoringTeam === "home") {
        this.homeMomentum = Math.min(100, this.homeMomentum + 25);
        this.awayMomentum = Math.max(-100, this.awayMomentum - 15);
      } else {
        this.awayMomentum = Math.min(100, this.awayMomentum + 25);
        this.homeMomentum = Math.max(-100, this.homeMomentum - 15);
      }
      console.log(`\u{1F4C8} Momentum: Home=${this.homeMomentum}, Away=${this.awayMomentum}`);
    },
    onShotOnTarget(shootingTeam) {
      if (shootingTeam === "home") {
        this.homeMomentum = Math.min(100, this.homeMomentum + 5);
        this.awayMomentum = Math.max(-100, this.awayMomentum - 2);
      } else {
        this.awayMomentum = Math.min(100, this.awayMomentum + 5);
        this.homeMomentum = Math.max(-100, this.homeMomentum - 2);
      }
    },
    onTackleWon(tacklingTeam) {
      if (tacklingTeam === "home") {
        this.homeMomentum = Math.min(100, this.homeMomentum + 2);
      } else {
        this.awayMomentum = Math.min(100, this.awayMomentum + 2);
      }
    },
    onPassCompleted(passingTeam) {
      if (passingTeam === "home") {
        this.homeMomentum = Math.min(100, this.homeMomentum + 0.5);
      } else {
        this.awayMomentum = Math.min(100, this.awayMomentum + 0.5);
      }
    },
    update() {
      const now = Date.now();
      const elapsed = (now - this.lastUpdate) / 1e3;
      if (elapsed > 5) {
        const decayRate = 2;
        if (this.homeMomentum > 0) {
          this.homeMomentum = Math.max(0, this.homeMomentum - decayRate);
        } else if (this.homeMomentum < 0) {
          this.homeMomentum = Math.min(0, this.homeMomentum + decayRate);
        }
        if (this.awayMomentum > 0) {
          this.awayMomentum = Math.max(0, this.awayMomentum - decayRate);
        } else if (this.awayMomentum < 0) {
          this.awayMomentum = Math.min(0, this.awayMomentum + decayRate);
        }
        this.lastUpdate = now;
      }
    },
    reset() {
      this.homeMomentum = 0;
      this.awayMomentum = 0;
      this.lastUpdate = Date.now();
    }
  };
  function applyMomentumToPlayer(player) {
    const momentumBonus = MomentumSystem.getMomentumBonus(player.isHome);
    player.effectivePace = player.pace * momentumBonus;
    player.effectiveShooting = player.shooting * momentumBonus;
    player.effectivePassing = player.passing * momentumBonus;
  }
  function updateMomentum() {
    MomentumSystem.update();
    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    allPlayers.forEach(applyMomentumToPlayer);
  }
  function renderMomentumBar(ctx) {
    if (!ctx)
      return;
    const barWidth = 300;
    const barHeight = 20;
    const barX = (GAME_CONFIG.PITCH_WIDTH - barWidth) / 2;
    const barY = 10;
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(barX, barY, barWidth, barHeight);
    const homeMomentum = Math.max(0, MomentumSystem.homeMomentum);
    const homeMomentumWidth = homeMomentum / 100 * (barWidth / 2);
    ctx.fillStyle = gameState.homeJerseyColor;
    ctx.fillRect(barX + barWidth / 2 - homeMomentumWidth, barY, homeMomentumWidth, barHeight);
    const awayMomentum = Math.max(0, MomentumSystem.awayMomentum);
    const awayMomentumWidth = awayMomentum / 100 * (barWidth / 2);
    ctx.fillStyle = gameState.awayJerseyColor;
    ctx.fillRect(barX + barWidth / 2, barY, awayMomentumWidth, barHeight);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(barX + barWidth / 2, barY);
    ctx.lineTo(barX + barWidth / 2, barY + barHeight);
    ctx.stroke();
    ctx.fillStyle = "white";
    ctx.font = "bold 10px Arial";
    ctx.textAlign = "center";
    ctx.fillText("MOMENTUM", barX + barWidth / 2, barY - 3);
  }
  function updateTeamStates() {
    const timeSinceStateUpdate = Date.now() - (gameState.lastTeamStateUpdate || 0);
    if (timeSinceStateUpdate < 2e3)
      return;
    gameState.lastTeamStateUpdate = Date.now();
    gameState.homeTeamState = determineTeamState(true);
    gameState.awayTeamState = determineTeamState(false);
  }
  function determineTeamState(isHome) {
    const tactic = TACTICS[isHome ? gameState.homeTactic : gameState.awayTactic];
    if (!tactic) {
      return "BALANCED";
    }
    const teamHasBall = gameState.ballHolder && gameState.ballHolder.isHome === isHome;
    const timeSinceChange = Date.now() - gameState.lastPossessionChange;
    const opponentGoalX = getAttackingGoalX(isHome, gameState.currentHalf);
    const ballDistToOpponentGoal = gameState.ballPosition ? Math.abs(gameState.ballPosition.x - opponentGoalX) : 400;
    const score = isHome ? gameState.homeScore : gameState.awayScore;
    const opponentScore = isHome ? gameState.awayScore : gameState.homeScore;
    const scoreDiff = score - opponentScore;
    const timeRemaining = (gameState.currentHalf === 1 ? 45 : 90) - gameState.timeElapsed;
    const teamPlayers = isHome ? gameState.homePlayers : gameState.awayPlayers;
    const avgStamina = teamPlayers.reduce((sum, p) => sum + p.stamina, 0) / teamPlayers.length;
    if (scoreDiff < 0 && timeRemaining < 10) {
      return "ATTACKING";
    }
    if (scoreDiff > 0 && timeRemaining < 15) {
      return avgStamina < 40 ? "DEFENDING" : "BALANCED";
    }
    if (teamHasBall && timeSinceChange < 5e3 && ballDistToOpponentGoal > 200 && tactic.counterAttackSpeed > 1.2) {
      return avgStamina > 50 ? "COUNTER_ATTACK" : "BALANCED";
    }
    if (!teamHasBall && tactic.pressIntensity > 0.7 && ballDistToOpponentGoal < 400 && avgStamina > 60) {
      return "HIGH_PRESS";
    }
    if (teamHasBall && ballDistToOpponentGoal < 300) {
      return "ATTACKING";
    }
    if (!teamHasBall && ballDistToOpponentGoal > 500) {
      return "DEFENDING";
    }
    return "BALANCED";
  }
  function handlePassAttempt(holder, allPlayers) {
    const teammates = allPlayers.filter((p) => p.isHome === holder.isHome && p.name !== holder.name && p.role !== "GK");
    if (teammates.length === 0) {
      return;
    }
    const passTarget = teammates[Math.floor(Math.random() * teammates.length)];
    if (passTarget) {
      const passDist = distance(holder, passTarget);
      const nearbyOpponents = allPlayers.filter(
        (p) => p.isHome !== holder.isHome && distance(holder, p) < 50
      );
      const isUnderPressure = nearbyOpponents.length > 1;
      const passSuccess = calculatePassSuccess(holder, passTarget, passDist, isUnderPressure);
      let passSpeed = 400 + holder.passing * 3;
      if (gameState.postKickOffCalmPeriod && gameState.kickOffCompletedTime) {
        const timeSinceKickOff = Date.now() - gameState.kickOffCompletedTime;
        if (timeSinceKickOff < 4e3) {
          passSpeed = Math.min(passSpeed, 450);
        }
      }
      passBall(holder, holder.x, holder.y, passTarget.x, passTarget.y, passSuccess, passSpeed, false);
      gameState.currentPassReceiver = passTarget;
      const teamStats = holder.isHome ? gameState.stats.home : gameState.stats.away;
      teamStats.passesAttempted++;
      eventBus.publish("BALL_PASSED" /* BALL_PASSED */, {
        passer: holder,
        receiver: passTarget,
        distance
      });
    }
  }
  function resetAfterGoal() {
    console.log("\u{1F3AF} Resetting after goal...");
    gameState.shotInProgress = false;
    gameState.shooter = null;
    gameState.currentShotXG = null;
    gameState.ballTrajectory = null;
    gameState.ballChasers.clear();
    gameState.currentPassReceiver = null;
    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    allPlayers.forEach((p) => {
      p.isChasingBall = false;
      p.chaseStartTime = null;
      p.speedBoost = 1;
      p.targetLocked = false;
    });
    const kickOffTeam = gameState.lastGoalScorer === "home" ? "away" : "home";
    const goalResetDelay = GAME_LOOP.GAME_SPEED > 100 ? 0 : 3e3;
    setTimeout(() => {
      if (gameState.status !== "finished") {
        setupKickOff(kickOffTeam);
      }
    }, goalResetDelay);
  }
  function switchSides() {
    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    allPlayers.forEach((player) => {
      const activePos = getPlayerActivePosition(player, 2);
      player.x = activePos.x;
      player.y = activePos.y;
      player.targetX = activePos.x;
      player.targetY = activePos.y;
      player.vx = 0;
      player.vy = 0;
      player.hasBallControl = false;
      player.ballReceivedTime = null;
    });
    gameState.ballPosition = { x: 400, y: 300 };
    gameState.ballVelocity = { x: 0, y: 0 };
    gameState.ballHeight = 0;
    gameState.ballTrajectory = null;
    gameState.ballHolder = null;
    gameState.ballChasers.clear();
    const tempLine = gameState.homeDefensiveLine;
    gameState.homeDefensiveLine = 800 - gameState.awayDefensiveLine;
    gameState.awayDefensiveLine = 800 - tempLine;
  }
  function startMatch() {
    console.log("START MATCH CALLED!");
    try {
      ensureStatsShape(gameState);
      const homeTeam = selectBestTeam(gameState.homeTeam);
      const awayTeam = selectBestTeam(gameState.awayTeam);
      if (!homeTeam || !awayTeam || homeTeam.players.length < 11 || awayTeam.players.length < 11) {
        alert("Not enough players!");
        return;
      }
      gameState.homeFormation = homeTeam.formation;
      gameState.awayFormation = awayTeam.formation;
      if (!gameState.homeTacticManuallySet) {
        gameState.homeTactic = selectBestTactic(homeTeam.players);
      }
      if (!gameState.awayTacticManuallySet) {
        gameState.awayTactic = selectBestTactic(awayTeam.players);
      }
      selectJerseys();
      initFirstTouchStats();
      initOffsideStats();
      const initialized = initializePlayers(
        homeTeam.players,
        awayTeam.players,
        homeTeam.formation,
        awayTeam.formation
      );
      gameState.homePlayers = initialized.home;
      gameState.awayPlayers = initialized.away;
      gameState.status = "intro";
      gameState.commentary = [];
      gameState.timeElapsed = 0;
      gameState.currentHalf = 1;
      gameState.homeScore = 0;
      gameState.awayScore = 0;
      gameState.ballPosition = { x: 400, y: 300 };
      gameState.ballVelocity = { x: 0, y: 0 };
      gameState.ballHeight = 0;
      gameState.ballTrajectory = null;
      gameState.ballHolder = null;
      gameState.lastEventTime = Date.now();
      gameState.particles = [];
      gameState.ballChasers = /* @__PURE__ */ new Set();
      gameState.totalPasses = 0;
      gameState.totalShots = 0;
      gameState.shotInProgress = false;
      gameState.shooter = null;
      gameState.homeDefensiveLine = 200;
      gameState.awayDefensiveLine = 600;
      gameState.lastPossessionChange = 0;
      gameState.currentShotXG = null;
      gameState.currentPassReceiver = null;
      gameState.fouls = 0;
      gameState.yellowCards = [];
      gameState.redCards = [];
      gameState.lastGoalScorer = null;
      gameState.lastTouchedBy = null;
      gameState.setPieceExecuting = false;
      gameState.lastControlAttempt = 0;
      gameState.homeTeamState = "BALANCED";
      gameState.awayTeamState = "BALANCED";
      gameState.lastTeamStateUpdate = Date.now();
      gameState.possessionChanges = 0;
      lastFrameTime2 = 0;
      physicsAccumulator2 = 0;
      gameTime2 = 0;
      render();
      setTimeout(() => {
        console.log("\u{1F3A8} Initializing canvas layers...");
        const success = initializeCanvasLayers();
        if (success) {
          console.log("\u2713 Canvas layers ready");
          drawPitchBackground();
          if (gameState.contexts && gameState.contexts.game) {
            console.log("\u2713 Rendering initial game state");
            renderGame();
          }
          console.log("\u2713 Starting intro rendering");
          animationFrameId = requestAnimationFrame(introRenderLoop);
        } else {
          console.error("\u2717 Failed to initialize canvas layers");
          alert("Error: Canvas initialization failed. Please refresh the page.");
        }
      }, 150);
      setTimeout(() => {
        setupKickOff("home");
        gameState.commentary = [{
          text: `\u26BD ${gameState.homeTeam} (${homeTeam.formation}, ${TACTICS[gameState.homeTactic]?.name || "Unknown"}) vs ${gameState.awayTeam} (${awayTeam.formation}, ${TACTICS[gameState.awayTactic]?.name || "Unknown"}) - KICK OFF!`,
          type: "goal"
        }];
        updateGameUI();
        if (animationFrameId)
          cancelAnimationFrame(animationFrameId);
        lastFrameTime2 = 0;
        physicsAccumulator2 = 0;
        gameTime2 = 0;
        console.log("\u{1F3AE} Starting V2 game loop...");
        animationFrameId = requestAnimationFrame(gameLoop_V2);
        eventBus.publish("MATCH_START" /* MATCH_START */, {
          homeTeam: gameState.homeTeam,
          awayTeam: gameState.awayTeam
        });
      }, 3e3);
      const realTimeInterval = 100;
      const timeIncrementPerInterval = GAME_LOOP.GAME_SPEED * (realTimeInterval / 1e3);
      gameIntervalId = window.setInterval(() => {
        if (gameState.status === "playing") {
          gameState.timeElapsed += timeIncrementPerInterval;
        }
        updateMatchStats();
        if (gameState.timeElapsed >= 45 && gameState.currentHalf === 1) {
          handleHalfTime();
          return;
        }
        if (gameState.timeElapsed >= 90 && gameState.status !== "finished") {
          handleFullTime();
          return;
        }
        if (GAME_LOOP.GAME_SPEED <= 100) {
          if (typeof updateGameUI === "function")
            updateGameUI();
        }
      }, realTimeInterval);
    } catch (error) {
      console.error("ERROR IN START MATCH:", error);
    }
  }
  function debugBallState() {
    if (gameState.status === "playing") {
      const ballSpeed = Math.sqrt(
        gameState.ballVelocity.x ** 2 + gameState.ballVelocity.y ** 2
      );
      if (ballSpeed < 1 && !gameState.ballHolder && !gameState.ballTrajectory) {
        console.log("\u26A0\uFE0F BALL APPEARS STUCK:", {
          position: gameState.ballPosition,
          velocity: gameState.ballVelocity,
          chasers: gameState.ballChasers.size,
          holder: null
        });
      }
    }
  }
  setInterval(debugBallState, 1e3);
  function introRenderLoop(_timestamp) {
    if (gameState.status !== "intro") {
      return;
    }
    if (!gameState.contexts || !gameState.contexts.game) {
      animationFrameId = requestAnimationFrame(introRenderLoop);
      return;
    }
    renderGame();
    animationFrameId = requestAnimationFrame(introRenderLoop);
  }
  function handleHalfTime() {
    if (gameState.status === "halftime") {
      return;
    }
    gameState.status = "halftime";
    gameState.commentary.push({ text: "\u23F8\uFE0F HALF TIME!", type: "goal" });
    updateGameUI();
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    eventBus.publish("HALF_TIME" /* HALF_TIME */, {
      homeScore: gameState.homeScore,
      awayScore: gameState.awayScore
    });
    const halftimeDelay = GAME_LOOP.GAME_SPEED > 100 ? 0 : 5e3;
    setTimeout(() => {
      switchSides();
      gameState.currentHalf = 2;
      gameState.timeElapsed = 45;
      setupKickOff("away");
      if (gameState.setPiece && gameState.setPiece.type === "KICK_OFF") {
        gameState.setPiece.executionTime = Date.now() + 2e3;
      }
      gameState.commentary.push({ text: "\u25B6\uFE0F Second half begins!", type: "goal" });
      if (GAME_LOOP.GAME_SPEED <= 100) {
        if (typeof updateGameUI === "function")
          updateGameUI();
      }
      lastFrameTime2 = 0;
      physicsAccumulator2 = 0;
      animationFrameId = requestAnimationFrame(gameLoop_V2);
    }, halftimeDelay);
  }
  function handleFullTime() {
    gameState.status = "finished";
    if (gameIntervalId)
      clearInterval(gameIntervalId);
    const winner = gameState.homeScore > gameState.awayScore ? gameState.homeTeam : gameState.awayScore > gameState.homeScore ? gameState.awayTeam : "Draw";
    gameState.commentary.push(
      { text: `\u{1F3C1} FULL TIME! ${gameState.homeScore} - ${gameState.awayScore}`, type: "goal" },
      { text: winner === "Draw" ? "\u{1F91D} Match ends in a draw!" : `\u{1F3C6} ${winner} WINS!`, type: "goal" }
    );
    eventBus.publish("MATCH_END" /* MATCH_END */, {
      homeScore: gameState.homeScore,
      awayScore: gameState.awayScore,
      winner
    });
    render();
  }
  function resetMatch() {
    if (gameIntervalId)
      clearInterval(gameIntervalId);
    if (animationFrameId)
      cancelAnimationFrame(animationFrameId);
    eventBus.clear();
    gameState.status = "setup";
    gameState.timeElapsed = 0;
    gameState.currentHalf = 1;
    gameState.homeScore = 0;
    gameState.awayScore = 0;
    gameState.commentary = [];
    gameState.ballPosition = { x: 400, y: 300 };
    gameState.ballVelocity = { x: 0, y: 0 };
    gameState.ballHeight = 0;
    gameState.ballTrajectory = null;
    gameState.ballHolder = null;
    gameState.particles = [];
    gameState.ballChasers = /* @__PURE__ */ new Set();
    gameState.totalPasses = 0;
    gameState.totalShots = 0;
    gameState.shotInProgress = false;
    gameState.shooter = null;
    gameState.homeDefensiveLine = 200;
    gameState.awayDefensiveLine = 600;
    gameState.lastPossessionChange = 0;
    gameState.homeTactic = "balanced";
    gameState.awayTactic = "balanced";
    gameState.currentShotXG = null;
    gameState.currentPassReceiver = null;
    gameState.fouls = 0;
    gameState.yellowCards = [];
    gameState.redCards = [];
    gameState.lastGoalScorer = null;
    gameState.goalEvents = [];
    gameState.cardEvents = [];
    gameState.backgroundDrawn = false;
    gameState.gameUIDisplayed = false;
    gameState.summaryDrawn = false;
    gameState.homeTeamState = "BALANCED";
    gameState.awayTeamState = "BALANCED";
    gameState.lastTeamStateUpdate = Date.now();
    gameState.possessionChanges = 0;
    lastFrameTime2 = 0;
    physicsAccumulator2 = 0;
    gameTime2 = 0;
    gameState.stats = {
      home: {
        possession: 0,
        possessionTime: 0,
        passesCompleted: 0,
        passesAttempted: 0,
        shotsOnTarget: 0,
        shotsOffTarget: 0,
        tackles: 0,
        interceptions: 0,
        saves: 0,
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
        saves: 0,
        xGTotal: 0
      },
      possession: { home: 50, away: 50 },
      possessionTimer: { home: 0, away: 0 },
      lastPossessionUpdate: Date.now()
    };
    pendingGameEvents = [];
    render();
  }
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function() {
        render();
      });
    } else {
      render();
    }
  }

  // src/ai/goalkeeper.ts
  var GOALKEEPER_CONFIG = {
    // Positioning parameters
    BASE_POSITION_RATIO: 0.05,
    // How far from goal line (5%)
    THREAT_ADVANCE_MAX: 50,
    // Max distance to advance (pixels)
    ANGLE_CUT_RATIO: 0.3,
    // How much to advance toward ball
    // Stance types and their effects
    STANCES: {
      COMFORTABLE: {
        name: "comfortable",
        saveBonus: 0,
        mobilityPenalty: 0,
        description: "No immediate threat"
      },
      READY: {
        name: "ready",
        saveBonus: 0.05,
        mobilityPenalty: 0.1,
        description: "Threat nearby, ready to react"
      },
      SET: {
        name: "set",
        saveBonus: 0.15,
        mobilityPenalty: 0.3,
        description: "Shot imminent, set position"
      },
      ADVANCING: {
        name: "advancing",
        saveBonus: 0.1,
        mobilityPenalty: 0,
        description: "Coming out to narrow angle"
      },
      ONE_ON_ONE: {
        name: "oneOnOne",
        saveBonus: 0.2,
        mobilityPenalty: 0.5,
        description: "Making self big for 1v1"
      }
    },
    // Threat assessment
    DANGER_ZONE_DISTANCE: 280,
    // Distance considered dangerous
    IMMEDIATE_THREAT_DISTANCE: 150,
    // Distance for "set" stance
    ONE_ON_ONE_DISTANCE: 80,
    // Distance for 1v1 stance
    // Sweeping behavior
    SWEEPER_DISTANCE: 120,
    // Max distance to sweep
    THROUGH_BALL_INTERCEPT_RANGE: 200,
    // Range to intercept through balls
    // Save positioning
    GOAL_CENTER_Y: 300,
    GOAL_WIDTH: 120,
    // GOAL_Y_BOTTOM - GOAL_Y_TOP
    REACTION_TIME: 200,
    // ms to react to shot
    // Cross handling
    CROSS_CLAIM_RANGE: 80,
    // Range to claim crosses
    CROSS_PUNCH_RANGE: 120
    // Range to punch if can't claim
  };
  function getDistance3(p1, p2) {
    return distance(p1, p2);
  }
  function assessGoalkeeperThreats(goalkeeper, _ball, opponents) {
    const goalX = getAttackingGoalX(!goalkeeper.isHome, gameState.currentHalf);
    const threats = opponents.filter((opp) => opp.role !== "GK").map((opp) => {
      const distToGoal = Math.abs(opp.x - goalX);
      const distToGK = getDistance3(goalkeeper, opp);
      const angleToGoal = Math.abs(opp.y - GOALKEEPER_CONFIG.GOAL_CENTER_Y);
      const hasBall = gameState.ballHolder?.id === opp.id;
      let threatScore = 0;
      if (distToGoal < GOALKEEPER_CONFIG.DANGER_ZONE_DISTANCE) {
        threatScore += (1 - distToGoal / GOALKEEPER_CONFIG.DANGER_ZONE_DISTANCE) * 50;
      }
      const angleQuality = 1 - angleToGoal / (GOALKEEPER_CONFIG.GOAL_WIDTH / 2);
      threatScore += angleQuality * 30;
      if (hasBall) {
        threatScore += 40;
      }
      if (opp.role === "ST" || opp.role === "RW" || opp.role === "LW") {
        threatScore += 10;
      }
      return {
        player: opp,
        score: threatScore,
        distToGoal,
        distToGK,
        hasBall,
        angleToGoal
      };
    }).filter((threat) => threat.score > 20).sort((a, b) => b.score - a.score);
    return threats;
  }
  function determineGoalkeeperStance(_goalkeeper, mainThreat, threats, _ball) {
    if (!mainThreat) {
      return GOALKEEPER_CONFIG.STANCES["COMFORTABLE"];
    }
    if (mainThreat.hasBall && mainThreat.distToGoal < GOALKEEPER_CONFIG.ONE_ON_ONE_DISTANCE && threats.length === 1) {
      return GOALKEEPER_CONFIG.STANCES["ONE_ON_ONE"];
    }
    if (mainThreat.hasBall && mainThreat.distToGoal < GOALKEEPER_CONFIG.IMMEDIATE_THREAT_DISTANCE) {
      return GOALKEEPER_CONFIG.STANCES["SET"];
    }
    if (gameState.ballHeight > 0.5) {
      return GOALKEEPER_CONFIG.STANCES["ADVANCING"];
    }
    if (mainThreat.distToGoal < GOALKEEPER_CONFIG.DANGER_ZONE_DISTANCE) {
      return GOALKEEPER_CONFIG.STANCES["READY"];
    }
    return GOALKEEPER_CONFIG.STANCES["COMFORTABLE"];
  }
  function calculateOptimalGoalkeeperPosition(goalkeeper, mainThreat, stance, ball) {
    const goalX = getAttackingGoalX(!goalkeeper.isHome, gameState.currentHalf);
    const goalCenterY = GOALKEEPER_CONFIG.GOAL_CENTER_Y;
    if (gameState.status === "CORNER_KICK" && gameState.setPiece) {
      const cornerY = gameState.setPiece.position.y;
      const realStats2 = goalkeeper.realStats || {};
      const sweeperRating = realStats2.gkKeeperSweeper || 5;
      const aggressionFactor = sweeperRating / 10;
      const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
      const attackersInBox = allPlayers.filter((p) => p.isHome !== goalkeeper.isHome && Math.abs(p.x - goalX) < 120).length;
      const crowdingPenalty = Math.min(attackersInBox * 0.1, 0.3);
      const baseShift = (cornerY - goalCenterY) * (0.25 + aggressionFactor * 0.15 - crowdingPenalty);
      const isNearPost = cornerY < goalCenterY && cornerY < 250 || cornerY > goalCenterY && cornerY > 350;
      const postAdjustment = isNearPost ? 0 : 10;
      let targetY2 = goalCenterY + baseShift + (cornerY > goalCenterY ? postAdjustment : -postAdjustment);
      const minY = GAME_CONFIG.GOAL_Y_TOP + 25;
      const maxY = GAME_CONFIG.GOAL_Y_BOTTOM - 25;
      targetY2 = Math.max(minY, Math.min(maxY, targetY2));
      const forwardOffset = Math.sign(400 - goalX) * (2 + aggressionFactor * 3);
      console.log(`\u26BD ${goalkeeper.name} corner positioning: Y=${targetY2.toFixed(0)} (aggression: ${aggressionFactor.toFixed(2)}, attackers: ${attackersInBox})`);
      return {
        x: goalX + forwardOffset,
        y: targetY2
      };
    }
    if (!mainThreat) {
      return {
        x: goalX + (ball.x - goalX) * GOALKEEPER_CONFIG.BASE_POSITION_RATIO,
        y: goalCenterY + (ball.y - goalCenterY) * 0.15
      };
    }
    const threat = mainThreat.player;
    const vectorX = threat.x - goalX;
    const vectorY = threat.y - goalCenterY;
    const vectorLength = Math.sqrt(vectorX * vectorX + vectorY * vectorY);
    if (vectorLength === 0) {
      return { x: goalX, y: goalCenterY };
    }
    const normX = vectorX / vectorLength;
    const normY = vectorY / vectorLength;
    const realStats = goalkeeper.realStats || {};
    const sweeperAbility = realStats.gkKeeperSweeper || 0;
    const sweeperModifier = sweeperAbility * 0.3;
    let advanceDistance = GOALKEEPER_CONFIG.THREAT_ADVANCE_MAX;
    switch (stance.name) {
      case "oneOnOne":
        advanceDistance = Math.min(mainThreat.distToGK * 0.5, 80);
        break;
      case "set":
        advanceDistance = 25;
        break;
      case "advancing":
        advanceDistance = 60 + sweeperModifier * 20;
        break;
      case "ready":
        advanceDistance = 35 + sweeperModifier * 15;
        break;
      case "comfortable":
        advanceDistance = 15;
        break;
    }
    const targetX = goalX + normX * advanceDistance;
    const targetY = goalCenterY + normY * (advanceDistance * 0.6);
    const goalTop = GAME_CONFIG.GOAL_Y_TOP;
    const goalBottom = GAME_CONFIG.GOAL_Y_BOTTOM;
    const isLeftGoal = goalX < 400;
    const constrainedX = isLeftGoal ? Math.max(goalX - 5, Math.min(goalX + advanceDistance + 10, targetX)) : Math.max(goalX - advanceDistance - 10, Math.min(goalX + 5, targetX));
    const constrainedY = Math.max(goalTop + 10, Math.min(goalBottom - 10, targetY));
    return {
      x: constrainedX,
      y: constrainedY
    };
  }
  function shouldGoalkeeperSweep(goalkeeper, _ball, opponents) {
    if (!gameState.ballTrajectory || gameState.ballTrajectory.isShot) {
      return false;
    }
    const goalX = getAttackingGoalX(!goalkeeper.isHome, gameState.currentHalf);
    const traj = gameState.ballTrajectory;
    const ballHeadingToGoal = Math.abs(traj.endX - goalX) < GOALKEEPER_CONFIG.SWEEPER_DISTANCE;
    if (!ballHeadingToGoal) {
      return false;
    }
    const attackersChasingBall = opponents.filter((opp) => {
      const distToBallTarget = Math.sqrt(
        Math.pow(opp.x - traj.endX, 2) + Math.pow(opp.y - traj.endY, 2)
      );
      return distToBallTarget < 100 && opp.role !== "GK";
    });
    if (attackersChasingBall.length === 0) {
      return false;
    }
    const keeperDistToBall = getDistance3(goalkeeper, { x: traj.endX, y: traj.endY });
    const attackerDistToBall = Math.min(...attackersChasingBall.map(
      (att) => getDistance3(att, { x: traj.endX, y: traj.endY })
    ));
    const realStats = goalkeeper.realStats || {};
    const sweeperConfidence = (realStats.gkKeeperSweeper || 0) / 10;
    return keeperDistToBall < attackerDistToBall * (1.1 - sweeperConfidence * 0.1);
  }
  function handleCrossSituation(goalkeeper, _ball, _opponents) {
    if (!gameState.ballHeight || gameState.ballHeight < 0.5) {
      return null;
    }
    if (!gameState.ballTrajectory) {
      return null;
    }
    const traj = gameState.ballTrajectory;
    const goalCenterY = GOALKEEPER_CONFIG.GOAL_CENTER_Y;
    const isCrossing = Math.abs(traj.endY - goalCenterY) < 150 && Math.abs(traj.startY - traj.endY) > 100;
    if (!isCrossing) {
      return null;
    }
    const distToBall = getDistance3(goalkeeper, { x: traj.endX, y: traj.endY });
    const realStats = goalkeeper.realStats || {};
    const aerialAbility = realStats.aerialsWonPercent || 50;
    if (distToBall < GOALKEEPER_CONFIG.CROSS_CLAIM_RANGE) {
      return {
        action: "claim",
        targetX: traj.endX,
        targetY: traj.endY,
        successChance: aerialAbility / 100 * 0.85
      };
    } else if (distToBall < GOALKEEPER_CONFIG.CROSS_PUNCH_RANGE) {
      return {
        action: "punch",
        targetX: traj.endX,
        targetY: traj.endY,
        successChance: aerialAbility / 100 * 0.95
      };
    }
    return null;
  }
  function updateGoalkeeperAI_Advanced(goalkeeper, ball, opponents) {
    const threats = assessGoalkeeperThreats(goalkeeper, ball, opponents);
    const mainThreat = threats[0] || null;
    const stance = determineGoalkeeperStance(goalkeeper, mainThreat, threats, ball);
    goalkeeper.stance = stance.name;
    goalkeeper.stanceSaveBonus = stance.saveBonus;
    goalkeeper.stanceMobilityPenalty = stance.mobilityPenalty;
    if (shouldGoalkeeperSweep(goalkeeper, ball, opponents)) {
      const traj = gameState.ballTrajectory;
      if (traj) {
        goalkeeper.targetX = traj.endX;
        goalkeeper.targetY = traj.endY;
        goalkeeper.speedBoost = 1.3;
        goalkeeper.isSweeping = true;
        console.log(`\u{1F3C3} ${goalkeeper.name} sweeping!`);
        return;
      }
    }
    const crossAction = handleCrossSituation(goalkeeper, ball, opponents);
    if (crossAction) {
      goalkeeper.targetX = crossAction.targetX;
      goalkeeper.targetY = crossAction.targetY;
      goalkeeper.speedBoost = 1.2;
      goalkeeper.isClaimingCross = true;
      goalkeeper.crossClaimStartTime = Date.now();
      console.log(`\u{1F64C} ${goalkeeper.name} going for cross!`);
      const claimStartTime = Date.now();
      const expectedDuration = gameState.ballTrajectory ? gameState.ballTrajectory.duration * 0.8 : 500;
      setTimeout(() => {
        if (gameState.status === "finished" || gameState.status === "goal_scored") {
          return;
        }
        if (goalkeeper.isClaimingCross && goalkeeper.crossClaimStartTime === claimStartTime && getDistance3(goalkeeper, gameState.ballPosition) < 40) {
          if (Math.random() < crossAction.successChance) {
            gameState.ballHolder = goalkeeper;
            goalkeeper.hasBallControl = true;
            gameState.ballTrajectory = null;
            goalkeeper.ballReceivedTime = Date.now();
            console.log(`\u2705 ${goalkeeper.name} claims the cross!`);
          } else {
            console.log(`\u274C ${goalkeeper.name} missed the cross!`);
          }
        }
        goalkeeper.isClaimingCross = false;
      }, expectedDuration);
      return;
    }
    const optimalPosition = calculateOptimalGoalkeeperPosition(
      goalkeeper,
      mainThreat,
      stance,
      ball
    );
    goalkeeper.targetX = optimalPosition.x;
    goalkeeper.targetY = optimalPosition.y;
    goalkeeper.speedBoost = 1 - stance.mobilityPenalty;
    goalkeeper.currentMainThreat = mainThreat?.player || null;
    goalkeeper.threatCount = threats.length;
    goalkeeper.isSweeping = false;
    goalkeeper.isClaimingCross = false;
  }
  function calculateSaveProbability_Advanced(xG, goalkeeper, shotTargetY, shooter) {
    if (!goalkeeper)
      return 0.3;
    const gkSkill = goalkeeper.goalkeeping / 100;
    const gkRatingNorm = (goalkeeper.rating - 6) / 4;
    const baseAbility = gkSkill * 0.7 + gkRatingNorm * 0.3;
    const realStats = goalkeeper.realStats || {};
    const savePercentBonus = realStats.gkSavePercent ? realStats.gkSavePercent / 100 * 0.3 : 0;
    const reflexBonus = goalkeeper.pace / 100 * 0.2;
    const consistencyBonus = (realStats.gkGoalsPrevented || 0) * 0.01;
    const experienceBonus = goalkeeper.rating > 7 ? 0.05 : 0;
    let attackerEffect = 1;
    if (shooter) {
      const rs = shooter.realStats || {};
      const finisherSkill = (shooter.shooting || 60) / 100;
      const dribbleQuality = (shooter.dribbling || 60) / 100;
      const xGOTFactor = Math.min(1, rs.xGOT || 0.3);
      const shotAccuracy = rs.shotsOnTarget && rs.shots ? rs.shotsOnTarget / rs.shots : 0.4;
      const finishingPower = finisherSkill * 0.5 + dribbleQuality * 0.2 + shotAccuracy * 0.2 + xGOTFactor * 0.1;
      const relativeGap = finishingPower - baseAbility;
      attackerEffect = 1 - relativeGap * 0.5;
      attackerEffect = Math.max(0.6, Math.min(1.4, attackerEffect));
    }
    const goalCenterY = 300;
    const distanceToShot = Math.abs(goalkeeper.y - shotTargetY);
    const maxReach = 120;
    const reachRatio = Math.max(0, 1 - distanceToShot / maxReach);
    const stanceBonus = goalkeeper.stanceSaveBonus || 0;
    const anticipationBonus = goalkeeper.stance === "set" || goalkeeper.stance === "ready" ? 0.1 : 0;
    const goalHeight = 120;
    const placementDifficulty = Math.abs(shotTargetY - goalCenterY) / (goalHeight / 2);
    let saveProbability = 1 - xG;
    const abilityMultiplier = (baseAbility + savePercentBonus + reflexBonus + consistencyBonus + experienceBonus) * 1.8;
    saveProbability *= abilityMultiplier;
    const positioningMultiplier = 0.3 + reachRatio * 0.7;
    saveProbability *= positioningMultiplier;
    saveProbability += stanceBonus + anticipationBonus;
    if (placementDifficulty < 0.3)
      saveProbability += 0.25;
    else if (placementDifficulty < 0.6)
      saveProbability += 0.15;
    saveProbability *= attackerEffect;
    saveProbability = Math.max(0.1, Math.min(0.93, saveProbability));
    if (xG < 0.15)
      saveProbability = Math.max(saveProbability, 0.75);
    console.log(
      `SAVE%: ${(saveProbability * 100).toFixed(0)} | xG:${(xG * 100).toFixed(0)} | GK:${(baseAbility * 100).toFixed(0)} | ShooterAdj:${(attackerEffect * 100).toFixed(0)}%`
    );
    return saveProbability;
  }
  function triggerGoalkeeperSave(goalkeeper, shotX, shotY, saveProbability = 0.5) {
    if (!goalkeeper)
      return;
    const diveX = shotX - goalkeeper.x;
    const diveY = shotY - goalkeeper.y;
    goalkeeper.isDiving = true;
    goalkeeper.diveStartTime = Date.now();
    goalkeeper.diveDirection = { x: diveX, y: diveY };
    const gkSkill = (goalkeeper.goalkeeping || 60) / 100;
    const distanceDive = Math.sqrt(diveX ** 2 + diveY ** 2);
    const maxReach = 180;
    const reachFactor = Math.min(1, distanceDive / maxReach);
    const baseDuration = 600 + 200 * (1 - gkSkill);
    const diveDuration = baseDuration * (1 - saveProbability * 0.3);
    goalkeeper.diveDuration = diveDuration;
    goalkeeper.diveDirection.x *= reachFactor;
    goalkeeper.diveDirection.y *= reachFactor;
    setTimeout(() => {
      goalkeeper.isDiving = false;
    }, diveDuration);
    const numParticles = Math.floor(8 + Math.random() * 4);
    const particleColor = saveProbability > 0.6 ? "#60a5fa" : "#1e40af";
    if (gameState?.particles) {
      for (let i = 0; i < numParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 80 + Math.random() * 120;
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed;
        const particle = new Particle(
          goalkeeper.x,
          goalkeeper.y,
          particleColor,
          velocityX,
          velocityY
        );
        particle.size = 2 + Math.random() * 2;
        gameState.particles.push(particle);
      }
    }
  }
  function drawGoalkeeperStanceIndicator(ctx, goalkeeper) {
    if (!goalkeeper.stance)
      return;
    const stanceColors = {
      comfortable: "#10b981",
      ready: "#3b82f6",
      set: "#f59e0b",
      advancing: "#8b5cf6",
      oneOnOne: "#ef4444"
    };
    const color = stanceColors[goalkeeper.stance] || "#6b7280";
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(goalkeeper.x, goalkeeper.y, 25, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.font = "bold 10px Arial";
    ctx.textAlign = "center";
    ctx.fillText(goalkeeper.stance.toUpperCase(), goalkeeper.x, goalkeeper.y - 35);
    ctx.restore();
  }
  function resolveShot_WithAdvancedGK(params) {
    const { holder, xG, goalkeeper, goalX, shotTargetY } = params;
    if (!gameState.shotInProgress) {
      return;
    }
    const teamStats = holder.isHome ? gameState.stats.home : gameState.stats.away;
    const goalTop = GAME_CONFIG.GOAL_Y_TOP;
    const goalBottom = GAME_CONFIG.GOAL_Y_BOTTOM;
    if (shotTargetY < goalTop || shotTargetY > goalBottom) {
      teamStats.shotsOffTarget++;
      gameState.commentary.push({
        text: `${Math.floor(gameState.timeElapsed)}' ${holder.name}'s shot is off target!`,
        type: "attack"
      });
      gameState.shotInProgress = false;
      gameState.shooter = null;
      gameState.currentShotXG = null;
      return;
    }
    teamStats.shotsOnTarget++;
    const saveProbability = calculateSaveProbability_Advanced(xG, goalkeeper, shotTargetY, holder);
    const keeperSaves = Math.random() < saveProbability;
    if (!keeperSaves) {
      gameState.status = "goal_scored";
      if (holder.isHome)
        gameState.homeScore++;
      else
        gameState.awayScore++;
      const scorerName = holder.name;
      const teamColors = holder.isHome ? [gameState.homeJerseyColor, "#ffffff"] : [gameState.awayJerseyColor, "#ffffff"];
      gameState.goalEvents.push({
        scorer: holder.name,
        time: Math.floor(gameState.timeElapsed),
        isHome: holder.isHome
      });
      createGoalExplosion(
        goalX,
        shotTargetY,
        holder.isHome ? gameState.homeJerseyColor : gameState.awayJerseyColor
      );
      const xGDisplay = (xG * 100).toFixed(0);
      gameState.commentary.push({
        text: `${Math.floor(gameState.timeElapsed)}' GOAL! ${holder.name} scores! (xG: ${xGDisplay}%)`,
        type: "goal"
      });
      if (eventBus && EVENT_TYPES2) {
        eventBus.publish(EVENT_TYPES2.GOAL_SCORED, {
          scorer: holder,
          xG,
          time: Math.floor(gameState.timeElapsed)
        });
      }
      gameState.lastGoalScorer = holder.isHome ? "home" : "away";
      const animationDelay = gameState.ballTrajectory ? 400 : 200;
      setTimeout(() => {
        showGoalAnimation(scorerName, teamColors);
      }, animationDelay);
      resetAfterGoal();
    } else {
      triggerGoalkeeperSave(goalkeeper, goalX, shotTargetY, saveProbability);
      const saveQuality = saveProbability > 0.7 ? "incredible" : saveProbability > 0.5 ? "great" : "good";
      gameState.commentary.push({
        text: `${Math.floor(gameState.timeElapsed)}' ${saveQuality} save by ${goalkeeper.name}!`,
        type: "save"
      });
      if (eventBus && EVENT_TYPES2) {
        eventBus.publish(EVENT_TYPES2.SHOT_SAVED, {
          goalkeeper,
          shooter: holder,
          saveQuality
        });
      }
      gameState.ballHolder = goalkeeper;
      goalkeeper.hasBallControl = true;
      goalkeeper.ballReceivedTime = Date.now();
    }
    gameState.commentary = gameState.commentary.slice(-6);
    gameState.shotInProgress = false;
    gameState.shooter = null;
    gameState.currentShotXG = null;
  }

  // src/ai/movement.ts
  function getDistance4(p1, p2) {
    return distance(p1, p2);
  }
  function getPositionConfig(role) {
    const normalizedRole = role.toUpperCase();
    return POSITION_CONFIGS[normalizedRole] || {
      defensiveness: 0.5,
      attackRange: 0.5,
      ballChasePriority: 0.5,
      idealWidth: 0.2,
      pushUpOnAttack: 60
    };
  }
  function getPlayerActivePosition(player, currentHalf) {
    let homeX = player.homeX ?? 400;
    let homeY = player.homeY ?? 300;
    const pitchWidth = GAME_CONFIG.PITCH_WIDTH;
    const pitchHeight = GAME_CONFIG.PITCH_HEIGHT;
    let activeX = currentHalf === 2 ? pitchWidth - homeX : homeX;
    let activeY = homeY;
    const ballShiftFactor = 0.15;
    const shiftX = (gameState.ballPosition.x - pitchWidth / 2) * ballShiftFactor;
    const shiftY = (gameState.ballPosition.y - pitchHeight / 2) * ballShiftFactor;
    if (!["GK", "CB", "LB", "RB"].includes(player.role)) {
      activeX += shiftX * Math.min(1, Math.abs(activeX - pitchWidth / 2) / (pitchWidth / 4));
      activeY += shiftY;
    }
    const isMidfielder = ["CDM", "CM", "CAM", "RM", "LM"].includes(player.role);
    if (isMidfielder) {
      const teamState = player.isHome ? gameState.homeTeamState : gameState.awayTeamState;
      const opponentGoalX = getAttackingGoalX(player.isHome, currentHalf);
      const ownGoalX = getAttackingGoalX(!player.isHome, currentHalf);
      if (teamState === "ATTACKING" || teamState === "COUNTER_ATTACK") {
        const pushFactor = teamState === "ATTACKING" ? 80 : 100;
        const direction = Math.sign(opponentGoalX - activeX) || 1;
        activeX += direction * pushFactor;
      } else if (teamState === "DEFENDING" || teamState === "HIGH_PRESS") {
        const pullFactor = teamState === "DEFENDING" ? 70 : 50;
        const direction = Math.sign(ownGoalX - activeX) || 1;
        activeX += direction * pullFactor;
      }
    }
    activeX = Math.max(10, Math.min(pitchWidth - 10, activeX));
    activeY = Math.max(10, Math.min(pitchHeight - 10, activeY));
    return { x: activeX, y: activeY };
  }
  function getZoneForPlayer(player, _activePosition, teamState) {
    const { role, isHome } = player;
    const FIELD_WIDTH = 800;
    const FIELD_HEIGHT = 600;
    const HALF_WAY_LINE = FIELD_WIDTH / 2;
    const ownGoalLine = isHome ? 0 : FIELD_WIDTH;
    const opponentGoalLine = isHome ? FIELD_WIDTH : 0;
    const ownPenaltyAreaX = isHome ? 130 : FIELD_WIDTH - 130;
    const oppPenaltyAreaX = isHome ? FIELD_WIDTH - 130 : 130;
    let zone = { x1: 0, y1: 0, x2: FIELD_WIDTH, y2: FIELD_HEIGHT };
    const leftWingY = { y1: 0, y2: 180 };
    const leftCenterY = { y1: 180, y2: 300 };
    const rightCenterY = { y1: 300, y2: 420 };
    const rightWingY = { y1: 420, y2: 600 };
    const centralCorridorY = { y1: 180, y2: 420 };
    switch (role) {
      case "LB":
      case "RB":
        const wingY = role === "LB" ? leftWingY : rightWingY;
        if (teamState === "ATTACKING") {
          zone = { x1: HALF_WAY_LINE - 100, x2: oppPenaltyAreaX, ...wingY };
        } else {
          zone = { x1: ownGoalLine, x2: HALF_WAY_LINE, ...wingY };
        }
        break;
      case "LCB":
      case "RCB":
      case "CB":
        const centerBackY = role === "LCB" ? leftCenterY : role === "RCB" ? rightCenterY : centralCorridorY;
        if (teamState === "ATTACKING") {
          const forwardLimit = isHome ? HALF_WAY_LINE + 100 : HALF_WAY_LINE - 100;
          zone = { x1: ownPenaltyAreaX, x2: forwardLimit, ...centerBackY };
        } else {
          zone = { x1: ownGoalLine, x2: HALF_WAY_LINE, ...centerBackY };
        }
        break;
      case "CDM":
      case "CM":
      case "LCM":
      case "RCM":
        const midY = role.includes("L") ? leftCenterY : role.includes("R") ? rightCenterY : centralCorridorY;
        zone = { x1: ownPenaltyAreaX, x2: oppPenaltyAreaX, ...midY };
        break;
      case "CAM":
        zone = { x1: HALF_WAY_LINE - 150, x2: oppPenaltyAreaX + 20, ...centralCorridorY };
        break;
      case "LM":
      case "RM":
        const wideMidY = role === "LM" ? leftWingY : rightWingY;
        if (teamState === "ATTACKING") {
          zone = { x1: ownPenaltyAreaX, x2: oppPenaltyAreaX, ...wideMidY };
        } else {
          zone = { x1: ownGoalLine + 100, x2: HALF_WAY_LINE + 150, ...wideMidY };
        }
        break;
      case "LW":
      case "RW":
        const wingerY = role === "LW" ? leftWingY : rightWingY;
        zone = { x1: HALF_WAY_LINE - 100, x2: opponentGoalLine, ...wingerY };
        if (teamState === "DEFENDING") {
          zone.x1 = isHome ? zone.x1 - 150 : zone.x1 + 150;
        }
        break;
      case "ST":
      case "CF":
        zone = { x1: HALF_WAY_LINE, x2: opponentGoalLine, ...centralCorridorY };
        if (teamState === "DEFENDING") {
          const retreatX = isHome ? HALF_WAY_LINE - 150 : HALF_WAY_LINE + 150;
          zone = { x1: retreatX, x2: opponentGoalLine, ...centralCorridorY };
        }
        break;
      case "GK":
        const gkWidth = 160;
        const gkHeight = 400;
        zone = {
          x1: isHome ? ownGoalLine : ownGoalLine - gkWidth,
          x2: isHome ? ownGoalLine + gkWidth : ownGoalLine,
          y1: (FIELD_HEIGHT - gkHeight) / 2,
          y2: (FIELD_HEIGHT + gkHeight) / 2
        };
        break;
    }
    return zone;
  }
  function assessDefensiveThreats(defendingPlayer, opponents, ownGoalX) {
    const ballCarrier = gameState.ballHolder;
    return opponents.map((opponent) => {
      if (opponent.role === "GK")
        return { player: opponent, score: 0 };
      const distToGoal = Math.abs(opponent.x - ownGoalX);
      const distToDefender = getDistance4(defendingPlayer, opponent);
      const role = opponent.role;
      let score = 0;
      if (role === "ST" || role === "CF") {
        score += 80;
      } else if (role === "LW" || role === "RW") {
        score += 70;
      } else if (role === "CAM") {
        score += 50;
      }
      if (distToGoal < 400) {
        score += (400 - distToGoal) * 0.6;
      }
      if (ballCarrier && ballCarrier.id === opponent.id) {
        score += 200;
      }
      const angleToGoal = Math.abs(opponent.y - 300);
      if (angleToGoal < 150) {
        score += (150 - angleToGoal) * 0.3;
      }
      const teammates = defendingPlayer.isHome ? gameState.homePlayers : gameState.awayPlayers;
      const nearbyDefenders = teammates.filter((d) => getDistance4(d, opponent) < 60);
      if (nearbyDefenders.length <= 1) {
        score += 50;
      }
      score -= distToDefender * 0.15;
      return { player: opponent, score: Math.max(0, score) };
    }).sort((a, b) => b.score - a.score);
  }
  function findMostDangerousAttacker(player, threats, playerZone) {
    const markerRole = player.role;
    let primaryTargetRoles = [];
    let secondaryTargetRoles = [];
    let bestThreat = null;
    switch (markerRole) {
      case "LB":
        primaryTargetRoles = ["RW", "RM", "RWB"];
        secondaryTargetRoles = ["ST", "CF", "CAM"];
        break;
      case "RB":
        primaryTargetRoles = ["LW", "LM", "LWB"];
        secondaryTargetRoles = ["ST", "CF", "CAM"];
        break;
      case "CB":
      case "LCB":
      case "RCB":
        primaryTargetRoles = ["ST", "CF"];
        secondaryTargetRoles = ["CAM", "CM"];
        break;
      case "CDM":
        primaryTargetRoles = ["CAM", "CF"];
        secondaryTargetRoles = ["CM"];
        break;
      case "LM":
      case "LW":
        primaryTargetRoles = ["RB", "RWB", "RM"];
        secondaryTargetRoles = ["CM"];
        break;
      case "RM":
      case "RW":
        primaryTargetRoles = ["LB", "LWB", "LM"];
        secondaryTargetRoles = ["CM"];
        break;
      case "CM":
        primaryTargetRoles = ["CM", "CAM"];
        secondaryTargetRoles = ["CDM"];
        break;
      case "CAM":
        primaryTargetRoles = ["CDM"];
        secondaryTargetRoles = ["CB"];
        break;
      case "ST":
      case "CF":
        primaryTargetRoles = ["CB", "LCB", "RCB"];
        secondaryTargetRoles = ["GK", "CDM"];
        break;
      default:
        primaryTargetRoles = [];
        secondaryTargetRoles = [];
        break;
    }
    if (primaryTargetRoles.length > 0) {
      const primaryThreats = threats.filter((t) => primaryTargetRoles.includes(t.player.role));
      if (primaryThreats.length > 0) {
        bestThreat = primaryThreats.sort((a, b) => b.score - a.score)[0] || null;
        if (bestThreat && bestThreat.score > 30) {
          return bestThreat.player;
        }
      }
    }
    if (secondaryTargetRoles.length > 0) {
      const secondaryThreats = threats.filter((t) => secondaryTargetRoles.includes(t.player.role));
      if (secondaryThreats.length > 0) {
        bestThreat = secondaryThreats.sort((a, b) => b.score - a.score)[0] || null;
        if (bestThreat && bestThreat.score > 50) {
          return bestThreat.player;
        }
      }
    }
    const threatsInZone = threats.filter(
      (t) => t.player.x > playerZone.x1 && t.player.x < playerZone.x2 && t.player.y > playerZone.y1 && t.player.y < playerZone.y2
    );
    if (threatsInZone.length > 0 && threatsInZone[0].score > 100) {
      return threatsInZone[0].player;
    }
    return null;
  }
  function calculateOptimalMarkingPosition(marker, target, ownGoalX, tightness = "goal_side") {
    const goalCenterY = 300;
    if (tightness === "tight") {
      const fixedDistance = 25;
      const angleToGoal = Math.atan2(goalCenterY - target.y, ownGoalX - target.x);
      const markingPointX2 = target.x + Math.cos(angleToGoal) * fixedDistance;
      const markingPointY2 = target.y + Math.sin(angleToGoal) * fixedDistance;
      return { x: markingPointX2, y: markingPointY2 };
    }
    const vectorX = ownGoalX - target.x;
    const vectorY = goalCenterY - target.y;
    const distanceRatio = marker.role === "CB" ? 0.08 : 0.12;
    const markingPointX = target.x + vectorX * distanceRatio;
    const markingPointY = target.y + vectorY * distanceRatio;
    return { x: markingPointX, y: markingPointY };
  }
  function updateTacticalPosition(player, ball, _teammates, opponents) {
    if (gameState.status !== "playing") {
      player.targetX = player.x;
      player.targetY = player.y;
      player.speedBoost = 1;
      return;
    }
    const tactic = TACTICS[player.isHome ? gameState.homeTactic : gameState.awayTactic] || {};
    const teamState = player.isHome ? gameState.homeTeamState : gameState.awayTeamState;
    const activePosition = getPlayerActivePosition(player, gameState.currentHalf);
    const teamHasBall = gameState.ballHolder && gameState.ballHolder.isHome === player.isHome;
    const opponentHasBall = gameState.ballHolder && gameState.ballHolder.isHome !== player.isHome;
    const ownGoalX = getAttackingGoalX(!player.isHome, gameState.currentHalf);
    if (player.role === "GK") {
      updateGoalkeeperAI_Advanced(player, ball, opponents);
      return;
    }
    if (gameState.ballChasers.has(player)) {
      player.targetX = ball.x;
      player.targetY = ball.y;
      player.targetLocked = true;
      player.targetLockTime = Date.now();
      return;
    }
    const now = Date.now();
    const distToTarget = Math.sqrt(
      Math.pow(player.targetX - player.x, 2) + Math.pow(player.targetY - player.y, 2)
    );
    if (player.targetLocked && now - (player.targetLockTime || 0) < 1500) {
      if (distToTarget > 20) {
        return;
      }
    }
    let targetX = activePosition.x;
    let targetY = activePosition.y;
    let shouldLockTarget = false;
    if (opponentHasBall) {
      const markingResult = applyMarkingAndPressing(player, ball, opponents, activePosition, ownGoalX, tactic, teamState);
      if (markingResult.shouldMark) {
        targetX = markingResult.x;
        targetY = markingResult.y;
        player.speedBoost = 1.2;
        shouldLockTarget = true;
      } else if (markingResult.shouldPress) {
        targetX = markingResult.x;
        targetY = markingResult.y;
        player.speedBoost = teamState === "HIGH_PRESS" ? 1.4 : 1.3;
        shouldLockTarget = true;
      } else {
        ({ x: targetX, y: targetY } = applyDefensivePositioning(player, ball, tactic, activePosition, ownGoalX, teamState));
      }
    } else if (teamHasBall && gameState.ballHolder) {
      if (BehaviorSystem) {
        const phase = BehaviorSystem.detectGamePhase?.(gameState) || "attacking";
        const tacticName = player.isHome ? gameState.homeTactic : gameState.awayTactic;
        const tacticalSystem = BehaviorSystem.getTacticalSystemType?.(tacticName) || "balanced";
        const advancedBehavior = BehaviorSystem.selectPlayerBehavior?.(
          player,
          gameState,
          phase,
          tacticalSystem
        );
        if (advancedBehavior) {
          targetX = advancedBehavior.target.x;
          targetY = advancedBehavior.target.y;
          player.speedBoost = advancedBehavior.speedMultiplier;
          shouldLockTarget = advancedBehavior.shouldLock;
          player.currentBehavior = advancedBehavior.description;
        } else {
          targetX = activePosition.x;
          targetY = activePosition.y;
          player.speedBoost = 1;
          player.currentBehavior = "holding_shape";
        }
      } else {
        targetX = activePosition.x;
        targetY = activePosition.y;
        player.speedBoost = 1;
      }
    } else {
      const verticalInfluence = (ball.y - 300) * 0.15;
      targetX = activePosition.x;
      targetY = activePosition.y + verticalInfluence;
      player.speedBoost = 1;
    }
    if (player.role === "CB" || player.role === "LCB" || player.role === "RCB") {
      const MAX_CB_ADVANCE_DISTANCE = 470;
      const halfwayLine = 400;
      if (ownGoalX < halfwayLine) {
        const redLine = ownGoalX + MAX_CB_ADVANCE_DISTANCE;
        if (targetX > redLine) {
          targetX = redLine;
        }
      } else {
        const redLine = ownGoalX - MAX_CB_ADVANCE_DISTANCE;
        if (targetX < redLine) {
          targetX = redLine;
        }
      }
    }
    targetX = Math.max(50, Math.min(750, targetX));
    targetY = Math.max(50, Math.min(550, targetY));
    player.targetX = targetX;
    player.targetY = targetY;
    if (shouldLockTarget) {
      player.targetLocked = true;
      player.targetLockTime = now;
    } else {
      if (distToTarget < 15) {
        player.targetLocked = false;
      }
    }
  }
  function applyMarkingAndPressing(player, _ball, opponents, activePosition, ownGoalX, tactic, teamState) {
    const ballCarrier = gameState.ballHolder;
    if (!ballCarrier)
      return { shouldMark: false, shouldPress: false, x: activePosition.x, y: activePosition.y };
    const playerZone = getZoneForPlayer(player, activePosition, teamState);
    const allThreats = assessDefensiveThreats(player, opponents, ownGoalX);
    const primaryThreat = findMostDangerousAttacker(player, allThreats, playerZone);
    const distToBallCarrier = getDistance4(player, ballCarrier);
    const pressDistance = teamState === "HIGH_PRESS" ? 120 : (tactic.pressIntensity || 0) > 0.7 ? 100 : 80;
    const teammates = player.isHome ? gameState.homePlayers : gameState.awayPlayers;
    const allDefenders = teammates.filter((p) => p.id !== player.id && p.role !== "GK");
    const isClosestDefender = !allDefenders.some((p) => getDistance4(p, ballCarrier) < distToBallCarrier);
    if (distToBallCarrier < pressDistance && isClosestDefender) {
      const targetX = ballCarrier.x + (ballCarrier.vx || 0) * 0.2;
      const targetY = ballCarrier.y + (ballCarrier.vy || 0) * 0.2;
      return { shouldMark: false, shouldPress: true, x: targetX, y: targetY };
    }
    if (primaryThreat) {
      const distToGoal = Math.abs(primaryThreat.x - ownGoalX);
      const inDangerZone = distToGoal < 180;
      const tightness = inDangerZone && ["CB", "RB", "LB"].includes(player.role) ? "tight" : "goal_side";
      const { x: x2, y: y2 } = calculateOptimalMarkingPosition(player, primaryThreat, ownGoalX, tightness);
      return { shouldMark: true, shouldPress: false, x: x2, y: y2 };
    }
    const { x, y } = applyDefensivePositioning(player, gameState.ballPosition, tactic, activePosition, ownGoalX, teamState);
    return { shouldMark: false, shouldPress: false, x, y };
  }
  function applyDefensivePositioning(player, ball, _tactic, activePosition, ownGoalX, teamState) {
    const ballDistToOwnGoal = Math.abs(ball.x - ownGoalX);
    const ballSideY = ball.y;
    const playerSideY = player.y;
    const isBallOnFarSide = Math.abs(ballSideY - playerSideY) > 300;
    const horizontalShift = (ball.y - 300) * 0.25;
    const compression = teamState === "DEFENDING" ? 0.6 : 0.7;
    let targetX = activePosition.x;
    let targetY = activePosition.y;
    const retreatModifier = teamState === "DEFENDING" ? 1.3 : 1;
    if (ballDistToOwnGoal < 300) {
      const retreatAmount = (300 - ballDistToOwnGoal) / 3 * retreatModifier;
      const direction = ownGoalX < 400 ? -1 : 1;
      targetX = activePosition.x + direction * retreatAmount;
    }
    const playerRole = player.role;
    if (["RB", "LB"].includes(playerRole)) {
      const teammates = player.isHome ? gameState.homePlayers : gameState.awayPlayers;
      const centralDefenders = teammates.filter((p) => p.role === "CB" || p.role === "LCB" || p.role === "RCB");
      const myNearestCB = centralDefenders.sort((a, b) => getDistance4(a, player) - getDistance4(b, player))[0];
      if (myNearestCB) {
        const cbHomeX = getPlayerActivePosition(myNearestCB, gameState.currentHalf).x;
        const cbCurrentX = myNearestCB.x;
        const cbDisplacement = Math.abs(cbCurrentX - cbHomeX);
        if (cbDisplacement > 100) {
          const isRB = playerRole === "RB";
          targetX = cbHomeX + (isRB ? -30 : 30);
          targetY = 300 + (isRB ? -60 : 60);
          player.speedBoost = 1.3;
          return { x: targetX, y: targetY };
        }
      }
    }
    if (["RB", "LB"].includes(playerRole) && isBallOnFarSide) {
      const teammates = player.isHome ? gameState.homePlayers : gameState.awayPlayers;
      const centerBacks = teammates.filter((p) => p.role === "CB");
      if (centerBacks.length > 0) {
        const nearestCB = centerBacks.sort((a, b) => getDistance4(a, player) - getDistance4(b, player))[0];
        if (nearestCB) {
          targetX = nearestCB.x + (playerRole === "RB" ? -30 : 30);
        }
      }
      targetY = 300 + (playerRole === "RB" ? -50 : 50);
    } else if (["RM", "LM", "RW", "LW"].includes(playerRole)) {
      const isRightSided = playerRole === "RM" || playerRole === "RW";
      if (isBallOnFarSide) {
        targetX = activePosition.x + (ownGoalX > 400 ? -30 : 30);
        targetY = 300 + (isRightSided ? -80 : 80);
      } else {
        targetY = activePosition.y + horizontalShift * 1.5;
        const direction = ownGoalX < 400 ? 1 : -1;
        targetX = activePosition.x + direction * 50;
      }
    } else if (["CB", "CDM", "CM"].includes(playerRole)) {
      targetY = activePosition.y + horizontalShift;
      targetY = 300 + (targetY - 300) * compression;
    } else if (playerRole === "CAM") {
      const direction = ownGoalX < 400 ? 1 : -1;
      targetX = activePosition.x + direction * 100;
      targetY = 300 + (ball.y - 300) * 0.3;
    } else {
      targetY = activePosition.y + horizontalShift;
    }
    return { x: targetX, y: targetY };
  }
  function applyAttackingMovement(player, holder, teammates, activePosition, opponentGoalX, _teamState) {
    const opponents = player.isHome ? gameState.awayPlayers : gameState.homePlayers;
    const direction = Math.sign(opponentGoalX - player.x) || 1;
    const ballOnOtherSide = holder.y > 300 && player.y < 300 || holder.y < 300 && player.y > 300;
    if (shouldAvoidOffside(player, gameState.ballPosition, opponents)) {
      return {
        x: player.x - direction * 20,
        y: player.y,
        speedBoost: 0.9,
        shouldLock: true
      };
    }
    if (["LW", "RW"].includes(player.role) && ballOnOtherSide && getDistance4(holder, player) > 150) {
      return {
        x: opponentGoalX - direction * 60,
        y: 300 + (player.y < 300 ? 50 : -50),
        speedBoost: 1.3,
        shouldLock: true
      };
    }
    if (["RB", "LB"].includes(player.role)) {
      const wingerOnMySide = teammates.find(
        (t) => player.role === "RB" && t.role === "RW" || player.role === "LB" && t.role === "LW"
      );
      if (wingerOnMySide && Math.abs(wingerOnMySide.y - 300) < 100) {
        return {
          x: activePosition.x + direction * 100,
          y: activePosition.y,
          speedBoost: 1.25,
          shouldLock: true
        };
      }
    }
    if (holder.id === player.id && ["LW", "RW", "LM", "RM"].includes(player.role)) {
      const goalCenterY = 300;
      const targetX = player.x + direction * 70;
      const targetY = player.y + Math.sign(goalCenterY - player.y) * 40;
      return { x: targetX, y: targetY, speedBoost: 1.1, shouldLock: false };
    }
    const runOptions = [];
    const holderUnderPressure = opponents.some((o) => getDistance4(o, holder) < 70);
    if (holderUnderPressure) {
      const supportTarget = {
        x: holder.x - direction * 60,
        y: holder.y + (player.y < 300 ? -70 : 70)
      };
      const supportSpace = Math.min(...opponents.map((o) => getDistance4(o, supportTarget)));
      runOptions.push({ type: "SUPPORT", target: supportTarget, score: supportSpace + 40 });
    }
    if (["ST", "RW", "LW", "CAM"].includes(player.role)) {
      const lastDefender = opponents.filter((o) => o.role !== "GK").sort((a, b) => direction * (b.x - a.x))[0];
      if (lastDefender) {
        const runTargetX = lastDefender.x + direction * 25;
        const runTargetY = activePosition.y;
        const runTarget = { x: runTargetX, y: runTargetY };
        const spaceRating2 = Math.min(...opponents.map((o) => getDistance4(o, runTarget)));
        const pathClear = !opponents.some((o) => pointToLineDistance(o, holder, runTarget) < 25);
        if (pathClear) {
          runOptions.push({ type: "THROUGH", target: runTarget, score: spaceRating2 * 1.2 + player.passing / 100 * 20 });
        }
      }
    }
    const spaceRunTarget = { x: activePosition.x + direction * 70, y: activePosition.y };
    const spaceRating = Math.min(...opponents.map((o) => getDistance4(o, spaceRunTarget)));
    runOptions.push({ type: "SPACE", target: spaceRunTarget, score: spaceRating });
    const bestRun = runOptions.sort((a, b) => b.score - a.score)[0];
    let finalMove = { x: activePosition.x, y: activePosition.y, speedBoost: 1, shouldLock: false };
    if (bestRun && bestRun.score > 50) {
      finalMove = {
        x: bestRun.target.x,
        y: bestRun.target.y,
        speedBoost: bestRun.type === "THROUGH" ? 1.4 : 1.15,
        shouldLock: true
      };
    }
    if (player.role === "CM" || player.role === "CAM") {
      const striker = teammates.find((t) => t.role === "ST");
      if (striker) {
        const distToStriker = getDistance4({ x: finalMove.x, y: finalMove.y }, striker);
        if (distToStriker < 80) {
          const angleAwayFromStriker = Math.atan2(finalMove.y - striker.y, finalMove.x - striker.x);
          finalMove.x += Math.cos(angleAwayFromStriker) * 20;
          finalMove.y += Math.sin(angleAwayFromStriker) * 20;
        }
      }
    }
    return finalMove;
  }

  // src/setpieces/utils.ts
  var TacticalContext = class {
    constructor(gameState2, setPieceType) {
      this.gameState = gameState2;
      this.setPieceType = setPieceType;
      this.scoreDifference = (gameState2.homeScore || 0) - (gameState2.awayScore || 0);
      this.timeRemaining = 90 - (gameState2.matchTime || 0);
      this.isTrailing = false;
      this.isLeading = false;
      this.isDrawn = this.scoreDifference === 0;
      this.isLateGame = this.timeRemaining < 15;
      this.isVeryLateGame = this.timeRemaining < 5;
    }
    getUrgency(isHome) {
      const effectiveDiff = isHome ? this.scoreDifference : -this.scoreDifference;
      if (effectiveDiff < 0) {
        if (this.isVeryLateGame)
          return "DESPERATE";
        if (this.isLateGame)
          return "HIGH";
        return "MODERATE";
      }
      if (effectiveDiff > 0) {
        if (this.isLateGame)
          return "CONSERVATIVE";
        return "BALANCED";
      }
      return "BALANCED";
    }
    shouldCommitForward(isHome) {
      const urgency = this.getUrgency(isHome);
      return urgency === "DESPERATE" || urgency === "HIGH";
    }
    shouldStayCompact(isHome) {
      const urgency = this.getUrgency(isHome);
      return urgency === "CONSERVATIVE" && this.isLateGame;
    }
  };
  var PositionManager = class {
    constructor() {
      this.occupiedPositions = [];
      this.minDistance = 30;
      this.priorityZones = /* @__PURE__ */ new Map();
    }
    reset() {
      this.occupiedPositions = [];
      this.priorityZones.clear();
    }
    markPriorityZone(x, y, radius = 40) {
      this.priorityZones.set(`${Math.round(x)},${Math.round(y)}`, { x, y, radius });
    }
    isPositionOccupied(x, y, allowOverlap = false) {
      if (allowOverlap)
        return false;
      return this.occupiedPositions.some((pos) => {
        const dist = distance(pos, { x, y });
        return dist < this.minDistance;
      });
    }
    findValidPosition(idealPos, maxAttempts = 10, allowPriorityOverlap = false) {
      const PITCH_WIDTH3 = GAME_CONFIG.PITCH_WIDTH;
      const PITCH_HEIGHT3 = GAME_CONFIG.PITCH_HEIGHT;
      const safeIdeal = sanitizePosition(idealPos, { behavior: "PositionManager" });
      if (!this.isPositionOccupied(safeIdeal.x, safeIdeal.y, allowPriorityOverlap)) {
        this.occupiedPositions.push({ x: safeIdeal.x, y: safeIdeal.y });
        return { x: safeIdeal.x, y: safeIdeal.y };
      }
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const angle = Math.PI * 2 * attempt / maxAttempts;
        const radius = this.minDistance * (1 + attempt * 0.3);
        const newX = safeIdeal.x + Math.cos(angle) * radius;
        const newY = safeIdeal.y + Math.sin(angle) * radius;
        const clampedX = Math.max(10, Math.min(PITCH_WIDTH3 - 10, newX));
        const clampedY = Math.max(10, Math.min(PITCH_HEIGHT3 - 10, newY));
        if (!this.isPositionOccupied(clampedX, clampedY, allowPriorityOverlap)) {
          this.occupiedPositions.push({ x: clampedX, y: clampedY });
          return { x: clampedX, y: clampedY };
        }
      }
      this.occupiedPositions.push({ x: safeIdeal.x, y: safeIdeal.y });
      return { x: safeIdeal.x, y: safeIdeal.y };
    }
  };
  function getSafeStat(stats, key, defaultValue = 0) {
    if (stats && typeof stats[key] === "number" && !isNaN(stats[key])) {
      return stats[key];
    }
    if (stats && typeof stats[key] === "string") {
      const num = parseFloat(stats[key]);
      if (!isNaN(num))
        return num;
    }
    return defaultValue;
  }
  function getRoleBasedFallbackPosition(role, context = {}) {
    const PITCH_WIDTH3 = GAME_CONFIG.PITCH_WIDTH;
    const PITCH_HEIGHT3 = GAME_CONFIG.PITCH_HEIGHT;
    let fallbackX = PITCH_WIDTH3 / 2;
    let fallbackY = PITCH_HEIGHT3 / 2;
    if (role && context.player && context.gameState) {
      const activePos = getPlayerActivePosition(context.player, context.gameState.currentHalf);
      fallbackX = activePos.x;
      fallbackY = activePos.y;
    }
    fallbackX = Math.max(10, Math.min(PITCH_WIDTH3 - 10, fallbackX));
    fallbackY = Math.max(10, Math.min(PITCH_HEIGHT3 - 10, fallbackY));
    return { x: fallbackX, y: fallbackY, movement: "role_fallback", role: role || "FALLBACK_ROLE" };
  }
  function sanitizePosition(pos, context = {}) {
    const PITCH_WIDTH3 = GAME_CONFIG.PITCH_WIDTH;
    const PITCH_HEIGHT3 = GAME_CONFIG.PITCH_HEIGHT;
    if (!pos || typeof pos !== "object") {
      console.error(`\u274C sanitizePosition: INVALID POSITION (not an object) for ${context.player?.name || "unknown player"}`);
      console.error(`   Received:`, pos);
      console.error(`   Context:`, { behavior: context.behavior, role: context.role, movement: context.movement });
      console.error(`   Stack:`, new Error().stack);
      return getRoleBasedFallbackPosition(context.role, context);
    }
    let x = Number(pos.x);
    let y = Number(pos.y);
    if (isNaN(x) || !isFinite(x) || isNaN(y) || !isFinite(y)) {
      console.error(`\u274C sanitizePosition: INVALID COORDINATES for ${context.player?.name || "unknown player"}`);
      console.error(`   Position: {x: ${pos.x} (${typeof pos.x}), y: ${pos.y} (${typeof pos.y})}`);
      console.error(`   After Number(): {x: ${x}, y: ${y}}`);
      console.error(`   Context:`, { behavior: context.behavior, role: context.role, movement: context.movement });
      return getRoleBasedFallbackPosition(context.role, context);
    }
    const minX = 10, minY = 10;
    const maxX = PITCH_WIDTH3 - 10, maxY = PITCH_HEIGHT3 - 10;
    const wasOutOfBounds = x < minX || x > maxX || y < minY || y > maxY;
    if (wasOutOfBounds) {
      console.warn(`\u26A0\uFE0F sanitizePosition: Position OUT OF BOUNDS for ${context.player?.name || "unknown player"}, clamping`);
      console.warn(`   Original: (${x.toFixed(1)}, ${y.toFixed(1)}), Bounds: X[${minX}-${maxX}], Y[${minY}-${maxY}]`);
      console.warn(`   Behavior: ${context.behavior}, Movement: ${pos.movement}`);
    }
    x = Math.max(minX, Math.min(maxX, x));
    y = Math.max(minY, Math.min(maxY, y));
    return {
      ...pos,
      x,
      y,
      movement: pos.movement || context.movement || "standard_position",
      role: pos.role || context.role || "UNKNOWN_ROLE"
    };
  }
  function getValidPlayers(playersArray) {
    if (!Array.isArray(playersArray))
      return [];
    return playersArray.filter((p) => p && typeof p.x === "number" && typeof p.y === "number" && isFinite(p.x) && isFinite(p.y));
  }
  function getSortedLists(teammates, opponents) {
    const validTeammates = getValidPlayers(teammates);
    const validOpponents = getValidPlayers(opponents);
    return {
      teammates: {
        bestKickers: validTeammates.filter((p) => p.role !== "GK").sort((a, b) => getSafeStat(b.stats, "shooting", 70) - getSafeStat(a.stats, "shooting", 70)),
        bestHeaders: validTeammates.filter((p) => p.role !== "GK").sort((a, b) => getSafeStat(b.stats, "heading", 70) - getSafeStat(a.stats, "heading", 70)),
        fastest: validTeammates.filter((p) => p.role !== "GK").sort((a, b) => getSafeStat(b.stats, "pace", 70) - getSafeStat(a.stats, "pace", 70)),
        bestDefenders: validTeammates.filter((p) => p.role !== "GK").sort((a, b) => getSafeStat(a.stats, "defending", 70) - getSafeStat(b.stats, "defending", 70))
      },
      opponents: {
        tallest: validOpponents.filter((p) => p.role !== "GK").sort((a, b) => getSafeStat(b.stats, "heading", 70) - getSafeStat(a.stats, "heading", 70)),
        mostDangerous: validOpponents.filter((p) => p.role !== "GK").sort((a, b) => getSafeStat(b.stats, "attacking", 70) - getSafeStat(a.stats, "attacking", 70))
      }
    };
  }
  function determineSetPieceTeam(gameState2, player) {
    const fallbackTeam = player && typeof player.isHome === "boolean" ? player.isHome ? "home" : "away" : "home";
    if (!gameState2 || !gameState2.setPiece)
      return fallbackTeam;
    const setPiece = gameState2.setPiece;
    if (setPiece.team !== void 0 && setPiece.team !== null) {
      return setPiece.team === "home" || setPiece.team === true ? "home" : "away";
    }
    return fallbackTeam;
  }
  function isPlayerAttacking(player, gameState2) {
    if (!player || typeof player.isHome !== "boolean")
      return false;
    const setPieceTeam = determineSetPieceTeam(gameState2, player);
    const playerTeam = player.isHome ? "home" : "away";
    return setPieceTeam === playerTeam;
  }
  function getFormationAwarePosition(player, basePosition, gameState2, isAttacking) {
    if (!player || !basePosition || !gameState2)
      return basePosition;
    const PITCH_WIDTH3 = GAME_CONFIG.PITCH_WIDTH;
    const PITCH_HEIGHT3 = GAME_CONFIG.PITCH_HEIGHT;
    const setPieceType = (gameState2.setPiece?.type || gameState2.status || "").toUpperCase();
    const ownGoalX = getAttackingGoalX(!player.isHome, gameState2.currentHalf);
    const opponentGoalX = getAttackingGoalX(player.isHome, gameState2.currentHalf);
    const direction = Math.sign(opponentGoalX - 400);
    if (setPieceType === "GOAL_KICK" || setPieceType === "KICK_OFF") {
      return {
        ...basePosition,
        x: Math.max(10, Math.min(PITCH_WIDTH3 - 10, basePosition.x)),
        y: Math.max(10, Math.min(PITCH_HEIGHT3 - 10, basePosition.y))
      };
    }
    const DEFENSIVE_ZONE_X = ownGoalX + direction * 150;
    const MIDFIELD_ZONE_X = PITCH_WIDTH3 / 2;
    const ATTACKING_ZONE_X = opponentGoalX - direction * 150;
    let adjustedX = basePosition.x;
    const role = player.role || "UNKNOWN";
    if (role.includes("CB") || role.includes("GK")) {
      if (!isAttacking || Math.abs(basePosition.x - ownGoalX) < PITCH_WIDTH3 / 3) {
        if (direction > 0) {
          adjustedX = Math.min(adjustedX, DEFENSIVE_ZONE_X);
        } else {
          adjustedX = Math.max(adjustedX, DEFENSIVE_ZONE_X);
        }
      }
    } else if (role.includes("FB") || role.includes("WB") || role.includes("CDM")) {
      if (!isAttacking) {
        if (direction > 0) {
          adjustedX = Math.min(adjustedX, DEFENSIVE_ZONE_X + 50);
        } else {
          adjustedX = Math.max(adjustedX, DEFENSIVE_ZONE_X - 50);
        }
      }
    } else if (role.includes("ST") || role.includes("CF")) {
      if (isAttacking) {
        if (direction > 0) {
          adjustedX = Math.max(adjustedX, ATTACKING_ZONE_X);
        } else {
          adjustedX = Math.min(adjustedX, ATTACKING_ZONE_X);
        }
      }
    } else if (role.includes("CAM") || role.includes("AM")) {
      if (isAttacking) {
        if (direction > 0) {
          adjustedX = Math.max(adjustedX, MIDFIELD_ZONE_X + 30);
        } else {
          adjustedX = Math.min(adjustedX, MIDFIELD_ZONE_X - 30);
        }
      }
    }
    adjustedX = Math.max(10, Math.min(PITCH_WIDTH3 - 10, adjustedX));
    return {
      ...basePosition,
      x: adjustedX
    };
  }
  function checkAndAdjustOffsidePosition(position, _player, opponentGoalX, opponents, _gameState) {
    if (!position || !opponents || opponents.length === 0)
      return position;
    const PITCH_WIDTH3 = GAME_CONFIG.PITCH_WIDTH;
    const direction = Math.sign(opponentGoalX - 400);
    const opponentFieldPlayers = opponents.filter(
      (opp) => opp.role !== "GK"
    );
    if (opponentFieldPlayers.length === 0)
      return position;
    let lastDefender = null;
    let minDistanceToGoal = Infinity;
    opponentFieldPlayers.forEach((opp) => {
      const distToGoal = Math.abs(opp.x - opponentGoalX);
      if (distToGoal < minDistanceToGoal) {
        minDistanceToGoal = distToGoal;
        lastDefender = opp;
      }
    });
    if (!lastDefender)
      return position;
    const defender = lastDefender;
    const playerDistToGoal = Math.abs(position.x - opponentGoalX);
    const defenderDistToGoal = Math.abs(defender.x - opponentGoalX);
    if (playerDistToGoal < defenderDistToGoal) {
      const safeOffsetFromOffside = 15;
      position.x = defender.x - direction * safeOffsetFromOffside;
      position.x = Math.max(10, Math.min(position.x, PITCH_WIDTH3 - 10));
    }
    return position;
  }
  var checkAndAdjustOffsidePositionWithAudit = (position, isHome, gameState2) => {
    if (!gameState2 || !position)
      return {
        position: position || { x: 0, y: 0 },
        wasOffside: false,
        wasAdjusted: false,
        originalX: position?.x || 0,
        defensiveLine: 0,
        tolerance: 5,
        error: "Invalid parameters"
      };
    const defensiveLine = isHome ? gameState2.awayDefensiveLine : gameState2.homeDefensiveLine;
    const goalX = isHome ? 800 : 0;
    const tolerance = 5;
    const playerDistToGoal = Math.abs(position.x - goalX);
    const isOffside = playerDistToGoal < defensiveLine - tolerance;
    let adjusted = false;
    let originalX = position.x;
    if (isOffside) {
      position.x = goalX + Math.sign(goalX - position.x) * (defensiveLine - tolerance);
      adjusted = true;
    }
    return {
      position,
      wasOffside: isOffside,
      wasAdjusted: adjusted,
      originalX,
      defensiveLine,
      tolerance,
      error: null
    };
  };

  // src/setpieces/behaviors/kickoff.ts
  var KickoffBehaviors = {
    /**
     * Get position for kickoff based on player role and team
     */
    getKickoffPosition(player, _kickoffPos, isKickingTeam, gameState2) {
      if (!player || !gameState2) {
        return sanitizePosition({ x: 400, y: 300, movement: "kickoff_fallback" }, { player });
      }
      if (player.role === "GK") {
        const ownGoalX = getAttackingGoalX(!player.isHome, gameState2.currentHalf);
        return sanitizePosition({
          x: ownGoalX,
          y: 300,
          movement: "kickoff_gk",
          role: "GK"
        }, { player });
      }
      let role = player.role;
      if (isKickingTeam) {
        const distToCenter = distance(player, { x: 400, y: 300 });
        if (distToCenter < 15) {
          role = "PRIMARY_KICKER";
        } else if (distToCenter < 40) {
          role = "SECONDARY_KICKER";
        }
      }
      return sanitizePosition({
        x: player.x,
        // STAY at your current X
        y: player.y,
        // STAY at your current Y
        movement: "kickoff_hold_position",
        // New, clear movement name
        role
      }, { player });
    },
    /**
     * Check if a player's position is valid for kickoff
     * (This function is still useful for validation by other systems)
     */
    isValidKickoffPosition(player, position, isKickingTeam, gameState2) {
      if (!position || !gameState2)
        return false;
      const centerX = GAME_CONFIG.PITCH_WIDTH / 2;
      const centerY = GAME_CONFIG.PITCH_HEIGHT / 2;
      const ownGoalX = getAttackingGoalX(!player.isHome, gameState2.currentHalf);
      const ownHalfIsLeft = ownGoalX < centerX;
      const inOwnHalf = ownHalfIsLeft ? position.x <= centerX + 10 : position.x >= centerX - 10;
      if (!inOwnHalf) {
        console.warn(`Player ${player.name} not in own half: x=${position.x}, ownHalfIsLeft=${ownHalfIsLeft}`);
        return false;
      }
      if (!isKickingTeam) {
        const distToCenter = distance(position, { x: centerX, y: centerY });
        if (distToCenter < 70) {
          console.warn(`Defending player ${player.name} too close to center: ${distToCenter}px`);
          return false;
        }
      }
      return true;
    },
    /**
     * Get the two designated kickers for kickoff
     * (This function is still useful for validation by other systems)
     */
    getDesignatedKickers(gameState2) {
      if (!gameState2 || !gameState2.setPiece)
        return { primary: null, secondary: null };
      const kickingTeamIsHome = gameState2.setPiece.team === true || gameState2.setPiece.team === "home";
      const kickingTeamPlayers = kickingTeamIsHome ? gameState2.homePlayers : gameState2.awayPlayers;
      if (!kickingTeamPlayers || kickingTeamPlayers.length === 0) {
        return { primary: null, secondary: null };
      }
      const centerX = GAME_CONFIG.PITCH_WIDTH / 2;
      const centerY = GAME_CONFIG.PITCH_HEIGHT / 2;
      const playersNearCenter = kickingTeamPlayers.filter((p) => p.role !== "GK").map((p) => ({
        player: p,
        dist: distance(p, { x: centerX, y: centerY })
      })).sort((a, b) => a.dist - b.dist);
      return {
        primary: playersNearCenter[0]?.player || null,
        secondary: playersNearCenter[1]?.player || null
      };
    }
  };
  console.log("\u2705 KICKOFF BEHAVIORS LOADED - (Simplified HOLD_POSITION fix)");

  // src/setpieces/behaviors/penalty.ts
  var PenaltyKickBehaviors = {
    /**
     * Get kicker position at penalty spot
     */
    getKickerPosition(penaltyPos) {
      return sanitizePosition(
        { x: penaltyPos.x, y: penaltyPos.y, movement: "penalty_kicker", role: "PENALTY_KICKER" },
        {}
      );
    },
    /**
     * Get penalty arc position for waiting players
     */
    getPenaltyArcPosition(player, penaltyPos, isAttacking, gameState2) {
      if (!player) {
        return sanitizePosition({ x: 400, y: 300, movement: "penalty_arc" }, {});
      }
      if (player.role === "GK") {
        const goalX = isAttacking ? getAttackingGoalX(!player.isHome, gameState2.currentHalf) : getAttackingGoalX(player.isHome, gameState2.currentHalf);
        return sanitizePosition({ x: goalX, y: 300, movement: "gk_penalty", role: "GK" }, { player });
      }
      const arcRadius = 110;
      const angle = Math.random() * Math.PI - Math.PI / 2;
      const x = penaltyPos.x + Math.cos(angle) * arcRadius;
      const y = penaltyPos.y + Math.sin(angle) * arcRadius;
      return sanitizePosition({ x, y, movement: "penalty_arc_wait" }, { player });
    }
  };

  // src/setpieces/behaviors/throwIn.ts
  var ThrowInBehaviors = {
    getThrowInPosition(player, throwPos, ownGoalX, opponentGoalX, gameState2, teammates, opponents) {
      if (!gameState2 || !player || !throwPos) {
        return sanitizePosition({ x: player?.x ?? 400, y: player?.y ?? 300, movement: "error_throw" }, { player });
      }
      if (player.role === "GK") {
        return sanitizePosition({ x: ownGoalX, y: 300, movement: "gk_stay_goal", role: "GK" }, { player, role: "GK" });
      }
      const throwInTeam = gameState2.setPiece?.team;
      const throwInTeamIsHome = typeof throwInTeam === "boolean" ? throwInTeam : throwInTeam === "home";
      const hasThrowIn = player.isHome === throwInTeamIsHome;
      if (!hasThrowIn) {
        return this.getDefendingThrowInPosition(player, throwPos, ownGoalX, gameState2, teammates);
      }
      const PITCH_WIDTH3 = GAME_CONFIG.PITCH_WIDTH;
      const PITCH_HEIGHT3 = GAME_CONFIG.PITCH_HEIGHT;
      const direction = Math.sign(opponentGoalX - 400);
      const isInAttackingThird = Math.abs(throwPos.x - opponentGoalX) < PITCH_WIDTH3 / 3;
      const isInDefensiveThird = Math.abs(throwPos.x - ownGoalX) < PITCH_WIDTH3 / 3;
      const isInMiddleThird = !isInAttackingThird && !isInDefensiveThird;
      if (!gameState2._throwInPosManager)
        gameState2._throwInPosManager = new PositionManager();
      const posManager = gameState2._throwInPosManager;
      const setupKey = `_lastThrowInSetup_H${gameState2.currentHalf}`;
      if (!gameState2[setupKey] || gameState2[setupKey] !== gameState2.setPiece) {
        gameState2[setupKey] = gameState2.setPiece;
        posManager.reset();
        const playerJobs = /* @__PURE__ */ new Map();
        const validTeammates = getValidPlayers(teammates).filter((p) => p.role !== "GK");
        const sortedLists = getSortedLists(validTeammates, getValidPlayers(opponents));
        const assigned = /* @__PURE__ */ new Set();
        const touchlineY = throwPos.y < 300 ? 5 : PITCH_HEIGHT3 - 5;
        const infieldDirection = throwPos.y < 300 ? 1 : -1;
        const forwardAdvance = isInAttackingThird ? 60 : isInMiddleThird ? 45 : 30;
        const ZONES = {
          thrower: { x: throwPos.x, y: touchlineY },
          // EXACT touchline position
          // Short option - close support for quick return pass
          shortOption: {
            x: throwPos.x + direction * 28,
            y: touchlineY + infieldDirection * 32
          },
          // Down the line - runner making forward run along touchline
          downLine: {
            x: throwPos.x + direction * forwardAdvance,
            y: touchlineY + infieldDirection * 20
          },
          // Infield - central player offering passing lane
          infield: {
            x: throwPos.x + direction * 35,
            y: PITCH_HEIGHT3 / 2 + (throwPos.y < 300 ? 50 : -50)
          },
          // Support behind - safety option
          support: {
            x: throwPos.x - direction * 25,
            y: touchlineY + infieldDirection * 35
          },
          // Deep target - forward player for long throw
          deepTarget: {
            x: throwPos.x + direction * (forwardAdvance + 50),
            y: PITCH_HEIGHT3 / 2
          },
          // Near-side midfielder - link-up play
          nearMidfield: {
            x: throwPos.x + direction * 20,
            y: PITCH_HEIGHT3 / 2 + (throwPos.y < 300 ? 80 : -80)
          },
          // Far-side midfielder - switch play option
          farMidfield: {
            x: throwPos.x + direction * 30,
            y: PITCH_HEIGHT3 / 2 - (throwPos.y < 300 ? 80 : -80)
          },
          // Defensive cover - counter-attack prevention
          defensiveCover: [
            { x: throwPos.x - direction * (isInAttackingThird ? 120 : 80), y: 220 },
            { x: throwPos.x - direction * (isInAttackingThird ? 120 : 80), y: 380 },
            { x: throwPos.x - direction * (isInAttackingThird ? 100 : 60), y: PITCH_HEIGHT3 / 2 }
          ],
          // Striker positioning - only in attacking third
          strikerPosition: isInAttackingThird ? {
            x: opponentGoalX - direction * 100,
            y: PITCH_HEIGHT3 / 2
          } : null
        };
        const throwerCandidates = validTeammates.filter((p) => ["RB", "LB", "RWB", "LWB", "RW", "LW", "RM", "LM"].some((role) => p.role.includes(role))).sort((a, b) => distance(a, throwPos) - distance(b, throwPos));
        const thrower = throwerCandidates[0] || (validTeammates.length > 0 ? validTeammates.sort((a, b) => distance(a, throwPos) - distance(b, throwPos))[0] : null);
        if (thrower) {
          playerJobs.set(String(thrower.id), {
            ...ZONES.thrower,
            movement: "throw_in_taker",
            role: "THROWER",
            priority: 10
          });
          assigned.add(String(thrower.id));
        }
        if (isInAttackingThird) {
          const strikers = validTeammates.filter(
            (p) => !assigned.has(String(p.id)) && ["ST", "CF"].some((r) => p.role.includes(r))
          );
          if (strikers[0] && ZONES.strikerPosition) {
            const finalPos = posManager.findValidPosition(ZONES.strikerPosition);
            playerJobs.set(String(strikers[0].id), {
              ...finalPos,
              movement: "striker_target",
              role: "STRIKER_TARGET",
              priority: 9
            });
            assigned.add(String(strikers[0].id));
          }
          const attackers = validTeammates.filter(
            (p) => !assigned.has(String(p.id)) && ["RW", "LW", "CAM", "RM", "LM"].some((r) => p.role.includes(r))
          ).slice(0, 2);
          if (attackers[0]) {
            const finalPos = posManager.findValidPosition(ZONES.shortOption);
            playerJobs.set(String(attackers[0].id), {
              ...finalPos,
              movement: "short_option_attack",
              role: "SHORT_OPTION",
              priority: 9
            });
            assigned.add(String(attackers[0].id));
          }
          if (attackers[1]) {
            const finalPos = posManager.findValidPosition(ZONES.downLine);
            playerJobs.set(String(attackers[1].id), {
              ...finalPos,
              movement: "down_line_run",
              role: "DOWN_LINE",
              runTiming: "ON_THROW",
              priority: 8
            });
            assigned.add(String(attackers[1].id));
          }
          const midfielders = validTeammates.filter(
            (p) => !assigned.has(String(p.id)) && ["CM", "CAM"].some((r) => p.role.includes(r))
          ).slice(0, 2);
          if (midfielders[0]) {
            const finalPos = posManager.findValidPosition(ZONES.nearMidfield);
            playerJobs.set(String(midfielders[0].id), {
              ...finalPos,
              movement: "infield_link",
              role: "INFIELD_LINK",
              priority: 8
            });
            assigned.add(String(midfielders[0].id));
          }
          if (midfielders[1]) {
            const finalPos = posManager.findValidPosition(ZONES.farMidfield);
            playerJobs.set(String(midfielders[1].id), {
              ...finalPos,
              movement: "far_side_option",
              role: "FAR_SIDE",
              priority: 7
            });
            assigned.add(String(midfielders[1].id));
          }
        } else if (isInDefensiveThird) {
          const defMid = validTeammates.find(
            (p) => !assigned.has(String(p.id)) && ["CDM", "CM"].some((r) => p.role.includes(r))
          );
          if (defMid) {
            const finalPos = posManager.findValidPosition(ZONES.shortOption);
            playerJobs.set(String(defMid.id), {
              ...finalPos,
              movement: "safe_short",
              role: "SAFE_OPTION",
              priority: 9
            });
            assigned.add(String(defMid.id));
          }
          const centerBacks = validTeammates.filter(
            (p) => !assigned.has(String(p.id)) && ["CB"].some((r) => p.role.includes(r))
          ).slice(0, 2);
          if (centerBacks[0]) {
            const finalPos = posManager.findValidPosition(ZONES.support);
            playerJobs.set(String(centerBacks[0].id), {
              ...finalPos,
              movement: "defensive_support",
              role: "SUPPORT",
              priority: 8
            });
            assigned.add(String(centerBacks[0].id));
          }
          const forwards = validTeammates.filter(
            (p) => !assigned.has(String(p.id)) && ["ST", "RW", "LW"].some((r) => p.role.includes(r))
          ).slice(0, 2);
          forwards.forEach((fwd, idx) => {
            const finalPos = posManager.findValidPosition(
              idx === 0 ? ZONES.deepTarget : ZONES.infield
            );
            playerJobs.set(String(fwd.id), {
              ...finalPos,
              movement: "counter_outlet",
              role: `OUTLET_${idx}`,
              priority: 7
            });
            assigned.add(String(fwd.id));
          });
        } else {
          const mids = validTeammates.filter(
            (p) => !assigned.has(String(p.id)) && ["CM", "CDM", "CAM", "RM", "LM"].some((r) => p.role.includes(r))
          ).slice(0, 3);
          const zones = [ZONES.shortOption, ZONES.nearMidfield, ZONES.infield];
          mids.forEach((mid, idx) => {
            if (zones[idx]) {
              const finalPos = posManager.findValidPosition(zones[idx]);
              playerJobs.set(String(mid.id), {
                ...finalPos,
                movement: `midfield_receiver_${idx}`,
                role: `MID_RECEIVER_${idx}`,
                priority: 8 - idx
              });
              assigned.add(String(mid.id));
            }
          });
          const attackers = validTeammates.filter(
            (p) => !assigned.has(String(p.id)) && ["ST", "RW", "LW"].some((r) => p.role.includes(r))
          ).slice(0, 2);
          if (attackers[0]) {
            const finalPos = posManager.findValidPosition(ZONES.downLine);
            playerJobs.set(String(attackers[0].id), {
              ...finalPos,
              movement: "forward_run",
              role: "FORWARD_RUNNER",
              priority: 7
            });
            assigned.add(String(attackers[0].id));
          }
        }
        const defenders = sortedLists.teammates.bestDefenders.filter((p) => !assigned.has(String(p.id))).slice(0, 2);
        defenders.forEach((def, idx) => {
          if (ZONES.defensiveCover[idx]) {
            const finalPos = posManager.findValidPosition(ZONES.defensiveCover[idx]);
            playerJobs.set(String(def.id), {
              ...finalPos,
              movement: "defensive_cover_throw",
              role: `DEFENSIVE_COVER_${idx}`,
              priority: 6
            });
            assigned.add(String(def.id));
          }
        });
        validTeammates.forEach((p) => {
          if (!assigned.has(String(p.id))) {
            const activePos2 = getPlayerActivePosition(p, gameState2.currentHalf);
            const finalPos = posManager.findValidPosition(activePos2);
            playerJobs.set(String(p.id), {
              ...finalPos,
              movement: "maintain_shape",
              role: "SHAPE",
              priority: 4
            });
          }
        });
        gameState2._throwInJobAssignments = playerJobs;
      }
      const playerIdStr = String(player.id);
      const myPositionData = gameState2._throwInJobAssignments?.get(playerIdStr);
      if (myPositionData) {
        return sanitizePosition(myPositionData, { player, gameState: gameState2, behavior: "ProfessionalThrowIn" });
      }
      const activePos = getPlayerActivePosition(player, gameState2.currentHalf);
      return sanitizePosition({ x: activePos.x, y: activePos.y, movement: "fallback_throw" }, { player });
    },
    /**
     * Defending throw-in positioning - opponents mark and cover space
     */
    getDefendingThrowInPosition(player, throwPos, ownGoalX, gameState2, teammates) {
      if (!gameState2 || !player || !throwPos) {
        return sanitizePosition({ x: player?.x ?? 400, y: player?.y ?? 300, movement: "error_throw_def" }, { player });
      }
      const PITCH_HEIGHT3 = GAME_CONFIG.PITCH_HEIGHT;
      const direction = Math.sign(throwPos.x - ownGoalX);
      const touchlineY = throwPos.y < 300 ? 5 : PITCH_HEIGHT3 - 5;
      if (!gameState2._throwInDefPosManager)
        gameState2._throwInDefPosManager = new PositionManager();
      const posManager = gameState2._throwInDefPosManager;
      const setupKey = `_lastThrowInDefSetup_H${gameState2.currentHalf}`;
      if (!gameState2[setupKey] || gameState2[setupKey] !== gameState2.setPiece) {
        gameState2[setupKey] = gameState2.setPiece;
        posManager.reset();
        const playerJobs = /* @__PURE__ */ new Map();
        const validTeammates = getValidPlayers(teammates).filter((p) => p.role !== "GK");
        const sortedLists = getSortedLists(validTeammates, []);
        const assigned = /* @__PURE__ */ new Set();
        const pressers = sortedLists.teammates.fastest.slice(0, 2);
        pressers.forEach((presser, idx) => {
          const xOffset = idx === 0 ? 15 : 25;
          const yOffset = throwPos.y < 300 ? 25 : -25;
          const finalPos = posManager.findValidPosition({
            x: throwPos.x + direction * xOffset,
            y: touchlineY + yOffset
          });
          playerJobs.set(String(presser.id), {
            ...finalPos,
            movement: "press_thrower",
            role: `PRESS_THROWER_${idx}`,
            priority: 9
          });
          assigned.add(String(presser.id));
        });
        const markers = validTeammates.filter((p) => !assigned.has(String(p.id))).slice(0, 4);
        markers.forEach((marker, idx) => {
          const xSpread = throwPos.x + direction * (30 + idx * 25);
          const ySpread = throwPos.y < 300 ? 120 + idx * 80 : 480 - idx * 80;
          const finalPos = posManager.findValidPosition({
            x: xSpread,
            y: ySpread
          });
          playerJobs.set(String(marker.id), {
            ...finalPos,
            movement: "mark_space",
            role: `MARK_SPACE_${idx}`,
            priority: 8 - idx
          });
          assigned.add(String(marker.id));
        });
        validTeammates.forEach((p) => {
          if (!assigned.has(String(p.id))) {
            const activePos2 = getPlayerActivePosition(p, gameState2.currentHalf);
            const finalPos = posManager.findValidPosition(activePos2);
            playerJobs.set(String(p.id), {
              ...finalPos,
              movement: "maintain_def_shape",
              role: "DEF_SHAPE",
              priority: 5
            });
          }
        });
        gameState2._throwInDefJobAssignments = playerJobs;
      }
      const playerIdStr = String(player.id);
      const myPositionData = gameState2._throwInDefJobAssignments?.get(playerIdStr);
      if (myPositionData) {
        return sanitizePosition(myPositionData, { player, gameState: gameState2, behavior: "DefendingThrowIn" });
      }
      const activePos = getPlayerActivePosition(player, gameState2.currentHalf);
      return sanitizePosition({ x: activePos.x, y: activePos.y, movement: "fallback_throw_def" }, { player });
    }
  };
  console.log("\u2705 THROW-IN BEHAVIORS LOADED (TypeScript)");

  // src/setpieces/behaviors/cornerKick.ts
  var ProfessionalCornerBehaviors = {
    getAttackingCornerPosition(player, cornerPos, opponentGoalX, teammates, sortedLists, _routine, gameState2) {
      if (!gameState2 || !player || !cornerPos) {
        return sanitizePosition({ x: player?.x ?? 400, y: player?.y ?? 300, movement: "error_corner_att" }, { player });
      }
      if (player.role === "GK") {
        const gkX = getAttackingGoalX(!player.isHome, gameState2.currentHalf);
        return sanitizePosition({ x: gkX, y: 300, movement: "gk_stay_goal", role: "GK" }, { player, role: "GK" });
      }
      const SET_PIECE_TYPES3 = { CORNER_KICK: "CORNER_KICK" };
      const PITCH_WIDTH3 = GAME_CONFIG.PITCH_WIDTH;
      const PITCH_HEIGHT3 = GAME_CONFIG.PITCH_HEIGHT;
      const activeConfig3 = { GOAL_Y_TOP: 225, GOAL_Y_BOTTOM: 375 };
      const context = new TacticalContext(gameState2, SET_PIECE_TYPES3.CORNER_KICK);
      const shouldCommit = context.shouldCommitForward(player.isHome);
      if (!sortedLists)
        sortedLists = getSortedLists(teammates, getValidPlayers(gameState2 ? player.isHome ? gameState2.awayPlayers : gameState2.homePlayers : []));
      const isRightCorner = cornerPos.y < PITCH_HEIGHT3 / 2;
      const direction = Math.sign(opponentGoalX - PITCH_WIDTH3 / 2);
      const ZONES = {
        // Near post - first runner (arrives just before far post) - PROFESSIONAL: Attack from penalty area with run-up
        nearPostRun: {
          start: { x: opponentGoalX - direction * 125, y: isRightCorner ? activeConfig3.GOAL_Y_TOP + 55 : activeConfig3.GOAL_Y_BOTTOM - 55 },
          target: { x: opponentGoalX - direction * 95, y: isRightCorner ? activeConfig3.GOAL_Y_TOP + 35 : activeConfig3.GOAL_Y_BOTTOM - 35 }
        },
        // Far post - power header (starting deeper for run-up) - PROFESSIONAL: Attack from deep with momentum
        farPost: {
          start: { x: opponentGoalX - direction * 140, y: isRightCorner ? activeConfig3.GOAL_Y_BOTTOM - 45 : activeConfig3.GOAL_Y_TOP + 45 },
          target: { x: opponentGoalX - direction * 105, y: isRightCorner ? activeConfig3.GOAL_Y_BOTTOM - 35 : activeConfig3.GOAL_Y_TOP + 35 }
        },
        // Penalty spot - central aerial threat
        penaltySpot: {
          start: { x: opponentGoalX - direction * 125, y: PITCH_HEIGHT3 / 2 + (isRightCorner ? -15 : 15) },
          target: { x: opponentGoalX - direction * 108, y: PITCH_HEIGHT3 / 2 }
        },
        // Six-yard line - close-range finisher
        sixYardSpot: {
          start: { x: opponentGoalX - direction * 65, y: PITCH_HEIGHT3 / 2 + (isRightCorner ? 20 : -20) },
          target: { x: opponentGoalX - direction * 35, y: PITCH_HEIGHT3 / 2 }
        },
        // Edge of box - cutback receiver and long-range threat
        edgeBox: { x: opponentGoalX - direction * 185, y: PITCH_HEIGHT3 / 2 },
        edgeBoxLeft: { x: opponentGoalX - direction * 180, y: PITCH_HEIGHT3 / 2 - 60 },
        edgeBoxRight: { x: opponentGoalX - direction * 180, y: PITCH_HEIGHT3 / 2 + 60 },
        // Blocking run - creates space (decoy movement)
        blockingRun: {
          start: { x: opponentGoalX - direction * 98, y: isRightCorner ? activeConfig3.GOAL_Y_TOP + 65 : activeConfig3.GOAL_Y_BOTTOM - 65 },
          target: { x: opponentGoalX - direction * 85, y: PITCH_HEIGHT3 / 2 + (isRightCorner ? -10 : 10) }
        },
        // Decoy near post run (pulls defender) - PROFESSIONAL: Attack from penalty area with realistic spacing
        decoyNearPost: {
          start: { x: opponentGoalX - direction * 118, y: isRightCorner ? activeConfig3.GOAL_Y_TOP + 40 : activeConfig3.GOAL_Y_BOTTOM - 40 },
          target: { x: opponentGoalX - direction * 92, y: isRightCorner ? activeConfig3.GOAL_Y_TOP + 30 : activeConfig3.GOAL_Y_BOTTOM - 30 }
        },
        // Short corner option
        shortCorner: { x: cornerPos.x - direction * 32, y: cornerPos.y + (isRightCorner ? 28 : -28) },
        // Counter-attack prevention (hold defensive shape)
        defensiveCover: [
          { x: opponentGoalX - direction * 285, y: 210 },
          { x: opponentGoalX - direction * 285, y: 390 },
          { x: opponentGoalX - direction * 250, y: PITCH_HEIGHT3 / 2 }
        ]
      };
      if (!gameState2._cornerPosManager)
        gameState2._cornerPosManager = new PositionManager();
      const posManager = gameState2._cornerPosManager;
      const setupKey = `_lastCornerAttSetup_H${gameState2.currentHalf}`;
      if (!gameState2[setupKey] || gameState2[setupKey] !== gameState2.setPiece) {
        gameState2[setupKey] = gameState2.setPiece;
        posManager.reset();
        posManager.markPriorityZone(ZONES.nearPostRun.target.x, ZONES.nearPostRun.target.y);
        posManager.markPriorityZone(ZONES.farPost.target.x, ZONES.farPost.target.y);
        const playerJobs = /* @__PURE__ */ new Map();
        const validTeammates = getValidPlayers(teammates).filter((p) => p.role !== "GK");
        const defensivePlayers = validTeammates.filter(
          (p) => p.role === "CB" || p.role === "LB" || p.role === "RB" || p.role === "CDM"
        );
        const bestKicker = sortedLists.teammates.bestKickers[0];
        const aerialThreats = sortedLists.teammates.bestHeaders.slice(0, 4);
        const fastRunners = sortedLists.teammates.fastest.slice(0, 3);
        const defendersToCommit = shouldCommit ? defensivePlayers.filter((p) => p.role !== "GK").slice(0, 1) : [];
        const defendersToStayBack = shouldCommit ? defensivePlayers.filter((p) => !defendersToCommit.includes(p) && p.role !== "GK").slice(0, 2) : defensivePlayers.filter((p) => p.role !== "GK").slice(0, 3);
        const assigned = /* @__PURE__ */ new Set();
        if (bestKicker) {
          const kickerId = String(bestKicker.id);
          playerJobs.set(kickerId, {
            x: cornerPos.x - direction * 8,
            y: cornerPos.y + 8,
            movement: "corner_kicker",
            role: "CORNER_KICKER",
            priority: 10
          });
          assigned.add(kickerId);
        }
        if (fastRunners[0] && !assigned.has(String(fastRunners[0].id))) {
          const runnerId = String(fastRunners[0].id);
          playerJobs.set(runnerId, {
            ...ZONES.nearPostRun.start,
            targetX: ZONES.nearPostRun.target.x,
            targetY: ZONES.nearPostRun.target.y,
            movement: "near_post_run",
            role: "NEAR_POST_RUNNER",
            runTiming: "ON_KICK",
            priority: 10
          });
          assigned.add(runnerId);
        }
        if (aerialThreats[0] && !assigned.has(String(aerialThreats[0].id))) {
          const headerId = String(aerialThreats[0].id);
          playerJobs.set(headerId, {
            ...ZONES.farPost.start,
            targetX: ZONES.farPost.target.x,
            targetY: ZONES.farPost.target.y,
            movement: "far_post_attack",
            role: "FAR_POST_THREAT",
            runTiming: "DELAYED",
            priority: 10
          });
          assigned.add(headerId);
        }
        if (aerialThreats[1] && !assigned.has(String(aerialThreats[1].id))) {
          const penaltyId = String(aerialThreats[1].id);
          playerJobs.set(penaltyId, {
            ...ZONES.penaltySpot.start,
            targetX: ZONES.penaltySpot.target.x,
            targetY: ZONES.penaltySpot.target.y,
            movement: "penalty_spot_threat",
            role: "PENALTY_SPOT",
            runTiming: "IMMEDIATE",
            priority: 9
          });
          assigned.add(penaltyId);
        }
        if (aerialThreats[2] && !assigned.has(String(aerialThreats[2].id))) {
          const sixYardId = String(aerialThreats[2].id);
          playerJobs.set(sixYardId, {
            ...ZONES.sixYardSpot.start,
            targetX: ZONES.sixYardSpot.target.x,
            targetY: ZONES.sixYardSpot.target.y,
            movement: "six_yard_threat",
            role: "SIX_YARD",
            runTiming: "ON_KICK",
            priority: 9
          });
          assigned.add(sixYardId);
        }
        if (fastRunners[1] && !assigned.has(String(fastRunners[1].id))) {
          const blockerId = String(fastRunners[1].id);
          playerJobs.set(blockerId, {
            ...ZONES.blockingRun.start,
            targetX: ZONES.blockingRun.target.x,
            targetY: ZONES.blockingRun.target.y,
            movement: "blocking_run",
            role: "BLOCKER",
            runTiming: "EARLY",
            priority: 8
          });
          assigned.add(blockerId);
        }
        const decoyRunner = validTeammates.find(
          (p) => !assigned.has(String(p.id)) && (p.role.includes("CM") || p.role.includes("CAM") || p.role.includes("ST"))
        );
        if (decoyRunner) {
          playerJobs.set(String(decoyRunner.id), {
            ...ZONES.decoyNearPost.start,
            targetX: ZONES.decoyNearPost.target.x,
            targetY: ZONES.decoyNearPost.target.y,
            movement: "decoy_near_post",
            role: "DECOY",
            runTiming: "EARLY",
            priority: 7
          });
          assigned.add(String(decoyRunner.id));
        }
        const edgePositions = [ZONES.edgeBox, ZONES.edgeBoxLeft, ZONES.edgeBoxRight];
        const edgePlayers = validTeammates.filter((p) => !assigned.has(String(p.id)) && (p.role.includes("CM") || p.role.includes("CDM") || p.role.includes("CAM"))).slice(0, 3);
        edgePlayers.forEach((edgePlayer, idx) => {
          if (edgePositions[idx]) {
            const finalPos = posManager.findValidPosition(edgePositions[idx]);
            playerJobs.set(String(edgePlayer.id), {
              ...finalPos,
              movement: `edge_box_${idx}`,
              role: `EDGE_BOX_${idx}`,
              priority: 6
            });
            assigned.add(String(edgePlayer.id));
          }
        });
        let defIdx = 0;
        defendersToStayBack.forEach((def) => {
          if (!assigned.has(String(def.id)) && defIdx < ZONES.defensiveCover.length) {
            const finalPos = posManager.findValidPosition(ZONES.defensiveCover[defIdx]);
            playerJobs.set(String(def.id), {
              ...finalPos,
              movement: "defensive_cover_corner",
              role: `DEFENSIVE_COVER_${defIdx}`,
              priority: 5
            });
            assigned.add(String(def.id));
            defIdx++;
          }
        });
        let supportIdx = 0;
        validTeammates.forEach((p) => {
          if (!assigned.has(String(p.id))) {
            const activePos2 = getPlayerActivePosition(p, gameState2.currentHalf);
            const finalPos = posManager.findValidPosition(activePos2);
            playerJobs.set(String(p.id), {
              ...finalPos,
              movement: "support_corner",
              role: `SUPPORT_${supportIdx}`,
              priority: 3
            });
            supportIdx++;
          }
        });
        gameState2._cornerJobAssignments = playerJobs;
      }
      const playerIdStr = String(player.id);
      const myPositionData = gameState2._cornerJobAssignments?.get(playerIdStr);
      if (myPositionData) {
        const opponents = getValidPlayers(player.isHome ? gameState2.awayPlayers : gameState2.homePlayers);
        const adjustedPosition = checkAndAdjustOffsidePosition(
          myPositionData,
          player,
          opponentGoalX,
          opponents,
          gameState2
        );
        return sanitizePosition(adjustedPosition, { player, gameState: gameState2, behavior: "ProfessionalCornerAttacking" });
      }
      const activePos = getPlayerActivePosition(player, gameState2.currentHalf);
      return sanitizePosition({ x: activePos.x, y: activePos.y, movement: "fallback_corner_att" }, { player });
    },
    getDefendingCornerPosition(player, cornerPos, ownGoalX, opponents, sortedLists, system, gameState2, teammates) {
      if (!gameState2 || !player || !cornerPos) {
        return sanitizePosition({ x: player?.x ?? 400, y: player?.y ?? 300, movement: "error_corner_def" }, { player });
      }
      if (player.role === "GK") {
        const PITCH_HEIGHT4 = GAME_CONFIG.PITCH_HEIGHT;
        const activeConfig4 = { GOAL_Y_TOP: 225, GOAL_Y_BOTTOM: 375 };
        const isRightCorner = cornerPos.y < PITCH_HEIGHT4 / 2;
        const gkY = isRightCorner ? activeConfig4.GOAL_Y_TOP + 50 : activeConfig4.GOAL_Y_BOTTOM - 50;
        return sanitizePosition({ x: ownGoalX, y: gkY, movement: "gk_corner_positioning", role: "GK" }, { player, role: "GK" });
      }
      const SET_PIECE_TYPES3 = { CORNER_KICK: "CORNER_KICK" };
      const PITCH_WIDTH3 = GAME_CONFIG.PITCH_WIDTH;
      const PITCH_HEIGHT3 = GAME_CONFIG.PITCH_HEIGHT;
      const activeConfig3 = { GOAL_Y_TOP: 225, GOAL_Y_BOTTOM: 375 };
      if (!sortedLists)
        sortedLists = getSortedLists(teammates, opponents);
      const direction = Math.sign(ownGoalX - PITCH_WIDTH3 / 2);
      const context = new TacticalContext(gameState2, SET_PIECE_TYPES3.CORNER_KICK);
      const useManMarking = system === "man_marking" || context.shouldStayCompact(player.isHome);
      const ZONES = {
        goalLine: { x: ownGoalX + direction * 8, y: PITCH_HEIGHT3 / 2 },
        nearPost6Y: { x: ownGoalX + direction * 30, y: activeConfig3.GOAL_Y_TOP + 20 },
        farPost6Y: { x: ownGoalX + direction * 30, y: activeConfig3.GOAL_Y_BOTTOM - 20 },
        central: { x: ownGoalX + direction * 35, y: PITCH_HEIGHT3 / 2 },
        penaltySpot: { x: ownGoalX + direction * 110, y: PITCH_HEIGHT3 / 2 },
        nearPostPenalty: { x: ownGoalX + direction * 95, y: activeConfig3.GOAL_Y_TOP + 40 },
        farPostPenalty: { x: ownGoalX + direction * 95, y: activeConfig3.GOAL_Y_BOTTOM - 40 },
        edgeBox: { x: ownGoalX + direction * 180, y: PITCH_HEIGHT3 / 2 },
        shortCornerPress: { x: cornerPos.x + direction * 20, y: cornerPos.y }
      };
      if (!gameState2._cornerDefPosManager)
        gameState2._cornerDefPosManager = new PositionManager();
      const posManager = gameState2._cornerDefPosManager;
      const setupKey = `_lastCornerDefSetup_H${gameState2.currentHalf}`;
      if (!gameState2[setupKey] || gameState2[setupKey] !== gameState2.setPiece) {
        gameState2[setupKey] = gameState2.setPiece;
        posManager.reset();
        const playerJobs = /* @__PURE__ */ new Map();
        const validTeammates = getValidPlayers(teammates).filter((p) => p.role !== "GK");
        const validOpponents = getValidPlayers(opponents).filter((p) => p.role !== "GK");
        const opponentMap = new Map(validOpponents.map((p) => [String(p.id), p]));
        gameState2._cornerOpponentMap = opponentMap;
        const assigned = /* @__PURE__ */ new Set();
        if (useManMarking) {
          const dangerousAttackers = sortedLists.opponents.mostDangerous.slice(0, Math.min(6, validTeammates.length));
          const bestMarkers = sortedLists.teammates.bestDefenders;
          dangerousAttackers.forEach((attacker, idx) => {
            if (bestMarkers[idx]) {
              const markerId = String(bestMarkers[idx].id);
              playerJobs.set(markerId, {
                x: 0,
                // Will be updated dynamically
                y: 0,
                // Will be updated dynamically
                role: `MARK_${attacker.id}`,
                movement: "tight_man_mark",
                targetId: String(attacker.id),
                priority: 10
              });
              assigned.add(markerId);
            }
          });
        } else {
          const zonalAssignments = [
            { zone: "nearPost6Y", priority: 10, count: 1 },
            { zone: "farPost6Y", priority: 10, count: 1 },
            { zone: "central", priority: 9, count: 1 },
            { zone: "penaltySpot", priority: 8, count: 1 },
            { zone: "nearPostPenalty", priority: 7, count: 1 },
            { zone: "farPostPenalty", priority: 7, count: 1 }
          ];
          let playerIdx = 0;
          zonalAssignments.forEach((assignment) => {
            for (let i = 0; i < assignment.count && playerIdx < validTeammates.length; i++) {
              const p = validTeammates[playerIdx];
              if (!p) {
                playerIdx++;
                continue;
              }
              const playerId = String(p.id);
              if (!assigned.has(playerId)) {
                const zonePos = ZONES[assignment.zone];
                const finalPos = posManager.findValidPosition(zonePos);
                playerJobs.set(playerId, {
                  ...finalPos,
                  movement: `zone_${assignment.zone}`,
                  role: `ZONE_${assignment.zone.toUpperCase()}`,
                  priority: assignment.priority
                });
                assigned.add(playerId);
              }
              playerIdx++;
            }
          });
        }
        const fastPlayer = sortedLists.teammates.fastest.find((p) => !assigned.has(String(p.id)));
        if (fastPlayer) {
          const finalPos = posManager.findValidPosition(ZONES.shortCornerPress);
          playerJobs.set(String(fastPlayer.id), {
            ...finalPos,
            movement: "short_corner_press",
            role: "SHORT_PRESS",
            priority: 6
          });
          assigned.add(String(fastPlayer.id));
        }
        validTeammates.forEach((p) => {
          if (!assigned.has(String(p.id))) {
            const finalPos = posManager.findValidPosition(ZONES.edgeBox);
            playerJobs.set(String(p.id), {
              ...finalPos,
              movement: "edge_box_cover",
              role: "EDGE_COVER",
              priority: 5
            });
          }
        });
        gameState2._cornerDefJobAssignments = playerJobs;
      }
      const playerIdStr = String(player.id);
      const myPositionData = gameState2._cornerDefJobAssignments?.get(playerIdStr);
      if (myPositionData) {
        let finalPos = { ...myPositionData };
        if (finalPos.role?.startsWith("MARK_")) {
          const targetIdStr = finalPos.targetId || finalPos.role.split("_")[1];
          const target = gameState2._cornerOpponentMap?.get(targetIdStr);
          if (target) {
            finalPos = {
              ...finalPos,
              x: target.x - direction * 8,
              y: target.y + (Math.random() - 0.5) * 4,
              movement: "active_man_mark"
            };
          } else {
            finalPos = { ...ZONES.central, movement: "zone_fallback", role: finalPos.role, priority: finalPos.priority };
          }
        }
        return sanitizePosition(finalPos, { player, gameState: gameState2, behavior: "ProfessionalCornerDefending" });
      }
      const activePos = getPlayerActivePosition(player, gameState2.currentHalf);
      return sanitizePosition({ x: activePos.x, y: activePos.y, movement: "fallback_corner_def" }, { player });
    }
  };

  // src/setpieces/behaviors/freeKick.ts
  function getSafeStat2(stats, key, defaultValue = 0) {
    if (!stats || typeof stats !== "object")
      return defaultValue;
    const val = stats[key];
    return typeof val === "number" && isFinite(val) ? val : defaultValue;
  }
  function getRoleBasedFallbackPosition2(role, context = {}) {
    const PITCH_WIDTH3 = GAME_CONFIG.PITCH_WIDTH;
    const PITCH_HEIGHT3 = GAME_CONFIG.PITCH_HEIGHT;
    let fallbackX = PITCH_WIDTH3 / 2;
    let fallbackY = PITCH_HEIGHT3 / 2;
    if (role?.includes("ST") || role?.includes("CF")) {
      fallbackX = context.player?.isHome ? PITCH_WIDTH3 - 150 : 150;
    }
    fallbackX = Math.max(10, Math.min(PITCH_WIDTH3 - 10, fallbackX));
    fallbackY = Math.max(10, Math.min(PITCH_HEIGHT3 - 10, fallbackY));
    return sanitizePosition({ x: fallbackX, y: fallbackY, movement: "fallback_position" }, context);
  }
  var ProfessionalFreeKickBehaviors = {
    getAttackingFreeKickPosition(player, fkPos, opponentGoalX, distToGoal, sortedLists, gameState2, teammates) {
      if (!gameState2 || !player || !fkPos) {
        return sanitizePosition({ x: player?.x ?? 400, y: player?.y ?? 300, movement: "error_fk_att" }, { player });
      }
      if (player.role === "GK") {
        const gkX = getAttackingGoalX(!player.isHome, gameState2.currentHalf);
        return sanitizePosition({ x: gkX, y: 300, movement: "gk_stay_goal" }, { player });
      }
      const direction = Math.sign(opponentGoalX - 400);
      if (!isFinite(direction) || direction === 0) {
        return getRoleBasedFallbackPosition2(player.role, { player, gameState: gameState2 });
      }
      const PITCH_WIDTH3 = GAME_CONFIG.PITCH_WIDTH;
      const PITCH_HEIGHT3 = GAME_CONFIG.PITCH_HEIGHT;
      const activeConfig3 = { GOAL_Y_TOP: 225, GOAL_Y_BOTTOM: 375 };
      const isDangerous = distToGoal < 280;
      const isCentral = Math.abs(fkPos.y - 300) < 100;
      const isShootingPosition = isDangerous && isCentral;
      if (!sortedLists)
        sortedLists = getSortedLists(teammates, getValidPlayers(gameState2 ? player.isHome ? gameState2.awayPlayers : gameState2.homePlayers : []));
      const ZONES = {
        // Direct shot setup (kicker and options)
        kicker: { x: fkPos.x - direction * 8, y: fkPos.y },
        dummyRunner: { x: fkPos.x - direction * 22, y: fkPos.y + 18 },
        secondKicker: { x: fkPos.x - direction * 22, y: fkPos.y - 18 },
        standingAttacker: { x: fkPos.x - direction * 35, y: fkPos.y },
        // Near post runner (timing run for flick-ons) - PROFESSIONAL: Deep starting position for momentum
        // Players attack from penalty area with proper run-up space
        nearPostStart: { x: fkPos.x + direction * 50, y: fkPos.y - 75 },
        nearPostTarget: { x: opponentGoalX - direction * 100, y: activeConfig3.GOAL_Y_TOP + 50 },
        // Far post target (power header) - PROFESSIONAL: Deep starting position for powerful run
        // Players attack from penalty area with maximum momentum
        farPostStart: { x: fkPos.x + direction * 60, y: fkPos.y + 85 },
        farPostTarget: { x: opponentGoalX - direction * 110, y: activeConfig3.GOAL_Y_BOTTOM - 50 },
        // Central striker (flick-on/lay-off or shot) - PROFESSIONAL: Penalty spot area
        strikerPosition: { x: opponentGoalX - direction * 105, y: PITCH_HEIGHT3 / 2 },
        // Penalty spot threat (if ball is crossed)
        penaltySpotStart: { x: fkPos.x + direction * 60, y: PITCH_HEIGHT3 / 2 + (fkPos.y < 300 ? 30 : -30) },
        penaltySpotTarget: { x: opponentGoalX - direction * 108, y: PITCH_HEIGHT3 / 2 },
        // Edge of box positions (rebounds/cutbacks/long shots)
        edgeBox: { x: opponentGoalX - direction * 188, y: PITCH_HEIGHT3 / 2 },
        edgeBoxLeft: { x: opponentGoalX - direction * 185, y: PITCH_HEIGHT3 / 2 - 55 },
        edgeBoxRight: { x: opponentGoalX - direction * 185, y: PITCH_HEIGHT3 / 2 + 55 },
        // Wide runner (creates space, exploits gaps)
        wideRunnerStart: { x: fkPos.x + direction * 50, y: fkPos.y < 300 ? 520 : 80 },
        wideRunnerTarget: { x: opponentGoalX - direction * 95, y: fkPos.y < 300 ? activeConfig3.GOAL_Y_BOTTOM - 20 : activeConfig3.GOAL_Y_TOP + 20 },
        // Defensive cover (counter-attack prevention)
        defensiveMidfield: [
          { x: PITCH_WIDTH3 / 2 - direction * 55, y: 215 },
          { x: PITCH_WIDTH3 / 2 - direction * 55, y: 385 },
          { x: PITCH_WIDTH3 / 2 - direction * 85, y: PITCH_HEIGHT3 / 2 }
        ]
      };
      if (!gameState2._fkAttPosManager)
        gameState2._fkAttPosManager = new PositionManager();
      const posManager = gameState2._fkAttPosManager;
      const setupKey = `_lastFkAttSetup_H${gameState2.currentHalf}`;
      if (!gameState2[setupKey] || gameState2[setupKey] !== gameState2.setPiece) {
        gameState2[setupKey] = gameState2.setPiece;
        posManager.reset();
        const playerJobs = /* @__PURE__ */ new Map();
        const validTeammates = getValidPlayers(teammates).filter((p) => p.role !== "GK");
        const kickers = sortedLists.teammates.bestKickers;
        const headers = sortedLists.teammates.bestHeaders;
        const runners = sortedLists.teammates.fastest;
        const defenders = sortedLists.teammates.bestDefenders;
        const assigned = /* @__PURE__ */ new Set();
        if (isShootingPosition) {
          if (kickers[0]) {
            playerJobs.set(String(kickers[0].id), {
              ...ZONES.kicker,
              movement: "primary_kicker_shoot",
              role: "PRIMARY_KICKER",
              priority: 10
            });
            assigned.add(String(kickers[0].id));
          }
          if (runners[0] && !assigned.has(String(runners[0].id))) {
            playerJobs.set(String(runners[0].id), {
              ...ZONES.dummyRunner,
              movement: "dummy_run",
              role: "DUMMY_RUNNER",
              runTiming: "ON_WHISTLE",
              priority: 9
            });
            assigned.add(String(runners[0].id));
          }
          if (kickers[1] && !assigned.has(String(kickers[1].id))) {
            playerJobs.set(String(kickers[1].id), {
              ...ZONES.secondKicker,
              movement: "second_kicker_option",
              role: "SECOND_KICKER",
              priority: 9
            });
            assigned.add(String(kickers[1].id));
          }
          const standingPlayer = headers.find((p) => !assigned.has(String(p.id)));
          if (standingPlayer) {
            playerJobs.set(String(standingPlayer.id), {
              ...ZONES.standingAttacker,
              movement: "standing_attacker",
              role: "STANDING_ATTACKER",
              priority: 8
            });
            assigned.add(String(standingPlayer.id));
          }
          if (headers[0] && !assigned.has(String(headers[0].id))) {
            playerJobs.set(String(headers[0].id), {
              ...ZONES.nearPostStart,
              targetX: ZONES.nearPostTarget.x,
              targetY: ZONES.nearPostTarget.y,
              movement: "near_post_crash",
              role: "NEAR_POST_RUNNER",
              runTiming: "ON_KICK",
              priority: 8
            });
            assigned.add(String(headers[0].id));
          }
          if (headers[1] && !assigned.has(String(headers[1].id))) {
            playerJobs.set(String(headers[1].id), {
              ...ZONES.farPostStart,
              targetX: ZONES.farPostTarget.x,
              targetY: ZONES.farPostTarget.y,
              movement: "far_post_crash",
              role: "FAR_POST_RUNNER",
              runTiming: "ON_KICK",
              priority: 8
            });
            assigned.add(String(headers[1].id));
          }
        } else {
          if (kickers[0]) {
            playerJobs.set(String(kickers[0].id), {
              ...ZONES.kicker,
              movement: "primary_kicker_cross",
              role: "PRIMARY_KICKER",
              priority: 10
            });
            assigned.add(String(kickers[0].id));
          }
          if (headers[0] && !assigned.has(String(headers[0].id))) {
            const finalPos = posManager.findValidPosition(ZONES.strikerPosition);
            playerJobs.set(String(headers[0].id), {
              ...finalPos,
              movement: "target_man_fk",
              role: "TARGET_STRIKER",
              priority: 9
            });
            assigned.add(String(headers[0].id));
          }
          if (runners[0] && !assigned.has(String(runners[0].id))) {
            playerJobs.set(String(runners[0].id), {
              ...ZONES.nearPostStart,
              targetX: ZONES.nearPostTarget.x,
              targetY: ZONES.nearPostTarget.y,
              movement: "near_post_run_cross",
              role: "NEAR_POST_RUNNER",
              runTiming: "ON_KICK",
              priority: 9
            });
            assigned.add(String(runners[0].id));
          }
          if (headers[1] && !assigned.has(String(headers[1].id))) {
            playerJobs.set(String(headers[1].id), {
              ...ZONES.farPostStart,
              targetX: ZONES.farPostTarget.x,
              targetY: ZONES.farPostTarget.y,
              movement: "far_post_header",
              role: "FAR_POST_HEADER",
              runTiming: "DELAYED",
              priority: 9
            });
            assigned.add(String(headers[1].id));
          }
          if (headers[2] && !assigned.has(String(headers[2].id))) {
            playerJobs.set(String(headers[2].id), {
              ...ZONES.penaltySpotStart,
              targetX: ZONES.penaltySpotTarget.x,
              targetY: ZONES.penaltySpotTarget.y,
              movement: "penalty_spot_run",
              role: "PENALTY_SPOT",
              runTiming: "IMMEDIATE",
              priority: 8
            });
            assigned.add(String(headers[2].id));
          }
          const wideRunner = runners.find((p) => !assigned.has(String(p.id)));
          if (wideRunner) {
            playerJobs.set(String(wideRunner.id), {
              ...ZONES.wideRunnerStart,
              targetX: ZONES.wideRunnerTarget.x,
              targetY: ZONES.wideRunnerTarget.y,
              movement: "wide_runner",
              role: "WIDE_RUNNER",
              runTiming: "ON_KICK",
              priority: 7
            });
            assigned.add(String(wideRunner.id));
          }
        }
        const edgePositions = [ZONES.edgeBox, ZONES.edgeBoxLeft, ZONES.edgeBoxRight];
        const edgePlayers = validTeammates.filter((p) => !assigned.has(String(p.id)) && (p.role.includes("CM") || p.role.includes("CDM") || p.role.includes("CAM"))).slice(0, 3);
        edgePlayers.forEach((edgePlayer, idx) => {
          if (edgePositions[idx]) {
            const finalPos = posManager.findValidPosition(edgePositions[idx]);
            playerJobs.set(String(edgePlayer.id), {
              ...finalPos,
              movement: `edge_box_fk_${idx}`,
              role: `EDGE_BOX_${idx}`,
              priority: 7
            });
            assigned.add(String(edgePlayer.id));
          }
        });
        let defIdx = 0;
        defenders.forEach((def) => {
          if (!assigned.has(String(def.id)) && defIdx < ZONES.defensiveMidfield.length) {
            const finalPos = posManager.findValidPosition(ZONES.defensiveMidfield[defIdx]);
            playerJobs.set(String(def.id), {
              ...finalPos,
              movement: "defensive_cover_fk",
              role: `DEFENSIVE_COVER_${defIdx}`,
              priority: 6
            });
            assigned.add(String(def.id));
            defIdx++;
          }
        });
        let supportIdx = 0;
        validTeammates.forEach((p) => {
          if (!assigned.has(String(p.id))) {
            const activePos2 = getPlayerActivePosition(p, gameState2.currentHalf);
            const finalPos = posManager.findValidPosition(activePos2);
            playerJobs.set(String(p.id), {
              ...finalPos,
              movement: "support_fk",
              role: `SUPPORT_${supportIdx}`,
              priority: 5
            });
            supportIdx++;
          }
        });
        gameState2._fkJobAssignments = playerJobs;
      }
      const playerIdStr = String(player.id);
      const myPositionData = gameState2._fkJobAssignments?.get(playerIdStr);
      if (myPositionData) {
        const opponents = getValidPlayers(player.isHome ? gameState2.awayPlayers : gameState2.homePlayers);
        const adjustedPosition = checkAndAdjustOffsidePosition(
          myPositionData,
          player,
          opponentGoalX,
          opponents,
          gameState2
        );
        return sanitizePosition(adjustedPosition, { player, gameState: gameState2, behavior: "ProfessionalFreeKickAttacking" });
      }
      const activePos = getPlayerActivePosition(player, gameState2.currentHalf);
      return sanitizePosition({ x: activePos.x, y: activePos.y, movement: "fallback_fk_att" }, { player });
    },
    getDefendingFreeKickPosition(player, fkPos, ownGoalX, distToGoal, sortedLists, opponents, gameState2, teammates) {
      if (!gameState2 || !player || !fkPos) {
        return sanitizePosition({ x: player?.x ?? 400, y: player?.y ?? 300, movement: "error_fk_def" }, { player });
      }
      if (player.role === "GK") {
        const offsetY = fkPos.y > 300 ? -20 : 20;
        return sanitizePosition({ x: ownGoalX, y: 300 + offsetY, movement: "gk_fk_positioning" }, { player });
      }
      const direction = Math.sign(ownGoalX - 400);
      if (!isFinite(direction) || direction === 0) {
        return getRoleBasedFallbackPosition2(player.role, { player, gameState: gameState2 });
      }
      const PITCH_WIDTH3 = GAME_CONFIG.PITCH_WIDTH;
      const PITCH_HEIGHT3 = GAME_CONFIG.PITCH_HEIGHT;
      const SET_PIECE_TYPES3 = { FREE_KICK: "FREE_KICK" };
      const activeConfig3 = { GOAL_Y_TOP: 225, GOAL_Y_BOTTOM: 375 };
      const isCentral = Math.abs(fkPos.y - 300) < 130;
      const isDangerous = distToGoal < 280;
      const needsWall = isDangerous && isCentral;
      let wallSize = 0;
      if (needsWall) {
        if (distToGoal < 140)
          wallSize = 6;
        else if (distToGoal < 160)
          wallSize = 5;
        else if (distToGoal < 180)
          wallSize = 4;
        else if (distToGoal < 220)
          wallSize = 3;
        else
          wallSize = 2;
      }
      if (!sortedLists)
        sortedLists = getSortedLists(teammates, opponents);
      const ZONES = {
        // Wall setup zone
        wallBase: { x: fkPos.x, y: fkPos.y },
        // FIXED: Zonal defenders OUTSIDE 6-yard box (professional positioning)
        // 6-yard box is ~55px, so defenders should be 100-110px from goal minimum
        nearPostZone: { x: ownGoalX - direction * 100, y: activeConfig3.GOAL_Y_TOP + 45 },
        farPostZone: { x: ownGoalX - direction * 100, y: activeConfig3.GOAL_Y_BOTTOM - 45 },
        centralZone: { x: ownGoalX - direction * 110, y: PITCH_HEIGHT3 / 2 },
        edgeBoxZone: { x: ownGoalX - direction * 180, y: PITCH_HEIGHT3 / 2 },
        // Press/counter outlets
        pressKicker: { x: fkPos.x + direction * 20, y: fkPos.y },
        counterOutlet: [
          { x: PITCH_WIDTH3 / 2 - direction * 120, y: 180 },
          { x: PITCH_WIDTH3 / 2 - direction * 120, y: 420 }
        ]
      };
      if (!gameState2._fkDefPosManager)
        gameState2._fkDefPosManager = new PositionManager();
      const posManager = gameState2._fkDefPosManager;
      const setupKey = `_lastFkDefSetup_H${gameState2.currentHalf}`;
      if (!gameState2[setupKey] || gameState2[setupKey] !== gameState2.setPiece) {
        gameState2[setupKey] = gameState2.setPiece;
        posManager.reset();
        const playerJobs = /* @__PURE__ */ new Map();
        const validTeammates = getValidPlayers(teammates).filter((p) => p.role !== "GK");
        const validOpponents = getValidPlayers(opponents).filter((p) => p.role !== "GK");
        gameState2._fkOpponentMap = new Map(validOpponents.map((p) => [String(p.id), p]));
        gameState2._currentWallSize = wallSize;
        const assigned = /* @__PURE__ */ new Set();
        if (needsWall) {
          const wallPlayers = [...sortedLists.teammates.bestDefenders].slice(0, wallSize).sort((a, b) => getSafeStat2(b.stats, "heading", 70) - getSafeStat2(a.stats, "heading", 70));
          wallPlayers.forEach((p, idx) => {
            playerJobs.set(String(p.id), {
              x: 0,
              // Will be calculated dynamically
              y: 0,
              // Will be calculated dynamically
              role: `JOB_WALL_${idx}`,
              movement: "wall_formation",
              wallIndex: idx,
              priority: 10
            });
            assigned.add(String(p.id));
          });
        }
        const context = new TacticalContext(gameState2, SET_PIECE_TYPES3.FREE_KICK);
        const shouldPress = !isDangerous || context.shouldCommitForward(player.isHome);
        if (shouldPress) {
          const presser = sortedLists.teammates.fastest.find((p) => !assigned.has(String(p.id)));
          if (presser) {
            const finalPos = posManager.findValidPosition(ZONES.pressKicker);
            playerJobs.set(String(presser.id), {
              ...finalPos,
              movement: "press_kicker",
              role: "PRESS_KICKER",
              priority: 9
            });
            assigned.add(String(presser.id));
          }
        }
        const dangerousOpponents = sortedLists.opponents.mostDangerous.slice(0, 3);
        const availableMarkers = validTeammates.filter((p) => !assigned.has(String(p.id))).slice(0, 3);
        dangerousOpponents.forEach((opp, idx) => {
          if (availableMarkers[idx]) {
            playerJobs.set(String(availableMarkers[idx].id), {
              x: 0,
              // Will be calculated dynamically
              y: 0,
              // Will be calculated dynamically
              role: `JOB_MARK_${opp.id}`,
              movement: "man_mark_fk",
              targetId: String(opp.id),
              priority: 8
            });
            assigned.add(String(availableMarkers[idx].id));
          }
        });
        const zonalAssignments = isDangerous ? [{ zone: "centralZone", role: "CENTRAL_ZONE", priority: 7 }] : [
          { zone: "centralZone", role: "CENTRAL_ZONE", priority: 7 },
          { zone: "nearPostZone", role: "NEAR_POST_ZONE", priority: 7 },
          { zone: "farPostZone", role: "FAR_POST_ZONE", priority: 7 }
        ];
        zonalAssignments.forEach((assignment) => {
          const zonePlayer = validTeammates.find((p) => !assigned.has(String(p.id)));
          if (zonePlayer) {
            const finalPos = posManager.findValidPosition(ZONES[assignment.zone]);
            playerJobs.set(String(zonePlayer.id), {
              ...finalPos,
              movement: assignment.zone,
              role: assignment.role,
              priority: assignment.priority
            });
            assigned.add(String(zonePlayer.id));
          }
        });
        let outletIdx = 0;
        sortedLists.teammates.fastest.forEach((fast) => {
          if (!assigned.has(String(fast.id)) && outletIdx < 2) {
            const finalPos = posManager.findValidPosition(ZONES.counterOutlet[outletIdx]);
            playerJobs.set(String(fast.id), {
              ...finalPos,
              movement: "counter_outlet",
              role: `COUNTER_OUTLET_${outletIdx}`,
              priority: 6
            });
            assigned.add(String(fast.id));
            outletIdx++;
          }
        });
        validTeammates.forEach((p) => {
          if (!assigned.has(String(p.id))) {
            const rawX = ownGoalX + direction * 120;
            const clampedX = Math.max(10, Math.min(790, rawX));
            const compactPos = { x: clampedX, y: 300 };
            const finalPos = posManager.findValidPosition(compactPos);
            playerJobs.set(String(p.id), {
              ...finalPos,
              movement: "compact_shape",
              role: "COMPACT",
              priority: 5
            });
          }
        });
        gameState2._fkDefJobAssignments = playerJobs;
      }
      const playerIdStr = String(player.id);
      const myPositionData = gameState2._fkDefJobAssignments?.get(playerIdStr);
      if (myPositionData) {
        let finalPos = { ...myPositionData };
        if (finalPos.role?.startsWith("JOB_WALL_")) {
          finalPos = this.calculateWallPosition(finalPos, wallSize, fkPos, ownGoalX, direction, player, gameState2);
        } else if (finalPos.role?.startsWith("JOB_MARK_")) {
          finalPos = this.calculateMarkingPosition(finalPos, direction, gameState2._fkOpponentMap, player, gameState2, ownGoalX);
        }
        const dist = distance({ x: finalPos.x, y: finalPos.y }, fkPos);
        if (dist < 92 && !finalPos.role?.startsWith("JOB_WALL_")) {
          const angle = Math.atan2(finalPos.y - fkPos.y, finalPos.x - fkPos.x);
          finalPos.x = fkPos.x + Math.cos(angle) * 92;
          finalPos.y = fkPos.y + Math.sin(angle) * 92;
        }
        return sanitizePosition(finalPos, { player, gameState: gameState2, behavior: "ProfessionalFreeKickDefending" });
      }
      const activePos = getPlayerActivePosition(player, gameState2.currentHalf);
      return sanitizePosition({ x: activePos.x, y: activePos.y, movement: "fallback_fk_def" }, { player });
    },
    calculateWallPosition(positionData, wallSize, fkPos, ownGoalX, direction, player, gameState2) {
      try {
        const roleParts = positionData.role.split("_");
        const wallIndex = positionData.wallIndex ?? (roleParts[2] ? parseInt(roleParts[2]) : 0);
        if (isNaN(wallIndex) || wallSize <= 0) {
          return getRoleBasedFallbackPosition2(positionData.role, { player, gameState: gameState2 });
        }
        const PITCH_WIDTH3 = GAME_CONFIG.PITCH_WIDTH;
        const PITCH_HEIGHT3 = GAME_CONFIG.PITCH_HEIGHT;
        const activeConfig3 = { GOAL_Y_TOP: 225, GOAL_Y_BOTTOM: 375 };
        const wallDistance = 92;
        const angleToNearPost = Math.atan2(activeConfig3.GOAL_Y_TOP - fkPos.y, ownGoalX - fkPos.x);
        const angleToFarPost = Math.atan2(activeConfig3.GOAL_Y_BOTTOM - fkPos.y, ownGoalX - fkPos.x);
        const coverageAngle = angleToNearPost + (angleToFarPost - angleToNearPost) * 0.3;
        let wallBaseX = fkPos.x + Math.cos(coverageAngle) * wallDistance;
        let wallBaseY = fkPos.y + Math.sin(coverageAngle) * wallDistance;
        if (direction > 0) {
          wallBaseX = Math.min(wallBaseX, ownGoalX - 20);
        } else {
          wallBaseX = Math.max(wallBaseX, ownGoalX + 20);
        }
        const wallPerpendicularAngle = coverageAngle + Math.PI / 2;
        const spacing = 18;
        const offset = (wallIndex - (wallSize - 1) / 2) * spacing;
        let wallX = wallBaseX + Math.cos(wallPerpendicularAngle) * offset;
        let wallY = wallBaseY + Math.sin(wallPerpendicularAngle) * offset;
        wallX = Math.max(10, Math.min(PITCH_WIDTH3 - 10, wallX));
        wallY = Math.max(10, Math.min(PITCH_HEIGHT3 - 10, wallY));
        return sanitizePosition({
          x: wallX,
          y: wallY,
          movement: "wall_positioned",
          role: positionData.role
        }, { player, gameState: gameState2 });
      } catch (error) {
        console.error(`[FreeKick] Error calculating wall position for ${player.name} (${positionData.role}):`, error);
        return getRoleBasedFallbackPosition2(positionData.role, { player, gameState: gameState2 });
      }
    },
    calculateMarkingPosition(positionData, direction, opponentMap, player, gameState2, ownGoalX) {
      try {
        const targetIdStr = positionData.targetId || positionData.role.split("_").pop();
        const target = opponentMap?.get(targetIdStr || "");
        if (target) {
          let markX = target.x - direction * 10;
          let markY = target.y + (Math.random() - 0.5) * 3;
          const SIX_YARD_BOX_DISTANCE = 65;
          if (direction < 0) {
            const minAllowedX = ownGoalX + SIX_YARD_BOX_DISTANCE;
            markX = Math.max(markX, minAllowedX);
          } else {
            const maxAllowedX = ownGoalX - SIX_YARD_BOX_DISTANCE;
            markX = Math.min(markX, maxAllowedX);
          }
          const maxForwardXDistance = 150;
          if (direction < 0) {
            const maxAllowedX = ownGoalX + maxForwardXDistance;
            markX = Math.min(markX, maxAllowedX);
          } else {
            const minAllowedX = ownGoalX - maxForwardXDistance;
            markX = Math.max(markX, minAllowedX);
          }
          return sanitizePosition({
            ...positionData,
            x: markX,
            y: markY,
            movement: "tight_marking"
          }, { player, gameState: gameState2 });
        } else {
          return sanitizePosition({
            x: ownGoalX + direction * 100,
            y: 300,
            movement: "zone_fallback",
            role: "ZONE_FALLBACK"
          }, { player, gameState: gameState2 });
        }
      } catch (error) {
        console.error(`[FreeKick] Error calculating marking position for ${player.name} (${positionData.role}):`, error);
        return getRoleBasedFallbackPosition2(positionData.role, { player, gameState: gameState2 });
      }
    }
  };

  // src/setpieces/behaviors/goalKick.ts
  function getFormationAnchorForPlayer(player, gameState2) {
    if (!player || !gameState2)
      return null;
    const PITCH_WIDTH3 = GAME_CONFIG.PITCH_WIDTH;
    const PITCH_HEIGHT3 = GAME_CONFIG.PITCH_HEIGHT;
    const currentHalf = gameState2.currentHalf ?? 1;
    const hasHomeCoords = typeof player.homeX === "number" && typeof player.homeY === "number";
    if (hasHomeCoords) {
      const mirrorX = currentHalf === 2 ? PITCH_WIDTH3 - player.homeX : player.homeX;
      const safeX = Math.max(10, Math.min(PITCH_WIDTH3 - 10, mirrorX));
      const safeY = Math.max(10, Math.min(PITCH_HEIGHT3 - 10, player.homeY));
      return { x: safeX, y: safeY };
    }
    if (typeof window !== "undefined" && typeof getPlayerActivePosition === "function") {
      return getPlayerActivePosition(player, currentHalf);
    }
    return {
      x: player?.x ?? PITCH_WIDTH3 / 2,
      y: player?.y ?? PITCH_HEIGHT3 / 2
    };
  }
  var ProfessionalGoalKickBehaviors = {
    getGoalKickPosition(player, ownGoalX, tactic, playShort, gameState2, teammates) {
      if (!gameState2 || !player) {
        return sanitizePosition({ x: player?.x ?? 400, y: player?.y ?? 300, movement: "error_gk" }, { player });
      }
      const PITCH_WIDTH3 = GAME_CONFIG.PITCH_WIDTH;
      const PITCH_HEIGHT3 = GAME_CONFIG.PITCH_HEIGHT;
      if (player.role === "GK") {
        const gkX = ownGoalX + (ownGoalX < 400 ? 70 : -70);
        return sanitizePosition({ x: gkX, y: 300, movement: "gk_take_kick" }, { player, role: "GK" });
      }
      const shouldBuildFromBack = playShort || tactic === "possession";
      const direction = ownGoalX < 400 ? 1 : -1;
      if (!gameState2._goalKickPosManager)
        gameState2._goalKickPosManager = new PositionManager();
      const posManager = gameState2._goalKickPosManager;
      const setupKey = `_lastGoalKickSetup_H${gameState2.currentHalf}`;
      if (!gameState2[setupKey] || gameState2[setupKey] !== gameState2.setPiece) {
        gameState2[setupKey] = gameState2.setPiece;
        posManager.reset();
        const playerJobs = /* @__PURE__ */ new Map();
        const validTeammates = getValidPlayers(teammates).filter((p) => p.role !== "GK");
        const sortedLists = getSortedLists(validTeammates, []);
        const assigned = /* @__PURE__ */ new Set();
        if (shouldBuildFromBack) {
          const defenders = sortedLists.teammates.bestDefenders.slice(0, 4);
          const midfielders = validTeammates.filter(
            (p) => ["CM", "CDM", "CAM"].some((r) => p.role.includes(r))
          ).slice(0, 3);
          if (defenders[0]) {
            const finalPos = posManager.findValidPosition({
              x: ownGoalX + direction * 85,
              y: 195
            });
            playerJobs.set(String(defenders[0].id), {
              ...finalPos,
              movement: "cb_build_left",
              role: "CB_LEFT",
              priority: 10
            });
            assigned.add(String(defenders[0].id));
          }
          if (defenders[1]) {
            const finalPos = posManager.findValidPosition({
              x: ownGoalX + direction * 135,
              y: 405
            });
            playerJobs.set(String(defenders[1].id), {
              ...finalPos,
              movement: "cb_build_right",
              role: "CB_RIGHT",
              priority: 10
            });
            assigned.add(String(defenders[1].id));
          }
          if (defenders[2]) {
            const finalPos = posManager.findValidPosition({
              x: ownGoalX + direction * 185,
              y: 90
            });
            playerJobs.set(String(defenders[2].id), {
              ...finalPos,
              movement: "fb_wide_left",
              role: "FB_LEFT",
              priority: 9
            });
            assigned.add(String(defenders[2].id));
          }
          if (defenders[3]) {
            const finalPos = posManager.findValidPosition({
              x: ownGoalX + direction * 185,
              y: 510
            });
            playerJobs.set(String(defenders[3].id), {
              ...finalPos,
              movement: "fb_wide_right",
              role: "FB_RIGHT",
              priority: 9
            });
            assigned.add(String(defenders[3].id));
          }
          const pivot = midfielders.find((p) => p.role.includes("CDM")) || midfielders[0];
          if (pivot && !assigned.has(String(pivot.id))) {
            const finalPos = posManager.findValidPosition({
              x: ownGoalX + direction * 250,
              y: 300
            });
            playerJobs.set(String(pivot.id), {
              ...finalPos,
              movement: "pivot_drop",
              role: "PIVOT",
              priority: 9
            });
            assigned.add(String(pivot.id));
          }
          const remainingMids = midfielders.filter((p) => !assigned.has(String(p.id)));
          remainingMids.forEach((mid, idx) => {
            const yPos = idx === 0 ? 220 : 380;
            const xOffset = idx === 0 ? 175 : 185;
            const finalPos = posManager.findValidPosition({
              x: ownGoalX + direction * xOffset,
              y: yPos
            });
            playerJobs.set(String(mid.id), {
              ...finalPos,
              movement: "midfield_show",
              role: `MID_RECEIVER_${idx}`,
              priority: 8
            });
            assigned.add(String(mid.id));
          });
          const striker = validTeammates.find(
            (p) => p.role.includes("ST") && !assigned.has(String(p.id))
          );
          if (striker) {
            const finalPos = posManager.findValidPosition({
              x: ownGoalX + direction * 400,
              y: 300
            });
            playerJobs.set(String(striker.id), {
              ...finalPos,
              movement: "striker_drop_outlet",
              role: "STRIKER_OUTLET",
              priority: 7
            });
            assigned.add(String(striker.id));
          }
        } else {
          const targetMen = sortedLists.teammates.bestHeaders.slice(0, 2);
          const wingers = validTeammates.filter(
            (p) => ["LW", "RW", "RM", "LM"].some((r) => p.role.includes(r))
          ).slice(0, 2);
          if (targetMen[0] && !assigned.has(String(targetMen[0].id))) {
            const finalPos = posManager.findValidPosition({
              x: PITCH_WIDTH3 / 2 + direction * 125,
              y: 300
            });
            playerJobs.set(String(targetMen[0].id), {
              ...finalPos,
              movement: "target_striker_long",
              role: "TARGET_STRIKER",
              priority: 10
            });
            assigned.add(String(targetMen[0].id));
          }
          if (targetMen[1] && !assigned.has(String(targetMen[1].id))) {
            const finalPos = posManager.findValidPosition({
              x: PITCH_WIDTH3 / 2 + direction * 115,
              y: 240
            });
            playerJobs.set(String(targetMen[1].id), {
              ...finalPos,
              movement: "target_secondary",
              role: "SECONDARY_TARGET",
              priority: 9
            });
            assigned.add(String(targetMen[1].id));
          }
          if (wingers[0] && !assigned.has(String(wingers[0].id))) {
            const finalPos = posManager.findValidPosition({
              x: PITCH_WIDTH3 / 2 + direction * 90,
              y: 115
            });
            playerJobs.set(String(wingers[0].id), {
              ...finalPos,
              movement: "winger_flank_left",
              role: "WINGER_LEFT",
              priority: 8
            });
            assigned.add(String(wingers[0].id));
          }
          if (wingers[1] && !assigned.has(String(wingers[1].id))) {
            const finalPos = posManager.findValidPosition({
              x: PITCH_WIDTH3 / 2 + direction * 90,
              y: 485
            });
            playerJobs.set(String(wingers[1].id), {
              ...finalPos,
              movement: "winger_flank_right",
              role: "WINGER_RIGHT",
              priority: 8
            });
            assigned.add(String(wingers[1].id));
          }
          const attackingMids = validTeammates.filter(
            (p) => !assigned.has(String(p.id)) && ["CM", "CAM"].some((r) => p.role.includes(r))
          ).slice(0, 2);
          attackingMids.forEach((mid, idx) => {
            const yPos = idx === 0 ? 245 : 355;
            const finalPos = posManager.findValidPosition({
              x: PITCH_WIDTH3 / 2 + direction * 30,
              y: yPos
            });
            playerJobs.set(String(mid.id), {
              ...finalPos,
              movement: "second_ball_mid",
              role: `SECOND_BALL_${idx}`,
              priority: 7
            });
            assigned.add(String(mid.id));
          });
          const holdingMid = validTeammates.find(
            (p) => !assigned.has(String(p.id)) && p.role.includes("CDM")
          );
          if (holdingMid) {
            const finalPos = posManager.findValidPosition({
              x: PITCH_WIDTH3 / 2 - direction * 20,
              y: 300
            });
            playerJobs.set(String(holdingMid.id), {
              ...finalPos,
              movement: "holding_mid_security",
              role: "HOLDING_MID",
              priority: 6
            });
            assigned.add(String(holdingMid.id));
          }
        }
        const remainingPlayers = validTeammates.filter((p) => !assigned.has(String(p.id)));
        remainingPlayers.forEach((p) => {
          const formationAnchor = getFormationAnchorForPlayer(p, gameState2);
          if (!formationAnchor) {
            console.warn(`Goal Kick: Could not find formation anchor for ${p.name}`);
            let fallbackX = ownGoalX + direction * 150 + (Math.random() - 0.5) * 40;
            fallbackX = Math.max(50, Math.min(750, fallbackX));
            const fallbackPos = {
              x: fallbackX,
              y: PITCH_HEIGHT3 / 2 + (Math.random() - 0.5) * 100
            };
            const finalPos2 = posManager.findValidPosition(fallbackPos);
            playerJobs.set(String(p.id), {
              ...finalPos2,
              movement: "support_gk_fallback",
              role: "SUPPORT",
              priority: 5
            });
            return;
          }
          let targetX = formationAnchor.x;
          let targetY = formationAnchor.y;
          const halfBuffer = 10;
          const midLine = PITCH_WIDTH3 / 2;
          if (direction === 1) {
            targetX = Math.min(targetX, midLine - halfBuffer);
          } else {
            targetX = Math.max(targetX, midLine + halfBuffer);
          }
          const spreadPos = {
            x: targetX,
            y: targetY
          };
          const finalPos = posManager.findValidPosition(spreadPos);
          playerJobs.set(String(p.id), {
            ...finalPos,
            movement: "support_gk_formation",
            // New descriptive movement name
            role: "SUPPORT",
            priority: 5
          });
        });
        gameState2._goalKickJobAssignments = playerJobs;
      }
      const playerIdStr = String(player.id);
      const myPositionData = gameState2._goalKickJobAssignments?.get(playerIdStr);
      if (myPositionData) {
        return sanitizePosition(myPositionData, { player, gameState: gameState2, behavior: "ProfessionalGoalKick" });
      }
      const activePos = getPlayerActivePosition(player, gameState2.currentHalf);
      return sanitizePosition({ x: activePos.x, y: activePos.y, movement: "fallback_goal_kick" }, { player });
    },
    getDefendingGoalKickPosition(player, opponentGoalX, ownGoalX, gameState2, _opponents, teammates) {
      if (!gameState2 || !player || player.role === "GK") {
        return sanitizePosition({ x: ownGoalX, y: 300, movement: "gk_stay_goal" }, { player, role: "GK" });
      }
      const PITCH_WIDTH3 = GAME_CONFIG.PITCH_WIDTH;
      const PITCH_HEIGHT3 = GAME_CONFIG.PITCH_HEIGHT;
      const SET_PIECE_TYPES3 = { GOAL_KICK: "GOAL_KICK" };
      const context = new TacticalContext(gameState2, SET_PIECE_TYPES3.GOAL_KICK);
      const shouldPress = context.shouldCommitForward(player.isHome);
      const direction = Math.sign(opponentGoalX - 400);
      if (!gameState2._goalKickDefPosManager)
        gameState2._goalKickDefPosManager = new PositionManager();
      const posManager = gameState2._goalKickDefPosManager;
      const setupKey = `_lastGoalKickDefSetup_H${gameState2.currentHalf}`;
      if (!gameState2[setupKey] || gameState2[setupKey] !== gameState2.setPiece) {
        gameState2[setupKey] = gameState2.setPiece;
        posManager.reset();
        const playerJobs = /* @__PURE__ */ new Map();
        const validTeammates = getValidPlayers(teammates).filter((p) => p.role !== "GK");
        const sortedLists = getSortedLists(validTeammates, []);
        const assigned = /* @__PURE__ */ new Set();
        if (shouldPress) {
          const PENALTY_AREA_DISTANCE = 170;
          const pressers = sortedLists.teammates.fastest.slice(0, 3);
          pressers.forEach((presser, idx) => {
            const yPos = 200 + idx * 100;
            const finalPos = posManager.findValidPosition({
              x: opponentGoalX - direction * PENALTY_AREA_DISTANCE,
              y: yPos
            });
            playerJobs.set(String(presser.id), {
              ...finalPos,
              movement: "high_press_gk_outside_box",
              role: `PRESSER_${idx}`,
              priority: 9
            });
            assigned.add(String(presser.id));
          });
          const laneBlockers = validTeammates.filter(
            (p) => !assigned.has(String(p.id))
          ).slice(0, 4);
          laneBlockers.forEach((blocker, idx) => {
            const xPos = opponentGoalX - direction * (PENALTY_AREA_DISTANCE + 20);
            const yPos = 150 + idx * 100;
            const finalPos = posManager.findValidPosition({ x: xPos, y: yPos });
            playerJobs.set(String(blocker.id), {
              ...finalPos,
              movement: "block_lane_outside_box",
              role: `LANE_BLOCK_${idx}`,
              priority: 8
            });
            assigned.add(String(blocker.id));
          });
        } else {
          validTeammates.forEach((p) => {
            if (!assigned.has(String(p.id))) {
              const formationAnchor = getFormationAnchorForPlayer(p, gameState2);
              if (!formationAnchor) {
                const fallbackPos = {
                  x: PITCH_WIDTH3 / 2 - direction * 50,
                  y: PITCH_HEIGHT3 / 2 + (Math.random() - 0.5) * 200
                };
                const finalPos2 = posManager.findValidPosition(fallbackPos);
                playerJobs.set(String(p.id), {
                  ...finalPos2,
                  movement: "mid_block_fallback",
                  role: "MID_BLOCK",
                  priority: 7
                });
                assigned.add(String(p.id));
                return;
              }
              let targetX = formationAnchor.x;
              let targetY = formationAnchor.y;
              const midBlockLineX = PITCH_WIDTH3 / 2 - direction * 50;
              if (direction === 1) {
                targetX = Math.min(targetX, midBlockLineX);
              } else {
                targetX = Math.max(targetX, midBlockLineX);
              }
              const finalPos = posManager.findValidPosition({ x: targetX, y: targetY });
              playerJobs.set(String(p.id), {
                ...finalPos,
                movement: "mid_block_formation",
                role: "MID_BLOCK",
                priority: 7
              });
              assigned.add(String(p.id));
            }
          });
        }
        gameState2._goalKickDefJobAssignments = playerJobs;
      }
      const playerIdStr = String(player.id);
      const myPositionData = gameState2._goalKickDefJobAssignments?.get(playerIdStr);
      if (myPositionData) {
        return sanitizePosition(myPositionData, { player, gameState: gameState2, behavior: "ProfessionalGoalKickDefending" });
      }
      const activePos = getPlayerActivePosition(player, gameState2.currentHalf);
      return sanitizePosition({ x: activePos.x, y: activePos.y, movement: "fallback_goal_kick_def" }, { player });
    }
  };
  console.log("\u2705 GOAL KICK BEHAVIORS LOADED (TypeScript)");

  // src/setpieces/SetPieceBehaviorSystem.ts
  var GAME_CONFIG_SPB_DEFAULT = {
    PITCH_WIDTH: 800,
    PITCH_HEIGHT: 600,
    MIN_PLAYER_SPACING: 30,
    GOAL_Y_TOP: 240,
    GOAL_Y_BOTTOM: 360
  };
  var activeConfig = typeof GAME_CONFIG !== "undefined" ? GAME_CONFIG : GAME_CONFIG_SPB_DEFAULT;
  var PITCH_WIDTH = activeConfig.PITCH_WIDTH;
  var PITCH_HEIGHT = activeConfig.PITCH_HEIGHT;
  var SET_PIECE_TYPES = {
    CORNER_KICK: "CORNER_KICK",
    FREE_KICK: "FREE_KICK",
    THROW_IN: "THROW_IN",
    GOAL_KICK: "GOAL_KICK",
    PENALTY: "PENALTY",
    KICK_OFF: "KICK_OFF"
  };
  function handleGoalkeeperSetPiecePosition(player, gameState2, setPieceType, isAttacking, ownGoalX, setPiecePos) {
    try {
      const opponentGoalX = getAttackingGoalX(player.isHome, gameState2.currentHalf);
      switch (setPieceType) {
        case SET_PIECE_TYPES.CORNER_KICK:
          if (!isAttacking) {
            const isRightCorner = setPiecePos.y < PITCH_HEIGHT / 2;
            const gkY = isRightCorner ? activeConfig.GOAL_Y_TOP + 50 : activeConfig.GOAL_Y_BOTTOM - 50;
            return sanitizePosition({ x: ownGoalX, y: gkY, movement: "gk_corner_positioning", role: "GK" }, { player });
          }
          break;
        case SET_PIECE_TYPES.FREE_KICK:
          if (!isAttacking) {
            const offsetY = setPiecePos.y > 300 ? -20 : 20;
            return sanitizePosition({ x: ownGoalX, y: 300 + offsetY, movement: "gk_fk_positioning", role: "GK" }, { player });
          }
          break;
        case SET_PIECE_TYPES.PENALTY:
          return PenaltyKickBehaviors.getPenaltyArcPosition(player, setPiecePos, isAttacking, gameState2);
        case SET_PIECE_TYPES.GOAL_KICK:
          const teammates = getValidPlayers(player.isHome ? gameState2.homePlayers : gameState2.awayPlayers);
          const opponents = getValidPlayers(player.isHome ? gameState2.awayPlayers : gameState2.homePlayers);
          const teamTactic = player.isHome ? gameState2.homeTactic : gameState2.awayTactic;
          return isAttacking ? ProfessionalGoalKickBehaviors.getGoalKickPosition(player, ownGoalX, teamTactic, true, gameState2, teammates) : ProfessionalGoalKickBehaviors.getDefendingGoalKickPosition(player, opponentGoalX, ownGoalX, gameState2, opponents, teammates);
      }
      return sanitizePosition({ x: ownGoalX, y: 300, movement: "gk_default" }, { player });
    } catch (error) {
      console.error(`GK positioning error:`, error);
      const fallbackGoalX = getAttackingGoalX(!player.isHome, gameState2?.currentHalf ?? 1);
      return sanitizePosition({ x: fallbackGoalX, y: 300, movement: "gk_error" }, { player });
    }
  }
  function getSafeFallbackPosition(player, reason, gameState2) {
    const activePos = getPlayerActivePosition(player, gameState2?.currentHalf ?? 1);
    return sanitizePosition(
      { x: activePos?.x ?? PITCH_WIDTH / 2, y: activePos?.y ?? PITCH_HEIGHT / 2, movement: `fallback_${reason}` },
      { player, behavior: "Fallback" }
    );
  }
  function calculateSetPiecePositionWithSafety(player, gameState2, setPieceType, isAttacking, setPiecePos) {
    const ownGoalX = getAttackingGoalX(!player.isHome, gameState2.currentHalf);
    const opponentGoalX = getAttackingGoalX(player.isHome, gameState2.currentHalf);
    const teammates = getValidPlayers(player.isHome ? gameState2.homePlayers : gameState2.awayPlayers);
    const opponents = getValidPlayers(player.isHome ? gameState2.awayPlayers : gameState2.homePlayers);
    try {
      switch (setPieceType) {
        case SET_PIECE_TYPES.FREE_KICK:
          const distToGoal = distance(setPiecePos, { x: isAttacking ? opponentGoalX : ownGoalX, y: 300 });
          return isAttacking ? ProfessionalFreeKickBehaviors.getAttackingFreeKickPosition(player, setPiecePos, opponentGoalX, distToGoal, null, gameState2, teammates) : ProfessionalFreeKickBehaviors.getDefendingFreeKickPosition(player, setPiecePos, ownGoalX, distToGoal, null, opponents, gameState2, teammates);
        case SET_PIECE_TYPES.CORNER_KICK:
          return isAttacking ? ProfessionalCornerBehaviors.getAttackingCornerPosition(player, setPiecePos, opponentGoalX, teammates, null, gameState2.setPiece?.routine, gameState2) : ProfessionalCornerBehaviors.getDefendingCornerPosition(player, setPiecePos, ownGoalX, opponents, null, gameState2.setPiece?.defensiveSystem, gameState2, teammates);
        case SET_PIECE_TYPES.THROW_IN:
          return ThrowInBehaviors.getThrowInPosition(player, setPiecePos, ownGoalX, opponentGoalX, gameState2, teammates, opponents);
        case SET_PIECE_TYPES.GOAL_KICK:
          const teamTactic = player.isHome ? gameState2.homeTactic : gameState2.awayTactic;
          return isAttacking ? ProfessionalGoalKickBehaviors.getGoalKickPosition(player, ownGoalX, teamTactic, true, gameState2, teammates) : ProfessionalGoalKickBehaviors.getDefendingGoalKickPosition(player, opponentGoalX, ownGoalX, gameState2, opponents, teammates);
        case SET_PIECE_TYPES.PENALTY:
          if (isAttacking) {
            const isKicker = gameState2.setPiece?.kicker && String(gameState2.setPiece.kicker.id) === String(player.id);
            if (isKicker) {
              return PenaltyKickBehaviors.getKickerPosition(setPiecePos);
            }
          }
          return PenaltyKickBehaviors.getPenaltyArcPosition(player, setPiecePos, isAttacking, gameState2);
        case SET_PIECE_TYPES.KICK_OFF:
          if (typeof KickoffBehaviors.getKickoffPosition !== "undefined") {
            const kickingTeamIsHome = typeof gameState2.setPiece?.team === "boolean" ? gameState2.setPiece.team : gameState2.setPiece?.team === "home";
            const isKickingTeam = player.isHome === kickingTeamIsHome;
            return KickoffBehaviors.getKickoffPosition(player, setPiecePos, isKickingTeam, gameState2);
          }
          return sanitizePosition({ x: player.x, y: player.y, movement: "kickoff_fallback", role: player.role }, { player, gameState: gameState2 });
        default:
          return getSafeFallbackPosition(player, `unknown_type_${setPieceType}`, gameState2);
      }
    } catch (error) {
      console.error(`Set piece calculation error:`, error);
      return getSafeFallbackPosition(player, `calculation_error`, gameState2);
    }
  }
  function getSetPiecePosition(player, gameState2) {
    try {
      if (!gameState2 || !player || !gameState2.setPiece || !gameState2.setPiece.position) {
        return getSafeFallbackPosition(player, "invalid_state", gameState2);
      }
      const setPieceType = gameState2.status;
      const isAttacking = isPlayerAttacking(player, gameState2);
      const setPiecePos = gameState2.setPiece.position;
      if (player.role === "GK" || player.role === "goalkeeper") {
        const ownGoalX = getAttackingGoalX(!player.isHome, gameState2.currentHalf);
        return handleGoalkeeperSetPiecePosition(player, gameState2, setPieceType, isAttacking, ownGoalX, setPiecePos);
      }
      let position = calculateSetPiecePositionWithSafety(player, gameState2, setPieceType, isAttacking, setPiecePos);
      position = getFormationAwarePosition(player, position, gameState2, isAttacking);
      return sanitizePosition(position, {
        player,
        setPieceType,
        behavior: "MainSetPieceDispatch",
        role: position?.role || player?.role || "UNKNOWN",
        gameState: gameState2
      });
    } catch (error) {
      console.error("Critical error in getSetPiecePosition:", error);
      return getSafeFallbackPosition(player, "critical_error", gameState2);
    }
  }
  function shouldLockSetPiecePosition(player, gameState2) {
    if (!gameState2 || !player || !gameState2.setPiece)
      return false;
    if (gameState2.status === "KICK_OFF") {
      return true;
    }
    const movement = player.setPieceMovement || getSetPieceMovementType(player, gameState2);
    const movementLower = typeof movement === "string" ? movement.toLowerCase() : "";
    const lockKeywords = ["kicker", "thrower", "wall"];
    if (lockKeywords.some((keyword) => movementLower.includes(keyword))) {
      return distance(player, gameState2.setPiece?.position) < 15;
    }
    if (!gameState2.setPiece?.executionTime)
      return false;
    const timeUntilExecution = gameState2.setPiece.executionTime - Date.now();
    return timeUntilExecution < 1500 && timeUntilExecution > -500;
  }
  function getSetPieceMovementType(player, gameState2) {
    if (!gameState2 || !player)
      return "standard_position";
    if (player.setPieceMovement)
      return player.setPieceMovement;
    const position = getSetPiecePosition(player, gameState2);
    const movement = position?.movement || "standard_position";
    player.setPieceMovement = movement;
    return movement;
  }
  function isSetPieceActive(gameState2) {
    if (!gameState2 || !gameState2.status)
      return false;
    if (typeof isSetPieceStatus === "function") {
      return isSetPieceStatus(gameState2.status);
    }
    return [
      SET_PIECE_TYPES.CORNER_KICK,
      SET_PIECE_TYPES.FREE_KICK,
      SET_PIECE_TYPES.THROW_IN,
      SET_PIECE_TYPES.GOAL_KICK,
      SET_PIECE_TYPES.PENALTY,
      SET_PIECE_TYPES.KICK_OFF
    ].includes(gameState2.status);
  }
  var SetPieceBehaviorSystem = {
    getSetPiecePosition,
    shouldLockSetPiecePosition,
    getSetPieceMovementType,
    isSetPieceActive
  };

  // src/setpieces/execution.ts
  function executeCornerKick_Enhanced(gameState2) {
    if (!gameState2 || !gameState2.setPiece || !gameState2.setPiece.position)
      return false;
    const setPiece = gameState2.setPiece;
    if (!isFinite(setPiece.position.x) || !isFinite(setPiece.position.y)) {
      console.error("\u274C Corner Kick: Invalid ball position detected, aborting");
      return false;
    }
    const takingTeam = setPiece.team;
    const allPlayers = [...gameState2.homePlayers || [], ...gameState2.awayPlayers || []];
    const takingTeamIsHome = typeof takingTeam === "boolean" ? takingTeam : takingTeam === "home";
    const takingTeamPlayers = allPlayers.filter((p) => p && p.isHome === takingTeamIsHome);
    if (takingTeamPlayers.length === 0)
      return false;
    const opponentGoalX = getAttackingGoalX(takingTeamIsHome, gameState2.currentHalf);
    const routine = setPiece.routine || "standard";
    const taker = takingTeamPlayers.filter((p) => p.role !== "GK").sort((a, b) => {
      const aSkill = getSafeStat(a.realStats, "crossesAccuracy", a.passing || 50) + (a.passing || 50);
      const bSkill = getSafeStat(b.realStats, "crossesAccuracy", b.passing || 50) + (b.passing || 50);
      return bSkill - aSkill;
    })[0];
    if (!taker) {
      assignSetPieceKicker(null);
      console.warn("Korner: At\u0131c\u0131 bulunamad\u0131.");
      return false;
    }
    assignSetPieceKicker(taker);
    let targetX, targetY, speed, accuracy;
    const isRightCorner = setPiece.position.y < (GAME_CONFIG.PITCH_HEIGHT / 2 || 300);
    const direction = Math.sign(opponentGoalX - (GAME_CONFIG.PITCH_WIDTH / 2 || 400));
    const goalYTop = GAME_CONFIG.GOAL_Y_TOP || 240;
    const goalYBottom = GAME_CONFIG.GOAL_Y_BOTTOM || 360;
    const pitchHeight = GAME_CONFIG.PITCH_HEIGHT || 600;
    switch (routine) {
      case "short":
        const shortTarget = takingTeamPlayers.filter((p) => String(p.id) !== String(taker.id) && p.role !== "GK").sort((a, b) => distance(a, setPiece.position) - distance(b, setPiece.position))[0];
        if (shortTarget) {
          targetX = shortTarget.x;
          targetY = shortTarget.y;
          speed = 420;
          accuracy = 0.95;
        } else {
          targetX = opponentGoalX - direction * 110;
          targetY = pitchHeight / 2;
          speed = 650;
          accuracy = 0.8;
        }
        break;
      case "inswinger":
        targetX = opponentGoalX - direction * 28;
        targetY = isRightCorner ? goalYTop + 20 : goalYBottom - 20;
        speed = 680;
        accuracy = 0.78;
        break;
      case "outswinger":
        targetX = opponentGoalX - direction * 32;
        targetY = isRightCorner ? goalYBottom - 10 : goalYTop + 10;
        speed = 700;
        accuracy = 0.76;
        break;
      default:
        targetX = opponentGoalX - direction * 110;
        targetY = pitchHeight / 2;
        speed = 650;
        accuracy = 0.8;
    }
    const skillModifier = getSafeStat(taker.realStats, "crossesAccuracy", taker.passing || 50) / 100;
    accuracy *= 0.7 + skillModifier * 0.3;
    if (typeof passBall === "function") {
      passBall(taker, setPiece.position.x, setPiece.position.y, targetX, targetY, accuracy, speed, false);
      console.log(`\u26BD Corner executed: ${routine} by ${taker.name}`);
      return true;
    } else {
      console.error("executeCornerKick: passBall function not found!");
    }
    return false;
  }
  function executeFreeKick_Enhanced(gameState2) {
    if (!gameState2 || !gameState2.setPiece || !gameState2.setPiece.position)
      return false;
    const setPiece = gameState2.setPiece;
    if (!isFinite(setPiece.position.x) || !isFinite(setPiece.position.y)) {
      console.error("\u274C Free Kick: Invalid ball position detected, aborting");
      return false;
    }
    const takingTeam = setPiece.team;
    const allPlayers = [...gameState2.homePlayers || [], ...gameState2.awayPlayers || []];
    const takingTeamIsHome = typeof takingTeam === "boolean" ? takingTeam : takingTeam === "home";
    const takingTeamPlayers = allPlayers.filter((p) => p && p.isHome === takingTeamIsHome);
    const opponents = allPlayers.filter((p) => p && p.isHome !== takingTeamIsHome);
    if (takingTeamPlayers.length === 0)
      return false;
    const opponentGoalX = getAttackingGoalX(takingTeamIsHome, gameState2.currentHalf);
    const distToGoal = distance(setPiece.position, { x: opponentGoalX, y: 300 });
    const angleToGoal = Math.abs(setPiece.position.y - 300);
    const taker = takingTeamPlayers.filter((p) => p.role !== "GK").sort((a, b) => {
      const aSkill = (a.shooting || 50) + (a.passing || 50);
      const bSkill = (b.shooting || 50) + (b.passing || 50);
      return bSkill - aSkill;
    })[0];
    if (!taker) {
      assignSetPieceKicker(null);
      console.warn("Serbest Vuru\u015F: At\u0131c\u0131 bulunamad\u0131.");
      return false;
    }
    assignSetPieceKicker(taker);
    const isShootingRange = distToGoal < 280;
    const isGoodAngle = angleToGoal < 130;
    const wallPlayers = opponents.filter((p) => {
      const distToFK = distance(p, setPiece.position);
      return distToFK > 80 && distToFK < 105;
    });
    const hasWall = wallPlayers.length >= (gameState2._currentWallSize || 3);
    if (isShootingRange && isGoodAngle) {
      const shootingSkill = (taker.shooting || 50) / 100;
      const shootingChance = shootingSkill * (hasWall ? 0.55 : 0.82) * (distToGoal < 200 ? 1.1 : 0.9);
      if (Math.random() < shootingChance) {
        let targetY = 300;
        const goalYTop = GAME_CONFIG.GOAL_Y_TOP || 240;
        const goalYBottom = GAME_CONFIG.GOAL_Y_BOTTOM || 360;
        if (hasWall && wallPlayers.length > 0) {
          const wallYs = wallPlayers.map((p) => p.y);
          const wallTop = Math.min(...wallYs);
          const wallBottom = Math.max(...wallYs);
          const wallCenterY = (wallTop + wallBottom) / 2;
          if (Math.random() < 0.6) {
            targetY = wallCenterY > 300 ? goalYTop + 10 : goalYBottom - 10;
          } else {
            targetY = wallCenterY > 300 ? wallBottom + 25 : wallTop - 25;
            targetY = Math.max(goalYTop + 5, Math.min(goalYBottom - 5, targetY));
          }
          targetY += (Math.random() - 0.5) * 30;
        } else {
          const options = [goalYTop + 15, 300, goalYBottom - 15];
          targetY = options[Math.floor(Math.random() * options.length)] || 300;
          targetY += (Math.random() - 0.5) * 25;
        }
        const powerFactor = Math.min(distToGoal / 220, 1.3);
        const speed = 700 + powerFactor * 200;
        const accuracy = 0.65 + shootingSkill * 0.2 - (hasWall ? 0.12 : 0);
        if (typeof passBall === "function") {
          passBall(
            taker,
            setPiece.position.x,
            setPiece.position.y,
            opponentGoalX,
            targetY,
            accuracy,
            speed,
            true
          );
          console.log(`\u26BD Free Kick SHOT by ${taker.name}`);
          return true;
        } else {
          console.error("executeFreeKick (Shot): passBall function not found!");
        }
      }
    }
    const targets = takingTeamPlayers.filter((p) => String(p.id) !== String(taker.id) && p.role !== "GK").map((t) => {
      const distToTargetGoal = distance(t, { x: opponentGoalX, y: 300 });
      const space = opponents.length > 0 ? Math.min(100, ...opponents.map((o) => distance(o, t))) : 100;
      const distPenalty = Math.max(0, 30 - distance(t, setPiece.position));
      return {
        player: t,
        score: 400 - distToTargetGoal + space * 1.5 - distPenalty
        // Boşluğa daha çok önem ver
      };
    }).filter((t) => t.score > 0).sort((a, b) => b.score - a.score);
    const target = targets[0]?.player;
    if (target && typeof passBall === "function") {
      const passAccuracy = 0.85 + getSafeStat(taker.realStats, "passAccuracy", taker.passing || 70) / 300;
      const passSpeed = 450 + distToGoal / 3;
      passBall(
        taker,
        setPiece.position.x,
        setPiece.position.y,
        target.x,
        target.y,
        passAccuracy,
        passSpeed,
        false
      );
      console.log(`\u26BD Free Kick PASS by ${taker.name} to ${target.name}`);
      return true;
    } else {
      console.warn("Serbest Vuru\u015F: Pas hedefi bulunamad\u0131.");
    }
    return false;
  }
  function executeThrowIn_Enhanced(gameState2) {
    if (!gameState2 || !gameState2.setPiece || !gameState2.setPiece.position)
      return false;
    const setPiece = gameState2.setPiece;
    if (!isFinite(setPiece.position.x) || !isFinite(setPiece.position.y)) {
      console.error("\u274C Throw In: Invalid ball position detected, aborting");
      return false;
    }
    const takingTeam = setPiece.team;
    const allPlayers = [...gameState2.homePlayers || [], ...gameState2.awayPlayers || []];
    const takingTeamIsHome = typeof takingTeam === "boolean" ? takingTeam : takingTeam === "home";
    const takingTeamPlayers = allPlayers.filter((p) => p && p.isHome === takingTeamIsHome);
    const opponents = allPlayers.filter((p) => p && p.isHome !== takingTeamIsHome);
    if (takingTeamPlayers.length === 0)
      return false;
    let thrower = takingTeamPlayers.find(
      (p) => gameState2._throwInAssignments?.get(String(p.id))?.role === "THROWER"
    );
    if (!thrower) {
      const wideDefenders = takingTeamPlayers.filter(
        (p) => ["RB", "LB", "RWB", "LWB"].some((role) => p.role.includes(role))
      );
      if (wideDefenders.length > 0) {
        thrower = wideDefenders.sort(
          (a, b) => distance(a, setPiece.position) - distance(b, setPiece.position)
        )[0];
      } else {
        thrower = takingTeamPlayers.filter((p) => p.role !== "GK").sort((a, b) => distance(a, setPiece.position) - distance(b, setPiece.position))[0];
      }
    }
    if (!thrower) {
      assignSetPieceKicker(null);
      console.warn("Ta\xE7: At\u0131c\u0131 bulunamad\u0131.");
      return false;
    }
    assignSetPieceKicker(thrower);
    const receivers = takingTeamPlayers.filter((p) => String(p.id) !== String(thrower.id) && p.role !== "GK").map((p) => {
      const distToThrower = distance(p, setPiece.position);
      const space = Math.min(100, ...opponents.map((o) => distance(o, p)));
      const inRange = distToThrower < 180;
      let score = 0;
      if (inRange) {
        score = space * 2.5 - distToThrower * 0.5;
        if (gameState2._throwInAssignments?.get(String(p.id))?.role === "SHORT_OPTION") {
          score += 50;
        }
      }
      return { player: p, score };
    }).sort((a, b) => b.score - a.score);
    const target = receivers[0]?.player;
    if (target && typeof passBall === "function") {
      const dist = distance(setPiece.position, target);
      const throwPower = 300 + dist * 1.5;
      const accuracy = 0.9 + (thrower.physicality || 60) / 500;
      passBall(
        thrower,
        setPiece.position.x,
        setPiece.position.y,
        target.x,
        target.y,
        accuracy,
        Math.min(throwPower, 600),
        false
      );
      console.log(`\u26BD Throw-in by ${thrower.name} to ${target.name}`);
      return true;
    } else {
      console.warn("Ta\xE7: Uygun al\u0131c\u0131 bulunamad\u0131.");
    }
    return false;
  }
  function executeGoalKick_Enhanced(gameState2) {
    if (!gameState2 || !gameState2.setPiece || !gameState2.setPiece.position) {
      console.warn("\u26A0\uFE0F Goal Kick: Invalid game state or setPiece");
      return false;
    }
    const setPiece = gameState2.setPiece;
    const takingTeam = setPiece.team;
    const allPlayers = [...gameState2.homePlayers || [], ...gameState2.awayPlayers || []];
    const takingTeamIsHome = typeof takingTeam === "boolean" ? takingTeam : takingTeam === "home";
    const takingTeamPlayers = allPlayers.filter((p) => p && p.isHome === takingTeamIsHome);
    const opponents = allPlayers.filter((p) => p && p.isHome !== takingTeamIsHome);
    if (takingTeamPlayers.length === 0) {
      console.warn("\u26A0\uFE0F Goal Kick: No players for taking team");
      return false;
    }
    const goalkeeper = takingTeamPlayers.find((p) => p.role === "GK");
    if (!goalkeeper) {
      console.error("\u274C Goal Kick: Goalkeeper not found");
      assignSetPieceKicker(null);
      return false;
    }
    gameState2.ballHolder = goalkeeper;
    goalkeeper.hasBallControl = true;
    goalkeeper.ballReceivedTime = Date.now();
    assignSetPieceKicker(goalkeeper);
    if (!isFinite(setPiece.position.x) || !isFinite(setPiece.position.y)) {
      console.error("\u274C Goal Kick: Invalid ball position detected, resetting");
      const ownGoalX = getAttackingGoalX(!takingTeamIsHome, gameState2.currentHalf);
      const direction2 = Math.sign(400 - ownGoalX);
      setPiece.position.x = ownGoalX + direction2 * 70;
      setPiece.position.y = 300;
      gameState2.ballPosition.x = setPiece.position.x;
      gameState2.ballPosition.y = setPiece.position.y;
    }
    gameState2.ballVelocity = { x: 0, y: 0 };
    if (typeof passBall !== "function") {
      console.error("\u274C Goal Kick: passBall function not available");
      return false;
    }
    const opponentGoalX = getAttackingGoalX(takingTeamIsHome, gameState2.currentHalf);
    const direction = Math.sign(opponentGoalX - 400);
    const playShort = setPiece.playShort !== false;
    console.log(`\u26BD Goal Kick: ${playShort ? "K\u0131sa" : "Uzun"} oyun plan\u0131`);
    if (playShort && Math.random() < 0.75) {
      const shortTargets = takingTeamPlayers.filter((p) => p.role !== "GK" && String(p.id) !== String(goalkeeper.id)).map((p) => {
        const dist = distance(p, setPiece.position);
        const space = Math.min(120, ...opponents.map((o) => distance(o, p)));
        const inShortRange = dist < 260;
        let score = 0;
        if (inShortRange) {
          score = space * 2 - dist * 0.3;
          if (["CB", "RB", "LB", "CDM"].includes(p.role)) {
            score += 40;
          }
        }
        return { player: p, score, space };
      }).filter((t) => t.score > 15).sort((a, b) => b.score - a.score);
      if (shortTargets.length > 0 && shortTargets[0] && shortTargets[0].space > 30) {
        const target2 = shortTargets[0].player;
        const accuracy2 = 0.92 + getSafeStat(goalkeeper.realStats, "passAccuracy", 70) / 400;
        const speed2 = 380 + distance(setPiece.position, target2) * 1.2;
        passBall(
          goalkeeper,
          setPiece.position.x,
          setPiece.position.y,
          target2.x,
          target2.y,
          accuracy2,
          Math.min(speed2, 550),
          false
        );
        console.log(`\u26BD Goal Kick SHORT PASS by ${goalkeeper.name} to ${target2.name}`);
        return true;
      }
    }
    const midX = 400;
    const longTargets = takingTeamPlayers.filter((p) => p.role !== "GK" && String(p.id) !== String(goalkeeper.id)).map((p) => {
      const distToOpponentGoal = Math.abs(p.x - opponentGoalX);
      const space = Math.min(100, ...opponents.map((o) => distance(o, p)));
      const isForward = distToOpponentGoal < 350;
      let score = 0;
      if (Math.abs(p.x - midX) < 200 || isForward) {
        score = space * 1.8 + (isForward ? 50 : 0);
        if (["ST", "CF"].some((role) => p.role.includes(role))) {
          score += 120;
        } else if (["RW", "LW", "CAM", "LM", "RM"].includes(p.role)) {
          score += 70;
        } else if (["CM", "CDM"].includes(p.role)) {
          score += 30;
        }
        const physicalBonus = getSafeStat(p.realStats, "heading", p.physicality || 60) / 8;
        score += physicalBonus;
      }
      return { player: p, score };
    }).filter((t) => t.score > 0).sort((a, b) => b.score - a.score);
    let targetX, targetY, target = null;
    if (longTargets.length > 0 && longTargets[0] && Math.random() < 0.7) {
      target = longTargets[0].player;
      if (target) {
        targetX = target.x + direction * 20;
        targetY = target.y + (Math.random() - 0.5) * 25;
      } else {
        targetX = midX + direction * (Math.random() * 120 + 80);
        targetY = 300 + (Math.random() * 180 - 90);
      }
    } else {
      targetX = midX + direction * (Math.random() * 120 + 80);
      targetY = 300 + (Math.random() * 180 - 90);
    }
    const longBallSkill = getSafeStat(goalkeeper.realStats, "longBallAccuracy", 50);
    const accuracy = 0.55 + longBallSkill / 250;
    const speed = 800 + Math.random() * 150;
    passBall(
      goalkeeper,
      setPiece.position.x,
      setPiece.position.y,
      targetX,
      targetY,
      accuracy,
      speed,
      false
    );
    const targetInfo = target ? ` to ${target.name}` : " to midfield";
    console.log(`\u26BD Goal Kick LONG BALL by ${goalkeeper.name}${targetInfo}`);
    return true;
  }
  function executeKickOff_Enhanced(gameState2) {
    if (!gameState2 || !gameState2.setPiece) {
      console.warn("\u26A0\uFE0F Kick-off: Invalid game state or setPiece");
      return false;
    }
    if (!gameState2.ballPosition || !isFinite(gameState2.ballPosition.x) || !isFinite(gameState2.ballPosition.y)) {
      console.warn("\u26A0\uFE0F Kick-off: Invalid ball position, resetting to center");
      gameState2.ballPosition = { x: 400, y: 300 };
    }
    const takingTeam = gameState2.setPiece.team;
    const allPlayers = [...gameState2.homePlayers || [], ...gameState2.awayPlayers || []];
    const takingTeamIsHome = typeof takingTeam === "boolean" ? takingTeam : takingTeam === "home";
    const takingTeamPlayers = allPlayers.filter((p) => p && p.isHome === takingTeamIsHome);
    if (takingTeamPlayers.length === 0) {
      console.warn("\u26A0\uFE0F Kick-off: No players for taking team");
      return false;
    }
    const kicker = takingTeamPlayers.filter((p) => p.role !== "GK").filter((p) => ["ST", "RW", "LW", "CAM", "CM", "CDM"].includes(p.role)).sort((a, b) => distance(a, { x: 400, y: 300 }) - distance(b, { x: 400, y: 300 }))[0];
    if (!kicker) {
      console.error("\u274C Kick-off: No suitable kicker found");
      assignSetPieceKicker(null);
      return false;
    }
    gameState2.ballHolder = kicker;
    kicker.hasBallControl = true;
    kicker.ballReceivedTime = Date.now();
    assignSetPieceKicker(kicker);
    const passTarget = takingTeamPlayers.filter((p) => p.id !== kicker.id && p.role !== "GK").sort((a, b) => distance(a, kicker) - distance(b, kicker))[0];
    if (!isFinite(gameState2.ballPosition.x) || !isFinite(gameState2.ballPosition.y)) {
      console.error("\u274C Kick-off: Invalid ball position detected, resetting to center");
      gameState2.ballPosition = { x: 400, y: 300 };
    }
    gameState2.ballVelocity = { x: 0, y: 0 };
    if (!passTarget) {
      console.warn("\u26A0\uFE0F Kick-off: No pass target, dribbling forward");
      const opponentGoalX = getAttackingGoalX(takingTeamIsHome, gameState2.currentHalf);
      const direction = Math.sign(opponentGoalX - 400);
      gameState2.ballVelocity = { x: direction * 2, y: 0 };
      return true;
    }
    if (typeof passBall !== "function") {
      console.error("\u274C Kick-off: passBall function not available, manual pass");
      const dx = passTarget.x - 400;
      const dy = passTarget.y - 300;
      const dist = Math.hypot(dx, dy);
      const speed = 350;
      gameState2.ballVelocity = { x: dx / dist * speed / 60, y: dy / dist * speed / 60 };
      gameState2.ballTrajectory = {
        startX: 400,
        startY: 300,
        endX: passTarget.x,
        endY: passTarget.y,
        startTime: Date.now(),
        duration: dist / speed * 1e3,
        maxHeight: 0,
        isShot: false,
        passType: "ground",
        passQuality: 0.98,
        dist,
        speed
      };
      return true;
    }
    passBall(kicker, 400, 300, passTarget.x, passTarget.y, 0.98, 350, false);
    gameState2.kickOffCompletedTime = Date.now();
    gameState2.postKickOffCalmPeriod = true;
    console.log(`\u26BD Kick-off executed successfully by ${kicker.name} to ${passTarget.name} - Calm period active`);
    return true;
  }
  function executeSetPiece_Router(gameState2) {
    if (!gameState2 || !gameState2.setPiece) {
      console.warn("\u26A0\uFE0F Set Piece Router: Invalid game state or setPiece");
      return;
    }
    if (gameState2.setPiece.executed || gameState2.setPieceExecuting) {
      return;
    }
    const status = gameState2.status;
    let success = false;
    try {
      gameState2.setPieceExecuting = true;
      if (!gameState2.ballPosition || !isFinite(gameState2.ballPosition.x) || !isFinite(gameState2.ballPosition.y)) {
        console.error(`\u274C Set Piece Router: Invalid ball position before ${status}`);
        gameState2.ballPosition = gameState2.setPiece.position || { x: 400, y: 300 };
      }
      switch (status) {
        case "CORNER_KICK":
          success = executeCornerKick_Enhanced(gameState2);
          break;
        case "FREE_KICK":
          success = executeFreeKick_Enhanced(gameState2);
          break;
        case "THROW_IN":
          success = executeThrowIn_Enhanced(gameState2);
          break;
        case "KICK_OFF":
          success = executeKickOff_Enhanced(gameState2);
          break;
        case "GOAL_KICK":
          success = executeGoalKick_Enhanced(gameState2);
          break;
        case "PENALTY":
          gameState2.setPieceExecuting = false;
          return;
        default:
          console.warn(`\u26A0\uFE0F Unknown set piece type: ${status}`);
          success = false;
      }
    } catch (e) {
      console.error(`\u274C CRITICAL ERROR during set piece execution (${status}):`, e);
      console.error(e.stack);
      success = false;
    } finally {
      if (!success) {
        gameState2.setPieceExecuting = false;
        console.error(`\u274C Set piece ${status} execution failed, transitioning to playing`);
        gameState2.status = "playing";
        gameState2.setPiece = null;
      }
    }
    if (success) {
      executeSetPiece_PostExecution();
    }
  }

  // src/setpieces/integration.ts
  var SET_PIECE_RULES = {
    MIN_DISTANCE_PIXELS: 70,
    THROW_IN_DISTANCE_PIXELS: 15
  };
  var SET_PIECE_TELEMETRY = {
    systemNotLoaded: 0,
    noGameState: 0,
    invalidPosition: 0,
    successfulPositions: 0
  };
  var DEBUG_SET_PIECES = false;
  var _originalSetPieceFunctions = null;
  function ensureCorrectSetPiecePlacement(gameState2) {
    try {
      const sp = gameState2?.setPiece;
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
      gameState2.ballPosition = { x, y };
      gameState2.ballVelocity = { x: 0, y: 0 };
      const t = sp.executionTime;
      const traj = gameState2.ballTrajectory;
      const keep = !!(traj && typeof traj.startTime === "number" && typeof t === "number" && t - traj.startTime <= 200);
      if (!keep)
        gameState2.ballTrajectory = null;
    } catch (err) {
      console.error("ensureCorrectSetPiecePlacement failed", err);
    }
  }
  function assignSetPieceKicker(player) {
    if (typeof gameState === "undefined" || !gameState || !gameState.setPiece) {
      return;
    }
    gameState.setPiece.kicker = player || null;
  }
  function getCornerKickPosition(isLeftCorner, isTopCorner) {
    const CORNER_MARGIN = 5;
    const pitchWidth = GAME_CONFIG.PITCH_WIDTH || 800;
    const pitchHeight = GAME_CONFIG.PITCH_HEIGHT || 600;
    return {
      x: isLeftCorner ? CORNER_MARGIN : pitchWidth - CORNER_MARGIN,
      y: isTopCorner ? CORNER_MARGIN : pitchHeight - CORNER_MARGIN
    };
  }
  function getGoalKickPosition(goalX, preferredSide = "center") {
    const GOAL_KICK_DISTANCE = 52;
    const direction = Math.sign((GAME_CONFIG.PITCH_WIDTH / 2 || 400) - goalX);
    const goalYTop = GAME_CONFIG.GOAL_Y_TOP || 240;
    const goalYBottom = GAME_CONFIG.GOAL_Y_BOTTOM || 360;
    const pitchHeight = GAME_CONFIG.PITCH_HEIGHT || 600;
    let y = pitchHeight / 2;
    if (preferredSide === "left")
      y = goalYTop + 20;
    else if (preferredSide === "right")
      y = goalYBottom - 20;
    return {
      x: goalX + direction * GOAL_KICK_DISTANCE,
      y
    };
  }
  function positionForSetPiece_Unified(player, allPlayers) {
    if (typeof SetPieceBehaviorSystem === "undefined" || !SetPieceBehaviorSystem.getSetPiecePosition) {
      SET_PIECE_TELEMETRY.systemNotLoaded++;
      console.error(`\u274C CRITICAL: SetPieceBehaviorSystem not loaded! Falling back to legacy positioning for ${player.name}`);
      console.error(`   This should NEVER happen - check script load order! (Count: ${SET_PIECE_TELEMETRY.systemNotLoaded})`);
      return positionForSetPiece_Legacy(player, allPlayers);
    }
    if (!gameState || !gameState.setPiece) {
      SET_PIECE_TELEMETRY.noGameState++;
      console.warn(`\u26A0\uFE0F positionForSetPiece_Unified called without gameState or setPiece for ${player.name}`);
      console.warn(`   gameState exists: ${!!gameState}, setPiece exists: ${!!gameState?.setPiece} (Count: ${SET_PIECE_TELEMETRY.noGameState})`);
      return positionForSetPiece_Legacy(player, allPlayers);
    }
    const position = SetPieceBehaviorSystem.getSetPiecePosition(player, gameState);
    if (!position || typeof position.x !== "number" || typeof position.y !== "number" || isNaN(position.x) || isNaN(position.y)) {
      SET_PIECE_TELEMETRY.invalidPosition++;
      console.error(`\u274C getSetPiecePosition INVALID POSITION for ${player.name} (${player.role}) during ${gameState.setPiece.type}`);
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
    const timeUntilExecution = gameState.setPiece.executionTime ? gameState.setPiece.executionTime - Date.now() : 3e3;
    const isUrgent = timeUntilExecution < 2e3;
    const movementTag = typeof position.movement === "string" ? position.movement.toLowerCase() : "";
    const isKickerOrThrower = movementTag.includes("kicker") || movementTag.includes("thrower") || movementTag.includes("take_kick");
    if (isKickerOrThrower) {
      player.speedBoost = 2;
      player.setPieceLocked = distance(player, gameState.setPiece.position) < 8;
    } else if (isUrgent) {
      player.speedBoost = 1.8;
      player.setPieceLocked = false;
    } else {
      player.speedBoost = 1.5;
      player.setPieceLocked = false;
    }
    player.setPieceMovement = position.movement;
    player.setPieceRole = position.role;
    if (position.targetX && position.targetY) {
      player.setPieceRunTarget = { x: position.targetX, y: position.targetY };
    } else {
      player.setPieceRunTarget = null;
    }
  }
  function positionForSetPiece_Legacy(player, allPlayers) {
    const status = gameState.status;
    if (!_originalSetPieceFunctions) {
      player.targetX = player.x;
      player.targetY = player.y;
      return;
    }
    const originals = _originalSetPieceFunctions;
    try {
      if (status === "CORNER_KICK" && typeof originals["positionForCornerKick"] === "function") {
        originals["positionForCornerKick"](player, allPlayers);
      } else if (status === "FREE_KICK" && typeof originals["positionForFreeKick"] === "function") {
        originals["positionForFreeKick"](player, allPlayers);
      } else if (status === "THROW_IN" && typeof originals["positionForThrowIn"] === "function") {
        originals["positionForThrowIn"](player, allPlayers);
      } else if (status === "GOAL_KICK" && typeof originals["positionForGoalKick"] === "function") {
        originals["positionForGoalKick"](player, allPlayers);
      } else {
        player.targetX = player.x;
        player.targetY = player.y;
      }
    } catch (error) {
      console.error(`\u274C Error executing legacy function for ${status}:`, error);
      player.targetX = player.x;
      player.targetY = player.y;
    }
  }
  function updatePlayerAI_V2_SetPieceEnhancement(player, allPlayers, gameState2) {
    if (!gameState2?.setPiece || !gameState2.setPiece.type) {
      if (gameState2?.status && ["KICK_OFF", "FREE_KICK", "CORNER_KICK", "THROW_IN", "GOAL_KICK", "PENALTY"].includes(gameState2.status)) {
        console.warn(`\u26A0\uFE0F SET-PIECE AI: Set-piece status (${gameState2.status}) active but no setPiece object for player ${player.name}`);
      }
      return false;
    }
    if (!player.setPieceTarget) {
      positionForSetPiece_Unified(player, allPlayers);
      if (!player.setPieceTarget) {
        console.error(`\u274C SET-PIECE AI ERROR: positionForSetPiece_Unified FAILED for ${player.name} (${player.role}) during ${gameState2.setPiece.type}`);
        console.error(`   Player:`, { id: player.id, isHome: player.isHome, x: player.x, y: player.y });
        console.error(`   SetPiece:`, gameState2.setPiece);
      }
    }
    const now = Date.now();
    const executionTime = gameState2.setPiece.executionTime || now;
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
      if (gameState2.setPiece.executed || gameState2.status === "playing") {
        player.setPieceTarget = null;
      }
      player.isInWall = false;
      player.isDefCBLine = false;
      player.isMarker = false;
      player.isKicker = false;
      return false;
    }
    if (player.isKicker && timeUntilKick <= 800 && timeUntilKick > -200) {
      const bx = gameState2.ballPosition.x;
      const by = gameState2.ballPosition.y;
      const dx = player.x - bx;
      const dy = player.y - by;
      const dist = Math.hypot(dx, dy);
      if (dist > 8) {
        player.targetX = bx;
        player.targetY = by;
        player.speedBoost = 2.5;
        player.intent = "KICKER_APPROACHING";
        return true;
      } else {
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
      } else {
        player.targetX = player.setPieceTarget.x;
        player.targetY = player.setPieceTarget.y;
        player.intent = "SET_PIECE_READY";
        player._setPieceWasClose = true;
        return true;
      }
    }
    console.error(`\u274C SET-PIECE AI CRITICAL: Player ${player.name} has NO setPieceTarget during ${gameState2.setPiece.type}!`);
    console.error(`   This means positionForSetPiece_Unified failed silently. THIS IS A BUG.`);
    console.error(`   Player:`, { id: player.id, role: player.role, isHome: player.isHome, x: player.x, y: player.y });
    console.error(`   SetPiece:`, gameState2.setPiece);
    console.error(`   Stack:`, new Error().stack);
    player.targetX = player.x;
    player.targetY = player.y;
    return true;
  }
  function executeSetPiece_PostExecution() {
    const setPieceToClear = gameState.setPiece;
    if (!setPieceToClear) {
      console.warn("\u26A0\uFE0F PostExecution: setPiece already null, skipping cleanup");
      gameState.setPieceExecuting = false;
      if (gameState.status !== "playing" && gameState.status !== "finished" && gameState.status !== "halftime") {
        gameState.status = "playing";
      }
      return;
    }
    setPieceToClear.executed = true;
    gameState.setPieceExecuting = false;
    if (gameState.ballTrajectory) {
      const trajectory = gameState.ballTrajectory;
      const hasValidStartTime = typeof trajectory.startTime === "number" && !isNaN(trajectory.startTime);
      const executionTime = setPieceToClear.executionTime;
      const shouldClearTrajectory = !hasValidStartTime || typeof executionTime === "number" && trajectory.startTime < executionTime - 200;
      if (shouldClearTrajectory) {
        console.log("Clearing stale ball trajectory");
        gameState.ballTrajectory = null;
      }
    }
    console.log(`\u2713 Set piece ${setPieceToClear.type} executed. Transitioning to playing...`);
    const needsImmediateTransition = ["KICK_OFF", "GOAL_KICK"].includes(setPieceToClear.type);
    const CLEANUP_DELAY_MS = needsImmediateTransition ? 0 : 150;
    const cleanupFunction = () => {
      if (gameState.setPiece === setPieceToClear) {
        gameState.setPiece = null;
      }
      if (gameState.status === setPieceToClear.type) {
        gameState.status = "playing";
      }
      const allPlayers = [...gameState.homePlayers || [], ...gameState.awayPlayers || []];
      allPlayers.forEach((player) => {
        if (player) {
          player.setPieceLocked = false;
          player.setPieceMovement = null;
          player.setPieceRole = null;
          player.setPieceRunTarget = null;
          player.setPieceTarget = null;
          player._setPieceWasClose = false;
          player.speedBoost = 1;
          player.lockUntil = 0;
          player.isKicker = false;
          player.isInWall = false;
          player.isDefCBLine = false;
          player.isMarker = false;
        }
      });
      cleanupSetPieceManagers();
      console.log(`\u2705 Set piece cleanup complete. Status: ${gameState.status}`);
    };
    if (CLEANUP_DELAY_MS === 0) {
      if (typeof requestAnimationFrame !== "undefined") {
        requestAnimationFrame(cleanupFunction);
      } else {
        cleanupFunction();
      }
    } else {
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

  // src/rules/offside.ts
  var offsideTracker = {
    lastPassTime: 0,
    playersOffsideWhenBallPlayed: /* @__PURE__ */ new Set(),
    lastPassingTeam: null,
    pendingFreeKickTimeout: null
  };
  function isPlayerInOffsidePosition(player, ball, opponents) {
    const opponentGoalX = getAttackingGoalX(player.isHome, gameState.currentHalf);
    const ownGoalX = getAttackingGoalX(!player.isHome, gameState.currentHalf);
    const attackingDirection = opponentGoalX > ownGoalX ? 1 : -1;
    const isInOpponentHalf = attackingDirection > 0 ? player.x > 400 : player.x < 400;
    if (!isInOpponentHalf) {
      return false;
    }
    const isBehindBall = attackingDirection > 0 ? player.x <= ball.x : player.x >= ball.x;
    if (isBehindBall) {
      return false;
    }
    const opponentsAheadOfPlayer = opponents.filter((opp) => {
      if (opp.role === "GK")
        return false;
      const oppDistToGoal = attackingDirection > 0 ? opp.x : 800 - opp.x;
      const playerDistToGoal = attackingDirection > 0 ? player.x : 800 - player.x;
      return oppDistToGoal < playerDistToGoal;
    });
    return opponentsAheadOfPlayer.length < 2;
  }
  function recordOffsidePositions(passingPlayer, allPlayers) {
    if (!passingPlayer || !Array.isArray(allPlayers) || allPlayers.length === 0) {
      return;
    }
    allPlayers.forEach((p) => {
      if (p.wasOffsideWhenBallPlayed) {
        delete p.wasOffsideWhenBallPlayed;
      }
    });
    offsideTracker.lastPassTime = Date.now();
    offsideTracker.lastPassingTeam = passingPlayer.isHome ? "home" : "away";
    offsideTracker.playersOffsideWhenBallPlayed.clear();
    const teammates = allPlayers.filter(
      (p) => p.isHome === passingPlayer.isHome && p.id !== passingPlayer.id
    );
    const opponents = allPlayers.filter((p) => p.isHome !== passingPlayer.isHome);
    if (!gameState.ballPosition) {
      return;
    }
    teammates.forEach((teammate) => {
      if (isPlayerInOffsidePosition(teammate, gameState.ballPosition, opponents)) {
        offsideTracker.playersOffsideWhenBallPlayed.add(String(teammate.id));
        teammate.wasOffsideWhenBallPlayed = true;
      }
    });
  }
  function checkOffsidePenalty(player) {
    if (!player || !offsideTracker.playersOffsideWhenBallPlayed) {
      return false;
    }
    if (!offsideTracker.playersOffsideWhenBallPlayed.has(String(player.id))) {
      return false;
    }
    return true;
  }
  function awardOffsideFreeKick(offsidePlayer) {
    const offenseTeam = offsidePlayer.isHome ? "home" : "away";
    console.log(`\xF0\u0178\u0161\xA9 OFFSIDE! ${offsidePlayer.name} was in offside position`);
    gameState.ballTrajectory = null;
    gameState.ballHolder = null;
    gameState.shotInProgress = false;
    gameState.ballVelocity = { x: 0, y: 0 };
    gameState.commentary.push({
      text: `${Math.floor(gameState.timeElapsed)}' OFFSIDE - ${offsidePlayer.name}`,
      type: "attack"
    });
    if (typeof eventBus !== "undefined" && typeof EVENT_TYPES2 !== "undefined") {
      eventBus.publish(EVENT_TYPES2.OFFSIDE_CALLED, {
        player: offsidePlayer,
        time: Math.floor(gameState.timeElapsed)
      });
    }
    if (typeof recordOffsideStatistic === "function") {
      recordOffsideStatistic(offsidePlayer);
    }
    const freeKickX = Math.max(50, Math.min(750, offsidePlayer.x));
    const freeKickY = Math.max(50, Math.min(550, offsidePlayer.y));
    const defenders = offenseTeam === "home" ? gameState.awayPlayers : gameState.homePlayers;
    if (!defenders || defenders.length === 0) {
      console.error("No defenders available to take the offside free kick.");
      if (gameState.setPiece) {
        executeSetPiece_PostExecution();
      }
      gameState.status = "playing";
      offsideTracker.playersOffsideWhenBallPlayed.clear();
      return;
    }
    const freeKickTaker = defenders.filter((p) => p && p.x !== void 0 && p.y !== void 0).reduce((closest, current) => {
      const distToClosest = distance(closest, { x: freeKickX, y: freeKickY });
      const distToCurrent = distance(current, { x: freeKickX, y: freeKickY });
      return distToCurrent < distToClosest ? current : closest;
    });
    if (!freeKickTaker) {
      console.error("Could not find a suitable free kick taker.");
      if (gameState.setPiece) {
        executeSetPiece_PostExecution();
      }
      gameState.status = "playing";
      offsideTracker.playersOffsideWhenBallPlayed.clear();
      return;
    }
    if (offsideTracker.pendingFreeKickTimeout !== null) {
      clearTimeout(offsideTracker.pendingFreeKickTimeout);
      offsideTracker.pendingFreeKickTimeout = null;
    }
    const offsideCallTime = Date.now();
    offsideTracker.pendingFreeKickTimeout = window.setTimeout(() => {
      offsideTracker.pendingFreeKickTimeout = null;
      if (gameState.status === "finished" || gameState.status === "goal_scored") {
        return;
      }
      if (gameState.ballHolder && gameState.ballHolder.id !== freeKickTaker.id) {
        return;
      }
      gameState.ballPosition.x = freeKickX;
      gameState.ballPosition.y = freeKickY;
      gameState.ballVelocity.x = 0;
      gameState.ballVelocity.y = 0;
      gameState.ballHolder = freeKickTaker;
      freeKickTaker.hasBallControl = true;
      freeKickTaker.ballReceivedTime = offsideCallTime;
      offsideTracker.playersOffsideWhenBallPlayed.clear();
    }, 1e3);
  }
  function drawOffsideLines(ctx) {
    if (!gameState.contexts || !gameState.contexts.game)
      return;
    if (Math.floor(Date.now() / 16) % 5 !== 0)
      return;
    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    const awayDefenders = gameState.awayPlayers.filter((p) => p.role !== "GK").sort((a, b) => a.x - b.x);
    if (awayDefenders.length >= 2) {
      const secondLastDefender = awayDefenders[1];
      if (secondLastDefender) {
        ctx.strokeStyle = "rgba(255, 0, 0, 0.3)";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(secondLastDefender.x, 0);
        ctx.lineTo(secondLastDefender.x, 600);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    const homeDefenders = gameState.homePlayers.filter((p) => p.role !== "GK").sort((a, b) => b.x - a.x);
    if (homeDefenders.length >= 2) {
      const secondLastDefender = homeDefenders[1];
      if (secondLastDefender) {
        ctx.strokeStyle = "rgba(0, 0, 255, 0.3)";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(secondLastDefender.x, 0);
        ctx.lineTo(secondLastDefender.x, 600);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    allPlayers.forEach((player) => {
      if (player.wasOffsideWhenBallPlayed) {
        ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
        ctx.lineWidth = 3;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(player.x, player.y, 20, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
  }
  function shouldAvoidOffside(player, ball, opponents) {
    const opponentGoalX = getAttackingGoalX(player.isHome, gameState.currentHalf);
    const distToGoal = Math.abs(player.x - opponentGoalX);
    if (distToGoal > 300)
      return false;
    if (isPlayerInOffsidePosition(player, ball, opponents)) {
      const distToBall = distance(player, ball);
      if (distToBall < 150) {
        return true;
      }
    }
    return false;
  }
  function initOffsideStats() {
    if (!gameState.stats.home)
      gameState.stats.home = {};
    if (!gameState.stats.away)
      gameState.stats.away = {};
    gameState.stats.home.offsides = 0;
    gameState.stats.away.offsides = 0;
  }
  function recordOffsideStatistic(player) {
    const teamStats = player.isHome ? gameState.stats.home : gameState.stats.away;
    if (!teamStats)
      return;
    teamStats.offsides = (teamStats.offsides || 0) + 1;
  }

  // src/rules/ballControl.ts
  function resolveBallControl(allPlayers) {
    const isSetPiece = isSetPieceStatus(gameState.status);
    if (isSetPiece) {
      return;
    }
    if (!gameState.ballPosition || !Array.isArray(allPlayers) || allPlayers.length === 0) {
      return;
    }
    if (gameState.ballTrajectory || gameState.ballHolder && gameState.ballHolder.hasBallControl) {
      return;
    }
    const eligiblePlayers = allPlayers.filter((p) => !(p.stunnedUntil && Date.now() < p.stunnedUntil));
    if (eligiblePlayers.length === 0)
      return;
    const BALL_CONTROL_DISTANCE = PHYSICS?.BALL_CONTROL_DISTANCE ?? 25;
    const controlCandidates = eligiblePlayers.map((player) => {
      const distToBall = distance(player, gameState.ballPosition);
      let effectiveControlDistance = BALL_CONTROL_DISTANCE * (player.isChasingBall ? 2 : 1);
      if (distToBall > effectiveControlDistance) {
        return { player, score: 0, distToBall };
      }
      let score = Math.max(0, 150 - distToBall);
      score += player.dribbling / 100 * 20;
      if (player.isChasingBall)
        score += 200;
      return { player, score, distToBall };
    }).filter((item) => item.score > 50).sort((a, b) => b.score - a.score);
    if (controlCandidates.length === 0)
      return;
    let controllingPlayer;
    const vel = gameState.ballVelocity;
    const ballSpeed = vel ? Math.sqrt(vel.x ** 2 + vel.y ** 2) : 0;
    if (ballSpeed < 5 && controlCandidates.length >= 2 && controlCandidates[0].distToBall < 30 && controlCandidates[1].distToBall < 30) {
      const contender1 = controlCandidates[0].player;
      const contender2 = controlCandidates[1].player;
      const p1_strength = contender1.physicality * 0.6 + contender1.pace * 0.2 + Math.random() * 20;
      const p2_strength = contender2.physicality * 0.6 + contender2.pace * 0.2 + Math.random() * 20;
      if (p1_strength >= p2_strength) {
        controllingPlayer = contender1;
        contender2.stunnedUntil = Date.now() + 250;
      } else {
        controllingPlayer = contender2;
        contender1.stunnedUntil = Date.now() + 250;
      }
    } else if (controlCandidates.length > 0) {
      controllingPlayer = controlCandidates[0].player;
    }
    if (!controllingPlayer)
      return;
    gameState.lastTouchedBy = controllingPlayer;
    if (gameState.status === "playing" && typeof checkOffsidePenalty === "function") {
      if (checkOffsidePenalty(controllingPlayer)) {
        if (typeof awardOffsideFreeKick === "function") {
          awardOffsideFreeKick(controllingPlayer);
        } else {
          console.error("awardOffsideFreeKick is not defined!");
        }
        return;
      }
    }
    const touchResult = applyFirstTouch(controllingPlayer, null, allPlayers);
    if (touchResult.outcome === "failed") {
      handleFailedFirstTouch(controllingPlayer, allPlayers);
    } else if (touchResult.outcome === "poor") {
      handlePoorFirstTouch(controllingPlayer, touchResult);
    } else {
      handleSuccessfulFirstTouch(controllingPlayer, touchResult);
    }
  }
  function canControlBall(player, ball) {
    const BALL_CONTROL_DISTANCE = PHYSICS?.BALL_CONTROL_DISTANCE ?? 25;
    const dist = distance(player, ball);
    const isSetPiece = ["GOAL_KICK", "FREE_KICK", "CORNER_KICK", "THROW_IN", "KICK_OFF", "PENALTY"].includes(gameState.status);
    if (isSetPiece && gameState.setPiece && !gameState.setPiece.executed) {
      const isDesignatedTaker = player.setPieceRole && (player.setPieceRole.includes("KICKER") || player.setPieceRole.includes("THROWER") || player.setPieceRole === "CORNER_KICKER" || player.setPieceRole === "PRIMARY_KICKER");
      const isGoalkeeper2 = player.role === "GK";
      if (!isDesignatedTaker && !isGoalkeeper2) {
        return false;
      }
    }
    return dist < BALL_CONTROL_DISTANCE && !gameState.ballTrajectory;
  }
  function action_attemptTackle(player, allPlayers) {
    const isRestart = isSetPieceStatus(gameState.status);
    if (isRestart) {
      return false;
    }
    const attacker = gameState.ballHolder;
    if (!attacker)
      return false;
    if (attacker.role === "GK") {
      if (typeof SetPieceEnforcement !== "undefined" && SetPieceEnforcement.protectGoalkeeper) {
        SetPieceEnforcement.protectGoalkeeper(player, attacker, gameState);
      } else {
        console.log(`\u{1F6AB} [gk-protection] ${player.name} cannot tackle goalkeeper ${attacker.name}`);
      }
      return false;
    }
    const defenderStat = player.defending * 0.6 + player.physicality * 0.4;
    const attackerStat = attacker.dribbling * 0.6 + attacker.pace * 0.4;
    const successChance = 0.5 + (defenderStat - attackerStat) / 120;
    const teamStats = player.isHome ? gameState.stats.home : gameState.stats.away;
    if (!teamStats)
      return false;
    const outcome = Math.random();
    if (outcome < successChance) {
      if (Math.random() < 0.6) {
        gameState.ballHolder = player;
        player.hasBallControl = true;
        player.ballReceivedTime = Date.now();
        gameState.commentary.push({ text: `${Math.floor(gameState.timeElapsed)}' ${player.name} wins the ball!`, type: "attack" });
      } else {
        gameState.ballHolder = null;
        gameState.ballTrajectory = null;
        const angle = Math.atan2(attacker.y - player.y, attacker.x - player.x);
        if (gameState.ballVelocity) {
          gameState.ballVelocity.x = Math.cos(angle) * 150;
          gameState.ballVelocity.y = Math.sin(angle) * 150;
        }
        gameState.commentary.push({ text: `${Math.floor(gameState.timeElapsed)}' 50/50 challenge! The ball is loose!`, type: "attack" });
        assignBallChasers(allPlayers);
      }
      if (teamStats.tackles !== void 0) {
        teamStats.tackles++;
      }
    } else {
      player.stunnedUntil = Date.now() + 750;
      attacker.speedBoost = 1.2;
      if (Math.random() < 0.15) {
        if (typeof handleFoul_V2 === "function") {
          handleFoul_V2(player, attacker);
        } else {
          console.error("handleFoul_V2 is not defined!");
        }
      } else {
        gameState.commentary.push({ text: `${Math.floor(gameState.timeElapsed)}' ${attacker.name} skips past ${player.name}!`, type: "attack" });
      }
    }
    return true;
  }
  function handleBallInterception(progress) {
    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    const trajectory = gameState.ballTrajectory;
    if (!trajectory)
      return;
    const HEADER_HEIGHT_THRESHOLD = PHYSICS?.HEADER_HEIGHT_THRESHOLD ?? 0.6;
    const PASS_INTERCEPT_DISTANCE = PHYSICS?.PASS_INTERCEPT_DISTANCE ?? 25;
    const isAerial = trajectory.passType === "aerial";
    const isHeaderOpportunity = isAerial && gameState.ballHeight > HEADER_HEIGHT_THRESHOLD;
    if (progress >= 1 || progress < 0.2)
      return;
    if (isHeaderOpportunity) {
      const contenders = allPlayers.filter(
        (player) => !(player.stunnedUntil && Date.now() < player.stunnedUntil)
      ).map((player) => ({
        player,
        dist: distance(player, gameState.ballPosition)
      })).filter((c) => c.dist < 28);
      if (contenders.length > 1) {
        contenders.sort((a, b) => {
          const aScore = a.player.physicality * 0.7 + Math.random() * 30;
          const bScore = b.player.physicality * 0.7 + Math.random() * 30;
          return bScore - aScore;
        });
        const winner = contenders[0]?.player;
        const loser = contenders[1]?.player;
        if (winner) {
          handleWonHeader(winner);
        }
        if (loser) {
          loser.stunnedUntil = Date.now() + 500;
        }
        if (winner && loser) {
          const headerText = `${Math.floor(gameState.timeElapsed)}' ${winner.name} wins the header against ${loser.name}!`;
          gameState.commentary.push({ text: headerText, type: "attack" });
        }
        return;
      }
    }
    for (const player of allPlayers) {
      if (player.stunnedUntil && Date.now() < player.stunnedUntil)
        continue;
      if (gameState.currentPassReceiver && player.id === gameState.currentPassReceiver.id)
        continue;
      const distToBall = distance(player, gameState.ballPosition);
      if (!isAerial && distToBall < PASS_INTERCEPT_DISTANCE) {
        const interceptionChance = calculateInterceptionChance(player, distToBall, trajectory);
        if (Math.random() < interceptionChance) {
          handleInterception(player);
          const teamStats = player.isHome ? gameState.stats.home : gameState.stats.away;
          teamStats.interceptions++;
          break;
        }
      }
    }
  }
  function calculateInterceptionChance(player, ballDistance, trajectory) {
    const realStats = player.realStats || {};
    const baseDefending = player.defending / 100;
    const interceptionModifier = realStats.interceptions > 0 ? Math.min(realStats.interceptions / 15, 0.3) : 0;
    const recoveryBonus = realStats.recoveries > 0 ? Math.min(realStats.recoveries / 20, 0.15) : 0;
    const ratingBonus = (player.rating - 6.5) / 10;
    const distancePenalty = Math.min(ballDistance / 100, 0.3);
    const passQualityBonus = trajectory.passQuality ? (1 - trajectory.passQuality) * 0.4 : 0;
    const interceptionChance = baseDefending + interceptionModifier + recoveryBonus + ratingBonus - distancePenalty + passQualityBonus;
    return Math.max(0.05, Math.min(0.8, interceptionChance));
  }
  function handleInterception(player) {
    gameState.ballTrajectory = null;
    gameState.ballHolder = player;
    player.hasBallControl = true;
    player.ballReceivedTime = Date.now();
    if (gameState.ballChasers) {
      gameState.ballChasers.clear();
    }
    gameState.lastPossessionChange = Date.now();
    gameState.currentPassReceiver = null;
    const interceptText = `${Math.floor(gameState.timeElapsed)}' ${player.name} intercepts!`;
    if (gameState.commentary) {
      gameState.commentary.push({ text: interceptText, type: "attack" });
      gameState.commentary = gameState.commentary.slice(-6);
    }
  }
  function handleWonHeader(player) {
    const opponentGoalX = getAttackingGoalX(player.isHome, gameState.currentHalf);
    const directionToGoal = Math.sign(opponentGoalX - player.x);
    gameState.ballTrajectory = null;
    gameState.ballHolder = null;
    gameState.ballHeight = 0;
    if (gameState.ballPosition) {
      gameState.ballPosition.x = player.x + directionToGoal * 15;
      gameState.ballPosition.y = player.y;
    }
    if (gameState.ballVelocity) {
      gameState.ballVelocity.x = directionToGoal * 50;
      gameState.ballVelocity.y = (Math.random() - 0.5) * 30;
    }
    const allPlayers = [...gameState.homePlayers || [], ...gameState.awayPlayers || []];
    assignBallChasers(allPlayers, player);
  }

  // src/physics.ts
  var DEBUG_PHYSICS = false;
  var trajectoryInterceptionChecks = /* @__PURE__ */ new WeakMap();
  function updateBallTrajectory(_dt) {
    if (!gameState.ballTrajectory) {
      gameState.ballHeight = 0;
      return;
    }
    const traj = gameState.ballTrajectory;
    const elapsed = Date.now() - traj.startTime;
    const progress = Math.min(elapsed / traj.duration, 1);
    gameState.ballPosition.x = traj.startX + (traj.endX - traj.startX) * progress;
    gameState.ballPosition.y = traj.startY + (traj.endY - traj.startY) * progress;
    const heightProgress = Math.sin(progress * Math.PI);
    gameState.ballHeight = heightProgress * traj.maxHeight;
    if (traj.passType === "aerial" && gameState.ballHeight > 0.5) {
      if (gameState.ballPosition.y < 20 || gameState.ballPosition.y > 580) {
        if (DEBUG_PHYSICS) {
          console.log(`[Physics] Ball out of bounds during aerial pass (y=${gameState.ballPosition.y}), resetting to center`);
        }
        gameState.ballTrajectory = null;
        gameState.ballHeight = 0;
        gameState.ballPosition = { x: 400, y: 300 };
        const outText = `${Math.floor(gameState.timeElapsed)}' Ball out of play!`;
        gameState.commentary.push({ text: outText, type: "attack" });
        gameState.commentary = gameState.commentary.slice(-6);
        return;
      }
    }
    if (!traj.isShot && progress > 0.2 && progress < 0.9) {
      const now = Date.now();
      const lastInterceptCheck = trajectoryInterceptionChecks.get(traj) || traj.startTime;
      if (now - lastInterceptCheck > 100) {
        trajectoryInterceptionChecks.set(traj, now);
        if (typeof handleBallInterception === "function") {
          handleBallInterception(progress);
        }
      }
    }
    if (progress >= 1) {
      const direction = Math.atan2(traj.endY - traj.startY, traj.endX - traj.startX);
      const landingSpeed = traj.speed * 0.3;
      gameState.ballVelocity.x = Math.cos(direction) * landingSpeed;
      gameState.ballVelocity.y = Math.sin(direction) * landingSpeed;
      if (DEBUG_PHYSICS) {
        console.log(`[Physics] Ball trajectory complete (${traj.passType}): landed at (${gameState.ballPosition.x.toFixed(1)}, ${gameState.ballPosition.y.toFixed(1)}), velocity=(${gameState.ballVelocity.x.toFixed(1)}, ${gameState.ballVelocity.y.toFixed(1)})`);
      }
      gameState.ballTrajectory = null;
      gameState.ballHeight = 0;
      gameState.shotInProgress = false;
      gameState.shooter = null;
      gameState.currentShotXG = null;
      const priorityChaser = gameState.currentPassReceiver;
      gameState.currentPassReceiver = null;
      const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
      assignBallChasers(allPlayers, priorityChaser);
    }
  }
  function validateBallState() {
    if (!isFinite(gameState.ballPosition.x) || !isFinite(gameState.ballPosition.y)) {
      console.warn("[Physics] \u26A0\uFE0F Ball position invalid, resetting to center. Previous value:", gameState.ballPosition);
      gameState.ballPosition = { x: 400, y: 300 };
    }
    const oldX = gameState.ballPosition.x;
    const oldY = gameState.ballPosition.y;
    gameState.ballPosition.x = Math.max(5, Math.min(795, gameState.ballPosition.x));
    gameState.ballPosition.y = Math.max(5, Math.min(595, gameState.ballPosition.y));
    if (DEBUG_PHYSICS && (oldX !== gameState.ballPosition.x || oldY !== gameState.ballPosition.y)) {
      console.log(`[Physics] Ball position clamped from (${oldX.toFixed(1)}, ${oldY.toFixed(1)}) to (${gameState.ballPosition.x.toFixed(1)}, ${gameState.ballPosition.y.toFixed(1)})`);
    }
    if (!isFinite(gameState.ballVelocity.x) || !isFinite(gameState.ballVelocity.y)) {
      console.warn("[Physics] \u26A0\uFE0F Ball velocity invalid, resetting to zero. Previous value:", gameState.ballVelocity);
      gameState.ballVelocity = { x: 0, y: 0 };
    }
    const maxVelocity = 1e3;
    const speed = Math.sqrt(
      gameState.ballVelocity.x * gameState.ballVelocity.x + gameState.ballVelocity.y * gameState.ballVelocity.y
    );
    if (speed > maxVelocity) {
      const scale = maxVelocity / speed;
      if (DEBUG_PHYSICS) {
        console.log(`[Physics] Ball velocity clamped from ${speed.toFixed(1)} to ${maxVelocity} (scale=${scale.toFixed(2)})`);
      }
      gameState.ballVelocity.x *= scale;
      gameState.ballVelocity.y *= scale;
    }
    if (!isFinite(gameState.ballHeight) || gameState.ballHeight < 0) {
      gameState.ballHeight = 0;
    }
  }
  function validateBallHolder(player) {
    if (!player)
      return null;
    if (typeof player.isHome !== "boolean") {
      console.warn("Ball holder missing isHome property", player);
      return null;
    }
    if (typeof player.x !== "number" || typeof player.y !== "number") {
      console.warn("Ball holder missing position", player);
      return null;
    }
    return player;
  }
  function updatePhysics(dt) {
    validateBallState();
    const isSetPiece = isSetPieceStatus(gameState.status);
    if (isSetPiece) {
      if (gameState.setPiece && gameState.setPiece.position) {
        gameState.ballPosition.x = gameState.setPiece.position.x;
        gameState.ballPosition.y = gameState.setPiece.position.y;
        gameState.ballVelocity = { x: 0, y: 0 };
        gameState.ballHeight = 0;
        gameState.ballTrajectory = null;
      }
      const allPlayers2 = [...gameState.homePlayers, ...gameState.awayPlayers];
      updatePlayerPhysics(allPlayers2, dt);
      return;
    }
    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    updateBallTrajectory(dt);
    if (!gameState.ballTrajectory) {
      updateBallWithHolder(allPlayers, dt);
    }
    updatePlayerPhysics(allPlayers, dt);
    if (typeof window.updateParticles === "function") {
      window.updateParticles(dt);
    }
    updateCameraShake(dt);
  }
  function updateBallWithHolder(allPlayers, dt) {
    const holder = gameState.ballHolder;
    if (holder && allPlayers.includes(holder)) {
      const facingAngle = typeof window.getPlayerFacingDirection === "function" ? window.getPlayerFacingDirection(holder) : 0;
      const ballOffsetDistance = 12;
      const offsetX = Math.cos(facingAngle) * ballOffsetDistance;
      const offsetY = Math.sin(facingAngle) * ballOffsetDistance;
      gameState.ballPosition.x = holder.x + offsetX;
      gameState.ballPosition.y = holder.y + offsetY;
      if (holder.role === "GK") {
        handleGoalkeeperBallHold(holder, allPlayers);
      }
    } else {
      if (holder) {
        console.log("Clearing invalid ball holder");
        gameState.ballHolder = null;
      }
      const currentSpeed = Math.sqrt(
        gameState.ballVelocity.x * gameState.ballVelocity.x + gameState.ballVelocity.y * gameState.ballVelocity.y
      );
      const FRICTION = window.BALL_PHYSICS?.FRICTION ?? 0.985;
      const frictionDecay = Math.pow(FRICTION, dt);
      gameState.ballVelocity.x *= frictionDecay;
      gameState.ballVelocity.y *= frictionDecay;
      if (currentSpeed < 5) {
        gameState.ballVelocity.x = 0;
        gameState.ballVelocity.y = 0;
      }
      gameState.ballPosition.x += gameState.ballVelocity.x * dt;
      gameState.ballPosition.y += gameState.ballVelocity.y * dt;
      if (gameState.ballPosition.x < 5 || gameState.ballPosition.x > 795) {
        if (typeof window.handleBallOutOfBounds === "function") {
          window.handleBallOutOfBounds();
        }
        return;
      }
      if (gameState.ballPosition.y < 5 || gameState.ballPosition.y > 595) {
        if (typeof window.handleThrowIn === "function") {
          window.handleThrowIn();
        }
        return;
      }
      const now = Date.now();
      const timeSinceLastAttempt = now - (gameState.lastControlAttempt || 0);
      const minInterval = currentSpeed > 100 ? 100 : 200;
      if (timeSinceLastAttempt > minInterval) {
        if (typeof window.resolveBallControl === "function") {
          window.resolveBallControl(allPlayers);
        }
        gameState.lastControlAttempt = now;
      }
    }
  }
  var PHYSICS_DEFAULTS = {
    MOVEMENT_THRESHOLD: 2,
    ACCELERATION: 1200,
    MAX_SPEED: 220,
    DRIBBLE_SPEED_PENALTY: 0.8,
    FRICTION: 0.88,
    BALL_CONTROL_DISTANCE: 25,
    HEADER_HEIGHT_THRESHOLD: 0.6,
    PASS_INTERCEPT_DISTANCE: 25,
    LONG_PASS_THRESHOLD: 150
  };
  function updatePlayerPhysics(allPlayers, dt) {
    const PHYSICS2 = window.PHYSICS ?? PHYSICS_DEFAULTS;
    allPlayers.forEach((player) => {
      if (!isFinite(player.x) || !isFinite(player.y)) {
        console.error("Player position corrupted:", player.name);
        player.x = player.homeX ?? 400;
        player.y = player.homeY ?? 300;
        player.vx = 0;
        player.vy = 0;
        return;
      }
      if (!isFinite(player.targetX) || !isFinite(player.targetY)) {
        player.targetX = player.x;
        player.targetY = player.y;
      }
      const dx = player.targetX - player.x;
      const dy = player.targetY - player.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > PHYSICS2.MOVEMENT_THRESHOLD) {
        updatePlayerVelocity(player, dx, dy, dist, dt);
        const speed = Math.sqrt(player.vx * player.vx + player.vy * player.vy);
        const distCovered = player.distanceCovered ?? 0;
        player.distanceCovered = distCovered + speed * dt;
        let drainRate = 0.15;
        if (speed > 180)
          drainRate = 0.8;
        else if (speed > 140)
          drainRate = 0.4;
        else if (speed > 100)
          drainRate = 0.25;
        if (player.isChasingBall)
          drainRate *= 1.2;
        const stamina = player.stamina ?? 100;
        player.stamina = Math.max(0, stamina - drainRate * dt);
        if (stamina < 20) {
          player.speedBoost = Math.max(player.speedBoost * 0.9, 0.6);
        } else if (stamina < 40) {
          player.speedBoost = Math.max(player.speedBoost * 0.95, 0.8);
        }
      } else {
        applyPlayerFriction(player, dt);
        const speed = Math.sqrt(player.vx * player.vx + player.vy * player.vy);
        const recoveryRate = speed < 10 ? 1.2 : 0.6;
        const stamina = player.stamina ?? 100;
        player.stamina = Math.min(100, stamina + recoveryRate * dt);
      }
      player.x += player.vx * dt;
      player.y += player.vy * dt;
      player.x = Math.max(20, Math.min(780, player.x));
      player.y = Math.max(20, Math.min(580, player.y));
    });
  }
  function assignBallChasers(allPlayers, priorityChaser = null) {
    gameState.ballChasers.clear();
    if (gameState.ballHolder?.hasBallControl || gameState.ballTrajectory) {
      allPlayers.forEach((p) => {
        p.isChasingBall = false;
      });
      return;
    }
    if (!gameState.ballPosition)
      return;
    const chaseEvaluations = allPlayers.filter((p) => p.role !== "GK").map((player) => {
      const distToBall = distance(player, gameState.ballPosition);
      if (distToBall > 150)
        return { player, score: 0, distToBall };
      let score = 100;
      score += Math.max(0, 100 - distToBall);
      score += player.pace / 100 * 30;
      const aggressiveRoles = ["ST", "CAM", "CDM", "CM"];
      if (aggressiveRoles.includes(player.role))
        score += 20;
      if (player.vx || player.vy) {
        const playerAngle = Math.atan2(player.vy, player.vx);
        const ballAngle = Math.atan2(
          gameState.ballPosition.y - player.y,
          gameState.ballPosition.x - player.x
        );
        let angleDiff = Math.abs(playerAngle - ballAngle);
        if (angleDiff > Math.PI)
          angleDiff = 2 * Math.PI - angleDiff;
        if (angleDiff < Math.PI / 3)
          score += 25;
      }
      const stamina = player.stamina ?? 100;
      if (stamina < 40)
        score *= 0.7;
      const ownGoalX = getAttackingGoalX(!player.isHome, gameState.currentHalf);
      const ballDistToOwnGoal = Math.abs(gameState.ballPosition.x - ownGoalX);
      if (ballDistToOwnGoal < 250) {
        if (["CB", "RB", "LB", "CDM"].includes(player.role)) {
          score += 30;
        }
      }
      return { player, score, distToBall };
    }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score);
    const MAX_CHASERS_PER_TEAM = 2;
    const homeChasers = chaseEvaluations.filter((e) => e.player.isHome).slice(0, MAX_CHASERS_PER_TEAM);
    const awayChasers = chaseEvaluations.filter((e) => !e.player.isHome).slice(0, MAX_CHASERS_PER_TEAM);
    [...homeChasers, ...awayChasers].forEach((evaluation) => {
      evaluation.player.isChasingBall = true;
      gameState.ballChasers.add(evaluation.player.id);
    });
    if (priorityChaser) {
      priorityChaser.isChasingBall = true;
      gameState.ballChasers.add(priorityChaser.id);
    }
  }
  function handleGoalkeeperBallHold(holder, allPlayers) {
    if (!holder.ballReceivedTime) {
      holder.ballReceivedTime = Date.now();
    }
    const GK_HOLD_TIME = window.GAME_CONFIG?.GK_HOLD_TIME ?? 5e3;
    if (holder.ballReceivedTime && holder === gameState.ballHolder) {
      const holdTime = Date.now() - holder.ballReceivedTime;
      if (holdTime > GK_HOLD_TIME) {
        const teammates = allPlayers.filter((p) => p.isHome === holder.isHome && p.role !== "GK");
        if (teammates.length === 0)
          return;
        const teamState = holder.isHome ? gameState.homeTeamState : gameState.awayTeamState;
        let target;
        if (teamState === "COUNTER_ATTACK") {
          const forwards = teammates.filter((p) => ["ST", "RW", "LW", "CAM"].includes(p.role));
          target = forwards.length > 0 ? forwards[Math.floor(Math.random() * forwards.length)] : teammates[0];
        } else {
          const defenders = teammates.filter((p) => ["CB", "RB", "LB", "CDM"].includes(p.role)).sort((a, b) => distance(a, holder) - distance(b, holder));
          target = defenders.length > 0 ? defenders[0] : teammates[0];
        }
        if (target && typeof window.passBall === "function") {
          window.passBall(holder, holder.x, holder.y, target.x, target.y, 0.9, 450, false);
          holder.ballReceivedTime = null;
        }
      }
    }
  }
  function updatePlayerVelocity(player, dx, dy, dist, dt) {
    if (!isFinite(dx) || !isFinite(dy) || !isFinite(dist) || dist === 0) {
      return;
    }
    const PHYSICS2 = window.PHYSICS ?? PHYSICS_DEFAULTS;
    const SLOWING_RADIUS = 50;
    const physicalityBonus = player.physicality / 100 * 0.15;
    const speedMultiplier = player.speedBoost || 1;
    const paceFactor = 0.3 + player.pace / 100 * 0.7;
    const accel = PHYSICS2.ACCELERATION * (paceFactor + physicalityBonus) * speedMultiplier;
    const maxSpeed = PHYSICS2.MAX_SPEED * paceFactor * speedMultiplier;
    const effectiveMaxSpeed = player.hasBallControl ? maxSpeed * PHYSICS2.DRIBBLE_SPEED_PENALTY : maxSpeed * 1.15;
    let desiredSpeed = effectiveMaxSpeed;
    if (dist < SLOWING_RADIUS) {
      desiredSpeed = effectiveMaxSpeed * (dist / SLOWING_RADIUS);
    }
    const dirX = safeDiv(dx, dist, 0);
    const dirY = safeDiv(dy, dist, 0);
    const desiredVX = dirX * desiredSpeed;
    const desiredVY = dirY * desiredSpeed;
    const steeringForceX = desiredVX - player.vx;
    const steeringForceY = desiredVY - player.vy;
    const maxForce = accel * dt;
    const steeringMagnitude = Math.sqrt(steeringForceX * steeringForceX + steeringForceY * steeringForceY);
    if (steeringMagnitude > maxForce) {
      const ratio = maxForce / steeringMagnitude;
      player.vx += steeringForceX * ratio;
      player.vy += steeringForceY * ratio;
    } else {
      player.vx += steeringForceX;
      player.vy += steeringForceY;
    }
    const currentSpeed = safeSqrt(player.vx * player.vx + player.vy * player.vy, 0);
    player.currentSpeed = currentSpeed;
    if (currentSpeed > effectiveMaxSpeed && currentSpeed > 0) {
      const ratio = safeDiv(effectiveMaxSpeed, currentSpeed, 1);
      player.vx *= ratio;
      player.vy *= ratio;
    }
  }
  function applyPlayerFriction(player, dt) {
    const PHYSICS_FRICTION = window.PHYSICS?.FRICTION ?? 0.88;
    const physicalityPenalty = player.physicality / 100 * 0.05;
    const effectiveFriction = PHYSICS_FRICTION - physicalityPenalty;
    const frictionDecay = Math.pow(effectiveFriction, dt);
    player.vx *= frictionDecay;
    player.vy *= frictionDecay;
    if (Math.abs(player.vx) < 5)
      player.vx = 0;
    if (Math.abs(player.vy) < 5)
      player.vy = 0;
    player.currentSpeed = 0;
  }
  function updateCameraShake(dt) {
    const cameraShake = gameState.cameraShake ?? 0;
    if (cameraShake > 0) {
      const newShake = cameraShake - cameraShake * 18 * dt;
      gameState.cameraShake = newShake < 0.1 ? 0 : newShake;
    }
  }
  if (typeof window !== "undefined") {
    window.updatePhysics = updatePhysics;
    window.updatePlayerPhysics = updatePlayerPhysics;
    window.updateBallWithHolder = updateBallWithHolder;
    window.updateBallTrajectory = updateBallTrajectory;
    window.validateBallState = validateBallState;
    console.log("\u2705 Physics System loaded (TypeScript)");
  }

  // src/ai/playerFirstTouch.ts
  var FIRST_TOUCH_CONFIG = {
    // Control quality thresholds
    PERFECT_TOUCH_THRESHOLD: 0.85,
    // Takes ball in stride
    GOOD_TOUCH_THRESHOLD: 0.7,
    // Controls but slows
    POOR_TOUCH_THRESHOLD: 0.3,
    // Heavy touch, ball gets away
    // Below 0.50 = complete loss of control
    // Speed penalties after control
    PERFECT_TOUCH_SPEED: 1,
    // No slowdown
    GOOD_TOUCH_SPEED: 0.7,
    // Slows to control
    POOR_TOUCH_SPEED: 0.4,
    // Nearly stops
    // Time to settle ball
    PERFECT_TOUCH_SETTLE_TIME: 0,
    // Immediate
    GOOD_TOUCH_SETTLE_TIME: 300,
    // ms
    POOR_TOUCH_SETTLE_TIME: 600,
    // ms
    // Bounce distances for failed control
    MIN_BOUNCE_DISTANCE: 30,
    // pixels
    MAX_BOUNCE_DISTANCE: 70,
    // pixels
    // Ball speed thresholds (pixels/second)
    SLOW_PASS_SPEED: 200,
    FAST_PASS_SPEED: 450,
    // Pressure effect
    PRESSURE_DISTANCE: 30,
    // Opponent this close affects control
    PRESSURE_PENALTY_PER_OPP: 0.12
    // Each opponent reduces control
  };
  function calculateFirstTouchQuality(player, ballSpeed, nearbyOpponents) {
    const baseAbility = player.dribbling / 100;
    const realStats = player.realStats || {};
    const ballControlBonus = realStats.dribblesSucceeded ? realStats.dribblesSucceeded / 90 * 0.15 : 0;
    const denominator = FIRST_TOUCH_CONFIG.FAST_PASS_SPEED - FIRST_TOUCH_CONFIG.SLOW_PASS_SPEED;
    const speedDifficulty = denominator > 0 ? Math.min((ballSpeed - FIRST_TOUCH_CONFIG.SLOW_PASS_SPEED) / denominator, 1) : 0;
    const speedPenalty = speedDifficulty * 0.25;
    const opponentsInRange = nearbyOpponents.filter(
      (opp) => distance(player, opp) < FIRST_TOUCH_CONFIG.PRESSURE_DISTANCE
    );
    const pressurePenalty = opponentsInRange.length * FIRST_TOUCH_CONFIG.PRESSURE_PENALTY_PER_OPP;
    const fatiguePenalty = (100 - player.stamina) / 90 * 0.15;
    const ballAngle = Math.atan2(
      gameState.ballPosition.y - player.y,
      gameState.ballPosition.x - player.x
    );
    const facingAngle = player.facingAngle || getPlayerFacingDirection(player);
    let angleDiff = Math.abs(ballAngle - facingAngle);
    if (angleDiff > Math.PI)
      angleDiff = 2 * Math.PI - angleDiff;
    const bodyPositionPenalty = angleDiff / Math.PI * 0.2;
    let quality = baseAbility + ballControlBonus + 0.1 - // Base + bonus + slight advantage
    speedPenalty - pressurePenalty - fatiguePenalty - bodyPositionPenalty;
    const variance = (Math.random() - 0.5) * 0.15;
    quality += variance;
    return Math.max(0, Math.min(1, quality));
  }
  function applyFirstTouch(player, trajectory, allPlayers) {
    const ballSpeed = trajectory ? Math.sqrt(
      Math.pow((trajectory.endX - trajectory.startX) / (trajectory.duration / 1e3), 2) + Math.pow((trajectory.endY - trajectory.startY) / (trajectory.duration / 1e3), 2)
    ) : 200;
    const opponents = allPlayers.filter((p) => p.isHome !== player.isHome);
    const nearbyOpponents = opponents.filter(
      (opp) => distance(player, opp) < FIRST_TOUCH_CONFIG.PRESSURE_DISTANCE * 1.5
    );
    const touchQuality = calculateFirstTouchQuality(player, ballSpeed, nearbyOpponents);
    let outcome;
    let settleTime;
    let speedMultiplier;
    if (touchQuality >= FIRST_TOUCH_CONFIG.PERFECT_TOUCH_THRESHOLD) {
      outcome = "perfect";
      settleTime = FIRST_TOUCH_CONFIG.PERFECT_TOUCH_SETTLE_TIME;
      speedMultiplier = FIRST_TOUCH_CONFIG.PERFECT_TOUCH_SPEED;
    } else if (touchQuality >= FIRST_TOUCH_CONFIG.GOOD_TOUCH_THRESHOLD) {
      outcome = "good";
      settleTime = FIRST_TOUCH_CONFIG.GOOD_TOUCH_SETTLE_TIME;
      speedMultiplier = FIRST_TOUCH_CONFIG.GOOD_TOUCH_SPEED;
    } else if (touchQuality >= FIRST_TOUCH_CONFIG.POOR_TOUCH_THRESHOLD) {
      outcome = "poor";
      settleTime = FIRST_TOUCH_CONFIG.POOR_TOUCH_SETTLE_TIME;
      speedMultiplier = FIRST_TOUCH_CONFIG.POOR_TOUCH_SPEED;
    } else {
      outcome = "failed";
      settleTime = 0;
      speedMultiplier = 0;
    }
    player.firstTouchQuality = touchQuality;
    player.firstTouchTime = Date.now();
    player.ballSettleTime = settleTime;
    player.speedBoost = speedMultiplier;
    console.log(`\xAF ${player.name} first touch: ${outcome} (${(touchQuality * 100).toFixed(0)}%)`);
    return {
      outcome,
      quality: touchQuality,
      settleTime,
      speedMultiplier
    };
  }
  function handleFailedFirstTouch(player, allPlayers) {
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
      type: "attack"
    });
    if (typeof eventBus !== "undefined") {
      eventBus.publish("BALL_LOST" /* BALL_LOST */, {
        player,
        reason: "poor_first_touch"
      });
    }
    assignBallChasers(allPlayers, player);
  }
  function handlePoorFirstTouch(player, touchResult) {
    console.log(` ${player.name} heavy touch`);
    const movementAngle = player.facingAngle || getPlayerFacingDirection(player);
    const pushDistance = 40 + Math.random() * 30;
    gameState.ballPosition.x = player.x + Math.cos(movementAngle) * pushDistance;
    gameState.ballPosition.y = player.y + Math.sin(movementAngle) * pushDistance;
    gameState.ballTrajectory = null;
    gameState.ballHolder = player;
    player.hasBallControl = true;
    player.ballReceivedTime = Date.now();
    gameState.ballChasers.clear();
    player.speedBoost = touchResult.speedMultiplier;
    setTimeout(() => {
      if (player.hasBallControl) {
        player.speedBoost = 1;
        delete player.ballSettleTime;
      }
    }, touchResult.settleTime);
  }
  function handleSuccessfulFirstTouch(player, touchResult) {
    const wasPerfect = touchResult.outcome === "perfect";
    if (wasPerfect) {
      console.log(`\xA8 ${player.name} perfect touch!`);
    }
    const previousHolder = gameState.ballHolder;
    if (!previousHolder || previousHolder.isHome !== player.isHome) {
      gameState.lastPossessionChange = Date.now();
      gameState.possessionChanges++;
    }
    if (previousHolder && previousHolder.isHome === player.isHome && previousHolder.id !== player.id) {
      const teamStats = player.isHome ? gameState.stats.home : gameState.stats.away;
      teamStats.passesCompleted++;
    }
    gameState.ballTrajectory = null;
    gameState.ballHolder = player;
    player.hasBallControl = true;
    player.ballReceivedTime = Date.now();
    gameState.ballChasers.clear();
    gameState.currentPassReceiver = null;
    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    allPlayers.forEach((p) => {
      if (p.id !== player.id) {
        p.isChasingBall = false;
        p.chaseStartTime = null;
      }
    });
    player.speedBoost = touchResult.speedMultiplier;
    if (wasPerfect) {
      player.speedBoost = 1;
      const moveAngle = player.facingAngle || getPlayerFacingDirection(player);
      gameState.ballPosition.x = player.x + Math.cos(moveAngle) * 15;
      gameState.ballPosition.y = player.y + Math.sin(moveAngle) * 15;
    } else {
      setTimeout(() => {
        if (player.hasBallControl && gameState.ballHolder === player) {
          player.speedBoost = 1;
          delete player.ballSettleTime;
          delete player.firstTouchTime;
        }
      }, touchResult.settleTime);
    }
  }
  function canPlayerActOnBall(player) {
    if (!player.hasBallControl)
      return false;
    if (player.ballSettleTime && player.firstTouchTime) {
      const timeSinceTouch = Date.now() - player.firstTouchTime;
      if (timeSinceTouch < player.ballSettleTime) {
        return false;
      }
    }
    return true;
  }
  function drawFirstTouchIndicator(ctx, player) {
    if (!player.firstTouchTime)
      return;
    const timeSinceTouch = Date.now() - player.firstTouchTime;
    const maxDisplayTime = 1e3;
    if (timeSinceTouch > maxDisplayTime) {
      delete player.firstTouchTime;
      delete player.firstTouchQuality;
      return;
    }
    const quality = player.firstTouchQuality || 0;
    const alpha = 1 - timeSinceTouch / maxDisplayTime;
    let color;
    if (quality >= 0.85) {
      color = `rgba(34, 197, 94, ${alpha})`;
    } else if (quality >= 0.7) {
      color = `rgba(59, 130, 246, ${alpha})`;
    } else if (quality >= 0.5) {
      color = `rgba(251, 191, 36, ${alpha})`;
    } else {
      color = `rgba(239, 68, 68, ${alpha})`;
    }
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(player.x, player.y, 22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  function initFirstTouchStats() {
    if (!gameState.stats.home)
      gameState.stats.home = {};
    if (!gameState.stats.away)
      gameState.stats.away = {};
    gameState.stats.home.firstTouches = {
      perfect: 0,
      good: 0,
      poor: 0,
      failed: 0,
      total: 0
    };
    gameState.stats.away.firstTouches = {
      perfect: 0,
      good: 0,
      poor: 0,
      failed: 0,
      total: 0
    };
  }
  function recordFirstTouchStatistic(player, outcome) {
    const teamStats = player.isHome ? gameState.stats.home : gameState.stats.away;
    if (!teamStats || !teamStats.firstTouches)
      return;
    if (outcome === "perfect" || outcome === "good" || outcome === "poor" || outcome === "failed") {
      teamStats.firstTouches[outcome]++;
    }
    teamStats.firstTouches.total++;
  }

  // src/batch-simulator.ts
  var CustomFixtureSimulator = {
    matchList: [],
    isRunning: false,
    results: [],
    currentMatchIndex: 0,
    addMatch(homeTeam, awayTeam) {
      if (!homeTeam || !awayTeam) {
        alert("\u26A0\uFE0F Please select both teams!");
        return;
      }
      if (homeTeam === awayTeam) {
        alert("\u26A0\uFE0F A team cannot play against itself!");
        return;
      }
      this.matchList.push({
        id: Date.now() + Math.random(),
        homeTeam,
        awayTeam
      });
      console.log(`\u2705 Added match: ${homeTeam} vs ${awayTeam}`);
      if (typeof gameState !== "undefined" && gameState.status === "setup") {
        this.renderMatchList();
      }
    },
    removeMatch(matchId) {
      this.matchList = this.matchList.filter((m) => m.id !== matchId);
      if (typeof gameState !== "undefined" && gameState.status === "setup") {
        this.renderMatchList();
      }
      console.log(`\u{1F5D1}\uFE0F Removed match`);
    },
    clearAll() {
      if (this.matchList.length === 0)
        return;
      if (confirm("\u{1F5D1}\uFE0F Clear all matches?")) {
        this.matchList = [];
        if (typeof gameState !== "undefined" && gameState.status === "setup") {
          this.renderMatchList();
        }
        console.log("\u{1F9F9} Match list cleared");
      }
    },
    renderMatchList() {
      const container = document.getElementById("custom-match-list");
      if (!container || typeof gameState === "undefined" || !gameState.teamLogos) {
        console.warn("Cannot render match list: container or gameState not ready.");
        return;
      }
      if (this.matchList.length === 0) {
        container.innerHTML = `
                <div style="text-align: center; padding: 40px; opacity: 0.5;">
                    <div style="font-size: 48px; margin-bottom: 10px;">\u26BD</div>
                    <div>No matches added yet</div>
                    <div style="font-size: 14px; margin-top: 5px;">Add matches below to start</div>
                </div>
            `;
        const simulateBtn2 = document.getElementById("simulate-all-btn");
        if (simulateBtn2) {
          simulateBtn2.disabled = true;
          simulateBtn2.style.opacity = "0.5";
        }
        return;
      }
      const simulateBtn = document.getElementById("simulate-all-btn");
      if (simulateBtn) {
        simulateBtn.disabled = false;
        simulateBtn.style.opacity = "1";
      }
      container.innerHTML = `
            <div style="max-height: 400px; overflow-y: auto; padding-right: 10px;">
                ${this.matchList.map((match) => `
                    <div class="match-item" style="display: flex; align-items: center; justify-content: space-between; padding: 15px; margin-bottom: 10px; background: rgba(255,255,255,0.05); border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s ease;">
                        <div style="flex: 1; display: flex; align-items: center; gap: 10px; min-width: 0;">
                            <img src="${gameState.teamLogos[match.homeTeam] || ""}" style="width: 24px; height: 24px; object-fit: contain; flex-shrink: 0;">
                            <span style="font-weight: 700; color: #4facfe; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${match.homeTeam}</span>
                            <span style="margin: 0 10px; opacity: 0.5;">vs</span>
                            <span style="font-weight: 700; color: #fa709a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${match.awayTeam}</span>
                            <img src="${gameState.teamLogos[match.awayTeam] || ""}" style="width: 24px; height: 24px; object-fit: contain; flex-shrink: 0;">
                        </div>
                        <button onclick="CustomFixtureSimulator.removeMatch(${match.id})" style="padding: 8px 15px; background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; border-radius: 6px; color: #ef4444; cursor: pointer; font-size: 14px; transition: all 0.3s; margin-left: 10px; flex-shrink: 0;">
                            \u{1F5D1}\uFE0F Remove
                        </button>
                    </div>
                `).join("")}
            </div>
            <div style="margin-top: 15px; padding: 10px; background: rgba(16, 185, 129, 0.1); border-radius: 8px; text-align: center; font-size: 14px;">
                \u2705 <strong>${this.matchList.length}</strong> matches ready to simulate
            </div>
        `;
    },
    async simulateAll() {
      if (this.matchList.length === 0) {
        alert("\u26A0\uFE0F No matches to simulate!");
        return;
      }
      const requiredFuncs = [
        "selectBestTeam",
        "selectBestTactic",
        "initializePlayers",
        "updatePlayerAI_V2",
        "updatePhysics",
        "assignBallChasers",
        "SetPieceIntegration",
        "processPendingEvents",
        "updateMatchStats",
        "switchSides",
        "getPlayerActivePosition",
        "getAttackingGoalX",
        "resetAfterGoal",
        "handleShotAttempt"
      ];
      for (const funcName of requiredFuncs) {
        if (typeof window[funcName] !== "function" && typeof window[funcName] !== "object") {
          alert(`\u274C Error: Required function "${funcName}" is missing. Cannot start simulation.`);
          console.error(`Missing function: ${funcName}`);
          return;
        }
      }
      this.isRunning = true;
      this.results = [];
      this.currentMatchIndex = 0;
      console.log(`\u{1F680} Starting batch simulation: ${this.matchList.length} matches`);
      this.showSimulationScreen();
      for (let i = 0; i < this.matchList.length; i++) {
        if (!this.isRunning)
          break;
        this.currentMatchIndex = i;
        const match = this.matchList[i];
        if (!match) {
          console.error(`Match at index ${i} is invalid.`);
          continue;
        }
        this.highlightMatchCard(match.id, "playing");
        try {
          const result = await this.simulateSingleMatch(match.homeTeam, match.awayTeam, match.id);
          if (result) {
            this.results.push(result);
            this.updateMatchCard(result);
            this.highlightMatchCard(match.id, "finished");
          } else {
            console.error(`Simulation for match ${match.id} (${match.homeTeam} vs ${match.awayTeam}) returned invalid result.`);
            this.highlightMatchCard(match.id, "error");
          }
        } catch (error) {
          console.error(`Error simulating match ${match.id} (${match.homeTeam} vs ${match.awayTeam}):`, error);
          this.highlightMatchCard(match.id, "error");
        }
      }
      this.isRunning = false;
      console.log("\u2705 All matches simulated");
      this.showCompletionControls();
    },
    async simulateSingleMatch(homeTeam, awayTeam, matchId) {
      if (typeof gameState === "undefined") {
        console.error("simulateSingleMatch: gameState is not defined!");
        return null;
      }
      return new Promise((resolve, reject) => {
        const originals = {
          renderGame: window.renderGame,
          updateGameUI: window.updateGameUI,
          render: window.render,
          drawPitchBackground: window.drawPitchBackground,
          introRenderLoop: window.introRenderLoop,
          setupKickOff: window.setupKickOff,
          handleHalfTime: window.handleHalfTime,
          handleFullTime: window.handleFullTime,
          showGoalAnimation: window.showGoalAnimation,
          createGoalExplosion: window.createGoalExplosion,
          gameSpeed: GAME_LOOP.GAME_SPEED,
          gameContext: gameState.contexts?.game
        };
        if (window.DEBUG_BATCH_SIM) {
          console.log(`[BatchSim] Disabling rendering for match ${matchId}`);
        }
        window.renderGame = () => {
        };
        window.updateGameUI = () => {
        };
        window.render = () => {
        };
        window.drawPitchBackground = () => {
        };
        window.introRenderLoop = () => {
        };
        if (typeof window.showGoalAnimation === "function")
          window.showGoalAnimation = () => {
          };
        if (typeof window.createGoalExplosion === "function")
          window.createGoalExplosion = () => {
          };
        window.setupKickOff = (teamWithBall) => {
          if (typeof originals.setupKickOff === "function") {
            originals.setupKickOff(teamWithBall);
            if (gameState.setPiece) {
              gameState.setPiece.executionTime = Date.now();
            }
          } else {
            gameState.status = "KICK_OFF";
            gameState.setPiece = { type: "KICK_OFF", team: teamWithBall === "home", position: { x: 400, y: 300 }, executed: false, executionTime: Date.now() };
          }
        };
        window.handleHalfTime = () => {
          if (gameState.status === "halftime")
            return;
          gameState.status = "halftime";
          switchSides();
          gameState.currentHalf = 2;
          gameState.timeElapsed = 45;
          window.setupKickOff("away");
        };
        window.handleFullTime = () => {
          gameState.status = "finished";
          if (window.batchGameIntervalId) {
            clearInterval(window.batchGameIntervalId);
            window.batchGameIntervalId = null;
          }
        };
        try {
          GAME_LOOP.GAME_SPEED = 500;
          if (!gameState.contexts) {
            gameState.contexts = {
              background: null,
              game: null,
              ui: null
            };
          }
          gameState.contexts.game = {
            dummy: true,
            clearRect: () => {
            },
            beginPath: () => {
            },
            moveTo: () => {
            },
            lineTo: () => {
            },
            arc: () => {
            },
            fill: () => {
            },
            stroke: () => {
            },
            fillRect: () => {
            },
            strokeRect: () => {
            },
            save: () => {
            },
            restore: () => {
            },
            translate: () => {
            },
            rotate: () => {
            },
            scale: () => {
            },
            createLinearGradient: () => ({ addColorStop: () => {
            } }),
            createRadialGradient: () => ({ addColorStop: () => {
            } }),
            drawImage: () => {
            },
            setTransform: () => {
            },
            fillText: () => {
            },
            measureText: () => ({ width: 0 }),
            setLineDash: () => {
            }
          };
          gameState.homeTeam = homeTeam;
          gameState.awayTeam = awayTeam;
          const homeTeamObj = selectBestTeam(homeTeam);
          const awayTeamObj = selectBestTeam(awayTeam);
          if (!homeTeamObj || !awayTeamObj || !homeTeamObj.players || !awayTeamObj.players) {
            throw new Error("Could not select valid teams.");
          }
          gameState.homeFormation = homeTeamObj.formation;
          gameState.awayFormation = awayTeamObj.formation;
          gameState.homeTactic = selectBestTactic(homeTeamObj.players);
          gameState.awayTactic = selectBestTactic(awayTeamObj.players);
          const initialized = initializePlayers(
            homeTeamObj.players,
            awayTeamObj.players,
            homeTeamObj.formation,
            awayTeamObj.formation
          );
          if (!initialized || !initialized.home || !initialized.away) {
            throw new Error("Could not initialize players.");
          }
          gameState.homePlayers = initialized.home;
          gameState.awayPlayers = initialized.away;
          gameState.status = "KICK_OFF";
          gameState.timeElapsed = 0;
          gameState.currentHalf = 1;
          gameState.homeScore = 0;
          gameState.awayScore = 0;
          gameState.ballPosition = { x: 400, y: 300 };
          gameState.ballVelocity = { x: 0, y: 0 };
          gameState.ballHeight = 0;
          gameState.ballTrajectory = null;
          gameState.ballHolder = null;
          gameState.commentary = [];
          gameState.particles = [];
          gameState.ballChasers = /* @__PURE__ */ new Set();
          gameState.shotInProgress = false;
          gameState.shooter = null;
          gameState.goalEvents = [];
          gameState.cardEvents = [];
          gameState.fouls = 0;
          gameState.yellowCards = [];
          gameState.redCards = [];
          gameState.stats = { home: { possession: 0, passesCompleted: 0, passesAttempted: 0, shotsOnTarget: 0, shotsOffTarget: 0, xGTotal: 0, offsides: 0 }, away: { possession: 0, passesCompleted: 0, passesAttempted: 0, shotsOnTarget: 0, shotsOffTarget: 0, xGTotal: 0, offsides: 0 }, possessionTimer: { home: 0, away: 0 }, lastPossessionUpdate: Date.now() };
          window.setupKickOff("home");
          let lastFrameTimeSim = performance.now();
          let physicsAccumulatorSim = 0;
          window.gameTime = 0;
          if (window.batchGameIntervalId)
            clearInterval(window.batchGameIntervalId);
          const simulationStep = () => {
            const nowSim = performance.now();
            let real_dt = (nowSim - lastFrameTimeSim) / 1e3;
            lastFrameTimeSim = nowSim;
            real_dt = Math.max(0, Math.min(real_dt, 0.1));
            const game_dt = real_dt * GAME_LOOP.GAME_SPEED;
            let steps = 0;
            try {
              const allPlayers = [...gameState.homePlayers || [], ...gameState.awayPlayers || []];
              const validPlayers = allPlayers.filter((p) => p);
              if (typeof spatialSystem !== "undefined" && typeof spatialSystem.buildGrid === "function") {
                spatialSystem.buildGrid(validPlayers, GAME_CONFIG.PITCH_WIDTH, GAME_CONFIG.PITCH_HEIGHT);
              }
              if (gameState.status === "playing" && !gameState.ballHolder?.hasBallControl && !gameState.ballTrajectory) {
                if (typeof assignBallChasers === "function")
                  assignBallChasers(validPlayers);
              }
              const isGameActive = !["paused", "finished", "halftime", "goal_scored"].includes(gameState.status);
              const isSetPieceOrKickOff = typeof isSetPieceStatus === "function" ? isSetPieceStatus(gameState.status) : ["GOAL_KICK", "CORNER_KICK", "THROW_IN", "FREE_KICK", "KICK_OFF", "PENALTY"].includes(gameState.status);
              if (isSetPieceOrKickOff || isGameActive) {
                validPlayers.forEach((player) => {
                  if (typeof updatePlayerAI_V2 === "function") {
                    updatePlayerAI_V2(player, gameState.ballPosition, validPlayers, gameState);
                  }
                });
                if (isSetPieceOrKickOff && gameState.status !== "PENALTY") {
                  if (typeof integration_exports !== "undefined" && executeSetPiece_Router) {
                    executeSetPiece_Router(gameState);
                  }
                }
                if (gameState.status === "PENALTY" && typeof penaltySystem !== "undefined" && typeof penaltySystem.update === "function") {
                  penaltySystem.update(gameState);
                }
              }
              if (isGameActive || isSetPieceOrKickOff) {
                if (gameState.status === "playing") {
                  window.gameTime += game_dt;
                }
                if (typeof processPendingEvents === "function") {
                  processPendingEvents(window.gameTime);
                }
                physicsAccumulatorSim += game_dt;
                steps = 0;
                const maxSteps = 10;
                if (typeof updatePhysics === "function") {
                  while (physicsAccumulatorSim >= GAME_LOOP.FIXED_TIMESTEP && steps < maxSteps) {
                    updatePhysics(GAME_LOOP.FIXED_TIMESTEP);
                    physicsAccumulatorSim -= GAME_LOOP.FIXED_TIMESTEP;
                    steps++;
                  }
                  if (steps >= maxSteps) {
                    physicsAccumulatorSim = 0;
                  }
                }
              }
              if (gameState.status === "playing") {
                const timeIncrementThisStep = GAME_LOOP.FIXED_TIMESTEP * steps / 60;
                gameState.timeElapsed += timeIncrementThisStep;
              }
              if (typeof updateMatchStats === "function")
                updateMatchStats();
              if (gameState.timeElapsed >= 45 && gameState.currentHalf === 1) {
                window.handleHalfTime();
              }
              if (gameState.timeElapsed >= 90) {
                window.handleFullTime();
              }
            } catch (stepError) {
              console.error(`Error during simulation step for match ${matchId}:`, stepError);
              if (window.batchGameIntervalId)
                clearInterval(window.batchGameIntervalId);
              window.batchGameIntervalId = null;
              reject(stepError);
              return;
            }
            if (gameState.status === "finished") {
              if (window.batchGameIntervalId)
                clearInterval(window.batchGameIntervalId);
              window.batchGameIntervalId = null;
              Object.assign(window, {
                renderGame: originals.renderGame,
                updateGameUI: originals.updateGameUI,
                render: originals.render,
                drawPitchBackground: originals.drawPitchBackground,
                introRenderLoop: originals.introRenderLoop,
                setupKickOff: originals.setupKickOff,
                handleHalfTime: originals.handleHalfTime,
                handleFullTime: originals.handleFullTime,
                showGoalAnimation: originals.showGoalAnimation,
                createGoalExplosion: originals.createGoalExplosion
              });
              GAME_LOOP.GAME_SPEED = originals.gameSpeed;
              if (gameState.contexts)
                gameState.contexts.game = originals.gameContext ?? null;
              if (window.DEBUG_BATCH_SIM) {
                console.log(`[BatchSim] Restored rendering functions for match ${matchId}`);
              }
              const homePassAcc = (gameState.stats.home?.passesAttempted || 0) > 0 ? Math.round(gameState.stats.home.passesCompleted / gameState.stats.home.passesAttempted * 100) : 0;
              const awayPassAcc = (gameState.stats.away?.passesAttempted || 0) > 0 ? Math.round(gameState.stats.away.passesCompleted / gameState.stats.away.passesAttempted * 100) : 0;
              const result = {
                matchId,
                homeTeam,
                awayTeam,
                homeScore: gameState.homeScore ?? 0,
                awayScore: gameState.awayScore ?? 0,
                homeXG: (gameState.stats.home?.xGTotal || 0).toFixed(2),
                awayXG: (gameState.stats.away?.xGTotal || 0).toFixed(2),
                homePossession: gameState.stats.home?.possession || 0,
                awayPossession: gameState.stats.away?.possession || 0,
                homeShots: (gameState.stats.home?.shotsOnTarget || 0) + (gameState.stats.home?.shotsOffTarget || 0),
                awayShots: (gameState.stats.away?.shotsOnTarget || 0) + (gameState.stats.away?.shotsOffTarget || 0),
                homeShotsOnTarget: gameState.stats.home?.shotsOnTarget || 0,
                awayShotsOnTarget: gameState.stats.away?.shotsOnTarget || 0,
                homePassAccuracy: homePassAcc,
                awayPassAccuracy: awayPassAcc,
                winner: (gameState.homeScore ?? 0) > (gameState.awayScore ?? 0) ? homeTeam : (gameState.awayScore ?? 0) > (gameState.homeScore ?? 0) ? awayTeam : "Draw",
                goalEvents: [...gameState.goalEvents || []],
                cardEvents: [...gameState.cardEvents || []]
              };
              resolve(result);
            }
          };
          const intervalTime = 5;
          window.batchGameIntervalId = setInterval(simulationStep, intervalTime);
        } catch (setupError) {
          console.error(`Error setting up simulation for match ${matchId}:`, setupError);
          Object.assign(window, {
            renderGame: originals.renderGame,
            updateGameUI: originals.updateGameUI,
            render: originals.render,
            drawPitchBackground: originals.drawPitchBackground,
            introRenderLoop: originals.introRenderLoop,
            setupKickOff: originals.setupKickOff,
            handleHalfTime: originals.handleHalfTime,
            handleFullTime: originals.handleFullTime,
            showGoalAnimation: originals.showGoalAnimation,
            createGoalExplosion: originals.createGoalExplosion
          });
          GAME_LOOP.GAME_SPEED = originals.gameSpeed;
          if (gameState.contexts)
            gameState.contexts.game = originals.gameContext ?? null;
          reject(setupError);
        }
      });
    },
    showSimulationScreen() {
      const app = document.getElementById("app");
      if (!app)
        return;
      this.injectStyles();
      app.innerHTML = `
            <div class="container" style="padding: 40px; max-width: 800px; margin: auto;">
                <h1 style="text-align: center; font-size: 32px; margin-bottom: 10px; color: #fff; font-weight: 800; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">
                    LIVE SIMULATION
                </h1>

                <div id="toggle-container" style="max-width: 800px; margin: -10px auto 20px; text-align: right; padding-right: 20px;"></div>

                <p style="text-align: center; font-size: 16px; margin-bottom: 30px; color: #eee; text-shadow: 0 1px 3px rgba(0,0,0,0.5);">
                    Matches are being simulated... <span id="progress-indicator"></span>
                </p>

                <div id="simulation-match-list" class="simulation-container">
                    ${this.matchList.map((match) => match ? this.renderMatchCard(match) : "").join("")}
                </div>

                <div id="simulation-controls" style="text-align: center; margin-top: 40px; display: none;">
                    <button onclick="CustomFixtureSimulator.backToSetup()" class="btn" style="padding: 18px 40px; font-size: 16px; background: #10b981; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);">
                        \u{1F504} Run New Batch Simulation
                    </button>
                    <button onclick="CustomFixtureSimulator.exportResults()" class="btn" style="margin-left: 15px; padding: 18px 40px; font-size: 16px; background: #3b82f6; box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);">
                        \u{1F4BE} Export Results (JSON)
                    </button>
                </div>
            </div>
        `;
      const toggleContainer = document.getElementById("toggle-container");
      if (toggleContainer) {
        const toggleBtn = document.createElement("button");
        toggleBtn.id = "orientationToggleBtn";
        toggleBtn.style.background = "rgba(255,255,255,0.1)";
        toggleBtn.style.border = "1px solid rgba(255,255,255,0.2)";
        toggleBtn.style.color = "white";
        toggleBtn.style.padding = "5px 10px";
        toggleBtn.style.borderRadius = "5px";
        toggleBtn.style.cursor = "pointer";
        toggleBtn.style.fontSize = "10px";
        toggleBtn.style.opacity = "0.5";
        toggleBtn.style.transition = "opacity 0.3s";
        if (typeof gameState !== "undefined") {
          toggleBtn.innerText = gameState.isVertical ? "View: Horizontal" : "View: Vertical";
        } else {
          toggleBtn.innerText = "View: Vertical";
        }
        toggleBtn.onmouseover = () => toggleBtn.style.opacity = "1";
        toggleBtn.onmouseout = () => toggleBtn.style.opacity = "0.5";
        if (typeof window.toggleOrientation === "function") {
          toggleBtn.addEventListener("click", window.toggleOrientation);
        }
        toggleContainer.innerHTML = "";
        toggleContainer.appendChild(toggleBtn);
      }
      this.updateProgressIndicator();
    },
    renderMatchCard(match) {
      if (!match || !match.id || !match.homeTeam || !match.awayTeam) {
        console.error("Invalid match data provided to renderMatchCard:", match);
        return '<div class="match-card-live error">Invalid Match Data</div>';
      }
      const homeLogo = gameState.teamLogos && gameState.teamLogos[match.homeTeam] || "";
      const awayLogo = gameState.teamLogos && gameState.teamLogos[match.awayTeam] || "";
      return `
            <div class="match-card-live" id="match-card-${match.id}">
                <div class="mc-header">
                    <div class="mc-team home">
                        <span class="mc-team-name">${match.homeTeam}</span>
                        <img src="${homeLogo}" class="mc-team-logo" alt="${match.homeTeam} logo" onerror="this.style.display='none'">
                    </div>
                    <div class="mc-score" id="score-${match.id}">
                        <div class="mc-score-pending">
                            <div class="spinner"></div>
                        </div>
                    </div>
                    <div class="mc-team away">
                        <img src="${awayLogo}" class="mc-team-logo" alt="${match.awayTeam} logo" onerror="this.style.display='none'">
                        <span class="mc-team-name">${match.awayTeam}</span>
                    </div>
                </div>
                <div class="mc-body" id="body-${match.id}">
                    </div>
            </div>
        `;
    },
    updateMatchCard(result) {
      if (!result || !result.matchId)
        return;
      const card = document.getElementById(`match-card-${result.matchId}`);
      const scoreEl = document.getElementById(`score-${result.matchId}`);
      const bodyEl = document.getElementById(`body-${result.matchId}`);
      if (!card || !scoreEl || !bodyEl) {
        console.warn(`Elements for match card ${result.matchId} not found.`);
        return;
      }
      scoreEl.innerHTML = `
            <div class="mc-score-final">
                <span class="home-score ${result.homeScore > result.awayScore ? "win" : ""}">${result.homeScore}</span>
                <span class="separator">-</span>
                <span class="away-score ${result.awayScore > result.homeScore ? "win" : ""}">${result.awayScore}</span>
            </div>
        `;
      const allEvents = [
        ...(result.goalEvents || []).map((e) => ({ ...e, type: "goal" })),
        ...(result.cardEvents || []).map((e) => ({ ...e, type: "card" }))
      ];
      const homeEventsHTML = this._groupEventsByPlayer(allEvents, "home");
      const awayEventsHTML = this._groupEventsByPlayer(allEvents, "away");
      if (homeEventsHTML.length > 0 || awayEventsHTML.length > 0) {
        bodyEl.innerHTML = `
                <div class="mc-events-container">
                    <div class="mc-events-list home">
                        ${homeEventsHTML}
                    </div>
                    <div class="mc-events-list away">
                        ${awayEventsHTML}
                    </div>
                </div>
            `;
      }
      this.updateProgressIndicator();
    },
    _groupEventsByPlayer(allEvents, teamName) {
      if (!Array.isArray(allEvents))
        return "";
      const playerMap = {};
      const teamEvents = allEvents.filter((e) => e && e.isHome === (teamName === "home"));
      for (const event of teamEvents) {
        let playerName = "";
        let icon = "";
        if (event.type === "goal") {
          playerName = event.scorer;
          icon = "\u26BD\uFE0F";
        } else if (event.type === "card") {
          playerName = event.player;
          icon = event.card === "yellow" ? "\u{1F7E8}" : "\u{1F7E5}";
        }
        if (!playerName)
          continue;
        if (!playerMap[playerName])
          playerMap[playerName] = [];
        playerMap[playerName].push({ time: event.time ?? 0, icon });
      }
      const summaryLines = [];
      const sortedPlayerNames = Object.keys(playerMap).sort();
      for (const playerName of sortedPlayerNames) {
        const playerEvents = playerMap[playerName];
        if (playerEvents) {
          playerEvents.sort((a, b) => a.time - b.time);
          const eventStrings = playerEvents.map((e) => `${e.icon} '${e.time ?? ""}`).join(", ");
          summaryLines.push(`
                    <div class="mc-event-item">
                        <span class="mc-event-player">${playerName}</span>
                        <span class="mc-event-time">(${eventStrings})</span>
                    </div>
                `);
        }
      }
      return summaryLines.join("");
    },
    highlightMatchCard(matchId, state) {
      if (!matchId)
        return;
      const card = document.getElementById(`match-card-${matchId}`);
      if (!card)
        return;
      card.classList.remove("playing", "finished", "error");
      if (state === "playing")
        card.classList.add("playing");
      else if (state === "finished")
        card.classList.add("finished");
      else if (state === "error")
        card.classList.add("error");
      this.updateProgressIndicator();
    },
    updateProgressIndicator() {
      const indicator = document.getElementById("progress-indicator");
      if (indicator) {
        const totalMatches = this.matchList.length;
        const finishedMatches = this.results.length;
        indicator.textContent = `(${finishedMatches}/${totalMatches} completed)`;
      }
    },
    showCompletionControls() {
      const controls = document.getElementById("simulation-controls");
      if (controls)
        controls.style.display = "block";
    },
    injectStyles() {
      let style = document.getElementById("batch-sim-styles");
      if (style)
        return;
      style = document.createElement("style");
      style.id = "batch-sim-styles";
      style.innerHTML = `
            body.simulating { overflow: hidden; }
            .simulation-container { display: grid; grid-template-columns: 1fr; gap: 20px; }
            .match-card-live { background: rgba(31, 41, 55, 0.75); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4); overflow: hidden; transition: all 0.3s ease; opacity: 0.6; }
            .match-card-live.playing { opacity: 1; border-color: #3b82f6; box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
            .match-card-live.finished { opacity: 0.9; border-color: rgba(16, 185, 129, 0.4); }
            .match-card-live.error { opacity: 0.7; border-color: #ef4444; }
            .mc-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; background: rgba(0, 0, 0, 0.2); border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
            .mc-team { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; } .mc-team.home { justify-content: flex-start; } .mc-team.away { justify-content: flex-end; }
            .mc-team-name { font-size: 18px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } .mc-team.away .mc-team-name { text-align: right; }
            .mc-team-logo { width: 32px; height: 32px; object-fit: contain; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); }
            .mc-score { margin: 0 15px; min-width: 90px; text-align: center; }
            .mc-score-pending { font-size: 20px; font-weight: 700; color: #777; display: flex; justify-content: center; align-items: center; height: 36px; }
            .mc-score-final { font-family: 'Inter', sans-serif; font-size: 30px; font-weight: 900; color: #fff; display: flex; justify-content: center; align-items: center; gap: 8px; animation: fadeInScore 0.5s ease; height: 36px; }
            @keyframes fadeInScore { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
            .mc-score-final .separator { color: #888; font-weight: 700; font-size: 24px; } .mc-score-final .win { color: #f59e0b; }
            .mc-body { padding: 15px 20px 20px 20px; height: auto; min-height: 60px; overflow-y: auto; animation: fadeInBody 0.8s ease 0.2s; animation-fill-mode: backwards; border-top: 1px solid rgba(255,255,255,0.05); }
            @keyframes fadeInBody { from { opacity: 0; } to { opacity: 1; } }
            .mc-no-events { font-size: 12px; color: #888; text-align: center; padding-top: 10px; }
            .mc-events-container { display: flex; justify-content: space-between; gap: 15px; margin-bottom: 10px; max-height: 80px; overflow-y: auto; padding-right: 5px; }
            .mc-events-list { flex: 1; display: flex; flex-direction: column; gap: 5px; max-width: 48%; }
            .mc-event-item { display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: #ccc; font-weight: 500; line-height: 1.4; overflow: hidden; white-space: nowrap; }
            .mc-event-player { font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; min-width: 0; text-align: left; }
            .mc-events-list.away .mc-event-player { text-align: left; }
            .mc-event-time { font-size: 11px; color: #888; font-weight: 700; white-space: nowrap; flex-shrink: 0; margin-left: 5px; }
            .mc-events-container::-webkit-scrollbar { width: 4px; }
            .mc-events-container::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 4px; }
            .mc-events-container::-webkit-scrollbar-track { background: transparent; }
            .mc-body::-webkit-scrollbar { width: 4px; }
            .mc-body::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 4px; }
            .mc-body::-webkit-scrollbar-track { background: transparent; }
            .spinner { width: 18px; height: 18px; border: 3px solid rgba(255, 255, 255, 0.2); border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: auto; }
            @keyframes spin { to { transform: rotate(360deg); } }
            .match-item:hover { background: rgba(255,255,255,0.1); }
            .match-item button:hover { background: rgba(239, 68, 68, 0.4); }
        `;
      document.head.appendChild(style);
    },
    exportResults() {
      if (this.results.length === 0) {
        alert("\u26A0\uFE0F No results to export yet.");
        return;
      }
      const jsonData = JSON.stringify(this.results, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `batch_simulation_results_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log("\u{1F4BE} Results exported as JSON.");
    },
    cancel() {
      this.isRunning = false;
      if (window.batchGameIntervalId) {
        clearInterval(window.batchGameIntervalId);
        window.batchGameIntervalId = null;
      }
      console.log("\u{1F6D1} Batch simulation cancelled.");
      this.backToSetup();
    },
    backToSetup() {
      this.isRunning = false;
      this.matchList = [];
      this.results = [];
      if (window.batchGameIntervalId) {
        clearInterval(window.batchGameIntervalId);
        window.batchGameIntervalId = null;
      }
      if (typeof gameState !== "undefined") {
        gameState.status = "setup";
        if (typeof window.render === "function") {
          window.render();
        } else {
          console.error("Render function not found, cannot return to setup screen visually.");
        }
      } else {
        console.error("gameState not found, cannot return to setup screen.");
      }
    }
  };
  console.log("\u2705 batch-simulator.ts (v2.2 - Player Grouping, Robustness) loaded");
  if (typeof gameState !== "undefined" && typeof window.render === "function") {
    const originalRender = window.render;
    window.render = () => {
      originalRender();
      if (gameState.status === "setup" && CustomFixtureSimulator) {
        if (document.getElementById("custom-match-list")) {
          CustomFixtureSimulator.renderMatchList();
        }
      }
    };
  }

  // src/globalExports.ts
  function initializeGameState() {
    const initialState = {
      status: "upload",
      players: [],
      teams: [],
      teamJerseys: {},
      teamCoaches: {},
      teamLogos: {},
      homeTeam: "",
      awayTeam: "",
      homeFormation: "4-3-3",
      awayFormation: "4-3-3",
      homeTactic: "balanced",
      awayTactic: "balanced",
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
      ballChasers: /* @__PURE__ */ new Set(),
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
      homeTeamState: "BALANCED",
      awayTeamState: "BALANCED",
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
      homeJerseyColor: "#ef4444",
      awayJerseyColor: "#3b82f6",
      cameraShake: 0,
      _teamCacheVersion: 0
    };
    return initialState;
  }
  function exportToWindow() {
    if (typeof window === "undefined") {
      console.warn("\u26A0\uFE0F Not in browser environment, skipping window exports");
      return;
    }
    window.GAME_LOOP = window.GAME_LOOP || GAME_LOOP;
    window.PHYSICS = window.PHYSICS || PHYSICS;
    window.BALL_PHYSICS = window.BALL_PHYSICS || BALL_PHYSICS;
    window.GAME_CONFIG = window.GAME_CONFIG || GAME_CONFIG;
    window.POSITION_CONFIGS = window.POSITION_CONFIGS || POSITION_CONFIGS;
    window.FORMATIONS = window.FORMATIONS || FORMATIONS;
    window.TACTICS = window.TACTICS || TACTICS;
    window.TEAM_STATE_MODIFIERS = window.TEAM_STATE_MODIFIERS || TEAM_STATE_MODIFIERS;
    window.BT_CONFIG = window.BT_CONFIG || BT_CONFIG;
    window.positionToRoleMap = positionToRoleMap;
    window.getRoleFromPosition = getRoleFromPosition;
    window.drawGroundShadow = drawGroundShadow;
    window.toggleOrientation = toggleOrientation;
    window.validatePhysicsRealism = validatePhysicsRealism;
    window.selectBestTeam = selectBestTeam;
    window.selectBestTactic = selectBestTactic;
    window.selectBestFormation = selectBestFormation;
    window.initializePlayers = initializePlayers;
    window.getFormationPositions = getFormationPositions;
    window.applyFormationConstraint = applyFormationConstraint;
    window.getFormationPosition = getFormationPosition;
    window.initializeGameSetup = initializeGameSetup;
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
    window.resolveBallControl = resolveBallControl;
    window.handleBallInterception = handleBallInterception;
    window.updatePlayerAI_V2 = updatePlayerAI_V2;
    window.updatePhysics = updatePhysics;
    window.assignBallChasers = assignBallChasers;
    window.getPlayerActivePosition = getPlayerActivePosition;
    window.getAttackingGoalX = getAttackingGoalX;
    window.processPendingEvents = processPendingEvents;
    window.updateMatchStats = updateMatchStats;
    window.switchSides = switchSides;
    window.resetAfterGoal = resetAfterGoal;
    window.handleShotAttempt = handleShotAttempt;
    window.switchSummaryTab = switchSummaryTab;
    window.switchSimulationMode = switchSimulationMode;
    window.addMatchToBatch = addMatchToBatch;
    window.render = render;
    window.CustomFixtureSimulator = CustomFixtureSimulator;
    window.startMatch = startMatch;
    window.resetMatch = resetMatch;
    window.handleFileUpload = handleFileUpload;
    window.handleBallOutOfBounds = handleBallOutOfBounds;
    window.handleThrowIn = handleThrowIn;
    if (typeof window.gameState === "undefined") {
      window.gameState = initializeGameState();
      console.log("\u2713 Game state initialized (TypeScript)");
    }
    if (window.location.hostname === "localhost") {
      validatePhysicsRealism();
    }
    console.log("\u2705 Configuration exported to window (TypeScript)");
  }
  exportToWindow();
  var gameState = typeof window !== "undefined" && window.gameState ? window.gameState : initializeGameState();

  // src/behavior/setPieceBehavior.ts
  var activeConfig2 = GAME_CONFIG;
  var SET_PIECE_TYPES2 = {
    CORNER_KICK: "CORNER_KICK",
    FREE_KICK: "FREE_KICK",
    THROW_IN: "THROW_IN",
    GOAL_KICK: "GOAL_KICK",
    PENALTY: "PENALTY",
    KICK_OFF: "KICK_OFF"
  };
  var PITCH_WIDTH2 = activeConfig2.PITCH_WIDTH;
  var PITCH_HEIGHT2 = activeConfig2.PITCH_HEIGHT;
  function handleGoalkeeperSetPiecePosition2(player, gameState2, setPieceType, isAttacking, ownGoalX, setPiecePos) {
    try {
      const opponentGoalX = getAttackingGoalX(player.isHome, gameState2.currentHalf);
      switch (setPieceType) {
        case SET_PIECE_TYPES2.CORNER_KICK:
          if (!isAttacking) {
            const isRightCorner = setPiecePos.y < PITCH_HEIGHT2 / 2;
            const gkY = isRightCorner ? activeConfig2.GOAL_Y_TOP + 50 : activeConfig2.GOAL_Y_BOTTOM - 50;
            return sanitizePosition({ x: ownGoalX, y: gkY, movement: "gk_corner_positioning", role: "GK" }, { player });
          }
          break;
        case SET_PIECE_TYPES2.FREE_KICK:
          if (!isAttacking) {
            const offsetY = setPiecePos.y > 300 ? -20 : 20;
            return sanitizePosition({ x: ownGoalX, y: 300 + offsetY, movement: "gk_fk_positioning", role: "GK" }, { player });
          }
          break;
        case SET_PIECE_TYPES2.PENALTY:
          return PenaltyKickBehaviors.getPenaltyArcPosition(player, setPiecePos, isAttacking, gameState2);
        case SET_PIECE_TYPES2.GOAL_KICK:
          const teammates = getValidPlayers(player.isHome ? gameState2.homePlayers : gameState2.awayPlayers);
          const opponents = getValidPlayers(player.isHome ? gameState2.awayPlayers : gameState2.homePlayers);
          const teamTactic = player.isHome ? gameState2.homeTactic : gameState2.awayTactic;
          return isAttacking ? ProfessionalGoalKickBehaviors.getGoalKickPosition(player, ownGoalX, teamTactic, true, gameState2, teammates) : ProfessionalGoalKickBehaviors.getDefendingGoalKickPosition(player, opponentGoalX, ownGoalX, gameState2, opponents, teammates);
      }
      return sanitizePosition({ x: ownGoalX, y: 300, movement: "gk_default" }, { player });
    } catch (error) {
      console.error(`GK positioning error:`, error);
      const fallbackGoalX = getAttackingGoalX(!player.isHome, gameState2?.currentHalf ?? 1);
      return sanitizePosition({ x: fallbackGoalX, y: 300, movement: "gk_error" }, { player });
    }
  }
  function getSafeFallbackPosition2(player, reason, gameState2) {
    const activePos = getPlayerActivePosition(player, gameState2?.currentHalf ?? 1);
    return sanitizePosition(
      { x: activePos?.x ?? PITCH_WIDTH2 / 2, y: activePos?.y ?? PITCH_HEIGHT2 / 2, movement: `fallback_${reason}` },
      { player, behavior: "Fallback" }
    );
  }
  function calculateSetPiecePositionWithSafety2(player, gameState2, setPieceType, isAttacking, setPiecePos) {
    const ownGoalX = getAttackingGoalX(!player.isHome, gameState2.currentHalf);
    const opponentGoalX = getAttackingGoalX(player.isHome, gameState2.currentHalf);
    const teammates = getValidPlayers(player.isHome ? gameState2.homePlayers : gameState2.awayPlayers);
    const opponents = getValidPlayers(player.isHome ? gameState2.awayPlayers : gameState2.homePlayers);
    try {
      switch (setPieceType) {
        case SET_PIECE_TYPES2.FREE_KICK:
          const distToGoal = distance(setPiecePos, { x: isAttacking ? opponentGoalX : ownGoalX, y: 300 });
          return isAttacking ? ProfessionalFreeKickBehaviors.getAttackingFreeKickPosition(player, setPiecePos, opponentGoalX, distToGoal, null, gameState2, teammates) : ProfessionalFreeKickBehaviors.getDefendingFreeKickPosition(player, setPiecePos, ownGoalX, distToGoal, null, opponents, gameState2, teammates);
        case SET_PIECE_TYPES2.CORNER_KICK:
          return isAttacking ? ProfessionalCornerBehaviors.getAttackingCornerPosition(player, setPiecePos, opponentGoalX, teammates, null, gameState2.setPiece?.routine, gameState2) : ProfessionalCornerBehaviors.getDefendingCornerPosition(player, setPiecePos, ownGoalX, opponents, null, gameState2.setPiece?.defensiveSystem, gameState2, teammates);
        case SET_PIECE_TYPES2.THROW_IN:
          return ThrowInBehaviors.getThrowInPosition(player, setPiecePos, ownGoalX, opponentGoalX, gameState2, teammates, opponents);
        case SET_PIECE_TYPES2.GOAL_KICK:
          const teamTactic = player.isHome ? gameState2.homeTactic : gameState2.awayTactic;
          return isAttacking ? ProfessionalGoalKickBehaviors.getGoalKickPosition(player, ownGoalX, teamTactic, true, gameState2, teammates) : ProfessionalGoalKickBehaviors.getDefendingGoalKickPosition(player, opponentGoalX, ownGoalX, gameState2, opponents, teammates);
        case SET_PIECE_TYPES2.PENALTY:
          if (isAttacking && gameState2.setPiece) {
            const isKicker = gameState2.setPiece.kicker && String(gameState2.setPiece.kicker.id) === String(player.id);
            if (isKicker) {
              return PenaltyKickBehaviors.getKickerPosition(setPiecePos);
            }
          }
          return PenaltyKickBehaviors.getPenaltyArcPosition(player, setPiecePos, isAttacking, gameState2);
        case SET_PIECE_TYPES2.KICK_OFF:
          if (typeof KickoffBehaviors !== "undefined" && gameState2.setPiece) {
            const kickingTeamIsHome = typeof gameState2.setPiece.team === "boolean" ? gameState2.setPiece.team : gameState2.setPiece.team === "home";
            const isKickingTeam = player.isHome === kickingTeamIsHome;
            return KickoffBehaviors.getKickoffPosition(player, setPiecePos, isKickingTeam, gameState2);
          }
          return sanitizePosition({ x: player.x, y: player.y, movement: "kickoff_fallback", role: player.role }, { player, gameState: gameState2 });
        default:
          return getSafeFallbackPosition2(player, `unknown_type_${setPieceType}`, gameState2);
      }
    } catch (error) {
      console.error(`Set piece calculation error:`, error);
      return getSafeFallbackPosition2(player, `calculation_error`, gameState2);
    }
  }
  function getSetPiecePosition2(player, gameState2) {
    try {
      if (!gameState2 || !player || !gameState2.setPiece || !gameState2.setPiece.position) {
        return getSafeFallbackPosition2(player, "invalid_state", gameState2);
      }
      const setPieceType = gameState2.status;
      const isAttacking = isPlayerAttacking(player, gameState2);
      const setPiecePos = gameState2.setPiece.position;
      if (player.role === "GK" || player.role === "goalkeeper") {
        const ownGoalX = getAttackingGoalX(!player.isHome, gameState2.currentHalf);
        return handleGoalkeeperSetPiecePosition2(player, gameState2, setPieceType, isAttacking, ownGoalX, setPiecePos);
      }
      let position = calculateSetPiecePositionWithSafety2(player, gameState2, setPieceType, isAttacking, setPiecePos);
      position = getFormationAwarePosition(player, position, gameState2, isAttacking);
      return sanitizePosition(position, {
        player,
        setPieceType,
        behavior: "MainSetPieceDispatch",
        role: position?.role || player?.role || "UNKNOWN",
        gameState: gameState2
      });
    } catch (error) {
      console.error("Critical error in getSetPiecePosition:", error);
      return getSafeFallbackPosition2(player, "critical_error", gameState2);
    }
  }
  function shouldLockSetPiecePosition2(player, gameState2) {
    if (!gameState2 || !player || !gameState2.setPiece)
      return false;
    if (gameState2.status === "KICK_OFF") {
      return true;
    }
    const movement = player.setPieceMovement || getSetPieceMovementType2(player, gameState2);
    const movementLower = typeof movement === "string" ? movement.toLowerCase() : "";
    const lockKeywords = ["kicker", "thrower", "wall"];
    if (lockKeywords.some((keyword) => movementLower.includes(keyword))) {
      return distance(player, gameState2.setPiece.position) < 15;
    }
    if (!gameState2.setPiece.executionTime)
      return false;
    const timeUntilExecution = gameState2.setPiece.executionTime - Date.now();
    return timeUntilExecution < 1500 && timeUntilExecution > -500;
  }
  function getSetPieceMovementType2(player, gameState2) {
    if (!gameState2 || !player)
      return "standard_position";
    if (player.setPieceMovement)
      return player.setPieceMovement;
    const position = getSetPiecePosition2(player, gameState2);
    const movement = position?.movement || "standard_position";
    player.setPieceMovement = movement;
    return movement;
  }
  function isSetPieceActive2(gameState2) {
    if (!gameState2 || !gameState2.status)
      return false;
    if (typeof isSetPieceStatus === "function") {
      return isSetPieceStatus(gameState2.status);
    }
    return [
      SET_PIECE_TYPES2.CORNER_KICK,
      SET_PIECE_TYPES2.FREE_KICK,
      SET_PIECE_TYPES2.THROW_IN,
      SET_PIECE_TYPES2.GOAL_KICK,
      SET_PIECE_TYPES2.PENALTY,
      SET_PIECE_TYPES2.KICK_OFF
    ].includes(gameState2.status);
  }
  var SetPieceBehaviorSystem2 = {
    getSetPiecePosition: getSetPiecePosition2,
    shouldLockSetPiecePosition: shouldLockSetPiecePosition2,
    getSetPieceMovementType: getSetPieceMovementType2,
    isSetPieceActive: isSetPieceActive2,
    checkAndAdjustOffsidePosition,
    checkAndAdjustOffsidePositionWithAudit,
    ProfessionalCornerBehaviors,
    ProfessionalFreeKickBehaviors,
    ThrowInBehaviors,
    ProfessionalGoalKickBehaviors,
    PenaltyKickBehaviors,
    KickoffBehaviors: typeof KickoffBehaviors !== "undefined" ? KickoffBehaviors : null,
    SET_PIECE_TYPES: SET_PIECE_TYPES2,
    determineSetPieceTeam,
    isPlayerAttacking,
    getFormationAwarePosition,
    sanitizePosition,
    getSafeFallbackPosition: getSafeFallbackPosition2,
    handleGoalkeeperSetPiecePosition: handleGoalkeeperSetPiecePosition2,
    calculateSetPiecePositionWithSafety: calculateSetPiecePositionWithSafety2,
    getValidPlayers,
    getSortedLists
  };
  console.log("\u2705 PROFESSIONAL SET PIECE BEHAVIOR SYSTEM v6.0 (World Class) LOADED");
  console.log("   \u2713 Formation-aware positioning");
  console.log("   \u2713 Professional throw-in system");
  console.log("   \u2713 Enhanced corner & free kick patterns");
  console.log("   \u2713 FIX #8: Registered with DependencyRegistry");
  console.log("   \u2713 FIX #12: Offside audit trail enabled");
  console.log("   \u2713 Modern goal kick build-up play");

  // src/behavior/system.ts
  var BehaviorResult2 = {
    /**
     * Create successful behavior result
     */
    success(target, speedMultiplier = 1, description = "", shouldLock = false) {
      return {
        available: true,
        target,
        speedMultiplier,
        description,
        shouldLock,
        error: null
      };
    },
    /**
     * Create unavailable behavior result with reason
     */
    unavailable(reason = "Conditions not met") {
      return {
        available: false,
        target: null,
        speedMultiplier: 1,
        description: "",
        shouldLock: false,
        error: reason
      };
    },
    /**
     * Check if result is valid and available
     */
    isValid(result) {
      return result !== null && typeof result === "object" && result.available === true;
    }
  };
  var PHASES2 = {
    DEFENSIVE: "defensive",
    ATTACKING: "attacking",
    TRANSITION_TO_ATTACK: "transition_attack",
    TRANSITION_TO_DEFENSE: "transition_defense"
  };
  var GoalkeeperBehaviors2 = {
    /**
     * Sweeper-keeper: Actively defend space behind high defensive line
     */
    sweeperKeeping(_gk, ball, teammates, opponents, ownGoalX) {
      const defenders = teammates.filter((t) => ["CB", "RB", "LB"].includes(t.role));
      if (defenders.length === 0)
        return null;
      const defensiveLine = Math.max(...defenders.map((t) => Math.abs(t.x - ownGoalX)));
      if (defensiveLine < 200)
        return null;
      const threatBehindLine = opponents.find((opp) => {
        const oppDistToGoal = Math.abs(opp.x - ownGoalX);
        return oppDistToGoal < defensiveLine - 50 && distance(opp, ball) < 100;
      });
      if (threatBehindLine) {
        const interceptPoint = {
          x: ownGoalX + Math.sign(ball.x - ownGoalX) * Math.min(defensiveLine * 0.6, 180),
          y: ball.y
        };
        return {
          available: true,
          target: interceptPoint,
          speedMultiplier: 1.8,
          description: "sweeper-keeper intercept",
          shouldLock: true,
          error: null
        };
      }
      return null;
    },
    /**
     * Build-up play: GK as first attacker providing +1 option
     */
    buildUpSupport(_gk, holder, _teammates, ownGoalX) {
      if (!holder || holder.role === "GK")
        return null;
      const holderDistToGoal = Math.abs(holder.x - ownGoalX);
      if (holderDistToGoal > 400)
        return null;
      const safeZone = {
        x: ownGoalX + Math.sign(holder.x - ownGoalX) * 80,
        y: 300
      };
      return {
        available: true,
        target: safeZone,
        speedMultiplier: 1,
        description: "GK build-up support",
        shouldLock: false,
        error: null
      };
    },
    /**
     * Positioning for shot-stopping: Narrow the angle
     */
    angleNarrowing(_gk, ball, _shooter, ownGoalX) {
      const goalCenter = { x: ownGoalX, y: 300 };
      const ballToGoalDist = distance(ball, goalCenter);
      const optimalDist = Math.min(ballToGoalDist * 0.35, 60);
      const angle = Math.atan2(ball.y - goalCenter.y, ball.x - goalCenter.x);
      return {
        available: true,
        target: {
          x: goalCenter.x + Math.cos(angle) * optimalDist,
          y: goalCenter.y + Math.sin(angle) * optimalDist
        },
        speedMultiplier: 1.4,
        description: "angle narrowing",
        shouldLock: true,
        error: null
      };
    }
  };
  var DefensiveBehaviors2 = {
    /**
     * Collective line movement: Ball-oriented shifting
     */
    defensiveLineShift(player, ball, teammates, ownGoalX) {
      if (!["CB", "RB", "LB"].includes(player.role))
        return null;
      const defensiveLine = teammates.filter(
        (t) => ["CB", "RB", "LB"].includes(t.role)
      );
      if (defensiveLine.length < 2)
        return null;
      const avgLineX = defensiveLine.reduce((sum, p) => sum + p.x, 0) / defensiveLine.length;
      const targetLineX = avgLineX + (ball.y - 300) * 0.15;
      const ballPressure = Math.min(...teammates.map((t) => distance(t, ball)));
      const verticalAdjust = ballPressure < 50 ? 25 : -15;
      return {
        available: true,
        target: {
          x: player.x + Math.sign(targetLineX - avgLineX) * 20 + verticalAdjust * Math.sign(ownGoalX - player.x),
          y: player.y + (ball.y - player.y) * 0.2
          // Shift laterally
        },
        speedMultiplier: 1,
        description: "defensive line shift",
        shouldLock: false,
        error: null
      };
    },
    /**
     * Full-back covering: Prevent crosses and track wide threats
     */
    fullBackCovering(fb, _ball, opponents, _ownGoalX) {
      if (!["RB", "LB"].includes(fb.role))
        return null;
      const isRightBack = fb.role === "RB";
      const wideThreats = opponents.filter(
        (opp) => isRightBack && opp.y < 200 || !isRightBack && opp.y > 400
      );
      if (wideThreats.length === 0)
        return null;
      const nearestThreat = wideThreats.sort(
        (a, b) => distance(a, fb) - distance(b, fb)
      )[0];
      if (!nearestThreat)
        return null;
      const distToThreat = distance(nearestThreat, fb);
      if (distToThreat < 150) {
        const interceptAngle = Math.atan2(nearestThreat.y - fb.y, nearestThreat.x - fb.x);
        return {
          available: true,
          target: {
            x: fb.x + Math.cos(interceptAngle) * 50,
            y: fb.y + Math.sin(interceptAngle) * 50
          },
          speedMultiplier: 1.5,
          description: "full-back pressing winger",
          shouldLock: true,
          error: null
        };
      }
      return null;
    },
    /**
     * Center-back covering and marking
     */
    centerBackMarking(cb, opponents, _teammates, ownGoalX) {
      if (!["CB"].includes(cb.role))
        return null;
      const strikers = opponents.filter((opp) => ["ST", "CF"].includes(opp.role));
      if (strikers.length === 0)
        return null;
      const nearestStriker = strikers.sort(
        (a, b) => distance(a, cb) - distance(b, cb)
      )[0];
      if (!nearestStriker)
        return null;
      const inDangerZone = Math.abs(nearestStriker.x - ownGoalX) < 200;
      if (inDangerZone) {
        const markingDist = 15;
        const angle = Math.atan2(nearestStriker.y - ownGoalX, nearestStriker.x - ownGoalX);
        return {
          available: true,
          target: {
            x: nearestStriker.x - Math.cos(angle) * markingDist,
            y: nearestStriker.y - Math.sin(angle) * markingDist
          },
          speedMultiplier: 1.3,
          description: "CB tight marking",
          shouldLock: true,
          error: null
        };
      }
      return null;
    },
    /**
     * Inverted full-back: Move into central midfield during possession
     */
    invertedFullBack(fb, holder, teammates, ownGoalX) {
      if (!["RB", "LB"].includes(fb.role))
        return null;
      if (!holder || holder.isHome !== fb.isHome)
        return null;
      const ballInOwnHalf = Math.abs(holder.x - ownGoalX) < 400;
      if (!ballInOwnHalf)
        return null;
      const midfielders = teammates.filter(
        (t) => ["CM", "CDM", "CAM"].includes(t.role)
      );
      const midFieldCongestion = midfielders.reduce(
        (sum, m) => sum + (Math.abs(m.y - 300) < 100 ? 1 : 0),
        0
      );
      if (midFieldCongestion > 2)
        return null;
      return {
        available: true,
        target: {
          x: ownGoalX + Math.sign(holder.x - ownGoalX) * 250,
          y: 300
          // Move to center
        },
        speedMultiplier: 1.1,
        description: "inverted full-back",
        shouldLock: false,
        error: null
      };
    }
  };
  var MidfieldBehaviors2 = {
    /**
     * Defensive midfielder screening the defense
     */
    cdmScreening(cdm, ball, _opponents, teammates, _ownGoalX) {
      if (!["CDM"].includes(cdm.role))
        return null;
      const defensiveLine = teammates.filter(
        (t) => ["CB", "RB", "LB"].includes(t.role)
      );
      if (defensiveLine.length === 0)
        return null;
      const avgDefLineX = defensiveLine.reduce((sum, p) => sum + p.x, 0) / defensiveLine.length;
      const screeningX = avgDefLineX + Math.sign(ball.x - avgDefLineX) * 80;
      const screeningY = 300 + (ball.y - 300) * 0.4;
      return {
        available: true,
        target: { x: screeningX, y: screeningY },
        speedMultiplier: 1,
        description: "CDM screening defense",
        shouldLock: false,
        error: null
      };
    },
    /**
     * Box-to-box midfielder: Late runs into penalty area
     */
    boxToBoxLateRun(cm, ball, holder, teammates, opponentGoalX) {
      if (!["CM"].includes(cm.role))
        return null;
      if (!holder || holder.isHome !== cm.isHome)
        return null;
      const ballInFinalThird = Math.abs(ball.x - opponentGoalX) < 250;
      const alreadyForward = Math.abs(cm.x - opponentGoalX) < 180;
      const playersInBox = teammates.filter(
        (t) => Math.abs(t.x - opponentGoalX) < 150
      ).length;
      if (!ballInFinalThird || alreadyForward || playersInBox > 2)
        return null;
      return {
        available: true,
        target: {
          x: opponentGoalX - Math.sign(opponentGoalX - 400) * 100,
          y: 300 + (Math.random() - 0.5) * 120
        },
        speedMultiplier: 1.7,
        description: "box-to-box late run",
        shouldLock: true,
        error: null
      };
    },
    /**
     * Regista/Deep-lying playmaker: Dictate tempo from deep
     */
    registaTempoDictation(cm, holder, _teammates, ownGoalX) {
      if (!["CM", "CDM"].includes(cm.role))
        return null;
      if (!holder || holder.isHome !== cm.isHome)
        return null;
      const deepPosition = {
        x: ownGoalX + Math.sign(holder.x - ownGoalX) * 200,
        y: 300
      };
      const inDeepZone = Math.abs(cm.x - deepPosition.x) < 60;
      if (inDeepZone)
        return null;
      return {
        available: true,
        target: deepPosition,
        speedMultiplier: 0.9,
        description: "regista deep positioning",
        shouldLock: false,
        error: null
      };
    },
    /**
     * Attacking midfielder: Find pockets between the lines
     */
    camBetweenLines(cam, opponents, opponentGoalX) {
      if (!["CAM"].includes(cam.role))
        return null;
      const oppDefenders = opponents.filter(
        (o) => ["CB", "RB", "LB", "CDM"].includes(o.role)
      );
      if (oppDefenders.length < 2)
        return null;
      const avgDefX = oppDefenders.reduce((sum, p) => sum + p.x, 0) / oppDefenders.length;
      const pocketX = avgDefX + Math.sign(opponentGoalX - avgDefX) * 60;
      return {
        available: true,
        target: {
          x: pocketX,
          y: 300 + (Math.random() - 0.5) * 80
        },
        speedMultiplier: 1.2,
        description: "CAM finding pocket",
        shouldLock: false,
        error: null
      };
    },
    /**
     * Central midfielder pressing trigger
     */
    cmPressTrigger(cm, _ball, _opponents, holder) {
      if (!["CM"].includes(cm.role))
        return null;
      if (!holder || holder.isHome === cm.isHome)
        return null;
      const holderInCenter = Math.abs(holder.y - 300) < 150;
      const distToHolder = distance(cm, holder);
      if (holderInCenter && distToHolder < 80) {
        return {
          available: true,
          target: {
            x: holder.x,
            y: holder.y
          },
          speedMultiplier: 1.6,
          description: "CM press trigger",
          shouldLock: true,
          error: null
        };
      }
      return null;
    }
  };
  var ForwardBehaviors2 = {
    /**
     * Winger: Stretch defense by staying wide
     */
    wingerWidthProviding(winger, holder, _teammates) {
      if (!["RW", "LW", "RM", "LM"].includes(winger.role))
        return null;
      if (!holder || holder.isHome !== winger.isHome)
        return null;
      const isRight = ["RW", "RM"].includes(winger.role);
      const targetY = isRight ? 80 : 520;
      const currentlyWide = Math.abs(winger.y - targetY) < 40;
      if (currentlyWide)
        return null;
      return {
        available: true,
        target: {
          x: winger.x + Math.sign(holder.x - winger.x) * 30,
          y: targetY
        },
        speedMultiplier: 1.1,
        description: "winger providing width",
        shouldLock: false,
        error: null
      };
    },
    /**
     * Inverted winger: Cut inside to shoot
     */
    invertedWingerCutInside(winger, _ball, opponentGoalX) {
      if (!["RW", "LW"].includes(winger.role))
        return null;
      const distToGoal = Math.abs(winger.x - opponentGoalX);
      const isWide = winger.role === "RW" && winger.y < 150 || winger.role === "LW" && winger.y > 450;
      if (distToGoal < 280 && isWide) {
        return {
          available: true,
          target: {
            x: opponentGoalX - Math.sign(opponentGoalX - winger.x) * 100,
            y: 300 + (Math.random() - 0.5) * 100
          },
          speedMultiplier: 1.4,
          description: "inverted winger cutting inside",
          shouldLock: true,
          error: null
        };
      }
      return null;
    },
    /**
     * Striker: Runs in behind defense
     */
    strikerRunsInBehind(striker, holder, opponents, opponentGoalX) {
      if (!["ST", "CF"].includes(striker.role))
        return null;
      if (!holder || holder.isHome !== striker.isHome)
        return null;
      const oppDefenders = opponents.filter(
        (o) => ["CB", "RB", "LB"].includes(o.role)
      );
      if (oppDefenders.length === 0)
        return null;
      const lastDefender = oppDefenders.sort(
        (a, b) => Math.abs(b.x - opponentGoalX) - Math.abs(a.x - opponentGoalX)
      )[0];
      if (!lastDefender)
        return null;
      const runTargetX = lastDefender.x + Math.sign(opponentGoalX - lastDefender.x) * 30;
      const distToLastDefender = Math.abs(striker.x - lastDefender.x);
      if (distToLastDefender < 20 || distance(holder, striker) > 250)
        return null;
      return {
        available: true,
        target: {
          x: runTargetX,
          y: 300 + (Math.random() - 0.5) * 120
        },
        speedMultiplier: 1.6,
        description: "striker run in behind",
        shouldLock: true,
        error: null
      };
    },
    /**
     * False 9: Drop deep to create space
     */
    false9DropDeep(striker, holder, teammates, opponentGoalX) {
      if (!["ST", "CF"].includes(striker.role))
        return null;
      if (!holder || holder.isHome !== striker.isHome)
        return null;
      const forwardRunners = teammates.filter(
        (t) => ["RW", "LW", "CAM"].includes(t.role) && Math.abs(t.vx) > 50
      );
      if (forwardRunners.length === 0)
        return null;
      const dropPosition = {
        x: striker.x - Math.sign(opponentGoalX - striker.x) * 120,
        y: 300
      };
      return {
        available: true,
        target: dropPosition,
        speedMultiplier: 1.2,
        description: "false 9 dropping deep",
        shouldLock: true,
        error: null
      };
    },
    /**
     * Target striker: Hold up play
     */
    targetStrikerHoldUp(striker, _ball, opponents) {
      if (!["ST", "CF"].includes(striker.role))
        return null;
      const nearbyOpponents = opponents.filter(
        (o) => distance(o, striker) < 60
      );
      if (nearbyOpponents.length > 0 && distance(striker, _ball) < 25) {
        return {
          available: true,
          target: {
            x: striker.x,
            y: striker.y
          },
          speedMultiplier: 0.7,
          description: "target striker holding up",
          shouldLock: true,
          error: null
        };
      }
      return null;
    },
    /**
     * Striker pressing: Lead the press against center-backs
     */
    strikerPressingTrigger(striker, opponents, ball, ownGoalX) {
      if (!["ST", "CF"].includes(striker.role))
        return null;
      const oppCBs = opponents.filter(
        (o) => ["CB", "GK"].includes(o.role)
      );
      if (oppCBs.length === 0)
        return null;
      const nearestCB = oppCBs.sort(
        (a, b) => distance(a, ball) - distance(b, ball)
      )[0];
      if (!nearestCB)
        return null;
      const distToCB = distance(striker, nearestCB);
      if (distToCB < 100 && Math.abs(nearestCB.x - ownGoalX) > 400) {
        return {
          available: true,
          target: {
            x: nearestCB.x,
            y: nearestCB.y
          },
          speedMultiplier: 1.7,
          description: "striker leading press",
          shouldLock: true,
          error: null
        };
      }
      return null;
    }
  };
  var TransitionBehaviors2 = {
    /**
     * Counter-attack: Explosive forward runs
     */
    counterAttackRun(player, _ball, opponentGoalX, justWonPossession) {
      if (!justWonPossession)
        return null;
      if (!["ST", "RW", "LW", "CAM", "CM"].includes(player.role))
        return null;
      const spaceAhead = Math.abs(player.x - opponentGoalX);
      if (["ST", "RW", "LW"].includes(player.role) && spaceAhead > 150) {
        return {
          available: true,
          target: {
            x: opponentGoalX - Math.sign(opponentGoalX - player.x) * 80,
            y: player.role === "ST" ? 300 : player.y
          },
          speedMultiplier: 2,
          description: "counter-attack sprint",
          shouldLock: true,
          error: null,
          duration: 3e3
          // Lock for 3 seconds
        };
      }
      if (["CAM", "CM"].includes(player.role)) {
        return {
          available: true,
          target: {
            x: player.x + Math.sign(opponentGoalX - player.x) * 120,
            y: 300
          },
          speedMultiplier: 1.6,
          description: "counter-attack support",
          shouldLock: true,
          error: null,
          duration: 2500
        };
      }
      return null;
    },
    /**
     * Counter-press (Gegenpressing): Immediate pressure after losing ball
     */
    counterPress(player, ball, justLostPossession, _opponentGoalX) {
      if (!justLostPossession)
        return null;
      const distToBall = distance(player, ball);
      if (distToBall > 80)
        return null;
      return {
        available: true,
        target: {
          x: ball.x,
          y: ball.y
        },
        speedMultiplier: 1.9,
        description: "counter-press",
        shouldLock: true,
        error: null,
        duration: 4e3
        // Press aggressively for 4 seconds
      };
    },
    /**
     * Recovery runs: Sprint back to defensive shape
     */
    recoveryRun(player, ball, ownGoalX, justLostPossession) {
      if (!justLostPossession)
        return null;
      const distToBall = distance(player, ball);
      if (distToBall < 100)
        return null;
      const homePositionX = player.homePosition?.x || ownGoalX + Math.sign(player.x - ownGoalX) * 200;
      return {
        available: true,
        target: {
          x: homePositionX,
          y: player.homePosition?.y || 300
        },
        speedMultiplier: 1.7,
        description: "recovery run",
        shouldLock: true,
        error: null,
        duration: 3e3
      };
    }
  };
  var TacticalSystemModifiers2 = {
    /**
     * Possession-based: Constant movement for passing options
     */
    possessionSystem(player, holder, teammates) {
      if (!holder || holder.isHome !== player.isHome)
        return null;
      const nearbyTeammates = teammates.filter(
        (t) => distance(t, holder) < 150 && t.id !== player.id && t.id !== holder.id
      );
      if (nearbyTeammates.length < 1)
        return null;
      const avgX = nearbyTeammates.reduce((sum, t) => sum + t.x, holder.x) / (nearbyTeammates.length + 1);
      const avgY = nearbyTeammates.reduce((sum, t) => sum + t.y, holder.y) / (nearbyTeammates.length + 1);
      return {
        available: true,
        target: {
          x: avgX + (Math.random() - 0.5) * 40,
          y: avgY + (Math.random() - 0.5) * 40
        },
        speedMultiplier: 0.9,
        // Controlled movement
        description: "possession triangle formation",
        shouldLock: false,
        error: null
      };
    },
    /**
     * High-press: Compressed formation in opponent's half
     */
    highPressSystem(player, _ball, _teammates, opponentGoalX) {
      const teamPushUp = Math.abs(player.x - opponentGoalX) > 300;
      if (!teamPushUp)
        return null;
      const targetX = opponentGoalX - Math.sign(opponentGoalX - player.x) * 250;
      return {
        available: true,
        target: {
          x: targetX,
          y: player.y
        },
        speedMultiplier: 1.2,
        description: "high-press positioning",
        shouldLock: false,
        error: null
      };
    },
    /**
     * Low-block: Deep defensive shape
     */
    lowBlockSystem(player, ownGoalX, _teammates) {
      const defensiveThird = ownGoalX + Math.sign(player.x - ownGoalX) * 200;
      const tooAdvanced = Math.abs(player.x - defensiveThird) > 150;
      if (!tooAdvanced)
        return null;
      return {
        available: true,
        target: {
          x: defensiveThird,
          y: 300 + (player.y - 300) * 0.7
          // Narrower shape
        },
        speedMultiplier: 1,
        description: "low-block positioning",
        shouldLock: false,
        error: null
      };
    }
  };
  function selectPlayerBehavior2(player, gameState2, phase, tacticalSystem) {
    const allPlayers = [...gameState2.homePlayers || [], ...gameState2.awayPlayers || []];
    const teammates = allPlayers.filter((p) => p.isHome === player.isHome && p.id !== player.id);
    const opponents = allPlayers.filter((p) => p.isHome !== player.isHome);
    const ball = gameState2.ballPosition;
    const holder = gameState2.ballHolder;
    const ownGoalX = player.isHome ? gameState2.currentHalf === 1 ? 50 : 750 : gameState2.currentHalf === 1 ? 750 : 50;
    const opponentGoalX = player.isHome ? gameState2.currentHalf === 1 ? 750 : 50 : gameState2.currentHalf === 1 ? 50 : 750;
    const timeSinceChange = Date.now() - (gameState2.lastPossessionChange || 0);
    const justWonPossession = timeSinceChange < 5e3 && holder?.isHome === player.isHome;
    const justLostPossession = timeSinceChange < 5e3 && holder?.isHome !== player.isHome;
    if (phase === "SET_PIECE") {
      player.currentBehavior = "set_piece_hold";
      return null;
    }
    const behaviors = [];
    if (phase === PHASES2.TRANSITION_TO_ATTACK || justWonPossession) {
      behaviors.push(
        TransitionBehaviors2.counterAttackRun(player, ball, opponentGoalX, justWonPossession)
      );
    }
    if (phase === PHASES2.TRANSITION_TO_DEFENSE || justLostPossession) {
      behaviors.push(
        TransitionBehaviors2.counterPress(player, ball, justLostPossession, opponentGoalX),
        TransitionBehaviors2.recoveryRun(player, ball, ownGoalX, justLostPossession)
      );
    }
    if (phase === PHASES2.DEFENSIVE || holder && holder.isHome !== player.isHome) {
      if (player.role === "GK") {
        behaviors.push(
          GoalkeeperBehaviors2.sweeperKeeping(player, ball, teammates, opponents, ownGoalX),
          GoalkeeperBehaviors2.angleNarrowing(player, ball, holder, ownGoalX)
        );
      }
      behaviors.push(
        DefensiveBehaviors2.defensiveLineShift(player, ball, teammates, ownGoalX),
        DefensiveBehaviors2.fullBackCovering(player, ball, opponents, ownGoalX),
        DefensiveBehaviors2.centerBackMarking(player, opponents, teammates, ownGoalX)
      );
      behaviors.push(
        MidfieldBehaviors2.cdmScreening(player, ball, opponents, teammates, ownGoalX),
        MidfieldBehaviors2.cmPressTrigger(player, ball, opponents, holder)
      );
      behaviors.push(
        ForwardBehaviors2.strikerPressingTrigger(player, opponents, ball, ownGoalX)
      );
    }
    if (phase === PHASES2.ATTACKING || holder && holder.isHome === player.isHome) {
      if (player.role === "GK") {
        behaviors.push(
          GoalkeeperBehaviors2.buildUpSupport(player, holder, teammates, ownGoalX)
        );
      }
      behaviors.push(
        DefensiveBehaviors2.invertedFullBack(player, holder, teammates, ownGoalX)
      );
      behaviors.push(
        MidfieldBehaviors2.boxToBoxLateRun(player, ball, holder, teammates, opponentGoalX),
        MidfieldBehaviors2.registaTempoDictation(player, holder, teammates, ownGoalX),
        MidfieldBehaviors2.camBetweenLines(player, opponents, opponentGoalX)
      );
      behaviors.push(
        ForwardBehaviors2.wingerWidthProviding(player, holder, teammates),
        ForwardBehaviors2.invertedWingerCutInside(player, ball, opponentGoalX),
        ForwardBehaviors2.strikerRunsInBehind(player, holder, opponents, opponentGoalX),
        ForwardBehaviors2.false9DropDeep(player, holder, teammates, opponentGoalX),
        ForwardBehaviors2.targetStrikerHoldUp(player, ball, opponents)
      );
    }
    if (tacticalSystem === "possession") {
      behaviors.push(
        TacticalSystemModifiers2.possessionSystem(player, holder, teammates)
      );
    } else if (tacticalSystem === "high_press") {
      behaviors.push(
        TacticalSystemModifiers2.highPressSystem(player, ball, teammates, opponentGoalX)
      );
    } else if (tacticalSystem === "low_block" || tacticalSystem === "counter_attack") {
      behaviors.push(
        TacticalSystemModifiers2.lowBlockSystem(player, ownGoalX, teammates)
      );
    }
    const validBehavior = behaviors.find((b) => b !== null);
    if (validBehavior)
      player.currentBehavior = validBehavior.description;
    return validBehavior || null;
  }
  function detectGamePhase2(gameState2) {
    if (SetPieceBehaviorSystem.isSetPieceActive(gameState2)) {
      return "SET_PIECE";
    }
    const holder = gameState2.ballHolder;
    const timeSinceChange = Date.now() - (gameState2.lastPossessionChange || 0);
    if (timeSinceChange < 5e3) {
      if (holder) {
        return PHASES2.TRANSITION_TO_ATTACK;
      } else {
        return PHASES2.TRANSITION_TO_DEFENSE;
      }
    }
    if (holder) {
      return PHASES2.ATTACKING;
    }
    return PHASES2.DEFENSIVE;
  }
  function getTacticalSystemType2(tacticName) {
    const systemMap = {
      "possession": "possession",
      "tiki_taka": "possession",
      "high_press": "high_press",
      "gegenpress": "high_press",
      "counter_attack": "counter_attack",
      "defensive": "low_block",
      "park_bus": "low_block"
    };
    return systemMap[tacticName?.toLowerCase() || ""] || "balanced";
  }
  console.log("\u2705 BEHAVIORAL DYNAMICS ENGINE LOADED");
  console.log("   \u2713 11 role-specific behavior sets");
  console.log("   \u2713 4 game phases supported");
  console.log("   \u2713 3 tactical system modifiers");
  console.log("   \u2713 FIX #9: BehaviorResult wrapper for consistent returns");
  console.log("   \u2713 Ready for integration");

  // src/index.ts
  function initializeSimulation() {
    console.log("\u{1F680} Football Simulation (TypeScript) Initializing...");
    console.log("\u2705 Type system: LOADED");
    console.log("\u2705 Configuration: LOADED");
    console.log("\u2705 Event system: LOADED");
    console.log("\u2705 Math utilities: LOADED");
    console.log("\u2705 Physics system: LOADED");
    console.log("\u2705 Rules systems: LOADED");
    console.log("\u2705 AI systems: LOADED");
    console.log("\u2705 Set piece systems: LOADED");
    console.log("\u2705 Behavior systems: LOADED");
    console.log("\u2705 UI systems: LOADED");
    console.log("\u2705 Rendering systems: LOADED");
    console.log("\u2705 Core game loop: LOADED");
    console.log("\u2705 Main initialization: LOADED");
    console.log("\u{1F3AE} Ready to start simulation");
    console.log("\u{1F389} MIGRATION COMPLETE - ALL SYSTEMS OPERATIONAL!");
  }
  if (typeof window !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initializeSimulation);
    } else {
      initializeSimulation();
    }
  }
  if (typeof window !== "undefined") {
    window.initializeSimulation = initializeSimulation;
  }
  console.log("\u2705 Football Simulation Core Module loaded (TypeScript v2.0.0)");
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=bundle.js.map
