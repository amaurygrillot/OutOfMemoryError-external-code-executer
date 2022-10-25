import {spawn} from "child_process";
import {ILanguageController} from "../api/ILanguageController";
export function executeCommand(command: string, options: string[] | undefined, onCloseEventCallback: Function)
{
    let fakechrootOptions: string[] = [];
    let commandToExecute = command;
    if(process.env.CONTEXT === undefined || process.env.CONTEXT !== "local")
    {
        fakechrootOptions = ['fakeroot', 'chroot', '/bullseye', '/usr/bin/time'];
        fakechrootOptions.push(command);
        commandToExecute = 'fakechroot';
    }

    const allOptions = fakechrootOptions.concat(options || []);
    const displayName = commandToExecute + " " + options?.join(" ");
    const startDate = Date.now();
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
        const endDate = Date.now()
        const timeElapsed = (endDate - startDate) / 1000;
        dataToSend += "\nTemps d'exécution : " + timeElapsed + " secondes"
            + "\nLe programme s'est arrêté avec le code : " + code.toString();
        onCloseEventCallback(dataToSend);
    });

}

export async function executeFileWithSave(req, res, languageName, fileName, controller: ILanguageController, persistent : boolean) {
    const file = req.files.fileKey;
    let dirPath = `${languageName}/${req.body.commentId}/${req.body.idPerson}`;
    try
    {
        if(persistent)
        {
            saveFile(`${process.env.FILES_REPO}/${dirPath}`, fileName, file.data);
        }
        else
        {
            dirPath = '';
        }
        saveFile(`/bullseye/${process.env.CHROOT_FILES_REPO}/${dirPath}`, fileName, file.data);
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
                fs.unlinkSync(`/bullseye/${process.env.CHROOT_FILES_REPO}/${dirPath}/${fileName}`);
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


