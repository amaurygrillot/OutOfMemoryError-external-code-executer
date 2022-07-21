import {PythonExecuterService} from "./python-executer.service";
import {ILanguageService} from "../api/ILanguageService";
import {ILanguageController} from "../api/ILanguageController";

export class PythonExecuterController implements ILanguageController{

    languageService: ILanguageService;


    constructor() {
        this.languageService = new PythonExecuterService();
    }

    public async executeNoArgumentScript(fileName: string): Promise<string> {
        return this.languageService.executeNoArgumentScript(fileName);
    }

}
