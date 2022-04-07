const bodyParser = require("body-parser");
import {buildRoutes} from "./api";
import {Express} from "express";
const express = require('express')

const fileUpload = require('express-fileupload');

const app: Express = express();


app.use(fileUpload());
app.use(bodyParser.json());
buildRoutes(app);

const port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log(`Listening on ${port}...`);
    console.log(new Date().toLocaleString().split(',')[0]);
});


