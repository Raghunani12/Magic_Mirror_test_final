#!/bin/bash

# Voice Control Installation Script for Magic Mirror on Kali Linux
# Optimized for Kali Linux with proper dependency handling

echo "🎤 Installing Voice Control for Magic Mirror on Kali Linux..."
echo "============================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
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

print_kali() {
    echo -e "${PURPLE}[KALI]${NC} $1"
}

# Check if we're in the MagicMirror directory
if [ ! -f "package.json" ] || [ ! -d "modules" ]; then
    print_error "Please run this script from your MagicMirror root directory"
    exit 1
fi

print_success "Detected MagicMirror installation"

# Check if running as root (common in Kali)
if [ "$EUID" -eq 0 ]; then
    print_warning "Running as root. This is common in Kali but may cause permission issues."
    print_warning "Consider running as a regular user if you encounter problems."
fi

# Detect Kali Linux
if [ -f "/etc/os-release" ]; then
    . /etc/os-release
    if [[ "$ID" == "kali" ]]; then
        print_kali "Kali Linux detected - using optimized installation"
        KALI_DETECTED=true
    else
        print_status "Linux distribution: $ID"
        KALI_DETECTED=false
    fi
else
    print_warning "Could not detect Linux distribution"
    KALI_DETECTED=false
fi

# Update package lists
print_status "Updating package lists..."
apt-get update

# Install system dependencies for Kali Linux
print_status "Installing system dependencies for voice recognition..."

# Essential build tools
print_status "Installing build essentials..."
apt-get install -y build-essential git curl

# Audio system dependencies
print_status "Installing audio system dependencies..."
apt-get install -y alsa-utils libasound2-dev pulseaudio pulseaudio-utils

# Python and development tools
print_status "Installing Python development tools..."
apt-get install -y python3 python3-dev python3-pip python3-setuptools

# Voice recognition dependencies
print_status "Installing voice recognition dependencies..."
apt-get install -y bison autoconf automake libtool swig

# Additional Kali-specific packages
if [ "$KALI_DETECTED" = true ]; then
    print_kali "Installing Kali-specific audio packages..."
    apt-get install -y sox libsox-fmt-all espeak espeak-data
fi

# Check Node.js version
print_status "Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
    
    # Check if Node.js version is adequate (v14+)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -lt 14 ]; then
        print_warning "Node.js version is old. Consider upgrading to v18+ for better compatibility."
    fi
else
    print_error "Node.js not found. Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
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
    print_error "Check your internet connection and try again"
    exit 1
fi

cd MMM-voice
print_success "MMM-voice module cloned successfully"

# Install MMM-voice dependencies
print_status "Installing MMM-voice dependencies..."

# First install npm dependencies
print_status "Installing npm dependencies..."
npm install
if [ $? -ne 0 ]; then
    print_warning "npm install failed, trying with --unsafe-perm flag..."
    npm install --unsafe-perm
fi

# Run the MMM-voice dependency installer
print_status "Running MMM-voice system dependency installer..."
cd installers

# Make the dependency script executable
chmod +x dependencies.sh

# Run the dependency installation with error handling
print_status "Installing voice recognition system dependencies (this may take 10-15 minutes)..."
bash dependencies.sh

if [ $? -eq 0 ]; then
    print_success "MMM-voice dependencies installed successfully"
else
    print_error "MMM-voice dependency installation failed"
    print_warning "Attempting manual installation of critical components..."
    
    # Manual installation of critical components
    print_status "Installing SphinxBase manually..."
    cd /tmp
    wget https://github.com/cmusphinx/sphinxbase/archive/master.zip
    unzip master.zip
    cd sphinxbase-master
    ./autogen.sh
    make
    make install
    
    print_status "Installing PocketSphinx manually..."
    cd /tmp
    wget https://github.com/cmusphinx/pocketsphinx/archive/master.zip
    unzip master.zip -d pocketsphinx
    cd pocketsphinx/pocketsphinx-master
    ./autogen.sh
    make
    make install
    
    # Update library cache
    ldconfig
fi

# Go back to MagicMirror root
cd ../../..

# Test audio system
print_status "Testing audio system..."
if command -v arecord &> /dev/null; then
    print_success "ALSA tools found"
    echo "Available audio devices:"
    arecord -l
    echo ""
    
    # Test microphone recording
    print_status "Testing microphone (5-second test)..."
    print_warning "Speak into your microphone for 5 seconds..."
    timeout 5s arecord -f cd -t wav /tmp/test_recording.wav 2>/dev/null
    if [ -f "/tmp/test_recording.wav" ]; then
        print_success "Microphone test completed. Playing back..."
        aplay /tmp/test_recording.wav 2>/dev/null
        rm -f /tmp/test_recording.wav
    else
        print_warning "Microphone test failed. Check your audio setup."
    fi
