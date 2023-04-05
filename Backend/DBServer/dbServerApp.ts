import express from 'express'
import { requestLogger } from './middleware/requestLogger.js'
import { assignUserid } from './manager/assignUserid.js'
import { mySQLRouter } from './MySQL/mySQLRouter.js'
import { postgresRouter } from './Postgres/postgresRouter.js';
import { update } from './manager/dbManager.js'
import { deletingProcess } from './manager/deletingProcess.js'
import { validateUserid } from './middleware/validateUserid.js';


const cors = require('cors');/////////


deletingProcess()


const app = express();


//I'll have to change this later because this just allows everything//////
app.use(cors());

app.use(express.json())

// app.use(requestLogger)

app.get('/assignid', assignUserid) 
app.get('/assignid/:userid', assignUserid)  

app.use('*/:userid', validateUserid)

//update the data in user database
app.use('*/:userid', update)

app.use('/ts/mysql', mySQLRouter)

app.use('/ts/postgres', postgresRouter)

// //app.use('/ts/mongo', mongoRouter)

export { app }