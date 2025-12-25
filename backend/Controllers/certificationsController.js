import * as model from '../Models/certificationsModel.js'
import { createNotification } from '../Models/notificationsModel.js'

export async function initCertificationsController() {
  await model.ensureCertificationsTables()
}

export async function listCertifications(req, res) {
  try {
    const rows = await model.getAllCertifications()
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function createCertification(req, res) {
  try {
    const { name, validity_months, description } = req.body
    if (!name) return res.status(400).json({ error: 'Name is required' })
    
    const id = await model.createCertification({ name, validity_months, description })
    res.status(201).json({ id, name, validity_months, description })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function updateCertification(req, res) {
  try {
    const { id } = req.params
    const { name, validity_months, description } = req.body
    
    const success = await model.updateCertification(id, { name, validity_months, description })
    if (!success) return res.status(404).json({ error: 'Certification not found' })
    
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getCertificationHolders(req, res) {
  try {
    const { id } = req.params
    const holders = await model.getCertificationHolders(id)
    res.json(holders)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function deleteCertification(req, res) {
  try {
    const { id } = req.params
    const success = await model.deleteCertification(id)
    if (!success) return res.status(404).json({ error: 'Certification not found' })
    
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function assignCertification(req, res) {
  try {
    const { userId, certId } = req.body
    if (!userId || !certId) return res.status(400).json({ error: 'User ID and Certification ID are required' })

    const success = await model.awardCertificateById(userId, certId)
    if (!success) return res.status(400).json({ error: 'User already has this certification' })

    if (req.io) {
      try {
        const notif = await createNotification(userId, {
          title: 'Nouvelle Certification !',
          body: 'Une nouvelle certification vous a été attribuée par un administrateur.',
          type: 'success',
          url: '/certifications'
        })
        req.io.to(`user_${userId}`).emit('notification', notif)
      } catch (e) {
        console.error("Failed to send notification", e)
      }
    }

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
