function getPositionConfig(role) {
    // DÜZELTME: POSITION_CONFIGS global olmalı
    return (typeof POSITION_CONFIGS !== 'undefined' && POSITION_CONFIGS[role.toUpperCase()]) || { 
        defensiveness: 0.5, 
        attackRange: 0.5, 
        ballChasePriority: 0.5, 
        idealWidth: 0.2, 
        pushUpOnAttack: 60 
    };
}



    
function getPlayerActivePosition(player, currentHalf) {
    
    // Gerekli ayarları ve konfigürasyonları alın
    const GAME_CONFIG_DEFAULT = { PITCH_WIDTH: 800, PITCH_HEIGHT: 600, GOAL_X_LEFT: 50, GOAL_X_RIGHT: 750 };
    const activeConfig = (typeof GAME_CONFIG !== 'undefined' && GAME_CONFIG) ? GAME_CONFIG : GAME_CONFIG_DEFAULT;
    
    // 1. ADIM: Önce temel "home" pozisyonunu alın
    let homeX = player.homeX;
    let homeY = player.homeY;
    const pitchWidth = activeConfig.PITCH_WIDTH;
    const pitchHeight = activeConfig.PITCH_HEIGHT;

    // 2. ADIM: YARI SAHA DEĞİŞİMİNİ HEMEN UYGULAYIN
    // 'activeX' ve 'activeY' artık oyuncunun bu yarıdaki temel pozisyonudur
    let activeX = (currentHalf === 2) ? (pitchWidth - homeX) : homeX;
    let activeY = homeY;

    // 3. ADIM: Topun etkisini ve taktiksel kaydırmaları BU YENİ 'activeX' VE 'activeY' ÜZERİNDEN HESAPLAYIN
    const ballShiftFactor = 0.15;
    const shiftX = (gameState.ballPosition.x - (pitchWidth / 2)) * ballShiftFactor;
    const shiftY = (gameState.ballPosition.y - (pitchHeight / 2)) * ballShiftFactor;

    // Topun kaydırma etkisini 'activeX' ve 'activeY'ye uygulayın (hatalı 'homeX' yerine)
    if (!['GK', 'CB', 'LB', 'RB'].includes(player.role)) {
        activeX += shiftX * Math.min(1, Math.abs(activeX - (pitchWidth / 2)) / (pitchWidth / 4)); //
        activeY += shiftY; //
    }

    // Taktiksel kaydırmaları 'activeX' üzerinden hesaplayın
    const isMidfielder = ['CDM', 'CM', 'CAM', 'RM', 'LM'].includes(player.role);
    if (isMidfielder) {
        const teamState = player.isHome ? gameState.homeTeamState : gameState.awayTeamState;
        const opponentGoalX = getAttackingGoalX(player.isHome, currentHalf);
        const ownGoalX = getAttackingGoalX(!player.isHome, currentHalf);

        if (teamState === 'ATTACKING' || teamState === 'COUNTER_ATTACK') {
            const pushFactor = (teamState === 'ATTACKING') ? 80 : 100;
            // 'homeX' yerine 'activeX' kullanın
            const direction = Math.sign(opponentGoalX - activeX) || 1; 
            activeX += direction * pushFactor;
        }
        else if (teamState === 'DEFENDING' || teamState === 'HIGH_PRESS') {
            const pullFactor = (teamState === 'DEFENDING') ? 70 : 50;
            // 'homeX' yerine 'activeX' kullanın
            const direction = Math.sign(ownGoalX - activeX) || 1; 
            activeX += direction * pullFactor;
        }
    }

    // 4. ADIM: Sonuçları sınırlandırıp döndürün
    activeX = Math.max(10, Math.min(pitchWidth - 10, activeX));
    activeY = Math.max(10, Math.min(pitchHeight - 10, activeY));

    return { x: activeX, y: activeY };
}
function getZoneForPlayer(player, activePosition, teamState) {
    const { role, isHome } = player;
    
    // Saha boyutları ve kilit noktalar
    const FIELD_WIDTH = 800;
    const FIELD_HEIGHT = 600;
    const HALF_WAY_LINE = FIELD_WIDTH / 2;

    // Oyuncunun takımına göre koordinatları ayarla
    const ownGoalLine = isHome ? 0 : FIELD_WIDTH;
    const opponentGoalLine = isHome ? FIELD_WIDTH : 0;
    
    // Penaltı sahası sınırları (yaklaşık değerler)
    const ownPenaltyAreaX = isHome ? 130 : FIELD_WIDTH - 130;
    const oppPenaltyAreaX = isHome ? FIELD_WIDTH - 130 : 130;

    let zone = { x1: 0, y1: 0, x2: FIELD_WIDTH, y2: FIELD_HEIGHT }; // Varsayılan

    // Dikey koridorlar (Kanatlar ve Merkez)
    const leftWingY = { y1: 0, y2: 180 };
    const leftCenterY = { y1: 180, y2: 300 };
    const rightCenterY = { y1: 300, y2: 420 };
    const rightWingY = { y1: 420, y2: 600 };
    const centralCorridorY = { y1: 180, y2: 420 };

    // Mevkiye göre bölge ataması
    switch (role) {
        // --- DEFANS ---
        case 'LB':
        case 'RB':
            const wingY = role === 'LB' ? leftWingY : rightWingY;
            if (teamState === 'ATTACKING') {
                // Hücumda: Kendi yarı sahasından rakip ceza sahasına kadar genişler.
                zone = { x1: HALF_WAY_LINE - 100, x2: oppPenaltyAreaX, ...wingY };
            } else {
                // Savunmada: Korner çizgisinden yarı sahaya kadar olan bölge.
                zone = { x1: ownGoalLine, x2: HALF_WAY_LINE, ...wingY };
            }
            break;
            
        case 'LCB':
        case 'RCB':
        case 'CB':
            const centerBackY = role === 'LCB' ? leftCenterY : role === 'RCB' ? rightCenterY : centralCorridorY;
            if (teamState === 'ATTACKING') {
                // Hücumda: Orta çizginin 100px ilerisine kadar çıkar.
                const forwardLimit = isHome ? HALF_WAY_LINE + 100 : HALF_WAY_LINE - 100;
                zone = { x1: ownPenaltyAreaX, x2: forwardLimit, ...centerBackY };
            } else {
                // Savunmada: Kale çizgisi ile orta çizgi arası.
                zone = { x1: ownGoalLine, x2: HALF_WAY_LINE, ...centerBackY };
            }
            break;
        
        // --- ORTA SAHA ---
        case 'CDM':
        case 'CM':
        case 'LCM':
        case 'RCM':
            const midY = role.includes('L') ? leftCenterY : role.includes('R') ? rightCenterY : centralCorridorY;
            if (teamState === 'ATTACKING') {
                // Hücumda: Rakip ceza sahasına kadar sokulabilir.
                zone = { x1: ownPenaltyAreaX, x2: oppPenaltyAreaX, ...midY };
            } else {
                // Savunmada: İki ceza sahası arasındaki alan.
                zone = { x1: ownPenaltyAreaX, x2: oppPenaltyAreaX, ...midY };
            }
            break;

        case 'CAM': // Ofansif Orta Saha
             zone = { x1: HALF_WAY_LINE - 150, x2: oppPenaltyAreaX + 20, ...centralCorridorY };
             break;

        // --- KANATLAR ---
        case 'LM':
        case 'RM':
             const wideMidY = role === 'LM' ? leftWingY : rightWingY;
             if (teamState === 'ATTACKING') {
                 zone = { x1: ownPenaltyAreaX, x2: oppPenaltyAreaX, ...wideMidY };
             } else {
                 // Defansif rol: Kendi yarı sahasına daha çok yardım eder.
                 zone = { x1: ownGoalLine + 100, x2: HALF_WAY_LINE + 150, ...wideMidY };
             }
             break;

        case 'LW':
        case 'RW':
            const wingerY = role === 'LW' ? leftWingY : rightWingY;
            // Daha ofansif: Genellikle rakip yarı sahada oynar.
            zone = { x1: HALF_WAY_LINE - 100, x2: opponentGoalLine, ...wingerY };
            if (teamState === 'DEFENDING') {
                // Yoğun savunmada yarı sahasına yardıma gelir.
                zone.x1 = isHome ? zone.x1 - 150 : zone.x1 + 150;
            }
            break;

        // --- FORVET ---
        case 'ST':
        case 'CF':
            zone = { x1: HALF_WAY_LINE, x2: opponentGoalLine, ...centralCorridorY };
            if (teamState === 'DEFENDING') {
                // Yoğun savunmada kendi sahasına yardıma gelebilir.
                const retreatX = isHome ? HALF_WAY_LINE - 150 : HALF_WAY_LINE + 150;
                zone = { x1: retreatX, x2: opponentGoalLine, ...centralCorridorY };
            }
            break;
            
        // --- KALECÄ° ---
        case 'GK':
            // Kaleci için özel bölge - ceza sahası
            const gkWidth = 160;
            const gkHeight = 400;
            zone = {
                x1: isHome ? ownGoalLine : ownGoalLine - gkWidth,
                x2: isHome ? ownGoalLine + gkWidth : ownGoalLine,
                y1: (FIELD_HEIGHT - gkHeight) / 2,
                y2: (FIELD_HEIGHT + gkHeight) / 2
            };
            break;
    }
    
    return zone;
}







