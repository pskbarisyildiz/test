/**
 * Set Piece Utility Functions - TypeScript Migration
 *
 * Core utilities for set piece positioning and validation:
 * - TacticalContext: Game state analysis and urgency calculation
 * - PositionManager: Intelligent player spacing and collision avoidance
 * - Utility functions: Position sanitization, player validation, offside checks
 *
 * @module setpieces/utils
 * @migrated-from js/setpieces/setPieceUtils.js
 */
import { distance } from '../utils/math';
import { GAME_CONFIG } from '../config';
import { getPlayerActivePosition } from '../ai/movement';
import { getAttackingGoalX } from '../utils/ui';
// ============================================================================
// TACTICAL CONTEXT ANALYZER
// ============================================================================
export class TacticalContext {
    constructor(gameState, setPieceType) {
        this.gameState = gameState;
        this.setPieceType = setPieceType;
        this.scoreDifference = (gameState.homeScore || 0) - (gameState.awayScore || 0);
        this.timeRemaining = 90 - (gameState.matchTime || 0);
        this.isTrailing = false;
        this.isLeading = false;
        this.isDrawn = this.scoreDifference === 0;
        this.isLateGame = this.timeRemaining < 15;
        this.isVeryLateGame = this.timeRemaining < 5;
    }
    getUrgency(isHome) {
        const effectiveDiff = isHome ? this.scoreDifference : -this.scoreDifference;
        if (effectiveDiff < 0) { // Trailing
            if (this.isVeryLateGame)
                return 'DESPERATE';
            if (this.isLateGame)
                return 'HIGH';
            return 'MODERATE';
        }
        if (effectiveDiff > 0) { // Leading
            if (this.isLateGame)
                return 'CONSERVATIVE';
            return 'BALANCED';
        }
        return 'BALANCED';
    }
    shouldCommitForward(isHome) {
        const urgency = this.getUrgency(isHome);
        return urgency === 'DESPERATE' || urgency === 'HIGH';
    }
    shouldStayCompact(isHome) {
        const urgency = this.getUrgency(isHome);
        return urgency === 'CONSERVATIVE' && this.isLateGame;
    }
}
// ============================================================================
// POSITION MANAGER WITH INTELLIGENT SPACING
// ============================================================================
export class PositionManager {
    constructor() {
        this.occupiedPositions = [];
        this.minDistance = 30;
        this.priorityZones = new Map();
    }
    reset() {
        this.occupiedPositions = [];
        this.priorityZones.clear();
    }
    markPriorityZone(x, y, radius = 40) {
        this.priorityZones.set(`${Math.round(x)},${Math.round(y)}`, { x, y, radius });
    }
    isPositionOccupied(x, y, allowOverlap = false) {
        if (allowOverlap)
            return false;
        return this.occupiedPositions.some(pos => {
            const dist = distance(pos, { x, y });
            return dist < this.minDistance;
        });
    }
    findValidPosition(idealPos, maxAttempts = 10, allowPriorityOverlap = false) {
        const PITCH_WIDTH = GAME_CONFIG.PITCH_WIDTH;
        const PITCH_HEIGHT = GAME_CONFIG.PITCH_HEIGHT;
        const safeIdeal = sanitizePosition(idealPos, { behavior: 'PositionManager' });
        if (!this.isPositionOccupied(safeIdeal.x, safeIdeal.y, allowPriorityOverlap)) {
            this.occupiedPositions.push({ x: safeIdeal.x, y: safeIdeal.y });
            return { x: safeIdeal.x, y: safeIdeal.y };
        }
        // Spiral search pattern
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const angle = (Math.PI * 2 * attempt) / maxAttempts;
            const radius = this.minDistance * (1 + attempt * 0.3);
            const newX = safeIdeal.x + Math.cos(angle) * radius;
            const newY = safeIdeal.y + Math.sin(angle) * radius;
            const clampedX = Math.max(10, Math.min(PITCH_WIDTH - 10, newX));
            const clampedY = Math.max(10, Math.min(PITCH_HEIGHT - 10, newY));
            if (!this.isPositionOccupied(clampedX, clampedY, allowPriorityOverlap)) {
                this.occupiedPositions.push({ x: clampedX, y: clampedY });
                return { x: clampedX, y: clampedY };
            }
        }
        this.occupiedPositions.push({ x: safeIdeal.x, y: safeIdeal.y });
        return { x: safeIdeal.x, y: safeIdeal.y };
    }
}
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
// const __warnHistory = new Map<string, { count: number; last: number }>();
// function warnThrottled(key: string, ...args: any[]): void {
//   try {
//     const now = Date.now();
//     const entry = __warnHistory.get(key) || { count: 0, last: 0 };
//     if (now - entry.last > 60000) {
//       entry.count = 0;
//       entry.last = now;
//     }
//     entry.count += 1;
//     __warnHistory.set(key, entry);
//     if (entry.count <= 3) {
//       console.warn(...args);
//       if (entry.count === 3) {
//         console.warn(`[SetPiece] Further messages for '${key}' will be suppressed for 60s.`);
//       }
//     }
//   } catch (e) {
//     console.warn(...args);
//   }
// }
export function getSafeStat(stats, key, defaultValue = 0) {
    if (stats && typeof stats[key] === 'number' && !isNaN(stats[key])) {
        return stats[key];
    }
    if (stats && typeof stats[key] === 'string') {
        const num = parseFloat(stats[key]);
        if (!isNaN(num))
            return num;
    }
    return defaultValue;
}
function getRoleBasedFallbackPosition(role, context = {}) {
    const PITCH_WIDTH = GAME_CONFIG.PITCH_WIDTH;
    const PITCH_HEIGHT = GAME_CONFIG.PITCH_HEIGHT;
    let fallbackX = PITCH_WIDTH / 2;
    let fallbackY = PITCH_HEIGHT / 2;
    if (role && context.player && context.gameState) {
        const activePos = getPlayerActivePosition(context.player, context.gameState.currentHalf);
        fallbackX = activePos.x;
        fallbackY = activePos.y;
    }
    fallbackX = Math.max(10, Math.min(PITCH_WIDTH - 10, fallbackX));
    fallbackY = Math.max(10, Math.min(PITCH_HEIGHT - 10, fallbackY));
    return { x: fallbackX, y: fallbackY, movement: 'role_fallback', role: role || 'FALLBACK_ROLE' };
}
export function sanitizePosition(pos, context = {}) {
    const PITCH_WIDTH = GAME_CONFIG.PITCH_WIDTH;
    const PITCH_HEIGHT = GAME_CONFIG.PITCH_HEIGHT;
    // Validation of position data
    if (!pos || typeof pos !== 'object') {
        console.error(`❌ sanitizePosition: INVALID POSITION (not an object) for ${context.player?.name || 'unknown player'}`);
        console.error(`   Received:`, pos);
        console.error(`   Context:`, { behavior: context.behavior, role: context.role, movement: context.movement });
        console.error(`   Stack:`, new Error().stack);
        return getRoleBasedFallbackPosition(context.role, context);
    }
    // Cast to object with x and y properties
    const posObj = pos;
    let x = Number(posObj.x);
    let y = Number(posObj.y);
    if (isNaN(x) || !isFinite(x) || isNaN(y) || !isFinite(y)) {
        console.error(`❌ sanitizePosition: INVALID COORDINATES for ${context.player?.name || 'unknown player'}`);
        console.error(`   Position: {x: ${posObj.x} (${typeof posObj.x}), y: ${posObj.y} (${typeof posObj.y})}`);
        console.error(`   After Number(): {x: ${x}, y: ${y}}`);
        console.error(`   Context:`, { behavior: context.behavior, role: context.role, movement: context.movement });
        return getRoleBasedFallbackPosition(context.role, context);
    }
    const minX = 10, minY = 10;
    const maxX = PITCH_WIDTH - 10, maxY = PITCH_HEIGHT - 10;
    // Silently clamp positions to bounds (no logging to reduce console noise)
    x = Math.max(minX, Math.min(maxX, x));
    y = Math.max(minY, Math.min(maxY, y));
    return {
        ...posObj,
        x,
        y,
        movement: posObj.movement || context.movement || 'standard_position',
        role: posObj.role || context.role || 'UNKNOWN_ROLE'
    };
}
export function getValidPlayers(playersArray) {
    if (!Array.isArray(playersArray))
        return [];
    return playersArray.filter(p => p && typeof p.x === 'number' && typeof p.y === 'number' && isFinite(p.x) && isFinite(p.y));
}
export function getSortedLists(teammates, opponents) {
    const validTeammates = getValidPlayers(teammates);
    const validOpponents = getValidPlayers(opponents);
    return {
        teammates: {
            bestKickers: validTeammates.filter(p => p.role !== 'GK').sort((a, b) => getSafeStat(b.stats, 'shooting', 70) - getSafeStat(a.stats, 'shooting', 70)),
            bestHeaders: validTeammates.filter(p => p.role !== 'GK').sort((a, b) => getSafeStat(b.stats, 'heading', 70) - getSafeStat(a.stats, 'heading', 70)),
            fastest: validTeammates.filter(p => p.role !== 'GK').sort((a, b) => getSafeStat(b.stats, 'pace', 70) - getSafeStat(a.stats, 'pace', 70)),
            bestDefenders: validTeammates.filter(p => p.role !== 'GK').sort((a, b) => getSafeStat(a.stats, 'defending', 70) - getSafeStat(b.stats, 'defending', 70))
        },
        opponents: {
            tallest: validOpponents.filter(p => p.role !== 'GK').sort((a, b) => getSafeStat(b.stats, 'heading', 70) - getSafeStat(a.stats, 'heading', 70)),
            mostDangerous: validOpponents.filter(p => p.role !== 'GK').sort((a, b) => getSafeStat(b.stats, 'attacking', 70) - getSafeStat(a.stats, 'attacking', 70))
        }
    };
}
export function determineSetPieceTeam(gameState, player) {
    const fallbackTeam = (player && typeof player.isHome === 'boolean') ? (player.isHome ? 'home' : 'away') : 'home';
    if (!gameState || !gameState.setPiece)
        return fallbackTeam;
    const setPiece = gameState.setPiece;
    // Check for undefined/null instead of truthy value
    // This allows setPiece.team = false (away team) to be processed correctly
    if (setPiece.team !== undefined && setPiece.team !== null) {
        return setPiece.team === 'home' || setPiece.team === true ? 'home' : 'away';
    }
    return fallbackTeam;
}
export function isPlayerAttacking(player, gameState) {
    if (!player || typeof player.isHome !== 'boolean')
        return false;
    const setPieceTeam = determineSetPieceTeam(gameState, player);
    const playerTeam = player.isHome ? 'home' : 'away';
    return setPieceTeam === playerTeam;
}
/**
 * Formation-aware positioning helper
 * Ensures players maintain proper positional discipline based on their role
 */
