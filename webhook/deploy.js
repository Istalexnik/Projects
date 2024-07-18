const fs = require('fs');
const { exec } = require('child_process');

const errorLogFile = 'D:\\Projects\\logs\\webhook\\exec_error_log.txt';
const outputLogFile = 'D:\\Projects\\logs\\webhook\\exec_output_log.txt';
const debugLogFile = 'D:\\Projects\\logs\\webhook\\deploy_debug_log.txt';

const commands = [
  'git config --global --add safe.directory D:/Projects',
  'cd D:\\Projects\\webhook',
  'git pull origin main',
  'npm install',
  'pm2 reload D:\\Projects\\ecosystem.config.js --env production'
];

fs.appendFileSync(debugLogFile, 'Running deployment commands...\n', 'utf8');
fs.appendFileSync(debugLogFile, `Commands: ${commands.join(' && ')}\n`, 'utf8');

function runCommand(commandIndex) {
  if (commandIndex >= commands.length) {
    return;
  }
  
  const command = commands[commandIndex];
  fs.appendFileSync(debugLogFile, `Running command: ${command}\n`, 'utf8');
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      fs.appendFileSync(errorLogFile, `Error: ${error}\n`, 'utf8');
      fs.appendFileSync(debugLogFile, `Command failed: ${command}\nError: ${error}\n`, 'utf8');
      return;
    }
    
    fs.appendFileSync(outputLogFile, `Stdout: ${stdout}\n`, 'utf8');
    fs.appendFileSync(debugLogFile, `Command succeeded: ${command}\nStdout: ${stdout}\n`, 'utf8');
    
    if (stderr) {
      fs.appendFileSync(errorLogFile, `Stderr: ${stderr}\n`, 'utf8');
      fs.appendFileSync(debugLogFile, `Stderr: ${stderr}\n`, 'utf8');
    }
    
    runCommand(commandIndex + 1);
  });
}

runCommand(0);
