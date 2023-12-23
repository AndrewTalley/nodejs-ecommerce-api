import dotenv from 'dotenv'
dotenv.config()
import Stripe from 'stripe'
import express from 'express'
import dbConnect from '../config/dbConnect.js'
import userRoutes from '../routes/userRoutes.js'
import productsRoute from '../routes/productRoutes.js'
import categoryRoute from '../routes/categoryRoute.js'
import brandRoute from '../routes/brandRoute.js'
import colorRoute from '../routes/colorRoute.js'
import reviewRoute from '../routes/reviewRoute.js'
import orderRoute from '../routes/orderRoute.js'
import { globalErrHandler, notFound } from '../middlewares/globalErrHandler.js'
import Order from '../model/Order.js'

//db connect
dbConnect()

const app = express()

// Stripe webhook
const stripe = new Stripe(process.env.STRIPE_KEY)

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  'whsec_bc9d0092dc038413b033d3fe8f36d285121dd0c4f3f562f94b6114e0e5f74828'

app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (request, response) => {
    const sig = request.headers['stripe-signature']

    let event

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret)
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`)
      return
    }

    if (event.type === 'checkout.session.completed') {
      // Update the order
      const session = event.data.object
      const { orderId } = session.metadata
      const paymentStatus = session.payment_status
      const paymentMethod = session.payment_method_types[0]
      const totalAmount = session.amount_total
      const currency = session.currency
      // Find the order
      const order = await Order.findByIdAndUpdate(
        JSON.parse(orderId),
        {
          totalPrice: totalAmount / 100,
          currency,
          paymentMethod,
          paymentStatus
        },
        {
          new: true
        }
      )
      console.log(order)
    } else {
      return
    }

    // // Handle the event
    // switch (event.type) {
    //   case 'payment_intent.succeeded':
    //     const paymentIntentSucceeded = event.data.object
    //     // Then define and call a function to handle the event payment_intent.succeeded
    //     break
    //   // ... handle other event types
    //   default:
    //     console.log(`Unhandled event type ${event.type}`)
    // }

    // Return a 200 response to acknowledge receipt of the event
    response.send()
  }
)

// pass incoming data
app.use(express.json())

//routes
app.use('/api/v1/users/', userRoutes)
app.use('/api/v1/products/', productsRoute)
app.use('/api/v1/categories/', categoryRoute)
app.use('/api/v1/brands/', brandRoute)
app.use('/api/v1/colors/', colorRoute)
app.use('/api/v1/reviews/', reviewRoute)
app.use('/api/v1/orders/', orderRoute)

// error middleware
app.use(notFound)
app.use(globalErrHandler)

export default app
