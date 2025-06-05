/**
 * @file MMM-GoogleDrivePhotos.js
 *
 * @author Augment Agent
 * @license MIT
 *
 * @description A MagicMirror module to display photos from shared Google Drive folders
 */

/* global Module Log */

/**
 * @module MMM-GoogleDrivePhotos
 * @description Displays photos from Google Drive shared folders
 */
Module.register('MMM-GoogleDrivePhotos', {
    
    /**
     * @member {Object} defaults - Defines the default config values.
     */
    defaults: {
        // PRODUCTION OPTION 1: Public website URL (gdrive-index, DriveToWeb, etc.)
        publicWebsiteUrl: "", // URL to your public Google Drive website
        driveToWebUrl: "", // DriveToWeb URL (alternative to publicWebsiteUrl)

        // PRODUCTION OPTION 2: Individual file IDs
        fileIds: [], // Array of individual Google Drive file IDs

        // FALLBACK OPTION: Direct Google Drive folder (limited functionality)
        googleDriveFolderUrl: "", // Shared Google Drive folder URL
        folderId: "", // Extracted folder ID (auto-extracted from URL)

        // Display settings
        slideshowSpeed: 10 * 1000, // 10 seconds per image
        delayUntilRestart: 0, // Delay before restarting slideshow
        fixedImageWidth: 300, // Fixed width for images
        fixedImageHeight: 200, // Fixed height for images
        randomizeImageOrder: true, // Randomize image display order
        makeImagesGrayscale: false, // Convert to grayscale for dark theme
        maxImages: 50, // Maximum number of images to load
        updateInterval: 60 * 60 * 1000, // Check for new images every hour
        showImageInfo: false, // Show image filename
        transitionSpeed: 1000, // Fade transition speed
        debug: false
    },

    /**
     * @member {Array} imageList - Stores list of images from Google Drive
     */
    imageList: [],
    
    /**
     * @member {number} currentImageIndex - Current image being displayed
     */
    currentImageIndex: 0,
    
    /**
     * @member {Object} slideshowTimer - Timer for slideshow
     */
    slideshowTimer: null,

    /**
     * @function start
     * @description Starts the module
     * @override
     */
    start() {
        Log.info(`📸 Starting MMM-GoogleDrivePhotos`);
        
        // Extract folder ID from URL if provided
        if (this.config.googleDriveFolderUrl && !this.config.folderId) {
            this.config.folderId = this.extractFolderIdFromUrl(this.config.googleDriveFolderUrl);
        }
        
        if (!this.config.folderId) {
            Log.error(`❌ No Google Drive folder ID provided`);
            return;
        }
        
        // Load images from Google Drive
        this.loadImagesFromGoogleDrive();
        
        // Schedule periodic updates
        this.scheduleUpdate();
    },

    /**
     * @function extractFolderIdFromUrl
     * @description Extracts folder ID from Google Drive URL
     */
    extractFolderIdFromUrl(url) {
        // Handle different Google Drive URL formats
        const patterns = [
            /\/folders\/([a-zA-Z0-9-_]+)/,
            /id=([a-zA-Z0-9-_]+)/,
            /\/drive\/folders\/([a-zA-Z0-9-_]+)/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                Log.info(`📁 Extracted folder ID: ${match[1]}`);
                return match[1];
            }
        }
        
        Log.warn(`⚠️ Could not extract folder ID from URL: ${url}`);
        return null;
    },

    /**
     * @function loadImagesFromGoogleDrive
     * @description Loads images from Google Drive folder or file IDs
     */
    loadImagesFromGoogleDrive() {
        if (this.config.fileIds && this.config.fileIds.length > 0) {
            Log.info(`🔄 Loading ${this.config.fileIds.length} images from file IDs`);
        } else {
            Log.info(`🔄 Loading images from Google Drive folder: ${this.config.folderId}`);
        }

        this.sendSocketNotification("LOAD_GOOGLE_DRIVE_IMAGES", {
            publicWebsiteUrl: this.config.publicWebsiteUrl,
            driveToWebUrl: this.config.driveToWebUrl,
            folderId: this.config.folderId,
            fileIds: this.config.fileIds,
            maxImages: this.config.maxImages,
            debug: this.config.debug
        });
    },

    /**
     * @function socketNotificationReceived
     * @description Handles socket notifications from node_helper
     * @override
     */
    socketNotificationReceived(notification, payload) {
        if (notification === "GOOGLE_DRIVE_IMAGES_LOADED") {
            Log.info(`📸 Received ${payload.images.length} images from Google Drive`);
            this.imageList = payload.images;
            
            if (this.config.randomizeImageOrder) {
                this.shuffleArray(this.imageList);
            }
            
            this.currentImageIndex = 0;
            this.startSlideshow();
            this.updateDom(this.config.transitionSpeed);
            
        } else if (notification === "GOOGLE_DRIVE_ERROR") {
            Log.error(`❌ Google Drive error:`, payload.error);
            this.imageList = [];
            this.updateDom();
        }
    },

    /**
     * @function shuffleArray
     * @description Randomizes array order
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    },

    /**
     * @function startSlideshow
     * @description Starts the image slideshow
     */
    startSlideshow() {
        if (this.slideshowTimer) {
            clearInterval(this.slideshowTimer);
        }
        
        if (this.imageList.length === 0) {
            return;
        }
        
        this.slideshowTimer = setInterval(() => {
            this.nextImage();
        }, this.config.slideshowSpeed);
    },

    /**
     * @function nextImage
     * @description Advances to next image
     */
    nextImage() {
        if (this.imageList.length === 0) {
            return;
        }
        
        this.currentImageIndex = (this.currentImageIndex + 1) % this.imageList.length;
        
        // If we've completed a full cycle, optionally delay and reshuffle
        if (this.currentImageIndex === 0 && this.config.delayUntilRestart > 0) {
            clearInterval(this.slideshowTimer);
            setTimeout(() => {
                if (this.config.randomizeImageOrder) {
                    this.shuffleArray(this.imageList);
                }
                this.startSlideshow();
            }, this.config.delayUntilRestart);
        }
        
        this.updateDom(this.config.transitionSpeed);
    },

    /**
     * @function scheduleUpdate
     * @description Schedules periodic updates to check for new images
     */
    scheduleUpdate() {
        setInterval(() => {
            Log.info(`🔄 Checking for new images in Google Drive folder`);
            this.loadImagesFromGoogleDrive();
        }, this.config.updateInterval);
    },

    /**
     * @function getDom
     * @description Creates the DOM object for the module
     * @override
     * @returns {Element} The DOM element to display
     */
    getDom() {
        const wrapper = document.createElement("div");
        wrapper.className = "MMM-GoogleDrivePhotos";

        if (this.imageList.length === 0) {
            wrapper.innerHTML = `
                <div class="loading-message">
                    <div class="loading-icon">📸</div>
                    <div class="loading-text">Loading photos from Google Drive...</div>
                </div>
            `;
            wrapper.className += " loading";
            return wrapper;
        }

        const currentImage = this.imageList[this.currentImageIndex];
        
        const imageContainer = document.createElement("div");
        imageContainer.className = "image-container";
        
        const img = document.createElement("img");
        img.src = currentImage.url;
        img.alt = currentImage.name || "Google Drive Photo";
        img.className = "slideshow-image";
        
        // Apply fixed dimensions
        if (this.config.fixedImageWidth) {
            img.style.width = this.config.fixedImageWidth + "px";
        }
        if (this.config.fixedImageHeight) {
            img.style.height = this.config.fixedImageHeight + "px";
        }
        
        // Apply grayscale filter if enabled
        if (this.config.makeImagesGrayscale) {
            img.style.filter = "grayscale(100%)";
        }
        
        img.style.objectFit = "cover";
        img.style.borderRadius = "8px";
        
        imageContainer.appendChild(img);
        
        // Add image info if enabled
        if (this.config.showImageInfo && currentImage.name) {
            const imageInfo = document.createElement("div");
            imageInfo.className = "image-info";
            imageInfo.innerHTML = currentImage.name;
            imageContainer.appendChild(imageInfo);
        }
        
        wrapper.appendChild(imageContainer);
        
        return wrapper;
    },

    /**
     * @function getStyles
     * @description Returns the stylesheets needed for this module
     * @override
     * @returns {Array} Array of stylesheet paths
     */
    getStyles() {
        return ["MMM-GoogleDrivePhotos.css"];
    }
});
