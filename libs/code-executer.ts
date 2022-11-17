import {spawn} from "child_process";
import {ILanguageController} from "../api/ILanguageController";
export function executeCommand(command: string, options: string[] | undefined, onCloseEventCallback: Function)
{
    let fakechrootOptions: string[] = [];
    let commandToExecute = command;
    if(process.env.CONTEXT === undefined || process.env.CONTEXT !== "local")
    {
        fakechrootOptions = ['fakeroot', 'chroot', '/bullseye', '/usr/bin/execution_time.sh'];
        fakechrootOptions.push(command);
        commandToExecute = 'fakechroot';
    }

    const allOptions = fakechrootOptions.concat(options || []);
    const displayName = commandToExecute + " " + options?.join(" ");
    const spawnedProcess = spawn(commandToExecute, allOptions, { timeout: 20 * 1000});
    let dataToSend = "";
    spawnedProcess.stdout.on('data', function (data) {
        console.log('Pipe data from ' + displayName + ' command ...');
        console.log(data.toString());
        dataToSend += data.toString()
    });
    spawnedProcess.stderr.on('data', function (err) {
        console.log(err.toString());
        dataToSend += err.toString();
    });
    spawnedProcess.on('error', function (err) {
        console.log(err.toString());
        dataToSend += err.toString()
    });
// in close event we are sure that stream from child process is closed
    spawnedProcess.on('close', (code) => {
        dataToSend += "\nLe programme s'est arrêté avec le code : " + code.toString();
        onCloseEventCallback(dataToSend);
    });

}

export async function executeFileWithSave(req, res, controller: ILanguageController, persistent : boolean, isChallenge: boolean) {
    const file = req.files.fileKey;
    let dirPath = '';
    if(isChallenge)
    {
        dirPath += 'challenge/'
    }
    dirPath += `${controller.languageService.languageName}/${req.body.commentId}/${req.body.idPerson}`;
    try
    {
        if(persistent)
        {
            saveFile(`${process.env.FILES_REPO}/${dirPath}`, controller.languageService.defaultFileName, file.data);
        }
        else
        {
            dirPath = '';
        }
        saveFile(`/bullseye/${process.env.CHROOT_FILES_REPO}/${dirPath}`, controller.languageService.defaultFileName, file.data);
        controller.executeNoArgumentScript(`${process.env.CHROOT_FILES_REPO}/${dirPath}`)
            .then((message) =>
            {
                res.status(200).json(message).end();
            })
            .catch((message) =>
            {
                console.log("promesse refusée : " + message);
                const finalMessage = message.replace(`${dirPath}/`, '')

                res.status(500).json(finalMessage).end();
            })
            .finally(() =>
            {
                const fs = require('fs')
                fs.unlinkSync(`/bullseye/${process.env.CHROOT_FILES_REPO}/${dirPath}/${controller.languageService.defaultFileName}`);
            });


    } catch (err) {
        console.error(err);
        res.status(500).json("error : " + err).end();
    }
}

export function getFile(req, res, languageName, defaultFile)
{
    const filePath = `${req.params.post_uid}/${req.params.user_uid}`;
    const fs = require('fs')
    try {
        if(fs.existsSync(`${process.env.FILES_REPO}/${languageName}/${filePath}/${defaultFile}`))
        {
            const data = fs.readFileSync(`${process.env.FILES_REPO}/${languageName}/${filePath}/${defaultFile}`, 'utf8');
            res.status(200).json(data).end();
        }
        else
        {
            const data = fs.readFileSync(`${process.env.FILES_REPO}/${languageName}/${defaultFile}`, 'utf8');
            res.status(201).json(data).end();
        }
    }
    catch (err)
    {
        console.error(err);
        res.status(500).json(err).end()
    }

}


export function saveFile(fullPath: string, fileName: any, data: Buffer)
{
    const fs = require('fs')
    if (!fs.existsSync(`${fullPath}`)){
        fs.mkdirSync(`${fullPath}`, { recursive: true });
    }
    fs.writeFileSync(`${fullPath}/${fileName}`, data);
}


export async function checkResulsts(req, res, controller: ILanguageController)
{
    try
    {
        const dirPath = `${process.env.CHROOT_FILES_REPO}/challenge/${req.body.idPerson}`
        saveFile(`/bullseye/${dirPath}`, controller.languageService.defaultFileName, req.files.fileKey.data);
        const jsonFilePath = `${req.body.challenge_uid}/tests.json`;
        const fs = require('fs')

        const file = fs.readFileSync(`${process.env.FILES_REPO}/challenge/${jsonFilePath}`, 'utf8');
        const fileJSON = JSON.parse(file);
        let testsPassed = 0;
        let testResults: TestResult[] = [];
        const stringArray: string[] = []
        let message = {results: testResults, passed : 0, totalTests : fileJSON.length, totalTime : 0.0}
        for (const test of fileJSON) {
            await controller.executeScript(dirPath, test.arguments).then(result =>
            {
                let testResult = {
                    testName: "",
                    arguments: "",
                    expectedResult: "",
                    actualResult: "",
                    timeTaken: "9999.999",
                    passed: false
                }
                testResult.testName = test.testName;
                testResult.arguments = "Arguments utilisés : " + test.arguments.join(" ");
                testResult.expectedResult = test.expectedResult;
                console.log(result)
                testResult.actualResult = result.substring(0, testResult.actualResult.indexOf('Temps'));
                const timeString = result.substring(result.indexOf('Temps d\'exécution : ') + 'Temps d\'exécution : '.length, result.indexOf(' secondes'))
                message.totalTime += parseFloat(timeString);
                testResult.timeTaken = timeString;
                if(typeof test.expectedResult === 'string'
                    && testResult.actualResult.toLowerCase().includes(test.expectedResult.toLowerCase()))
                {
                    testsPassed += 1;
                    testResult.passed = true;
                }
                else if(typeof test.expectedResult === 'number'
                    && result === test.expectedResult)
                {
                    testsPassed += 1;
                    testResult.passed = true;
                }
                message.results.push(testResult);

            });
        }
        fs.unlinkSync(`/bullseye/${dirPath}/${controller.languageService.defaultFileName}`);
        message.passed = testsPassed;
        res.status(200).json(message).end()
    }
    catch (err)
    {
        console.error(err);
        res.status(500).json(err).end()
    }
}

export type TestResult = {
    testName: string;
    arguments: string;
    expectedResult: string;
    actualResult: string;
    timeTaken: string;
    passed: boolean;
}

