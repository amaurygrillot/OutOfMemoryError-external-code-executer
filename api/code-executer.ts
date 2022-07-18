import {spawn} from "child_process";

export function executeCommand(command: string, options: string[], onCloseEventCallback: Function)
{
    const displayName = command + " " + options.join(" ");
    const spawnedProcess = spawn(command, options, { timeout: 20 * 1000});
    if(command === 'sudo')
    {
        spawnedProcess.stdin.write(`${process.env.SU_PASSWORD}`)
        spawnedProcess.stdin.end();
    }
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
        if(dataToSend.includes("[sudo] password for node: "))
        {
            dataToSend = dataToSend.replace("[sudo] password for node: ", "");
        }
        onCloseEventCallback(dataToSend);
    });

}
