import express from 'express'
import { mySQLRouter } from './MySQL/mySQLRouter.js'

const app = express();

app.use(express.json())


//this uses the mysql file as a middleware
app.use("/ts/mysql", mySQLRouter)

//app.use("/ts/postgres", postgresRouter)

//app.use("/ts/mongo", mongoRouter)


app.listen(8080, () => {
    console.log("App listening")
})