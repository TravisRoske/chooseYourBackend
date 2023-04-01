"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidUserid = exports.validateUserid = void 0;
const assignUserid_1 = require("../manager/assignUserid");
function validateUserid(req, res, next) {
    const userid = req.params.userid;
    if (!isValidUserid(userid)) {
        req.params = {};
        (0, assignUserid_1.assignUserid)(req, res);
        return;
    }
    next();
}
exports.validateUserid = validateUserid;
function isValidUserid(userid) {
    if (!userid || userid == 'null' || userid == 'undefined') {
        return false;
    }
    if (userid.length <= 32 || userid.length >= 64) {
        return false;
    }
    for (var i = 0; i < userid.length; i++) {
        let ascii = userid.charCodeAt(i);
        // 0 - 9
        if (ascii >= 48 && ascii <= 57) {
            continue;
        }
        // A - Z
        if (ascii >= 65 && ascii <= 90) {
            continue;
        }
        // a - z
        if (ascii >= 97 && ascii <= 122) {
            continue;
        }
        return false;
    }
    if (userid.slice(0, 3) != 'uid') {
        return false;
    }
    return true;
}
exports.isValidUserid = isValidUserid;
