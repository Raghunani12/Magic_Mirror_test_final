#!/usr/bin/env node

/**
 * Voice Control Test Script for Magic Mirror
 * Tests microphone detection and basic voice setup
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎤 Magic Mirror Voice Control Test');
console.log('==================================\n');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
    if (fs.existsSync(filePath)) {
        log(`✅ ${description} - Found`, 'green');
        return true;
    } else {
        log(`❌ ${description} - Missing`, 'red');
        return false;
    }
}

function checkDirectory(dirPath, description) {
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
        log(`✅ ${description} - Found`, 'green');
        return true;
    } else {
        log(`❌ ${description} - Missing`, 'red');
        return false;
    }
}

async function runCommand(command, description) {
    return new Promise((resolve) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                log(`❌ ${description} - Failed: ${error.message}`, 'red');
                resolve(false);
            } else {
                log(`✅ ${description} - Success`, 'green');
                if (stdout) {
                    console.log(stdout);
                }
                resolve(true);
            }
        });
    });
}

async function main() {
    let allTestsPassed = true;

    // Test 1: Check if we're in MagicMirror directory
    log('1. Checking MagicMirror Installation...', 'blue');
    if (!checkFile('package.json', 'package.json') || 
        !checkDirectory('modules', 'modules directory') ||
        !checkDirectory('config', 'config directory')) {
        log('❌ Not in MagicMirror directory or installation incomplete', 'red');
        allTestsPassed = false;
    }

    // Test 2: Check voice control modules
    log('\n2. Checking Voice Control Modules...', 'blue');
    const voiceModuleExists = checkDirectory('modules/MMM-voice', 'MMM-voice module');
    const voiceHelperExists = checkDirectory('modules/MMM-VoiceHelper', 'MMM-VoiceHelper module');
    
    if (!voiceModuleExists || !voiceHelperExists) {
        allTestsPassed = false;
    }

    // Test 3: Check configuration
    log('\n3. Checking Configuration...', 'blue');
    try {
        const configPath = 'config/config.js';
        if (fs.existsSync(configPath)) {
            const configContent = fs.readFileSync(configPath, 'utf8');
            
            if (configContent.includes('MMM-voice')) {
                log('✅ MMM-voice configured in config.js', 'green');
            } else {
                log('❌ MMM-voice not found in config.js', 'red');
                allTestsPassed = false;
            }
            
            if (configContent.includes('MMM-VoiceHelper')) {
                log('✅ MMM-VoiceHelper configured in config.js', 'green');
            } else {
                log('❌ MMM-VoiceHelper not found in config.js', 'red');
                allTestsPassed = false;
            }
        } else {
            log('❌ config.js not found', 'red');
            allTestsPassed = false;
        }
    } catch (error) {
        log(`❌ Error reading config.js: ${error.message}`, 'red');
        allTestsPassed = false;
    }

    // Test 4: Check system dependencies
    log('\n4. Checking System Dependencies...', 'blue');
    
    // Check Node.js version
    const nodeVersionCheck = await runCommand('node --version', 'Node.js version');
    if (!nodeVersionCheck) allTestsPassed = false;

    // Check npm
    const npmCheck = await runCommand('npm --version', 'npm version');
    if (!npmCheck) allTestsPassed = false;

    // Test 5: Check audio system (Linux/Mac)
    log('\n5. Checking Audio System...', 'blue');
    
    const platform = process.platform;
    log(`Platform detected: ${platform}`, 'cyan');
    
    if (platform === 'linux') {
        const alsaCheck = await runCommand('which arecord', 'ALSA tools (arecord)');
        if (alsaCheck) {
            log('📋 Available audio devices:', 'yellow');
            await runCommand('arecord -l', 'List audio devices');
        } else {
            log('⚠️  ALSA tools not found - install with: sudo apt-get install alsa-utils', 'yellow');
        }
    } else if (platform === 'darwin') {
        log('📋 Audio system info:', 'yellow');
        await runCommand('system_profiler SPAudioDataType | grep -A 5 "Input"', 'Audio input devices');
    } else if (platform === 'win32') {
        log('📋 Windows audio system detected', 'yellow');
        log('Use Device Manager or Sound Settings to check microphone', 'yellow');
    }

    // Test 6: Check MMM-voice dependencies
    log('\n6. Checking MMM-voice Dependencies...', 'blue');
    
    if (fs.existsSync('modules/MMM-voice')) {
        const packageJsonPath = 'modules/MMM-voice/package.json';
        if (fs.existsSync(packageJsonPath)) {
            log('✅ MMM-voice package.json found', 'green');
            
            const nodeModulesPath = 'modules/MMM-voice/node_modules';
            if (fs.existsSync(nodeModulesPath)) {
                log('✅ MMM-voice dependencies installed', 'green');
            } else {
                log('❌ MMM-voice dependencies not installed', 'red');
                log('Run: cd modules/MMM-voice && npm install', 'yellow');
                allTestsPassed = false;
            }
        } else {
            log('❌ MMM-voice package.json not found', 'red');
            allTestsPassed = false;
        }
    }

    // Test 7: Check permissions
    log('\n7. Checking Permissions...', 'blue');
    
    try {
        fs.accessSync('config/config.js', fs.constants.R_OK | fs.constants.W_OK);
        log('✅ Config file permissions OK', 'green');
    } catch (error) {
        log('❌ Config file permission issues', 'red');
        allTestsPassed = false;
    }

    // Final Results
    log('\n🎯 Test Results Summary', 'magenta');
    log('========================', 'magenta');
    
    if (allTestsPassed) {
        log('🎉 All tests passed! Voice control should work.', 'green');
        log('\nNext steps:', 'blue');
        log('1. Start MagicMirror: npm run server', 'cyan');
        log('2. Say "MAGIC MIRROR" to test wake word', 'cyan');
        log('3. Try voice commands like "SHOW WEATHER"', 'cyan');
        log('4. Check VOICE_CONTROL_SETUP.md for full guide', 'cyan');
    } else {
        log('⚠️  Some tests failed. Please fix the issues above.', 'yellow');
        log('\nCommon fixes:', 'blue');
        log('1. Run: ./install-voice-control.sh', 'cyan');
        log('2. Check microphone connections', 'cyan');
        log('3. Verify config.js settings', 'cyan');
        log('4. Install missing dependencies', 'cyan');
    }

    log('\n📖 For detailed setup instructions, see:', 'blue');
    log('   - VOICE_CONTROL_SETUP.md', 'cyan');
    log('   - VOICE_CONTROL_GUIDE.md', 'cyan');
}

// Run the tests
main().catch(error => {
    log(`❌ Test script error: ${error.message}`, 'red');
    process.exit(1);
});
