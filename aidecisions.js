function calculateAvgDribbling(teamPlayers) {
    return teamPlayers.reduce((sum, p) => sum + p.dribbling, 0) / teamPlayers.length;
}


function passBall(passingPlayer, fromX, fromY, toX, toY, passQuality = 0.7, speed = 400, isShot = false) {
    
    if (passingPlayer && !isShot) {
        // --- 1. STATS: PASS ATTEMPTED ---
        const teamStats = passingPlayer.isHome ? gameState.stats.home : gameState.stats.away;
        teamStats.passesAttempted++;

        // --- 2. STATS: SET UP FOR PASS COMPLETION ---
        // We set this so we know who passed it when it's received
        gameState.lastTouchedBy = passingPlayer;

        // (Your existing offside logic)
        const isSetPiece = (typeof isSetPieceStatus === 'function')
            ? isSetPieceStatus(gameState.status)
            : ['FREE_KICK', 'CORNER_KICK', 'THROW_IN', 'GOAL_KICK', 'KICK_OFF', 'PENALTY'].includes(gameState.status);

        if (!isShot && (gameState.status === 'playing' || isSetPiece)) {
            const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
            recordOffsidePositions(passingPlayer, allPlayers);
        }
    } else if (passingPlayer && isShot) {
        // Also track who shot the ball for rebounds/saves
        gameState.lastTouchedBy = passingPlayer;
    }

    const dist = Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2);
    const duration = (dist / speed) * 1000;
    let maxHeight = 0;
    let passType = 'ground';

    const LONG_PASS_THRESHOLD = (typeof PHYSICS !== 'undefined') ? PHYSICS.LONG_PASS_THRESHOLD : 150;

    if (isShot) {
        maxHeight = 0.6;
        passType = 'shot';
    } else if (dist > LONG_PASS_THRESHOLD) {
        maxHeight = 0.7 + (dist / 300) * 0.3;
        passType = 'aerial';
    }

    gameState.ballTrajectory = {
        startX: fromX,
        startY: fromY,
        endX: toX,
        endY: toY,
        startTime: Date.now(),
        duration: duration,
        maxHeight: maxHeight,
        isShot: isShot,
        passType: passType,
        passQuality: passQuality,
        dist: dist,
        speed: speed
    };

    gameState.ballHolder = null;
    if(passingPlayer) {
        passingPlayer.hasBallControl = false;
    }
}

function calculateDribbleSuccess(player, opponents) {
    const realStats = player.realStats || {};

    // 1. Temel Yetenek (Üstel hesaplama beceri farkını açar)
    // Örn: (0.95^0.8) = 0.96 | (0.80^0.8) = 0.84 | (0.60^0.8) = 0.67
    const baseDribbling = Math.pow(player.dribbling / 100, 0.8);

    // 2. Fiziksel Özellikler
    const paceBonus = (player.pace / 100) * 0.15; // Hızlanma için kritik
    const physicalityBonus = (player.physicality / 100) * 0.10; // Topu saklama ve ikili mücadele

    // 3. Zihinsel Özellikler
    // Soğukkanlılık, baskı cezasını doğrudan azaltacak
    const composure = (player.composure || 60) / 100; // Varsayılan 60

    // 4. Real Stat Etkisi (Mevcut mantık korunuyor ancak etkisi 1.5x artırıldı)
    const dribbleModifier = realStats.dribblesSucceeded > 0 ? Math.min(realStats.dribblesSucceeded / 10, 0.25) : 0;
    const dispossessedPenalty = realStats.dispossessed > 0 ? Math.min(realStats.dispossessed / 20, 0.15) : 0;
    const duelBonus = realStats.duelWonPercent > 0 ? (realStats.duelWonPercent / 100) * 0.1 : 0;
    
    // YENİ: realStats'ın toplam etkisi %50 artırıldı
    const realStatImpact = (dribbleModifier + duelBonus - dispossessedPenalty) * 1.5;

    // 5. Durumsal Cezalar (Baskı cezası artık soğukkanlılık ile dengeleniyor)
    const nearbyOpponents = opponents.filter(opp => getDistance(player, opp) < 40);
    // YENİ: Baskı cezası artırıldı (0.20) ancak soğukkanlılık ile çarpılarak azaltıldı
    const pressurePenalty = (nearbyOpponents.length * 0.20) * (1 - composure);

    // 6. Final Hesaplama
    const successChance = baseDribbling + 
                          paceBonus + 
                          physicalityBonus + 
                          realStatImpact - 
                          pressurePenalty;

    // 7. Genişletilmiş Aralık (İyi oyuncular daha iyi, kötü oyuncular daha kötü)
    // Önceki: Math.max(0.2, Math.min(0.85, successChance));
    return Math.max(0.10, Math.min(0.95, successChance));
}

