const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectDir = 'D:\\Projects\\webhook';
const ecosystemConfigPath = 'D:\\Projects\\ecosystem.config.js';
const logDir = 'D:\\Projects\\logs\\webhook';
const debugLogPath = path.join(logDir, 'deploy_debug_log.txt');
const outputLogPath = path.join(logDir, 'exec_output_log.txt');
const errorLogPath = path.join(logDir, 'exec_error_log.txt');

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const commands = [
    `git config --global --add safe.directory D:/Projects`,
    `cd ${projectDir}`,
    `git pull origin main`,
    'npm install',
    `pm2 reload ${ecosystemConfigPath} --env production`
];

fs.appendFileSync(debugLogPath, `Running deployment commands...\nCommands: ${commands.join(' && ')}\n`);

exec(commands.join(' && '), (err, stdout, stderr) => {
    if (err) {
        console.error(`exec error: ${err}`);
        fs.appendFileSync(debugLogPath, `exec error: ${err}\nStderr: ${stderr}\n`);
        fs.writeFileSync(errorLogPath, `Error: ${err}\nStdout: ${stdout}\nStderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    fs.appendFileSync(debugLogPath, `stdout: ${stdout}\n`);
    fs.writeFileSync(outputLogPath, `Stdout: ${stdout}\nStderr: ${stderr}`);
    console.error(`stderr: ${stderr}`);
    fs.appendFileSync(debugLogPath, `stderr: ${stderr}\n`);
});
