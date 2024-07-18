const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define the commands to run
const commands = [
    'git config --global --add safe.directory D:/Projects',
    'git pull origin main',
    'npm install --prefix D:/Projects/webhook',
    'pm2 reload D:/Projects/ecosystem.config.js --env production'
];

// Function to run a command
function runCommand(command, callback) {
    exec(command, { cwd: 'D:/Projects/webhook', shell: true }, (error, stdout, stderr) => {
        if (error) {
            fs.appendFileSync('D:/Projects/logs/webhook/exec_error_log.txt', `Error: ${error}\nStderr: ${stderr}\n`);
            callback(error);
        } else {
            fs.appendFileSync('D:/Projects/logs/webhook/exec_output_log.txt', `Stdout: ${stdout}\n`);
            callback();
        }
    });
}

// Function to run all commands in sequence
function runCommandsSequentially(commands, index = 0) {
    if (index >= commands.length) {
        fs.appendFileSync('D:/Projects/logs/webhook/deploy_debug_log.txt', 'Deployment completed successfully.\n');
        return;
    }

    const command = commands[index];
    fs.appendFileSync('D:/Projects/logs/webhook/deploy_debug_log.txt', `Running command: ${command}\n`);

    runCommand(command, (error) => {
        if (error) {
            fs.appendFileSync('D:/Projects/logs/webhook/deploy_debug_log.txt', `Command failed: ${command}\n`);
        } else {
            fs.appendFileSync('D:/Projects/logs/webhook/deploy_debug_log.txt', `Command succeeded: ${command}\n`);
            runCommandsSequentially(commands, index + 1);
        }
    });
}

// Start the deployment process
fs.appendFileSync('D:/Projects/logs/webhook/deploy_debug_log.txt', 'Running deployment commands...\n');
runCommandsSequentially(commands);
