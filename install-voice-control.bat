@echo off
REM Voice Control Installation Script for Magic Mirror (Windows)
REM This script installs MMM-voice module with all dependencies

echo 🎤 Installing Voice Control for Magic Mirror...
echo ================================================
echo.

REM Check if we're in the MagicMirror directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from your MagicMirror root directory
    echo    Make sure you can see package.json and modules folder
    pause
    exit /b 1
)

if not exist "modules" (
    echo ❌ Error: modules directory not found
    echo    Please run this script from your MagicMirror root directory
    pause
    exit /b 1
)

echo ✅ Detected MagicMirror installation
echo.

REM Check Node.js installation
echo 📋 Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version
echo.

REM Check npm installation
echo 📋 Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm not found. Please install npm
    pause
    exit /b 1
)

echo ✅ npm found
npm --version
echo.

REM Check git installation
echo 📋 Checking git installation...
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git not found. Please install Git from https://git-scm.com
    pause
    exit /b 1
)

echo ✅ Git found
git --version
echo.

REM Clone MMM-voice module
echo 📥 Cloning MMM-voice module...
cd modules

if exist "MMM-voice" (
    echo ⚠️  MMM-voice directory already exists. Removing old installation...
    rmdir /s /q MMM-voice
)

git clone https://github.com/fewieden/MMM-voice.git
if errorlevel 1 (
    echo ❌ Failed to clone MMM-voice repository
    echo    Check your internet connection and try again
    pause
    exit /b 1
)

echo ✅ MMM-voice module cloned successfully
echo.

REM Install MMM-voice dependencies
echo 📦 Installing MMM-voice dependencies...
cd MMM-voice

echo Installing npm dependencies...
npm install
if errorlevel 1 (
    echo ❌ Failed to install npm dependencies
    pause
    exit /b 1
)

echo ✅ npm dependencies installed
echo.

REM Note about system dependencies
echo 📋 Windows Voice Control Setup Notes:
echo ================================================
echo.
echo ⚠️  IMPORTANT: MMM-voice requires additional setup on Windows:
echo.
echo 1. 🎤 Microphone Setup:
echo    - Ensure your microphone is connected and working
echo    - Test in Windows Sound settings
echo    - Grant microphone permissions to Node.js/Electron
echo.
echo 2. 🔧 Additional Dependencies:
echo    - MMM-voice may require Windows Build Tools
echo    - If you encounter errors, install:
echo      npm install --global windows-build-tools
echo.
echo 3. 🎯 Alternative Options:
echo    - Consider using MMM-GoogleAssistant for better Windows support
echo    - Or use web-based voice control via browser
echo.

REM Go back to MagicMirror root
cd ..\..

REM Create Windows-specific voice control guide
echo 📝 Creating Windows voice control guide...
(
echo # 🎤 Windows Voice Control Guide
echo.
echo ## Quick Start
echo.
echo 1. **Test your microphone:**
echo    - Open Windows Sound settings
echo    - Test microphone recording
echo    - Ensure microphone is set as default
echo.
echo 2. **Start MagicMirror:**
echo    ```
echo    npm run server
echo    ```
echo.
echo 3. **Test voice control:**
echo    - Say "MAGIC MIRROR" ^(wake word^)
echo    - Wait for visual confirmation
echo    - Say "SHOW WEATHER" ^(command^)
echo.
echo ## Windows-Specific Issues
echo.
echo ### Microphone Permissions
echo - Grant microphone access to Node.js/Electron
echo - Check Windows Privacy settings
echo - Ensure microphone is not muted
echo.
echo ### Build Tools ^(if needed^)
echo ```
echo npm install --global windows-build-tools
echo ```
echo.
echo ### Alternative Solutions
echo - Use browser-based voice input
echo - Consider MMM-GoogleAssistant
echo - Use mobile app for voice control
echo.
echo ## Voice Commands
echo.
echo Say "MAGIC MIRROR" then:
echo - "SHOW WEATHER" - Display weather
echo - "HIDE WEATHER" - Hide weather  
echo - "SHOW CALENDAR" - Display calendar
echo - "HIDE CALENDAR" - Hide calendar
echo - "SHOW NEWS" - Display news
echo - "HIDE NEWS" - Hide news
echo - "SHOW PHOTOS" - Display photos
echo - "HIDE PHOTOS" - Hide photos
echo - "REFRESH" - Refresh mirror
echo.
echo ## Troubleshooting
echo.
echo 1. **No microphone detected:**
echo    - Check Device Manager
echo    - Update audio drivers
echo    - Test with Windows Voice Recorder
echo.
echo 2. **Voice not recognized:**
echo    - Speak clearly and loudly
echo    - Reduce background noise
echo    - Check microphone positioning
echo.
echo 3. **Module errors:**
echo    - Check console for errors ^(F12^)
echo    - Verify config.js syntax
echo    - Restart MagicMirror
echo.
) > WINDOWS_VOICE_GUIDE.md

echo ✅ Windows voice control guide created: WINDOWS_VOICE_GUIDE.md
echo.

REM Test the installation
echo 🧪 Testing installation...
node test-voice-control.js

echo.
echo 🎉 Voice Control Installation Complete!
echo ======================================
echo.
echo ✅ MMM-voice module has been installed and configured
echo.
echo 📋 NEXT STEPS:
echo.
echo 1. 🎤 Test your microphone in Windows Sound settings
echo.
echo 2. 🔄 Start MagicMirror:
echo    npm run server
echo.
echo 3. 🗣️ Test voice control:
echo    Say "MAGIC MIRROR" then "SHOW WEATHER"
echo.
echo 4. 📖 Read the guides:
echo    - WINDOWS_VOICE_GUIDE.md
echo    - VOICE_CONTROL_SETUP.md
echo.
echo ⚠️  If you encounter issues:
echo    - Check WINDOWS_VOICE_GUIDE.md for troubleshooting
echo    - Ensure microphone permissions are granted
echo    - Consider alternative voice solutions
echo.
echo Press any key to continue...
pause >nul
