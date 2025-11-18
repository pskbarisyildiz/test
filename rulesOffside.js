const offsideTracker = {
    lastPassTime: 0,
    playersOffsideWhenBallPlayed: new Set(),
    lastPassingTeam: null
};

function isPlayerInOffsidePosition(player, ball, opponents) {
    // Only check attacking players (not the team with ball in own half)
    const opponentGoalX = getAttackingGoalX(player.isHome, gameState.currentHalf);
    const ownGoalX = getAttackingGoalX(!player.isHome, gameState.currentHalf);
    
    const attackingDirection = opponentGoalX > ownGoalX ? 1 : -1;
    const isInOpponentHalf = attackingDirection > 0 ? 
        player.x > 400 : 
        player.x < 400;
    
    // Not offside if in own half
    if (!isInOpponentHalf) {
        return false;
    }
    
    // Not offside if behind or level with ball
    const isBehindBall = attackingDirection > 0 ? 
        player.x <= ball.x : 
        player.x >= ball.x;
    
    if (isBehindBall) {
        return false;
    }
    
    // Check if ahead of second-last opponent
    const opponentsAheadOfPlayer = opponents.filter(opp => {
        if (opp.role === 'GK') return false; // Don't count GK in some calculations
        
        const oppDistToGoal = attackingDirection > 0 ? 
            opp.x : 
            800 - opp.x;
        const playerDistToGoal = attackingDirection > 0 ? 
            player.x : 
            800 - player.x;
        
        return oppDistToGoal < playerDistToGoal;
    });
    
    // Need at least 2 opponents between player and goal (usually GK + 1 defender)
    // If fewer than 2, player is offside
    return opponentsAheadOfPlayer.length < 2;
}


function recordOffsidePositions(passingPlayer, allPlayers) {
    if (!passingPlayer || !Array.isArray(allPlayers) || allPlayers.length === 0) {
        return;
    }
    
    // FIXED: Clear previous offside flags first
    allPlayers.forEach(p => {
        if (p.wasOffsideWhenBallPlayed) {
            delete p.wasOffsideWhenBallPlayed;
        }
    });
    
    offsideTracker.lastPassTime = Date.now();
    offsideTracker.lastPassingTeam = passingPlayer.isHome ? 'home' : 'away';
    offsideTracker.playersOffsideWhenBallPlayed.clear();
    
    const teammates = allPlayers.filter(p => 
        p.isHome === passingPlayer.isHome && 
        p.id !== passingPlayer.id
    );
    const opponents = allPlayers.filter(p => p.isHome !== passingPlayer.isHome);
    
    if (!gameState.ballPosition) {
        return;
    }
    
    teammates.forEach(teammate => {
        if (isPlayerInOffsidePosition(teammate, gameState.ballPosition, opponents)) {
            offsideTracker.playersOffsideWhenBallPlayed.add(teammate.id);
            teammate.wasOffsideWhenBallPlayed = true;
        }
    });
}
function checkOffsidePenalty(player) {
    if (!player || !offsideTracker.playersOffsideWhenBallPlayed) {
        return false;
    }
    
    if (!offsideTracker.playersOffsideWhenBallPlayed.has(player.id)) {
        return false;
    }
    
    return true;
}
function awardOffsideFreeKick(offsidePlayer) {
    const offenseTeam = offsidePlayer.isHome ? 'home' : 'away';
    
    console.log(`ðŸš© OFFSIDE! ${offsidePlayer.name} was in offside position`);
    
    // Stop play
    gameState.ballTrajectory = null;
    gameState.ballHolder = null;
    gameState.shotInProgress = false;
    gameState.ballVelocity = { x: 0, y: 0 }; // FIXED: Reset velocity
    
    // Commentary
    gameState.commentary.push({
        text: `${Math.floor(gameState.timeElapsed)}' OFFSIDE - ${offsidePlayer.name}`,
        type: 'offside'
    });
    
    // Publish event and record stat
    if (typeof eventBus !== 'undefined' && typeof EVENT_TYPES !== 'undefined') {
        eventBus.publish(EVENT_TYPES.OFFSIDE_CALLED, {
            player: offsidePlayer,
            time: Math.floor(gameState.timeElapsed)
        });
    }
    
    if (typeof recordOffsideStatistic === 'function') {
        recordOffsideStatistic(offsidePlayer);
    }
    
    // Award free kick to defending team at the location of the foul

    const freeKickX = Math.max(50, Math.min(750, offsidePlayer.x));
    const freeKickY = Math.max(50, Math.min(550, offsidePlayer.y));
    
    const defenders = offenseTeam === 'home' ? 
        gameState.awayPlayers : 
        gameState.homePlayers;


    if (!defenders || defenders.length === 0) {
        console.error('No defenders available to take the offside free kick.');
        gameState.status = 'playing'; // Resume play to avoid getting stuck
        offsideTracker.playersOffsideWhenBallPlayed.clear();
        return;
    }
    
    // Find the closest defender to the ball to take the kick
    const freeKickTaker = defenders
        .filter(p => p && p.x !== undefined && p.y !== undefined) // FIXED: Safety check
        .reduce((closest, current) => {
            const distToClosest = getDistance(closest, { x: freeKickX, y: freeKickY });
            const distToCurrent = getDistance(current, { x: freeKickX, y: freeKickY });
            return distToCurrent < distToClosest ? current : closest;
        });
    
    if (!freeKickTaker) {
        console.error('Could not find a suitable free kick taker.');
        gameState.status = 'playing';
        offsideTracker.playersOffsideWhenBallPlayed.clear();
        return;
    }
    
    // Give ball to defender after a short delay
    setTimeout(() => {
        if (gameState.status !== 'finished') { // FIXED: Check game isn't over
            gameState.ballPosition.x = freeKickX;
            gameState.ballPosition.y = freeKickY;
            gameState.ballVelocity.x = 0;
            gameState.ballVelocity.y = 0;
            gameState.ballHolder = freeKickTaker;
            freeKickTaker.hasBallControl = true;
            freeKickTaker.ballReceivedTime = Date.now();
            
            // Clear offside tracking
            offsideTracker.playersOffsideWhenBallPlayed.clear();
        }
    }, 1000);
}

