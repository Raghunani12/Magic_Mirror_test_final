/**
 * @file preload.js
 * @description Minimalistic preloader for Magic Mirror
 * @author Augment Agent
 * @license MIT
 */

(function() {
    'use strict';

    /**
     * Minimalistic Preloader Class
     * Creates a clean, simple loading experience
     */
    class MinimalisticPreloader {
        constructor() {
            this.loadingSteps = [
                'Loading modules...',
                'Connecting services...',
                'Initializing display...',
                'Ready'
            ];
            this.currentStep = 0;
            this.isLoading = true;
            this.startTime = Date.now();

            this.createPreloader();
            this.startLoadingSequence();
        }

        /**
         * Create the minimalistic preloader interface
         */
        createPreloader() {
            // Create main preloader container
            this.container = document.createElement('div');
            this.container.id = 'minimalistic-preloader';
            this.container.innerHTML = `
                <div class="preloader-content">
                    <div class="preloader-logo">
                        <div class="spinner"></div>
                    </div>
                    <div class="preloader-text">
                        <h1>MagicMirror</h1>
                        <div class="status-text" id="status-text">Loading...</div>
                        <div class="progress-container">
                            <div class="progress-bar" id="progress-bar"></div>
                        </div>
                    </div>
                </div>
            `;

            // Add CSS styles
            this.addStyles();

            // Insert into document
            document.body.appendChild(this.container);

            // Start animations
            setTimeout(() => {
                this.container.classList.add('active');
            }, 100);
        }

        /**
         * Add minimalistic CSS styles
         */
        addStyles() {
            const style = document.createElement('style');
            style.textContent = `
                #minimalistic-preloader {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: #000000;
                    z-index: 999999;
                    overflow: hidden;
                    font-family: 'Nunito Sans', sans-serif;
                    color: #ffffff;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                #minimalistic-preloader.active {
                    opacity: 1;
                }

                .preloader-content {
                    text-align: center;
                    max-width: 400px;
                    padding: 40px;
                }

                .preloader-logo {
                    margin-bottom: 40px;
                }

                .spinner {
                    width: 60px;
                    height: 60px;
                    border: 3px solid rgba(255, 255, 255, 0.1);
                    border-top: 3px solid #ffffff;
                    border-radius: 50%;
                    margin: 0 auto;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .preloader-text h1 {
                    font-size: 2.5rem;
                    font-weight: 300;
                    margin: 0 0 20px 0;
                    letter-spacing: 2px;
                    color: #ffffff;
                }

                .status-text {
                    font-size: 1rem;
                    margin-bottom: 30px;
                    opacity: 0.8;
                    min-height: 24px;
                    transition: opacity 0.3s ease;
                }

                .progress-container {
                    width: 100%;
                    height: 2px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 1px;
                    overflow: hidden;
                    margin-top: 20px;
                }

                .progress-bar {
                    height: 100%;
                    background: #ffffff;
                    width: 0%;
                    transition: width 0.3s ease;
                    border-radius: 1px;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .preloader-content {
                        padding: 20px;
                        max-width: 300px;
                    }

                    .preloader-text h1 {
                        font-size: 2rem;
                    }

                    .spinner {
                        width: 50px;
                        height: 50px;
                    }
                }

                @media (max-width: 480px) {
                    .preloader-text h1 {
                        font-size: 1.5rem;
                    }

                    .status-text {
                        font-size: 0.9rem;
                    }
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
            }, 1000);
        }

        /**
         * Update loading progress
         */
        updateProgress() {
            if (this.currentStep < this.loadingSteps.length) {
                const statusElement = document.getElementById('status-text');
                const progressElement = document.getElementById('progress-bar');

                statusElement.textContent = this.loadingSteps[this.currentStep];

                const progress = ((this.currentStep + 1) / this.loadingSteps.length) * 100;
                progressElement.style.width = progress + '%';

                this.currentStep++;

                if (this.currentStep >= this.loadingSteps.length) {
                    setTimeout(() => {
                        this.completeLoading();
                    }, 1000);
                }
            }
        }

        /**
         * Complete loading and remove preloader
         */
        completeLoading() {
            clearInterval(this.progressInterval);

            // Final message
            const statusElement = document.getElementById('status-text');
            statusElement.textContent = 'Ready';

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
                    }, 800);
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
            this.container.style.transition = 'opacity 0.5s ease-out';

            setTimeout(() => {
                this.container.remove();
            }, 500);
        }
    }

    // Initialize minimalistic preloader when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new MinimalisticPreloader();
        });
    } else {
        new MinimalisticPreloader();
    }

})();
