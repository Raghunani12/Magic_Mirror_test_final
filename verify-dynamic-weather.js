#!/usr/bin/env node

/**
 * Dynamic Weather Setup Verification Script
 * Verifies that MMM-SimpleLocation and MMM-DynamicWeather are properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Dynamic Weather Setup Verification\n');

// Check if config file exists and has correct modules
function checkConfig() {
    console.log('📋 Checking configuration...');
    
    const configPath = path.join(__dirname, 'config', 'config.js');
    
    if (!fs.existsSync(configPath)) {
        console.log('❌ Config file not found at config/config.js');
        return false;
    }
    
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // Check for MMM-SimpleLocation
    if (configContent.includes('MMM-SimpleLocation')) {
        console.log('✅ MMM-SimpleLocation found in config');
    } else {
        console.log('❌ MMM-SimpleLocation not found in config');
        return false;
    }
    
    // Check for MMM-DynamicWeather
    if (configContent.includes('MMM-DynamicWeather')) {
        console.log('✅ MMM-DynamicWeather found in config');
    } else {
        console.log('❌ MMM-DynamicWeather not found in config');
        console.log('⚠️  Make sure you replaced the default weather module');
        return false;
    }
    
    // Check for useLocationFromSimpleLocation
    if (configContent.includes('useLocationFromSimpleLocation: true')) {
        console.log('✅ Dynamic location updates enabled');
    } else {
        console.log('⚠️  useLocationFromSimpleLocation not found or not enabled');
    }
    
    // Check for broadcastLocation
    if (configContent.includes('broadcastLocation: true')) {
        console.log('✅ Location broadcasting enabled');
    } else {
        console.log('⚠️  broadcastLocation not found or not enabled');
    }
    
    return true;
}

// Check if module files exist
function checkModuleFiles() {
    console.log('\n📁 Checking module files...');
    
    const simpleLocationPath = path.join(__dirname, 'modules', 'MMM-SimpleLocation', 'MMM-SimpleLocation.js');
    const dynamicWeatherPath = path.join(__dirname, 'modules', 'MMM-DynamicWeather', 'MMM-DynamicWeather.js');
    const weatherHelperPath = path.join(__dirname, 'modules', 'MMM-DynamicWeather', 'node_helper.js');
    
    if (fs.existsSync(simpleLocationPath)) {
        console.log('✅ MMM-SimpleLocation module file exists');
    } else {
        console.log('❌ MMM-SimpleLocation module file missing');
        return false;
    }
    
    if (fs.existsSync(dynamicWeatherPath)) {
        console.log('✅ MMM-DynamicWeather module file exists');
    } else {
        console.log('❌ MMM-DynamicWeather module file missing');
        return false;
    }
    
    if (fs.existsSync(weatherHelperPath)) {
        console.log('✅ MMM-DynamicWeather node_helper exists');
    } else {
        console.log('❌ MMM-DynamicWeather node_helper missing');
        return false;
    }
    
    return true;
}

// Check module functionality
function checkModuleFunctionality() {
    console.log('\n🔧 Checking module functionality...');
    
    try {
        // Check MMM-SimpleLocation
        const simpleLocationContent = fs.readFileSync(
            path.join(__dirname, 'modules', 'MMM-SimpleLocation', 'MMM-SimpleLocation.js'), 
            'utf8'
        );
        
        if (simpleLocationContent.includes('LOCATION_DATA_UPDATED')) {
            console.log('✅ MMM-SimpleLocation broadcasts location updates');
        } else {
            console.log('⚠️  MMM-SimpleLocation may not broadcast location updates');
        }
        
        if (simpleLocationContent.includes('ipapi.co')) {
            console.log('✅ MMM-SimpleLocation uses IP geolocation API');
        } else {
            console.log('⚠️  MMM-SimpleLocation may not use IP geolocation');
        }
        
        // Check MMM-DynamicWeather
        const dynamicWeatherContent = fs.readFileSync(
            path.join(__dirname, 'modules', 'MMM-DynamicWeather', 'MMM-DynamicWeather.js'), 
            'utf8'
        );
        
        if (dynamicWeatherContent.includes('LOCATION_DATA_UPDATED')) {
            console.log('✅ MMM-DynamicWeather listens for location updates');
        } else {
            console.log('⚠️  MMM-DynamicWeather may not listen for location updates');
        }
        
        if (dynamicWeatherContent.includes('updateLocation')) {
            console.log('✅ MMM-DynamicWeather has location update functionality');
        } else {
            console.log('⚠️  MMM-DynamicWeather may not update location');
        }
        
        // Check node_helper
        const helperContent = fs.readFileSync(
            path.join(__dirname, 'modules', 'MMM-DynamicWeather', 'node_helper.js'), 
            'utf8'
        );
        
        if (helperContent.includes('open-meteo.com')) {
            console.log('✅ MMM-DynamicWeather uses OpenMeteo API');
        } else {
            console.log('⚠️  MMM-DynamicWeather may not use OpenMeteo API');
        }
        
        return true;
        
    } catch (error) {
        console.log('❌ Error checking module functionality:', error.message);
        return false;
    }
}

// Test API connectivity
async function testAPIConnectivity() {
    console.log('\n🌐 Testing API connectivity...');
    
    try {
        // Test location API
        console.log('📍 Testing location API (ipapi.co)...');
        const locationResponse = await fetch('https://ipapi.co/json/');
        if (locationResponse.ok) {
            const locationData = await locationResponse.json();
            console.log(`✅ Location API working: ${locationData.city}, ${locationData.country}`);
        } else {
            console.log('⚠️  Location API may be unavailable');
        }
        
        // Test weather API
        console.log('🌤️ Testing weather API (OpenMeteo)...');
        const weatherResponse = await fetch('https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current=temperature_2m&forecast_days=1');
        if (weatherResponse.ok) {
            const weatherData = await weatherResponse.json();
            console.log(`✅ Weather API working: ${weatherData.current.temperature_2m}°C`);
        } else {
            console.log('⚠️  Weather API may be unavailable');
        }
        
        return true;
        
    } catch (error) {
        console.log('❌ API connectivity test failed:', error.message);
        return false;
    }
}

// Main verification function
async function runVerification() {
    console.log('🚀 Starting Dynamic Weather Setup Verification...\n');
    
    let allChecksPass = true;
    
    // Run all checks
    allChecksPass &= checkConfig();
    allChecksPass &= checkModuleFiles();
    allChecksPass &= checkModuleFunctionality();
    allChecksPass &= await testAPIConnectivity();
    
    // Final result
    console.log('\n' + '='.repeat(50));
    if (allChecksPass) {
        console.log('🎉 ALL CHECKS PASSED!');
        console.log('✅ Dynamic Weather is properly configured');
        console.log('🌤️ Weather will update automatically based on location');
        console.log('\n📋 Next steps:');
        console.log('1. Start MagicMirror: npm start');
        console.log('2. Watch for location detection in logs');
        console.log('3. Verify weather updates for your location');
        console.log('4. Test with: dynamic-weather-test.html');
    } else {
        console.log('❌ SOME CHECKS FAILED');
        console.log('⚠️  Please review the issues above');
        console.log('📖 Check DYNAMIC_WEATHER_IMPLEMENTATION.md for help');
    }
    console.log('='.repeat(50));
}

// Add fetch polyfill for Node.js
if (typeof fetch === 'undefined') {
    global.fetch = require('node-fetch');
}

// Run verification
runVerification().catch(error => {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
});
