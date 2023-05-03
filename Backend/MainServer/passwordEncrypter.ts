import { createHash } from 'node:crypto'
import bcrypt from 'bcrypt'


export async function passwordEncrypter(req: any, res: any, next: any) {
    if(req?.body?.password){
        req.body.password = await encrypt(req.body.password, req.query.encryption)
    }
    next()
}


async function encrypt( password : string, encryption : string ) {

    switch(encryption) {
        case "none" :
            return password;
            break;
        case "sha256" :
            return createHash('sha256').update(password).digest('hex');
            break;
        case "bcrypt" :
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            return hash;
            break;
        default :
            return password;
    }
}