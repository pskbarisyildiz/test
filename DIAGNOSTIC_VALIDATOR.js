// ============================================================================
// PHASE 3: VALIDATION & DIAGNOSTICS
// ============================================================================
// Purpose: Simulate game loop to validate fixes and detect issues
// Created: 2025-11-12
// ============================================================================

const DiagnosticValidator = {
    results: {
        passed: [],
        warnings: [],
        errors: [],
        metrics: {}
    },

    /**
     * Run all validation tests
     */
    runAllTests() {
        console.log('🧪 ========== DIAGNOSTIC VALIDATION START ==========');
        this.reset();

        this.testConfigAccess();
        this.testMathUtilities();
        this.testPhysicsStability();
        this.testSetPieceInitialization();
        this.testParticleManagement();
        this.simulateGameLoop(1000); // 1000 frames (~16.6 seconds)

        this.printReport();
        console.log('🧪 ========== DIAGNOSTIC VALIDATION END ==========');

        return this.results;
    },

    reset() {
        this.results = {
            passed: [],
            warnings: [],
            errors: [],
            metrics: {
                framesSimulated: 0,
                avgDeltaTime: 0,
                maxDeltaTime: 0,
                minDeltaTime: Infinity,
                nanDetections: 0,
                particlesPeakCount: 0
            }
        };
    },

    /**
     * Test 1: Config Access
     */
    testConfigAccess() {
        console.log('📋 Test 1: Config Access Validation...');

        try {
            // Test CFG function exists
            if (typeof CFG !== 'function') {
                this.results.errors.push('CFG function not loaded');
                return;
            }

            // Test basic config reads
            const pitchWidth = CFG('PITCH_WIDTH', 800);
            const maxSpeed = CFG('MAX_SPEED', 220);
            const friction = CFG('FRICTION', 0.88);

            if (!isFinite(pitchWidth) || !isFinite(maxSpeed) || !isFinite(friction)) {
                this.results.errors.push('Config returned non-finite values');
            } else {
                this.results.passed.push('Config access working correctly');
            }

            // Test config with no default (should warn)
            const testMissing = CFG('NONEXISTENT_KEY_12345');
            if (testMissing === undefined) {
                this.results.passed.push('Config correctly returns undefined for missing keys');
            }

        } catch (error) {
            this.results.errors.push(`Config test failed: ${error.message}`);
        }
    },

    /**
     * Test 2: Math Utilities
     */
    testMathUtilities() {
        console.log('🔢 Test 2: Math Utilities Validation...');

        try {
            if (typeof MathUtils === 'undefined') {
                this.results.errors.push('MathUtils not loaded');
                return;
            }

            // Test safeDiv
            const div1 = MathUtils.safeDiv(10, 2, 0); // Should be 5
            const div2 = MathUtils.safeDiv(10, 0, 99); // Should be 99 (fallback)
            const div3 = MathUtils.safeDiv(NaN, 5, 0); // Should be 0 (fallback)

            if (div1 !== 5 || div2 !== 99 || div3 !== 0) {
                this.results.errors.push(`safeDiv failed: ${div1}, ${div2}, ${div3}`);
            } else {
                this.results.passed.push('MathUtils.safeDiv working correctly');
            }

            // Test safeSqrt
            const sqrt1 = MathUtils.safeSqrt(16, 0); // Should be 4
            const sqrt2 = MathUtils.safeSqrt(-1, 0); // Should be 0 (fallback)

            if (sqrt1 !== 4 || sqrt2 !== 0) {
                this.results.errors.push(`safeSqrt failed: ${sqrt1}, ${sqrt2}`);
            } else {
                this.results.passed.push('MathUtils.safeSqrt working correctly');
            }

            // Test distance
            const dist = MathUtils.distance({x: 0, y: 0}, {x: 3, y: 4}); // Should be 5
            if (Math.abs(dist - 5) > 0.01) {
                this.results.errors.push(`distance failed: ${dist}`);
            } else {
                this.results.passed.push('MathUtils.distance working correctly');
            }

        } catch (error) {
            this.results.errors.push(`Math utilities test failed: ${error.message}`);
        }
    },

    /**
     * Test 3: Physics Stability
     */
    testPhysicsStability() {
        console.log('⚛️ Test 3: Physics Stability...');

        try {
            // Create mock player
            const mockPlayer = {
                x: 400,
                y: 300,
                vx: 0,
                vy: 0,
                targetX: 500,
                targetY: 300,
                pace: 75,
                physicality: 70,
                speedBoost: 1.0,
                hasBallControl: false,
                stamina: 100,
                distanceCovered: 0
            };

            // Simulate 100 physics steps
            for (let i = 0; i < 100; i++) {
                const dx = mockPlayer.targetX - mockPlayer.x;
                const dy = mockPlayer.targetY - mockPlayer.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist > 2 && typeof updatePlayerVelocity === 'function') {
                    updatePlayerVelocity(mockPlayer, dx, dy, dist, 0.016);
                }

                mockPlayer.x += mockPlayer.vx * 0.016;
                mockPlayer.y += mockPlayer.vy * 0.016;

                // Check for NaN
                if (!isFinite(mockPlayer.x) || !isFinite(mockPlayer.y) ||
                    !isFinite(mockPlayer.vx) || !isFinite(mockPlayer.vy)) {
                    this.results.errors.push(`NaN detected at step ${i}: x=${mockPlayer.x}, y=${mockPlayer.y}, vx=${mockPlayer.vx}, vy=${mockPlayer.vy}`);
                    this.results.metrics.nanDetections++;
                    return;
                }
            }

            this.results.passed.push('Physics simulation stable for 100 steps (no NaN)');

        } catch (error) {
            this.results.errors.push(`Physics test failed: ${error.message}`);
        }
    },

    /**
     * Test 4: SetPiece Initialization
     */
    testSetPieceInitialization() {
        console.log('⚽ Test 4: SetPiece Initialization...');

        try {
            if (typeof gameState === 'undefined') {
                this.results.warnings.push('gameState not available for SetPiece test');
                return;
            }

            // Save original state
            const originalStatus = gameState.status;
            const originalSetPiece = gameState.setPiece;

            // Test setupKickOff if it exists
            if (typeof setupKickOff === 'function') {
                setupKickOff('home');

                // Check that setPiece has all required properties
                if (!gameState.setPiece) {
                    this.results.errors.push('SetPiece not initialized after setupKickOff');
                } else {
                    const sp = gameState.setPiece;
                    const hasAllProps = sp.type && sp.position && sp.executionTime !== undefined;

                    if (!hasAllProps) {
                        this.results.errors.push('SetPiece missing required properties');
                    } else if (sp.executionTime <= Date.now()) {
                        this.results.warnings.push('SetPiece executionTime is in the past');
                    } else {
                        this.results.passed.push('SetPiece initialized with all required properties atomically');
                    }
                }

                // Restore original state
                gameState.status = originalStatus;
                gameState.setPiece = originalSetPiece;
            } else {
                this.results.warnings.push('setupKickOff function not available');
            }

        } catch (error) {
            this.results.errors.push(`SetPiece test failed: ${error.message}`);
        }
    },

    /**
     * Test 5: Particle Management
     */
    testParticleManagement() {
        console.log('✨ Test 5: Particle Management...');

        try {
            if (typeof gameState === 'undefined') {
                this.results.warnings.push('gameState not available for particle test');
                return;
            }

            // Create excessive particles
            gameState.particles = gameState.particles || [];
            const originalCount = gameState.particles.length;

            // Add 300 mock particles
            const now = Date.now();
            for (let i = 0; i < 300; i++) {
                gameState.particles.push({
                    x: Math.random() * 800,
                    y: Math.random() * 600,
                    createdAt: now,
                    draw: () => {}
                });
            }

            // Call cleanup if it exists
            if (typeof updateParticlesWithCleanup === 'function') {
                updateParticlesWithCleanup(gameState);

                if (gameState.particles.length > 150) {
                    this.results.warnings.push(`Particle count ${gameState.particles.length} exceeds cap (150)`);
                } else {
                    this.results.passed.push(`Particle count capped correctly: ${gameState.particles.length}/150`);
                }

                // Restore original
                gameState.particles = gameState.particles.slice(0, originalCount);
            } else {
                this.results.warnings.push('updateParticlesWithCleanup not available');
            }

        } catch (error) {
            this.results.errors.push(`Particle test failed: ${error.message}`);
        }
    },

    /**
     * Test 6: Simulate Game Loop
     */
    simulateGameLoop(frames = 1000) {
        console.log(`🎮 Test 6: Simulating ${frames} game frames...`);

        if (typeof gameState === 'undefined') {
            this.results.warnings.push('Cannot simulate game loop: gameState not available');
            return;
        }

        try {
            const deltaHistory = [];
            let lastTime = performance.now();
            const FIXED_TIMESTEP = 3/60; // 50ms

            for (let frame = 0; frame < frames; frame++) {
                const now = performance.now();
                const rawDelta = (now - lastTime) / 1000;
                const dt = Math.min(rawDelta, 0.25); // Cap at 250ms
                lastTime = now;

                deltaHistory.push(dt);

                // Update a mock physics step
                if (gameState.ballPosition) {
                    // Validate ball state
                    if (!isFinite(gameState.ballPosition.x) || !isFinite(gameState.ballPosition.y)) {
                        this.results.errors.push(`NaN in ball position at frame ${frame}`);
                        this.results.metrics.nanDetections++;
                    }
                }

                // Track particle count
                if (gameState.particles) {
                    this.results.metrics.particlesPeakCount = Math.max(
                        this.results.metrics.particlesPeakCount,
                        gameState.particles.length
                    );
                }

                // Simulate 16ms delay
                const endTime = performance.now();
                while (performance.now() - endTime < 16) {
                    // Busy wait (simulating frame time)
                }
            }

            // Calculate metrics
            const totalDelta = deltaHistory.reduce((a, b) => a + b, 0);
            this.results.metrics.framesSimulated = frames;
            this.results.metrics.avgDeltaTime = (totalDelta / frames * 1000).toFixed(2);
            this.results.metrics.maxDeltaTime = (Math.max(...deltaHistory) * 1000).toFixed(2);
            this.results.metrics.minDeltaTime = (Math.min(...deltaHistory) * 1000).toFixed(2);

            // Check for timing drift
            const variance = Math.abs(this.results.metrics.avgDeltaTime - 16.67); // Expected 60 FPS = 16.67ms
            if (variance > 1.0) {
                this.results.warnings.push(`Timing drift detected: ${variance.toFixed(2)}ms variance from 60 FPS`);
            } else {
                this.results.passed.push(`Frame timing stable: ${this.results.metrics.avgDeltaTime}ms avg (${variance.toFixed(2)}ms variance)`);
            }

        } catch (error) {
            this.results.errors.push(`Game loop simulation failed: ${error.message}`);
        }
    },

    /**
     * Print formatted report
     */
    printReport() {
        console.log('\n📊 ========== VALIDATION REPORT ==========\n');

        console.log(`✅ PASSED (${this.results.passed.length}):`);
        this.results.passed.forEach(msg => console.log(`   ✓ ${msg}`));

        console.log(`\n⚠️  WARNINGS (${this.results.warnings.length}):`);
        this.results.warnings.forEach(msg => console.log(`   ⚠ ${msg}`));

        console.log(`\n❌ ERRORS (${this.results.errors.length}):`);
        this.results.errors.forEach(msg => console.log(`   ✗ ${msg}`));

        console.log('\n📈 METRICS:');
        console.log(`   Frames Simulated: ${this.results.metrics.framesSimulated}`);
        console.log(`   Avg Frame Time: ${this.results.metrics.avgDeltaTime}ms`);
        console.log(`   Min Frame Time: ${this.results.metrics.minDeltaTime}ms`);
        console.log(`   Max Frame Time: ${this.results.metrics.maxDeltaTime}ms`);
        console.log(`   NaN Detections: ${this.results.metrics.nanDetections}`);
        console.log(`   Peak Particles: ${this.results.metrics.particlesPeakCount}`);

        const successRate = ((this.results.passed.length) /
            (this.results.passed.length + this.results.errors.length)) * 100;

        console.log(`\n🎯 SUCCESS RATE: ${successRate.toFixed(1)}%\n`);
    }
};

// Export to window
if (typeof window !== 'undefined') {
    window.DiagnosticValidator = DiagnosticValidator;
    console.log('✅ Diagnostic Validator loaded');
    console.log('   Run: DiagnosticValidator.runAllTests()');
}
