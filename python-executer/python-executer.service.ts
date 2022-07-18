import {PythonExecuterRepository} from "./python-executer.repository";
import {executeCommand} from "../api/code-executer";

export class PythonExecuterService {


    private pythonExecuterRepository: PythonExecuterRepository;

    constructor() {
        this.pythonExecuterRepository = new PythonExecuterRepository();

    }

    private async getAllInstance(): Promise<void> {
        this.pythonExecuterRepository = await PythonExecuterRepository.getInstance();
    }

    public async executeNoArgumentScript(fileName: string): Promise<string> {
        return this.executeScript(fileName);
    }


    private async executeScript(fileName: string): Promise<string>
    {
        return await new Promise<string>((accept, reject) => {
            setTimeout(() => {
                reject("timed out");
            }, (20 * 1000));
            let promiseMessage = "Unknown error";
            const command = 'sudo';
            const commandOptions = ['-S', 'chroot', '/sandbox', `${process.env.PYTHON}`, `${fileName}`];
            // spawn new child process to call the python script
            executeCommand(command, commandOptions, (dataToSend) => {
                console.log(dataToSend);
                accept(dataToSend);
            } )
        });
    }



}
