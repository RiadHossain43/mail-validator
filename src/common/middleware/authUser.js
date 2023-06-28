const jwt = require('jsonwebtoken')

exports.authUser = async (req, res, next) => {
  const token = req.header('x-auth-token')
  if (!token) {
    return res.status(401).json({ error: { message: "No token" } })
  }
  try {
    jwt.verify(token, process.env.JWT_KEY, async (error, decoded) => {
      if (error) {
        return res.status(401).json({ error: { message: "Invalid token" } })
      } else {
        req.user = decoded.user
        next()
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500)
  }
}
