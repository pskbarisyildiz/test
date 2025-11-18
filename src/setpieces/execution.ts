/**
 * Set Piece Execution Module
 * @migrated-from js/setpieces/setPieceExecution.js
 *
 * This module handles the execution of all set pieces:
 * - Corner kicks (enhanced)
 * - Free kicks (enhanced)
 * - Throw-ins (enhanced)
 * - Goal kicks (enhanced)
 * - Kick-offs (enhanced)
 * - Router for dispatching set piece execution
 */

import type { GameState, Player } from '../types';
import { distance as getDistance } from '../utils/math';
import { getAttackingGoalX } from '../utils/ui';
import { getSafeStat } from './utils';
import { assignSetPieceKicker, executeSetPiece_PostExecution } from './integration';
import { passBall } from '../ai/decisions';
import { GAME_CONFIG } from '../config';

// ============================================================================
// ENHANCED CORNER KICK EXECUTION
// ============================================================================

export function executeCornerKick_Enhanced(gameState: GameState): boolean {
    if (!gameState || !gameState.setPiece || !gameState.setPiece.position) return false;
    const setPiece = gameState.setPiece;

    // Validate ball position
    if (!isFinite(setPiece.position.x) || !isFinite(setPiece.position.y)) {
        console.error("❌ Corner Kick: Invalid ball position detected, aborting");
        return false;
    }

    const takingTeam = setPiece.team;
    // Takım oyuncularını gameState'den al
    const allPlayers = [...(gameState.homePlayers || []), ...(gameState.awayPlayers || [])];
    // ✅ FIXED: Normalize team value to boolean for comparison
    const takingTeamIsHome = (typeof takingTeam === 'boolean') ? takingTeam : (takingTeam === 'home');
    const takingTeamPlayers = allPlayers.filter(p => p && p.isHome === takingTeamIsHome);
    if (takingTeamPlayers.length === 0) return false;

    const opponentGoalX = getAttackingGoalX(takingTeamIsHome, gameState.currentHalf);
    const routine = (setPiece as any).routine || 'standard'; // 'cornerRoutine' yerine

    // En iyi korner atıcısını seç (realStats veya base stats kullan)
    const taker = takingTeamPlayers
        .filter(p => p.role !== 'GK')
        .sort((a, b) => {
            const aSkill = getSafeStat(a.realStats, 'crossesAccuracy', a.passing || 50) + (a.passing || 50);
            const bSkill = getSafeStat(b.realStats, 'crossesAccuracy', b.passing || 50) + (b.passing || 50);
            return bSkill - aSkill;
        })[0];

   if (!taker) {
       assignSetPieceKicker(null);
       console.warn("Korner: Atıcı bulunamadı.");
       return false;
   }

   assignSetPieceKicker(taker);

    let targetX: number, targetY: number, speed: number, accuracy: number;
    const isRightCorner = setPiece.position.y < (GAME_CONFIG.PITCH_HEIGHT / 2 || 300);
    const direction = Math.sign(opponentGoalX - (GAME_CONFIG.PITCH_WIDTH / 2 || 400));
    const goalYTop = GAME_CONFIG.GOAL_Y_TOP || 240;
    const goalYBottom = GAME_CONFIG.GOAL_Y_BOTTOM || 360;
    const pitchHeight = GAME_CONFIG.PITCH_HEIGHT || 600;

    switch (routine) {
        case 'short':
            const shortTarget = takingTeamPlayers
                .filter(p => String(p.id) !== String(taker.id) && p.role !== 'GK')
                .sort((a, b) => getDistance(a, setPiece.position) - getDistance(b, setPiece.position))[0];
            if (shortTarget) {
                targetX = shortTarget.x; targetY = shortTarget.y; speed = 420; accuracy = 0.95;
            } else { // Kısa pas hedefi yoksa standarda dön
                targetX = opponentGoalX - direction * 110; targetY = pitchHeight / 2; speed = 650; accuracy = 0.80;
            }
            break;
        case 'inswinger':
            targetX = opponentGoalX - direction * 28; targetY = isRightCorner ? goalYTop + 20 : goalYBottom - 20; speed = 680; accuracy = 0.78;
            break;
        case 'outswinger':
            targetX = opponentGoalX - direction * 32; targetY = isRightCorner ? goalYBottom - 10 : goalYTop + 10; speed = 700; accuracy = 0.76;
            break;
        default: // standard
            targetX = opponentGoalX - direction * 110; targetY = pitchHeight / 2; speed = 650; accuracy = 0.80;
    }

    // Yetenek bazlı isabet ayarı
    const skillModifier = getSafeStat(taker.realStats, 'crossesAccuracy', taker.passing || 50) / 100;
    accuracy *= (0.7 + skillModifier * 0.3);

    if (typeof passBall === 'function') {
        passBall(taker, setPiece.position.x, setPiece.position.y, targetX, targetY, accuracy, speed, false); // `false` = pas (şut değil)
        console.log(`⚽ Corner executed: ${routine} by ${taker.name}`);
        return true;
    } else { console.error("executeCornerKick: passBall function not found!"); }

    return false;
}

