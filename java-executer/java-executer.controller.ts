import {JavaExecuterService} from "./java-executer.service";

export class JavaExecuterController {

    private javaExecuterService: JavaExecuterService;


    constructor() {
        this.javaExecuterService = new JavaExecuterService();
    }

    public async executeNoArgumentScript(fileName: string): Promise<string> {
        return this.javaExecuterService.executeNoArgumentScript(fileName);
    }

}
