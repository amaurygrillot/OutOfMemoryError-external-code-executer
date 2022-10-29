import {CExecuterController} from "./c-executer.controller";
import {verifySameIdPost, verifyToken, verifySameIdChallengeResult} from "../middleware/verify_token";
import {getFile, executeFileWithSave, saveFile, checkResulsts} from "../libs/code-executer";

const express = require('express')
export const cRouter = express.Router();

cRouter.post("/", verifyToken, verifySameIdPost, async function(req, res) {
    await executeFileWithSave(req, res, new CExecuterController(), true, false);
});

cRouter.post("/challenge/", verifyToken, verifySameIdChallengeResult, async function(req, res) {
    await executeFileWithSave(req, res, new CExecuterController(), true, true);
});

cRouter.post("/executeNoSave", async function(req, res) {
    req.body.idPerson = 'tmp'
    await executeFileWithSave(req, res, new CExecuterController(), false, false);
});

cRouter.post("/challenge/checkResults", verifyToken, verifySameIdChallengeResult, async function(req, res) {
    await checkResulsts(req, res, new CExecuterController())
});




cRouter.post("/saveFile", verifyToken, async(req: any, res: any) => {
    try {
        const file = req.files.fileKey;
        const fullPath = `${process.env.FILES_REPO}/c/${req.body.commentId}/${req.body.idPerson}`;
        saveFile(fullPath, process.env.DEFAULT_C_FILE, file.data);
        res.status(200).end();
    }
    catch (err)
    {
        res.write(err);
        res.status(500).end()
    }
});

cRouter.post("/challenge/saveFile", verifyToken, verifySameIdChallengeResult, async(req: any, res: any) => {
    try {
        const file = req.files.fileKey;
        const fullPath = `${process.env.FILES_REPO}/challenge/c/${req.body.challengeId}/${req.body.idPerson}`;
        saveFile(fullPath, process.env.DEFAULT_C_FILE, file.data);
        res.status(200).end();
    }
    catch (err)
    {
        res.write(err);
        res.status(500).end()
    }
});



cRouter.get("/:post_uid/:user_uid", async function(req, res) {
    getFile(req, res, "c", "main.c")
});

cRouter.get("/challenge/:post_uid/:user_uid", async function(req, res) {
    getFile(req, res, "challenge/c", "main.c")
});
