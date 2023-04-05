import express from 'express'
import axios from 'axios'

export const postgresForwarder = express.Router();

postgresForwarder.route('/:userid')
    .all(forward)


postgresForwarder.route('/')
    .all(() => console.log("no userid!!!"))//////////////


const dbMasterUrl = "http://localhost:8081"////////

async function forward(req: any, res: any) {

    let queryString : string = ""
    if(!req.query.isEmpty){
        queryString = "?"
        for(let key in req.query){
            queryString += key + "=" + req.query[key]
        }
    }

    const options = {
        url: dbMasterUrl + "/ts/postgres/" + req.params.userid + queryString,
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