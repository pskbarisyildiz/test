import type { Player, GameState } from '../types';
import { getDistance } from '../utils/ui';
import { SetPieceBehaviorSystem } from '../setpieces/SetPieceBehaviorSystem';
// Import for future use if needed for more advanced offside checks
// import { isPlayerInOffsidePosition } from '../rules/offside';

export const BehaviorResult = {
    success(target: { x: number; y: number }, speedMultiplier = 1.0, description = '', shouldLock = false) {
        return {
            available: true,
            target,
            speedMultiplier,
            description,
            shouldLock,
            error: null
        };
    },

    unavailable(reason = 'Conditions not met') {
        return {
            available: false,
            target: null,
            speedMultiplier: 1.0,
            description: '',
            shouldLock: false,
            error: reason
        };
    },

    isValid(result: unknown): boolean {
        return result !== null && typeof result === 'object' && 'available' in result && (result as { available: boolean }).available === true;
    }
};

export const PHASES = {
    DEFENSIVE: 'defensive',
    ATTACKING: 'attacking',
    TRANSITION_TO_ATTACK: 'transition_attack',
    TRANSITION_TO_DEFENSE: 'transition_defense'
};

const GoalkeeperBehaviors = {
    sweeperKeeping(ball: { x: number; y: number }, teammates: Player[], opponents: Player[], ownGoalX: number) {
        const defenders = teammates.filter(t => ['CB', 'RB', 'LB'].includes(t.role));
        if (defenders.length === 0) return null;

        const defensiveLine = Math.max(...defenders.map(t => Math.abs(t.x - ownGoalX)));

        if (defensiveLine < 200) return null;

        const threatBehindLine = opponents.find(opp => {
            const oppDistToGoal = Math.abs(opp.x - ownGoalX);
            return oppDistToGoal < defensiveLine - 50 && getDistance(opp, ball) < 100;
        });

        if (threatBehindLine) {
            const interceptPoint = {
                x: ownGoalX + Math.sign(ball.x - ownGoalX) * Math.min(defensiveLine * 0.6, 180),
                y: ball.y
            };

            return {
                target: interceptPoint,
                speedMultiplier: 1.8,
                description: 'sweeper-keeper intercept',
                shouldLock: true
            };
        }

        return null;
    },

    buildUpSupport(holder: Player | null, ownGoalX: number) {
        if (!holder || holder.role === 'GK') return null;

        const holderDistToGoal = Math.abs(holder.x - ownGoalX);

        if (holderDistToGoal > 400) return null;

        const safeZone = {
            x: ownGoalX + Math.sign(holder.x - ownGoalX) * 80,
            y: 300
        };

        return {
            target: safeZone,
            speedMultiplier: 1.0,
            description: 'GK build-up support',
            shouldLock: false
        };
    },

    angleNarrowing(ball: { x: number; y: number }, ownGoalX: number) {
        const goalCenter = { x: ownGoalX, y: 300 };
        const ballToGoalDist = getDistance(ball, goalCenter);

        const optimalDist = Math.min(ballToGoalDist * 0.35, 60);
        const angle = Math.atan2(ball.y - goalCenter.y, ball.x - goalCenter.x);

        return {
            target: {
                x: goalCenter.x + Math.cos(angle) * optimalDist,
                y: goalCenter.y + Math.sin(angle) * optimalDist
            },
            speedMultiplier: 1.4,
            description: 'angle narrowing',
            shouldLock: true
        };
    }
};

