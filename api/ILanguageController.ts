import {ILanguageService} from "./ILanguageService";

export interface ILanguageController
{
    languageService: ILanguageService;

    executeNoArgumentScript(fileName: string): Promise<string>;
}
