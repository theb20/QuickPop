import api from '../api.js'

export const getLikes = async (params = {}) => {
  try {
    const response = await api.get('/likes', { params })
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const getLike = async (id) => {
  try {
    const response = await api.get(`/likes/${id}`)
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const createLike = async (data) => {
  try {
    const response = await api.post('/likes', data)
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const updateLike = async (id, data) => {
  try {
    const response = await api.put(`/likes/${id}`, data)
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const deleteLike = async (id) => {
  try {
    const response = await api.delete(`/likes/${id}`)
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}
