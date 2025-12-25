import db from '../Config/db.js'

export async function ensureCommentsTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      video_id INT NOT NULL,
      user_id INT NOT NULL,
      content TEXT NOT NULL,
      parent_id INT NULL,
      is_approved BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_video (video_id),
      INDEX idx_user (user_id),
      INDEX idx_parent (parent_id)
    ) ENGINE=InnoDB;
  `
  await db.query(sql)
}