// ============================================================================
// ENHANCED FREE KICK EXECUTION
// ============================================================================

export function executeFreeKick_Enhanced(gameState: GameState): boolean {
    if (!gameState || !gameState.setPiece || !gameState.setPiece.position) return false;
    const setPiece = gameState.setPiece;

    // Validate ball position
    if (!isFinite(setPiece.position.x) || !isFinite(setPiece.position.y)) {
        console.error("❌ Free Kick: Invalid ball position detected, aborting");
        return false;
    }

    const takingTeam = setPiece.team;
    const allPlayers = [...(gameState.homePlayers || []), ...(gameState.awayPlayers || [])];
    // ✅ FIXED: Normalize team value to boolean for comparison
    const takingTeamIsHome = (typeof takingTeam === 'boolean') ? takingTeam : (takingTeam === 'home');
    const takingTeamPlayers = allPlayers.filter(p => p && p.isHome === takingTeamIsHome);
    const opponents = allPlayers.filter(p => p && p.isHome !== takingTeamIsHome);
    if (takingTeamPlayers.length === 0) return false;

    const opponentGoalX = getAttackingGoalX(takingTeamIsHome, gameState.currentHalf);
    const distToGoal = getDistance(setPiece.position, {x: opponentGoalX, y: 300}); // Mesafeyi hedefe göre hesapla
    const angleToGoal = Math.abs(setPiece.position.y - 300);

    // En iyi serbest vuruşçuyu seç (realStats veya base stats kullan)
    const taker = takingTeamPlayers
        .filter(p => p.role !== 'GK')
        .sort((a, b) => {
             // 'freekicks' verisi yok, 'shooting' ve 'passing' kullanılıyor
            const aSkill = (a.shooting || 50) + (a.passing || 50);
            const bSkill = (b.shooting || 50) + (b.passing || 50);
            return bSkill - aSkill;
        })[0];

   if (!taker) {
       assignSetPieceKicker(null);
       console.warn("Serbest Vuruş: Atıcı bulunamadı.");
       return false;
   }

   assignSetPieceKicker(taker);

    const isShootingRange = distToGoal < 280;
    const isGoodAngle = angleToGoal < 130;

    // Barajı tespit et (yaklaşık 10 yarda = 92px)
    const wallPlayers = opponents.filter(p => {
        const distToFK = getDistance(p, setPiece.position);
        return distToFK > 80 && distToFK < 105; // Biraz daha geniş aralık
    });
    const hasWall = wallPlayers.length >= ((gameState as any)._currentWallSize || 3); // Kurulumdaki baraj boyutunu kontrol et

    if (isShootingRange && isGoodAngle) {
        // ŞUT DENEMESİ
        const shootingSkill = (taker.shooting || 50) / 100;
        const shootingChance = shootingSkill * (hasWall ? 0.55 : 0.82) * (distToGoal < 200 ? 1.1 : 0.9); // Yakınsa şans artar

        if (Math.random() < shootingChance) {
            let targetY = 300;
            const goalYTop = GAME_CONFIG.GOAL_Y_TOP || 240;
            const goalYBottom = GAME_CONFIG.GOAL_Y_BOTTOM || 360;

            if (hasWall && wallPlayers.length > 0) {
                // Barajı geçmek için köşelere nişan al
                const wallYs = wallPlayers.map(p => p.y);
                const wallTop = Math.min(...wallYs);
                const wallBottom = Math.max(...wallYs);
                const wallCenterY = (wallTop + wallBottom) / 2;

                // Barajın üstünden veya yanından
                if (Math.random() < 0.6) { // %60 üstünden
                     targetY = wallCenterY > 300 ? goalYTop + 10 : goalYBottom - 10; // Üst köşe
                } else { // %40 yanından
                    targetY = wallCenterY > 300 ? wallBottom + 25 : wallTop - 25; // Barajın bittiği yer
                    targetY = Math.max(goalYTop + 5, Math.min(goalYBottom - 5, targetY)); // Kale içinde kal
                }
                targetY += (Math.random() - 0.5) * 30; // Hafif sapma ekle

            } else {
                // Baraj yok - köşelere veya ortaya nişan al
                const options = [goalYTop + 15, 300, goalYBottom - 15];
                targetY = options[Math.floor(Math.random() * options.length)] || 300;
                targetY += (Math.random() - 0.5) * 25;
            }

            // Gücü mesafeye göre ayarla
            const powerFactor = Math.min(distToGoal / 220, 1.3); // 220px referans mesafe
            const speed = 700 + powerFactor * 200; // Daha güçlü şutlar
            const accuracy = 0.65 + shootingSkill * 0.20 - (hasWall ? 0.12 : 0); // İsabet barajdan daha çok etkilenir

            if (typeof passBall === 'function') {
                passBall(taker, setPiece.position.x, setPiece.position.y,
                        opponentGoalX, targetY, accuracy, speed, true); // `true` = şut
                console.log(`⚽ Free Kick SHOT by ${taker.name}`);
                return true;
            } else { console.error("executeFreeKick (Shot): passBall function not found!"); }
        }
    }

    // PAS VERME
    // Daha akıllı hedef seçimi: Boşluk + kaleye yakınlık
    const targets = takingTeamPlayers
        .filter(p => String(p.id) !== String(taker.id) && p.role !== 'GK')
        .map(t => {
            const distToTargetGoal = getDistance(t, {x: opponentGoalX, y: 300});
            const space = opponents.length > 0
                ? Math.min(100, ...opponents.map(o => getDistance(o, t)))
                : 100; // No opponents = max space
            // Çok yakındaki hedefleri daha az tercih et (zor pas)
            const distPenalty = Math.max(0, 30 - getDistance(t, setPiece.position));
            return {
                player: t,
                score: (400 - distToTargetGoal) + space * 1.5 - distPenalty // Boşluğa daha çok önem ver
            };
        })
        .filter(t => t.score > 0) // Negatif skorluları ele
        .sort((a, b) => b.score - a.score);

    const target = targets[0]?.player;

    if (target && typeof passBall === 'function') {
        const passAccuracy = 0.85 + getSafeStat(taker.realStats, 'passAccuracy', taker.passing || 70) / 300;
        const passSpeed = 450 + distToGoal / 3; // Mesafeye göre hız
        passBall(taker, setPiece.position.x, setPiece.position.y,
                target.x, target.y, passAccuracy, passSpeed, false); // `false` = pas
        console.log(`⚽ Free Kick PASS by ${taker.name} to ${target.name}`);
        return true;
    } else { console.warn("Serbest Vuruş: Pas hedefi bulunamadı."); }

    return false;
}

