import { Express } from "express";
import { pythonRouter } from "../python-executer/python-executer.route";


export function buildRoutes(app: Express) {
    app.get("/", async function(req, res) {
        res.send("OutOfMemoryError API");
    });

    app.use("/pythonExecuter", pythonRouter);

}
