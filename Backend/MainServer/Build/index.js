"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const cors = require('cors'); //////////////
//add helmet///////
//add a rate limiter/////
const forwardPostgres_js_1 = require("./postgres/forwardPostgres.js");
const port = 8080; //////////
const dbMasterUrl = "http://localhost:8081"; ////////
const app = (0, express_1.default)();
//I'll have to change this later because this just allows everything//////
app.use(cors());
app.use(express_1.default.json());
//app.get("/assignid" .....)
app.get("/assignid/:userid", (req, res) => {
    const options = {
        url: dbMasterUrl + '/assignid/' + req.params.userid,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }
    };
    console.log(options);
    (0, axios_1.default)(options)
        .then(axiosResponse => {
        res.status(axiosResponse.status);
        res.json(axiosResponse.data);
    })
        .catch((err) => {
        res.sendStatus(500);
    });
});
///////////make simple forward functions
app.all("/ts/mysql/query/:userid", (req, res) => {
    let queryString = "";
    if (req.query.isEmpty) {
        queryString = "?";
        for (let key in req.query) {
            queryString += key + "=" + req.query[key];
        }
    }
    const options = {
        url: dbMasterUrl + "/ts/mysql/" + req.params.userid + queryString,
        method: req.method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: JSON.stringify(req.body)
    };
    (0, axios_1.default)(options)
        .then(axiosResponse => {
        res.status(axiosResponse.status);
        res.json(axiosResponse.data);
    })
        .catch((err) => {
        res.sendStatus(500);
    });
});
app.use("/ts/postgres/query", forwardPostgres_js_1.postgresForwarder);
const publicDirectoryPath = path_1.default.join(__dirname, '../../../Public/2d');
app.use(express_1.default.static(publicDirectoryPath));
app.listen(port, () => {
    console.log(`Main Server Listening on port ${port}`);
});
