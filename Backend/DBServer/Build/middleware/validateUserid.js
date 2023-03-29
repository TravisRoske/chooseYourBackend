"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserid = void 0;
function validateUserid(req, res, next) {
    if (!req.params.userid || req.params.userid.slice(0, 3) != 'uid' || req.params.userid == 'null' || req.params.userid == 'undefined') {
        res.status(401);
        res.json({});
        //////create user id if it doesn't exist...or send back a new valid id
        return;
    }
    //also check for special characters/////////!!!!!!!!!!!!!
    //this would be how users can inject code or something
    //check if userid exists in list of active dbs
    //(if it's new AND it exists, that's weird, maybe assign new userid)
    //if it exists, update it's timestamp to now, and get it's server id to route to....
    //if not, check available servers, and route(based on method I choose later)
    //..so for now just call next.
    next();
}
exports.validateUserid = validateUserid;
