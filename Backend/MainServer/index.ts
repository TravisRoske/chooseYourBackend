import express from 'express';
import axios from 'axios';
import path from 'path';
import rateLimit from 'express-rate-limit';

const cors = require('cors');//////////////

// import { passwordEncrypter } from './passwordEncrypter.js'

import { mysqlForwarder } from './mysql/forwardMysql.js';
import { postgresForwarder } from './postgres/forwardPostgres.js';
import { mongoForwarder } from './mongo/forwardMongo.js';

const port = process.env.port;
const dbMasterUrl = process.env.dbMasterUrl;

const app = express();

const limiter = rateLimit({
	windowMs: 10 * 1000, // 10 seconds
	max: 15, // Limit each IP to 15 requests per `window`
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
app.use(limiter);


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

// app.use("*", passwordEncrypter);/////middleware?

app.use("/ts/mysql/query", mysqlForwarder);

app.use("/ts/postgres/query", postgresForwarder);

app.use("/ts/mongo/query", mongoForwarder);


const publicDirectoryPath = path.join(__dirname, '../../../Public/2d');
app.use(express.static(publicDirectoryPath));


app.listen(port, () => {
    console.log(`Main Server Listening on port ${port}`);
})