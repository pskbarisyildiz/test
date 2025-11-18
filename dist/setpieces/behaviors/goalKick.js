/**
 * Goal Kick Behaviors - TypeScript Migration
 *
 * Professional goal kick positioning system with:
 * - Attacking goal kick formations (short build-up and long direct play)
 * - Defensive goal kick positioning (high press and mid-block)
 * - Formation-aware positioning for remaining players
 * - Penalty area rule compliance for defending team
 * - Role-based player assignments with tactical variations
 *
 * @module setpieces/behaviors/goalKick
 * @migrated-from js/setpieces/behaviors/goalKick.js
 */
import { sanitizePosition, TacticalContext, PositionManager, getValidPlayers, getSortedLists } from '../utils';
import { GAME_CONFIG } from '../../config';
import { getPlayerActivePosition } from '../../ai/movement';
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function getFormationAnchorForPlayer(player, gameState) {
    if (!player || !gameState)
        return null;
    const PITCH_WIDTH = GAME_CONFIG.PITCH_WIDTH;
    const PITCH_HEIGHT = GAME_CONFIG.PITCH_HEIGHT;
    const currentHalf = gameState.currentHalf ?? 1;
    const hasHomeCoords = typeof player.homeX === 'number' && typeof player.homeY === 'number';
    if (hasHomeCoords) {
        const mirrorX = currentHalf === 2
            ? PITCH_WIDTH - player.homeX
            : player.homeX;
        const safeX = Math.max(10, Math.min(PITCH_WIDTH - 10, mirrorX));
        const safeY = Math.max(10, Math.min(PITCH_HEIGHT - 10, player.homeY));
        return { x: safeX, y: safeY };
    }
    if (typeof window !== 'undefined' && typeof getPlayerActivePosition === 'function') {
        return getPlayerActivePosition(player, currentHalf);
    }
    return {
        x: player?.x ?? PITCH_WIDTH / 2,
        y: player?.y ?? PITCH_HEIGHT / 2
    };
}
// ============================================================================
// PROFESSIONAL GOAL KICK BEHAVIORS
// ============================================================================
export const ProfessionalGoalKickBehaviors = {
    getGoalKickPosition(player, ownGoalX, tactic, playShort, gameState, teammates) {
        if (!gameState || !player) {
            return sanitizePosition({ x: player?.x ?? 400, y: player?.y ?? 300, movement: 'error_gk' }, { player });
        }
        const PITCH_WIDTH = GAME_CONFIG.PITCH_WIDTH;
        const PITCH_HEIGHT = GAME_CONFIG.PITCH_HEIGHT;
        if (player.role === 'GK') {
            const gkX = ownGoalX + (ownGoalX < 400 ? 70 : -70);
            return sanitizePosition({ x: gkX, y: 300, movement: 'gk_take_kick' }, { player, role: 'GK' });
        }
        const shouldBuildFromBack = playShort || tactic === 'possession';
        // ✅ FIX: Players should move AWAY from own goal, towards opponent goal
        // If ownGoalX < 400 (left side), direction should be +1 (move right)
        // If ownGoalX > 400 (right side), direction should be -1 (move left)
        const direction = ownGoalX < 400 ? 1 : -1;
        if (!gameState._goalKickPosManager)
            gameState._goalKickPosManager = new PositionManager();
        const posManager = gameState._goalKickPosManager;
        const setupKey = `_lastGoalKickSetup_H${gameState.currentHalf}`;
        if (!gameState[setupKey] || gameState[setupKey] !== gameState.setPiece) {
            gameState[setupKey] = gameState.setPiece;
            posManager.reset();
            const playerJobs = new Map();
            const validTeammates = getValidPlayers(teammates).filter(p => p.role !== 'GK');
            const sortedLists = getSortedLists(validTeammates, []);
            const assigned = new Set();
            if (shouldBuildFromBack) {
                // Short goal kick - modern build-up play pattern
                const defenders = sortedLists.teammates.bestDefenders.slice(0, 4);
                const midfielders = validTeammates.filter(p => ['CM', 'CDM', 'CAM'].some(r => p.role.includes(r))).slice(0, 3);
                // Center backs - split wide to create passing lanes
                if (defenders[0]) {
                    const finalPos = posManager.findValidPosition({
                        x: ownGoalX + direction * 85,
                        y: 195
                    });
                    playerJobs.set(String(defenders[0].id), {
                        ...finalPos,
                        movement: 'cb_build_left',
                        role: 'CB_LEFT',
                        priority: 10
                    });
                    assigned.add(String(defenders[0].id));
                }
                if (defenders[1]) {
                    const finalPos = posManager.findValidPosition({
                        x: ownGoalX + direction * 135,
                        y: 405
                    });
                    playerJobs.set(String(defenders[1].id), {
                        ...finalPos,
                        movement: 'cb_build_right',
                        role: 'CB_RIGHT',
                        priority: 10
                    });
                    assigned.add(String(defenders[1].id));
                }
                // Full backs push very wide - modern width
                if (defenders[2]) {
                    const finalPos = posManager.findValidPosition({
                        x: ownGoalX + direction * 185,
                        y: 90
                    });
                    playerJobs.set(String(defenders[2].id), {
                        ...finalPos,
                        movement: 'fb_wide_left',
                        role: 'FB_LEFT',
                        priority: 9
                    });
                    assigned.add(String(defenders[2].id));
                }
                if (defenders[3]) {
                    const finalPos = posManager.findValidPosition({
                        x: ownGoalX + direction * 185,
                        y: 510
                    });
                    playerJobs.set(String(defenders[3].id), {
                        ...finalPos,
                        movement: 'fb_wide_right',
                        role: 'FB_RIGHT',
                        priority: 9
                    });
                    assigned.add(String(defenders[3].id));
                }
                // Holding midfielder drops between CBs (pivot)
                const pivot = midfielders.find(p => p.role.includes('CDM')) || midfielders[0];
                if (pivot && !assigned.has(String(pivot.id))) {
                    const finalPos = posManager.findValidPosition({
                        x: ownGoalX + direction * 250,
                        y: 300
                    });
                    playerJobs.set(String(pivot.id), {
                        ...finalPos,
                        movement: 'pivot_drop',
                        role: 'PIVOT',
                        priority: 9
                    });
                    assigned.add(String(pivot.id));
                }
                // Central midfielders show for pass - staggered positions
                const remainingMids = midfielders.filter(p => !assigned.has(String(p.id)));
                remainingMids.forEach((mid, idx) => {
                    const yPos = idx === 0 ? 220 : 380;
                    const xOffset = idx === 0 ? 175 : 185; // Slightly staggered
                    const finalPos = posManager.findValidPosition({
                        x: ownGoalX + direction * xOffset,
                        y: yPos
                    });
                    playerJobs.set(String(mid.id), {
                        ...finalPos,
                        movement: 'midfield_show',
                        role: `MID_RECEIVER_${idx}`,
                        priority: 8
                    });
                    assigned.add(String(mid.id));
                });
                // Striker drops slightly to offer outlet
                const striker = validTeammates.find(p => p.role.includes('ST') && !assigned.has(String(p.id)));
                if (striker) {
                    const finalPos = posManager.findValidPosition({
                        x: ownGoalX + direction * 400,
                        y: 300
                    });
                    playerJobs.set(String(striker.id), {
                        ...finalPos,
                        movement: 'striker_drop_outlet',
                        role: 'STRIKER_OUTLET',
                        priority: 7
                    });
                    assigned.add(String(striker.id));
                }
            }
            else {
                // Long goal kick - direct play to forwards
                const targetMen = sortedLists.teammates.bestHeaders.slice(0, 2);
                const wingers = validTeammates.filter(p => ['LW', 'RW', 'RM', 'LM'].some(r => p.role.includes(r))).slice(0, 2);
                // Primary target striker - central, in opponent half
                if (targetMen[0] && !assigned.has(String(targetMen[0].id))) {
                    const finalPos = posManager.findValidPosition({
                        x: PITCH_WIDTH / 2 + direction * 125,
                        y: 300
                    });
                    playerJobs.set(String(targetMen[0].id), {
                        ...finalPos,
                        movement: 'target_striker_long',
                        role: 'TARGET_STRIKER',
                        priority: 10
                    });
                    assigned.add(String(targetMen[0].id));
                }
                // Secondary target - offset for variation
                if (targetMen[1] && !assigned.has(String(targetMen[1].id))) {
                    const finalPos = posManager.findValidPosition({
                        x: PITCH_WIDTH / 2 + direction * 115,
                        y: 240
                    });
                    playerJobs.set(String(targetMen[1].id), {
                        ...finalPos,
                        movement: 'target_secondary',
                        role: 'SECONDARY_TARGET',
                        priority: 9
                    });
                    assigned.add(String(targetMen[1].id));
                }
                // Wingers on flanks - positioned for flick-ons and second balls
                if (wingers[0] && !assigned.has(String(wingers[0].id))) {
                    const finalPos = posManager.findValidPosition({
                        x: PITCH_WIDTH / 2 + direction * 90,
                        y: 115
                    });
                    playerJobs.set(String(wingers[0].id), {
                        ...finalPos,
                        movement: 'winger_flank_left',
                        role: 'WINGER_LEFT',
                        priority: 8
                    });
                    assigned.add(String(wingers[0].id));
                }
                if (wingers[1] && !assigned.has(String(wingers[1].id))) {
                    const finalPos = posManager.findValidPosition({
                        x: PITCH_WIDTH / 2 + direction * 90,
                        y: 485
                    });
                    playerJobs.set(String(wingers[1].id), {
                        ...finalPos,
                        movement: 'winger_flank_right',
                        role: 'WINGER_RIGHT',
                        priority: 8
                    });
                    assigned.add(String(wingers[1].id));
                }
                // Attacking midfielders push up for second balls
                const attackingMids = validTeammates.filter(p => !assigned.has(String(p.id)) &&
                    ['CM', 'CAM'].some(r => p.role.includes(r))).slice(0, 2);
                attackingMids.forEach((mid, idx) => {
                    const yPos = idx === 0 ? 245 : 355;
                    const finalPos = posManager.findValidPosition({
                        x: PITCH_WIDTH / 2 + direction * 30,
                        y: yPos
                    });
                    playerJobs.set(String(mid.id), {
                        ...finalPos,
                        movement: 'second_ball_mid',
                        role: `SECOND_BALL_${idx}`,
                        priority: 7
                    });
                    assigned.add(String(mid.id));
                });
                // Holding midfielder stays back for defensive security
                const holdingMid = validTeammates.find(p => !assigned.has(String(p.id)) &&
                    p.role.includes('CDM'));
                if (holdingMid) {
                    const finalPos = posManager.findValidPosition({
                        x: PITCH_WIDTH / 2 - direction * 20,
                        y: 300
                    });
                    playerJobs.set(String(holdingMid.id), {
                        ...finalPos,
                        movement: 'holding_mid_security',
                        role: 'HOLDING_MID',
                        priority: 6
                    });
                    assigned.add(String(holdingMid.id));
                }
            }
            // Remaining players - spread them out based on their FORMATION positions
            const remainingPlayers = validTeammates.filter(p => !assigned.has(String(p.id)));
            remainingPlayers.forEach((p) => {
                // 1. Get the player's ACTUAL formation position for this half.
                // This is the "original location" we want to trust.
                const formationAnchor = getFormationAnchorForPlayer(p, gameState);
                if (!formationAnchor) {
                    // This should not happen, but as a fallback, place them in a safe zone.
                    console.warn(`Goal Kick: Could not find formation anchor for ${p.name}`);
                    // ✅ FIX: Clamp fallback position to safe bounds
                    let fallbackX = ownGoalX + direction * 150 + (Math.random() - 0.5) * 40;
                    fallbackX = Math.max(50, Math.min(750, fallbackX)); // Ensure within pitch bounds
                    const fallbackPos = {
                        x: fallbackX,
                        y: (PITCH_HEIGHT / 2) + (Math.random() - 0.5) * 100
                    };
                    const finalPos = posManager.findValidPosition(fallbackPos);
                    playerJobs.set(String(p.id), {
                        ...finalPos,
                        movement: 'support_gk_fallback',
                        role: 'SUPPORT',
                        priority: 5
                    });
                    return; // Skip to next player
                }
                let targetX = formationAnchor.x;
                let targetY = formationAnchor.y; // Trust the original Y position
                // 2. Enforce the ONLY rule that matters: Stay in your own half.
                const halfBuffer = 10; // 10px from center line
                const midLine = PITCH_WIDTH / 2;
                if (direction === 1) { // ownGoalX is on left (direction is to the right)
                    // Player must be left of the midline
                    targetX = Math.min(targetX, midLine - halfBuffer);
                }
                else { // ownGoalX is on right (direction is to the left)
                    // Player must be right of the midline
                    targetX = Math.max(targetX, midLine + halfBuffer);
                }
                // 3. REMOVED all X and Y clamping.
                // We let the player go to their real Y position (e.g., y: 40 for a wide fullback).
                // The PositionManager will handle any collisions.
                const spreadPos = {
                    x: targetX,
                    y: targetY
                };
                const finalPos = posManager.findValidPosition(spreadPos);
                playerJobs.set(String(p.id), {
                    ...finalPos,
                    movement: 'support_gk_formation', // New descriptive movement name
                    role: 'SUPPORT',
                    priority: 5
                });
            });
            gameState._goalKickJobAssignments = playerJobs;
        }
        const playerIdStr = String(player.id);
        const myPositionData = gameState._goalKickJobAssignments?.get(playerIdStr);
        if (myPositionData) {
            return sanitizePosition(myPositionData, { player, gameState, behavior: 'ProfessionalGoalKick' });
        }
        const activePos = getPlayerActivePosition(player, gameState.currentHalf);
        return sanitizePosition({ x: activePos.x, y: activePos.y, movement: 'fallback_goal_kick' }, { player });
    },
    getDefendingGoalKickPosition(player, opponentGoalX, ownGoalX, gameState, _opponents, teammates) {
        if (!gameState || !player || player.role === 'GK') {
            return sanitizePosition({ x: ownGoalX, y: 300, movement: 'gk_stay_goal' }, { player, role: 'GK' });
        }
        const PITCH_WIDTH = GAME_CONFIG.PITCH_WIDTH;
        const PITCH_HEIGHT = GAME_CONFIG.PITCH_HEIGHT;
        const SET_PIECE_TYPES = { GOAL_KICK: 'GOAL_KICK' };
        const context = new TacticalContext(gameState, SET_PIECE_TYPES.GOAL_KICK);
        const shouldPress = context.shouldCommitForward(player.isHome);
        const direction = Math.sign(opponentGoalX - 400);
        if (!gameState._goalKickDefPosManager)
            gameState._goalKickDefPosManager = new PositionManager();
        const posManager = gameState._goalKickDefPosManager;
        const setupKey = `_lastGoalKickDefSetup_H${gameState.currentHalf}`;
        if (!gameState[setupKey] || gameState[setupKey] !== gameState.setPiece) {
            gameState[setupKey] = gameState.setPiece;
            posManager.reset();
            const playerJobs = new Map();
            const validTeammates = getValidPlayers(teammates).filter(p => p.role !== 'GK');
            const sortedLists = getSortedLists(validTeammates, []);
            const assigned = new Set();
            if (shouldPress) {
                // High press on goal kick - RESPECT PENALTY AREA RULE
                // Opposing players MUST stay OUTSIDE the penalty area (18 yards = ~165px from goal line)
                // Players can only enter after the ball leaves the penalty area
                const PENALTY_AREA_DISTANCE = 170; // 18 yards + safety margin
                const pressers = sortedLists.teammates.fastest.slice(0, 3);
                pressers.forEach((presser, idx) => {
                    const yPos = 200 + idx * 100;
                    // Position OUTSIDE penalty area - minimum 170 pixels from goal
                    const finalPos = posManager.findValidPosition({
                        x: opponentGoalX - direction * PENALTY_AREA_DISTANCE,
                        y: yPos
                    });
                    playerJobs.set(String(presser.id), {
                        ...finalPos,
                        movement: 'high_press_gk_outside_box',
                        role: `PRESSER_${idx}`,
                        priority: 9
                    });
                    assigned.add(String(presser.id));
                });
                // Block passing lanes - also stay outside penalty area
                const laneBlockers = validTeammates.filter(p => !assigned.has(String(p.id))).slice(0, 4);
                laneBlockers.forEach((blocker, idx) => {
                    const xPos = opponentGoalX - direction * (PENALTY_AREA_DISTANCE + 20); // Extra margin for lane blockers
                    const yPos = 150 + idx * 100;
                    const finalPos = posManager.findValidPosition({ x: xPos, y: yPos });
                    playerJobs.set(String(blocker.id), {
                        ...finalPos,
                        movement: 'block_lane_outside_box',
                        role: `LANE_BLOCK_${idx}`,
                        priority: 8
                    });
                    assigned.add(String(blocker.id));
                });
            }
            else {
                // Mid-block shape: Use formation anchors, not clustering logic
                validTeammates.forEach((p) => {
                    if (!assigned.has(String(p.id))) {
                        // 1. Get the player's ACTUAL formation position
                        const formationAnchor = getFormationAnchorForPlayer(p, gameState);
                        if (!formationAnchor) {
                            // Fallback if anchor is missing
                            const fallbackPos = {
                                x: PITCH_WIDTH / 2 - direction * 50,
                                y: PITCH_HEIGHT / 2 + (Math.random() - 0.5) * 200
                            };
                            const finalPos = posManager.findValidPosition(fallbackPos);
                            playerJobs.set(String(p.id), {
                                ...finalPos,
                                movement: 'mid_block_fallback',
                                role: 'MID_BLOCK',
                                priority: 7
                            });
                            assigned.add(String(p.id));
                            return; // Skip to next player
                        }
                        // 2. Use the formation anchor as the base
                        let targetX = formationAnchor.x;
                        let targetY = formationAnchor.y; // <-- This respects the player's Y-position
                        // 3. Define the mid-block line (e.g., 50px in own half)
                        const midBlockLineX = PITCH_WIDTH / 2 - direction * 50;
                        // 4. Pull players back to the mid-block line IF they are ahead of it
                        // (e.g., pull STRIKERS back, but leave DEFENDERS where they are)
                        if (direction === 1) { // Attacking right
                            // Pull players back to be LEFT of the line
                            targetX = Math.min(targetX, midBlockLineX);
                        }
                        else { // Attacking left
                            // Pull players back to be RIGHT of the line
                            targetX = Math.max(targetX, midBlockLineX);
                        }
                        // 5. Use the PositionManager to find a valid spot
                        const finalPos = posManager.findValidPosition({ x: targetX, y: targetY });
                        playerJobs.set(String(p.id), {
                            ...finalPos,
                            movement: 'mid_block_formation',
                            role: 'MID_BLOCK',
                            priority: 7
                        });
                        assigned.add(String(p.id));
                    }
                });
            }
            gameState._goalKickDefJobAssignments = playerJobs;
        }
        const playerIdStr = String(player.id);
        const myPositionData = gameState._goalKickDefJobAssignments?.get(playerIdStr);
        if (myPositionData) {
            return sanitizePosition(myPositionData, { player, gameState, behavior: 'ProfessionalGoalKickDefending' });
        }
        const activePos = getPlayerActivePosition(player, gameState.currentHalf);
        return sanitizePosition({ x: activePos.x, y: activePos.y, movement: 'fallback_goal_kick_def' }, { player });
    }
};
// ============================================================================
// BROWSER EXPORTS
// ============================================================================
// Functions are now exported via ES6 modules - no window exports needed
console.log('✅ GOAL KICK BEHAVIORS LOADED (TypeScript)');
//# sourceMappingURL=goalKick.js.map