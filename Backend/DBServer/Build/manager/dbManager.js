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
exports.deleteUser = exports.deleteUserPartitions = exports.update = exports.create = exports.getExpired = exports.getAll = exports.get = void 0;
const mysql = __importStar(require("mysql2/promise"));
const dotenv = __importStar(require("dotenv"));
const mySQLController_1 = require("../MySQL/mySQLController");
const postgresController_1 = require("../Postgres/postgresController");
dotenv.config();
// =========== dbUsersMaster ========================================================
// ============ Schema ==============================================================
// userid
// lastTimestamp
// dbsUsed (binary format:  00000001 = mysql, 00000010 = postgres, 00000100 = mongo)
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
//probably can be normal functions
function get(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const userid = req.params.userid;
        const connection = yield initConnection();
        //////////add error handling to all routes like this
        const [rows] = yield connection.execute('SELECT * FROM users WHERE userid = ?;', [userid]);
        yield connection.end();
        next();
    });
}
exports.get = get;
//probably can be normal functions
function getAll(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield initConnection();
        const [rows] = yield connection.execute('SELECT * FROM users;');
        // res.json(rows)
        yield connection.end();
        next();
    });
}
exports.getAll = getAll;
function getExpired() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield initConnection();
        //timestamp at one hour ago
        const expireTime = Math.floor(new Date().getTime() / 1000) - 3600;
        const [rows] = yield connection.execute('SELECT * FROM users WHERE lastTimeStamp < ?;', [expireTime]);
        yield connection.end();
        return rows;
    });
}
exports.getExpired = getExpired;
function create(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("creating", req.params.userid, Math.floor(new Date().getTime() / 1000));
        const userid = req.params.userid;
        let dbcode = getdbCode(req);
        if (!userid) {
            return res.status(401).send({
                message: `Request doesn't contain the proper information`
            });
        }
        const connection = yield initConnection();
        try {
            const [rows] = yield connection.execute('INSERT INTO users (userid, lastTimestamp, dbsUsed) VALUES (?, ?, ?)', [userid, Math.floor(new Date().getTime() / 1000), dbcode]);
            // res.json(rows)
        }
        catch (_a) {
            // res.sendStatus(400)
        }
        yield connection.end();
        next();
    });
}
exports.create = create;
///////update will normally be called, but if user doesn't exists this will call create/////
function update(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("updating", req.params.userid, Math.floor(new Date().getTime() / 1000));
        const userid = req.params.userid;
        let dbcode = getdbCode(req);
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
                // res.sendStatus(404)
                yield create(req, res, next);
                next();
                //idk if i need to call next here or return or what
            }
            //update the db code based with bitwise OR
            dbcode = dbcode | rows[0].dbsUsed;
            newDbString = ', dbsUsed = ?';
            entries.push(dbcode);
        }
        const [rows] = yield connection.execute(`UPDATE users SET lastTimeStamp = ? ${newDbString} WHERE userid = ?`, [...entries, userid]);
        yield connection.end();
        next();
    });
}
exports.update = update;
function deleteUserPartitions(userid, dbsUsed, serverid) {
    return __awaiter(this, void 0, void 0, function* () {
        if (dbsUsed & 1) {
            (0, mySQLController_1.deletePartition)(userid);
        }
        if (dbsUsed & 2) {
            (0, postgresController_1.deletePartition)(userid);
        }
        if (dbsUsed & 4) {
            //mongo
        }
    });
}
exports.deleteUserPartitions = deleteUserPartitions;
function deleteUser(userid) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!userid) {
            return;
        }
        const connection = yield initConnection();
        const [rows] = yield connection.execute(`DELETE FROM users WHERE userid = ?;`, [userid]);
        yield connection.end();
        return rows;
    });
}
exports.deleteUser = deleteUser;
function getdbCode(req) {
    let dbString = req.originalUrl.split('/')[2];
    let dbcode;
    switch (dbString) {
        case 'mysql':
            dbcode = 1; ////use enums???
            break;
        case 'postgres':
            dbcode = 2;
            break;
        case 'mongo':
            dbcode = 4;
            break;
        default:
            dbcode = 0;
    }
    return dbcode;
}
