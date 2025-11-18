function resolveBallControl(allPlayers) {
    // DÜZELTME: 'isSetPieceStatus' fonksiyonunun (utils.js) globalde olduğunu varsayıyoruz.
    const isSetPiece = (typeof isSetPieceStatus === 'function')
        ? isSetPieceStatus(gameState.status)
        : ['GOAL_KICK', 'CORNER_KICK', 'THROW_IN', 'FREE_KICK', 'KICK_OFF', 'PENALTY'].includes(gameState.status);

    if (isSetPiece) {
        return; // Duran top kontrolü SetPieceIntegration tarafından yönetilir
    }
    
    if (!gameState.ballPosition || !Array.isArray(allPlayers) || allPlayers.length === 0) {
        return;
    }
    if (gameState.ballTrajectory || (gameState.ballHolder && gameState.ballHolder.hasBallControl)) {
        return;
    }

    const eligiblePlayers = allPlayers.filter(p => !(p.stunnedUntil && Date.now() < p.stunnedUntil));
    if (eligiblePlayers.length === 0) return;

    const BALL_CONTROL_DISTANCE = (typeof PHYSICS !== 'undefined') ? PHYSICS.BALL_CONTROL_DISTANCE : 25;

    const controlCandidates = eligiblePlayers.map(player => {
        const distToBall = getDistance(player, gameState.ballPosition);
        let effectiveControlDistance = BALL_CONTROL_DISTANCE * (player.isChasingBall ? 2.0 : 1.0);
        if (distToBall > effectiveControlDistance) {
            return { player, score: 0, distToBall };
        }
        let score = Math.max(0, 150 - distToBall); 
        score += (player.dribbling / 100) * 20; 
        if (player.isChasingBall) score += 200; 
        return { player, score, distToBall };
    }).filter(item => item.score > 50).sort((a, b) => b.score - a.score);

    if (controlCandidates.length === 0) return;

    let controllingPlayer;

    const ballSpeed = Math.sqrt(gameState.ballVelocity.x**2 + gameState.ballVelocity.y**2);
    if (ballSpeed < 5 && controlCandidates.length > 1 && controlCandidates[0].distToBall < 30 && controlCandidates[1].distToBall < 30) {
        const contender1 = controlCandidates[0].player;
        const contender2 = controlCandidates[1].player;

        const p1_strength = (contender1.physicality * 0.6) + (contender1.pace * 0.2) + (Math.random() * 20);
        const p2_strength = (contender2.physicality * 0.6) + (contender2.pace * 0.2) + (Math.random() * 20);

        if (p1_strength >= p2_strength) {
            controllingPlayer = contender1;
            contender2.stunnedUntil = Date.now() + 250;
        } else {
            controllingPlayer = contender2;
            contender1.stunnedUntil = Date.now() + 250;
        }
    } else {
        controllingPlayer = controlCandidates[0].player;
    }

    if (!controllingPlayer) return;

    gameState.lastTouchedBy = controllingPlayer;
   
    // ==========================================================
    // DÜZELTME (Hata 3): Ofsayt kontrolü, 'playing' durumuna özel
    // ==========================================================
    if (gameState.status === 'playing' && typeof checkOffsidePenalty === 'function') {
        if (checkOffsidePenalty(controllingPlayer)) {
            // awardOffsideFreeKick de main.js'e taşınmış olmalı
            if (typeof awardOffsideFreeKick === 'function') {
                 awardOffsideFreeKick(controllingPlayer);
            } else {
                console.error("awardOffsideFreeKick is not defined!");
            }
            return; // Ofsayt verildi, top kontrolü durduruldu
        }
    }
    // ==========================================================
    // DÜZELTME SONU
    // ==========================================================


    const touchResult = applyFirstTouch(controllingPlayer, null, allPlayers);
    if (touchResult.outcome === 'failed') {
        handleFailedFirstTouch(controllingPlayer, allPlayers);
    } else if (touchResult.outcome === 'poor') {
        handlePoorFirstTouch(controllingPlayer, touchResult);
    } else {
        handleSuccessfulFirstTouch(controllingPlayer, touchResult);
    }
}

