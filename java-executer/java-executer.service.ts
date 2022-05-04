import {JavaExecuterRepository} from "./java-executer.repository";

const express = require('express')
const {spawn} = require('child_process');
const app = express()
const port = 3000


export class JavaExecuterService {


    private javaExecuterRepository: JavaExecuterRepository;

    constructor() {
        this.javaExecuterRepository = new JavaExecuterRepository();

    }

    private async getAllInstance(): Promise<void> {
        this.javaExecuterRepository = await JavaExecuterRepository.getInstance();
    }

    public async executeNoArgumentScript(fileName: string): Promise<string> {
        return this.executeScript(fileName);
    }


    private async executeScript(fileName: string): Promise<string>
    {
        return await new Promise<string>((accept, reject) => {
            setTimeout(() => {
                reject("timed out");
            }, (15 * 1000));
            let dataToSend = "";
            let promiseMessage = "Unknown error";
            // spawn new child process to call the javac script
            const javac = spawn('runuser', ['-l', 'root', '-c', `javac /app/mnt/storedPrograms/java/${fileName}`]);
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
                    const java = spawn('runuser', ['-l', 'node', '-c', `java /app/mnt/storedPrograms/java/${fileName}`]);
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
                else
                {
                    promiseMessage = dataToSend;
                    // send data to browser
                    promiseMessage += "\nProcess ended with error code : " + data;
                    console.log("" + promiseMessage);
                    accept(promiseMessage);
                }



            });
        });
    }



}
