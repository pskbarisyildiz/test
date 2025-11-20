function initIfUndef(obj, key, value) {
    if (obj[key] === undefined) obj[key] = value;
}

initIfUndef(gameState, 'stats', {});
const s = gameState.stats;

// Canonical containers
if (!s.home || typeof s.home !== 'object') s.home = {};
if (!s.away || typeof s.away !== 'object') s.away = {};

if (typeof s.home.possession !== 'number') s.home.possession = 0;
if (typeof s.away.possession !== 'number') s.away.possession = 0;

if (typeof s.home.passesCompleted !== 'number') s.home.passesCompleted = 0;
if (typeof s.home.passesAttempted !== 'number') s.home.passesAttempted = 0;
if (typeof s.away.passesCompleted !== 'number') s.away.passesCompleted = 0;
if (typeof s.away.passesAttempted !== 'number') s.away.passesAttempted = 0;

// ============================================================================
// ✅ FIX #4: POSSESSION TRACKING - SINGLE CANONICAL REPRESENTATION
// ============================================================================
// CANONICAL: gameState.stats.home.possession and gameState.stats.away.possession
// Use ONLY these two fields, never use s.possession.home/away

// Accumulator - Tracks time for possession calculation
if (!s.possessionTimer || typeof s.possessionTimer !== 'object') {
  s.possessionTimer = { home: 0, away: 0 };
}
if (typeof s.lastPossessionUpdate !== 'number') s.lastPossessionUpdate = Date.now();

// ✅ NO LEGACY MIRROR - only canonical representation
// DO NOT create s.possession - it's now completely removed
// Any code reading s.possession.home should use s.home.possession instead

// ============================================================================
// ✅ FIX #15: FORMATION POSITIONING ENFORCEMENT
// ============================================================================
// Formation structures define ideal player positions for each formation type
const FORMATION_STRUCTURES = {
    '4-3-3': {
        'GK': 1, 'CB': 2, 'RB': 1, 'LB': 1, 'CDM': 1, 'CM': 1, 'CAM': 1, 'RW': 1, 'LW': 1, 'ST': 1
    },
    '4-2-3-1': {
        'GK': 1, 'CB': 2, 'RB': 1, 'LB': 1, 'CDM': 2, 'CM': 1, 'CAM': 1, 'RW': 1, 'LW': 1, 'ST': 1
    },
    '3-5-2': {
        'GK': 1, 'CB': 3, 'RB': 1, 'LB': 1, 'CM': 1, 'CAM': 1, 'RM': 1, 'LM': 1, 'ST': 2
    },
    '5-4-1': {
        'GK': 1, 'CB': 3, 'RB': 1, 'LB': 1, 'CM': 2, 'CAM': 1, 'RW': 1, 'LW': 1, 'ST': 1
    }
};

/**
 * Get ideal position for a player based on formation
 */
function getFormationPosition(player, team, formation, gameState) {
    const formationSpec = FORMATION_STRUCTURES[formation] || FORMATION_STRUCTURES['4-3-3'];
    const sameRolePlayers = (team === 'home' ? gameState.homePlayers : gameState.awayPlayers)
        .filter(p => p.role === player.role);
    const roleIndex = sameRolePlayers.findIndex(p => p.id === player.id);

    // Formation zones (Y spacing for players with same role)
    const zones = {
        'GK': { x: team === 'home' ? 50 : 750, y: 300 },
        'CB': { x: team === 'home' ? 150 : 650, y: roleIndex === 0 ? 180 : roleIndex === 1 ? 300 : 420 },
        'RB': { x: team === 'home' ? 150 : 650, y: 100 },
        'LB': { x: team === 'home' ? 150 : 650, y: 500 },
        'CDM': { x: team === 'home' ? 300 : 500, y: 300 },
        'CM': { x: team === 'home' ? 350 : 450, y: roleIndex === 0 ? 200 : 400 },
        'CAM': { x: team === 'home' ? 450 : 350, y: 300 },
        'RW': { x: team === 'home' ? 500 : 300, y: 100 },
        'LW': { x: team === 'home' ? 500 : 300, y: 500 },
        'RM': { x: team === 'home' ? 500 : 300, y: 100 },
        'LM': { x: team === 'home' ? 500 : 300, y: 500 },
        'ST': { x: team === 'home' ? 650 : 150, y: roleIndex === 0 ? 250 : 350 }
    };

    return zones[player.role] || { x: 400, y: 300 };
}

