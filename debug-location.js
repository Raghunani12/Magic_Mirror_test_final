/**
 * 🌍 Chaos Dev Location Debug Script
 * 
 * Paste this into your browser console on the Magic Mirror page
 * to test and debug the IP geolocation functionality
 */

console.log("🌍 Starting Chaos Dev Location Debug...");

// Test the same APIs used by MMM-SimpleLocation
const locationAPIs = [
    {
        name: "ipapi.co (Primary)",
        url: "https://ipapi.co/json/",
        parser: (data) => ({ city: data.city, country: data.country, ip: data.ip })
    },
    {
        name: "ip-api.com (Fallback 1)",
        url: "http://ip-api.com/json/",
        parser: (data) => ({ city: data.city, country: data.country_name || data.country, ip: data.query })
    },
    {
        name: "ipinfo.io (Fallback 2)",
        url: "https://ipinfo.io/json",
        parser: (data) => ({ city: data.city, country: data.country, ip: data.ip })
    }
];

async function testLocationAPI(api) {
    console.log(`🔍 Testing ${api.name}...`);
    
    try {
        const startTime = Date.now();
        const response = await fetch(api.url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        const parsed = api.parser(data);
        
        console.log(`✅ ${api.name} SUCCESS (${duration}ms)`);
        console.log(`   City: ${parsed.city}`);
        console.log(`   Country: ${parsed.country}`);
        console.log(`   IP: ${parsed.ip}`);
        console.log(`   Raw data:`, data);
        
        return { success: true, ...parsed, duration, raw: data };
        
    } catch (error) {
        console.error(`❌ ${api.name} FAILED:`, error.message);
        return { success: false, error: error.message };
    }
}

async function debugLocation() {
    console.log("🚀 Testing all location APIs...");
    
    const results = [];
    
    for (const api of locationAPIs) {
        const result = await testLocationAPI(api);
        results.push({ api: api.name, ...result });
    }
    
    console.log("\n📊 SUMMARY:");
    console.log("=" * 50);
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`✅ Successful: ${successful.length}/${results.length}`);
    console.log(`❌ Failed: ${failed.length}/${results.length}`);
    
    if (successful.length > 0) {
        const best = successful[0];
        console.log(`\n🎯 YOUR DETECTED LOCATION:`);
        console.log(`   City: ${best.city}`);
        console.log(`   Country: ${best.country}`);
        console.log(`   IP: ${best.ip}`);
        console.log(`   Source: ${best.api}`);
        
        // Check if MMM-SimpleLocation module exists
        if (typeof MM !== 'undefined') {
            const locationModule = MM.getModules().find(m => m.name === 'MMM-SimpleLocation');
            if (locationModule) {
                console.log(`\n🔧 MMM-SimpleLocation module found!`);
                console.log(`   Config:`, locationModule.config);
                console.log(`   Current data:`, locationModule.locationData);
            } else {
                console.log(`\n⚠️ MMM-SimpleLocation module not found in MM.getModules()`);
            }
        } else {
            console.log(`\n⚠️ MagicMirror (MM) object not found`);
        }
        
    } else {
        console.log(`\n💥 All APIs failed! Recommendations:`);
        console.log(`   1. Check internet connection`);
        console.log(`   2. Try from a different network`);
        console.log(`   3. Use static location in config`);
    }
    
    return results;
}

// Auto-run the debug
debugLocation().then(results => {
    console.log("\n🎉 Debug complete! Results stored in window.locationDebugResults");
    window.locationDebugResults = results;
});

// Helper functions for manual testing
window.testLocationNow = debugLocation;
window.checkMMModules = () => {
    if (typeof MM !== 'undefined') {
        console.log("📋 All MM modules:", MM.getModules().map(m => m.name));
        const locationModule = MM.getModules().find(m => m.name === 'MMM-SimpleLocation');
        if (locationModule) {
            console.log("🎯 MMM-SimpleLocation found:", locationModule);
        }
    } else {
        console.log("❌ MM object not available");
    }
};

console.log("\n🛠️ Available debug functions:");
console.log("   testLocationNow() - Run location test again");
console.log("   checkMMModules() - Check MagicMirror modules");
console.log("   window.locationDebugResults - Last test results");
