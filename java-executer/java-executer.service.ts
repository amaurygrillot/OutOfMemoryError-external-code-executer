import {JavaExecuterRepository} from "./java-executer.repository";
import {executeCommand} from "../libs/code-executer";
import {ILanguageService} from "../api/ILanguageService";

const {spawn} = require('child_process');


export class JavaExecuterService implements ILanguageService{


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
            executeCommand('javac',
                [`${process.env.CHROOT_FILES_REPO}/${fileName}`],
                (javacData) =>
                {
                    console.log(javacData);
                    promiseMessage = javacData.toString();
                    executeCommand(`java`,
                        [`${process.env.CHROOT_FILES_REPO}/${fileName}`],
                        (javaData) =>
                        {
                            console.log(javaData);
                            promiseMessage += javaData;
                            accept(promiseMessage);
                        });
                });
        });
    }



}
