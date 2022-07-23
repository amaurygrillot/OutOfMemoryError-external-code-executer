import {PythonExecuterController} from "./python-executer.controller";
import { verifyToken } from "../middleware/verify_token";
import {getFile, postFile} from "../libs/code-executer";
import {CExecuterController} from "../c-executer/c-executer.controller";

const express = require('express')
export const pythonRouter = express.Router();

pythonRouter.post("/", verifyToken, async function(req, res) {
    postFile(req, res, 'python', process.env.DEFAULT_PYTHON_FILE, new PythonExecuterController());
});

pythonRouter.post("/file", async(req: any, res: any) => {


});

pythonRouter.get("/:post_uid/:user_uid", async function(req, res) {
    getFile(req, res, "python", "main.py")
});
