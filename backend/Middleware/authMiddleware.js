import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const SECRET = process.env.JWT_SECRET

export function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const parts = header.split(' ')
    const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : null
    if (!token) {
      return res.status(401).json({ error: 'Non authentifié' })
    }
    const decoded = jwt.verify(token, SECRET)
    req.user = { id: decoded.sub, role: decoded.role }
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide' })
  }
}
