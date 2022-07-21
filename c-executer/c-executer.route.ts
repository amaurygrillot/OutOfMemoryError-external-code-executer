import {CExecuterController} from "./c-executer.controller";
import { verifyToken } from "../middleware/verify_token";
import {getFile, postFile} from "../libs/code-executer";

const express = require('express')
export const cRouter = express.Router();

cRouter.post("/", verifyToken, async function(req, res) {
    await postFile(req, res, 'c', '.c', new CExecuterController());
});

cRouter.post("/file", async(req: any, res: any) => {


});

cRouter.get("/", async function(req, res) {
    getFile(req, res, "c", "main.c")
});
