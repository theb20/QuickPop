import db from '../config/db.js'

export async function ensureLikesTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS likes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      video_id INT NOT NULL,
      user_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_like (video_id, user_id),
      INDEX idx_video (video_id),
      INDEX idx_user (user_id)
    ) ENGINE=InnoDB;
  `
  await db.query(sql)
}

export async function findLikes({ video_id, user_id, limit = 50, offset = 0 }) {
  let query = 'SELECT * FROM likes WHERE 1=1'
  const params = []

  if (video_id) {
    query += ' AND video_id = ?'
    params.push(video_id)
  }
  if (user_id) {
    query += ' AND user_id = ?'
    params.push(user_id)
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
  params.push(Number(limit), Number(offset))

  const [rows] = await db.query(query, params)
  return rows
}