export function getFormationAwarePosition(player, basePosition, gameState, isAttacking) {
    if (!player || !basePosition || !gameState)
        return basePosition;
    const PITCH_WIDTH = GAME_CONFIG.PITCH_WIDTH;
    const PITCH_HEIGHT = GAME_CONFIG.PITCH_HEIGHT;
    const setPieceType = (gameState.setPiece?.type || gameState.status || '').toUpperCase();
    const ownGoalX = getAttackingGoalX(!player.isHome, gameState.currentHalf);
    const opponentGoalX = getAttackingGoalX(player.isHome, gameState.currentHalf);
    const direction = Math.sign(opponentGoalX - 400);
    // Goal kicks and kickoffs need to respect the bespoke restart layout
    if (setPieceType === 'GOAL_KICK' || setPieceType === 'KICK_OFF') {
        return {
            ...basePosition,
            x: Math.max(10, Math.min(PITCH_WIDTH - 10, basePosition.x)),
            y: Math.max(10, Math.min(PITCH_HEIGHT - 10, basePosition.y))
        };
    }
    // Formation discipline zones
    const DEFENSIVE_ZONE_X = ownGoalX + direction * 150;
    const MIDFIELD_ZONE_X = PITCH_WIDTH / 2;
    const ATTACKING_ZONE_X = opponentGoalX - direction * 150;
    let adjustedX = basePosition.x;
    const role = player.role || 'UNKNOWN';
    // Apply formation discipline based on role and attacking/defending state
    if (role.includes('CB') || role.includes('GK')) {
        // Defenders: Stay back unless it's an attacking set piece in opponent's half
        if (!isAttacking || Math.abs(basePosition.x - ownGoalX) < PITCH_WIDTH / 3) {
            if (direction > 0) {
                adjustedX = Math.min(adjustedX, DEFENSIVE_ZONE_X);
            }
            else {
                adjustedX = Math.max(adjustedX, DEFENSIVE_ZONE_X);
            }
        }
    }
    else if (role.includes('FB') || role.includes('WB') || role.includes('CDM')) {
        // Full backs and defensive mids: Moderate discipline
        if (!isAttacking) {
            if (direction > 0) {
                adjustedX = Math.min(adjustedX, DEFENSIVE_ZONE_X + 50);
            }
            else {
                adjustedX = Math.max(adjustedX, DEFENSIVE_ZONE_X - 50);
            }
        }
    }
    else if (role.includes('ST') || role.includes('CF')) {
        // Strikers: Stay forward unless defending deep
        if (isAttacking) {
            if (direction > 0) {
                adjustedX = Math.max(adjustedX, ATTACKING_ZONE_X);
            }
            else {
                adjustedX = Math.min(adjustedX, ATTACKING_ZONE_X);
            }
        }
    }
    else if (role.includes('CAM') || role.includes('AM')) {
        // Attacking mids: Push forward when attacking
        if (isAttacking) {
            if (direction > 0) {
                adjustedX = Math.max(adjustedX, MIDFIELD_ZONE_X + 30);
            }
            else {
                adjustedX = Math.min(adjustedX, MIDFIELD_ZONE_X - 30);
            }
        }
    }
    // Ensure position stays within pitch bounds
    adjustedX = Math.max(10, Math.min(PITCH_WIDTH - 10, adjustedX));
    return {
        ...basePosition,
        x: adjustedX
    };
}
/**
 * Check and adjust for offside position
 * Attacking player cannot be ahead of last defender (excluding goalkeeper)
 */
