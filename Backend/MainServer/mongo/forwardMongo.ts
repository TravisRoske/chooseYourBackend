import express from 'express'
import axios from 'axios'
import * as dotenv from 'dotenv'
dotenv.config()


export const mongoForwarder = express.Router();

mongoForwarder.route('/:userid')
    .all(forward)


mongoForwarder.route('/')
    .all(() => console.log("no userid!!!"))//////////////


const dbMasterUrl = process.env.dbMasterUrl

async function forward(req: any, res: any) {

    let queryString : string = ""
    if(!req.query.isEmpty){
        queryString = "?"
        for(let key in req.query){
            queryString += key + "=" + req.query[key]
        }
    }

    const options = {
        url: dbMasterUrl + "/ts/mongo/" + req.params.userid + queryString,
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