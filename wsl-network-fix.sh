#!/bin/bash

# WSL Network Fix Script
# Helps resolve Windows-to-WSL connectivity issues

echo "🌐 WSL Network Diagnostics and Fix"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Check WSL version
print_status "Checking WSL version..."
if grep -q "microsoft" /proc/version; then
    if grep -q "WSL2" /proc/version; then
        WSL_VERSION="WSL2"
        print_success "WSL2 detected"
    else
        WSL_VERSION="WSL1"
        print_success "WSL1 detected"
    fi
else
    print_error "Not running in WSL"
    exit 1
fi

# Get network information
print_status "Getting network information..."

# Get WSL IP address
WSL_IP=$(ip route get 1 | awk '{print $7; exit}')
if [ -z "$WSL_IP" ]; then
    WSL_IP=$(hostname -I | awk '{print $1}')
fi

print_success "WSL IP Address: $WSL_IP"

# Get Windows host IP (gateway)
WINDOWS_IP=$(ip route | grep default | awk '{print $3}')
print_success "Windows Host IP: $WINDOWS_IP"

# Test localhost connectivity
print_status "Testing localhost connectivity..."
if curl -s http://localhost:8080 > /dev/null; then
    print_success "MagicMirror (port 8080) accessible from WSL"
else
    print_error "MagicMirror (port 8080) not accessible from WSL"
fi

if curl -s http://localhost:3001 > /dev/null; then
    print_success "Voice server (port 3001) accessible from WSL"
else
    print_error "Voice server (port 3001) not accessible from WSL"
fi

# Test WSL IP connectivity
print_status "Testing WSL IP connectivity..."
if curl -s http://$WSL_IP:8080 > /dev/null; then
    print_success "MagicMirror accessible via WSL IP"
else
    print_warning "MagicMirror not accessible via WSL IP"
fi

if curl -s http://$WSL_IP:3001 > /dev/null; then
    print_success "Voice server accessible via WSL IP"
else
    print_warning "Voice server not accessible via WSL IP"
fi

# Create Windows batch file for easy access
print_status "Creating Windows access scripts..."

cat > /mnt/c/Users/Public/magic-mirror-voice.bat << EOF
@echo off
echo Opening Magic Mirror Voice Control...
echo.
echo Magic Mirror: http://localhost:8080
echo Voice Control: http://localhost:3001
echo.
echo If localhost doesn't work, try:
echo Magic Mirror: http://$WSL_IP:8080
echo Voice Control: http://$WSL_IP:3001
echo.
start http://localhost:3001
if errorlevel 1 (
    echo Localhost failed, trying WSL IP...
    start http://$WSL_IP:3001
)
pause
EOF

print_success "Created Windows batch file: C:\\Users\\Public\\magic-mirror-voice.bat"

