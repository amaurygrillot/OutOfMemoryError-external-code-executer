import {PythonExecuterController} from "./python-executer.controller";


const express = require('express')
export const pythonRouter = express.Router();

pythonRouter.post("/", async function(req, res) {
    let file = req.files.fileKey;

    const fs = require('fs');
    const pythonExecuterController = new PythonExecuterController();
    try {
        fs.writeFile(`${process.env.FILES_REPO}/python/${file.name}`,file.data, function (err: any) {
            if (err) return console.log(err);
        });
        const message = await pythonExecuterController.executeNoArgumentScript(file.name);
        res.status(200).json(message).end();
    }
    catch (err) {
        console.error(err);
        res.status(500).json("erreur : " + err).end();
    }
});

pythonRouter.post("/file", async(req: any, res: any) => {


});

pythonRouter.get("/", async function(req, res) {
    res.status(200).json("working").end();

});
