/**
 * WSL Voice Bridge - Windows Host to WSL Communication
 * This script runs on Windows host and sends voice commands to WSL MagicMirror
 */

const WebSocket = require('ws');
const http = require('http');

class WSLVoiceBridge {
    constructor() {
        this.wslMirrorUrl = 'http://localhost:8080'; // WSL MagicMirror URL
        this.port = 3001; // Bridge server port
        this.commands = {
            'magic mirror show weather': 'WEATHER_SHOW',
            'magic mirror hide weather': 'WEATHER_HIDE',
            'magic mirror show calendar': 'CALENDAR_SHOW',
            'magic mirror hide calendar': 'CALENDAR_HIDE',
            'magic mirror show news': 'NEWS_SHOW',
            'magic mirror hide news': 'NEWS_HIDE',
            'magic mirror show photos': 'PHOTOS_SHOW',
            'magic mirror hide photos': 'PHOTOS_HIDE',
            'magic mirror refresh': 'REFRESH_MIRROR',
            'magic mirror good morning': 'GOOD_MORNING',
            'magic mirror good night': 'GOOD_NIGHT'
        };
        this.setupServer();
        this.setupSpeechRecognition();
    }

    setupServer() {
        this.server = http.createServer((req, res) => {
            res.writeHead(200, {
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*'
            });
            
            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>WSL Voice Bridge</title>
                    <style>
                        body { 
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            text-align: center;
                            padding: 50px;
                            margin: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background: rgba(255,255,255,0.1);
                            padding: 40px;
                            border-radius: 20px;
                            backdrop-filter: blur(10px);
                        }
                        .status {
                            font-size: 24px;
                            margin: 20px 0;
                            padding: 15px;
                            border-radius: 10px;
                            background: rgba(255,255,255,0.2);
                        }
                        .commands {
                            text-align: left;
                            margin: 30px 0;
                        }
                        .command {
                            background: rgba(255,255,255,0.1);
                            padding: 10px;
                            margin: 5px 0;
                            border-radius: 5px;
                            font-family: monospace;
                        }
                        button {
                            background: #4CAF50;
                            color: white;
                            border: none;
                            padding: 15px 30px;
                            font-size: 16px;
                            border-radius: 10px;
                            cursor: pointer;
                            margin: 10px;
                        }
                        button:hover { background: #45a049; }
                        button:disabled { background: #cccccc; cursor: not-allowed; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>🎤 WSL Voice Bridge</h1>
                        <div class="status" id="status">Ready to listen...</div>
                        
                        <button id="startBtn" onclick="startListening()">Start Voice Control</button>
                        <button id="stopBtn" onclick="stopListening()" disabled>Stop Voice Control</button>
                        
                        <div class="commands">
                            <h3>Available Commands:</h3>
                            <div class="command">"Magic Mirror show weather"</div>
                            <div class="command">"Magic Mirror hide weather"</div>
                            <div class="command">"Magic Mirror show calendar"</div>
                            <div class="command">"Magic Mirror hide calendar"</div>
                            <div class="command">"Magic Mirror show news"</div>
                            <div class="command">"Magic Mirror hide news"</div>
                            <div class="command">"Magic Mirror show photos"</div>
                            <div class="command">"Magic Mirror hide photos"</div>
                            <div class="command">"Magic Mirror refresh"</div>
                            <div class="command">"Magic Mirror good morning"</div>
                            <div class="command">"Magic Mirror good night"</div>
                        </div>
                    </div>

                    <script>
                        let recognition;
                        let isListening = false;

                        function startListening() {
                            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                                recognition = new SpeechRecognition();
                                
                                recognition.continuous = true;
                                recognition.interimResults = false;
                                recognition.lang = 'en-US';
                                
                                recognition.onstart = function() {
                                    isListening = true;
                                    document.getElementById('status').textContent = '🎤 Listening for commands...';
                                    document.getElementById('startBtn').disabled = true;
                                    document.getElementById('stopBtn').disabled = false;
                                };
                                
                                recognition.onresult = function(event) {
                                    const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
                                    document.getElementById('status').textContent = 'Heard: "' + command + '"';
                                    
                                    // Send command to WSL MagicMirror
                                    sendCommandToWSL(command);
                                };
                                
                                recognition.onerror = function(event) {
                                    document.getElementById('status').textContent = 'Error: ' + event.error;
                                };
                                
                                recognition.onend = function() {
                                    if (isListening) {
                                        recognition.start(); // Restart if still supposed to be listening
                                    }
                                };
                                
                                recognition.start();
                            } else {
                                alert('Speech recognition not supported in this browser');
                            }
                        }
                        
                        function stopListening() {
                            isListening = false;
                            if (recognition) {
                                recognition.stop();
                            }
                            document.getElementById('status').textContent = 'Voice control stopped';
                            document.getElementById('startBtn').disabled = false;
                            document.getElementById('stopBtn').disabled = true;
                        }
                        
                        function sendCommandToWSL(command) {
                            fetch('http://localhost:8080/voice-command', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ command: command })
                            })
                            .then(response => response.json())
                            .then(data => {
                                document.getElementById('status').textContent = 'Command sent: ' + command;
                            })
                            .catch(error => {
                                document.getElementById('status').textContent = 'Error sending command: ' + error;
                            });
                        }
                    </script>
                </body>
                </html>
            `);
        });

        this.server.listen(this.port, () => {
            console.log(`🌉 WSL Voice Bridge running at http://localhost:${this.port}`);
            console.log(`🎤 Open this URL in your Windows browser to use voice control`);
        });
    }

    setupSpeechRecognition() {
        // This will be handled by the web interface
        console.log('🎤 Speech recognition will be handled by web browser');
    }

    sendCommandToMagicMirror(command) {
        const mappedCommand = this.commands[command.toLowerCase()];
        if (mappedCommand) {
            console.log(`🎤 Sending command to MagicMirror: ${mappedCommand}`);
            // Send HTTP request to MagicMirror
            // This will be implemented based on your MagicMirror's API
        } else {
            console.log(`🎤 Unknown command: ${command}`);
        }
    }
}

// Start the bridge
new WSLVoiceBridge();
