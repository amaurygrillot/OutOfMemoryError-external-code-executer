"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var api_1 = require("./api");
var express = require('express');
var fileUpload = require('express-fileupload');
var cors = require('cors');
var app = express();
var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
    methods: "GET, PUT, POST, DELETE"
};
app.use(cors(corsOptions));
app.use(fileUpload());
app.use(bodyParser.json());
(0, api_1.buildRoutes)(app);
var port = process.env.PORT || 3001;
app.listen(port, function () {
    console.log("Listening on ".concat(port, "..."));
    console.log(new Date().toISOString().slice(0, 19).replace('T', ' '));
    console.log(new Date().toLocaleString().split(',')[0]);
});
