import db from '../config/db.js'

export async function ensureUsersTable() {
  const createSql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      fullname VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      code INT(10) NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin','user') DEFAULT 'user',
      is_active BOOLEAN DEFAULT TRUE,
      avatar_url VARCHAR(500),
      restaurant VARCHAR(150),
      last_login TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (email),
      INDEX idx_role (role)
    ) ENGINE=InnoDB;
  `
  await db.query(createSql)
  const [cols] = await db.query(
    "SELECT COLUMN_NAME FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'users'"
  )
  const names = new Set(cols.map(c => c.COLUMN_NAME))
  if (!names.has('avatar_url')) {
    await db.query("ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500) NULL")
  }
  if (!names.has('restaurant')) {
    await db.query("ALTER TABLE users ADD COLUMN restaurant VARCHAR(150) NULL")
  }
  if (!names.has('last_login')) {
    await db.query("ALTER TABLE users ADD COLUMN last_login TIMESTAMP NULL")
  }
  if (!names.has('created_at')) {
    await db.query("ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
  }
  if (!names.has('updated_at')) {
    await db.query("ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
  }
  if (!names.has('reset_code')) {
    await db.query("ALTER TABLE users ADD COLUMN reset_code VARCHAR(10) NULL")
  }
  if (!names.has('reset_expires')) {
    await db.query("ALTER TABLE users ADD COLUMN reset_expires TIMESTAMP NULL")
  }
  await db.query("UPDATE users SET role = 'user' WHERE role NOT IN ('admin','user') OR role IS NULL")
  await db.query("ALTER TABLE users MODIFY COLUMN role ENUM('admin','user') DEFAULT 'user'")
}

export async function findAll({ limit = 50, offset = 0 } = {}) {
  const [rows] = await db.query(
    `SELECT 
      u.id, u.fullname, u.email, u.code, u.role, u.is_active, u.avatar_url, u.restaurant, u.last_login, u.created_at, u.updated_at,
      (SELECT COUNT(*) FROM user_certifications uc WHERE uc.user_id = u.id AND uc.status = 'valid') as certs_count,
      (SELECT COALESCE(ROUND(AVG(progress)), 0) FROM user_trainings ut WHERE ut.user_id = u.id) as avg_progress
    FROM users u 
    ORDER BY u.id DESC 
    LIMIT ? OFFSET ?`,
    [Number(limit), Number(offset)]
  )
  return rows
}

export async function findById(id) {
  const [rows] = await db.query(
    `SELECT 
      u.id, u.fullname, u.email, u.code, u.role, u.is_active, u.avatar_url, u.restaurant, u.last_login, u.created_at, u.updated_at,
      (SELECT COUNT(*) FROM user_certifications uc WHERE uc.user_id = u.id AND uc.status = 'valid') as certs_count,
      (SELECT COALESCE(ROUND(AVG(progress)), 0) FROM user_trainings ut WHERE ut.user_id = u.id) as avg_progress
    FROM users u 
    WHERE u.id = ?`,
    [id]
  )
  return rows[0] || null
}

export async function create(user) {
  const {
    fullname,
    email,
    code = null,
    password,
    role = 'user',
    is_active = false,
    avatar_url = null,
    restaurant = null,
  } = user

  const [res] = await db.query(
    'INSERT INTO users (fullname, email, code, password, role, is_active, avatar_url, restaurant) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [fullname, email, code, password, role, is_active, avatar_url, restaurant]
  )
  return res.insertId
}

export async function update(id, user) {
  const fields = []
  const values = []

  const allowed = ['fullname', 'email', 'code', 'password', 'role', 'is_active', 'avatar_url', 'restaurant', 'last_login', 'reset_code', 'reset_expires']
  for (const key of allowed) {
    if (user[key] !== undefined) {
      fields.push(`${key} = ?`)
      values.push(user[key])
    }
  }
  if (fields.length === 0) return false
  values.push(id)

  const [res] = await db.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values)
  return res.affectedRows > 0
}

export async function remove(id) {
  const [res] = await db.query('DELETE FROM users WHERE id = ?', [id])
  return res.affectedRows > 0
}

export async function findByEmail(email) {
  const [rows] = await db.query(
    'SELECT id, fullname, email, code, password, role, is_active, avatar_url, restaurant, last_login, created_at, updated_at, reset_code, reset_expires FROM users WHERE email = ?',
    [email]
  )
  return rows[0] || null
}

export async function findByCode(code) {
  const [rows] = await db.query(
    'SELECT id, fullname, email, code, password, role, is_active, avatar_url, restaurant, last_login, created_at, updated_at, reset_code, reset_expires FROM users WHERE code = ?',
    [code]
  )
  return rows[0] || null
}

export async function setResetCodeByEmail(email, code, expiresAt) {
  const [res] = await db.query(
    'UPDATE users SET reset_code = ?, reset_expires = ? WHERE email = ?',
    [code, expiresAt, email]
  )
  return res.affectedRows > 0
}

export async function clearResetCodeByEmail(email) {
  const [res] = await db.query(
    'UPDATE users SET reset_code = NULL, reset_expires = NULL WHERE email = ?',
    [email]
  )
  return res.affectedRows > 0
}

export async function updatePasswordByEmail(email, hash) {
  const [res] = await db.query('UPDATE users SET password = ? WHERE email = ?', [hash, email])
  return res.affectedRows > 0
}
