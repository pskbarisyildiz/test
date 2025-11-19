/**
 * UI Utility Functions
 * Helper functions for UI operations and calculations
 *
 * @migrated-from js/ui/utils.js
 * ✅ Migrated from JavaScript with zero functional changes
 * ✅ Full type safety with strict TypeScript
 */

import type { GameState, Player } from '../types';
import { GAME_CONFIG } from '../config';
import { gameState } from '../globalExports';

// ============================================================================
// CONFIG HELPERS
// ============================================================================

export function CFG(): typeof GAME_CONFIG {
    return GAME_CONFIG;
}

export function ensureStatsShape(gs: GameState): void {
  gs.stats = gs.stats || { home: {}, away: {} };
  const s = gs.stats;
  s.home = s.home || {};
  s.away = s.away || {};
  if (typeof s.home.possession !== 'number') s.home.possession = 0;
  if (typeof s.away.possession !== 'number') s.away.possession = 0;

  s.possessionTimer = s.possessionTimer || { home: 0, away: 0 };
  if (typeof s.lastPossessionUpdate !== 'number') s.lastPossessionUpdate = Date.now();

  // keep legacy mirror in sync
  s.possession = s.possession || { home: 0, away: 0 };
  s.possession.home = s.home.possession;
  s.possession.away = s.away.possession;
}

export function setPossession(gs: GameState, homePct: number, awayPct: number): void {
  const s = gs.stats;
  s.home.possession = Math.max(0, Math.min(100, homePct));
  s.away.possession = Math.max(0, Math.min(100, awayPct));
  // update legacy mirror
  if (s.possession) {
    s.possession.home = s.home.possession;
    s.possession.away = s.away.possession;
  }
}

// ============================================================================
// SET PIECE HELPERS
// ============================================================================

export const SET_PIECE_STATUSES = Object.freeze([
    'GOAL_KICK',
    'CORNER_KICK',
    'THROW_IN',
    'FREE_KICK',
    'PENALTY',
    'KICK_OFF'
]);

export function isSetPieceStatus(status: string | undefined | null): boolean {
    if (!status) return false;
    return SET_PIECE_STATUSES.includes(status);
}

// ============================================================================
// GEOMETRY AND CALCULATION HELPERS
// ============================================================================

export function getDistance(a: { x?: number; y?: number } | null | undefined, b: { x?: number; y?: number } | null | undefined): number {
  const ax = Number(a?.x) || 0, ay = Number(a?.y) || 0;
  const bx = Number(b?.x) || 0, by = Number(b?.y) || 0;
  return Math.hypot(ax - bx, ay - by);
}

export function getAttackingGoalX(isHome: boolean, currentHalf: number): number {
    // 1. Varsayılan (fallback) değerleri tanımla
    const GOAL_X_LEFT_DEFAULT = 50;
    const GOAL_X_RIGHT_DEFAULT = 750;

    // 2. Global GAME_CONFIG'i güvenle kontrol et
    const activeConfig = GAME_CONFIG;

    // 3. Değerleri belirle (Global config varsa onu kullan, yoksa varsayılanı kullan)
    const goalLeft = (activeConfig && activeConfig.GOAL_X_LEFT) ? activeConfig.GOAL_X_LEFT : GOAL_X_LEFT_DEFAULT;
    const goalRight = (activeConfig && activeConfig.GOAL_X_RIGHT) ? activeConfig.GOAL_X_RIGHT : GOAL_X_RIGHT_DEFAULT;

    // 4. Düzeltilmiş değerleri kullanarak mantığı çalıştır
    if (currentHalf === 1) {
        return isHome ? goalRight : goalLeft; // örn: 750 : 50
    } else {
        return isHome ? goalLeft : goalRight; // örn: 50 : 750
    }
}

