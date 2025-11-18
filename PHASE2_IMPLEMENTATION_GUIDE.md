# Phase 2 Implementation Guide

## 📋 Overview

This guide provides the **exact pattern and approach** to complete the TypeScript migration for Phase 2 and beyond. Follow these patterns to migrate the remaining JavaScript files.

---

## ✅ Completed Migration Pattern (Physics Example)

### Before (JavaScript - `js/physics.js`)
```javascript
function updatePhysics(dt) {
    validateBallState();
    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    updateBallTrajectory(dt);
    updatePlayerPhysics(allPlayers, dt);
}
```

### After (TypeScript - `src/physics.ts`)
```typescript
import type { Player, GameState } from './types';
import { safeSqrt, safeDiv } from './utils/math';
import { isSetPieceStatus } from './types';

export function updatePhysics(dt: number): void {
  validateBallState();
  const allPlayers = [...window.gameState.homePlayers, ...window.gameState.awayPlayers];
  updateBallTrajectory(dt);
  updatePlayerPhysics(allPlayers, dt);
}
```

**Key Changes:**
1. ✅ Import types from `./types`
2. ✅ Import utilities from `./utils/*`
3. ✅ Add explicit type annotations (`: number`, `: void`, etc.)
4. ✅ Use `window.gameState` instead of global `gameState`
5. ✅ Export functions with `export`
6. ✅ Add JSDoc comments for complex functions
7. ✅ Replace global config checks with typed access

---

## 🔧 Step-by-Step Migration Pattern

### Step 1: Create Type Definitions (if needed)

```typescript
// src/types/yourModule.ts
export interface YourModuleState {
  readonly property1: string;
  property2: number;
}
```

### Step 2: Create TypeScript File with Imports

```typescript
// src/yourModule.ts

/**
 * Your Module Description
 * Brief description of what this module does
 */

import type { Player, GameState } from './types';
import { distance, clamp } from './utils/math';

// Global declarations for browser compatibility
declare global {
  interface Window {
    yourFunction: typeof yourFunction;
    gameState: GameState;
  }
}
```

### Step 3: Convert Functions with Type Annotations

**JavaScript:**
```javascript
function calculateSomething(player, value) {
    return player.attribute * value;
}
```

**TypeScript:**
```typescript
export function calculateSomething(player: Player, value: number): number {
  return player.attribute * value;
}
```

### Step 4: Handle Global Variables Safely

**JavaScript:**
```javascript
const config = GAME_CONFIG.SOME_VALUE || 100;
```

**TypeScript:**
```typescript
const config = window.GAME_CONFIG?.SOME_VALUE ?? 100;
```

### Step 5: Export to Window for Backward Compatibility

```typescript
// At end of file
if (typeof window !== 'undefined') {
  window.yourFunction = yourFunction;
  console.log('✅ Your Module loaded (TypeScript)');
}
```

---

## 📝 Migration Checklist for Each File

When migrating a new file, follow this checklist:

- [ ] Create TypeScript file in `src/` (matching structure)
- [ ] Add file header comment with description
- [ ] Import necessary types from `./types`
- [ ] Import utilities from `./utils/*`
- [ ] Add `declare global` block for window exports
- [ ] Convert all functions to add type annotations
  - [ ] Parameter types (`: Player`, `: number`, etc.)
  - [ ] Return types (`: void`, `: boolean`, etc.)
- [ ] Replace global variables with `window.*` access
- [ ] Use safe math utilities (`: safeSqrt`, `safeDiv`, etc.)
- [ ] Add JSDoc comments for complex functions
- [ ] Export functions that need to be accessible
- [ ] Add window exports at end of file
- [ ] Test compilation (`npm run type-check`)

---

## 🎯 File-by-File Migration Plan

### Priority 1: Rules Systems

#### `src/rules/offside.ts`
```typescript
import type { Player, Vector2D } from '../types';
import { distance as getDistance } from '../utils/math';

interface OffsideTracker {
  lastPassTime: number;
  playersOffsideWhenBallPlayed: Set<string>;
  lastPassingTeam: 'home' | 'away' | null;
}

const offsideTracker: OffsideTracker = {
  lastPassTime: 0,
  playersOffsideWhenBallPlayed: new Set(),
  lastPassingTeam: null
};

export function isPlayerInOffsidePosition(
  player: Player,
  ball: Vector2D,
  opponents: Player[]
): boolean {
  // Implementation...
}

export function recordOffsidePositions(
  passingPlayer: Player,
  allPlayers: Player[]
): void {
  // Implementation...
}

export function checkOffsidePenalty(player: Player): boolean {
  return offsideTracker.playersOffsideWhenBallPlayed.has(player.id);
}

// Global exports
if (typeof window !== 'undefined') {
  window.isPlayerInOffsidePosition = isPlayerInOffsidePosition;
  window.recordOffsidePositions = recordOffsidePositions;
  window.checkOffsidePenalty = checkOffsidePenalty;
}
```

#### `src/rules/ballControl.ts`
```typescript
import type { Player } from '../types';
import { distance as getDistance } from '../utils/math';
import { isSetPieceStatus } from '../types';

export function resolveBallControl(allPlayers: Player[]): void {
  const isSetPiece = isSetPieceStatus(window.gameState.status);
  if (isSetPiece) return;

  // Implementation...
}

export function canControlBall(player: Player, ball: Vector2D): boolean {
  const BALL_CONTROL_DISTANCE = window.PHYSICS?.BALL_CONTROL_DISTANCE ?? 25;
  const dist = getDistance(player, ball);
  return dist < BALL_CONTROL_DISTANCE && !window.gameState.ballTrajectory;
}

// Global exports
if (typeof window !== 'undefined') {
  window.resolveBallControl = resolveBallControl;
  window.canControlBall = canControlBall;
}
```

