import * as mysql from 'mysql2/promise'
import * as dotenv from 'dotenv'
dotenv.config()


// import ObjectSchema from './ObjectSchema.js'
interface ObjectSchema {
    firstName ?: string,
    lastName ?: string,
    userName: string,
    password : string,
}


//this function could also save a timestamp to know when to delete the db
async function initConnection(userID : string) {
    const options = {
        host     :  process.env.mysqlUrl,
        port     :  Number(process.env.mysqlPort),
        user     :  process.env.mysqluser,
        password :  process.env.mysqlPassword,
    }
    const connection = await mysql.createConnection(options);

    let res : any = false

    const [ rows ] = await connection.execute(`SHOW DATABASES LIKE '${userID}';`)

    console.log("rows", rows, typeof(rows), rows.toString())

    if(!rows.toString()) { //this was the only way I could find to see if the query found a database

        //warning prepared statements DO NOT work here???
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${userID}`)

        await connection.query(`USE ${userID}`)

        await connection.execute(
            `CREATE TABLE IF NOT EXISTS tbl 
            ( id int not null auto_increment, 
                firstName text, lastName text, 
                username text, password text, 
                primary key (id) );'
            )`
        )
    } else {
        await connection.query(`USE ${userID}`)
    }
 
    return connection;
}


export async function get(req: any, res: any) {

    const userID : string = req.params.id
    const objectID : string = req.query.objectID
    if(!userID){
        return res.status(401).send({
            message: `Request doesn't contain the proper information`
        });
    }
    const connection = await initConnection(userID)

    if(objectID){
        const [ rows ] = await connection.execute('SELECT * FROM tbl WHERE id = ?;', [objectID])
        res.json(rows)
    } else {
        const [ rows ] = await connection.execute('SELECT * FROM tbl;')
        res.json(rows)
    }

    await connection.end()
}


export async function create(req: any, res: any) {

    const userID : string = req.params.id
    const dataObject : ObjectSchema = req.body;///////
    if(!userID || !dataObject ){
        return res.status(401).send({
            message: `Request doesn't contain the proper information`
        });
    }

    const connection = await initConnection(userID)


    //change all strings to dynamically change with the schema...
    let queryFields = ''
    let queryInserts = ''
    let queryValues = []
    for(const [key, value] of Object.entries(dataObject)) {
        queryFields += key + ", "
        queryInserts += "?, "
        queryValues.push( value )
    }
    queryFields = queryFields.slice(0, -2)
    queryInserts = queryInserts.slice(0, -2)
    const queryString = `INSERT INTO tbl (${queryFields}) VALUES (${queryInserts})`

    const [ rows ] = await connection.execute(queryString, queryValues)
    res.json(rows)

    await connection.end()
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

    const connection = await initConnection(userID)
   
    //change all strings to dynamically change with the schema...
    let queryFields = ''
    let queryValues = []
    for(const [key, value] of Object.entries(dataObject)) {
        if(value){
            queryFields += key + " = ?, "
            queryValues.push( value )
        }
    }
    queryFields = queryFields.slice(0, -2)
    const queryString = `UPDATE tbl 
        SET ${queryFields}
        WHERE id = ?`

    const [ rows ] = await connection.execute(queryString, [...queryValues, objectID])

    res.json(rows)

    await connection.end()
}


export async function deleteRecords(req: any, res: any) {

    const userID : string = req.params.id
    const objectID : string = req.query.objectID
    if(!userID || !objectID){
        return res.status(401).send({
            message: `Request doesn't contain the proper information`
         });
    }

    const connection = await initConnection(userID)

    await connection.execute('DELETE FROM tbl WHERE id = ?', [ objectID ])

    await connection.end()
}