const { exec } = require('child_process');
const fs = require('fs');

const logFile = 'D:\\Projects\\logs\\webhook\\exec_output_log.txt';
const errorLogFile = 'D:\\Projects\\logs\\webhook\\exec_error_log.txt';
const debugLogFile = 'D:\\Projects\\logs\\webhook\\exec_debug_log.txt';
const deployDebugLogFile = 'D:\\Projects\\logs\\webhook\\deploy_debug_log.txt';

const commands = [
  { cmd: 'git config --global --add safe.directory D:/Projects', cwd: 'D:\\Projects' },
  { cmd: 'git pull origin main', cwd: 'D:\\Projects\\webhook' },
  { cmd: 'npm install', cwd: 'D:\\Projects\\webhook' },
  { cmd: 'pm2 reload D:\\Projects\\ecosystem.config.js --env production', cwd: 'D:\\Projects' }
];

fs.appendFileSync(debugLogFile, 'Starting deploy script...\n', 'utf8');

commands.forEach(({ cmd, cwd }) => {
  fs.appendFileSync(deployDebugLogFile, `Running command: ${cmd} in ${cwd}\n`, 'utf8');
  exec(cmd, { cwd }, (error, stdout, stderr) => {
    if (error) {
      fs.appendFileSync(errorLogFile, `Error: ${error.message}\n`, 'utf8');
      return;
    }
    if (stderr) {
      fs.appendFileSync(errorLogFile, `Stderr: ${stderr}\n`, 'utf8');
      return;
    }
   