/**
 * YENİ: Oyuncu yeteneklerini (passing, vision, composure) ve
 * gerçek istatistikleri (passAccuracy, longBallAccuracy) daha hassas harmanlayan pas başarı hesaplaması.
 */
function calculatePassSuccess(passer, receiver, distance, isUnderPressure) {
    // (getValidStat fonksiyonunuzun var olduğunu varsayıyorum)
    const realStats = passer.realStats || {};

    // 1. Temel Yetenek (Üstel hesaplama beceri farkını açar)
    // Örn: (0.90^0.7) = 0.93 | (0.70^0.7) = 0.79
    const basePassing = Math.pow(passer.passing / 100, 0.7);

    // 2. Efektif İsabet (Temel yetenek ile realStats harmanlanır)
    const passAccuracyStat = getValidStat(realStats.passAccuracy, 0);
    let effectiveAccuracy;
    if (passAccuracyStat > 0) {
        // YENİ: 50% temel yetenek, 50% gerçek dünya performansı
        effectiveAccuracy = (basePassing * 0.5) + ((passAccuracyStat / 100) * 0.5);
    } else {
        // realStats yoksa, %90 temel yeteneğe güven
        effectiveAccuracy = basePassing * 0.9;
    }

    // 3. Yaratıcılık ve Görüş Bonusları
    // YENİ: 'vision' (Görüş) yeteneği eklendi
    const visionBonus = ((passer.vision || 60) / 100) * 0.15; // Varsayılan 60
    const chancesCreated = getValidStat(realStats.chancesCreated, 0);
    const xA = getValidStat(realStats.xA, 0);
    
    // realStats bonusları biraz daha etkili hale getirildi
    const creativityBonus = chancesCreated > 0 ? Math.min(chancesCreated / 8, 0.15) : 0;
    const xABonus = xA > 0 ? Math.min(xA / 4, 0.10) : 0;

    // 4. Durumsal Cezalar (Daha hassas)
    
    // YENİ: Baskı Cezası (Soğukkanlılık ile doğrudan azaltılır)
    const composure = (passer.composure || 60) / 100; // Varsayılan 60
    const pressurePenalty = isUnderPressure ? (0.25 * (1 - composure)) : 0; // Maks 0.25 ceza
    // Örn: 90 Composure -> 0.25 * (1 - 0.9) = 0.025 ceza
    // Örn: 50 Composure -> 0.25 * (1 - 0.5) = 0.125 ceza

    // YENİ: Mesafe Cezası (Uzun Top Becerisi ile doğrudan azaltılır)
    const longBallAccuracy = getValidStat(realStats.longBallAccuracy, 60); // Varsayılan 60
    const longBallSkill = longBallAccuracy / 100;
    
    let distancePenalty = 0;
    if (distance > 120) { // Sadece 120px'den uzun paslar ceza alır
         distancePenalty = Math.min((distance - 120) / 400, 0.30); // Maks 0.30 ceza
         distancePenalty *= (1 - longBallSkill * 0.8); // 100 LBA cezanın %80'ini kaldırır
    }

    // 5. Final Hesaplama
    const successChance = effectiveAccuracy + 
                          visionBonus + creativityBonus + xABonus - 
                          pressurePenalty - distancePenalty;

    // 6. Genişletilmiş Aralık (Özellikle minimum %40'tan %20'ye çekildi)
    // Önceki: Math.max(0.40, Math.min(0.98, successChance));
    return Math.max(0.20, Math.min(0.98, successChance));
}