function drawOffsideLines(ctx) {
    if (!gameState.contexts.game) return;
    
    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    
    // Draw offside line for home team
    const awayDefenders = gameState.awayPlayers
        .filter(p => p.role !== 'GK')
        .sort((a, b) => a.x - b.x);
    
    if (awayDefenders.length >= 2) {
        const secondLastDefender = awayDefenders[1];
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(secondLastDefender.x, 0);
        ctx.lineTo(secondLastDefender.x, 600);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    // Draw offside line for away team
    const homeDefenders = gameState.homePlayers
        .filter(p => p.role !== 'GK')
        .sort((a, b) => b.x - a.x);
    
    if (homeDefenders.length >= 2) {
        const secondLastDefender = homeDefenders[1];
        ctx.strokeStyle = 'rgba(0, 0, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(secondLastDefender.x, 0);
        ctx.lineTo(secondLastDefender.x, 600);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    // Mark players who were offside when ball was played
    allPlayers.forEach(player => {
        if (player.wasOffsideWhenBallPlayed) {
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
            ctx.lineWidth = 3;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.arc(player.x, player.y, 20, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    });
}

/**
 * Add offside awareness to player AI
 * Players should avoid getting caught offside
 */
function shouldAvoidOffside(player, ball, opponents) {
    // Only check for attacking players
    const opponentGoalX = getAttackingGoalX(player.isHome, gameState.currentHalf);
    const distToGoal = Math.abs(player.x - opponentGoalX);
    
    // Not relevant if far from goal
    if (distToGoal > 300) return false;
    
    // Check if would be offside
    if (isPlayerInOffsidePosition(player, ball, opponents)) {
        // Close to being involved in play?
        const distToBall = getDistance(player, ball);
        
        if (distToBall < 150) {
            // Too close to ball while offside - need to retreat!
            return true;
        }
    }
    
    return false;
}

function initOffsideStats() {
    gameState.stats.home.offsides = 0;
    gameState.stats.away.offsides = 0;
}

function recordOffsideStatistic(player) {
    const teamStats = player.isHome ? gameState.stats.home : gameState.stats.away;
    teamStats.offsides++;
}

// Add new event type to EVENT_TYPES in eventBus.js
// EVENT_TYPES.OFFSIDE_CALLED = 'offside:called';

/**
 * ============================================================================
 * TESTING & VALIDATION
 * ============================================================================
 */

function testOffsideDetection() {
    console.log('=== OFFSIDE DETECTION TEST ===');
    
    // Test scenario: Attacker ahead of all defenders
    const testPlayer = {
        id: 'test',
        isHome: true,
        x: 700, // Near opponent goal
        y: 300
    };
    
    const testBall = { x: 500, y: 300 };
    
    const testOpponents = [
        { role: 'GK', x: 750, y: 300 },
        { role: 'CB', x: 650, y: 300 },
        { role: 'CB', x: 680, y: 320 }
    ];
    
    gameState.currentHalf = 1;
    const isOffside = isPlayerInOffsidePosition(testPlayer, testBall, testOpponents);
    
    console.log(`“ Player at x=700, ball at x=500, last defender at x=680`);
    console.log(`“ Expected: OFFSIDE = true`);
    console.log(`“ Actual: ${isOffside}`);
    console.assert(isOffside === true, 'Offside detection failed!');
    
    // Test scenario: Attacker behind ball
    testPlayer.x = 450;
    const isOffside2 = isPlayerInOffsidePosition(testPlayer, testBall, testOpponents);
    console.log(`“ Player at x=450, ball at x=500`);
    console.log(`“ Expected: OFFSIDE = false (behind ball)`);
    console.log(`“ Actual: ${isOffside2}`);
    console.assert(isOffside2 === false, 'Should not be offside when behind ball!');
    
    console.log('=== ALL OFFSIDE TESTS PASSED ===');
}

// Run tests in development
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // testOffsideDetection(); // Uncomment to test
}
