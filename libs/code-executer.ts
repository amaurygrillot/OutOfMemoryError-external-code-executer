import {spawn} from "child_process";
import {JavaExecuterController} from "../java-executer/java-executer.controller";
import {ILanguageController} from "../api/ILanguageController";

export function executeCommand(command: string, options: string[] | undefined, onCloseEventCallback: Function)
{
    let fakechrootOptions: string[] = [];
    let commandToExecute = command;
    if(process.env.CONTEXT === undefined || process.env.CONTEXT !== "local")
    {
        fakechrootOptions = ['fakeroot', 'chroot', '/bullseye'];
        fakechrootOptions.push(command);
        commandToExecute = 'fakechroot';
    }

    const allOptions = fakechrootOptions.concat(options || []);
    const displayName = 'fakechroot' + " " + options?.join(" ");

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
        dataToSend += "\nended with code : " + code.toString();
        onCloseEventCallback(dataToSend);
    });

}

export async function postFile(req, res, languageName, fileName, controller: ILanguageController) {
    const file = req.files.fileKey;
    const dirPath = `${languageName}/${req.body.commentId}/${req.body.idPerson}`;
    const fs = require('fs');
    try
    {
        if (!fs.existsSync(`${process.env.FILES_REPO}/${dirPath}`)){
            fs.mkdirSync(`${process.env.FILES_REPO}/${dirPath}`, { recursive: true });
        }
        if (!fs.existsSync(`/bullseye/${process.env.CHROOT_FILES_REPO}/${dirPath}`)){
            fs.mkdirSync(`/bullseye/${process.env.CHROOT_FILES_REPO}/${dirPath}`, { recursive: true });
        }
        fs.writeFileSync(`${process.env.FILES_REPO}/${dirPath}/${fileName}`, file.data);
        fs.writeFileSync(`/bullseye/${process.env.CHROOT_FILES_REPO}/${dirPath}/${fileName}`, file.data);
        const message = await controller.executeNoArgumentScript(`${process.env.CHROOT_FILES_REPO}/${dirPath}`);
        fs.unlinkSync(`/bullseye/${process.env.CHROOT_FILES_REPO}/${dirPath}/${fileName}`);
        res.status(200).json(message).end();
    } catch (err) {
        console.error(err);
        res.status(500).json("erreur : " + err).end();
    }
}

export function getFile(req, res, languageName, defaultFile)
{
    const filePath = `${req.params.post_uid}/${req.params.user_uid}`;
    const path = require('path');
    res.sendFile(`${process.env.FILES_REPO}/${languageName}/${filePath}/${defaultFile}`, { root: path.join(__dirname, '../') }, async (err: Error, data: any) => {
        res.sendFile(`${process.env.FILES_REPO}/${languageName}/${defaultFile}`,{ root: path.join(__dirname, '../') }, async(err2: Error, data2: any) => {
          if (err2) {
              res.write(err2.name + "\n" + err2.message);
              res.status(404).end(null, 'binary');
          }
        });
    });
}


