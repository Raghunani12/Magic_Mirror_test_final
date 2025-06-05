# 📸 Smart Mirror Photo Setup - Client Guide

## 🎯 **Working Solution (3 Easy Steps!)**

### **Step 1: Upload Photos to Google Drive**
1. **Go to Google Drive** (drive.google.com)
2. **Upload your photos** to any folder
3. **Make sure photos are JPG, PNG, or GIF format**

### **Step 2: Get Photo File IDs**
For each photo you want on your smart mirror:

1. **Right-click the photo** in Google Drive
2. **Click "Share"** → "Get link"
3. **Change to "Anyone with the link can view"**
4. **Copy the link** - it looks like:
   ```
   https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view
   ```
5. **Extract the file ID**: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

### **Step 3: Update Your Smart Mirror**
1. **Open your smart mirror configuration**
2. **Find the fileIds section:**
   ```javascript
   fileIds: [
       // Add your file IDs here
   ],
   ```
3. **Add your file IDs:**
   ```javascript
   fileIds: [
       "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
       "1234567890abcdefghijklmnopqrstuvwxyz",
       "another_file_id_from_your_photos"
   ],
   ```
4. **Restart your smart mirror**

## ✅ **Your Photos Will Now Display!**

The smart mirror will rotate through your photos every 10 seconds.

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
