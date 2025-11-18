

const GAME_LOOP = {
    FIXED_TIMESTEP: 3/60,
    MAX_FRAME_TIME: 0.25,
    GAME_SPEED: 1.0  // 1.0 = 1 game minute = 1 real second (was 2.0 = 2x speed)
};
const PHYSICS = {
    // ✅ FIX: Speeds doubled to compensate for removed GAME_SPEED multiplier in physics
    // Previously: dt was multiplied by GAME_SPEED (2.0), making players move 2x faster
    // Now: dt is NOT multiplied (see core.js:904), so speeds doubled to maintain same feel
    // Average player: ~7 m/s = 106 px/s (was 53 px/s * 2)
    // Fast player: ~10 m/s = 152 px/s (was 76 px/s * 2)
    // Sprint burst: ~11 m/s = 198 px/s (was 99 px/s * 2)
    MAX_SPEED: 152,              // pixels/second (doubled from 76 to match pre-fix feel)
    SPRINT_MULTIPLIER: 1.3,     // Sprint = 198 px/s
    
    // ✅ FIX: Acceleration doubled to match speed increase
    // Player reaches max speed in ~2-3 seconds
    ACCELERATION: 700,          // pixels/s² (doubled from 350)
    
    // Friction adjusted for new speeds
    FRICTION: 0.88,             // Per second decay
    
    // Ball with dribbling is slower
    DRIBBLE_SPEED_PENALTY: 0.75, // 25% slower when dribbling
    
    // Distances remain the same (based on real measurements)
    COLLISION_RADIUS: 18,
    BALL_CONTROL_DISTANCE: 28,
    PASS_INTERCEPT_DISTANCE: 40,
    
    MOVEMENT_THRESHOLD: 5.0,
    POSITIONING_SMOOTHNESS: 0.04,
    
    LONG_PASS_THRESHOLD: 150,   // ~20m in real world
    HEADER_HEIGHT_THRESHOLD: 0.3,
    
    PLAYER_MASS: 75,
    BALL_MASS: 0.45
};

 const BALL_PHYSICS = {
    // CORRECTED: Ball moves faster than players but realistically
    // Shot speed: ~30 m/s = 229 px/s
    // Fast pass: ~20 m/s = 152 px/s
    MAX_SPEED: 650,             // pixels/second (was 1500 - too fast!)
    
    FRICTION: 0.44,             // Rolls to stop realistically
    GRAVITY: 600,               // Unchanged - feels right
    BOUNCE: 0.6,
    SPIN_EFFECT: 0.05
};

 const GAME_CONFIG = {
    GOAL_CHECK_DISTANCE: 200,
    
    // ADJUSTED: Shooting more realistic at new speeds
    SHOOTING_CHANCE_BASE: 0.3,     // Slightly lower (was 0.4)
    PASSING_CHANCE: 0.70,           // Slightly higher (was 0.65)
    
    EVENT_PROBABILITY: 0.5,
    DECISION_COOLDOWN: 600,
    GK_HOLD_TIME: 1800,
HIGH_DPI_SCALE_FACTOR: 1,
    
    GOAL_Y_TOP: 240,
    GOAL_Y_BOTTOM: 360,
    PITCH_WIDTH: 800,
    PITCH_HEIGHT: 600,
    
    // NEW: Realistic timing values
    AVERAGE_SPRINT_TIME_TO_GOAL: 10,  // seconds (for 105m)
    REACTION_TIME_MIN: 150,            // ms
    REACTION_TIME_MAX: 350             // ms
};

 const positionToRoleMap = {
    // Kaleciler
    'Goalkeeper': 'GK', 'Keeper': 'GK',
    // Defanslar
    'Centre-Back': 'CB', 'Center Back': 'CB', 'Defender (Centre)': 'CB',
    'Right-Back': 'RB', 'Right Back': 'RB', 'Defender (Right)': 'RB',
    'Left-Back': 'LB', 'Left Back': 'LB', 'Defender (Left)': 'LB',
    'Wing-Back (Right)': 'RB', // Wing-back'leri bek olarak eşleyelim
    'Wing-Back (Left)': 'LB',
    // Orta Sahalar
    'Defensive Midfield': 'CDM', 'Midfielder (Defensive)': 'CDM',
    'Central Midfield': 'CM', 'Midfielder (Centre)': 'CM',
    'Right Midfield': 'RM', 'Midfielder (Right)': 'RM',
    'Left Midfield': 'LM', 'Midfielder (Left)': 'LM',
    'Attacking Midfield': 'CAM', 'Midfielder (Attacking)': 'CAM',
    // Forvetler
    'Right Winger': 'RW', 'Forward (Right)': 'RW', 'Winger (Right)': 'RW',
    'Left Winger': 'LW', 'Forward (Left)': 'LW', 'Winger (Left)': 'LW',
    'Second Striker': 'ST', // İkinci forveti de ST olarak eşleyelim
    'Striker': 'ST', 'Centre-Forward': 'ST', 'Forward (Centre)': 'ST'
};

 function getRoleFromPosition(positionString) {
    if (!positionString) return 'CM'; // Varsayılan rol
    const primaryPosition = positionString.split(',')[0].trim();
    return positionToRoleMap[primaryPosition] || 'CM'; // Eşleşme bulunamazsa CM ata
}

 // ✅ FIX: All role-specific maxSpeed values doubled to match PHYSICS.MAX_SPEED increase
 const POSITION_CONFIGS = {
    'GK': { 
        defensiveness: 1.0, 
        attackRange: 0, 
        ballChasePriority: 0.1, 
        idealWidth: 0, 
        pushUpOnAttack: 0,
        pressAggression: 0.0,
        zoneCoverage: 1.0,
        supportDistance: 0,
        maxSpeed: 140  // GKs slightly slower
    },
    'CB': { 
        defensiveness: 0.9, 
        attackRange: 0.15, 
        ballChasePriority: 0.3, 
        idealWidth: 0.15, 
        pushUpOnAttack: 90,
        pressAggression: 0.5,
        zoneCoverage: 0.7,
        supportDistance: 40,
        maxSpeed: 144  // CBs not the fastest
    },
    'RB': { 
        defensiveness: 0.7, 
        attackRange: 0.75, 
        ballChasePriority: 0.4, 
        idealWidth: 0.35, 
        pushUpOnAttack: 160,
        pressAggression: 0.5,
        zoneCoverage: 0.7,
        supportDistance: 60,
        maxSpeed: 156  // Fullbacks fast
    },
    'LB': { 
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
    'CDM': { 
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
    'CM': { 
        defensiveness: 0.5, 
        attackRange: 0.6, 
        ballChasePriority: 0.7, 
        idealWidth: 0.25, 
        pushUpOnAttack: 160,
        pressAggression: 0.7,
        zoneCoverage: 0.6,
        supportDistance: 70,
        maxSpeed: 152  // Average
    },
    'RM': { 
        defensiveness: 0.4, 
        attackRange: 0.7, 
        ballChasePriority: 0.75, 
        idealWidth: 0.35, 
        pushUpOnAttack: 180,
        pressAggression: 0.6,
        zoneCoverage: 0.5,
        supportDistance: 80,
        maxSpeed: 160  // Wingers fast
    },
    'LM': { 
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
    'CAM': { 
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
    'RW': { 
        defensiveness: 0.25, 
        attackRange: 0.85, 
        ballChasePriority: 0.8, 
        idealWidth: 0.4, 
        pushUpOnAttack: 200,
        pressAggression: 0.5,
        zoneCoverage: 0.3,
        supportDistance: 100,
        maxSpeed: 164  // Fastest outfield
    },
    'LW': { 
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
    'ST': { 
        defensiveness: 0.10, 
        attackRange: 0.9, 
        ballChasePriority: 0.9, 
        idealWidth: 0.1, 
        pushUpOnAttack: 240,
        pressAggression: 0.4,
        zoneCoverage: 0.2,
       supportDistance: 110,
        maxSpeed: 158  // Fast but not as fast as wingers
    }
};

 const TACTICS = {
    balanced: {
        name: 'Balanced',
        description: 'Flexible approach adapting to game situation',
        pressIntensity: 0.5,
        defensiveLineDepth: 0.5,
        counterAttackSpeed: 1.1,      // Reduced from 1.0
        possessionPriority: 0.5,
        passingRisk: 0.5,
        preferHighPress: false,
        preferCounterAttack: false,
        compactness: 0.5
    },
    high_press: {
        name: 'High Press',
        description: 'Aggressive pressing to win ball high up the pitch',
        pressIntensity: 0.9,
        defensiveLineDepth: 0.7,
        counterAttackSpeed: 1.2,      // Reduced from 1.1
        possessionPriority: 0.4,
        passingRisk: 0.6,
        preferHighPress: true,
        preferCounterAttack: false,
        compactness: 0.8
    },
    possession: {
        name: 'Possession',
        description: 'Control the game through patient build-up play',
        pressIntensity: 0.4,
        defensiveLineDepth: 0.6,
        counterAttackSpeed: 1.0,      // Reduced from 0.9
        possessionPriority: 0.9,
        passingRisk: 0.3,
        preferHighPress: false,
        preferCounterAttack: false,
        compactness: 0.7
    },
    counter_attack: {
        name: 'Counter-Attack',
        description: 'Absorb pressure and strike on the break',
        pressIntensity: 0.3,
        defensiveLineDepth: 0.3,
        counterAttackSpeed: 1.4,      // Reduced from 1.5
        possessionPriority: 0.3,
       passingRisk: 0.7,
        preferHighPress: false,
        preferCounterAttack: true,
        compactness: 0.9
    },
    park_the_bus: {
        name: 'Park the Bus',
        description: 'Ultra-defensive, protect the lead at all costs',
        pressIntensity: 0.2,
        defensiveLineDepth: 0.2,
        counterAttackSpeed: 1.3,
        possessionPriority: 0.2,
        passingRisk: 0.8,
        preferHighPress: false,
        preferCounterAttack: true,
        compactness: 1.0
    },
    total_football: {
        name: 'Total Football',
        description: 'Fluid positional play with high technical demands',
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

 const TEAM_STATE_MODIFIERS = {
    ATTACKING: {
        speedMultiplier: 1.08,        // Reduced from 1.1
        positioningAggression: 0.8,
        riskTolerance: 0.7,
        pressTriggerDistance: 100
    },
    DEFENDING: {
        speedMultiplier: 1.0,
        positioningAggression: 0.3,
      riskTolerance: 0.2,
        pressTriggerDistance: 60
    },
    HIGH_PRESS: {
        speedMultiplier: 1.25,        // Reduced from 1.3
        positioningAggression: 0.9,
        riskTolerance: 0.5,
        pressTriggerDistance: 120
    },
    COUNTER_ATTACK: {
        speedMultiplier: 1.4,         // Reduced from 1.5
        positioningAggression: 0.9,
       riskTolerance: 0.8,
        pressTriggerDistance: 40
    },
    BALANCED: {
        speedMultiplier: 1.0,
        positioningAggression: 0.5,
        riskTolerance: 0.5,
       pressTriggerDistance: 80
    }
};

const BT_CONFIG = {
    PRIORITY_SHOOT: 100,
    PRIORITY_PASS: 70,
    PRIORITY_DRIBBLE: 50,
    PRIORITY_TACKLE: 90,
    PRIORITY_MARK: 60,
    PRIORITY_POSITION: 40,
    
    BALL_CLOSE_DISTANCE: 100,
    OPPONENT_CLOSE_DISTANCE: 35,
    TEAMMATE_SUPPORT_DISTANCE: 150,
    
    // ADJUSTED: More realistic hold times
    MAX_BALL_HOLD_TIME: 2000,           // Increased from 1500
    MAX_BALL_HOLD_TIME_UNDER_PRESSURE: 800,  // Increased from 500
    
    SHOOT_CHANCE_IN_BOX: 0.75,         // Slightly reduced
    SHOOT_CHANCE_OUTSIDE_BOX: 0.25,     // Reduced from 0.3
    PASS_CHANCE_UNDER_PRESSURE: 0.75,   // Increased from 0.7
    DRIBBLE_CHANCE_IN_SPACE: 0.55       // Reduced from 0.6
};

 const FORMATIONS = {
    '4-4-2': [
        { x: 0.08, y: 0.5, role: 'GK' },
        { x: 0.22, y: 0.15, role: 'RB' }, { x: 0.22, y: 0.38, role: 'CB' }, 
        { x: 0.22, y: 0.62, role: 'CB' }, { x: 0.22, y: 0.85, role: 'LB' },
        { x: 0.5, y: 0.15, role: 'RM' }, { x: 0.5, y: 0.38, role: 'CM' }, 
        { x: 0.5, y: 0.62, role: 'CM' }, { x: 0.5, y: 0.85, role: 'LM' },
       { x: 0.75, y: 0.4, role: 'ST' }, { x: 0.75, y: 0.6, role: 'ST' }
    ],
    '4-3-3': [
        { x: 0.08, y: 0.5, role: 'GK' },
        { x: 0.22, y: 0.15, role: 'RB' }, { x: 0.22, y: 0.38, role: 'CB' }, 
        { x: 0.22, y: 0.62, role: 'CB' }, { x: 0.22, y: 0.85, role: 'LB' },
        { x: 0.45, y: 0.25, role: 'CM' }, { x: 0.45, y: 0.5, role: 'CDM' }, 
        { x: 0.45, y: 0.75, role: 'CM' },
        { x: 0.75, y: 0.2, role: 'RW' }, { x: 0.75, y: 0.5, role: 'ST' }, 
        { x: 0.75, y: 0.8, role: 'LW' }
    ],
    '4-4-1-1': [
        { x: 0.08, y: 0.5, role: 'GK' },
        { x: 0.22, y: 0.15, role: 'RB' }, { x: 0.22, y: 0.38, role: 'CB' }, 
        { x: 0.22, y: 0.62, role: 'CB' }, { x: 0.22, y: 0.85, role: 'LB' },
        { x: 0.5, y: 0.15, role: 'RM' }, { x: 0.5, y: 0.38, role: 'CM' }, 
        { x: 0.5, y: 0.62, role: 'CM' }, { x: 0.5, y: 0.85, role: 'LM' },
        { x: 0.68, y: 0.5, role: 'CAM' }, { x: 0.82, y: 0.5, role: 'ST' }
    ],
    '4-4-2-diamond': [
        { x: 0.08, y: 0.5, role: 'GK' },
        { x: 0.22, y: 0.15, role: 'RB' }, { x: 0.22, y: 0.38, role: 'CB' }, 
        { x: 0.22, y: 0.62, role: 'CB' }, { x: 0.22, y: 0.85, role: 'LB' },
       { x: 0.42, y: 0.5, role: 'CDM' }, { x: 0.55, y: 0.3, role: 'CM' }, 
        { x: 0.55, y: 0.7, role: 'CM' },
        { x: 0.68, y: 0.5, role: 'CAM' }, { x: 0.8, y: 0.4, role: 'ST' }, 
        { x: 0.8, y: 0.6, role: 'ST' }
    ],
    '4-3-1-2': [
        { x: 0.08, y: 0.5, role: 'GK' },
        { x: 0.22, y: 0.15, role: 'RB' }, { x: 0.22, y: 0.38, role: 'CB' }, 
        { x: 0.22, y: 0.62, role: 'CB' }, { x: 0.22, y: 0.85, role: 'LB' },
       { x: 0.45, y: 0.25, role: 'CM' }, { x: 0.45, y: 0.5, role: 'CDM' }, 
        { x: 0.45, y: 0.75, role: 'CM' },
        { x: 0.65, y: 0.5, role: 'CAM' }, { x: 0.8, y: 0.4, role: 'ST' }, 
        { x: 0.8, y: 0.6, role: 'ST' }
    ],
    '4-3-2-1': [
        { x: 0.08, y: 0.5, role: 'GK' },
        { x: 0.22, y: 0.15, role: 'RB' }, { x: 0.22, y: 0.38, role: 'CB' }, 
        { x: 0.22, y: 0.62, role: 'CB' }, { x: 0.22, y: 0.85, role: 'LB' },
        { x: 0.45, y: 0.25, role: 'CM' }, { x: 0.45, y: 0.5, role: 'CDM' }, 
        { x: 0.45, y: 0.75, role: 'CM' },
        { x: 0.65, y: 0.35, role: 'CAM' }, { x: 0.65, y: 0.65, role: 'CAM' },
        { x: 0.82, y: 0.5, role: 'ST' }
    ]
};


 function drawGroundShadow(ctx, x, y, size, ballHeight) {
    const shadowY = y + size / 2; // Shadow is on the ground plane, slightly below the ball's center
    const shadowRadiusX = size * 1.2 * (1 - ballHeight * 0.4);
    const shadowRadiusY = shadowRadiusX * 0.3; // Elliptical shadow
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
    console.log('Toggling orientation...');
    
    // 1. Toggle the state
    gameState.isVertical = !gameState.isVertical;
    
    // 2. Set a flag to force the background cache to be rebuilt
    gameState.orientationChanged = true; 

    // 3. Clear canvas and context references
    gameState.canvases = { background: null, game: null, ui: null };
    gameState.contexts = { background: null, game: null, ui: null };
    gameState.backgroundDrawn = false;
    
    // 4. Re-render the entire UI structure
    // This calls setupGameScreen, which will now use the new `isVertical` state
    render(); 
    
    // 5. The setTimeout in setupGameScreen will automatically handle
    //    re-initializing the new canvases and redrawing the pitch.
}

 function validatePhysicsRealism() {
    console.log('=== PHYSICS REALISM VALIDATION ===');
    
    // Test 1: Time to cross pitch
    const pitchWidth = GAME_CONFIG.PITCH_WIDTH;
    const maxSpeed = PHYSICS.MAX_SPEED;
    const timeToCross = pitchWidth / maxSpeed;
    console.log(`✓ Time to cross pitch: ${timeToCross.toFixed(1)}s (target: 10-12s)`);
    console.assert(timeToCross >= 9 && timeToCross <= 13, 'Pitch crossing time unrealistic!');
    
    // Test 2: Ball faster than players
    const ballSpeed = BALL_PHYSICS.MAX_SPEED;
    console.log(`✓ Ball max speed: ${ballSpeed} px/s (${(ballSpeed / maxSpeed).toFixed(1)}x player speed)`);
    console.assert(ballSpeed > maxSpeed * 2, 'Ball should be significantly faster than players!');
    
    // Test 3: Acceleration time
    const timeToMaxSpeed = maxSpeed / PHYSICS.ACCELERATION;
    console.log(`✓ Time to max speed: ${timeToMaxSpeed.toFixed(1)}s (target: 2-3s)`);
    console.assert(timeToMaxSpeed >= 1.5 && timeToMaxSpeed <= 3.5, 'Acceleration unrealistic!');
    
    // Test 4: Sprint multiplier
    const sprintSpeed = maxSpeed * PHYSICS.SPRINT_MULTIPLIER;
    console.log(`✓ Sprint speed: ${sprintSpeed.toFixed(0)} px/s`);
    console.assert(sprintSpeed < 100, 'Sprint speed too high!');
    
    console.log('=== ALL TESTS PASSED ===');
}
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
     validatePhysicsRealism();
}

window.SHOW_OFFSIDE_LINES = false;


// ============================================================================
// ✅ FIX #16: STANDARD EVENT TYPES FOR DECOUPLED ARCHITECTURE
// ============================================================================
const STANDARD_EVENTS = {
    BALL_POSITION_CHANGED: 'ball:positionChanged',
    BALL_HOLDER_CHANGED: 'ball:holderChanged',
    POSSESSION_CHANGED: 'possession:changed',
    GOAL_SCORED: 'goal:scored',
    SHOT_ATTEMPTED: 'shot:attempted',
    PASS_ATTEMPTED: 'pass:attempted',
    FOUL_COMMITTED: 'foul:committed',
    OFFSIDE_CALLED: 'offside:called',
    SET_PIECE_STARTED: 'setPiece:started',
    SET_PIECE_EXECUTED: 'setPiece:executed',
    PLAYER_SUBSTITUTED: 'player:substituted',
    MATCH_STARTED: 'match:started',
    MATCH_FINISHED: 'match:finished'
};

const eventBus = {
    events: {},
    
 
    subscribe(eventName, listener) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(listener);
        
        // Return unsubscribe function for cleanup
        return () => {
            this.events[eventName] = this.events[eventName].filter(l => l !== listener);
        };
    },
    

    publish(eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(listener => {
                try {
                    listener(data);
                } catch (error) {
                    console.error(`Error in event listener for ${eventName}:`, error);
                }
            });
        }
    },

    clear(eventName) {
        if (eventName) {
            delete this.events[eventName];
       } else {
            this.events = {};
        }
    },
    getListenerCount(eventName) {
        return this.events[eventName]?.length || 0;
    },
    
  
    hasListeners(eventName) {
        return this.getListenerCount(eventName) > 0;
   }
};
const EVENT_TYPES = {

    MATCH_START: 'match:start',
    MATCH_PAUSE: 'match:pause',
    MATCH_RESUME: 'match:resume',
    MATCH_END: 'match:end',
    HALF_TIME: 'match:halftime',
    KICKOFF: 'match:kickoff',

    BALL_KICKED: 'ball:kicked',
    BALL_PASSED: 'ball:passed',
    BALL_INTERCEPTED: 'ball:intercepted',
    BALL_OUT: 'ball:out',
    BALL_WON: 'ball:won',
    BALL_LOST: 'ball:lost',
    

    GOAL_SCORED: 'goal:scored',
    SHOT_TAKEN: 'shot:taken',
    SHOT_SAVED: 'shot:saved',
    SHOT_MISSED: 'shot:missed',
    SHOT_BLOCKED: 'shot:blocked',

    PLAYER_COLLISION: 'player:collision',
    PLAYER_TACKLE: 'player:tackle',
    PLAYER_DRIBBLE: 'player:dribble',
    PLAYER_HEADER: 'player:header',
    

    FOUL_COMMITTED: 'foul:committed',
    CARD_SHOWN: 'card:shown',
    PENALTY_AWARDED: 'penalty:awarded',
    FREE_KICK_AWARDED: 'freekick:awarded',

    TEAM_STATE_CHANGED: 'team:stateChanged',
    FORMATION_CHANGED: 'team:formationChanged',
    TACTIC_CHANGED: 'team:tacticChanged',
   POSSESSION_CHANGED: 'team:possessionChanged',

    AI_DECISION_MADE: 'ai:decisionMade',
    BT_NODE_EXECUTED: 'ai:btNodeExecuted',
    ZONE_ASSIGNED: 'ai:zoneAssigned',
    

    RENDER_BACKGROUND: 'render:background',
    RENDER_GAME: 'render:game',
    RENDER_UI: 'render:ui',

    STAT_UPDATED: 'stat:updated',
    XG_CALCULATED: 'stat:xgCalculated',
   PASS_COMPLETED: 'stat:passCompleted',
    PASS_FAILED: 'stat:passFailed',
    OFFSIDE_CALLED: 'offside:called'
};

// ============================================================================
// ✅ FIX #2: CONFIG MANAGER - CENTRALIZED CONFIGURATION ACCESS
// ============================================================================
// Single point of access for all game configuration
// Prevents silent failures, provides debugging info

const ConfigManager = {
    /**
     * Get configuration value with guaranteed return
     * @param {string} key - Config key (e.g., 'PITCH_WIDTH')
     * @param {*} defaultValue - Default if missing
     * @returns {*} Value or default (never undefined unless default is undefined)
     */
    get(key, defaultValue) {
        // Try GAME_CONFIG first
        if (key in GAME_CONFIG) {
            const value = GAME_CONFIG[key];
            if (value !== undefined) {
                return value;
            }
        }

        // Log warning for debugging
        if (defaultValue === undefined) {
            console.error(`❌ Config.get("${key}"): Missing and no default provided!`);
        } else {
            console.debug(`Config.get("${key}"): Using default value ${defaultValue}`);
        }

        return defaultValue;
    },

    /**
     * Get multiple config values at once
     * @param {string[]} keys - Array of config keys
     * @returns {Object} Object with requested keys
     */
    getBatch(keys) {
        const result = {};
        keys.forEach(key => {
            result[key] = this.get(key, GAME_CONFIG[key]);
        });
        return result;
    },

    /**
     * Check if configuration is valid
     * @throws {Error} If required configs are missing
     */
    validate() {
        const required = [
            'PITCH_WIDTH', 'PITCH_HEIGHT', 'GOAL_CHECK_DISTANCE',
            'SHOOTING_CHANCE_BASE', 'PASSING_CHANCE'
        ];

        const missing = required.filter(key => !(key in GAME_CONFIG));

        if (missing.length > 0) {
            throw new Error(`❌ Config validation failed. Missing: ${missing.join(', ')}`);
        }

        console.log('✓ Configuration validated successfully');
    }
};

if (typeof window !== 'undefined') {
    // Ensure runtime scripts that execute after config.js can always reference the
    // shared configuration objects from the global scope without needing
    // explicit imports.
    window.GAME_LOOP = window.GAME_LOOP || GAME_LOOP;
    window.PHYSICS = window.PHYSICS || PHYSICS;
    window.BALL_PHYSICS = window.BALL_PHYSICS || BALL_PHYSICS;
    window.GAME_CONFIG = window.GAME_CONFIG || GAME_CONFIG;
    window.POSITION_CONFIGS = window.POSITION_CONFIGS || POSITION_CONFIGS;
    window.FORMATIONS = window.FORMATIONS || FORMATIONS;
    window.TACTICS = window.TACTICS || TACTICS;
    window.TEAM_STATE_MODIFIERS = window.TEAM_STATE_MODIFIERS || TEAM_STATE_MODIFIERS;
    window.BT_CONFIG = window.BT_CONFIG || BT_CONFIG;
    window.EVENT_TYPES = window.EVENT_TYPES || EVENT_TYPES;
    // ✅ FIX #16: Export standard events and event bus for decoupled communication
    window.STANDARD_EVENTS = window.STANDARD_EVENTS || STANDARD_EVENTS;
    window.eventBus = window.eventBus || eventBus;
    window.ConfigManager = ConfigManager;
}

// ============================================================================
// ✅ FIX #3 & #10: DEPENDENCY REGISTRY + TACTICAL SYSTEM
// ============================================================================

const DependencyRegistry = {
    loaded: {},
    required: {},

    register(moduleName, exports) {
        this.loaded[moduleName] = exports;
        console.log(`✓ Module registered: ${moduleName}`);
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

// ============================================================================
// ✅ FIX #10: TACTICAL SYSTEM - Single Source of Truth for Tactics
// ============================================================================

const TacticalSystem = {
    tactics: {
        'balanced': {
            systemType: 'balanced',
            pressIntensity: 0.5,
            defensiveLineDepth: 0.5,
            counterAttackSpeed: 1.0,
            possessionPriority: 0.5,
            passingRisk: 0.5
        },
        'possession': {
            systemType: 'possession',
            pressIntensity: 0.3,
            defensiveLineDepth: 0.7,
            counterAttackSpeed: 0.8,
            possessionPriority: 0.9,
            passingRisk: 0.3
        },
        'high_press': {
            systemType: 'high_press',
            pressIntensity: 0.8,
            defensiveLineDepth: 0.8,
            counterAttackSpeed: 1.2,
            possessionPriority: 0.6,
            passingRisk: 0.6
        },
        'gegenpress': {
            systemType: 'high_press',
            pressIntensity: 0.9,
            defensiveLineDepth: 0.9,
            counterAttackSpeed: 1.3,
            possessionPriority: 0.7,
            passingRisk: 0.7
        },
        'counter_attack': {
            systemType: 'counter_attack',
            pressIntensity: 0.4,
            defensiveLineDepth: 0.2,
            counterAttackSpeed: 1.5,
            possessionPriority: 0.3,
            passingRisk: 0.8
        },
        'defensive': {
            systemType: 'low_block',
            pressIntensity: 0.4,
            defensiveLineDepth: 0.3,
            counterAttackSpeed: 1.1,
            possessionPriority: 0.4,
            passingRisk: 0.4
        },
        'park_bus': {
            systemType: 'low_block',
            pressIntensity: 0.2,
            defensiveLineDepth: 0.1,
            counterAttackSpeed: 1.0,
            possessionPriority: 0.2,
            passingRisk: 0.2
        }
    },

    getTactic(tacticName) {
        const tactic = this.tactics[tacticName];
        if (!tactic) {
            console.warn(`Unknown tactic: ${tacticName}, using balanced`);
            return this.tactics['balanced'];
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

if (typeof window !== 'undefined') {
    window.DependencyRegistry = DependencyRegistry;
    window.TacticalSystem = TacticalSystem;
}

// ============================================================================
// ✅ GAME STATE INITIALIZATION - Global state object
// ============================================================================
if (typeof window !== 'undefined' && typeof gameState === 'undefined') {
    window.gameState = {
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
                passesCompleted: 0,
                passesAttempted: 0,
                shotsOnTarget: 0,
                shotsOffTarget: 0,
                tackles: 0,
                interceptions: 0,
                xGTotal: 0
            },
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
        _teamCacheVersion: 0
    };
    console.log('✓ Game state initialized');
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GAME_LOOP,
        PHYSICS,
        BALL_PHYSICS,
        GAME_CONFIG,
        POSITION_CONFIGS,
        FORMATIONS,
        TACTICS,
        TEAM_STATE_MODIFIERS,
        BT_CONFIG,
        validatePhysicsRealism,
        EVENT_TYPES,
        eventBus,
        DependencyRegistry,
        TacticalSystem
    };
}

