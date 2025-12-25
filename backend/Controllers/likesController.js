import { ensureLikesTable, findLikes } from '../Models/likesModel.js'
import { findById, createOne, updateOne, removeOne } from '../Models/baseModel.js'

const TABLE = 'likes'
const ALLOWED = ['video_id','user_id']

export async function initLikesController() {
  await ensureLikesTable()
}

export async function listLikes(req, res) {
  try {
    const limit = Number(req.query.limit || 50)
    const offset = Number(req.query.offset || 0)
    const video_id = req.query.video_id ? Number(req.query.video_id) : null
    const user_id = req.query.user_id ? Number(req.query.user_id) : null

    const rows = await findLikes({ video_id, user_id, limit, offset })
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getLike(req, res) {
  try {
    const id = Number(req.params.id)
    const row = await findById(TABLE, id)
    if (!row) return res.status(404).json({ error: 'Not found' })
    res.json(row)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function createLike(req, res) {
  try {
    const id = await createOne(TABLE, req.body || {}, { allowed: ALLOWED })
    const created = await findById(TABLE, id)
    res.status(201).json(created)
  } catch (err) {
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Déjà aimé' })
    }
    res.status(500).json({ error: err.message })
  }
}

export async function updateLike(req, res) {
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

export async function deleteLike(req, res) {
  try {
    const id = Number(req.params.id)
    const ok = await removeOne(TABLE, id)
    if (!ok) return res.status(404).json({ error: 'Not found' })
    res.status(204).end()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

