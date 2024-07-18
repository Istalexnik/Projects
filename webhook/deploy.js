const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs', 'webhook');
const errorLogFile = path.join(logDir, 'exec_error_log.txt');
const outputLogFile = path.join(logDir, 'exec_output_log.txt');
const debugLogFile = path.join(logDir, 'deploy_debug_log.txt');

function logDebug(message) {
  fs.appendFileSync(debugLogFile, `${message}\n`, 'utf8');
}

logDebug('Running deployment commands...');

const commands = [
  'git config --global --add safe.directory D:/Projects',
  'cd D:\\Projects\\webhook',
  'git pull origin main',
  'npm install',
  'pm2 reload D:\\Projects\\ecosystem.config.js --env production'
];

logDebug(`Commands: ${commands.join(' && ')}`);

commands.forEach((cmd, index) => {
  logDebug(`Running command: ${cmd} in ${index > 0 ? 'D:\\Projects\\webhook' : 'D:\\Projects'}`);
  exec(cmd, { cwd: index > 0 ? 'D:\\Projects\\webhook' : 'D:\\Projects' }, (error, stdout, stderr) => {
    if (error) {
      fs.appendFileSync(errorLogFile, `Error: ${error}\n`, 'utf8');
    }
    if (stderr) {
      fs.appendFileSync(errorLogFile, `Stderr: ${stderr}\n`, 'utf8');
    }
    if (stdout) {
      fs.appendFileSync(outputLogFile, `Stdout: ${stdout}\n`, 'utf8');
    }
  });
});
