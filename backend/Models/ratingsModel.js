import db from '../config/db.js'

export async function ensureRatingsTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS ratings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      video_id INT NOT NULL,
      user_id INT NOT NULL,
      score INT NOT NULL CHECK (score >= 1 AND score <= 5),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_rating (video_id, user_id),
      INDEX idx_video (video_id),
      INDEX idx_user (user_id)
    ) ENGINE=InnoDB;
  `
  await db.query(sql)
}

export async function addRating(videoId, userId, score) {
  const [res] = await db.query(
    'INSERT INTO ratings (video_id, user_id, score) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE score = VALUES(score)',
    [videoId, userId, score]
  )
  return res
}

export async function getVideoRating(videoId) {
  const [rows] = await db.query(
    'SELECT AVG(score) as average, COUNT(*) as count, SUM(score) as total_score FROM ratings WHERE video_id = ?',
    [videoId]
  )
  return rows[0]
}
