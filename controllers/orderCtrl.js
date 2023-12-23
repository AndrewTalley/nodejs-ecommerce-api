import Order from '../model/Order.js'
import dotenv from 'dotenv'
dotenv.config()
import Stripe from 'stripe'
import User from '../model/User.js'
import Product from '../model/Product.js'
import asyncHandler from 'express-async-handler'

// @desc    create orders
// @route   POST /api/v1/orders
// @access  Private

// Stripe Instance
const stripe = new Stripe(process.env.STRIPE_KEY)

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
  // Convert order items to have same structure that stripe needs
  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: item?.name,
          description: item?.description
        },
        unit_amount: item?.price * 100
      },
      quantity: item?.qty
    }
  })

  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata: {
      orderId: JSON.stringify(order?._id)
    },
    mode: 'payment',
    success_url: 'https://localhost:2080/success',
    cancel_url: 'https://localhost:2080/cancel'
  })
  res.send({ url: session.url })
  // 9. Implement payment webhook
  // 10. Update the user order
  // Payment webhook & Updating the user order is being completed in the app.js file //
})

// @desc    get all orders
// @route   GET /api/v1/orders
// @access  Private

export const getAllOrdersCtrl = asyncHandler(async (req, res) => {
  const orders = await Order.find()

  res.json({
    status: 'success',
    message: 'Orders fetched successfully',
    orders
  })
})

// @desc    Get single order
// @route   GET /api/v1/orders/:id
// @access  Private

export const getSingleOrderCtrl = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (!order) {
    throw new Error('Order not found')
  }
  res.json({
    status: 'success',
    message: 'Order fetched successfully.',
    order
  })
})

// @desc    Update order to delivered
// @route   PUT /api/v1/orders/update/:id
// @access  Private/admin

export const updateOrderCtrl = asyncHandler(async (req, res) => {
  const id = req.params.id
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status
    },
    {
      new: true
    }
  )
  res.status(200).json({
    success: true,
    message: 'Order has been updated.',
    updatedOrder
  })
})
