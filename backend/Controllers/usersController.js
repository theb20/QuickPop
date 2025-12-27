import bcrypt from 'bcryptjs'
import { ensureUsersTable, findAll, findById, create, update, remove } from '../models/usersModel.js'
import { sendAccountValidationMail } from '../Config/mailer.js'

export async function initUsersController() {
  await ensureUsersTable()
}

export async function listUsers(req, res) {
  try {
    const limit = Number(req.query.limit || 50)
    const offset = Number(req.query.offset || 0)
    const users = await findAll({ limit, offset })
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getUser(req, res) {
  try {
    const id = Number(req.params.id)
    const user = await findById(id)
    if (!user) return res.status(404).json({ error: 'Not found' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function createUser(req, res) {
  try {
    const { fullname, email, password, role = 'user', code, avatar_url = null, restaurant = null } = req.body || {}
    if (!fullname || !email || !password || code === undefined || code === null) {
      return res.status(400).json({ error: 'fullname, email, password, code requis' })
    }
    const hash = await bcrypt.hash(password, 10)
    const id = await create({ fullname, email, code, password: hash, role, avatar_url, restaurant })
    const created = await findById(id)
    res.status(201).json(created)
  } catch (err) {
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email ou code déjà utilisé' })
    }
    res.status(500).json({ error: err.message })
  }
}

export async function updateUser(req, res) {
  try {
    const id = Number(req.params.id)
    const existing = await findById(id)
    if (!existing) return res.status(404).json({ error: 'Not found' })

    const patch = { ...req.body }
    
    // Remove system fields that should not be manually updated via API
    delete patch.last_login;
    delete patch.created_at;
    delete patch.updated_at;
    delete patch.reset_code;
    delete patch.reset_expires;

    if (patch.password) {
      patch.password = await bcrypt.hash(patch.password, 10)
    }

    const ok = await update(id, patch)
    if (!ok) return res.status(400).json({ error: 'Aucune modification' })
    const updated = await findById(id)

    // Check if user has been activated (is_active changed from 0/false to 1/true)
    const wasInactive = existing.is_active === 0 || existing.is_active === false
    const isNowActive = updated.is_active === 1 || updated.is_active === true

    if (wasInactive && isNowActive) {
        try {
            await sendAccountValidationMail(updated.email, updated.fullname)
        } catch (mailErr) {
            console.error('Failed to send validation email:', mailErr)
            // Don't block response, just log error
        }
    }

    res.json(updated)
  } catch (err) {
    console.error('Update User Error:', err);
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email ou code déjà utilisé' })
    }
    res.status(500).json({ error: err.message })
  }
}

export async function deleteUser(req, res) {
  try {
    const id = Number(req.params.id)
    const ok = await remove(id)
    if (!ok) return res.status(404).json({ error: 'Not found' })
    res.status(204).end()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