const DefensiveBehaviors = {
    defensiveLineShift(player: Player, ball: { x: number; y: number }, teammates: Player[], ownGoalX: number) {
        if (!['CB', 'RB', 'LB'].includes(player.role)) return null;

        const defensiveLine = teammates.filter(t =>
            ['CB', 'RB', 'LB'].includes(t.role)
        );

        if (defensiveLine.length < 2) return null;

        const avgLineX = defensiveLine.reduce((sum, p) => sum + p.x, 0) / defensiveLine.length;
        const targetLineX = avgLineX + (ball.y - 300) * 0.15;

        const ballPressure = Math.min(...teammates.map(t => getDistance(t, ball)));
        const verticalAdjust = ballPressure < 50 ? 25 : -15;

        return {
            target: {
                x: player.x + Math.sign(targetLineX - avgLineX) * 20 + verticalAdjust * Math.sign(ownGoalX - player.x),
                y: player.y + (ball.y - player.y) * 0.2
            },
            speedMultiplier: 1.0,
            description: 'defensive line shift',
            shouldLock: false
        };
    },

    fullBackCovering(fb: Player, opponents: Player[]) {
        if (!['RB', 'LB'].includes(fb.role)) return null;

        const isRightBack = fb.role === 'RB';
        const wideThreats = opponents.filter(opp =>
            (isRightBack && opp.y < 200) || (!isRightBack && opp.y > 400)
        );

        if (wideThreats.length === 0) return null;

        const nearestThreat = wideThreats.sort((a, b) =>
            getDistance(a, fb) - getDistance(b, fb)
        )[0];

        if (!nearestThreat) return null;

        const distToThreat = getDistance(nearestThreat, fb);

        if (distToThreat < 150) {
            const interceptAngle = Math.atan2(nearestThreat.y - fb.y, nearestThreat.x - fb.x);

            return {
                target: {
                    x: fb.x + Math.cos(interceptAngle) * 50,
                    y: fb.y + Math.sin(interceptAngle) * 50
                },
                speedMultiplier: 1.5,
                description: 'full-back pressing winger',
                shouldLock: true
            };
        }

        return null;
    },

    centerBackMarking(cb: Player, opponents: Player[], ownGoalX: number) {
        if (!['CB'].includes(cb.role)) return null;

        const strikers = opponents.filter(opp => ['ST', 'CF'].includes(opp.role));
        if (strikers.length === 0) return null;

        const nearestStriker = strikers.sort((a, b) =>
            getDistance(a, cb) - getDistance(b, cb)
        )[0];

        if (!nearestStriker) return null;

        const inDangerZone = Math.abs(nearestStriker.x - ownGoalX) < 200;

        if (inDangerZone) {
            const markingDist = 15;
            const angle = Math.atan2(nearestStriker.y - ownGoalX, nearestStriker.x - ownGoalX);

            return {
                target: {
                    x: nearestStriker.x - Math.cos(angle) * markingDist,
                    y: nearestStriker.y - Math.sin(angle) * markingDist
                },
                speedMultiplier: 1.3,
                description: 'CB tight marking',
                shouldLock: true
            };
        }

        return null;
    },

    invertedFullBack(fb: Player, holder: Player | null, teammates: Player[], ownGoalX: number) {
        if (!['RB', 'LB'].includes(fb.role)) return null;
        if (!holder || holder.isHome !== fb.isHome) return null;

        const ballInOwnHalf = Math.abs(holder.x - ownGoalX) < 400;
        if (!ballInOwnHalf) return null;

        const midfielders = teammates.filter(t =>
            ['CM', 'CDM', 'CAM'].includes(t.role)
        );

        const midFieldCongestion = midfielders.reduce((sum, m) =>
            sum + (Math.abs(m.y - 300) < 100 ? 1 : 0), 0
        );

        if (midFieldCongestion > 2) return null;

        return {
            target: {
                x: ownGoalX + Math.sign(holder.x - ownGoalX) * 250,
                y: 300
            },
            speedMultiplier: 1.1,
            description: 'inverted full-back',
            shouldLock: false
        };
    }
};

