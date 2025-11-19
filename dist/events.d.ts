import type { GoalEventPayload, ShotEventPayload, FoulEventPayload } from './types';
interface LogEntry {
    timestamp: number;
    event: string;
    data: unknown;
}
export declare const EventLogger: {
    enabled: boolean;
    logs: LogEntry[];
    maxLogs: number;
    enable(): void;
    disable(): void;
    log(eventName: string, data: unknown): void;
    getLogs(eventName?: string | null): LogEntry[];
    clear(): void;
    exportToJSON(): string;
};
export declare function initCommentarySystem(): void;
export declare function initStatisticsSystem(): {
    goals: GoalEventPayload[];
    shots: ShotEventPayload[];
    fouls: FoulEventPayload[];
};
export declare function initTeamStateMonitor(): void;
export {};
//# sourceMappingURL=events.d.ts.map