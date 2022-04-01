import {JavaExecuterController} from "./java-executer.controller";


const express = require('express')
export const javaRouter = express.Router();

javaRouter.post("/", async function(req, res) {
    let file = req.files.fileKey;
    const fs = require('fs');
    const javaExecuterController = new JavaExecuterController();
    try {
        fs.writeFile(`files/c/${file.name}`,file.data, function (err: any) {
            if (err) return console.log(err);
        });
        const message = await javaExecuterController.executeNoArgumentScript(file.name);
        res.status(200).json(message).end();
    }
    catch (err) {
        console.error(err);
        res.status(500).json("erreur").end();
    }

});

javaRouter.post("/file", async(req: any, res: any) => {


});

javaRouter.get("/", async function(req, res) {
    res.status(200).json("working").end();

});