function canControlBall(player, ball) {
    // DÜZELTME: PHYSICS global olmalı
    const BALL_CONTROL_DISTANCE = (typeof PHYSICS !== 'undefined') ? PHYSICS.BALL_CONTROL_DISTANCE : 25;
    const dist = getDistance(player, ball);

    // DURAN TOP KURALI: Duran top kullanılmadan ÖNCE sadece kullanıcı topa dokunabilir
    // Goal kick, free kick, corner kick, throw-in sırasında diğer oyuncular topa müdahale edemez
    const isSetPiece = ['GOAL_KICK', 'FREE_KICK', 'CORNER_KICK', 'THROW_IN', 'KICK_OFF', 'PENALTY'].includes(gameState.status);
    if (isSetPiece && gameState.setPiece && !gameState.setPiece.executed) {
        // Sadece kullanıcı (kicker/thrower) ve kaleci topa yaklaşabilir
        const isDesignatedTaker = player.setPieceRole && (
            player.setPieceRole.includes('KICKER') ||
            player.setPieceRole.includes('THROWER') ||
            player.setPieceRole === 'CORNER_KICKER' ||
            player.setPieceRole === 'PRIMARY_KICKER'
        );
        const isGoalkeeper = player.role === 'GK' || player.role === 'goalkeeper';

        if (!isDesignatedTaker && !isGoalkeeper) {
            return false; // Diğer oyuncular duran top kullanılmadan ÖNCE topa dokunamaz
        }
    }

    return dist < BALL_CONTROL_DISTANCE && !gameState.ballTrajectory;
}

function action_attemptTackle(player, ball, allPlayers) {
    const isRestart = (typeof isSetPieceStatus === 'function')
        ? isSetPieceStatus(gameState.status)
        : ['GOAL_KICK', 'CORNER_KICK', 'THROW_IN', 'FREE_KICK'].includes(gameState.status);

    if (isRestart) {
        return false;
    }
    const attacker = gameState.ballHolder;
    if (!attacker) return false;

    // [gk-protection] GOALKEEPER PROTECTION: Cannot tackle goalkeeper
    if (attacker.role === 'GK' || attacker.role === 'goalkeeper') {
        // Use enforcement system if available
        if (typeof SetPieceEnforcement !== 'undefined' && SetPieceEnforcement.protectGoalkeeper) {
            SetPieceEnforcement.protectGoalkeeper(player, attacker, gameState);
        } else {
            // Fallback: Mark nearest teammate instead
            console.log(`🚫 [gk-protection] ${player.name} cannot tackle goalkeeper ${attacker.name}`);
        }
        return false; // Block tackle attempt
    }

    const defenderStat = (player.defending * 0.6) + (player.physicality * 0.4);
    const attackerStat = (attacker.dribbling * 0.6) + (attacker.pace * 0.4);
    const successChance = 0.5 + ((defenderStat - attackerStat) / 120);
    const teamStats = player.isHome ? gameState.stats.home : gameState.stats.away;

    const outcome = Math.random();

    if (outcome < successChance) {
        if (Math.random() < 0.6) {
            gameState.ballHolder = player;
            player.hasBallControl = true;
            player.ballReceivedTime = Date.now();
            gameState.commentary.push({ text: `${Math.floor(gameState.timeElapsed)}' ${player.name} wins the ball!`, type: 'tackle' });
        } else {
            gameState.ballHolder = null;
            gameState.ballTrajectory = null;
            const angle = Math.atan2(attacker.y - player.y, attacker.x - player.x);
            gameState.ballVelocity.x = Math.cos(angle) * 150;
            gameState.ballVelocity.y = Math.sin(angle) * 150;
            gameState.commentary.push({ text: `${Math.floor(gameState.timeElapsed)}' 50/50 challenge! The ball is loose!`, type: 'tackle' });
            assignBallChasers(allPlayers);
        }
        teamStats.tackles++;
    } else {
        player.stunnedUntil = Date.now() + 750;
        attacker.speedBoost = 1.2;

        if (Math.random() < 0.15) {
            // DÜZELTME: Hata 3 (Döngüsel Bağımlılık) çözüldü.
            // handleFoul_V2'nin global 'window' üzerinde olduğu varsayılıyor
            // (core.js tarafından oraya eklenmiş olmalı).
            if (typeof handleFoul_V2 === 'function') {
                handleFoul_V2(player, attacker);
            } else {
                console.error("handleFoul_V2 is not defined!");
            }
        } else {
            gameState.commentary.push({ text: `${Math.floor(gameState.timeElapsed)}' ${attacker.name} skips past ${player.name}!`, type: 'attack' });
        }
    }
    return true;
}