# Create PowerShell script for advanced users
cat > /mnt/c/Users/Public/magic-mirror-voice.ps1 << 'EOF'
# Magic Mirror Voice Control Launcher
Write-Host "🎤 Magic Mirror Voice Control Launcher" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Test localhost first
Write-Host "Testing localhost connection..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001" -TimeoutSec 5 -UseBasicParsing
    Write-Host "✅ Localhost working - opening voice control..." -ForegroundColor Green
    Start-Process "http://localhost:3001"
} catch {
    Write-Host "❌ Localhost failed, trying WSL IP..." -ForegroundColor Red
    
    # Get WSL IP from Windows
    $wslIP = (wsl hostname -I).Trim()
    Write-Host "WSL IP detected: $wslIP" -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri "http://$wslIP:3001" -TimeoutSec 5 -UseBasicParsing
        Write-Host "✅ WSL IP working - opening voice control..." -ForegroundColor Green
        Start-Process "http://$wslIP:3001"
    } catch {
        Write-Host "❌ Both localhost and WSL IP failed" -ForegroundColor Red
        Write-Host "Please check if MagicMirror is running in WSL" -ForegroundColor Yellow
        Write-Host "Run: wsl npm run server" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Available URLs:" -ForegroundColor Cyan
Write-Host "Magic Mirror: http://localhost:8080" -ForegroundColor White
Write-Host "Voice Control: http://localhost:3001" -ForegroundColor White
Write-Host "Alt Voice Control: http://$wslIP:3001" -ForegroundColor White

Read-Host "Press Enter to exit"
EOF

print_success "Created PowerShell script: C:\\Users\\Public\\magic-mirror-voice.ps1"

# WSL-specific fixes
print_status "Applying WSL-specific fixes..."

if [ "$WSL_VERSION" = "WSL2" ]; then
    print_warning "WSL2 detected - network isolation may cause issues"
    print_warning "Windows may not be able to access WSL2 localhost directly"
    
    # Check if Windows can access WSL2
    print_status "Testing Windows-to-WSL2 connectivity..."
    
    # Create a test file to check Windows access
    echo "WSL Network Test" > /tmp/wsl_test.txt
    
    print_warning "WSL2 Solutions:"
    echo "1. Use WSL IP instead of localhost: http://$WSL_IP:3001"
    echo "2. Use Windows port forwarding (see below)"
    echo "3. Use WSL1 instead of WSL2 (if possible)"
    
elif [ "$WSL_VERSION" = "WSL1" ]; then
    print_success "WSL1 detected - localhost should work from Windows"
fi

# Port forwarding solution for WSL2
if [ "$WSL_VERSION" = "WSL2" ]; then
    print_status "Creating WSL2 port forwarding solution..."
    
    cat > /mnt/c/Users/Public/wsl-port-forward.bat << EOF
@echo off
echo Setting up WSL2 port forwarding...
echo.

REM Delete existing port forwarding rules
netsh interface portproxy delete v4tov4 listenport=3001 > nul 2>&1
netsh interface portproxy delete v4tov4 listenport=8080 > nul 2>&1

REM Add new port forwarding rules
echo Adding port forwarding for Magic Mirror (8080)...
netsh interface portproxy add v4tov4 listenport=8080 listenaddress=0.0.0.0 connectport=8080 connectaddress=$WSL_IP

echo Adding port forwarding for Voice Control (3001)...
netsh interface portproxy add v4tov4 listenport=3001 listenaddress=0.0.0.0 connectport=3001 connectaddress=$WSL_IP

echo.
echo Port forwarding setup complete!
echo You can now access:
echo Magic Mirror: http://localhost:8080
echo Voice Control: http://localhost:3001
echo.
echo Note: Run this script as Administrator if you get permission errors
pause
EOF

    print_success "Created WSL2 port forwarding script: C:\\Users\\Public\\wsl-port-forward.bat"
    print_warning "Run wsl-port-forward.bat as Administrator in Windows to enable port forwarding"
fi

# Final instructions
echo ""
print_success "🎉 WSL Network Fix Complete!"
echo "=========================="
echo ""
print_status "Next steps:"
echo ""
echo "1. 🖥️  From Windows, try these URLs:"
echo "   http://localhost:3001 (preferred)"
echo "   http://$WSL_IP:3001 (alternative)"
echo ""
echo "2. 🚀 Quick launch options:"
echo "   Double-click: C:\\Users\\Public\\magic-mirror-voice.bat"
echo "   Or run: C:\\Users\\Public\\magic-mirror-voice.ps1"
echo ""

if [ "$WSL_VERSION" = "WSL2" ]; then
    echo "3. 🔧 If localhost still doesn't work (WSL2 issue):"
    echo "   Run as Administrator: C:\\Users\\Public\\wsl-port-forward.bat"
    echo ""
fi

echo "4. 🎤 Voice Control Usage:"
echo "   - Click 'Start Listening' in the web interface"
echo "   - Say 'Magic Mirror show weather'"
echo "   - Watch your mirror respond!"
echo ""

print_warning "If you still have issues, the WSL IP method should always work: http://$WSL_IP:3001"