// ============================================================================
// ENHANCED THROW-IN EXECUTION
// ============================================================================

export function executeThrowIn_Enhanced(gameState: GameState): boolean {
    if (!gameState || !gameState.setPiece || !gameState.setPiece.position) return false;
    const setPiece = gameState.setPiece;

    // Validate ball position
    if (!isFinite(setPiece.position.x) || !isFinite(setPiece.position.y)) {
        console.error("❌ Throw In: Invalid ball position detected, aborting");
        return false;
    }

    const takingTeam = setPiece.team;
    const allPlayers = [...(gameState.homePlayers || []), ...(gameState.awayPlayers || [])];
    // ✅ FIXED: Normalize team value to boolean for comparison
    const takingTeamIsHome = (typeof takingTeam === 'boolean') ? takingTeam : (takingTeam === 'home');
    const takingTeamPlayers = allPlayers.filter(p => p && p.isHome === takingTeamIsHome);
    const opponents = allPlayers.filter(p => p && p.isHome !== takingTeamIsHome);
    if (takingTeamPlayers.length === 0) return false;

    // FIXED: Prefer fullbacks/wingbacks for throw-ins (professional positioning)
    // First try pre-assigned thrower from setup, then prioritize wide defenders
    let thrower = takingTeamPlayers.find(p =>
        (gameState as any)._throwInAssignments?.get(String(p.id))?.role === 'THROWER'
    );

    if (!thrower) {
        // Prioritize fullbacks and wingbacks (best for throw-ins)
        const wideDefenders = takingTeamPlayers.filter(p =>
            ['RB', 'LB', 'RWB', 'LWB'].some(role => p.role.includes(role))
        );

        if (wideDefenders.length > 0) {
            // Pick closest wide defender to throw position
            thrower = wideDefenders.sort((a, b) =>
                getDistance(a, setPiece.position) - getDistance(b, setPiece.position)
            )[0];
        } else {
            // Fallback: any outfield player (except GK)
            thrower = takingTeamPlayers
                .filter(p => p.role !== 'GK')
                .sort((a, b) => getDistance(a, setPiece.position) - getDistance(b, setPiece.position))[0];
        }
    }

   if (!thrower) {
       assignSetPieceKicker(null);
       console.warn("Taç: Atıcı bulunamadı.");
       return false;
   }

   assignSetPieceKicker(thrower);

    // En iyi alıcıyı bul (Boşluk + Yakınlık)
    const receivers = takingTeamPlayers
        .filter(p => String(p.id) !== String(thrower.id) && p.role !== 'GK')
        .map(p => {
            const distToThrower = getDistance(p, setPiece.position);
            const space = Math.min(100, ...opponents.map(o => getDistance(o, p))); // Max 100px boşluk
            const inRange = distToThrower < 180; // Biraz daha uzun atış menzili

            // Açık alandaki oyuncuları ve kısa opsiyonları önceliklendir
            let score = 0;
            if (inRange) {
                 score = space * 2.5 - distToThrower * 0.5;
                 // Kısa pas opsiyonuna bonus
                 if ((gameState as any)._throwInAssignments?.get(String(p.id))?.role === 'SHORT_OPTION') {
                     score += 50;
                 }
            }
            return { player: p, score: score };
        })

        .sort((a, b) => b.score - a.score);

    const target = receivers[0]?.player;

    if (target && typeof passBall === 'function') {
        const dist = getDistance(setPiece.position, target); // Atış pozisyonundan hedefe uzaklık
        const throwPower = 300 + dist * 1.5; // Mesafeye göre güç ayarı
        const accuracy = 0.90 + (thrower.physicality || 60) / 500; // Fizik gücüne hafif bağlı isabet
        passBall(thrower, setPiece.position.x, setPiece.position.y,
                target.x, target.y, accuracy, Math.min(throwPower, 600), false); // Max hız 600
        console.log(`⚽ Throw-in by ${thrower.name} to ${target.name}`);
        return true;
    } else { console.warn("Taç: Uygun alıcı bulunamadı."); }

    return false;
}

