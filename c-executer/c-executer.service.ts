import {CExecuterRepository} from "./c-executer.repository";
import {executeCommand} from "../libs/code-executer";
import {ILanguageService} from "../api/ILanguageService";

const {spawn} = require('child_process');

export class CExecuterService implements ILanguageService{


    private cExecuterRepository: CExecuterRepository;

    constructor() {
        this.cExecuterRepository = new CExecuterRepository();

    }

    private async getAllInstance(): Promise<void> {
        this.cExecuterRepository = await CExecuterRepository.getInstance();
    }

    public async executeNoArgumentScript(filePath: string): Promise<string> {
        return this.executeScript(filePath);
    }


    private async executeScript(filePath: string): Promise<string>
    {
        return await new Promise<string>((accept, reject) => {
            setTimeout(() => {
                reject("timed out");
            }, (15 * 1000));
            let promiseMessage = "Unknown error";
            // spawn new child process to call the gcc script
            executeCommand('gcc',
                [`${filePath}/${process.env.DEFAULT_C_FILE}`, '-o', `${filePath}/executable`],
                (gccData) =>
                {
                    console.log(gccData);
                    executeCommand(`${filePath}/executable`,
                undefined,
                (myFileData) =>
                    {
                        console.log(myFileData);
                        promiseMessage = myFileData;
                        accept(promiseMessage);
                    });
                });
        });

    }



}
