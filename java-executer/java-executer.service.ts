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

    public async executeNoArgumentScript(filePath: string): Promise<string> {
        return this.executeScript(filePath);
    }


    private async executeScript(filePath: string): Promise<string>
    {
        return await new Promise<string>((accept, reject) => {
            setTimeout(() => {
                reject("Request timed out");
            }, (15 * 1000));
            let dataToSend = "";
            let promiseMessage = "";
            executeCommand('javac',
                [`${filePath}/${process.env.DEFAULT_JAVA_FILE}`],
                (javacData) =>
                {
                    console.log(javacData);
                    if(javacData.search('Le programme s\'est arrêté avec le code : 0') === -1)
                    {
                        reject(javacData);
                        return;
                    }
                    executeCommand(`java`,
                        ['-Xlog:exit*:stdout:uptime',`${filePath}/${process.env.DEFAULT_JAVA_FILE}`],
                        (javaData) =>
                        {
                            console.log(javaData);
                            promiseMessage += javaData;
                            if(javaData.search('Le programme s\'est arrêté avec le code : 0') === -1)
                            {
                                reject(promiseMessage);
                                return;
                            }
                            accept(promiseMessage);
                        });
                });
        });
    }

    public getFormattedFileData(fileData: string, className: string): string
    {
        if(fileData.includes("public class Main"))
        {
            return fileData.replace("public class Main", "public class " + className);
        }
        else
        {
            return fileData;
        }
    }



}
