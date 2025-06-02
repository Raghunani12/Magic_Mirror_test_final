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
        // Store original console methods
        this.originalConsole = {
            log: console.log.bind(console),
            error: console.error.bind(console),
            warn: console.warn.bind(console),
            info: console.info.bind(console)
        };

        const self = this;

        console.log = function(...args) {
            self.logCount++;
            self.processLog('LOG', args);
            self.originalConsole.log.apply(console, args);
        };

        console.error = function(...args) {
            self.errorCount++;
            self.processLog('ERROR', args);
            self.originalConsole.error.apply(console, args);
        };

        console.warn = function(...args) {
            self.warningCount++;
            self.processLog('WARN', args);
            self.originalConsole.warn.apply(console, args);
        };

        console.info = function(...args) {
            self.processLog('INFO', args);
            self.originalConsole.info.apply(console, args);
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

        // Store log without calling console.log again to avoid infinite loop
        this.logCount++;

        // Only log debug info if it's not from our own debug monitor
        if (!message.includes('DebugMonitor') && !message.includes('debug_monitor')) {
            // Use original console methods to avoid recursion
            const prefix = this.getLogPrefix(level);
            // Don't use console.log here as it would cause infinite recursion
        }
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
        // Initialize known modules from server logs
        const knownModules = [
            'alert', 'updatenotification', 'clock', 'calendar',
            'weather', 'MMM-ip', 'newsfeed', 'MMM-ImageSlideshow', 'compliments'
        ];

        // Add known modules to status
        knownModules.forEach(moduleName => {
            this.updateModuleStatus(moduleName, 'INFO', 'Module detected from server logs');
        });

        // Monitor MagicMirror module registration
        if (typeof Module !== 'undefined') {
            const originalRegister = Module.register || function() {};
            Module.register = function(name, moduleDefinition) {
                console.log(`🔄 Registering module: ${name}`);
                debugMonitor.updateModuleStatus(name, 'INFO', 'Module registered');
                return originalRegister.call(this, name, moduleDefinition);
            };
        }

        // Monitor when DOM is ready and modules start
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                this.detectModulesFromDOM();
            }, 2000);
        });

        // If DOM is already loaded
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setTimeout(() => {
                this.detectModulesFromDOM();
            }, 2000);
        }
    }

    detectModulesFromDOM() {
        // Look for module elements in the DOM
        const moduleElements = document.querySelectorAll('.module');
        moduleElements.forEach(element => {
            const classes = element.className.split(' ');
            const moduleClass = classes.find(cls => cls.startsWith('module_') || cls.includes('MMM-'));
            if (moduleClass) {
                const moduleName = moduleClass.replace('module_', '').replace('_', '-');
                this.updateModuleStatus(moduleName, 'INFO', 'Module found in DOM');
            }
        });

        // Also check for specific module containers
        const specificModules = {
            'clock': '.clock',
            'calendar': '.calendar',
            'weather': '.weather',
            'newsfeed': '.newsfeed',
            'compliments': '.compliments'
        };

        Object.entries(specificModules).forEach(([name, selector]) => {
            if (document.querySelector(selector)) {
                this.updateModuleStatus(name, 'INFO', 'Module UI detected');
            }
        });
    }

    setupStatusReports() {
        // Print status report every 15 seconds
        setInterval(() => {
            this.printStatusReport();
        }, 15000);

        // Print initial report after 3 seconds
        setTimeout(() => {
            this.printStatusReport();
        }, 3000);

        // Additional check after 10 seconds for DOM modules
        setTimeout(() => {
            this.detectModulesFromDOM();
            this.printStatusReport();
        }, 10000);
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
        this.originalConsole.log("🧹 Debug logs cleared");
    }

    restoreConsole() {
        if (this.originalConsole) {
            console.log = this.originalConsole.log;
            console.error = this.originalConsole.error;
            console.warn = this.originalConsole.warn;
            console.info = this.originalConsole.info;
            this.originalConsole.log("🔧 Console restored to original state");
        }
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

        // Update UI every 3 seconds
        setInterval(() => {
            this.updateDebugUI();
        }, 3000);

        // Initial update after 1 second
        setTimeout(() => {
            this.updateDebugUI();
        }, 1000);

        // Additional updates to catch modules loading
        setTimeout(() => {
            this.detectModulesFromDOM();
            this.updateDebugUI();
        }, 5000);

        setTimeout(() => {
            this.detectModulesFromDOM();
            this.updateDebugUI();
        }, 10000);
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
