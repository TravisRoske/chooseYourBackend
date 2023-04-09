import express from 'express';
import axios from 'axios';

import path from 'path';

const cors = require('cors');//////////////
import rateLimit from 'express-rate-limit';


import { postgresForwarder } from './postgres/forwardPostgres.js';
import { mysqlForwarder } from './mysql/forwardMysql.js';

const port = process.env.port;
const dbMasterUrl = process.env.dbMasterUrl;

const app = express();


const limiter = rateLimit({
	windowMs: 10 * 1000, // 10 seconds
	max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const limiter2 = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 2000, // Limit each IP to 2000 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter)
app.use(limiter2)

//I'll have to change this later because this just allows everything/////////
app.use(cors());

app.use(express.json());


//app.get("/assignid" .....)
////////make this a forwarder function
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