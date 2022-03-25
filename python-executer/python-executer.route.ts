import {PythonExecuterController} from "./python-executer.controller";


const express = require('express')
export const pythonRouter = express.Router();

pythonRouter.post("/", async function(req, res) {
    const pythonExecuterController = new PythonExecuterController();
    const filename = req.body.filename;
    const args = req.body.args;
    let message;
    if(args !== null && args !== undefined)
    {
        message = await pythonExecuterController.executeScriptWithArguments(filename, args);
    }
    else
    {
        message = await pythonExecuterController.executeNoArgumentScript(filename);

    }
    res.status(200).json(message).end();

});

pythonRouter.get("/", async function(req, res) {
    res.status(200).json("working").end();

});