function assessDefensiveThreats(defendingPlayer, opponents, ownGoalX) {
    const ballCarrier = gameState.ballHolder;

    return opponents.map(opponent => {
        if (opponent.role === 'GK') return { player: opponent, score: 0 };

        const distToGoal = Math.abs(opponent.x - ownGoalX);
        const distToDefender = getDistance(defendingPlayer, opponent);
        const role = opponent.role;
        let score = 0;

        // YENİ: İstenen rol tabanlı tehdit bonusu
        // ST, LW, RW ve CF rolleri doğal olarak daha yüksek bir tehdit puanıyla başlar.
        if (role === 'ST' || role === 'CF') {
            score += 80; // En yüksek öncelik
        } else if (role === 'LW' || role === 'RW') {
            score += 70; // Yüksek öncelikli kanat tehditleri
        } else if (role === 'CAM') {
            score += 50; // Ofansif orta saha
        }

        // 1. Kaleye yakınlık en büyük faktördür (Çarpan artırıldı)
        if (distToGoal < 400) {
            score += (400 - distToGoal) * 0.6; // 0.5'ten 0.6'ya yükseltildi
        }

        // 2. Topa sahip olmak onları birincil tehdit yapar (Bonus artırıldı)
        if (ballCarrier && ballCarrier.id === opponent.id) {
            score += 200; // 150'den 200'e yükseltildi
        }

        // 3. Merkezi, tehlikeli bir pozisyonda olmak
        const angleToGoal = Math.abs(opponent.y - 300);
        if (angleToGoal < 150) {
            score += (150 - angleToGoal) * 0.3; // 0-45 puan
        }
        
        // 4. Pas alma potansiyeli (boş alan)
        const nearbyDefenders = (defendingPlayer.isHome ? gameState.homePlayers : gameState.awayPlayers)
            .filter(d => getDistance(d, opponent) < 60);
        if (nearbyDefenders.length <= 1) {
            score += 50; // İşaretsiz olma bonusu
        }

        // 5. Savunmacıya daha yakın olmak, onları daha acil bir sorumluluk haline getirir (Ceza azaltıldı)
        score -= distToDefender * 0.15; // 0.2'den 0.15'e düşürüldü

        return { player: opponent, score: Math.max(0, score) };
    }).sort((a, b) => b.score - a.score);
}


