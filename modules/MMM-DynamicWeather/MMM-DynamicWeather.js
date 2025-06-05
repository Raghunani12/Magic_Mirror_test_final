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
        showWindDirection: true,
        showWindDirectionAsArrow: false,
        showHumidity: true,
        showFeelsLike: true,
        showSun: false,
        showMoonTimes: false,
        colored: false,
        roundTemp: true,
        degreeLabel: true,
        showDescription: false,
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
     * @description Creates the DOM object exactly like the default weather module
     * @override
     * @returns {Element} The DOM element to display
     */
    getDom() {
        const wrapper = document.createElement("div");

        if (!this.weatherData) {
            wrapper.innerHTML = this.translate("LOADING");
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        if (this.weatherData.error) {
            wrapper.innerHTML = "No weather data";
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        const weather = this.weatherData;
        const large = document.createElement("div");
        large.className = "large light";

        const degreeLabel = this.config.degreeLabel ? "°" : "";
        const temperature = Math.round(weather.temperature);

        large.innerHTML = temperature + degreeLabel;
        wrapper.appendChild(large);

        if (this.config.showDescription && weather.weatherType) {
            const small = document.createElement("div");
            small.className = "normal medium";
            small.innerHTML = this.capFirst(weather.weatherType);
            wrapper.appendChild(small);
        }

        if (this.config.showFeelsLike && weather.feelsLike) {
            const feelsLike = document.createElement("div");
            feelsLike.className = "dimmed light xsmall";
            feelsLike.innerHTML = `Feels like ${Math.round(weather.feelsLike)}${degreeLabel}`;
            wrapper.appendChild(feelsLike);
        }

        if (this.config.showHumidity && weather.humidity) {
            const humidity = document.createElement("div");
            humidity.className = "dimmed light xsmall";
            humidity.innerHTML = `Humidity: ${weather.humidity}%`;
            wrapper.appendChild(humidity);
        }

        if (this.config.showWindSpeed && weather.windSpeed) {
            const wind = document.createElement("div");
            wind.className = "dimmed light xsmall";
            wind.innerHTML = `Wind: ${Math.round(weather.windSpeed)} ${this.config.windUnits}`;
            wrapper.appendChild(wind);
        }

        return wrapper;
    },

    /**
     * @function capFirst
     * @description Capitalizes first letter of string
     */
    capFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    /**
     * @function translate
     * @description Simple translation function
     */
    translate(key) {
        const translations = {
            "LOADING": "Loading..."
        };
        return translations[key] || key;
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
