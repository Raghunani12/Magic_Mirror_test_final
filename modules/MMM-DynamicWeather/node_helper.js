/**
 * @file node_helper.js
 * @description Node helper for MMM-DynamicWeather module (Enhanced with auto IP-based geolocation)
 */

const NodeHelper = require("node_helper");
const Log = require("logger");

module.exports = NodeHelper.create({

    start() {
        Log.info(`🌤️ MMM-DynamicWeather node_helper started`);
    },

    socketNotificationReceived(notification, payload) {
        if (notification === "GET_WEATHER_DATA") {
            this.getWeatherData(payload);
        }
    },

    async getWeatherData(config) {
        try {
            let { lat, lon, locationInfo } = config;

            // Step 1: Validate coordinates or fallback to IP-based geolocation
            if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
                Log.warn(`📍 No valid coordinates provided. Attempting IP-based geolocation...`);

                try {
                    const geoRes = await fetch('https://ipapi.co/json/');
                    if (!geoRes.ok) {
                        throw new Error(`Geo API error: ${geoRes.status} ${geoRes.statusText}`);
                    }

                    const geoData = await geoRes.json();
                    lat = parseFloat(geoData.latitude);
                    lon = parseFloat(geoData.longitude);
                    locationInfo = {
                        city: geoData.city,
                        country: geoData.country_name
                    };

                    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
                        throw new Error(`IP-based geolocation failed: lat=${lat}, lon=${lon}`);
                    }

                    Log.info(`📍 Location (via IP): ${locationInfo.city}, ${locationInfo.country} (${lat}, ${lon})`);

                } catch (geoError) {
                    Log.error(`❌ Failed to auto-detect location from IP: ${geoError.message}`);
                    this.sendSocketNotification("WEATHER_ERROR", {
                        error: geoError.message,
                        locationInfo: { city: 'Unknown', country: 'Unknown' },
                        timestamp: new Date().toISOString()
                    });
                    return;
                }
            }

            // Step 2: Fetch weather from OpenMeteo
            const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&timezone=auto&forecast_days=1`;

            Log.info(`🌤️ Fetching weather for: ${locationInfo?.city || 'Unknown'} (${lat}, ${lon})`);
            Log.info(`🌐 API Request: ${apiUrl}`);

            const response = await fetch(apiUrl, {
                timeout: 10000,
                headers: { 'User-Agent': 'MagicMirror-DynamicWeather/1.0' }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.current) {
                throw new Error("Invalid weather data received - missing 'current'");
            }

            // Step 3: Parse and validate weather data
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

            Log.info(`✅ Weather: ${weatherData.temperature}°C, ${weatherData.weatherType} in ${weatherData.locationInfo.city}`);

            this.sendSocketNotification("WEATHER_DATA", weatherData);

        } catch (error) {
            Log.error(`❌ Weather API error for ${config.locationInfo?.city || 'unknown'}: ${error.message}`);
            this.sendSocketNotification("WEATHER_ERROR", {
                error: error.message,
                locationInfo: config.locationInfo || { city: 'Unknown', country: 'Unknown' },
                timestamp: new Date().toISOString()
            });
        }
    },

    validateNumber(value, fieldName) {
        if (value === null || value === undefined || isNaN(value)) {
            Log.warn(`⚠️ Invalid ${fieldName} value: ${value}`);
            return null;
        }
        return parseFloat(value);
    },

    getWeatherType(weatherCode) {
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

        const weatherType = weatherCodes[weatherCode] || 'cloudy';
        Log.info(`🌤️ Weather code ${weatherCode} ➜ ${weatherType}`);
        return weatherType;
    }
});
