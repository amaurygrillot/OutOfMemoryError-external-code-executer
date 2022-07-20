import {CExecuterController} from "./c-executer.controller";
import { verifyToken } from "../middleware/verify_token";
import { getFile } from "../libs/code-executer";

const express = require('express')
export const cRouter = express.Router();

cRouter.post("/", verifyToken, async function(req, res) {
    let file = req.files.fileKey;
    const fs = require('fs');
    const javaExecuterController = new CExecuterController();
    try {
        fs.writeFileSync(`${process.env.FILES_REPO}/c/${file.name}`,file.data);
        fs.writeFileSync(`/bullseye/${process.env.CHROOT_FILES_REPO}/${file.name}`,file.data);
        const message = await javaExecuterController.executeNoArgumentScript(file.name);
        fs.unlinkSync(`/bullseye/${process.env.CHROOT_FILES_REPO}/${file.name}`);
        res.status(200).json(message).end();
    }
    catch (err) {
        console.error(err);
        res.status(500).json("erreur : " + err).end();
    }

});

cRouter.post("/file", async(req: any, res: any) => {


});

cRouter.get("/", async function(req, res) {
    getFile(req, res, "c", "main.c")
});
