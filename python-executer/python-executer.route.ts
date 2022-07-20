import {PythonExecuterController} from "./python-executer.controller";


const express = require('express')
export const pythonRouter = express.Router();

pythonRouter.post("/", async function(req, res) {
    let file = req.files.fileKey;

    const fs = require('fs');
    const pythonExecuterController = new PythonExecuterController();
    try {
        fs.writeFileSync(`${process.env.FILES_REPO}/python/${file.name}`,file.data);
        fs.writeFileSync(`/bullseye/${process.env.CHROOT_FILES_REPO}/${file.name}`,file.data);
        const message = await pythonExecuterController.executeNoArgumentScript(file.name);
        fs.unlinkSync(`/bullseye/${process.env.CHROOT_FILES_REPO}/${file.name}`)
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
    const filename = req.body.filename;
    const path = require('path');
    res.sendFile(`${process.env.FILES_REPO}/python/${filename}`, { root: path.join(__dirname, '../') }, async (err: Error, data: any) => {
        res.sendFile(`${process.env.FILES_REPO}/python/main.py`,{ root: path.join(__dirname, '../') }, async(err2: Error, data2: any0 => {
          if (err2) {
              res.write(err2.name + "\n" + err2.message);
              res.status(404).end(null, 'binary');
          }
        }))
    });
});
