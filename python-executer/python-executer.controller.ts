import {PythonExecuterService} from "./python-executer.service";

export class PythonExecuterController {

    private pythonExecuterService: PythonExecuterService;


    constructor() {
        this.pythonExecuterService = new PythonExecuterService();
    }

    public async executeNoArgumentScript(filename: string): Promise<string | null> {
        return this.pythonExecuterService.executeNoArgumentScript(filename);
    }

}