---

### Priority 2: AI Systems

#### `src/ai/decisions.ts`
- Convert AI decision logic
- Type all player evaluations
- Use safe math for calculations

#### `src/ai/movement.ts`
- Convert movement AI
- Type movement patterns
- Use vector math utilities

#### `src/ai/goalkeeper.ts`
- Convert goalkeeper AI
- Type goalkeeper states
- Safe positioning calculations

---

### Priority 3: Behavior & Set Pieces

#### `src/BehaviorSystem.ts`
- Convert behavior tree nodes
- Type behavior states
- Safe priority calculations

#### `src/setpieces/*.ts`
- Convert each set piece type
- Type set piece configurations
- Safe positioning and timing

---

### Priority 4: Rendering

#### `src/rendering/*.ts`
- Convert canvas rendering
- Type canvas contexts
- Safe drawing calculations

---

### Priority 5: UI

#### `src/ui/*.ts`
- Convert UI components
- Type UI state
- Safe DOM manipulation

---

### Priority 6: Core Game Loop

#### `src/core.ts`
- Convert main game loop
- Type game states
- Integrate all systems

#### `src/main.ts`
- Convert entry point
- Type initialization
- Wire up event handlers

---

## 🛠️ Common Patterns

### Pattern 1: Safe Config Access

**Before:**
```javascript
const speed = PHYSICS.MAX_SPEED || 152;
```

**After:**
```typescript
const speed = window.PHYSICS?.MAX_SPEED ?? 152;
```

### Pattern 2: Type Guards

```typescript
function isPlayer(obj: unknown): obj is Player {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'x' in obj &&
    'y' in obj
  );
}
```

### Pattern 3: Safe Array Access

**Before:**
```javascript
const first = array[0];
```

**After:**
```typescript
const first = array[0];  // Type: Player | undefined
if (first) {
  // Safe to use first
}
```

### Pattern 4: Event Handlers with Types

```typescript
type EventHandler = (data: GoalEventPayload) => void;

const handler: EventHandler = (data) => {
  console.log(`Goal by ${data.scorer.name}!`);
};
```

---

## 🧪 Testing Strategy

### 1. Type Check After Each File
```bash
npm run type-check
```

### 2. Build and Verify Bundle
```bash
npm run build
```

### 3. Check Bundle Size
```bash
ls -lh dist/bundle.js
```

### 4. Verify in Browser
- Load `dist/bundle.js` in HTML
- Check browser console for errors
- Verify game functionality

---

## 📦 Build Configuration

### Add New Files to Build

Edit `src/index.ts`:
```typescript
// Phase 2: Core Systems
export * from './physics';
export * from './rules/offside';
export * from './rules/ballControl';

// Phase 3: AI
export * from './ai/decisions';
export * from './ai/movement';
export * from './ai/goalkeeper';
```

---

## 🚀 Quick Start for Next File

1. **Create file:**
   ```bash
   touch src/yourModule.ts
   ```

2. **Copy template:**
   ```typescript
   /**
    * Your Module
    * Description
    */

   import type { Player, GameState } from './types';

   declare global {
     interface Window {
       yourFunction: typeof yourFunction;
     }
   }

   export function yourFunction(param: Type): ReturnType {
     // Implementation
   }

   if (typeof window !== 'undefined') {
     window.yourFunction = yourFunction;
     console.log('✅ Your Module loaded (TypeScript)');
   }
   ```

3. **Type check:**
   ```bash
   npm run type-check
   ```

4. **Build:**
   ```bash
   npm run build
   ```

---

## 📊 Progress Tracking

### Phase 1: ✅ Complete
- Types (1000+ LOC)
- Config (600+ LOC)
- Utils (450+ LOC)
- Event Bus (300+ LOC)
- Build System

### Phase 2: 🚧 In Progress
- ✅ Physics (500+ LOC)
- ⏳ Rules (Offside, Ball Control)
- ⏳ AI Systems
- ⏳ Behavior Systems

### Phase 3: ⏳ Remaining
- Set Pieces
- Rendering
- UI
- Core
- Main

---

## 💡 Pro Tips

1. **One file at a time** - Don't try to migrate everything at once
2. **Type check frequently** - Catch errors early
3. **Keep original JS** - Don't delete until migration complete
4. **Test in browser** - Verify functionality, not just types
5. **Document changes** - Add comments for complex type decisions
6. **Use strict types** - Avoid `any`, use `unknown` instead
7. **Leverage IntelliSense** - Let TypeScript guide you

---

## 🎯 Success Criteria

For each migrated file:
- ✅ Zero TypeScript errors
- ✅ All functions have type annotations
- ✅ No use of `any` type
- ✅ Proper imports from type system
- ✅ Global exports for browser compatibility
- ✅ JSDoc comments for complex logic
- ✅ Safe math utilities used
- ✅ Compiles successfully
- ✅ Works in browser

---

**Last Updated:** 2025-11-15
**TypeScript Version:** 5.3+
**Status:** Phase 2 in progress

Follow this guide to complete the migration! 🚀
