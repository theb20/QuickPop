import { searchVideos } from '../models/videosModel.js'
import { searchCategories } from '../models/categoriesModel.js'

export async function globalSearch(req, res) {
  try {
    const { q } = req.query
    if (!q || typeof q !== 'string') {
      return res.json({ videos: [], categories: [] })
    }

    const [videos, categories] = await Promise.all([
      searchVideos(q),
      searchCategories(q)
    ])

    res.json({
      videos,
      categories
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
