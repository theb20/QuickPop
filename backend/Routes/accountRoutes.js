import { Router } from 'express'
import { getAccountData } from '../Controllers/accountController.js'
import { requireAuth } from '../Controllers/authController.js'

const router = Router()

router.get('/data', requireAuth, getAccountData)

export default router
