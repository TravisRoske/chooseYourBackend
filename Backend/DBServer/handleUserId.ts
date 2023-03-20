import {v4 as uuidv4} from 'uuid';

export function handleUserID(req: any, res: any, next: any){
    //check if there is a userId
    if(req.params.id){
        console.log(req.params.id)
    }
        //if not, assign a random one....

    //check if userID is valid(starting with numbers will crash the db)
    console.log(uuidv4())


    //check if userid exists in list of active dbs
        //(if it's new AND it exists, that's weird, maybe assign new userID)
        //if it exists, update it's timestamp to now, and get it's server id to route to....
        //if not, check available servers, and route(based on method I choose later)
            //..so for now just call next.


    next()
}