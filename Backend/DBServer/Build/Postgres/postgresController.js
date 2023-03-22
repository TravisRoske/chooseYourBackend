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
const pg_1 = require("pg");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
//this function could also save a timestamp to know when to delete the db
function initConnection(userID) {
    return __awaiter(this, void 0, void 0, function* () {
        const withDatabase = {
            host: process.env.postgresUrl,
            port: Number(process.env.postgresPort),
            user: process.env.postgresuser,
            password: process.env.postgresPassword,
            database: userID
        };
        let client = new pg_1.Client(withDatabase);
        try {
            yield client.connect();
            //check if db exists first/////////!!
            //check if tbl exists
            yield client.query('SELECT * FROM tbl;');
        }
        catch (_a) {
            const noDatabase = {
                host: process.env.postgresUrl,
                port: Number(process.env.postgresPort),
                user: process.env.postgresuser,
                password: process.env.postgresPassword
            };
            client = new pg_1.Client(noDatabase);
            yield client.connect();
            //Prepared statements do not work here!!!//////////
            yield client.query(`CREATE DATABASE ${userID}`);
            yield client.end();
            client = new pg_1.Client(withDatabase);
            yield client.connect();
            yield client.query(`CREATE TABLE IF NOT EXISTS tbl ( id serial primary key, firstName text, lastName text, username text, password text );`);
        }
        return client;
    });
}
function get(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userID = req.params.userid;
        const objectID = req.query.objectID;
        if (!userID) {
            return res.status(401).send({
                message: `Request doesn't contain the proper information`
            });
        }
        const client = yield initConnection(userID);
        if (objectID) {
            const queryResponse = yield client.query({
                name: 'getAll',
                text: 'SELECT * FROM tbl WHERE id = $1;',
                values: [objectID]
            });
            res.json(queryResponse.rows);
        }
        else {
            const queryResponse = yield client.query('SELECT * FROM tbl ORDER BY id;');
            res.json(queryResponse.rows);
        }
        yield client.end();
    });
}
exports.get = get;
function create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userID = req.params.userid;
        const dataObject = req.body; ///////
        if (!userID || !dataObject) {
            return res.status(401).send({
                message: `Request doesn't contain the proper information`
            });
        }
        const client = yield initConnection(userID);
        //change all strings to dynamically change with the schema...
        let tempFields = '';
        let queryInserts = '';
        let queryValues = [];
        let num = 1;
        for (const [key, value] of Object.entries(dataObject)) {
            tempFields += key + ", ";
            queryInserts += `$${num}, `;
            queryValues.push(value);
            num++;
        }
        tempFields = tempFields.slice(0, -2);
        queryInserts = queryInserts.slice(0, -2);
        const queryString = `INSERT INTO tbl (${tempFields}) VALUES (${queryInserts})`;
        // console.log(queryString, queryValues)
        const queryResults = yield client.query({
            name: "create",
            text: queryString,
            values: queryValues
        });
        res.json(queryResults.rows);
        yield client.end();
    });
}
exports.create = create;
function update(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userID = req.params.userid;
        const objectID = req.query.objectID;
        const dataObject = req.body;
        if (!userID || !objectID || !dataObject) {
            return res.status(401).send({
                message: `Request doesn't contain the proper information`
            });
        }
        const client = yield initConnection(userID);
        //change all strings to dynamically change with the schema...
        let tempFields = '';
        let queryValues = [];
        let num = 1;
        for (const [key, value] of Object.entries(dataObject)) {
            if (value) {
                tempFields += key + ` = $${num}, `;
                queryValues.push(value);
                num++;
            }
        }
        tempFields = tempFields.slice(0, -2);
        const queryString = `UPDATE tbl 
        SET ${tempFields}
        WHERE id = $${num}`;
        queryValues.push(objectID);
        // console.log(queryString, queryValues)
        const queryResults = yield client.query({
            name: "create",
            text: queryString,
            values: queryValues
        });
        res.json(queryResults.rows);
        yield client.end();
    });
}
exports.update = update;
function deleteRecords(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userID = req.params.userid;
        const objectID = req.query.objectID;
        if (!userID || !objectID) {
            return res.status(401).send({
                message: `Request doesn't contain the proper information`
            });
        }
        const client = yield initConnection(userID);
        const result = yield client.query({
            name: "delete",
            text: 'DELETE FROM tbl WHERE id = $1',
            values: [objectID]
        });
        res.json(result.rows);
        // return res.sendStatus(200)
        yield client.end();
    });
}
exports.deleteRecords = deleteRecords;
function deletePartition(userid) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!userid) {
            console.log("No valid userid!  userid:", userid);
            return false;
        }
        const noDatabase = {
            host: process.env.postgresUrl,
            port: Number(process.env.postgresPort),
            user: process.env.postgresuser,
            password: process.env.postgresPassword
        };
        const client = new pg_1.Client(noDatabase);
        yield client.connect();
        //Prepared statements do not work here!!!//////////
        yield client.query(`DROP DATABASE ${userid}`);
        yield client.end();
        return true;
    });
}
exports.deletePartition = deletePartition;