export function checkAndAdjustOffsidePosition(position, _player, opponentGoalX, opponents, _gameState) {
    if (!position || !opponents || opponents.length === 0)
        return position;
    const PITCH_WIDTH = GAME_CONFIG.PITCH_WIDTH;
    const direction = Math.sign(opponentGoalX - 400);
    // Filter opponent field players (excluding goalkeeper)
    const opponentFieldPlayers = opponents.filter(opp => opp.role !== 'GK');
    if (opponentFieldPlayers.length === 0)
        return position;
    // Find last defender (player closest to goal)
    let lastDefender = null;
    let minDistanceToGoal = Infinity;
    opponentFieldPlayers.forEach(opp => {
        const distToGoal = Math.abs(opp.x - opponentGoalX);
        if (distToGoal < minDistanceToGoal) {
            minDistanceToGoal = distToGoal;
            lastDefender = opp;
        }
    });
    if (!lastDefender)
        return position;
    // Is attacking player ahead of last defender?
    const defender = lastDefender; // Type assertion for TypeScript
    const playerDistToGoal = Math.abs(position.x - opponentGoalX);
    const defenderDistToGoal = Math.abs(defender.x - opponentGoalX);
    // If player is offside, pull position back behind last defender
    if (playerDistToGoal < defenderDistToGoal) {
        const safeOffsetFromOffside = 15;
        position.x = defender.x - direction * safeOffsetFromOffside;
        // Clamp position to pitch bounds
        position.x = Math.max(10, Math.min(position.x, PITCH_WIDTH - 10));
    }
    return position;
}
/**
 * Check and adjust for offside with detailed audit trail for debugging
 */
export const checkAndAdjustOffsidePositionWithAudit = (position, isHome, gameState) => {
    if (!gameState || !position)
        return {
            position: position || { x: 0, y: 0 },
            wasOffside: false,
            wasAdjusted: false,
            originalX: position?.x || 0,
            defensiveLine: 0,
            tolerance: 5,
            error: 'Invalid parameters'
        };
    const defensiveLine = isHome ? gameState.awayDefensiveLine : gameState.homeDefensiveLine;
    const goalX = isHome ? 800 : 0;
    const tolerance = 5;
    const playerDistToGoal = Math.abs(position.x - goalX);
    const isOffside = playerDistToGoal < defensiveLine - tolerance;
    let adjusted = false;
    let originalX = position.x;
    if (isOffside) {
        position.x = goalX + Math.sign(goalX - position.x) * (defensiveLine - tolerance);
        adjusted = true;
    }
    return {
        position: position,
        wasOffside: isOffside,
        wasAdjusted: adjusted,
        originalX: originalX,
        defensiveLine: defensiveLine,
        tolerance: tolerance,
        error: null
    };
};
//# sourceMappingURL=utils.js.map