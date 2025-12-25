import api from '../api.js'

export const getCategories = async () => {
  try {
    const response = await api.get('/categories')
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}
export const getCategory = async (id) => {
  try {
    const response = await api.get(`/categories/${id}`)
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const createCategory = async (category) => {
  try {
    const response = await api.post('/categories', category)
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const updateCategory = async (id, category) => {
  try {
    const response = await api.put(`/categories/${id}`, category)
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/categories/${id}`)
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}
