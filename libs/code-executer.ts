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
        saveFile(`/bullseye/${process.env.CHROOT_FILES_REPO}/${req.body.idPerson}`, controller.languageService.defaultFileName, req.files.fileKey.data);
        const filePath = `${req.body.challenge_uid}/tests.json`;
        const fs = require('fs')

        const file = fs.readFileSync(`${process.env.FILES_REPO}/challenge/${filePath}`, 'utf8');
        const fileJSON = JSON.parse(file);
        let testsPassed = 0;
        fileJSON.forEach((test) =>
        {
            controller.executeScript('', test.arguments).then(result =>
            {
                if(result.includes(test.expectedResult))
                {
                    testsPassed += 1;
                }

            }).catch(err =>
            {
                console.error(err);
                res.status(501).message(err).end()
                return;
            });
        })
        res.status(200).message("Tests réussis : " + testsPassed).end()
    }
    catch (err)
    {
        console.error(err);
        res.status(520).message(err).end()
    }
}

