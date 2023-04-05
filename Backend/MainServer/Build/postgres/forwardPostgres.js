"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresForwarder = void 0;
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
exports.postgresForwarder = express_1.default.Router();
exports.postgresForwarder.route('/:userid')
    .all(forward);
exports.postgresForwarder.route('/')
    .all(() => console.log("no userid!!!")); //////////////
const dbMasterUrl = "http://localhost:8081"; ////////
function forward(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let queryString = "";
        if (!req.query.isEmpty) {
            queryString = "?";
            for (let key in req.query) {
                queryString += key + "=" + req.query[key];
            }
        }
        const options = {
            url: dbMasterUrl + "/ts/postgres/" + req.params.userid + queryString,
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
}
