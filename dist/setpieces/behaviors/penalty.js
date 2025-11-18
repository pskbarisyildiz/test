/**
 * Penalty Kick Behaviors - TypeScript Migration
 *
 * Handles player positioning for penalty kicks:
 * - Kicker positioning at penalty spot
 * - Penalty arc waiting positions
 * - Goalkeeper positioning
 *
 * @module setpieces/behaviors/penalty
 * @migrated-from js/setpieces/behaviors/penalty.js
 */
import { sanitizePosition } from '../utils';
import { getAttackingGoalX } from '../../utils/ui';
// ============================================================================
// PENALTY KICK BEHAVIORS
// ============================================================================
export const PenaltyKickBehaviors = {
    /**
     * Get kicker position at penalty spot
     */
    getKickerPosition(penaltyPos) {
        return sanitizePosition({ x: penaltyPos.x, y: penaltyPos.y, movement: 'penalty_kicker', role: 'PENALTY_KICKER' }, {});
    },
    /**
     * Get penalty arc position for waiting players
     */
    getPenaltyArcPosition(player, penaltyPos, isAttacking, gameState) {
        if (!player) {
            return sanitizePosition({ x: 400, y: 300, movement: 'penalty_arc' }, {});
        }
        if (player.role === 'GK') {
            const goalX = isAttacking ?
                getAttackingGoalX(!player.isHome, gameState.currentHalf) :
                getAttackingGoalX(player.isHome, gameState.currentHalf);
            return sanitizePosition({ x: goalX, y: 300, movement: 'gk_penalty', role: 'GK' }, { player });
        }
        const arcRadius = 110;
        const angle = Math.random() * Math.PI - Math.PI / 2;
        const x = penaltyPos.x + Math.cos(angle) * arcRadius;
        const y = penaltyPos.y + Math.sin(angle) * arcRadius;
        return sanitizePosition({ x, y, movement: 'penalty_arc_wait' }, { player });
    }
};
// ============================================================================
// BROWSER EXPORTS
// ============================================================================
//# sourceMappingURL=penalty.js.map