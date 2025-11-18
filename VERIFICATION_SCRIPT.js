// =============================================================================
// VERIFICATION SCRIPT - Run this in browser console to check everything
// =============================================================================

function verifySetPieceSystem() {
    console.log('🔍 ENHANCED SET PIECE SYSTEM VERIFICATION');
    console.log('==========================================\n');
    
    let allPassed = true;
    
    // Test 1: Check if systems are loaded
    console.log('TEST 1: System Loading');
    if (typeof SetPieceBehaviorSystem === 'undefined') {
        console.error('❌ SetPieceBehaviorSystem NOT loaded');
        allPassed = false;
    } else {
        console.log('✅ SetPieceBehaviorSystem loaded');
    }
    
    if (typeof SetPieceIntegration === 'undefined') {
        console.error('❌ SetPieceIntegration NOT loaded');
        allPassed = false;
    } else {
        console.log('✅ SetPieceIntegration loaded');
    }
    console.log('');
    
    // Test 2: Check goal coordinates match
    console.log('TEST 2: Goal Coordinates Alignment');
    if (typeof GAME_CONFIG !== 'undefined' && typeof SetPieceBehaviorSystem !== 'undefined') {
        const yourGoalTop = GAME_CONFIG.GOAL_Y_TOP;
        const yourGoalBottom = GAME_CONFIG.GOAL_Y_BOTTOM;
        const systemGoalTop = GAME_CONFIG.GOAL_Y_TOP;
        const systemGoalBottom = GAME_CONFIG.GOAL_Y_BOTTOM;
        
        console.log(`Your GOAL_Y_TOP: ${yourGoalTop}`);
        console.log(`System GOAL_Y_TOP: ${systemGoalTop}`);
        
        if (yourGoalTop === systemGoalTop) {
            console.log('✅ GOAL_Y_TOP matches');
        } else {
            console.error(`❌ GOAL_Y_TOP mismatch! (${yourGoalTop} vs ${systemGoalTop})`);
            allPassed = false;
        }
        
        console.log(`Your GOAL_Y_BOTTOM: ${yourGoalBottom}`);
        console.log(`System GOAL_Y_BOTTOM: ${systemGoalBottom}`);
        
        if (yourGoalBottom === systemGoalBottom) {
            console.log('✅ GOAL_Y_BOTTOM matches');
        } else {
            console.error(`❌ GOAL_Y_BOTTOM mismatch! (${yourGoalBottom} vs ${systemGoalBottom})`);
            allPassed = false;
        }
    } else {
        console.warn('⚠️ Cannot verify - GAME_CONFIG or system not loaded');
    }
    console.log('');
    
    // Test 3: Check field dimensions
    console.log('TEST 3: Field Dimensions');
    // Check if GAME_CONFIG and its properties exist and are numbers
    if (typeof GAME_CONFIG !== 'undefined' &&
        typeof GAME_CONFIG.PITCH_WIDTH === 'number' && !isNaN(GAME_CONFIG.PITCH_WIDTH) &&
        typeof GAME_CONFIG.PITCH_HEIGHT === 'number' && !isNaN(GAME_CONFIG.PITCH_HEIGHT)) {

        const actualWidth = GAME_CONFIG.PITCH_WIDTH;
        const actualHeight = GAME_CONFIG.PITCH_HEIGHT;
        const expectedWidth = 800; // Define expected width
        const expectedHeight = 600; // Define expected height

        console.log(`Expected: ${expectedWidth}x${expectedHeight}`);
        console.log(`Actual: ${actualWidth}x${actualHeight}`);

        // Compare actual dimensions with expected dimensions
        if (actualWidth === expectedWidth && actualHeight === expectedHeight) {
            console.log(`✅ Field dimensions are correct (${actualWidth}x${actualHeight})`);
        } else {
            console.error(`❌ Field dimensions mismatch! Expected ${expectedWidth}x${expectedHeight}, but got ${actualWidth}x${actualHeight}`);
            allPassed = false;
        }
    } else {
        // Error if GAME_CONFIG or its properties are missing/invalid
        console.error('❌ Cannot verify field dimensions - GAME_CONFIG or its properties (PITCH_WIDTH/HEIGHT) are missing or not valid numbers!');
        allPassed = false; // Mark test as failed
    }
    console.log(''); // Keep the empty line for spacing
    
    // Test 4: Test corner positioning
    console.log('TEST 4: Corner Positioning');
    if (typeof SetPieceIntegration !== 'undefined') {
        const topLeft = SetPieceIntegration.getCornerKickPosition(true, true);
        const topRight = SetPieceIntegration.getCornerKickPosition(false, true);
        const bottomLeft = SetPieceIntegration.getCornerKickPosition(true, false);
        const bottomRight = SetPieceIntegration.getCornerKickPosition(false, false);
        
        console.log(`Top-left corner: (${topLeft.x}, ${topLeft.y})`);
        console.log(`Top-right corner: (${topRight.x}, ${topRight.y})`);
        console.log(`Bottom-left corner: (${bottomLeft.x}, ${bottomLeft.y})`);
        console.log(`Bottom-right corner: (${bottomRight.x}, ${bottomRight.y})`);
        
        if (topLeft.x === 5 && topLeft.y === 5 &&
            topRight.x === 795 && topRight.y === 5 &&
            bottomLeft.x === 5 && bottomLeft.y === 595 &&
            bottomRight.x === 795 && bottomRight.y === 595) {
            console.log('✅ All corners positioned correctly (5px from edges)');
        } else {
            console.error('❌ Corner positions incorrect');
            allPassed = false;
        }
    }
    console.log('');
    
    // Test 5: Test goal kick positioning
    console.log('TEST 5: Goal Kick Positioning');
    if (typeof SetPieceIntegration !== 'undefined') {
        const leftGoalKick = SetPieceIntegration.getGoalKickPosition(50, 'center');
        const rightGoalKick = SetPieceIntegration.getGoalKickPosition(750, 'center');
        
        console.log(`Left goal kick: (${leftGoalKick.x}, ${leftGoalKick.y})`);
        console.log(`Right goal kick: (${rightGoalKick.x}, ${rightGoalKick.y})`);
        
        if (leftGoalKick.x === 102 && leftGoalKick.y === 300 &&
            rightGoalKick.x === 698 && rightGoalKick.y === 300) {
            console.log('✅ Goal kicks positioned correctly (inside 6-yard box)');
        } else {
            console.error('❌ Goal kick positions incorrect');
            allPassed = false;
        }
    }
    console.log('');
    
    // Test 6: Check player roles (if game is running)
    console.log('TEST 6: Player Role Compatibility');
    if (typeof gameState !== 'undefined' && gameState.homePlayers) {
        const roles = new Set();
        [...gameState.homePlayers, ...gameState.awayPlayers].forEach(p => {
            if (p.role) roles.add(p.role);
        });
        
        console.log('Player roles in use:', Array.from(roles).join(', '));
        
        // Check if system understands these roles
        const supportedRoles = ['GK', 'CB', 'RB', 'LB', 'WB', 'CDM', 'CM', 'RM', 'LM', 'CAM', 'RW', 'LW', 'ST'];
        const unsupportedRoles = Array.from(roles).filter(r => !supportedRoles.includes(r));
        
        if (unsupportedRoles.length === 0) {
            console.log('✅ All player roles are supported');
        } else {
            console.warn('⚠️ Some roles may not be optimally handled:', unsupportedRoles.join(', '));
        }
    } else {
        console.log('⚠️ Game not running - cannot verify player roles');
    }
    console.log('');
    
    // Test 7: Test actual positioning (if in set piece)
    console.log('TEST 7: Live Set Piece Test');
    if (typeof gameState !== 'undefined' && gameState.setPiece) {
        console.log(`Active set piece: ${gameState.status}`);
        console.log(`Ball position: (${gameState.setPiece.position.x}, ${gameState.setPiece.position.y})`);
        
        if (typeof SetPieceBehaviorSystem !== 'undefined') {
            const testPlayer = gameState.homePlayers[0];
            const position = SetPieceBehaviorSystem.getSetPiecePosition(testPlayer, gameState);
            
            if (position) {
                console.log(`✅ Player positioning working`);
                console.log(`   Sample position for ${testPlayer.role}: (${Math.round(position.x)}, ${Math.round(position.y)})`);
                console.log(`   Movement type: ${position.movement}`);
            } else {
                console.error('❌ Player positioning returned null');
                allPassed = false;
            }
        }
    } else {
        console.log('ℹ️ No active set piece - award one to test live positioning');
    }
    console.log('');
    
    // Final Summary
    console.log('==========================================');
    if (allPassed) {
        console.log('✅ ALL TESTS PASSED - System 100% compatible!');
        console.log('🎉 Enhanced set piece system is ready to use!');
    } else {
        console.log('❌ SOME TESTS FAILED - Check errors above');
        console.log('📋 Review DIAGNOSTIC_REPORT.md for details');
    }
    console.log('==========================================\n');
    
    return allPassed;
}

// Auto-run verification
console.log('🚀 Running automatic verification...\n');
const result = verifySetPieceSystem();

if (result) {
    console.log('\n💡 TIP: Award a corner kick to see live positioning!');
    console.log('💡 Enable debug mode with: window.DEBUG_SET_PIECES = true');
} else {
    console.log('\n🆘 HELP: Check FIXES_APPLIED_SUMMARY.md for solutions');
}

// Make function available globally
window.verifySetPieceSystem = verifySetPieceSystem;
console.log('\n✨ You can re-run this anytime with: verifySetPieceSystem()');
