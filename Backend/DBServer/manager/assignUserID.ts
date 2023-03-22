import {v4 as uuidv4} from 'uuid';
import { create } from './dbManager.js'

export function assignUserID(req: any, res: any, next: any){
    let userid;
    if(req.params.userid){
        console.log("Found userid", req.headers.userid)///////////
        userid = req.params.userid
    } else {
        userid = uuidv4()
        const parts = userid.split('-')
        userid = "uid" + parts.join('')
    
        req.params['userid'] = userid

        create(req, res , next)/////////
    }

    res.status(200).json({"userid": userid})
}