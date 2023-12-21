import express from 'express'
import {
  createBrandCtrl,
  getAllBrandsCtrl,
  getSingleBrandCtrl,
  updateBrandCtrl,
  deleteBrandCtrl
} from '../controllers/brandCtrl.js'
import { isLoggedIn } from '../middlewares/isLoggedIn.js'

const brandRoute = express.Router()

// GET
brandRoute.get('/', getAllBrandsCtrl)
brandRoute.get('/:id', getSingleBrandCtrl)
// POST
brandRoute.post('/', isLoggedIn, createBrandCtrl)
// PUT
brandRoute.put('/:id', isLoggedIn, updateBrandCtrl)
// DELETE
brandRoute.delete('/:id', isLoggedIn, deleteBrandCtrl)

export default brandRoute
