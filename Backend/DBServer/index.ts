import express from 'express'
import { mySQLRouter } from './MySQL/mySQLRouter.js'
import { postgresRouter } from './Postgres/postgresRouter.js';
const cors = require('cors');

const app = express();

//I'll have to change this later because this just allows everything
app.use(cors());


app.use(express.json())


//this uses the mysql file as a middleware
app.use("/ts/mysql", mySQLRouter)

app.use("/ts/postgres", postgresRouter)

//app.use("/ts/mongo", mongoRouter)


app.listen(8081, () => {
    console.log("App listening")
})