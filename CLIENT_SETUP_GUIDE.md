# 📸 Smart Mirror Photo Setup - Client Guide

## 🎯 **Super Simple Setup (2 Steps Only!)**

### **Step 1: Share Your Google Drive Folder**
1. **Go to Google Drive** (drive.google.com)
2. **Create a folder** with your photos (or use existing folder)
3. **Right-click the folder** → "Share"
4. **Change to "Anyone with the link can view"**
5. **Copy the sharing link**

### **Step 2: Update Your Smart Mirror**
1. **Open the configuration file** on your smart mirror
2. **Find this line:**
   ```javascript
   googleDriveFolderUrl: "PASTE_YOUR_LINK_HERE",
   ```
3. **Replace with your folder link:**
   ```javascript
   googleDriveFolderUrl: "https://drive.google.com/drive/folders/YOUR_FOLDER_ID",
   ```
4. **Restart your smart mirror**

## ✅ **That's It!**

Your smart mirror will now display photos from your Google Drive folder and automatically check for new photos every 2 hours.

---

## 🔧 **Advanced Settings (Optional)**

If you want to customize the photo display:

```javascript
{
    googleDriveFolderUrl: "YOUR_GOOGLE_DRIVE_LINK",
    slideshowSpeed: 10 * 1000,        // 10 seconds per photo
    fixedImageWidth: 120,             // Photo width
    fixedImageHeight: 80,             // Photo height
    randomizeImageOrder: true,        // Shuffle photos
    makeImagesGrayscale: false,       // Color photos
    maxImages: 20,                    // Max photos to load
    updateInterval: 2 * 60 * 60 * 1000 // Check for new photos every 2 hours
}
```

---

## 🚨 **Troubleshooting**

### **Photos not showing?**
1. **Check folder sharing** - Must be "Anyone with the link can view"
2. **Verify the link** - Should start with `https://drive.google.com/drive/folders/`
3. **Restart smart mirror** after making changes

### **Want to add more photos?**
1. **Upload photos** to your Google Drive folder
2. **Wait up to 2 hours** for automatic update
3. **Or restart smart mirror** for immediate update

### **Want different photos?**
1. **Replace photos** in your Google Drive folder
2. **Smart mirror will automatically** show new photos

---

## 📱 **Mobile App Integration (Future)**

Coming soon: Mobile app to make photo management even easier!
- Take photo with phone → Automatically appears on smart mirror
- Family members can add photos remotely
- Instant photo updates

---

## 🎉 **Enjoy Your Smart Mirror!**

Your photos will now rotate automatically on your smart mirror, keeping your display fresh and personal.

**Support:** Contact your smart mirror provider for technical assistance.
