import { apiService } from './api'

export const truckService = {
  getAllTrucks: (params = {}) => {
    const queryParams = new URLSearchParams()

    if (params.cuisine_types?.length) {
      queryParams.append('cuisine_types', params.cuisine_types.join(','))
    }
    if (params.search) {
      queryParams.append('search', params.search)
    }
    if (params.lat) {
      queryParams.append('lat', params.lat)
    }
    if (params.lng) {
      queryParams.append('lng', params.lng)
    }
    if (params.radius) {
      queryParams.append('radius', params.radius)
    }
    if (params.limit) {
      queryParams.append('limit', params.limit)
    }

    const url = queryParams.toString() ? `/trucks?${queryParams.toString()}` : '/trucks'
    return apiService.get(url)
  },

  getTruckById: (id) => {
    return apiService.get(`/trucks/${id}`)
  },

  getTopTrucks: (limit = 10) => {
    return apiService.get(`/trucks/top?limit=${limit}`)
  },

  getNearbyTrucks: (lat, lng, radius = 5) => {
    return apiService.get(`/locations/nearby?lat=${lat}&lng=${lng}&radius=${radius}`)
  },

  getMyTruck: () => {
    return apiService.get('/trucks/my')
  },

  createTruck: (truckData) => {
    return apiService.post('/trucks', truckData)
  },

  updateTruck: (id, truckData) => {
    return apiService.put(`/trucks/${id}`, truckData)
  },

  deleteTruck: (id) => {
    return apiService.delete(`/trucks/${id}`)
  }
}