import * as mysql from 'mysql2/promise'
import * as dotenv from 'dotenv'
dotenv.config()

import ObjectSchema from './ObjectSchema.js'


async function initConnection(userid : string) {
    const options = {
        host     :  process.env.mysqlUrl,
        port     :  Number(process.env.mysqlPort),
        user     :  process.env.mysqluser,
        password :  process.env.mysqlPassword,
    }
    const connection = await mysql.createConnection(options);/////////////This could fail if connection fails

    const [ rows ] = await connection.execute(`SHOW DATABASES LIKE '${userid}';`)

    if(!rows.toString()) { //this was the only way I could find to see if the query found a database

        //warning prepared statements DO NOT work here!!!!!!!!!!!!//////////////
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${userid}`)

        //warning prepared statements DO NOT work here!!!!!!!//////////////
        await connection.query(`USE ${userid}`)

        await connection.execute(
            `CREATE TABLE IF NOT EXISTS tbl ( id int not null auto_increment, firstName text, lastName text, username text, password text, primary key (id) );`
        )
    } else {
        await connection.query(`USE ${userid}`)
    }
 
    return connection;
}


export async function get(req: any, res: any) {

    const userid : string = req.params.userid;
    const objectid : string = req.query.objectid;
    if(!userid){
        return res.status(401).send({
            message: `Request doesn't contain the proper information`
        });
    }
    const connection = await initConnection(userid)

    if(objectid){
        const [ rows ] = await connection.execute('SELECT * FROM tbl WHERE id = ?;', [objectid])
        res.json(rows)
    } else {
        const [ rows ] = await connection.execute('SELECT * FROM tbl ORDER BY id;')
        res.json(rows)
    }

    await connection.end()
}


export async function create(req: any, res: any) {

    const userid : string = req.params.userid;
    const dataObject : ObjectSchema = req.body;

    if(!userid || !dataObject ){
        return res.status(401).send({
            message: `Request doesn't contain the proper information`
        });
    }

    const connection = await initConnection(userid)

    //Build the custom queryString, which can change if the schema changes
    let queryFields : any = []
    let queryQuestionMarks : any = []
    let queryValues = []
    for(const [key, value] of Object.entries(dataObject)) {
        queryFields.push(key)
        queryQuestionMarks.push('?')
        queryValues.push( value )
    }
    queryFields = queryFields.join(', ')
    queryQuestionMarks = queryQuestionMarks.join(', ')
    const queryString = `INSERT INTO tbl (${queryFields}) VALUES (${queryQuestionMarks})`

    // console.log(queryString, queryValues)

    const [ rows ] = await connection.execute(queryString, queryValues)
    res.json(rows)

    await connection.end()
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

    const connection = await initConnection(userid)
   

    //change all strings to dynamically change with the schema...
    let setStrings : any = []
    let queryValues = []
    let num = 1;
    for(const [key, value] of Object.entries(dataObject)) {
        if(value){
            setStrings.push(key + ' = ?')
            queryValues.push( value )
            num++
        }
    }
    setStrings = setStrings.join(',')
    const queryString = `UPDATE tbl 
        SET ${setStrings}
        WHERE id = ?`

    console.log(queryString, queryValues)

    const [ rows ] = await connection.execute(queryString, [...queryValues, objectid])

    res.json(rows)

    await connection.end()
}


export async function deleteRecords(req: any, res: any) {

    const userid : string = req.params.userid
    const objectid : string = req.query.objectid
    if(!userid || !objectid){
        return res.status(401).send({
            message: `Request doesn't contain the proper information`
         });
    }

    const connection = await initConnection(userid)

    const [ rows ] = await connection.execute('DELETE FROM tbl WHERE id = ?', [ objectid ])

    res.json(rows)
    // return res.sendStatus(200)

    await connection.end()
}



export async function deletePartition(userid : string) : Promise<boolean> {
    
    if(!userid){
        console.log("No valid userid!  userid:", userid)
        return false;
    }

    const options = {
        host     :  process.env.mysqlUrl,
        port     :  Number(process.env.mysqlPort),
        user     :  process.env.mysqlUser,
        password :  process.env.mysqlPassword,
    }
    const connection = await mysql.createConnection(options);

    const [ rows ] = await connection.execute(`SHOW DATABASES LIKE '${userid}';`)

    if(rows.toString()) { //this was the only way I could find to see if the query found a database
        await connection.query(`DROP DATABASE ${userid}`)
    }

    await connection.end()

    return true
}