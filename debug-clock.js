/**
 * Clock Debug Script
 * Run this in browser console to debug clock visibility issues
 */

(function() {
    console.log('🕐 Clock Debug Script Starting...');
    
    // Check if MagicMirror is loaded
    if (typeof MM === 'undefined') {
        console.error('❌ MagicMirror (MM) not found. Wait for it to load.');
        return;
    }
    
    // Find clock module
    const clockModules = MM.getModules().withClass('clock');
    console.log(`🔍 Found ${clockModules.length} clock module(s)`);
    
    if (clockModules.length === 0) {
        console.error('❌ No clock modules found in configuration');
        return;
    }
    
    clockModules.forEach((module, index) => {
        console.log(`\n📊 Clock Module ${index + 1} Debug Info:`);
        console.log('- Module:', module);
        console.log('- Position:', module.data.position);
        console.log('- Hidden:', module.hidden);
        console.log('- DOM Element:', module.getDom());
        
        // Check if DOM element exists and is visible
        const domElement = module.getDom();
        if (domElement) {
            const styles = window.getComputedStyle(domElement);
            console.log('- Display:', styles.display);
            console.log('- Visibility:', styles.visibility);
            console.log('- Opacity:', styles.opacity);
            console.log('- Z-Index:', styles.zIndex);
            console.log('- Position:', styles.position);
            
            // Check parent container
            const parentContainer = domElement.parentElement;
            if (parentContainer) {
                const parentStyles = window.getComputedStyle(parentContainer);
                console.log('- Parent Display:', parentStyles.display);
                console.log('- Parent Visibility:', parentStyles.visibility);
                console.log('- Parent Opacity:', parentStyles.opacity);
            }
        } else {
            console.error('❌ DOM element not found for clock module');
        }
        
        // Try to force show the module
        console.log('🔧 Attempting to force show clock...');
        module.show(1000, () => {
            console.log('✅ Clock show animation completed');
        });
        
        // Force update DOM
        module.updateDom();
        console.log('🔄 Clock DOM updated');
    });
    
    // Check region containers
    console.log('\n📍 Region Container Debug:');
    const regions = ['top left', 'top center', 'top right', 'top bar'];
    regions.forEach(region => {
        const regionClass = region.replace(' ', '.');
        const container = document.querySelector(`.region.${regionClass} .container`);
        if (container) {
            const styles = window.getComputedStyle(container);
            console.log(`- ${region}:`, {
                display: styles.display,
                visibility: styles.visibility,
                opacity: styles.opacity,
                children: container.children.length
            });
        } else {
            console.log(`- ${region}: Container not found`);
        }
    });
    
    // Check for any preloader interference
    console.log('\n🤖 Preloader Debug:');
    const preloader = document.getElementById('jarvis-preloader');
    if (preloader) {
        console.warn('⚠️ JARVIS preloader still exists!');
        console.log('- Preloader opacity:', preloader.style.opacity);
        console.log('- Preloader z-index:', window.getComputedStyle(preloader).zIndex);
        console.log('🗑️ Removing preloader...');
        preloader.remove();
    } else {
        console.log('✅ No preloader interference');
    }
    
    // Force refresh all modules
    console.log('\n🔄 Force refreshing all modules...');
    MM.getModules().forEach(module => {
        if (module.updateDom) {
            module.updateDom();
        }
    });
    
    // Add emergency clock CSS
    console.log('\n🚨 Adding emergency clock visibility CSS...');
    const emergencyCSS = `
        .clock {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            z-index: 1000 !important;
            position: relative !important;
        }
        .clock .time {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            font-size: 4rem !important;
            color: #ffffff !important;
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.3) !important;
        }
        .region.top.left {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            z-index: 100 !important;
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = emergencyCSS;
    document.head.appendChild(style);
    
    console.log('✅ Emergency CSS applied');
    console.log('\n🎯 Clock Debug Complete. Check if clock is now visible.');
    
    // Final check after 2 seconds
    setTimeout(() => {
        const clockElements = document.querySelectorAll('.clock');
        console.log(`\n🔍 Final Check: Found ${clockElements.length} clock element(s) in DOM`);
        clockElements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            console.log(`Clock ${index + 1}:`, {
                visible: rect.width > 0 && rect.height > 0,
                position: `${rect.left}, ${rect.top}`,
                size: `${rect.width}x${rect.height}`,
                text: element.textContent || 'No text content'
            });
        });
    }, 2000);
    
})();

// Also add this to window for manual execution
window.debugClock = function() {
    console.log('🕐 Manual Clock Debug...');
    
    // Force show all clock modules
    if (typeof MM !== 'undefined') {
        MM.getModules().withClass('clock').forEach(module => {
            module.show();
            module.updateDom();
        });
    }
    
    // Remove any lingering preloader
    const preloader = document.getElementById('jarvis-preloader');
    if (preloader) {
        preloader.remove();
    }
    
    console.log('✅ Manual debug complete');
};
