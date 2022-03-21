const express = require('express')
const {spawn} = require('child_process');
const app = express()
const port = 3000
app.get('/', (req, res) => {

    let dataToSend;
    // spawn new child process to call the python script
    const python = spawn('py', ['script2.py','node.js','python']);
    // collect data from script
    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        let message = dataToSend;
        // send data to browser
        message += "\nProcess ended with error code : " + code;
        res.send(message);

    });

})
app.listen(port, () => console.log(`Example app listening on port 
${port}!`))