export function getNearestAttacker(x: number, y: number, allPlayers: Player[], attackingTeamIsHome: boolean): Player | null {
    const attackers = allPlayers.filter(p =>
        p.isHome === attackingTeamIsHome &&
        p.role !== 'GK'
    );

    let nearest: Player | null = null;
    let minDist = Infinity;

    attackers.forEach(player => {
        const dist = Math.sqrt((player.x - x) ** 2 + (player.y - y) ** 2);
        if (dist < minDist) {
            minDist = dist;
            nearest = player;
        }
    });

    return nearest;
}

export function calculateXG(shooter: Player, goalX: number, goalY: number, opponents: Player[]): number {
    const distToGoal = Math.sqrt(Math.pow(shooter.x - goalX, 2) + Math.pow(shooter.y - goalY, 2));
    const angleToGoalCenter = Math.abs(shooter.y - 300);

    const maxAngle = 150;
    const angleQuality = Math.max(0, 1 - (angleToGoalCenter / maxAngle));

    const normalizedDistance = Math.min(distToGoal / 400, 1);
    const distanceQuality = Math.pow(1 - normalizedDistance, 1.5);

    const nearbyDefenders = opponents.filter(opp => getDistance(shooter, opp) < 30);
    const pressureMultiplier = Math.max(0.4, 1 - (nearbyDefenders.length * 0.18));

    const shooterAbility = 0.2 + (shooter.shooting / 100) * 0.8;

    const speed = Math.sqrt(shooter.vx * shooter.vx + shooter.vy * shooter.vy);
    const movementPenalty = speed > 100 ? 0.9 : 1.0;

    const fatiguePenalty = (shooter as any).stamina < 40 ? 0.95 : 1.0;

    let xG = (distanceQuality * 0.35 + angleQuality * 0.30 + shooterAbility * 0.35) * pressureMultiplier * movementPenalty * fatiguePenalty;

    xG = Math.max(0.03, Math.min(0.92, xG));

    return xG;
}

export function pointToLineDistance(point: { x: number; y: number }, lineStart: { x: number; y: number }, lineEnd: { x: number; y: number }): number {
    const A = point.x - lineStart.x;
    const B = point.y - lineStart.y;
    const C = lineEnd.x - lineStart.x;
    const D = lineEnd.y - lineStart.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
        xx = lineStart.x;
        yy = lineStart.y;
    } else if (param > 1) {
        xx = lineEnd.x;
        yy = lineEnd.y;
    } else {
        xx = lineStart.x + param * C;
        yy = lineStart.y + param * D;
    }

    const dx = point.x - xx;
    const dy = point.y - yy;
    return Math.sqrt(dx * dx + dy * dy);
}

export function getValidStat(statValue: unknown, defaultValue: number = 0): number {
    const num = parseFloat(statValue as string);
    return isNaN(num) ? defaultValue : num;
}

// ============================================================================
// TEAM SIDE HELPERS
// ============================================================================

export function resolveSide(value: unknown): 'home' | 'away' | null {
  try {
    if (value === true || value === 'home') return 'home';
    if (value === false || value === 'away') return 'away';

    if (typeof value === 'string') {
      if (value === (gameState?.homeTeam || '').trim()) return 'home';
      if (value === (gameState?.awayTeam || '').trim()) return 'away';
    }

    if (value && typeof value === 'object') {
      if ('isHome' in value) return value.isHome ? 'home' : 'away';
      // Prevent infinite recursion by checking if value.team/side is different from value
      if ('team' in value && value.team !== value) return resolveSide(value.team);
      if ('side' in value && value.side !== value) return resolveSide(value.side);
    }
  } catch (error) {
    console.error('[resolveSide] Error resolving side:', error, 'Input value:', value);
  }

  return null;
}

export function invertSide(side: 'home' | 'away' | string): 'home' | 'away' | null {
  if (side === 'home') return 'away';
  if (side === 'away') return 'home';
  return null;
}

// ============================================================================
// BROWSER EXPORTS
// ============================================================================

// Functions are now exported via ES6 modules - no window exports needed
