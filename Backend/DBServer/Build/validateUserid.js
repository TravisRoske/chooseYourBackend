"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserid = void 0;
function validateUserid(req, res, next) {
    //check if there is a userId
    if (req.params.id && req.params.id.split(0, 3) == 'uid' && req.params.id != 'null' && req.params.id != 'undefined') {
        console.log("got the id!!!!", req.params.id);
    }
    else {
        res.status(401);
        res.json({});
        return;
        console.log("SHOTULD NOT BE HERE");
    }
    //also check for special characters/////////
    //check if userid exists in list of active dbs
    //(if it's new AND it exists, that's weird, maybe assign new userID)
    //if it exists, update it's timestamp to now, and get it's server id to route to....
    //if not, check available servers, and route(based on method I choose later)
    //..so for now just call next.
    next();
}
exports.validateUserid = validateUserid;
