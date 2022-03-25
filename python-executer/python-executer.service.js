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
exports.PythonExecuterService = void 0;
var python_executer_repository_1 = require("./python-executer.repository");
var express = require('express');
var spawn = require('child_process').spawn;
var app = express();
var port = 3000;
var PythonExecuterService = /** @class */ (function () {
    function PythonExecuterService() {
        this.pythonExecuterRepository = new python_executer_repository_1.PythonExecuterRepository();
    }
    PythonExecuterService.prototype.getAllInstance = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, python_executer_repository_1.PythonExecuterRepository.getInstance()];
                    case 1:
                        _a.pythonExecuterRepository = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PythonExecuterService.prototype.executeNoArgumentScript = function (filename) {
        return __awaiter(this, void 0, void 0, function () {
            var args;
            return __generator(this, function (_a) {
                args = [filename];
                return [2 /*return*/, this.executeScript(args)];
            });
        });
    };
    PythonExecuterService.prototype.executeScriptWithArguments = function (filename, args) {
        return __awaiter(this, void 0, void 0, function () {
            var scriptArgs, _i, args_1, arg;
            return __generator(this, function (_a) {
                scriptArgs = [filename];
                for (_i = 0, args_1 = args; _i < args_1.length; _i++) {
                    arg = args_1[_i];
                    scriptArgs.push(arg);
                }
                return [2 /*return*/, this.executeScript(scriptArgs)];
            });
        });
    };
    PythonExecuterService.prototype.executeScript = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (accept, reject) {
                            setTimeout(function () {
                                reject("timed out");
                            }, (15 * 1000));
                            var dataToSend;
                            var promiseMessage = "Unknown error";
                            // spawn new child process to call the python script
                            var python = spawn('py', args);
                            // collect data from script
                            python.stdout.on('data', function (data) {
                                console.log('Pipe data from python script ...');
                                dataToSend = data.toString();
                            });
                            // in close event we are sure that stream from child process is closed
                            python.on('close', function (code) {
                                console.log("child process close all stdio with code ".concat(code));
                                promiseMessage = dataToSend;
                                // send data to browser
                                promiseMessage += "\nProcess ended with error code : " + code;
                                accept(promiseMessage);
                            });
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return PythonExecuterService;
}());
exports.PythonExecuterService = PythonExecuterService;