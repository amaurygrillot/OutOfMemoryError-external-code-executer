import {PythonExecuterService} from "./python-executer.service";


describe('ma première suite de tests', () => {
    let pythonExecuterService;
    beforeEach(() => {

        pythonExecuterService = new PythonExecuterService();
    })

    test('string with a single number should result in the number itself', async () => {
        const message = await pythonExecuterService.executeNoArgumentScript('main.py')
        expect(message).toBe("Hello World!\n\nProcess ended with error code : 0");
    });

});
