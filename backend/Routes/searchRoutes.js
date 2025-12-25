import { Router } from 'express'
import { globalSearch } from '../Controllers/searchController.js'

const router = Router()

router.get('/', globalSearch)

export default router
