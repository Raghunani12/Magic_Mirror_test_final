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
                <div class="jarvis-minimal">
                    <div class="jarvis-spinner"></div>
                    <div class="jarvis-status-text" id="jarvis-status">Loading...</div>
                </div>
            `;

            // Add minimal CSS styles
            this.addStyles();
            // Insert into document
            document.body.appendChild(this.container);
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
                    background: #111;
                    z-index: 999999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Nunito Sans', Arial, sans-serif;
                    color: #00d4ff;
                    opacity: 1;
                    transition: opacity 0.3s ease;
                }
                .jarvis-minimal {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                .jarvis-spinner {
                    width: 48px;
                    height: 48px;
                    border: 4px solid #00d4ff33;
                    border-top: 4px solid #00d4ff;
                    border-radius: 50%;
                    animation: jarvis-spin 1s linear infinite;
                    margin-bottom: 18px;
                }
                @keyframes jarvis-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .jarvis-status-text {
                    font-size: 1.2rem;
                    color: #00d4ff;
                    letter-spacing: 0.04em;
                }
            `;
            document.head.appendChild(style);
        }

        /**
         * Start the loading sequence
         */
        startLoadingSequence() {
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

                if (statusElement) {
                    statusElement.textContent = this.loadingSteps[this.currentStep];
                }
                
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
            // This function is no longer needed as system stats are not displayed in the minimal preloader
            // Keeping it as a placeholder or remove it completely if desired later.
        }

        /**
         * Complete loading and remove preloader
         */
        completeLoading() {
            clearInterval(this.progressInterval);

            // Final message
            const statusElement = document.getElementById('jarvis-status');
            if (statusElement) {
                statusElement.textContent = 'Welcome back, Sir. All systems operational.';
            }

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