const MidfieldBehaviors = {
    cdmScreening(ball: { x: number; y: number }, teammates: Player[]) {
        const defensiveLine = teammates.filter(t =>
            ['CB', 'RB', 'LB'].includes(t.role)
        );

        if (defensiveLine.length === 0) return null;

        const avgDefLineX = defensiveLine.reduce((sum, p) => sum + p.x, 0) / defensiveLine.length;

        const screeningX = avgDefLineX + Math.sign(ball.x - avgDefLineX) * 80;
        const screeningY = 300 + (ball.y - 300) * 0.4;

        return {
            target: { x: screeningX, y: screeningY },
            speedMultiplier: 1.0,
            description: 'CDM screening defense',
            shouldLock: false
        };
    },

    boxToBoxLateRun(cm: Player, ball: { x: number; y: number }, holder: Player | null, teammates: Player[], opponentGoalX: number) {
        if (!['CM'].includes(cm.role)) return null;
        if (!holder || holder.isHome !== cm.isHome) return null;

        const ballInFinalThird = Math.abs(ball.x - opponentGoalX) < 250;
        const alreadyForward = Math.abs(cm.x - opponentGoalX) < 180;
        const playersInBox = teammates.filter(t =>
            Math.abs(t.x - opponentGoalX) < 150
        ).length;

        if (!ballInFinalThird || alreadyForward || playersInBox > 2) return null;

        return {
            target: {
                x: opponentGoalX - Math.sign(opponentGoalX - 400) * 100,
                y: 300 + (Math.random() - 0.5) * 120
            },
            speedMultiplier: 1.7,
            description: 'box-to-box late run',
            shouldLock: true
        };
    },

    registaTempoDictation(cm: Player, holder: Player | null, ownGoalX: number) {
        if (!['CM', 'CDM'].includes(cm.role)) return null;
        if (!holder || holder.isHome !== cm.isHome) return null;

        const deepPosition = {
            x: ownGoalX + Math.sign(holder.x - ownGoalX) * 200,
            y: 300
        };

        const inDeepZone = Math.abs(cm.x - deepPosition.x) < 60;

        if (inDeepZone) return null;

        return {
            target: deepPosition,
            speedMultiplier: 0.9,
            description: 'regista deep positioning',
            shouldLock: false
        };
    },

    camBetweenLines(cam: Player, opponents: Player[], opponentGoalX: number) {
        if (!['CAM'].includes(cam.role)) return null;

        const oppDefenders = opponents.filter(o =>
            ['CB', 'RB', 'LB', 'CDM'].includes(o.role)
        );

        if (oppDefenders.length < 2) return null;

        const avgDefX = oppDefenders.reduce((sum, p) => sum + p.x, 0) / oppDefenders.length;
        const pocketX = avgDefX + Math.sign(opponentGoalX - avgDefX) * 60;

        return {
            target: {
                x: pocketX,
                y: 300 + (Math.random() - 0.5) * 80
            },
            speedMultiplier: 1.2,
            description: 'CAM finding pocket',
            shouldLock: false
        };
    },

    cmPressTrigger(cm: Player, holder: Player | null) {
        if (!['CM'].includes(cm.role)) return null;
        if (!holder || holder.isHome === cm.isHome) return null;

        const holderInCenter = Math.abs(holder.y - 300) < 150;
        const distToHolder = getDistance(cm, holder);

        if (holderInCenter && distToHolder < 80) {
            return {
                target: {
                    x: holder.x,
                    y: holder.y
                },
                speedMultiplier: 1.6,
                description: 'CM press trigger',
                shouldLock: true
            };
        }

        return null;
    }
};

