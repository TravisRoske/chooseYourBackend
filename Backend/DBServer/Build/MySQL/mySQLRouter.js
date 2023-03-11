"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mySQLRouter = void 0;
const express_1 = __importDefault(require("express"));
exports.mySQLRouter = express_1.default.Router();
const mySQLController_js_1 = require("./mySQLController.js");
// REQUEST FORMAT -  ${url}/ts/mysql/${userID}?objectID=${objectID}
exports.mySQLRouter.route('/:id')
    .get(mySQLController_js_1.getAll)
    .post()
    .put()
    .delete();
exports.mySQLRouter.route('/:search')
    .get();
