import { ensureTrainingsTables, getUserTrainings, getTrainingStats } from '../Models/trainingsModel.js'
import { ensureCertificationsTables, getUserCertifications } from '../Models/certificationsModel.js'

export async function initAccountController() {
  await ensureTrainingsTables()
  await ensureCertificationsTables()
}

export async function getAccountData(req, res) {
  try {
    const userId = req.user.id
    
    // Fetch all data in parallel
    const [stats, inProgress, certifications] = await Promise.all([
        getTrainingStats(userId),
        getUserTrainings(userId),
        getUserCertifications(userId)
    ])

    return res.json({
        stats,
        inProgress,
        certifications
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