function checkForThroughBall(passer, teammates, opponents, opponentGoalX) {
    const direction = opponentGoalX > 400 ? 1 : -1;

    for (const teammate of teammates) {
        if (teammate.role === 'GK') continue;

        const isAhead = (direction > 0 && teammate.x > passer.x) ||
            (direction < 0 && teammate.x < passer.x);

        if (!isAhead) continue;

        const distToGoal = Math.abs(teammate.x - opponentGoalX);
        if (distToGoal > 250) continue;

        const targetX = teammate.x + direction * 60;
        const targetY = teammate.y;

        const defendersInPath = opponents.filter(opp => {
            const oppIsAhead = (direction > 0 && opp.x > passer.x && opp.x < targetX) ||
                (direction < 0 && opp.x < passer.x && opp.x > targetX);
            return oppIsAhead && Math.abs(opp.y - targetY) < 50;
        });

        if (defendersInPath.length === 0) {
            return {
                target: teammate,
                targetPos: { x: targetX, y: targetY },
                isThroughBall: true
            };
        }
    }

    return null;
}

function initiatePass(player, target) {
    if (!target) {
        console.warn('⚠️ No pass target provided');
        return;
    }
    
    const distance = getDistance(player, target);
    const nearbyOpponents = [...gameState.homePlayers, ...gameState.awayPlayers]
        .filter(p => p.isHome !== player.isHome && getDistance(player, p) < 50);
    
    const isUnderPressure = nearbyOpponents.length > 0;
    
    // Calculate pass quality
    const quality = calculatePassSuccess(player, target, distance, isUnderPressure);
    
    // Vary pass speed based on situation
    let passSpeed = 400;

    if (distance > 150) {
        // Long pass - faster
        passSpeed = 500 + player.passing * 3;
    } else if (isUnderPressure) {
        // Under pressure - quick pass
        passSpeed = 450 + player.passing * 2;
    } else {
        // Normal pass
        passSpeed = 400 + player.passing * 2.5;
    }

    // ✅ FIX: Reduce pass power immediately after kick-off to prevent wild passes
    if (gameState.postKickOffCalmPeriod && gameState.kickOffCompletedTime) {
        const timeSinceKickOff = Date.now() - gameState.kickOffCompletedTime;
        if (timeSinceKickOff < 4000) {
            passSpeed = Math.min(passSpeed, 450); // Cap speed at 450 during calm period
        }
    }

    // Execute pass
    gameState.currentPassReceiver = target;
    const teamStats = player.isHome ? gameState.stats.home : gameState.stats.away;
    teamStats.passesAttempted++;
    
    passBall(player, player.x, player.y, target.x, target.y, quality, passSpeed, false);
    gameState.totalPasses++;
    
    // Log for debugging
    console.log(`📤 ${player.name} → ${target.name} (${distance.toFixed(0)}px, ${(quality*100).toFixed(0)}% quality)`);
}

function initiateThroughBall(player, throughBall) {
    let passSpeed = 600 + player.passing * 5;

    // ✅ FIX: Reduce pass power immediately after kick-off to prevent wild passes
    if (gameState.postKickOffCalmPeriod && gameState.kickOffCompletedTime) {
        const timeSinceKickOff = Date.now() - gameState.kickOffCompletedTime;
        if (timeSinceKickOff < 4000) {
            passSpeed = Math.min(passSpeed, 450); // Cap speed at 450 during calm period
        }
    }

    const quality = calculatePassSuccess(player, throughBall.target, getDistance(player, throughBall.targetPos), false);
    gameState.currentPassReceiver = throughBall.target;
    passBall(player, player.x, player.y, throughBall.targetPos.x, throughBall.targetPos.y, quality, passSpeed, false);
    gameState.totalPasses++;
    throughBall.target.speedBoost = 1.4;
    throughBall.target.targetX = throughBall.targetPos.x;
    throughBall.target.targetY = throughBall.targetPos.y;
}

