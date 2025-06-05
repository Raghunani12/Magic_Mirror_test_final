/**
 * @file node_helper.js
 * @description Node helper for MMM-GoogleDrivePhotos module
 */

const NodeHelper = require("node_helper");
const Log = require("logger");

module.exports = NodeHelper.create({
    
    /**
     * @function start
     * @description Starts the node helper
     * @override
     */
    start() {
        Log.info(`📸 MMM-GoogleDrivePhotos node_helper started`);
    },

    /**
     * @function socketNotificationReceived
     * @description Handles socket notifications from the module
     * @override
     */
    socketNotificationReceived(notification, payload) {
        if (notification === "LOAD_GOOGLE_DRIVE_IMAGES") {
            this.loadGoogleDriveImages(payload);
        }
    },

    /**
     * @function loadGoogleDriveImages
     * @description Loads images from Google Drive folder or file IDs
     */
    async loadGoogleDriveImages(config) {
        try {
            const { folderId, fileIds, maxImages, debug } = config;

            let images = [];

            // Method 1: Use provided file IDs (most reliable)
            if (fileIds && fileIds.length > 0) {
                Log.info(`📁 Loading ${fileIds.length} images from provided file IDs`);
                images = this.getDirectImageUrls(fileIds.slice(0, maxImages));

            } else if (folderId) {
                Log.info(`📁 Loading images from Google Drive folder: ${folderId}`);

                // Method 2: Try to get images from public folder
                images = await this.getImagesFromPublicFolder(folderId, maxImages, debug);

                if (images.length === 0) {
                    // Method 3: Provide instructions for manual setup
                    Log.warn(`⚠️ Could not automatically load images from folder. Please use file IDs instead.`);
                    this.sendSocketNotification("GOOGLE_DRIVE_ERROR", {
                        error: "Could not load images from folder. Please provide individual file IDs in the config."
                    });
                    return;
                }
            } else {
                throw new Error("No folder ID or file IDs provided");
            }

            if (images.length > 0) {
                Log.info(`✅ Successfully loaded ${images.length} images from Google Drive`);
                this.sendSocketNotification("GOOGLE_DRIVE_IMAGES_LOADED", { images });
            } else {
                throw new Error("No images found");
            }

        } catch (error) {
            Log.error(`❌ Error loading Google Drive images:`, error.message);
            this.sendSocketNotification("GOOGLE_DRIVE_ERROR", { error: error.message });
        }
    },

    /**
     * @function getImagesFromPublicFolder
     * @description Gets images from a public Google Drive folder
     */
    async getImagesFromPublicFolder(folderId, maxImages, debug) {
        try {
            // Use Google Drive API v3 to list files in folder
            const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image/'&fields=files(id,name,mimeType,webContentLink,webViewLink)&key=AIzaSyDummy`;
            
            // Since we don't have an API key, we'll use a different approach
            // Try to access the folder as a public web page and parse it
            const folderUrl = `https://drive.google.com/drive/folders/${folderId}`;
            
            if (debug) {
                Log.info(`🔍 Attempting to access folder: ${folderUrl}`);
            }
            
            // For now, return empty array and use fallback method
            return [];
            
        } catch (error) {
            if (debug) {
                Log.warn(`⚠️ Public folder method failed:`, error.message);
            }
            return [];
        }
    },

    /**
     * @function getImagesFromFolderFallback
     * @description Fallback method to get images from Google Drive folder
     */
    async getImagesFromFolderFallback(folderId, maxImages, debug) {
        try {
            // Method: Use the folder's public sharing URL to get file list
            // This requires the folder to be shared with "Anyone with the link can view"
            
            const images = [];
            
            // Generate some sample image URLs for demonstration
            // In a real implementation, you would parse the folder contents
            const sampleImages = [
                {
                    id: "sample1",
                    name: "Sample Image 1.jpg",
                    url: `https://drive.google.com/uc?export=view&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`,
                    mimeType: "image/jpeg"
                },
                {
                    id: "sample2", 
                    name: "Sample Image 2.jpg",
                    url: `https://drive.google.com/uc?export=view&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`,
                    mimeType: "image/jpeg"
                }
            ];
            
            // For demonstration, we'll create URLs based on the folder ID
            // Real implementation would require parsing the shared folder page
            
            if (debug) {
                Log.info(`🔍 Using fallback method for folder: ${folderId}`);
            }
            
            // Return empty for now - user needs to provide direct file IDs
            return [];
            
        } catch (error) {
            if (debug) {
                Log.warn(`⚠️ Fallback method failed:`, error.message);
            }
            return [];
        }
    },

    /**
     * @function getDirectImageUrls
     * @description Gets direct image URLs from Google Drive file IDs
     */
    getDirectImageUrls(fileIds) {
        const images = [];
        
        fileIds.forEach((fileId, index) => {
            // Convert Google Drive file ID to direct image URL
            const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
            
            images.push({
                id: fileId,
                name: `Image ${index + 1}`,
                url: directUrl,
                mimeType: "image/jpeg"
            });
        });
        
        return images;
    },

    /**
     * @function validateGoogleDriveUrl
     * @description Validates if a URL is a valid Google Drive folder URL
     */
    validateGoogleDriveUrl(url) {
        const patterns = [
            /drive\.google\.com\/drive\/folders\/([a-zA-Z0-9-_]+)/,
            /drive\.google\.com\/.*\/folders\/([a-zA-Z0-9-_]+)/
        ];
        
        return patterns.some(pattern => pattern.test(url));
    }
});
