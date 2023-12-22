import mongoose from 'mongoose'
const Schema = mongoose.Schema

// Generate Random Numbers for Order
const randomTxt = Math.random().toString(36).substring(7).toLocaleUpperCase()
const randomNumbers = Math.floor(1000 + Math.random() * 90000)

const OrderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    orderItems: [
      {
        type: Object,
        required: true
      }
    ],
    shippingAddress: {
      type: Object,
      required: true
    },
    orderNumber: {
      type: String,
      required: true,
      default: randomTxt + randomNumbers
    },
    // For Stripe payment
    paymentStatus: {
      type: String,
      default: 'Not Paid'
    },
    paymentMethod: {
      type: String,
      default: 'Not Specified'
    },
    totalPrice: {
      type: Number,
      default: 0.0
    },
    currency: {
      type: String,
      default: 'Not Specified'
    },
    // For Admin
    status: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered']
    },
    deliveredAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
)

// Compile to form model
const Order = mongoose.model('Order', OrderSchema)
export default Order
