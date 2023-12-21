import express from 'express'
import {
  createColorCtrl,
  getAllColorsCtrl,
  getSingleColorCtrl,
  updateColorCtrl,
  deleteColorCtrl
} from '../controllers/colorCtrl.js'
import { isLoggedIn } from '../middlewares/isLoggedIn.js'

const colorRoute = express.Router()

// GET
colorRoute.get('/', getAllColorsCtrl)
colorRoute.get('/:id', getSingleColorCtrl)
// POST
colorRoute.post('/', isLoggedIn, createColorCtrl)
// PUT
colorRoute.put('/:id', isLoggedIn, updateColorCtrl)
// DELETE
colorRoute.delete('/:id', isLoggedIn, deleteColorCtrl)

export default colorRoute
