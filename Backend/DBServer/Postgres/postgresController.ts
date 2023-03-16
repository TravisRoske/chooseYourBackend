import { Client } from 'pg'
import * as dotenv from 'dotenv'
dotenv.config()

import ObjectSchema from './ObjectSchema.js'

//this function could also save a timestamp to know when to delete the db
async function initConnection(userID : string) {

    const withDatabase = {
        host: process.env.postgresUrl,
        port: Number(process.env.postgresPort),
        user: process.env.postgresuser,
        password: process.env.postgresPassword,
        database: userID
    }
    let client = new Client(withDatabase)

    try {
        await client.connect()
        //check if tbl exists
        await client.query('SELECT * FROM tbl;')
    } catch {
        const noDatabase = {
            host: process.env.postgresUrl,
            port: Number(process.env.postgresPort),
            user: process.env.postgresuser,
            password: process.env.postgresPassword
        }
        client = new Client(noDatabase)
        await client.connect()
        
        //Prepared statements do not work here!!!//////////
        await client.query(`CREATE DATABASE ${userID}`)

        await client.end()

        client = new Client(withDatabase)

        await client.connect()

        await client.query(`CREATE TABLE IF NOT EXISTS tbl ( id serial primary key, firstName text, lastName text, username text, password text );`)
    }
 
    return client;
}


export async function get(req: any, res: any) {

    const userID : string = req.params.id
    const objectID : string = req.query.objectID
    if(!userID){
        return res.status(401).send({
            message: `Request doesn't contain the proper information`
        });
    }
    const client = await initConnection(userID)

    if(objectID){
        const queryResponse = await client.query({
            name: 'getAll',
            text: 'SELECT * FROM tbl WHERE id = $1;',
            values: [objectID]
        })
        res.json(queryResponse.rows)
    } else {
        const queryResponse = await client.query('SELECT * FROM tbl ORDER BY id;')
        res.json(queryResponse.rows)
    }

    await client.end()
}


export async function create(req: any, res: any) {

    const userID : string = req.params.id
    const dataObject : ObjectSchema = req.body;///////

    if(!userID || !dataObject ){
        return res.status(401).send({
            message: `Request doesn't contain the proper information`
        });
    }

    const client = await initConnection(userID)

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

    const userID : string = req.params.id
    const objectID : string = req.query.objectID
    const dataObject : ObjectSchema = req.body;
    if(!userID || !objectID || !dataObject){
        return res.status(401).send({
            message: `Request doesn't contain the proper information`
         });
    }

    const client = await initConnection(userID)
   
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
    queryValues.push(objectID)

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

    const userID : string = req.params.id
    const objectID : string = req.query.objectID
    if(!userID || !objectID){
        return res.status(401).send({
            message: `Request doesn't contain the proper information`
         });
    }

    const client = await initConnection(userID)

    const result = await client.query({
        name: "delete",
        text: 'DELETE FROM tbl WHERE id = $1',
        values: [ objectID ]
    })

    res.json(result.rows)
    // return res.sendStatus(200)

    await client.end()
}