const ForwardBehaviors = {
    wingerWidthProviding(winger: Player, holder: Player | null) {
        if (!['RW', 'LW', 'RM', 'LM'].includes(winger.role)) return null;
        if (!holder || holder.isHome !== winger.isHome) return null;

        const isRight = ['RW', 'RM'].includes(winger.role);
        const targetY = isRight ? 80 : 520;
        const currentlyWide = Math.abs(winger.y - targetY) < 40;

        if (currentlyWide) return null;

        return {
            target: {
                x: winger.x + Math.sign(holder.x - winger.x) * 30,
                y: targetY
            },
            speedMultiplier: 1.1,
            description: 'winger providing width',
            shouldLock: false
        };
    },

    invertedWingerCutInside(winger: Player, opponentGoalX: number, opponents: Player[], _ball: { x: number; y: number }, holder: Player | null) {
        if (!['RW', 'LW'].includes(winger.role)) return null;

        const distToGoal = Math.abs(winger.x - opponentGoalX);
        const isWide = (winger.role === 'RW' && winger.y < 150) ||
            (winger.role === 'LW' && winger.y > 450);

        if (distToGoal < 280 && isWide) {
            // Calculate desired target
            const desiredTargetX = opponentGoalX - Math.sign(opponentGoalX - winger.x) * 100;

            // OFFSIDE CHECK: Ball carrier can dribble anywhere - offside doesn't apply
            // Only check offside for players WITHOUT the ball
            const isBallCarrier = holder && holder.id === winger.id;

            if (isBallCarrier) {
                // Ball carrier - no offside restriction, go for goal!
                return {
                    target: {
                        x: desiredTargetX,
                        y: 300 + (Math.random() - 0.5) * 100
                    },
                    speedMultiplier: 1.4,
                    description: 'inverted winger cutting inside',
                    shouldLock: true
                };
            }

            // NOT ball carrier - check offside: Find the last defender (excluding GK)
            const oppDefenders = opponents.filter(o => o.role !== 'GK');
            if (oppDefenders.length > 0) {
                // Sort by distance to goal (closest to goal = last defender)
                const sortedDefenders = oppDefenders.sort((a, b) =>
                    Math.abs(a.x - opponentGoalX) - Math.abs(b.x - opponentGoalX)
                );
                const lastDefender = sortedDefenders[0];

                if (!lastDefender) return null;

                // Don't go beyond the last defender (stay onside with 20px buffer)
                const attackingDirection = Math.sign(opponentGoalX - winger.x);
                const safeMaxX = lastDefender.x - attackingDirection * 20;

                // Check if desired position would be offside
                const wouldBeOffside = attackingDirection > 0 ?
                    desiredTargetX > safeMaxX :
                    desiredTargetX < safeMaxX;

                // If would be offside, adjust target to stay onside
                const targetX = wouldBeOffside ? safeMaxX : desiredTargetX;

                return {
                    target: {
                        x: targetX,
                        y: 300 + (Math.random() - 0.5) * 100
                    },
                    speedMultiplier: 1.4,
                    description: 'inverted winger cutting inside',
                    shouldLock: true
                };
            }

            // Fallback if no defenders (shouldn't happen in normal play)
            return {
                target: {
                    x: desiredTargetX,
                    y: 300 + (Math.random() - 0.5) * 100
                },
                speedMultiplier: 1.4,
                description: 'inverted winger cutting inside',
                shouldLock: true
            };
        }

        return null;
    },

    strikerRunsInBehind(striker: Player, holder: Player | null, opponents: Player[], opponentGoalX: number, _ball: { x: number; y: number }) {
        if (!['ST', 'CF'].includes(striker.role)) return null;
        if (!holder || holder.isHome !== striker.isHome) return null;

        const oppDefenders = opponents.filter(o =>
            ['CB', 'RB', 'LB'].includes(o.role)
        );

        if (oppDefenders.length === 0) return null;

        const lastDefender = oppDefenders.sort((a, b) =>
            Math.abs(b.x - opponentGoalX) - Math.abs(a.x - opponentGoalX)
        )[0];

        if (!lastDefender) return null;

        // OFFSIDE FIX: Instead of running 30px PAST the defender (which is offside),
        // run to align with the defender (shoulder to shoulder) with a small buffer to stay onside
        const attackingDirection = Math.sign(opponentGoalX - lastDefender.x);
        // Stay 10px BEHIND the defender to avoid offside (negative direction)
        const runTargetX = lastDefender.x - attackingDirection * 10;

        const distToLastDefender = Math.abs(striker.x - lastDefender.x);

        if (distToLastDefender < 20 || getDistance(holder, striker) > 250) return null;

        return {
            target: {
                x: runTargetX,
                y: 300 + (Math.random() - 0.5) * 120
            },
            speedMultiplier: 1.6,
            description: 'striker run in behind',
            shouldLock: true
        };
    },

    false9DropDeep(striker: Player, holder: Player | null, teammates: Player[], opponentGoalX: number) {
        if (!['ST', 'CF'].includes(striker.role)) return null;
        if (!holder || holder.isHome !== striker.isHome) return null;

        const forwardRunners = teammates.filter(t =>
            ['RW', 'LW', 'CAM'].includes(t.role) &&
            Math.abs(t.vx) > 50
        );

        if (forwardRunners.length === 0) return null;

        const dropPosition = {
            x: striker.x - Math.sign(opponentGoalX - striker.x) * 120,
            y: 300
        };

        return {
            target: dropPosition,
            speedMultiplier: 1.2,
            description: 'false 9 dropping deep',
            shouldLock: true
        };
    },

    targetStrikerHoldUp(striker: Player, opponents: Player[], ball: { x: number; y: number }) {
        if (!['ST', 'CF'].includes(striker.role)) return null;

        const nearbyOpponents = opponents.filter(o =>
            getDistance(o, striker) < 60
        );

        if (nearbyOpponents.length > 0 && getDistance(striker, ball) < 25) {
            return {
                target: {
                    x: striker.x,
                    y: striker.y
                },
                speedMultiplier: 0.7,
                description: 'target striker holding up',
                shouldLock: true
            };
        }

        return null;
    },

    strikerPressingTrigger(striker: Player, opponents: Player[], ball: { x: number; y: number }, ownGoalX: number) {
        if (!['ST', 'CF'].includes(striker.role)) return null;

        const oppCBs = opponents.filter(o =>
            ['CB', 'GK'].includes(o.role)
        );

        if (oppCBs.length === 0) return null;

        const nearestCB = oppCBs.sort((a, b) =>
            getDistance(a, ball) - getDistance(b, ball)
        )[0];

        if (!nearestCB) return null;

        const distToCB = getDistance(striker, nearestCB);

        if (distToCB < 100 && Math.abs(nearestCB.x - ownGoalX) > 400) {
            return {
                target: {
                    x: nearestCB.x,
                    y: nearestCB.y
                },
                speedMultiplier: 1.7,
                description: 'striker leading press',
                shouldLock: true
            };
        }

        return null;
    }
};

