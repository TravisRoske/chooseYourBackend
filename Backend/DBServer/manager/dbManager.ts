import * as mysql from 'mysql2/promise'
import * as dotenv from 'dotenv'
import { deletePartition as mysqlDeletePartition } from '../MySQL/mySQLController';
import { deletePartition as postgresDeletePartition } from '../Postgres/postgresController';
import { deletePartition as mongoDeletePartition } from '../Mongo/mongoController';

dotenv.config()

// =========== dbUsersMaster ========================================================
// ============ Schema ==============================================================
// userid
// lastTimestamp
// dbsUsed (binary format:  00000001 = mysql, 00000010 = postgres, 00000100 = mongo)
// serverid : text

async function initConnection() {
    const options = {
        host     :  process.env.dbUsersMasterUrl,
        port     :  Number(process.env.mysqlPort),
        user     :  process.env.dbUsersMasterUser,
        password :  process.env.dbUsersMasterPassword,
    }
    const connection = await mysql.createConnection(options);

    const dbUsersMaster = "dbUsersMaster"

    const [ rows ] = await connection.execute(`SHOW DATABASES LIKE '${dbUsersMaster}';`)

    if(!rows.toString()) { //this was the only way I could find to see if the query found a database

        //warning prepared statements DO NOT work here!!!!!!!!!!!!//////////////
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbUsersMaster}`)

        //warning prepared statements DO NOT work here!!!!!!!//////////////
        await connection.query(`USE ${dbUsersMaster}`)

        await connection.execute(
            `CREATE TABLE IF NOT EXISTS users ( userid VARCHAR(80) not null, lastTimestamp int, dbsUsed tinyint, serverid VARCHAR(32), primary key (userid) );`
        )
    } else {
        await connection.query(`USE ${dbUsersMaster}`)
    }
 
    return connection;
}


export async function get(userid : String) {
    
    const connection = await initConnection()

    try {
        let [ rows ] = await connection.execute('SELECT * FROM users WHERE userid = ?;', [userid])
        await connection.end()
        return rows;
    } catch {
        await connection.end()
        return []
    }
}


export async function getAll(req: any, res: any, next : any) {

    const connection = await initConnection()

    try {
        let [ rows ] = await connection.execute('SELECT * FROM users;')
        await connection.end()
        return rows;
    } catch {
        await connection.end()
        return []
    }
}

export async function getExpired(){
    const connection = await initConnection()

    //timestamp at one hour ago
    const expireTime = Math.floor(new Date().getTime() / 1000) - 3600

    const [ rows ] = await connection.execute('SELECT * FROM users WHERE lastTimeStamp < ?;', [expireTime])

    await connection.end()

    return rows;
}

export async function create(req: any, res: any, next : any) {

    console.log("creating", req.params.userid, Math.floor(new Date().getTime() / 1000))

    const userid : string = req.params.userid
    let dbcode : number = getdbCode(req)

    if(!userid){
        return res.status(401).send({
            message: `Request doesn't contain the proper information`
        });
    }

    const connection = await initConnection()

    try {
        const [ rows ] = await connection.execute('INSERT INTO users (userid, lastTimestamp, dbsUsed) VALUES (?, ?, ?)'
                    , [userid, Math.floor(new Date().getTime() / 1000), dbcode])
        res.sendStatus(200)
    } catch {
        res.sendStatus(400)
    }


    await connection.end()


    next()
}

//update will usually be called, but if user doesn't exist this calls create
export async function update(req: any, res: any, next : any) {

    console.log("updating", req.params.userid, Math.floor(new Date().getTime() / 1000))

    const userid : string = req.params.userid
    let dbcode : number = getdbCode(req)

    if(!userid){
        return res.status(401).send({
            message: `Request doesn't contain the proper information`
         });
    }

    const connection = await initConnection()

    let entries : any = [ Math.floor(new Date().getTime() / 1000) ]
    let newDbString = ""
    if(dbcode){ 
        //get the user's current dbsUsed value
        const [ rows ] : any = await connection.execute('SELECT dbsUsed FROM users WHERE userid = ?', [userid])

        //if user doesn't exist
        if(!rows[0]) {
            await create(req, res, next)
            return
            ////////idk if i need to call next here
        }

        //update the db code based with bitwise OR
        dbcode = dbcode | rows[0].dbsUsed

        newDbString = ', dbsUsed = ?'
        entries.push(dbcode)
    }

    const [ rows ] = await connection.execute(`UPDATE users SET lastTimeStamp = ? ${newDbString} WHERE userid = ?`, 
                    [...entries, userid])


    await connection.end()

    next()
}


export async function deleteUserPartitions (userid: string, dbsUsed : number, serverid : string) {
    if(dbsUsed & 1) {
        mysqlDeletePartition(userid)
    }
    if(dbsUsed & 2) {
        postgresDeletePartition(userid)
    }
    if(dbsUsed & 4) {
        mongoDeletePartition(userid)
    }
}


export async function deleteUser(userid : string) {
    if(!userid){
        return;
    }
    const connection = await initConnection()

    const [ rows ] = await connection.execute(`DELETE FROM users WHERE userid = ?;`, [ userid ])

    await connection.end()

    return rows
}



function getdbCode(req : any) {
    //gets the database string from url, e.g. hostname/ts/mongo/uid...
    const dbString : String = req.originalUrl.split('/')[2]

    let dbcode : number;
    switch(dbString){
        case 'mysql' :
            dbcode = 1;
            break;
        case 'postgres' :
            dbcode = 2;
            break;
        case 'mongo' :
            dbcode = 4;
            break;
        default :
            dbcode = 0;
    }

    return dbcode
}