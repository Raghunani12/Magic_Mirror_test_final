# MMM-SimpleLocation (Chaos Dev Edition) 🌍

A plug-n-play IP geolocation module for MagicMirror² that actually works!

## Features ✨

- **Real-time IP Geolocation** - Automatically detects your actual location
- **Multiple API Fallbacks** - Never fails with 4 different geolocation APIs
- **Smart Retry Logic** - Handles network failures gracefully
- **Visual Status Indicators** - See exactly how your location was detected
- **Zero Configuration** - Works out of the box
- **Chaos Dev Approved** - Built for reliability in the real world

## Installation

This module is already installed in your MagicMirror setup.

## Configuration

Add the following configuration to your `config/config.js` file:

```javascript
{
    module: "MMM-SimpleLocation",
    position: "top_bar",
    config: {
        fontSize: 18,
        dimmed: true,
        city: "New Delhi", // Fallback city
        country: "India", // Fallback country
        showCity: true,
        showCountry: true,
        showFlag: false,
        lang: "en",
        useGeolocation: true, // Enable chaos dev IP geolocation
        updateInterval: 30 * 60 * 1000, // 30 minutes
        retryAttempts: 3
    }
}
```

## The Chaos Dev Way 🚀

This module uses the "full chaos dev" approach with multiple IP geolocation APIs:

1. **Primary**: `ipapi.co` - Fast and reliable
2. **Fallback 1**: `ip-api.com` - Free tier with good coverage
3. **Fallback 2**: `ipinfo.io` - Enterprise-grade backup
4. **Fallback 3**: `api.ipify.org` - IP detection for debugging

### How It Works

```javascript
// The magic happens here:
fetch("https://ipapi.co/json/")
  .then(res => res.json())
  .then(data => {
    console.log("🎯 Your Real City:", data.city);
    console.log("🌍 Your Country:", data.country);
  });
```

## Config Options

| Option | Default | Description |
|--------|---------|-------------|
| `fontSize` | `18` | Font size in pixels |
| `dimmed` | `true` | Whether to dim the text |
| `city` | `"New Delhi"` | Static city name (used when useGeolocation is false) |
| `country` | `"India"` | Static country name (used when useGeolocation is false) |
| `showCity` | `true` | Whether to show the city name |
| `showCountry` | `true` | Whether to show the country name |
| `showFlag` | `false` | Whether to show country flag (not implemented) |
| `lang` | `"en"` | Language code |
| `useGeolocation` | `false` | Whether to use IP-based geolocation |
| `updateInterval` | `3600000` | Update interval in milliseconds (1 hour) |

## Usage

### Static Location (Recommended)
Set `useGeolocation: false` and specify your `city` and `country` in the config. This ensures consistent and accurate location display.

### IP-based Geolocation
Set `useGeolocation: true` to automatically detect location based on your IP address. Note that this may not always be accurate.

## License

MIT License
