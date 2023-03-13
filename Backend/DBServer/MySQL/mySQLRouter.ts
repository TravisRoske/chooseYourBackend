import express from 'express'
export const mySQLRouter = express.Router();

import { get, create, update, deleteRecords } from './mySQLController.js'

// REQUEST FORMAT -  ${url}/ts/mysql/${userID}?objectID=${objectID}
mySQLRouter.route('/:id')
    .get(get)
    .post(create)
    .put(update)
    .delete(deleteRecords)

// mySQLRouter.route('/:search')
//     .get(search)