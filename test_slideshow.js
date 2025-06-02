// Test script for MMM-ImageSlideshow debugging
console.log("🖼️ Testing MMM-ImageSlideshow");

function testImageSlideshow() {
    console.log("=== MMM-IMAGESLIDESHOW DIAGNOSTIC ===");
    
    // 1. Check if module is loaded
    if (typeof MM !== 'undefined') {
        const slideshowModule = MM.getModules().find(m => m.name === 'MMM-ImageSlideshow');
        if (slideshowModule) {
            console.log("✅ MMM-ImageSlideshow module found");
            console.log("Module status:", {
                loaded: slideshowModule.loaded,
                hidden: slideshowModule.hidden,
                suspended: slideshowModule.suspended,
                identifier: slideshowModule.identifier
            });
            
            // Check DOM element
            const element = document.getElementById(slideshowModule.identifier);
            if (element) {
                console.log("✅ DOM element found");
                console.log("Element content length:", element.innerHTML.length);
                console.log("Element classes:", element.className);
                console.log("Element position:", element.style.position);
                console.log("Element visibility:", window.getComputedStyle(element).visibility);
                console.log("Element display:", window.getComputedStyle(element).display);
                
                // Check for images
                const images = element.querySelectorAll('img');
                console.log(`Found ${images.length} images in slideshow`);
                
                if (images.length > 0) {
                    images.forEach((img, index) => {
                        console.log(`Image ${index + 1}:`, {
                            src: img.src,
                            loaded: img.complete,
                            naturalWidth: img.naturalWidth,
                            naturalHeight: img.naturalHeight
                        });
                    });
                } else {
                    console.log("⚠️ No images found in slideshow element");
                }
            } else {
                console.log("❌ DOM element not found");
            }
            
            // Force module update
            console.log("🔄 Forcing module update...");
            slideshowModule.updateDom();
            
        } else {
            console.log("❌ MMM-ImageSlideshow module not found");
        }
    } else {
        console.log("❌ MM object not available");
    }
    
    // 2. Check photos directory access
    console.log("=== PHOTOS DIRECTORY TEST ===");
    fetch('/photos/')
        .then(response => {
            console.log("Photos directory response:", response.status);
            if (response.ok) {
                return response.text();
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        })
        .then(html => {
            console.log("✅ Photos directory accessible");
            // Count image files mentioned in directory listing
            const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
            let imageCount = 0;
            imageExtensions.forEach(ext => {
                const regex = new RegExp(`\\.${ext}`, 'gi');
                const matches = html.match(regex);
                if (matches) imageCount += matches.length;
            });
            console.log(`Found ${imageCount} image files in directory listing`);
        })
        .catch(error => {
            console.log("❌ Photos directory not accessible:", error);
        });
    
    // 3. Test individual image access
    console.log("=== INDIVIDUAL IMAGE TEST ===");
    const testImages = [
        'photos/bat.jpeg',
        'photos/flute-girl.jpeg',
        'photos/hacker-mask.jpeg',
        'photos/joker.jpeg',
        'photos/kingg.jpeg'
    ];
    
    testImages.forEach(imagePath => {
        fetch(imagePath)
            .then(response => {
                if (response.ok) {
                    console.log(`✅ ${imagePath} - accessible`);
                } else {
                    console.log(`❌ ${imagePath} - HTTP ${response.status}`);
                }
            })
            .catch(error => {
                console.log(`❌ ${imagePath} - error:`, error);
            });
    });
    
    // 4. Check bottom_left region
    console.log("=== BOTTOM LEFT REGION TEST ===");
    const bottomLeftRegion = document.querySelector('.region.bottom.left');
    if (bottomLeftRegion) {
        console.log("✅ Bottom left region found");
        const container = bottomLeftRegion.querySelector('.container');
        if (container) {
            console.log("Container children:", container.children.length);
            Array.from(container.children).forEach((child, index) => {
                console.log(`Child ${index + 1}:`, {
                    id: child.id,
                    className: child.className,
                    innerHTML: child.innerHTML.length > 0 ? `${child.innerHTML.length} chars` : 'empty'
                });
            });
        }
    } else {
        console.log("❌ Bottom left region not found");
    }
}

// Run test
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(testImageSlideshow, 3000);
    });
} else {
    setTimeout(testImageSlideshow, 3000);
}

// Make function available globally
window.testImageSlideshow = testImageSlideshow;

console.log("🖼️ Image slideshow test will run in 3 seconds...");
console.log("Or run manually: testImageSlideshow()");
