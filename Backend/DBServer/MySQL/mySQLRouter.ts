import express from 'express'
import { validateUserid } from '../middleware/validateUserid.js';
import { get, create, update, deleteRecords } from './mySQLController.js'

export const mySQLRouter = express.Router();


// REQUEST FORMAT -  ${url}/ts/mysql/${userid}?objectid=${objectid}
mySQLRouter.route('/:userid')
    .all(validateUserid)
    .get(get)
    .post(create)
    .put(update)
    .delete(deleteRecords)

// mySQLRouter.route('/:search')
//     .get(search)