#!/bin/bash

# Voice Control Installation Script for Magic Mirror
# This script installs MMM-voice module with all dependencies

echo "🎤 Installing Voice Control for Magic Mirror..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the MagicMirror directory
if [ ! -f "package.json" ] || [ ! -d "modules" ]; then
    print_error "Please run this script from your MagicMirror root directory"
    exit 1
fi

print_status "Detected MagicMirror installation"

# Check operating system
OS="$(uname -s)"
case "${OS}" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=Mac;;
    CYGWIN*)    MACHINE=Cygwin;;
    MINGW*)     MACHINE=MinGw;;
    *)          MACHINE="UNKNOWN:${OS}"
esac

print_status "Operating System: ${MACHINE}"

# Install system dependencies
print_status "Installing system dependencies..."

if [ "$MACHINE" = "Linux" ]; then
    # Check if running on Raspberry Pi
    if grep -q "Raspberry Pi" /proc/cpuinfo 2>/dev/null; then
        print_status "Raspberry Pi detected - installing ARM-specific dependencies"
        sudo apt-get update
        sudo apt-get install -y bison libasound2-dev autoconf automake libtool python3-dev swig python3-pip build-essential
    else
        print_status "Linux detected - installing dependencies"
        sudo apt-get update
        sudo apt-get install -y bison libasound2-dev autoconf automake libtool python3-dev swig python3-pip build-essential
    fi
elif [ "$MACHINE" = "Mac" ]; then
    print_status "macOS detected - installing dependencies with Homebrew"
    if ! command -v brew &> /dev/null; then
        print_error "Homebrew not found. Please install Homebrew first: https://brew.sh"
        exit 1
    fi
    brew install autoconf automake libtool swig python3
else
    print_warning "Unsupported OS. Manual dependency installation may be required."
fi

# Clone MMM-voice module
print_status "Cloning MMM-voice module..."
cd modules

if [ -d "MMM-voice" ]; then
    print_warning "MMM-voice directory already exists. Removing old installation..."
    rm -rf MMM-voice
fi

git clone https://github.com/fewieden/MMM-voice.git
if [ $? -ne 0 ]; then
    print_error "Failed to clone MMM-voice repository"
    exit 1
fi

cd MMM-voice
print_success "MMM-voice module cloned successfully"

# Install module dependencies
print_status "Installing MMM-voice dependencies..."
cd installers

# Make the dependency script executable
chmod +x dependencies.sh

# Run the dependency installation
print_status "Running dependency installation (this may take several minutes)..."
bash dependencies.sh

if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Dependency installation failed"
    exit 1
fi

# Go back to MagicMirror root
cd ../../..

# Detect microphone
print_status "Detecting available microphones..."
if command -v arecord &> /dev/null; then
    echo "Available audio devices:"
    arecord -l
    echo ""
    print_warning "Please note the card and device numbers for your microphone"
    print_warning "You may need to update the 'microphone' setting in config.js"
else
    print_warning "Could not detect microphones automatically"
fi

# Create voice control documentation
print_status "Creating voice control documentation..."
cat > VOICE_CONTROL_GUIDE.md << 'EOF'
# 🎤 Voice Control Guide

## Wake Word
Say **"MAGIC MIRROR"** to activate voice control. The microphone icon will flash when listening.

## Available Commands

### Module Control
- "HIDE MODULES" - Hide all modules
- "SHOW MODULES" - Show all modules  
- "WAKE UP" - Wake up the mirror
- "GO TO SLEEP" - Put mirror to sleep

### Weather Commands
- "SHOW WEATHER" - Display weather module
- "HIDE WEATHER" - Hide weather module
- "UPDATE WEATHER" - Refresh weather data

### Calendar Commands
- "SHOW CALENDAR" - Display calendar
- "HIDE CALENDAR" - Hide calendar
- "NEXT EVENT" - Show next calendar event

### News Commands
- "SHOW NEWS" - Display news feed
- "HIDE NEWS" - Hide news feed
- "NEXT NEWS" - Show next news item

### Photo Commands
- "SHOW PHOTOS" - Display photo slideshow
- "HIDE PHOTOS" - Hide photo slideshow
- "NEXT PHOTO" - Show next photo

### Compliments Commands
- "SHOW COMPLIMENTS" - Display compliments
- "HIDE COMPLIMENTS" - Hide compliments

### System Commands
- "REFRESH" - Refresh the mirror
- "RESTART" - Restart the mirror

## Troubleshooting

### Microphone Issues
1. Check microphone connection
2. Verify microphone permissions
3. Update microphone ID in config.js
4. Test with: `arecord -l` (Linux) or `system_profiler SPAudioDataType` (Mac)

### Recognition Issues
1. Speak clearly and loudly
2. Reduce background noise
3. Check microphone positioning
4. Enable debug mode in config.js

### Performance Issues
1. Close unnecessary applications
2. Ensure adequate CPU resources
3. Consider using a dedicated microphone
4. Adjust timeout settings

## Configuration

The voice control is configured in `config/config.js` under the MMM-voice module.
Key settings:
- `microphone`: Device ID (check with audio device list)
- `keyword`: Wake word (must be UPPERCASE)
- `timeout`: Listening duration after wake word
- `debug`: Enable for troubleshooting
EOF

print_success "Voice control documentation created: VOICE_CONTROL_GUIDE.md"

# Final instructions
echo ""
echo "🎉 Voice Control Installation Complete!"
echo "======================================"
echo ""
print_success "MMM-voice module has been installed and configured"
print_warning "IMPORTANT NEXT STEPS:"
echo ""
echo "1. 🎤 Test your microphone:"
echo "   Linux: arecord -l"
echo "   Mac: system_profiler SPAudioDataType"
echo ""
echo "2. 📝 Update microphone ID in config/config.js if needed"
echo "   Look for: microphone: 1"
echo ""
echo "3. 🔄 Restart MagicMirror:"
echo "   npm run server"
echo ""
echo "4. 🗣️ Test voice control:"
echo "   Say 'MAGIC MIRROR' then 'SHOW WEATHER'"
echo ""
echo "5. 📖 Read the guide:"
echo "   cat VOICE_CONTROL_GUIDE.md"
echo ""
print_warning "If you encounter issues, check VOICE_CONTROL_GUIDE.md for troubleshooting"
echo ""
