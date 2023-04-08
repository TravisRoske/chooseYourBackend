import express from 'express'
import axios from 'axios'

import path from 'path'

const cors = require('cors')//////////////
//add helmet///////
//add a rate limiter/////

import { postgresForwarder } from './postgres/forwardPostgres.js'

const port = process.env.port;
const dbMasterUrl = process.env.dbMasterUrl;

const app = express();


//I'll have to change this later because this just allows everything//////
app.use(cors());

app.use(express.json());


//app.get("/assignid" .....)
app.get("/assignid/:userid", (req, res) => {
    const options = {
        url: dbMasterUrl + '/assignid/' + req.params.userid,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }
    };
    console.log(options)

    axios(options)
    .then(axiosResponse => {
        res.status(axiosResponse.status)
        res.json(axiosResponse.data)
    })
    .catch((err) => {
        res.sendStatus(500)
    })
})

///////////make simple forward functions
app.all("/ts/mysql/query/:userid", (req, res) => {
    
    let queryString : string = ""
    if(req.query.isEmpty){
        queryString = "?"
        for(let key in req.query){
            queryString += key + "=" + req.query[key]
        }
    }

    const options = {
        url: dbMasterUrl + "/ts/mysql/" + req.params.userid + queryString,
        method: req.method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data : JSON.stringify(req.body)
    };

    axios(options)
    .then(axiosResponse => {
        res.status(axiosResponse.status)
        res.json(axiosResponse.data)
    })
    .catch((err) => {
        res.sendStatus(500)
    })
})


app.use("/ts/postgres/query", postgresForwarder)


const publicDirectoryPath = path.join(__dirname, '../../../Public/2d')
app.use(express.static(publicDirectoryPath))


app.listen(port, () => {
    console.log(`Main Server Listening on port ${port}`)
})