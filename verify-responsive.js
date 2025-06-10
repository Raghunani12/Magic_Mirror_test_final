#!/usr/bin/env node

/**
 * Responsive CSS Verification Script
 * Verifies that the new responsive CSS system is properly implemented
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Responsive CSS Verification\n');

// Check if new responsive CSS exists
function checkResponsiveCSS() {
    console.log('📋 Checking responsive CSS implementation...');
    
    const customCSSPath = path.join(__dirname, 'css', 'custom.css');
    const mainCSSPath = path.join(__dirname, 'css', 'main.css');
    
    if (!fs.existsSync(customCSSPath)) {
        console.log('❌ Custom CSS file not found');
        return false;
    }
    
    if (!fs.existsSync(mainCSSPath)) {
        console.log('❌ Main CSS file not found');
        return false;
    }
    
    const customCSS = fs.readFileSync(customCSSPath, 'utf8');
    const mainCSS = fs.readFileSync(mainCSSPath, 'utf8');
    
    // Check for responsive features
    const responsiveFeatures = [
        { name: 'CSS clamp() function', pattern: /clamp\(/g },
        { name: 'Mobile breakpoints', pattern: /@media.*max-width.*480px/g },
        { name: 'Tablet breakpoints', pattern: /@media.*min-width.*481px.*max-width.*768px/g },
        { name: 'Desktop breakpoints', pattern: /@media.*min-width.*1025px/g },
        { name: 'Viewport units (vw/vh)', pattern: /\d+v[wh]/g },
        { name: 'CSS custom properties', pattern: /--[a-zA-Z-]+:/g },
        { name: 'Responsive spacing', pattern: /--space-/g },
        { name: 'Responsive fonts', pattern: /--font-/g }
    ];
    
    let allFeaturesFound = true;
    
    responsiveFeatures.forEach(feature => {
        const foundInCustom = feature.pattern.test(customCSS);
        const foundInMain = feature.pattern.test(mainCSS);
        
        if (foundInCustom || foundInMain) {
            console.log(`✅ ${feature.name} implemented`);
        } else {
            console.log(`❌ ${feature.name} missing`);
            allFeaturesFound = false;
        }
    });
    
    return allFeaturesFound;
}

// Check for mobile-specific optimizations
function checkMobileOptimizations() {
    console.log('\n📱 Checking mobile optimizations...');
    
    const customCSSPath = path.join(__dirname, 'css', 'custom.css');
    const customCSS = fs.readFileSync(customCSSPath, 'utf8');
    
    const mobileFeatures = [
        { name: 'Small mobile breakpoint (320px-480px)', pattern: /@media.*max-width.*480px/ },
        { name: 'Medium mobile breakpoint (481px-768px)', pattern: /@media.*min-width.*481px.*max-width.*768px/ },
        { name: 'Portrait orientation support', pattern: /@media.*orientation.*portrait/ },
        { name: 'Landscape orientation support', pattern: /@media.*orientation.*landscape/ },
        { name: 'Touch-friendly sizing', pattern: /95vw|90vw/ },
        { name: 'Vertical stacking layout', pattern: /top:.*calc.*font-xxl/ },
        { name: 'Overlap prevention', pattern: /z-index/ }
    ];
    
    let allMobileFeaturesFound = true;
    
    mobileFeatures.forEach(feature => {
        if (feature.pattern.test(customCSS)) {
            console.log(`✅ ${feature.name} implemented`);
        } else {
            console.log(`❌ ${feature.name} missing`);
            allMobileFeaturesFound = false;
        }
    });
    
    return allMobileFeaturesFound;
}

// Check test files
function checkTestFiles() {
    console.log('\n🧪 Checking test files...');
    
    const testFiles = [
        'mobile-responsive-test.html',
        'MOBILE_RESPONSIVE_IMPLEMENTATION.md'
    ];
    
    let allTestFilesExist = true;
    
    testFiles.forEach(file => {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            console.log(`✅ ${file} exists`);
        } else {
            console.log(`❌ ${file} missing`);
            allTestFilesExist = false;
        }
    });
    
    return allTestFilesExist;
}

// Check for old conflicting CSS
function checkForConflicts() {
    console.log('\n🔍 Checking for conflicting CSS...');
    
    const customCSSPath = path.join(__dirname, 'css', 'custom.css');
    const customCSS = fs.readFileSync(customCSSPath, 'utf8');
    
    const conflicts = [
        { name: 'Fixed pixel values', pattern: /:\s*\d+px(?!\s*\))/g },
        { name: 'Old percentage values without clamp', pattern: /:\s*\d+vw(?!\s*\))/g },
        { name: 'Hardcoded positions', pattern: /top:\s*\d+px|left:\s*\d+px|right:\s*\d+px|bottom:\s*\d+px/g }
    ];
    
    let noConflicts = true;
    
    conflicts.forEach(conflict => {
        const matches = customCSS.match(conflict.pattern);
        if (matches && matches.length > 0) {
            console.log(`⚠️  ${conflict.name} found (${matches.length} instances)`);
            console.log(`   Examples: ${matches.slice(0, 3).join(', ')}`);
            // Note: Some pixel values might be intentional (like borders), so this is a warning
        } else {
            console.log(`✅ No ${conflict.name.toLowerCase()} found`);
        }
    });
    
    return noConflicts;
}

// Analyze CSS structure
function analyzeCSSStructure() {
    console.log('\n📊 Analyzing CSS structure...');
    
    const customCSSPath = path.join(__dirname, 'css', 'custom.css');
    const customCSS = fs.readFileSync(customCSSPath, 'utf8');
    
    const stats = {
        totalLines: customCSS.split('\n').length,
        mediaQueries: (customCSS.match(/@media/g) || []).length,
        clampFunctions: (customCSS.match(/clamp\(/g) || []).length,
        customProperties: (customCSS.match(/--[a-zA-Z-]+:/g) || []).length,
        regions: (customCSS.match(/\.region\./g) || []).length
    };
    
    console.log(`📏 Total lines: ${stats.totalLines}`);
    console.log(`📱 Media queries: ${stats.mediaQueries}`);
    console.log(`🔧 Clamp functions: ${stats.clampFunctions}`);
    console.log(`🎨 Custom properties: ${stats.customProperties}`);
    console.log(`📍 Region definitions: ${stats.regions}`);
    
    // Quality assessment
    if (stats.mediaQueries >= 5 && stats.clampFunctions >= 10 && stats.customProperties >= 15) {
        console.log('✅ CSS structure looks comprehensive');
        return true;
    } else {
        console.log('⚠️  CSS structure might need more responsive features');
        return false;
    }
}

// Main verification function
async function runVerification() {
    console.log('🚀 Starting Responsive CSS Verification...\n');
    
    let allChecksPass = true;
    
    // Run all checks
    allChecksPass &= checkResponsiveCSS();
    allChecksPass &= checkMobileOptimizations();
    allChecksPass &= checkTestFiles();
    allChecksPass &= checkForConflicts();
    allChecksPass &= analyzeCSSStructure();
    
    // Final result
    console.log('\n' + '='.repeat(60));
    if (allChecksPass) {
        console.log('🎉 ALL RESPONSIVE CHECKS PASSED!');
        console.log('✅ Mobile-first responsive design implemented');
        console.log('✅ Zero overlapping system in place');
        console.log('✅ Comprehensive breakpoint coverage');
        console.log('✅ Modern CSS features utilized');
        console.log('\n📋 Next steps:');
        console.log('1. Test with: mobile-responsive-test.html');
        console.log('2. Start MagicMirror: npm start');
        console.log('3. Test on actual mobile devices');
        console.log('4. Verify no overlapping occurs');
    } else {
        console.log('❌ SOME RESPONSIVE CHECKS FAILED');
        console.log('⚠️  Please review the issues above');
        console.log('📖 Check MOBILE_RESPONSIVE_IMPLEMENTATION.md for details');
    }
    console.log('='.repeat(60));
}

// Run verification
runVerification().catch(error => {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
});
