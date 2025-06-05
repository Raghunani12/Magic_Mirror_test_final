# 🌤️ MMM-DynamicWeather

A smart weather module for MagicMirror² that automatically updates its location based on real-time IP geolocation from MMM-SimpleLocation.

## ✨ Features

- **🌍 Dynamic Location Updates** - Automatically uses your real location from MMM-SimpleLocation
- **🔄 Multiple Location Sources** - Supports API, static, and fallback location data
- **📡 Real-time Weather Data** - Uses OpenMeteo API for accurate weather information
- **🎯 Visual Status Indicators** - Shows location source (API/static/fallback)
- **⚡ Smart Updates** - Only fetches new weather when location changes
- **🎨 Modern UI** - Clean, responsive design with smooth animations
- **🌐 Cross-platform** - Works on Linux, macOS, and Windows

## 🚀 How It Works

1. **MMM-SimpleLocation** detects your real location via IP geolocation
2. **MMM-DynamicWeather** receives the location update automatically
3. **Weather data** is fetched for your actual location
4. **Display updates** with current weather for your real location

## 📋 Installation

This module is already installed and configured in your Magic Mirror setup.

## 🔧 Configuration

```javascript
{
    module: "MMM-DynamicWeather",
    position: "top_bar",
    header: "Current Weather",
    config: {
        weatherProvider: "openmeteo",
        type: "current",
        lat: 28.6139, // Fallback coordinates
        lon: 77.2090, // Fallback coordinates
        units: "metric",
        tempUnits: "metric",
        windUnits: "metric",
        updateInterval: 10 * 60 * 1000, // 10 minutes
        animationSpeed: 1000,
        showDescription: true,
        showHumidity: true,
        showWindSpeed: true,
        showWindDirection: true,
        showFeelsLike: true,
        useLocationFromSimpleLocation: true, // Enable dynamic location
        locationUpdateDelay: 5000, // Wait 5s after location update
        showLocationSource: true, // Show location source indicator
        debug: false
    }
}
```

## ⚙️ Config Options

| Option | Default | Description |
|--------|---------|-------------|
| `weatherProvider` | `"openmeteo"` | Weather data provider |
| `type` | `"current"` | Weather type (current/forecast) |
| `lat` | `28.6139` | Fallback latitude |
| `lon` | `77.2090` | Fallback longitude |
| `units` | `"metric"` | Temperature units |
| `updateInterval` | `600000` | Weather update interval (ms) |
| `useLocationFromSimpleLocation` | `true` | Enable dynamic location updates |
| `locationUpdateDelay` | `5000` | Delay after location update (ms) |
| `showLocationSource` | `true` | Show location source indicator |
| `showDescription` | `true` | Show weather description |
| `showHumidity` | `true` | Show humidity percentage |
| `showWindSpeed` | `true` | Show wind speed |
| `showFeelsLike` | `true` | Show "feels like" temperature |
| `debug` | `false` | Enable debug logging |

## 🌍 Location Integration

### Automatic Location Updates
The module automatically receives location updates from MMM-SimpleLocation:

- **🌐 API Source** - Real location from IP geolocation
- **📍 Static Source** - Configured fallback location
- **⚠️ Fallback Source** - Emergency fallback when APIs fail

### Location Status Indicators
- **🌐** - Weather data from IP geolocation
- **📍** - Weather data from static configuration
- **⚠️** - Weather data from fallback location

## 🎯 Weather Data

### Supported Weather Information
- **🌡️ Temperature** - Current temperature
- **🌡️ Feels Like** - Apparent temperature
- **💧 Humidity** - Relative humidity percentage
- **💨 Wind Speed** - Current wind speed
- **🧭 Wind Direction** - Wind direction
- **☁️ Weather Type** - Current weather conditions

### Weather Icons
- ☀️ Clear/Sunny
- ⛅ Partly Cloudy
- ☁️ Cloudy
- 🌧️ Rain
- ❄️ Snow
- ⛈️ Thunderstorm
- 🌫️ Fog
- 💨 Windy

## 🔄 Integration with MMM-SimpleLocation

### Required Setup
1. **MMM-SimpleLocation** must be installed and configured
2. **broadcastLocation: true** in MMM-SimpleLocation config
3. **useLocationFromSimpleLocation: true** in MMM-DynamicWeather config

### Data Flow
```
MMM-SimpleLocation → Location Detection → MMM-DynamicWeather → Weather API → Display
```

## 🧪 Testing

### Debug Mode
Enable debug mode to see detailed logs:
```javascript
config: {
    debug: true
}
```

### Manual Testing
Check browser console for location and weather updates:
```javascript
// Check current location data
console.log(MM.currentLocation);

// Check weather module status
MM.getModules().find(m => m.name === 'MMM-DynamicWeather');
```

## 🚨 Troubleshooting

### Weather Not Updating
1. Check MMM-SimpleLocation is broadcasting location data
2. Verify `useLocationFromSimpleLocation: true`
3. Check browser console for errors
4. Ensure internet connection for weather API

### Location Not Detected
1. Check MMM-SimpleLocation configuration
2. Verify IP geolocation APIs are accessible
3. Check fallback coordinates are valid

### API Errors
1. Verify OpenMeteo API is accessible
2. Check coordinates are valid (lat: -90 to 90, lon: -180 to 180)
3. Check network connectivity

## 📊 Performance

- **Memory Usage** - Minimal, only stores current weather data
- **Network Usage** - Weather API calls only when location changes
- **CPU Usage** - Low, efficient update scheduling
- **Battery Impact** - Minimal on mobile devices

## 🎉 Success Indicators

When working correctly, you should see:
- ✅ Weather updates automatically when location changes
- ✅ Location source indicator shows current data source
- ✅ Smooth transitions between weather updates
- ✅ No errors in browser console
- ✅ Weather data matches your actual location

---

**🌤️ Enjoy weather data that follows you wherever you are!** 🌍
