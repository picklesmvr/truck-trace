import { apiService } from './api'

export const favoriteService = {
  addFavorite: (favoriteData) => {
    return apiService.post('/favorites', favoriteData)
  },

  removeFavorite: (favoriteData) => {
    return apiService.delete('/favorites', { data: favoriteData })
  },

  getFavorites: (params = {}) => {
    const queryParams = new URLSearchParams()

    if (params.lat) {
      queryParams.append('lat', params.lat)
    }
    if (params.lng) {
      queryParams.append('lng', params.lng)
    }
    if (params.radius) {
      queryParams.append('radius', params.radius)
    }

    const url = queryParams.toString() ? `/favorites?${queryParams.toString()}` : '/favorites'
    return apiService.get(url)
  },

  getFavoriteTrucks: () => {
    return apiService.get('/favorites/trucks')
  },

  isFavorite: (truckId) => {
    return apiService.get(`/favorites/check/${truckId}`)
  },

  getTruckFavorites: (truckId) => {
    return apiService.get(`/favorites?truck_id=${truckId}`)
  }
}