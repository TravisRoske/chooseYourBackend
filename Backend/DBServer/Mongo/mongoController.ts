import * as mongoose from 'mongoose'
import * as dotenv from 'dotenv'
dotenv.config()

import { User, IUser } from './UserSchema.js'

const connectionUri = 'mongodb://127.0.0.1:27017/'
// use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if database has auth enabled


async function initConnection(userid : string) {
    await mongoose.connect(connectionUri + userid)
}

export async function get(req: any, res: any) {

    const userid : string = req.params.userid;
    const objectid : Number = parseInt(req.query.objectid);
    if(!userid){
        return res.status(401).send({
            message: `Request doesn't contain the proper information`
        });
    }
    await initConnection(userid)

    if(objectid){
        await User.find({id: objectid})
        .then((result) => {
            return res.status(200).send(result)
        })
        .catch((error) => {
            return res.status(400).send({
                message: `Error when finding ${objectid}`
            });
        })
        .finally(async () => {
            await mongoose.disconnect();
        })
    } else {
        await User.find()
        .then((result) => {
            return res.status(200).send(result);
        })
        .catch((error) => {
            return res.status(400).send({
                message: `Error`
            });
        })
        .finally(async () => {
            await mongoose.disconnect();
        })
    }
}


export async function create(req: any, res: any) {

    const userid : string = req.params.userid;
    if(!userid || !req.body ){
        return res.status(401).send({
            message: `Request doesn't contain the proper information`
        });
    }

    await initConnection(userid)

    const newUser = new User();
    newUser.firstname = req.body?.firstname;
    newUser.lastname = req.body?.lastname;
    newUser.username = req.body?.username;
    newUser.password = req.body?.password;
    
    const highestid = await User.find().sort({id:-1}).limit(1);
    if(highestid[0]?.id){
        newUser.id = highestid[0].id + 1;
    } else {
        newUser.id = 1;
    }

    newUser.save()
    .then((result) => {
        return res.status(200).send(result)
    })
    .catch((error) => {
        return res.status(400).send({
            message: "An error occured."
        })
    })
    .finally(async () => {
        await mongoose.disconnect();
    })
}


export async function update(req: any, res: any) {

    const userid : string = req.params.userid;
    const objectid : Number = parseInt(req.query.objectid);
    if(!userid || !objectid || !req.body ){
        return res.status(401).send({
            message: `Request doesn't contain the proper information`
        });
    }    

    const filter = { id: objectid };
    const update : IUser = {
        id : objectid,
        firstname : req.body?.firstname,
        lastname : req.body?.lastname,
        username : req.body?.username,
        password : req.body?.password
    }

    await initConnection(userid)

    await User.findOneAndUpdate(filter, update)
    .then((result) => {
        return res.status(200).send(result)
    })
    .catch((error) => {
        return res.status(400).send({
            message: "An error occured."
        })
    })
    .finally(async () => {
        await mongoose.disconnect();
    })
}


export async function deleteRecords(req: any, res: any) {

    const userid : string = req.params.userid;
    const objectid : Number = parseInt(req.query.objectid);
    if(!userid || !objectid){
        return res.status(401).send({
            message: `Request doesn't contain the proper information`
         });
    }

    await initConnection(userid)

    await User.deleteOne({ id : objectid })
    .then((result) => {
        return res.status(200).send(result);
    })
    .catch((error) => {
        return res.status(400).send({
            message: "An error occured."
        })
    })
    .finally(async () => {
        await mongoose.disconnect();
    })
}


export async function deletePartition(userid : string) : Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        if(!userid){
            console.log("No valid userid!  userid:", userid);
            reject(false);
        }
        await mongoose.disconnect();
        const conn = mongoose.createConnection(`mongodb://127.0.0.1:27017/${userid}`);
        await conn.dropDatabase();

        resolve(true);
    })
}