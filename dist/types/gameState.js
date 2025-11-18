/**
 * Game State Type Definitions
 * Central state container for the entire football simulation
 */
/** Type guard to check if status is a set piece */
export function isSetPieceStatus(status) {
    return ['KICK_OFF', 'GOAL_KICK', 'CORNER_KICK', 'FREE_KICK', 'THROW_IN', 'PENALTY'].includes(status);
}
/** Type guard to check if status is active gameplay */
export function isActiveGameplay(status) {
    return status === 'playing' || isSetPieceStatus(status);
}
/** Type guard to validate player object */
export function isValidPlayer(obj) {
    if (typeof obj !== 'object' || obj === null)
        return false;
    const p = obj;
    return (typeof p['id'] === 'string' &&
        typeof p['name'] === 'string' &&
        typeof p['team'] === 'string' &&
        typeof p['role'] === 'string' &&
        typeof p['isHome'] === 'boolean' &&
        typeof p['x'] === 'number' &&
        typeof p['y'] === 'number');
}
//# sourceMappingURL=gameState.js.map