const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

const logDir = path.resolve('D:\\Projects\\logs\\webhook');
const ensureLogDirExists = () => {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
};

const deployScriptPath = path.resolve(__dirname, 'deploy.js');

app.post('/webhook', (req, res) => {
  ensureLogDirExists();

  // Log the payload for debugging
  fs.writeFileSync(path.join(logDir, 'webhook_log.txt'), JSON.stringify(req.body, null, 2));

  if (req.body.ref === 'refs/heads/main') {
    console.log('Executing deploy script...');
    fs.appendFileSync(path.join(logDir, 'exec_debug_log.txt'), 'Starting deploy script...\n');

    exec(`node ${deployScriptPath}`, (err, stdout, stderr) => {
      if (err) {
        console.error(`exec error: ${err}`);
        fs.appendFileSync(path.join(logDir, 'exec_debug_log.txt'), `exec error: ${err}\n`);
        fs.writeFileSync(path.join(logDir, 'exec_error_log.txt'), `Error: ${err}\nStdout: ${stdout}\nStderr: ${stderr}`);
        return res.status(500).send('Deployment failed');
      }
      console.log
