import type { Player } from './types';
import { gameState } from './globalExports';

interface TeamCache {
    version: number;
    homePlayers: Player[];
    awayPlayers: Player[];
}

const _teamCache: TeamCache = {
    version: 0,
    homePlayers: [],
    awayPlayers: []
};

function updateCache(allPlayers: Player[]): void {
    _teamCache.homePlayers = allPlayers.filter(p => p.isHome);
    _teamCache.awayPlayers = allPlayers.filter(p => !p.isHome);
    _teamCache.version = (gameState as any)._teamCacheVersion || 0;
}

export function getTeammates(player: Player, allPlayers: Player[]): Player[] {
    const cacheVersion = (gameState as any)._teamCacheVersion || 0;
    if (_teamCache.version !== cacheVersion) {
        updateCache(allPlayers);
    }
    return player.isHome ? _teamCache.homePlayers : _teamCache.awayPlayers;
}

export function getOpponents(player: Player, allPlayers: Player[]): Player[] {
    const cacheVersion = (gameState as any)._teamCacheVersion || 0;
    if (_teamCache.version !== cacheVersion) {
        updateCache(allPlayers);
    }
    return player.isHome ? _teamCache.awayPlayers : _teamCache.homePlayers;
}

export function invalidateTeamCache(): void {
    (gameState as any)._teamCacheVersion = ((gameState as any)._teamCacheVersion || 0) + 1;
}

export function updateParticles(dt: number): void {
    if (!gameState.particles || !Array.isArray(gameState.particles)) return;

    gameState.particles = gameState.particles.filter(particle => {
        if (typeof (particle as any).update === 'function') {
            (particle as any).update(dt);
        } else if (typeof (particle as any).life === 'number') {
            (particle as any).life -= dt;
        }
        return ((particle as any).life || 0) > 0;
    });

    if (gameState.particles.length > 500) {
        gameState.particles = gameState.particles.slice(-500);
    }
}
