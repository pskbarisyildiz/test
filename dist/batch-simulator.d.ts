interface Match {
    id: number;
    homeTeam: string;
    awayTeam: string;
}
interface MatchResult {
    matchId: number;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    homeXG: string;
    awayXG: string;
    homePossession: number;
    awayPossession: number;
    homeShots: number;
    awayShots: number;
    homeShotsOnTarget: number;
    awayShotsOnTarget: number;
    homePassAccuracy: number;
    awayPassAccuracy: number;
    winner: string;
    goalEvents: {
        player?: string;
        scorer?: string;
        time: number;
        team: string;
        isHome?: boolean;
        [key: string]: unknown;
    }[];
    cardEvents: {
        player: string;
        time: number;
        team: string;
        type?: string;
        card?: string;
        isHome?: boolean;
        [key: string]: unknown;
    }[];
}
export declare const CustomFixtureSimulator: {
    matchList: Match[];
    isRunning: boolean;
    results: MatchResult[];
    currentMatchIndex: number;
    addMatch(homeTeam: string, awayTeam: string): void;
    removeMatch(matchId: number): void;
    clearAll(): void;
    renderMatchList(): void;
    simulateAll(): Promise<void>;
    simulateSingleMatch(homeTeam: string, awayTeam: string, matchId: number): Promise<MatchResult | null>;
    showSimulationScreen(): void;
    renderMatchCard(match: Match): string;
    updateMatchCard(result: MatchResult): void;
    _groupEventsByPlayer(allEvents: {
        isHome?: boolean;
        player?: string;
        [key: string]: unknown;
    }[], teamName: string): string;
    highlightMatchCard(matchId: number, state: "playing" | "finished" | "error"): void;
    updateProgressIndicator(): void;
    showCompletionControls(): void;
    injectStyles(): void;
    exportResults(): void;
    cancel(): void;
    backToSetup(): void;
};
export {};
//# sourceMappingURL=batch-simulator.d.ts.map