function initiateDribble(player, goalX) {
    const direction = Math.sign(goalX - player.x) || 1;
    const dribbleSkill = player.dribbling / 100;
    
    // More variety in dribble movements
    const moveTypes = [
        { name: 'forward', x: direction * 70, y: 0 },
        { name: 'diagonal', x: direction * 60, y: (Math.random() - 0.5) * 50 },
        { name: 'cut_inside', x: direction * 50, y: Math.sign(300 - player.y) * 40 }
    ];
    
    // Choose move based on skill
    const moveChoice = dribbleSkill > 0.75 ? 
        moveTypes[Math.floor(Math.random() * moveTypes.length)] : 
        moveTypes[0];
    
    player.targetX = player.x + moveChoice.x * dribbleSkill;
    player.targetY = player.y + moveChoice.y * dribbleSkill;
    
    // Speed boost based on skill
    player.speedBoost = 1.0 + (dribbleSkill * 0.4);
    
    // Boundaries
    player.targetX = Math.max(50, Math.min(750, player.targetX));
    player.targetY = Math.max(50, Math.min(550, player.targetY));
    
    console.log(`🎯 ${player.name} dribbles ${moveChoice.name}`);
}

function handlePlayerWithBall_WithFirstTouch(player, opponents, teammates) {
    // Can't act if still settling the ball
    if (!canPlayerActOnBall(player)) {
        // Just hold position while controlling
        player.targetX = player.x;
        player.targetY = player.y;
        return; // ✅ This 'return' is now valid
    }

    const goalX = getAttackingGoalX(player.isHome, gameState.currentHalf);
    const distToGoal = Math.abs(player.x - goalX);
    const angleToGoal = Math.abs(player.y - 300);

    const nearbyOpponents = opponents.filter(opp => getDistance(player, opp) < 50);
    const underPressure = nearbyOpponents.length > 0;
    const underHeavyPressure = nearbyOpponents.length > 1;

    const shootingChance = (player.shooting / 100) * (1 - angleToGoal / 400);
    const isInBox = distToGoal < 180 && angleToGoal < 120;

    // --- YENİ MANTIK BAŞLANGICI ---
    // Oyuncu kaleye ne kadar yakınsa, o kadar geniş bir açıdan şut çekmesine izin ver.
    // Temel açı limiti 150 olarak başlar.
    let adjustedAngleThreshold = 150; 
    // Eğer oyuncu kaleye 120 birimden daha yakınsa, ekstra bir açı bonusu ekle.
    if (distToGoal < 120) {
        // Yakınlık faktörü (0 ile 1 arası). 119'da ~0, 0'da 1 olur.
        const closenessFactor = (120 - distToGoal) / 120; 
        // Maksimum 80 birimlik bir açı bonusu eklenir. Oyuncu dibindeyse en geniş açıya sahip olur.
        adjustedAngleThreshold += 80 * closenessFactor;
    }
    // --- YENİ MANTIK SONU ---

    // Güncellenmiş değişkeni kullanarak iyi pozisyon olup olmadığını kontrol et.
    const isGoodPosition = distToGoal < GAME_CONFIG.GOAL_CHECK_DISTANCE && angleToGoal < adjustedAngleThreshold;

    const hasPathToGoal = !opponents.some(opp => {
        const oppDistToGoal = Math.abs(opp.x - goalX);
        return oppDistToGoal < distToGoal &&
               Math.abs(opp.y - player.y) < 40 &&
               getDistance(player, opp) < 80;
    });

    const now = Date.now();
    const holdTime = player.ballReceivedTime ? now - player.ballReceivedTime : 0;
    const maxHoldTime = underHeavyPressure ? 800 : underPressure ? 1500 : 2000;

    if (holdTime > maxHoldTime) {
        if (underHeavyPressure && Math.random() < 0.6) {
            const passTarget = findBestPassOption(player, teammates, opponents);
            if (passTarget) {
                initiatePass(player, passTarget);
                return; // ✅ This 'return' is now valid
            }
        }
        if (underPressure) {
            if (calculateDribbleSuccess(player, nearbyOpponents) > 0.5) {
                initiateDribble(player, goalX);
                return; // ✅ This 'return' is now valid
            }
        }
    }

    const decision = Math.random();
    const allPlayers = [...teammates, ...opponents];

    if (isInBox && hasPathToGoal && !underHeavyPressure && decision < 0.8) {
        handleShotAttempt(player, goalX, allPlayers);
        return; // ✅ This 'return' is now valid
    }

    if (isGoodPosition && decision < shootingChance * 1.5 && hasPathToGoal) {
        handleShotAttempt(player, goalX, allPlayers);
        return; // ✅ This 'return' is now valid
    }

    if (underHeavyPressure) {
        if (decision < 0.7) {
            const passTarget = findBestPassOption(player, teammates, opponents);
            if (passTarget) {
                initiatePass(player, passTarget);
            } else {
                initiateDribble(player, goalX);
            }
        } else {
            initiateDribble(player, goalX);
        }
        return; // ✅ This 'return' is now valid
    }

    if (!underPressure && distToGoal < 350) {
        const throughBall = checkForThroughBall(player, teammates, opponents, goalX);
        if (throughBall && decision < 0.35) {
            initiateThroughBall(player, throughBall);
            return; // ✅ This 'return' is now valid
        }
    }

    if (underPressure || decision < GAME_CONFIG.PASSING_CHANCE) {
        const passTarget = findBestPassOption(player, teammates, opponents);
        if (passTarget) {
            initiatePass(player, passTarget);
        } else {
            initiateDribble(player, goalX);
        }
    } else {
        initiateDribble(player, goalX);
    }
}

