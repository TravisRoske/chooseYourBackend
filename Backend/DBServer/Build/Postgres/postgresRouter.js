"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresRouter = void 0;
const express_1 = __importDefault(require("express"));
exports.postgresRouter = express_1.default.Router();
const postgresController_js_1 = require("./postgresController.js");
// REQUEST FORMAT -  ${url}/ts/mysql/${userID}?objectID=${objectID}
exports.postgresRouter.route('/:id')
    .get(postgresController_js_1.get)
    .post(postgresController_js_1.create)
    .put(postgresController_js_1.update)
    .delete(postgresController_js_1.deleteRecords);
// postgresRouter.route('/:search')
//     .get(search)
