import express from 'express'
import { validateUserid } from '../validateUserid.js';
export const mySQLRouter = express.Router();

import { get, create, update, deleteRecords } from './mySQLController.js'

// REQUEST FORMAT -  ${url}/ts/mysql/${userID}?objectID=${objectID}
mySQLRouter.route('/:id')
    .all(validateUserid)
    .get(get)
    .post(create)
    .put(update)
    .delete(deleteRecords)

// mySQLRouter.route('/:search')
//     .get(search)