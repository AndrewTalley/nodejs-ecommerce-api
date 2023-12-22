import dotenv from 'dotenv'
dotenv.config()
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

//db connect
dbConnect()

const app = express()
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
