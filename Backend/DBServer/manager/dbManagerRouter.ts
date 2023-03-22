import express from 'express'
import { validateUserid } from '../middleware/validateUserid.js';
import { update } from './dbManager.js'

export const dbManagerRouter = express.Router();


dbManagerRouter.route('*/:userid')
    // .all(validateUserid)
    .all(update)