else
    print_error "ALSA tools not found. Audio may not work properly."
fi

# Check PulseAudio
print_status "Checking PulseAudio..."
if command -v pulseaudio &> /dev/null; then
    print_success "PulseAudio found"
    # Start PulseAudio if not running
    if ! pgrep -x "pulseaudio" > /dev/null; then
        print_status "Starting PulseAudio..."
        pulseaudio --start --log-target=syslog
    fi
else
    print_warning "PulseAudio not found. Some audio features may not work."
fi

# Create Kali-specific troubleshooting guide
print_status "Creating Kali Linux troubleshooting guide..."
cat > KALI_VOICE_TROUBLESHOOTING.md << 'EOF'
# 🎤 Kali Linux Voice Control Troubleshooting

## Common Kali Linux Issues

### 1. Permission Issues
```bash
# If running as root, create a regular user
adduser magicmirror
usermod -aG sudo magicmirror
su - magicmirror

# Fix file permissions
sudo chown -R magicmirror:magicmirror /path/to/MagicMirror
```

### 2. Audio System Issues
```bash
# Check audio devices
arecord -l
aplay -l

# Test microphone
arecord -d 5 test.wav
aplay test.wav

# Restart audio services
sudo systemctl restart alsa-state
pulseaudio --kill
pulseaudio --start
```

### 3. PocketSphinx Issues
```bash
# Check if libraries are installed
ldconfig -p | grep sphinx
ldconfig -p | grep pocketsphinx

# Reinstall if missing
sudo apt-get install --reinstall libpocketsphinx3 libsphinxbase3
```

### 4. Node.js Permission Issues
```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### 5. Microphone Not Working
```bash
# Check microphone permissions
sudo usermod -a -G audio $USER

# Test with different tools
rec test.wav
sox -t alsa default test.wav

# Check PulseAudio
pactl list sources short
pactl set-default-source <source_name>
```

## Kali-Specific Solutions

### Virtual Machine Issues
- Enable microphone passthrough in VM settings
- Install VM guest additions/tools
- Check host system microphone permissions

### WSL (Windows Subsystem for Linux)
- WSL doesn't support audio by default
- Use WSL2 with PulseAudio server
- Consider running on Windows host instead

### Docker/Container Issues
- Mount audio devices: `--device /dev/snd`
- Run with privileged mode: `--privileged`
- Share audio socket: `-v /tmp/.X11-unix:/tmp/.X11-unix`

## Alternative Solutions

### 1. Web-based Voice Control
Use browser's speech recognition API instead of system-level recognition.

### 2. Remote Voice Control
Set up voice control on another device and send commands via network.

### 3. Mobile App Control
Use a mobile app to send voice commands to Magic Mirror.

## Testing Commands

```bash
# Test voice recognition
cd modules/MMM-voice
node test_voice.js

# Test microphone
arecord -d 5 -f cd test.wav && aplay test.wav

# Check system audio
speaker-test -t sine -f 1000 -l 1

# Debug Magic Mirror
npm run server -- --debug
```
EOF

print_success "Kali troubleshooting guide created: KALI_VOICE_TROUBLESHOOTING.md"

# Final status check
print_status "Running final installation check..."
node test-voice-control.js

echo ""
print_success "🎉 Kali Linux Voice Control Installation Complete!"
echo "=================================================="
echo ""
print_kali "Kali-specific notes:"
echo "- Audio permissions may need adjustment"
echo "- PulseAudio should be running"
echo "- Test microphone before using voice control"
echo ""
print_warning "NEXT STEPS:"
echo ""
echo "1. 🎤 Test your microphone:"
echo "   arecord -d 5 test.wav && aplay test.wav"
echo ""
echo "2. 🔧 Check microphone device ID:"
echo "   arecord -l"
echo ""
echo "3. 📝 Update config.js with correct microphone ID"
echo ""
echo "4. 🔄 Start MagicMirror:"
echo "   npm run server"
echo ""
echo "5. 🗣️ Test voice control:"
echo "   Say 'MAGIC MIRROR' then 'SHOW WEATHER'"
echo ""
echo "📖 For troubleshooting: cat KALI_VOICE_TROUBLESHOOTING.md"
echo ""
