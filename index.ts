const bodyParser = require("body-parser");
import {buildRoutes} from "./api";
import {Express} from "express";
const express = require('express')

const fileUpload = require('express-fileupload');
const cors = require('cors');
const app: Express = express();

const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200, // For legacy browser support
    methods: "GET, PUT, POST, DELETE"
}
app.use(cors(corsOptions));
app.use(fileUpload());
app.use(bodyParser.json());
buildRoutes(app);

const port = process.env.PORT || 3001;
app.listen(port, function() {
    console.log(`Listening on ${port}...`);
    console.log(new Date().toLocaleString().split(',')[0]);
});


