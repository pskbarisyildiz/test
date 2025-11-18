import type { Player } from '../types';
import { getDistance, pointToLineDistance, getAttackingGoalX } from '../utils/ui';
import { gameState } from '../globalExports';
import { TACTICS } from '../config';

export const VISION_CONFIG = {
    // Vision angles (in radians)
    NORMAL_VISION_ANGLE: Math.PI * 0.9,      // 162Â° (0.9Ï€)
    BALL_CARRIER_ANGLE: Math.PI * 0.75,      // 135Â° (narrower when dribbling)
    UNDER_PRESSURE_ANGLE: Math.PI * 0.6,     // 108Â° (tunnel vision under pressure)

    // Vision ranges
    MAX_VISION_RANGE: 300,                    // pixels
    PERIPHERAL_RANGE: 200,                    // Reduced detail in periphery

    // Scan frequency (how often players "check shoulder")
    SCAN_INTERVAL_MIN: 800,                   // ms
    SCAN_INTERVAL_MAX: 2000,                  // ms
    SCAN_DURATION: 300,                       // ms (time spent looking around)

    // Ball is always visible (within reason)
    BALL_ALWAYS_VISIBLE_RANGE: 400,

    // Awareness modifiers
    VISION_STAT_BONUS: 0.15,                  // Better players see more
    COMPOSURE_BONUS: 0.1                      // Composure helps under pressure
};

export function getPlayerFacingDirection(player: Player): number {
    if (player.role === 'GK') {
        if (player.vx !== 0 || player.vy !== 0) {
            const speed = Math.sqrt(player.vx * player.vx + player.vy * player.vy);
            if (speed > 10) {
                return Math.atan2(player.vy, player.vx);
            }
        }
        if (gameState.ballPosition) {
            const distToBall = getDistance(player, gameState.ballPosition);
            if (distToBall < 350) {
                return Math.atan2(
                    gameState.ballPosition.y - player.y,
                    gameState.ballPosition.x - player.x
                );
            }
        }
        const opponentGoalX = getAttackingGoalX(player.isHome, gameState.currentHalf);
        return Math.atan2(
            300 - player.y,
            opponentGoalX - player.x
        );
    }
    if (player.vx !== 0 || player.vy !== 0) {
        const speed = Math.sqrt(player.vx * player.vx + player.vy * player.vy);
        if (speed > 10) {
            return Math.atan2(player.vy, player.vx);
        }
    }

    if (gameState.ballPosition && !player.hasBallControl) {
        return Math.atan2(
            gameState.ballPosition.y - player.y,
            gameState.ballPosition.x - player.x
        );
    }

    const opponentGoalX = getAttackingGoalX(player.isHome, gameState.currentHalf);
    return Math.atan2(
        300 - player.y,
        opponentGoalX - player.x
    );
}

export function canPlayerSee(player: Player, target: { x: number, y: number, id?: string | number, isVisibleTo?: { [key: string]: boolean } }, detailLevel = 'full'): boolean {
    // Distance check
    const distance = getDistance(player, target);

    // Ball is always visible at close range
    if (target === gameState.ballPosition && distance < VISION_CONFIG.BALL_ALWAYS_VISIBLE_RANGE) {
        return true;
    }

    // Check if within maximum vision range
    const maxRange = detailLevel === 'peripheral' ?
        VISION_CONFIG.PERIPHERAL_RANGE :
        VISION_CONFIG.MAX_VISION_RANGE;

    if (distance > maxRange) {
        return false;
    }

    // Calculate angle to target
    const angleToTarget = Math.atan2(
        target.y - player.y,
        target.x - player.x
    );

    // Get player's facing direction
    const facingAngle = (player as any).facingAngle || getPlayerFacingDirection(player);

    // Calculate angle difference (handle wraparound)
    let angleDiff = Math.abs(angleToTarget - facingAngle);
    if (angleDiff > Math.PI) {
        angleDiff = 2 * Math.PI - angleDiff;
    }

    // Determine vision cone based on player state
    let visionAngle = VISION_CONFIG.NORMAL_VISION_ANGLE;

    // Ball carrier has narrower vision
    if (player.hasBallControl) {
        visionAngle = VISION_CONFIG.BALL_CARRIER_ANGLE;
    }

    // Under pressure? Even narrower
    const nearbyOpponents = [...gameState.homePlayers, ...gameState.awayPlayers]
        .filter(p => p.isHome !== player.isHome && getDistance(player, p) < 50);

    if (nearbyOpponents.length > 1) {
        visionAngle = VISION_CONFIG.UNDER_PRESSURE_ANGLE;
    }

    // Apply player skill modifiers
    const awarenessBonus = (player.passing / 100) * VISION_CONFIG.VISION_STAT_BONUS;
    visionAngle *= (1 + awarenessBonus);

    // Is target within vision cone?
    const inVisionCone = angleDiff < (visionAngle / 2);

    // Store visibility info for debugging
    if (target.id) {
        target.isVisibleTo = target.isVisibleTo || {};
        target.isVisibleTo[player.id] = inVisionCone;
    }

    return inVisionCone;
}

