// js/goal-animation.js

let confettiParticles = [];
const gravity = 0.4;
let confettiAnimationId = null;

class ConfettiParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 8 + 4;
        this.vx = Math.random() * 8 - 4;
        this.vy = Math.random() * -10 - 5; // Start moving upwards
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 20 - 10;
        this.opacity = 1;
    }

    update() {
        this.vy += gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        // Check if particle is below the UI canvas height
        if (gameState && gameState.canvases && gameState.canvases.ui && this.y > gameState.canvases.ui.height + this.size) {
             this.opacity = 0; // Make invisible if off-screen
        } else if (this.opacity > 0) {
            // Optional: Fade out slowly near the end
            // this.opacity -= 0.005;
        }
    }

    draw(ctx) {
        if (this.opacity <= 0) return; // Don't draw if invisible

        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        // Draw rectangle shape for confetti
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 1.5);
        ctx.restore();
    }
}

function createConfetti(colors) {
    // Ensure ui canvas exists before proceeding
    if (!gameState || !gameState.canvases || !gameState.canvases.ui) {
        console.error("Confetti creation failed: UI canvas not ready.");
        return;
    }
    const uiCanvas = gameState.canvases.ui;
    confettiParticles = [];
    const amount = 250; // Number of confetti particles

    for (let i = 0; i < amount; i++) {
        const x = Math.random() * uiCanvas.width;
        // Start confetti near the top or middle of the screen
        const y = Math.random() * uiCanvas.height * 0.5 - 50; // Start higher up
        const color = colors[Math.floor(Math.random() * colors.length)];
        confettiParticles.push(new ConfettiParticle(x, y, color));
    }
}

function animateConfetti() {
     // Ensure ui context exists
    if (!gameState || !gameState.contexts || !gameState.contexts.ui) {
        console.error("Confetti animation failed: UI context not ready.");
        if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId); // Stop loop if context lost
        confettiAnimationId = null;
        return;
    }
    const uiCtx = gameState.contexts.ui;

    // Clear the entire canvas each frame
    uiCtx.clearRect(0, 0, uiCtx.canvas.width, uiCtx.canvas.height);

    // Update and draw each particle
    confettiParticles.forEach(p => {
        p.update();
        p.draw(uiCtx);
    });

    // Remove particles that are no longer visible
    confettiParticles = confettiParticles.filter(p => p.opacity > 0);

    // Continue animation if particles remain
    if (confettiParticles.length > 0) {
        confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
        // Clear canvas one last time when done and stop animation loop
        uiCtx.clearRect(0, 0, uiCtx.canvas.width, uiCtx.canvas.height);
        confettiAnimationId = null; // Ensure loop stops
    }
}

/**
 * Shows the goal animation with text and confetti.
 * @param {string} scorerName - The name of the player who scored.
 * @param {string[]} teamColors - Array containing two colors for the scoring team [color1, color2].
 */
function showGoalAnimation(scorerName, teamColors) {
    const container = document.getElementById('goal-animation-container');
    const goalText = document.getElementById('goal-text');
    const scorerText = document.getElementById('scorer-name'); // Get the scorer name element
    const root = document.documentElement; // To set CSS variables

    if (!container || !goalText || !scorerText) {
        console.error("Goal animation elements not found!");
        return;
    }

    // --- 1. Set Colors and Scorer Name ---
    // Ensure teamColors is an array with at least two elements
    const color1 = (teamColors && teamColors.length > 0) ? teamColors[0] : '#ff4500'; // Default color 1
    const color2 = (teamColors && teamColors.length > 1) ? teamColors[1] : '#ffd700'; // Default color 2

    // Set CSS variables for the "Goal!" text gradient
    goalText.style.setProperty('--color1', color1);
    goalText.style.setProperty('--color2', color2);

    // Set the scorer name text content
    scorerText.textContent = scorerName || ''; // Use provided name or empty string

    // --- 2. Reset and Show Elements ---
    container.style.display = 'flex'; // Make the container visible
    goalText.classList.remove('animate'); // Reset "Goal!" animation class
    scorerText.classList.remove('animate'); // Reset scorer name animation class

    // Force reflow/repaint before adding class back - crucial for re-triggering animation
    void goalText.offsetWidth;

    // --- 3. Trigger Animations ---
    goalText.classList.add('animate'); // Start "Goal!" animation
    scorerText.classList.add('animate'); // Start scorer name animation (uses CSS transition delay)

    // --- 4. Trigger Confetti ---
    if (confettiAnimationId) {
        cancelAnimationFrame(confettiAnimationId); // Stop any previous confetti animation
        confettiAnimationId = null;
    }
    createConfetti([color1, color2, '#ffffff']); // Use team colors + white for confetti
    animateConfetti(); // Start new confetti animation

    // --- 5. Hide After Animation ---
    // Hide the container after the animations (Goal text + scorer fade-in) are roughly done
    setTimeout(() => {
        container.style.display = 'none'; // Hide the whole container
        goalText.classList.remove('animate'); // Clean up classes (optional but good practice)
        scorerText.classList.remove('animate');
        // Confetti animation stops itself when particles are gone
    }, 4000); // Adjust time slightly longer than CSS animations (Goal anim is 2.5s, scorer starts after 0.5s)
}

// REMINDER: You need to update the place where showGoalAnimation is called
// to pass the scorer's name as the first argument.
// Example: showGoalAnimation(theScorerObject.name, scoringTeamColorsArray);