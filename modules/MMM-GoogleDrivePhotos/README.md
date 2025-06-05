# 📸 MMM-GoogleDrivePhotos

A MagicMirror² module that displays photos directly from shared Google Drive folders. Perfect for displaying family photos, event pictures, or any shared photo collection that updates automatically.

## ✨ Features

- **🌐 Direct Google Drive Integration** - Display photos from shared Google Drive folders
- **🔄 Auto-Updates** - Automatically checks for new photos periodically
- **🎲 Random Slideshow** - Randomizes photo order for variety
- **📱 Responsive Design** - Adapts to different screen sizes
- **🎨 Customizable Display** - Fixed dimensions, grayscale option, transition effects
- **⚡ Easy Setup** - Just share a Google Drive folder and paste the URL

## 🚀 Quick Setup

### Step 1: Prepare Your Google Drive Folder

1. **Create or select a folder** in Google Drive with your photos
2. **Right-click the folder** → "Share" → "Get link"
3. **Set permissions** to "Anyone with the link can view"
4. **Copy the sharing URL** (looks like: `https://drive.google.com/drive/folders/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`)

### Step 2: Configure the Module

Add this to your `config/config.js`:

```javascript
{
    module: "MMM-GoogleDrivePhotos",
    position: "top_bar", // or any position you prefer
    config: {
        googleDriveFolderUrl: "https://drive.google.com/drive/folders/YOUR_FOLDER_ID_HERE",
        slideshowSpeed: 10 * 1000, // 10 seconds per image
        fixedImageWidth: 300,
        fixedImageHeight: 200,
        randomizeImageOrder: true,
        makeImagesGrayscale: false, // Set to true for black/white theme
        updateInterval: 60 * 60 * 1000 // Check for new photos every hour
    }
}
```

### Step 3: Alternative Setup (Direct File IDs)

If the folder URL doesn't work, you can specify individual file IDs:

```javascript
{
    module: "MMM-GoogleDrivePhotos",
    position: "top_bar",
    config: {
        fileIds: [
            "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
            "1234567890abcdefghijklmnopqrstuvwxyz",
            "another_file_id_here"
        ],
        slideshowSpeed: 8 * 1000,
        fixedImageWidth: 400,
        fixedImageHeight: 300
    }
}
```

## ⚙️ Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| `googleDriveFolderUrl` | `""` | Shared Google Drive folder URL |
| `folderId` | `""` | Folder ID (auto-extracted from URL) |
| `fileIds` | `[]` | Array of individual file IDs (alternative to folder) |
| `slideshowSpeed` | `10000` | Time per image in milliseconds |
| `delayUntilRestart` | `0` | Delay before restarting slideshow |
| `fixedImageWidth` | `300` | Fixed width for images (pixels) |
| `fixedImageHeight` | `200` | Fixed height for images (pixels) |
| `randomizeImageOrder` | `true` | Randomize image display order |
| `makeImagesGrayscale` | `false` | Convert images to grayscale |
| `maxImages` | `50` | Maximum number of images to load |
| `updateInterval` | `3600000` | Check for new images interval (ms) |
| `showImageInfo` | `false` | Show image filename overlay |
| `transitionSpeed` | `1000` | Fade transition speed (ms) |
| `debug` | `false` | Enable debug logging |

## 📋 How to Get Google Drive URLs

### Method 1: Folder Sharing URL
1. Open Google Drive
2. Right-click your photo folder
3. Select "Share" → "Get link"
4. Set to "Anyone with the link can view"
5. Copy the URL

### Method 2: Individual File IDs
1. Open a photo in Google Drive
2. Click "Share" → "Get link"
3. The URL contains the file ID: `https://drive.google.com/file/d/FILE_ID_HERE/view`
4. Extract the FILE_ID_HERE part
5. Repeat for each photo

## 🔧 Advanced Configuration

### Family Photo Display
```javascript
{
    module: "MMM-GoogleDrivePhotos",
    position: "bottom_center",
    config: {
        googleDriveFolderUrl: "https://drive.google.com/drive/folders/family_photos_id",
        slideshowSpeed: 15 * 1000, // 15 seconds per photo
        fixedImageWidth: 500,
        fixedImageHeight: 350,
        randomizeImageOrder: true,
        showImageInfo: true,
        updateInterval: 30 * 60 * 1000 // Check every 30 minutes
    }
}
```

### Black & White Theme
```javascript
{
    module: "MMM-GoogleDrivePhotos",
    position: "top_right",
    config: {
        googleDriveFolderUrl: "https://drive.google.com/drive/folders/your_folder_id",
        makeImagesGrayscale: true,
        fixedImageWidth: 250,
        fixedImageHeight: 180,
        slideshowSpeed: 12 * 1000
    }
}
```

## 🚨 Troubleshooting

### Photos Not Loading
1. **Check folder permissions** - Must be "Anyone with the link can view"
2. **Verify folder URL** - Should contain `/folders/` in the path
3. **Check file formats** - Only JPG, PNG, GIF images are supported
4. **Enable debug mode** - Set `debug: true` in config

### Slow Loading
1. **Reduce maxImages** - Lower the `maxImages` setting
2. **Increase updateInterval** - Check for new photos less frequently
3. **Optimize image sizes** - Use smaller images in Google Drive

### Access Denied Errors
1. **Folder must be publicly shared** - "Anyone with the link can view"
2. **Check folder ID** - Ensure the ID is correctly extracted
3. **Try individual file IDs** - Use the alternative setup method

## 🎯 Use Cases

- **Family Photos** - Display rotating family pictures
- **Event Photos** - Show photos from recent events or parties
- **Art Gallery** - Display artwork or photography collections
- **Business Display** - Show product photos or company images
- **Memory Lane** - Rotating display of memorable moments

## 🔄 How It Works

1. **Module starts** and extracts folder ID from Google Drive URL
2. **Connects to Google Drive** using public folder access
3. **Downloads image list** from the shared folder
4. **Displays images** in a rotating slideshow
5. **Periodically checks** for new photos and updates automatically

## 📱 Mobile & Responsive

The module automatically adapts to different screen sizes:
- **Desktop**: Full-size images with hover effects
- **Tablet**: Scaled images with touch-friendly interface  
- **Mobile**: Optimized for small screens

## 🎉 Success Tips

1. **Use high-quality images** for best display results
2. **Keep folder organized** - Remove old/unwanted photos
3. **Regular updates** - Add new photos to keep content fresh
4. **Test sharing settings** - Verify folder is publicly accessible
5. **Monitor performance** - Adjust settings based on your internet speed

---

**📸 Enjoy dynamic photo displays that update automatically!** 🌟
