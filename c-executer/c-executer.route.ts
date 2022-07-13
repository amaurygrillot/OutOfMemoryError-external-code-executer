import {CExecuterController} from "./c-executer.controller";


const express = require('express')
export const cRouter = express.Router();

cRouter.post("/", async function(req, res) {
    let file = req.files.fileKey;
    const fs = require('fs');
    const javaExecuterController = new CExecuterController();
    try {
        await fs.writeFile(`${process.env.FILES_REPO}/c/${file.name}`,file.data, function (err: any) {
            if (err) return console.log(err);
        });
        const message = await javaExecuterController.executeNoArgumentScript(file.name);
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
    res.status(200).json("working").end();

});
