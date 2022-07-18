import {CExecuterController} from "./c-executer.controller";
import fs from "fs";


const express = require('express')
export const cRouter = express.Router();

cRouter.post("/", async function(req, res) {
    let file = req.files.fileKey;
    const fs = require('fs');
    const javaExecuterController = new CExecuterController();
    try {
        fs.writeFile(`${process.env.FILES_REPO}/c/${file.name}`,file.data);
        fs.writeFileSync(`/sandbox/${file.name}`,file.data);
        const message = await javaExecuterController.executeNoArgumentScript(file.name);
        fs.unlinkSync(`/sandbox/${file.name}`);
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
