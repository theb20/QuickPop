import { Router } from 'express'
import { listCertifications, createCertification, updateCertification, deleteCertification, assignCertification, getCertificationHolders } from '../controllers/certificationsController.js'

const router = Router()

router.get('/', listCertifications)
router.get('/:id/users', getCertificationHolders)
router.post('/', createCertification)
router.post('/assign', assignCertification)
router.put('/:id', updateCertification)
router.delete('/:id', deleteCertification)

export default router
