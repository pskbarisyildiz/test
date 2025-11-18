// ============================================================================
// PROFESSIONAL CORNER KICK BEHAVIORS
// ============================================================================
const ProfessionalCornerBehaviors = {
    getAttackingCornerPosition(player, cornerPos, opponentGoalX, teammates, sortedLists, routine, gameState) {
        if (!gameState || !player || !cornerPos) {
            return sanitizePosition({ x: player?.x ?? 400, y: player?.y ?? 300, movement: 'error_corner_att' }, { player });
        }

        if (player.role === 'GK') {
            const gkX = window.getAttackingGoalX(!player.isHome, gameState.currentHalf);
            return sanitizePosition({ x: gkX, y: 300, movement: 'gk_stay_goal', role: 'GK' }, { player, role: 'GK' });
        }

        const context = new TacticalContext(gameState, SET_PIECE_TYPES.CORNER_KICK);
        const shouldCommit = context.shouldCommitForward(player.isHome);
        
        if (!sortedLists) sortedLists = getSortedLists(teammates, getValidPlayers(gameState ? (player.isHome ? gameState.awayPlayers : gameState.homePlayers) : []));

        const isRightCorner = cornerPos.y < (PITCH_HEIGHT / 2);
        const direction = Math.sign(opponentGoalX - (PITCH_WIDTH / 2));

        // Professional positioning zones with realistic spacing
        const ZONES = {
            // Near post - first runner (arrives just before far post) - PROFESSIONAL: Attack from penalty area with run-up
            nearPostRun: {
                start: { x: opponentGoalX - direction * 125, y: isRightCorner ? activeConfig.GOAL_Y_TOP + 55 : activeConfig.GOAL_Y_BOTTOM - 55 },
                target: { x: opponentGoalX - direction * 95, y: isRightCorner ? activeConfig.GOAL_Y_TOP + 35 : activeConfig.GOAL_Y_BOTTOM - 35 }
            },
            // Far post - power header (starting deeper for run-up) - PROFESSIONAL: Attack from deep with momentum
            farPost: {
                start: { x: opponentGoalX - direction * 140, y: isRightCorner ? activeConfig.GOAL_Y_BOTTOM - 45 : activeConfig.GOAL_Y_TOP + 45 },
                target: { x: opponentGoalX - direction * 105, y: isRightCorner ? activeConfig.GOAL_Y_BOTTOM - 35 : activeConfig.GOAL_Y_TOP + 35 }
            },
            // Penalty spot - central aerial threat
            penaltySpot: {
                start: { x: opponentGoalX - direction * 125, y: PITCH_HEIGHT / 2 + (isRightCorner ? -15 : 15) },
                target: { x: opponentGoalX - direction * 108, y: PITCH_HEIGHT / 2 }
            },
            // Six-yard line - close-range finisher
            sixYardSpot: {
                start: { x: opponentGoalX - direction * 65, y: PITCH_HEIGHT / 2 + (isRightCorner ? 20 : -20) },
                target: { x: opponentGoalX - direction * 35, y: PITCH_HEIGHT / 2 }
            },
            // Edge of box - cutback receiver and long-range threat
            edgeBox: { x: opponentGoalX - direction * 185, y: PITCH_HEIGHT / 2 },
            edgeBoxLeft: { x: opponentGoalX - direction * 180, y: PITCH_HEIGHT / 2 - 60 },
            edgeBoxRight: { x: opponentGoalX - direction * 180, y: PITCH_HEIGHT / 2 + 60 },
            // Blocking run - creates space (decoy movement)
            blockingRun: {
                start: { x: opponentGoalX - direction * 98, y: isRightCorner ? activeConfig.GOAL_Y_TOP + 65 : activeConfig.GOAL_Y_BOTTOM - 65 },
                target: { x: opponentGoalX - direction * 85, y: PITCH_HEIGHT / 2 + (isRightCorner ? -10 : 10) }
            },
            // Decoy near post run (pulls defender) - PROFESSIONAL: Attack from penalty area with realistic spacing
            decoyNearPost: {
                start: { x: opponentGoalX - direction * 118, y: isRightCorner ? activeConfig.GOAL_Y_TOP + 40 : activeConfig.GOAL_Y_BOTTOM - 40 },
                target: { x: opponentGoalX - direction * 92, y: isRightCorner ? activeConfig.GOAL_Y_TOP + 30 : activeConfig.GOAL_Y_BOTTOM - 30 }
            },
            // Short corner option
            shortCorner: { x: cornerPos.x - direction * 32, y: cornerPos.y + (isRightCorner ? 28 : -28) },
            // Counter-attack prevention (hold defensive shape)
            defensiveCover: [
                { x: opponentGoalX - direction * 285, y: 210 },
                { x: opponentGoalX - direction * 285, y: 390 },
                { x: opponentGoalX - direction * 250, y: PITCH_HEIGHT / 2 }
            ]
        };

        if (!gameState._cornerPosManager) gameState._cornerPosManager = new PositionManager();
        const posManager = gameState._cornerPosManager;

        const setupKey = `_lastCornerAttSetup_H${gameState.currentHalf}`;
        if (!gameState[setupKey] || gameState[setupKey] !== gameState.setPiece) {
            gameState[setupKey] = gameState.setPiece;
            posManager.reset();
            
            // Mark priority zones for runs
            posManager.markPriorityZone(ZONES.nearPostRun.target.x, ZONES.nearPostRun.target.y);
            posManager.markPriorityZone(ZONES.farPost.target.x, ZONES.farPost.target.y);
            
            const playerJobs = new Map();
            const validTeammates = getValidPlayers(teammates).filter(p => p.role !== 'GK');
            
            // ENHANCED: Position-specific role assignment
            // Separate players by tactical mentality
            const attackingPlayers = validTeammates.filter(p =>
                getPlayerTacticalMentality(p) === 'attacking'
            );
            const defensivePlayers = validTeammates.filter(p =>
                getPlayerTacticalMentality(p) === 'defensive'
            );
            const balancedPlayers = validTeammates.filter(p =>
                getPlayerTacticalMentality(p) === 'balanced'
            );

            // Select players based on attributes AND position
            const bestKicker = sortedLists.teammates.bestKickers[0];
            const aerialThreats = sortedLists.teammates.bestHeaders.slice(0, 4);
            const fastRunners = sortedLists.teammates.fastest.slice(0, 3);

            // Defenders: Only commit if desperate, otherwise stay back
            const defendersToCommit = shouldCommit ?
                defensivePlayers.filter(p => p.role !== 'GK').slice(0, 1) :
                [];
            const defendersToStayBack = shouldCommit ?
                defensivePlayers.filter(p => !defendersToCommit.includes(p) && p.role !== 'GK').slice(0, 2) :
                defensivePlayers.filter(p => p.role !== 'GK').slice(0, 3);

            const assigned = new Set();

            // Assign kicker - prefer players with good passing/crossing
            if (bestKicker) {
                const kickerId = String(bestKicker.id);
                playerJobs.set(kickerId, {
                    x: cornerPos.x - direction * 8,
                    y: cornerPos.y + 8,
                    movement: 'corner_kicker',
                    role: 'CORNER_KICKER',
                    priority: 10
                });
                assigned.add(kickerId);
            }

            // Strikers and attacking players - prioritize for attacking roles
            // Near post runner - fast striker or winger (arrives first)
            if (fastRunners[0] && !assigned.has(String(fastRunners[0].id))) {
                const runnerId = String(fastRunners[0].id);
                playerJobs.set(runnerId, {
                    ...ZONES.nearPostRun.start,
                    targetX: ZONES.nearPostRun.target.x,
                    targetY: ZONES.nearPostRun.target.y,
                    movement: 'near_post_run',
                    role: 'NEAR_POST_RUNNER',
                    runTiming: 'ON_KICK',
                    priority: 10
                });
                assigned.add(runnerId);
            }

            // Far post threat - best header (powerful presence)
            if (aerialThreats[0] && !assigned.has(String(aerialThreats[0].id))) {
                const headerId = String(aerialThreats[0].id);
                playerJobs.set(headerId, {
                    ...ZONES.farPost.start,
                    targetX: ZONES.farPost.target.x,
                    targetY: ZONES.farPost.target.y,
                    movement: 'far_post_attack',
                    role: 'FAR_POST_THREAT',
                    runTiming: 'DELAYED',
                    priority: 10
                });
                assigned.add(headerId);
            }

            // Penalty spot presence - central threat
            if (aerialThreats[1] && !assigned.has(String(aerialThreats[1].id))) {
                const penaltyId = String(aerialThreats[1].id);
                playerJobs.set(penaltyId, {
                    ...ZONES.penaltySpot.start,
                    targetX: ZONES.penaltySpot.target.x,
                    targetY: ZONES.penaltySpot.target.y,
                    movement: 'penalty_spot_threat',
                    role: 'PENALTY_SPOT',
                    runTiming: 'IMMEDIATE',
                    priority: 9
                });
                assigned.add(penaltyId);
            }

            // Six-yard box threat - close-range finisher
            if (aerialThreats[2] && !assigned.has(String(aerialThreats[2].id))) {
                const sixYardId = String(aerialThreats[2].id);
                playerJobs.set(sixYardId, {
                    ...ZONES.sixYardSpot.start,
                    targetX: ZONES.sixYardSpot.target.x,
                    targetY: ZONES.sixYardSpot.target.y,
                    movement: 'six_yard_threat',
                    role: 'SIX_YARD',
                    runTiming: 'ON_KICK',
                    priority: 9
                });
                assigned.add(sixYardId);
            }

            // Blocking run - creates space for others (decoy)
            if (fastRunners[1] && !assigned.has(String(fastRunners[1].id))) {
                const blockerId = String(fastRunners[1].id);
                playerJobs.set(blockerId, {
                    ...ZONES.blockingRun.start,
                    targetX: ZONES.blockingRun.target.x,
                    targetY: ZONES.blockingRun.target.y,
                    movement: 'blocking_run',
                    role: 'BLOCKER',
                    runTiming: 'EARLY',
                    priority: 8
                });
                assigned.add(blockerId);
            }

            // Decoy near post run - pulls defenders
            const decoyRunner = validTeammates.find(p =>
                !assigned.has(String(p.id)) &&
                (p.role.includes('CM') || p.role.includes('CAM') || p.role.includes('ST'))
            );
            if (decoyRunner) {
                playerJobs.set(String(decoyRunner.id), {
                    ...ZONES.decoyNearPost.start,
                    targetX: ZONES.decoyNearPost.target.x,
                    targetY: ZONES.decoyNearPost.target.y,
                    movement: 'decoy_near_post',
                    role: 'DECOY',
                    runTiming: 'EARLY',
                    priority: 7
                });
                assigned.add(String(decoyRunner.id));
            }

            // Edge of box positions - three players for rebounds/cutbacks
            const edgePositions = [ZONES.edgeBox, ZONES.edgeBoxLeft, ZONES.edgeBoxRight];
            const edgePlayers = validTeammates
                .filter(p => !assigned.has(String(p.id)) && (p.role.includes('CM') || p.role.includes('CDM') || p.role.includes('CAM')))
                .slice(0, 3);

            edgePlayers.forEach((edgePlayer, idx) => {
                if (edgePositions[idx]) {
                    const finalPos = posManager.findValidPosition(edgePositions[idx]);
                    playerJobs.set(String(edgePlayer.id), {
                        ...finalPos,
                        movement: `edge_box_${idx}`,
                        role: `EDGE_BOX_${idx}`,
                        priority: 6
                    });
                    assigned.add(String(edgePlayer.id));
                }
            });

            // [defenders-fix] Defensive cover - prevent counter (3 players now)
            // Use defendersToStayBack instead of undefined 'defenders' variable
            let defIdx = 0;
            defendersToStayBack.forEach(def => {
                if (!assigned.has(String(def.id)) && defIdx < ZONES.defensiveCover.length) {
                    const finalPos = posManager.findValidPosition(ZONES.defensiveCover[defIdx]);
                    playerJobs.set(String(def.id), {
                        ...finalPos,
                        movement: 'defensive_cover_corner',
                        role: `DEFENSIVE_COVER_${defIdx}`,
                        priority: 5
                    });
                    assigned.add(String(def.id));
                    defIdx++;
                }
            });
            
            // Remaining players - support positions
            let supportIdx = 0;
            validTeammates.forEach(p => {
                if (!assigned.has(String(p.id))) {
                    const activePos = window.getPlayerActivePosition(p, gameState.currentHalf);
                    const finalPos = posManager.findValidPosition(activePos);
                    playerJobs.set(String(p.id), {
                        ...finalPos,
                        movement: 'support_corner',
                        role: `SUPPORT_${supportIdx}`,
                        priority: 3
                    });
                    supportIdx++;
                }
            });
            
            gameState._cornerJobAssignments = playerJobs;
        }

        const playerIdStr = String(player.id);
        const myPositionData = gameState._cornerJobAssignments?.get(playerIdStr);

        if (myPositionData) {
            // OFSAYT KONTROLÜ: Hücum pozisyonlarında ofsayt kontrolü yap
            const opponents = getValidPlayers(player.isHome ? gameState.awayPlayers : gameState.homePlayers);
            const adjustedPosition = checkAndAdjustOffsidePosition(
                myPositionData,
                player,
                opponentGoalX,
                opponents,
                gameState
            );
            return sanitizePosition(adjustedPosition, { player, gameState, behavior: 'ProfessionalCornerAttacking' });
        }

        const activePos = window.getPlayerActivePosition(player, gameState.currentHalf);
        return sanitizePosition({ x: activePos.x, y: activePos.y, movement: 'fallback_corner_att' }, { player });
    },

    getDefendingCornerPosition(player, cornerPos, ownGoalX, opponents, sortedLists, system, gameState, teammates) {
        if (!gameState || !player || !cornerPos) {
            return sanitizePosition({ x: player?.x ?? 400, y: player?.y ?? 300, movement: 'error_corner_def' }, { player });
        }

        if (player.role === 'GK') {
            // GK positioning based on corner side
            const isRightCorner = cornerPos.y < (PITCH_HEIGHT / 2);
            const gkY = isRightCorner ? activeConfig.GOAL_Y_TOP + 50 : activeConfig.GOAL_Y_BOTTOM - 50;
            return sanitizePosition({ x: ownGoalX, y: gkY, movement: 'gk_corner_positioning', role: 'GK' }, { player, role: 'GK' });
        }

        if (!sortedLists) sortedLists = getSortedLists(teammates, opponents);

        const direction = Math.sign(ownGoalX - (PITCH_WIDTH / 2));
        const context = new TacticalContext(gameState, SET_PIECE_TYPES.CORNER_KICK);
        const useManMarking = system === 'man_marking' || context.shouldStayCompact(player.isHome);

        // Professional defensive zones
        const ZONES = {
            goalLine: { x: ownGoalX + direction * 8, y: PITCH_HEIGHT / 2 },
            nearPost6Y: { x: ownGoalX + direction * 30, y: activeConfig.GOAL_Y_TOP + 20 },
            farPost6Y: { x: ownGoalX + direction * 30, y: activeConfig.GOAL_Y_BOTTOM - 20 },
            central: { x: ownGoalX + direction * 35, y: PITCH_HEIGHT / 2 },
            penaltySpot: { x: ownGoalX + direction * 110, y: PITCH_HEIGHT / 2 },
            nearPostPenalty: { x: ownGoalX + direction * 95, y: activeConfig.GOAL_Y_TOP + 40 },
            farPostPenalty: { x: ownGoalX + direction * 95, y: activeConfig.GOAL_Y_BOTTOM - 40 },
            edgeBox: { x: ownGoalX + direction * 180, y: PITCH_HEIGHT / 2 },
            shortCornerPress: { x: cornerPos.x + direction * 20, y: cornerPos.y }
        };

        if (!gameState._cornerDefPosManager) gameState._cornerDefPosManager = new PositionManager();
        const posManager = gameState._cornerDefPosManager;

        const setupKey = `_lastCornerDefSetup_H${gameState.currentHalf}`;
        if (!gameState[setupKey] || gameState[setupKey] !== gameState.setPiece) {
            gameState[setupKey] = gameState.setPiece;
            posManager.reset();
            
            const playerJobs = new Map();
            const validTeammates = getValidPlayers(teammates).filter(p => p.role !== 'GK');
            const validOpponents = getValidPlayers(opponents).filter(p => p.role !== 'GK');
            
            const opponentMap = new Map(validOpponents.map(p => [String(p.id), p]));
            gameState._cornerOpponentMap = opponentMap;

            const assigned = new Set();

            if (useManMarking) {
                // Man-marking: Assign best defenders to dangerous attackers
                const dangerousAttackers = sortedLists.opponents.mostDangerous.slice(0, Math.min(6, validTeammates.length));
                const bestMarkers = sortedLists.teammates.bestDefenders;
                
                dangerousAttackers.forEach((attacker, idx) => {
                    if (bestMarkers[idx]) {
                        const markerId = String(bestMarkers[idx].id);
                        playerJobs.set(markerId, {
                            role: `MARK_${attacker.id}`,
                            movement: 'tight_man_mark',
                            targetId: String(attacker.id),
                            priority: 10
                        });
                        assigned.add(markerId);
                    }
                });
            } else {
                // Zonal marking with intelligent positioning
                const zonalAssignments = [
                    { zone: 'nearPost6Y', priority: 10, count: 1 },
                    { zone: 'farPost6Y', priority: 10, count: 1 },
                    { zone: 'central', priority: 9, count: 1 },
                    { zone: 'penaltySpot', priority: 8, count: 1 },
                    { zone: 'nearPostPenalty', priority: 7, count: 1 },
                    { zone: 'farPostPenalty', priority: 7, count: 1 }
                ];

                let playerIdx = 0;
                zonalAssignments.forEach(assignment => {
                    for (let i = 0; i < assignment.count && playerIdx < validTeammates.length; i++) {
                        const p = validTeammates[playerIdx];
                        const playerId = String(p.id);
                        
                        if (!assigned.has(playerId)) {
                            const zonePos = ZONES[assignment.zone];
                            const finalPos = posManager.findValidPosition(zonePos);
                            
                            playerJobs.set(playerId, {
                                ...finalPos,
                                movement: `zone_${assignment.zone}`,
                                role: `ZONE_${assignment.zone.toUpperCase()}`,
                                priority: assignment.priority
                            });
                            assigned.add(playerId);
                        }
                        playerIdx++;
                    }
                });
            }

            // Short corner presser - fast player
            const fastPlayer = sortedLists.teammates.fastest.find(p => !assigned.has(String(p.id)));
            if (fastPlayer) {
                const finalPos = posManager.findValidPosition(ZONES.shortCornerPress);
                playerJobs.set(String(fastPlayer.id), {
                    ...finalPos,
                    movement: 'short_corner_press',
                    role: 'SHORT_PRESS',
                    priority: 6
                });
                assigned.add(String(fastPlayer.id));
            }

            // Remaining players - edge of box
            validTeammates.forEach(p => {
                if (!assigned.has(String(p.id))) {
                    const finalPos = posManager.findValidPosition(ZONES.edgeBox);
                    playerJobs.set(String(p.id), {
                        ...finalPos,
                        movement: 'edge_box_cover',
                        role: 'EDGE_COVER',
                        priority: 5
                    });
                }
            });

            gameState._cornerDefJobAssignments = playerJobs;
        }

        const playerIdStr = String(player.id);
        const myPositionData = gameState._cornerDefJobAssignments?.get(playerIdStr);

        if (myPositionData) {
            let finalPos = { ...myPositionData };
            
            // Dynamic man-marking updates
            if (finalPos.role?.startsWith('MARK_')) {
                const targetIdStr = finalPos.targetId || finalPos.role.split('_')[1];
                const target = gameState._cornerOpponentMap?.get(targetIdStr);
                
                if (target) {
                    // Stay goal-side and slightly offset
                    finalPos.x = target.x - direction * 8;
                    finalPos.y = target.y + (Math.random() - 0.5) * 4;
                    finalPos.movement = 'active_man_mark';
                } else {
                    // Target lost - drop into zone
                    finalPos = { ...ZONES.central };
                    finalPos.movement = 'zone_fallback';
                }
            }
            
            return sanitizePosition(finalPos, { player, gameState, behavior: 'ProfessionalCornerDefending' });
        }

        const activePos = window.getPlayerActivePosition(player, gameState.currentHalf);
        return sanitizePosition({ x: activePos.x, y: activePos.y, movement: 'fallback_corner_def' }, { player });
    }
};
