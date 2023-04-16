import * as mongoose from 'mongoose'
import * as dotenv from 'dotenv'
dotenv.config()

import { User, IUser } from './UserSchema.js'

const connectionUri = 'mongodb://127.0.0.1:27017/'  
// use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if database has auth enabled


/////////////the connection isn't closing!
async function initConnection(userid : string) {
    await mongoose.connect(connectionUri + userid)
}


export async function get(req: any, res: any) {

    const userid : string = req.params.userid;
    const objectid : string = req.query.objectid;
    if(!userid){
        return res.status(401).send({
            message: `Request doesn't contain the proper information`
        });
    }
    await initConnection(userid)

    if(objectid){
        await User.find({_id: objectid})
        .then((result) => {
            return res.status(200).send(result)
        })
        .catch((error) => {
            return res.status(400).send({
                message: `Error when finding ${objectid}`
            });
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
    }

    mongoose.disconnect();
}


export async function create(req: any, res: any) {

    const userid : string = req.params.userid;
    if(!userid || !req.body ){
        return res.status(401).send({
            message: `Request doesn't contain the proper information`
        });
    }

    const newUser = new User();
    newUser.firstname = req.body?.firstname;
    newUser.lastname = req.body?.lastname;
    newUser.username = req.body?.username;
    newUser.password = req.body?.password;

    await initConnection(userid)

    newUser.save()
    .then((result) => {
        return res.status(200).send(result)
    })
    .catch((error) => {
        return res.status(400).send({
            message: "An error occured."
        })
    })

    await mongoose.disconnect();
}


export async function update(req: any, res: any) {

    const userid : string = req.params.userid;
    const objectid : string = req.query.objectid;
    if(!userid || !objectid || !req.body ){
        return res.status(401).send({
            message: `Request doesn't contain the proper information`
        });
    }    
    
    console.log("updating", objectid)

    const filter = { _id: objectid };
    const update : IUser = {
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

    await mongoose.disconnect();
}


export async function deleteRecords(req: any, res: any) {
    const userid : string = req.params.userid
    const objectid : string = req.query.objectid
    if(!userid || !objectid){
        return res.status(401).send({
            message: `Request doesn't contain the proper information`
         });
    }

    await initConnection(userid)

    await User.deleteOne({ _id : objectid })
    .then((result) => {
        return res.status(200).send(result);
    })
    .catch((error) => {
        return res.status(400).send({
            message: "An error occured."
        })
    })

    await mongoose.disconnect();
}


export async function deletePartition(userid : string) : Promise<boolean> {
    if(!userid){
        console.log("No valid userid!  userid:", userid);
        return false;
    }

    return new Promise((resolve, reject) => {
        mongoose.connection.db.dropCollection(userid)
        .then((result) => {
            resolve(true);
        })
        .catch((error) => {
            reject(false);
        })
    })
    
    await mongoose.disconnect();
}