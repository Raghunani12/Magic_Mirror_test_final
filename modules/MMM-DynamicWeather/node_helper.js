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
     * @description Fetches weather data from OpenMeteo API
     */
    async getWeatherData(config) {
        try {
            const { lat, lon, locationInfo } = config;
            
            Log.info(`🌤️ Fetching weather for: ${locationInfo?.city || 'unknown'} (${lat}, ${lon})`);
            
            // OpenMeteo API URL
            const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m&timezone=auto&forecast_days=1`;
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data.current) {
                throw new Error("Invalid weather data received");
            }
            
            // Parse weather data
            const weatherData = {
                temperature: data.current.temperature_2m,
                feelsLike: data.current.apparent_temperature,
                humidity: data.current.relative_humidity_2m,
                windSpeed: data.current.wind_speed_10m,
                windDirection: data.current.wind_direction_10m,
                weatherCode: data.current.weather_code,
                weatherType: this.getWeatherType(data.current.weather_code),
                locationInfo: locationInfo,
                timestamp: new Date().toISOString(),
                units: {
                    temperature: "°C",
                    windSpeed: "km/h",
                    humidity: "%"
                }
            };
            
            Log.info(`✅ Weather data retrieved: ${weatherData.temperature}°C, ${weatherData.weatherType}`);
            
            this.sendSocketNotification("WEATHER_DATA", weatherData);
            
        } catch (error) {
            Log.error(`❌ Weather API error:`, error.message);
            this.sendSocketNotification("WEATHER_ERROR", {
                error: error.message,
                locationInfo: config.locationInfo
            });
        }
    },

    /**
     * @function getWeatherType
     * @description Converts weather code to weather type
     */
    getWeatherType(weatherCode) {
        // OpenMeteo weather codes mapping
        const weatherCodes = {
            0: 'clear-day',
            1: 'partly-cloudy-day',
            2: 'partly-cloudy-day',
            3: 'cloudy',
            45: 'fog',
            48: 'fog',
            51: 'rain',
            53: 'rain',
            55: 'rain',
            56: 'sleet',
            57: 'sleet',
            61: 'rain',
            63: 'rain',
            65: 'rain',
            66: 'sleet',
            67: 'sleet',
            71: 'snow',
            73: 'snow',
            75: 'snow',
            77: 'snow',
            80: 'rain',
            81: 'rain',
            82: 'rain',
            85: 'snow',
            86: 'snow',
            95: 'thunderstorm',
            96: 'thunderstorm',
            99: 'thunderstorm'
        };
        
        return weatherCodes[weatherCode] || 'cloudy';
    }
});
