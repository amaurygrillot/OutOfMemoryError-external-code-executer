import {spawn} from "child_process";

export function executeCommand(command: string, options: string[] | undefined, onCloseEventCallback: Function)
{
    let fakechrootOptions = ['fakeroot', 'chroot', '/bullseye'];
    fakechrootOptions.push(command);
    const allOptions = fakechrootOptions.concat(options || []);
    const displayName = 'fakechroot' + " " + options?.join(" ");
    const spawnedProcess = spawn('fakechroot', allOptions, { timeout: 20 * 1000});
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

export function getFile(req, res, languageName, defaultFile)
{
    const filename = req.body.filename;
    const path = require('path');
    res.sendFile(`${process.env.FILES_REPO}/${languageName}/${filename}`, { root: path.join(__dirname, '../') }, async (err: Error, data: any) => {
        res.sendFile(`${process.env.FILES_REPO}/${languageName}/${defaultFile}`,{ root: path.join(__dirname, '../') }, async(err2: Error, data2: any) => {
          if (err2) {
              res.write(err2.name + "\n" + err2.message);
              res.status(404).end(null, 'binary');
          }
        });
    });

}
