function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // ... (Takım bilgilerini okuma - Değişiklik yok)
        const sayfa1 = workbook.Sheets['Sayfa1'];
        const sayfa1Data = XLSX.utils.sheet_to_json(sayfa1, { header: 1 });
        gameState.teams = [];
        gameState.teamJerseys = {};
        gameState.teamCoaches = {};
        gameState.teamLogos = gameState.teamLogos || {}; // Eksikse ekle

        sayfa1Data.slice(1).forEach(row => {
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
            .filter(row => {
                // ... (Filtreleme mantığı - Değişiklik yok, koçları filtrele, ID ve rating kontrol et)
                 const hasName = row[0] && row[0].toString().trim();
                 const hasTeam = row[2] && row[2].toString().trim();
                 const position = row[3] ? row[3].toString().trim() : '';
                 const fotmobId = row[11]; // ID için kullanılacak
                 const rating = row[12];

                 if (position.toLowerCase() === 'coach') {
                     const teamName = row[2].toString().trim();
                     const coachName = row[0].toString().trim();
                     gameState.teamCoaches[teamName] = coachName;
                     return false;
                 }

                 // ÖNERİ 1: ID kontrolü (FotMob ID)
                 const hasValidId = fotmobId && fotmobId.toString().trim() && fotmobId.toString().trim().toLowerCase() !== 'n/a';

                 return hasName && hasTeam && hasValidId &&
                        rating && !isNaN(parseFloat(rating));
            })
            .map((row, index) => { // Dizin (index) eklendi (fallback ID için)
                const positionString = row[3]?.toString().trim() || '';
                const isGK = positionString.toLowerCase().includes('keeper') ||
                             positionString.toLowerCase().includes('gk');

                // ÖNERİ 1: Oyuncuya ID ata (FotMob ID'yi string olarak kullan, yoksa index'i kullan)
                const playerId = row[11] ? String(row[11]).trim() : `temp_${index}`;

                // ÖNERİ 3: Pozisyonu role çevir
                const playerRole = getRoleFromPosition(positionString);

                return {
                    id: playerId, // <<< YENİ ID ALANI
                    name: row[0].toString().trim(),
                    team: row[2].toString().trim(),
                    position: positionString.split(',')[0].trim(), // Sadece birincil pozisyonu sakla
                    role: playerRole, // <<< YENİ ROLE ALANI
                    pace: parseInt(row[4]) || 60,
                    shooting: parseInt(row[5]) || 60,
                    passing: parseInt(row[6]) || 60,
                    dribbling: parseInt(row[7]) || 60,
                    defending: parseInt(row[8]) || 60,
                    physicality: parseInt(row[9]) || 60,
                    goalkeeping: parseInt(row[10]) || 60,
                    rating: parseFloat(row[12]) || 6.5,
                    realStats: { // getSafeStat ile okuma önerilir ama şimdilik böyle kalsın
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

function attachSetupEventListeners() {
    // Check if elements exist before attaching listeners
    const homeSelect = document.getElementById('homeSelect');
    const awaySelect = document.getElementById('awaySelect');
    const homeTacticSelect = document.getElementById('homeTacticSelect');
    const awayTacticSelect = document.getElementById('awayTacticSelect');

    if (homeSelect) {
        homeSelect.addEventListener('change', (e) => {
            gameState.homeTeam = e.target.value;
            // ✅ Auto-recalculate formation and tactic when team changes
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
            // ✅ Auto-recalculate formation and tactic when team changes
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
            gameState.homeTacticManuallySet = true; // Mark as manually set
        });
    }

    if (awayTacticSelect) {
        awayTacticSelect.addEventListener('change', (e) => {
            gameState.awayTactic = e.target.value;
            gameState.awayTacticManuallySet = true; // Mark as manually set
        });
    }
}

let isBatchMode = false;
let lastFrameTime = 0;
let gameTime = 0;
let physicsAccumulator = 0;
let animationFrameId = null;
let gameIntervalId = null;

let pendingGameEvents = [];

function handleFreeKick(foulLocation, foulTeam) {
    const foulSide  = resolveSide(foulTeam);
    const awardSide = invertSide(foulSide) || "home";
    const freeKickTeam = (awardSide === "home");

    const pos = {
        x: Number(foulLocation?.x) || CFG().PITCH_WIDTH / 2,
        y: Number(foulLocation?.y) || CFG().PITCH_HEIGHT / 2
    };

    // CRITICAL FIX: Calculate danger level to determine execution timing
    // Dangerous free kicks need more time for proper defensive positioning
    // Non-dangerous free kicks can be taken quickly
    const opponentGoalX = getAttackingGoalX(freeKickTeam, gameState.currentHalf);
    const distToGoal = getDistance(pos, { x: opponentGoalX, y: 300 });
    const isCentral = Math.abs(pos.y - 300) < 130;
    const isDangerous = distToGoal < 280 && isCentral; // Dangerous = shooting range + central

    // Dangerous free kicks: 3 seconds for full defensive setup (wall, markers, zonal defenders)
    // Non-dangerous free kicks: 1.2 seconds for quick restart
    const executionDelay = isDangerous ? 3000 : 1200;

    gameState.status = 'FREE_KICK';
    gameState.setPiece = {
        type: 'FREE_KICK',
        team: freeKickTeam,
        side: awardSide,
        position: pos,
        executionTime: Date.now() + executionDelay,
        configured: false,
        isDangerous: isDangerous // Store for reference
    };

    gameState.ballPosition = { x: pos.x, y: pos.y };
    gameState.ballVelocity = { x: 0, y: 0 };
    gameState.ballTrajectory = null;
    gameState.ballHolder = null;

    if (typeof ensureCorrectSetPiecePlacement === "function") {
        ensureCorrectSetPiecePlacement(gameState);
    }

    if (typeof SetPieceIntegration !== "undefined" &&
        SetPieceIntegration.executeSetPiece_PreConfiguration) {
        SetPieceIntegration.executeSetPiece_PreConfiguration();
    }

    const teamName = (awardSide === "home") ? gameState.homeTeam : gameState.awayTeam;
    gameState.commentary.push({
        text: `${Math.floor(gameState.timeElapsed)}' Free kick for ${teamName}`,
        type: "attack"
    });
}
function handleThrowIn() {
    const lastPlayer = gameState.lastTouchedBy;

    // DEVELOPMENT MODE: Validate throw-in setup
    if (!lastPlayer) {
        console.error(`❌ THROW-IN ERROR: No lastTouchedBy player! Ball went out but we don't know who touched it last.`);
        console.error(`   Ball position: ${JSON.stringify(gameState.ballPosition)}`);
        console.error(`   Falling back to home team kick-off`);
        setupKickOff('home'); // Güvenlik önlemi
        return;
    }

    const throwInTeam = !lastPlayer.isHome; // Topa en son dokunanın tersi
    const throwInY = gameState.ballPosition.y < 300 ? 10 : 590;
    const throwInX = Math.max(50, Math.min(750, gameState.ballPosition.x));

    console.log(`⚾ THROW-IN: Last touch by ${lastPlayer.name} (${lastPlayer.isHome ? 'home' : 'away'}), awarding to ${throwInTeam ? 'home' : 'away'}`);

    gameState.status = 'THROW_IN';
    gameState.setPiece = {
        type: 'THROW_IN',
        team: throwInTeam,
        position: { x: throwInX, y: throwInY },
        executionTime: Date.now() + 1000 // Reduced for smoother flow
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

    // DEVELOPMENT MODE: Validate setPiece was created properly
    if (!gameState.setPiece || gameState.setPiece.team === undefined) {
        console.error(`❌ THROW-IN ERROR: setPiece not created properly!`, gameState.setPiece);
    }
}

function handleBallOutOfBounds() {
    const ballX = gameState.ballPosition.x;
    const lastPlayer = gameState.lastTouchedBy;

    if (!lastPlayer) {
        setupKickOff('home'); // Güvenlik önlemi
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
    } else {
        defendingTeamIsHome = !homeDefendsLeft;
    }
    
    const defendingTeamTouchedLast = (lastPlayer.isHome === defendingTeamIsHome);
    
    if (defendingTeamTouchedLast) {
        // SAVUNMA SON DOKUNDU -> KORNER
        const isLeftCorner = crossedLeftSide;
        const isTopCorner = gameState.ballPosition.y < 300;
        
        gameState.status = 'CORNER_KICK';
        gameState.setPiece = {
            type: 'CORNER_KICK',
            team: !defendingTeamIsHome, // Hücum eden takım
            position: SetPieceIntegration.getCornerKickPosition(isLeftCorner, isTopCorner),
            executionTime: Date.now() + 1200 // Reduced for smoother flow
        };
        
        gameState.ballPosition.x = gameState.setPiece.position.x;
        gameState.ballPosition.y = gameState.setPiece.position.y;
        
        if (typeof SetPieceIntegration !== 'undefined') {
            SetPieceIntegration.executeSetPiece_PreConfiguration();
        }
        
        const teamName = !defendingTeamIsHome ? gameState.homeTeam : gameState.awayTeam;
        gameState.commentary.push({ 
            text: `${Math.floor(gameState.timeElapsed)}' Corner kick for ${teamName}`, 
            type: 'attack' 
        });
        
    } else {
        // HÜCUM SON DOKUNDU -> DEGAJ
        const gkX = crossedLeftSide ? 50 : 750;
        
        gameState.status = 'GOAL_KICK';
        gameState.setPiece = {
            type: 'GOAL_KICK',
            team: defendingTeamIsHome, // Savunan takım
            position: SetPieceIntegration.getGoalKickPosition(gkX, 'center'),
            executionTime: Date.now() + 1200 // Reduced for smoother flow
        };
        
        gameState.ballPosition.x = gameState.setPiece.position.x;
        gameState.ballPosition.y = gameState.setPiece.position.y;
        
        if (typeof SetPieceIntegration !== 'undefined') {
            SetPieceIntegration.executeSetPiece_PreConfiguration();
        }
        
        const teamName = defendingTeamIsHome ? gameState.homeTeam : gameState.awayTeam;
        gameState.commentary.push({ 
            text: `${Math.floor(gameState.timeElapsed)}' Goal kick for ${teamName}`, 
            type: 'attack' 
        });
    }
}



function processPendingEvents(currentGameTime) {
    const eventsToProcess = pendingGameEvents.filter(event => currentGameTime >= event.resolveTime);
    pendingGameEvents = pendingGameEvents.filter(event => currentGameTime < event.resolveTime);

    for (const event of eventsToProcess) {
        if (event.type === 'shot_outcome') {
            // DÜZELTME: resolveShot_WithAdvancedGK global olmalı (playerAI.js'den)
            if (typeof resolveShot_WithAdvancedGK === 'function') {
                resolveShot_WithAdvancedGK(event.data);
            }
        }
    }
}



function restoreFormationAfterSetPiece() {
    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    
    allPlayers.forEach(player => {
        if (player.role === 'GK') {
            const ownGoalX = getAttackingGoalX(!player.isHome, gameState.currentHalf);
            player.targetX = ownGoalX;
            player.targetY = 300;
        } else {
            const activePos = getPlayerActivePosition(player, gameState.currentHalf);
            player.targetX = activePos.x;
            player.targetY = activePos.y;
        }
        
        player.speedBoost = 1.0;
    });
}




function selectJerseys() {
    const homeJerseys = gameState.teamJerseys[gameState.homeTeam];
    const awayJerseys = gameState.teamJerseys[gameState.awayTeam];
    
    function isValidColor(color) {
        if (!color || typeof color !== 'string') return false;
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
function setupKickOff(teamWithBall) {
    console.log(`⚽ Setting up kick-off for ${teamWithBall} team`);

    // DEVELOPMENT MODE: Validate input
    if (teamWithBall !== 'home' && teamWithBall !== 'away') {
        console.error(`❌ setupKickOff: INVALID TEAM "${teamWithBall}"! Must be 'home' or 'away'`);
        console.error(`   Stack:`, new Error().stack);
    }

    const kickoffTeamIsHome = teamWithBall === 'home';

    // ✅ FIX #1: ATOMIC STATE INITIALIZATION - Build complete state BEFORE setting status
    // This prevents race conditions where gameLoop checks executionTime before it's set
    const setPieceState = {
        type: 'KICK_OFF',
        team: kickoffTeamIsHome,
        position: { x: 400, y: 300 },
        executionTime: Date.now() + 1200, // Set immediately (not later)
        configured: false,
        executed: false
    };

    // Atomically assign complete state
    gameState.setPiece = setPieceState;
    
    // 3. RESET BALL AND PLAYERS
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

        // === GOALKEEPER POSITIONING ===
        if (player.role === 'GK') {
            player.x = ownGoalX;
            player.y = centerY;
            return; // Skip to next player
        }

        // === CORE FIX: Use role-based positioning (same logic as KickoffBehaviors) ===
        // Don't use formation positions - they cause stuttering when forwards' positions are in opponent's half

        // Calculate base X position - safe distance from center line in own half
        const baseDistanceFromCenter = 60;
        const roleAdjustment = player.role.includes('ST') || player.role.includes('FW') || player.role.includes('CF')
            ? 20  // Strikers closer to center (ready to attack)
            : player.role.includes('MID') || player.role.includes('CM') || player.role.includes('CAM')
            ? 40  // Midfielders moderate distance
            : 80; // Defenders deeper

        let targetX, targetY;

        if (ownHalfIsLeft) {
            // Own goal is on left, position in left half
            targetX = centerX - baseDistanceFromCenter - roleAdjustment;
            // Ensure not too close to own goal
            targetX = Math.max(targetX, ownGoalX + 80);
        } else {
            // Own goal is on right, position in right half
            targetX = centerX + baseDistanceFromCenter + roleAdjustment;
            // Ensure not too close to own goal
            targetX = Math.min(targetX, ownGoalX - 80);
        }

        // Use formation Y position (vertical positioning is safe)
        targetY = Math.max(80, Math.min(520, activePos.y));

        // === DEFENDING TEAM: Additional check for center circle rule ===
        if (!isKickoffTeam) {
            const distToCenter = getDistance({ x: targetX, y: targetY }, { x: centerX, y: centerY });
            if (distToCenter < 70) {
                // Player too close to center - push them away radially
                const angle = Math.atan2(targetY - centerY, targetX - centerX);
                const pushDistance = 75;

                targetX = centerX + Math.cos(angle) * pushDistance;
                targetY = centerY + Math.sin(angle) * pushDistance;

                // Ensure still in own half after pushing away
                if (ownHalfIsLeft) {
                    targetX = Math.min(targetX, centerX - 30);
                } else {
                    targetX = Math.max(targetX, centerX + 30);
                }

                // Keep Y within pitch bounds
                targetY = Math.max(80, Math.min(520, targetY));
            }
        }

        // Set the player's position
        player.x = targetX;
        player.y = targetY;
        player.targetX = player.x;
        player.targetY = player.y;

        // DEVELOPMENT MODE: Validate position is valid
        if (!isFinite(targetX) || !isFinite(targetY) || targetX < 0 || targetX > 800 || targetY < 0 || targetY > 600) {
            console.error(`❌ setupKickOff: INVALID POSITION for ${player.name} (${player.role})`);
            console.error(`   Position: (${targetX}, ${targetY})`);
            console.error(`   ownGoalX: ${ownGoalX}, ownHalfIsLeft: ${ownHalfIsLeft}`);
        }
    });

    // DEVELOPMENT MODE: Validate all players have been positioned
    const invalidPlayers = allPlayers.filter(p =>
        !isFinite(p.x) || !isFinite(p.y) || p.x < 0 || p.x > 800 || p.y < 0 || p.y > 600
    );
    if (invalidPlayers.length > 0) {
        console.error(`❌ setupKickOff: ${invalidPlayers.length} players have INVALID positions!`);
        invalidPlayers.forEach(p => {
            console.error(`   ${p.name} (${p.role}): (${p.x}, ${p.y})`);
        });
    }

    // Now set status AFTER setPiece is fully configured
    gameState.status = 'KICK_OFF';

    if (typeof SetPieceIntegration !== 'undefined') {
        // Pre-configure positions (executionTime already set above)
        SetPieceIntegration.executeSetPiece_PreConfiguration();
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

    primaryTaker.x = centerX;
    primaryTaker.y = centerY;
    
    if (secondaryTaker) {
        const opponentGoalX = getAttackingGoalX(kickoffTeamIsHome, gameState.currentHalf);
        const direction = opponentGoalX > centerX ? -1 : 1;
        secondaryTaker.x = centerX + (direction * 25);
        secondaryTaker.y = centerY;
    }
}
function removePlayerFromMatch(playerToRemove) {
    if (playerToRemove.isHome) {
        gameState.homePlayers = gameState.homePlayers.filter(p => p.id !== playerToRemove.id);
    } else {
        gameState.awayPlayers = gameState.awayPlayers.filter(p => p.id !== playerToRemove.id);
    }
}

function handleShotAttempt(holder, goalX, allPlayers) {
    const goalkeeper = allPlayers.find(p => p.role === 'GK' && p.isHome !== holder.isHome);
    const opponents = allPlayers.filter(p => p.isHome !== holder.isHome);

    const xG = calculateXG(holder, goalX, holder.y, opponents);
    const teamStats = holder.isHome ? gameState.stats.home : gameState.stats.away;
    
    // This is correct:
    teamStats.xGTotal += xG;
    gameState.lastTouchedBy = holder;

    const shootingSkill = holder.shooting / 110;
    const pressureLevel = opponents.filter(opp => getDistance(holder, opp) < 40).length;
    const pressurePenalty = pressureLevel * 0.12;
    const distToGoal = Math.abs(holder.x - goalX);
    const distancePenalty = Math.min(distToGoal / 350, 0.25);
    const angleFromCenter = Math.abs(holder.y - 300);
    const anglePenalty = Math.min(angleFromCenter / 180, 0.20);
    const fatiguePenalty = Math.max(0, (100 - holder.stamina) / 100 * 0.15);

    const baseAccuracy = shootingSkill * 0.9;
    const effectiveAccuracy = Math.max(0.1, baseAccuracy - pressurePenalty - distancePenalty - anglePenalty - fatiguePenalty);

    const goalCenterY = 300;
    const GOAL_Y_TOP = (typeof GAME_CONFIG !== 'undefined') ? GAME_CONFIG.GOAL_Y_TOP : 240;
    const GOAL_Y_BOTTOM = (typeof GAME_CONFIG !== 'undefined') ? GAME_CONFIG.GOAL_Y_BOTTOM : 360;
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

function updateMatchStats() {
    const now = Date.now();
    const elapsed = (now - gameState.stats.lastPossessionUpdate) / 1000;
    
    if (gameState.ballHolder) {
        if (gameState.ballHolder.isHome) {
            gameState.stats.possessionTimer.home += elapsed;
        } else {
            gameState.stats.possessionTimer.away += elapsed;
        }
    }
    
    const totalTime = gameState.stats.possessionTimer.home + gameState.stats.possessionTimer.away;
    if (totalTime > 0) {
        gameState.stats.home.possession = Math.round((gameState.stats.possessionTimer.home / totalTime) * 100);
        gameState.stats.away.possession = Math.round((gameState.stats.possessionTimer.away / totalTime) * 100);
    }
    
    gameState.stats.lastPossessionUpdate = now;
    
    // Update dynamic team states based on game situation
    updateTeamStates();
}

const MomentumSystem = {
    homeMomentum: 0,    // -100 to +100
    awayMomentum: 0,    // -100 to +100
    lastUpdate: Date.now(),
    
    // Momentum affects player performance
    getMomentumBonus(isHome) {
        const momentum = isHome ? this.homeMomentum : this.awayMomentum;
        // Convert -100 to +100 into 0.85 to 1.15 multiplier
        return 1.0 + (momentum / 1000);
    },
    
    // Update momentum based on events
    onGoalScored(scoringTeam) {
        if (scoringTeam === 'home') {
            this.homeMomentum = Math.min(100, this.homeMomentum + 25);
            this.awayMomentum = Math.max(-100, this.awayMomentum - 15);
        } else {
            this.awayMomentum = Math.min(100, this.awayMomentum + 25);
            this.homeMomentum = Math.max(-100, this.homeMomentum - 15);
        }
        console.log(`📈 Momentum: Home=${this.homeMomentum}, Away=${this.awayMomentum}`);
    },
    
    onShotOnTarget(shootingTeam) {
        if (shootingTeam === 'home') {
            this.homeMomentum = Math.min(100, this.homeMomentum + 5);
            this.awayMomentum = Math.max(-100, this.awayMomentum - 2);
        } else {
            this.awayMomentum = Math.min(100, this.awayMomentum + 5);
            this.homeMomentum = Math.max(-100, this.homeMomentum - 2);
        }
    },
    
    onTackleWon(tacklingTeam) {
        if (tacklingTeam === 'home') {
            this.homeMomentum = Math.min(100, this.homeMomentum + 2);
        } else {
            this.awayMomentum = Math.min(100, this.awayMomentum + 2);
        }
    },
    
    onPassCompleted(passingTeam) {
        // Gradual momentum build from possession
        if (passingTeam === 'home') {
            this.homeMomentum = Math.min(100, this.homeMomentum + 0.5);
        } else {
            this.awayMomentum = Math.min(100, this.awayMomentum + 0.5);
        }
    },
    
    // Natural momentum decay over time
    update() {
        const now = Date.now();
        const elapsed = (now - this.lastUpdate) / 1000;
        
        if (elapsed > 5) { // Update every 5 seconds
            // Momentum naturally decays toward 0
            const decayRate = 2;
            
            if (this.homeMomentum > 0) {
                this.homeMomentum = Math.max(0, this.homeMomentum - decayRate);
            } else if (this.homeMomentum < 0) {
                this.homeMomentum = Math.min(0, this.homeMomentum + decayRate);
            }
            
            if (this.awayMomentum > 0) {
                this.awayMomentum = Math.max(0, this.awayMomentum - decayRate);
            } else if (this.awayMomentum < 0) {
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

// Apply momentum to player stats
function applyMomentumToPlayer(player) {
    const momentumBonus = MomentumSystem.getMomentumBonus(player.isHome);
    
    // Momentum affects pace, shooting, passing
    player.effectivePace = player.pace * momentumBonus;
    player.effectiveShooting = player.shooting * momentumBonus;
    player.effectivePassing = player.passing * momentumBonus;
}

// Hook momentum into game events
const originalResolveShot = resolveShot_WithAdvancedGK;
resolveShot_WithAdvancedGK = function(data) {
    originalResolveShot.call(this, data);
    
    if (gameState.stats.home.shotsOnTarget > 0 || gameState.stats.away.shotsOnTarget > 0) {
        const shootingTeam = data.holder.isHome ? 'home' : 'away';
        MomentumSystem.onShotOnTarget(shootingTeam);
    }
};

// Hook momentum into tackles
const originalAttemptTackle = action_attemptTackle;
action_attemptTackle = function(player, ball, allPlayers) {
    const result = originalAttemptTackle.call(this, player, ball, allPlayers);
    
    if (result && gameState.ballHolder === player) {
        MomentumSystem.onTackleWon(player.isHome ? 'home' : 'away');
    }
    
    return result;
};

// Hook momentum into passes
const originalInitiatePass = initiatePass;
initiatePass = function(player, target) {
    originalInitiatePass.call(this, player, target);
    MomentumSystem.onPassCompleted(player.isHome ? 'home' : 'away');
};

// Update momentum in game loop
function updateMomentum() {
    MomentumSystem.update();
    
    // Apply to all players
    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    allPlayers.forEach(applyMomentumToPlayer);
}

function renderMomentumBar(ctx) {
    if (!ctx) return;
    
    const barWidth = 300;
    const barHeight = 20;
    const barX = (GAME_CONFIG.PITCH_WIDTH - barWidth) / 2;
    const barY = 10;
    
    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Home momentum (left side)
    const homeMomentum = Math.max(0, MomentumSystem.homeMomentum);
    const homeMomentumWidth = (homeMomentum / 100) * (barWidth / 2);
    ctx.fillStyle = gameState.homeJerseyColor;
    ctx.fillRect(barX + (barWidth / 2) - homeMomentumWidth, barY, homeMomentumWidth, barHeight);
    
    // Away momentum (right side)
    const awayMomentum = Math.max(0, MomentumSystem.awayMomentum);
    const awayMomentumWidth = (awayMomentum / 100) * (barWidth / 2);
    ctx.fillStyle = gameState.awayJerseyColor;
    ctx.fillRect(barX + (barWidth / 2), barY, awayMomentumWidth, barHeight);
    
    // Center line
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(barX + barWidth / 2, barY);
    ctx.lineTo(barX + barWidth / 2, barY + barHeight);
    ctx.stroke();
    
    // Label
    ctx.fillStyle = 'white';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('MOMENTUM', barX + barWidth / 2, barY - 3);
}
function updateTeamStates() {
    const timeSinceStateUpdate = Date.now() - (gameState.lastTeamStateUpdate || 0);
    if (timeSinceStateUpdate < 2000) return; // Update every 2 seconds
    
    gameState.lastTeamStateUpdate = Date.now();
    
    // Update both teams
    gameState.homeTeamState = determineTeamState(true);
    gameState.awayTeamState = determineTeamState(false);
}

function determineTeamState(isHome) {
    const tactic = TACTICS[isHome ? gameState.homeTactic : gameState.awayTactic];
    const teamHasBall = gameState.ballHolder && gameState.ballHolder.isHome === isHome;
    const timeSinceChange = Date.now() - gameState.lastPossessionChange;
    const opponentGoalX = getAttackingGoalX(isHome, gameState.currentHalf);
    const ballDistToOpponentGoal = gameState.ballPosition ? Math.abs(gameState.ballPosition.x - opponentGoalX) : 400;
    
    // NEW: Consider score and time remaining
    const score = isHome ? gameState.homeScore : gameState.awayScore;
    const opponentScore = isHome ? gameState.awayScore : gameState.homeScore;
    const scoreDiff = score - opponentScore;
    const timeRemaining = (gameState.currentHalf === 1 ? 45 : 90) - gameState.timeElapsed;
    
    // NEW: Consider team fatigue
    const teamPlayers = isHome ? gameState.homePlayers : gameState.awayPlayers;
    const avgStamina = teamPlayers.reduce((sum, p) => sum + p.stamina, 0) / teamPlayers.length;

    // CRITICAL SITUATION: Losing late in game -> desperate attack
    if (scoreDiff < 0 && timeRemaining < 10) {
        return 'ATTACKING';
    }
    
    // PROTECTING LEAD: Winning late in game -> defensive
    if (scoreDiff > 0 && timeRemaining < 15) {
        return avgStamina < 40 ? 'DEFENDING' : 'BALANCED'; // More defensive if tired
    }
    
    // COUNTER-ATTACK: Just won ball in transition
    if (teamHasBall && timeSinceChange < 5000 && ballDistToOpponentGoal > 200 && tactic.counterAttackSpeed > 1.2) {
        return avgStamina > 50 ? 'COUNTER_ATTACK' : 'BALANCED'; // Need stamina to counter
    }
    
    // HIGH PRESS: Opponent has ball in their half, we have energy
    if (!teamHasBall && tactic.pressIntensity > 0.7 && ballDistToOpponentGoal < 400 && avgStamina > 60) {
        return 'HIGH_PRESS';
    }
    
    // ATTACKING: We have ball in final third
    if (teamHasBall && ballDistToOpponentGoal < 300) {
        return 'ATTACKING';
    }
    
    // DEFENDING: Opponent has ball, we're under pressure
    if (!teamHasBall && ballDistToOpponentGoal > 500) {
        return 'DEFENDING';
    }
    
    // DEFAULT: Balanced approach
    return 'BALANCED';
}


function handlePassAttempt(holder, allPlayers) {
    const teammates = allPlayers.filter(p => p.isHome === holder.isHome && p.name !== holder.name && p.role !== 'GK');
    
    if (teammates.length === 0) {
        return;
    }
    
    const passTarget = teammates[Math.floor(Math.random() * teammates.length)];
    if (passTarget) {
        const distance = getDistance(holder, passTarget);
        const nearbyOpponents = allPlayers.filter(p => 
            p.isHome !== holder.isHome && getDistance(holder, p) < 50
        );
        const isUnderPressure = nearbyOpponents.length > 1;
        
        const passSuccess = calculatePassSuccess(holder, passTarget, distance, isUnderPressure);
        let passSpeed = 400 + holder.passing * 3;

        // ✅ FIX: Reduce pass power immediately after kick-off to prevent wild passes
        if (gameState.postKickOffCalmPeriod && gameState.kickOffCompletedTime) {
            const timeSinceKickOff = Date.now() - gameState.kickOffCompletedTime;
            if (timeSinceKickOff < 4000) {
                passSpeed = Math.min(passSpeed, 450); // Cap speed at 450 during calm period
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
function resetAfterGoal() {
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
    
    // DÜZELTME: GAME_LOOP global olmalı
    const GAME_LOOP_SPEED = (typeof GAME_LOOP !== 'undefined') ? GAME_LOOP.GAME_SPEED : 1;
    const goalResetDelay = GAME_LOOP_SPEED > 100 ? 0 : 3000;
    
    setTimeout(() => {
        if (gameState.status !== 'finished') {
            setupKickOff(kickOffTeam);
        }
    }, goalResetDelay); 
}
function switchSides() {
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

const originalStartMatch = window.startMatch;

function startMatch() {
    console.log('START MATCH CALLED!');
    
    try {
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

        const initialized = initializePlayers(
            homeTeam.players,
            awayTeam.players,
            homeTeam.formation,
            awayTeam.formation
        );

        gameState.homePlayers = initialized.home;
        gameState.awayPlayers = initialized.away;

        // RESET MATCH STATE
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

        // set piece handling
        gameState.setPieceExecuting = false;
        gameState.lastControlAttempt = 0;

        gameState.homeTeamState = 'BALANCED';
        gameState.awayTeamState = 'BALANCED';
        gameState.lastTeamStateUpdate = Date.now();
        gameState.possessionChanges = 0;
        
        lastFrameTime = 0;
        physicsAccumulator = 0;
        gameTime = 0;

        //---------------------------------------------------
        // ✅✅ CRITICAL — Initialize stats BEFORE loops run
        //---------------------------------------------------
        if (typeof ensureStatsShape === "function") {
            ensureStatsShape(gameState);
        } else {
            // Minimal fallback if utils missing
            gameState.stats = gameState.stats || {};
            gameState.stats.home = gameState.stats.home || {};
            gameState.stats.away = gameState.stats.away || {};
            if (typeof gameState.stats.home.possession !== "number") gameState.stats.home.possession = 0;
            if (typeof gameState.stats.away.possession !== "number") gameState.stats.away.possession = 0;
            gameState.stats.possessionTimer = gameState.stats.possessionTimer || { home: 0, away: 0 };
            if (typeof gameState.stats.lastPossessionUpdate !== "number")
                gameState.stats.lastPossessionUpdate = Date.now();
            gameState.stats.possession = gameState.stats.possession || { home: 50, away: 50 };
        }
        //---------------------------------------------------

        render();
        
        // INITIAL DRAW + INTRO ANIMATION
        setTimeout(() => {
            console.log('🎨 Initializing canvas layers...');
            const success = initializeCanvasLayers();
            
            if (success) {
                console.log('✓ Canvas layers ready');
                drawPitchBackground();
                
                if (gameState.contexts.game) {
                    console.log('✓ Rendering initial game state');
                    renderGame();
                }
                
                console.log('✓ Starting intro rendering');
                animationFrameId = requestAnimationFrame(introRenderLoop);
            } else {
                console.error('✗ Failed to initialize canvas layers');
                alert('Error: Canvas initialization failed. Please refresh the page.');
            }
        }, 150);

        // FINAL BEGIN MATCH
        setTimeout(() => {

            setupKickOff('home');

            gameState.commentary = [{ 
                text: `⚽ ${gameState.homeTeam} (${homeTeam.formation}, ${TACTICS[gameState.homeTactic].name}) vs ${gameState.awayTeam} (${awayTeam.formation}, ${TACTICS[gameState.awayTactic].name}) - KICK OFF!`, 
                type: 'goal' 
            }];
            
            updateGameUI();
            
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            
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


        //---------------------------------------------------
        // ✅ REAL-TIME CLOCK + match stats loops
        //---------------------------------------------------
        const realTimeInterval = 100;
        const timeIncrementPerInterval = GAME_LOOP.GAME_SPEED * (realTimeInterval / 1000);

        gameIntervalId = setInterval(() => {

            if (gameState.status === 'playing') {
                gameState.timeElapsed += timeIncrementPerInterval; 
            }

            // ✅ SAFE — stats initialized before loop
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
                updateGameUI();
            }

        }, realTimeInterval);

        //---------------------------------------------------

    } catch (error) {
        console.error('ERROR IN START MATCH:', error);
    }
}

function debugBallState() {
    if (gameState.status === 'playing') {
        const ballSpeed = Math.sqrt(
            gameState.ballVelocity.x ** 2 + gameState.ballVelocity.y ** 2
        );
        
        if (ballSpeed < 1 && !gameState.ballHolder && !gameState.ballTrajectory) {
            console.log('⚠️ BALL APPEARS STUCK:', {
                position: gameState.ballPosition,
                velocity: gameState.ballVelocity,
                chasers: gameState.ballChasers.size,
                holder: gameState.ballHolder?.name
            });
        }
    }
}

// Call this every second
setInterval(debugBallState, 1000);
function introRenderLoop(timestamp) {
    if (gameState.status !== 'intro') {
        return; 
    }
    
    if (!gameState.contexts.game) {
        animationFrameId = requestAnimationFrame(introRenderLoop);
        return;
    }
    
    renderGame();
    animationFrameId = requestAnimationFrame(introRenderLoop);
}

function handleHalfTime() {
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
    
    // DÜZELTME: GAME_LOOP global olmalı
    const GAME_LOOP_SPEED = (typeof GAME_LOOP !== 'undefined') ? GAME_LOOP.GAME_SPEED : 1;
    const halftimeDelay = GAME_LOOP_SPEED > 100 ? 0 : 5000;
    
    setTimeout(() => {
        switchSides();
        gameState.currentHalf = 2;
        gameState.timeElapsed = 45;

        setupKickOff('away');

        // CRITICAL FIX: Give extra positioning time for 2nd half kick-off
        // Players were just repositioned by switchSides(), need more time to reach kick-off positions
        if (gameState.setPiece && gameState.setPiece.type === 'KICK_OFF') {
            gameState.setPiece.executionTime = Date.now() + 2000; // 2 seconds instead of 1.2
        }

        // FIXED: Don't override status to 'playing' - setupKickOff already set it to 'KICK_OFF'
        // The kick-off execution will transition to 'playing' automatically after the ball is kicked
        // gameState.status = 'playing'; // REMOVED - this was bypassing kick-off execution!
        gameState.commentary.push({ text: '▶️ Second half begins!', type: 'goal' });
        
        if (GAME_LOOP_SPEED <= 100) {
            updateGameUI();
        }
        
        lastFrameTime = 0;
        physicsAccumulator = 0;
        
        // DÜZELTME: gameLoop_V2 global olmalı (core.js'den)
        if (typeof gameLoop_V2 === 'function') {
           animationFrameId = requestAnimationFrame(gameLoop_V2);
        }
    }, halftimeDelay); 
}

function handleFullTime() {
    gameState.status = 'finished';
    clearInterval(gameIntervalId);
    
    const winner = gameState.homeScore > gameState.awayScore ? gameState.homeTeam : 
                 gameState.awayScore > gameState.homeScore ? gameState.awayTeam : 'Draw';
    gameState.commentary.push(
        { text: `🏁 FULL TIME! ${gameState.homeScore} - ${gameState.awayScore}`, type: 'goal' },
        { text: winner === 'Draw' ? '🤝 Match ends in a draw!' : `🏆 ${winner} WINS!`, type: 'goal' }
    );
    
    eventBus.publish(EVENT_TYPES.MATCH_END, {
        homeScore: gameState.homeScore,
        awayScore: gameState.awayScore,
        winner: winner
    });
    
    render();
}

function resetMatch() {
    if (gameIntervalId) clearInterval(gameIntervalId);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    
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
    
    // Reset team states
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
            passesCompleted: 0,
            passesAttempted: 0,
            shotsOnTarget: 0,
            shotsOffTarget: 0,
            tackles: 0,
            interceptions: 0,
            xGTotal: 0
        },
        away: {
            possession: 0,
            passesCompleted: 0,
            passesAttempted: 0,
            shotsOnTarget: 0,
            shotsOffTarget: 0,
            tackles: 0,
            interceptions: 0,
            xGTotal: 0
        },
        possessionTimer: { home: 0, away: 0 },
        lastPossessionUpdate: Date.now()
    };
    pendingGameEvents = [];
    
    render();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        if (typeof render === 'function') {
            render();
        } else {
            console.error('❌ render function not found - check script load order');
        }
    });
} else {
    // DOM already loaded
    if (typeof render === 'function') {
        render();
    } else {
        console.error('❌ render function not found - check script load order');
    }
}

