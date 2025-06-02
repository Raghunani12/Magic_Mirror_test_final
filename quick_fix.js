// Quick fix script to diagnose and potentially fix module display issues
console.log("🔧 Running Smart Mirror Quick Fix Diagnostic");

// Wait for DOM to be ready
function runDiagnostic() {
    console.log("=== SMART MIRROR DIAGNOSTIC ===");
    
    // 1. Check if MM is loaded
    if (typeof MM === 'undefined') {
        console.log("❌ CRITICAL: MM (MagicMirror) object not found!");
        console.log("This means MagicMirror core didn't load properly.");
        console.log("Check browser console for JavaScript errors.");
        return;
    }
    
    console.log("✅ MM object found");
    
    // 2. Check modules
    const modules = MM.getModules();
    console.log(`📊 Found ${modules.length} modules:`, modules.map(m => m.name));
    
    if (modules.length === 0) {
        console.log("❌ CRITICAL: No modules loaded!");
        console.log("Check config.js for syntax errors.");
        return;
    }
    
    // 3. Check each module status
    console.log("=== MODULE STATUS ===");
    modules.forEach(module => {
        const element = document.getElementById(module.identifier);
        console.log(`${module.name}:`, {
            loaded: module.loaded,
            hidden: module.hidden,
            suspended: module.suspended,
            domExists: !!element,
            hasContent: element ? element.innerHTML.length > 0 : false
        });
        
        if (element) {
            const content = element.querySelector('.module-content');
            if (content && content.innerHTML.trim() === '') {
                console.log(`  ⚠️ ${module.name} has empty content`);
            }
        }
    });
    
    // 4. Check DOM regions
    console.log("=== DOM REGIONS ===");
    const regions = ['top_left', 'top_center', 'top_right', 'upper_third', 'middle_center', 'lower_third', 'bottom_left', 'bottom_center', 'bottom_right'];
    
    regions.forEach(region => {
        const element = document.querySelector(`.region.${region.replace('_', '.')}`);
        if (element) {
            const container = element.querySelector('.container');
            const moduleCount = container ? container.children.length : 0;
            console.log(`${region}: ${moduleCount} modules`);
            
            if (moduleCount > 0 && container) {
                Array.from(container.children).forEach(child => {
                    console.log(`  - ${child.className} (${child.id})`);
                });
            }
        } else {
            console.log(`❌ ${region}: Region not found`);
        }
    });
    
    // 5. Force module updates
    console.log("=== FORCING MODULE UPDATES ===");
    modules.forEach(module => {
        if (!module.hidden && module.loaded) {
            console.log(`🔄 Updating ${module.name}...`);
            try {
                module.updateDom();
            } catch (error) {
                console.log(`❌ Error updating ${module.name}:`, error);
            }
        }
    });
    
    // 6. Check for specific content
    setTimeout(() => {
        console.log("=== CONTENT CHECK (after updates) ===");
        
        // Check clock
        const clockElement = document.querySelector('.clock');
        if (clockElement) {
            console.log("✅ Clock element found:", clockElement.textContent.length > 0 ? "Has content" : "Empty");
        } else {
            console.log("❌ Clock element not found");
        }
        
        // Check calendar
        const calendarElement = document.querySelector('.calendar');
        if (calendarElement) {
            console.log("✅ Calendar element found:", calendarElement.textContent.length > 0 ? "Has content" : "Empty");
        } else {
            console.log("❌ Calendar element not found");
        }
        
        // Check weather
        const weatherElement = document.querySelector('.weather');
        if (weatherElement) {
            console.log("✅ Weather element found:", weatherElement.textContent.length > 0 ? "Has content" : "Empty");
        } else {
            console.log("❌ Weather element not found");
        }
        
        console.log("=== DIAGNOSTIC COMPLETE ===");
        console.log("If modules show as loaded but have no content, try:");
        console.log("1. Hard refresh (Ctrl+F5)");
        console.log("2. Check network connectivity");
        console.log("3. Wait 30 seconds for data to load");
        console.log("4. Check server logs for errors");
        
    }, 3000);
}

// Run diagnostic
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runDiagnostic);
} else {
    runDiagnostic();
}

// Also provide manual trigger
window.runSmartMirrorDiagnostic = runDiagnostic;
