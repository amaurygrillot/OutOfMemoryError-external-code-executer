export interface ILanguageService
{
    languageName: string;
    defaultFileName: string;
    executeNoArgumentScript(filePath: string): Promise<string>;
    executeScript(filePath: string, options: string[]): Promise<string>;
}
