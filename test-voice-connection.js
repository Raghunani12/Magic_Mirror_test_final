#!/usr/bin/env node

/**
 * Test Voice Connection Script
 * Tests if the voice control server is accessible
 */

const http = require('http');
const { exec } = require('child_process');

console.log('🔍 Testing Voice Control Connection');
console.log('===================================\n');

// Test localhost:3001
function testConnection(host, port, description) {
    return new Promise((resolve) => {
        const options = {
            hostname: host,
            port: port,
            path: '/',
            method: 'GET',
            timeout: 5000
        };

        const req = http.request(options, (res) => {
            console.log(`✅ ${description}: SUCCESS (Status: ${res.statusCode})`);
            resolve(true);
        });

        req.on('error', (err) => {
            console.log(`❌ ${description}: FAILED (${err.message})`);
            resolve(false);
        });

        req.on('timeout', () => {
            console.log(`❌ ${description}: TIMEOUT`);
            req.destroy();
            resolve(false);
        });

        req.end();
    });
}

async function main() {
    console.log('Testing voice control server accessibility...\n');

    // Test localhost
    const localhostWorking = await testConnection('localhost', 3001, 'localhost:3001');
    
    // Test 127.0.0.1
    const loopbackWorking = await testConnection('127.0.0.1', 3001, '127.0.0.1:3001');
    
    // Get WSL IP and test
    exec('ip route get 1 | awk \'{print $7; exit}\'', async (error, stdout, stderr) => {
        if (!error && stdout.trim()) {
            const wslIP = stdout.trim();
            console.log(`\nDetected WSL IP: ${wslIP}`);
            const wslIPWorking = await testConnection(wslIP, 3001, `${wslIP}:3001`);
            
            console.log('\n🎯 Connection Test Results:');
            console.log('============================');
            console.log(`localhost:3001     - ${localhostWorking ? '✅ Working' : '❌ Failed'}`);
            console.log(`127.0.0.1:3001     - ${loopbackWorking ? '✅ Working' : '❌ Failed'}`);
            console.log(`${wslIP}:3001 - ${wslIPWorking ? '✅ Working' : '❌ Failed'}`);
            
            console.log('\n📋 Recommendations:');
            if (localhostWorking) {
                console.log('✅ Use: http://localhost:3001');
            } else if (loopbackWorking) {
                console.log('✅ Use: http://127.0.0.1:3001');
            } else if (wslIPWorking) {
                console.log(`✅ Use: http://${wslIP}:3001`);
            } else {
                console.log('❌ Voice server not accessible. Check if MagicMirror is running.');
                console.log('   Run: npm run server');
            }
            
            console.log('\n🔧 For Windows access:');
            if (wslIPWorking) {
                console.log(`   Try: http://${wslIP}:3001 in Windows browser`);
            }
            console.log('   Or run: ./wsl-network-fix.sh for automated solutions');
            
        } else {
            console.log('\n❌ Could not detect WSL IP address');
        }
    });
}

main().catch(console.error);
