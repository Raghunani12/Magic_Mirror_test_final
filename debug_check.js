// Debug script to check why modules aren't displaying content
console.log("🔍 Starting Smart Mirror Content Debug Check");

// Check if MagicMirror is loaded
setTimeout(() => {
    console.log("=== MAGICMIRROR DEBUG CHECK ===");
    
    // 1. Check if MM object exists
    if (typeof MM !== 'undefined') {
        console.log("✅ MM object exists");
        console.log("MM modules:", MM.getModules());
        
        // Check each module
        MM.getModules().forEach(module => {
            console.log(`Module ${module.name}:`, {
                loaded: module.loaded,
                hidden: module.hidden,
                suspended: module.suspended,
                data: module.data
            });
        });
    } else {
        console.log("❌ MM object not found - MagicMirror may not be loaded");
    }
    
    // 2. Check DOM elements
    console.log("=== DOM ELEMENTS CHECK ===");
    const regions = ['top_left', 'top_center', 'top_right', 'upper_third', 'middle_center', 'lower_third', 'bottom_left', 'bottom_center', 'bottom_right'];
    
    regions.forEach(region => {
        const element = document.querySelector(`.region.${region}`);
        if (element) {
            console.log(`Region ${region}:`, {
                exists: true,
                children: element.children.length,
                innerHTML: element.innerHTML.length > 0 ? "Has content" : "Empty"
            });
        } else {
            console.log(`❌ Region ${region}: Not found`);
        }
    });
    
    // 3. Check for specific module elements
    console.log("=== MODULE ELEMENTS CHECK ===");
    const moduleSelectors = {
        'clock': '.clock',
        'calendar': '.calendar',
        'weather': '.weather',
        'newsfeed': '.newsfeed',
        'compliments': '.compliments'
    };
    
    Object.entries(moduleSelectors).forEach(([name, selector]) => {
        const element = document.querySelector(selector);
        console.log(`${name}:`, element ? "✅ Found" : "❌ Not found");
        if (element) {
            console.log(`  Content: ${element.textContent.length > 0 ? "Has text" : "Empty"}`);
        }
    });
    
    // 4. Check for JavaScript errors
    console.log("=== ERROR CHECK ===");
    console.log("Check browser console for any red error messages");
    
    // 5. Check network requests
    console.log("=== NETWORK CHECK ===");
    console.log("Calendar URL test:");
    fetch('https://calendar.google.com/calendar/ical/raghunani1437%40gmail.com/public/basic.ics')
        .then(response => {
            console.log("Calendar response:", response.status, response.ok ? "✅" : "❌");
        })
        .catch(error => {
            console.log("Calendar error:", error);
        });
    
    console.log("Weather API test:");
    fetch('https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current_weather=true')
        .then(response => {
            console.log("Weather response:", response.status, response.ok ? "✅" : "❌");
        })
        .catch(error => {
            console.log("Weather error:", error);
        });
        
}, 5000);

// Also run immediate check
console.log("=== IMMEDIATE CHECK ===");
console.log("Document ready state:", document.readyState);
console.log("Body children count:", document.body.children.length);
console.log("Head scripts count:", document.head.querySelectorAll('script').length);

// Check if config is loaded
if (typeof config !== 'undefined') {
    console.log("✅ Config loaded");
    console.log("Modules in config:", config.modules ? config.modules.length : "No modules");
} else {
    console.log("❌ Config not loaded yet");
}

// Monitor for when MM becomes available
let checkCount = 0;
const mmChecker = setInterval(() => {
    checkCount++;
    if (typeof MM !== 'undefined') {
        console.log(`✅ MM became available after ${checkCount} checks`);
        clearInterval(mmChecker);
    } else if (checkCount > 20) {
        console.log("❌ MM still not available after 20 checks");
        clearInterval(mmChecker);
    }
}, 1000);
