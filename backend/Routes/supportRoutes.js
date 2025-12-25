import { Router } from 'express'
import { listSupport, getSupport, createSupport, updateSupport, deleteSupport } from '../controllers/supportController.js'

const router = Router()

router.get('/', listSupport)
router.get('/:id', getSupport)
router.post('/', createSupport)
router.put('/:id', updateSupport)
router.delete('/:id', deleteSupport)

export default router

