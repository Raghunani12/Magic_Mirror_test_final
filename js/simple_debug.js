/* Simple Debug Monitor - No Console Override
 * Safe debugging without infinite loops
 */

class SimpleDebugMonitor {
    constructor() {
        this.moduleStatus = {};
        this.startTime = Date.now();
        this.init();
    }

    init() {
        console.log("🔍 Simple Debug Monitor Started");
        
        // Initialize known modules
        this.initializeKnownModules();
        
        // Create debug UI
        this.createDebugUI();
        
        // Setup periodic checks
        this.setupPeriodicChecks();
        
        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
    }

    initializeKnownModules() {
        const knownModules = [
            'alert', 'updatenotification', 'clock', 'calendar', 
            'weather', 'MMM-ip', 'newsfeed', 'MMM-ImageSlideshow', 'compliments'
        ];
        
        knownModules.forEach(moduleName => {
            this.moduleStatus[moduleName] = {
                name: moduleName,
                status: 'DETECTED',
                lastUpdate: Date.now(),
                errors: 0,
                warnings: 0,
                logs: 0
            };
        });
    }

    checkModuleStatus() {
        // Check if MM is loaded
        if (typeof MM !== 'undefined') {
            const modules = MM.getModules();
            
            modules.forEach(module => {
                const status = this.moduleStatus[module.name] || {};
                this.moduleStatus[module.name] = {
                    ...status,
                    name: module.name,
                    status: module.loaded ? 'ACTIVE' : 'LOADING',
                    lastUpdate: Date.now(),
                    hidden: module.hidden,
                    suspended: module.suspended,
                    domExists: !!document.getElementById(module.identifier)
                };
            });
        }

        // Check DOM elements
        this.checkDOMElements();
    }

    checkDOMElements() {
        const moduleSelectors = {
            'clock': '.clock',
            'calendar': '.calendar',
            'weather': '.weather',
            'newsfeed': '.newsfeed',
            'compliments': '.compliments'
        };

        Object.entries(moduleSelectors).forEach(([name, selector]) => {
            const element = document.querySelector(selector);
            if (this.moduleStatus[name]) {
                this.moduleStatus[name].domVisible = !!element;
                this.moduleStatus[name].hasContent = element ? element.textContent.length > 0 : false;
            }
        });
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
        debugConsole.id = 'simple-debug-console';
        debugConsole.innerHTML = `
            <h3>🔍 Smart Mirror Debug Console</h3>
            <div id="simple-debug-content">
                <div class="module-status">Initializing...</div>
            </div>
        `;
        document.body.appendChild(debugConsole);
    }

    toggleDebugConsole() {
        const console = document.getElementById('simple-debug-console');
        if (console) {
            console.classList.toggle('visible');
        }
    }

    updateDebugUI() {
        const debugContent = document.getElementById('simple-debug-content');
        if (!debugContent) return;

        const uptime = Math.floor((Date.now() - this.startTime) / 1000);
        const modules = Object.values(this.moduleStatus);

        let html = `
            <div class="module-status">
                ⏱️ Uptime: ${uptime}s | MM Loaded: ${typeof MM !== 'undefined' ? '✅' : '❌'}
            </div>
        `;

        if (typeof MM !== 'undefined') {
            const mmModules = MM.getModules();
            html += `<div class="module-status">📊 MM Modules: ${mmModules.length}</div>`;
        }

        modules.forEach(module => {
            const statusIcon = this.getStatusIcon(module.status);
            const timeSinceUpdate = Math.floor((Date.now() - module.lastUpdate) / 1000);
            
            let statusClass = 'status-unknown';
            if (module.status === 'ACTIVE') statusClass = 'status-active';
            else if (module.status === 'ERROR') statusClass = 'status-error';
            else if (module.status === 'LOADING') statusClass = 'status-warning';
            
            html += `
                <div class="module-status ${statusClass}">
                    ${statusIcon} ${module.name}<br>
                    <small>
                        Status: ${module.status} | 
                        DOM: ${module.domVisible ? '✅' : '❌'} | 
                        Content: ${module.hasContent ? '✅' : '❌'}
                    </small>
                </div>
            `;
        });

        debugContent.innerHTML = html;
    }

