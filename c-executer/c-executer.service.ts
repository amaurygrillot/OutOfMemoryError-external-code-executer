import {CExecuterRepository} from "./c-executer.repository";

const {spawn} = require('child_process');

export class CExecuterService {


    private cExecuterRepository: CExecuterRepository;

    constructor() {
        this.cExecuterRepository = new CExecuterRepository();

    }

    private async getAllInstance(): Promise<void> {
        this.cExecuterRepository = await CExecuterRepository.getInstance();
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
            // spawn new child process to call the gcc script
            const gcc = spawn('sudo',
                ['-S', 'chroot', '/sandbox', `gcc`, `${fileName}`, '-o', `myFile`],
                {timeout : 30 * 1000});
            gcc.stdin.write(`${process.env.SU_PASSWORD}`);
            gcc.stdin.end();
            // collect data from script
            gcc.stdout.on('data', function (data) {
                console.log('Pipe data from gcc script ...');
                dataToSend += data.toString();
            });
            gcc.stderr.on('data', function (data) {
                console.log('There was an error : ' + data);
                dataToSend += data.toString();
            });
            gcc.on('error', function (data) {
                console.log('There was an error : ' + data);
                dataToSend += data.toString();
            });
            // in close event we are sure that stream from child process is closed
            gcc.on('close', (data) => {
                if (data === 0) {
                    const cExec = spawn(`myFile`);
                    cExec.stdout.on('data', function (output) {
                        console.log(String(output));
                        dataToSend += String(output);
                    });
                    cExec.stderr.on('data', function (output) {
                        console.log('There was an error : ' + String(output));
                        dataToSend += String(output);
                    });
                    cExec.on('close', function (output) {
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
