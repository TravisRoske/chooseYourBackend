import express from 'express'
const cors = require('cors')//////////////
//add helmet///////
//add a rate limiter/////

const port = 8080;//////////
const dbMasterUrl = "http://localhost:8081"////////

const app = express();


//I'll have to change this later because this just allows everything//////
app.use(cors());

app.use(express.json());





// app.get("/", (req, res) => {
//     res.sendFile(publicDirectoryPath + '/chooseLanguage.html')
// })

// app.get("/ts", (req, res) => {
//     res.sendFile(publicDirectoryPath + '/chooseDatabase.html')
// })



// app.get("/ts/mysql", (req, res) => {
//     res.sendFile('mySQLConsole.html', { root: __dirname + "../../../../Public/2d" })
// })
app.all("/ts/mysql/query/:id", (req, res) => {
    let options : any = {
        method : req.method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }
    if(req.method != "GET") {
        options.body = JSON.stringify(req.body)
    }
    let queryString : string = ""
    if(req.query){ ///this is true every time////
        queryString = "?"
        for(let key in req.query){
            queryString += key + "=" + req.query[key]
        }
    }
    console.log(dbMasterUrl + "/ts/mysql/" + req.params.id + queryString)
    fetch(dbMasterUrl + "/ts/mysql/" + req.params.id + queryString, options)
    .then((response : any) => {
        return response.json()
    })
    .then((result : any) => {
        res.send(result)
    })
    .catch((err : any) => {
        res.send(err)
    })
})


// app.get("/ts/postgres", (req, res) => {
//     res.sendFile(publicDirectoryPath + '/indextest.html')
// })
app.all("/ts/postgres/query/:id", (req, res) => {

    let options : any = {
        method : req.method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }
    if(req.method != "GET") {
        options.body = JSON.stringify(req.body)
    }
    let queryString : string = ""
    if(req.query){ ///this is true every time////
        queryString = "?"
        for(let key in req.query){
            queryString += key + "=" + req.query[key]
        }
    }
    console.log(dbMasterUrl + "/ts/postgres/" + req.params.id + queryString)
    fetch(dbMasterUrl + "/ts/postgres/" + req.params.id + queryString, options)
    .then((response : any) => {
        return response.json()
    })
    .then((result : any) => {
        res.send(result)
    })
    .catch((err : any) => {
        res.send(err)
    })
})



import path from 'path'
const publicDirectoryPath = path.join(__dirname, '../../../Public/2d')
app.use(express.static(publicDirectoryPath))


app.listen(port, () => {
    console.log(`Main Server Listening on port ${port}`)
})