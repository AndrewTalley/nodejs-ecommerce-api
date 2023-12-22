import Order from '../model/Order.js'
import User from '../model/User.js'
import Product from '../model/Product.js'
import asyncHandler from 'express-async-handler'

// @desc    create orders
// @route   POST /api/v1/orders
// @access  Private

export const createOrderCtrl = asyncHandler(async (req, res) => {
  // 1. Get the payload(user, orderItems, shippingAddress, totalPrice)
  const { orderItems, shippingAddress, totalPrice } = req.body

  // 2. Find the user
  const user = await User.findById(req.userAuthId)
  // 3. Check if user has a shipping address
  if (!user?.hasShippingAddress) {
    throw new Error('Please provide a shipping address.')
  }

  // 4. Check if order is not empty
  if (orderItems?.length <= 0) {
    throw new Error('No Order Items')
  }

  // 5. Place/Create order -- Save into DB
  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    totalPrice
  })

  // 6. Update the product totalQty and totalSold
  const products = await Product.find({ _id: { $in: orderItems } })
  orderItems?.map(async (order) => {
    const product = products?.find((product) => {
      return product?._id.toString() === order?._id.toString()
    })
    if (product) {
      product.totalSold += order.qty
    }
    await product.save()
  })

  // 7. Push orders into user
  user.orders.push(order?._id)
  await user.save()

  // 8. Make payment (Stripe)
  // 9. Implement payment webhook
  // 10. Update the user order
  res.json({
    success: true,
    message: 'Order Created',
    order,
    user
  })
})
