/**
 * @file preload.js
 * @description Jarvis-style futuristic preloader for Magic Mirror
 * @author Augment Agent
 * @license MIT
 */

(function() {
    'use strict';

    /**
     * Jarvis Preloader Class
     * Creates a futuristic Tony Stark / Iron Man style loading experience
     */
    class JarvisPreloader {
        constructor() {
            this.loadingSteps = [
                'Initializing Neural Networks...',
                'Connecting to Satellite Systems...',
                'Loading Weather Protocols...',
                'Synchronizing Calendar Data...',
                'Establishing News Feeds...',
                'Calibrating Display Matrix...',
                'Activating Voice Recognition...',
                'Loading User Preferences...',
                'Optimizing Performance...',
                'System Ready - Welcome Back, Sir'
            ];
            this.currentStep = 0;
            this.isLoading = true;
            this.startTime = Date.now();
            
            this.createPreloader();
            this.startLoadingSequence();
        }

        /**
         * Create the Jarvis preloader interface
         */
        createPreloader() {
            // Create main preloader container
            this.container = document.createElement('div');
            this.container.id = 'jarvis-preloader';
            this.container.innerHTML = `
                <div class="jarvis-background">
                    <div class="jarvis-grid"></div>
                    <div class="jarvis-particles"></div>
                </div>
                
                <div class="jarvis-interface">
                    <!-- Central Jarvis Core -->
                    <div class="jarvis-core">
                        <div class="jarvis-ring jarvis-ring-1"></div>
                        <div class="jarvis-ring jarvis-ring-2"></div>
                        <div class="jarvis-ring jarvis-ring-3"></div>
                        <div class="jarvis-center">
                            <div class="jarvis-logo">
                                <div class="jarvis-arc jarvis-arc-1"></div>
                                <div class="jarvis-arc jarvis-arc-2"></div>
                                <div class="jarvis-arc jarvis-arc-3"></div>
                                <div class="jarvis-arc jarvis-arc-4"></div>
                                <div class="jarvis-pulse"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Loading Information -->
                    <div class="jarvis-info">
                        <h1 class="jarvis-title">MAGIC MIRROR</h1>
                        <div class="jarvis-subtitle">Advanced Personal Assistant</div>
                        <div class="jarvis-version">Version 2.31.0 - Jarvis Protocol</div>
                        
                        <div class="jarvis-status">
                            <div class="jarvis-status-text" id="jarvis-status">Initializing Systems...</div>
                            <div class="jarvis-progress">
                                <div class="jarvis-progress-bar" id="jarvis-progress"></div>
                                <div class="jarvis-progress-glow"></div>
                            </div>
                            <div class="jarvis-percentage" id="jarvis-percentage">0%</div>
                        </div>
                        
                        <!-- System Stats -->
                        <div class="jarvis-stats">
                            <div class="jarvis-stat">
                                <span class="jarvis-stat-label">CPU</span>
                                <span class="jarvis-stat-value" id="cpu-usage">--</span>
                            </div>
                            <div class="jarvis-stat">
                                <span class="jarvis-stat-label">MEMORY</span>
                                <span class="jarvis-stat-value" id="memory-usage">--</span>
                            </div>
                            <div class="jarvis-stat">
                                <span class="jarvis-stat-label">NETWORK</span>
                                <span class="jarvis-stat-value" id="network-status">ONLINE</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- HUD Elements -->
                    <div class="jarvis-hud">
                        <div class="jarvis-hud-corner jarvis-hud-tl"></div>
                        <div class="jarvis-hud-corner jarvis-hud-tr"></div>
                        <div class="jarvis-hud-corner jarvis-hud-bl"></div>
                        <div class="jarvis-hud-corner jarvis-hud-br"></div>
                        
                        <div class="jarvis-scanline"></div>
                        <div class="jarvis-radar">
                            <div class="jarvis-radar-sweep"></div>
                        </div>
                    </div>
                </div>
            `;

            // Add CSS styles
            this.addStyles();
            
            // Insert into document
            document.body.appendChild(this.container);
            
            // Create particles
            this.createParticles();
            
            // Start animations
            setTimeout(() => {
                this.container.classList.add('jarvis-active');
            }, 100);
        }

        /**
         * Add Jarvis CSS styles
         */
        addStyles() {
            const style = document.createElement('style');
            style.textContent = `
                #jarvis-preloader {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: #000000;
                    z-index: 999999;
                    overflow: hidden;
                    font-family: 'Orbitron', 'Roboto', monospace;
                    color: #00d4ff;
                    opacity: 0;
                    transition: opacity 0.5s ease;
                }

                #jarvis-preloader.jarvis-active {
                    opacity: 1;
                }

                .jarvis-background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle at center, #001122 0%, #000000 70%);
                }

                .jarvis-grid {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px);
                    background-size: 50px 50px;
                    animation: jarvis-grid-move 20s linear infinite;
                }

                @keyframes jarvis-grid-move {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(50px, 50px); }
                }

                .jarvis-particles {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                }

                .jarvis-particle {
                    position: absolute;
                    width: 2px;
                    height: 2px;
                    background: #00d4ff;
                    border-radius: 50%;
                    animation: jarvis-particle-float 8s linear infinite;
                    box-shadow: 0 0 6px #00d4ff;
                }

                @keyframes jarvis-particle-float {
                    0% { 
                        transform: translateY(100vh) scale(0);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    90% {
                        opacity: 1;
                    }
                    100% { 
                        transform: translateY(-100px) scale(0);
                        opacity: 0;
                    }
                }

                .jarvis-interface {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                }

                .jarvis-core {
                    position: relative;
                    width: 300px;
                    height: 300px;
                    margin-bottom: 50px;
                }

                .jarvis-ring {
                    position: absolute;
                    border: 2px solid rgba(0, 212, 255, 0.3);
                    border-radius: 50%;
                    animation: jarvis-rotate 10s linear infinite;
                }

                .jarvis-ring-1 {
                    width: 100%;
                    height: 100%;
                    border-top-color: #00d4ff;
                    animation-duration: 8s;
                }

                .jarvis-ring-2 {
                    width: 80%;
                    height: 80%;
                    top: 10%;
                    left: 10%;
                    border-right-color: #00d4ff;
                    animation-duration: 12s;
                    animation-direction: reverse;
                }

                .jarvis-ring-3 {
                    width: 60%;
                    height: 60%;
                    top: 20%;
                    left: 20%;
                    border-bottom-color: #00d4ff;
                    animation-duration: 15s;
                }

                @keyframes jarvis-rotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .jarvis-center {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 120px;
                    height: 120px;
                }

                .jarvis-logo {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }

                .jarvis-arc {
                    position: absolute;
                    border: 3px solid transparent;
                    border-radius: 50%;
                    animation: jarvis-arc-pulse 2s ease-in-out infinite;
                }

                .jarvis-arc-1 {
                    width: 100%;
                    height: 100%;
                    border-top-color: #00d4ff;
                    animation-delay: 0s;
                }

                .jarvis-arc-2 {
                    width: 80%;
                    height: 80%;
                    top: 10%;
                    left: 10%;
                    border-right-color: #0099cc;
                    animation-delay: 0.5s;
                }

                .jarvis-arc-3 {
                    width: 60%;
                    height: 60%;
                    top: 20%;
                    left: 20%;
                    border-bottom-color: #006699;
                    animation-delay: 1s;
                }

                .jarvis-arc-4 {
                    width: 40%;
                    height: 40%;
                    top: 30%;
                    left: 30%;
                    border-left-color: #003366;
                    animation-delay: 1.5s;
                }

                @keyframes jarvis-arc-pulse {
                    0%, 100% { 
                        opacity: 0.3;
                        transform: scale(1);
                    }
                    50% { 
                        opacity: 1;
                        transform: scale(1.1);
                    }
                }

                .jarvis-pulse {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 20px;
                    height: 20px;
                    background: #00d4ff;
                    border-radius: 50%;
                    animation: jarvis-pulse-core 1.5s ease-in-out infinite;
                    box-shadow: 
                        0 0 20px #00d4ff,
                        0 0 40px #00d4ff,
                        0 0 60px #00d4ff;
                }

                @keyframes jarvis-pulse-core {
                    0%, 100% { 
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                    50% { 
                        transform: translate(-50%, -50%) scale(1.5);
                        opacity: 0.7;
                    }
                }

                .jarvis-info {
                    text-align: center;
                    max-width: 600px;
                }

                .jarvis-title {
                    font-size: 3rem;
                    font-weight: 700;
                    margin: 0 0 10px 0;
                    text-shadow: 0 0 20px #00d4ff;
                    letter-spacing: 3px;
                    animation: jarvis-text-glow 2s ease-in-out infinite alternate;
                }

                .jarvis-subtitle {
                    font-size: 1.2rem;
                    margin-bottom: 5px;
                    opacity: 0.8;
                    letter-spacing: 2px;
                }

                .jarvis-version {
                    font-size: 0.9rem;
                    opacity: 0.6;
                    margin-bottom: 40px;
                }

                @keyframes jarvis-text-glow {
                    0% { text-shadow: 0 0 20px #00d4ff; }
                    100% { text-shadow: 0 0 30px #00d4ff, 0 0 40px #00d4ff; }
                }

                .jarvis-status {
                    margin-bottom: 30px;
                }

                .jarvis-status-text {
                    font-size: 1.1rem;
                    margin-bottom: 15px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .jarvis-progress {
                    position: relative;
                    width: 400px;
                    height: 4px;
                    background: rgba(0, 212, 255, 0.2);
                    border-radius: 2px;
                    margin: 0 auto 10px auto;
                    overflow: hidden;
                }

                .jarvis-progress-bar {
                    height: 100%;
                    background: linear-gradient(90deg, #00d4ff, #0099cc);
                    border-radius: 2px;
                    width: 0%;
                    transition: width 0.3s ease;
                    position: relative;
                }

                .jarvis-progress-glow {
                    position: absolute;
                    top: -2px;
                    left: 0;
                    right: 0;
                    bottom: -2px;
                    background: linear-gradient(90deg, transparent, #00d4ff, transparent);
                    border-radius: 4px;
                    animation: jarvis-progress-sweep 2s linear infinite;
                    opacity: 0.5;
                }

                @keyframes jarvis-progress-sweep {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(400px); }
                }

                .jarvis-percentage {
                    font-size: 0.9rem;
                    opacity: 0.8;
                }

                .jarvis-stats {
                    display: flex;
                    justify-content: space-around;
                    margin-top: 40px;
                    gap: 40px;
                }

                .jarvis-stat {
                    text-align: center;
                }

                .jarvis-stat-label {
                    display: block;
                    font-size: 0.8rem;
                    opacity: 0.6;
                    margin-bottom: 5px;
                    letter-spacing: 1px;
                }

                .jarvis-stat-value {
                    display: block;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #00ff88;
                    text-shadow: 0 0 10px #00ff88;
                }

                .jarvis-hud {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                }

                .jarvis-hud-corner {
                    position: absolute;
                    width: 50px;
                    height: 50px;
                    border: 2px solid #00d4ff;
                    opacity: 0.6;
                }

                .jarvis-hud-tl {
                    top: 20px;
                    left: 20px;
                    border-right: none;
                    border-bottom: none;
                }

                .jarvis-hud-tr {
                    top: 20px;
                    right: 20px;
                    border-left: none;
                    border-bottom: none;
                }

                .jarvis-hud-bl {
                    bottom: 20px;
                    left: 20px;
                    border-right: none;
                    border-top: none;
                }

                .jarvis-hud-br {
                    bottom: 20px;
                    right: 20px;
                    border-left: none;
                    border-top: none;
                }

                .jarvis-scanline {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, #00d4ff, transparent);
                    animation: jarvis-scanline 3s linear infinite;
                    opacity: 0.7;
                }

                @keyframes jarvis-scanline {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(100vh); }
                }

                .jarvis-radar {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    width: 100px;
                    height: 100px;
                    border: 1px solid rgba(0, 212, 255, 0.3);
                    border-radius: 50%;
                    overflow: hidden;
                }

                .jarvis-radar-sweep {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 2px;
                    height: 50%;
                    background: linear-gradient(to bottom, #00d4ff, transparent);
                    transform-origin: bottom center;
                    animation: jarvis-radar-sweep 2s linear infinite;
                }

                @keyframes jarvis-radar-sweep {
                    0% { transform: translate(-50%, -100%) rotate(0deg); }
                    100% { transform: translate(-50%, -100%) rotate(360deg); }
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .jarvis-core {
                        width: 200px;
                        height: 200px;
                    }
                    
                    .jarvis-title {
                        font-size: 2rem;
                    }
                    
                    .jarvis-progress {
                        width: 300px;
                    }
                    
                    .jarvis-stats {
                        gap: 20px;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        /**
         * Create floating particles
         */
        createParticles() {
            const particlesContainer = this.container.querySelector('.jarvis-particles');
            const particleCount = 50;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'jarvis-particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 8 + 's';
                particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
                particlesContainer.appendChild(particle);
            }
        }

        /**
         * Start the loading sequence
         */
        startLoadingSequence() {
            this.updateSystemStats();
            this.progressInterval = setInterval(() => {
                this.updateProgress();
            }, 800);
        }

        /**
         * Update loading progress
         */
        updateProgress() {
            if (this.currentStep < this.loadingSteps.length) {
                const statusElement = document.getElementById('jarvis-status');
                const progressElement = document.getElementById('jarvis-progress');
                const percentageElement = document.getElementById('jarvis-percentage');

                statusElement.textContent = this.loadingSteps[this.currentStep];
                
                const progress = ((this.currentStep + 1) / this.loadingSteps.length) * 100;
                progressElement.style.width = progress + '%';
                percentageElement.textContent = Math.round(progress) + '%';

                this.currentStep++;

                if (this.currentStep >= this.loadingSteps.length) {
                    setTimeout(() => {
                        this.completeLoading();
                    }, 1500);
                }
            }
        }

        /**
         * Update system statistics
         */
        updateSystemStats() {
            const cpuElement = document.getElementById('cpu-usage');
            const memoryElement = document.getElementById('memory-usage');
            
            // Simulate system stats
            setInterval(() => {
                cpuElement.textContent = (Math.random() * 30 + 10).toFixed(1) + '%';
                memoryElement.textContent = (Math.random() * 20 + 40).toFixed(1) + '%';
            }, 1000);
        }

        /**
         * Complete loading and remove preloader
         */
        completeLoading() {
            clearInterval(this.progressInterval);

            // Final message
            const statusElement = document.getElementById('jarvis-status');
            statusElement.textContent = 'Welcome back, Sir. All systems operational.';

            // Wait for MagicMirror to be ready
            this.waitForMagicMirror();
        }

        /**
         * Wait for MagicMirror to be fully loaded
         */
        waitForMagicMirror() {
            const checkMM = () => {
                if (typeof MM !== 'undefined' && MM.getModules && MM.getModules().length > 0) {
                    // MagicMirror is ready
                    setTimeout(() => {
                        this.fadeOut();
                    }, 1500);
                } else {
                    // Keep checking
                    setTimeout(checkMM, 100);
                }
            };
            checkMM();
        }

        /**
         * Fade out the preloader
         */
        fadeOut() {
            this.container.style.opacity = '0';
            this.container.style.transition = 'opacity 1s ease-out';

            setTimeout(() => {
                this.container.remove();

                // Trigger welcome animation for Magic Mirror
                this.triggerWelcomeSequence();
            }, 1000);
        }

        /**
         * Trigger welcome sequence for Magic Mirror
         */
        triggerWelcomeSequence() {
            // Add welcome class to body for any additional animations
            document.body.classList.add('jarvis-welcome');

            // Create a subtle welcome notification
            const welcome = document.createElement('div');
            welcome.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, rgba(0, 212, 255, 0.9), rgba(0, 153, 204, 0.9));
                color: white;
                padding: 15px 25px;
                border-radius: 25px;
                font-family: 'Orbitron', monospace;
                font-size: 14px;
                z-index: 9999;
                box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3);
                animation: slideInRight 0.5s ease-out;
                opacity: 0;
                transform: translateX(100%);
            `;
            welcome.innerHTML = '🎤 JARVIS Online - Voice Control Ready';

            document.body.appendChild(welcome);

            // Animate in
            setTimeout(() => {
                welcome.style.opacity = '1';
                welcome.style.transform = 'translateX(0)';
                welcome.style.transition = 'all 0.5s ease-out';
            }, 100);

            // Remove after delay
            setTimeout(() => {
                welcome.style.opacity = '0';
                welcome.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (welcome.parentNode) {
                        welcome.parentNode.removeChild(welcome);
                    }
                }, 500);
            }, 4000);
        }
    }

    // Initialize Jarvis preloader when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new JarvisPreloader();
        });
    } else {
        new JarvisPreloader();
    }

})();
