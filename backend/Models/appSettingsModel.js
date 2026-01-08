import db from '../config/db.js'

export async function ensureAppSettingsTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS app_settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      app_name VARCHAR(100) DEFAULT 'QuickPop',
      maintenance_mode BOOLEAN DEFAULT FALSE,
      max_video_size_mb INT DEFAULT 500,
      allowed_video_formats VARCHAR(255) DEFAULT 'mp4,webm,mov,avi,mkv',
      cloud_storage_provider VARCHAR(50) DEFAULT 'aws_s3',
      cloud_storage_bucket VARCHAR(150),
      support_email VARCHAR(150),
      notifications_enabled BOOLEAN DEFAULT TRUE,
      default_language VARCHAR(50) DEFAULT 'Français',
      notification_preferences JSON,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `
  await db.query(sql)

  // Migration simple : ajout des colonnes si elles manquent
  const columns = [
    "ADD COLUMN app_name VARCHAR(100) DEFAULT 'QuickPop'",
    "ADD COLUMN maintenance_mode BOOLEAN DEFAULT FALSE",
    "ADD COLUMN max_video_size_mb INT DEFAULT 500",
    "ADD COLUMN allowed_video_formats VARCHAR(255) DEFAULT 'mp4,webm,mov,avi,mkv'",
    "ADD COLUMN cloud_storage_provider VARCHAR(50) DEFAULT 'aws_s3'",
    "ADD COLUMN cloud_storage_bucket VARCHAR(150)",
    "ADD COLUMN support_email VARCHAR(150)",
    "ADD COLUMN notifications_enabled BOOLEAN DEFAULT TRUE",
    "ADD COLUMN default_language VARCHAR(50) DEFAULT 'Français'",
    "ADD COLUMN notification_preferences JSON"
  ]

  for (const col of columns) {
    try {
      await db.query(`ALTER TABLE app_settings ${col}`)
    } catch (e) {
      // Ignore "Duplicate column name" error
    }
  }
}
