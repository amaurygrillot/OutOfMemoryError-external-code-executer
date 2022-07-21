export interface ILanguageService
{
    executeNoArgumentScript(fileName: string): Promise<string>;
}
