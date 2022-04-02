import {PythonExecuterService} from "./python-executer.service";

export class PythonExecuterController {

    private pythonExecuterService: PythonExecuterService;


    constructor() {
        this.pythonExecuterService = new PythonExecuterService();
    }

    public async executeNoArgumentScript(fileName: string): Promise<string> {
        return this.pythonExecuterService.executeNoArgumentScript(fileName);
    }

}
