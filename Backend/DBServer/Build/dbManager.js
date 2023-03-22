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
exports.deleteRecords = exports.update = exports.create = exports.getAll = exports.get = void 0;
const mysql = __importStar(require("mysql2/promise"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// dbUsersMaster
// userid
// lastTimestamp
// dbsUsed (binary format:  00000001 = mysql, 00000010 = postres, 00000100 = mongo)
// serverid : text
////////this should use a totally different database, only on the dbmaster server
function initConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            host: process.env.dbUsersMasterUrl,
            port: Number(process.env.mysqlPort),
            user: process.env.dbUsersMasterUser,
            password: process.env.dbUsersMasterPassword,
        };
        const connection = yield mysql.createConnection(options);
        const dbUsersMaster = "dbUsersMaster";
        const [rows] = yield connection.execute(`SHOW DATABASES LIKE '${dbUsersMaster}';`);
        if (!rows.toString()) { //this was the only way I could find to see if the query found a database
            //warning prepared statements DO NOT work here!!!!!!!!!!!!//////////////
            yield connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbUsersMaster}`);
            //warning prepared statements DO NOT work here!!!!!!!//////////////
            yield connection.query(`USE ${dbUsersMaster}`);
            yield connection.execute(`CREATE TABLE IF NOT EXISTS users ( userid VARCHAR(80) not null, lastTimestamp int, dbsUsed tinyint, serverid VARCHAR(32), primary key (userid) );`);
        }
        else {
            yield connection.query(`USE ${dbUsersMaster}`);
        }
        return connection;
    });
}
//functions
//get all
//get one by userid
//post new
//update
//delete
//get outdated
function get(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userid = req.params.userid;
        const connection = yield initConnection();
        const [rows] = yield connection.execute('SELECT * FROM users WHERE userid = ?;', [userid]);
        res.json(rows);
        yield connection.end();
    });
}
exports.get = get;
function getAll(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield initConnection();
        const [rows] = yield connection.execute('SELECT * FROM users;');
        res.json(rows);
        yield connection.end();
    });
}
exports.getAll = getAll;
function create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userid = req.params.userid;
        let dbcode = parseInt(req.query.dbcode);
        if (!userid) {
            return res.status(401).send({
                message: `Request doesn't contain the proper information`
            });
        }
        const connection = yield initConnection();
        try {
            const [rows] = yield connection.execute('INSERT INTO users (userid, lastTimestamp, dbsUsed) VALUES (?, ?, ?)', [userid, Math.floor(new Date().getTime() / 1000), dbcode]);
            res.json(rows);
        }
        catch (_a) {
            res.sendStatus(400);
        }
        yield connection.end();
    });
}
exports.create = create;
function update(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userid = req.params.userid;
        let dbcode = parseInt(req.query.dbcode);
        if (!userid) {
            return res.status(401).send({
                message: `Request doesn't contain the proper information`
            });
        }
        const connection = yield initConnection();
        let entries = [Math.floor(new Date().getTime() / 1000)];
        let newDbString = "";
        if (dbcode) {
            //get the user's current dbsUsed value
            const [rows] = yield connection.execute('SELECT dbsUsed FROM users WHERE userid = ?', [userid]);
            //if user doesn't exist
            if (!rows[0]) {
                res.sendStatus(404);
                return;
            }
            //update the db code based with bitwise OR
            dbcode = dbcode | rows[0].dbsUsed;
            newDbString = ', dbsUsed = ?';
            entries.push(dbcode);
        }
        const [rows] = yield connection.execute(`UPDATE users SET lastTimeStamp = ? ${newDbString} WHERE userid = ?`, [...entries, userid]);
        res.json(rows);
        yield connection.end();
    });
}
exports.update = update;
function deleteRecords(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userid = req.params.userid;
        if (!userid) {
            return res.status(401).send({
                message: `Request doesn't contain the proper information`
            });
        }
        const connection = yield initConnection();
        const [rows] = yield connection.execute('DELETE FROM users WHERE userid = ?', [userid]);
        res.json(rows);
        yield connection.end();
    });
}
exports.deleteRecords = deleteRecords;
//save each userid with current timestamp into a db or text file...(use redis or mysql or something)
//check if userid exists
//if not, create with current timestamp, and dbs
//if so, update with current timestamp
//this will be a seperate process on the dbmaster server(or a different server)
//every minute or so, go through everything and delete the expired dbs....
//each userid can have a db in mysql, mongo, or postgres, so it will have to delete from all valid dbs.
//the db can store which dbs were used.(this can literally be a binary. 01 for mysql, 02 for postgres, etc)
//then just call the deleteDB function on each of these dbs
// //delete process
// setInterval(() => {
//     //check db for expired users
//         //delete all their dbs
// }, 3600000)
