import {JavaExecuterController} from "./java-executer.controller";
import { verifyToken } from "../middleware/verify_token";
import {getFile, postFile} from "../libs/code-executer";
import {CExecuterController} from "../c-executer/c-executer.controller";

const express = require('express')
export const javaRouter = express.Router();

javaRouter.post("/", verifyToken, async function(req, res) {
    await postFile(req, res, 'java', process.env.DEFAULT_JAVA_FILE,  new JavaExecuterController());
});

javaRouter.post("/file", async(req: any, res: any) => {


});

javaRouter.get("/", async function(req, res) {
    getFile(req, res, "java", "Main.java")
});