// playerAI.js dosyasında bu fonksiyonu bulun ve TAMAMEN DEĞİŞTİRİN
function findMostDangerousAttacker(player, threats, playerZone) {
    // Tehditler zaten skora göre sıralanmış (assessDefensiveThreats'ten)
    const markerRole = player.role;
    let primaryTargetRoles = [];
    let secondaryTargetRoles = [];
    let bestThreat = null;

    // 1. Savunmacının rolüne göre öncelikli hedefleri belirle
    switch (markerRole) {
        // --- SAVUNMA HATTI ---
        case 'LB':
            primaryTargetRoles = ['RW', 'RM', 'RWB'];
            secondaryTargetRoles = ['ST', 'CF', 'CAM'];
            break;
        case 'RB':
            primaryTargetRoles = ['LW', 'LM', 'LWB'];
            secondaryTargetRoles = ['ST', 'CF', 'CAM'];
            break;
        case 'CB':
        case 'LCB':
        case 'RCB':
            primaryTargetRoles = ['ST', 'CF'];
            secondaryTargetRoles = ['CAM', 'CM']; // Ceza sahasına koşan
            break;
        
        // --- ORTA SAHA VE KANAT FORVET HATTI (YENİ GÜNCELLEME) ---
        case 'CDM':
            primaryTargetRoles = ['CAM', 'CF'];
            secondaryTargetRoles = ['CM'];
            break;
        case 'LM':
        case 'LW': // LW EKLENDİ
            // Sol kanat oyuncuları, rakibin sağ kanadını (RB/RM) takip eder
            primaryTargetRoles = ['RB', 'RWB', 'RM'];
            secondaryTargetRoles = ['CM'];
            break;
        case 'RM':
        case 'RW': // RW EKLENDİ
            // Sağ kanat oyuncuları, rakibin sol kanadını (LB/LM) takip eder
            primaryTargetRoles = ['LB', 'LWB', 'LM'];
            secondaryTargetRoles = ['CM'];
            break;
        case 'CM':
            primaryTargetRoles = ['CM', 'CAM'];
            secondaryTargetRoles = ['CDM'];
            break;
        case 'CAM':
            primaryTargetRoles = ['CDM'];
            secondaryTargetRoles = ['CB'];
            break;
        
        // --- ÖN ALAN PRESI ---
        case 'ST':
        case 'CF':
            primaryTargetRoles = ['CB', 'LCB', 'RCB'];
            secondaryTargetRoles = ['GK', 'CDM']; // Pivotu da rahatsız eder
            break;
        default:
            primaryTargetRoles = [];
            secondaryTargetRoles = [];
            break;
    }

    // 2. Birincil hedefleri ara
    if (primaryTargetRoles.length > 0) {
        const primaryThreats = threats.filter(t => primaryTargetRoles.includes(t.player.role));
        if (primaryThreats.length > 0) {
            bestThreat = primaryThreats.sort((a, b) => b.score - a.score)[0];
            if (bestThreat.score > 30) {
                 return bestThreat.player;
            }
        }
    }

    // 3. İkincil hedefleri ara
    if (secondaryTargetRoles.length > 0) {
        const secondaryThreats = threats.filter(t => secondaryTargetRoles.includes(t.player.role));
        if (secondaryThreats.length > 0) {
            bestThreat = secondaryThreats.sort((a, b) => b.score - a.score)[0];
            if (bestThreat.score > 50) {
                return bestThreat.player;
            }
        }
    }

    // 4. Bölgesel Acil Durum
    const threatsInZone = threats.filter(t =>
        t.player.x > playerZone.x1 && t.player.x < playerZone.x2 &&
        t.player.y > playerZone.y1 && t.player.y < playerZone.y2
    );
    if (threatsInZone.length > 0 && threatsInZone[0].score > 100) {
         return threatsInZone[0].player;
    }

    // 5. Hiçbir hedef bulunamadı
    return null;
}

