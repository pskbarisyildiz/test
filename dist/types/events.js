/**
 * Event System Type Definitions
 * Type-safe event bus and event payload definitions
 */
// ============================================================================
// EVENT TYPES ENUM
// ============================================================================
export const EVENT_TYPES = {
    // Match events
    MATCH_START: 'match:start',
    MATCH_PAUSE: 'match:pause',
    MATCH_RESUME: 'match:resume',
    MATCH_END: 'match:end',
    HALF_TIME: 'match:halftime',
    KICKOFF: 'match:kickoff',
    // Ball events
    BALL_KICKED: 'ball:kicked',
    BALL_PASSED: 'ball:passed',
    BALL_INTERCEPTED: 'ball:intercepted',
    BALL_OUT: 'ball:out',
    BALL_WON: 'ball:won',
    BALL_LOST: 'ball:lost',
    BALL_POSITION_CHANGED: 'ball:positionChanged',
    BALL_HOLDER_CHANGED: 'ball:holderChanged',
    // Goal events
    GOAL_SCORED: 'goal:scored',
    SHOT_TAKEN: 'shot:taken',
    SHOT_SAVED: 'shot:saved',
    SHOT_MISSED: 'shot:missed',
    SHOT_BLOCKED: 'shot:blocked',
    SHOT_ATTEMPTED: 'shot:attempted',
    // Player events
    PLAYER_COLLISION: 'player:collision',
    PLAYER_TACKLE: 'player:tackle',
    PLAYER_DRIBBLE: 'player:dribble',
    PLAYER_HEADER: 'player:header',
    PLAYER_SUBSTITUTED: 'player:substituted',
    // Foul events
    FOUL_COMMITTED: 'foul:committed',
    CARD_SHOWN: 'card:shown',
    PENALTY_AWARDED: 'penalty:awarded',
    FREE_KICK_AWARDED: 'freekick:awarded',
    // Team events
    TEAM_STATE_CHANGED: 'team:stateChanged',
    FORMATION_CHANGED: 'team:formationChanged',
    TACTIC_CHANGED: 'team:tacticChanged',
    POSSESSION_CHANGED: 'team:possessionChanged',
    // AI events
    AI_DECISION_MADE: 'ai:decisionMade',
    BT_NODE_EXECUTED: 'ai:btNodeExecuted',
    ZONE_ASSIGNED: 'ai:zoneAssigned',
    // Rendering events
    RENDER_BACKGROUND: 'render:background',
    RENDER_GAME: 'render:game',
    RENDER_UI: 'render:ui',
    // Stats events
    STAT_UPDATED: 'stat:updated',
    XG_CALCULATED: 'stat:xgCalculated',
    PASS_COMPLETED: 'stat:passCompleted',
    PASS_FAILED: 'stat:passFailed',
    // Offside events
    OFFSIDE_CALLED: 'offside:called',
    // Set piece events
    SET_PIECE_STARTED: 'setPiece:started',
    SET_PIECE_EXECUTED: 'setPiece:executed',
    // Match lifecycle
    MATCH_STARTED: 'match:started',
    MATCH_FINISHED: 'match:finished'
};
//# sourceMappingURL=events.js.map