const TransitionBehaviors = {
    counterAttackRun(player: Player, opponentGoalX: number, justWonPossession: boolean, opponents: Player[], _ball: { x: number; y: number }, holder: Player | null) {
        if (!justWonPossession) return null;
        if (!['ST', 'RW', 'LW', 'CAM', 'CM'].includes(player.role)) return null;

        const spaceAhead = Math.abs(player.x - opponentGoalX);

        if (['ST', 'RW', 'LW'].includes(player.role) && spaceAhead > 150) {
            // Calculate desired target
            const desiredTargetX = opponentGoalX - Math.sign(opponentGoalX - player.x) * 80;

            // OFFSIDE CHECK: Ball carrier can dribble anywhere - offside doesn't apply
            const isBallCarrier = holder && holder.id === player.id;

            if (isBallCarrier) {
                // Ball carrier on counter-attack - no offside restriction!
                return {
                    target: {
                        x: desiredTargetX,
                        y: player.role === 'ST' ? 300 : player.y
                    },
                    speedMultiplier: 2.0,
                    description: 'counter-attack sprint',
                    shouldLock: true,
                    duration: 3000
                };
            }

            // NOT ball carrier - check offside: Find the last defender
            const oppDefenders = opponents.filter(o => o.role !== 'GK');
            let targetX = desiredTargetX;

            if (oppDefenders.length > 0) {
                const sortedDefenders = oppDefenders.sort((a, b) =>
                    Math.abs(a.x - opponentGoalX) - Math.abs(b.x - opponentGoalX)
                );
                const lastDefender = sortedDefenders[0];

                if (lastDefender) {
                    const attackingDirection = Math.sign(opponentGoalX - player.x);
                    const safeMaxX = lastDefender.x - attackingDirection * 15;

                    // Check if desired position would be offside
                    const wouldBeOffside = attackingDirection > 0 ?
                        desiredTargetX > safeMaxX :
                        desiredTargetX < safeMaxX;

                    // If would be offside, adjust target to stay onside
                    targetX = wouldBeOffside ? safeMaxX : desiredTargetX;
                }
            }

            return {
                target: {
                    x: targetX,
                    y: player.role === 'ST' ? 300 : player.y
                },
                speedMultiplier: 2.0,
                description: 'counter-attack sprint',
                shouldLock: true,
                duration: 3000
            };
        }

        if (['CAM', 'CM'].includes(player.role)) {
            return {
                target: {
                    x: player.x + Math.sign(opponentGoalX - player.x) * 120,
                    y: 300
                },
                speedMultiplier: 1.6,
                description: 'counter-attack support',
                shouldLock: true,
                duration: 2500
            };
        }

        return null;
    },

    counterPress(player: Player, ball: { x: number; y: number }, justLostPossession: boolean) {
        if (!justLostPossession) return null;

        const distToBall = getDistance(player, ball);

        if (distToBall > 80) return null;

        return {
            target: {
                x: ball.x,
                y: ball.y
            },
            speedMultiplier: 1.9,
            description: 'counter-press',
            shouldLock: true,
            duration: 4000
        };
    },

    recoveryRun(player: Player, ball: { x: number; y: number }, ownGoalX: number, justLostPossession: boolean) {
        if (!justLostPossession) return null;

        const distToBall = getDistance(player, ball);

        if (distToBall < 100) return null;

        const homePositionX = (player as any).homePosition?.x || (ownGoalX + Math.sign(player.x - ownGoalX) * 200);

        return {
            target: {
                x: homePositionX,
                y: (player as any).homePosition?.y || 300
            },
            speedMultiplier: 1.7,
            description: 'recovery run',
            shouldLock: true,
            duration: 3000
        };
    }
};