function calculateOptimalMarkingPosition(marker, target, ownGoalX, tightness = 'goal_side') {
    // 'tightness' parametresi eklendi (varsayılan: 'goal_side')
    
    const goalCenterY = 300;
    
    // YENİ: SIKI MARK AJ MANTIĞI
    if (tightness === 'tight') {
        // Hedefin 25 birim yakınına (kale tarafına) sabit bir mesafede dur.
        const fixedDistance = 25; // Sıkı markaj mesafesi (piksel)
        
        // Hedef ile kale merkezi arasındaki açıyı bul
        const angleToGoal = Math.atan2(goalCenterY - target.y, ownGoalX - target.x);
        
        const markingPointX = target.x + Math.cos(angleToGoal) * fixedDistance;
        const markingPointY = target.y + Math.sin(angleToGoal) * fixedDistance;

        return { x: markingPointX, y: markingPointY };
    }

    // ESKİ MANTIK ('goal_side' veya varsayılan):
    // Hedef ile kale arasındaki çizgi üzerinde dur (oranlı mesafe).
    const vectorX = ownGoalX - target.x;
    const vectorY = goalCenterY - target.y;
    
    // CB'lerin oranını daha da sıkı hale getirelim
    const distanceRatio = (marker.role === 'CB') ? 0.08 : 0.12; // Eskiden 0.10 / 0.15 idi

    const markingPointX = target.x + vectorX * distanceRatio;
    const markingPointY = target.y + vectorY * distanceRatio;

    return { x: markingPointX, y: markingPointY };
}

