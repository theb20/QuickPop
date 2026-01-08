import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { ensureUsersTable, create, findById, update, findByEmail, findByCode, setResetCodeByEmail, clearResetCodeByEmail, updatePasswordByEmail } from '../models/usersModel.js'
import { sendResetCodeMail } from '../config/mailer.js'

const SECRET = process.env.JWT_SECRET
const EXPIRES_IN = process.env.JWT_EXPIRES_IN 
const IS_PRODUCTION = (process.env.NODE_ENV || 'development') === 'production'
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: IS_PRODUCTION ? 'none' : 'lax',
  secure: IS_PRODUCTION,
  maxAge: 7 * 24 * 60 * 60 * 1000
}

function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN })
}

export async function initAuthController() {
  await ensureUsersTable()
}

export async function register(req, res) {
  try {
    const { fullname, email, password, role = 'user', code, avatar_url = null, restaurant = null } = req.body || {}
    if (!fullname || !email || !password || code === undefined || code === null) {
      return res.status(400).json({ error: 'fullname, email, password, code requis' })
    }
    const existing = await findByEmail(email)
    if (existing) {
      return res.status(409).json({ error: 'Email déjà utilisé' })
    }
    const hash = await bcrypt.hash(password, 10)
    const id = await create({ fullname, email, code, password: hash, role, avatar_url, restaurant })
    const user = await findById(id)
    const token = signToken({ sub: id, role: user.role })
    res.cookie('token', token, COOKIE_OPTIONS)
    return res.status(201).json({ token, user })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export async function login(req, res) {
  try {
    const { code, password } = req.body || {}
    if (code === undefined || code === null || !password) {
      return res.status(400).json({ error: 'code et password requis' })
    }
    const user = await findByCode(code)
    if (!user) {
      return res.status(404).json({ error: 'Code introuvable' })
    }
    if (user.is_active === 0 || user.is_active === false) {
      return res.status(403).json({ error: 'Compte inactif' })
    }
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      return res.status(401).json({ error: 'Mot de passe invalide' })
    }
    await update(user.id, { last_login: new Date() })
    const token = signToken({ sub: user.id, role: user.role })
    const safeUser = {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      code: user.code,
      role: user.role,
      is_active: user.is_active,
      avatar_url: user.avatar_url,
      restaurant: user.restaurant,
      last_login: user.last_login,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }
    res.cookie('token', token, COOKIE_OPTIONS)
    return res.json({ token, user: safeUser })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: IS_PRODUCTION })
    return res.json({ message: 'Déconnecté' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}



export async function me(req, res) {
  try {
    const user = await findById(req.user.id)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' })
    }
    return res.json(user)
  } catch (err) {
    if (err.message && err.message.includes('Deadlock')) {
      // Retry logic for deadlocks
      try {
        const userRetry = await findById(req.user.id)
        if (!userRetry) return res.status(404).json({ error: 'Utilisateur introuvable' })
        return res.json(userRetry)
      } catch (retryErr) {
        return res.status(500).json({ error: retryErr.message })
      }
    }
    return res.status(500).json({ error: err.message })
  }
}

export async function updateProfile(req, res) {
  try {
    const userId = req.user.id
    const { fullname, email, phone, restaurant } = req.body
    
    // Validate inputs if necessary
    
    await update(userId, { fullname, email, restaurant })
    const updatedUser = await findById(userId)
    
    return res.json(updatedUser)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

function validatePassword(pwd) {
  if (typeof pwd !== 'string' || pwd.length < 8) return false
  const hasUpper = /[A-Z]/.test(pwd)
  const hasLower = /[a-z]/.test(pwd)
  const hasDigit = /\d/.test(pwd)
  return hasUpper && hasLower && hasDigit
}

export async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body || {}
    if (!email) return res.status(400).json({ error: 'email requis' })
    const user = await findByEmail(email)
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' })
    const code = String(Math.floor(100000 + Math.random() * 900000))
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
    const ok = await setResetCodeByEmail(email, code, expiresAt)
    if (!ok) return res.status(500).json({ error: 'Impossible de définir le code' })
    await sendResetCodeMail(email, code)
    return res.json({
      message: 'Code envoyé',
      expires_at: expiresAt.toISOString(),
      ...(IS_PRODUCTION ? {} : { debug_code: code })
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export async function verifyResetCode(req, res) {
  try {
    const { email, code } = req.body || {}
    if (!email || !code) return res.status(400).json({ error: 'email et code requis' })
    const user = await findByEmail(email)
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' })
    if (!user.reset_code || !user.reset_expires) return res.status(400).json({ error: 'Aucun code en attente' })
    const notExpired = new Date(user.reset_expires).getTime() >= Date.now()
    if (!notExpired) return res.status(400).json({ error: 'Code expiré' })
    if (String(user.reset_code) !== String(code)) return res.status(400).json({ error: 'Code invalide' })
    return res.json({ valid: true })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export async function confirmResetPassword(req, res) {
  try {
    const { email, code, new_password } = req.body || {}
    if (!email || !code || !new_password) {
      return res.status(400).json({ error: 'email, code, new_password requis' })
    }
    if (!validatePassword(new_password)) {
      return res.status(400).json({ error: 'Mot de passe faible: 8+ chars, maj, min, chiffre' })
    }
    const user = await findByEmail(email)
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' })
    if (!user.reset_code || !user.reset_expires) return res.status(400).json({ error: 'Aucun code en attente' })
    const notExpired = new Date(user.reset_expires).getTime() >= Date.now()
    if (!notExpired) return res.status(400).json({ error: 'Code expiré' })
    if (String(user.reset_code) !== String(code)) return res.status(400).json({ error: 'Code invalide' })
    const hash = await bcrypt.hash(new_password, 10)
    const ok = await updatePasswordByEmail(email, hash)
    if (!ok) return res.status(500).json({ error: 'Mise à jour du mot de passe impossible' })
    await clearResetCodeByEmail(email)
    return res.json({ message: 'Mot de passe mis à jour' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
