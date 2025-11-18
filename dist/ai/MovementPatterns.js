import { getDistance } from '../utils/ui';
import { BehaviorSystem } from '../behavior/BehaviorSystem';
const MovementPatterns = {
    diagonalRun(player, ball, opponentGoalX) {
        if (!['RW', 'LW', 'RM', 'LM'].includes(player.role))
            return null;
        const distToBall = getDistance(player, ball);
        if (distToBall > 200)
            return null;
        const isWide = player.y < 150 || player.y > 450;
        let targetY, description;
        if (!isWide) {
            targetY = 300;
            description = 'cutting inside';
        }
        else {
            targetY = player.role.includes('R') ? 80 : 520;
            description = 'running the wide channel';
        }
        const direction = Math.sign(opponentGoalX - player.x) || 1;
        const targetX = player.x + direction * 120;
        return {
            target: { x: targetX, y: targetY },
            speedMultiplier: 1.5,
            description: description,
            shouldLock: true
        };
    },
    overlapRun(player, teammates, opponentGoalX) {
        if (!['RB', 'LB'].includes(player.role))
            return null;
        const isRightSide = player.role === 'RB';
        const winger = teammates.find(t => (isRightSide && ['RW', 'RM'].includes(t.role)) ||
            (!isRightSide && ['LW', 'LM'].includes(t.role)));
        if (!winger)
            return null;
        const wingerHasCutInside = Math.abs(winger.y - 300) < 150;
        if (!wingerHasCutInside)
            return null;
        if ((player.isHome && player.x < 400) || (!player.isHome && player.x > 400))
            return null;
        const expectedWideY = isRightSide ? 80 : 520;
        return {
            target: {
                x: winger.x + Math.sign(opponentGoalX - winger.x) * 50,
                y: expectedWideY
            },
            speedMultiplier: 1.6,
            description: 'overlapping run',
            shouldLock: true
        };
    },
    underlapRun(player, teammates, opponentGoalX) {
        if (!['RB', 'LB'].includes(player.role))
            return null;
        const isRightSide = player.role === 'RB';
        const winger = teammates.find(t => (isRightSide && ['RW', 'RM'].includes(t.role)) ||
            (!isRightSide && ['LW', 'LM'].includes(t.role)));
        if (!winger)
            return null;
        const wingerStayingWide = isRightSide ? winger.y < 150 : winger.y > 450;
        if (!wingerStayingWide)
            return null;
        const distToWinger = getDistance(player, winger);
        if (distToWinger < 100)
            return null;
        return {
            target: {
                x: winger.x + Math.sign(opponentGoalX - winger.x) * 40,
                y: 300 + (isRightSide ? -60 : 60)
            },
            speedMultiplier: 1.5,
            description: 'underlap run',
            shouldLock: true
        };
    },
    thirdManRun(player, holder, teammates) {
        if (!['CM', 'CAM', 'RW', 'LW'].includes(player.role))
            return null;
        const passerAndReceiver = teammates.filter(t => getDistance(t, holder) < 80 && t.id !== holder.id);
        if (passerAndReceiver.length === 0)
            return null;
        const receiver = passerAndReceiver[0];
        if (!receiver)
            return null;
        const avgX = (holder.x + receiver.x) / 2;
        const avgY = (holder.y + receiver.y) / 2;
        const runAngle = Math.atan2(receiver.y - holder.y, receiver.x - holder.x) + Math.PI / 3;
        return {
            target: {
                x: avgX + Math.cos(runAngle) * 100,
                y: avgY + Math.sin(runAngle) * 100
            },
            speedMultiplier: 1.6,
            description: 'third man run',
            shouldLock: true
        };
    }
};
const RoleSpecificBehaviors = {
    false9Movement(player, teammates, opponentGoalX) {
        if (player.role !== 'ST')
            return null;
        const attackersMakingRuns = teammates.filter(t => ['RW', 'LW', 'CAM'].includes(t.role) &&
            Math.abs(t.vx) > 50);
        if (attackersMakingRuns.length < 1)
            return null;
        return {
            target: {
                x: player.x - (Math.sign(opponentGoalX - player.x) * 100),
                y: 300
            },
            speedMultiplier: 1.2,
            description: 'false 9 dropping deep',
            shouldLock: true
        };
    },
    boxToBoxRun(player, ball, teammates, opponentGoalX) {
        if (!['CM', 'CDM'].includes(player.role))
            return null;
        const ballInFinalThird = Math.abs(ball.x - opponentGoalX) < 250;
        if (!ballInFinalThird)
            return null;
        if (Math.abs(player.x - opponentGoalX) < 180)
            return null;
        const playersInBox = teammates.filter(t => Math.abs(t.x - opponentGoalX) < 160).length;
        if (playersInBox > 2)
            return null;
        return {
            target: {
                x: opponentGoalX - (Math.sign(opponentGoalX - 400) * 100),
                y: 300 + (Math.random() - 0.5) * 150
            },
            speedMultiplier: 1.7,
            description: 'box-to-box late run',
            shouldLock: true
        };
    },
    mezzalaWideMovement(player, holder, opponentGoalX) {
        if (!['CM'].includes(player.role))
            return null;
        if (!holder || holder.isHome !== player.isHome)
            return null;
        const holderIsWide = holder.y < 200 || holder.y > 400;
        if (!holderIsWide)
            return null;
        const sameSide = (holder.y < 300 && player.y < 300) || (holder.y > 300 && player.y > 300);
        if (!sameSide)
            return null;
        return {
            target: {
                x: holder.x + Math.sign(opponentGoalX - holder.x) * 60,
                y: holder.y + (Math.random() - 0.5) * 40
            },
            speedMultiplier: 1.4,
            description: 'mezzala overload',
            shouldLock: true
        };
    },
    strikerWideMovement(player, teammates, opponentGoalX) {
        if (!['ST'].includes(player.role))
            return null;
        const otherForward = teammates.find(t => ['ST', 'CF', 'RW', 'LW'].includes(t.role) && t.id !== player.id);
        if (!otherForward)
            return null;
        const distToOtherForward = getDistance(player, otherForward);
        if (distToOtherForward > 100)
            return null;
        const targetY = otherForward.y < 300 ? 450 : 150;
        return {
            target: {
                x: player.x + Math.sign(opponentGoalX - player.x) * 40,
                y: targetY
            },
            speedMultiplier: 1.3,
            description: 'striker wide pull',
            shouldLock: true
        };
    },
    segundoVolanteRun(player, ball, holder, opponentGoalX) {
        if (!['CDM'].includes(player.role))
            return null;
        if (!holder || holder.isHome !== player.isHome)
            return null;
        const ballInMidfield = Math.abs(ball.x - 400) < 200;
        if (!ballInMidfield)
            return null;
        const distToBall = getDistance(player, ball);
        if (distToBall > 150)
            return null;
        return {
            target: {
                x: ball.x + Math.sign(opponentGoalX - ball.x) * 120,
                y: 300
            },
            speedMultiplier: 1.5,
            description: 'segundo volante burst',
            shouldLock: true
        };
    }
};
export function selectBestAttackingMovement(player, holder, teammates, opponents, activePosition, opponentGoalX, gameState) {
    if (typeof BehaviorSystem !== 'undefined') {
        const phase = BehaviorSystem.detectGamePhase(gameState);
        const tacticName = player.isHome ? gameState.homeTactic : gameState.awayTactic;
        const tacticalSystem = BehaviorSystem.getTacticalSystemType(tacticName);
        const advancedBehavior = BehaviorSystem.selectPlayerBehavior(player, gameState, phase, tacticalSystem);
        if (advancedBehavior) {
            player.currentBehavior = advancedBehavior.description;
            return {
                x: advancedBehavior.target.x,
                y: advancedBehavior.target.y,
                speedBoost: advancedBehavior.speedMultiplier,
                shouldLock: advancedBehavior.shouldLock
            };
        }
    }
    const patterns = [
        RoleSpecificBehaviors.false9Movement(player, teammates, opponentGoalX),
        RoleSpecificBehaviors.boxToBoxRun(player, gameState.ballPosition, teammates, opponentGoalX),
        RoleSpecificBehaviors.mezzalaWideMovement(player, holder, opponentGoalX),
        RoleSpecificBehaviors.strikerWideMovement(player, teammates, opponentGoalX),
        RoleSpecificBehaviors.segundoVolanteRun(player, gameState.ballPosition, holder, opponentGoalX),
        MovementPatterns.thirdManRun(player, holder, teammates),
        MovementPatterns.overlapRun(player, teammates, opponentGoalX),
        MovementPatterns.underlapRun(player, teammates, opponentGoalX),
        MovementPatterns.diagonalRun(player, gameState.ballPosition, opponentGoalX)
    ];
    const bestPattern = patterns.find(p => p !== null);
    if (bestPattern) {
        player.currentBehavior = bestPattern.description;
        return {
            x: bestPattern.target.x,
            y: bestPattern.target.y,
            speedBoost: bestPattern.speedMultiplier,
            shouldLock: bestPattern.shouldLock
        };
    }
    const direction = Math.sign(opponentGoalX - player.x) || 1;
    const holderUnderPressure = opponents.some(o => getDistance(o, holder) < 70);
    if (holderUnderPressure) {
        player.currentBehavior = 'offering support';
        return {
            x: holder.x - direction * 60,
            y: holder.y + (player.y < 300 ? -70 : 70),
            speedBoost: 1.1,
            shouldLock: false
        };
    }
    else {
        player.currentBehavior = 'advancing position';
        return {
            x: activePosition.x + direction * 70,
            y: activePosition.y,
            speedBoost: 1.0,
            shouldLock: false
        };
    }
}
//# sourceMappingURL=MovementPatterns.js.map