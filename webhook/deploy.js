const { exec } = require('child_process');

const projectDir = 'D:\\Projects\\webhook';
const ecosystemConfigPath = 'D:\\Projects\\ecosystem.config.js';
const repoUrl = 'git@github.com:Istalexnik/Projects.git';
const logDir = 'D:\\Projects\\logs\\webhook';
const branch = 'main';

const commands = [
  `git config --global --add safe.directory D:/Projects`,
  `cd ${projectDir}`,
  `git pull origin ${branch}`,
  'npm install',
  `pm2 reload ${ecosystemConfigPath} --env production`
];

exec(commands.join(' && '), (err, stdout, stderr) => {
  if (err) {
    console.error(`exec error: ${err}`);
    fs.writeFileSync(path.join(logDir, 'exec_error_log.txt'), `Error: ${err}\nStdout: ${stdout}\nStderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  fs.writeFileSync(path.join(logDir, 'exec_output_log.txt'), `Stdout: ${stdout}\nStderr: ${stderr}`);
  console.error(`stderr: ${stderr}`);
});
