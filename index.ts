const bodyParser = require("body-parser");
import {buildRoutes} from "./api";
import {Express} from "express";
const express = require('express')
import { config } from "dotenv";
config();
const fileUpload = require('express-fileupload');

const app: Express = express();


app.use(fileUpload());
app.use(bodyParser.json());
buildRoutes(app);

const {spawn} = require('child_process');
const startSSH = spawn('service', ['ssh', 'start']);
startSSH.stdout.on('data', function (data) {
    console.log('Pipe data from ssh script ...');
    console.log(data.toString());
});
startSSH.stderr.on('data', function (data) {
    console.log('There was an error');
    console.log(data.toString());});
startSSH.on('error', function (data) {
    console.log('There was an error');
    console.log(data.toString());});
// in close event we are sure that stream from child process is closed
startSSH.on('close', (code) => {
    console.log(code.toString());

});

const port = process.env.PORT || 3000;
console.log("port : " + port)
app.listen(port, function() {
    console.log(`Listening on ${port}...`);
    console.log(new Date().toLocaleString().split(',')[0]);
});