export function updatePlayerScanning(player: Player): void {
    const now = Date.now();

    if (!(player as any).scanState) {
        (player as any).scanState = {
            lastScanTime: now,
            nextScanTime: now + Math.random() * VISION_CONFIG.SCAN_INTERVAL_MAX,
            isScanning: false,
            scanStartTime: 0,
            originalFacingAngle: 0
        };
    }

    const scan = (player as any).scanState;

    // FIX: If player gains ball control while scanning, immediately stop the scan.
    if (player.hasBallControl && scan.isScanning) {
        scan.isScanning = false;
        (player as any).facingAngle = scan.originalFacingAngle;
        return;
    }

    const scanFrequency = 1 - (player.passing / 100) * 0.3;
    const scanInterval = VISION_CONFIG.SCAN_INTERVAL_MIN +
        (VISION_CONFIG.SCAN_INTERVAL_MAX - VISION_CONFIG.SCAN_INTERVAL_MIN) * scanFrequency;

    if (!scan.isScanning && now >= scan.nextScanTime) {
        if (player.hasBallControl && player.speedBoost > 1.2) {
            scan.nextScanTime = now + scanInterval;
            return;
        }

        scan.isScanning = true;
        scan.scanStartTime = now;
        scan.originalFacingAngle = getPlayerFacingDirection(player);

        const scanDirection = Math.random() < 0.5 ? 1 : -1;
        (player as any).facingAngle = scan.originalFacingAngle + (Math.PI * 0.4 * scanDirection);
    }

    if (scan.isScanning) {
        const scanDuration = now - scan.scanStartTime;

        if (scanDuration >= VISION_CONFIG.SCAN_DURATION) {
            scan.isScanning = false;
            scan.lastScanTime = now;
            scan.nextScanTime = now + scanInterval;
            (player as any).facingAngle = scan.originalFacingAngle;
        }
    }
}

export function getVisibleTeammates(player: Player, allPlayers: Player[]): Player[] {
    const teammates = allPlayers.filter(p =>
        p.isHome === player.isHome &&
        p.id !== player.id &&
        p.role !== 'GK'
    );

    // Filter by vision
    return teammates.filter(teammate => {
        // Basic visibility check
        if (!canPlayerSee(player, teammate)) {
            return false;
        }

        // FIXED: Better line of sight blocking
        const opponents = allPlayers.filter(p => p.isHome !== player.isHome);
        const distToTeammate = getDistance(player, teammate);

        for (const opp of opponents) {
            const distToOpp = getDistance(player, opp);

            // Only check opponents that are between player and teammate
            if (distToOpp < distToTeammate) {
                const distToLine = pointToLineDistance(opp, player, teammate);

                // Opponent blocking view? (closer threshold)
                if (distToLine < 25) { // Increased from 20 for less strict blocking
                    return false;
                }
            }
        }

        return true;
    });
}

