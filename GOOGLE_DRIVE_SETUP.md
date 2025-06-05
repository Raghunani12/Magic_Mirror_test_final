# 📸 Google Drive Photos Setup Guide

## 🚀 Quick Setup (2 Methods)

### Method 1: Shared Folder URL (Easiest)

1. **Create/Select a folder** in Google Drive with your photos
2. **Right-click the folder** → "Share"
3. **Change permissions** to "Anyone with the link can view"
4. **Copy the sharing URL**
5. **Paste the URL** in your config.js:

```javascript
{
    module: "MMM-GoogleDrivePhotos",
    position: "top_bar",
    config: {
        googleDriveFolderUrl: "https://drive.google.com/drive/folders/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
        slideshowSpeed: 10 * 1000,
        fixedImageWidth: 300,
        fixedImageHeight: 200
    }
}
```

### Method 2: Individual File IDs (Most Reliable)

1. **Open each photo** in Google Drive
2. **Click "Share"** → "Get link" 
3. **Set to "Anyone with the link can view"**
4. **Copy the file ID** from the URL:
   - URL: `https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view`
   - File ID: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`
5. **Add file IDs** to your config.js:

```javascript
{
    module: "MMM-GoogleDrivePhotos",
    position: "top_bar",
    config: {
        fileIds: [
            "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
            "1234567890abcdefghijklmnopqrstuvwxyz",
            "another_file_id_here_from_google_drive"
        ],
        slideshowSpeed: 10 * 1000,
        fixedImageWidth: 300,
        fixedImageHeight: 200
    }
}
```

## 📋 Step-by-Step Instructions

### Step 1: Prepare Your Photos
- Upload photos to Google Drive
- Organize them in a folder (optional)
- Ensure photos are JPG, PNG, or GIF format

### Step 2: Share Your Photos
**For Folder Sharing:**
1. Right-click folder → "Share"
2. Click "Change to anyone with the link"
3. Set to "Viewer" permissions
4. Copy the link

**For Individual Files:**
1. Right-click each photo → "Share"
2. Click "Change to anyone with the link" 
3. Set to "Viewer" permissions
4. Copy the file ID from the URL

### Step 3: Update Configuration
Edit your `config/config.js` file and update the MMM-GoogleDrivePhotos section:

```javascript
// Replace the existing MMM-ImageSlideshow with this:
{
    module: "MMM-GoogleDrivePhotos",
    position: "top_bar", // or wherever you want photos
    config: {
        // Choose ONE method:
        
        // Method 1: Folder URL
        googleDriveFolderUrl: "YOUR_FOLDER_URL_HERE",
        
        // Method 2: File IDs (comment out if using folder URL)
        fileIds: [
            "YOUR_FILE_ID_1",
            "YOUR_FILE_ID_2", 
            "YOUR_FILE_ID_3"
        ],
        
        // Display settings
        slideshowSpeed: 12 * 1000, // 12 seconds per image
        fixedImageWidth: 120,
        fixedImageHeight: 80,
        randomizeImageOrder: true,
        makeImagesGrayscale: false, // true for black/white theme
        updateInterval: 60 * 60 * 1000 // Check for new photos hourly
    }
}
```

### Step 4: Restart MagicMirror
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run server
```

## 🔧 Configuration Options

| Setting | Description | Example |
|---------|-------------|---------|
| `googleDriveFolderUrl` | Shared folder URL | `"https://drive.google.com/drive/folders/..."` |
| `fileIds` | Array of file IDs | `["1Bxi...", "1234..."]` |
| `slideshowSpeed` | Time per image (ms) | `10000` (10 seconds) |
| `fixedImageWidth` | Image width (pixels) | `300` |
| `fixedImageHeight` | Image height (pixels) | `200` |
| `randomizeImageOrder` | Shuffle photos | `true` |
| `makeImagesGrayscale` | Black & white | `false` |
| `updateInterval` | Check for new photos | `3600000` (1 hour) |

## 🚨 Troubleshooting

### Photos Not Loading?
1. **Check sharing permissions** - Must be "Anyone with the link can view"
2. **Verify URLs/IDs** - Make sure they're copied correctly
3. **Try individual file IDs** - More reliable than folder URLs
4. **Check browser console** - Look for error messages

### Slow Loading?
1. **Use smaller images** - Compress photos before uploading
2. **Limit number of photos** - Set `maxImages: 20`
3. **Increase slideshow speed** - Give more time per image

### Access Denied?
1. **Double-check sharing settings** - Must be public
2. **Try incognito mode** - Test if photos are accessible
3. **Use file IDs instead** - More reliable than folder URLs

## 💡 Pro Tips

1. **Organize photos by event** - Create separate folders
2. **Use descriptive filenames** - Enable `showImageInfo: true`
3. **Regular cleanup** - Remove old photos to keep fresh content
4. **Test sharing** - Open links in incognito to verify access
5. **Backup file IDs** - Keep a list of your photo IDs

## 🎯 Example Configurations

### Family Photos
```javascript
{
    module: "MMM-GoogleDrivePhotos",
    position: "bottom_center",
    config: {
        googleDriveFolderUrl: "https://drive.google.com/drive/folders/family_photos",
        slideshowSpeed: 15 * 1000,
        fixedImageWidth: 400,
        fixedImageHeight: 300,
        showImageInfo: true
    }
}
```

### Event Photos
```javascript
{
    module: "MMM-GoogleDrivePhotos", 
    position: "top_right",
    config: {
        fileIds: ["event_photo_1", "event_photo_2", "event_photo_3"],
        slideshowSpeed: 8 * 1000,
        fixedImageWidth: 250,
        fixedImageHeight: 180,
        randomizeImageOrder: true
    }
}
```

---

**📸 Enjoy your dynamic Google Drive photo slideshow!** 🌟
