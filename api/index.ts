import { Express } from "express";
import { pythonRouter } from "../python-executer/python-executer.route";
//import { nodeRouter} from "../node-executer/node-executer.route";
import {javaRouter} from "../java-executer/java-executer.route";

export function buildRoutes(app: Express) {
    app.get("/", async function(req, res) {
        res.send("OutOfMemoryError API");
    });

    app.use("/python", pythonRouter);

   // app.use("/node", nodeRouter);

    app.use("/java", javaRouter);

}
