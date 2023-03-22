import express from 'express'
import { validateUserid } from '../middleware/validateUserid.js';

export const postgresRouter = express.Router();

import { get, create, update, deleteRecords } from './postgresController.js'

// REQUEST FORMAT -  ${url}/ts/postgres/${userID}?objectID=${objectID}
postgresRouter.route('/:userid')
    .all(validateUserid)
    .get(get)
    .post(create)
    .put(update)
    .delete(deleteRecords)

// postgresRouter.route('/:search')
//     .get(search)