import { Router } from 'express'
import { generateMonthlyReport, generateUserStats, generateCertStats, getDashboardStats } from '../controllers/reportsController.js'

const router = Router()

router.get('/dashboard', getDashboardStats)
router.get('/monthly', generateMonthlyReport)
router.get('/users', generateUserStats)
router.get('/certifications', generateCertStats)

export default router
