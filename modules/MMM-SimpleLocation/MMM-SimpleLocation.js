/**
 * @file MMM-SimpleLocation.js
 *
 * @author Augment Agent
 * @license MIT
 *
 * @description A chaos dev IP geolocation module for MagicMirror
 */

/* global Module Log */

/**
 * @module MMM-SimpleLocation
 * @description Frontend for the module to display real-time IP-based location data.
 */
Module.register('MMM-SimpleLocation', {

    /**
     * @member {Object} defaults - Defines the default config values.
     */
    defaults: {
        fontSize: 18,
        dimmed: true,
        city: "New Delhi", // Fallback city
        country: "India", // Fallback country
        showCity: true,
        showCountry: true,
        showFlag: false,
        lang: "en",
        updateInterval: 30 * 60 * 1000, // 30 minutes
        useGeolocation: true, // Always use IP geolocation by default
        apiUrl: "https://ipapi.co/json/", // Primary API
        fallbackApis: [
            "http://ip-api.com/json/",
            "https://ipinfo.io/json",
            "https://api.ipify.org?format=json" // IP only, for debugging
        ],
        retryAttempts: 3,
        retryDelay: 5000 // 5 seconds
    },

    /**
     * @member {Object} locationData - Stores current location information
     */
    locationData: null,

    /**
     * @member {number} currentApiIndex - Current API being used
     */
    currentApiIndex: 0,

    /**
     * @member {number} retryCount - Current retry attempt
     */
    retryCount: 0,

    /**
     * @function start
     * @description Starts the module and initializes location data
     * @override
     */
    start() {
        Log.info(`🌍 Starting MMM-SimpleLocation (Chaos Dev Edition)`);

        if (this.config.useGeolocation) {
            Log.info(`🔍 Fetching location via IP geolocation...`);
            this.getLocationFromAPI();
            this.scheduleUpdate();
        } else {
            Log.info(`📍 Using static location: ${this.config.city}, ${this.config.country}`);
            this.locationData = {
                city: this.config.city,
                country: this.config.country,
                source: "static"
            };
            this.updateDom();
        }
    },

    /**
     * @function getLocationFromAPI
     * @description Fetches location data from IP geolocation API with fallbacks
     */
    getLocationFromAPI() {
        const self = this;
        const apiUrl = this.config.apiUrl;

        Log.info(`🌐 Attempting to fetch location from: ${apiUrl}`);

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                Log.info(`✅ Location API response:`, data);

                // Handle different API response formats
                let city, country;

                if (data.city && data.country) {
                    // ipapi.co format
                    city = data.city;
                    country = data.country;
                } else if (data.city && data.country_name) {
                    // ip-api.com format
                    city = data.city;
                    country = data.country_name;
                } else if (data.city && data.country_code) {
                    // ipinfo.io format
                    city = data.city;
                    country = data.country_code;
                } else {
                    throw new Error("Invalid API response format");
                }

                if (city && country) {
                    self.locationData = {
                        city: city,
                        country: country,
                        source: "api",
                        api: apiUrl,
                        lastUpdate: new Date().toISOString()
                    };
                    self.retryCount = 0; // Reset retry count on success
                    Log.info(`🎯 Location detected: ${city}, ${country}`);
                    self.updateDom();
                } else {
                    throw new Error("Missing city or country in response");
                }
            })
            .catch(error => {
                Log.error(`❌ Error fetching location from ${apiUrl}:`, error.message);
                self.handleAPIError();
            });
    },

    /**
     * @function handleAPIError
     * @description Handles API errors with fallback strategies
     */
    handleAPIError() {
        this.retryCount++;

        if (this.retryCount <= this.config.retryAttempts) {
            Log.warn(`🔄 Retrying in ${this.config.retryDelay/1000}s (attempt ${this.retryCount}/${this.config.retryAttempts})`);
            setTimeout(() => {
                this.tryFallbackAPI();
            }, this.config.retryDelay);
        } else {
            Log.error(`💥 All API attempts failed. Using fallback location.`);
            this.useFallbackLocation();
        }
    },

    /**
     * @function tryFallbackAPI
     * @description Tries the next fallback API
     */
    tryFallbackAPI() {
        if (this.currentApiIndex < this.config.fallbackApis.length) {
            this.config.apiUrl = this.config.fallbackApis[this.currentApiIndex];
            this.currentApiIndex++;
            Log.info(`🔄 Trying fallback API: ${this.config.apiUrl}`);
            this.getLocationFromAPI();
        } else {
            Log.error(`💥 All fallback APIs exhausted.`);
            this.useFallbackLocation();
        }
    },

    /**
     * @function useFallbackLocation
     * @description Uses the configured fallback location
     */
    useFallbackLocation() {
        this.locationData = {
            city: this.config.city,
            country: this.config.country,
            source: "fallback",
            lastUpdate: new Date().toISOString()
        };
        Log.warn(`⚠️ Using fallback location: ${this.config.city}, ${this.config.country}`);
        this.updateDom();
    },

    /**
     * @function scheduleUpdate
     * @description Schedules the next location update
     */
    scheduleUpdate() {
        const self = this;
        setInterval(() => {
            if (self.config.useGeolocation) {
                self.getLocationFromAPI();
            }
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
        wrapper.className = `MMM-SimpleLocation ${this.config.dimmed ? "dimmed" : ""}`;
        wrapper.style.fontSize = this.config.fontSize + "px";
        wrapper.style.lineHeight = (this.config.fontSize + 2) + "px";

        if (!this.locationData) {
            wrapper.innerHTML = `
                <div class="loading">
                    <span class="loading-icon">🌍</span>
                    <span class="loading-text">Detecting location...</span>
                </div>
            `;
            return wrapper;
        }

        let locationText = "";
        let sourceIcon = "";

        // Add source indicator
        switch(this.locationData.source) {
            case "api":
                sourceIcon = "🌐";
                break;
            case "static":
                sourceIcon = "📍";
                break;
            case "fallback":
                sourceIcon = "⚠️";
                break;
            default:
                sourceIcon = "❓";
        }

        if (this.config.showCity && this.locationData.city) {
            locationText += this.locationData.city;
        }

        if (this.config.showCountry && this.locationData.country) {
            if (locationText) {
                locationText += ", ";
            }
            locationText += this.locationData.country;
        }

        const finalText = locationText || "Location unavailable";

        wrapper.innerHTML = `
            <div class="location-container">
                <span class="location-icon">${sourceIcon}</span>
                <span class="location-text">${finalText}</span>
            </div>
        `;

        // Add debug info in console
        if (this.locationData.source === "api") {
            Log.info(`📍 Displaying: ${finalText} (via ${this.locationData.api})`);
        }

        return wrapper;
    },

    /**
     * @function getStyles
     * @description Returns the stylesheets needed for this module
     * @override
     * @returns {Array} Array of stylesheet paths
     */
    getStyles() {
        return ["MMM-SimpleLocation.css"];
    }
});
