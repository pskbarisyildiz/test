/**
 * Behavioral Dynamics Engine
 * @migrated-from js/BehaviorSystem.js
 *
 * Comprehensive role-based player intelligence system implementing tactical
 * behaviors across all phases of play. Integrates with existing AI.
 */
import type { Player, Vector2D, GameState } from '../types';
/**
 * Behavior execution result with target position and metadata
 */
export interface BehaviorResultSuccess {
    available: true;
    target: Vector2D;
    speedMultiplier: number;
    description: string;
    shouldLock: boolean;
    error: null;
    duration?: number;
}
/**
 * Unavailable behavior result with reason
 */
export interface BehaviorResultUnavailable {
    available: false;
    target: null;
    speedMultiplier: number;
    description: string;
    shouldLock: false;
    error: string;
    duration?: number;
}
/**
 * Union type for behavior results
 */
export type BehaviorResultType = BehaviorResultSuccess | BehaviorResultUnavailable;
/**
 * Game phases for tactical behavior selection
 */
export type GamePhase = 'defensive' | 'attacking' | 'transition_attack' | 'transition_defense' | 'SET_PIECE';
/**
 * Tactical system types
 */
export type TacticalSystemType = 'possession' | 'high_press' | 'counter_attack' | 'low_block' | 'balanced';
/**
 * Helper object for creating consistent behavior results
 * ✅ FIX #9: CONSISTENT BEHAVIOR RESULT TYPE
 */
