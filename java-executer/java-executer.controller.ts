import {JavaExecuterService} from "./java-executer.service";
import {ILanguageController} from "../api/ILanguageController";
import {ILanguageService} from "../api/ILanguageService";

export class JavaExecuterController implements ILanguageController{

    languageService: JavaExecuterService;


    constructor() {
        this.languageService = new JavaExecuterService();
    }

    public async executeNoArgumentScript(fileName: string): Promise<string> {
        return this.languageService.executeNoArgumentScript(fileName);
    }

    public getFormattedFileData(fileData: string, className: string): string {
        return this.languageService.getFormattedFileData(fileData, className);
    }

}
