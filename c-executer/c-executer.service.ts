import {CExecuterRepository} from "./c-executer.repository";
import {executeCommand} from "../libs/code-executer";
import {ILanguageService} from "../api/ILanguageService";

const {spawn} = require('child_process');

export class CExecuterService implements ILanguageService{


    private cExecuterRepository: CExecuterRepository;
    defaultFileName: string;
    languageName: string;

    constructor() {
        this.cExecuterRepository = new CExecuterRepository();
        this.defaultFileName = process.env.DEFAULT_C_FILE || '';
        this.languageName = "c";
    }

    private async getAllInstance(): Promise<void> {
        this.cExecuterRepository = await CExecuterRepository.getInstance();
    }

    public async executeNoArgumentScript(filePath: string): Promise<string> {
        return this.executeScript(filePath, []);
    }


    public async executeScript(filePath: string, options: string[]): Promise<string>
    {
        return await new Promise<string>((accept, reject) => {
            setTimeout(() => {
                reject("Request timed out");
            }, (15 * 1000));
            let promiseMessage = "Unknown error";
            // spawn new child process to call the gcc script
            executeCommand('gcc',
                [`${filePath}/${process.env.DEFAULT_C_FILE}`, '-o', `${filePath}/executable`],
                (gccData) =>
                {
                    console.log(gccData);
                    if(gccData.search('Le programme s\'est arrêté avec le code : 0') === -1)
                    {
                        reject(gccData);
                        return;
                    }
                    executeCommand(`${filePath}/executable`,
                options,
                (myFileData) =>
                    {
                        console.log(myFileData);
                        promiseMessage = myFileData;
                        if(myFileData.search('Le programme s\'est arrêté avec le code : 0') === -1)
                        {
                            reject(myFileData);
                            return;
                        }
                        accept(promiseMessage);
                    });
                });
        });

    }

}
