import crypto from 'crypto'
import bcrypt from 'bcrypt'


async function forward(req: any, res: any, next: any) {
    if(req?.body?.password){
        req.body.password = encrypt(req.body.password, req.query.encryption)
    }
}


function encrypt( password : string, encryption : string ) : string {

    switch(encryption) {
        case "none" :
            return password;
            break;
        case "sha256" :

            break;
        case "bcrypt" :
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, function(err, hash) {
                    return hash;
                });
            })
            break;
    }
    return ""

}