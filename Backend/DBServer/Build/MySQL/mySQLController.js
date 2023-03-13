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
const mysql = __importStar(require("mysql2"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const newTableString = 'CREATE TABLE IF NOT EXISTS tbl ( id int not null auto_increment, firstName text, lastName text, username text, password text, primary key (id) );';
///////////
function get(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userID = req.params.id;
        const objectID = req.query.objectID;
        const options = {
            host: process.env.mysqlUrl,
            port: Number(process.env.mysqlPort),
            user: process.env.mysqluser,
            password: process.env.mysqlPassword
        };
        const connection = mysql.createConnection(options);
        yield connection.connect((err) => {
            if (err)
                throw err;
            console.log("MySQL db connected");
        });
        //warning prepared statements DO NOT work here
        connection.query(`CREATE DATABASE IF NOT EXISTS ${userID}`, (error) => {
            if (error)
                console.log(error);
        });
        //warning prepared statements DO NOT work here
        connection.query(`USE ${userID}`, (error) => {
            if (error)
                console.log(error);
        });
        connection.query(newTableString, (error) => {
            if (error)
                console.log(error);
        });
        if (objectID) {
            connection.execute('SELECT * FROM tbl WHERE id = ?;', [objectID], (error, results, fields) => {
                // data = reformat(results)
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                    return;
                }
                res.json(results);
            });
        }
        else {
            connection.query('SELECT * FROM tbl;', (error, results, fields) => {
                // data = reformat(data)
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                    return;
                }
                res.json(results);
            });
        }
        yield connection.end((err) => {
            if (err)
                throw err;
            console.log("MySQL connection closed");
        });
    });
}
exports.get = get;
function create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userID = req.params.id;
        const dataObject = req.body; ///////
        const options = {
            host: process.env.mysqlUrl,
            port: Number(process.env.mysqlPort),
            user: process.env.mysqluser,
            password: process.env.mysqlPassword
        };
        const connection = mysql.createConnection(options);
        yield connection.connect((err) => {
            if (err)
                throw err;
            console.log("MySQL db connected");
        });
        //warning prepared statements DO NOT work here
        connection.query(`CREATE DATABASE IF NOT EXISTS ${userID}`, (error) => {
            if (error)
                console.log(error);
        });
        //warning prepared statements DO NOT work here
        connection.query(`USE ${userID}`, (error) => {
            if (error)
                console.log(error);
        });
        connection.query(newTableString, (error) => {
            if (error)
                console.log(error);
        });
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
        console.log(queryString, queryValues);
        connection.execute(queryString, queryValues, (error, results, fields) => {
            // data = reformat(results)
            if (error) {
                console.log(error);
                res.sendStatus(400);
                return;
            }
            res.json(results);
        });
        yield connection.end((err) => {
            if (err)
                throw err;
            console.log("MySQL connection closed");
        });
    });
}
exports.create = create;
function update(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userID = req.params.id;
        const objectID = req.query.objectID;
        const options = {
            host: process.env.mysqlUrl,
            port: Number(process.env.mysqlPort),
            user: process.env.mysqluser,
            password: process.env.mysqlPassword
        };
        const connection = mysql.createConnection(options);
        yield connection.connect((err) => {
            if (err)
                throw err;
            console.log("MySQL db connected");
        });
        //warning prepared statements DO NOT work here
        connection.query(`CREATE DATABASE IF NOT EXISTS ${userID}`, (error) => {
            if (error)
                console.log(error);
        });
        //warning prepared statements DO NOT work here
        connection.query(`USE ${userID}`, (error) => {
            if (error)
                console.log(error);
        });
        connection.query(newTableString, (error) => {
            if (error)
                console.log(error);
        });
        if (objectID) {
            connection.execute('SELECT * FROM tbl WHERE id = ?;', [objectID], (error, results, fields) => {
                // data = reformat(results)
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                    return;
                }
                res.json(results);
            });
        }
        else {
            connection.query('SELECT * FROM tbl;', (error, results, fields) => {
                // data = reformat(data)
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                    return;
                }
                res.json(results);
            });
        }
        yield connection.end((err) => {
            if (err)
                throw err;
            console.log("MySQL connection closed");
        });
    });
}
exports.update = update;
function deleteRecords(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userID = req.params.id;
        const objectID = req.query.objectID;
        const options = {
            host: process.env.mysqlUrl,
            port: Number(process.env.mysqlPort),
            user: process.env.mysqluser,
            password: process.env.mysqlPassword
        };
        const connection = mysql.createConnection(options);
        yield connection.connect((err) => {
            if (err)
                throw err;
            console.log("MySQL db connected");
        });
        //warning prepared statements DO NOT work here
        connection.query(`CREATE DATABASE IF NOT EXISTS ${userID}`, (error) => {
            if (error)
                console.log(error);
        });
        //warning prepared statements DO NOT work here
        connection.query(`USE ${userID}`, (error) => {
            if (error)
                console.log(error);
        });
        connection.query(newTableString, (error) => {
            if (error)
                console.log(error);
        });
        if (objectID) {
            connection.execute('SELECT * FROM tbl WHERE id = ?;', [objectID], (error, results, fields) => {
                // data = reformat(results)
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                    return;
                }
                res.json(results);
            });
        }
        else {
            connection.query('SELECT * FROM tbl;', (error, results, fields) => {
                // data = reformat(data)
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                    return;
                }
                res.json(results);
            });
        }
        yield connection.end((err) => {
            if (err)
                throw err;
            console.log("MySQL connection closed");
        });
    });
}
exports.deleteRecords = deleteRecords;
