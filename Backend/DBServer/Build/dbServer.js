"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const assignUserID_js_1 = require("./manager/assignUserID.js");
const mySQLRouter_js_1 = require("./MySQL/mySQLRouter.js");
const postgresRouter_js_1 = require("./Postgres/postgresRouter.js");
const dbManagerRouter_js_1 = require("./manager/dbManagerRouter.js");
const cors = require('cors');
const app = (0, express_1.default)();
//I'll have to change this later because this just allows everything//////
app.use(cors());
app.use(express_1.default.json());
// app.use(requestLogger)
app.get('/assignid', assignUserID_js_1.assignUserID); //this should create new user in dbmaster
//each request should update the user in dbmster, by sending put with the current db used
app.use('/ts/mysql', mySQLRouter_js_1.mySQLRouter);
app.use('/ts/postgres', postgresRouter_js_1.postgresRouter);
//app.use('/ts/mongo', mongoRouter)
app.use('/dbManager', dbManagerRouter_js_1.dbManagerRouter);
app.listen(8081, () => {
    console.log("Database Server listening on port 8081"); ////////
});
