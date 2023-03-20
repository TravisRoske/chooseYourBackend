"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignUserID = void 0;
const uuid_1 = require("uuid");
function assignUserID(req, res, next) {
    if (req.headers.userid) {
        console.log("Found userid", req.headers.userid);
    }
    else {
        const userID = (0, uuid_1.v4)();
        res.set("userID", userID);
    }
    next();
}
exports.assignUserID = assignUserID;
