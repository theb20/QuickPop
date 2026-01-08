import db from '../config/db.js'

export async function ensureTrainingsTables() {
  const trainingSql = `
    CREATE TABLE IF NOT EXISTS trainings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      estimated_time VARCHAR(50),
      video_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_video (video_id)
    ) ENGINE=InnoDB;
  `
  await db.query(trainingSql)

  // Try to add video_id column if it doesn't exist (for existing tables)
  try {
    await db.query(`ALTER TABLE trainings ADD COLUMN video_id INT`)
    await db.query(`CREATE INDEX idx_video ON trainings(video_id)`)
  } catch (e) {
    // Column likely already exists
  }

  const userTrainingSql = `
    CREATE TABLE IF NOT EXISTS user_trainings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      training_id INT NOT NULL,
      progress INT DEFAULT 0,
      status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user (user_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (training_id) REFERENCES trainings(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
  `
  await db.query(userTrainingSql)
  
  // Seed some data if empty
  const [rows] = await db.query('SELECT count(*) as count FROM trainings')
  if (rows[0].count === 0) {
    await db.query(`INSERT INTO trainings (title, estimated_time) VALUES 
      ('Management d\\'équipe', '2h 15min'),
      ('Procédures d\\'urgence', '1h 30min'),
      ('Hygiène HACCP', '4h 00min'),
      ('Accueil Client', '1h 45min')
    `)
  }
}

export async function findTrainingByVideoId(videoId) {
  const [rows] = await db.query('SELECT * FROM trainings WHERE video_id = ?', [videoId])
  return rows[0]
}

export async function createTrainingFromVideo(video) {
  const title = video.title || 'Formation Vidéo'
  // Estimate time based on duration (seconds)
  const duration = video.duration || 0
  const mins = Math.floor(duration / 60)
  const estimatedTime = mins > 60 ? `${Math.floor(mins/60)}h ${mins%60}min` : `${mins}min`

  const [res] = await db.query(
    'INSERT INTO trainings (title, description, estimated_time, video_id) VALUES (?, ?, ?, ?)',
    [title, video.description, estimatedTime, video.id]
  )
  return res.insertId
}

export async function updateUserTrainingProgress(userId, trainingId, progress, status) {
  // Check if entry exists
  const [existing] = await db.query(
    'SELECT * FROM user_trainings WHERE user_id = ? AND training_id = ?',
    [userId, trainingId]
  )

  if (existing.length > 0) {
    // Don't downgrade status from completed
    let newStatus = status
    if (existing[0].status === 'completed') {
      newStatus = 'completed'
    }

    await db.query(
      'UPDATE user_trainings SET progress = ?, status = ? WHERE id = ?',
      [progress, newStatus, existing[0].id]
    )
  } else {
    await db.query(
      'INSERT INTO user_trainings (user_id, training_id, progress, status) VALUES (?, ?, ?, ?)',
      [userId, trainingId, progress, status]
    )
  }
}


export async function getUserTrainings(userId) {
  const sql = `
    SELECT 
      t.id, 
      t.title as module, 
      t.estimated_time as estimatedTime, 
      ut.progress, 
      ut.status,
      t.video_id as videoId,
      v.duration,
      v.video_url as videoUrl
    FROM user_trainings ut
    JOIN trainings t ON ut.training_id = t.id
    LEFT JOIN videos v ON t.video_id = v.id
    WHERE ut.user_id = ? AND ut.status = 'in_progress'
    ORDER BY ut.updated_at DESC
  `
  const [rows] = await db.query(sql, [userId])
  return rows
}

export async function getTrainingStats(userId) {
    const [rows] = await db.query(`
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
            AVG(progress) as avg_progress
        FROM user_trainings ut
        JOIN trainings t ON ut.training_id = t.id
        WHERE ut.user_id = ? AND t.video_id IS NOT NULL
    `, [userId])
    
    const stats = rows[0] || { total: 0, completed: 0, avg_progress: 0 }
    
    // Calculate total hours based on actual video duration
    const [durationRow] = await db.query(`
        SELECT SUM(v.duration) as total_seconds
        FROM user_trainings ut
        JOIN trainings t ON ut.training_id = t.id
        JOIN videos v ON t.video_id = v.id
        WHERE ut.user_id = ? AND ut.status = 'completed'
    `, [userId])

    const totalHours = durationRow[0].total_seconds ? (durationRow[0].total_seconds / 3600) : 0
    
    return {
        completionRate: Math.round(stats.avg_progress || 0),
        totalHours: Math.round(totalHours * 10) / 10, // Round to 1 decimal place
        certificatesEarned: stats.completed || 0,
        averageScore: 0 // No quizzes yet
    }
}
