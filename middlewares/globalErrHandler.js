export const globalErrHandler = (err, req, res, next) => {
  // stack about the error
  // message
  const stack = err?.stack
  const statusCode = err?.statusCode ? err?.statusCode : 500
  const message = err?.message

  res.status(statusCode).json({
    stack,
    message
  })
}

// 404 handler
export const notFound = (req, res, next) => {
  const err = new Error(`URL does not exist: ${req.originalUrl}`)
  next(err)
}
