import {PythonExecuterController} from "./python-executer.controller";
import ivm from "isolated-vm";


const express = require('express')
export const pythonRouter = express.Router();

pythonRouter.post("/", async function(req, res) {
    let file = req.files.fileKey;
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
	let test = "my isolated code did run";
`);

// Using the async version of `run` so that calls to `log` will get to the main node isolate
    let result = hostile.run(context)
        .then(res =>
    {
        res.status(200).json(result).end();
    }).catch(err => {
        res.status(500).json("erreur : " + err).end();
        return;
    });



});

pythonRouter.post("/file", async(req: any, res: any) => {


});

pythonRouter.get("/", async function(req, res) {
    res.status(200).json("working").end();

});
