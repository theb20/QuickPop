import db from '../config/db.js'

export async function ensureNotificationsTable() {
  const createSql = `
    CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      title VARCHAR(150) NOT NULL,
      body TEXT NOT NULL,
      type ENUM('info','success','warning','error') DEFAULT 'info',
      status ENUM('unread','read') DEFAULT 'unread',
      url VARCHAR(500) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      read_at TIMESTAMP NULL,
      CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user_status (user_id, status),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB;
  `
  await db.query(createSql)
}

export async function createNotification(userId, { title, body, type = 'info', url = null }) {
  const sql = `
    INSERT INTO notifications (user_id, title, body, type, url)
    VALUES (?, ?, ?, ?, ?)
  `
  const [result] = await db.query(sql, [userId, title, body, type, url])
  
  // Cleanup: Keep only latest 20 for this user
  try {
    const cleanupSql = `
      DELETE FROM notifications 
      WHERE user_id = ? 
      AND id NOT IN (
        SELECT id FROM (
          SELECT id 
          FROM notifications 
          WHERE user_id = ? 
          ORDER BY created_at DESC 
          LIMIT 20
        ) as sub
      )
    `
    await db.query(cleanupSql, [userId, userId])
  } catch (error) {
    console.error('Error cleaning up notifications for user:', userId, error)
  }

  const [rows] = await db.query('SELECT * FROM notifications WHERE id = ?', [result.insertId])
  return rows[0]
}

export async function getUserNotifications(userId, limit = 20, offset = 0) {
  const sql = `
    SELECT * FROM notifications 
    WHERE user_id = ? 
    ORDER BY created_at DESC 
    LIMIT ? OFFSET ?
  `
  const [rows] = await db.query(sql, [userId, limit, offset])
  return rows
}

export async function markNotificationRead(id) {
  const sql = `UPDATE notifications SET status = 'read', read_at = NOW() WHERE id = ?`
  const [result] = await db.query(sql, [id])
  return result.affectedRows > 0
}

export async function markAllNotificationsRead(userId) {
  const sql = `UPDATE notifications SET status = 'read', read_at = NOW() WHERE user_id = ? AND status = 'unread'`
  const [result] = await db.query(sql, [userId])
  return result.affectedRows > 0
}

export async function createBroadcastNotification({ title, body, type = 'info', url = null }) {
  const sql = `
    INSERT INTO notifications (user_id, title, body, type, url)
    SELECT id, ?, ?, ?, ? FROM users
  `
  const [result] = await db.query(sql, [title, body, type, url])

  // Cleanup for all users: Keep only latest 20
  try {
    // Try using Window Functions (MySQL 8.0+)
    const cleanupSql = `
      DELETE FROM notifications 
      WHERE id IN (
        SELECT id FROM (
          SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
          FROM notifications
        ) t
        WHERE rn > 20
      )
    `
    await db.query(cleanupSql)
  } catch (error) {
    console.warn('Window functions not supported (likely MySQL 5.7), falling back to simpler cleanup', error.message)
    // Fallback: Delete the oldest for anyone with > 20 (maintain sliding window)
    const fallbackSql = `
      DELETE n 
      FROM notifications n
      JOIN (
          SELECT user_id, MIN(created_at) as min_created_at
          FROM notifications
          GROUP BY user_id
          HAVING COUNT(*) > 20
      ) as to_delete ON n.user_id = to_delete.user_id AND n.created_at = to_delete.min_created_at
    `
    await db.query(fallbackSql)
  }

  return result.affectedRows
}
