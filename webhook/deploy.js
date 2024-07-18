const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const logFile = path.join('D:', 'Projects', 'logs', 'webhook', 'exec_output_log.txt');
const errorLogFile = path.join('D:', 'Projects', 'logs', 'webhook', 'exec_error_log.txt');
const debugLogFile = path.join('D:', 'Projects', 'logs', 'webhook', 'exec_debug_log.txt');
const deployDebugLogFile = path.join('D:', 'Projects', 'logs', 'webhook', 'deploy_debug_log.txt');

const commands = [
  'git config --global --add safe.directory D:/Projects',
  'git pull origin main',
  'npm install',
  'pm2 reload D:/Projects/ecosystem.config.js --env production'
];

fs.appendFileSync(debugLogFile, 'Starting deploy script...\n', 'utf8');

commands.forEach((command) => {
  fs.appendFileSync(deployDebugLogFile, `Running command: ${command}\n`, 'utf8');
  exec(command, { cwd: 'D:\\Projects\\webhook' }, (error, stdout, stderr) => {
    if (error) {
      fs.appendFileSync(errorLogFile, `Error: ${error.message}\n`, 'utf8');
      return;
    }
    if (stderr) {
      fs.appendFileSync(errorLogFile, `Stderr: ${stderr}\n`, 'utf8');
      return;
    }
    fs.appendFileSync(logFile, `Stdout: ${stdout}\n`, 'utf8');
  });
});

fs.appendFileSync(debugLogFile, 'Deploy script completed.\n', 'utf8');
