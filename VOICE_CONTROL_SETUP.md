# 🎤 Voice Control Setup Guide for Magic Mirror

## 🚀 Quick Installation

### Step 1: Run the Installation Script
```bash
# Make the script executable
chmod +x install-voice-control.sh

# Run the installation
./install-voice-control.sh
```

### Step 2: Configure Your Microphone
```bash
# Linux - List audio devices
arecord -l

# macOS - List audio devices  
system_profiler SPAudioDataType

# Windows - Use Device Manager or Sound Settings
```

### Step 3: Update Configuration
Edit `config/config.js` and update the microphone ID:
```javascript
{
    module: "MMM-voice",
    config: {
        microphone: 1, // Update this number based on your device list
        // ... other settings
    }
}
```

### Step 4: Start Magic Mirror
```bash
npm run server
```

## 🗣️ Voice Commands

### Wake Word
Say **"MAGIC MIRROR"** to activate voice control. You'll see a visual indicator when the system is listening.

### Available Commands

#### 📱 Module Control
- **"HIDE MODULES"** - Hide all modules
- **"SHOW MODULES"** - Show all modules
- **"WAKE UP"** - Wake up the mirror
- **"GO TO SLEEP"** - Put mirror to sleep

#### 🌤️ Weather Commands
- **"SHOW WEATHER"** - Display weather module
- **"HIDE WEATHER"** - Hide weather module
- **"UPDATE WEATHER"** - Refresh weather data

#### 📅 Calendar Commands
- **"SHOW CALENDAR"** - Display calendar
- **"HIDE CALENDAR"** - Hide calendar
- **"NEXT EVENT"** - Show next calendar event

#### 📰 News Commands
- **"SHOW NEWS"** - Display news feed
- **"HIDE NEWS"** - Hide news feed
- **"NEXT NEWS"** - Show next news item

#### 🖼️ Photo Commands
- **"SHOW PHOTOS"** - Display photo slideshow
- **"HIDE PHOTOS"** - Hide photo slideshow
- **"NEXT PHOTO"** - Show next photo

#### 💬 Compliments Commands
- **"SHOW COMPLIMENTS"** - Display compliments
- **"HIDE COMPLIMENTS"** - Hide compliments

#### ⚙️ System Commands
- **"REFRESH"** - Refresh the mirror
- **"RESTART"** - Restart the mirror

#### 🌅 Custom Scene Commands
- **"GOOD MORNING"** - Show morning modules (clock, weather, calendar)
- **"GOOD NIGHT"** - Hide evening modules (news, photos)

## 🔧 Configuration Options

### MMM-voice Module Settings
```javascript
{
    module: "MMM-voice",
    config: {
        microphone: 1,              // Microphone device ID
        keyword: "MAGIC MIRROR",    // Wake word (UPPERCASE only)
        timeout: 15,                // Listening timeout in seconds
        speed: 1000,                // Animation speed
        confirmationSound: true,    // Audio feedback
        debug: false,               // Debug mode
        commands: {
            // Your voice commands mapping
        }
    }
}
```

### MMM-VoiceHelper Settings
```javascript
{
    module: "MMM-VoiceHelper", 
    config: {
        debug: false,               // Debug mode
        enableAudioFeedback: true,  // Audio confirmation
        enableVisualFeedback: true, // Visual confirmation
        commandTimeout: 5000,       // Command execution timeout
        feedbackDuration: 3000,     // Feedback display duration
        customCommands: {
            // Add your custom commands here
        }
    }
}
```

## 🛠️ Troubleshooting

### Microphone Issues
1. **Check microphone connection**
   ```bash
   # Test microphone recording
   arecord -d 5 test.wav
   aplay test.wav
   ```

2. **Verify permissions**
   - Ensure microphone permissions are granted
   - Check privacy settings on macOS/Windows

3. **Update microphone ID**
   - Use `arecord -l` to find correct device
   - Update `microphone` setting in config.js

### Recognition Issues
1. **Speak clearly and loudly**
   - Position microphone 1-3 feet away
   - Reduce background noise
   - Speak at normal pace

2. **Check wake word**
   - Must say "MAGIC MIRROR" exactly
   - Wait for visual confirmation before command
   - Commands must be in UPPERCASE in config

3. **Enable debug mode**
   ```javascript
   config: {
       debug: true  // Shows detailed logs
   }
   ```

### Performance Issues
1. **System resources**
   - Close unnecessary applications
   - Ensure adequate CPU/RAM
   - Consider dedicated microphone

2. **Adjust settings**
   ```javascript
   config: {
       timeout: 10,     // Reduce timeout
       speed: 500       // Faster animations
   }
   ```

### Common Error Messages
- **"Microphone not found"** - Check device ID and permissions
- **"Command not recognized"** - Verify command spelling in config
- **"Timeout"** - Speak faster after wake word
- **"Module not found"** - Check module names in config

## 🎯 Advanced Features

### Adding Custom Commands
```javascript
customCommands: {
    "PARTY MODE": {
        action: "show_modules",
        modules: ["MMM-ImageSlideshow", "compliments"],
        hideModules: ["calendar", "newsfeed"]
    },
    "WORK MODE": {
        action: "show_modules", 
        modules: ["calendar", "weather", "newsfeed"],
        hideModules: ["MMM-ImageSlideshow", "compliments"]
    }
}
```

### Voice Feedback Customization
```javascript
config: {
    enableVisualFeedback: true,    // Show command confirmations
    enableAudioFeedback: false,    // Disable audio beeps
    feedbackDuration: 2000         // Show feedback for 2 seconds
}
```

### Multiple Wake Words
```javascript
// In MMM-voice config
keyword: "MAGIC MIRROR",  // Primary wake word
// Note: MMM-voice supports only one wake word
// For multiple wake words, consider MMM-Snowboy
```

## 🔄 Alternative Voice Solutions

### Option 1: MMM-Snowboy (Custom Wake Words)
- Supports custom wake words
- Better accuracy for specific voices
- Requires training files

### Option 2: MMM-GoogleAssistant (Cloud-based)
- Full Google Assistant integration
- Requires internet connection
- More natural language processing

### Option 3: MMM-Alexa (Amazon Integration)
- Amazon Alexa integration
- Smart home control
- Requires Amazon account

## 📱 Mobile Voice Control

### Using Smartphone as Microphone
1. Install VNC or remote desktop app
2. Connect to Magic Mirror
3. Use phone's voice input
4. Send commands via web interface

### Voice Control via Home Assistant
1. Integrate with Home Assistant
2. Use HA voice commands
3. Control Magic Mirror modules
4. Works with Google/Alexa

## 🎨 Visual Feedback Customization

The voice control includes beautiful visual feedback that matches your black & white theme:

- **Blue gradient** - Command received
- **Green pulse** - Listening mode
- **Red flash** - Error or unrecognized command
- **Smooth animations** - Slide in from right
- **Professional styling** - Matches Cinzel font theme

## 📞 Support

### Getting Help
1. Check this troubleshooting guide
2. Enable debug mode for detailed logs
3. Test microphone with system tools
4. Verify module configurations
5. Check MagicMirror² forum for community support

### Reporting Issues
When reporting issues, include:
- Operating system and version
- Microphone model/type
- Error messages from console
- Configuration settings
- Steps to reproduce

---

**🎤 Enjoy your voice-controlled Magic Mirror!**