/**
 * Apply formation constraint with smooth blending
 */
function applyFormationConstraint(player, team, formation, gameState) {
    if (!formation || !FORMATION_STRUCTURES[formation]) return player;

    const targetPos = getFormationPosition(player, team, formation, gameState);
    const formationAdhesion = 0.08;  // How much to follow formation (0-1)

    // Initialize formation position tracking
    if (!player.formationX) player.formationX = player.x;
    if (!player.formationY) player.formationY = player.y;

    // Smoothly blend current position toward formation target
    player.formationX += (targetPos.x - player.formationX) * formationAdhesion;
    player.formationY += (targetPos.y - player.formationY) * formationAdhesion;

    return player;
}

initIfUndef(gameState, 'status', 'upload');
initIfUndef(gameState, 'homeTeam', '');
initIfUndef(gameState, 'awayTeam', '');
initIfUndef(gameState, 'setPiece', null);
initIfUndef(gameState, 'ballPosition', { x: 400, y: 300 });
initIfUndef(gameState, 'ballVelocity', { x: 0, y: 0 });
initIfUndef(gameState, 'ballHeight', 0);
initIfUndef(gameState, 'ballTrajectory', null);
initIfUndef(gameState, 'ballHolder', null);
initIfUndef(gameState, 'lastTouchedBy', null);
initIfUndef(gameState, 'commentary', []);
initIfUndef(gameState, 'timeElapsed', 0);
initIfUndef(gameState, 'teams', []);
initIfUndef(gameState, 'players', []);
initIfUndef(gameState, 'teamJerseys', {});
initIfUndef(gameState, 'teamCoaches', {});
initIfUndef(gameState, 'teamLogos', {});
initIfUndef(gameState, 'homeJerseyColor', '#ef4444');
initIfUndef(gameState, 'awayJerseyColor', '#3b82f6');
initIfUndef(gameState, 'currentHalf', 1);
initIfUndef(gameState, 'homeScore', 0);
initIfUndef(gameState, 'awayScore', 0);
initIfUndef(gameState, 'homePlayers', []);
initIfUndef(gameState, 'awayPlayers', []);
initIfUndef(gameState, 'homeFormation', '4-3-3');
initIfUndef(gameState, 'awayFormation', '4-3-3');
initIfUndef(gameState, 'homeTactic', 'balanced');
initIfUndef(gameState, 'awayTactic', 'balanced');
initIfUndef(gameState, 'homeTeamState', 'BALANCED');
initIfUndef(gameState, 'awayTeamState', 'BALANCED');
initIfUndef(gameState, 'lastEventTime', 0);
initIfUndef(gameState, 'particles', []);
initIfUndef(gameState, 'cameraShake', 0);
initIfUndef(gameState, 'ballChasers', new Set());
initIfUndef(gameState, 'totalPasses', 0);
initIfUndef(gameState, 'totalShots', 0);
initIfUndef(gameState, 'shotInProgress', false);
initIfUndef(gameState, 'shooter', null);
initIfUndef(gameState, 'homeDefensiveLine', 200);
initIfUndef(gameState, 'awayDefensiveLine', 600);
initIfUndef(gameState, 'lastPossessionChange', 0);
initIfUndef(gameState, 'currentShotXG', null);
initIfUndef(gameState, 'currentPassReceiver', null);
initIfUndef(gameState, 'fouls', 0);
initIfUndef(gameState, 'yellowCards', []);
initIfUndef(gameState, 'redCards', []);
initIfUndef(gameState, 'lastGoalScorer', null);
initIfUndef(gameState, 'goalEvents', []);
initIfUndef(gameState, 'cardEvents', []);
initIfUndef(gameState, 'lastTeamStateUpdate', Date.now());
initIfUndef(gameState, 'possessionChanges', 0);
initIfUndef(gameState, 'isVertical', false);
initIfUndef(gameState, 'canvases', { background: null, game: null, ui: null });
initIfUndef(gameState, 'contexts', { background: null, game: null, ui: null });
initIfUndef(gameState, 'backgroundDrawn', false);
initIfUndef(gameState, 'gameUIDisplayed', false);
initIfUndef(gameState, 'offscreenPitch', null);
initIfUndef(gameState, 'stats', {
  home: { possession: 50, possessionTime: 0 },
  away: { possession: 50, possessionTime: 0 }
});

