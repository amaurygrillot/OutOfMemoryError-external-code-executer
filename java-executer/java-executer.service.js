"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaExecuterService = void 0;
var java_executer_repository_1 = require("./java-executer.repository");
var express = require('express');
var spawn = require('child_process').spawn;
var app = express();
var port = 3000;
var JavaExecuterService = /** @class */ (function () {
    function JavaExecuterService() {
        this.pythonExecuterRepository = new java_executer_repository_1.JavaExecuterRepository();
    }
    JavaExecuterService.prototype.getAllInstance = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, java_executer_repository_1.JavaExecuterRepository.getInstance()];
                    case 1:
                        _a.pythonExecuterRepository = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    JavaExecuterService.prototype.executeNoArgumentScript = function (fileData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.executeScript(fileData)];
            });
        });
    };
    JavaExecuterService.prototype.executeScript = function (fileData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (accept, reject) {
                            setTimeout(function () {
                                reject("timed out");
                            }, (15 * 1000));
                            var dataToSend = "";
                            var promiseMessage = "Unknown error";
                            // spawn new child process to call the javac script
                            var javac = spawn('javac', ['files/java/Main.java']);
                            // collect data from script
                            javac.stdout.on('data', function (data) {
                                console.log('Pipe data from javac script ...');
                                dataToSend += data.toString();
                            });
                            javac.stderr.on('data', function (data) {
                                console.log('There was an error : ' + data);
                                dataToSend += data.toString();
                            });
                            javac.on('error', function (data) {
                                console.log('There was an error : ' + data);
                                dataToSend += data.toString();
                            });
                            // in close event we are sure that stream from child process is closed
                            javac.on('close', function (data) {
                                if (data === 0) {
                                    var java = spawn('java', ['files/java/Main.java']);
                                    java.stdout.on('data', function (output) {
                                        console.log(String(output));
                                        dataToSend += String(output);
                                    });
                                    java.stderr.on('data', function (output) {
                                        console.log('There was an error : ' + String(output));
                                        dataToSend += String(output);
                                    });
                                    java.on('close', function (output) {
                                        console.log('stdout: ' + output);
                                        promiseMessage = dataToSend;
                                        // send data to browser
                                        promiseMessage += "\nProcess ended with error code : " + output;
                                        console.log("" + promiseMessage);
                                        accept(promiseMessage);
                                    });
                                }
                            });
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return JavaExecuterService;
}());
exports.JavaExecuterService = JavaExecuterService;
