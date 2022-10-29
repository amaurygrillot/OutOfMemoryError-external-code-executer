import {PythonExecuterRepository} from "./python-executer.repository";
import {executeCommand} from "../libs/code-executer";
import {ILanguageService} from "../api/ILanguageService";
import process from "process";

export class PythonExecuterService implements ILanguageService{


    private pythonExecuterRepository: PythonExecuterRepository;
    defaultFileName: string;
    languageName: string;

    constructor() {
        this.pythonExecuterRepository = new PythonExecuterRepository();
        this.defaultFileName = process.env.DEFAULT_PYTHON_FILE || '';
        this.languageName = 'python';
    }

    private async getAllInstance(): Promise<void> {
        this.pythonExecuterRepository = await PythonExecuterRepository.getInstance();
    }

    public async executeNoArgumentScript(filePath: string): Promise<string> {
        return this.executeScript(filePath, []);
    }


    public async executeScript(filePath: string, options: string[]): Promise<string>
    {
        return await new Promise<string>((accept, reject) => {
            setTimeout(() => {
                    reject("Request timed out");
                },
                (15 * 1000)
            );
            const command = `${process.env.PYTHON}`;
            const commandOptions = [`${filePath}/${this.defaultFileName}`, ...options];
            // spawn new child process to call the python script
            executeCommand(command, commandOptions, (dataToSend) => {
                console.log(dataToSend);
                if(dataToSend.search('Le programme s\'est arrêté avec le code : 0') === -1)
                {
                    reject(dataToSend);
                    return;
                }
                accept(dataToSend);
            } )
        });
    }



}
