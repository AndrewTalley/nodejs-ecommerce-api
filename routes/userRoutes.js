import express from 'express'
import {
  registerUserCtrl,
  loginUserCtrl,
  getUserProfileCtrl,
  updateShippingAddressCtrl
} from '../controllers/usersCtrl.js'
import { isLoggedIn } from '../middlewares/isLoggedIn.js'

const userRoutes = express.Router()

userRoutes.post('/register', registerUserCtrl)
userRoutes.post('/login', loginUserCtrl)
userRoutes.get('/profile', isLoggedIn, getUserProfileCtrl)
userRoutes.put('/update/shipping', isLoggedIn, updateShippingAddressCtrl)

export default userRoutes
