import express from 'express'
import {
  createCategoryCtrl,
  getAllCategoriesCtrl,
  getSingleCategoryCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl
} from '../controllers/categoriesCtrl.js'
import { isLoggedIn } from '../middlewares/isLoggedIn.js'

const categoryRoute = express.Router()

// GET
categoryRoute.get('/', getAllCategoriesCtrl)
categoryRoute.get('/:id', getSingleCategoryCtrl)
// POST
categoryRoute.post('/', isLoggedIn, createCategoryCtrl)
// PUT
categoryRoute.put('/:id', isLoggedIn, updateCategoryCtrl)
// DELETE
categoryRoute.delete('/:id', isLoggedIn, deleteCategoryCtrl)

export default categoryRoute
