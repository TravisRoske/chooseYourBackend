
import express from 'express'
export const mySQLRouter = express.Router();

import { getAll } from './mySQLController.js'

// REQUEST FORMAT -  ${url}/ts/mysql/${userID}?objectID=${objectID}
mySQLRouter.route('/:id')
    .get(getAll)
    .post()
    .put()
    .delete()

mySQLRouter.route('/:search')
    .get()