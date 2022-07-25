import {JavaExecuterController} from "./java-executer.controller";
import { verifyToken } from "../middleware/verify_token";
import {getFile, postFile, saveFile} from "../libs/code-executer";
import {CExecuterController} from "../c-executer/c-executer.controller";

const express = require('express')
export const javaRouter = express.Router();

javaRouter.post("/", verifyToken, async function(req, res) {
    await postFile(req, res, 'java', process.env.DEFAULT_JAVA_FILE,  new JavaExecuterController());
});

javaRouter.post("/saveFile", async(req: any, res: any) => {
    const file = req.files.fileKey;
    const dirPath = `java/${req.body.commentId}/${req.body.idPerson}`;
    saveFile(dirPath, process.env.DEFAULT_JAVA_FILE, file.data);

});

javaRouter.get("/:post_uid/:user_uid", async function(req, res) {
    getFile(req, res, "java", "Main.java")
});
