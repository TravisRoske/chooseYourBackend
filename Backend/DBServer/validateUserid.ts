export function validateUserid(req: any, res: any, next: any){

    /////////
    console.log("body", req.body)
    console.log("headers", req.headers)
    console.log("params", req.params)
    console.log("query", req.query)

    if(!req.params.id || req.params.id.slice(0,3) != 'uid' || req.params.id == 'null' || req.params.id == 'undefined'){
        res.status(401)
        res.json({})
        return;
    }

    //also check for special characters/////////!!!!!!!!!!!!!
        //this would be how users can inject code or something


    //check if userid exists in list of active dbs
        //(if it's new AND it exists, that's weird, maybe assign new userID)
        //if it exists, update it's timestamp to now, and get it's server id to route to....
        //if not, check available servers, and route(based on method I choose later)
            //..so for now just call next.


    next()
}