export function findBestPassOption_WithVision(passer: Player, teammates: Player[], opponents: Player[]): Player | null {
    const tactic = TACTICS[passer.isHome ? gameState.homeTactic : gameState.awayTactic]!;
    if (!tactic) return null;
    const teamState = passer.isHome ? gameState.homeTeamState : gameState.awayTeamState;
    const opponentGoalX = getAttackingGoalX(passer.isHome, gameState.currentHalf);
    const nearbyOpponentsPressure = opponents.filter(opp => getDistance(passer, opp) < 70);
    const isUnderPressure = nearbyOpponentsPressure.length > 0;

    const visibleTeammates = teammates.filter(t => canPlayerSee(passer, t));

    if (visibleTeammates.length === 0) {
        return null;
    }

    let bestOption: Player | null = null;
    let bestScore = -1;

    visibleTeammates.forEach(teammate => {
        const dist = getDistance(passer, teammate);
        const minDist = tactic.possessionPriority > 0.7 ? 40 : 40;
        const maxDist = tactic.possessionPriority > 0.7 ? 200 : 300;

        if (dist < minDist || dist > maxDist) return;

        let passBlocked = false;
        opponents.forEach(opp => {
            const distToLine = pointToLineDistance(opp, passer, teammate);
            if (distToLine < 30 && getDistance(passer, opp) < dist) {
                passBlocked = true;
            }
        });

        if (passBlocked) return;

        let score = 100 - dist / 3;

        const isForwardPass = (opponentGoalX > 400 && teammate.x > passer.x) ||
            (opponentGoalX < 400 && teammate.x < passer.x);
        if (isForwardPass) {
            score += 40 * tactic.passingRisk;
        }
        // Bu, oyuncunun gereksiz yere ileriye olan momentumunu kesmesini engeller.
        const facingAngle = getPlayerFacingDirection(passer);
        const angleToTeammate = Math.atan2(teammate.y - passer.y, teammate.x - passer.x);
        let angleDiff = Math.abs(angleToTeammate - facingAngle);
        if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;

        // EÄŸer pas, oyuncunun baktÄ±ÄŸÄ± yÃ¶nden 90 dereceden fazla sapÄ±yorsa (yani yana veya geriye ise)
        // ve oyuncu baskÄ± altÄ±nda deÄŸilse, bu pasÄ±n skorunu dÃ¼ÅŸÃ¼r.
        if (!isUnderPressure && angleDiff > Math.PI / 2) { // Math.PI / 2 = 90 derece
            score -= 60; // Geri dÃ¶nmeyi daha az cazip hale getiren aÄŸÄ±r bir ceza puanÄ±
        }

        const visionQuality = 1 - (angleDiff / Math.PI); // 1 = directly ahead, 0 = behind
        score *= (0.7 + visionQuality * 0.3); // Up to 30% bonus for clear vision


        if (teamState === 'COUNTER_ATTACK' && (teammate.role === 'ST' || teammate.role === 'RW' || teammate.role === 'LW')) {
            score += 50;
        } else if (teamState === 'DEFENDING' && (teammate.role === 'CM' || teammate.role === 'CDM')) {
            score += 40;
        }

        if (tactic.possessionPriority > 0.7) {
            if (teammate.role === 'CM' || teammate.role === 'CDM' || teammate.role === 'CAM') {
                score += 30;
            }
        }

        const nearbyOpps = opponents.filter(o => getDistance(o, teammate) < 40);
        score -= nearbyOpps.length * 15;

        if (score > bestScore) {
            bestScore = score;
            bestOption = teammate;
        }
    });

    return bestOption;
}

export function getPerceivedThreats(player: Player, opponents: Player[]): Player[] {
    return opponents.filter(opp => {
        if (getDistance(player, opp) < 30) {
            return true;
        }
        return canPlayerSee(player, opp);
    });
}

export function drawVisionCones(ctx: CanvasRenderingContext2D): void {
    if (!gameState.contexts || !gameState.contexts.game) return;

    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];

    allPlayers.forEach(player => {
        const facingAngle = (player as any).facingAngle || getPlayerFacingDirection(player);

        let visionAngle = VISION_CONFIG.NORMAL_VISION_ANGLE;
        if (player.hasBallControl) {
            visionAngle = VISION_CONFIG.BALL_CARRIER_ANGLE;
        }

        // Draw vision cone
        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = player.isHome ? '#ef4444' : '#3b82f6';

        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.arc(
            player.x,
            player.y,
            VISION_CONFIG.MAX_VISION_RANGE,
            facingAngle - visionAngle / 2,
            facingAngle + visionAngle / 2
        );
        ctx.closePath();
        ctx.fill();

        // Draw facing direction
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = player.isHome ? '#ef4444' : '#3b82f6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.lineTo(
            player.x + Math.cos(facingAngle) * 40,
            player.y + Math.sin(facingAngle) * 40
        );
        ctx.stroke();

        ctx.restore();
    });
}
