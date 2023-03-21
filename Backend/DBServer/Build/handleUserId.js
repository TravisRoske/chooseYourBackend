"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUserID = void 0;
const uuid_1 = require("uuid");
function handleUserID(req, res, next) {
    //check if there is a userId
    if (req.params.id) {
        console.log(req.params.id);
    }
    //if not, assign a random one....
    //check if userID is valid(all only numbers will crash the db)
    console.log((0, uuid_1.v4)());
    //check if userid exists in list of active dbs
    //(if it's new AND it exists, that's weird, maybe assign new userID)
    //if it exists, update it's timestamp to now, and get it's server id to route to....
    //if not, check available servers, and route(based on method I choose later)
    //..so for now just call next.
    next();
}
exports.handleUserID = handleUserID;
