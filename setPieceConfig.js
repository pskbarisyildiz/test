/**
 * Intelligent routine selection based on team tactics
 */
function configureSetPieceRoutines(gameState) {
    if (!gameState) { console.error("Config SetPiece: gameState is missing!"); return; }
    if (!gameState.setPiece) {
        gameState.setPiece = {}; // Boşsa oluştur
    }

    // Takım ve taktik bilgilerini güvenli bir şekilde al
    const takingTeam = gameState.setPiece.team; // true for home, false for away
    const homeTacticKey = gameState.homeTactic || 'balanced';
    const awayTacticKey = gameState.awayTactic || 'balanced';
    const tactic = takingTeam === true ?
        (TACTICS[homeTacticKey] || TACTICS['balanced']) :
        (TACTICS[awayTacticKey] || TACTICS['balanced']);
    const opposingTactic = takingTeam === true ?
        (TACTICS[awayTacticKey] || TACTICS['balanced']) :
        (TACTICS[homeTacticKey] || TACTICS['balanced']);


    // Corner kick routine selection
    if (gameState.status === 'CORNER_KICK') {
        // Varsayılan ağırlıklar
        const routineWeights = { standard: 40, inswinger: 25, outswinger: 25, short: 10 };

        if (tactic) {
            // Yüksek topa sahip olma taktiği kısa kornerleri tercih eder
            if (tactic.possessionPriority > 0.7) {
                routineWeights.short = 25;
                routineWeights.standard = 30; // Standardı biraz azalt
            }
            // Agresif taktikler direkt vuruşları tercih eder (örn. inswinger/outswinger)
            // Bu kısım yorumda kalmış, belki de aktif edilmeli?
            /*
            if (tactic.attackPressure > 0.7) {
                routineWeights.inswinger = 35;
                routineWeights.outswinger = 30;
            }
            */
        }

        gameState.setPiece.routine = selectWeightedRoutine(routineWeights); // 'cornerRoutine' yerine 'routine' kullanılıyor olabilir

        // Defensive system
        if (opposingTactic) {
            // Yüksek defansif organizasyon zonal'ı tercih eder
            gameState.setPiece.defensiveSystem =
                (opposingTactic.compactness > 0.65 || opposingTactic.defensiveLineDepth < 0.4) // Daha defansif göstergeler
                ? 'zonal' : 'man_marking';
        } else {
             gameState.setPiece.defensiveSystem = 'zonal'; // Fallback
        }

    }

    // Goal kick strategy
    if (gameState.status === 'GOAL_KICK') {
        gameState.setPiece.playShort = tactic && tactic.possessionPriority > 0.6;
    }

    // FIXED: Set execution time based on set piece type and danger level
    if (!gameState.setPiece.executionTime || gameState.setPiece.executionTime < Date.now()) {
        let delay = 1000 + Math.random() * 800; // Default: 1.0-1.8 seconds

        // Dangerous free kicks need longer positioning time (professional realism)
        if (gameState.status === 'FREE_KICK' && gameState.setPiece.position) {
            const fkPos = gameState.setPiece.position;
            const takingTeamIsHome = (typeof gameState.setPiece.team === 'boolean')
                ? gameState.setPiece.team
                : (gameState.setPiece.team === 'home');

            // Calculate goal position and distance
            const opponentGoalX = window.getAttackingGoalX
                ? window.getAttackingGoalX(takingTeamIsHome, gameState.currentHalf)
                : (takingTeamIsHome ? 750 : 50);

            const distToGoal = Math.hypot(fkPos.x - opponentGoalX, fkPos.y - 300);
            const angleToGoal = Math.abs(fkPos.y - 300);

            // Dangerous free kick: close to goal (<280px) and good angle (<130px)
            const isDangerous = distToGoal < 280 && angleToGoal < 130;

            if (isDangerous) {
                // Dangerous: 2.5-3.5 seconds for wall/positioning setup
                delay = 2500 + Math.random() * 1000;
            } else {
                // Non-dangerous: 0.5-1.0 seconds (quick play)
                delay = 500 + Math.random() * 500;
            }
        }

        gameState.setPiece.executionTime = Date.now() + delay;
    }

    gameState.setPiece.configured = true; // Konfigürasyon yapıldı olarak işaretle
    //logSetPieceInfo(gameState); // Bilgileri logla
}

/**
 * Select routine based on weighted probabilities
 */
function selectWeightedRoutine(weights) {
    const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
    if (total <= 0) return 'standard'; // Ağırlık yoksa varsayılan
    let random = Math.random() * total;

    for (const [routine, weight] of Object.entries(weights)) {
        random -= weight;
        if (random <= 0) return routine;
    }

    return 'standard'; // Fallback
}

/**
 * Pre-configuration hook (Called before positioning players)
 * This simply ensures ball placement and execution time - positioning is handled by SetPieceBehaviorSystem
 */
function executeSetPiece_PreConfiguration() {
    try {
        const sp = gameState?.setPiece;
        if (!sp || !sp.type || !sp.position) return;

        // Ensure ball is placed correctly
        if (typeof ensureCorrectSetPiecePlacement === "function") {
            ensureCorrectSetPiecePlacement(gameState);
        }

        // Configure tactical routines if needed (for corner kicks, free kicks)
        if (sp.type === 'CORNER_KICK' || sp.type === 'FREE_KICK' || sp.type === 'GOAL_KICK') {
            configureSetPieceRoutines(gameState);
        }

        // Ensure execution time is set
        if (!sp.executionTime || sp.executionTime < Date.now()) {
            sp.executionTime = Date.now() + 1000 + Math.random() * 800;
        }

        // [setpiece-fix] Initialize enforcement system state machine
        if (typeof SetPieceEnforcement !== 'undefined' && SetPieceEnforcement.initializeSetPieceState) {
            SetPieceEnforcement.initializeSetPieceState(gameState);
        }

        // Mark as configured - positioning will be handled by SetPieceBehaviorSystem
        sp.configured = true;

        console.log(`✓ Set piece pre-configured: ${sp.type} at (${Math.round(sp.position.x)}, ${Math.round(sp.position.y)})`);

    } catch (e) {
        console.error('executeSetPiece_PreConfiguration failed:', e);
    }
}