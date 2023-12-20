import { getTokenFromHeader } from '../utils/getTokenFromHeader.js'
import { verifyToken } from '../utils/verifyToken.js'

export const isLoggedIn = (req, res, next) => {
  // get token from header
  const token = getTokenFromHeader(req)
  // verify the token
  const decodedUser = verifyToken(token)

  if (!decodedUser) {
    throw new Error('Invalid/Expired token, please log-in again.')
  } else {
    // save the user into the request object
    req.userAuthId = decodedUser?.id
    next()
  }
}
