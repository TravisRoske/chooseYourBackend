import { Client } from 'pg'
import * as dotenv from 'dotenv'
dotenv.config()

import ObjectSchema from './ObjectSchema.js'

//this function could also save a timestamp to know when to delete the db
async function initConnection(userID : string) {
    //idk what info I need
    const client = new Client({
        host: process.env.postgresUrl,
        port: Number(process.env.postgresPort),
        user: process.env.postgresuser,
        password: process.env.postgresPassword,
    })

    await client.connect()

    // const [ rows ] = await client.execute(`SHOW DATABASES LIKE '${userID}';`)
    const res = await client.query({
        name: "show",
        text: `SHOW DATABASES LIKE $1;`,
        values: [userID]
    })

    if(!res.rows.toString()) { //this was the only way I could find to see if the query found a database

        // await client.execute(`CREATE DATABASE IF NOT EXISTS ${userID}`)
        await client.query({
            name: "createDatabase",
            text: `CREATE DATABASE IF NOT EXISTS $1`,
            values: [userID]
        })

        // await client.query(`USE ${userID}`)
        await client.query({
            name: "use",
            text: `USE $1`,
            values: [userID]
        })

        // await client.execute(
        //     `CREATE TABLE IF NOT EXISTS tbl ( id int not null auto_increment, firstName text, lastName text, username text, password text, primary key (id) );`
        // )
        await client.query(`CREATE TABLE IF NOT EXISTS tbl ( id int not null auto_increment, firstName text, lastName text, username text, password text, primary key (id) );`)
    } else {
        // await client.query(`USE ${userID}`)
        await client.query({
            name: "use",
            text: `USE $1`,
            values: [userID]
        })
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
        // const [ rows ] = await client.execute('SELECT * FROM tbl WHERE id = ?;', [objectID])
        const queryResponse = await client.query({
            name: 'getAll',
            text: 'SELECT * FROM tbl WHERE id = $1;',
            values: [objectID]
        })
        res.json(queryResponse.rows)
    } else {
        const queryResponse = await client.query('SELECT * FROM tbl;')
        res.json(queryResponse.rows)
    }

    await client.end()
}


// export async function create(req: any, res: any) {

//     const userID : string = req.params.id
//     const dataObject : ObjectSchema = req.body;///////

//     if(!userID || !dataObject ){
//         return res.status(401).send({
//             message: `Request doesn't contain the proper information`
//         });
//     }

//     const client = await initConnection(userID)


//     //change all strings to dynamically change with the schema...
//     let queryFields = ''
//     let queryInserts = ''
//     let queryValues = []
//     for(const [key, value] of Object.entries(dataObject)) {
//         queryFields += key + ", "
//         queryInserts += "?, "
//         queryValues.push( value )
//     }
//     queryFields = queryFields.slice(0, -2)
//     queryInserts = queryInserts.slice(0, -2)
//     const queryString = `INSERT INTO tbl (${queryFields}) VALUES (${queryInserts})`

//     const [ rows ] = await client.execute(queryString, queryValues)
//     res.json(rows)

//     await client.end()
// }


// export async function update(req: any, res: any) {

//     const userID : string = req.params.id
//     const objectID : string = req.query.objectID
//     const dataObject : ObjectSchema = req.body;
//     if(!userID || !objectID || !dataObject){
//         return res.status(401).send({
//             message: `Request doesn't contain the proper information`
//          });
//     }

//     const client = await initConnection(userID)
   
//     //change all strings to dynamically change with the schema...
//     let queryFields = ''
//     let queryValues = []
//     for(const [key, value] of Object.entries(dataObject)) {
//         if(value){
//             queryFields += key + " = ?, "
//             queryValues.push( value )
//         }
//     }
//     queryFields = queryFields.slice(0, -2)
//     const queryString = `UPDATE tbl 
//         SET ${queryFields}
//         WHERE id = ?`

//     const [ rows ] = await client.execute(queryString, [...queryValues, objectID])

//     res.json(rows)

//     await client.end()
// }


// export async function deleteRecords(req: any, res: any) {

//     const userID : string = req.params.id
//     const objectID : string = req.query.objectID
//     if(!userID || !objectID){
//         return res.status(401).send({
//             message: `Request doesn't contain the proper information`
//          });
//     }

//     const client = await initConnection(userID)

//     const [ rows ] = await client.execute('DELETE FROM tbl WHERE id = ?', [ objectID ])

//     res.json(rows)
//     // return res.sendStatus(200)

//     await client.end()
// }