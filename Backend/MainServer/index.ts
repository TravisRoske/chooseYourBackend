import express from 'express'
import { assignUserID } from './assignUserID.js'
import path from 'path'

const port = 8080;///////

const app = express();

app.use(express.json());

app.use(assignUserID)

app.get("/", (req, res) => {
    res.sendFile('chooseLanguage.html', { root: __dirname + "../../../../Public/2d" })
})

app.get("/ts", (req, res) => {
    res.sendFile('chooseDatabase.html', { root: __dirname + "../../../../Public/2d" })
})

app.get("/ts/mysql", (req, res) => {
    res.sendFile('mySQLConsole.html', { root: __dirname + "../../../../Public/2d" })
})

app.get("/ts/postgres", (req, res) => {
    res.sendFile('postgresConsole.html', { root: __dirname + "../../../../Public/2d" })
})

//endpoints
//ts/
//ts/mongo
//ts/postgres
//ts/mysql


app.listen(port, () => {
    console.log(`Main Server Listening on port ${port}`)
})