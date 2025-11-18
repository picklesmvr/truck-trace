import { useState, useEffect, useCallback } from 'react'

export const useGeolocation = () => {
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        setLocation({ lat: latitude, lng: longitude, accuracy })
        setLoading(false)
        setError(null)
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location'

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions in your browser settings.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.'
            break
          default:
            errorMessage = 'An unknown error occurred while retrieving location.'
            break
        }

        setError(errorMessage)
        setLoading(false)
        setLocation(null)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }, [])

  // Auto-get location on mount
  useEffect(() => {
    getLocation()
  }, [getLocation])

  // Function to manually retry getting location
  const retry = useCallback(() => {
    getLocation()
  }, [getLocation])

  // Function to manually set location (for manual entry)
  const manualSetLocation = useCallback((lat, lng) => {
    setLocation({ lat, lng, accuracy: null, manual: true })
    setLoading(false)
    setError(null)
  }, [])

  return {
    location,
    loading,
    error,
    retry,
    manualSetLocation
  }
}