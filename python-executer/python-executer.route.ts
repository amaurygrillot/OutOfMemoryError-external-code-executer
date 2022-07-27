import {PythonExecuterController} from "./python-executer.controller";
import {verifySameIdPost, verifyToken} from "../middleware/verify_token";
import {executeFileWithSave, getFile, saveFile} from "../libs/code-executer";

const express = require('express')
export const pythonRouter = express.Router();

pythonRouter.post("/", verifyToken, verifySameIdPost, async function(req, res) {
    executeFileWithSave(req, res, 'python', process.env.DEFAULT_PYTHON_FILE, new PythonExecuterController(), true);
});

pythonRouter.post("/executeNoSave", verifyToken, verifySameIdPost, async function(req, res) {
    executeFileWithSave(req, res, 'python', process.env.DEFAULT_PYTHON_FILE, new PythonExecuterController(), false);
});

pythonRouter.post("/saveFile", verifyToken, async(req: any, res: any) => {
    try {
        const file = req.files.fileKey;
        const fullPath = `${process.env.FILES_REPO}/python/${req.body.commentId}/${req.body.idPerson}`;
        saveFile(fullPath, process.env.DEFAULT_PYTHON_FILE, file.data);
        res.status(200).end();
    }
    catch (err)
    {
        res.write(err);
        res.status(500).end()
    }
});

pythonRouter.get("/:post_uid/:user_uid", async function(req, res) {
    getFile(req, res, "python", "main.py")
});
