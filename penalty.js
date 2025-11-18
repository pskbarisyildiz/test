
const PenaltyKickBehaviors = {
    getKickerPosition(penaltyPos) {
        return sanitizePosition({ x: penaltyPos.x, y: penaltyPos.y, movement: 'penalty_kicker', role: 'PENALTY_KICKER' }, {});
    },

    getPenaltyArcPosition(player, penaltyPos, isAttacking, gameState) {
        if (!player) {
            return sanitizePosition({ x: 400, y: 300, movement: 'penalty_arc' }, {});
        }

        if (player.role === 'GK') {
            const goalX = isAttacking ? 
                window.getAttackingGoalX(!player.isHome, gameState.currentHalf) : 
                window.getAttackingGoalX(player.isHome, gameState.currentHalf);
            return sanitizePosition({ x: goalX, y: 300, movement: 'gk_penalty', role: 'GK' }, { player });
        }

        const arcRadius = 110;
        const angle = Math.random() * Math.PI - Math.PI / 2;
        const x = penaltyPos.x + Math.cos(angle) * arcRadius;
        const y = penaltyPos.y + Math.sin(angle) * arcRadius;

        return sanitizePosition({ x, y, movement: 'penalty_arc_wait' }, { player });
    }
};
