

function handleUserID(req: any, res: any, next: any){
    //check if there is a userId...maybe this should be after each db choice
    if(req.params){
        console.log(req.params)
    }
        //if not, assign a random one....

    //check if userid exists in list of active dbs
        //(if it's new AND it exists, that's weird, maybe assign new userID)
        //if it exists, update it's timestamp to now, and get it's server id to route to....
        //if not, check available servers, and route(based on method I choose later)
            //..so for now just call next.


    next()
}