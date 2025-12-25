import api from '../api.js'

export const getUsers = async (params = {}) => {
  try {
    const response = await api.get('/users', { params })
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const getUser = async (id) => {
  try {
    const response = await api.get(`/users/${id}`)
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const createUser = async (data) => {
  try {
    const response = await api.post('/users', data)
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const updateUser = async (id, data) => {
  try {
    const response = await api.put(`/users/${id}`, data)
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`)
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}