function handleBallInterception(progress) {
    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    const trajectory = gameState.ballTrajectory;
    if (!trajectory) return;

    // DÜZELTME: PHYSICS global olmalı
    const HEADER_HEIGHT_THRESHOLD = (typeof PHYSICS !== 'undefined') ? PHYSICS.HEADER_HEIGHT_THRESHOLD : 0.6;
    const PASS_INTERCEPT_DISTANCE = (typeof PHYSICS !== 'undefined') ? PHYSICS.PASS_INTERCEPT_DISTANCE : 25;

    const isAerial = trajectory.passType === 'aerial';
    const isHeaderOpportunity = isAerial && gameState.ballHeight > HEADER_HEIGHT_THRESHOLD;

    if (progress >= 1 || progress < 0.2) return;

    if (isHeaderOpportunity) {
        const contenders = allPlayers.filter(player => 
            !player.stunnedUntil || Date.now() > player.stunnedUntil
        ).map(player => ({
            player,
            dist: getDistance(player, gameState.ballPosition)
        })).filter(c => c.dist < 28); 

        if (contenders.length > 1) { 
            contenders.sort((a, b) => {
                const aScore = (a.player.physicality * 0.7) + (Math.random() * 30);
                const bScore = (b.player.physicality * 0.7) + (Math.random() * 30);
                return bScore - aScore;
            });

            const winner = contenders[0].player;
            const loser = contenders[1].player;

            handleWonHeader(winner);
            loser.stunnedUntil = Date.now() + 500; 

            const headerText = `${Math.floor(gameState.timeElapsed)}' ${winner.name} wins the header against ${loser.name}!`;
            gameState.commentary.push({ text: headerText, type: 'tackle' });

            return; 
        }
    }

    for (const player of allPlayers) {
        if (player.stunnedUntil && Date.now() < player.stunnedUntil) continue;
        if (gameState.currentPassReceiver && player.id === gameState.currentPassReceiver.id) continue;

        const distToBall = getDistance(player, gameState.ballPosition);

        if (!isAerial && distToBall < PASS_INTERCEPT_DISTANCE) {
            const interceptionChance = calculateInterceptionChance(player, distToBall, trajectory);
            if (Math.random() < interceptionChance) {
                handleInterception(player);
                const teamStats = player.isHome ? gameState.stats.home : gameState.stats.away;
                teamStats.interceptions++;
                break; 
            }
        }
    }
}

function calculateInterceptionChance(player, ballDistance, trajectory) {
    const realStats = player.realStats || {};
    const baseDefending = player.defending / 100;
    const interceptionModifier = realStats.interceptions > 0 ? Math.min(realStats.interceptions / 15, 0.3) : 0;
    const recoveryBonus = realStats.recoveries > 0 ? Math.min(realStats.recoveries / 20, 0.15) : 0;
    const ratingBonus = (player.rating - 6.5) / 10;
    const distancePenalty = Math.min(ballDistance / 100, 0.3);
    const passQualityBonus = trajectory.passQuality ? (1.0 - trajectory.passQuality) * 0.4 : 0;
    const interceptionChance = baseDefending + interceptionModifier + recoveryBonus + ratingBonus - distancePenalty + passQualityBonus;
    return Math.max(0.05, Math.min(0.8, interceptionChance));
}

