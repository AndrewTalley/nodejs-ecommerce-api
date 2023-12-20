import User from '../model/User.js'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'

// @desc    Register User
// @route   POST /api/v1/users/register
// @access  Private/Admin

export const registerUserCtrl = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body
  // Check if user exists
  const userExists = await User.findOne({ email })
  if (userExists) {
    //throw
    throw new Error('User already exists')
  }
  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  // Create the user
  const user = await User.create({
    fullname,
    email,
    password: hashedPassword
  })
  res.status(201).json({
    status: 'success',
    message: 'User Registered Successfully',
    data: user
  })
})

// @desc    Login User
// @route   POST /api/v1/users/login
// @access  Public
export const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  // Find the user in the database by email only
  const userFound = await User.findOne({
    email
  })
  if (userFound && (await bcrypt.compare(password || '', userFound.password))) {
    res.json({
      status: 'success',
      message: 'User logged in successfully',
      userFound
    })
  } else {
    throw new Error('Invalid login credentials')
  }
})
