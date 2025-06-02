# 🔍 Smart Mirror Debug Guide

Complete debugging and monitoring guide for your Professional Smart Mirror with Black & White Animated Theme.

## 🚀 Quick Debug Access

### Visual Debug Console
- **Toggle Debug Console**: Click the "🔍 DEBUG" button in top-right corner
- **Keyboard Shortcut**: `Ctrl + Shift + D`
- **Auto-refresh**: Updates every 5 seconds

### Browser Console Commands
Open browser console (F12) and use these commands:
```javascript
// Show current status of all modules
debugMonitor.printStatusReport()

// Get specific module information
debugMonitor.getModuleStatus('clock')
debugMonitor.getModuleStatus('calendar')
debugMonitor.getModuleStatus('weather')

// Get all module statuses
debugMonitor.getAllModules()

// Clear all debug logs
debugMonitor.clearLogs()

// Export debug data
debugMonitor.exportLogs()
```

## 📊 Module Status Indicators

### Status Icons
- ✅ **ACTIVE** - Module working correctly
- ❌ **ERROR** - Module has errors
- ⚠️ **WARNING** - Module has warnings
- ❓ **UNKNOWN** - Module status unclear

### Debug Information Displayed
- **Module Name** - Name of the module
- **Status** - Current operational status
- **Last Update** - Time since last activity
- **Error Count** - Number of errors encountered
- **Warning Count** - Number of warnings
- **Log Count** - Number of log messages

## 🔧 Module-Specific Debugging

### 1. Clock Module
**Expected Behavior**: Shows current time and date
**Debug Config**: `debug: true`
**Common Issues**:
- Time not updating: Check timezone settings
- Date format issues: Verify `dateFormat` configuration

**Debug Commands**:
```javascript
debugMonitor.getModuleStatus('clock')
```

### 2. Google Calendar Module
**Expected Behavior**: Shows your calendar events
**Debug Config**: `debug: true, logFeedWarnings: true`
**Common Issues**:
- No events showing: Check calendar URL accessibility
- Calendar not loading: Verify internet connection
- Wrong events: Check calendar privacy settings

**Debug Commands**:
```javascript
debugMonitor.getModuleStatus('calendar')
// Check network requests for calendar
```

**Manual Test**:
```javascript
// Test calendar URL directly
fetch('https://calendar.google.com/calendar/ical/raghunani1437%40gmail.com/public/basic.ics')
  .then(response => response.text())
  .then(data => console.log('Calendar data:', data))
```

### 3. Weather Modules
**Expected Behavior**: Shows current weather and forecast
**Debug Config**: `debug: true`
**Common Issues**:
- No weather data: Check internet connection
- Wrong location: IP geolocation may be inaccurate
- API errors: OpenMeteo service issues

**Debug Commands**:
```javascript
debugMonitor.getModuleStatus('weather')
// Check both current and forecast weather modules
```

### 4. Location Display (MMM-ip)
**Expected Behavior**: Shows your city and country
**Debug Config**: `debug: true`
**Common Issues**:
- Wrong location: IP geolocation limitations
- No location shown: Network connectivity issues

**Debug Commands**:
```javascript
debugMonitor.getModuleStatus('MMM-ip')
```

### 5. News Feed Module
**Expected Behavior**: Scrolling news from multiple sources
**Debug Config**: `debug: true, logFeedWarnings: true`
**Common Issues**:
- No news items: RSS feed accessibility
- Slow loading: Network speed issues
- Missing sources: RSS URL problems

**Debug Commands**:
```javascript
debugMonitor.getModuleStatus('newsfeed')
```

### 6. Photo Slideshow (MMM-ImageSlideshow)
**Expected Behavior**: Shows photos from photos/ directory
**Debug Config**: `debug: true`
**Common Issues**:
- No photos: Empty photos directory
- Photos not changing: Check slideshow timing
- Wrong format: Unsupported image types

**Debug Commands**:
```javascript
debugMonitor.getModuleStatus('MMM-ImageSlideshow')
```

### 7. Compliments Module
**Expected Behavior**: Shows time-based motivational messages
**Debug Config**: `debug: true`
**Common Issues**:
- Same message: Check update interval
- Wrong time messages: Verify system time

**Debug Commands**:
```javascript
debugMonitor.getModuleStatus('compliments')
```

## 🌐 Network Debugging

### Monitor Network Requests
The debug monitor automatically tracks:
- ✅ Successful requests (green)
- ❌ Failed requests (red)
- 🌐 All outgoing requests

### Common Network Issues
1. **Calendar not loading**: Check calendar URL
2. **Weather not updating**: OpenMeteo API accessibility
3. **News not showing**: RSS feed connectivity
4. **Location not detected**: IP geolocation service

### Manual Network Tests
```javascript
// Test calendar connectivity
fetch('https://calendar.google.com/calendar/ical/raghunani1437%40gmail.com/public/basic.ics')

// Test weather API
fetch('https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true')

// Test news feeds
fetch('http://feeds.bbci.co.uk/news/rss.xml')
```

## 🐛 Common Issues & Solutions

### Issue: Black Screen
**Symptoms**: Nothing displays on mirror
**Debug Steps**:
1. Open browser console (F12)
2. Check for JavaScript errors
3. Run `debugMonitor.printStatusReport()`
4. Verify all modules are loading

### Issue: Module Not Loading
**Symptoms**: Specific module missing
**Debug Steps**:
1. Check module status: `debugMonitor.getModuleStatus('moduleName')`
2. Verify module configuration in config.js
3. Check browser console for errors
4. Ensure module files exist

### Issue: Calendar Empty
**Symptoms**: No calendar events showing
**Debug Steps**:
1. Test calendar URL manually
2. Check calendar privacy settings
3. Verify internet connectivity
4. Check debug logs for calendar module

### Issue: Weather Not Working
**Symptoms**: No weather information
**Debug Steps**:
1. Check internet connection
2. Verify IP geolocation working
3. Test OpenMeteo API manually
4. Check weather module debug logs

## 📱 Keyboard Shortcuts

- `Ctrl + Shift + D` - Toggle debug console
- `Ctrl + Shift + C` - Clear all debug logs
- `Ctrl + Shift + E` - Export debug data
- `F12` - Open browser developer tools

## 📋 Debug Data Export

Export complete debug information:
```javascript
const debugData = debugMonitor.exportLogs();
console.log(JSON.stringify(debugData, null, 2));
```

Exported data includes:
- System uptime
- Error/warning/log counts
- All module statuses
- Recent messages per module
- Timestamp information

## 🔄 Troubleshooting Workflow

1. **Check Visual Debug Console** - Look for red/yellow status indicators
2. **Open Browser Console** - Check for JavaScript errors
3. **Run Status Report** - `debugMonitor.printStatusReport()`
4. **Test Individual Modules** - Use module-specific debug commands
5. **Check Network Connectivity** - Verify internet access
6. **Review Configuration** - Check config.js for errors
7. **Export Debug Data** - Save for detailed analysis

## 📞 Getting Help

When reporting issues, include:
1. Debug data export (`debugMonitor.exportLogs()`)
2. Browser console errors
3. Module status information
4. Network connectivity status
5. Configuration details

---

**Happy Debugging! 🔍✨**
