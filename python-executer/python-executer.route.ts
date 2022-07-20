import {PythonExecuterController} from "./python-executer.controller";
import { verifyToken } from "../middleware/verify_token";
import { getFile } from "../libs/code-executer";

const express = require('express')
export const pythonRouter = express.Router();

pythonRouter.post("/", verifyToken, async function(req, res) {
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

pythonRouterjavaRouter.get("/", async function(req, res) {
    getFile(req, res, "python", "main.py")
});
