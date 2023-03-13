


        // connection.beginTransaction((err) => {
        //     if (err) { throw err; }
        //     connection.execute('CREATE DATABASE IF NOT EXISTS ?', [userID], (error, results, fields) => {
        //         if (error) {
        //             return connection.rollback(function() {
        //                 throw error;
        //             });
        //         }
            
        //         connection.execute('USE ?', [userID], (error, results, fields) => {
        //             if (error) {
        //                 return connection.rollback(function() {
        //                     throw error;
        //                 });
        //             }

        //             connection.execute('CREATE TABLE IF NOT EXISTS tbl ( id int not null, name text, primary key (id))', (error, results, fields) => {
        //                 if (error) {
        //                     return connection.rollback(function() {
        //                         throw error;
        //                     });
        //                 }

        //                 connection.execute('SELECT * FROM tbl WHERE id = ?', [objectID], (error, results, fields) => {
        //                     if (error) {
        //                         return connection.rollback(function() {
        //                             throw error;
        //                         });
        //                     }
        //                     res.json(results)

        //                     connection.commit((err) => {
        //                         if (err) {
        //                             return connection.rollback(function() {
        //                                 throw err;
        //                             });
        //                         }
        //                         console.log('success!');
        //                     });
        //                 });
        //             });
        //         });
        //     });
        // });


    //     //.execute will cache the sql statement, connection.unprepare can uncache it if I ever need that
    //     connection.execute(
    //         `USE ?`
    //     , [userID]
    //     , (err) => {
    //         if(err){
    //             ////////////
    //         }
    //     });
    //     connection.execute(
    //         `CREATE TABLE IF NOT EXISTS tbl ( id int not null, name text, primary key (id))`
    //     , (err) => {
    //         if(err){
    //             ////////////
    //         }
    //     });
    //     connection.execute(
    //         `SELECT * FROM tbl WHERE id = ?`
    //     , [objectID]
    //     , (err, rows) => {
    //     // rows: [ { result: 12 } ]
    //         console.log(rows)
    //         if(err){
    //             ////////////
    //         }
    //         res.json(rows)
    //     });



    // } else {
        // connection.execute(
        //     `BEGIN TRY
        //     BEGIN TRANSACTION
        //         CREATE DATABASE IF NOT EXISTS ?;
        //         USE ?;
        //         CREATE TABLE IF NOT EXISTS tbl ( id int not null, name text, primary key (id));
        //         SELECT * FROM tbl;
        //     COMMIT TRANSACTION
        //     END TRY
        //     BEGIN CATCH
        //         ROLLBACK
        //     END CATCH`
        // , [userID, userID]
        // , (err, rows) => {
        //     // rows: [ { result: 12 } ]
        //     if(err){
        //         ////////////
        //     }
        //     res.json(rows)
        // });

