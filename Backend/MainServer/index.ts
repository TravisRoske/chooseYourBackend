import express from 'express'

const port = 8080;//////////

const app = express();

app.use(express.json());

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

app.listen(port, () => {
    console.log(`Main Server Listening on port ${port}`)
})