const TacticalSystemModifiers = {
    possessionSystem(player: Player, holder: Player | null, teammates: Player[]) {
        if (!holder || holder.isHome !== player.isHome) return null;

        const nearbyTeammates = teammates.filter(t =>
            getDistance(t, holder) < 150 && t.id !== player.id && t.id !== holder.id
        );

        if (nearbyTeammates.length < 1) return null;

        const avgX = nearbyTeammates.reduce((sum, t) => sum + t.x, holder.x) / (nearbyTeammates.length + 1);
        const avgY = nearbyTeammates.reduce((sum, t) => sum + t.y, holder.y) / (nearbyTeammates.length + 1);

        return {
            target: {
                x: avgX + (Math.random() - 0.5) * 40,
                y: avgY + (Math.random() - 0.5) * 40
            },
            speedMultiplier: 0.9,
            description: 'possession triangle formation',
            shouldLock: false
        };
    },

    highPressSystem(player: Player, opponentGoalX: number) {
        const teamPushUp = Math.abs(player.x - opponentGoalX) > 300;

        if (!teamPushUp) return null;

        const targetX = opponentGoalX - Math.sign(opponentGoalX - player.x) * 250;

        return {
            target: {
                x: targetX,
                y: player.y
            },
            speedMultiplier: 1.2,
            description: 'high-press positioning',
            shouldLock: false
        };
    },

    lowBlockSystem(player: Player, ownGoalX: number) {
        const defensiveThird = ownGoalX + Math.sign(player.x - ownGoalX) * 200;
        const tooAdvanced = Math.abs(player.x - defensiveThird) > 150;

        if (!tooAdvanced) return null;

        return {
            target: {
                x: defensiveThird,
                y: 300 + (player.y - 300) * 0.7
            },
            speedMultiplier: 1.0,
            description: 'low-block positioning',
            shouldLock: false
        };
    }
};

