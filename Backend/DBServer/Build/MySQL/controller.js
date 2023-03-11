"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = void 0;
const mysql = __importStar(require("mysql2"));
function getAll(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userID = req.query.userID;
        console.log(userID);
        //check that userID has no numbers??
        const connection = mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'mypass',
            // database : `${userID}`
        });
        let data = []; //////////////
        //I probably need to put all this in a transaction!!!
        yield connection.connect((err) => {
            if (err)
                throw err;
            console.log("MySQL db connected");
        });
        connection.query(`CREATE DATABASE IF NOT EXISTS ${userID};`);
        connection.query(`USE ${userID};`);
        connection.query(`CREATE TABLE IF NOT EXISTS tbl ( id int not null, name text, primary key (id));`);
        connection.query('SELECT * FROM tbl;', (error, results, fields) => {
            console.log("res", results);
            data = results;
            //idk if this is right to be in here!!
            // data = reformat(data)
            console.log("data", data);
            res.json(data);
        });
        yield connection.end((err) => {
            if (err)
                throw err;
            console.log("MySQL connection closed");
        });
    });
}
exports.getAll = getAll;
