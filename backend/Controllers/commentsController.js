import { ensureCommentsTable } from '../models/commentsModel.js'
import { findAll, findById, createOne, updateOne, removeOne } from '../models/baseModel.js'

const TABLE = 'comments'
const ALLOWED = ['video_id','user_id','content','parent_id','is_approved']

export async function initCommentsController() {
  await ensureCommentsTable()
}

export async function listComments(req, res) {
  try {
    const limit = Number(req.query.limit || 50)
    const offset = Number(req.query.offset || 0)
    const rows = await findAll(TABLE, { limit, offset })
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getComment(req, res) {
  try {
    const id = Number(req.params.id)
    const row = await findById(TABLE, id)
    if (!row) return res.status(404).json({ error: 'Not found' })
    res.json(row)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function createComment(req, res) {
  try {
    const id = await createOne(TABLE, req.body || {}, { allowed: ALLOWED })
    const created = await findById(TABLE, id)
    res.status(201).json(created)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function updateComment(req, res) {
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

export async function deleteComment(req, res) {
  try {
    const id = Number(req.params.id)
    const ok = await removeOne(TABLE, id)
    if (!ok) return res.status(404).json({ error: 'Not found' })
    res.status(204).end()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

