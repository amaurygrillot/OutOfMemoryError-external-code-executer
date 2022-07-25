import {CExecuterController} from "./c-executer.controller";
import { verifyToken } from "../middleware/verify_token";
import {getFile, postFile, saveFile} from "../libs/code-executer";

const express = require('express')
export const cRouter = express.Router();

cRouter.post("/", verifyToken, async function(req, res) {
    await postFile(req, res, 'c', process.env.DEFAULT_C_FILE, new CExecuterController());
});

cRouter.post("/saveFile", async(req: any, res: any) => {
    const file = req.files.fileKey;
    const dirPath = `c/${req.body.commentId}/${req.body.idPerson}`;
    saveFile(dirPath, process.env.DEFAULT_C_FILE, file.data);
});

cRouter.get("/:post_uid/:user_uid", async function(req, res) {
    getFile(req, res, "c", "main.c")
});
