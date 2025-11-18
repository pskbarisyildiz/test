import { eventBus } from './eventBus';
import { EVENT_TYPES } from './types';
export const EventLogger = {
    enabled: false,
    logs: [],
    maxLogs: 1000,
    enable() {
        this.enabled = true;
        console.log('📊 Event logging enabled');
    },
    disable() {
        this.enabled = false;
    },
    log(eventName, data) {
        if (!this.enabled)
            return;
        const logEntry = {
            timestamp: Date.now(),
            event: eventName,
            data: data
        };
        this.logs.push(logEntry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
    },
    getLogs(eventName = null) {
        if (eventName) {
            return this.logs.filter(log => log.event === eventName);
        }
        return this.logs;
    },
    clear() {
        this.logs = [];
    },
    exportToJSON() {
        return JSON.stringify(this.logs, null, 2);
    }
};
if (!eventBus._isWrapped) {
    const originalPublish = eventBus.publish.bind(eventBus);
    eventBus.publish = function (eventName, data) {
        EventLogger.log(eventName, data);
        return originalPublish(eventName, data);
    };
    eventBus._isWrapped = true;
}
export function initCommentarySystem() {
    eventBus.subscribe(EVENT_TYPES.GOAL_SCORED, (data) => {
        const { scorer, time, xG } = data;
        console.log(`⚽ GOAL! ${scorer.name} scores at ${time}' (xG: ${(xG * 100).toFixed(0)}%)`);
    });
    eventBus.subscribe(EVENT_TYPES.SHOT_SAVED, (data) => {
        console.log(`🧤 Great save by ${data.shooter.name}!`);
    });
    eventBus.subscribe(EVENT_TYPES.FOUL_COMMITTED, (data) => {
        console.log(`⚠️ Foul by ${data.fouler.name} on ${data.fouled.name}`);
    });
}
export function initStatisticsSystem() {
    const matchStats = {
        goals: [],
        shots: [],
        fouls: []
    };
    eventBus.subscribe(EVENT_TYPES.GOAL_SCORED, (data) => {
        matchStats.goals.push(data);
    });
    eventBus.subscribe(EVENT_TYPES.SHOT_TAKEN, (data) => {
        matchStats.shots.push(data);
    });
    eventBus.subscribe(EVENT_TYPES.FOUL_COMMITTED, (data) => {
        matchStats.fouls.push(data);
    });
    return matchStats;
}
export function initTeamStateMonitor() {
    eventBus.subscribe(EVENT_TYPES.TEAM_STATE_CHANGED, (data) => {
        console.log(`🧠 ${data.team} team state: ${data.previousState} → ${data.newState}`);
    });
    eventBus.subscribe(EVENT_TYPES.POSSESSION_CHANGED, (data) => {
        console.log(`⚡ Possession changed to ${data.newHolder.team}`);
    });
}
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // EventLogger.enable();
}
//# sourceMappingURL=events.js.map