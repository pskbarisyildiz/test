const uiElements = {};

function render() {
    const app = document.getElementById('app');
    if (typeof gameState === 'undefined') {
        console.error('❌ Cannot render: gameState not initialized');
        app.innerHTML = '<div style="padding: 40px; text-align: center; color: white;">Loading game state...</div>';
        return;
    }
    
    // --- 1. RENDER THE CURRENT SCREEN ---
    if (gameState.status === 'upload' || gameState.status === 'setup') {
        gameState.gameUIDisplayed = false; // Reset the flag
        if (gameState.status === 'upload') renderUploadScreen(app);
        if (gameState.status === 'setup') renderSetupScreen(app);
    } 
    // If the game is active
    else {
        // If the game UI hasn't been drawn yet, draw it ONCE.
        if (!gameState.gameUIDisplayed) {
            setupGameScreen(app);
            gameState.gameUIDisplayed = true; // Set the flag
        }
        // On every subsequent call, just update the text content.
        updateGameUI();
    }

    // --- 2. ALWAYS INJECT THE TOGGLE BUTTON ---
    // Find the placeholder div that was rendered by the functions above
    const toggleContainer = document.getElementById('toggle-container');
    
    if (toggleContainer) {
        // Create the button programmatically
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'orientationToggleBtn';
        
        // Apply styling
        toggleBtn.style.background = 'rgba(255,255,255,0.1)';
        toggleBtn.style.border = '1px solid rgba(255,255,255,0.2)';
        toggleBtn.style.color = 'white';
        toggleBtn.style.padding = '5px 10px';
        toggleBtn.style.borderRadius = '5px';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.fontSize = '10px';
        toggleBtn.style.opacity = '0.5';
        toggleBtn.style.transition = 'opacity 0.3s';
        
        // Set text based on current state
        toggleBtn.innerText = gameState.isVertical ? 'View: Horizontal' : 'View: Vertical';

        // Add hover effects
        toggleBtn.onmouseover = () => toggleBtn.style.opacity = '1';
        toggleBtn.onmouseout = () => toggleBtn.style.opacity = '0.5';
        
        // Add click event listener
        toggleBtn.addEventListener('click', toggleOrientation);
        
        // Clear container and add the new button
        toggleContainer.innerHTML = '';
        toggleContainer.appendChild(toggleBtn);
    }
}

function updateGameUI() {
    // Update Scoreboard text content
    if (uiElements.homeScore) uiElements.homeScore.textContent = gameState.homeScore;
    if (uiElements.awayScore) uiElements.awayScore.textContent = gameState.awayScore;
    if (uiElements.timeDisplay) uiElements.timeDisplay.textContent = `${String(Math.floor(gameState.timeElapsed)).padStart(2, '0')}'`;
    if (uiElements.halfDisplay) uiElements.halfDisplay.textContent = `HALF ${gameState.currentHalf}`;
    if (uiElements.statusIndicator) uiElements.statusIndicator.innerHTML = getStatusIndicator();

    // Update Commentary with fade-out effect
    const commentaryWrapper = document.getElementById('commentary-wrapper');
    if (commentaryWrapper) {
        clearTimeout(gameState.commentaryFadeTimeout);
        commentaryWrapper.innerHTML = renderCommentary();
        commentaryWrapper.style.opacity = '0.5'; // Set initial opacity

        gameState.commentaryFadeTimeout = setTimeout(() => {
            commentaryWrapper.style.opacity = '0.1'; // Fade out
        }, 1000); // Time before fade
    }

    // Update Stats
    if (uiElements.statsWrapper) {
        uiElements.statsWrapper.innerHTML = renderStats();
    }

    
    // Update Match Summary Overlay (This logic is correct)
    if (uiElements.summaryWrapper) {
        if (gameState.status === 'finished' && !gameState.summaryDrawn) {
            uiElements.summaryWrapper.innerHTML = renderMatchSummary();
            gameState.summaryDrawn = true; 
            
            setTimeout(() => { 
                const eventsTab = document.getElementById('events-tab');
                if(eventsTab) {
                    eventsTab.click();
                }
            }, 10);

        } else if (gameState.status !== 'finished' && gameState.summaryDrawn) {
            uiElements.summaryWrapper.innerHTML = '';
            gameState.summaryDrawn = false;
        }
    }
}

