import * as mysql from 'mysql2'
import * as dotenv from 'dotenv'
dotenv.config()


// import ObjectSchema from './ObjectSchema.js'
interface ObjectSchema {
    firstName ?: string,
    lastName ?: string,
    userName: string,
    password : string,
}


const newTableString = 'CREATE TABLE IF NOT EXISTS tbl ( id int not null auto_increment, firstName text, lastName text, username text, password text, primary key (id) );'
///////////


export async function get(req: any, res: any) { ///////////any should maybe change

    const userID : number = req.params.id
    const objectID : string = req.query.objectID

    const options = {
        host     :  process.env.mysqlUrl,
        port     :  Number(process.env.mysqlPort),
        user     :  process.env.mysqluser,
        password :  process.env.mysqlPassword
    }
    const connection = mysql.createConnection(options);


    await connection.connect((err) => {
        if(err) throw err;
        console.log("MySQL db connected")
    });

    //warning prepared statements DO NOT work here
    connection.query(`CREATE DATABASE IF NOT EXISTS ${userID}`, (error) => {
        if(error) console.log(error)
    })

    //warning prepared statements DO NOT work here
    connection.query(`USE ${userID}`, (error) => {
        if(error) console.log(error)
    })

    connection.query(newTableString, (error) => {
        if(error) console.log(error)
    })

    if(objectID){
        connection.execute('SELECT * FROM tbl WHERE id = ?;', [objectID], (error, results, fields) => {
            // data = reformat(results)
            if(error) {
                console.log(error)
                res.sendStatus(400)
                return
            }
            res.json(results)
        })
    } else {
        connection.query('SELECT * FROM tbl;', (error, results, fields) => {
            // data = reformat(data)
            if(error) {
                console.log(error)
                res.sendStatus(400)
                return
            }
            res.json(results)
        })
    }

    await connection.end((err) => {
        if(err) throw err;
        console.log("MySQL connection closed")
    });
}


export async function create(req: any, res: any) { ///////////any should maybe change

    const userID : number = req.params.id
    const dataObject : ObjectSchema = req.body;///////

    const options = {
        host     :  process.env.mysqlUrl,
        port     :  Number(process.env.mysqlPort),
        user     :  process.env.mysqluser,
        password :  process.env.mysqlPassword
    }
    const connection = mysql.createConnection(options);

    await connection.connect((err) => {
        if(err) throw err;
        console.log("MySQL db connected")
    });

    //warning prepared statements DO NOT work here
    connection.query(`CREATE DATABASE IF NOT EXISTS ${userID}`, (error) => {
        if(error) console.log(error)
    })

    //warning prepared statements DO NOT work here
    connection.query(`USE ${userID}`, (error) => {
        if(error) console.log(error)
    })

    connection.query(newTableString, (error) => {
        if(error) console.log(error)
    })

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
    console.log(queryString, queryValues)


    connection.execute(queryString, queryValues
    , (error, results, fields) => {
        // data = reformat(results)
        if(error) {
            console.log(error)
            res.sendStatus(400)
            return
        }
        res.json(results)
    })

    await connection.end((err) => {
        if(err) throw err;
        console.log("MySQL connection closed")
    });
}


export async function update(req: any, res: any) { ///////////any should maybe change

    const userID : number = req.params.id
    const objectID : string = req.query.objectID

    const options = {
        host     :  process.env.mysqlUrl,
        port     :  Number(process.env.mysqlPort),
        user     :  process.env.mysqluser,
        password :  process.env.mysqlPassword
    }
    const connection = mysql.createConnection(options);

    await connection.connect((err) => {
        if(err) throw err;
        console.log("MySQL db connected")
    });

    //warning prepared statements DO NOT work here
    connection.query(`CREATE DATABASE IF NOT EXISTS ${userID}`, (error) => {
        if(error) console.log(error)
    })

    //warning prepared statements DO NOT work here
    connection.query(`USE ${userID}`, (error) => {
        if(error) console.log(error)
    })

    connection.query(newTableString, (error) => {
        if(error) console.log(error)
    })

    if(objectID){
        connection.execute('SELECT * FROM tbl WHERE id = ?;', [objectID], (error, results, fields) => {
            // data = reformat(results)
            if(error) {
                console.log(error)
                res.sendStatus(400)
                return
            }
            res.json(results)
        })
    } else {
        connection.query('SELECT * FROM tbl;', (error, results, fields) => {
            // data = reformat(data)
            if(error) {
                console.log(error)
                res.sendStatus(400)
                return
            }
            res.json(results)
        })
    }

    await connection.end((err) => {
        if(err) throw err;
        console.log("MySQL connection closed")
    });
}


export async function deleteRecords(req: any, res: any) { ///////////any should maybe change

    const userID : number = req.params.id
    const objectID : string = req.query.objectID

    const options = {
        host     :  process.env.mysqlUrl,
        port     :  Number(process.env.mysqlPort),
        user     :  process.env.mysqluser,
        password :  process.env.mysqlPassword
    }
    const connection = mysql.createConnection(options);

    await connection.connect((err) => {
        if(err) throw err;
        console.log("MySQL db connected")
    });

    //warning prepared statements DO NOT work here
    connection.query(`CREATE DATABASE IF NOT EXISTS ${userID}`, (error) => {
        if(error) console.log(error)
    })

    //warning prepared statements DO NOT work here
    connection.query(`USE ${userID}`, (error) => {
        if(error) console.log(error)
    })

    connection.query(newTableString, (error) => {
        if(error) console.log(error)
    })

    if(objectID){
        connection.execute('SELECT * FROM tbl WHERE id = ?;', [objectID], (error, results, fields) => {
            // data = reformat(results)
            if(error) {
                console.log(error)
                res.sendStatus(400)
                return
            }
            res.json(results)
        })
    } else {
        connection.query('SELECT * FROM tbl;', (error, results, fields) => {
            // data = reformat(data)
            if(error) {
                console.log(error)
                res.sendStatus(400)
                return
            }
            res.json(results)
        })
    }

    await connection.end((err) => {
        if(err) throw err;
        console.log("MySQL connection closed")
    });
}