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
/////////////////
//sometimes it throws this error
// duplicate key value violates unique constraint "pg_database_datname_index"
//////////////
//this function could also save a timestamp to know when to delete the db
function initConnection(userid) {
    return __awaiter(this, void 0, void 0, function* () {
        const withDatabase = {
            host: process.env.postgresUrl,
            port: Number(process.env.postgresPort),
            user: process.env.postgresuser,
            password: process.env.postgresPassword,
            database: userid
        };
        let client = new pg_1.Client(withDatabase);
        //try to connect to db of userid
        try {
            yield client.connect();
            //this could error for other reasons......../////////////
        }
        catch (_a) {
            //if not exists, create new db
            console.log("no dang db");
            const noDatabase = {
                host: process.env.postgresUrl,
                port: Number(process.env.postgresPort),
                user: process.env.postgresuser,
                password: process.env.postgresPassword
            };
            client = new pg_1.Client(noDatabase);
            yield client.connect();
            //Prepared statements do not work here!!!//////////
            yield client.query(`CREATE DATABASE ${userid}`);
            //this STILL has to check if db exists first.....///////////because it can get here if the connection fails for another reason.
            yield client.end();
            //recursively call this function now that the db exists
            return initConnection(userid);
        }
        //now that the db is connected check if tbl exists or create tbl
        try {
            yield client.query('SELECT * FROM tbl LIMIT 1;');
        }
        catch (_b) {
            console.log("no dang tbl");
            client = new pg_1.Client(withDatabase);
            yield client.connect();
            yield client.query(`CREATE TABLE IF NOT EXISTS tbl ( id serial primary key, firstName text, lastName text, username text, password text );`);
        }
        return client;
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
        const client = yield initConnection(userid);
        if (objectid) {
            const queryResponse = yield client.query({
                name: 'getAll',
                text: 'SELECT * FROM tbl WHERE id = $1;',
                values: [objectid]
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
        const userid = req.params.userid;
        const dataObject = req.body;
        if (!userid || !dataObject) {
            return res.status(401).send({
                message: `Request doesn't contain the proper information`
            });
        }
        const client = yield initConnection(userid);
        //Build the custom queryString, which can change if the schema changes
        let queryFields = [];
        let queryInsertNumbers = [];
        let queryValues = [];
        let num = 1;
        for (const [key, value] of Object.entries(dataObject)) {
            queryFields.push(key);
            queryInsertNumbers.push(`$${num}`);
            queryValues.push(value);
            num++;
        }
        queryFields = queryFields.join(',');
        queryInsertNumbers = queryInsertNumbers.join(',');
        const queryString = `INSERT INTO tbl (${queryFields}) VALUES (${queryInsertNumbers})`;
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
        const userid = req.params.userid;
        const objectid = req.query.objectid;
        const dataObject = req.body;
        if (!userid || !objectid || !dataObject) {
            return res.status(401).send({
                message: `Request doesn't contain the proper information`
            });
        }
        const client = yield initConnection(userid);
        //change all strings to dynamically change with the schema...
        let setStrings = [];
        let queryValues = [];
        let num = 1;
        for (const [key, value] of Object.entries(dataObject)) {
            if (value) {
                setStrings.push(key + ` = $${num}`);
                queryValues.push(value);
                num++;
            }
        }
        setStrings = setStrings.join(',');
        const queryString = `UPDATE tbl 
        SET ${setStrings}
        WHERE id = $${num}`;
        queryValues.push(objectid);
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
        const userid = req.params.userid;
        const objectid = req.query.objectid;
        if (!userid || !objectid) {
            return res.status(401).send({
                message: `Request doesn't contain the proper information`
            });
        }
        const client = yield initConnection(userid);
        const result = yield client.query({
            name: "delete",
            text: 'DELETE FROM tbl WHERE id = $1',
            values: [objectid]
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
        try {
            yield client.query(`DROP DATABASE ${userid}`);
        }
        finally {
            yield client.end();
            return true;
        }
    });
}
exports.deletePartition = deletePartition;
