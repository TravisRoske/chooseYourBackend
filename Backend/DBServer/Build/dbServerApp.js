"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const assignUserid_js_1 = require("./manager/assignUserid.js");
// deletingProcess()
const cors = require('cors'); /////////
const app = (0, express_1.default)();
exports.app = app;
//I'll have to change this later because this just allows everything//////
app.use(cors());
app.use(express_1.default.json());
// app.use(requestLogger)
app.get('/assignid', assignUserid_js_1.assignUserid);
app.get('/assignid/:userid', assignUserid_js_1.assignUserid);
