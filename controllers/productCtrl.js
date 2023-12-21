import asyncHandler from 'express-async-handler'
import Product from '../model/Product.js'

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private/Admin
export const createProductCtrl = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    sizes,
    colors,
    user,
    price,
    totalQty,
    brand
  } = req.body
  // Product exists
  const productExists = await Product.findOne({ name })
  if (productExists) {
    throw new Error('Product already exists.')
  }
  // Create the product
  const product = await Product.create({
    name,
    description,
    category,
    sizes,
    colors,
    user: req.userAuthId,
    price,
    totalQty,
    brand
  })
  // Push the product into category
  res.json({
    status: 'success',
    message: 'Product created successfully',
    product
  })
})

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public

export const getProductCtrl = asyncHandler(async (req, res) => {
  // query
  let productQuery = Product.find()

  // filter by name
  if (req.query.name) {
    productQuery = productQuery.find({
      name: { $regex: req.query.name, $options: 'i' }
    })
  }

  // filter by brand
  if (req.query.brand) {
    productQuery = productQuery.find({
      brand: { $regex: req.query.brand, $options: 'i' }
    })
  }

  // filter by category
  if (req.query.category) {
    productQuery = productQuery.find({
      category: { $regex: req.query.category, $options: 'i' }
    })
  }

  // filter by colors
  if (req.query.colors) {
    productQuery = productQuery.find({
      colors: { $regex: req.query.colors, $options: 'i' }
    })
  }

  // filter by sizes
  if (req.query.sizes) {
    productQuery = productQuery.find({
      sizes: { $regex: req.query.sizes, $options: 'i' }
    })
  }

  // filter by price range
  if (req.query.price) {
    const priceRange = req.query.price.split('-')
    // gte: greater than or equal to
    // lte: less than or equal to
    productQuery = productQuery.find({
      price: { $gte: priceRange[0], $lte: priceRange[1] }
    })
  }

  // Pagination
  // page
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1
  // limit
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10
  // startIndex
  const startIndex = (page - 1) * limit
  // endIndex
  const endIndex = page * limit
  // totalProducts
  const total = await Product.countDocuments()

  productQuery = productQuery.skip(startIndex).limit(limit)

  // Pagination Results
  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }
  // await the query
  const products = await productQuery

  res.json({
    status: 'success',
    total,
    results: products.length,
    pagination,
    message: 'Products fetched successfully',
    products
  })
})

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public

export const getSingleProductCtrl = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    throw new Error('Product not found')
  }
  res.json({
    status: 'success',
    message: 'Product fetched successfully.',
    product
  })
})

// @desc    Update product
// @route   PUT /api/v1/products/:id/update
// @access  Private/Admin

export const updateProductCtrl = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    sizes,
    colors,
    user,
    price,
    totalQty,
    brand
  } = req.body

  // update
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      category,
      sizes,
      colors,
      user,
      price,
      totalQty,
      brand
    },
    {
      new: true
    }
  )
  res.json({
    status: 'success',
    message: 'Product updated successfully.',
    product
  })
})

// @desc    Delete product
// @route   DELETE /api/v1/products/:id/delete
// @access  Private/Admin

export const deleteProductCtrl = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id)

  res.json({
    status: 'success',
    message: 'Product deleted successfully.'
  })
})
