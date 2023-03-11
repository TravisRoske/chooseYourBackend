"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mySQLRouter = void 0;
const express_1 = __importDefault(require("express"));
exports.mySQLRouter = express_1.default.Router();
const controller_js_1 = require("./controller.js");
exports.mySQLRouter.route('/')
    .get(controller_js_1.getAll);
//     .post(verifyRoles(ROLES_LIST.admin, ROLES_LIST.editor),  customerController.createNewCustomer)
//     .put(verifyRoles(ROLES_LIST.admin, ROLES_LIST.editor),  customerController.updateCustomer)
//     .delete(verifyRoles(ROLES_LIST.admin),  customerController.deleteCustomer)
// Router.route('/:id')
//     .get(getAll)
