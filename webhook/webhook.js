const express = require('express');
const fs = require('fs');
const app = express();
const port = 3002;

app.use(express.json());

app.post('/webhook', (req, res) => {
    console.log('Webhook received:', req.body);

    // Write to log file
    fs.appendFileSync('D:\\Projects\\logs\\webhook\\exec_output_log.txt', `Webhook received: ${JSON.stringify(req.body)}\n`);

    if (req.body.ref !== 'refs/heads/main') {
        return res.send('Not the main branch');
    }

    // Call your deployment script
    const { exec } = require('child_process');
    exec('node D:\\Projects\\webhook\\deploy.js', (err, stdout, stderr) => {
        if (err) {
            fs.appendFileSync('D:\\Projects\\logs\\webhook\\exec_error_log.txt', `Error: ${err.message}\n`);
            fs.appendFileSync('D:\\Projects\\logs\\webhook\\exec_error_log.txt', `Stderr: ${stderr}\n`);
            return res.status(500).send(`Deployment failed: ${err.message}`);
        }
        fs.appendFileSync('D:\\Projects\\logs\\webhook\\exec_output_log.txt', `Stdout: ${stdout}\n`);
        res.send('Deployment successful');
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
