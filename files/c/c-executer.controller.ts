import {CExecuterService} from "./c-executer.service";

export class CExecuterController {

    private cExecuterService: CExecuterService;


    constructor() {
        this.cExecuterService = new CExecuterService();
    }

    public async executeNoArgumentScript(fileName: string): Promise<string> {
        return this.cExecuterService.executeNoArgumentScript(fileName);
    }

}
