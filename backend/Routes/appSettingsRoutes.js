import { Router } from 'express'
import { 
  listAppSettings, getAppSetting, createAppSetting, updateAppSetting, deleteAppSetting,
  getGlobalSettings, updateGlobalSettings, resetData, importUsers
} from '../controllers/appSettingsController.js'

const router = Router()

// Global settings singleton
router.get('/global', getGlobalSettings)
router.put('/global', updateGlobalSettings)

// Special actions
router.post('/reset-data', resetData)
router.post('/import-users', importUsers)

// Standard CRUD
router.get('/', listAppSettings)
router.get('/:id', getAppSetting)
router.post('/', createAppSetting)
router.put('/:id', updateAppSetting)
router.delete('/:id', deleteAppSetting)

export default router
