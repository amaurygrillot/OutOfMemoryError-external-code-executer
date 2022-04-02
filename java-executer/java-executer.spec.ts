import {JavaExecuterService} from "./java-executer.service";


describe('ma première suite de tests', () => {
    let javaExecuterService;
    beforeEach(() => {

        javaExecuterService = new JavaExecuterService();
    })

    test('string with a single number should result in the number itself', async () => {
        const message = await javaExecuterService.executeNoArgumentScript('Main.java')
        expect(message).toBe("Hello world!\n\nProcess ended with error code : 0");
    });

});
