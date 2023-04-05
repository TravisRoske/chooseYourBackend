"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const assignUserid_js_1 = require("./manager/assignUserid.js");
const mySQLRouter_js_1 = require("./MySQL/mySQLRouter.js");
const postgresRouter_js_1 = require("./Postgres/postgresRouter.js");
const dbManager_js_1 = require("./manager/dbManager.js");
const deletingProcess_js_1 = require("./manager/deletingProcess.js");
const validateUserid_js_1 = require("./middleware/validateUserid.js");
const cors = require('cors'); /////////
(0, deletingProcess_js_1.deletingProcess)();
const app = (0, express_1.default)();
exports.app = app;
//I'll have to change this later because this just allows everything//////
app.use(cors());
app.use(express_1.default.json());
// app.use(requestLogger)
app.get('/assignid', assignUserid_js_1.assignUserid);
app.get('/assignid/:userid', assignUserid_js_1.assignUserid);
app.use('*/:userid', validateUserid_js_1.validateUserid);
//update the data in user database
app.use('*/:userid', dbManager_js_1.update);
app.use('/ts/mysql', mySQLRouter_js_1.mySQLRouter);
app.use('/ts/postgres', postgresRouter_js_1.postgresRouter);