function updateTacticalPosition(player, ball, teammates, opponents) {
    // ==========================================================
    // DÜZELTME (Hata 1): AI Çatışmasını Engelleme
    // ==========================================================
    // Eğer durum 'playing' değilse (örn. 'FREE_KICK', 'CORNER_KICK' vb.)
    // ve oyuncu 'SetPieceIntegration' tarafından kilitlenmemişse,
    // bu fonksiyonun (taktiksel pozisyonlama) çalışmasını engelle.
    // SetPieceIntegration (updatePlayerAI_V2 ile) oyuncu pozisyonlarını zaten yönetiyor.
    if (gameState.status !== 'playing') {
        // Duran top sırasında oyuncunun mevcut hedefini korumasını sağla,
        // ancak yeni bir taktiksel hedef atama.
        player.targetX = player.x;
        player.targetY = player.y;
        player.speedBoost = 1.0;
        return; // Taktiksel AI'yi çalıştırma
    }
    // ==========================================================
    // DÜZELTME SONU
    // ==========================================================

    //
    const tactic = TACTICS[player.isHome ? gameState.homeTactic : gameState.awayTactic];
    const teamState = player.isHome ? gameState.homeTeamState : gameState.awayTeamState;
    const activePosition = getPlayerActivePosition(player, gameState.currentHalf);
    const teamHasBall = gameState.ballHolder && gameState.ballHolder.isHome === player.isHome;
    const opponentHasBall = gameState.ballHolder && gameState.ballHolder.isHome !== player.isHome;
    //
    const opponentGoalX = getAttackingGoalX(player.isHome, gameState.currentHalf);
    const ownGoalX = getAttackingGoalX(!player.isHome, gameState.currentHalf);
    const timeSinceLastChange = Date.now() - gameState.lastPossessionChange;
    const isCounterAttackMoment = teamState === 'COUNTER_ATTACK' && teamHasBall;

    //
    if (player.role === 'GK') {
        updateGoalkeeperAI_Advanced(player, ball, opponents); // Gelişmiş GK AI kullanılıyor
        return;
    }

    //
    if (gameState.ballChasers.has(player.id)) {
        player.targetX = ball.x;
        player.targetY = ball.y;
        player.targetLocked = true;
        player.targetLockTime = Date.now();
        return;
    }

    //
    const now = Date.now();
    const distToTarget = Math.sqrt(
        Math.pow(player.targetX - player.x, 2) +
        Math.pow(player.targetY - player.y, 2)
    );

    if (player.targetLocked && now - player.targetLockTime < 1500) {
        if (distToTarget > 20) {
            return;
        }
    }

    //
    let targetX = activePosition.x;
    let targetY = activePosition.y;
    let shouldLockTarget = false;

    //
    if (opponentHasBall) {
        // DEFANSİF MANTIK (Bu zaten güncellediğimiz ve iyi çalışan kısım)
        const markingResult = applyMarkingAndPressing(player, ball, opponents, activePosition, ownGoalX, tactic, teamState);
        if (markingResult.shouldMark) {
            targetX = markingResult.x;
            targetY = markingResult.y;
            player.speedBoost = 1.2;
            shouldLockTarget = true;
        } else if (markingResult.shouldPress) {
            targetX = markingResult.x;
            targetY = markingResult.y;
            player.speedBoost = teamState === 'HIGH_PRESS' ? 1.4 : 1.3;
            shouldLockTarget = true;
        } else {
            ({ x: targetX, y: targetY } = applyDefensivePositioning(player, ball, tactic, activePosition, ownGoalX, teamState));
        }

    // ++++++++++ YENİ HÜCUM ENTEGRASYONU (DÜZELTME) ++++++++++
    } else if (teamHasBall && gameState.ballHolder) {
        // ESKİ MANTIK (applyAttackingMovement) ARTIK KULLANILMIYOR.
        // YENİ BehaviorSystem.js'den (vNew) gelişmiş davranışları çağırıyoruz.

        // 1. Gelişmiş sistemden mevcut faza göre bir davranış iste
        const phase = BehaviorSystem.detectGamePhase(gameState); // 'attacking' veya 'transition_attack'
        const tacticName = player.isHome ? gameState.homeTactic : gameState.awayTactic;
        const tacticalSystem = BehaviorSystem.getTacticalSystemType(tacticName);
        
        const advancedBehavior = BehaviorSystem.selectPlayerBehavior(
            player, 
            gameState, 
            phase, 
            tacticalSystem
        );

        // 2. Davranış bulunduysa uygula
        if (advancedBehavior) {
            targetX = advancedBehavior.target.x;
            targetY = advancedBehavior.target.y;
            player.speedBoost = advancedBehavior.speedMultiplier;
            shouldLockTarget = advancedBehavior.shouldLock;
            player.currentBehavior = advancedBehavior.description; // Debug için
        } else {
            // 3. BehaviorSystem bir şey döndürmezse (örn. 'balanced' taktik), formasyona dön
            targetX = activePosition.x;
            targetY = activePosition.y;
            player.speedBoost = 1.0;
            player.currentBehavior = 'holding_shape';
        }
    // ++++++++++ ENTEGRASYON SONU ++++++++++

    } else {
        // Top ortadayken
        const verticalInfluence = (ball.y - 300) * 0.15;
        targetX = activePosition.x;
        targetY = activePosition.y + verticalInfluence;
        player.speedBoost = 1.0;
    }

    //
    if (!shouldLockTarget) {
         ({ x: targetX, y: targetY } = applySoftAntiClustering(player, teammates, targetX, targetY));
    }

    //
    // CB TASMA MANTIĞI (Bu korundu)
    if (player.role === 'CB' || player.role === 'LCB' || player.role === 'RCB') {
        const MAX_CB_ADVANCE_DISTANCE = 470; 
        const halfwayLine = 400;

        if (ownGoalX < halfwayLine) { 
            const redLine = ownGoalX + MAX_CB_ADVANCE_DISTANCE; 
            if (targetX > redLine) {
                targetX = redLine; 
            }
        } else { 
            const redLine = ownGoalX - MAX_CB_ADVANCE_DISTANCE; 
            if (targetX < redLine) {
                targetX = redLine; 
            }
        }
    }

    //
    targetX = Math.max(50, Math.min(750, targetX));
    targetY = Math.max(50, Math.min(550, targetY));

    player.targetX = targetX;
    player.targetY = targetY;

    if (shouldLockTarget) {
        player.targetLocked = true;
        player.targetLockTime = now;
    } else {
        if (distToTarget < 15) {
            player.targetLocked = false;
        }
    }
}

