"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mySQLRouter_js_1 = require("./MySQL/mySQLRouter.js");
const app = (0, express_1.default)();
app.use(express_1.default.json());
//this uses the mysql file as a middleware
app.use("/ts/mysql", mySQLRouter_js_1.mySQLRouter);
//app.use("/ts/postgres", postgresRouter)
//app.use("/ts/mongo", mongoRouter)
app.listen(8080, () => {
    console.log("App listening");
});
