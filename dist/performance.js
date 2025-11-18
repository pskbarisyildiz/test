import { gameState } from './globalExports';
const _teamCache = {
    version: 0,
    homePlayers: [],
    awayPlayers: []
};
function updateCache(allPlayers) {
    _teamCache.homePlayers = allPlayers.filter(p => p.isHome);
    _teamCache.awayPlayers = allPlayers.filter(p => !p.isHome);
    _teamCache.version = gameState._teamCacheVersion || 0;
}
export function getTeammates(player, allPlayers) {
    const cacheVersion = gameState._teamCacheVersion || 0;
    if (_teamCache.version !== cacheVersion) {
        updateCache(allPlayers);
    }
    return player.isHome ? _teamCache.homePlayers : _teamCache.awayPlayers;
}
export function getOpponents(player, allPlayers) {
    const cacheVersion = gameState._teamCacheVersion || 0;
    if (_teamCache.version !== cacheVersion) {
        updateCache(allPlayers);
    }
    return player.isHome ? _teamCache.awayPlayers : _teamCache.homePlayers;
}
export function invalidateTeamCache() {
    gameState._teamCacheVersion = (gameState._teamCacheVersion || 0) + 1;
}
export function updateParticles(dt) {
    if (!gameState.particles || !Array.isArray(gameState.particles))
        return;
    gameState.particles = gameState.particles.filter(particle => {
        if (typeof particle.update === 'function') {
            particle.update(dt);
        }
        else if (typeof particle.life === 'number') {
            particle.life -= dt;
        }
        return (particle.life || 0) > 0;
    });
    if (gameState.particles.length > 500) {
        gameState.particles = gameState.particles.slice(-500);
    }
}
//# sourceMappingURL=performance.js.map