import { Router } from 'express'
import { getAccountData } from '../Controllers/accountController.js'
import { requireAuth } from '../Middleware/authMiddleware.js'

const router = Router()

router.get('/data', requireAuth, getAccountData)

export default router
