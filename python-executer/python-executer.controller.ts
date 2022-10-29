import {PythonExecuterService} from "./python-executer.service";
import {ILanguageService} from "../api/ILanguageService";
import {ILanguageController} from "../api/ILanguageController";

export class PythonExecuterController implements ILanguageController{

    languageService: ILanguageService;

    constructor() {
        this.languageService = new PythonExecuterService();

    }

    public async executeNoArgumentScript(filePath: string): Promise<string> {
        return this.languageService.executeNoArgumentScript(filePath);
    }

    public async executeScript(filePath: string, options: string[]): Promise<string>
    {
        return this.languageService.executeScript(filePath, options)
    }



}
