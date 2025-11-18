import { CustomFixtureSimulator } from '../src/batch-simulator';
import { gameState } from '../src/globalExports';
import { selectBestTeam, selectBestTactic, initializePlayers } from '../src/gameSetup';
import { updatePlayerAI_V2 } from '../src/core';
import { updatePhysics, assignBallChasers } from '../src/physics';
import * as SetPieceIntegration from '../src/setpieces/integration';
import { processPendingEvents, switchSides, updateMatchStats, resetAfterGoal, handleShotAttempt } from '../src/main';
import { getPlayerActivePosition } from '../src/ai';
import { getAttackingGoalX } from '../src/utils/ui';

// Attach functions to the window object provided by jsdom
Object.assign(window, {
    selectBestTeam,
    selectBestTactic,
    initializePlayers,
    updatePlayerAI_V2,
    updatePhysics,
    assignBallChasers,
    SetPieceIntegration,
    processPendingEvents,
    switchSides,
    updateMatchStats,
    resetAfterGoal,
    handleShotAttempt,
    getAttackingGoalX,
    render: () => {}, // Mock render to avoid errors
    alert: (message: string) => { console.log('window.alert:', message) },
});

function createMockPlayers(teamName: string, count: number): any[] {
    const players = [];
    const positions = ['Goalkeeper', 'Defender', 'Defender', 'Defender', 'Defender', 'Midfielder', 'Midfielder', 'Midfielder', 'Forward', 'Forward', 'Forward'];
    for (let i = 1; i <= count; i++) {
        players.push({
            team: teamName,
            name: `${teamName} Player ${i}`,
            position: positions[i-1],
            rating: 75, pace: 75, shooting: 75, passing: 75, dribbling: 75, defending: 75, physicality: 75, goalkeeping: 10
        });
    }
    return players;
}

const mockPlayers = [...createMockPlayers('Team A', 11), ...createMockPlayers('Team B', 11)];

// Mock the gameState object
const mockGameState = {
  ...gameState,
  status: 'setup',
  players: mockPlayers,
  teamLogos: { 'Team A': 'logoA.png', 'Team B': 'logoB.png' },
  homePlayers: [],
  awayPlayers: [],
  homeTeam: 'Team A',
  awayTeam: 'Team B',
  contexts: {},
  stats: { home: { possession: 0, passesCompleted: 0, passesAttempted: 0, xGTotal: 0, shotsOnTarget: 0, shotsOffTarget: 0 }, away: { possession: 0, passesCompleted: 0, passesAttempted: 0, xGTotal: 0, shotsOnTarget: 0, shotsOffTarget: 0 }, possessionTimer: { home: 0, away: 0 }, lastPossessionUpdate: 0 }
};

// Replace the global gameState with the mock
Object.assign(gameState, mockGameState);

describe('Batch Simulator', () => {
  // Increase timeout for the simulation
  jest.setTimeout(60000);

  it('should simulate a match and record a pass event', async () => {
    CustomFixtureSimulator.addMatch('Team A', 'Team B');
    await CustomFixtureSimulator.simulateAll();

    const result = CustomFixtureSimulator.results[0];
    expect(result).toBeDefined();
    expect(result.homeScore).toBeGreaterThanOrEqual(0);
    expect(result.awayScore).toBeGreaterThanOrEqual(0);
    // Check if any passes were attempted
    const homePassesAttempted = (gameState.stats.home as any).passesAttempted;
    const awayPassesAttempted = (gameState.stats.away as any).passesAttempted;
    expect(homePassesAttempted + awayPassesAttempted).toBeGreaterThan(0);
  });
});
