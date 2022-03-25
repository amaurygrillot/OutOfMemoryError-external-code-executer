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

    public async executeNoArgumentScript(filename: string): Promise<string> {
        const args = [filename];
        return this.executeScript(args);
    }

    public async executeScriptWithArguments(filename: string, args: string[]): Promise<string> {
        let scriptArgs = [filename];
        for (const arg of args) {
            scriptArgs.push(arg);
        }
        return  this.executeScript(scriptArgs);
    }

    private async executeScript(args: string[]): Promise<string>
    {
        return await new Promise<string>((accept, reject) => {
            setTimeout(() => {
                reject("timed out");
            }, (15 * 1000));
            let dataToSend;
            let promiseMessage = "Unknown error";
            // spawn new child process to call the python script
            const python = spawn('py', args);
            // collect data from script
            python.stdout.on('data', function (data) {
                console.log('Pipe data from python script ...');
                dataToSend = data.toString();
            });
            // in close event we are sure that stream from child process is closed
            python.on('close', (code) => {
                console.log(`child process close all stdio with code ${code}`);
                promiseMessage = dataToSend;
                // send data to browser
                promiseMessage += "\nProcess ended with error code : " + code;
                accept(promiseMessage);

            });
        });
    }



}
