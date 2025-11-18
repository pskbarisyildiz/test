/**
 * KICKOFF BEHAVIORS - Professional Kickoff Positioning System
 *
 * This function's ONLY job is to tell players to HOLD the position
 * that `setupKickOff` (in main.js) already put them in.
 * This prevents stuttering.
 */
const KickoffBehaviors = {
    /**
     * Get position for kickoff based on player role and team
     */
    getKickoffPosition(player, kickoffPos, isKickingTeam, gameState) {
        if (!player || !gameState) {
            return sanitizePosition({ x: 400, y: 300, movement: 'kickoff_fallback' }, { player });
        }

        // === GOALKEEPER POSITIONING ===
        // GK is the only one who needs a slight adjustment (to their goal line).
        if (player.role === 'GK') {
            const ownGoalX = window.getAttackingGoalX(!player.isHome, gameState.currentHalf);
            return sanitizePosition({
                x: ownGoalX,
                y: 300,
                movement: 'kickoff_gk',
                role: 'GK'
            }, { player });
        }

        // === ALL OTHER PLAYERS ===
        // `setupKickOff` in main.js has ALREADY teleported all players
        // to their correct positions. We just tell them to HOLD.
        
        let role = player.role;
        // Re-assign role for kickers just for clarity/logic
        if (isKickingTeam) {
            const distToCenter = window.getDistance(player, { x: 400, y: 300 });
            if (distToCenter < 15) {
                role = 'PRIMARY_KICKER';
            } else if (distToCenter < 40) {
                role = 'SECONDARY_KICKER';
            }
        }

        return sanitizePosition({
            x: player.x, // STAY at your current X
            y: player.y, // STAY at your current Y
            movement: 'kickoff_hold_position', // New, clear movement name
            role: role
        }, { player });
    },

    /**
     * Check if a player's position is valid for kickoff
     * (This function is still useful for validation by other systems)
     */
    isValidKickoffPosition(player, position, isKickingTeam, gameState) {
        if (!position || !gameState) return false;

        const centerX = (typeof GAME_CONFIG !== 'undefined') ? GAME_CONFIG.PITCH_WIDTH / 2 : 400;
        const centerY = (typeof GAME_CONFIG !== 'undefined') ? GAME_CONFIG.PITCH_HEIGHT / 2 : 300;
        const ownGoalX = window.getAttackingGoalX(!player.isHome, gameState.currentHalf);
        const ownHalfIsLeft = ownGoalX < centerX;

        // Check if in own half (with 10px tolerance)
        const inOwnHalf = ownHalfIsLeft
            ? position.x <= centerX + 10
            : position.x >= centerX - 10;

        if (!inOwnHalf) {
            console.warn(`Player ${player.name} not in own half: x=${position.x}, ownHalfIsLeft=${ownHalfIsLeft}`);
            return false;
        }

        // If defending team, must be outside center circle
        if (!isKickingTeam) {
            const distToCenter = window.getDistance(position, { x: centerX, y: centerY });
            if (distToCenter < 70) { // 70px is ~10 yards
                console.warn(`Defending player ${player.name} too close to center: ${distToCenter}px`);
                return false;
            }
        }

        return true;
    },

    /**
     * Get the two designated kickers for kickoff
     * (This function is still useful for validation by other systems)
     */
    getDesignatedKickers(gameState) {
        if (!gameState || !gameState.setPiece) return { primary: null, secondary: null };

        const kickingTeamIsHome = gameState.setPiece.team === true || gameState.setPiece.team === 'home';
        const kickingTeamPlayers = kickingTeamIsHome ? gameState.homePlayers : gameState.awayPlayers;

        if (!kickingTeamPlayers || kickingTeamPlayers.length === 0) {
            return { primary: null, secondary: null };
        }

        const centerX = (typeof GAME_CONFIG !== 'undefined') ? GAME_CONFIG.PITCH_WIDTH / 2 : 400;
        const centerY = (typeof GAME_CONFIG !== 'undefined') ? GAME_CONFIG.PITCH_HEIGHT / 2 : 300;

        // Find players closest to center
        const playersNearCenter = kickingTeamPlayers
            .filter(p => p.role !== 'GK')
            .map(p => ({
                player: p,
                dist: window.getDistance(p, { x: centerX, y: centerY })
            }))
            .sort((a, b) => a.dist - b.dist);

        return {
            primary: playersNearCenter[0]?.player || null,
            secondary: playersNearCenter[1]?.player || null
        };
    }
};

// Export to window
if (typeof window !== 'undefined') {
    window.KickoffBehaviors = KickoffBehaviors;

    // Register with DependencyRegistry if available
    if (typeof DependencyRegistry !== 'undefined') {
        DependencyRegistry.register('KickoffBehaviors', KickoffBehaviors);
    }

    console.log('✅ KICKOFF BEHAVIORS LOADED - (Simplified HOLD_POSITION fix)');
}
