import {CExecuterService} from "./c-executer.service";
import {ILanguageController} from "../api/ILanguageController";
import {ILanguageService} from "../api/ILanguageService";

export class CExecuterController implements ILanguageController{

    languageService: ILanguageService;


    constructor() {
        this.languageService = new CExecuterService();
    }

    public async executeNoArgumentScript(fileName: string): Promise<string> {
        return this.languageService.executeNoArgumentScript(fileName);
    }



}
