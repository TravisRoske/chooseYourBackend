import express from 'express'
import path from 'path'

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile('chooseLanguage.html', { root: __dirname + "../../../../Public/2d" })
})

app.get("/ts", (req, res) => {
    res.sendFile('chooseDatabase.html', { root: __dirname + "../../../../Public/2d" })
})

//endpoints
//ts/
//ts/mongo
//ts/postgres
//ts/mysql


app.listen(8080, () => {
    console.log("App listening")
})