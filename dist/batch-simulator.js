import { gameState } from './globalExports';
import { GAME_CONFIG, GAME_LOOP } from './config';
import { updatePlayerAI_V2 } from './core';
import { updatePhysics, assignBallChasers } from './physics';
import * as SetPieceIntegration from './setpieces/integration';
import { processPendingEvents, switchSides, updateMatchStats } from './main';
import { selectBestTeam, selectBestTactic, initializePlayers } from './gameSetup';
import { isSetPieceStatus } from './utils/ui';
export const CustomFixtureSimulator = {
    matchList: [],
    isRunning: false,
    results: [],
    currentMatchIndex: 0,
    addMatch(homeTeam, awayTeam) {
        if (!homeTeam || !awayTeam) {
            alert('⚠️ Please select both teams!');
            return;
        }
        if (homeTeam === awayTeam) {
            alert('⚠️ A team cannot play against itself!');
            return;
        }
        this.matchList.push({
            id: Date.now() + Math.random(),
            homeTeam: homeTeam,
            awayTeam: awayTeam
        });
        console.log(`✅ Added match: ${homeTeam} vs ${awayTeam}`);
        if (typeof gameState !== 'undefined' && gameState.status === 'setup') {
            this.renderMatchList();
        }
    },
    removeMatch(matchId) {
        this.matchList = this.matchList.filter(m => m.id !== matchId);
        if (typeof gameState !== 'undefined' && gameState.status === 'setup') {
            this.renderMatchList();
        }
        console.log(`🗑️ Removed match`);
    },
    clearAll() {
        if (this.matchList.length === 0)
            return;
        if (confirm('🗑️ Clear all matches?')) {
            this.matchList = [];
            if (typeof gameState !== 'undefined' && gameState.status === 'setup') {
                this.renderMatchList();
            }
            console.log('🧹 Match list cleared');
        }
    },
    renderMatchList() {
        const container = document.getElementById('custom-match-list');
        if (!container || typeof gameState === 'undefined' || !gameState.teamLogos) {
            console.warn("Cannot render match list: container or gameState not ready.");
            return;
        }
        if (this.matchList.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; opacity: 0.5;">
                    <div style="font-size: 48px; margin-bottom: 10px;">⚽</div>
                    <div>No matches added yet</div>
                    <div style="font-size: 14px; margin-top: 5px;">Add matches below to start</div>
                </div>
            `;
            const simulateBtn = document.getElementById('simulate-all-btn');
            if (simulateBtn) {
                simulateBtn.disabled = true;
                simulateBtn.style.opacity = '0.5';
            }
            return;
        }
        const simulateBtn = document.getElementById('simulate-all-btn');
        if (simulateBtn) {
            simulateBtn.disabled = false;
            simulateBtn.style.opacity = '1';
        }
        container.innerHTML = `
            <div style="max-height: 400px; overflow-y: auto; padding-right: 10px;">
                ${this.matchList.map((match) => `
                    <div class="match-item" style="display: flex; align-items: center; justify-content: space-between; padding: 15px; margin-bottom: 10px; background: rgba(255,255,255,0.05); border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s ease;">
                        <div style="flex: 1; display: flex; align-items: center; gap: 10px; min-width: 0;">
                            <img src="${gameState.teamLogos[match.homeTeam] || ''}" style="width: 24px; height: 24px; object-fit: contain; flex-shrink: 0;">
                            <span style="font-weight: 700; color: #4facfe; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${match.homeTeam}</span>
                            <span style="margin: 0 10px; opacity: 0.5;">vs</span>
                            <span style="font-weight: 700; color: #fa709a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${match.awayTeam}</span>
                            <img src="${gameState.teamLogos[match.awayTeam] || ''}" style="width: 24px; height: 24px; object-fit: contain; flex-shrink: 0;">
                        </div>
                        <button onclick="CustomFixtureSimulator.removeMatch(${match.id})" style="padding: 8px 15px; background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; border-radius: 6px; color: #ef4444; cursor: pointer; font-size: 14px; transition: all 0.3s; margin-left: 10px; flex-shrink: 0;">
                            🗑️ Remove
                        </button>
                    </div>
                `).join('')}
            </div>
            <div style="margin-top: 15px; padding: 10px; background: rgba(16, 185, 129, 0.1); border-radius: 8px; text-align: center; font-size: 14px;">
                ✅ <strong>${this.matchList.length}</strong> matches ready to simulate
            </div>
        `;
    },
    async simulateAll() {
        if (this.matchList.length === 0) {
            alert('⚠️ No matches to simulate!');
            return;
        }
        const requiredFuncs = [
            'selectBestTeam', 'selectBestTactic', 'initializePlayers',
            'updatePlayerAI_V2', 'updatePhysics', 'assignBallChasers',
            'SetPieceIntegration', 'processPendingEvents', 'updateMatchStats',
            'switchSides', 'getPlayerActivePosition', 'getAttackingGoalX',
            'resetAfterGoal', 'handleShotAttempt'
        ];
        for (const funcName of requiredFuncs) {
            if (typeof window[funcName] !== 'function' && typeof window[funcName] !== 'object') {
                alert(`❌ Error: Required function "${funcName}" is missing. Cannot start simulation.`);
                console.error(`Missing function: ${funcName}`);
                return;
            }
        }
        this.isRunning = true;
        this.results = [];
        this.currentMatchIndex = 0;
        console.log(`🚀 Starting batch simulation: ${this.matchList.length} matches`);
        this.showSimulationScreen();
        for (let i = 0; i < this.matchList.length; i++) {
            if (!this.isRunning)
                break;
            this.currentMatchIndex = i;
            const match = this.matchList[i];
            if (!match) {
                console.error(`Match at index ${i} is invalid.`);
                continue;
            }
            this.highlightMatchCard(match.id, 'playing');
            try {
                const result = await this.simulateSingleMatch(match.homeTeam, match.awayTeam, match.id);
                if (result) {
                    this.results.push(result);
                    this.updateMatchCard(result);
                    this.highlightMatchCard(match.id, 'finished');
                }
                else {
                    console.error(`Simulation for match ${match.id} (${match.homeTeam} vs ${match.awayTeam}) returned invalid result.`);
                    this.highlightMatchCard(match.id, 'error');
                }
            }
            catch (error) {
                console.error(`Error simulating match ${match.id} (${match.homeTeam} vs ${match.awayTeam}):`, error);
                this.highlightMatchCard(match.id, 'error');
            }
        }
        this.isRunning = false;
        console.log('✅ All matches simulated');
        this.showCompletionControls();
    },
    async simulateSingleMatch(homeTeam, awayTeam, matchId) {
        if (typeof gameState === 'undefined') {
            console.error("simulateSingleMatch: gameState is not defined!");
            return null;
        }
        return new Promise((resolve, reject) => {
            const originals = {
                renderGame: window.renderGame,
                updateGameUI: window.updateGameUI,
                render: window.render,
                drawPitchBackground: window.drawPitchBackground,
                introRenderLoop: window.introRenderLoop,
                setupKickOff: window.setupKickOff,
                handleHalfTime: window.handleHalfTime,
                handleFullTime: window.handleFullTime,
                showGoalAnimation: window.showGoalAnimation,
                createGoalExplosion: window.createGoalExplosion,
                gameSpeed: GAME_LOOP.GAME_SPEED,
                gameContext: gameState.contexts?.game
            };
            if (window.DEBUG_BATCH_SIM) {
                console.log(`[BatchSim] Disabling rendering for match ${matchId}`);
            }
            window.renderGame = () => { };
            window.updateGameUI = () => { };
            window.render = () => { };
            window.drawPitchBackground = () => { };
            window.introRenderLoop = () => { };
            if (typeof window.showGoalAnimation === 'function')
                window.showGoalAnimation = () => { };
            if (typeof window.createGoalExplosion === 'function')
                window.createGoalExplosion = () => { };
            window.setupKickOff = (teamWithBall) => {
                if (typeof originals.setupKickOff === 'function') {
                    originals.setupKickOff(teamWithBall);
                    if (gameState.setPiece) {
                        gameState.setPiece.executionTime = Date.now();
                    }
                }
                else {
                    gameState.status = 'KICK_OFF';
                    gameState.setPiece = { type: 'KICK_OFF', team: teamWithBall === 'home', position: { x: 400, y: 300 }, executed: false, executionTime: Date.now() };
                }
            };
            window.handleHalfTime = () => {
                if (gameState.status === 'halftime')
                    return;
                gameState.status = 'halftime';
                switchSides();
                gameState.currentHalf = 2;
                gameState.timeElapsed = 45;
                window.setupKickOff('away');
            };
            window.handleFullTime = () => {
                gameState.status = 'finished';
                if (window.batchGameIntervalId) {
                    clearInterval(window.batchGameIntervalId);
                    window.batchGameIntervalId = null;
                }
            };
            try {
                GAME_LOOP.GAME_SPEED = 500;
                if (!gameState.contexts) {
                    gameState.contexts = {
                        background: null,
                        game: null,
                        ui: null
                    };
                }
                gameState.contexts.game = {
                    dummy: true,
                    clearRect: () => { }, beginPath: () => { }, moveTo: () => { }, lineTo: () => { },
                    arc: () => { }, fill: () => { }, stroke: () => { }, fillRect: () => { },
                    strokeRect: () => { }, save: () => { }, restore: () => { },
                    translate: () => { }, rotate: () => { }, scale: () => { }, createLinearGradient: () => ({ addColorStop: () => { } }),
                    createRadialGradient: () => ({ addColorStop: () => { } }), drawImage: () => { },
                    setTransform: () => { }, fillText: () => { }, measureText: () => ({ width: 0 }), setLineDash: () => { }
                };
                gameState.homeTeam = homeTeam;
                gameState.awayTeam = awayTeam;
                const homeTeamObj = selectBestTeam(homeTeam);
                const awayTeamObj = selectBestTeam(awayTeam);
                if (!homeTeamObj || !awayTeamObj || !homeTeamObj.players || !awayTeamObj.players) {
                    throw new Error("Could not select valid teams.");
                }
                gameState.homeFormation = homeTeamObj.formation;
                gameState.awayFormation = awayTeamObj.formation;
                gameState.homeTactic = selectBestTactic(homeTeamObj.players);
                gameState.awayTactic = selectBestTactic(awayTeamObj.players);
                const initialized = initializePlayers(homeTeamObj.players, awayTeamObj.players, homeTeamObj.formation, awayTeamObj.formation);
                if (!initialized || !initialized.home || !initialized.away) {
                    throw new Error("Could not initialize players.");
                }
                gameState.homePlayers = initialized.home;
                gameState.awayPlayers = initialized.away;
                gameState.status = 'KICK_OFF';
                gameState.timeElapsed = 0;
                gameState.currentHalf = 1;
                gameState.homeScore = 0;
                gameState.awayScore = 0;
                gameState.ballPosition = { x: 400, y: 300 };
                gameState.ballVelocity = { x: 0, y: 0 };
                gameState.ballHeight = 0;
                gameState.ballTrajectory = null;
                gameState.ballHolder = null;
                gameState.commentary = [];
                gameState.particles = [];
                gameState.ballChasers = new Set();
                gameState.shotInProgress = false;
                gameState.shooter = null;
                gameState.goalEvents = [];
                gameState.cardEvents = [];
                gameState.fouls = 0;
                gameState.yellowCards = [];
                gameState.redCards = [];
                gameState.stats = {
                    home: { possession: 0, passesCompleted: 0, passesAttempted: 0, shots: 0, shotsOnTarget: 0, shotsOffTarget: 0, tackles: 0, fouls: 0, interceptions: 0, xGTotal: 0, firstTouches: 0, saves: 0, offsides: 0 },
                    away: { possession: 0, passesCompleted: 0, passesAttempted: 0, shots: 0, shotsOnTarget: 0, shotsOffTarget: 0, tackles: 0, fouls: 0, interceptions: 0, xGTotal: 0, firstTouches: 0, saves: 0, offsides: 0 },
                    possessionTimer: { home: 0, away: 0 },
                    lastPossessionUpdate: Date.now()
                };
                window.setupKickOff('home');
                let lastFrameTimeSim = performance.now();
                let physicsAccumulatorSim = 0;
                window.gameTime = 0;
                if (window.batchGameIntervalId)
                    clearInterval(window.batchGameIntervalId);
                const simulationStep = () => {
                    const nowSim = performance.now();
                    let real_dt = (nowSim - lastFrameTimeSim) / 1000.0;
                    lastFrameTimeSim = nowSim;
                    real_dt = Math.max(0, Math.min(real_dt, 0.1));
                    const game_dt = real_dt * GAME_LOOP.GAME_SPEED;
                    let steps = 0;
                    try {
                        const allPlayers = [...(gameState.homePlayers || []), ...(gameState.awayPlayers || [])];
                        const validPlayers = allPlayers.filter(p => p);
                        if (typeof spatialSystem !== 'undefined' && typeof spatialSystem.buildGrid === 'function') {
                            spatialSystem.buildGrid(validPlayers, GAME_CONFIG.PITCH_WIDTH, GAME_CONFIG.PITCH_HEIGHT);
                        }
                        if (gameState.status === 'playing' && !gameState.ballHolder?.hasBallControl && !gameState.ballTrajectory) {
                            if (typeof assignBallChasers === 'function')
                                assignBallChasers(validPlayers);
                        }
                        const isGameActive = !['paused', 'finished', 'halftime', 'goal_scored'].includes(gameState.status);
                        const isSetPieceOrKickOff = (typeof isSetPieceStatus === 'function')
                            ? isSetPieceStatus(gameState.status)
                            : ['GOAL_KICK', 'CORNER_KICK', 'THROW_IN', 'FREE_KICK', 'KICK_OFF', 'PENALTY'].includes(gameState.status);
                        if (isSetPieceOrKickOff || isGameActive) {
                            validPlayers.forEach(player => {
                                if (typeof updatePlayerAI_V2 === 'function') {
                                    updatePlayerAI_V2(player, gameState.ballPosition, validPlayers, gameState);
                                }
                            });
                            if (isSetPieceOrKickOff && gameState.status !== 'PENALTY') {
                                if (typeof SetPieceIntegration !== 'undefined' && SetPieceIntegration.executeSetPiece_Router) {
                                    SetPieceIntegration.executeSetPiece_Router(gameState);
                                }
                            }
                            if (gameState.status === 'PENALTY' && typeof penaltySystem !== 'undefined' && typeof penaltySystem.update === 'function') {
                                penaltySystem.update(gameState);
                            }
                        }
                        if (isGameActive || isSetPieceOrKickOff) {
                            if (gameState.status === 'playing') {
                                window.gameTime += game_dt;
                            }
                            if (typeof processPendingEvents === 'function') {
                                processPendingEvents(window.gameTime);
                            }
                            physicsAccumulatorSim += game_dt;
                            steps = 0;
                            const maxSteps = 10;
                            if (typeof updatePhysics === 'function') {
                                while (physicsAccumulatorSim >= GAME_LOOP.FIXED_TIMESTEP && steps < maxSteps) {
                                    updatePhysics(GAME_LOOP.FIXED_TIMESTEP);
                                    physicsAccumulatorSim -= GAME_LOOP.FIXED_TIMESTEP;
                                    steps++;
                                }
                                if (steps >= maxSteps) {
                                    physicsAccumulatorSim = 0;
                                }
                            }
                        }
                        if (gameState.status === 'playing') {
                            const timeIncrementThisStep = (GAME_LOOP.FIXED_TIMESTEP * steps) / 60.0;
                            gameState.timeElapsed += timeIncrementThisStep;
                        }
                        if (typeof updateMatchStats === 'function')
                            updateMatchStats();
                        if (gameState.timeElapsed >= 45 && gameState.currentHalf === 1) {
                            window.handleHalfTime();
                        }
                        if (gameState.timeElapsed >= 90) {
                            window.handleFullTime();
                        }
                    }
                    catch (stepError) {
                        console.error(`Error during simulation step for match ${matchId}:`, stepError);
                        if (window.batchGameIntervalId)
                            clearInterval(window.batchGameIntervalId);
                        window.batchGameIntervalId = null;
                        reject(stepError);
                        return;
                    }
                    if (gameState.status === 'finished') {
                        if (window.batchGameIntervalId)
                            clearInterval(window.batchGameIntervalId);
                        window.batchGameIntervalId = null;
                        Object.assign(window, {
                            renderGame: originals.renderGame,
                            updateGameUI: originals.updateGameUI,
                            render: originals.render,
                            drawPitchBackground: originals.drawPitchBackground,
                            introRenderLoop: originals.introRenderLoop,
                            setupKickOff: originals.setupKickOff,
                            handleHalfTime: originals.handleHalfTime,
                            handleFullTime: originals.handleFullTime,
                            showGoalAnimation: originals.showGoalAnimation,
                            createGoalExplosion: originals.createGoalExplosion
                        });
                        GAME_LOOP.GAME_SPEED = originals.gameSpeed;
                        if (gameState.contexts)
                            gameState.contexts.game = originals.gameContext ?? null;
                        if (window.DEBUG_BATCH_SIM) {
                            console.log(`[BatchSim] Restored rendering functions for match ${matchId}`);
                        }
                        const homePassAcc = (gameState.stats.home?.passesAttempted || 0) > 0 ? Math.round((gameState.stats.home.passesCompleted / gameState.stats.home.passesAttempted) * 100) : 0;
                        const awayPassAcc = (gameState.stats.away?.passesAttempted || 0) > 0 ? Math.round((gameState.stats.away.passesCompleted / gameState.stats.away.passesAttempted) * 100) : 0;
                        const result = {
                            matchId: matchId, homeTeam: homeTeam, awayTeam: awayTeam,
                            homeScore: gameState.homeScore ?? 0, awayScore: gameState.awayScore ?? 0,
                            homeXG: (gameState.stats.home?.xGTotal || 0).toFixed(2), awayXG: (gameState.stats.away?.xGTotal || 0).toFixed(2),
                            homePossession: gameState.stats.home?.possession || 0, awayPossession: gameState.stats.away?.possession || 0,
                            homeShots: (gameState.stats.home?.shotsOnTarget || 0) + (gameState.stats.home?.shotsOffTarget || 0),
                            awayShots: (gameState.stats.away?.shotsOnTarget || 0) + (gameState.stats.away?.shotsOffTarget || 0),
                            homeShotsOnTarget: gameState.stats.home?.shotsOnTarget || 0, awayShotsOnTarget: gameState.stats.away?.shotsOnTarget || 0,
                            homePassAccuracy: homePassAcc, awayPassAccuracy: awayPassAcc,
                            winner: (gameState.homeScore ?? 0) > (gameState.awayScore ?? 0) ? homeTeam : (gameState.awayScore ?? 0) > (gameState.homeScore ?? 0) ? awayTeam : 'Draw',
                            goalEvents: [...(gameState.goalEvents || [])], cardEvents: [...(gameState.cardEvents || [])]
                        };
                        resolve(result);
                    }
                };
                const intervalTime = 5;
                window.batchGameIntervalId = setInterval(simulationStep, intervalTime);
            }
            catch (setupError) {
                console.error(`Error setting up simulation for match ${matchId}:`, setupError);
                Object.assign(window, {
                    renderGame: originals.renderGame, updateGameUI: originals.updateGameUI, render: originals.render,
                    drawPitchBackground: originals.drawPitchBackground, introRenderLoop: originals.introRenderLoop,
                    setupKickOff: originals.setupKickOff, handleHalfTime: originals.handleHalfTime, handleFullTime: originals.handleFullTime,
                    showGoalAnimation: originals.showGoalAnimation, createGoalExplosion: originals.createGoalExplosion
                });
                GAME_LOOP.GAME_SPEED = originals.gameSpeed;
                if (gameState.contexts)
                    gameState.contexts.game = originals.gameContext ?? null;
                reject(setupError);
            }
        });
    },
    showSimulationScreen() {
        const app = document.getElementById('app');
        if (!app)
            return;
        this.injectStyles();
        app.innerHTML = `
            <div class="container" style="padding: 40px; max-width: 800px; margin: auto;">
                <h1 style="text-align: center; font-size: 32px; margin-bottom: 10px; color: #fff; font-weight: 800; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">
                    LIVE SIMULATION
                </h1>

                <div id="toggle-container" style="max-width: 800px; margin: -10px auto 20px; text-align: right; padding-right: 20px;"></div>

                <p style="text-align: center; font-size: 16px; margin-bottom: 30px; color: #eee; text-shadow: 0 1px 3px rgba(0,0,0,0.5);">
                    Matches are being simulated... <span id="progress-indicator"></span>
                </p>

                <div id="simulation-match-list" class="simulation-container">
                    ${this.matchList.map(match => match ? this.renderMatchCard(match) : '').join('')}
                </div>

                <div id="simulation-controls" style="text-align: center; margin-top: 40px; display: none;">
                    <button onclick="CustomFixtureSimulator.backToSetup()" class="btn" style="padding: 18px 40px; font-size: 16px; background: #10b981; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);">
                        🔄 Run New Batch Simulation
                    </button>
                    <button onclick="CustomFixtureSimulator.exportResults()" class="btn" style="margin-left: 15px; padding: 18px 40px; font-size: 16px; background: #3b82f6; box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);">
                        💾 Export Results (JSON)
                    </button>
                </div>
            </div>
        `;
        const toggleContainer = document.getElementById('toggle-container');
        if (toggleContainer) {
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'orientationToggleBtn';
            toggleBtn.style.background = 'rgba(255,255,255,0.1)';
            toggleBtn.style.border = '1px solid rgba(255,255,255,0.2)';
            toggleBtn.style.color = 'white';
            toggleBtn.style.padding = '5px 10px';
            toggleBtn.style.borderRadius = '5px';
            toggleBtn.style.cursor = 'pointer';
            toggleBtn.style.fontSize = '10px';
            toggleBtn.style.opacity = '0.5';
            toggleBtn.style.transition = 'opacity 0.3s';
            if (typeof gameState !== 'undefined') {
                toggleBtn.innerText = gameState.isVertical ? 'View: Horizontal' : 'View: Vertical';
            }
            else {
                toggleBtn.innerText = 'View: Vertical';
            }
            toggleBtn.onmouseover = () => toggleBtn.style.opacity = '1';
            toggleBtn.onmouseout = () => toggleBtn.style.opacity = '0.5';
            if (typeof window.toggleOrientation === 'function') {
                toggleBtn.addEventListener('click', window.toggleOrientation);
            }
            toggleContainer.innerHTML = '';
            toggleContainer.appendChild(toggleBtn);
        }
        this.updateProgressIndicator();
    },
    renderMatchCard(match) {
        if (!match || !match.id || !match.homeTeam || !match.awayTeam) {
            console.error("Invalid match data provided to renderMatchCard:", match);
            return '<div class="match-card-live error">Invalid Match Data</div>';
        }
        const homeLogo = (gameState.teamLogos && gameState.teamLogos[match.homeTeam]) || '';
        const awayLogo = (gameState.teamLogos && gameState.teamLogos[match.awayTeam]) || '';
        return `
            <div class="match-card-live" id="match-card-${match.id}">
                <div class="mc-header">
                    <div class="mc-team home">
                        <span class="mc-team-name">${match.homeTeam}</span>
                        <img src="${homeLogo}" class="mc-team-logo" alt="${match.homeTeam} logo" onerror="this.style.display='none'">
                    </div>
                    <div class="mc-score" id="score-${match.id}">
                        <div class="mc-score-pending">
                            <div class="spinner"></div>
                        </div>
                    </div>
                    <div class="mc-team away">
                        <img src="${awayLogo}" class="mc-team-logo" alt="${match.awayTeam} logo" onerror="this.style.display='none'">
                        <span class="mc-team-name">${match.awayTeam}</span>
                    </div>
                </div>
                <div class="mc-body" id="body-${match.id}">
                    </div>
            </div>
        `;
    },
    updateMatchCard(result) {
        if (!result || !result.matchId)
            return;
        const card = document.getElementById(`match-card-${result.matchId}`);
        const scoreEl = document.getElementById(`score-${result.matchId}`);
        const bodyEl = document.getElementById(`body-${result.matchId}`);
        if (!card || !scoreEl || !bodyEl) {
            console.warn(`Elements for match card ${result.matchId} not found.`);
            return;
        }
        scoreEl.innerHTML = `
            <div class="mc-score-final">
                <span class="home-score ${result.homeScore > result.awayScore ? 'win' : ''}">${result.homeScore}</span>
                <span class="separator">-</span>
                <span class="away-score ${result.awayScore > result.homeScore ? 'win' : ''}">${result.awayScore}</span>
            </div>
        `;
        const allEvents = [
            ...(result.goalEvents || []).map(e => ({ ...e, type: 'goal' })),
            ...(result.cardEvents || []).map(e => ({ ...e, type: 'card' }))
        ];
        const homeEventsHTML = this._groupEventsByPlayer(allEvents, 'home');
        const awayEventsHTML = this._groupEventsByPlayer(allEvents, 'away');
        if (homeEventsHTML.length > 0 || awayEventsHTML.length > 0) {
            bodyEl.innerHTML = `
                <div class="mc-events-container">
                    <div class="mc-events-list home">
                        ${homeEventsHTML}
                    </div>
                    <div class="mc-events-list away">
                        ${awayEventsHTML}
                    </div>
                </div>
            `;
        }
        this.updateProgressIndicator();
    },
    _groupEventsByPlayer(allEvents, teamName) {
        if (!Array.isArray(allEvents))
            return '';
        const playerMap = {};
        const teamEvents = allEvents.filter(e => e && (e.isHome === (teamName === 'home')));
        for (const event of teamEvents) {
            let playerName = '';
            let icon = '';
            if (event.type === 'goal') {
                playerName = event.scorer;
                icon = '⚽️';
            }
            else if (event.type === 'card') {
                playerName = event.player;
                icon = event.card === 'yellow' ? '🟨' : '🟥';
            }
            if (!playerName)
                continue;
            if (!playerMap[playerName])
                playerMap[playerName] = [];
            playerMap[playerName].push({ time: event.time ?? 0, icon: icon });
        }
        const summaryLines = [];
        const sortedPlayerNames = Object.keys(playerMap).sort();
        for (const playerName of sortedPlayerNames) {
            const playerEvents = playerMap[playerName];
            if (playerEvents) {
                playerEvents.sort((a, b) => a.time - b.time);
                const eventStrings = playerEvents.map(e => `${e.icon} '${e.time ?? ''}`).join(', ');
                summaryLines.push(`
                    <div class="mc-event-item">
                        <span class="mc-event-player">${playerName}</span>
                        <span class="mc-event-time">(${eventStrings})</span>
                    </div>
                `);
            }
        }
        return summaryLines.join('');
    },
    highlightMatchCard(matchId, state) {
        if (!matchId)
            return;
        const card = document.getElementById(`match-card-${matchId}`);
        if (!card)
            return;
        card.classList.remove('playing', 'finished', 'error');
        if (state === 'playing')
            card.classList.add('playing');
        else if (state === 'finished')
            card.classList.add('finished');
        else if (state === 'error')
            card.classList.add('error');
        this.updateProgressIndicator();
    },
    updateProgressIndicator() {
        const indicator = document.getElementById('progress-indicator');
        if (indicator) {
            const totalMatches = this.matchList.length;
            const finishedMatches = this.results.length;
            indicator.textContent = `(${finishedMatches}/${totalMatches} completed)`;
        }
    },
    showCompletionControls() {
        const controls = document.getElementById('simulation-controls');
        if (controls)
            controls.style.display = 'block';
    },
    injectStyles() {
        let style = document.getElementById('batch-sim-styles');
        if (style)
            return;
        style = document.createElement('style');
        style.id = 'batch-sim-styles';
        style.innerHTML = `
            body.simulating { overflow: hidden; }
            .simulation-container { display: grid; grid-template-columns: 1fr; gap: 20px; }
            .match-card-live { background: rgba(31, 41, 55, 0.75); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4); overflow: hidden; transition: all 0.3s ease; opacity: 0.6; }
            .match-card-live.playing { opacity: 1; border-color: #3b82f6; box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
            .match-card-live.finished { opacity: 0.9; border-color: rgba(16, 185, 129, 0.4); }
            .match-card-live.error { opacity: 0.7; border-color: #ef4444; }
            .mc-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; background: rgba(0, 0, 0, 0.2); border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
            .mc-team { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; } .mc-team.home { justify-content: flex-start; } .mc-team.away { justify-content: flex-end; }
            .mc-team-name { font-size: 18px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } .mc-team.away .mc-team-name { text-align: right; }
            .mc-team-logo { width: 32px; height: 32px; object-fit: contain; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); }
            .mc-score { margin: 0 15px; min-width: 90px; text-align: center; }
            .mc-score-pending { font-size: 20px; font-weight: 700; color: #777; display: flex; justify-content: center; align-items: center; height: 36px; }
            .mc-score-final { font-family: 'Inter', sans-serif; font-size: 30px; font-weight: 900; color: #fff; display: flex; justify-content: center; align-items: center; gap: 8px; animation: fadeInScore 0.5s ease; height: 36px; }
            @keyframes fadeInScore { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
            .mc-score-final .separator { color: #888; font-weight: 700; font-size: 24px; } .mc-score-final .win { color: #f59e0b; }
            .mc-body { padding: 15px 20px 20px 20px; height: auto; min-height: 60px; overflow-y: auto; animation: fadeInBody 0.8s ease 0.2s; animation-fill-mode: backwards; border-top: 1px solid rgba(255,255,255,0.05); }
            @keyframes fadeInBody { from { opacity: 0; } to { opacity: 1; } }
            .mc-no-events { font-size: 12px; color: #888; text-align: center; padding-top: 10px; }
            .mc-events-container { display: flex; justify-content: space-between; gap: 15px; margin-bottom: 10px; max-height: 80px; overflow-y: auto; padding-right: 5px; }
            .mc-events-list { flex: 1; display: flex; flex-direction: column; gap: 5px; max-width: 48%; }
            .mc-event-item { display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: #ccc; font-weight: 500; line-height: 1.4; overflow: hidden; white-space: nowrap; }
            .mc-event-player { font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; min-width: 0; text-align: left; }
            .mc-events-list.away .mc-event-player { text-align: left; }
            .mc-event-time { font-size: 11px; color: #888; font-weight: 700; white-space: nowrap; flex-shrink: 0; margin-left: 5px; }
            .mc-events-container::-webkit-scrollbar { width: 4px; }
            .mc-events-container::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 4px; }
            .mc-events-container::-webkit-scrollbar-track { background: transparent; }
            .mc-body::-webkit-scrollbar { width: 4px; }
            .mc-body::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 4px; }
            .mc-body::-webkit-scrollbar-track { background: transparent; }
            .spinner { width: 18px; height: 18px; border: 3px solid rgba(255, 255, 255, 0.2); border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: auto; }
            @keyframes spin { to { transform: rotate(360deg); } }
            .match-item:hover { background: rgba(255,255,255,0.1); }
            .match-item button:hover { background: rgba(239, 68, 68, 0.4); }
        `;
        document.head.appendChild(style);
    },
    exportResults() {
        if (this.results.length === 0) {
            alert("⚠️ No results to export yet.");
            return;
        }
        const jsonData = JSON.stringify(this.results, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `batch_simulation_results_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log("💾 Results exported as JSON.");
    },
    cancel() {
        this.isRunning = false;
        if (window.batchGameIntervalId) {
            clearInterval(window.batchGameIntervalId);
            window.batchGameIntervalId = null;
        }
        console.log("🛑 Batch simulation cancelled.");
        this.backToSetup();
    },
    backToSetup() {
        this.isRunning = false;
        this.matchList = [];
        this.results = [];
        if (window.batchGameIntervalId) {
            clearInterval(window.batchGameIntervalId);
            window.batchGameIntervalId = null;
        }
        if (typeof gameState !== 'undefined') {
            // Clear match-specific state to prevent data from persisting to next game
            gameState.goalEvents = [];
            gameState.cardEvents = [];
            gameState.homeScore = 0;
            gameState.awayScore = 0;
            gameState.timeElapsed = 0;
            gameState.currentHalf = 1;
            gameState.commentary = [];
            gameState.fouls = 0;
            gameState.yellowCards = [];
            gameState.redCards = [];
            gameState.lastGoalScorer = null;
            // Reset stats
            gameState.stats = {
                home: {
                    possession: 0,
                    possessionTime: 0,
                    passesCompleted: 0,
                    passesAttempted: 0,
                    shots: 0,
                    shotsOnTarget: 0,
                    shotsOffTarget: 0,
                    tackles: 0,
                    fouls: 0,
                    interceptions: 0,
                    xGTotal: 0,
                    firstTouches: 0,
                    saves: 0
                },
                away: {
                    possession: 0,
                    possessionTime: 0,
                    passesCompleted: 0,
                    passesAttempted: 0,
                    shots: 0,
                    shotsOnTarget: 0,
                    shotsOffTarget: 0,
                    tackles: 0,
                    fouls: 0,
                    interceptions: 0,
                    xGTotal: 0,
                    firstTouches: 0,
                    saves: 0
                },
                possession: { home: 50, away: 50 },
                possessionTimer: { home: 0, away: 0 },
                lastPossessionUpdate: Date.now()
            };
            gameState.status = 'setup';
            if (typeof window.render === 'function') {
                window.render();
            }
            else {
                console.error("Render function not found, cannot return to setup screen visually.");
            }
        }
        else {
            console.error("gameState not found, cannot return to setup screen.");
        }
    }
};
console.log('✅ batch-simulator.ts (v2.2 - Player Grouping, Robustness) loaded');
if (typeof gameState !== 'undefined' && typeof window.render === 'function') {
    const originalRender = window.render;
    window.render = () => {
        originalRender();
        if (gameState.status === 'setup' && CustomFixtureSimulator) {
            if (document.getElementById('custom-match-list')) {
                CustomFixtureSimulator.renderMatchList();
            }
        }
    };
}
//# sourceMappingURL=batch-simulator.js.map