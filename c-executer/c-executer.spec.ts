import {CExecuterService} from "./c-executer.service";


describe('ma première suite de tests', () => {
    let cExecuterService;
    beforeEach(() => {

        cExecuterService = new CExecuterService();
    })

    test('string with a single number should result in the number itself', async () => {
        const message = await cExecuterService.executeNoArgumentScript('main.c')
        expect(message).toBe("Hello World\n\nProcess ended with error code : 0");
    });

});
