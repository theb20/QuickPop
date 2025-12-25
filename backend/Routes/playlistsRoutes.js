import { Router } from 'express'
import { listPlaylists, getPlaylist, createPlaylist, updatePlaylist, deletePlaylist } from '../controllers/playlistsController.js'

const router = Router()

router.get('/', listPlaylists)
router.get('/:id', getPlaylist)
router.post('/', createPlaylist)
router.put('/:id', updatePlaylist)
router.delete('/:id', deletePlaylist)

export default router

