import {JavaExecuterRepository} from "./java-executer.repository";

const express = require('express')
const {spawn} = require('child_process');
const app = express()
const port = 3000


export class JavaExecuterService {


    private pythonExecuterRepository: JavaExecuterRepository;

    constructor() {
        this.pythonExecuterRepository = new JavaExecuterRepository();

    }

    private async getAllInstance(): Promise<void> {
        this.pythonExecuterRepository = await JavaExecuterRepository.getInstance();
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
            // spawn new child process to call the javac script
            const javac = spawn('javac', ['files/java/Main.java']);
            // collect data from script
            javac.stdout.on('data', function (data) {
                console.log('Pipe data from javac script ...');
                dataToSend += data.toString();
            });
            javac.stderr.on('data', function (data) {
                console.log('There was an error : ' + data);
                dataToSend += data.toString();
            });
            javac.on('error', function (data) {
                console.log('There was an error : ' + data);
                dataToSend += data.toString();
            });
            // in close event we are sure that stream from child process is closed
            javac.on('close', (data) => {
                if (data === 0) {
                    const java = spawn('java', ['files/java/Main.java']);
                    java.stdout.on('data', function (output) {
                        console.log(String(output));
                        dataToSend += String(output);
                    });
                    java.stderr.on('data', function (output) {
                        console.log('There was an error : ' + String(output));
                        dataToSend += String(output);
                    });
                    java.on('close', function (output) {
                        console.log('stdout: ' + output);
                        promiseMessage = dataToSend;
                        // send data to browser
                        promiseMessage += "\nProcess ended with error code : " + output;
                        console.log("" + promiseMessage);
                        accept(promiseMessage);
                    })

                }


            });
        });
    }



}