function canWinHeader(player) {
    const realStats = player.realStats || {};
    // Temel fizik gücü ve hava topu yeteneği
    const basePhysicality = player.physicality / 100;
    const aerialAbility = realStats.aerialsWonPercent ? (realStats.aerialsWonPercent / 100) * 0.5 : 0.25;

    // YENİ: Pozisyon alma ve zamanlama faktörleri
    const positioningFactor = (player.defending / 100) * 0.15;
    const timingLuck = (Math.random() - 0.4); // %10'luk bir şans faktörü ekler, bazen kötü oyuncular da şanslı olabilir.

    // YENİ: Topun yüksekliğinin etkisi
    let heightPenalty = 0;
    if (gameState.ballHeight > 0.85 && player.physicality < 85) {
        heightPenalty = 0.3; // Fiziksel olarak yetersiz oyuncular için %30 ceza puanı
    }

    const headerChance = basePhysicality * 0.4 + aerialAbility + positioningFactor + timingLuck - heightPenalty;
    return Math.random() < Math.max(0.1, Math.min(headerChance, 0.85));
}

function handleSuccessfulHeader(player) {
    const previousHolder = gameState.ballHolder;
    if (!previousHolder || previousHolder.isHome !== player.isHome) {
        gameState.lastPossessionChange = Date.now();
    }

    gameState.ballTrajectory = null;
    gameState.ballHolder = player;
    player.hasBallControl = true;
    player.ballReceivedTime = Date.now();
    gameState.ballChasers.clear();
    gameState.currentPassReceiver = null;

    const headerText = `${Math.floor(gameState.timeElapsed)}' ${player.name} wins the header!`;
    gameState.commentary.push({ text: headerText, type: 'attack' });
    gameState.commentary = gameState.commentary.slice(-6);
}


function handleLostControl(player) {
    gameState.ballTrajectory = null;
    gameState.ballHolder = null;
    gameState.ballVelocity.x = (Math.random() - 0.5) * 200;
    gameState.ballVelocity.y = (Math.random() - 0.5) * 200;
    gameState.currentPassReceiver = null;

    const errorText = `${Math.floor(gameState.timeElapsed)}'  ${player.name} loses control!`;
    gameState.commentary.push({ text: errorText, type: 'attack' });
    gameState.commentary = gameState.commentary.slice(-6);
    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    assignBallChasers(allPlayers);
}

function handleInterception(player) {
    gameState.ballTrajectory = null;
    gameState.ballHolder = player;
    player.hasBallControl = true;
    player.ballReceivedTime = Date.now();
    gameState.ballChasers.clear();
    gameState.lastPossessionChange = Date.now();
    gameState.currentPassReceiver = null;

    const interceptText = `${Math.floor(gameState.timeElapsed)}' ${player.name} intercepts!`;
    gameState.commentary.push({ text: interceptText, type: 'attack' });
    gameState.commentary = gameState.commentary.slice(-6);
}
function handleWonHeader(player) {
    const opponentGoalX = getAttackingGoalX(player.isHome, gameState.currentHalf);
    const directionToGoal = Math.sign(opponentGoalX - player.x);

    // Topu yörüngeden çıkar
    gameState.ballTrajectory = null;
    gameState.ballHolder = null; // Top anında kontrol edilmiyor
    gameState.ballHeight = 0;

    // Topu kazanan oyuncunun hafifçe önüne doğru sektir
    gameState.ballPosition.x = player.x + directionToGoal * 15;
    gameState.ballPosition.y = player.y;
    gameState.ballVelocity.x = directionToGoal * 50; // Hafif ileri momentum
    gameState.ballVelocity.y = (Math.random() - 0.5) * 30;

    // En önemlisi: Top boşa düştüğü için, topu kovalaması gereken oyuncuları tekrar belirle.
    // Kazanan oyuncuya öncelik vererek onu en avantajlı konuma getir.
    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    assignBallChasers(allPlayers, player); // 'player' artık öncelikli kovalayıcı
}


