import db from '../config/db.js'

export async function findAll(table, { columns = ['*'], limit = 50, offset = 0, orderBy = 'id', orderDir = 'DESC' } = {}) {
  const cols = columns.join(', ')
  const [rows] = await db.query(
    `SELECT ${cols} FROM \`${table}\` ORDER BY \`${orderBy}\` ${orderDir} LIMIT ? OFFSET ?`,
    [Number(limit), Number(offset)]
  )
  return rows
}

export async function findById(table, id, { columns = ['*'], pk = 'id' } = {}) {
  const cols = columns.join(', ')
  const [rows] = await db.query(
    `SELECT ${cols} FROM \`${table}\` WHERE \`${pk}\` = ?`,
    [id]
  )
  return rows[0] || null
}

export async function createOne(table, payload, { allowed = null } = {}) {
  const data = {}
  for (const [k, v] of Object.entries(payload || {})) {
    if (!allowed || allowed.includes(k)) data[k] = v
  }
  const keys = Object.keys(data)
  if (keys.length === 0) throw new Error('No valid fields to insert')
  const placeholders = keys.map(() => '?').join(', ')
  const [res] = await db.query(
    `INSERT INTO \`${table}\` (${keys.map(k => `\`${k}\``).join(', ')}) VALUES (${placeholders})`,
    keys.map(k => data[k])
  )
  return res.insertId
}

export async function updateOne(table, id, payload, { allowed = null, pk = 'id' } = {}) {
  const data = {}
  for (const [k, v] of Object.entries(payload || {})) {
    if (!allowed || allowed.includes(k)) data[k] = v
  }
  const keys = Object.keys(data)
  if (keys.length === 0) return false
  const setClause = keys.map(k => `\`${k}\` = ?`).join(', ')
  const [res] = await db.query(
    `UPDATE \`${table}\` SET ${setClause} WHERE \`${pk}\` = ?`,
    [...keys.map(k => data[k]), id]
  )
  return res.affectedRows > 0
}

export async function removeOne(table, id, { pk = 'id' } = {}) {
  const [res] = await db.query(
    `DELETE FROM \`${table}\` WHERE \`${pk}\` = ?`,
    [id]
  )
  return res.affectedRows > 0
}

