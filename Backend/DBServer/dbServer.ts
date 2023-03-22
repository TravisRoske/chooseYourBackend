import express from 'express'
import { requestLogger } from './middleware/requestLogger.js'
import { assignUserID } from './manager/assignUserID.js'
import { mySQLRouter } from './MySQL/mySQLRouter.js'
import { postgresRouter } from './Postgres/postgresRouter.js';
import { dbManagerRouter } from './manager/dbManagerRouter.js';
import { deletingProcess } from './manager/deletingProcess.js'

deletingProcess()

const cors = require('cors');

const app = express();


//I'll have to change this later because this just allows everything//////
app.use(cors());


app.use(express.json())

// app.use(requestLogger)

app.get('/assignid', assignUserID)  //this should create new user in dbmaster

app.use('/', dbManagerRouter)

                                    //each request should update the user in dbmster, by sending put with the current db used
app.use('/ts/mysql', mySQLRouter)

app.use('/ts/postgres', postgresRouter)

//app.use('/ts/mongo', mongoRouter)








app.listen(8081, () => {
    console.log("Database Server listening on port 8081")////////
})