function initializePlayers(home, away, homeFormation, awayFormation) {
    const homePositions = getFormationPositions(true, false, homeFormation);
    const awayPositions = getFormationPositions(false, false, awayFormation);

    const initPlayer = (player, pos, isHome, index) => ({
        ...player,
        id: `${isHome ? 'home' : 'away'}_${index}`,
        x: pos.x,
        y: pos.y,
        homeX: pos.x,
        homeY: pos.y,
        targetX: pos.x,
        targetY: pos.y,
        vx: 0,
        vy: 0,
        isHome,
        role: pos.role.toUpperCase(),
        lastDecisionTime: 0,
        hasBallControl: false,
        ballReceivedTime: null,
        speedBoost: 1.0,
        stamina: 100,
        distanceCovered: 0,
        targetLocked: false,
        targetLockTime: 0,
        facingAngle: 0,
        scanState: null,
    });
    return {
        home: home.map((p, i) => initPlayer(p, homePositions[i], true, i)),
        away: away.map((p, i) => initPlayer(p, awayPositions[i], false, i))
    };
}


function selectBestFormation(teamPlayers) {
    const positionCounts = { defenders: 0, midfielders: 0, attackers: 0, keepers: 0 };
    const positionQuality = { defenders: 0, midfielders: 0, attackers: 0 };

    teamPlayers.forEach(p => {
        const pos = p.position.toLowerCase();
        const quality = p.rating * 10 + (p.pace + p.shooting + p.passing + p.dribbling + p.defending) / 5;
        
        if (pos.includes('keeper') || pos.includes('gk')) {
            positionCounts.keepers++;
        } else if (pos.includes('back') || pos.includes('cb') || pos.includes('rb') || pos.includes('lb')) {
            positionCounts.defenders++;
            positionQuality.defenders += quality;
        } else if (pos.includes('mid') || pos.includes('cdm') || pos.includes('cm') || pos.includes('cam')) {
            positionCounts.midfielders++;
            positionQuality.midfielders += quality;
        } else if (pos.includes('wing') || pos.includes('striker') || pos.includes('forward') || pos.includes('st')) {
            positionCounts.attackers++;
            positionQuality.attackers += quality;
        }
    });

    // Calculate average quality per position
    const avgDefQuality = positionCounts.defenders > 0 ? positionQuality.defenders / positionCounts.defenders : 0;
    const avgMidQuality = positionCounts.midfielders > 0 ? positionQuality.midfielders / positionCounts.midfielders : 0;
    const avgAttQuality = positionCounts.attackers > 0 ? positionQuality.attackers / positionCounts.attackers : 0;

    const formationScores = {
        '4-3-3': calculateFormationScore(positionCounts, [4, 3, 3], [avgDefQuality, avgMidQuality, avgAttQuality]),
        '4-4-2': calculateFormationScore(positionCounts, [4, 4, 2], [avgDefQuality, avgMidQuality, avgAttQuality]),
        '4-4-1-1': calculateFormationScore(positionCounts, [4, 5, 1], [avgDefQuality, avgMidQuality, avgAttQuality]),
        '4-4-2-diamond': calculateFormationScore(positionCounts, [4, 4, 2], [avgDefQuality, avgMidQuality, avgAttQuality]),
        '4-3-1-2': calculateFormationScore(positionCounts, [4, 4, 2], [avgDefQuality, avgMidQuality, avgAttQuality]),
        '4-3-2-1': calculateFormationScore(positionCounts, [4, 5, 1], [avgDefQuality, avgMidQuality, avgAttQuality])
    };

    let bestFormation = '4-3-3';
    let bestScore = 0;
    
    for (const [formation, score] of Object.entries(formationScores)) {
        if (score > bestScore) {
            bestScore = score;
            bestFormation = formation;
        }
    }

    console.log(` Best formation for team: ${bestFormation} (score: ${bestScore.toFixed(2)})`);
    return bestFormation;
}
function calculateFormationScore(positionCounts, required, avgQualities) {
    const [reqDef, reqMid, reqAtt] = required;
    const [qualDef, qualMid, qualAtt] = avgQualities;
    const availabilityScore = 
        ((Math.min(positionCounts.defenders / reqDef, 1) +
        Math.min(positionCounts.midfielders / reqMid, 1) +
        Math.min(positionCounts.attackers / reqAtt, 1)) / 3) * 100;
    const qualityScore = (qualDef + qualMid + qualAtt) / 6; 
    return availabilityScore * 0.5 + qualityScore * 0.5;
}
function selectBestTactic(teamPlayers) {
    if (!teamPlayers || teamPlayers.length === 0) return 'balanced';
    
    // Calculate team averages
    const avgPace = teamPlayers.reduce((sum, p) => sum + p.pace, 0) / teamPlayers.length;
    const avgPassing = teamPlayers.reduce((sum, p) => sum + p.passing, 0) / teamPlayers.length;
 const avgDribbling = teamPlayers.reduce((sum, p) => sum + p.dribbling, 0) / teamPlayers.length;
    const avgDefending = teamPlayers.reduce((sum, p) => sum + p.defending, 0) / teamPlayers.length;
    const avgPhysicality = teamPlayers.reduce((sum, p) => sum + p.physicality, 0) / teamPlayers.length;
    const avgShooting = teamPlayers.reduce((sum, p) => sum + p.shooting, 0) / teamPlayers.length;
    const avgRating = teamPlayers.reduce((sum, p) => sum + p.rating, 0) / teamPlayers.length;

    const tacticScores = {
        balanced: 50, // Baseline
        high_press: (avgPhysicality * 0.4 + avgDefending * 0.3 + avgPace * 0.3) * (avgRating / 10),
        possession: (avgPassing * 0.5 + avgDribbling * 0.3 + avgDefending * 0.2) * (avgRating / 10),
        counter_attack: (avgPace * 0.5 + avgShooting * 0.3 + avgDefending * 0.2) * (avgRating / 10),
        park_the_bus: (avgDefending * 0.6 + avgPhysicality * 0.4) * (avgRating / 10),
        total_football: (avgPassing * 0.3 + avgPace * 0.3 + avgDefending * 0.2 + avgShooting * 0.2) * (avgRating / 10)
    };

    // Find best tactic
    let bestTactic = 'balanced';
    let bestScore = tacticScores.balanced;
    
    for (const [tactic, score] of Object.entries(tacticScores)) {
        if (score > bestScore) {
            bestScore = score;
            bestTactic = tactic;
        }
    }

    console.log(` Best tactic for team: ${bestTactic} (score: ${bestScore.toFixed(2)})`);
    return bestTactic;
}

