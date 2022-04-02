import {PythonExecuterService} from "./python-executer.service";


describe('Tests exécution de code python', () => {
    let pythonExecuterService;
    beforeEach(() => {

        pythonExecuterService = new PythonExecuterService();
    })

    test('test le fichier test.py', async () => {
        const message = await pythonExecuterService.executeNoArgumentScript('test.py')
        expect(message).toBe("hello from python\n\nProcess ended with error code : 0");
    });

});
