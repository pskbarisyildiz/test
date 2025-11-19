import { eventBus } from './eventBus';
import { EVENT_TYPES } from './types';
import type { GoalEventPayload, ShotEventPayload, FoulEventPayload, TeamStateChangePayload, PossessionChangePayload } from './types';

interface LogEntry {
    timestamp: number;
    event: string;
    data: unknown;
}

export const EventLogger = {
    enabled: false,
    logs: [] as LogEntry[],
    maxLogs: 1000,

    enable() {
        this.enabled = true;
        console.log('📊 Event logging enabled');
    },

    disable() {
        this.enabled = false;
    },

    log(eventName: string, data: unknown) {
        if (!this.enabled) return;

        const logEntry: LogEntry = {
            timestamp: Date.now(),
            event: eventName,
            data: data
        };

        this.logs.push(logEntry);

        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
    },

    getLogs(eventName: string | null = null): LogEntry[] {
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

interface WrappedEventBus {
    _isWrapped?: boolean;
    publish: <T>(eventName: string, data: T) => void;
}

if (!(eventBus as WrappedEventBus)._isWrapped) {
    const originalPublish = eventBus.publish.bind(eventBus);
    (eventBus as WrappedEventBus).publish = function <T>(eventName: string, data: T) {
        EventLogger.log(eventName, data);
        return originalPublish(eventName, data);
    };
    (eventBus as WrappedEventBus)._isWrapped = true;
}

export function initCommentarySystem(): void {
    eventBus.subscribe<GoalEventPayload>(EVENT_TYPES.GOAL_SCORED, (data) => {
        const { scorer, time, xG } = data;
        console.log(`⚽ GOAL! ${scorer.name} scores at ${time}' (xG: ${(xG * 100).toFixed(0)}%)`);
    });

    eventBus.subscribe<ShotEventPayload>(EVENT_TYPES.SHOT_SAVED, (data) => {
        console.log(`🧤 Great save by ${data.shooter.name}!`);
    });

    eventBus.subscribe<FoulEventPayload>(EVENT_TYPES.FOUL_COMMITTED, (data) => {
        console.log(`⚠️ Foul by ${data.fouler.name} on ${data.fouled.name}`);
    });
}

export function initStatisticsSystem() {
    const matchStats = {
        goals: [] as GoalEventPayload[],
        shots: [] as ShotEventPayload[],
        fouls: [] as FoulEventPayload[]
    };

    eventBus.subscribe<GoalEventPayload>(EVENT_TYPES.GOAL_SCORED, (data) => {
        matchStats.goals.push(data);
    });

    eventBus.subscribe<ShotEventPayload>(EVENT_TYPES.SHOT_TAKEN, (data) => {
        matchStats.shots.push(data);
    });

    eventBus.subscribe<FoulEventPayload>(EVENT_TYPES.FOUL_COMMITTED, (data) => {
        matchStats.fouls.push(data);
    });

    return matchStats;
}

export function initTeamStateMonitor(): void {
    eventBus.subscribe<TeamStateChangePayload>(EVENT_TYPES.TEAM_STATE_CHANGED, (data) => {
        console.log(`🧠 ${data.team} team state: ${data.previousState} → ${data.newState}`);
    });

    eventBus.subscribe<PossessionChangePayload>(EVENT_TYPES.POSSESSION_CHANGED, (data) => {
        console.log(`⚡ Possession changed to ${data.newHolder.team}`);
    });
}

if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // EventLogger.enable();
}
