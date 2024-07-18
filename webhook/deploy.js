const { exec } = require('child_process');
const fs = require('fs');

const commands = [
    'git config --global --add safe.directory D:/Projects',
    'git pull origin main',
    'npm install',
    'pm2 reload D:\\Projects\\ecosystem.config.js --env production'
];

const executeCommands = async () => {
    for (const command of commands) {
        try {
            await new Promise((resolve, reject) => {
                exec(command, { cwd: 'D:\\Projects' }, (error, stdout, stderr) => {
                    if (error) {
                        fs.appendFileSync('D:\\Projects\\logs\\webhook\\exec_error_log.txt', `Error: ${error.message}\n`);
                        fs.appendFileSync('D:\\Projects\\logs\\webhook\\exec_error_log.txt', `Stderr: ${stderr}\n`);
                        reject(error);
                        return;
                    }
                    fs.appendFileSync('D:\\Projects\\logs\\webhook\\exec_output_log.txt', `Stdout: ${stdout}\n`);
                    resolve();
                });
            });
        } catch (error) {
            console.error(`Failed to execute command: ${command}`, error);
            throw error;
        }
    }
};

(async () => {
    try {
        await executeCommands();
        console.log('Deployment successful');
    } catch (error) {
        console.error('Deployment failed', error);
    }
})();
