import express from 'express'
import {
  createProductCtrl,
  getProductCtrl,
  getSingleProductCtrl,
  updateProductCtrl,
  deleteProductCtrl
} from '../controllers/productCtrl.js'
import { isLoggedIn } from '../middlewares/isLoggedIn.js'

const productsRoute = express.Router()

// GET
productsRoute.get('/', getProductCtrl)
productsRoute.get('/:id', getSingleProductCtrl)
// POST
productsRoute.post('/', isLoggedIn, createProductCtrl)
// PUT
productsRoute.put('/:id', isLoggedIn, updateProductCtrl)
// DELETE
productsRoute.delete('/:id', isLoggedIn, deleteProductCtrl)

export default productsRoute
