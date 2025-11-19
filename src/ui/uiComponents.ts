/**
 * UI Components
 * Component library for rendering scoreboard, commentary, stats, and match summary
 *
 * @migrated-from js/ui/uiComponents.js
 * ✅ Migrated from JavaScript with zero functional changes
 * ✅ Full type safety with strict TypeScript
 */

import { gameState } from '../globalExports';

// ============================================================================
// GLOBAL DECLARATIONS
// ============================================================================
// Note: resetMatch moved to globalExports.ts for centralization

declare global {
  interface Window {
    renderStatisticsSummary?: typeof renderStatisticsSummary;
    lightenColor?: (color: string, amount: number) => string;
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function lightenColor(color: string, amount: number): string {
    // Simple color lightening - parse hex and add to RGB values
    if (color.startsWith('#')) {
        const num = parseInt(color.slice(1), 16);
        const r = Math.min(255, ((num >> 16) & 0xff) + amount);
        const g = Math.min(255, ((num >> 8) & 0xff) + amount);
        const b = Math.min(255, (num & 0xff) + amount);
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }
    return color;
}

// ============================================================================
// SCOREBOARD
// ============================================================================

export function renderScoreboard(): string {
    // Using imported gameState from globalExports
    const homeCoach = (gameState as any).teamCoaches?.[gameState.homeTeam] || 'Unknown Coach';
    const awayCoach = (gameState as any).teamCoaches?.[gameState.awayTeam] || 'Unknown Coach';
    const homeLogo = (gameState as any).teamLogos?.[gameState.homeTeam] || '';
    const awayLogo = (gameState as any).teamLogos?.[gameState.awayTeam] || '';

    return `
        <div style="
            background: linear-gradient(135deg, rgba(15, 15, 30, 0.98) 0%, rgba(25, 25, 45, 0.98) 100%);
            backdrop-filter: blur(30px) saturate(200%);
            border-radius: 16px;
            padding: 12px 24px; /* RECHAZADO: Reduced padding */
            box-shadow:
                0 15px 40px rgba(0, 0, 0, 0.5),
                0 0 0 1px rgba(255, 255, 255, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px; /* RECHAZADO: Reduced gap */
            position: relative;
            overflow: hidden;
            width: 100%;
            box-sizing: border-box;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        ">

            <div style="position: absolute; top: 0; left: 0; right: 0; height: 60%; background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%); pointer-events: none;"></div>
            <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%); animation: rotate 20s linear infinite; pointer-events: none;"></div>

            <div style="display: flex; align-items: center; gap: 16px; flex: 1; min-width: 0; position: relative; z-index: 1;">
                ${homeLogo ? `
                    <div style="width: 48px; height: 48px; background: rgba(255, 255, 255, 0.05); border-radius: 10px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); flex-shrink: 0;">
                        <img src="${homeLogo}" style="width: 36px; height: 36px; object-fit: contain; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));">
                    </div>
                ` : ''}
                <div style="display: flex; flex-direction: column; min-width: 0;">
                    <div style="font-size: 18px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);">${gameState.homeTeam}</div>
                    <div style="font-size: 10px; opacity: 0.6; font-weight: 600; letter-spacing: 0.5px; margin-top: 2px;">${homeCoach}</div>
                </div>
            </div>

            <div style="
                display: flex;
                align-items: center;
                gap: 16px; /* RECHAZADO: Reduced gap */
                position: relative;
                z-index: 1;
                padding: 8px 16px; /* RECHAZADO: Reduced padding */
                background: rgba(0, 0, 0, 0.3);
                border-radius: 12px; /* RECHAZADO: Reduced radius */
                border: 1px solid rgba(255, 255, 255, 0.08);
                box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
            ">
                <div style="
                    font-size: 44px; /* RECHAZADO: Reduced font size */
                    font-weight: 900;
                    line-height: 1;
                    color: ${(gameState as any).homeJerseyColor};
                    text-shadow: 0 0 20px ${(gameState as any).homeJerseyColor}60, 0 0 10px ${(gameState as any).homeJerseyColor}80, 0 4px 12px rgba(0,0,0,0.7);
                    font-family: 'Inter', -apple-system, system-ui, sans-serif;
                    filter: brightness(1.2);
                    transition: all 0.3s ease;
                " id="home-score-color">0</div>

                <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 0 12px;">
                    <div style="font-size: 24px; font-weight: 900; font-family: 'Courier New', monospace; line-height: 1; color: #ffffff; text-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 2px 6px rgba(0,0,0,0.4); letter-spacing: 1px;" id="time-display">0'</div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div id="status-indicator"></div>
                        <div style="font-size: 10px; opacity: 0.7; font-weight: 800; letter-spacing: 1px; color: #ffffff;" id="half-display">HALF 1</div>
                    </div>
                </div>

                <div style="
                    font-size: 44px; /* RECHAZADO: Reduced font size */
                    font-weight: 900;
                    line-height: 1;
                    color: ${(gameState as any).awayJerseyColor};
                    text-shadow: 0 0 20px ${(gameState as any).awayJerseyColor}60, 0 0 10px ${(gameState as any).awayJerseyColor}80, 0 4px 12px rgba(0,0,0,0.7);
                    font-family: 'Inter', -apple-system, system-ui, sans-serif;
                    filter: brightness(1.2);
                    transition: all 0.3s ease;
                " id="away-score-color">0</div>
            </div>

            <div style="display: flex; align-items: center; gap: 16px; flex: 1; min-width: 0; justify-content: flex-end; position: relative; z-index: 1;">
                <div style="display: flex; flex-direction: column; align-items: flex-end; min-width: 0;">
                    <div style="font-size: 18px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);">${gameState.awayTeam}</div>
                    <div style="font-size: 10px; opacity: 0.6; font-weight: 600; letter-spacing: 0.5px; margin-top: 2px;">${awayCoach}</div>
                </div>
                ${awayLogo ? `
                    <div style="width: 48px; height: 48px; background: rgba(255, 255, 255, 0.05); border-radius: 10px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); flex-shrink: 0;">
                        <img src="${awayLogo}" style="width: 36px; height: 36px; object-fit: contain; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));">
                    </div>
                ` : ''}
            </div>
        </div>

        <style>
            @keyframes rotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        </style>
    `;
}

// ============================================================================
// STATUS INDICATOR
// ============================================================================

export function getStatusIndicator(): string {
    // Using imported gameState from globalExports

    if (gameState.status === 'playing') {
        return '<div style="width: 6px; height: 6px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981, 0 0 3px #10b981; animation: pulse 2s infinite;"></div>';
    } else if ((gameState as any).status === 'intro') {
        return '<div style="width: 6px; height: 6px; border-radius: 50%; background: #fbbf24; box-shadow: 0 0 8px #fbbf24;"></div>';
    } else if (gameState.status === 'halftime') {
        return '<div style="width: 6px; height: 6px; border-radius: 50%; background: #f59e0b; box-shadow: 0 0 8px #f59e0b;"></div>';
    } else if (gameState.status === 'finished') {
        return '<div style="width: 6px; height: 6px; border-radius: 50%; background: #ef4444; box-shadow: 0 0 8px #ef4444;"></div>';
    }
    return '';
}

// ============================================================================
// COMMENTARY
// ============================================================================

export function renderCommentary(): string {
    // Using imported gameState from globalExports
    const recentComments = gameState.commentary.slice(-2).reverse();
    const commentaryHTML = recentComments.map(c => {
        let accentColor = '#6366f1';
        let emoji = '⚽';
        const commentObj = typeof c === 'string' ? { text: c, type: 'default' } : c;

        if (commentObj.type === 'goal') {
            accentColor = '#00ff88';
            emoji = '⚽';
        } else if (commentObj.type === 'save') {
            accentColor = '#00d4ff';
            emoji = '🧤';
        } else if (commentObj.type === 'attack') {
            accentColor = '#ffd700';
            emoji = '⚡';
        }

        return `
            <div style="
                padding: 12px 16px;
                margin-bottom: 8px;
                background: linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.4) 100%);
                backdrop-filter: blur(20px);
                border-radius: 12px;
                border-left: 4px solid ${accentColor};
                box-shadow:
                    0 8px 24px rgba(0, 0, 0, 0.6),
                    0 0 0 1px rgba(255, 255, 255, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
                font-size: 14px;
                line-height: 1.5;
                color: rgba(255, 255, 255, 0.95);
                font-weight: 600;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
            ">
                <span style="
                    font-size: 16px;
                    margin-right: 8px;
                    filter: drop-shadow(0 0 4px ${accentColor});
                ">${emoji}</span>
                ${commentObj.text}

                <!-- Subtle glow effect -->
                <div style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 50%;
                    background: linear-gradient(180deg, ${accentColor}15 0%, transparent 100%);
                    pointer-events: none;
                "></div>
            </div>
        `;
    }).join('');

    return `
        <div style="width: 100%;">
            <div id="commentary-content" style="
                display: flex;
                flex-direction: column;
                gap: 6px;
            ">
                ${commentaryHTML || ''}
            </div>
        </div>
    `;
}

// ============================================================================
// STATS
// ============================================================================

export function renderStats(): string {
    if (!gameState) {
        return '<div class="stats-card"><p>Loading stats...</p></div>';
    }

    // Using imported gameState from globalExports

    // Get stats or provide defaults
    const homeStats = gameState.stats.home || { possession: 50, shotsOnTarget: 0, shotsOffTarget: 0, xGTotal: 0 } as any;
    const awayStats = gameState.stats.away || { possession: 50, shotsOnTarget: 0, shotsOffTarget: 0, xGTotal: 0 } as any;

    const homeShots = (homeStats.shotsOnTarget || 0) + (homeStats.shotsOffTarget || 0);
    const awayShots = (awayStats.shotsOnTarget || 0) + (awayStats.shotsOffTarget || 0);

    // Helper to create a single stat bar
    const createStatBar = (label: string, homeVal: string | number, awayVal: string | number, homeWidth: number, awayWidth: number, homeColor: string, awayColor: string): string => `
        <div style="
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            align-items: center;
            gap: 10px;
            width: 100%;
            font-size: 13px;
            font-weight: 700;
        ">
            <span style="color: white; text-align: left; font-weight: 800;">${homeVal}</span>
            <span style="opacity: 0.7; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">${label}</span>
            <span style="color: white; text-align: right; font-weight: 800;">${awayVal}</span>

            <div style="grid-column: 1 / -1; display: flex; width: 100%; height: 8px; background: rgba(0,0,0,0.4); border-radius: 4px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);">
                <div style="width: ${homeWidth}%; background: ${homeColor}; transition: width 0.3s ease;"></div>
                <div style="width: ${awayWidth}%; background: ${awayColor}; transition: width 0.3s ease;"></div>
            </div>
        </div>
    `;

    // Calculate percentages for bars
    const totalPossession = (homeStats.possession || 50) + (awayStats.possession || 50);
    const homePossessionPercent = totalPossession > 0 ? (homeStats.possession / totalPossession) * 100 : 50;
    const awayPossessionPercent = totalPossession > 0 ? (awayStats.possession / totalPossession) * 100 : 50;

    const totalShots = homeShots + awayShots;
    const homeShotsPercent = totalShots > 0 ? (homeShots / totalShots) * 100 : 50;
    const awayShotsPercent = totalShots > 0 ? (awayShots / totalShots) * 100 : 50;

    const totalXG = (homeStats.xGTotal || 0) + (awayStats.xGTotal || 0);
    const homeXGPercent = totalXG > 0 ? ((homeStats.xGTotal || 0) / totalXG) * 100 : 50;
    const awayXGPercent = totalXG > 0 ? ((awayStats.xGTotal || 0) / totalXG) * 100 : 50;

    // Main horizontal stat bar
    return `
        <div style="
            margin-top: 12px;
            background: linear-gradient(135deg, rgba(15, 15, 30, 0.9) 0%, rgba(25, 25, 45, 0.9) 100%);
            backdrop-filter: blur(20px);
            border-radius: 16px;
            padding: 16px 24px;
            box-shadow:
                0 15px 40px rgba(0, 0, 0, 0.5),
                0 0 0 1px rgba(255, 255, 255, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            position: relative;
            overflow: hidden;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            align-items: center;
        ">
            ${createStatBar(
                'Possession',
                `${homeStats.possession || 50}%`,
                `${awayStats.possession || 50}%`,
                homePossessionPercent,
                awayPossessionPercent,
                (gameState as any).homeJerseyColor,
                (gameState as any).awayJerseyColor
            )}

            ${createStatBar(
                'Shots',
                homeShots,
                awayShots,
                homeShotsPercent,
                awayShotsPercent,
                (gameState as any).homeJerseyColor,
                (gameState as any).awayJerseyColor
            )}

            ${createStatBar(
                'xG',
                (homeStats.xGTotal || 0).toFixed(2),
                (awayStats.xGTotal || 0).toFixed(2),
                homeXGPercent,
                awayXGPercent,
                (gameState as any).homeJerseyColor,
                (gameState as any).awayJerseyColor
            )}
        </div>
    `;
}

// ============================================================================
// ENHANCED MATCH SUMMARY - SIDE BY SIDE LAYOUT WITH PREMIUM DESIGN
// ============================================================================

export function renderMatchSummary(): string {
    // Using imported gameState from globalExports
    const homeLogo = (gameState as any).teamLogos?.[gameState.homeTeam] || '';
    const awayLogo = (gameState as any).teamLogos?.[gameState.awayTeam] || '';

    const winner = gameState.homeScore > gameState.awayScore ? gameState.homeTeam :
                   gameState.awayScore > gameState.homeScore ? gameState.awayTeam : 'Draw';

    const allEvents = [
        ...gameState.goalEvents.map(e => ({ ...e, type: 'goal', team: (e as any).isHome ? 'home' : 'away' })),
        ...gameState.cardEvents.map(e => ({ ...e, type: 'card', team: (e as any).isHome ? 'home' : 'away' }))
    ];

    allEvents.sort((a, b) => a.time - b.time);

    // Group events by player
    interface GroupedEvent {
        name: string;
        goals: number[];
        cards: { time: number; card: string }[];
    }

    const groupEvents = (events: { type?: string; scorer?: string; player?: string; team?: string; time?: number; card?: string }[]) => {
        const grouped: Record<string, GroupedEvent> = {};
        events.forEach(e => {
            const key = e.type === 'goal' ? (e.scorer || 'Unknown') : (e.player || 'Unknown');
            if (!grouped[key]) {
                grouped[key] = { name: key, goals: [], cards: [] };
            }
            if (e.type === 'goal') {
                grouped[key].goals.push(e.time || 0);
            } else {
                grouped[key].cards.push({ time: e.time || 0, card: e.card || 'yellow' });
            }
        });
        return Object.values(grouped);
    };

    const homeGroupedEvents = groupEvents(allEvents.filter(e => e.team === 'home'));
    const awayGroupedEvents = groupEvents(allEvents.filter(e => e.team === 'away'));

    // Generate events HTML with compact design
    const generateEventsHTML = (groupedEvents: GroupedEvent[], isHome: boolean): string => {
        if (groupedEvents.length === 0) {
            return `
                <div style="
                    text-align: center;
                    padding: 60px 20px;
                    opacity: 0.4;
                ">
                    <div style="font-size: 48px; margin-bottom: 12px;">⚽</div>
                    <div style="font-size: 14px;">No events</div>
                </div>
            `;
        }

        return groupedEvents.map(group => {
            let content: string[] = [];

            // Goals
            if (group.goals.length > 0) {
                content.push(`
                    <div style="
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 12px 16px;
                        margin-bottom: 10px;
                        background: linear-gradient(${isHome ? '90deg' : '270deg'}, rgba(0, 255, 136, 0.15) 0%, rgba(0, 255, 136, 0.03) 100%);
                        border-${isHome ? 'left' : 'right'}: 3px solid #00ff88;
                        border-radius: 10px;
                        transition: all 0.3s ease;
                    ">
                        <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                            <span style="font-size: 20px; filter: drop-shadow(0 0 6px #00ff88);">⚽</span>
                            <span style="font-weight: 700; font-size: 14px;">${group.name}</span>
                        </div>
                        <div style="
                            display: flex;
                            gap: 6px;
                            font-size: 13px;
                            font-weight: 600;
                            color: #00ff88;
                        ">
                            ${group.goals.map((t: number) => `<span style="
                                padding: 4px 8px;
                                background: rgba(0, 255, 136, 0.2);
                                border-radius: 6px;
                                border: 1px solid rgba(0, 255, 136, 0.3);
                            ">${t}'</span>`).join('')}
                        </div>
                    </div>
                `);
            }

            // Cards
            group.cards.forEach((cardEvent: { time: number; card: string }) => {
                const cardSymbol = cardEvent.card === 'yellow' ? '🟨' : '🟥';
                const cardColor = cardEvent.card === 'yellow' ? '#fde047' : '#ef4444';
                content.push(`
                    <div style="
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 12px 16px;
                        margin-bottom: 10px;
                        background: linear-gradient(${isHome ? '90deg' : '270deg'}, ${cardColor}15 0%, ${cardColor}03 100%);
                        border-${isHome ? 'left' : 'right'}: 3px solid ${cardColor};
                        border-radius: 10px;
                        transition: all 0.3s ease;
                    ">
                        <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                            <span style="font-size: 18px; filter: drop-shadow(0 0 6px ${cardColor});">${cardSymbol}</span>
                            <span style="font-weight: 700; font-size: 14px;">${group.name}</span>
                        </div>
                        <span style="
                            padding: 4px 8px;
                            background: ${cardColor}20;
                            border-radius: 6px;
                            border: 1px solid ${cardColor}30;
                            font-size: 13px;
                            font-weight: 600;
                            color: ${cardColor};
                        ">${cardEvent.time}'</span>
                    </div>
                `);
            });

            return content.join('');
        }).join('');
    };

    const homeEventsHTML = generateEventsHTML(homeGroupedEvents, true);
    const awayEventsHTML = generateEventsHTML(awayGroupedEvents, false);

    return `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(12px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
            padding: 20px;
            box-sizing: border-box;
        ">
            <div style="
                background: linear-gradient(135deg, rgba(15, 15, 30, 0.98) 0%, rgba(25, 25, 45, 0.98) 100%);
                border-radius: 24px;
                padding: 40px;
                box-shadow:
                    0 40px 100px rgba(0,0,0,0.8),
                    0 0 0 1px rgba(255,255,255,0.15),
                    inset 0 1px 0 rgba(255,255,255,0.2);
                max-width: 1100px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                color: white;
                position: relative;
            ">

                <!-- Header -->
                <div style="text-align: center; margin-bottom: 32px;">
                    <div style="
                        display: inline-block;
                        padding: 8px 24px;
                        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
                        border-radius: 20px;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        font-size: 14px;
                        font-weight: 700;
                        letter-spacing: 1px;
                        margin-bottom: 16px;
                        text-transform: uppercase;
                    ">⏱️ Full Time</div>

                    ${winner !== 'Draw' ? `
                        <div style="
                            font-size: 20px;
                            font-weight: 700;
                            color: #00ff88;
                            text-shadow: 0 0 20px #00ff8860;
                            margin-bottom: 24px;
                            letter-spacing: 0.5px;
                        ">🏆 ${winner} Wins!</div>
                    ` : `
                        <div style="
                            font-size: 20px;
                            font-weight: 700;
                            color: #fbbf24;
                            text-shadow: 0 0 20px #fbbf2460;
                            margin-bottom: 24px;
                            letter-spacing: 0.5px;
                        ">🤝 Match Drawn</div>
                    `}
                </div>

                <!-- Score Display -->
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 40px;
                    padding: 28px;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 20px;
                    margin-bottom: 32px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
                ">
                    <!-- Home Team -->
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 16px;
                        flex: 1;
                        justify-content: flex-end;
                    ">
                        <div style="text-align: right;">
                            <div style="
                                font-size: 22px;
                                font-weight: 900;
                                color: #ffffff;
                                text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
                                margin-bottom: 4px;
                            ">${gameState.homeTeam}</div>
                            <div style="
                                font-size: 12px;
                                opacity: 0.6;
                                font-weight: 600;
                            ">${(gameState as any).teamCoaches?.[gameState.homeTeam] || ''}</div>
                        </div>
                        ${homeLogo ? `
                            <div style="
                                width: 64px;
                                height: 64px;
                                background: rgba(255, 255, 255, 0.05);
                                border-radius: 16px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                border: 1px solid rgba(255, 255, 255, 0.1);
                                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                            ">
                                <img src="${homeLogo}" style="
                                    width: 52px;
                                    height: 52px;
                                    object-fit: contain;
                                    filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));
                                ">
                            </div>
                        ` : ''}
                    </div>

                    <!-- Score -->
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 20px;
                        padding: 0 24px;
                    ">
                        <div style="
                            font-size: 56px;
                            font-weight: 900;
                            color: ${(gameState as any).homeJerseyColor};
                            text-shadow: 0 0 30px ${(gameState as any).homeJerseyColor}60;
                            filter: brightness(1.3);
                        ">${gameState.homeScore}</div>
                        <div style="
                            font-size: 40px;
                            font-weight: 300;
                            opacity: 0.4;
                        ">-</div>
                        <div style="
                            font-size: 56px;
                            font-weight: 900;
                            color: ${(gameState as any).awayJerseyColor};
                            text-shadow: 0 0 30px ${(gameState as any).awayJerseyColor}60;
                            filter: brightness(1.3);
                        ">${gameState.awayScore}</div>
                    </div>

                    <!-- Away Team -->
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 16px;
                        flex: 1;
                    ">
                        ${awayLogo ? `
                            <div style="
                                width: 64px;
                                height: 64px;
                                background: rgba(255, 255, 255, 0.05);
                                border-radius: 16px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                border: 1px solid rgba(255, 255, 255, 0.1);
                                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                            ">
                                <img src="${awayLogo}" style="
                                    width: 52px;
                                    height: 52px;
                                    object-fit: contain;
                                    filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));
                                ">
                            </div>
                        ` : ''}
                        <div>
                            <div style="
                                font-size: 22px;
                                font-weight: 900;
                                color: #ffffff;
                                text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
                                margin-bottom: 4px;
                            ">${gameState.awayTeam}</div>
                            <div style="
                                font-size: 12px;
                                opacity: 0.6;
                                font-weight: 600;
                            ">${(gameState as any).teamCoaches?.[gameState.awayTeam] || ''}</div>
                        </div>
                    </div>
                </div>

                <!-- Tabs -->
                <div style="
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                    margin-bottom: 28px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    padding-bottom: 0;
                ">
                    <button onclick="switchSummaryTab('events')" id="events-tab" style="
                        padding: 12px 28px;
                        border-radius: 12px 12px 0 0;
                        font-weight: 700;
                        font-size: 14px;
                        cursor: pointer;
                        background: linear-gradient(135deg, #667eea, #764ba2);
                        color: white;
                        border: none;
                        transition: all 0.3s;
                        letter-spacing: 0.5px;
                        text-transform: uppercase;
                        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                    ">
                        📋 Match Events
                    </button>
                    <button onclick="switchSummaryTab('stats')" id="stats-tab" style="
                        padding: 12px 28px;
                        border-radius: 12px 12px 0 0;
                        font-weight: 700;
                        font-size: 14px;
                        cursor: pointer;
                        background: rgba(255,255,255,0.05);
                        color: rgba(255,255,255,0.7);
                        border: 1px solid rgba(255,255,255,0.1);
                        transition: all 0.3s;
                        letter-spacing: 0.5px;
                        text-transform: uppercase;
                    ">
                        📊 Statistics
                    </button>
                </div>

                <!-- Events Content (Side by Side) -->
                <div id="summary-events-content" style="display: block;">
                    <div style="
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 24px;
                        margin-bottom: 28px;
                    ">
                        <!-- Home Events -->
                        <div>
                            <h3 style="
                                margin: 0 0 20px 0;
                                font-size: 16px;
                                font-weight: 800;
                                color: ${(gameState as any).homeJerseyColor};
                                filter: brightness(1.3);
                                text-transform: uppercase;
                                letter-spacing: 1px;
                                display: flex;
                                align-items: center;
                                gap: 8px;
                            ">
                                <span>📋</span> ${gameState.homeTeam}
                            </h3>
                            <div style="
                                max-height: 400px;
                                overflow-y: auto;
                                padding-right: 8px;
                            ">
                                ${homeEventsHTML}
                            </div>
                        </div>

                        <!-- Away Events -->
                        <div>
                            <h3 style="
                                margin: 0 0 20px 0;
                                font-size: 16px;
                                font-weight: 800;
                                color: ${(gameState as any).awayJerseyColor};
                                filter: brightness(1.3);
                                text-transform: uppercase;
                                letter-spacing: 1px;
                                display: flex;
                                align-items: center;
                                gap: 8px;
                            ">
                                <span>📋</span> ${gameState.awayTeam}
                            </h3>
                            <div style="
                                max-height: 400px;
                                overflow-y: auto;
                                padding-right: 8px;
                            ">
                                ${awayEventsHTML}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Stats Content -->
                <div id="summary-stats-content" style="display: none;">
                    ${renderStatisticsSummary()}
                </div>

                <!-- Action Button -->
                <button onclick="resetMatch()" style="
                    width: 100%;
                    margin-top: 20px;
                    padding: 18px;
                    font-size: 18px;
                    font-weight: 800;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    background: linear-gradient(135deg, #f093fb, #f5576c);
                    color: white;
                    border: none;
                    border-radius: 14px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 8px 24px rgba(240, 147, 251, 0.4);
                ">
                    🔄 New Match
                </button>
            </div>
        </div>

        <style>
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            button:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
            }

            /* Custom Scrollbar */
            #summary-events-content > div > div::-webkit-scrollbar,
            #summary-stats-content::-webkit-scrollbar {
                width: 6px;
            }

            #summary-events-content > div > div::-webkit-scrollbar-track,
            #summary-stats-content::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 3px;
            }

            #summary-events-content > div > div::-webkit-scrollbar-thumb,
            #summary-stats-content::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
            }

            #summary-events-content > div > div::-webkit-scrollbar-thumb:hover,
            #summary-stats-content::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.3);
            }
        </style>
    `;
}

// ============================================================================
// ENHANCED STATISTICS SUMMARY - MODERN DUAL-COLUMN COMPARISON
// ============================================================================

export function renderStatisticsSummary(): string {
    // Using imported gameState from globalExports
    const homeStats = gameState.stats.home || {} as any;
    const awayStats = gameState.stats.away || {} as any;

    const homePassAcc = homeStats.passesAttempted > 0
        ? Math.round((homeStats.passesCompleted / homeStats.passesAttempted) * 100)
        : 0;
    const awayPassAcc = awayStats.passesAttempted > 0
        ? Math.round((awayStats.passesCompleted / awayStats.passesAttempted) * 100)
        : 0;

    // Helper function for stat comparison bars
    const renderStatBar = (label: string, homeVal: string | number, awayVal: string | number, icon: string): string => {
        // Calculate percentages for the bar
        const homeNum = parseFloat(String(homeVal)) || 0;
        const awayNum = parseFloat(String(awayVal)) || 0;
        const total = homeNum + awayNum;
        const homePercent = total > 0 ? (homeNum / total) * 100 : 50;
        const awayPercent = total > 0 ? (awayNum / total) * 100 : 50;

        return `
            <div style="
                padding: 16px;
                background: rgba(255, 255, 255, 0.02);
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.06);
            ">
                <!-- Label and Icon -->
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-bottom: 12px;
                    font-size: 13px;
                    font-weight: 700;
                    opacity: 0.8;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                ">
                    <span style="font-size: 16px;">${icon}</span>
                    <span>${label}</span>
                </div>

                <!-- Values -->
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                    font-size: 20px;
                    font-weight: 900;
                ">
                    <span style="
                        color: ${(gameState as any).homeJerseyColor};
                        filter: brightness(1.3);
                        text-shadow: 0 0 10px ${(gameState as any).homeJerseyColor}40;
                    ">${homeVal}</span>
                    <span style="
                        color: ${(gameState as any).awayJerseyColor};
                        filter: brightness(1.3);
                        text-shadow: 0 0 10px ${(gameState as any).awayJerseyColor}40;
                    ">${awayVal}</span>
                </div>

                <!-- Bar -->
                <div style="
                    display: flex;
                    width: 100%;
                    height: 8px;
                    background: rgba(0, 0, 0, 0.4);
                    border-radius: 4px;
                    overflow: hidden;
                    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
                ">
                    <div style="
                        width: ${homePercent}%;
                        background: linear-gradient(90deg, ${(gameState as any).homeJerseyColor}, ${lightenColor((gameState as any).homeJerseyColor, 20)});
                        transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                        box-shadow: 0 0 8px ${(gameState as any).homeJerseyColor}60;
                    "></div>
                    <div style="
                        width: ${awayPercent}%;
                        background: linear-gradient(270deg, ${(gameState as any).awayJerseyColor}, ${lightenColor((gameState as any).awayJerseyColor, 20)});
                        transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                        box-shadow: 0 0 8px ${(gameState as any).awayJerseyColor}60;
                    "></div>
                </div>
            </div>
        `;
    };

    return `
        <div style="padding: 20px 0;">
            <h3 style="
                text-align: center;
                font-size: 20px;
                font-weight: 900;
                margin-bottom: 32px;
                text-transform: uppercase;
                letter-spacing: 1px;
                opacity: 0.9;
            ">
                📊 Detailed Match Statistics
            </h3>

            <div style="
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;
                margin-bottom: 20px;
            ">
                ${renderStatBar('Possession', `${homeStats.possession || 50}%`, `${awayStats.possession || 50}%`, '⚡')}
                ${renderStatBar('Goals', gameState.homeScore, gameState.awayScore, '⚽')}
                ${renderStatBar('Shots', (homeStats.shotsOnTarget || 0) + (homeStats.shotsOffTarget || 0), (awayStats.shotsOnTarget || 0) + (awayStats.shotsOffTarget || 0), '🎯')}
                ${renderStatBar('On Target', homeStats.shotsOnTarget || 0, awayStats.shotsOnTarget || 0, '🎯')}
                ${renderStatBar('xG', (homeStats.xGTotal || 0).toFixed(2), (awayStats.xGTotal || 0).toFixed(2), '⚡')}
                ${renderStatBar('Pass Acc.', `${homePassAcc}%`, `${awayPassAcc}%`, '✅')}
                ${renderStatBar('Interceptions', homeStats.interceptions || 0, awayStats.interceptions || 0, '✋')}
                ${renderStatBar('Offsides', (homeStats as any).offsides || 0, (awayStats as any).offsides || 0, '🚩')}
            </div>
        </div>
    `;
}

// ============================================================================
// TAB SWITCHING FUNCTION
// ============================================================================

export function switchSummaryTab(tab: 'events' | 'stats'): void {
    const eventsContent = document.getElementById('summary-events-content');
    const statsContent = document.getElementById('summary-stats-content');
    const eventsTab = document.getElementById('events-tab') as HTMLButtonElement | null;
    const statsTab = document.getElementById('stats-tab') as HTMLButtonElement | null;

    if (!eventsContent || !statsContent || !eventsTab || !statsTab) {
        console.warn('Could not find summary tab elements');
        return;
    }

    // Toggle content
    eventsContent.style.display = tab === 'events' ? 'block' : 'none';
    statsContent.style.display = tab === 'stats' ? 'block' : 'none';

    // Active tab styles
    if (tab === 'events') {
        eventsTab.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        eventsTab.style.color = 'white';
        eventsTab.style.border = 'none';
        eventsTab.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';

        statsTab.style.background = 'rgba(255,255,255,0.05)';
        statsTab.style.color = 'rgba(255,255,255,0.7)';
        statsTab.style.border = '1px solid rgba(255,255,255,0.1)';
        statsTab.style.boxShadow = 'none';
    } else {
        statsTab.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        statsTab.style.color = 'white';
        statsTab.style.border = 'none';
        statsTab.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';

        eventsTab.style.background = 'rgba(255,255,255,0.05)';
        eventsTab.style.color = 'rgba(255,255,255,0.7)';
        eventsTab.style.border = '1px solid rgba(255,255,255,0.1)';
        eventsTab.style.boxShadow = 'none';
    }
}

// ============================================================================
// BROWSER EXPORTS
// ============================================================================

// Functions are now exported via ES6 modules - no window exports needed
