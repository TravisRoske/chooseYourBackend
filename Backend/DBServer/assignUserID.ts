import {v4 as uuidv4} from 'uuid';

export function assignUserID(req: any, res: any){
    let userid;
    if(req.headers.userid){
        console.log("Found userid", req.headers.userid)
        userid = req.headers.userid
    } else {
        userid = uuidv4()
        const parts = userid.split('-')
        userid = "u" + parts.join('')
    }

    res.status(200).json({"userid": userid})
}