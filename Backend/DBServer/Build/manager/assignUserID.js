"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignUserID = void 0;
const uuid_1 = require("uuid");
function assignUserID(req, res, next) {
    let userid;
    if (req.params.userid) {
        console.log("Found userid", req.headers.userid); ///////////
        userid = req.params.userid;
    }
    else {
        userid = (0, uuid_1.v4)();
        const parts = userid.split('-');
        userid = "uid" + parts.join('');
        req.params['userid'] = userid;
        // create(req, res, next)/////////
    }
    res.status(200).json({ "userid": userid });
}
exports.assignUserID = assignUserID;
