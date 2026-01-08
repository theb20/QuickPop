import { Router } from 'express'
import { register, login, logout, me, updateProfile, requestPasswordReset, verifyResetCode, confirmResetPassword } from '../controllers/authController.js'
import requireAuth from '../middleware/authMiddleware.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', requireAuth, me)
router.put('/me', requireAuth, updateProfile)
router.post('/reset/request', requestPasswordReset)
router.post('/reset/verify', verifyResetCode)
router.post('/reset/confirm', confirmResetPassword)

export default router
