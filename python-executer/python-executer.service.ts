import {PythonExecuterRepository} from "./python-executer.repository";
import {executeCommand} from "../libs/code-executer";
import {ILanguageService} from "../api/ILanguageService";

export class PythonExecuterService implements ILanguageService{


    private pythonExecuterRepository: PythonExecuterRepository;

    constructor() {
        this.pythonExecuterRepository = new PythonExecuterRepository();

    }

    private async getAllInstance(): Promise<void> {
        this.pythonExecuterRepository = await PythonExecuterRepository.getInstance();
    }

    public async executeNoArgumentScript(filePath: string): Promise<string> {
        return this.executeScript(filePath);
    }


    private async executeScript(filePath: string): Promise<string>
    {
        return await new Promise<string>((accept, reject) => {
            setTimeout(() => {
                    reject("Request timed out");
                },
                (15 * 1000)
            );
            const command = `${process.env.PYTHON}`;
            const commandOptions = [`${filePath}/${process.env.DEFAULT_PYTHON_FILE}`];
            // spawn new child process to call the python script
            executeCommand(command, commandOptions, (dataToSend) => {
                console.log(dataToSend);
                if(dataToSend.search('ended with code : 0') === -1)
                {
                    reject(dataToSend);
                    return;
                }
                accept(dataToSend);
            } )
        });
    }



}
