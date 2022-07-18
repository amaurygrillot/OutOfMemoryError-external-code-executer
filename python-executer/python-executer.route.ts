import {PythonExecuterController} from "./python-executer.controller";


const express = require('express')
export const pythonRouter = express.Router();

pythonRouter.post("/", async function(req, res) {
    let file = req.files.fileKey;

    const fs = require('fs');
    const pythonExecuterController = new PythonExecuterController();
    try {
        fs.writeFileSync(`${process.env.FILES_REPO}/python/${file.name}`,file.data);
        fs.writeFileSync(`/sandbox/${file.name}`,file.data);
        const message = await pythonExecuterController.executeNoArgumentScript(file.name);
        fs.unlinkSync(`/sandbox/${file.name}`)
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