    getStatusIcon(status) {
        switch(status) {
            case 'ACTIVE': return '✅';
            case 'ERROR': return '❌';
            case 'LOADING': return '🔄';
            case 'DETECTED': return '📡';
            default: return '❓';
        }
    }

    setupPeriodicChecks() {
        // Check module status every 5 seconds
        setInterval(() => {
            this.checkModuleStatus();
            this.updateDebugUI();
        }, 5000);

        // Initial check after 2 seconds
        setTimeout(() => {
            this.checkModuleStatus();
            this.updateDebugUI();
        }, 2000);

        // Additional checks
        setTimeout(() => {
            this.checkModuleStatus();
            this.updateDebugUI();
        }, 10000);
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Ctrl + Shift + D to toggle debug console
            if (event.ctrlKey && event.shiftKey && event.key === 'D') {
                event.preventDefault();
                this.toggleDebugConsole();
            }
            
            // Ctrl + Shift + R to refresh status
            if (event.ctrlKey && event.shiftKey && event.key === 'R') {
                event.preventDefault();
                this.checkModuleStatus();
                this.updateDebugUI();
                console.log("🔄 Debug status refreshed");
            }
        });
    }

    // Public methods
    getModuleStatus(moduleName) {
        return this.moduleStatus[moduleName] || null;
    }

    getAllModules() {
        return Object.values(this.moduleStatus);
    }

    printStatusReport() {
        console.log("📊 SIMPLE DEBUG STATUS REPORT");
        console.log("=====================================");
        console.log(`MM Loaded: ${typeof MM !== 'undefined'}`);
        
        if (typeof MM !== 'undefined') {
            const mmModules = MM.getModules();
            console.log(`MM Modules: ${mmModules.length}`);
            mmModules.forEach(module => {
                console.log(`  ${module.name}: loaded=${module.loaded}, hidden=${module.hidden}`);
            });
        }
        
        console.log("Module Status:");
        Object.values(this.moduleStatus).forEach(module => {
            console.log(`  ${module.name}: ${module.status} | DOM: ${module.domVisible ? 'Yes' : 'No'} | Content: ${module.hasContent ? 'Yes' : 'No'}`);
        });
        console.log("=====================================");
    }

    runDiagnostic() {
        console.log("🔧 Running Smart Mirror Diagnostic");
        
        // Check MM
        if (typeof MM === 'undefined') {
            console.log("❌ CRITICAL: MM object not found!");
            return;
        }
        
        console.log("✅ MM object found");
        
        // Check modules
        const modules = MM.getModules();
        console.log(`📊 Found ${modules.length} modules`);
        
        // Force update all modules
        modules.forEach(module => {
            if (!module.hidden && module.loaded) {
                console.log(`🔄 Updating ${module.name}...`);
                try {
                    module.updateDom();
                } catch (error) {
                    console.log(`❌ Error updating ${module.name}:`, error);
                }
            }
        });
        
        // Update our status
        this.checkModuleStatus();
        this.updateDebugUI();
        
        console.log("✅ Diagnostic complete");
    }
}

// Initialize simple debug monitor
const simpleDebugMonitor = new SimpleDebugMonitor();

// Make it globally accessible
window.simpleDebugMonitor = simpleDebugMonitor;

console.log("🔧 Simple Debug commands available:");
console.log("  simpleDebugMonitor.printStatusReport() - Show status");
console.log("  simpleDebugMonitor.runDiagnostic() - Run full diagnostic");
console.log("  simpleDebugMonitor.getModuleStatus('moduleName') - Get module info");
console.log("  Ctrl+Shift+D - Toggle debug console");
console.log("  Ctrl+Shift+R - Refresh status");
