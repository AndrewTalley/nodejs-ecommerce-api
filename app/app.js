import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import dbConnect from '../config/dbConnect.js'
import userRoutes from '../routes/userRoutes.js'
import { globalErrHandler, notFound } from '../middlewares/globalErrHandler.js'

//db connect
dbConnect()

const app = express()
// pass incoming data
app.use(express.json())
//routes
app.use('/', userRoutes)

// error middleware
app.use(notFound)
app.use(globalErrHandler)

export default app
