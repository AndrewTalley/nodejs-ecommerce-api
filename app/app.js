import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import dbConnect from '../config/dbConnect.js'
import userRoutes from '../routes/userRoutes.js'
import productsRoute from '../routes/productRoutes.js'
import { globalErrHandler, notFound } from '../middlewares/globalErrHandler.js'

//db connect
dbConnect()

const app = express()
// pass incoming data
app.use(express.json())

//routes
app.use('/api/v1/users/', userRoutes)
app.use('/api/v1/products/', productsRoute)

// error middleware
app.use(notFound)
app.use(globalErrHandler)

export default app
