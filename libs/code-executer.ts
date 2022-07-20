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
