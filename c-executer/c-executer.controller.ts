import {CExecuterService} from "./c-executer.service";
import {ILanguageController} from "../api/ILanguageController";
import {ILanguageService} from "../api/ILanguageService";

export class CExecuterController implements ILanguageController{

    languageService: CExecuterService;


    constructor() {
        this.languageService = new CExecuterService();
    }

    public async executeNoArgumentScript(filePath: string): Promise<string> {
        return this.languageService.executeNoArgumentScript(filePath);
    }

    executeScript(filePath: string, options: string[]): Promise<string> {
        return this.languageService.executeScript(filePath, options);
    }



}
