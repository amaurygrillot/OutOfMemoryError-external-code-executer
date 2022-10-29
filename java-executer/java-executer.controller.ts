import {JavaExecuterService} from "./java-executer.service";
import {ILanguageController} from "../api/ILanguageController";
import {ILanguageService} from "../api/ILanguageService";

export class JavaExecuterController implements ILanguageController{

    languageService: JavaExecuterService;


    constructor() {
        this.languageService = new JavaExecuterService();
    }

    public async executeNoArgumentScript(filePath: string): Promise<string> {
        return this.languageService.executeNoArgumentScript(filePath);
    }

    executeScript(filePath: string, options: string[]): Promise<string> {
        return this.languageService.executeScript(filePath, options);
    }

}
