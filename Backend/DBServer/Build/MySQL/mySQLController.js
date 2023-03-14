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
exports.deleteRecords = exports.update = exports.create = exports.get = void 0;
const mysql = __importStar(require("mysql2/promise"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
//this function could also save a timestamp to know when to delete the db
function initConnection(userID) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            host: process.env.mysqlUrl,
            port: Number(process.env.mysqlPort),
            user: process.env.mysqluser,
            password: process.env.mysqlPassword,
        };
        const connection = yield mysql.createConnection(options);
        let res = false;
        const [rows] = yield connection.execute(`SHOW DATABASES LIKE '${userID}';`);
        if (!rows.toString()) { //this was the only way I could find to see if the query found a database
            //warning prepared statements DO NOT work here!!!!!!!!!!!!//////////////
            yield connection.execute(`CREATE DATABASE IF NOT EXISTS ${userID}`);
            //warning prepared statements DO NOT work here!!!!!!!//////////////
            yield connection.query(`USE ${userID}`);
            yield connection.execute(`CREATE TABLE IF NOT EXISTS tbl ( id int not null auto_increment, firstName text, lastName text, username text, password text, primary key (id) );`);
        }
        else {
            yield connection.query(`USE ${userID}`);
        }
        return connection;
    });
}
function get(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userID = req.params.id;
        const objectID = req.query.objectID;
        if (!userID) {
            return res.status(401).send({
                message: `Request doesn't contain the proper information`
            });
        }
        const connection = yield initConnection(userID);
        if (objectID) {
            const [rows] = yield connection.execute('SELECT * FROM tbl WHERE id = ?;', [objectID]);
            res.json(rows);
        }
        else {
            const [rows] = yield connection.execute('SELECT * FROM tbl;');
            res.json(rows);
        }
        yield connection.end();
    });
}
exports.get = get;
function create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userID = req.params.id;
        const dataObject = req.body; ///////
        if (!userID || !dataObject) {
            return res.status(401).send({
                message: `Request doesn't contain the proper information`
            });
        }
        const connection = yield initConnection(userID);
        //change all strings to dynamically change with the schema...
        let queryFields = '';
        let queryInserts = '';
        let queryValues = [];
        for (const [key, value] of Object.entries(dataObject)) {
            queryFields += key + ", ";
            queryInserts += "?, ";
            queryValues.push(value);
        }
        queryFields = queryFields.slice(0, -2);
        queryInserts = queryInserts.slice(0, -2);
        const queryString = `INSERT INTO tbl (${queryFields}) VALUES (${queryInserts})`;
        const [rows] = yield connection.execute(queryString, queryValues);
        res.json(rows);
        yield connection.end();
    });
}
exports.create = create;
function update(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userID = req.params.id;
        const objectID = req.query.objectID;
        const dataObject = req.body;
        if (!userID || !objectID || !dataObject) {
            return res.status(401).send({
                message: `Request doesn't contain the proper information`
            });
        }
        const connection = yield initConnection(userID);
        //change all strings to dynamically change with the schema...
        let queryFields = '';
        let queryValues = [];
        for (const [key, value] of Object.entries(dataObject)) {
            if (value) {
                queryFields += key + " = ?, ";
                queryValues.push(value);
            }
        }
        queryFields = queryFields.slice(0, -2);
        const queryString = `UPDATE tbl 
        SET ${queryFields}
        WHERE id = ?`;
        const [rows] = yield connection.execute(queryString, [...queryValues, objectID]);
        res.json(rows);
        yield connection.end();
    });
}
exports.update = update;
function deleteRecords(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userID = req.params.id;
        const objectID = req.query.objectID;
        if (!userID || !objectID) {
            return res.status(401).send({
                message: `Request doesn't contain the proper information`
            });
        }
        const connection = yield initConnection(userID);
        const [rows] = yield connection.execute('DELETE FROM tbl WHERE id = ?', [objectID]);
        res.json(rows);
        // return res.sendStatus(200)
        yield connection.end();
    });
}
exports.deleteRecords = deleteRecords;
