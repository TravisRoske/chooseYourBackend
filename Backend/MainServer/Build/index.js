"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors = require('cors'); //////////////
const port = 8080; //////////
const dbMasterUrl = "http://localhost:8081"; ////////
const app = (0, express_1.default)();
//I'll have to change this later because this just allows everything//////
app.use(cors());
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
app.all("/ts/mysql/query/:id", (req, res) => {
    let options = {
        method: req.method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    };
    if (req.method != "GET") {
        options.body = JSON.stringify(req.body);
    }
    let queryString = "";
    if (req.query) { ///this is true every time////
        queryString = "?";
        for (let key in req.query) {
            queryString += key + "=" + req.query[key];
        }
    }
    console.log(dbMasterUrl + "/ts/mysql/" + req.params.id + queryString);
    fetch(dbMasterUrl + "/ts/mysql/" + req.params.id + queryString, options)
        .then((response) => {
        return response.json();
    })
        .then((result) => {
        res.send(result);
    })
        .catch((err) => {
        res.send(err);
    });
});
app.get("/ts/postgres", (req, res) => {
    res.sendFile('postgresConsole.html', { root: __dirname + "../../../../Public/2d" });
});
app.all("/ts/postgres/query/:id", (req, res) => {
    let options = {
        method: req.method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    };
    if (req.method != "GET") {
        options.body = JSON.stringify(req.body);
    }
    let queryString = "";
    if (req.query) { ///this is true every time////
        queryString = "?";
        for (let key in req.query) {
            queryString += key + "=" + req.query[key];
        }
    }
    console.log(dbMasterUrl + "/ts/postgres/" + req.params.id + queryString);
    fetch(dbMasterUrl + "/ts/postgres/" + req.params.id + queryString, options)
        .then((response) => {
        return response.json();
    })
        .then((result) => {
        res.send(result);
    })
        .catch((err) => {
        res.send(err);
    });
});
app.listen(port, () => {
    console.log(`Main Server Listening on port ${port}`);
});
