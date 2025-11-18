/**
 * Throw-In Behaviors - TypeScript Migration
 *
 * Professional throw-in positioning system with:
 * - Attacking throw-in formations with short and long options
 * - Defensive throw-in marking and pressing
 * - Position-aware spacing based on field location
 * - Role-based player assignments
 *
 * @module setpieces/behaviors/throwIn
 * @migrated-from js/setpieces/behaviors/throwIn.js
 */
import { sanitizePosition, PositionManager, getValidPlayers, getSortedLists } from '../utils';
import { GAME_CONFIG } from '../../config';
import { getPlayerActivePosition } from '../../ai/movement';
import { distance as getDistance } from '../../utils/math';
// ============================================================================
// PROFESSIONAL THROW-IN BEHAVIORS
// ============================================================================
export const ThrowInBehaviors = {
    getThrowInPosition(player, throwPos, ownGoalX, opponentGoalX, gameState, teammates, opponents) {
        if (!gameState || !player || !throwPos) {
            return sanitizePosition({ x: player?.x ?? 400, y: player?.y ?? 300, movement: 'error_throw' }, { player });
        }
        if (player.role === 'GK') {
            return sanitizePosition({ x: ownGoalX, y: 300, movement: 'gk_stay_goal', role: 'GK' }, { player, role: 'GK' });
        }
        // CRITICAL FIX: Determine if this player's team has the throw-in
        // If not, they should be defending, not attacking
        const throwInTeam = gameState.setPiece?.team;
        const throwInTeamIsHome = (typeof throwInTeam === 'boolean') ? throwInTeam : (throwInTeam === 'home');
        const hasThrowIn = player.isHome === throwInTeamIsHome;
        // If this player's team doesn't have the throw-in, use defending positioning
        if (!hasThrowIn) {
            return this.getDefendingThrowInPosition(player, throwPos, ownGoalX, gameState, teammates);
        }
        const PITCH_WIDTH = GAME_CONFIG.PITCH_WIDTH;
        const PITCH_HEIGHT = GAME_CONFIG.PITCH_HEIGHT;
        const direction = Math.sign(opponentGoalX - 400);
        const isInAttackingThird = Math.abs(throwPos.x - opponentGoalX) < PITCH_WIDTH / 3;
        const isInDefensiveThird = Math.abs(throwPos.x - ownGoalX) < PITCH_WIDTH / 3;
        const isInMiddleThird = !isInAttackingThird && !isInDefensiveThird;
        if (!gameState._throwInPosManager)
            gameState._throwInPosManager = new PositionManager();
        const posManager = gameState._throwInPosManager;
        const setupKey = `_lastThrowInSetup_H${gameState.currentHalf}`;
        if (!gameState[setupKey] || gameState[setupKey] !== gameState.setPiece) {
            gameState[setupKey] = gameState.setPiece;
            posManager.reset();
            const playerJobs = new Map();
            const validTeammates = getValidPlayers(teammates).filter(p => p.role !== 'GK');
            const sortedLists = getSortedLists(validTeammates, getValidPlayers(opponents));
            const assigned = new Set();
            // Professional throw-in zones - ENHANCED with position-aware spacing
            // CORRECTED: Thrower must be positioned EXACTLY at the touchline (sideline)
            const touchlineY = throwPos.y < 300 ? 5 : (PITCH_HEIGHT - 5); // Top or bottom touchline
            const infieldDirection = throwPos.y < 300 ? 1 : -1; // Direction towards center of pitch
            // Adjust zones based on field position for professional spacing
            const forwardAdvance = isInAttackingThird ? 60 : (isInMiddleThird ? 45 : 30);
            const ZONES = {
                thrower: { x: throwPos.x, y: touchlineY }, // EXACT touchline position
                // Short option - close support for quick return pass
                shortOption: {
                    x: throwPos.x + direction * 28,
                    y: touchlineY + infieldDirection * 32
                },
                // Down the line - runner making forward run along touchline
                downLine: {
                    x: throwPos.x + direction * forwardAdvance,
                    y: touchlineY + infieldDirection * 20
                },
                // Infield - central player offering passing lane
                infield: {
                    x: throwPos.x + direction * 35,
                    y: PITCH_HEIGHT / 2 + (throwPos.y < 300 ? 50 : -50)
                },
                // Support behind - safety option
                support: {
                    x: throwPos.x - direction * 25,
                    y: touchlineY + infieldDirection * 35
                },
                // Deep target - forward player for long throw
                deepTarget: {
                    x: throwPos.x + direction * (forwardAdvance + 50),
                    y: PITCH_HEIGHT / 2
                },
                // Near-side midfielder - link-up play
                nearMidfield: {
                    x: throwPos.x + direction * 20,
                    y: PITCH_HEIGHT / 2 + (throwPos.y < 300 ? 80 : -80)
                },
                // Far-side midfielder - switch play option
                farMidfield: {
                    x: throwPos.x + direction * 30,
                    y: PITCH_HEIGHT / 2 - (throwPos.y < 300 ? 80 : -80)
                },
                // Defensive cover - counter-attack prevention
                defensiveCover: [
                    { x: throwPos.x - direction * (isInAttackingThird ? 120 : 80), y: 220 },
                    { x: throwPos.x - direction * (isInAttackingThird ? 120 : 80), y: 380 },
                    { x: throwPos.x - direction * (isInAttackingThird ? 100 : 60), y: PITCH_HEIGHT / 2 }
                ],
                // Striker positioning - only in attacking third
                strikerPosition: isInAttackingThird ? {
                    x: opponentGoalX - direction * 100,
                    y: PITCH_HEIGHT / 2
                } : null
            };
            // Select thrower - nearest fullback/wingback/winger
            const throwerCandidates = validTeammates
                .filter(p => ['RB', 'LB', 'RWB', 'LWB', 'RW', 'LW', 'RM', 'LM'].some(role => p.role.includes(role)))
                .sort((a, b) => getDistance(a, throwPos) - getDistance(b, throwPos));
            const thrower = throwerCandidates[0] || (validTeammates.length > 0
                ? validTeammates.sort((a, b) => getDistance(a, throwPos) - getDistance(b, throwPos))[0]
                : null);
            if (thrower) {
                playerJobs.set(String(thrower.id), {
                    ...ZONES.thrower,
                    movement: 'throw_in_taker',
                    role: 'THROWER',
                    priority: 10
                });
                assigned.add(String(thrower.id));
            }
            if (isInAttackingThird) {
                // Attacking throw-in - create overload with position-specific roles
                // Strikers - stay forward as deep targets
                const strikers = validTeammates.filter(p => !assigned.has(String(p.id)) &&
                    ['ST', 'CF'].some(r => p.role.includes(r)));
                if (strikers[0] && ZONES.strikerPosition) {
                    const finalPos = posManager.findValidPosition(ZONES.strikerPosition);
                    playerJobs.set(String(strikers[0].id), {
                        ...finalPos,
                        movement: 'striker_target',
                        role: 'STRIKER_TARGET',
                        priority: 9
                    });
                    assigned.add(String(strikers[0].id));
                }
                // Wingers/attacking midfielders - short option and down the line
                const attackers = validTeammates.filter(p => !assigned.has(String(p.id)) &&
                    ['RW', 'LW', 'CAM', 'RM', 'LM'].some(r => p.role.includes(r))).slice(0, 2);
                if (attackers[0]) {
                    const finalPos = posManager.findValidPosition(ZONES.shortOption);
                    playerJobs.set(String(attackers[0].id), {
                        ...finalPos,
                        movement: 'short_option_attack',
                        role: 'SHORT_OPTION',
                        priority: 9
                    });
                    assigned.add(String(attackers[0].id));
                }
                if (attackers[1]) {
                    const finalPos = posManager.findValidPosition(ZONES.downLine);
                    playerJobs.set(String(attackers[1].id), {
                        ...finalPos,
                        movement: 'down_line_run',
                        role: 'DOWN_LINE',
                        runTiming: 'ON_THROW',
                        priority: 8
                    });
                    assigned.add(String(attackers[1].id));
                }
                // Central midfielders - infield link-up
                const midfielders = validTeammates.filter(p => !assigned.has(String(p.id)) &&
                    ['CM', 'CAM'].some(r => p.role.includes(r))).slice(0, 2);
                if (midfielders[0]) {
                    const finalPos = posManager.findValidPosition(ZONES.nearMidfield);
                    playerJobs.set(String(midfielders[0].id), {
                        ...finalPos,
                        movement: 'infield_link',
                        role: 'INFIELD_LINK',
                        priority: 8
                    });
                    assigned.add(String(midfielders[0].id));
                }
                if (midfielders[1]) {
                    const finalPos = posManager.findValidPosition(ZONES.farMidfield);
                    playerJobs.set(String(midfielders[1].id), {
                        ...finalPos,
                        movement: 'far_side_option',
                        role: 'FAR_SIDE',
                        priority: 7
                    });
                    assigned.add(String(midfielders[1].id));
                }
            }
            else if (isInDefensiveThird) {
                // Defensive throw-in - safe options, defenders stay back
                // Defensive midfielder - safe short option
                const defMid = validTeammates.find(p => !assigned.has(String(p.id)) &&
                    ['CDM', 'CM'].some(r => p.role.includes(r)));
                if (defMid) {
                    const finalPos = posManager.findValidPosition(ZONES.shortOption);
                    playerJobs.set(String(defMid.id), {
                        ...finalPos,
                        movement: 'safe_short',
                        role: 'SAFE_OPTION',
                        priority: 9
                    });
                    assigned.add(String(defMid.id));
                }
                // Center backs - support behind for safety
                const centerBacks = validTeammates.filter(p => !assigned.has(String(p.id)) &&
                    ['CB'].some(r => p.role.includes(r))).slice(0, 2);
                if (centerBacks[0]) {
                    const finalPos = posManager.findValidPosition(ZONES.support);
                    playerJobs.set(String(centerBacks[0].id), {
                        ...finalPos,
                        movement: 'defensive_support',
                        role: 'SUPPORT',
                        priority: 8
                    });
                    assigned.add(String(centerBacks[0].id));
                }
                // Attacking players - stay forward for counter-attack outlet
                const forwards = validTeammates.filter(p => !assigned.has(String(p.id)) &&
                    ['ST', 'RW', 'LW'].some(r => p.role.includes(r))).slice(0, 2);
                forwards.forEach((fwd, idx) => {
                    const finalPos = posManager.findValidPosition(idx === 0 ? ZONES.deepTarget : ZONES.infield);
                    playerJobs.set(String(fwd.id), {
                        ...finalPos,
                        movement: 'counter_outlet',
                        role: `OUTLET_${idx}`,
                        priority: 7
                    });
                    assigned.add(String(fwd.id));
                });
            }
            else {
                // Midfield throw-in - balanced approach
                // Midfielders - create passing options
                const mids = validTeammates.filter(p => !assigned.has(String(p.id)) &&
                    ['CM', 'CDM', 'CAM', 'RM', 'LM'].some(r => p.role.includes(r))).slice(0, 3);
                const zones = [ZONES.shortOption, ZONES.nearMidfield, ZONES.infield];
                mids.forEach((mid, idx) => {
                    if (zones[idx]) {
                        const finalPos = posManager.findValidPosition(zones[idx]);
                        playerJobs.set(String(mid.id), {
                            ...finalPos,
                            movement: `midfield_receiver_${idx}`,
                            role: `MID_RECEIVER_${idx}`,
                            priority: 8 - idx
                        });
                        assigned.add(String(mid.id));
                    }
                });
                // Forwards - position for progression
                const attackers = validTeammates.filter(p => !assigned.has(String(p.id)) &&
                    ['ST', 'RW', 'LW'].some(r => p.role.includes(r))).slice(0, 2);
                if (attackers[0]) {
                    const finalPos = posManager.findValidPosition(ZONES.downLine);
                    playerJobs.set(String(attackers[0].id), {
                        ...finalPos,
                        movement: 'forward_run',
                        role: 'FORWARD_RUNNER',
                        priority: 7
                    });
                    assigned.add(String(attackers[0].id));
                }
            }
            // Defensive cover - keep shape
            const defenders = sortedLists.teammates.bestDefenders.filter(p => !assigned.has(String(p.id))).slice(0, 2);
            defenders.forEach((def, idx) => {
                if (ZONES.defensiveCover[idx]) {
                    const finalPos = posManager.findValidPosition(ZONES.defensiveCover[idx]);
                    playerJobs.set(String(def.id), {
                        ...finalPos,
                        movement: 'defensive_cover_throw',
                        role: `DEFENSIVE_COVER_${idx}`,
                        priority: 6
                    });
                    assigned.add(String(def.id));
                }
            });
            // Remaining players - maintain shape
            validTeammates.forEach(p => {
                if (!assigned.has(String(p.id))) {
                    const activePos = getPlayerActivePosition(p, gameState.currentHalf);
                    const finalPos = posManager.findValidPosition(activePos);
                    playerJobs.set(String(p.id), {
                        ...finalPos,
                        movement: 'maintain_shape',
                        role: 'SHAPE',
                        priority: 4
                    });
                }
            });
            gameState._throwInJobAssignments = playerJobs;
        }
        const playerIdStr = String(player.id);
        const myPositionData = gameState._throwInJobAssignments?.get(playerIdStr);
        if (myPositionData) {
            return sanitizePosition(myPositionData, { player, gameState, behavior: 'ProfessionalThrowIn' });
        }
        const activePos = getPlayerActivePosition(player, gameState.currentHalf);
        return sanitizePosition({ x: activePos.x, y: activePos.y, movement: 'fallback_throw' }, { player });
    },
    /**
     * Defending throw-in positioning - opponents mark and cover space
     */
    getDefendingThrowInPosition(player, throwPos, ownGoalX, gameState, teammates) {
        if (!gameState || !player || !throwPos) {
            return sanitizePosition({ x: player?.x ?? 400, y: player?.y ?? 300, movement: 'error_throw_def' }, { player });
        }
        const PITCH_HEIGHT = GAME_CONFIG.PITCH_HEIGHT;
        const direction = Math.sign(throwPos.x - ownGoalX);
        const touchlineY = throwPos.y < 300 ? 5 : (PITCH_HEIGHT - 5);
        if (!gameState._throwInDefPosManager)
            gameState._throwInDefPosManager = new PositionManager();
        const posManager = gameState._throwInDefPosManager;
        const setupKey = `_lastThrowInDefSetup_H${gameState.currentHalf}`;
        if (!gameState[setupKey] || gameState[setupKey] !== gameState.setPiece) {
            gameState[setupKey] = gameState.setPiece;
            posManager.reset();
            const playerJobs = new Map();
            const validTeammates = getValidPlayers(teammates).filter(p => p.role !== 'GK');
            const sortedLists = getSortedLists(validTeammates, []);
            const assigned = new Set();
            // Defending throw-in: Mark thrower and cover passing lanes
            // Position 1-2 players to press thrower
            const pressers = sortedLists.teammates.fastest.slice(0, 2);
            pressers.forEach((presser, idx) => {
                const xOffset = idx === 0 ? 15 : 25;
                const yOffset = throwPos.y < 300 ? 25 : -25;
                const finalPos = posManager.findValidPosition({
                    x: throwPos.x + direction * xOffset,
                    y: touchlineY + yOffset
                });
                playerJobs.set(String(presser.id), {
                    ...finalPos,
                    movement: 'press_thrower',
                    role: `PRESS_THROWER_${idx}`,
                    priority: 9
                });
                assigned.add(String(presser.id));
            });
            // Position defenders to mark potential receivers
            const markers = validTeammates.filter(p => !assigned.has(String(p.id))).slice(0, 4);
            markers.forEach((marker, idx) => {
                const xSpread = throwPos.x + direction * (30 + idx * 25);
                const ySpread = throwPos.y < 300
                    ? 120 + idx * 80
                    : 480 - idx * 80;
                const finalPos = posManager.findValidPosition({
                    x: xSpread,
                    y: ySpread
                });
                playerJobs.set(String(marker.id), {
                    ...finalPos,
                    movement: 'mark_space',
                    role: `MARK_SPACE_${idx}`,
                    priority: 8 - idx
                });
                assigned.add(String(marker.id));
            });
            // Remaining players - maintain defensive shape
            validTeammates.forEach(p => {
                if (!assigned.has(String(p.id))) {
                    const activePos = getPlayerActivePosition(p, gameState.currentHalf);
                    const finalPos = posManager.findValidPosition(activePos);
                    playerJobs.set(String(p.id), {
                        ...finalPos,
                        movement: 'maintain_def_shape',
                        role: 'DEF_SHAPE',
                        priority: 5
                    });
                }
            });
            gameState._throwInDefJobAssignments = playerJobs;
        }
        const playerIdStr = String(player.id);
        const myPositionData = gameState._throwInDefJobAssignments?.get(playerIdStr);
        if (myPositionData) {
            return sanitizePosition(myPositionData, { player, gameState, behavior: 'DefendingThrowIn' });
        }
        const activePos = getPlayerActivePosition(player, gameState.currentHalf);
        return sanitizePosition({ x: activePos.x, y: activePos.y, movement: 'fallback_throw_def' }, { player });
    }
};
// ============================================================================
// BROWSER EXPORTS
// ============================================================================
// Functions are now exported via ES6 modules - no window exports needed
console.log('✅ THROW-IN BEHAVIORS LOADED (TypeScript)');
//# sourceMappingURL=throwIn.js.map