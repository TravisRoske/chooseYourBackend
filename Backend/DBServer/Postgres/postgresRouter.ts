import express from 'express'

export const postgresRouter = express.Router();

import { get, create, update, deleteRecords } from './postgresController.js'

// REQUEST FORMAT -  ${url}/ts/postgres/${userID}?objectID=${objectID}
postgresRouter.route('/:id')
    .get(get)
    .post(create)
    .put(update)
    .delete(deleteRecords)

// postgresRouter.route('/:search')
//     .get(search)