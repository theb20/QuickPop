import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 8889),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'quickpop',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export const testDBConnection = async () => {
  try {
    const conn = await db.getConnection()
    await conn.query('SELECT 1')
    conn.release()
    console.log('✅ Connexion MySQL réussie')
    return true
  } catch (error) {
    if (error && error.code === 'ER_BAD_DB_ERROR') {
      try {
        const host = process.env.DB_HOST || 'localhost'
        const port = Number(process.env.DB_PORT || 8889)
        const user = process.env.DB_USER || 'root'
        const password = process.env.DB_PASSWORD || 'root'
        const database = process.env.DB_NAME || 'quickpop_db'
        const admin = await mysql.createConnection({ host, port, user, password })
        await admin.query(
          `CREATE DATABASE IF NOT EXISTS \`${database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
        )
        await admin.end()
        console.log(`✅ Base de données créée: ${database}`)
        // Re-tester la connexion
        const conn2 = await db.getConnection()
        await conn2.query('SELECT 1')
        conn2.release()
        console.log('✅ Connexion MySQL réussie après création de la base')
        return true
      } catch (e) {
        console.error('❌ Échec de création de la base MySQL :', e.message)
        return false
      }
    }
    console.error('❌ Erreur de connexion MySQL :', error.message)
    return false
  }
}

export default db
