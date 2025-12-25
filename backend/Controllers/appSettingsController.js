import { ensureAppSettingsTable } from '../Models/appSettingsModel.js'
import { findAll, findById, createOne, updateOne, removeOne } from '../Models/baseModel.js'
import db from '../Config/db.js'
import bcrypt from 'bcryptjs'

const TABLE = 'app_settings'
const ALLOWED = [
  'app_name','maintenance_mode','max_video_size_mb','allowed_video_formats','cloud_storage_provider',
  'cloud_storage_bucket','support_email','notifications_enabled', 'default_language', 'notification_preferences'
]

export async function initAppSettingsController() {
  await ensureAppSettingsTable()
}

export async function listAppSettings(req, res) {
  try {
    const limit = Number(req.query.limit || 50)
    const offset = Number(req.query.offset || 0)
    const rows = await findAll(TABLE, { limit, offset })
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getAppSetting(req, res) {
  try {
    const id = Number(req.params.id)
    const row = await findById(TABLE, id)
    if (!row) return res.status(404).json({ error: 'Not found' })
    res.json(row)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get the single global settings object (create if missing)
export async function getGlobalSettings(req, res) {
  try {
    const rows = await findAll(TABLE, { limit: 1 })
    if (rows.length > 0) {
      res.json(rows[0])
    } else {
      // Create default if not exists
      const defaultSettings = {
        app_name: 'QuickPop',
        support_email: 'contact@quickpop.fr',
        default_language: 'Français',
        notifications_enabled: true
      }
      const id = await createOne(TABLE, defaultSettings, { allowed: ALLOWED })
      const created = await findById(TABLE, id)
      res.json(created)
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Update the single global settings object
export async function updateGlobalSettings(req, res) {
  try {
    const rows = await findAll(TABLE, { limit: 1 })
    let id
    if (rows.length > 0) {
      id = rows[0].id
    } else {
       id = await createOne(TABLE, {}, { allowed: ALLOWED })
    }
    
    const ok = await updateOne(TABLE, id, req.body, { allowed: ALLOWED })
    const updated = await findById(TABLE, id)
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function createAppSetting(req, res) {
  try {
    const id = await createOne(TABLE, req.body || {}, { allowed: ALLOWED })
    const created = await findById(TABLE, id)
    res.status(201).json(created)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function updateAppSetting(req, res) {
  try {
    const id = Number(req.params.id)
    const ok = await updateOne(TABLE, id, req.body || {}, { allowed: ALLOWED })
    if (!ok) return res.status(400).json({ error: 'Aucune modification' })
    const updated = await findById(TABLE, id)
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function deleteAppSetting(req, res) {
  try {
    const id = Number(req.params.id)
    const ok = await removeOne(TABLE, id)
    if (!ok) return res.status(404).json({ error: 'Not found' })
    res.status(204).end()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function resetData(req, res) {
  try {
    // Disable FK checks
    await db.query('SET FOREIGN_KEY_CHECKS = 0')
    
    // Truncate tables
    const tables = [
      'user_certifications', 'playlist_videos', 'comments', 'likes', 'ratings',
      'videos', 'playlists', 'certifications', 'users', 'support_tickets', 'notifications'
    ]
    
    for (const t of tables) {
      try {
        await db.query(`TRUNCATE TABLE ${t}`)
      } catch (e) {
        // Ignore if table doesn't exist
      }
    }
    
    await db.query('SET FOREIGN_KEY_CHECKS = 1')
    
    res.json({ message: 'Toutes les données ont été réinitialisées.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function importUsers(req, res) {
  try {
    const users = req.body.users 
    if (!Array.isArray(users)) return res.status(400).json({ error: 'Format invalide, tableau attendu' })
    
    let count = 0
    for (const u of users) {
      if (!u.email || !u.password) continue
      
      const hashedPassword = await bcrypt.hash(u.password, 10)
      
      try {
        await db.query(
          'INSERT INTO users (fullname, email, password, role, is_active) VALUES (?, ?, ?, ?, ?)',
          [u.fullname || 'Utilisateur', u.email, hashedPassword, u.role || 'user', u.is_active !== undefined ? u.is_active : true]
        )
        count++
      } catch (e) {
        // Duplicate entry likely, skip
        console.error('Import error for user', u.email, e.message)
      }
    }
    
    res.json({ message: `${count} utilisateurs importés avec succès.` })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
