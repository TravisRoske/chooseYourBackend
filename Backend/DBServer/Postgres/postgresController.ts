import { Client } from 'pg'
import * as dotenv from 'dotenv'
dotenv.config()

import ObjectSchema from './ObjectSchema.js'


//this function could also save a timestamp to know when to delete the db
async function initConnection(userid : string) : Promise<Client> {

    const withDatabase = {
        host: process.env.postgresUrl,
        port: Number(process.env.postgresPort),
        user: process.env.postgresuser,
        password: process.env.postgresPassword,
        database: userid
    }
    let client = new Client(withDatabase)

    //try to connect to db of userid
    try {
        await client.connect()
        //this could error for other reasons....
    } catch {
        //if not exists, create new db
        console.log("no dang db")
        const noDatabase = {
            host: process.env.postgresUrl,
            port: Number(process.env.postgresPort),
            user: process.env.postgresuser,
            password: process.env.postgresPassword
        }
        client = new Client(noDatabase)
        await client.connect()
        
        //Prepared statements do not work here!!!//////////
        await client.query(`CREATE DATABASE ${userid}`)
        //this STILL has to check if db exists first.....///////////because it can get here if the connection fails for another reason.

        await client.end()

        //recursively call this function now that the db exists
        return initConnection(userid)
    }

    //now that the db is connected check if tbl exists or create tbl
    try {
        await client.query('SELECT * FROM tbl LIMIT 1;')
    } catch {
        console.log("no dang tbl")

        client = new Client(withDatabase)

        await client.connect()

        await client.query(`CREATE TABLE IF NOT EXISTS tbl ( id serial primary key, firstName text, lastName text, username text, password text );`)
    }

 
    return client;
}


export async function get(req: any, res: any) {

    const userid : string = req.params.userid
    const objectid : string = req.query.objectid
    if(!userid){
        return res.status(401).send({
            message: `Request doesn't contain the proper information`
        });
    }
    const client = await initConnection(userid)

    if(objectid){
        const queryResponse = await client.query({
            name: 'getAll',
            text: 'SELECT * FROM tbl WHERE id = $1;',
            values: [objectid]
        })
        res.json(queryResponse.rows)
    } else {
        const queryResponse = await client.query('SELECT * FROM tbl ORDER BY id;')
        res.json(queryResponse.rows)
    }

    await client.end()
}


export async function create(req: any, res: any) {

    const userid : string = req.params.userid
    const dataObject : ObjectSchema = req.body;///////

    if(!userid || !dataObject ){
        return res.status(401).send({
            message: `Request doesn't contain the proper information`
        });
    }

    const client = await initConnection(userid)

    //change all strings to dynamically change with the schema...
    let tempFields = ''
    let queryInserts = ''
    let queryValues = []
    let num = 1
    for(const [key, value] of Object.entries(dataObject)) {
        tempFields += key + ", "
        queryInserts += `$${num}, `
        queryValues.push( value )
        num++
    }
    tempFields = tempFields.slice(0, -2)
    queryInserts = queryInserts.slice(0, -2)
    const queryString = `INSERT INTO tbl (${tempFields}) VALUES (${queryInserts})`

    // console.log(queryString, queryValues)

    const queryResults = await client.query({
        name: "create",
        text: queryString,
        values: queryValues
    })
    res.json(queryResults.rows)

    await client.end()
}


export async function update(req: any, res: any) {

    const userid : string = req.params.userid
    const objectid : string = req.query.objectid
    const dataObject : ObjectSchema = req.body;
    if(!userid || !objectid || !dataObject){
        return res.status(401).send({
            message: `Request doesn't contain the proper information`
         });
    }

    const client = await initConnection(userid)
   
    //change all strings to dynamically change with the schema...
    let tempFields = ''
    let queryValues = []
    let num = 1;
    for(const [key, value] of Object.entries(dataObject)) {
        if(value){
            tempFields += key + ` = $${num}, `
            queryValues.push( value )
            num++
        }
    }
    tempFields = tempFields.slice(0, -2)
    const queryString = `UPDATE tbl 
        SET ${tempFields}
        WHERE id = $${num}`
    queryValues.push(objectid)

    // console.log(queryString, queryValues)

    const queryResults = await client.query({
        name: "create",
        text: queryString,
        values: queryValues
    })
    res.json(queryResults.rows)

    await client.end()
}


export async function deleteRecords(req: any, res: any) {

    const userid : string = req.params.userid
    const objectid : string = req.query.objectid
    if(!userid || !objectid){
        return res.status(401).send({
            message: `Request doesn't contain the proper information`
         });
    }

    const client = await initConnection(userid)

    const result = await client.query({
        name: "delete",
        text: 'DELETE FROM tbl WHERE id = $1',
        values: [ objectid ]
    })

    res.json(result.rows)
    // return res.sendStatus(200)

    await client.end()
}




export async function deletePartition(userid : string) : Promise<boolean> {
    
    if(!userid){
        console.log("No valid userid!  userid:", userid)
        return false;
    }

    const noDatabase = {
        host: process.env.postgresUrl,
        port: Number(process.env.postgresPort),
        user: process.env.postgresuser,
        password: process.env.postgresPassword
    }
    const client = new Client(noDatabase)
    await client.connect()
    
    //Prepared statements do not work here!!!//////////
    await client.query(`DROP DATABASE ${userid}`)

    await client.end()

    return true
}