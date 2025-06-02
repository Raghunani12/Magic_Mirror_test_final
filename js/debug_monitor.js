/* Smart Mirror Debug Monitor
 * Enhanced debugging and monitoring for all modules
 */

class DebugMonitor {
    constructor() {
        this.moduleStatus = {};
        this.errorCount = 0;
        this.warningCount = 0;
        this.logCount = 0;
        this.startTime = Date.now();
        this.init();
    }

    init() {
        console.log("🔍 Smart Mirror Debug Monitor Started");
        console.log("=====================================");

        // Override console methods to capture all logs
        this.setupConsoleOverrides();

        // Monitor module loading
        this.monitorModuleLoading();

        // Setup periodic status reports
        this.setupStatusReports();

        // Monitor network requests
        this.monitorNetworkRequests();

        // Create debug UI
        this.createDebugUI();

        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
    }

    setupConsoleOverrides() {
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        const originalInfo = console.info;

        console.log = (...args) => {
            this.logCount++;
            this.processLog('LOG', args);
            originalLog.apply(console, args);
        };

        console.error = (...args) => {
            this.errorCount++;
            this.processLog('ERROR', args);
            originalError.apply(console, args);
        };

        console.warn = (...args) => {
            this.warningCount++;
            this.processLog('WARN', args);
            originalWarn.apply(console, args);
        };

        console.info = (...args) => {
            this.processLog('INFO', args);
            originalInfo.apply(console, args);
        };
    }

    processLog(level, args) {
        const message = args.join(' ');
        const timestamp = new Date().toLocaleTimeString();
        
        // Detect module-specific logs
        const moduleMatch = message.match(/\[(.*?)\]/);
        if (moduleMatch) {
            const moduleName = moduleMatch[1];
            this.updateModuleStatus(moduleName, level, message);
        }

        // Log with enhanced formatting
        const prefix = this.getLogPrefix(level);
        console.groupCollapsed(`${prefix} [${timestamp}] ${level}`);
        console.log('Message:', message);
        console.log('Stack:', new Error().stack);
        console.groupEnd();
    }

    getLogPrefix(level) {
        switch(level) {
            case 'ERROR': return '❌';
            case 'WARN': return '⚠️';
            case 'INFO': return 'ℹ️';
            case 'LOG': return '📝';
            default: return '🔍';
        }
    }

    updateModuleStatus(moduleName, level, message) {
        if (!this.moduleStatus[moduleName]) {
            this.moduleStatus[moduleName] = {
                name: moduleName,
                status: 'UNKNOWN',
                lastUpdate: Date.now(),
                errors: 0,
                warnings: 0,
                logs: 0,
                messages: []
            };
        }

        const module = this.moduleStatus[moduleName];
        module.lastUpdate = Date.now();
        module.messages.push({
            level,
            message,
            timestamp: Date.now()
        });

        // Keep only last 10 messages per module
        if (module.messages.length > 10) {
            module.messages = module.messages.slice(-10);
        }

        // Update counters
        switch(level) {
            case 'ERROR':
                module.errors++;
                module.status = 'ERROR';
                break;
            case 'WARN':
                module.warnings++;
                if (module.status !== 'ERROR') module.status = 'WARNING';
                break;
            default:
                module.logs++;
                if (module.status === 'UNKNOWN') module.status = 'ACTIVE';
                break;
        }
    }

    monitorModuleLoading() {
        // Monitor when modules are loaded
        const originalDefine = window.Module?.define || function() {};
        
        if (window.Module) {
            window.Module.define = function(name, moduleDefinition) {
                console.log(`🔄 Loading module: ${name}`);
                debugMonitor.updateModuleStatus(name, 'INFO', 'Module loading started');
                
                const result = originalDefine.call(this, name, moduleDefinition);
                
                setTimeout(() => {
                    console.log(`✅ Module loaded: ${name}`);
                    debugMonitor.updateModuleStatus(name, 'INFO', 'Module loaded successfully');
                }, 100);
                
                return result;
            };
        }
    }

    setupStatusReports() {
        // Print status report every 30 seconds
        setInterval(() => {
            this.printStatusReport();
        }, 30000);

        // Print initial report after 5 seconds
        setTimeout(() => {
            this.printStatusReport();
        }, 5000);
    }

    printStatusReport() {
        const uptime = Math.floor((Date.now() - this.startTime) / 1000);
        
        console.group("📊 SMART MIRROR STATUS REPORT");
        console.log(`⏱️ Uptime: ${uptime}s | Errors: ${this.errorCount} | Warnings: ${this.warningCount} | Logs: ${this.logCount}`);
        console.log("=====================================");
        
        const modules = Object.values(this.moduleStatus);
        if (modules.length === 0) {
            console.log("⚠️ No modules detected yet");
        } else {
            modules.forEach(module => {
                const statusIcon = this.getStatusIcon(module.status);
                const timeSinceUpdate = Math.floor((Date.now() - module.lastUpdate) / 1000);
                console.log(`${statusIcon} ${module.name} | Status: ${module.status} | Last update: ${timeSinceUpdate}s ago | E:${module.errors} W:${module.warnings} L:${module.logs}`);
            });
        }
        
        console.log("=====================================");
        console.groupEnd();
    }

