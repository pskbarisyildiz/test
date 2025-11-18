// ============================================================================
// BATCH FIXTURE SIMULATOR v2.2 (Player Grouping & Up-to-Date Logic)
// ============================================================================
// Modern UI, live updates, Instagram-ready design.
// Integrates with latest AI (updatePlayerAI_V2) and game state.
// Runs headless simulations at high speed.
// ============================================================================

const CustomFixtureSimulator = {
    matchList: [],
    isRunning: false,
    results: [],
    currentMatchIndex: 0,

    // Add match to the list
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
            id: Date.now() + Math.random(), // Unique ID
            homeTeam: homeTeam,
            awayTeam: awayTeam
        });

        console.log(`✅ Added match: ${homeTeam} vs ${awayTeam}`);
        // Only render if currently in setup screen
        if (typeof gameState !== 'undefined' && gameState.status === 'setup') {
             this.renderMatchList();
        }
    },

    // Remove match from the list
    removeMatch(matchId) {
        this.matchList = this.matchList.filter(m => m.id !== matchId);
        // Only render if currently in setup screen
        if (typeof gameState !== 'undefined' && gameState.status === 'setup') {
             this.renderMatchList();
        }
        console.log(`🗑️ Removed match`);
    },

    // Clear the entire list
    clearAll() {
        if (this.matchList.length === 0) return;

        if (confirm('🗑️ Clear all matches?')) {
            this.matchList = [];
             // Only render if currently in setup screen
            if (typeof gameState !== 'undefined' && gameState.status === 'setup') {
                this.renderMatchList();
            }
            console.log('🧹 Match list cleared');
        }
    },

    // Render the match list for the setup screen
    renderMatchList() {
        const container = document.getElementById('custom-match-list');
        // Ensure gameState and logos are available
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
                ${this.matchList.map((match, index) => `
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

    // SIMULATE ALL MATCHES (MAIN FUNCTION)
    async simulateAll() {
        if (this.matchList.length === 0) {
            alert('⚠️ No matches to simulate!');
            return;
        }
         // Ensure required global functions exist
        const requiredFuncs = [
            'selectBestTeam', 'selectBestTactic', 'initializePlayers',
            'updatePlayerAI_V2', 'updatePhysics', 'assignBallChasers',
            'SetPieceIntegration', 'processPendingEvents', 'updateMatchStats',
            'switchSides', 'getPlayerActivePosition', 'getAttackingGoalX',
            'resetAfterGoal', 'handleShotAttempt' // Add other critical functions if needed
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
            if (!this.isRunning) break;

            this.currentMatchIndex = i;
            const match = this.matchList[i];
             if (!match) {
                 console.error(`Match at index ${i} is invalid.`);
                 continue; // Skip invalid match
             }


            this.highlightMatchCard(match.id, 'playing');

            try {
                const result = await this.simulateSingleMatch(match.homeTeam, match.awayTeam, match.id);
                if (result) { // Check if result is valid
                    this.results.push(result);
                    this.updateMatchCard(result);
                    this.highlightMatchCard(match.id, 'finished');
                } else {
                     console.error(`Simulation for match ${match.id} (${match.homeTeam} vs ${match.awayTeam}) returned invalid result.`);
                     this.highlightMatchCard(match.id, 'error'); // Optional: Add an error state
                }
            } catch (error) {
                 console.error(`Error simulating match ${match.id} (${match.homeTeam} vs ${match.awayTeam}):`, error);
                 this.highlightMatchCard(match.id, 'error'); // Optional: Add an error state
                 // Optionally decide whether to continue or stop the batch
                 // this.isRunning = false; // Stop batch on error
                 // break;
            }


            // Optional delay between matches (can be removed for max speed)
            // await new Promise(resolve => setTimeout(resolve, 50));
        }

        this.isRunning = false;
        console.log('✅ All matches simulated');

        this.showCompletionControls();
    },

    // SIMULATE SINGLE MATCH (HEADLESS - NO RENDERING)
    // DÜZELTİLMİŞ SIMULATE SINGLE MATCH (HEADLESS - NO RENDERING)
    async simulateSingleMatch(homeTeam, awayTeam, matchId) {
        // --- Safety Check ---
        if (typeof gameState === 'undefined') {
             console.error("simulateSingleMatch: gameState is not defined!");
             return null; // Return null or throw error
        }

        return new Promise((resolve, reject) => { // Added reject for error handling
            // --- Backup original functions ---
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

            // --- Disable rendering and UI ---
            if (window.DEBUG_BATCH_SIM) {
                console.log(`[BatchSim] Disabling rendering for match ${matchId}`);
            }
            window.renderGame = () => {};
            window.updateGameUI = () => {};
            window.render = () => {};
            window.drawPitchBackground = () => {};
            window.introRenderLoop = () => {};
            if (typeof window.showGoalAnimation === 'function') window.showGoalAnimation = () => {};
            if (typeof window.createGoalExplosion === 'function') window.createGoalExplosion = () => {};

            // --- Override timing functions for instant execution ---
            window.setupKickOff = (teamWithBall) => {
                // Orijinal setupKickOff'u çağır (main.js'den)
                // Bu, 'KICK_OFF' durumunu ve setPiece nesnesini doğru şekilde ayarlar.
                if (typeof originals.setupKickOff === 'function') {
                    originals.setupKickOff(teamWithBall);
                    // Hızlı simülasyon için yürütme süresini hemen yap
                    if (gameState.setPiece) {
                        gameState.setPiece.executionTime = Date.now();
                    }
                } else {
                     // Orijinal bulunamazsa acil durum fallback'i
                    gameState.status = 'KICK_OFF';
                    gameState.setPiece = { type: 'KICK_OFF', team: teamWithBall === 'home', position: { x: 400, y: 300 }, executionTime: Date.now() };
                }
            };

            window.handleHalfTime = () => {
                if (gameState.status === 'halftime' || gameState.status === 'finished') return;
                gameState.status = 'halftime';
                switchSides();
                gameState.currentHalf = 2;
                gameState.timeElapsed = 45;
                window.setupKickOff('away'); // Anında KICK_OFF durumunu ayarla
            };

            window.handleFullTime = () => {
                if (gameState.status === 'finished') return;
                gameState.status = 'finished';
                if (window.batchGameIntervalId) {
                    clearInterval(window.batchGameIntervalId);
                    window.batchGameIntervalId = null;
                }
            };

            // --- Setup simulation ---
            try {
                GAME_LOOP.GAME_SPEED = 500; // Yüksek hız (bu sorun değil)

                // Dummy context (bu doğru)
                if (!gameState.contexts) gameState.contexts = {};
                gameState.contexts.game = { dummy: true, 
                    clearRect: () => {}, beginPath: () => {}, moveTo: () => {}, lineTo: () => {},
                    arc: () => {}, fill: () => {}, stroke: () => {}, fillRect: () => {},
                    strokeRect: () => {}, save: () => {}, restore: () => {},
                    translate: () => {}, rotate: () => {}, scale: () => {}, createLinearGradient: () => ({ addColorStop: () => {} }),
                    createRadialGradient: () => ({ addColorStop: () => {} }), drawImage: () => {},
                    setTransform: () => {}, fillText: () => {}, measureText: () => ({ width: 0 }), setLineDash: () => {}
                 };


                gameState.homeTeam = homeTeam;
                gameState.awayTeam = awayTeam;

                const homeTeamObj = window.selectBestTeam ? window.selectBestTeam(homeTeam) : null;
                const awayTeamObj = window.selectBestTeam ? window.selectBestTeam(awayTeam) : null;

                if (!homeTeamObj || !awayTeamObj || !homeTeamObj.players || !awayTeamObj.players) {
                     throw new Error("Could not select valid teams.");
                }

                gameState.homeFormation = homeTeamObj.formation;
                gameState.awayFormation = awayTeamObj.formation;
                gameState.homeTactic = window.selectBestTactic ? window.selectBestTactic(homeTeamObj.players) : 'balanced';
                gameState.awayTactic = window.selectBestTactic ? window.selectBestTactic(awayTeamObj.players) : 'balanced';

                const initialized = window.initializePlayers ? window.initializePlayers(
                    homeTeamObj.players, awayTeamObj.players,
                    homeTeamObj.formation, awayTeamObj.formation
                ) : null;

                 if (!initialized || !initialized.home || !initialized.away) {
                    throw new Error("Could not initialize players.");
                }

                gameState.homePlayers = initialized.home;
                gameState.awayPlayers = initialized.away;

                // Maç state'ini sıfırla
                gameState.status = 'KICK_OFF'; // KICK_OFF ile başla
                gameState.timeElapsed = 0; gameState.currentHalf = 1; gameState.homeScore = 0; gameState.awayScore = 0;
                gameState.ballPosition = { x: 400, y: 300 }; gameState.ballVelocity = { x: 0, y: 0 }; gameState.ballHeight = 0;
                gameState.ballTrajectory = null; gameState.ballHolder = null; gameState.commentary = []; gameState.particles = [];
                gameState.ballChasers = new Set(); gameState.shotInProgress = false; gameState.shooter = null;
                gameState.goalEvents = []; gameState.cardEvents = []; gameState.fouls = 0; gameState.yellowCards = []; gameState.redCards = [];
                gameState.stats = { home: { possession: 0, passesCompleted: 0, passesAttempted: 0, shotsOnTarget: 0, shotsOffTarget: 0, xGTotal: 0, offsides: 0 }, away: { possession: 0, passesCompleted: 0, passesAttempted: 0, shotsOnTarget: 0, shotsOffTarget: 0, xGTotal: 0, offsides: 0 }, possessionTimer: { home: 0, away: 0 }, lastPossessionUpdate: Date.now() };
                
                // Başlangıç vuruşunu ayarla (override edilmiş fonksiyonu kullanarak)
                window.setupKickOff('home');

                // --- Start Headless Loop ---
                let lastFrameTimeSim = performance.now();
                let physicsAccumulatorSim = 0;
                
                // --- HATA 2 DÜZELTMESİ: GLOBAL gameTime'ı SIFIRLA ---
                // (main.js'deki 'let gameTime = 0;' satırının global 'window.gameTime' oluşturduğu varsayılır)
                window.gameTime = 0; 
                // --- DÜZELTME SONU ---


                if (window.batchGameIntervalId) clearInterval(window.batchGameIntervalId);

              const simulationStep = () => {
                    if (gameState.status === 'finished') return; // Stop if already finished

                    const nowSim = performance.now();
                    let real_dt = (nowSim - lastFrameTimeSim) / 1000.0;
                    lastFrameTimeSim = nowSim;
                    // Clamp dt to avoid large jumps if the tab was inactive
                    real_dt = Math.max(0, Math.min(real_dt, 0.1));
                    const game_dt = real_dt * GAME_LOOP.GAME_SPEED;
                    
                    // ✅ DÜZELTME 1: 'steps' değişkenini fonksiyonun en üst kapsamında tanımla
                    let steps = 0; 

                     try { // Wrap core logic in try-catch for this step
                         // --- Game Logic & Physics ---
                         const allPlayers = [...(gameState.homePlayers || []), ...(gameState.awayPlayers || [])];
                         const validPlayers = allPlayers.filter(p => p); // Filter out potential null players

                         if (typeof spatialSystem !== 'undefined' && typeof spatialSystem.buildGrid === 'function') {
                             spatialSystem.buildGrid(validPlayers, GAME_CONFIG.PITCH_WIDTH, GAME_CONFIG.PITCH_HEIGHT);
                         }

                         if (gameState.status === 'playing' && !gameState.ballHolder?.hasBallControl && !gameState.ballTrajectory) {
                             if (typeof assignBallChasers === 'function') assignBallChasers(validPlayers);
                         }

                         const isGameActive = !['paused', 'finished', 'halftime', 'goal_scored'].includes(gameState.status);
                        const isSetPieceOrKickOff = (typeof isSetPieceStatus === 'function')
                            ? isSetPieceStatus(gameState.status)
                            : ['GOAL_KICK', 'CORNER_KICK', 'THROW_IN', 'FREE_KICK', 'KICK_OFF', 'PENALTY'].includes(gameState.status);

                         if (isSetPieceOrKickOff || isGameActive) {
                             validPlayers.forEach(player => {
                                 // Ensure AI function exists before calling
                                 if (typeof updatePlayerAI_V2 === 'function') {
                                     updatePlayerAI_V2(player, gameState.ballPosition, validPlayers, gameState);
                                 }
                             });

                            if (isSetPieceOrKickOff && gameState.status !== 'PENALTY') {
                                // DÜZELTME: Doğru fonksiyonu çağır
                                if (typeof SetPieceIntegration !== 'undefined' && SetPieceIntegration.executeSetPiece_Router) {
                                    SetPieceIntegration.executeSetPiece_Router(gameState);
                                }
                             }
                             // Handle penalty state update
                            if (gameState.status === 'PENALTY' && typeof penaltySystem !== 'undefined' && typeof penaltySystem.update === 'function') {
                                penaltySystem.update(gameState);
                             }
                         }

                         if (isGameActive || isSetPieceOrKickOff) {
                             if (gameState.status === 'playing') {
                                 window.gameTime += game_dt; // Global gameTime'ı güncelle
                             }
                             if (typeof processPendingEvents === 'function') {
                                 processPendingEvents(window.gameTime); // Global gameTime ile işle
                             }

                             physicsAccumulatorSim += game_dt;
                             // ✅ DÜZELTME 2: 'steps'i her 'frame'de (adımda) sıfırla
                             steps = 0; 
                             const maxSteps = 10; // Allow more steps for high speed

                             // Ensure updatePhysics exists
                        if (typeof updatePhysics === 'function') {
                         while (physicsAccumulatorSim >= GAME_LOOP.FIXED_TIMESTEP && steps < maxSteps) {
                             updatePhysics(GAME_LOOP.FIXED_TIMESTEP);
                             physicsAccumulatorSim -= GAME_LOOP.FIXED_TIMESTEP;
                             steps++;
                         }
                         
                         // --- BEGIN FIX ---
                         // This is the "spiral of death" fix from core.js
                         // If we hit maxSteps, reset the accumulator to prevent it
                         // from growing indefinitely and becoming NaN.
                         if (steps >= maxSteps) {
                             physicsAccumulatorSim = 0;
                         }
                         // --- END FIX ---
                     }
                 }

                         // --- Time & Stats Update ---
                         if (gameState.status === 'playing') {
                             // ✅ DÜZELTME 3: 'steps' artık bu kapsamda GÖRÜNÜR ve DOĞRU DEĞERE sahip
                             const timeIncrementThisStep = (GAME_LOOP.FIXED_TIMESTEP * steps) / 60.0; 
                             gameState.timeElapsed += timeIncrementThisStep;
                         }
                         if (typeof updateMatchStats === 'function') updateMatchStats();

                         // --- Half Time / Full Time Checks ---
                         if (gameState.timeElapsed >= 45 && gameState.currentHalf === 1) {
                             window.handleHalfTime(); // Use overridden instant version
                         }
                         if (gameState.timeElapsed >= 90 && gameState.status !== 'finished') {
                             window.handleFullTime(); // Use overridden instant version
                         }

                     } catch(stepError) {
                          console.error(`Error during simulation step for match ${matchId}:`, stepError);
                          // Stop this specific simulation on error
                          if (window.batchGameIntervalId) clearInterval(window.batchGameIntervalId);
                          window.batchGameIntervalId = null;
                          // Reject the promise to indicate failure
                          reject(stepError); // Pass the error
                          return; // Exit simulationStep
                     }

                    // Check for finish condition
                    if (gameState.status === 'finished') {
                        // ... (Fonksiyonun geri kalanı değişmedi) ...
                        if (window.batchGameIntervalId) clearInterval(window.batchGameIntervalId);
                        window.batchGameIntervalId = null;

                        // --- Restore original functions and speed ---
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
                        if (gameState.contexts) gameState.contexts.game = originals.gameContext; // Restore context

                        if (window.DEBUG_BATCH_SIM) {
                            console.log(`[BatchSim] Restored rendering functions for match ${matchId}`);
                        }

                        // --- Collect results ---
                        const homePassAcc = (gameState.stats.home.passesAttempted || 0) > 0 ? Math.round((gameState.stats.home.passesCompleted / gameState.stats.home.passesAttempted) * 100) : 0;
                        const awayPassAcc = (gameState.stats.away.passesAttempted || 0) > 0 ? Math.round((gameState.stats.away.passesCompleted / gameState.stats.away.passesAttempted) * 100) : 0;
                        const result = {
                            matchId: matchId, homeTeam: homeTeam, awayTeam: awayTeam,
                            homeScore: gameState.homeScore ?? 0, awayScore: gameState.awayScore ?? 0, // Use nullish coalescing
                            homeXG: (gameState.stats.home.xGTotal || 0).toFixed(2), awayXG: (gameState.stats.away.xGTotal || 0).toFixed(2),
                            homePossession: gameState.stats.home.possession || 0, awayPossession: gameState.stats.away.possession || 0,
                            homeShots: (gameState.stats.home.shotsOnTarget || 0) + (gameState.stats.home.shotsOffTarget || 0),
                            awayShots: (gameState.stats.away.shotsOnTarget || 0) + (gameState.stats.away.shotsOffTarget || 0),
                            homeShotsOnTarget: gameState.stats.home.shotsOnTarget || 0, awayShotsOnTarget: gameState.stats.away.shotsOnTarget || 0,
                            homePassAccuracy: homePassAcc, awayPassAccuracy: awayPassAcc,
                            winner: (gameState.homeScore ?? 0) > (gameState.awayScore ?? 0) ? homeTeam : (gameState.awayScore ?? 0) > (gameState.homeScore ?? 0) ? awayTeam : 'Draw',
                            goalEvents: [...(gameState.goalEvents || [])], cardEvents: [...(gameState.cardEvents || [])]
                        };
                        resolve(result);
                    }
                };
                
                const intervalTime = 5; 
                window.batchGameIntervalId = setInterval(simulationStep, intervalTime);

            } catch (setupError) {
                 console.error(`Error setting up simulation for match ${matchId}:`, setupError);
                 Object.assign(window, {
                     renderGame: originals.renderGame, updateGameUI: originals.updateGameUI, render: originals.render,
                     drawPitchBackground: originals.drawPitchBackground, introRenderLoop: originals.introRenderLoop,
                     setupKickOff: originals.setupKickOff, handleHalfTime: originals.handleHalfTime, handleFullTime: originals.handleFullTime,
                     showGoalAnimation: originals.showGoalAnimation, createGoalExplosion: originals.createGoalExplosion
                 });
                 GAME_LOOP.GAME_SPEED = originals.gameSpeed;
                 if (gameState.contexts) gameState.contexts.game = originals.gameContext;
                 reject(setupError);
            }
        });
    },


    // Show Simulation Screen
    // Show Simulation Screen
    showSimulationScreen() {
        const app = document.getElementById('app');
        if(!app) return;

        this.injectStyles(); // Ensure styles are present

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
        
        // --- YENİ EKLENEN BLOK: YÖNLENDİRME BUTONUNU MANUEL ENJEKTE ET ---
        // Bu ekran 'render()' fonksiyonunu tetiklemediği için, butonu 
        // 'events.js' dosyasındaki 'render' fonksiyonundan kopyalayarak buraya ekliyoruz.
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
            
            // gameState'in global olduğunu varsayıyoruz
            if (typeof gameState !== 'undefined') {
                toggleBtn.innerText = gameState.isVertical ? 'View: Horizontal' : 'View: Vertical';
            } else {
                toggleBtn.innerText = 'View: Vertical'; // Fallback
            }

            toggleBtn.onmouseover = () => toggleBtn.style.opacity = '1';
            toggleBtn.onmouseout = () => toggleBtn.style.opacity = '0.5';
            
            // toggleOrientation'ın global olduğunu varsayıyoruz (events.js'den)
            if (typeof toggleOrientation === 'function') {
                toggleBtn.addEventListener('click', toggleOrientation);
            }
            
            toggleContainer.innerHTML = '';
            toggleContainer.appendChild(toggleBtn);
        }
        // --- YENİ BLOK SONU ---

         this.updateProgressIndicator(); // Initial progress update
    },

    // Render Initial Match Card
    renderMatchCard(match) {
        // Safety check for match data
        if (!match || !match.id || !match.homeTeam || !match.awayTeam) {
            console.error("Invalid match data provided to renderMatchCard:", match);
            return '<div class="match-card-live error">Invalid Match Data</div>'; // Indicate error
        }
        const homeLogo = gameState.teamLogos?.[match.homeTeam] || '';
        const awayLogo = gameState.teamLogos?.[match.awayTeam] || '';


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

    // Update Finished Match Card (Player Grouping Logic)
    updateMatchCard(result) {
        if (!result || !result.matchId) return; // Safety check

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
        } else {
                    }
         this.updateProgressIndicator(); // Update progress after card update
    },


    // Group Events By Player Helper
    _groupEventsByPlayer(allEvents, teamName) {
        if (!Array.isArray(allEvents)) return ''; // Safety check
        const playerMap = {};

      const teamEvents = allEvents.filter(e => e && (e.isHome === (teamName === 'home')));

        for (const event of teamEvents) {
            let playerName = ''; let icon = '';

            if (event.type === 'goal') { playerName = event.scorer; icon = '⚽️'; }
            else if (event.type === 'card') { playerName = event.player; icon = event.card === 'yellow' ? '🟨' : '🟥'; }

            if (!playerName) continue;

            if (!playerMap[playerName]) playerMap[playerName] = [];
            playerMap[playerName].push({ time: event.time ?? '?', icon: icon }); // Use nullish coalescing for time
        }

        const summaryLines = [];
        const sortedPlayerNames = Object.keys(playerMap).sort();

        for (const playerName of sortedPlayerNames) {
            const playerEvents = playerMap[playerName].sort((a, b) => a.time - b.time);
            const eventStrings = playerEvents.map(e => `${e.icon} '${e.time}`).join(', ');

            summaryLines.push(`
                <div class="mc-event-item">
                    <span class="mc-event-player">${playerName}</span>
                    <span class="mc-event-time">(${eventStrings})</span>
                </div>
            `);
        }
        return summaryLines.join('');
    },

    // Highlight Match Card
    highlightMatchCard(matchId, state) {
        if (!matchId) return; // Safety check
        const card = document.getElementById(`match-card-${matchId}`);
        if (!card) return;

        card.classList.remove('playing', 'finished', 'error'); // Remove all states first
        if (state === 'playing') card.classList.add('playing');
        else if (state === 'finished') card.classList.add('finished');
        else if (state === 'error') card.classList.add('error'); // Add error class

         this.updateProgressIndicator(); // Update progress when state changes
    },

     // Update Progress Indicator
     updateProgressIndicator() {
        const indicator = document.getElementById('progress-indicator');
        if (indicator) {
             const totalMatches = this.matchList.length;
             const finishedMatches = this.results.length;
             indicator.textContent = `(${finishedMatches}/${totalMatches} completed)`;
        }
    },


    // Show Completion Controls
    showCompletionControls() {
        const controls = document.getElementById('simulation-controls');
        if (controls) controls.style.display = 'block';
    },

   
  injectStyles() {
        let style = document.getElementById('batch-sim-styles');
        if (style) return; // Stiller zaten eklenmiş

        style = document.createElement('style');
        style.id = 'batch-sim-styles';
        style.innerHTML = `
            
            body.simulating {
                overflow: hidden; /* Prevent scrolling during simulation */
            }
            .simulation-container { display: grid; grid-template-columns: 1fr; gap: 20px; }
            .match-card-live { background: rgba(31, 41, 55, 0.75); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4); overflow: hidden; transition: all 0.3s ease; opacity: 0.6; /* Start dimmer */ }
            /* DEĞİŞİKLİK: Büyümeyi engellemek için 'transform: scale(1.01)' kaldırıldı */
            .match-card-live.playing { opacity: 1; border-color: #3b82f6; box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
            /* DEĞİŞİKLİK: 'transform: scale(1)' kaldırıldı */
            .match-card-live.finished { opacity: 0.9; border-color: rgba(16, 185, 129, 0.4); /* Green border for finished */ }
            .match-card-live.error { opacity: 0.7; border-color: #ef4444; /* Red border for error */ } /* Error state */
            .mc-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; background: rgba(0, 0, 0, 0.2); border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
            .mc-team { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; } .mc-team.home { justify-content: flex-start; } .mc-team.away { justify-content: flex-end; }
            
            /* DEĞİŞİKLİK: Yazı tipi boyutu 16px'den 18px'e yükseltildi */
            .mc-team-name { font-size: 18px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } .mc-team.away .mc-team-name { text-align: right; }
            
            .mc-team-logo { width: 32px; height: 32px; object-fit: contain; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); }
            .mc-score { margin: 0 15px; min-width: 90px; text-align: center; }
            .mc-score-pending { font-size: 20px; font-weight: 700; color: #777; display: flex; justify-content: center; align-items: center; height: 36px; /* Match final score height */ }
            .mc-score-final { font-family: 'Inter', sans-serif; font-size: 30px; font-weight: 900; color: #fff; display: flex; justify-content: center; align-items: center; gap: 8px; animation: fadeInScore 0.5s ease; height: 36px; }
            @keyframes fadeInScore { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
            .mc-score-final .separator { color: #888; font-weight: 700; font-size: 24px; } .mc-score-final .win { color: #f59e0b; }
            
            /* DEĞİŞİKLİK: Kart gövdesi yüksekliği 'auto' yapıldı ve 'min-height' eklendi */
            .mc-body { 
                padding: 15px 20px 20px 20px; 
                height: auto; /* '130px' idi */
                min-height: 60px; /* İçerik olmadığında bile minimum yüksekliği korur */
                overflow-y: auto; /* İçerik taşarsa kaydırma çubuğu çıkar */
                animation: fadeInBody 0.8s ease 0.2s; 
                animation-fill-mode: backwards; 
                border-top: 1px solid rgba(255,255,255,0.05); /* Separator */ 
            }
            
            @keyframes fadeInBody { from { opacity: 0; } to { opacity: 1; } }
            .mc-no-events { font-size: 12px; color: #888; text-align: center; padding-top: 10px; }
            
            /* --- GÜNCELLENEN BÖLÜM BAŞLANGICI --- */
            .mc-events-container { 
                display: flex; 
                justify-content: space-between; 
                gap: 15px; 
                margin-bottom: 10px; 
                max-height: 80px; /* Bu bölümün yüksekliği zaten sınırlıydı, bu kalabilir */
                overflow-y: auto; /* Gerekirse dikey kaydırma çubuğu ekler */
                padding-right: 5px; /* Kaydırma çubuğu için küçük bir boşluk */
            }
            .mc-events-list { flex: 1; display: flex; flex-direction: column; gap: 5px; max-width: 48%; } 
            .mc-events-list.away { align-items: flex-end; /* Bu kural artık gerekli değil ama kalsın */ }
            
            .mc-event-item { 
                display: flex; 
                align-items: center; 
                justify-content: space-between; /* Oyuncu ve zamanı ayırır */
                font-size: 12px; 
                color: #ccc; 
                font-weight: 500; 
                line-height: 1.4; 
                overflow: hidden; /* Taşmayı engeller */
                white-space: nowrap; /* Tek satırda kalmaya zorlar */
            }
            .mc-event-player { 
                font-weight: 600; 
                color: #fff; 
                white-space: nowrap; 
                overflow: hidden; 
                text-overflow: ellipsis; /* ... (üç nokta) ekler */
                flex: 1; /* Esnek büyüme/küçülme sağlar */
                min-width: 0; /* Flexbox'ta 'ellipsis' için gereklidir */
                text-align: left; /* Her zaman sola hizalı */
            }
            .mc-events-list.away .mc-event-player {
                 text-align: left; /* Deplasman listesinde de sola hizalı kalır */
            }
            .mc-event-time { 
                font-size: 11px; 
                color: #888; 
                font-weight: 700; 
                white-space: nowrap; 
                flex-shrink: 0; /* Olayların küçülmesini engeller */
                margin-left: 5px; /* Oyuncu adından ayırır */
            }
            
            /* Kaydırma çubuğu stilleri */
            .mc-events-container::-webkit-scrollbar {
                width: 4px;
            }
            .mc-events-container::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 4px;
            }
            .mc-events-container::-webkit-scrollbar-track {
                background: transparent;
            }
            
            /* YENİ: .mc-body için kaydırma çubuğu stilleri eklendi */
            .mc-body::-webkit-scrollbar {
                width: 4px;
            }
            .mc-body::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 4px;
            }
            .mc-body::-webkit-scrollbar-track {
                background: transparent;
            }
            /* --- GÜNCELLENEN BÖLÜM SONU --- */

            /* DEĞİŞİKLİK: .mc-stats-summary CSS kuralı Instagram görünümü için kaldırıldı */

            .spinner { width: 18px; height: 18px; border: 3px solid rgba(255, 255, 255, 0.2); border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: auto; }
            @keyframes spin { to { transform: rotate(360deg); } }
            /* Setup screen list item hover */
            .match-item:hover { background: rgba(255,255,255,0.1); }
            .match-item button:hover { background: rgba(239, 68, 68, 0.4); }
        `;
        document.head.appendChild(style);
    },
    // Export results as JSON
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

    // Cancel simulation (Optional)
    cancel() {
        this.isRunning = false;
        if (window.batchGameIntervalId) {
            clearInterval(window.batchGameIntervalId);
            window.batchGameIntervalId = null;
        }
         // Restore immediately
         // (Need access to 'originals' - might need to store it on the object or pass it)
         // For now, just log and go back to setup
        console.log("🛑 Batch simulation cancelled.");
        this.backToSetup();
    },

    // Back to Setup Screen
    backToSetup() {
        this.isRunning = false; // Ensure running flag is false
        this.matchList = []; // Clear list for next batch
        this.results = []; // Clear previous results
        if (window.batchGameIntervalId) { // Clear any leftover interval
            clearInterval(window.batchGameIntervalId);
            window.batchGameIntervalId = null;
        }
        // Ensure gameState exists before setting status
        if (typeof gameState !== 'undefined') {
            gameState.status = 'setup';
             // If render function exists, call it
             if(typeof render === 'function') {
                 render(); // Re-render the setup screen
             } else {
                 console.error("Render function not found, cannot return to setup screen visually.");
             }
        } else {
             console.error("gameState not found, cannot return to setup screen.");
        }
    }
};

console.log('✅ batch-simulator.js (v2.2 - Player Grouping, Robustness) loaded');

// Add listener to ensure renderMatchList is called when returning to setup
if (typeof gameState !== 'undefined' && typeof render === 'function') {
    const originalRender = render;
    render = () => {
        originalRender();
        if (gameState.status === 'setup' && CustomFixtureSimulator) {
            // Check if the container exists before rendering
            if (document.getElementById('custom-match-list')) {
                CustomFixtureSimulator.renderMatchList();
            }
        }
    }
}