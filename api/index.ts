import { Express } from "express";
import { pythonRouter } from "../python-executer/python-executer.route";
//import { nodeRouter} from "../node-executer/node-executer.route";
import {javaRouter} from "../java-executer/java-executer.route";
import {cRouter} from "../c-executer/c-executer.route";
import {spawn} from "child_process";

export function buildRoutes(app: Express) {
    app.get("/", async function(req, res) {
        res.send("OutOfMemoryError API");
    });

    app.use("/python", pythonRouter);

   // app.use("/node", nodeRouter);

    app.use("/c", cRouter);

    app.use("/java", javaRouter);

}

export function startSSH()
{
    const startSSH = spawn('sudo', ['-S','service','ssh','start']);
    startSSH.stdin.write(`${process.env.SU_PASSWORD}`)

    startSSH.stdout.on('data', function (data) {
        console.log('Pipe data from ssh script ...');
        console.log(data.toString());
    });
    startSSH.stderr.on('data', function (err) {
        console.log(err.toString());});
    startSSH.on('error', function (err) {
        console.log(err.toString());});
// in close event we are sure that stream from child process is closed
    startSSH.on('close', (code) => {
        console.log("SSH ended with code : " + code.toString());

    });
    startSSH.stdin.end();
}

export function mountFiles()
{
    const mountFiles = spawn('sudo', ['-S','./mount.sh']);
    mountFiles.stdin.write(`${process.env.SU_PASSWORD}`)

    mountFiles.stdout.on('data', function (data) {
        console.log('Pipe data from mountFiles script ...');
        console.log(data.toString());
    });
    mountFiles.stderr.on('data', function (err) {
        console.log(err.toString());});
    mountFiles.on('error', function (err) {
        console.log(err.toString());});
// in close event we are sure that stream from child process is closed
    mountFiles.on('close', (code) => {
        console.log("mountFiles ended with code : " + code.toString());

    });
    mountFiles.stdin.end();
}

export function giveWriteRightsMntFolder()
{
    const chmod = spawn('sudo', ['-S', 'chmod', '-R','755', `${process.env.FILES_REPO}`]);
    chmod.stdin.write(`${process.env.SU_PASSWORD}`);
    chmod.stdin.end();
    chmod.stdout.on('data', function (data) {
        console.log('Pipe data from spawn script ...');
        console.log(data.toString());
    });
    chmod.stderr.on('data', function (err) {
        console.log(err.toString());});
    chmod.on('error', function (err) {
        console.log(err.toString());});
// in close event we are sure that stream from child process is closed
    chmod.on('close', (code) => {
        console.log("Spawn ended with code : " + code.toString());

    });

}
