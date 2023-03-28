"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mySQLRouter = void 0;
const express_1 = __importDefault(require("express"));
const validateUserid_js_1 = require("../middleware/validateUserid.js");
const mySQLController_js_1 = require("./mySQLController.js");
exports.mySQLRouter = express_1.default.Router();
// REQUEST FORMAT -  ${url}/ts/mysql/${userid}?objectid=${objectid}
exports.mySQLRouter.route('/:userid')
    .all(validateUserid_js_1.validateUserid)
    .get(mySQLController_js_1.get)
    .post(mySQLController_js_1.create)
    .put(mySQLController_js_1.update)
    .delete(mySQLController_js_1.deleteRecords);
// mySQLRouter.route('/:search')
//     .get(search)