export declare const BehaviorResult: {
    /**
     * Create successful behavior result
     */
    success(target: Vector2D, speedMultiplier?: number, description?: string, shouldLock?: boolean): BehaviorResultSuccess;
    /**
     * Create unavailable behavior result with reason
     */
    unavailable(reason?: string): BehaviorResultUnavailable;
    /**
     * Check if result is valid and available
     */
    isValid(result: BehaviorResultType | null): result is BehaviorResultSuccess;
};
export declare const PHASES: {
    DEFENSIVE: "defensive";
    ATTACKING: "attacking";
    TRANSITION_TO_ATTACK: "transition_attack";
    TRANSITION_TO_DEFENSE: "transition_defense";
};
export declare const GoalkeeperBehaviors: {
    /**
     * Sweeper-keeper: Actively defend space behind high defensive line
     */
    sweeperKeeping(_gk: Player, ball: Vector2D, teammates: Player[], opponents: Player[], ownGoalX: number): BehaviorResultSuccess | null;
    /**
     * Build-up play: GK as first attacker providing +1 option
     */
    buildUpSupport(_gk: Player, holder: Player | null, _teammates: Player[], ownGoalX: number): BehaviorResultSuccess | null;
    /**
     * Positioning for shot-stopping: Narrow the angle
     */
    angleNarrowing(_gk: Player, ball: Vector2D, _shooter: Player | null, ownGoalX: number): BehaviorResultSuccess;
};
export declare const DefensiveBehaviors: {
    /**
     * Collective line movement: Ball-oriented shifting
     */
    defensiveLineShift(player: Player, ball: Vector2D, teammates: Player[], ownGoalX: number): BehaviorResultSuccess | null;
    /**
     * Full-back covering: Prevent crosses and track wide threats
     */
    fullBackCovering(fb: Player, _ball: Vector2D, opponents: Player[], _ownGoalX: number): BehaviorResultSuccess | null;
    /**
     * Center-back covering and marking
     */
    centerBackMarking(cb: Player, opponents: Player[], _teammates: Player[], ownGoalX: number): BehaviorResultSuccess | null;
    /**
     * Inverted full-back: Move into central midfield during possession
     */
    invertedFullBack(fb: Player, holder: Player | null, teammates: Player[], ownGoalX: number): BehaviorResultSuccess | null;
};
export declare const MidfieldBehaviors: {
    /**
     * Defensive midfielder screening the defense
     */
    cdmScreening(cdm: Player, ball: Vector2D, _opponents: Player[], teammates: Player[], _ownGoalX: number): BehaviorResultSuccess | null;
    /**
     * Box-to-box midfielder: Late runs into penalty area
     */
    boxToBoxLateRun(cm: Player, ball: Vector2D, holder: Player | null, teammates: Player[], opponentGoalX: number): BehaviorResultSuccess | null;
    /**
     * Regista/Deep-lying playmaker: Dictate tempo from deep
     */
    registaTempoDictation(cm: Player, holder: Player | null, _teammates: Player[], ownGoalX: number): BehaviorResultSuccess | null;
    /**
     * Attacking midfielder: Find pockets between the lines
     */
    camBetweenLines(cam: Player, opponents: Player[], opponentGoalX: number): BehaviorResultSuccess | null;
    /**
     * Central midfielder pressing trigger
     */
    cmPressTrigger(cm: Player, _ball: Vector2D, _opponents: Player[], holder: Player | null): BehaviorResultSuccess | null;
};
export declare const ForwardBehaviors: {
    /**
     * Winger: Stretch defense by staying wide
     */
    wingerWidthProviding(winger: Player, holder: Player | null, _teammates: Player[]): BehaviorResultSuccess | null;
    /**
     * Inverted winger: Cut inside to shoot
     */
    invertedWingerCutInside(winger: Player, _ball: Vector2D, opponentGoalX: number): BehaviorResultSuccess | null;
    /**
     * Striker: Runs in behind defense
     */
    strikerRunsInBehind(striker: Player, holder: Player | null, opponents: Player[], opponentGoalX: number): BehaviorResultSuccess | null;
    /**
     * False 9: Drop deep to create space
     */
    false9DropDeep(striker: Player, holder: Player | null, teammates: Player[], opponentGoalX: number): BehaviorResultSuccess | null;
    /**
     * Target striker: Hold up play
     */
    targetStrikerHoldUp(striker: Player, _ball: Vector2D, opponents: Player[]): BehaviorResultSuccess | null;
    /**
     * Striker pressing: Lead the press against center-backs
     */
    strikerPressingTrigger(striker: Player, opponents: Player[], ball: Vector2D, ownGoalX: number): BehaviorResultSuccess | null;
};
export declare const TransitionBehaviors: {
    /**
     * Counter-attack: Explosive forward runs
     */
    counterAttackRun(player: Player, _ball: Vector2D, opponentGoalX: number, justWonPossession: boolean): BehaviorResultSuccess | null;
    /**
     * Counter-press (Gegenpressing): Immediate pressure after losing ball
     */
    counterPress(player: Player, ball: Vector2D, justLostPossession: boolean, _opponentGoalX: number): BehaviorResultSuccess | null;
    /**
     * Recovery runs: Sprint back to defensive shape
     */
    recoveryRun(player: Player, ball: Vector2D, ownGoalX: number, justLostPossession: boolean): BehaviorResultSuccess | null;
};
export declare const TacticalSystemModifiers: {
    /**
     * Possession-based: Constant movement for passing options
     */
    possessionSystem(player: Player, holder: Player | null, teammates: Player[]): BehaviorResultSuccess | null;
    /**
     * High-press: Compressed formation in opponent's half
     */
    highPressSystem(player: Player, _ball: Vector2D, _teammates: Player[], opponentGoalX: number): BehaviorResultSuccess | null;
    /**
     * Low-block: Deep defensive shape
     */
    lowBlockSystem(player: Player, ownGoalX: number, _teammates: Player[]): BehaviorResultSuccess | null;
};
/**
 * Main function to select the best behavior for a player based on game phase
 * and tactical context. Integrates with existing AI system.
 */
export declare function selectPlayerBehavior(player: Player, gameState: GameState, phase: GamePhase, tacticalSystem?: TacticalSystemType): BehaviorResultSuccess | null;
/**
 * Detect current game phase based on possession and timing
 */
export declare function detectGamePhase(gameState: GameState): GamePhase;
/**
 * Map tactic names to system types
 */
export declare function getTacticalSystemType(tacticName?: string): TacticalSystemType;
//# sourceMappingURL=system.d.ts.map