"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbServerApp_js_1 = __importDefault(require("./dbServerApp.js"));
dbServerApp_js_1.default.listen(8081, () => {
    console.log("Database Server listening on port 8081"); ////////
});
