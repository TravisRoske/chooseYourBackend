"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbManagerRouter = void 0;
const express_1 = __importDefault(require("express"));
const dbManager_js_1 = require("./dbManager.js");
exports.dbManagerRouter = express_1.default.Router();
exports.dbManagerRouter.route('/')
    .get(dbManager_js_1.getAll);
exports.dbManagerRouter.route('/:userid')
    // .all(validateUserid)    //I would have to update everything to userid or to id
    .get(dbManager_js_1.get)
    .post(dbManager_js_1.create)
    .put(dbManager_js_1.update)
    .delete(dbManager_js_1.deleteRecords);
