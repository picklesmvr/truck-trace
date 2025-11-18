import { apiService } from './api'

export const authService = {
  login: async (email, password, userType) => {
    const endpoint = userType === 'customer' ? '/auth/login/customer' : '/auth/login/owner'
    const response = await apiService.post(endpoint, { email, password })
    return response.data
  },

  register: async (userData, userType) => {
    const endpoint = userType === 'customer' ? '/auth/register/customer' : '/auth/register/owner'
    const response = await apiService.post(endpoint, userData)
    return response.data
  },

  getCurrentUser: async () => {
    const response = await apiService.get('/auth/me')
    return response.data
  },

  updateProfile: async (userData) => {
    const response = await apiService.put('/users/profile', userData)
    return response.data
  },

  changePassword: async (passwordData) => {
    const response = await apiService.put('/users/password', passwordData)
    return response.data
  },

  forgotPassword: async (email) => {
    const response = await apiService.post('/auth/forgot-password', { email })
    return response.data
  },

  resetPassword: async (token, newPassword) => {
    const response = await apiService.post('/auth/reset-password', { token, newPassword })
    return response.data
  }
}