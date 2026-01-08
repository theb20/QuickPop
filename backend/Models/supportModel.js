import db from '../config/db.js'

export async function ensureSupportTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS support (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      subject VARCHAR(150) NOT NULL,
      message TEXT NOT NULL,
      status ENUM('open','in_progress','closed') DEFAULT 'open',
      priority ENUM('low','medium','high','urgent') DEFAULT 'medium',
      assigned_to INT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      closed_at TIMESTAMP NULL,
      INDEX idx_status (status),
      INDEX idx_user (user_id)
    ) ENGINE=InnoDB;
  `
  await db.query(sql)
}

