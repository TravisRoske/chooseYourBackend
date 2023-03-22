import express from 'express'
import { validateUserid } from '../middleware/validateUserid.js';
import { get, getAll, create, update, deleteRecords } from './dbManager.js'

export const dbManagerRouter = express.Router();

dbManagerRouter.route('/')
    .get(getAll)

dbManagerRouter.route('/:userid')
    // .all(validateUserid)    //I would have to update everything to userid or to id
    .get(get)
    .post(create)
    .put(update)
    .delete(deleteRecords)