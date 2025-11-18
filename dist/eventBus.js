/**
 * Event Bus System
 * Type-safe event bus for decoupled architecture
 */
import { EVENT_TYPES } from './types';
// ============================================================================
// STANDARD EVENTS
// ============================================================================
export const STANDARD_EVENTS = {
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
// ============================================================================
// EVENT BUS IMPLEMENTATION
// ============================================================================
export const eventBus = {
    events: {},
    /**
     * Subscribe to an event
     */
    subscribe(eventName, listener) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(listener);
        // Return unsubscribe function for cleanup
        return () => {
            if (this.events[eventName]) {
                this.events[eventName] = this.events[eventName].filter(l => l !== listener);
            }
        };
    },
    /**
     * Unsubscribe from an event
     */
    unsubscribe(eventName, listener) {
        if (this.events[eventName]) {
            this.events[eventName] = this.events[eventName].filter(l => l !== listener);
        }
    },
    /**
     * Publish an event to all subscribers
     */
    publish(eventName, data) {
        const listeners = this.events[eventName];
        if (listeners) {
            listeners.forEach(listener => {
                try {
                    listener(data);
                }
                catch (error) {
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
        }
        else {
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
// ============================================================================
// CONFIG MANAGER
// ============================================================================
export const ConfigManager = {
    /**
     * Get configuration value with guaranteed return
     */
    get(key, defaultValue) {
        // Try GAME_CONFIG first
        if (typeof window !== 'undefined' && window.GAME_CONFIG && key in window.GAME_CONFIG) {
            const value = window.GAME_CONFIG[key];
            if (value !== undefined) {
                return value;
            }
        }
        // Log warning for debugging
        if (defaultValue === undefined) {
            console.error(`❌ Config.get("${key}"): Missing and no default provided!`);
        }
        else {
            console.debug(`Config.get("${key}"): Using default value ${defaultValue}`);
        }
        return defaultValue;
    },
    /**
     * Get multiple config values at once
     */
    getBatch(keys) {
        const result = {};
        keys.forEach(key => {
            result[key] = this.get(key);
        });
        return result;
    },
    /**
     * Check if configuration is valid
     */
    validate() {
        const required = [
            'PITCH_WIDTH',
            'PITCH_HEIGHT',
            'GOAL_CHECK_DISTANCE',
            'SHOOTING_CHANCE_BASE',
            'PASSING_CHANCE'
        ];
        const missing = required.filter(key => {
            if (typeof window === 'undefined' || !window.GAME_CONFIG)
                return true;
            return !(key in window.GAME_CONFIG);
        });
        if (missing.length > 0) {
            throw new Error(`❌ Config validation failed. Missing: ${missing.join(', ')}`);
        }
        console.log('✓ Configuration validated successfully');
    }
};
export const DependencyRegistry = {
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
export const TacticalSystem = {
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
// ============================================================================
// GLOBAL EXPORT FOR BROWSER COMPATIBILITY
// ============================================================================
if (typeof window !== 'undefined') {
    window.STANDARD_EVENTS = STANDARD_EVENTS;
    window.eventBus = eventBus;
    window.EVENT_TYPES = EVENT_TYPES;
    window.ConfigManager = ConfigManager;
    window.DependencyRegistry = DependencyRegistry;
    window.TacticalSystem = TacticalSystem;
    window.SHOW_OFFSIDE_LINES = false;
    console.log('✅ Event Bus System loaded (TypeScript)');
}
//# sourceMappingURL=eventBus.js.map