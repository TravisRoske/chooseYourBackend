"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const port = 8080; ///////
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.sendFile('chooseLanguage.html', { root: __dirname + "../../../../Public/2d" });
});
app.get("/ts", (req, res) => {
    res.sendFile('chooseDatabase.html', { root: __dirname + "../../../../Public/2d" });
});
app.get("/ts/mysql", (req, res) => {
    res.sendFile('mySQLConsole.html', { root: __dirname + "../../../../Public/2d" });
});
app.get("/ts/postgres", (req, res) => {
    res.sendFile('postgresConsole.html', { root: __dirname + "../../../../Public/2d" });
});
//endpoints
//ts/
//ts/mongo
//ts/postgres
//ts/mysql
app.listen(port, () => {
    console.log(`Main Server Listening on port ${port}`);
});
