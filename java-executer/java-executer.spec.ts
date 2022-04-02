import {JavaExecuterService} from "./java-executer.service";


describe('Tests exécution code java', () => {
    let javaExecuterService;
    beforeEach(() => {

        javaExecuterService = new JavaExecuterService();
    })

    test('test exécution Main.java', async () => {
        const message = await javaExecuterService.executeNoArgumentScript('Main.java')
        expect(message).toBe("Hello world!\n\nProcess ended with error code : 0");
    });

});