// ============================================================================
// ENHANCED GOAL KICK EXECUTION
// ============================================================================

export function executeGoalKick_Enhanced(gameState: GameState): boolean {
    // --- 1. SETUP (Gerekli) ---
    if (!gameState || !gameState.setPiece || !gameState.setPiece.position) {
        console.warn("⚠️ Goal Kick: Invalid game state or setPiece");
        return false;
    }
    const setPiece = gameState.setPiece;
    const takingTeam = setPiece.team;
    const allPlayers = [...(gameState.homePlayers || []), ...(gameState.awayPlayers || [])];
    // ✅ FIXED: Normalize team value to boolean for comparison
    const takingTeamIsHome = (typeof takingTeam === 'boolean') ? takingTeam : (takingTeam === 'home');
    const takingTeamPlayers = allPlayers.filter(p => p && p.isHome === takingTeamIsHome);
    const opponents = allPlayers.filter(p => p && p.isHome !== takingTeamIsHome);

    if (takingTeamPlayers.length === 0) {
        console.warn("⚠️ Goal Kick: No players for taking team");
        return false;
    }

    const goalkeeper = takingTeamPlayers.find(p => p.role === 'GK');

    if (!goalkeeper) {
        console.error("❌ Goal Kick: Goalkeeper not found");
        assignSetPieceKicker(null);
        return false;
    }

    // ✅ FIX #5: CRITICAL - Assign ball holder BEFORE kicking
    gameState.ballHolder = goalkeeper;
    goalkeeper.hasBallControl = true;
    goalkeeper.ballReceivedTime = Date.now();
    assignSetPieceKicker(goalkeeper);

    // ✅ FIX #6: CRITICAL - Validate ball position before execution
    if (!isFinite(setPiece.position.x) || !isFinite(setPiece.position.y)) {
        console.error("❌ Goal Kick: Invalid ball position detected, resetting");
        const ownGoalX = getAttackingGoalX(!takingTeamIsHome, gameState.currentHalf);
        const direction = Math.sign(400 - ownGoalX);
        setPiece.position.x = ownGoalX + direction * 70;
        setPiece.position.y = 300;
        gameState.ballPosition.x = setPiece.position.x;
        gameState.ballPosition.y = setPiece.position.y;
    }
    gameState.ballVelocity = { x: 0, y: 0 };

    if (typeof passBall !== 'function') {
        console.error("❌ Goal Kick: passBall function not available");
        return false;
    }


    const opponentGoalX = getAttackingGoalX(takingTeamIsHome, gameState.currentHalf);
    const direction = Math.sign(opponentGoalX - 400);

    // playShort bilgisini setPiece'den al
    const playShort = (setPiece as any).playShort !== false;

    console.log(`⚽ Goal Kick: ${playShort ? 'Kısa' : 'Uzun'} oyun planı`);

    if (playShort && Math.random() < 0.75) {
        // KISA PAS SENARYOSU
        const shortTargets = takingTeamPlayers
            .filter(p => p.role !== 'GK' && String(p.id) !== String(goalkeeper.id))
            .map(p => {
                const dist = getDistance(p, setPiece.position);
                const space = Math.min(120, ...opponents.map(o => getDistance(o, p)));
                const inShortRange = dist < 260;

                let score = 0;
                if (inShortRange) {
                    score = space * 2.0 - dist * 0.3;
                    if (['CB', 'RB', 'LB', 'CDM'].includes(p.role)) {
                        score += 40;
                    }
                }
                return { player: p, score: score, space: space };
            })
            .filter(t => t.score > 15)
            .sort((a, b) => b.score - a.score);

        if (shortTargets.length > 0 && shortTargets[0] && shortTargets[0].space > 30) {
            const target = shortTargets[0].player;
            const accuracy = 0.92 + getSafeStat(goalkeeper.realStats, 'passAccuracy', 70) / 400;
            const speed = 380 + getDistance(setPiece.position, target) * 1.2;

            passBall(goalkeeper, setPiece.position.x, setPiece.position.y,
                    target.x, target.y, accuracy, Math.min(speed, 550), false);
            console.log(`⚽ Goal Kick SHORT PASS by ${goalkeeper.name} to ${target.name}`);
            return true;
        }
    }

    // UZUN TOP SENARYOSU - PROFESSIONAL: Prioritize strikers for aerial duels
    const midX = 400;
    const longTargets = takingTeamPlayers
        .filter(p => p.role !== 'GK' && String(p.id) !== String(goalkeeper.id))
        .map(p => {
            const distToOpponentGoal = Math.abs(p.x - opponentGoalX);
            const space = Math.min(100, ...opponents.map(o => getDistance(o, p)));
            const isForward = distToOpponentGoal < 350;

            let score = 0;
            if (Math.abs(p.x - midX) < 200 || isForward) {
                score = space * 1.8 + (isForward ? 50 : 0);

                // FIXED: Prioritize strikers first for long balls (aerial duels)
                if (['ST', 'CF'].some(role => p.role.includes(role))) {
                    score += 120; // HIGHEST priority for strikers
                } else if (['RW', 'LW', 'CAM', 'LM', 'RM'].includes(p.role)) {
                    score += 70; // Attacking players second
                } else if (['CM', 'CDM'].includes(p.role)) {
                    score += 30; // Midfielders last resort
                }

                // Heading ability is crucial for long balls
                const physicalBonus = getSafeStat(p.realStats, 'heading', p.physicality || 60) / 8;
                score += physicalBonus;
            }

            return { player: p, score: score };
        })
        .filter(t => t.score > 0)
        .sort((a, b) => b.score - a.score);

    let targetX: number, targetY: number, target: Player | null = null;

    if (longTargets.length > 0 && longTargets[0] && Math.random() < 0.7) {
        target = longTargets[0].player;
        if (target) {
            targetX = target.x + direction * 20;
            targetY = target.y + (Math.random() - 0.5) * 25;
        } else {
            targetX = midX + direction * (Math.random() * 120 + 80);
            targetY = 300 + (Math.random() * 180 - 90);
        }
    } else {
        targetX = midX + direction * (Math.random() * 120 + 80);
        targetY = 300 + (Math.random() * 180 - 90);
    }

    const longBallSkill = getSafeStat(goalkeeper.realStats, 'longBallAccuracy', 50);
    const accuracy = 0.55 + (longBallSkill / 250);
    const speed = 800 + Math.random() * 150;

    passBall(goalkeeper, setPiece.position.x, setPiece.position.y,
             targetX, targetY, accuracy, speed, false);

    const targetInfo = target ? ` to ${target.name}` : ' to midfield';
    console.log(`⚽ Goal Kick LONG BALL by ${goalkeeper.name}${targetInfo}`);
    return true;
}

