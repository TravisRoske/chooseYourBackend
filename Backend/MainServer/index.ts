import express from 'express'
import axios from 'axios'

import path from 'path'

const cors = require('cors')//////////////
//add helmet///////
//add a rate limiter/////

import { postgresForwarder } from './postgres/forwardPostgres.js'
import { mysqlForwarder } from './mysql/forwardMysql.js'

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

app.use("/ts/mysql/query", mysqlForwarder)

app.use("/ts/postgres/query", postgresForwarder)


const publicDirectoryPath = path.join(__dirname, '../../../Public/2d')
app.use(express.static(publicDirectoryPath))


app.listen(port, () => {
    console.log(`Main Server Listening on port ${port}`)
})