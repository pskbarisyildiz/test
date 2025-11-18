/**
 * Particle System
 * Handles visual effects particles for goals, passes, saves, and ball trails
 *
 * @migrated-from js/rendering/particles.js
 * ✅ Migrated from JavaScript with zero functional changes
 * ✅ Full type safety with strict TypeScript
 */

import type { GameState, Particle as ParticleInterface } from '../types';

// ============================================================================
// GLOBAL DECLARATIONS
// ============================================================================

declare global {
  interface Window {
    gameState: GameState;
    Particle?: typeof Particle;
    createGoalExplosion?: typeof createGoalExplosion;
    createBallTrail?: typeof createBallTrail;
    createPassEffect?: typeof createPassEffect;
    createSaveEffect?: typeof createSaveEffect;
  }
}

// ============================================================================
// PARTICLE CLASS
// ============================================================================

/**
 * Particle class for visual effects
 */
export class Particle implements ParticleInterface {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  decay: number;
  size: number;
  radius: number;
  alpha: number;
  type: string;
  rotation: number;
  gravity: number;
  createdAt: number;

  constructor(x: number, y: number, color: string, velocityX: number = 0, velocityY: number = 0) {
    this.x = x;
    this.y = y;
    this.vx = velocityX;
    this.vy = velocityY;
    this.color = color;
    this.life = 1.0;
    this.alpha = 1.0;
    this.decay = 0.02 + Math.random() * 0.02;
    this.size = 3 + Math.random() * 5;
    this.radius = this.size;
    this.type = 'default';
    this.rotation = 0;
    this.gravity = 300; // pixels/second^2
    this.createdAt = Date.now();
  }

  update(dt: number): void {
    // Apply velocity and gravity, scaled by delta time (seconds)
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy += this.gravity * dt;

    // FIX: Unify time scaling for all physics properties.
    // Both friction and decay are now consistently scaled by dt.
    const frameMultiplier = dt * 60; // Assumes a 60fps baseline for decay values
    this.vx *= Math.pow(0.98, frameMultiplier);
    this.life -= this.decay * frameMultiplier;
    this.alpha = this.life;
    this.size *= Math.pow(0.98, frameMultiplier);
    this.radius = this.size;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.life <= 0) return;

    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// ============================================================================
// PARTICLE EFFECT FUNCTIONS
// ============================================================================

/**
 * Create goal explosion effect
 */
export function createGoalExplosion(x: number, y: number, color: string): void {
  const particleCount = 80; // Increased from 60

  // Main explosion burst
  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount;
    const speed = 250 + Math.random() * 350; // Increased speed
    const velocityX = Math.cos(angle) * speed;
    const velocityY = Math.sin(angle) * speed - 250;

    const particle = new Particle(x, y, color, velocityX, velocityY);
    particle.size = 4 + Math.random() * 6; // Larger particles
    window.gameState.particles.push(particle);
  }

  // Secondary white burst
  for (let i = 0; i < 40; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 150 + Math.random() * 250;
    const velocityX = Math.cos(angle) * speed;
    const velocityY = Math.sin(angle) * speed - 150;

    const particle = new Particle(x, y, '#ffffff', velocityX, velocityY);
    particle.size = 3;
    window.gameState.particles.push(particle);
  }

  // Sparkle layer
  for (let i = 0; i < 30; i++) {
    const offsetX = (Math.random() - 0.5) * 120;
    const offsetY = (Math.random() - 0.5) * 120;
    const particle = new Particle(x + offsetX, y + offsetY, color, 0, -120);
    particle.decay = 0.03;
    particle.size = 4;
    window.gameState.particles.push(particle);
  }

  window.gameState.cameraShake = 12; // Reduced for shorter duration
}

/**
 * Create ball trail effect
 */
export function createBallTrail(x: number, y: number): void {
  // Enhanced ball trail with motion blur effect
  if (Math.random() < 0.5) { // More frequent trails
    const particle = new Particle(
      x + (Math.random() - 0.5) * 8,
      y + (Math.random() - 0.5) * 8,
      '#ffffff',
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    );
    // Make the particle fade out much slower for a longer trail
    particle.decay = 0.02; // Slower fade (was 0.08)
    particle.size = 3 + Math.random() * 2;
    window.gameState.particles.push(particle);
  }
}

/**
 * Create pass effect
 */
export function createPassEffect(x: number, y: number, color: string): void {
  for (let i = 0; i < 5; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 50 + Math.random() * 100;
    const velocityX = Math.cos(angle) * speed;
    const velocityY = Math.sin(angle) * speed;

    const particle = new Particle(x, y, color, velocityX, velocityY);
    particle.size = 2 + Math.random() * 3;
    particle.decay = 0.04;
    window.gameState.particles.push(particle);
  }
}

/**
 * Create save effect
 */
export function createSaveEffect(x: number, y: number): void {
  for (let i = 0; i < 15; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 100 + Math.random() * 200;
    const velocityX = Math.cos(angle) * speed;
    const velocityY = Math.sin(angle) * speed;

    const colors = ['#3b82f6', '#60a5fa', '#93c5fd'];
    const color = colors[Math.floor(Math.random() * colors.length)] || '#3b82f6';

    const particle = new Particle(x, y, color, velocityX, velocityY);
    particle.size = 3 + Math.random() * 4;
    particle.decay = 0.03;
    window.gameState.particles.push(particle);
  }
}

// ============================================================================
// BROWSER EXPORTS
// ============================================================================

if (typeof window !== 'undefined') {
  window.Particle = Particle;
  window.createGoalExplosion = createGoalExplosion;
  window.createBallTrail = createBallTrail;
  window.createPassEffect = createPassEffect;
  window.createSaveEffect = createSaveEffect;
}