function setupGameScreen(app) {
    // 1. MANTIK/OYUN Koordinat Boyutları (CSS Görüntüleme Boyutu)
    const LOGICAL_WIDTH = gameState.isVertical ? 600 : 800;
    const LOGICAL_HEIGHT = gameState.isVertical ? 800 : 600;
    
    // 2. ÖLÇEK FAKTÖRÜ (initializeCanvasLayers'da kullanılanla aynı)
    const SCALE_FACTOR = CFG().HIGH_DPI_SCALE_FACTOR;

    // 3. FİZİKSEL PİKSEL BOYUTLARI (Canvas width/height attribute)
    const physicalCanvasWidth = LOGICAL_WIDTH * SCALE_FACTOR; // Örn: 1600
    const physicalCanvasHeight = LOGICAL_HEIGHT * SCALE_FACTOR; // Örn: 1200
    
    // 4. CSS GÖRÜNTÜLEME BOYUTU (Container style)
    // KONTEYNER BOYUTUNU MANTIK BOYUTUNDA TUTARIZ (Örn: 800px)
    const containerWidth = LOGICAL_WIDTH;
    const containerHeight = LOGICAL_HEIGHT;

    app.innerHTML = `
        <div class="container">
            <div style="width: ${containerWidth}px; margin: 0 auto 12px auto;">
                <div id="scoreboard-wrapper">
                    ${renderScoreboard()}
                </div>
            </div>
            
            <div class="canvas-container" style="position: relative; margin-bottom: 20px;">
                <div id="canvas-container" style="position: relative; width: ${containerWidth}px; height: ${containerHeight}px; margin: 0 auto; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1);">
                    <canvas id="backgroundCanvas" width="${physicalCanvasWidth}" height="${physicalCanvasHeight}" style="position: absolute; z-index: 1;"></canvas>
                    <canvas id="gameCanvas" width="${physicalCanvasWidth}" height="${physicalCanvasHeight}" style="position: absolute; z-index: 2;"></canvas>
                    <canvas id="uiCanvas" width="${physicalCanvasWidth}" height="${physicalCanvasHeight}" style="position: absolute; z-index: 3;"></canvas>
                    
                    <div id="commentary-wrapper" style="position: absolute; bottom: 16px; left: 16px; z-index: 4; max-width: 350px;">
                        ${renderCommentary()}
                    </div>
                </div>
                <div id="summary-wrapper"></div>
            </div>
            
            <div style="max-width: ${containerWidth}px; margin: 0 auto;">
                <div id="stats-wrapper">${renderStats()}</div>
            </div>

            <div id="toggle-container" style="max-width: ${containerWidth}px; margin: 10px auto 0; text-align: right;"></div>
        </div>
        
        `;

    // 3. Cache DOM elements (geri kalanı değişmez)
uiElements.homeScore = document.getElementById('home-score-color');
    uiElements.awayScore = document.getElementById('away-score-color');
    uiElements.timeDisplay = document.getElementById('time-display');
    uiElements.halfDisplay = document.getElementById('half-display');
    uiElements.statusIndicator = document.getElementById('status-indicator');
    uiElements.commentaryContent = document.getElementById('commentary-content');
    uiElements.statsWrapper = document.getElementById('stats-wrapper');
    uiElements.summaryWrapper = document.getElementById('summary-wrapper');

    // ... (diğer ui elementleri)

    // 5. Initialize canvas (geri kalanı değişmez)
    setTimeout(() => {
        console.log('🎨 Setting up canvas & drawing background...');
        const success = initializeCanvasLayers();
        if (success) {
            // NEW: Check if orientation changed to invalidate cache
            if (gameState.orientationChanged) {
                 gameState.offscreenPitch = null; // Invalidate cache
                 gameState.orientationChanged = false; // Reset flag
            }
            drawPitchBackground();
            renderGame();
        } else {
            console.error('❌ Failed to initialize canvases');
        }
    }, 0);
}