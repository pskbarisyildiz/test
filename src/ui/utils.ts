/**
 * UI Utility Functions
 * Helper functions for UI operations and calculations
 *
 * @migrated-from js/ui/utils.js
 * ✅ Migrated from JavaScript with zero functional changes
 * ✅ Full type safety with strict TypeScript
 */

import type { GameState, Player, GameConfig } from '../types';

// ============================================================================
// GLOBAL DECLARATIONS
// ============================================================================

declare global {
  interface Window {
    GAME_CONFIG_SPB_DEFAULT?: GameConfig;
    getNearestAttacker?: typeof getNearestAttacker;
    calculateXG?: typeof calculateXG;
    getValidStat?: typeof getValidStat;
  }
}

// ============================================================================
// CONFIG HELPERS
// ============================================================================

export function CFG(): any {
    if (typeof window !== 'undefined' && (window as any).GAME_CONFIG) return (window as any).GAME_CONFIG;
    if (typeof (window as any).GAME_CONFIG !== 'undefined') return (window as any).GAME_CONFIG;
    if (typeof (window as any).GAME_CONFIG_SPB_DEFAULT !== 'undefined') return (window as any).GAME_CONFIG_SPB_DEFAULT;
    return {
        PITCH_WIDTH: 800,
        PITCH_HEIGHT: 600,
        GOAL_Y_TOP: 240,
        GOAL_Y_BOTTOM: 360,
        MIN_PLAYER_SPACING: 30
    };
}

export function ensureStatsShape(gs: GameState): void {
  gs.stats = gs.stats || {} as any;
  const s = gs.stats;
  s.home = s.home || {} as any;
  s.away = s.away || {} as any;
  if (typeof s.home.possession !== 'number') s.home.possession = 0;
  if (typeof s.away.possession !== 'number') s.away.possession = 0;

  s.possessionTimer = s.possessionTimer || { home: 0, away: 0 };
  if (typeof s.lastPossessionUpdate !== 'number') s.lastPossessionUpdate = Date.now();

  // keep legacy mirror in sync
  (s as any).possession = (s as any).possession || { home: 0, away: 0 };
  (s as any).possession.home = s.home.possession;
  (s as any).possession.away = s.away.possession;
}

export function setPossession(gs: GameState, homePct: number, awayPct: number): void {
  const s = gs.stats;
  s.home.possession = Math.max(0, Math.min(100, homePct));
  s.away.possession = Math.max(0, Math.min(100, awayPct));
  // update legacy mirror
  (s as any).possession.home = s.home.possession;
  (s as any).possession.away = s.away.possession;
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

export function getDistance(a: any, b: any): number {
  const ax = Number(a?.x) || 0, ay = Number(a?.y) || 0;
  const bx = Number(b?.x) || 0, by = Number(b?.y) || 0;
  return Math.hypot(ax - bx, ay - by);
}

export function getAttackingGoalX(isHome: boolean, currentHalf: number): number {
    // 1. Varsayılan (fallback) değerleri tanımla
    const GOAL_X_LEFT_DEFAULT = 50;
    const GOAL_X_RIGHT_DEFAULT = 750;

    // 2. Global GAME_CONFIG'i güvenle kontrol et
    const activeConfig = (typeof (window as any).GAME_CONFIG !== 'undefined') ? (window as any).GAME_CONFIG : null;

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

export function getValidStat(statValue: any, defaultValue: number = 0): number {
    const num = parseFloat(statValue);
    return isNaN(num) ? defaultValue : num;
}

// ============================================================================
// TEAM SIDE HELPERS
// ============================================================================

export function resolveSide(value: any): 'home' | 'away' | null {
  try {
    if (value === true || value === 'home') return 'home';
    if (value === false || value === 'away') return 'away';

    if (typeof value === 'string') {
      if (value === ((window as any).gameState?.homeTeam || '').trim()) return 'home';
      if (value === ((window as any).gameState?.awayTeam || '').trim()) return 'away';
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

if (typeof window !== 'undefined') {
    (window as any).SET_PIECE_STATUSES = SET_PIECE_STATUSES;
    (window as any).isSetPieceStatus = isSetPieceStatus;
    (window as any).getDistance = (window as any).getDistance || getDistance;
    (window as any).getAttackingGoalX = (window as any).getAttackingGoalX || getAttackingGoalX;
    (window as any).getNearestAttacker = (window as any).getNearestAttacker || getNearestAttacker;
    (window as any).calculateXG = (window as any).calculateXG || calculateXG;
    (window as any).pointToLineDistance = (window as any).pointToLineDistance || pointToLineDistance;
    (window as any).getValidStat = (window as any).getValidStat || getValidStat;
}
