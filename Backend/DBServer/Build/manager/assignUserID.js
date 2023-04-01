"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignUserid = void 0;
const uuid_1 = require("uuid");
const validateUserid_js_1 = require("../middleware/validateUserid.js");
function assignUserid(req, res) {
    var _a;
    let userid = (_a = req.params) === null || _a === void 0 ? void 0 : _a.userid;
    if (!userid || !(0, validateUserid_js_1.isValidUserid)(userid)) {
        userid = (0, uuid_1.v4)();
        const parts = userid.split('-');
        userid = "uid" + parts.join('');
        req.params['userid'] = userid;
        // create(req, res, next)////////////////
    }
    res.status(200).json({ "userid": userid });
}
exports.assignUserid = assignUserid;
