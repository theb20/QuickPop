import api from '../api.js'

export const getVideos = async (params = {}) => {
  try {
    const response = await api.get('/videos', { params })
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}
export const getVideo = async (id) => {
  try {
    const response = await api.get(`/videos/${id}`)
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const createVideo = async (category) => {
  try {
    const response = await api.post('/videos', category)
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const uploadVideo = async (formData) => {
  try {
    const response = await api.post('/videos/upload', formData, {
      headers: {
        'Content-Type': undefined,
      },
    })
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const updateVideo = async (id, category) => {
  try {
    const response = await api.put(`/videos/${id}`, category)
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const deleteVideo = async (id) => {
  try {
    const response = await api.delete(`/videos/${id}`)
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const incrementVideoViews = async (id) => {
  try {
    const response = await api.post(`/videos/${id}/views`)
    return response
  } catch (err) {
    console.error(err)
    // Don't throw to avoid interrupting playback
    return null
  }
}

export const updateVideoProgress = async (id, progress, currentTime, duration) => {
  try {
    const response = await api.post(`/videos/${id}/progress`, { progress, currentTime, duration })
    return response
  } catch (err) {
    console.error(err)
    return null
  }
}

export const rateVideo = async (id, score) => {
  try {
    const response = await api.post(`/videos/${id}/rate`, { score })
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}

