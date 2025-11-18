/**
 * @file main.ts
 * @migrated-from js/main.js
 *
 * Main Initialization and Game Loop
 *
 * This module handles:
 * 1. File upload and Excel data processing
 * 2. UI event listeners
 * 3. Match initialization and setup
 * 4. Game state management (halftime, fulltime)
 * 5. Set piece handling (free kicks, throw-ins, etc.)
 * 6. Match statistics and momentum system
 * 7. Real-time clock and UI updates
 */
import { distance } from './utils/math';
import { getPlayerActivePosition } from './ai';
import { passBall } from './ai';
import { gameState } from './globalExports';
import { GAME_CONFIG, TACTICS, GAME_LOOP, getRoleFromPosition } from './config';
import { EVENT_TYPES } from './types';
import { eventBus } from './eventBus';
import { gameLoop_V2 } from './core';
import { ensureStatsShape, getAttackingGoalX, calculateXG } from './utils/ui';
import { initFirstTouchStats } from './ai/playerFirstTouch';
import { initOffsideStats } from './rules/offside';
import * as SetPieceIntegration from './setpieces/integration';
import { configureSetPieceRoutines } from './setpieces/config';
import { calculatePassSuccess } from './ai/decisions';
import { resolveShot_WithAdvancedGK } from './ai/goalkeeper';
import { selectBestFormation, selectBestTactic, selectBestTeam, initializePlayers } from './gameSetup';
import { render, updateGameUI } from './ui/uiManager';
import { renderGame } from './rendering/gameRenderer';
import { initializeCanvasLayers } from './rendering/canvasSetup';
import { drawPitchBackground } from './rendering/drawPitch';
// ============================================================================
// FILE UPLOAD AND DATA PROCESSING
// ============================================================================
export function handleFileUpload(event) {
    const input = event.target;
    const file = input.files?.[0];
    if (!file)
        return;
    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sayfa1 = workbook.Sheets['Sayfa1'];
        const sayfa1Data = XLSX.utils.sheet_to_json(sayfa1, { header: 1 });
        gameState.teams = [];
        gameState.teamJerseys = {};
        gameState.teamCoaches = {};
        gameState.teamLogos = gameState.teamLogos || {};
        sayfa1Data.slice(1).forEach((row) => {
            if (row[0] && row[0].toString().trim()) {
                const teamName = row[0].toString().trim();
                gameState.teams.push(teamName);
                gameState.teamJerseys[teamName] = {
                    jersey1: row[3] ? row[3].toString().trim() : '#ef4444',
                    jersey2: row[4] ? row[4].toString().trim() : '#3b82f6'
                };
                gameState.teamLogos[teamName] = row[7] ? row[7].toString().trim() : '';
            }
        });
        const oyuncular = workbook.Sheets['oyuncular'];
        const oyuncularData = XLSX.utils.sheet_to_json(oyuncular, { header: 1 });
        gameState.players = oyuncularData.slice(1)
            .filter((row) => {
            const hasName = row[0] && row[0].toString().trim();
            const hasTeam = row[2] && row[2].toString().trim();
            const position = row[3] ? row[3].toString().trim() : '';
            const fotmobId = row[11];
            const rating = row[12];
            if (position.toLowerCase() === 'coach') {
                const teamName = row[2].toString().trim();
                const coachName = row[0].toString().trim();
                gameState.teamCoaches[teamName] = coachName;
                return false;
            }
            const hasValidId = fotmobId && fotmobId.toString().trim() && fotmobId.toString().trim().toLowerCase() !== 'n/a';
            return hasName && hasTeam && hasValidId &&
                rating && !isNaN(parseFloat(rating));
        })
            .map((row, index) => {
            const positionString = row[3]?.toString().trim() || '';
            const isGK = positionString.toLowerCase().includes('keeper') ||
                positionString.toLowerCase().includes('gk');
            const playerId = row[11] ? String(row[11]).trim() : `temp_${index}`;
            const playerRole = typeof getRoleFromPosition === 'function' ? getRoleFromPosition(positionString) : 'CM';
            return {
                id: playerId,
                name: row[0].toString().trim(),
                team: row[2].toString().trim(),
                position: positionString.split(',')[0].trim(),
                role: playerRole,
                pace: parseInt(row[4]) || 60,
                shooting: parseInt(row[5]) || 60,
                passing: parseInt(row[6]) || 60,
                dribbling: parseInt(row[7]) || 60,
                defending: parseInt(row[8]) || 60,
                physicality: parseInt(row[9]) || 60,
                goalkeeping: parseInt(row[10]) || 60,
                rating: parseFloat(row[12]) || 6.5,
                realStats: {
                    chancesCreated: parseFloat(row[13]) || 0,
                    crossesAccuracy: parseFloat(row[14]) || 0,
                    dribblesSucceeded: parseFloat(row[15]) || 0,
                    dispossessed: parseFloat(row[16]) || 0,
                    penaltyWon: parseFloat(row[17]) || 0,
                    foulsWon: parseFloat(row[18]) || 0,
                    aerialsWonPercent: parseFloat(row[19]) || 50,
                    duelWonPercent: parseFloat(row[20]) || 50,
                    interceptions: parseFloat(row[21]) || 0,
                    fouls: parseFloat(row[22]) || 0,
                    recoveries: parseFloat(row[23]) || 0,
                    goals: parseFloat(row[24]) || 0,
                    assists: parseFloat(row[25]) || 0,
                    xG: parseFloat(row[26]) || 0,
                    xGOT: parseFloat(row[27]) || 0,
                    shots: parseFloat(row[28]) || 0,
                    shotsOnTarget: parseFloat(row[29]) || 0,
                    xA: parseFloat(row[30]) || 0,
                    passAccuracy: parseFloat(row[31]) || 70,
                    longBallAccuracy: parseFloat(row[32]) || 50,
                    wonContest: parseFloat(row[33]) || 0,
                    touchesOppBox: parseFloat(row[34]) || 0,
                    gkSaves: isGK ? parseFloat(row[35]) || 0 : 0,
                    gkSavePercent: isGK ? parseFloat(row[36]) || 50 : 0,
                    gkGoalsConceded: isGK ? parseFloat(row[37]) || 0 : 0,
                    gkGoalsPrevented: isGK ? parseFloat(row[38]) || 0 : 0,
                    gkKeeperSweeper: isGK ? parseFloat(row[39]) || 0 : 0,
                    gkErrorLedToGoal: isGK ? parseFloat(row[40]) || 0 : 0,
                    yellowCards: parseFloat(row[41]) || 0,
                    redCards: parseFloat(row[42]) || 0
                }
            };
        });
        gameState.homeTeam = gameState.teams[0] || '';
        gameState.awayTeam = gameState.teams[1] || '';
        gameState.status = 'setup';
        render();
    };
    reader.readAsArrayBuffer(file);
}
export function attachSetupEventListeners() {
    const homeSelect = document.getElementById('homeSelect');
    const awaySelect = document.getElementById('awaySelect');
    const homeTacticSelect = document.getElementById('homeTacticSelect');
    const awayTacticSelect = document.getElementById('awayTacticSelect');
    if (homeSelect) {
        homeSelect.addEventListener('change', (e) => {
            gameState.homeTeam = e.target.value;
            const homeTeamPlayers = gameState.players.filter(p => p.team === gameState.homeTeam);
            gameState.homeFormation = selectBestFormation(homeTeamPlayers);
            gameState.homeTactic = selectBestTactic(homeTeamPlayers);
            gameState.homeTacticManuallySet = false;
            render();
        });
    }
    if (awaySelect) {
        awaySelect.addEventListener('change', (e) => {
            gameState.awayTeam = e.target.value;
            const awayTeamPlayers = gameState.players.filter(p => p.team === gameState.awayTeam);
            gameState.awayFormation = selectBestFormation(awayTeamPlayers);
            gameState.awayTactic = selectBestTactic(awayTeamPlayers);
            gameState.awayTacticManuallySet = false;
            render();
        });
    }
    if (homeTacticSelect) {
        homeTacticSelect.addEventListener('change', (e) => {
            gameState.homeTactic = e.target.value;
            gameState.homeTacticManuallySet = true;
        });
    }
    if (awayTacticSelect) {
        awayTacticSelect.addEventListener('change', (e) => {
            gameState.awayTactic = e.target.value;
            gameState.awayTacticManuallySet = true;
        });
    }
}
// ============================================================================
// GAME LOOP VARIABLES
// ============================================================================
export let isBatchMode = false;
export let lastFrameTime = 0;
export let gameTime = 0;
export let physicsAccumulator = 0;
export let animationFrameId = null;
export let gameIntervalId = null;
export let pendingGameEvents = [];
// ============================================================================
// SET PIECE HANDLERS
// ============================================================================
const CFG = () => GAME_CONFIG;
const resolveSide = (foulTeam) => {
    if (typeof foulTeam === 'boolean')
        return foulTeam ? 'home' : 'away';
    return foulTeam;
};
const invertSide = (side) => side === 'home' ? 'away' : 'home';
export function handleFreeKick(foulLocation, foulTeam) {
    const foulSide = resolveSide(foulTeam);
    const awardSide = invertSide(foulSide);
    const freeKickTeam = (awardSide === "home");
    const pos = {
        x: Number(foulLocation?.x) || CFG().PITCH_WIDTH / 2,
        y: Number(foulLocation?.y) || CFG().PITCH_HEIGHT / 2
    };
    const opponentGoalX = getAttackingGoalX(freeKickTeam, gameState.currentHalf);
    const distToGoal = distance(pos, { x: opponentGoalX, y: 300 });
    const isCentral = Math.abs(pos.y - 300) < 130;
    const isDangerous = distToGoal < 280 && isCentral;
    const executionDelay = isDangerous ? 3000 : 1200;
    gameState.status = 'FREE_KICK';
    gameState.setPiece = {
        type: 'FREE_KICK',
        team: freeKickTeam,
        side: awardSide,
        position: pos,
        executionTime: Date.now() + executionDelay,
        configured: false,
        executed: false,
        isDangerous: isDangerous
    };
    gameState.ballPosition = { x: pos.x, y: pos.y };
    gameState.ballVelocity = { x: 0, y: 0 };
    gameState.ballTrajectory = null;
    gameState.ballHolder = null;
    SetPieceIntegration.ensureCorrectSetPiecePlacement(gameState);
    if (configureSetPieceRoutines) {
        configureSetPieceRoutines(gameState);
    }
    const teamName = (awardSide === "home") ? gameState.homeTeam : gameState.awayTeam;
    gameState.commentary.push({
        text: `${Math.floor(gameState.timeElapsed)}' Free kick for ${teamName}`,
        type: "attack"
    });
}
export function handleThrowIn() {
    const lastPlayer = gameState.lastTouchedBy;
    if (!lastPlayer) {
        console.error(`❌ THROW-IN ERROR: No lastTouchedBy player!`);
        setupKickOff('home');
        return;
    }
    const throwInTeam = !lastPlayer.isHome;
    const throwInY = gameState.ballPosition.y < 300 ? 10 : 590;
    const throwInX = Math.max(50, Math.min(750, gameState.ballPosition.x));
    console.log(`⚾ THROW-IN: Last touch by ${lastPlayer.name} (${lastPlayer.isHome ? 'home' : 'away'}), awarding to ${throwInTeam ? 'home' : 'away'}`);
    gameState.status = 'THROW_IN';
    gameState.setPiece = {
        type: 'THROW_IN',
        team: throwInTeam,
        position: { x: throwInX, y: throwInY },
        executionTime: Date.now() + 1000,
        executed: false
    };
    gameState.ballPosition.x = throwInX;
    gameState.ballPosition.y = throwInY;
    gameState.ballVelocity = { x: 0, y: 0 };
    gameState.ballTrajectory = null;
    gameState.ballHolder = null;
    const teamName = throwInTeam ? gameState.homeTeam : gameState.awayTeam;
    gameState.commentary.push({
        text: `${Math.floor(gameState.timeElapsed)}' Throw-in for ${teamName}`,
        type: 'attack'
    });
}
export function handleBallOutOfBounds() {
    const ballX = gameState.ballPosition.x;
    const lastPlayer = gameState.lastTouchedBy;
    if (!lastPlayer) {
        setupKickOff('home');
        return;
    }
    gameState.ballTrajectory = null;
    gameState.ballHolder = null;
    gameState.ballVelocity = { x: 0, y: 0 };
    gameState.ballHeight = 0;
    const crossedLeftSide = ballX < 50;
    const crossedRightSide = ballX > 750;
    if (!crossedLeftSide && !crossedRightSide) {
        return;
    }
    const homeDefendsLeft = gameState.currentHalf === 1;
    let defendingTeamIsHome;
    if (crossedLeftSide) {
        defendingTeamIsHome = homeDefendsLeft;
    }
    else {
        defendingTeamIsHome = !homeDefendsLeft;
    }
    const defendingTeamTouchedLast = (lastPlayer.isHome === defendingTeamIsHome);
    if (defendingTeamTouchedLast) {
        // Corner kick
        const isLeftCorner = crossedLeftSide;
        const isTopCorner = gameState.ballPosition.y < 300;
        gameState.status = 'CORNER_KICK';
        gameState.setPiece = {
            type: 'CORNER_KICK',
            team: !defendingTeamIsHome,
            position: SetPieceIntegration.getCornerKickPosition(isLeftCorner, isTopCorner),
            executionTime: Date.now() + 1200,
            executed: false
        };
        gameState.ballPosition.x = gameState.setPiece.position.x;
        gameState.ballPosition.y = gameState.setPiece.position.y;
        if (configureSetPieceRoutines) {
            configureSetPieceRoutines(gameState);
        }
        const teamName = !defendingTeamIsHome ? gameState.homeTeam : gameState.awayTeam;
        gameState.commentary.push({
            text: `${Math.floor(gameState.timeElapsed)}' Corner kick for ${teamName}`,
            type: 'attack'
        });
    }
    else {
        // Goal kick
        const gkX = crossedLeftSide ? 50 : 750;
        gameState.status = 'GOAL_KICK';
        gameState.setPiece = {
            type: 'GOAL_KICK',
            team: defendingTeamIsHome,
            position: SetPieceIntegration.getGoalKickPosition(gkX, 'center'),
            executionTime: Date.now() + 1200,
            executed: false
        };
        gameState.ballPosition.x = gameState.setPiece.position.x;
        gameState.ballPosition.y = gameState.setPiece.position.y;
        if (configureSetPieceRoutines) {
            configureSetPieceRoutines(gameState);
        }
        const teamName = defendingTeamIsHome ? gameState.homeTeam : gameState.awayTeam;
        gameState.commentary.push({
            text: `${Math.floor(gameState.timeElapsed)}' Goal kick for ${teamName}`,
            type: 'attack'
        });
    }
}
export function processPendingEvents(currentGameTime) {
    const eventsToProcess = pendingGameEvents.filter(event => currentGameTime >= event.resolveTime);
    pendingGameEvents = pendingGameEvents.filter(event => currentGameTime < event.resolveTime);
    for (const event of eventsToProcess) {
        if (event.type === 'shot_outcome') {
            resolveShot_WithAdvancedGK(event.data);
        }
    }
}
export function restoreFormationAfterSetPiece() {
    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    allPlayers.forEach(player => {
        if (player.role === 'GK') {
            const ownGoalX = getAttackingGoalX(!player.isHome, gameState.currentHalf);
            player.targetX = ownGoalX;
            player.targetY = 300;
        }
        else {
            const activePos = getPlayerActivePosition(player, gameState.currentHalf);
            player.targetX = activePos.x;
            player.targetY = activePos.y;
        }
        player.speedBoost = 1.0;
    });
}
// ============================================================================
// JERSEY AND TEAM SELECTION
// ============================================================================
export function selectJerseys() {
    const homeJerseys = gameState.teamJerseys[gameState.homeTeam];
    const awayJerseys = gameState.teamJerseys[gameState.awayTeam];
    function isValidColor(color) {
        if (!color || typeof color !== 'string')
            return false;
        return /^#[0-9A-F]{6}$/i.test(color.trim());
    }
    const defaultHomeColor = '#ef4444';
    const defaultAwayColor = '#3b82f6';
    if (!homeJerseys || !awayJerseys) {
        gameState.homeJerseyColor = defaultHomeColor;
        gameState.awayJerseyColor = defaultAwayColor;
        return;
    }
    gameState.homeJerseyColor = isValidColor(homeJerseys.jersey1)
        ? homeJerseys.jersey1.trim()
        : defaultHomeColor;
    let awayColor = isValidColor(awayJerseys.jersey1)
        ? awayJerseys.jersey1.trim()
        : defaultAwayColor;
    if (gameState.homeJerseyColor.toLowerCase() === awayColor.toLowerCase()) {
        awayColor = isValidColor(awayJerseys.jersey2)
            ? awayJerseys.jersey2.trim()
            : '#10b981';
    }
    gameState.awayJerseyColor = awayColor;
}
export function setupKickOff(teamWithBall) {
    console.log(`⚽ Setting up kick-off for ${teamWithBall} team`);
    if (teamWithBall !== 'home' && teamWithBall !== 'away') {
        console.error(`❌ setupKickOff: INVALID TEAM "${teamWithBall}"!`);
    }
    const kickoffTeamIsHome = teamWithBall === 'home';
    const setPieceState = {
        type: 'KICK_OFF',
        team: kickoffTeamIsHome,
        position: { x: 400, y: 300 },
        executionTime: Date.now() + 1200,
        configured: false,
        executed: false
    };
    gameState.setPiece = setPieceState;
    gameState.ballTrajectory = null;
    gameState.ballHolder = null;
    gameState.ballPosition = { x: 400, y: 300 };
    gameState.ballVelocity = { x: 0, y: 0 };
    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    const centerX = 400;
    const centerY = 300;
    allPlayers.forEach(p => {
        p.isChasingBall = false;
        p.chaseStartTime = null;
    });
    allPlayers.forEach(player => {
        player.hasBallControl = false;
        player.vx = 0;
        player.vy = 0;
        player.speedBoost = 1.0;
        player.targetLocked = false;
        const activePos = getPlayerActivePosition(player, gameState.currentHalf);
        const ownGoalX = getAttackingGoalX(!player.isHome, gameState.currentHalf);
        const isKickoffTeam = player.isHome === kickoffTeamIsHome;
        const ownHalfIsLeft = ownGoalX < centerX;
        if (player.role === 'GK') {
            player.x = ownGoalX;
            player.y = centerY;
            return;
        }
        const baseDistanceFromCenter = 60;
        const roleAdjustment = player.role.includes('ST') || player.role.includes('FW') || player.role.includes('CF')
            ? 20
            : player.role.includes('MID') || player.role.includes('CM') || player.role.includes('CAM')
                ? 40
                : 80;
        let targetX, targetY;
        if (ownHalfIsLeft) {
            targetX = centerX - baseDistanceFromCenter - roleAdjustment;
            targetX = Math.max(targetX, ownGoalX + 80);
        }
        else {
            targetX = centerX + baseDistanceFromCenter + roleAdjustment;
            targetX = Math.min(targetX, ownGoalX - 80);
        }
        targetY = Math.max(80, Math.min(520, activePos.y));
        if (!isKickoffTeam) {
            const distToCenter = distance({ x: targetX, y: targetY }, { x: centerX, y: centerY });
            if (distToCenter < 70) {
                const angle = Math.atan2(targetY - centerY, targetX - centerX);
                const pushDistance = 75;
                targetX = centerX + Math.cos(angle) * pushDistance;
                targetY = centerY + Math.sin(angle) * pushDistance;
                if (ownHalfIsLeft) {
                    targetX = Math.min(targetX, centerX - 30);
                }
                else {
                    targetX = Math.max(targetX, centerX + 30);
                }
                targetY = Math.max(80, Math.min(520, targetY));
            }
        }
        player.x = targetX;
        player.y = targetY;
        player.targetX = player.x;
        player.targetY = player.y;
    });
    gameState.status = 'KICK_OFF';
    if (configureSetPieceRoutines) {
        configureSetPieceRoutines(gameState);
    }
    const kickOffTeamPlayers = kickoffTeamIsHome ? gameState.homePlayers : gameState.awayPlayers;
    const striker = kickOffTeamPlayers
        .filter(p => p.role === 'ST')
        .sort((a, b) => b.rating - a.rating)[0];
    const midfielder = kickOffTeamPlayers
        .filter(p => ['CAM', 'CM', 'CDM'].includes(p.role))
        .sort((a, b) => b.passing - a.passing)[0];
    if (!striker && !midfielder) {
        console.error('❌ No suitable players for kick-off');
        return;
    }
    const primaryTaker = striker || midfielder;
    const nonGKPlayers = kickOffTeamPlayers.filter(p => p.role !== 'GK');
    const secondaryTaker = striker && midfielder ? midfielder : (nonGKPlayers.length > 1 ? nonGKPlayers[1] : null);
    if (primaryTaker) {
        primaryTaker.x = centerX;
        primaryTaker.y = centerY;
    }
    if (secondaryTaker) {
        const opponentGoalX = getAttackingGoalX(kickoffTeamIsHome, gameState.currentHalf);
        const direction = opponentGoalX > centerX ? -1 : 1;
        secondaryTaker.x = centerX + (direction * 25);
        secondaryTaker.y = centerY;
    }
}
export function removePlayerFromMatch(playerToRemove) {
    if (playerToRemove.isHome) {
        gameState.homePlayers = gameState.homePlayers.filter(p => p.id !== playerToRemove.id);
    }
    else {
        gameState.awayPlayers = gameState.awayPlayers.filter(p => p.id !== playerToRemove.id);
    }
}
export function handleShotAttempt(holder, goalX, allPlayers) {
    const goalkeeper = allPlayers.find(p => p.role === 'GK' && p.isHome !== holder.isHome);
    const opponents = allPlayers.filter(p => p.isHome !== holder.isHome);
    const xG = calculateXG(holder, goalX, holder.y, opponents);
    const teamStats = holder.isHome ? gameState.stats.home : gameState.stats.away;
    teamStats.xGTotal += xG;
    gameState.lastTouchedBy = holder;
    const shootingSkill = holder.shooting / 110;
    const pressureLevel = opponents.filter(opp => distance(holder, opp) < 40).length;
    const pressurePenalty = pressureLevel * 0.12;
    const distToGoal = Math.abs(holder.x - goalX);
    const distancePenalty = Math.min(distToGoal / 350, 0.25);
    const angleFromCenter = Math.abs(holder.y - 300);
    const anglePenalty = Math.min(angleFromCenter / 180, 0.20);
    const fatiguePenalty = Math.max(0, (100 - holder.stamina) / 100 * 0.15);
    const baseAccuracy = shootingSkill * 0.9;
    const effectiveAccuracy = Math.max(0.1, baseAccuracy - pressurePenalty - distancePenalty - anglePenalty - fatiguePenalty);
    const goalCenterY = 300;
    const GOAL_Y_TOP = GAME_CONFIG.GOAL_Y_TOP;
    const GOAL_Y_BOTTOM = GAME_CONFIG.GOAL_Y_BOTTOM;
    const goalHeight = GOAL_Y_BOTTOM - GOAL_Y_TOP;
    const maxDeviation = goalHeight * 1.5;
    const deviationRange = maxDeviation * (1 - effectiveAccuracy);
    const aimOffset = (Math.random() - 0.5) * deviationRange;
    const shotTargetY = goalCenterY + aimOffset;
    const shotPower = 800 + holder.shooting * 4;
    passBall(holder, holder.x, holder.y, goalX, shotTargetY, 1.0, shotPower, true);
    if (gameState.ballTrajectory) {
        gameState.ballTrajectory.shotTargetY = shotTargetY;
        gameState.ballTrajectory.effectiveAccuracy = effectiveAccuracy;
    }
    gameState.shotInProgress = true;
    gameState.shooter = holder;
    gameState.currentShotXG = xG;
    const resolveDuration = gameState.ballTrajectory?.duration ? (gameState.ballTrajectory.duration / 1000) : 0.5;
    pendingGameEvents.push({
        type: 'shot_outcome',
        resolveTime: gameTime + resolveDuration,
        data: { holder, xG, goalkeeper, goalX, shotTargetY }
    });
}
// ============================================================================
// MATCH STATISTICS AND MOMENTUM
// ============================================================================
export function updateMatchStats() {
    const now = Date.now();
    const elapsed = (now - gameState.stats.lastPossessionUpdate) / 1000;
    if (gameState.ballHolder) {
        if (gameState.ballHolder.isHome) {
            gameState.stats.possessionTimer.home += elapsed;
        }
        else {
            gameState.stats.possessionTimer.away += elapsed;
        }
    }
    const totalTime = gameState.stats.possessionTimer.home + gameState.stats.possessionTimer.away;
    if (totalTime > 0) {
        gameState.stats.home.possession = Math.round((gameState.stats.possessionTimer.home / totalTime) * 100);
        gameState.stats.away.possession = Math.round((gameState.stats.possessionTimer.away / totalTime) * 100);
    }
    gameState.stats.lastPossessionUpdate = now;
    updateTeamStates();
}
export const MomentumSystem = {
    homeMomentum: 0,
    awayMomentum: 0,
    lastUpdate: Date.now(),
    getMomentumBonus(isHome) {
        const momentum = isHome ? this.homeMomentum : this.awayMomentum;
        return 1.0 + (momentum / 1000);
    },
    onGoalScored(scoringTeam) {
        if (scoringTeam === 'home') {
            this.homeMomentum = Math.min(100, this.homeMomentum + 25);
            this.awayMomentum = Math.max(-100, this.awayMomentum - 15);
        }
        else {
            this.awayMomentum = Math.min(100, this.awayMomentum + 25);
            this.homeMomentum = Math.max(-100, this.homeMomentum - 15);
        }
        console.log(`📈 Momentum: Home=${this.homeMomentum}, Away=${this.awayMomentum}`);
    },
    onShotOnTarget(shootingTeam) {
        if (shootingTeam === 'home') {
            this.homeMomentum = Math.min(100, this.homeMomentum + 5);
            this.awayMomentum = Math.max(-100, this.awayMomentum - 2);
        }
        else {
            this.awayMomentum = Math.min(100, this.awayMomentum + 5);
            this.homeMomentum = Math.max(-100, this.homeMomentum - 2);
        }
    },
    onTackleWon(tacklingTeam) {
        if (tacklingTeam === 'home') {
            this.homeMomentum = Math.min(100, this.homeMomentum + 2);
        }
        else {
            this.awayMomentum = Math.min(100, this.awayMomentum + 2);
        }
    },
    onPassCompleted(passingTeam) {
        if (passingTeam === 'home') {
            this.homeMomentum = Math.min(100, this.homeMomentum + 0.5);
        }
        else {
            this.awayMomentum = Math.min(100, this.awayMomentum + 0.5);
        }
    },
    update() {
        const now = Date.now();
        const elapsed = (now - this.lastUpdate) / 1000;
        if (elapsed > 5) {
            const decayRate = 2;
            if (this.homeMomentum > 0) {
                this.homeMomentum = Math.max(0, this.homeMomentum - decayRate);
            }
            else if (this.homeMomentum < 0) {
                this.homeMomentum = Math.min(0, this.homeMomentum + decayRate);
            }
            if (this.awayMomentum > 0) {
                this.awayMomentum = Math.max(0, this.awayMomentum - decayRate);
            }
            else if (this.awayMomentum < 0) {
                this.awayMomentum = Math.min(0, this.awayMomentum + decayRate);
            }
            this.lastUpdate = now;
        }
    },
    reset() {
        this.homeMomentum = 0;
        this.awayMomentum = 0;
        this.lastUpdate = Date.now();
    }
};
export function applyMomentumToPlayer(player) {
    const momentumBonus = MomentumSystem.getMomentumBonus(player.isHome);
    player.effectivePace = player.pace * momentumBonus;
    player.effectiveShooting = player.shooting * momentumBonus;
    player.effectivePassing = player.passing * momentumBonus;
}
export function updateMomentum() {
    MomentumSystem.update();
    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    allPlayers.forEach(applyMomentumToPlayer);
}
export function renderMomentumBar(ctx) {
    if (!ctx)
        return;
    const barWidth = 300;
    const barHeight = 20;
    const barX = (GAME_CONFIG.PITCH_WIDTH - barWidth) / 2;
    const barY = 10;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    const homeMomentum = Math.max(0, MomentumSystem.homeMomentum);
    const homeMomentumWidth = (homeMomentum / 100) * (barWidth / 2);
    ctx.fillStyle = gameState.homeJerseyColor;
    ctx.fillRect(barX + (barWidth / 2) - homeMomentumWidth, barY, homeMomentumWidth, barHeight);
    const awayMomentum = Math.max(0, MomentumSystem.awayMomentum);
    const awayMomentumWidth = (awayMomentum / 100) * (barWidth / 2);
    ctx.fillStyle = gameState.awayJerseyColor;
    ctx.fillRect(barX + (barWidth / 2), barY, awayMomentumWidth, barHeight);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(barX + barWidth / 2, barY);
    ctx.lineTo(barX + barWidth / 2, barY + barHeight);
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('MOMENTUM', barX + barWidth / 2, barY - 3);
}
export function updateTeamStates() {
    const timeSinceStateUpdate = Date.now() - (gameState.lastTeamStateUpdate || 0);
    if (timeSinceStateUpdate < 2000)
        return;
    gameState.lastTeamStateUpdate = Date.now();
    gameState.homeTeamState = determineTeamState(true);
    gameState.awayTeamState = determineTeamState(false);
}
export function determineTeamState(isHome) {
    const tactic = TACTICS[isHome ? gameState.homeTactic : gameState.awayTactic];
    if (!tactic) {
        return 'BALANCED';
    }
    const teamHasBall = gameState.ballHolder && gameState.ballHolder.isHome === isHome;
    const timeSinceChange = Date.now() - gameState.lastPossessionChange;
    const opponentGoalX = getAttackingGoalX(isHome, gameState.currentHalf);
    const ballDistToOpponentGoal = gameState.ballPosition ? Math.abs(gameState.ballPosition.x - opponentGoalX) : 400;
    const score = isHome ? gameState.homeScore : gameState.awayScore;
    const opponentScore = isHome ? gameState.awayScore : gameState.homeScore;
    const scoreDiff = score - opponentScore;
    const timeRemaining = (gameState.currentHalf === 1 ? 45 : 90) - gameState.timeElapsed;
    const teamPlayers = isHome ? gameState.homePlayers : gameState.awayPlayers;
    const avgStamina = teamPlayers.reduce((sum, p) => sum + p.stamina, 0) / teamPlayers.length;
    if (scoreDiff < 0 && timeRemaining < 10) {
        return 'ATTACKING';
    }
    if (scoreDiff > 0 && timeRemaining < 15) {
        return avgStamina < 40 ? 'DEFENDING' : 'BALANCED';
    }
    if (teamHasBall && timeSinceChange < 5000 && ballDistToOpponentGoal > 200 && tactic.counterAttackSpeed > 1.2) {
        return avgStamina > 50 ? 'COUNTER_ATTACK' : 'BALANCED';
    }
    if (!teamHasBall && tactic.pressIntensity > 0.7 && ballDistToOpponentGoal < 400 && avgStamina > 60) {
        return 'HIGH_PRESS';
    }
    if (teamHasBall && ballDistToOpponentGoal < 300) {
        return 'ATTACKING';
    }
    if (!teamHasBall && ballDistToOpponentGoal > 500) {
        return 'DEFENDING';
    }
    return 'BALANCED';
}
export function handlePassAttempt(holder, allPlayers) {
    const teammates = allPlayers.filter(p => p.isHome === holder.isHome && p.name !== holder.name && p.role !== 'GK');
    if (teammates.length === 0) {
        return;
    }
    const passTarget = teammates[Math.floor(Math.random() * teammates.length)];
    if (passTarget) {
        const passDist = distance(holder, passTarget);
        const nearbyOpponents = allPlayers.filter(p => p.isHome !== holder.isHome && distance(holder, p) < 50);
        const isUnderPressure = nearbyOpponents.length > 1;
        const passSuccess = calculatePassSuccess(holder, passTarget, passDist, isUnderPressure);
        let passSpeed = 400 + holder.passing * 3;
        if (gameState.postKickOffCalmPeriod && gameState.kickOffCompletedTime) {
            const timeSinceKickOff = Date.now() - gameState.kickOffCompletedTime;
            if (timeSinceKickOff < 4000) {
                passSpeed = Math.min(passSpeed, 450);
            }
        }
        passBall(holder, holder.x, holder.y, passTarget.x, passTarget.y, passSuccess, passSpeed, false);
        gameState.currentPassReceiver = passTarget;
        const teamStats = holder.isHome ? gameState.stats.home : gameState.stats.away;
        teamStats.passesAttempted++;
        eventBus.publish(EVENT_TYPES.BALL_PASSED, {
            passer: holder,
            receiver: passTarget,
            distance: distance
        });
    }
}
export function resetAfterGoal() {
    console.log('🎯 Resetting after goal...');
    gameState.shotInProgress = false;
    gameState.shooter = null;
    gameState.currentShotXG = null;
    gameState.ballTrajectory = null;
    gameState.ballChasers.clear();
    gameState.currentPassReceiver = null;
    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    allPlayers.forEach(p => {
        p.isChasingBall = false;
        p.chaseStartTime = null;
        p.speedBoost = 1.0;
        p.targetLocked = false;
    });
    const kickOffTeam = gameState.lastGoalScorer === 'home' ? 'away' : 'home';
    const goalResetDelay = GAME_LOOP.GAME_SPEED > 100 ? 0 : 3000;
    setTimeout(() => {
        if (gameState.status !== 'finished') {
            setupKickOff(kickOffTeam);
        }
    }, goalResetDelay);
}
export function switchSides() {
    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    allPlayers.forEach(player => {
        const activePos = getPlayerActivePosition(player, 2);
        player.x = activePos.x;
        player.y = activePos.y;
        player.targetX = activePos.x;
        player.targetY = activePos.y;
        player.vx = 0;
        player.vy = 0;
        player.hasBallControl = false;
        player.ballReceivedTime = null;
    });
    gameState.ballPosition = { x: 400, y: 300 };
    gameState.ballVelocity = { x: 0, y: 0 };
    gameState.ballHeight = 0;
    gameState.ballTrajectory = null;
    gameState.ballHolder = null;
    gameState.ballChasers.clear();
    const tempLine = gameState.homeDefensiveLine;
    gameState.homeDefensiveLine = 800 - gameState.awayDefensiveLine;
    gameState.awayDefensiveLine = 800 - tempLine;
}
// ============================================================================
// MATCH LIFECYCLE
// ============================================================================
export function startMatch() {
    console.log('START MATCH CALLED!');
    try {
        ensureStatsShape(gameState);
        const homeTeam = selectBestTeam(gameState.homeTeam);
        const awayTeam = selectBestTeam(gameState.awayTeam);
        if (!homeTeam || !awayTeam || homeTeam.players.length < 11 || awayTeam.players.length < 11) {
            alert('Not enough players!');
            return;
        }
        gameState.homeFormation = homeTeam.formation;
        gameState.awayFormation = awayTeam.formation;
        if (!gameState.homeTacticManuallySet) {
            gameState.homeTactic = selectBestTactic(homeTeam.players);
        }
        if (!gameState.awayTacticManuallySet) {
            gameState.awayTactic = selectBestTactic(awayTeam.players);
        }
        selectJerseys();
        initFirstTouchStats();
        initOffsideStats();
        const initialized = initializePlayers(homeTeam.players, awayTeam.players, homeTeam.formation, awayTeam.formation);
        gameState.homePlayers = initialized.home;
        gameState.awayPlayers = initialized.away;
        // Reset match state
        gameState.status = 'intro';
        gameState.commentary = [];
        gameState.timeElapsed = 0;
        gameState.currentHalf = 1;
        gameState.homeScore = 0;
        gameState.awayScore = 0;
        gameState.ballPosition = { x: 400, y: 300 };
        gameState.ballVelocity = { x: 0, y: 0 };
        gameState.ballHeight = 0;
        gameState.ballTrajectory = null;
        gameState.ballHolder = null;
        gameState.lastEventTime = Date.now();
        gameState.particles = [];
        gameState.ballChasers = new Set();
        gameState.totalPasses = 0;
        gameState.totalShots = 0;
        gameState.shotInProgress = false;
        gameState.shooter = null;
        gameState.homeDefensiveLine = 200;
        gameState.awayDefensiveLine = 600;
        gameState.lastPossessionChange = 0;
        gameState.currentShotXG = null;
        gameState.currentPassReceiver = null;
        gameState.fouls = 0;
        gameState.yellowCards = [];
        gameState.redCards = [];
        gameState.lastGoalScorer = null;
        gameState.lastTouchedBy = null;
        gameState.setPieceExecuting = false;
        gameState.lastControlAttempt = 0;
        gameState.homeTeamState = 'BALANCED';
        gameState.awayTeamState = 'BALANCED';
        gameState.lastTeamStateUpdate = Date.now();
        gameState.possessionChanges = 0;
        lastFrameTime = 0;
        physicsAccumulator = 0;
        gameTime = 0;
        render();
        setTimeout(() => {
            console.log('🎨 Initializing canvas layers...');
            const success = initializeCanvasLayers();
            if (success) {
                console.log('✓ Canvas layers ready');
                drawPitchBackground();
                if (gameState.contexts && gameState.contexts.game) {
                    console.log('✓ Rendering initial game state');
                    renderGame();
                }
                console.log('✓ Starting intro rendering');
                animationFrameId = requestAnimationFrame(introRenderLoop);
            }
            else {
                console.error('✗ Failed to initialize canvas layers');
                alert('Error: Canvas initialization failed. Please refresh the page.');
            }
        }, 150);
        setTimeout(() => {
            setupKickOff('home');
            gameState.commentary = [{
                    text: `⚽ ${gameState.homeTeam} (${homeTeam.formation}, ${TACTICS[gameState.homeTactic]?.name || 'Unknown'}) vs ${gameState.awayTeam} (${awayTeam.formation}, ${TACTICS[gameState.awayTactic]?.name || 'Unknown'}) - KICK OFF!`,
                    type: 'goal'
                }];
            updateGameUI();
            if (animationFrameId)
                cancelAnimationFrame(animationFrameId);
            lastFrameTime = 0;
            physicsAccumulator = 0;
            gameTime = 0;
            console.log('🎮 Starting V2 game loop...');
            animationFrameId = requestAnimationFrame(gameLoop_V2);
            eventBus.publish(EVENT_TYPES.MATCH_START, {
                homeTeam: gameState.homeTeam,
                awayTeam: gameState.awayTeam
            });
        }, 3000);
        const realTimeInterval = 100;
        const timeIncrementPerInterval = GAME_LOOP.GAME_SPEED * (realTimeInterval / 1000);
        gameIntervalId = window.setInterval(() => {
            if (gameState.status === 'playing') {
                gameState.timeElapsed += timeIncrementPerInterval;
            }
            updateMatchStats();
            if (gameState.timeElapsed >= 45 && gameState.currentHalf === 1) {
                handleHalfTime();
                return;
            }
            if (gameState.timeElapsed >= 90 && gameState.status !== 'finished') {
                handleFullTime();
                return;
            }
            if (GAME_LOOP.GAME_SPEED <= 100) {
                if (typeof updateGameUI === 'function')
                    updateGameUI();
            }
        }, realTimeInterval);
    }
    catch (error) {
        console.error('ERROR IN START MATCH:', error);
    }
}
export function debugBallState() {
    if (gameState.status === 'playing') {
        const ballSpeed = Math.sqrt(gameState.ballVelocity.x ** 2 + gameState.ballVelocity.y ** 2);
        if (ballSpeed < 1 && !gameState.ballHolder && !gameState.ballTrajectory) {
            console.log('⚠️ BALL APPEARS STUCK:', {
                position: gameState.ballPosition,
                velocity: gameState.ballVelocity,
                chasers: gameState.ballChasers.size,
                holder: null
            });
        }
    }
}
setInterval(debugBallState, 1000);
export function introRenderLoop(_timestamp) {
    if (gameState.status !== 'intro') {
        return;
    }
    if (!gameState.contexts || !gameState.contexts.game) {
        animationFrameId = requestAnimationFrame(introRenderLoop);
        return;
    }
    renderGame();
    animationFrameId = requestAnimationFrame(introRenderLoop);
}
export function handleHalfTime() {
    if (gameState.status === 'halftime') {
        return;
    }
    gameState.status = 'halftime';
    gameState.commentary.push({ text: '⏸️ HALF TIME!', type: 'goal' });
    updateGameUI();
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    eventBus.publish(EVENT_TYPES.HALF_TIME, {
        homeScore: gameState.homeScore,
        awayScore: gameState.awayScore
    });
    const halftimeDelay = GAME_LOOP.GAME_SPEED > 100 ? 0 : 5000;
    setTimeout(() => {
        switchSides();
        gameState.currentHalf = 2;
        gameState.timeElapsed = 45;
        setupKickOff('away');
        if (gameState.setPiece && gameState.setPiece.type === 'KICK_OFF') {
            gameState.setPiece.executionTime = Date.now() + 2000;
        }
        gameState.commentary.push({ text: '▶️ Second half begins!', type: 'goal' });
        if (GAME_LOOP.GAME_SPEED <= 100) {
            if (typeof updateGameUI === 'function')
                updateGameUI();
        }
        lastFrameTime = 0;
        physicsAccumulator = 0;
        animationFrameId = requestAnimationFrame(gameLoop_V2);
    }, halftimeDelay);
}
export function handleFullTime() {
    gameState.status = 'finished';
    if (gameIntervalId)
        clearInterval(gameIntervalId);
    const winner = gameState.homeScore > gameState.awayScore ? gameState.homeTeam :
        gameState.awayScore > gameState.homeScore ? gameState.awayTeam : 'Draw';
    gameState.commentary.push({ text: `🏁 FULL TIME! ${gameState.homeScore} - ${gameState.awayScore}`, type: 'goal' }, { text: winner === 'Draw' ? '🤝 Match ends in a draw!' : `🏆 ${winner} WINS!`, type: 'goal' });
    eventBus.publish(EVENT_TYPES.MATCH_END, {
        homeScore: gameState.homeScore,
        awayScore: gameState.awayScore,
        winner: winner
    });
    render();
}
export function resetMatch() {
    if (gameIntervalId)
        clearInterval(gameIntervalId);
    if (animationFrameId)
        cancelAnimationFrame(animationFrameId);
    eventBus.clear();
    gameState.status = 'setup';
    gameState.timeElapsed = 0;
    gameState.currentHalf = 1;
    gameState.homeScore = 0;
    gameState.awayScore = 0;
    gameState.commentary = [];
    gameState.ballPosition = { x: 400, y: 300 };
    gameState.ballVelocity = { x: 0, y: 0 };
    gameState.ballHeight = 0;
    gameState.ballTrajectory = null;
    gameState.ballHolder = null;
    gameState.particles = [];
    gameState.ballChasers = new Set();
    gameState.totalPasses = 0;
    gameState.totalShots = 0;
    gameState.shotInProgress = false;
    gameState.shooter = null;
    gameState.homeDefensiveLine = 200;
    gameState.awayDefensiveLine = 600;
    gameState.lastPossessionChange = 0;
    gameState.homeTactic = 'balanced';
    gameState.awayTactic = 'balanced';
    gameState.currentShotXG = null;
    gameState.currentPassReceiver = null;
    gameState.fouls = 0;
    gameState.yellowCards = [];
    gameState.redCards = [];
    gameState.lastGoalScorer = null;
    gameState.goalEvents = [];
    gameState.cardEvents = [];
    gameState.backgroundDrawn = false;
    gameState.gameUIDisplayed = false;
    gameState.summaryDrawn = false;
    gameState.homeTeamState = 'BALANCED';
    gameState.awayTeamState = 'BALANCED';
    gameState.lastTeamStateUpdate = Date.now();
    gameState.possessionChanges = 0;
    lastFrameTime = 0;
    physicsAccumulator = 0;
    gameTime = 0;
    gameState.stats = {
        home: {
            possession: 0,
            possessionTime: 0,
            passesCompleted: 0,
            passesAttempted: 0,
            shotsOnTarget: 0,
            shotsOffTarget: 0,
            tackles: 0,
            interceptions: 0,
            saves: 0,
            xGTotal: 0
        },
        away: {
            possession: 0,
            possessionTime: 0,
            passesCompleted: 0,
            passesAttempted: 0,
            shotsOnTarget: 0,
            shotsOffTarget: 0,
            tackles: 0,
            interceptions: 0,
            saves: 0,
            xGTotal: 0
        },
        possession: { home: 50, away: 50 },
        possessionTimer: { home: 0, away: 0 },
        lastPossessionUpdate: Date.now()
    };
    pendingGameEvents = [];
    render();
}
// ============================================================================
// DOM READY INITIALIZATION
// ============================================================================
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            render();
        });
    }
    else {
        render();
    }
}
//# sourceMappingURL=main.js.map