function applyMarkingAndPressing(player, ball, opponents, activePosition, ownGoalX, tactic, teamState) { 
    const ballCarrier = gameState.ballHolder;
    if (!ballCarrier) return { shouldMark: false, shouldPress: false, x: activePosition.x, y: activePosition.y };

    // 1. TEHDİT ANALİZİ (Güncellenmiş fonksiyonları kullanır)
    const playerZone = getZoneForPlayer(player, activePosition, teamState);
    const allThreats = assessDefensiveThreats(player, opponents, ownGoalX); // Güncellenmiş assess
    const primaryThreat = findMostDangerousAttacker(player, allThreats, playerZone); // Güncellenmiş find
    
    const distToBallCarrier = getDistance(player, ballCarrier);

    // 2. PRES KARARI (Mevcut mantık korunur)
    const pressDistance = (teamState === 'HIGH_PRESS') ? 120 : (tactic.pressIntensity > 0.7 ? 100 : 80);
    const allDefenders = (player.isHome ? gameState.homePlayers : gameState.awayPlayers).filter(p => p.id !== player.id && p.role !== 'GK');
    const isClosestDefender = !allDefenders.some(p => getDistance(p, ballCarrier) < distToBallCarrier);

    if (distToBallCarrier < pressDistance && isClosestDefender) {
        // Topu taşıyan oyuncunun hafifçe önüne doğru koşarak pas yolunu kapat
        const targetX = ballCarrier.x + (ballCarrier.vx || 0) * 0.2;
        const targetY = ballCarrier.y + (ballCarrier.vy || 0) * 0.2;
        return { shouldMark: false, shouldPress: true, x: targetX, y: targetY };
    }

    // 3. MARK AJ KARARI (GELİŞTİRİLDİ)
    if (primaryThreat) {
     
        // YENİ: Markaj sıkılığına karar ver
        const distToGoal = Math.abs(primaryThreat.x - ownGoalX);
        
        // Tehlike bölgesi = kaleye 180 pikselden (yakl. 16 metre) daha yakın
        const inDangerZone = distToGoal < 180; 
        
        // Eğer tehdit tehlike bölgesindeyse VE oyuncu bir savunmacıysa, 'sıkı' markaj yap
        const tightness = (inDangerZone && ['CB', 'RB', 'LB'].includes(player.role)) 
                                        ? 'tight' 
                                        : 'goal_side';

        // Fonksiyonu yeni 'tightness' parametresiyle çağır
        const { x, y } = calculateOptimalMarkingPosition(player, primaryThreat, ownGoalX, tightness);
        
        return { shouldMark: true, shouldPress: false, x, y };
    }

    // 5. ZONAL SAVUNMA (Varsayılan):
    const { x, y } = applyDefensivePositioning(player, ball, tactic, activePosition, ownGoalX, teamState);
    return { shouldMark: false, shouldPress: false, x, y };
}

