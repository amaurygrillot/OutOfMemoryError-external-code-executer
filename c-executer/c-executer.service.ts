import {CExecuterRepository} from "./c-executer.repository";
import {executeCommand} from "../libs/code-executer";

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
            let promiseMessage = "Unknown error";
            // spawn new child process to call the gcc script
            executeCommand('gcc',
                [`${process.env.CHROOT_FILES_REPO}/${fileName}`, '-o', `${process.env.CHROOT_FILES_REPO}/myFile`],
                (gccData) =>
                {
                    console.log(gccData);
                    promiseMessage = gccData.toString();
                    executeCommand(`${process.env.CHROOT_FILES_REPO}/myFile`,
                undefined,
                (myFileData) =>
                    {
                        console.log(myFileData);
                        promiseMessage += myFileData;
                        accept(promiseMessage);
                    });
                });
        });

    }



}
