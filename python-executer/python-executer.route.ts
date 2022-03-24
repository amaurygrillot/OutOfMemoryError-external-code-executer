import {PythonExecuterController} from "./python-executer.controller";


const express = require('express')
export const pythonRouter = express.Router();

pythonRouter.get("/", async function(req, res) {
    const pythonExecuterController = new PythonExecuterController();
    const filename = req.body.filename
    const message = await pythonExecuterController.executeNoArgumentScript(filename);
    res.status(200).json(message).end();
});