// ============================================================================
// ENHANCED KICK-OFF EXECUTION
// ============================================================================

export function executeKickOff_Enhanced(gameState: GameState): boolean {
    if (!gameState || !gameState.setPiece) {
        console.warn("⚠️ Kick-off: Invalid game state or setPiece");
        return false;
    }

    // Validate and ensure ball position (kickoff is always at center)
    if (!gameState.ballPosition || !isFinite(gameState.ballPosition.x) || !isFinite(gameState.ballPosition.y)) {
        console.warn("⚠️ Kick-off: Invalid ball position, resetting to center");
        gameState.ballPosition = { x: 400, y: 300 };
    }

    const takingTeam = gameState.setPiece.team;
    const allPlayers = [...(gameState.homePlayers || []), ...(gameState.awayPlayers || [])];
    const takingTeamIsHome = (typeof takingTeam === 'boolean') ? takingTeam : (takingTeam === 'home');
    const takingTeamPlayers = allPlayers.filter(p => p && p.isHome === takingTeamIsHome);

    if (takingTeamPlayers.length === 0) {
        console.warn("⚠️ Kick-off: No players for taking team");
        return false;
    }

    // ✅ FIX #1: Find kicker with better priority logic
    const kicker = takingTeamPlayers
        .filter(p => p.role !== 'GK')
        .filter(p => ['ST', 'RW', 'LW', 'CAM', 'CM', 'CDM'].includes(p.role))
        .sort((a, b) => getDistance(a, {x: 400, y: 300}) - getDistance(b, {x: 400, y: 300}))[0];

    if (!kicker) {
        console.error("❌ Kick-off: No suitable kicker found");
        assignSetPieceKicker(null);
        return false;
    }

    // ✅ FIX #2: CRITICAL - Assign ball holder BEFORE passing
    gameState.ballHolder = kicker;
    kicker.hasBallControl = true;
    kicker.ballReceivedTime = Date.now();
    assignSetPieceKicker(kicker);

    const passTarget = takingTeamPlayers
        .filter(p => p.id !== kicker.id && p.role !== 'GK')
        .sort((a, b) => getDistance(a, kicker) - getDistance(b, kicker))[0];

    // ✅ FIX #3: CRITICAL - Ensure ball position is valid before passing
    if (!isFinite(gameState.ballPosition.x) || !isFinite(gameState.ballPosition.y)) {
        console.error("❌ Kick-off: Invalid ball position detected, resetting to center");
        gameState.ballPosition = { x: 400, y: 300 };
    }
    gameState.ballVelocity = { x: 0, y: 0 };

    if (!passTarget) {
        console.warn("⚠️ Kick-off: No pass target, dribbling forward");
        // If no target, move ball forward slightly to start play
        const opponentGoalX = getAttackingGoalX(takingTeamIsHome, gameState.currentHalf);
        const direction = Math.sign(opponentGoalX - 400);
        gameState.ballVelocity = { x: direction * 2, y: 0 };
        return true;
    }

    // ✅ FIX #4: Ensure passBall function exists before calling
    if (typeof passBall !== 'function') {
        console.error("❌ Kick-off: passBall function not available, manual pass");
        // Manual pass simulation as fallback
        const dx = passTarget.x - 400;
        const dy = passTarget.y - 300;
        const dist = Math.hypot(dx, dy);
        const speed = 350;
        gameState.ballVelocity = { x: (dx / dist) * speed / 60, y: (dy / dist) * speed / 60 };
        gameState.ballTrajectory = {
            startX: 400,
            startY: 300,
            endX: passTarget.x,
            endY: passTarget.y,
            startTime: Date.now(),
            duration: (dist / speed) * 1000,
            maxHeight: 0,
            isShot: false,
            passType: 'ground' as const,
            passQuality: 0.98,
            dist: dist,
            speed: speed
        };
        return true;
    }

    // ✅ Normal execution with passBall
    passBall(kicker, 400, 300, passTarget.x, passTarget.y, 0.98, 350, false);

    // ✅ FIX: Set calmness period after kick-off to prevent immediate aggressive actions
    // Players should settle into play gradually, not immediately shoot or make wild passes
    (gameState as any).kickOffCompletedTime = Date.now();
    (gameState as any).postKickOffCalmPeriod = true;

    console.log(`⚽ Kick-off executed successfully by ${kicker.name} to ${passTarget.name} - Calm period active`);
    return true;
}

