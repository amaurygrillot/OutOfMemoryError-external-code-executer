import {JavaExecuterController} from "./java-executer.controller";
import fs from "fs";


const express = require('express')
export const javaRouter = express.Router();

javaRouter.post("/", async function(req, res) {
    let file = req.files.fileKey;
    const fs = require('fs');
    const javaExecuterController = new JavaExecuterController();
    try {
        fs.writeFile(`${process.env.FILES_REPO}/java/${file.name}`,file.data);
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

javaRouter.post("/file", async(req: any, res: any) => {


});

javaRouter.get("/", async function(req, res) {
    res.status(200).json("working").end();

});
