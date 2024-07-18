const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const logDir = path.resolve(__dirname, '../logs/webhook');
const outputLog = path.join(logDir, 'exec_output_log.txt');
const errorLog = path.join(logDir, 'exec_error_log.txt');
const debugLog = path.join(logDir, 'deploy_debug_log.txt');

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Initialize log files
fs.writeFileSync(outputLog, '');
fs.writeFileSync(errorLog, '');
fs.writeFileSync(debugLog, '');

// Define the commands to run
const commands = [
    'git config --global --add safe.directory D:/Projects',
    'git pull origin main',
    'npm install --prefix D:/Projects/webhook',
    'pm2 reload D:/Projects/ecosystem.config.js --env production'
];

// Function to run a command
function runCommand(command, callback) {
    exec(command, { shell: true }, (error, stdout, stderr) => {
        if (error) {
            fs.appendFileSync(errorLog, `Error: ${error}\nStderr: ${stderr}\n`);
            callback(error);
        } else {
            fs.appendFileSync(outputLog, `Stdout: ${stdout}\n`);
            callback();
        }
    });
}

// Function to run all commands in sequence
function runCommandsSequentially(commands, index = 0) {
    if (index >= commands.length) {
  
