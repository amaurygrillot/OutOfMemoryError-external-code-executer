import {JavaExecuterController} from "./java-executer.controller";
import {verifySameIdPost, verifyToken} from "../middleware/verify_token";
import {getFile, executeFileWithSave, saveFile} from "../libs/code-executer";

const express = require('express')
export const javaRouter = express.Router();

javaRouter.post("/", verifyToken, verifySameIdPost, async function(req, res) {
    await executeFileWithSave(req, res, 'java', process.env.DEFAULT_JAVA_FILE,  new JavaExecuterController(), true);
});

javaRouter.post("/executeNoSave", verifyToken, verifySameIdPost, async function(req, res) {
    await executeFileWithSave(req, res, 'java', process.env.DEFAULT_JAVA_FILE,  new JavaExecuterController(), false);
});

javaRouter.post("/saveFile", verifyToken, async(req: any, res: any) => {
    try {
        const file = req.files.fileKey;
        const dirPath = `${process.env.FILES_REPO}/java/${req.body.commentId}/${req.body.idPerson}`;
        saveFile(dirPath, process.env.DEFAULT_JAVA_FILE, file.data);
        res.status(200).end();
    }
    catch (err)
    {
        res.write(err);
        res.status(500).end()
    }

});

javaRouter.get("/:post_uid/:user_uid", async function(req, res) {
    getFile(req, res, "java", "Main.java")
});
