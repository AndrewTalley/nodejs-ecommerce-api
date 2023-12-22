import express from 'express'
import { createOrderCtrl } from '../controllers/orderCtrl.js'
import { isLoggedIn } from '../middlewares/isLoggedIn.js'

const orderRoute = express.Router()

orderRoute.post('/', isLoggedIn, createOrderCtrl)

export default orderRoute
