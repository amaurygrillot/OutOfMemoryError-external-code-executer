import {JavaExecuterService} from "./java-executer.service";

export class JavaExecuterController {

    private pythonExecuterService: JavaExecuterService;


    constructor() {
        this.pythonExecuterService = new JavaExecuterService();
    }

    public async executeNoArgumentScript(fileData: string): Promise<string> {
        return this.pythonExecuterService.executeNoArgumentScript(fileData);
    }

}
