import express from 'express'
import {
  createOrderCtrl,
  getAllOrdersCtrl,
  getSingleOrderCtrl,
  updateOrderCtrl
} from '../controllers/orderCtrl.js'
import { isLoggedIn } from '../middlewares/isLoggedIn.js'

const orderRoute = express.Router()

orderRoute.post('/', isLoggedIn, createOrderCtrl)
orderRoute.get('/', isLoggedIn, getAllOrdersCtrl)
orderRoute.get('/:id', isLoggedIn, getSingleOrderCtrl)
orderRoute.put('/update/:id', isLoggedIn, updateOrderCtrl)

export default orderRoute
