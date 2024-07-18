const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectDir = 'D:\\Projects\\webhook';  // Change to your actual project directory
const ecosystemConfigPath = 'D:\\Projects\\ecosystem.config.js';
const logDir = 'D:\\Projects\\logs\\webhook';
const repoUrl = 'git@github.com:Istalexnik/Projects.git';
const branch = 'main';

const commands = [
  `git config --global --add safe.directory D:/Projects`,
  `cd ${projectDir}`,
  `git pull origin ${branch}`,
  'npm install',
  `pm2 reload ${ecosystemConfigPath} --env production`
];

const debugLogPath = path.join(logDir, 'deploy_debug_log.txt');
fs.appendFileSync(debugLogPath, `Running deployment commands...\nCommands: ${commands.join(' && ')}\n`);

exec(commands.join(' && '), (err, stdout, stderr) => {
  if (err) {
    console.error(`exec error: ${err}`);
    fs.appendFileSync(debugLogPath, `exec error: ${err}\nStderr: ${stderr}\n`);
    fs.writeFileSync(path.join(logDir, 'exec_error_log.txt'), `Error: ${err}\nStdout: ${stdout}\nStderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  fs.appendFileSync(debugLogPath, `stdout: ${stdout}\n`);
  fs.writeFileSync(path.join(logDir, 'exec_output_log.txt'), `Stdout: ${stdout}\nStderr: ${stderr}`);
  console.error(`stderr: ${stderr}`);
  fs.appendFileSync(debugLogPath, `stderr: ${stderr}\n`);
});
