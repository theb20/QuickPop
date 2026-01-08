import db from '../config/db.js'

export async function ensureVideosTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS videos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      description TEXT,
      video_url VARCHAR(500) NOT NULL,
      thumbnail_url VARCHAR(500),
      cloud_provider ENUM('aws_s3','cloudinary','azure','gcs','bunny','google_drive','dropbox','other') DEFAULT 'other',
      cloud_file_id VARCHAR(255),
      cloud_bucket VARCHAR(150),
      duration INT,
      file_size BIGINT,
      resolution VARCHAR(20),
      format VARCHAR(20),
      bitrate INT,
      views INT DEFAULT 0,
      category_id INT NOT NULL,
      uploaded_by INT NOT NULL,
      is_public BOOLEAN DEFAULT TRUE,
      is_featured BOOLEAN DEFAULT FALSE,
      is_trending BOOLEAN DEFAULT FALSE,
      processing_status ENUM('uploading','processing','ready','failed') DEFAULT 'uploading',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_category (category_id),
      INDEX idx_uploader (uploaded_by),
      INDEX idx_created (created_at),
      INDEX idx_public (is_public),
      INDEX idx_status (processing_status),
      INDEX idx_cloud_id (cloud_file_id)
    ) ENGINE=InnoDB;
  `
  await db.query(sql)

  // Add missing columns if they don't exist (migration)
  try {
    const [cols] = await db.query('SHOW COLUMNS FROM videos')
    const colNames = cols.map(c => c.Field)
    
    if (!colNames.includes('duration')) {
        await db.query('ALTER TABLE videos ADD COLUMN duration INT')
    }
    if (!colNames.includes('processing_status')) {
        await db.query("ALTER TABLE videos ADD COLUMN processing_status ENUM('uploading','processing','ready','failed') DEFAULT 'uploading'")
    }
    if (!colNames.includes('is_public')) {
        await db.query('ALTER TABLE videos ADD COLUMN is_public BOOLEAN DEFAULT TRUE')
    }
    if (!colNames.includes('is_featured')) {
        await db.query('ALTER TABLE videos ADD COLUMN is_featured BOOLEAN DEFAULT FALSE')
    }
    if (!colNames.includes('is_trending')) {
        await db.query('ALTER TABLE videos ADD COLUMN is_trending BOOLEAN DEFAULT FALSE')
    }
    if (!colNames.includes('certification_id')) {
        await db.query('ALTER TABLE videos ADD COLUMN certification_id INT NULL')
        // Try to add FK constraint, might fail if data is inconsistent but that's fine for now
        try {
            await db.query('ALTER TABLE videos ADD CONSTRAINT fk_video_certification FOREIGN KEY (certification_id) REFERENCES certifications(id) ON DELETE SET NULL')
        } catch(e) { console.log('FK constraint creation skipped or failed', e.message) }
    }
    if (!colNames.includes('uploaded_by')) {
        await db.query('ALTER TABLE videos ADD COLUMN uploaded_by INT NOT NULL DEFAULT 1')
    }
    if (!colNames.includes('cloud_provider')) {
        await db.query("ALTER TABLE videos ADD COLUMN cloud_provider ENUM('aws_s3','cloudinary','azure','gcs','bunny','google_drive','dropbox','backblaze','other') DEFAULT 'other'")
    } else {
        // Check if we need to update the ENUM
        const cloudProviderCol = cols.find(c => c.Field === 'cloud_provider')
        if (cloudProviderCol && (!cloudProviderCol.Type.includes('backblaze'))) {
             await db.query("ALTER TABLE videos MODIFY COLUMN cloud_provider ENUM('aws_s3','cloudinary','azure','gcs','bunny','google_drive','dropbox','backblaze','other') DEFAULT 'other'")
        }
    }
    if (!colNames.includes('cloud_file_id')) {
        await db.query('ALTER TABLE videos ADD COLUMN cloud_file_id VARCHAR(255)')
    }
    if (!colNames.includes('cloud_bucket')) {
        await db.query('ALTER TABLE videos ADD COLUMN cloud_bucket VARCHAR(150)')
    }
    if (!colNames.includes('video_url')) {
        // In case it was missing or named differently, but it's a core field
    }
    
    // Legacy column support: user_id might exist and be NOT NULL
    if (colNames.includes('user_id')) {
        await db.query('ALTER TABLE videos MODIFY COLUMN user_id INT NULL')
    }
  } catch (e) {
    console.error('Migration error:', e)
  }
}

export async function getVideoById(id) {
  const [rows] = await db.query(
    `SELECT v.*, c.name as category_name,
     (SELECT COUNT(*) FROM likes WHERE video_id = v.id) as likes_count,
     (SELECT COALESCE(AVG(score), 0) FROM ratings WHERE video_id = v.id) as average_rating,
     (SELECT COALESCE(SUM(score), 0) FROM ratings WHERE video_id = v.id) as total_rating_score
     FROM videos v
     LEFT JOIN categories c ON v.category_id = c.id
     WHERE v.id = ?`,
    [id]
  )
  return rows[0]
}

export async function updateVideoUrlInDb(id, newUrl) {
  await db.query('UPDATE videos SET video_url = ? WHERE id = ?', [newUrl, id])
}

export async function fixLocalhostUrls() {
  const sqlVideo = `
    UPDATE videos
    SET video_url = REPLACE(video_url, 'http://localhost:3000', '')
    WHERE video_url LIKE 'http://localhost:3000/%'
  `
  const sqlThumb = `
    UPDATE videos
    SET thumbnail_url = REPLACE(thumbnail_url, 'http://localhost:3000', '')
    WHERE thumbnail_url LIKE 'http://localhost:3000/%'
  `
  const [res1] = await db.query(sqlVideo)
  const [res2] = await db.query(sqlThumb)
  return { video: res1, thumbnail: res2 }
}


export async function searchVideos(query) {
  if (!query) return []
  const [rows] = await db.query(
    `SELECT v.*, c.name as category_name,
     (SELECT COUNT(*) FROM likes WHERE video_id = v.id) as likes_count,
     (SELECT COALESCE(AVG(score), 0) FROM ratings WHERE video_id = v.id) as average_rating,
     (SELECT COALESCE(SUM(score), 0) FROM ratings WHERE video_id = v.id) as total_rating_score
     FROM videos v
     LEFT JOIN categories c ON v.category_id = c.id
     WHERE v.title LIKE ? 
     OR v.description LIKE ? 
     OR c.name LIKE ?`,
    [`%${query}%`, `%${query}%`, `%${query}%`]
  )
  return rows
}

export async function findByCategory(categoryId, { limit = 50, offset = 0 } = {}) {
  const [rows] = await db.query(
    `SELECT v.*, 
     (SELECT COUNT(*) FROM likes WHERE video_id = v.id) as likes_count,
     (SELECT COALESCE(AVG(score), 0) FROM ratings WHERE video_id = v.id) as average_rating,
     (SELECT COALESCE(SUM(score), 0) FROM ratings WHERE video_id = v.id) as total_rating_score
     FROM videos v 
     WHERE category_id = ? 
     ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [categoryId, Number(limit), Number(offset)]
  )
  return rows
}

