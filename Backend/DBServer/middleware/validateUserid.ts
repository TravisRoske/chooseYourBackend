import { assignUserid } from "../manager/assignUserid";

export function validateUserid(req: any, res: any, next: any){

    const userid = req.params.userid
    if(!isValidUserid(userid)){
        req.params = {}
        assignUserid(req, res)
    
        return;
    }

    next()
}

export function isValidUserid(userid : string) : boolean {
    if(!userid || userid == 'null' || userid == 'undefined'){
        return false;
    }
    if(userid.length <= 32 || userid.length >= 64) {
        return false;
    }

    for (var i = 0; i < userid.length; i++) {
        let ascii = userid.charCodeAt(i)
        // 0 - 9
        if(ascii >= 48 && ascii <= 57){
            continue;
        }
        // A - Z
        if(ascii >= 65 && ascii <= 90){
            continue;
        }
        // a - z
        if(ascii >= 97 && ascii <= 122){
            continue;
        }
        
        return false;
    }
    if(userid.slice(0,3) != 'uid'){
        return false;
    }

    return true;
}
