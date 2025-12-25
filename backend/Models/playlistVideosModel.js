import db from '../Config/db.js'

export async function ensurePlaylistVideosTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS playlist_videos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      playlist_id INT NOT NULL,
      video_id INT NOT NULL,
      position INT DEFAULT 0,
      added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_playlist_video (playlist_id, video_id),
      INDEX idx_playlist (playlist_id),
      INDEX idx_position (playlist_id, position)
    ) ENGINE=InnoDB;
  `
  await db.query(sql)
}

