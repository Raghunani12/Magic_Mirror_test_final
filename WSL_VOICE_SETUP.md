# 🎤 WSL Voice Control Setup Guide

## 🚨 WSL Audio Limitations

**Windows Subsystem for Linux (WSL) has significant audio limitations:**
- ❌ No direct microphone access
- ❌ No ALSA/PulseAudio support  
- ❌ Traditional voice recognition won't work
- ✅ **Solution: Browser-based voice control**

## 🎯 WSL-Compatible Voice Control Solution

I've created a **hybrid solution** that works perfectly with WSL:

### **How It Works:**
1. **WSL runs MagicMirror** (your current setup)
2. **Windows browser handles voice recognition** (using Web Speech API)
3. **HTTP bridge connects them** (seamless communication)

## 🚀 Quick Setup

### **Step 1: Start MagicMirror**
```bash
# In your WSL terminal
npm run server
```

### **Step 2: Open Voice Control Interface**
Open your **Windows browser** and go to:
```
http://localhost:3001
```

### **Step 3: Start Voice Control**
1. Click **"🎤 Start Listening"** 
2. Grant microphone permissions when prompted
3. Say voice commands like **"Magic Mirror show weather"**

## 🗣️ Available Voice Commands

### **Format:** "Magic Mirror [command]"

| Command | Action |
|---------|--------|
| **"Magic Mirror show weather"** | Display weather module |
| **"Magic Mirror hide weather"** | Hide weather module |
| **"Magic Mirror show calendar"** | Display calendar |
| **"Magic Mirror hide calendar"** | Hide calendar |
| **"Magic Mirror show news"** | Display news feed |
| **"Magic Mirror hide news"** | Hide news feed |
| **"Magic Mirror show photos"** | Display photo slideshow |
| **"Magic Mirror hide photos"** | Hide photo slideshow |
| **"Magic Mirror refresh"** | Refresh the mirror |
| **"Magic Mirror good morning"** | Show morning modules |
| **"Magic Mirror good night"** | Hide evening modules |

## 🔧 Configuration

The WSL voice control is already configured in your `config.js`:

```javascript
{
    module: "MMM-WSLVoice",
    position: "bottom_bar",
    config: {
        debug: false,
        enableVisualFeedback: true,
        feedbackDuration: 3000,
        bridgePort: 3001,
        commands: {
            "magic mirror show weather": "WEATHER_SHOW",
            // ... other commands
        }
    }
}
```

## 🛠️ Troubleshooting

### **Voice Interface Not Loading**
```bash
# Check if MagicMirror is running
curl http://localhost:8080

# Check if voice bridge is running  
curl http://localhost:3001
```

### **Microphone Not Working**
1. **Check Windows microphone permissions**
   - Windows Settings → Privacy → Microphone
   - Allow browser access to microphone

2. **Test in browser**
   - Try voice search in Google
   - Ensure microphone works in Windows

3. **Browser compatibility**
   - Use Chrome, Edge, or Firefox
   - Enable microphone permissions for localhost

### **Commands Not Working**
1. **Check console for errors**
   - Press F12 in browser
   - Look for error messages

2. **Verify MagicMirror connection**
   - Ensure MagicMirror is running on port 8080
   - Check WSL network connectivity

3. **Test manual commands**
   ```bash
   # Test the voice endpoint
   curl -X POST http://localhost:3001/voice-command \
        -H "Content-Type: application/json" \
        -d '{"command":"magic mirror show weather"}'
   ```

### **WSL Network Issues**
```bash
# Check WSL IP address
ip addr show eth0

# Test localhost connectivity
curl http://localhost:8080
curl http://localhost:3001
```

## 🎨 Visual Feedback

The voice control includes beautiful visual feedback:
- **Blue notifications** for successful commands
- **Red notifications** for errors
- **Smooth animations** matching your theme
- **Professional styling** with Cinzel font

## 🔄 Alternative Solutions

### **Option 1: Windows Native MagicMirror**
Run MagicMirror directly on Windows for full audio support:
```bash
# Install Node.js on Windows
# Clone your repository to Windows
# Run: npm install && npm run server
```

### **Option 2: Remote Voice Control**
Use a mobile app or another device to send voice commands:
- Voice control via smartphone
- Remote control web interface
- Home Assistant integration

### **Option 3: Keyboard Shortcuts**
Add keyboard shortcuts for quick module control:
```javascript
// Add to config.js
{
    module: "MMM-KeyBindings",
    config: {
        keyBindings: {
            "w": "WEATHER_TOGGLE",
            "c": "CALENDAR_TOGGLE",
            "n": "NEWS_TOGGLE"
        }
    }
}
```

## 📱 Mobile Voice Control

You can also use the voice interface on your mobile device:

1. **Connect to same network** as your WSL machine
2. **Find WSL IP address**: `ip addr show eth0`
3. **Open browser on mobile**: `http://[WSL_IP]:3001`
4. **Use voice commands** from your phone

## 🎯 Advanced Configuration

### **Custom Commands**
Add your own voice commands in `config.js`:

```javascript
commands: {
    "magic mirror party mode": "PARTY_MODE",
    "magic mirror work mode": "WORK_MODE",
    "magic mirror sleep": "SLEEP_MODE"
}
```

### **Different Port**
Change the voice control port:

```javascript
config: {
    bridgePort: 3002, // Use different port
}
```

### **Debug Mode**
Enable detailed logging:

```javascript
config: {
    debug: true, // Shows detailed logs
}
```

## 🎉 Benefits of WSL Solution

✅ **Works with WSL limitations**  
✅ **No additional software needed**  
✅ **Uses Windows microphone directly**  
✅ **Professional visual feedback**  
✅ **Easy to use and configure**  
✅ **Privacy-focused (browser-based)**  
✅ **Cross-platform compatible**  

## 📞 Support

### **Getting Help**
1. Check browser console (F12) for errors
2. Verify MagicMirror is running on port 8080
3. Test microphone in Windows settings
4. Ensure browser has microphone permissions

### **Common Error Messages**
- **"Connection error"** → MagicMirror not running
- **"Microphone not supported"** → Use Chrome/Edge/Firefox
- **"Permission denied"** → Grant microphone access
- **"Command not recognized"** → Check command spelling

---

**🎤 Your WSL-compatible voice control is ready! Open http://localhost:3001 in your Windows browser to start using voice commands!**
