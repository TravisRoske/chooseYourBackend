"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignUserID = void 0;
const uuid_1 = require("uuid");
function assignUserID(req, res) {
    let userid;
    if (req.headers.userid) {
        console.log("Found userid", req.headers.userid);
        userid = req.headers.userid;
    }
    else {
        userid = (0, uuid_1.v4)();
        const parts = userid.split('-');
        userid = "uid" + parts.join('');
    }
    res.status(200).json({ "userid": userid });
}
exports.assignUserID = assignUserID;
