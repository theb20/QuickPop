import { ensureSupportTable } from '../Models/supportModel.js'
import { findAll, findById, createOne, updateOne, removeOne } from '../Models/baseModel.js'
import { sendSupportMail } from '../Config/mailer.js'

const TABLE = 'support'
const ALLOWED = ['user_id','subject','message','status','priority','assigned_to','closed_at']

export async function initSupportController() {
  await ensureSupportTable()
}

export async function listSupport(req, res) {
  try {
    const limit = Number(req.query.limit || 50)
    const offset = Number(req.query.offset || 0)
    const rows = await findAll(TABLE, { limit, offset })
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getSupport(req, res) {
  try {
    const id = Number(req.params.id)
    const row = await findById(TABLE, id)
    if (!row) return res.status(404).json({ error: 'Not found' })
    res.json(row)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function createSupport(req, res) {
  try {
    const id = await createOne(TABLE, req.body || {}, { allowed: ALLOWED })
    const created = await findById(TABLE, id)
    
    // Envoyer l'email de notification si l'utilisateur est identifié
    if (req.body.user_id) {
      try {
        const user = await findById('users', req.body.user_id)
        if (user) {
          await sendSupportMail(
            user.email,
            user.fullname || user.username || 'Utilisateur',
            req.body.subject,
            req.body.message
          )
        }
      } catch (mailError) {
        console.error('Erreur envoi mail support:', mailError)
        // On ne bloque pas la réponse si le mail échoue
      }
    }

    res.status(201).json(created)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function updateSupport(req, res) {
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

export async function deleteSupport(req, res) {
  try {
    const id = Number(req.params.id)
    const ok = await removeOne(TABLE, id)
    if (!ok) return res.status(404).json({ error: 'Not found' })
    res.status(204).end()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

