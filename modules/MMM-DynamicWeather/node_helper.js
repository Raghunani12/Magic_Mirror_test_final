/**
 * @file node_helper.js
 * @description Node helper for MMM-DynamicWeather module
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
        Log.info(`🌤️ MMM-DynamicWeather node_helper started`);
    },

    /**
     * @function socketNotificationReceived
     * @description Handles socket notifications from the module
     * @override
     */
    socketNotificationReceived(notification, payload) {
        if (notification === "GET_WEATHER_DATA") {
            this.getWeatherData(payload);
        }
    },

    /**
     * @function getWeatherData
     * @description Fetches weather data from OpenMeteo API with enhanced error handling
     */
    async getWeatherData(config) {
        try {
            const { lat, lon, locationInfo } = config;

            // Validate coordinates
            if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
                throw new Error(`Invalid coordinates: lat=${lat}, lon=${lon}`);
            }

            Log.info(`🌤️ Fetching weather for: ${locationInfo?.city || 'unknown'} (${lat}, ${lon})`);

            // Enhanced OpenMeteo API URL with more parameters
            const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&timezone=auto&forecast_days=1`;

            Log.info(`🌐 API Request: ${apiUrl}`);

            const response = await fetch(apiUrl, {
                timeout: 10000, // 10 second timeout
                headers: {
                    'User-Agent': 'MagicMirror-DynamicWeather/1.0'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            Log.info(`📡 API Response:`, JSON.stringify(data, null, 2));

            if (!data.current) {
                throw new Error("Invalid weather data received - missing current data");
            }

            // Parse weather data with validation
            const weatherData = {
                temperature: this.validateNumber(data.current.temperature_2m, 'temperature'),
                feelsLike: this.validateNumber(data.current.apparent_temperature, 'feelsLike'),
                humidity: this.validateNumber(data.current.relative_humidity_2m, 'humidity'),
                windSpeed: this.validateNumber(data.current.wind_speed_10m, 'windSpeed'),
                windDirection: this.validateNumber(data.current.wind_direction_10m, 'windDirection'),
                pressure: this.validateNumber(data.current.surface_pressure, 'pressure'),
                weatherCode: data.current.weather_code || 0,
                weatherType: this.getWeatherType(data.current.weather_code),
                locationInfo: locationInfo || { city: 'Unknown', country: 'Unknown' },
                timestamp: new Date().toISOString(),
                units: {
                    temperature: "°C",
                    windSpeed: "km/h",
                    humidity: "%",
                    pressure: "hPa"
                },
                source: "OpenMeteo API"
            };

            Log.info(`✅ Weather data retrieved: ${weatherData.temperature}°C, ${weatherData.weatherType} for ${weatherData.locationInfo.city}`);

            this.sendSocketNotification("WEATHER_DATA", weatherData);

        } catch (error) {
            Log.error(`❌ Weather API error for ${config.locationInfo?.city || 'unknown location'}:`, error.message);
            this.sendSocketNotification("WEATHER_ERROR", {
                error: error.message,
                locationInfo: config.locationInfo || { city: 'Unknown', country: 'Unknown' },
                timestamp: new Date().toISOString()
            });
        }
    },

    /**
     * @function validateNumber
     * @description Validates and returns a number or null if invalid
     */
    validateNumber(value, fieldName) {
        if (value === null || value === undefined || isNaN(value)) {
            Log.warn(`⚠️ Invalid ${fieldName} value: ${value}`);
            return null;
        }
        return parseFloat(value);
    },

    /**
     * @function getWeatherType
     * @description Converts weather code to weather type with enhanced mapping
     */
    getWeatherType(weatherCode) {
        // Enhanced OpenMeteo weather codes mapping
        const weatherCodes = {
            0: 'clear-day',           // Clear sky
            1: 'partly-cloudy-day',   // Mainly clear
            2: 'partly-cloudy-day',   // Partly cloudy
            3: 'cloudy',              // Overcast
            45: 'fog',                // Fog
            48: 'fog',                // Depositing rime fog
            51: 'rain',               // Light drizzle
            53: 'rain',               // Moderate drizzle
            55: 'rain',               // Dense drizzle
            56: 'sleet',              // Light freezing drizzle
            57: 'sleet',              // Dense freezing drizzle
            61: 'rain',               // Slight rain
            63: 'rain',               // Moderate rain
            65: 'rain',               // Heavy rain
            66: 'sleet',              // Light freezing rain
            67: 'sleet',              // Heavy freezing rain
            71: 'snow',               // Slight snow fall
            73: 'snow',               // Moderate snow fall
            75: 'snow',               // Heavy snow fall
            77: 'snow',               // Snow grains
            80: 'rain',               // Slight rain showers
            81: 'rain',               // Moderate rain showers
            82: 'rain',               // Violent rain showers
            85: 'snow',               // Slight snow showers
            86: 'snow',               // Heavy snow showers
            95: 'thunderstorm',       // Thunderstorm
            96: 'thunderstorm',       // Thunderstorm with slight hail
            99: 'thunderstorm'        // Thunderstorm with heavy hail
        };

        const weatherType = weatherCodes[weatherCode] || 'cloudy';
        Log.info(`🌤️ Weather code ${weatherCode} mapped to: ${weatherType}`);
        return weatherType;
    }
}
});
