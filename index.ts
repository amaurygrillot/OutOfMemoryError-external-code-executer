const bodyParser = require("body-parser");
import {buildRoutes} from "./api";
import {Express} from "express";
const express = require('express')

const fileUpload = require('express-fileupload');

const app: Express = express();


app.use(fileUpload());
app.use(bodyParser.json());
buildRoutes(app);

const {spawn} = require('child_process');
const startSSH = spawn('service', ['ssh', 'start']);
startSSH.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    console.log(data.toString());
});
startSSH.stderr.on('data', function (data) {
    console.log('There was an error');
    console.log(data.toString());});
startSSH.on('error', function (data) {
    console.log('There was an error');
    console.log(data.toString());});
// in close event we are sure that stream from child process is closed
startSSH.on('close', (code) => {
    console.log(code.toString());

});
const ivm = require('isolated-vm');
const isolate = new ivm.Isolate({ memoryLimit: 128 });

// Create a new context within this isolate. Each context has its own copy of all the builtin
// Objects. So for instance if one context does Object.prototype.foo = 1 this would not affect any
// other contexts.
const context = isolate.createContextSync();

// Get a Reference{} to the global object within the context.
const jail = context.global;

// This makes the global object available in the context as `global`. We use `derefInto()` here
// because otherwise `global` would actually be a Reference{} object in the new isolate.
jail.setSync('global', jail.derefInto());

// We will create a basic `log` function for the new isolate to use.
jail.setSync('log', function(...args) {
    console.log(...args);
});

// And let's test it out:
context.evalSync('log("hello world")');
// > hello world

// Let's see what happens when we try to blow the isolate's memory
const hostile = isolate.compileScriptSync(`
	const storage = [];
	const twoMegabytes = 1024 * 1024 * 2;
	while (true) {
		const array = new Uint8Array(twoMegabytes);
		for (let ii = 0; ii < twoMegabytes; ii += 4096) {
			array[ii] = 1; // we have to put something in the array to flush to real memory
		}
		storage.push(array);
		log('I\\'ve wasted '+ (storage.length * 2)+ 'MB');
	}
`);

// Using the async version of `run` so that calls to `log` will get to the main node isolate
hostile.run(context).catch(err => console.error(err));
const port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log(`Listening on ${port}...`);
    console.log(new Date().toLocaleString().split(',')[0]);
});