// playerAI.js dosyasında bu fonksiyonu bulun ve TAMAMEN DEĞİŞTİRİN
function applyDefensivePositioning(player, ball, tactic, activePosition, ownGoalX, teamState) {
    const ballDistToOwnGoal = Math.abs(ball.x - ownGoalX);
    const ballSideY = ball.y;
    const playerSideY = player.y;
    const isBallOnFarSide = Math.abs(ballSideY - playerSideY) > 300;
    const horizontalShift = (ball.y - 300) * 0.25; 
    const compression = teamState === 'DEFENDING' ? 0.6 : 0.7;

    let targetX = activePosition.x;
    let targetY = activePosition.y;

    // --- 1. Derinlik Ayarı (Tüm roller için) ---
    const retreatModifier = teamState === 'DEFENDING' ? 1.3 : 1.0;
    if (ballDistToOwnGoal < 300) {
        const retreatAmount = ((300 - ballDistToOwnGoal) / 3) * retreatModifier;
        const direction = ownGoalX < 400 ? -1 : 1;
        targetX = activePosition.x + direction * retreatAmount;
    }

    // --- 2. Yatay Kayma ve Kompaktlık (Role Göre) ---
    const playerRole = player.role;

    // ++++++++++ YENİ: CB BOŞLUĞUNU DİNAMİK DOLDURMA ++++++++++
    // Bu blok, "Zayıf Taraf" mantığından ÖNCE çalışır.
    if (['RB', 'LB'].includes(playerRole)) {
        const isRB = playerRole === 'RB';
        const centralDefenders = (player.isHome ? gameState.homePlayers : gameState.awayPlayers)
            .filter(p => p.role === 'CB' || p.role === 'LCB' || p.role === 'RCB');
        
        // Bana en yakın olan CB'yi bul
        const myNearestCB = centralDefenders.sort((a, b) => getDistance(a, player) - getDistance(b, player))[0];

        if (myNearestCB) {
            // CB'nin olması gereken X pozisyonu (dinamik yarı saha ayarlı)
            const cbHomeX = getPlayerActivePosition(myNearestCB, gameState.currentHalf).x;
            const cbCurrentX = myNearestCB.x; // CB'nin şu anki yeri
            
            // CB'nin ne kadar "sürüklendiğini" (pozisyonundan koptuğunu) hesapla
            const cbDisplacement = Math.abs(cbCurrentX - cbHomeX);
            
            // Eğer CB 100 birimden fazla sürüklendiyse (örn. ileri pres veya adam takibi)
            if (cbDisplacement > 100) {
                // CB'nin "olması gereken" pozisyonunu (homeX) koru
                targetX = cbHomeX + (isRB ? -30 : 30); // CB'nin yanına
                targetY = 300 + (isRB ? -60 : 60);     // Merkeze yakın
                
                // Hızla pozisyon al
                player.speedBoost = 1.3; 
                return { x: targetX, y: targetY }; // DİNAMİK KORUMA: Fonksiyondan hemen çık
            }
        }
    }
    // ++++++++++ YENİ MANTIĞIN SONU ++++++++++


    // (Eğer CB koruması gerekmiyorsa, normal zonal mantık devam eder)
    if (['RB', 'LB'].includes(playerRole) && isBallOnFarSide) {
        // ZAYIF TARAF BEKİ: Merkeze yaklaş (Tuck In)
        const centerBacks = (player.isHome ? gameState.homePlayers : gameState.awayPlayers).filter(p => p.role === 'CB');
        if (centerBacks.length > 0) {
            const nearestCB = centerBacks.sort((a, b) => getDistance(a, player) - getDistance(b, player))[0];
            targetX = nearestCB.x + (playerRole === 'RB' ? -30 : 30);
        }
        targetY = 300 + (playerRole === 'RB' ? -50 : 50); 
    
    } else if (['RM', 'LM', 'RW', 'LW'].includes(playerRole)) {
        // YENİ BLOK: Tüm kanat oyuncuları (Orta saha VE Forvet)
        const isRightSided = playerRole === 'RM' || playerRole === 'RW';
        
        if (isBallOnFarSide) {
            // ZAYIF TARAF KANAT: Merkeze yaklaş
            targetX = activePosition.x + (ownGoalX > 400 ? -30 : 30); 
            targetY = 300 + (isRightSided ? -80 : 80); 
        } else {
            // GÜÇLÜ TARAF KANAT: Topu takip et (Zonal)
            targetY = activePosition.y + horizontalShift * 1.5; 
            const direction = ownGoalX < 400 ? 1 : -1;
            targetX = activePosition.x + (direction * 50); 
        }

    } else if (['CB', 'CDM', 'CM'].includes(playerRole)) {
        // MERKEZ OYUNCULARI: Topla birlikte kayar ve daralır
        targetY = activePosition.y + horizontalShift;
        targetY = 300 + (targetY - 300) * compression; 

    } else if (playerRole === 'CAM') {
        // CAM: Kendi yarı sahasının önüne döner
        const direction = ownGoalX < 400 ? 1 : -1;
        targetX = (activePosition.x + (direction * 100)); 
        targetY = 300 + (ball.y - 300) * 0.3; 

    } else {
        // Diğer herkes (ST, CF, vb. ve topun kendi tarafında olan bekler)
        targetY = activePosition.y + horizontalShift;
    }

    return { x: targetX, y: targetY };
}


// playerAI.js



