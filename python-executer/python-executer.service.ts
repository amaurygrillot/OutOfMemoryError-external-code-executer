import {PythonExecuterRepository} from "./python-executer.repository";

const express = require('express')
const {spawn} = require('child_process');
const app = express()
const port = 3000
export class PythonExecuterService {


    private pythonExecuterRepository: PythonExecuterRepository;

    constructor() {
        this.pythonExecuterRepository = new PythonExecuterRepository();

    }

    private async getAllInstance(): Promise<void> {
        this.pythonExecuterRepository = await PythonExecuterRepository.getInstance();
    }

    public async executeNoArgumentScript(fileData: string): Promise<string> {
        return this.executeScript(fileData);
    }


    private async executeScript(fileData: string): Promise<string>
    {
        return await new Promise<string>((accept, reject) => {
            setTimeout(() => {
                reject("timed out");
            }, (15 * 1000));
            let dataToSend = "";
            let promiseMessage = "Unknown error";
            // spawn new child process to call the python script
            const python = spawn('python3', ['-I', '-c', fileData]);
            // collect data from script
            python.stdout.on('data', function (data) {
                console.log('Pipe data from python script ...');
                dataToSend += data.toString();
            });
            python.stderr.on('data', function (data) {
                console.log('There was an error');
                dataToSend += data.toString();
            });
            python.on('error', function (data) {
                console.log('There was an error');
                dataToSend += data.toString();
            });
            // in close event we are sure that stream from child process is closed
            python.on('close', (code) => {
                promiseMessage = dataToSend;
                // send data to browser
                promiseMessage += "\nProcess ended with error code : " + code;
                console.log(promiseMessage);
                accept(promiseMessage);

            });
        });
    }



}
