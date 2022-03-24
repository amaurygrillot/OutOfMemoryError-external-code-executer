import {PythonExecuterService} from "./python-executer.service";

export class PythonExecuterController {

    private pythonExecuterService: PythonExecuterService;


    constructor() {
        this.pythonExecuterService = new PythonExecuterService();
    }

    public async executeNoArgumentScript(filename: string): Promise<string> {
        return this.pythonExecuterService.executeNoArgumentScript(filename);
    }

    public async executeScriptWithArguments(filename: string, args: string[]): Promise<string> {
        return this.pythonExecuterService.executeScriptWithArguments(filename, args);
    }
}
