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
exports.deletePartition = exports.deleteRecords = exports.update = exports.create = exports.get = void 0;
const mysql = __importStar(require("mysql2/promise"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
function initConnection(userid) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            host: process.env.mysqlUrl,
            port: Number(process.env.mysqlPort),
            user: process.env.mysqluser,
            password: process.env.mysqlPassword,
        };
        const connection = yield mysql.createConnection(options); /////////////This could fail if connection fails
        const [rows] = yield connection.execute(`SHOW DATABASES LIKE '${userid}';`);
        if (!rows.toString()) { //this was the only way I could find to see if the query found a database
            //warning prepared statements DO NOT work here!!!!!!!!!!!!//////////////
            yield connection.execute(`CREATE DATABASE IF NOT EXISTS ${userid}`);
            //warning prepared statements DO NOT work here!!!!!!!//////////////
            yield connection.query(`USE ${userid}`);
            yield connection.execute(`CREATE TABLE IF NOT EXISTS tbl ( id int not null auto_increment, firstName text, lastName text, username text, password text, primary key (id) );`);
        }
        else {
            yield connection.query(`USE ${userid}`);
        }
        return connection;
    });
}
function get(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userid = req.params.userid;
        const objectid = req.query.objectid;
        if (!userid) {
            return res.status(401).send({
                message: `Request doesn't contain the proper information`
            });
        }
        const connection = yield initConnection(userid);
        if (objectid) {
            const [rows] = yield connection.execute('SELECT * FROM tbl WHERE id = ?;', [objectid]);
            res.json(rows);
        }
        else {
            const [rows] = yield connection.execute('SELECT * FROM tbl ORDER BY id;');
            res.json(rows);
        }
        yield connection.end();
    });
}
exports.get = get;
function create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userid = req.params.userid;
        const dataObject = req.body;
        if (!userid || !dataObject) {
            return res.status(401).send({
                message: `Request doesn't contain the proper information`
            });
        }
        const connection = yield initConnection(userid);
        //Build the custom queryString, which can change if the schema changes
        let queryFields = [];
        let queryQuestionMarks = [];
        let queryValues = [];
        for (const [key, value] of Object.entries(dataObject)) {
            queryFields.push(key);
            queryQuestionMarks.push('?');
            queryValues.push(value);
        }
        queryFields = queryFields.join(', ');
        queryQuestionMarks = queryQuestionMarks.join(', ');
        const queryString = `INSERT INTO tbl (${queryFields}) VALUES (${queryQuestionMarks})`;
        // console.log(queryString, queryValues)
        const [rows] = yield connection.execute(queryString, queryValues);
        res.json(rows);
        yield connection.end();
    });
}
exports.create = create;
function update(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userid = req.params.userid;
        const objectid = req.query.objectid;
        const dataObject = req.body;
        if (!userid || !objectid || !dataObject) {
            return res.status(401).send({
                message: `Request doesn't contain the proper information`
            });
        }
        const connection = yield initConnection(userid);
        //change all strings to dynamically change with the schema...
        let setStrings = [];
        let queryValues = [];
        let num = 1;
        for (const [key, value] of Object.entries(dataObject)) {
            if (value) {
                setStrings.push(key + ' = ?');
                queryValues.push(value);
                num++;
            }
        }
        setStrings = setStrings.join(',');
        const queryString = `UPDATE tbl 
        SET ${setStrings}
        WHERE id = ?`;
        console.log(queryString, queryValues);
        const [rows] = yield connection.execute(queryString, [...queryValues, objectid]);
        res.json(rows);
        yield connection.end();
    });
}
exports.update = update;
function deleteRecords(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userid = req.params.userid;
        const objectid = req.query.objectid;
        if (!userid || !objectid) {
            return res.status(401).send({
                message: `Request doesn't contain the proper information`
            });
        }
        const connection = yield initConnection(userid);
        const [rows] = yield connection.execute('DELETE FROM tbl WHERE id = ?', [objectid]);
        res.json(rows);
        // return res.sendStatus(200)
        yield connection.end();
    });
}
exports.deleteRecords = deleteRecords;
function deletePartition(userid) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!userid) {
            console.log("No valid userid!  userid:", userid);
            return false;
        }
        const options = {
            host: process.env.mysqlUrl,
            port: Number(process.env.mysqlPort),
            user: process.env.mysqluser,
            password: process.env.mysqlPassword,
        };
        const connection = yield mysql.createConnection(options);
        const [rows] = yield connection.execute(`SHOW DATABASES LIKE '${userid}';`);
        if (rows.toString()) { //this was the only way I could find to see if the query found a database
            yield connection.query(`DROP DATABASE ${userid}`);
        }
        yield connection.end();
        return true;
    });
}
exports.deletePartition = deletePartition;
