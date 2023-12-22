import Review from '../model/Review.js'
import Product from '../model/Product.js'
import asyncHandler from 'express-async-handler'

// @desc    Create new review
// @route   POST /api/v1/reviews
// @access  Private/Admin

export const createReviewCtrl = asyncHandler(async (req, res) => {
  const { product, message, rating } = req.body

  // 1. Find the Product
  const { productID } = req.params
  const productFound = await Product.findById(productID).populate('reviews')
  if (!productFound) {
    throw new Error('Product Not Found')
  }

  // check if user already reviewed this product?
  const hasReviewed = productFound?.reviews.find((review) => {
    return review?.user?.toString() === req?.userAuthId?.toString()
  })
  if (hasReviewed) {
    throw new Error('You have already reviewed this product.')
  }

  // 2. create review
  const review = await Review.create({
    message,
    rating,
    product: productFound?._id,
    user: req.userAuthId
  })

  // 3. Push review into productFound
  productFound.reviews.push(review?._id)

  // 4. Resave
  await productFound.save()
  res.status(201).json({
    success: true,
    message: 'Review has been created successfully.'
  })
})
