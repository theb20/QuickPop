import api from '../api.js'

export const getCertifications = async () => {
  try {
    const response = await api.get('/certifications')
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const createCertification = async (data) => {
  try {
    const response = await api.post('/certifications', data)
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const updateCertification = async (id, data) => {
  try {
    const response = await api.put(`/certifications/${id}`, data)
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const deleteCertification = async (id) => {
  try {
    const response = await api.delete(`/certifications/${id}`)
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const assignCertification = async (data) => {
  try {
    const response = await api.post('/certifications/assign', data)
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const getCertificationHolders = async (id) => {
  try {
    const response = await api.get(`/certifications/${id}/users`)
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}