function handlePlayerWithBall_WithVision(player, opponents, teammates) {
    // --- Ã–N KOÅžUL KONTROLÃœ: OYUNCU EYLEM YAPABÄ°LÄ°R MÄ°? ---
    // EÄŸer oyuncu topu yeni kontrol ettiyse ve henÃ¼z tam hakimiyet kuramadÄ±ysa (settle time),
    // anlamsÄ±zca dÃ¶nmek yerine, topu koruyarak gÃ¼venli bir yÃ¶ne doÄŸru yavaÅŸÃ§a hareket eder.
    if (!canPlayerActOnBall(player)) {
        const goalX = getAttackingGoalX(player.isHome, gameState.currentHalf);
        
        // Rakiplerin pozisyonuna gÃ¶re en gÃ¼venli "koruyucu dribbling" yÃ¶nÃ¼nÃ¼ bul.
        let bestAngle = getPlayerFacingDirection(player);
        let maxSpace = 0;
        
        // Ã–nÃ¼ndeki 120 derecelik alanÄ± tarayarak en boÅŸ yÃ¶nÃ¼ tespit et.
        for (let i = -1; i <= 1; i += 0.5) {
            const angle = getPlayerFacingDirection(player) + (i * Math.PI / 3); // +/- 60 derece
            const checkPos = { x: player.x + Math.cos(angle) * 50, y: player.y + Math.sin(angle) * 50 };
            const closestOpponentDist = opponents.length > 0
                ? Math.min(...opponents.map(o => getDistance(o, checkPos)))
                : 1000; // No opponents = lots of space
            if (closestOpponentDist > maxSpace) {
                maxSpace = closestOpponentDist;
                bestAngle = angle;
            }
        }

        // En gÃ¼venli yÃ¶ne doÄŸru yavaÅŸ ve kontrollÃ¼ bir ÅŸekilde ilerle.
        player.targetX = player.x + Math.cos(bestAngle) * 20;
        player.targetY = player.y + Math.sin(bestAngle) * 20;
        player.speedBoost = 0.8; // YavaÅŸ, kontrollÃ¼ hareket.
        return; // Yeni bir karar iÃ§in bekleme sÃ¼resi dolana kadar bu eylemi yap.
    }

    // --- KARAR VERME MERKEZÄ°: EYLEM DEÄžERLENDÄ°RME SÄ°STEMÄ° ---
    
    // Gerekli temel bilgileri hesapla
    const goalX = getAttackingGoalX(player.isHome, gameState.currentHalf);
    const allPlayers = [...teammates, ...opponents, player];

    // 1. ÅžUT DEÄžERÄ°NÄ° HESAPLA (shotValue)
    let shotValue = 0;
    const distToGoal = getDistance(player, { x: goalX, y: 300 });
    // Sadece makul bir ÅŸut mesafesindeyse (yaklaÅŸÄ±k 35 metre) ÅŸut Ã§ekmeyi dÃ¼ÅŸÃ¼n.
    if (distToGoal < 280) {
        const xG = calculateXG(player, goalX, player.y, opponents);
        shotValue = xG * 100; // xG'yi 0-100 arasÄ± bir deÄŸere dÃ¶nÃ¼ÅŸtÃ¼r.
        
        // BaskÄ± altÄ±ndaysa veya aÃ§Ä± kÃ¶tÃ¼yse ÅŸutun deÄŸerini dÃ¼ÅŸÃ¼r.
        if (opponents.some(o => getDistance(o, player) < 30)) shotValue *= 0.6;
        if (Math.abs(player.y - 300) > 150) shotValue *= 0.7; // KÃ¶tÃ¼ aÃ§Ä± cezasÄ±
    }

    // 2. PAS DEÄžERÄ°NÄ° HESAPLA (passValue)
    const passTarget = findBestPassOption_WithVision(player, teammates, opponents);
    let passValue = 0;
    if (passTarget) {
        const distToTarget = getDistance(player, passTarget);
        const spaceAroundTarget = opponents.length > 0
            ? Math.min(...opponents.map(o => getDistance(o, passTarget)))
            : 1000; // No opponents = lots of space
        
        // DeÄŸer: Hedefin boÅŸ alanÄ± + temel pas deÄŸeri - mesafe cezasÄ±
        passValue = 40 + (spaceAroundTarget) - (distToTarget * 0.5);
        
        // HÃ¼cum yÃ¶nÃ¼ndeki paslarÄ± Ã¶dÃ¼llendir.
        if (Math.sign(passTarget.x - player.x) === Math.sign(goalX - player.x)) {
            passValue += 25;
        }
    }
    
    // 3. DRÄ°BBLÄ°NG DEÄžERÄ°NÄ° HESAPLA (dribbleValue)
    let dribbleValue = 0;
    const forwardAngle = getPlayerFacingDirection(player);
    // Oyuncunun 60 birim Ã¶nÃ¼ndeki alanÄ± kontrol et.
    const dribbleCheckPos = { x: player.x + Math.cos(forwardAngle) * 60, y: player.y + Math.sin(forwardAngle) * 60 };
    const spaceAhead = opponents.length > 0
        ? Math.min(...opponents.map(o => getDistance(o, dribbleCheckPos)))
        : 1000; // No opponents = lots of space
    
    // Ã–nÃ¼nde yeterince (40 birim) boÅŸluk varsa dribbling yapmayÄ± dÃ¼ÅŸÃ¼n.
    if (spaceAhead > 40) {
        // DeÄŸer: Oyuncunun dribbling yeteneÄŸi + Ã¶nÃ¼ndeki boÅŸluk
        dribbleValue = (player.dribbling * 0.6) + (spaceAhead * 0.4);
        
        // HÄ±zlÄ± oyuncularÄ± ve kanat oyuncularÄ±nÄ± dribbling iÃ§in daha fazla teÅŸvik et.
        if (player.pace > 82 || ['RW', 'LW', 'RM', 'LM'].includes(player.role)) {
            dribbleValue += 15;
        }
    }

    // --- EYLEM SEÃ‡Ä°MÄ° VE UYGULAMA ---
    // En yÃ¼ksek deÄŸere sahip olan ve belirli bir eÅŸiÄŸi geÃ§en eylemi seÃ§.
        if (shotValue > passValue && shotValue > dribbleValue && shotValue > 30) {
        handleShotAttempt(player, goalX, allPlayers);
        return;
    }

    // Pas, en yÃ¼ksek deÄŸere sahipse VE deÄŸeri makul bir eÅŸiÄŸin (Ã¶rn: 45) Ã¼zerindeyse.
    if (passValue > dribbleValue && passValue > 45) {
        initiatePass(player, passTarget);
        return;
    }

    // EÄŸer ÅŸut veya pas mantÄ±klÄ± bir seÃ§enek deÄŸilse, varsayÄ±lan eylem olarak dribbling yap.
    initiateDribble(player, goalX);
}