function applyAttackingMovement(player, holder, teammates, activePosition, opponentGoalX, teamState) {
    const opponents = player.isHome ? gameState.awayPlayers : gameState.homePlayers;
    const direction = Math.sign(opponentGoalX - player.x) || 1;
const ballOnOtherSide = (holder.y > 300 && player.y < 300) || (holder.y < 300 && player.y > 300);

    // Ofsayt tuzağına düşmemek için pozisyonunu kontrol et
    if (typeof shouldAvoidOffside === 'function' && shouldAvoidOffside(player, gameState.ballPosition, opponents)) {
        return { 
            x: player.x - direction * 20, // Ofsayttan çıkmak için hafifçe geri gel
            y: player.y, 
            speedBoost: 0.9, 
            shouldLock: true 
        };
    }
if (['LW', 'RW'].includes(player.role) && ballOnOtherSide && getDistance(holder, player) > 150) {
        return {
            x: opponentGoalX - direction * 60, // Ceza sahası içine veya önüne koş
            y: 300 + (player.y < 300 ? 50 : -50), // Merkeze doğru
            speedBoost: 1.3,
            shouldLock: true
        };
    }
    
    // 2. Beklerin Hücuma Katılması (Overlap)
    if (['RB', 'LB'].includes(player.role)) {
        const wingerOnMySide = teammates.find(t => 
            (player.role === 'RB' && t.role === 'RW') || (player.role === 'LB' && t.role === 'LW')
        );
        // Eğer kanat oyuncusu içe kat etmişse, bek onun boşalttığı alana koşu yapar.
        if (wingerOnMySide && Math.abs(wingerOnMySide.y - 300) < 100) {
             return {
                x: activePosition.x + direction * 100, // İleri bindirme
                y: activePosition.y, // Çizgide kal
                speedBoost: 1.25,
                shouldLock: true
            };
        }
    }

    // 3. Kanat Oyuncusunun Topla Birlikte İçeri Kat Etmesi
    if (holder.id === player.id && ['LW', 'RW', 'LM', 'RM'].includes(player.role)) {
        const goalCenterY = 300;
        // Hedefi sadece ileri değil, aynı zamanda kaleye doğru çapraz olarak belirle
        const targetX = player.x + direction * 70;
        const targetY = player.y + Math.sign(goalCenterY - player.y) * 40; // İçeri doğru
        return { x: targetX, y: targetY, speedBoost: 1.1, shouldLock: false };
    }
  
    const runOptions = [];
    const holderUnderPressure = opponents.some(o => getDistance(o, holder) < 70);

    // 1. Koşu Seçeneği: DESTEĞE GELME (Takım arkadaşı baskı altındaysa öncelikli)
    if (holderUnderPressure) {
        const supportTarget = { 
            x: holder.x - direction * 60, // Topu almak için geriye/yana gel
            y: holder.y + (player.y < 300 ? -70 : 70) 
        };
        const supportSpace = Math.min(...opponents.map(o => getDistance(o, supportTarget)));
        // Puan: Boş alan + Yüksek öncelik bonusu
        runOptions.push({ type: 'SUPPORT', target: supportTarget, score: supportSpace + 40 });
    }

    // 2. Koşu Seçeneği: DEFANS ARKASINA SIZMA (Forvet ve Kanatlar için)
    if (['ST', 'RW', 'LW', 'CAM'].includes(player.role)) {
        const lastDefender = opponents
             .filter(o => o.role !== 'GK')
             .sort((a, b) => direction * (b.x - a.x))[0];

        if (lastDefender) {
            const runTargetX = lastDefender.x + direction * 25; // Ofsayt çizgisinin hemen gerisi
            // ✅ FIX: Use activePosition.y instead of random to prevent oscillation
            // Random Y causes target to change every frame, making forwards move back and forth
            const runTargetY = activePosition.y;
            const runTarget = { x: runTargetX, y: runTargetY };
            
            const spaceRating = Math.min(...opponents.map(o => getDistance(o, runTarget)));
            const pathClear = !opponents.some(o => typeof pointToLineDistance === 'function' && pointToLineDistance(o, holder, runTarget) < 25);

            if (pathClear) {
                // Puan: Boş alan + Yaratıcılık bonusu
                runOptions.push({ type: 'THROUGH', target: runTarget, score: spaceRating * 1.2 + (player.passing / 100 * 20) });
            }
        }
    }

    // 3. Koşu Seçeneği: BOŞ KORİDORA GİRME (Varsayılan ileri hareket)
    const spaceRunTarget = { x: activePosition.x + direction * 70, y: activePosition.y };
    const spaceRating = Math.min(...opponents.map(o => getDistance(o, spaceRunTarget)));
    runOptions.push({ type: 'SPACE', target: spaceRunTarget, score: spaceRating });

    // En iyi koşu seçeneğini bul
    const bestRun = runOptions.sort((a, b) => b.score - a.score)[0];

    // Sadece faydalı ve yeterince yüksek puanlı bir koşu varsa gerçekleştir
    if (bestRun && bestRun.score > 50) {
        return {
            x: bestRun.target.x,
            y: bestRun.target.y,
            speedBoost: (bestRun.type === 'THROUGH') ? 1.4 : 1.15,
            shouldLock: true // Bu hedefe bir süreliğine kilitlen
        };
    }

   let finalMove = { x: activePosition.x, y: activePosition.y, speedBoost: 1.0, shouldLock: false };

    // Eğer en iyi koşu seçeneği varsa, onu finalMove olarak ata
    if (bestRun && bestRun.score > 50) {
        finalMove = {
            x: bestRun.target.x,
            y: bestRun.target.y,
            speedBoost: (bestRun.type === 'THROUGH') ? 1.4 : 1.15,
            shouldLock: true
        };
    }

    // --- YENİ: CM - ST MESAFE KONTROLÜ ---
    if (player.role === 'CM' || player.role === 'CAM') {
        const striker = teammates.find(t => t.role === 'ST');
        if (striker) {
            const distToStriker = getDistance({x: finalMove.x, y: finalMove.y}, striker);
            if (distToStriker < 80) { // Eğer forvete 80 birimden daha yakın olacaksa
                const angleAwayFromStriker = Math.atan2(finalMove.y - striker.y, finalMove.x - striker.x);
                finalMove.x += Math.cos(angleAwayFromStriker) * 20; // Hafifçe uzaklaş
                finalMove.y += Math.sin(angleAwayFromStriker) * 20;
            }
        }
    }
    
    return finalMove;
}