// ============================================================================
// SET PIECE ROUTER
// ============================================================================

export function executeSetPiece_Router(gameState: GameState): void {
    if (!gameState || !gameState.setPiece) {
        console.warn("⚠️ Set Piece Router: Invalid game state or setPiece");
        return;
    }

    // ✅ FIX #7: Prevent duplicate execution
    if ((gameState.setPiece as any).executed || (gameState as any).setPieceExecuting) {
        return; // Already executed or currently executing
    }

    const status = gameState.status;
    let success = false;

    // ✅ FIX #8: Ensure execution flag is ALWAYS cleared with try-finally
    try {
        // Set execution flag
        (gameState as any).setPieceExecuting = true;

        // ✅ FIX #9: Validate game state before execution
        if (!gameState.ballPosition || !isFinite(gameState.ballPosition.x) || !isFinite(gameState.ballPosition.y)) {
            console.error(`❌ Set Piece Router: Invalid ball position before ${status}`);
            gameState.ballPosition = gameState.setPiece.position || { x: 400, y: 300 };
        }

        switch (status) {
            case 'CORNER_KICK':
                success = executeCornerKick_Enhanced(gameState);
                break;
            case 'FREE_KICK':
                success = executeFreeKick_Enhanced(gameState);
                break;
            case 'THROW_IN':
                success = executeThrowIn_Enhanced(gameState);
                break;
            case 'KICK_OFF':
                success = executeKickOff_Enhanced(gameState);
                break;
            case 'GOAL_KICK':
                success = executeGoalKick_Enhanced(gameState);
                break;
            case 'PENALTY':
                // Penalty uses its own system
                (gameState as any).setPieceExecuting = false;
                return;
            default:
                console.warn(`⚠️ Unknown set piece type: ${status}`);
                success = false;
        }
    } catch (e) {
        console.error(`❌ CRITICAL ERROR during set piece execution (${status}):`, e);
        console.error((e as Error).stack);
        success = false;
    } finally {
        // ✅ FIX #10: ALWAYS clear execution flag, even on error
        if (!success) {
            (gameState as any).setPieceExecuting = false;
            // If execution failed, immediately transition to playing to avoid stuck state
            console.error(`❌ Set piece ${status} execution failed, transitioning to playing`);
            gameState.status = 'playing';
            gameState.setPiece = null;
        }
    }

    if (success) {
        // Only proceed to post-execution cleanup if successful
        executeSetPiece_PostExecution();
    }
}

// ============================================================================
// BROWSER EXPORTS
// ============================================================================
// Functions are now exported via ES6 modules - no window exports needed
