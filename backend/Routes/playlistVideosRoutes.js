import { Router } from 'express'
import { listPlaylistVideos, getPlaylistVideo, createPlaylistVideo, updatePlaylistVideo, deletePlaylistVideo } from '../controllers/playlistVideosController.js'

const router = Router()

router.get('/', listPlaylistVideos)
router.get('/:id', getPlaylistVideo)
router.post('/', createPlaylistVideo)
router.put('/:id', updatePlaylistVideo)
router.delete('/:id', deletePlaylistVideo)

export default router

