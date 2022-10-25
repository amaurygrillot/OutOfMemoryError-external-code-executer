import {PythonExecuterController} from "./python-executer.controller";
import {verifySameIdChallengeResult, verifySameIdPost, verifyToken} from "../middleware/verify_token";
import {executeFileWithSave, getFile, saveFile} from "../libs/code-executer";

const express = require('express')
export const pythonRouter = express.Router();

pythonRouter.post("/", verifyToken, verifySameIdPost, async function(req, res) {
    await executeFileWithSave(req, res, 'python', process.env.DEFAULT_PYTHON_FILE, new PythonExecuterController(), true);
});

pythonRouter.post("/challenge/", verifyToken, verifySameIdChallengeResult, async function(req, res) {
    await executeFileWithSave(req, res, 'challenge/python', process.env.DEFAULT_PYTHON_FILE, new PythonExecuterController(), true);
});

pythonRouter.post("/executeNoSave", async function(req, res) {
    req.body.idPerson = 'tmp'
    await executeFileWithSave(req, res, 'python', process.env.DEFAULT_PYTHON_FILE, new PythonExecuterController(), false);
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

pythonRouter.post("/challenge/saveFile", verifyToken, verifySameIdChallengeResult, async(req: any, res: any) => {
    try {
        const file = req.files.fileKey;
        const fullPath = `${process.env.FILES_REPO}/challenge/python/${req.body.challengeId}/${req.body.idPerson}`;
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

pythonRouter.get("/challenge/:post_uid/:user_uid", async function(req, res) {
    getFile(req, res, "challenge/python", "main.py")
});