    getStatusIcon(status) {
        switch(status) {
            case 'ACTIVE': return '✅';
            case 'ERROR': return '❌';
            case 'WARNING': return '⚠️';
            case 'UNKNOWN': return '❓';
            default: return '🔍';
        }
    }

    monitorNetworkRequests() {
        // Monitor fetch requests
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const url = args[0];
            console.log(`🌐 Network request: ${url}`);
            
            return originalFetch.apply(this, args)
                .then(response => {
                    if (response.ok) {
                        console.log(`✅ Network success: ${url} (${response.status})`);
                    } else {
                        console.error(`❌ Network error: ${url} (${response.status})`);
                    }
                    return response;
                })
                .catch(error => {
                    console.error(`❌ Network failed: ${url}`, error);
                    throw error;
                });
        };

        // Monitor XMLHttpRequest
        const originalXHR = window.XMLHttpRequest;
        window.XMLHttpRequest = function() {
            const xhr = new originalXHR();
            const originalOpen = xhr.open;
            
            xhr.open = function(method, url) {
                console.log(`🌐 XHR request: ${method} ${url}`);
                return originalOpen.apply(this, arguments);
            };
            
            return xhr;
        };
    }

    // Public methods for manual debugging
    getModuleStatus(moduleName) {
        return this.moduleStatus[moduleName] || null;
    }

    getAllModules() {
        return Object.values(this.moduleStatus);
    }

    clearLogs() {
        this.moduleStatus = {};
        this.errorCount = 0;
        this.warningCount = 0;
        this.logCount = 0;
        console.clear();
        console.log("🧹 Debug logs cleared");
    }

    exportLogs() {
        const data = {
            uptime: Date.now() - this.startTime,
            errorCount: this.errorCount,
            warningCount: this.warningCount,
            logCount: this.logCount,
            modules: this.moduleStatus,
            timestamp: new Date().toISOString()
        };

        console.log("📋 Debug data export:", JSON.stringify(data, null, 2));
        return data;
    }

    createDebugUI() {
        // Create debug toggle button
        const toggleButton = document.createElement('div');
        toggleButton.className = 'debug-toggle';
        toggleButton.innerHTML = '🔍 DEBUG';
        toggleButton.onclick = () => this.toggleDebugConsole();
        document.body.appendChild(toggleButton);

        // Create debug console
        const debugConsole = document.createElement('div');
        debugConsole.className = 'debug-console';
        debugConsole.id = 'debug-console';
        debugConsole.innerHTML = `
            <h3>🔍 Smart Mirror Debug Console</h3>
            <div id="debug-content">
                <div class="module-status">Initializing debug monitor...</div>
            </div>
        `;
        document.body.appendChild(debugConsole);

        // Update UI every 5 seconds
        setInterval(() => {
            this.updateDebugUI();
        }, 5000);

        // Initial update after 2 seconds
        setTimeout(() => {
            this.updateDebugUI();
        }, 2000);
    }

    toggleDebugConsole() {
        const console = document.getElementById('debug-console');
        if (console) {
            console.classList.toggle('visible');
        }
    }

    updateDebugUI() {
        const debugContent = document.getElementById('debug-content');
        if (!debugContent) return;

        const uptime = Math.floor((Date.now() - this.startTime) / 1000);
        const modules = Object.values(this.moduleStatus);

        let html = `
            <div class="module-status">
                ⏱️ Uptime: ${uptime}s | E:${this.errorCount} W:${this.warningCount} L:${this.logCount}
            </div>
        `;

        if (modules.length === 0) {
            html += '<div class="module-status status-unknown">⚠️ No modules detected</div>';
        } else {
            modules.forEach(module => {
                const statusClass = `status-${module.status.toLowerCase()}`;
                const statusIcon = this.getStatusIcon(module.status);
                const timeSinceUpdate = Math.floor((Date.now() - module.lastUpdate) / 1000);

                html += `
                    <div class="module-status ${statusClass}">
                        ${statusIcon} ${module.name}<br>
                        <small>Last: ${timeSinceUpdate}s | E:${module.errors} W:${module.warnings}</small>
                    </div>
                `;
            });
        }

        debugContent.innerHTML = html;
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Ctrl + Shift + D to toggle debug console
            if (event.ctrlKey && event.shiftKey && event.key === 'D') {
                event.preventDefault();
                this.toggleDebugConsole();
            }

            // Ctrl + Shift + C to clear logs
            if (event.ctrlKey && event.shiftKey && event.key === 'C') {
                event.preventDefault();
                this.clearLogs();
            }

            // Ctrl + Shift + E to export logs
            if (event.ctrlKey && event.shiftKey && event.key === 'E') {
                event.preventDefault();
                this.exportLogs();
            }
        });
    }
}

// Initialize debug monitor
const debugMonitor = new DebugMonitor();

// Make it globally accessible for manual debugging
window.debugMonitor = debugMonitor;

// Add helpful console commands
console.log("🔧 Debug commands available:");
console.log("  debugMonitor.printStatusReport() - Show current status");
console.log("  debugMonitor.getModuleStatus('moduleName') - Get specific module info");
console.log("  debugMonitor.getAllModules() - Get all module statuses");
console.log("  debugMonitor.clearLogs() - Clear all logs");
console.log("  debugMonitor.exportLogs() - Export debug data");
