import { Router } from 'express'
import multer from 'multer'
import { listVideos, getVideo, createVideo, updateVideo, deleteVideo, incrementVideoViews, getLatestByCategory, updateVideoProgress, getFeatured, getTrending, uploadVideoFile, streamVideo, rateVideo } from '../Controllers/videosController.js'
import { requireAuth } from '../Middleware/authMiddleware.js'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 * 1024 }
})

// Pas de middleware d'initialisation ici, fait au démarrage serveur


router.get('/', listVideos)
router.get('/featured', getFeatured)
router.get('/trending', getTrending)
router.get('/latest-by-category', getLatestByCategory)
router.post('/upload', upload.single('video'), uploadVideoFile)
router.get('/proxy/:id', streamVideo)
router.get('/:id', getVideo)
router.post('/', createVideo)
router.put('/:id', updateVideo)
router.post('/:id/views', incrementVideoViews)
router.post('/:id/rate', requireAuth, rateVideo)
router.post('/:id/progress', requireAuth, updateVideoProgress)
router.delete('/:id', deleteVideo)

export default router