export async function incrementViews(id) {
  const [res] = await db.query(
    'UPDATE videos SET views = views + 1 WHERE id = ?',
    [id]
  )
  return res.affectedRows > 0
}

export async function getLatestVideosPerCategory(limit = 6) {
  const sql = `
    SELECT v.*, c.name as category_name,
    (SELECT COUNT(*) FROM likes WHERE video_id = v.id) as likes_count,
    (SELECT COALESCE(AVG(score), 0) FROM ratings WHERE video_id = v.id) as average_rating,
    (SELECT COALESCE(SUM(score), 0) FROM ratings WHERE video_id = v.id) as total_rating_score
    FROM videos v
    JOIN categories c ON v.category_id = c.id
    WHERE v.id IN (
        SELECT MAX(id)
        FROM videos
        WHERE is_public = TRUE AND processing_status = 'ready'
        GROUP BY category_id
    )
    ORDER BY v.created_at DESC
    LIMIT ?
  `
  const [rows] = await db.query(sql, [Number(limit)])
  return rows
}

export async function getFeaturedVideos(limit = 10) {
  const [rows] = await db.query(
    `SELECT v.*, c.name as category_name,
     (SELECT COUNT(*) FROM likes WHERE video_id = v.id) as likes_count,
     (SELECT COALESCE(AVG(score), 0) FROM ratings WHERE video_id = v.id) as average_rating,
     (SELECT COALESCE(SUM(score), 0) FROM ratings WHERE video_id = v.id) as total_rating_score
     FROM videos v 
     LEFT JOIN categories c ON v.category_id = c.id 
     WHERE v.is_featured = TRUE AND v.is_public = TRUE 
     ORDER BY v.created_at DESC LIMIT ?`,
    [Number(limit)]
  )
  return rows
}

export async function getTrendingVideos(limit = 10) {
  const [rows] = await db.query(
    `SELECT v.*, c.name as category_name,
     (SELECT COUNT(*) FROM likes WHERE video_id = v.id) as likes_count,
     (SELECT COALESCE(AVG(score), 0) FROM ratings WHERE video_id = v.id) as average_rating,
     (SELECT COALESCE(SUM(score), 0) FROM ratings WHERE video_id = v.id) as total_rating_score
     FROM videos v 
     LEFT JOIN categories c ON v.category_id = c.id 
     WHERE v.is_trending = TRUE AND v.is_public = TRUE 
     ORDER BY v.created_at DESC LIMIT ?`,
    [Number(limit)]
  )
  return rows
}
