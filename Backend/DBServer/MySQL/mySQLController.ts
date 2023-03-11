import * as mysql from 'mysql2'
import * as dotenv from 'dotenv'
dotenv.config()


export async function getAll(req: any, res: any) { ///////////any should maybe change

    const userID : number = req.params.id
    const objectID : string = req.query.objectID

    const options = {
        host     :  process.env.mysqlUrl,
        port     :  Number(process.env.mysqlPort),
        user     :  process.env.mysqluser,
        password :  process.env.mysqlPassword
    }
    const connection = mysql.createConnection(options);

    let data: object = []


    //I probably need to put all this in a transaction!!!
    await connection.connect((err) => {
        if(err) throw err;
        console.log("MySQL db connected")
    });

    if(objectID){
        connection.query(
            `BEGIN TRY
                BEGIN TRANSACTION
                    CREATE DATABASE IF NOT EXISTS ${userID};
                    USE ${userID};
                    CREATE TABLE IF NOT EXISTS tbl ( id int not null, name text, primary key (id));
                    SELECT * FROM tbl WHERE id = ${objectID};
                COMMIT TRANSACTION
            END TRY
            BEGIN CATCH
                ROLLBACK
            END CATCH`
        , (error, results, fields) => {
            console.log("RES", results)
            // data = reformat(data)
            res.json(results)
        })
    } else {
        connection.query(
            `BEGIN
                CREATE DATABASE IF NOT EXISTS ${userID}
                USE ${userID}
                CREATE TABLE IF NOT EXISTS tbl ( id int not null, name text, primary key (id))
                SELECT * FROM tbl
            END
            ROLLBACK`
        , (error, results, fields) => {
            // data = reformat(data)
            res.json(results)
        })
    }


    // connection.query(`CREATE DATABASE IF NOT EXISTS ${userID};`)

    // connection.query(`USE ${userID};`)

    // connection.query(`CREATE TABLE IF NOT EXISTS tbl ( id int not null, name text, primary key (id));`)


    //     connection.query(`SELECT * FROM tbl WHERE id = ${objectID};`, (error, results, fields) => {
    //         // data = reformat(results)
    //         res.json(results)
    //     })
    // } else {
    //     connection.query('SELECT * FROM tbl;', (error, results, fields) => {
    //         // data = reformat(data)
    //         res.json(results)
    //     })
    // }

    await connection.end((err) => {
        if(err) throw err;
        console.log("MySQL connection closed")
    });




    connection
	.query("BEGIN")
	.then((res) => {
		// next, insert some data into the pets table
		return client.query(
			"INSERT INTO pets (name, species) VALUES ($1, $2), ($3, $4)",
			["Fido", "dog", "Albert", "cat"]
		)
	})
	.then((res) => {
		// next, insert some data into the food table
		return client.query(
			"INSERT INTO food (name, quantity) VALUES ($1, $2), ($3, $4)",
			["Dog Biscuit", 3, "Cat Food", 5]
		)
	})
	.then((res) => {
		// once that's done, run the commit statement to
		// complete the transaction
		return client.query("commit")
	})
	.then((res) => {
		// if the transaction completes successfully
		// log a confirmation statement
		console.log("transaction completed")
	})
	.catch((err) => {
		// incase there are any errors encountered
		// rollback the transaction
		console.error("error while querying:", err)
		return client.query("rollback")
	})
	.catch((err) => {
		// incase there is an error when rolling back, log it
		console.error("error while rolling back transaction:", err)
	})

}