function selectBestTeam(teamName) {
    const teamPlayers = gameState.players.filter(p => p.team === teamName);
    const formation = selectBestFormation(teamPlayers);
    
    const selected = [];
    const positions = getFormationPositions(true, false, formation);

    // Select best goalkeeper first
    const gkPosition = positions.find(pos => pos.role === 'GK');
    if (gkPosition) {
        const goalkeepers = teamPlayers
            .filter(p => {
                const pos = p.position.toLowerCase();
                return pos.includes('keeper') || pos.includes('gk');
            })
            .sort((a, b) => {
                const scoreA = (a.goalkeeping * 0.7 + a.rating * 30);
                const scoreB = (b.goalkeeping * 0.7 + b.rating * 30);
                return scoreB - scoreA;
            });
        
        if (goalkeepers.length > 0) {
            selected.push(goalkeepers[0]);
        }
    }

    function getPositionFitness(player, targetRole) {
        const playerPos = player.position.trim();
        let fitnessScore = player.rating;
        
        const positionMatches = {
            'RB': ['Right-back', 'Right Back', 'Right Wing-Back', 'Wing-Back'],
            'CB': ['Center-back', 'Centre-back', 'Defender'],
            'LB': ['Left-back', 'Left Back', 'Left Wing-Back'],
            'CDM': ['Defensive Midfielder', 'Midfielder'],
            'CM': ['Midfielder', 'Central Midfielder'],
            'RM': ['Right Midfielder', 'Midfielder'],
            'LM': ['Left Midfielder', 'Midfielder'],
            'CAM': ['Attacking Midfielder', 'Midfielder'],
            'RW': ['Right Winger', 'Winger', 'Forward'],
            'LW': ['Left Winger', 'Winger', 'Forward'],
            'ST': ['Striker', 'Forward', 'Center Forward']
        };
        
        const exactMatches = positionMatches[targetRole] || [targetRole];
        if (exactMatches.some(pos => playerPos.includes(pos) || pos.includes(playerPos))) {
            fitnessScore += 2.0;
        }
        
        if (targetRole === 'CB') {
            fitnessScore += (player.defending / 100) * 1.0 + (player.physicality / 100) * 0.5;
        } else if (targetRole === 'RB' || targetRole === 'LB') {
            fitnessScore += (player.defending / 100) * 0.7 + (player.pace / 100) * 0.5;
        } else if (targetRole === 'CDM') {
            fitnessScore += (player.defending / 100) * 0.6 + (player.passing / 100) * 0.4;
        } else if (targetRole === 'CM') {
            fitnessScore += (player.passing / 100) * 0.6 + (player.dribbling / 100) * 0.3;
        } else if (targetRole === 'CAM') {
            fitnessScore += (player.passing / 100) * 0.5 + (player.shooting / 100) * 0.4;
        } else if (targetRole === 'RW' || targetRole === 'LW' || targetRole === 'RM' || targetRole === 'LM') {
            fitnessScore += (player.pace / 100) * 0.5 + (player.dribbling / 100) * 0.4;
        } else if (targetRole === 'ST') {
            fitnessScore += (player.shooting / 100) * 0.8 + (player.pace / 100) * 0.3;
        }
        
        return fitnessScore;
    }

    positions.forEach(pos => {
        if (pos.role === 'GK') return;
        
        const candidates = teamPlayers
            .filter(p => !selected.includes(p) && p.position.toLowerCase() !== 'coach')
            .map(p => ({
                player: p,
                fitness: getPositionFitness(p, pos.role)
            }))
            .sort((a, b) => b.fitness - a.fitness);

        if (candidates.length > 0) {
            selected.push(candidates[0].player);
        }
    });

    return { players: selected.slice(0, 11), formation };
}

function getFormationPositions(isHome, isSecondHalf, formationName) {


    const GAME_CONFIG_DEFAULT = { PITCH_WIDTH: 800, PITCH_HEIGHT: 600 };
    const activeConfig = (typeof GAME_CONFIG !== 'undefined') ? GAME_CONFIG : GAME_CONFIG_DEFAULT;

    const formation = FORMATIONS[formationName] || FORMATIONS['4-3-3'];
    if (!formation) {
        console.error(`Formation not found: ${formationName}. Defaulting to 4-3-3.`);
        formation = FORMATIONS['4-3-3'];
    }

    const shouldFlip = (isHome && isSecondHalf) || (!isHome && !isSecondHalf);

    return formation.map(pos => ({
        x: shouldFlip ? (1 - pos.x) * activeConfig.PITCH_WIDTH : pos.x * activeConfig.PITCH_WIDTH,
        y: pos.y * activeConfig.PITCH_HEIGHT,
        role: pos.role
    }));
}
