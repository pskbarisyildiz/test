class TacticalContext {
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
            if (this.isVeryLateGame) return 'DESPERATE';
            if (this.isLateGame) return 'HIGH';
            return 'MODERATE';
        }
        
        if (effectiveDiff > 0) { // Leading
            if (this.isLateGame) return 'CONSERVATIVE';
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
class PositionManager {
    constructor() {
        this.occupiedPositions = [];
        this.minDistance = activeConfig.MIN_PLAYER_SPACING || 30;
        this.priorityZones = new Map(); // Track high-priority areas
    }

    reset() {
        this.occupiedPositions = [];
        this.priorityZones.clear();
    }

    markPriorityZone(x, y, radius = 40) {
        this.priorityZones.set(`${Math.round(x)},${Math.round(y)}`, { x, y, radius });
    }

    isPositionOccupied(x, y, allowOverlap = false) {
        if (allowOverlap) return false;
        
        return this.occupiedPositions.some(pos => {
            const dist = window.getDistance(pos, {x, y});
            return dist < this.minDistance;
        });
    }

    findValidPosition(idealPos, maxAttempts = 10, allowPriorityOverlap = false) {
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
const __warnHistory = new Map();
function warnThrottled(key, ...args) {
    try {
        const now = Date.now();
        const entry = __warnHistory.get(key) || { count: 0, last: 0 };
        if (now - entry.last > 60000) {
            entry.count = 0;
            entry.last = now;
        }
        entry.count += 1;
        __warnHistory.set(key, entry);
        if (entry.count <= 3) {
            console.warn(...args);
            if (entry.count === 3) {
                console.warn(`[SetPiece] Further messages for '${key}' will be suppressed for 60s.`);
            }
        }
    } catch (e) {
        console.warn(...args);
    }
}

function getSafeStat(stats, key, defaultValue = 0) {
    if (stats && typeof stats[key] === 'number' && !isNaN(stats[key])) {
        return stats[key];
    }
    if (stats && typeof stats[key] === 'string') {
        const num = parseFloat(stats[key]);
        if (!isNaN(num)) return num;
    }
    return defaultValue;
}

function getRoleBasedFallbackPosition(role, context = {}) {
    let fallbackX = PITCH_WIDTH / 2;
    let fallbackY = PITCH_HEIGHT / 2;

    if (role && context.player && context.gameState) {
        const activePos = window.getPlayerActivePosition(context.player, context.gameState.currentHalf);
        fallbackX = activePos.x;
        fallbackY = activePos.y;
    }

    fallbackX = Math.max(10, Math.min(PITCH_WIDTH - 10, fallbackX));
    fallbackY = Math.max(10, Math.min(PITCH_HEIGHT - 10, fallbackY));

    return { x: fallbackX, y: fallbackY, movement: 'role_fallback', role: role || 'FALLBACK_ROLE' };
}

function sanitizePosition(pos, context = {}) {
    // DEVELOPMENT MODE: Loud validation of position data
    if (!pos || typeof pos !== 'object') {
        console.error(`❌ sanitizePosition: INVALID POSITION (not an object) for ${context.player?.name || 'unknown player'}`);
        console.error(`   Received:`, pos);
        console.error(`   Context:`, { behavior: context.behavior, role: context.role, movement: context.movement });
        console.error(`   Stack:`, new Error().stack);
        return getRoleBasedFallbackPosition(context.role, context);
    }

    let x = Number(pos.x);
    let y = Number(pos.y);

    if (isNaN(x) || !isFinite(x) || isNaN(y) || !isFinite(y)) {
        console.error(`❌ sanitizePosition: INVALID COORDINATES for ${context.player?.name || 'unknown player'}`);
        console.error(`   Position: {x: ${pos.x} (${typeof pos.x}), y: ${pos.y} (${typeof pos.y})}`);
        console.error(`   After Number(): {x: ${x}, y: ${y}}`);
        console.error(`   Context:`, { behavior: context.behavior, role: context.role, movement: context.movement });
        return getRoleBasedFallbackPosition(context.role, context);
    }

    const minX = 10, minY = 10;
    const maxX = PITCH_WIDTH - 10, maxY = PITCH_HEIGHT - 10;

    // DEVELOPMENT MODE: Warn if clamping is needed (position was out of bounds)
    const wasOutOfBounds = x < minX || x > maxX || y < minY || y > maxY;
    if (wasOutOfBounds) {
        console.warn(`⚠️ sanitizePosition: Position OUT OF BOUNDS for ${context.player?.name || 'unknown player'}, clamping`);
        console.warn(`   Original: (${x.toFixed(1)}, ${y.toFixed(1)}), Bounds: X[${minX}-${maxX}], Y[${minY}-${maxY}]`);
        console.warn(`   Behavior: ${context.behavior}, Movement: ${pos.movement}`);
    }

    x = Math.max(minX, Math.min(maxX, x));
    y = Math.max(minY, Math.min(maxY, y));

    return {
        ...pos,
        x,
        y,
        movement: pos.movement || context.movement || 'standard_position',
        role: pos.role || context.role || 'UNKNOWN_ROLE'
    };
}

function getValidPlayers(playersArray) {
    if (!Array.isArray(playersArray)) return [];
    return playersArray.filter(p => p && typeof p.x === 'number' && typeof p.y === 'number' && isFinite(p.x) && isFinite(p.y));
}

function getSortedLists(teammates, opponents) {
    const validTeammates = getValidPlayers(teammates);
    const validOpponents = getValidPlayers(opponents);

    return {
        teammates: {
            bestKickers: validTeammates.filter(p => p.role !== 'GK').sort((a, b) => 
                getSafeStat(b.stats, 'shooting', 70) - getSafeStat(a.stats, 'shooting', 70)),
            bestHeaders: validTeammates.filter(p => p.role !== 'GK').sort((a, b) => 
                getSafeStat(b.stats, 'heading', 70) - getSafeStat(a.stats, 'heading', 70)),
            fastest: validTeammates.filter(p => p.role !== 'GK').sort((a, b) => 
                getSafeStat(b.stats, 'pace', 70) - getSafeStat(a.stats, 'pace', 70)),
            bestDefenders: validTeammates.filter(p => p.role !== 'GK').sort((a, b) => 
                getSafeStat(b.stats, 'defending', 70) - getSafeStat(a.stats, 'defending', 70))
        },
        opponents: {
            tallest: validOpponents.filter(p => p.role !== 'GK').sort((a, b) => 
                getSafeStat(b.stats, 'heading', 70) - getSafeStat(a.stats, 'heading', 70)),
            mostDangerous: validOpponents.filter(p => p.role !== 'GK').sort((a, b) => 
                getSafeStat(b.stats, 'attacking', 70) - getSafeStat(a.stats, 'attacking', 70))
        }
    };
}

function determineSetPieceTeam(gameState, player) {
    const fallbackTeam = (player && typeof player.isHome === 'boolean') ? (player.isHome ? 'home' : 'away') : 'home';
    if (!gameState || !gameState.setPiece) return fallbackTeam;

    const setPiece = gameState.setPiece;
    // ✅ FIX: Check for undefined/null instead of truthy value
    // This allows setPiece.team = false (away team) to be processed correctly
    if (setPiece.team !== undefined && setPiece.team !== null) {
        return setPiece.team === 'home' || setPiece.team === true ? 'home' : 'away';
    }

    return fallbackTeam;
}

function isPlayerAttacking(player, gameState) {
    if (!player || typeof player.isHome !== 'boolean') return false;
    const setPieceTeam = determineSetPieceTeam(gameState, player);
    const playerTeam = player.isHome ? 'home' : 'away';
    return setPieceTeam === playerTeam;
}

/**
 * Formation-aware positioning helper
 * Ensures players maintain proper positional discipline based on their role
 */
function getFormationAwarePosition(player, basePosition, gameState, isAttacking) {
    if (!player || !basePosition || !gameState) return basePosition;

    const setPieceType = (gameState.setPiece?.type || gameState.status || '').toUpperCase();
    const ownGoalX = window.getAttackingGoalX(!player.isHome, gameState.currentHalf);
    const opponentGoalX = window.getAttackingGoalX(player.isHome, gameState.currentHalf);
    const direction = Math.sign(opponentGoalX - 400);

    // Goal kicks and kickoffs need to respect the bespoke restart layout so players maintain their
    // intended formation shell instead of being pushed upfield by the generic discipline
    // logic. Simply clamp to the pitch and keep the assignment untouched.
    // ✅ FIX: Added KICK_OFF to prevent forward player oscillation
    if (setPieceType === 'GOAL_KICK' || setPieceType === 'KICK_OFF') {
        return {
            ...basePosition,
            x: Math.max(10, Math.min(PITCH_WIDTH - 10, basePosition.x)),
            y: Math.max(10, Math.min(PITCH_HEIGHT - 10, basePosition.y))
        };
    }

    // Formation discipline zones
    const DEFENSIVE_ZONE_X = ownGoalX + direction * 150; // Defenders shouldn't go beyond this
    const MIDFIELD_ZONE_X = PITCH_WIDTH / 2; // Midfielders central position
    const ATTACKING_ZONE_X = opponentGoalX - direction * 150; // Attackers shouldn't drop too deep

    let adjustedX = basePosition.x;
    const role = player.role || 'UNKNOWN';

    // Apply formation discipline based on role and attacking/defending state
    if (role.includes('CB') || role.includes('GK') || role === 'goalkeeper') {
        // Defenders: Stay back unless it's an attacking set piece in opponent's half
        if (!isAttacking || Math.abs(basePosition.x - ownGoalX) < PITCH_WIDTH / 3) {
            // Enforce defensive discipline - don't push too far forward
            if (direction > 0) {
                adjustedX = Math.min(adjustedX, DEFENSIVE_ZONE_X);
            } else {
                adjustedX = Math.max(adjustedX, DEFENSIVE_ZONE_X);
            }
        }
    } else if (role.includes('FB') || role.includes('WB') || role.includes('CDM')) {
        // Full backs and defensive mids: Moderate discipline
        if (!isAttacking) {
            // Keep closer to defensive zone when defending
            if (direction > 0) {
                adjustedX = Math.min(adjustedX, DEFENSIVE_ZONE_X + 50);
            } else {
                adjustedX = Math.max(adjustedX, DEFENSIVE_ZONE_X - 50);
            }
        }
    } else if (role.includes('ST') || role.includes('CF')) {
        // Strikers: Stay forward unless defending deep
        if (isAttacking) {
            // Push into attacking zone
            if (direction > 0) {
                adjustedX = Math.max(adjustedX, ATTACKING_ZONE_X);
            } else {
                adjustedX = Math.min(adjustedX, ATTACKING_ZONE_X);
            }
        }
    } else if (role.includes('CAM') || role.includes('AM')) {
        // Attacking mids: Push forward when attacking
        if (isAttacking) {
            if (direction > 0) {
                adjustedX = Math.max(adjustedX, MIDFIELD_ZONE_X + 30);
            } else {
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
 * Ofsayt pozisyonunu kontrol eder ve düzeltir
 * Hücum oyuncusu son savunma oyuncusunun ilerisinde olamaz (kaleci hariç)
 */
function checkAndAdjustOffsidePosition(position, player, opponentGoalX, opponents, gameState) {
    // Sadece hücum pozisyonlarında ofsayt kontrolü yap
    if (!position || !opponents || opponents.length === 0) return position;

    const direction = Math.sign(opponentGoalX - 400);

    // Rakip takımın kaleci hariç oyuncularını filtrele
    const opponentFieldPlayers = opponents.filter(opp =>
        opp.role !== 'GK' && opp.role !== 'goalkeeper'
    );

    if (opponentFieldPlayers.length === 0) return position;

    // Son savunma oyuncusunu bul (kaleye en yakın oyuncu)
    let lastDefender = null;
    let minDistanceToGoal = Infinity;

    opponentFieldPlayers.forEach(opp => {
        const distToGoal = Math.abs(opp.x - opponentGoalX);
        if (distToGoal < minDistanceToGoal) {
            minDistanceToGoal = distToGoal;
            lastDefender = opp;
        }
    });

    if (!lastDefender) return position;

    // Hücum oyuncusu son savunma oyuncusunun ilerisinde mi?
    const playerDistToGoal = Math.abs(position.x - opponentGoalX);
    const defenderDistToGoal = Math.abs(lastDefender.x - opponentGoalX);

    // Eğer oyuncu ofsaytta ise, pozisyonu son savunma oyuncusunun arkasına çek
    if (playerDistToGoal < defenderDistToGoal) {
        // 15 piksel geriye çek (güvenli mesafe)
        const safeOffsetFromOffside = 15;
        position.x = lastDefender.x - direction * safeOffsetFromOffside;

        // Pozisyonu sahaya sınırla
        position.x = Math.max(10, Math.min(position.x, activeConfig.PITCH_WIDTH - 10));
    }

    return position;
}

/**
 * Check and adjust for offside with detailed audit trail for debugging
 */
const checkAndAdjustOffsidePositionWithAudit = (position, isHome, gameState) => {
    if (!gameState || !position) return {
        position,
        wasOffside: false,
        wasAdjusted: false,
        originalX: position?.x,
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