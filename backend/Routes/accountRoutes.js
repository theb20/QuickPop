import { Router } from 'express'
import { getAccountData } from '../controllers/accountController.js'
import requireAuth from '../middleware/authMiddleware.js'

const router = Router()

router.get('/data', requireAuth, getAccountData)

export default router
