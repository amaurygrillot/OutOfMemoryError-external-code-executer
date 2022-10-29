import {ILanguageService} from "./ILanguageService";

export interface ILanguageController
{
    languageService: ILanguageService;
    executeNoArgumentScript(filePath: string): Promise<string>;
    executeScript(filePath: string, options: string[]): Promise<string>;
}
