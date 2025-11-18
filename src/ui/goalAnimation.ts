import { gameState } from '../globalExports';

let confettiParticles: ConfettiParticle[] = [];
const gravity = 0.4;
let confettiAnimationId: number | null = null;

class ConfettiParticle {
    x: number;
    y: number;
    color: string;
    size: number;
    vx: number;
    vy: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;

    constructor(x: number, y: number, color: string) {
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
        if (gameState && gameState.canvases && gameState.canvases.ui && this.y > gameState.canvases.ui.height + this.size) {
            this.opacity = 0;
        } else if (this.opacity > 0) {
            // this.opacity -= 0.005;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.opacity <= 0) return;

        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 1.5);
        ctx.restore();
    }
}

function createConfetti(colors: string[]) {
    if (!gameState || !gameState.canvases || !gameState.canvases.ui) {
        console.error("Confetti creation failed: UI canvas not ready.");
        return;
    }
    if (colors.length === 0) {
        return;
    }
    const uiCanvas = gameState.canvases.ui;
    confettiParticles = [];
    const amount = 250;

    for (let i = 0; i < amount; i++) {
        const x = Math.random() * uiCanvas.width;
        const y = Math.random() * uiCanvas.height * 0.5 - 50;
        const color = colors[Math.floor(Math.random() * colors.length)];
        if (color) {
            confettiParticles.push(new ConfettiParticle(x, y, color));
        }
    }
}

function animateConfetti() {
    if (!gameState || !gameState.contexts || !gameState.contexts.ui) {
        console.error("Confetti animation failed: UI context not ready.");
        if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
        confettiAnimationId = null;
        return;
    }
    const uiCtx = gameState.contexts.ui;

    uiCtx.clearRect(0, 0, uiCtx.canvas.width, uiCtx.canvas.height);

    confettiParticles.forEach(p => {
        p.update();
        p.draw(uiCtx);
    });

    confettiParticles = confettiParticles.filter(p => p.opacity > 0);

    if (confettiParticles.length > 0) {
        confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
        uiCtx.clearRect(0, 0, uiCtx.canvas.width, uiCtx.canvas.height);
        confettiAnimationId = null;
    }
}

export function showGoalAnimation(scorerName: string, teamColors: string[]): void {
    const container = document.getElementById('goal-animation-container');
    const goalText = document.getElementById('goal-text');
    const scorerText = document.getElementById('scorer-name');

    if (!container || !goalText || !scorerText) {
        console.error("Goal animation elements not found!");
        return;
    }

    const color1 = (teamColors && teamColors.length > 0 && teamColors[0]) ? teamColors[0] : '#ff4500';
    const color2 = (teamColors && teamColors.length > 1 && teamColors[1]) ? teamColors[1] : '#ffd700';

    goalText.style.setProperty('--color1', color1);
    goalText.style.setProperty('--color2', color2);

    scorerText.textContent = scorerName || '';

    container.style.display = 'flex';
    goalText.classList.remove('animate');
    scorerText.classList.remove('animate');

    void goalText.offsetWidth;

    goalText.classList.add('animate');
    scorerText.classList.add('animate');

    if (confettiAnimationId) {
        cancelAnimationFrame(confettiAnimationId);
        confettiAnimationId = null;
    }
    createConfetti([color1, color2, '#ffffff']);
    animateConfetti();

    setTimeout(() => {
        container.style.display = 'none';
        goalText.classList.remove('animate');
        scorerText.classList.remove('animate');
    }, 4000);
}
