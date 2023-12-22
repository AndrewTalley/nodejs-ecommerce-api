import express from 'express'
import { createReviewCtrl } from '../controllers/reviewsCtrl.js'
import { isLoggedIn } from '../middlewares/isLoggedIn.js'

const reviewRoute = express.Router()

reviewRoute.post('/:productID', isLoggedIn, createReviewCtrl)

export default reviewRoute
