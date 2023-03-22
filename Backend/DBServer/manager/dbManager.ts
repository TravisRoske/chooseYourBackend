import * as mysql from 'mysql2/promise'
import * as dotenv from 'dotenv'
dotenv.config()

// dbUsersMaster
// userid
// lastTimestamp
// dbsUsed (binary format:  00000001 = mysql, 00000010 = postres, 00000100 = mongo)
// serverid : text


////////this should use a totally different database, only on the dbmaster server
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

//functions
    //get all
    //get one by userid
    //post new
    //update
    //delete
    //get outdated

export async function get(req: any, res: any, next : any) {

    const userid : string = req.params.userid
    
    const connection = await initConnection()

    const [ rows ] = await connection.execute('SELECT * FROM users WHERE userid = ?;', [userid])
    // res.json(rows)
    
    await connection.end()

    next()
}


export async function getAll(req: any, res: any, next : any) {
    
    const connection = await initConnection()

    const [ rows ] = await connection.execute('SELECT * FROM users;')
    // res.json(rows)

    await connection.end()

    next()
}

export async function create(req: any, res: any, next : any) {

    const userid : string = req.params.userid
    let dbcode : number = parseInt(req.query.dbcode)

    if(!userid){
        return res.status(401).send({
            message: `Request doesn't contain the proper information`
        });
    }

    const connection = await initConnection()

    try {
        const [ rows ] = await connection.execute('INSERT INTO users (userid, lastTimestamp, dbsUsed) VALUES (?, ?, ?)'
                    , [userid, Math.floor(new Date().getTime() / 1000), dbcode])
        // res.json(rows)
    } catch {
        // res.sendStatus(400)
    }

    await connection.end()

    next()
}


export async function update(req: any, res: any, next : any) {

    const userid : string = req.params.userid
    let dbcode : number = parseInt(req.query.dbcode)
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
            // res.sendStatus(404)
            next()
        }

        //update the db code based with bitwise OR
        dbcode = dbcode | rows[0].dbsUsed

        newDbString = ', dbsUsed = ?'
        entries.push(dbcode)
    }

    const [ rows ] = await connection.execute(`UPDATE users SET lastTimeStamp = ? ${newDbString} WHERE userid = ?`, 
                    [...entries, userid])

    // res.json(rows)

    await connection.end()

    next()
}


export async function deleteRecords(req: any, res: any, next : any) {

    const userid : string = req.params.userid
    if(!userid){
        return res.status(401).send({
            message: `Request doesn't contain the proper information`
         });
    }

    const connection = await initConnection()

    const [ rows ] = await connection.execute('DELETE FROM users WHERE userid = ?', [ userid ])

    // res.json(rows)

    await connection.end()

    next()
}








//save each userid with current timestamp into a db or text file...(use redis or mysql or something)
    //check if userid exists
        //if not, create with current timestamp, and dbs
            
        //if so, update with current timestamp


//this will be a seperate process on the dbmaster server(or a different server)
    //every minute or so, go through everything and delete the expired dbs....
    //each userid can have a db in mysql, mongo, or postgres, so it will have to delete from all valid dbs.
        //the db can store which dbs were used.(this can literally be a binary. 01 for mysql, 02 for postgres, etc)
        //then just call the deleteDB function on each of these dbs


// //delete process
// setInterval(() => {
//     //check db for expired users
//         //delete all their dbs
// }, 3600000)