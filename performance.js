// Cache teammate/opponent arrays to reduce allocations from 2640/sec to ~2/sec
if (typeof window !== 'undefined') {
    window._teamCache = {
        version: 0,
        homePlayers: [],
        awayPlayers: []
    };

    window.getTeammates = function(player, allPlayers) {
        const cacheVersion = gameState._teamCacheVersion || 0;
        if (window._teamCache.version !== cacheVersion) {
            window._teamCache.homePlayers = allPlayers.filter(p => p.isHome);
            window._teamCache.awayPlayers = allPlayers.filter(p => !p.isHome);
            window._teamCache.version = cacheVersion;
        }
        return player.isHome ? window._teamCache.homePlayers : window._teamCache.awayPlayers;
    };

    window.getOpponents = function(player, allPlayers) {
        const cacheVersion = gameState._teamCacheVersion || 0;
        if (window._teamCache.version !== cacheVersion) {
            window._teamCache.homePlayers = allPlayers.filter(p => p.isHome);
            window._teamCache.awayPlayers = allPlayers.filter(p => !p.isHome);
            window._teamCache.version = cacheVersion;
        }
        return player.isHome ? window._teamCache.awayPlayers : window._teamCache.homePlayers;
    };

    // Invalidate cache when teams change (substitutions, etc.)
    window.invalidateTeamCache = function() {
        gameState._teamCacheVersion = (gameState._teamCacheVersion || 0) + 1;
    };
}
function updateParticles(dt) {
    if (!gameState.particles || !Array.isArray(gameState.particles)) return;

    // Update and filter out dead particles
    gameState.particles = gameState.particles.filter(particle => {
        if (typeof particle.update === 'function') {
            particle.update(dt);
        } else if (typeof particle.life === 'number') {
            particle.life -= dt;
        }
        return (particle.life || 0) > 0;
    });

    // Limit particle count to prevent memory bloat (500 particles max)
    if (gameState.particles.length > 500) {
        gameState.particles = gameState.particles.slice(-500);
    }
}
