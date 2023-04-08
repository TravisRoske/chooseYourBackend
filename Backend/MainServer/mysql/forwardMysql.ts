import express from 'express'
import axios from 'axios'
import * as dotenv from 'dotenv'
dotenv.config()


export const mysqlForwarder = express.Router();

mysqlForwarder.route('/:userid')
    .all(forward)


mysqlForwarder.route('/')
    .all(() => console.log("no userid!!!"))//////////////


const dbMasterUrl = process.env.dbMasterUrl

async function forward(req: any, res: any) {
    console.log("Forwarding!!")

    let queryString : string = ""
    if(!req.query.isEmpty){
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

}