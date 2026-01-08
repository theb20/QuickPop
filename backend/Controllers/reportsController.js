import db from '../config/db.js'

export async function generateMonthlyReport(req, res) {
  try {
    const { month, year } = req.query
    const targetDate = new Date(year || new Date().getFullYear(), month ? month - 1 : new Date().getMonth(), 1)
    const nextMonth = new Date(targetDate)
    nextMonth.setMonth(nextMonth.getMonth() + 1)

    // Users registered
    const [users] = await db.query(
      'SELECT COUNT(*) as count FROM users WHERE created_at >= ? AND created_at < ?',
      [targetDate, nextMonth]
    )

    // Certifications issued
    const [certs] = await db.query(
      'SELECT COUNT(*) as count FROM user_certifications WHERE obtained_at >= ? AND obtained_at < ?',
      [targetDate, nextMonth]
    )

    // Videos uploaded
    const [videos] = await db.query(
      'SELECT COUNT(*) as count FROM videos WHERE created_at >= ? AND created_at < ?',
      [targetDate, nextMonth]
    )

    res.json({
      title: `Rapport mensuel - ${targetDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
      date: new Date().toISOString().slice(0,10),
      type: 'Mensuel',
      status: 'Complété',
      data: {
        new_users: users[0].count,
        certifications_issued: certs[0].count,
        videos_uploaded: videos[0].count
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function generateUserStats(req, res) {
  try {
    const [totalUsers] = await db.query('SELECT COUNT(*) as count FROM users')
    const [activeUsers] = await db.query('SELECT COUNT(*) as count FROM users WHERE is_active = 1')
    
    // Top 5 active users by certifications
    const [topUsers] = await db.query(`
      SELECT u.fullname, COUNT(uc.id) as cert_count 
      FROM users u 
      JOIN user_certifications uc ON u.id = uc.user_id 
      WHERE uc.status = 'valid'
      GROUP BY u.id 
      ORDER BY cert_count DESC 
      LIMIT 5
    `)

    res.json({
      title: `Statistiques utilisateurs - Semaine ${getWeekNumber(new Date())}`,
      date: new Date().toISOString().slice(0,10),
      type: 'Utilisateurs',
      status: 'Complété',
      data: {
        total_users: totalUsers[0].count,
        active_users: activeUsers[0].count,
        top_performers: topUsers
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function generateCertStats(req, res) {
  try {
    const [totalIssued] = await db.query('SELECT COUNT(*) as count FROM user_certifications')
    const [validCerts] = await db.query("SELECT COUNT(*) as count FROM user_certifications WHERE status = 'valid'")
    
    // Most popular certifications
    const [popularCerts] = await db.query(`
      SELECT c.name, COUNT(uc.id) as count 
      FROM certifications c
      JOIN user_certifications uc ON c.id = uc.certification_id
      GROUP BY c.id
      ORDER BY count DESC
      LIMIT 5
    `)

    res.json({
      title: `Suivi certifications - Q${Math.floor((new Date().getMonth() + 3) / 3)}`,
      date: new Date().toISOString().slice(0,10),
      type: 'Certifications',
      status: 'Complété',
      data: {
        total_issued: totalIssued[0].count,
        valid_certs: validCerts[0].count,
        popular: popularCerts
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getDashboardStats(req, res) {
  try {
    // Basic stats
    const [users] = await db.query('SELECT COUNT(*) as total, SUM(is_active) as active FROM users')
    const [videos] = await db.query('SELECT COUNT(*) as total, SUM(views) as total_views FROM videos')
    const [certs] = await db.query('SELECT COUNT(*) as total FROM user_certifications')
    
    // Recent activity (Union of certs, signups, videos)
    const [activity] = await db.query(`
      (SELECT 'certification' as type, u.fullname as user, 'a obtenu' as action, c.name as item, uc.obtained_at as time
       FROM user_certifications uc JOIN users u ON uc.user_id = u.id JOIN certifications c ON uc.certification_id = c.id
       ORDER BY uc.obtained_at DESC LIMIT 5)
      UNION ALL
      (SELECT 'signup' as type, fullname as user, 'a rejoint' as action, 'QuickPop' as item, created_at as time
       FROM users
       ORDER BY created_at DESC LIMIT 5)
      UNION ALL
      (SELECT 'upload' as type, 'Admin' as user, 'a ajouté' as action, title as item, created_at as time
       FROM videos
       ORDER BY created_at DESC LIMIT 5)
      ORDER BY time DESC LIMIT 10
    `)

    // Top videos
    const [topVideos] = await db.query('SELECT title, views FROM videos ORDER BY views DESC LIMIT 4')

    // Monthly growth (New users this month)
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const [newUsers] = await db.query('SELECT COUNT(*) as count FROM users WHERE created_at >= ?', [startOfMonth])
    const [monthlyCerts] = await db.query('SELECT COUNT(*) as count FROM user_certifications WHERE obtained_at >= ?', [startOfMonth])

    // Satisfaction (Ratings)
    const [ratings] = await db.query('SELECT AVG(score) as avg_score FROM ratings')
    const satisfactionRate = ratings[0].avg_score ? Math.round((ratings[0].avg_score / 5) * 100) : 0

    // Modules completed (Trainings)
    const [modules] = await db.query("SELECT COUNT(*) as count FROM user_trainings WHERE status = 'completed'")
    const modulesCompleted = modules[0].count

    // Learning Time (Video views * duration)
    const [timeStats] = await db.query('SELECT SUM(views * IFNULL(duration, 0)) as total_seconds FROM videos')
    const learningTime = Math.round((timeStats[0].total_seconds || 0) / 3600)

    // Completion Rate (Trainings)
    const [trainingStats] = await db.query("SELECT COUNT(*) as total, SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed FROM user_trainings")
    const completionRate = trainingStats[0].total > 0 ? Math.round((trainingStats[0].completed / trainingStats[0].total) * 100) : 0

    res.json({
      stats: {
        totalUsers: users[0].total,
        activeUsers: users[0].active || 0,
        totalVideos: videos[0].total,
        certificatesIssued: certs[0].total,
        newUsersThisMonth: newUsers[0].count,
        monthlyCerts: monthlyCerts[0].count,
        completionRate: completionRate,
        avgScore: satisfactionRate, // Using satisfaction as score for now
        learningTime: learningTime,
        modulesCompleted: modulesCompleted,
        satisfactionRate: satisfactionRate
      },
      activities: activity.map(a => ({
        ...a,
        time: new Date(a.time).toLocaleString('fr-FR')
      })),
      videos: topVideos
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    return weekNo;
}
