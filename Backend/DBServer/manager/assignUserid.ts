import {v4 as uuidv4} from 'uuid';
import { isValidUserid } from '../middleware/validateUserid.js';

export function assignUserid(req: any, res: any){

    let userid = req.params?.userid;
    if(!userid || !isValidUserid(userid)){
        userid = uuidv4()
        const parts = userid.split('-')
        userid = "uid" + parts.join('')
    
        req.params['userid'] = userid
    }

    res.status(200).json({"userid": userid})
}
