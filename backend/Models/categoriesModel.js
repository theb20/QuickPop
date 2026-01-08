import db from '../config/db.js'

export async function ensureCategoriesTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      icon VARCHAR(50),
      link VARCHAR(500),
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_name (name)
    ) ENGINE=InnoDB;
  `
  await db.query(sql)

  // Add missing columns migration
  try {
    const [cols] = await db.query('SHOW COLUMNS FROM categories')
    const colNames = cols.map(c => c.Field)
    
    if (!colNames.includes('description')) {
        await db.query('ALTER TABLE categories ADD COLUMN description TEXT')
    }
  } catch (e) {
    console.error('Categories migration error:', e)
  }
}

export async function searchCategories(query) {
  if (!query) return []
  
  // Check if description column exists before querying
  try {
    const [cols] = await db.query('SHOW COLUMNS FROM categories LIKE "description"')
    const hasDescription = cols.length > 0

    let sql = 'SELECT * FROM categories WHERE name LIKE ?'
    let params = [`%${query}%`]

    if (hasDescription) {
      sql += ' OR description LIKE ?'
      params.push(`%${query}%`)
    }

    const [rows] = await db.query(sql, params)
    return rows
  } catch (err) {
    console.error('Search categories error:', err)
    return []
  }
}

