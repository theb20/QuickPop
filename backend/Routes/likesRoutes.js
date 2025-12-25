import { Router } from 'express'
import { listLikes, getLike, createLike, updateLike, deleteLike } from '../controllers/likesController.js'

const router = Router()

router.get('/', listLikes)
router.get('/:id', getLike)
router.post('/', createLike)
router.put('/:id', updateLike)
router.delete('/:id', deleteLike)

export default router

