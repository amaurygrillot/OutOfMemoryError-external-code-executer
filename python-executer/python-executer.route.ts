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
    const fs = require('fs');
    fs.readFile(`${process.env.FILES_REPO}/python/${filename}`, async (err: Error, data: any) => {
        if (err) {
            try {
                res.write("", 'binary');
                res.status(404).end(null, 'binary');
            } catch (e) {
                console.error(e)
            }
        }
        if (data !== undefined) {//si image pas trouvée, on met l'image par défaut
            res.write(data, 'binary');
            res.status(200).end(null, 'binary');
        }
    });
});