export function selectPlayerBehavior(player: Player, gameState: GameState, phase: string, tacticalSystem: string) {
    const allPlayers = [...(gameState.homePlayers || []), ...(gameState.awayPlayers || [])];
    const teammates = allPlayers.filter(p => p.isHome === player.isHome && p.id !== player.id);
    const opponents = allPlayers.filter(p => p.isHome !== player.isHome);
    const ball = gameState.ballPosition;
    const holder = gameState.ballHolder;

    const ownGoalX = player.isHome ?
        (gameState.currentHalf === 1 ? 50 : 750) :
        (gameState.currentHalf === 1 ? 750 : 50);
    const opponentGoalX = player.isHome ?
        (gameState.currentHalf === 1 ? 750 : 50) :
        (gameState.currentHalf === 1 ? 50 : 750);

    const timeSinceChange = Date.now() - (gameState.lastPossessionChange || 0);
    const justWonPossession = timeSinceChange < 5000 && holder?.isHome === player.isHome;
    const justLostPossession = timeSinceChange < 5000 && holder?.isHome !== player.isHome;

    if (phase === 'SET_PIECE') {
        (player as any).currentBehavior = 'set_piece_hold';
        return null;
    }

    const behaviors = [];

    if (phase === PHASES.TRANSITION_TO_ATTACK || justWonPossession) {
        behaviors.push(
            TransitionBehaviors.counterAttackRun(player, opponentGoalX, justWonPossession, opponents, ball, holder)
        );
    }

    if (phase === PHASES.TRANSITION_TO_DEFENSE || justLostPossession) {
        behaviors.push(
            TransitionBehaviors.counterPress(player, ball, justLostPossession),
            TransitionBehaviors.recoveryRun(player, ball, ownGoalX, justLostPossession)
        );
    }

    if (phase === PHASES.DEFENSIVE || (holder && holder.isHome !== player.isHome)) {
        if (player.role === 'GK') {
            behaviors.push(
                GoalkeeperBehaviors.sweeperKeeping(ball, teammates, opponents, ownGoalX),
                GoalkeeperBehaviors.angleNarrowing(ball, ownGoalX)
            );
        }

        behaviors.push(
            DefensiveBehaviors.defensiveLineShift(player, ball, teammates, ownGoalX),
            DefensiveBehaviors.fullBackCovering(player, opponents),
            DefensiveBehaviors.centerBackMarking(player, opponents, ownGoalX)
        );

        behaviors.push(
            MidfieldBehaviors.cdmScreening(ball, teammates),
            MidfieldBehaviors.cmPressTrigger(player, holder)
        );

        behaviors.push(
            ForwardBehaviors.strikerPressingTrigger(player, opponents, ball, ownGoalX)
        );
    }

    if (phase === PHASES.ATTACKING || (holder && holder.isHome === player.isHome)) {
        if (player.role === 'GK') {
            behaviors.push(
                GoalkeeperBehaviors.buildUpSupport(holder, ownGoalX)
            );
        }

        behaviors.push(
            DefensiveBehaviors.invertedFullBack(player, holder, teammates, ownGoalX)
        );

        behaviors.push(
            MidfieldBehaviors.boxToBoxLateRun(player, ball, holder, teammates, opponentGoalX),
            MidfieldBehaviors.registaTempoDictation(player, holder, ownGoalX),
            MidfieldBehaviors.camBetweenLines(player, opponents, opponentGoalX)
        );

        behaviors.push(
            ForwardBehaviors.wingerWidthProviding(player, holder),
            ForwardBehaviors.invertedWingerCutInside(player, opponentGoalX, opponents, ball, holder),
            ForwardBehaviors.strikerRunsInBehind(player, holder, opponents, opponentGoalX, ball),
            ForwardBehaviors.false9DropDeep(player, holder, teammates, opponentGoalX),
            ForwardBehaviors.targetStrikerHoldUp(player, opponents, ball)
        );
    }

    if (tacticalSystem === 'possession') {
        behaviors.push(
            TacticalSystemModifiers.possessionSystem(player, holder, teammates)
        );
    } else if (tacticalSystem === 'high_press') {
        behaviors.push(
            TacticalSystemModifiers.highPressSystem(player, opponentGoalX)
        );
    } else if (tacticalSystem === 'low_block' || tacticalSystem === 'counter_attack') {
        behaviors.push(
            TacticalSystemModifiers.lowBlockSystem(player, ownGoalX)
        );
    }

    const validBehavior = behaviors.find(b => b !== null);

    if (validBehavior) (player as any).currentBehavior = validBehavior.description;
    return validBehavior || null;
}

export function detectGamePhase(gameState: GameState): string {
    if (typeof SetPieceBehaviorSystem !== 'undefined' &&
        SetPieceBehaviorSystem.isSetPieceActive(gameState)) {
        return 'SET_PIECE';
    }

    const holder = gameState.ballHolder;
    const timeSinceChange = Date.now() - (gameState.lastPossessionChange || 0);

    if (timeSinceChange < 5000) {
        if (holder) {
            return PHASES.TRANSITION_TO_ATTACK;
        } else {
            return PHASES.TRANSITION_TO_DEFENSE;
        }
    }

    if (holder) {
        return PHASES.ATTACKING;
    }

    return PHASES.DEFENSIVE;
}

export function getTacticalSystemType(tacticName: string | null): string {
    const systemMap: { [key: string]: string } = {
        'possession': 'possession',
        'tiki_taka': 'possession',
        'high_press': 'high_press',
        'gegenpress': 'high_press',
        'counter_attack': 'counter_attack',
        'defensive': 'low_block',
        'park_bus': 'low_block'
    };

    return systemMap[tacticName?.toLowerCase() ?? ''] || 'balanced';
}

export const BehaviorSystem = {
    selectPlayerBehavior,
    detectGamePhase,
    getTacticalSystemType,
    BehaviorResult,
    PHASES
};

// Functions are now exported via ES6 modules - no window exports needed
