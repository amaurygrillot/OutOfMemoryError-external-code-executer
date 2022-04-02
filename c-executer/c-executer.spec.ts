import {CExecuterService} from "./c-executer.service";


describe('Tests exécution de code C', () => {
    let cExecuterService;
    beforeEach(() => {

        cExecuterService = new CExecuterService();
    })

    test('test exécution fichier main.c', async () => {
        const message = await cExecuterService.executeNoArgumentScript('main.c')
        expect(message).toBe("Hello World\n\nProcess ended with error code : 0");
    });

});
