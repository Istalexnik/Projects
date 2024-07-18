const fs = require('fs');
const { exec } = require('child_process');

const errorLogFile = 'D:\\Projects\\logs\\webhook\\exec_error_log.txt';
const outputLogFile = 'D:\\Projects\\logs\\webhook\\exec_output_log.txt';
const debugLogFile = 'D:\\Projects\\logs\\webhook\\deploy_debug_log.txt';

const commands = [
  { cmd: 'git config --global --add safe.directory D:/Projects', cwd: 'D:\\Projects' },
  { cmd: 'git pull origin main', cwd: 'D:\\Projects\\a\\source' },
  { cmd: 'npm install', cwd: 'D:\\Projects\\a\\source' },
  { cmd: 'pm2 reload D:\\Projects\\a\\source\\ecosystem.config.js --env production', cwd: 'D:\\Projects' }
];

fs.appendFileSync(debugLogFile, 'Running deployment commands...\n', 'utf8');
fs.appendFileSync(debugLogFile, `Commands: ${commands.map(c => c.cmd).join(' && ')}\n`, 'utf8');

function runCommand(commandIndex) {
  if (commandIndex >= commands.length) {
    return;
  }

  const { cmd, cwd } = commands[commandIndex];
  fs.appendFileSync(debugLogFile, `Running command: ${cmd} in ${cwd}\n`, 'utf8');

  exec(cmd, { cwd, shell: true }, (error, stdout, stderr) => {
    if (error) {
      fs.appendFileSync(errorLogFile, `Error: ${error}\n`, 'utf8');
      fs.appendFileSync(debugLogFile, `Command failed: ${cmd}\nError: ${error}\n`, 'utf8');
      return;
    }

    fs.appendFileSync(outputLogFile, `Stdout: ${stdout}\n`, 'utf8');
    fs.appendFileSync(debugLogFile, `Command succeeded: ${cmd}\nStdout: ${stdout}\n`, 'utf8');

    if (stderr) {
      fs.appendFileSync(errorLogFile, `Stderr: ${stderr}\n`, 'utf8');
      fs.appendFileSync(debugLogFile, `Stderr: ${stderr}\n`, 'utf8');
    }

    runCommand(commandIndex + 1);
  });
}

runCommand(0);
