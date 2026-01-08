import db from '../config/db.js'

export async function ensureCertificationsTables() {
  const certSql = `
    CREATE TABLE IF NOT EXISTS certifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      validity_months INT DEFAULT 12,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `
  await db.query(certSql)

  // Migration for description
  try {
      const [cols] = await db.query('SHOW COLUMNS FROM certifications')
      const colNames = cols.map(c => c.Field)
      if (!colNames.includes('description')) {
          await db.query('ALTER TABLE certifications ADD COLUMN description TEXT')
      }
  } catch(e) { console.error(e) }

  const userCertSql = `
    CREATE TABLE IF NOT EXISTS user_certifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      certification_id INT NOT NULL,
      obtained_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP NULL,
      status ENUM('valid', 'expired', 'revoked') DEFAULT 'valid',
      INDEX idx_user (user_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (certification_id) REFERENCES certifications(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
  `
  await db.query(userCertSql)

  // Seed
  // Removed automatic seeding of fictional certifications
}

export async function awardCertificateById(userId, certId) {
  // 1. Check if user already has it
  const [existing] = await db.query(
    'SELECT id FROM user_certifications WHERE user_id = ? AND certification_id = ?',
    [userId, certId]
  )

  if (existing.length === 0) {
    const obtained = new Date()
    // Get validity from certification definition
    const [cert] = await db.query('SELECT validity_months FROM certifications WHERE id = ?', [certId])
    const validityMonths = (cert[0] && cert[0].validity_months) ? cert[0].validity_months : 12

    const expires = new Date(obtained)
    expires.setMonth(expires.getMonth() + validityMonths)

    await db.query(
      `INSERT INTO user_certifications (user_id, certification_id, obtained_at, expires_at, status) 
       VALUES (?, ?, ?, ?, 'valid')`,
      [userId, certId, obtained, expires]
    )
    return true
  }
  return false
}

export async function awardCertificateForTraining(userId, trainingTitle) {
  // 1. Find or create certification definition
  let [rows] = await db.query('SELECT id FROM certifications WHERE name = ?', [trainingTitle])
  let certId
  if (rows.length === 0) {
    const [res] = await db.query('INSERT INTO certifications (name) VALUES (?)', [trainingTitle])
    certId = res.insertId
  } else {
    certId = rows[0].id
  }

  // 2. Check if user already has it
  const [existing] = await db.query(
    'SELECT id FROM user_certifications WHERE user_id = ? AND certification_id = ?',
    [userId, certId]
  )

  if (existing.length === 0) {
    const obtained = new Date()
    const expires = new Date(obtained)
    expires.setMonth(expires.getMonth() + 12) // Default 1 year validity

    await db.query(
      `INSERT INTO user_certifications (user_id, certification_id, obtained_at, expires_at, status) 
       VALUES (?, ?, ?, ?, 'valid')`,
      [userId, certId, obtained, expires]
    )
    return true
  }
  return false
}

export async function getUserCertifications(userId) {
  const sql = `
    SELECT c.name, uc.obtained_at as date, uc.status, uc.expires_at as validUntil
    FROM user_certifications uc
    JOIN certifications c ON uc.certification_id = c.id
    WHERE uc.user_id = ?
    ORDER BY uc.obtained_at DESC
  `
  const [rows] = await db.query(sql, [userId])
  return rows.map(r => ({
      ...r,
      date: new Date(r.date).toLocaleDateString('fr-FR'),
      validUntil: r.validUntil ? new Date(r.validUntil).toLocaleDateString('fr-FR') : 'Illimité'
  }))
}

export async function getAllCertifications() {
  const sql = `
    SELECT c.*, 
    (SELECT COUNT(*) FROM user_certifications uc WHERE uc.certification_id = c.id) as issued_count
    FROM certifications c
    ORDER BY c.created_at DESC
  `
  const [rows] = await db.query(sql)
  return rows
}

export async function createCertification({ name, validity_months = 12, description = '' }) {
  const [res] = await db.query(
    'INSERT INTO certifications (name, validity_months, description) VALUES (?, ?, ?)',
    [name, validity_months, description]
  )
  return res.insertId
}

export async function updateCertification(id, { name, validity_months, description }) {
  const [res] = await db.query(
    'UPDATE certifications SET name = ?, validity_months = ?, description = ? WHERE id = ?',
    [name, validity_months, description, id]
  )
  return res.affectedRows > 0
}

export async function deleteCertification(id) {
  const [res] = await db.query('DELETE FROM certifications WHERE id = ?', [id])
  return res.affectedRows > 0
}

export async function getCertificationHolders(certId) {
  const sql = `
    SELECT u.id, u.fullname, u.email, u.restaurant, uc.obtained_at, uc.expires_at, uc.status
    FROM user_certifications uc
    JOIN users u ON uc.user_id = u.id
    WHERE uc.certification_id = ?
    ORDER BY uc.obtained_at DESC
  `
  const [rows] = await db.query(sql, [certId])
  return rows
}
