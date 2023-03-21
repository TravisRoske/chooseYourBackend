//save each userid with current timestamp into a db or text file...(use redis or mysql or something)
    //check if userid exists
        //if not, create with current timestamp, and dbs
            
        //if so, update with current timestamp


//this will be a seperate process on the dbmaster server(or a different server)
    //every minute or so, go through everything and delete the expired dbs....
    //each userid can have a db in mysql, mongo, or postgres, so it will have to delete from all valid dbs.
        //the db can store which dbs were used.(this can literally be a binary. 01 for mysql, 02 for postgres, etc)
        //then just call the deleteDB function on each of these dbs


//delete process
setInterval(() => {
    //check db for expired users
        //delete all their dbs
}, 3600000)