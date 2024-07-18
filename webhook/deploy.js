const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define log paths
const logDir = path.join(__dirname, '..', 'logs', 'webhook');
const outputLog = path.join(logDir, 'exec_output_log.txt');
const errorLog = path.join(logDir, 'exec_error_log.txt');
const debugLog = path.join(logDir, 'deploy_debug_log.txt');

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Log function
const log = (message, logPath) => {
  fs.appendFileSync(logPath, message + '\n');
};

// Execute command
const executeCommand = (command, logPath) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        log(`Error: ${error.message}`, logPath);
        reject(error);
      }
      if (stderr) {
        log(`Stderr: ${stderr}`, logPath);
        reject(stderr);
      }
      log(`Stdout: ${stdout}`, logPath);
      resolve(stdout);
    });
  });
};

// Deployment commands
const commands = [
  'git config --global --add safe.directory D:/Projects',
  'git pull origin main',
  'npm install --prefix D:/Projects/webhook'
];

// Run deployment
(async () => {
  log('Running deployment commands...', debugLog);
  for (const command of commands) {
    log(`Running command: ${command}`, debugLog);
    try {
      await executeCommand(command, debugLog);
      log(`Command succeeded: ${command}`, debugLog);
    } catch (error) {
      log(`Command failed: ${command}`, debugLog);
      log(error, errorLog);
      break;
    }
  }
})();
