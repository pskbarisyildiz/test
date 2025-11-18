function CFG() {
    if (typeof window !== 'undefined' && window.GAME_CONFIG) return window.GAME_CONFIG;
    if (typeof GAME_CONFIG !== 'undefined') return GAME_CONFIG;
    if (typeof GAME_CONFIG_SPB_DEFAULT !== 'undefined') return GAME_CONFIG_SPB_DEFAULT;
    return {
        PITCH_WIDTH: 800,
        PITCH_HEIGHT: 600,
        GOAL_Y_TOP: 240,
        GOAL_Y_BOTTOM: 360,
        MIN_PLAYER_SPACING: 30
    };
}

function ensureStatsShape(gs) {
  gs.stats = gs.stats || {};
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

function setPossession(gs, homePct, awayPct) {
  const s = gs.stats;
  s.home.possession = Math.max(0, Math.min(100, homePct));
  s.away.possession = Math.max(0, Math.min(100, awayPct));
  // update legacy mirror
  s.possession.home = s.home.possession;
  s.possession.away = s.away.possession;
}

const SET_PIECE_STATUSES = Object.freeze([
    'GOAL_KICK',
    'CORNER_KICK',
    'THROW_IN',
    'FREE_KICK',
    'PENALTY',
    'KICK_OFF'
]);

function isSetPieceStatus(status) {
    if (!status) return false;
    return SET_PIECE_STATUSES.includes(status);
}

if (typeof window !== 'undefined') {
    window.SET_PIECE_STATUSES = SET_PIECE_STATUSES;
    window.isSetPieceStatus = isSetPieceStatus;
window.getDistance = window.getDistance || getDistance;
  window.getAttackingGoalX = window.getAttackingGoalX || getAttackingGoalX;
  window.getNearestAttacker = window.getNearestAttacker || getNearestAttacker;
  window.calculateXG = window.calculateXG || calculateXG;
  window.pointToLineDistance = window.pointToLineDistance || pointToLineDistance;
  window.getValidStat = window.getValidStat || getValidStat;
}

function getDistance(a, b) {
  const ax = Number(a?.x) || 0, ay = Number(a?.y) || 0;
  const bx = Number(b?.x) || 0, by = Number(b?.y) || 0;
  return Math.hypot(ax - bx, ay - by);
}
// Note: window.getDistance is conditionally assigned above (line 57) to avoid overriding existing implementations

function getAttackingGoalX(isHome, currentHalf) {
    // 1. Varsayılan (fallback) değerleri tanımla
    const GOAL_X_LEFT_DEFAULT = 50;
    const GOAL_X_RIGHT_DEFAULT = 750;

    // 2. Global GAME_CONFIG'i güvenle kontrol et
    const activeConfig = (typeof GAME_CONFIG !== 'undefined') ? GAME_CONFIG : null;

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
function getNearestAttacker(x, y, allPlayers, attackingTeamIsHome) {
    const attackers = allPlayers.filter(p => 
        p.isHome === attackingTeamIsHome && 
        p.role !== 'GK'
    );
    
    let nearest = null;
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
function calculateXG(shooter, goalX, goalY, opponents) {
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
    
    const fatiguePenalty = shooter.stamina < 40 ? 0.95 : 1.0;
    
    let xG = (distanceQuality * 0.35 + angleQuality * 0.30 + shooterAbility * 0.35) * pressureMultiplier * movementPenalty * fatiguePenalty;
    
    xG = Math.max(0.03, Math.min(0.92, xG));
    
    return xG;
}

function pointToLineDistance(point, lineStart, lineEnd) {
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
function getValidStat(statValue, defaultValue = 0) {
    const num = parseFloat(statValue);
    return isNaN(num) ? defaultValue : num;
}

function resolveSide(value) {
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

function invertSide(side) {
  if (side === 'home') return 'away';
  if (side === 'away') return 'home';
  return null;
}
