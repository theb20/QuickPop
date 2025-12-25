import api from '../api.js'

export const getDashboardStats = async () => {
  try {
    const response = await api.get('/reports/dashboard')
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const generateReport = async (type) => {
  try {
    let endpoint = ''
    switch(type) {
      case 'Mensuel':
        endpoint = '/reports/monthly'
        break
      case 'Utilisateurs':
        endpoint = '/reports/users'
        break
      case 'Certifications':
        endpoint = '/reports/certifications'
        break
      default:
        endpoint = '/reports/monthly'
    }
    const response = await api.get(endpoint)
    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}
