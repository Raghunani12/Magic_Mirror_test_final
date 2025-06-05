/**
 * @file MMM-DynamicWeather.js
 *
 * @author Augment Agent
 * @license MIT
 *
 * @description A weather module that automatically updates location based on MMM-SimpleLocation
 */

/* global Module Log */

/**
 * @module MMM-DynamicWeather
 * @description Weather module with dynamic location updates from MMM-SimpleLocation
 */
Module.register('MMM-DynamicWeather', {
    
    /**
     * @member {Object} defaults - Defines the default config values.
     */
    defaults: {
        weatherProvider: "openmeteo",
        type: "current",
        lat: 28.6139, // Fallback coordinates (New Delhi)
        lon: 77.2090,
        units: "metric",
        tempUnits: "metric",
        windUnits: "metric",
        updateInterval: 10 * 60 * 1000, // 10 minutes
        animationSpeed: 1000,
        showDescription: false, // Keep it simple
        useLocationFromSimpleLocation: true, // Enable dynamic location updates
        locationUpdateDelay: 5000, // Wait 5 seconds after location update before fetching weather
        debug: false
    },

    /**
     * @member {Object} currentLocation - Stores current location data
     */
    currentLocation: null,
    
    /**
     * @member {Object} weatherData - Stores current weather data
     */
    weatherData: null,
    
    /**
     * @member {boolean} locationReceived - Flag to track if location data was received
     */
    locationReceived: false,

    /**
     * @function start
     * @description Starts the module
     * @override
     */
    start() {
        Log.info(`🌤️ Starting MMM-DynamicWeather`);
        
        // Set initial location from config
        this.currentLocation = {
            latitude: this.config.lat,
            longitude: this.config.lon,
            city: "Unknown",
            country: "Unknown",
            source: "config"
        };
        
        // Start weather updates
        this.scheduleWeatherUpdate();
        
        // Request initial weather data
        this.getWeatherData();
    },

    /**
     * @function notificationReceived
     * @description Handles notifications from other modules
     * @override
     */
    notificationReceived(notification, payload, sender) {
        if (this.config.useLocationFromSimpleLocation) {
            if (notification === "LOCATION_DATA_UPDATED" || notification === "WEATHER_LOCATION_UPDATE") {
                Log.info(`🌍 Received location update from ${sender?.name || 'unknown'}:`, payload);
                this.updateLocation(payload);
            }
        }
        
        // Handle other weather-related notifications
        if (notification === "WEATHER_REFRESH") {
            this.getWeatherData();
        }
    },

    /**
     * @function updateLocation
     * @description Updates the weather location based on received data
     */
    updateLocation(locationData) {
        if (locationData && locationData.latitude && locationData.longitude) {
            const oldLocation = this.currentLocation;
            
            this.currentLocation = {
                latitude: parseFloat(locationData.latitude || locationData.lat),
                longitude: parseFloat(locationData.longitude || locationData.lon),
                city: locationData.city || "Unknown",
                country: locationData.country || "Unknown",
                source: locationData.source || "external"
            };
            
            // Check if location actually changed
            const locationChanged = !oldLocation || 
                Math.abs(oldLocation.latitude - this.currentLocation.latitude) > 0.01 ||
                Math.abs(oldLocation.longitude - this.currentLocation.longitude) > 0.01;
            
            if (locationChanged) {
                Log.info(`📍 Weather location updated: ${this.currentLocation.city}, ${this.currentLocation.country}`);
                Log.info(`🗺️ Coordinates: ${this.currentLocation.latitude}, ${this.currentLocation.longitude}`);
                Log.info(`📡 Source: ${this.currentLocation.source}`);
                
                this.locationReceived = true;
                
                // Update the weather data with new location after a short delay
                setTimeout(() => {
                    this.getWeatherData();
                }, this.config.locationUpdateDelay);
                
                // Update DOM to show location change
                this.updateDom(this.config.animationSpeed);
            }
        } else {
            Log.warn(`⚠️ Invalid location data received:`, locationData);
        }
    },

    /**
     * @function getWeatherData
     * @description Requests weather data from node_helper
     */
    getWeatherData() {
        if (!this.currentLocation) {
            Log.warn(`⚠️ No location data available for weather request`);
            return;
        }
        
        const weatherConfig = {
            ...this.config,
            lat: this.currentLocation.latitude,
            lon: this.currentLocation.longitude,
            locationInfo: {
                city: this.currentLocation.city,
                country: this.currentLocation.country,
                source: this.currentLocation.source
            }
        };
        
        Log.info(`🌤️ Requesting weather data for: ${this.currentLocation.city} (${this.currentLocation.latitude}, ${this.currentLocation.longitude})`);
        
        this.sendSocketNotification("GET_WEATHER_DATA", weatherConfig);
    },

    /**
     * @function socketNotificationReceived
     * @description Handles socket notifications from node_helper
     * @override
     */
    socketNotificationReceived(notification, payload) {
        if (notification === "WEATHER_DATA") {
            Log.info(`🌤️ Weather data received for ${payload.locationInfo?.city || 'unknown location'}`);
            this.weatherData = payload;
            this.updateDom(this.config.animationSpeed);
        } else if (notification === "WEATHER_ERROR") {
            Log.error(`❌ Weather error:`, payload);
            this.weatherData = { error: payload.error || "Weather data unavailable" };
            this.updateDom(this.config.animationSpeed);
        }
    },

    /**
     * @function scheduleWeatherUpdate
     * @description Schedules periodic weather updates
     */
    scheduleWeatherUpdate() {
        setInterval(() => {
            this.getWeatherData();
        }, this.config.updateInterval);
    },

    /**
     * @function getDom
     * @description Creates the DOM object for the module (simplified, default weather styling)
     * @override
     * @returns {Element} The DOM element to display
     */
    getDom() {
        const wrapper = document.createElement("div");
        wrapper.className = "weather";

        if (!this.weatherData) {
            wrapper.innerHTML = "Loading weather...";
            wrapper.className = "weather dimmed";
            return wrapper;
        }

        if (this.weatherData.error) {
            wrapper.innerHTML = "Weather unavailable";
            wrapper.className = "weather dimmed";
            return wrapper;
        }

        // Create simple weather display using default weather module styling
        const weather = this.weatherData;

        // Main temperature display
        const tempElement = document.createElement("div");
        tempElement.className = "large light";
        tempElement.innerHTML = Math.round(weather.temperature) + "°";
        wrapper.appendChild(tempElement);

        // Weather description (optional)
        if (this.config.showDescription) {
            const descElement = document.createElement("div");
            descElement.className = "small dimmed";
            descElement.innerHTML = weather.weatherType;
            wrapper.appendChild(descElement);
        }

        return wrapper;
    },

    /**
     * @function getStyles
     * @description Use default MagicMirror styles
     * @override
     * @returns {Array} Array of stylesheet paths
     */
    getStyles() {
        return []; // Use default MagicMirror styling
    }
});
