import express from 'express'
import { validateUserid } from '../middleware/validateUserid.js';
import { get, create, update, deleteRecords } from './mongoController.js'

export const mongoRouter = express.Router();


// REQUEST FORMAT -  ${url}/ts/mongo/${userid}?objectid=${objectid}
mongoRouter.route('/:userid')
    .all(validateUserid)
    .get(get)
    .post(create)
    .put(update)
    .delete(deleteRecords)

// mongoRouter.route('/:search')
//     .get(search)