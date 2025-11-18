const VISUAL_THEME = {
    glass: {
        background: 'rgba(15, 15, 25, 0.75)',
        border: 'rgba(255, 255, 255, 0.12)',
        shadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        blur: 'blur(20px)'
    },
    gradients: {
        primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        success: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        danger: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)',
        info: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    accents: {
        goal: '#00ff88',
        save: '#00d4ff',
        pass: '#ffd700',
        shot: '#ff4757'
    }
};



const EventLogger = {
    enabled: false,
    logs: [],
    maxLogs: 1000,
    
    enable() {
        this.enabled = true;
        console.log('📊 Event logging enabled');
    },
    
    disable() {
        this.enabled = false;
    },
    
    log(eventName, data) {
        if (!this.enabled) return;
        
        const logEntry = {
            timestamp: Date.now(),
            event: eventName,
            data: data
        };
        
        this.logs.push(logEntry);
        
        // Prevent memory leak by limiting log size
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        
        // Optional: Log to console for debugging
        // console.log(`[EVENT] ${eventName}`, data);
    },
    
    getLogs(eventName = null) {
        if (eventName) {
            return this.logs.filter(log => log.event === eventName);
        }
        return this.logs;
    },
    
    clear() {
        this.logs = [];
    },
    
    exportToJSON() {
        return JSON.stringify(this.logs, null, 2);
    }
};
if (!eventBus._isWrapped) {
    const originalPublish = eventBus.publish.bind(eventBus);
    eventBus.publish = function(eventName, data) {
        EventLogger.log(eventName, data);
        return originalPublish(eventName, data);
    };
    eventBus._isWrapped = true; // Set the guard flag
};

function initCommentarySystem() {
    eventBus.subscribe(EVENT_TYPES.GOAL_SCORED, (data) => {
        const { scorer, time, xG } = data;
        console.log(`⚽ GOAL! ${scorer.name} scores at ${time}' (xG: ${(xG * 100).toFixed(0)}%)`);
    });
    
    eventBus.subscribe(EVENT_TYPES.SHOT_SAVED, (data) => {
        console.log(`🧤 Great save by ${data.goalkeeper.name}!`);
    });
    
    eventBus.subscribe(EVENT_TYPES.FOUL_COMMITTED, (data) => {
        console.log(`⚠️ Foul by ${data.fouler.name} on ${data.fouled.name}`);
    });
}

function initStatisticsSystem() {
    const matchStats = {
        goals: [],
        shots: [],
        fouls: []
    };
    
    eventBus.subscribe(EVENT_TYPES.GOAL_SCORED, (data) => {
        matchStats.goals.push(data);
    });
    
    eventBus.subscribe(EVENT_TYPES.SHOT_TAKEN, (data) => {
        matchStats.shots.push(data);
    });
    
    eventBus.subscribe(EVENT_TYPES.FOUL_COMMITTED, (data) => {
        matchStats.fouls.push(data);
    });
    
    return matchStats;
}

function initTeamStateMonitor() {
    eventBus.subscribe(EVENT_TYPES.TEAM_STATE_CHANGED, (data) => {
        console.log(`🧠 ${data.team} team state: ${data.oldState} → ${data.newState}`);
    });
    
    eventBus.subscribe(EVENT_TYPES.POSSESSION_CHANGED, (data) => {
        console.log(`⚡ Possession changed to ${data.team}`);
    });
}

if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // EventLogger.enable(); // Uncomment for debugging
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        eventBus,
        EVENT_TYPES,
        EventLogger
    };
}



















