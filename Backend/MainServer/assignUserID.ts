import {v4 as uuidv4} from 'uuid';

export function assignUserID(req: any, res: any, next: any){
    if(req.headers.userid){
        console.log("Found userid", req.headers.userid)
    } else {
        const userID = uuidv4()

        res.set( "userid", userID)
    }

    next()
}