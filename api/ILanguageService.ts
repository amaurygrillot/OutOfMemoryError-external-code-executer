export interface ILanguageService
{
    executeNoArgumentScript(filePath: string): Promise<string>;
}
