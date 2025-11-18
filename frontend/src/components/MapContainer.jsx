import { useState, useCallback, useRef } from 'react'
import toast from 'react-hot-toast'

// Google Maps wrapper component that doesn't rely on external libraries initially
const MapContainer = ({ trucks, userLocation, onFavoriteToggle, favorites, height = '500px' }) => {
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState([])
  const [selectedTruck, setSelectedTruck] = useState(null)
  const mapRef = useRef(null)

  // Initialize map
  const initMap = useCallback(() => {
    if (!window.google || !mapRef.current) return

    const mapOptions = {
      center: userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : { lat: 40.7128, lng: -74.0060 }, // Default to NYC
      zoom: userLocation ? 12 : 10,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    }

    const mapInstance = new window.google.maps.Map(mapRef.current, mapOptions)
    setMap(mapInstance)

    // Add markers for trucks
    addMarkers(mapInstance)

    // Add user location marker
    if (userLocation) {
      new window.google.maps.Marker({
        position: { lat: userLocation.lat, lng: userLocation.lng },
        map: mapInstance,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#4285F4',
          fillOpacity: 0.8,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 8
        },
        title: 'Your Location'
      })
    }
  }, [userLocation])

  // Add markers for trucks
  const addMarkers = useCallback((mapInstance) => {
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null))
    const newMarkers = []

    trucks.forEach(truck => {
      if (!truck.latitude || !truck.longitude) return

      const marker = new window.google.maps.Marker({
        position: { lat: parseFloat(truck.latitude), lng: parseFloat(truck.longitude) },
        map: mapInstance,
        title: truck.truck_name,
        icon: {
          url: createTruckIcon(truck),
          scaledSize: new window.google.maps.Size(32, 32),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(16, 16)
        },
        animation: window.google.maps.Animation.DROP
      })

      // Add click listener
      marker.addListener('click', () => {
        setSelectedTruck(truck)
        showTruckInfo(truck)
      })

      newMarkers.push(marker)
    })

    setMarkers(newMarkers)

    // Adjust map bounds to show all markers
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()

      // Add user location to bounds
      if (userLocation) {
        bounds.extend(new window.google.maps.LatLng(userLocation.lat, userLocation.lng))
      }

      // Add all truck locations to bounds
      newMarkers.forEach(marker => {
        bounds.extend(marker.getPosition())
      })

      mapInstance.fitBounds(bounds)
    }
  }, [trucks, userLocation, markers])

  // Create truck icon based on favorites and status
  const createTruckIcon = (truck) => {
    const isFavorite = favorites.has(truck.id)
    const isOpen = truck.location_status === 'open'

    // Use different colors for favorite trucks
    const color = isFavorite ? '#ef4444' : (isOpen ? '#22c55e' : '#f59e0b')

    return `data:image/svg+xml;base64,${btoa(`
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V22l4-4 4 4V14.74C19 13.19 20.88 11.38 21 9c0-3.87-3.13-7-7-7z" fill="${color}" stroke="white" stroke-width="1"/>
        <circle cx="12" cy="9" r="2" fill="white"/>
        ${isFavorite ? '<path d="M12 14l.5 2L10 19l1.5-3L14 16l-2 1z" fill="white"/>' : ''}
      </svg>
    `)}`
  }

  // Show truck info in a toast and modal-like info
  const showTruckInfo = (truck) => {
    const infoContent = `
      <div style="max-width: 280px;">
        <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #333;">${truck.truck_name}</h3>
        <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">${truck.business_name}</p>
        ${truck.cuisine_types ? `<p style="margin: 0 0 4px 0; color: #666; font-size: 12px;">🍴 ${truck.cuisine_types.join(', ')}</p>` : ''}
        ${truck.distance_miles ? `<p style="margin: 0 0 4px 0; color: #666; font-size: 12px;">📍 ${truck.distance_miles.toFixed(1)} miles away</p>` : ''}
        ${truck.average_rating ? `<p style="margin: 0 0 4px 0; color: #666; font-size: 12px;">⭐ ${truck.average_rating.toFixed(1)} (${truck.review_count} reviews)</p>` : ''}
        <div style="text-align: center; margin-top: 8px;">
          <a href="/truck/${truck.id}" style="display: inline-block; padding: 6px 12px; background: #f59e0b; color: white; text-decoration: none; border-radius: 4px; font-size: 12px;">
            View Details
          </a>
        </div>
      </div>
    `

    const infoWindow = new window.google.maps.InfoWindow({
      content: infoContent
    })

    infoWindow.open(map, marker)
  }

  // Toggle favorite for selected truck
  const toggleFavorite = (truckId) => {
    onFavoriteToggle(truckId)
  }

  // Load Google Maps script
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = initMap
      script.onerror = () => {
        toast.error('Failed to load Google Maps. Please refresh the page.')
      }

      document.head.appendChild(script)
    } else {
      initMap()
    }
  }, [initMap])

  // Re-add markers when trucks change
  useEffect(() => {
    if (map) {
      addMarkers(map)
    }
  }, [trucks, map, addMarkers])

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
      <div
        ref={mapRef}
        style={{ height, width: '100%' }}
        className="map-container"
      />

      {/* Selected Truck Info Panel */}
      {selectedTruck && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 m-2 max-w-sm z-10">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{selectedTruck.truck_name}</h3>
              <p className="text-gray-600 text-sm">{selectedTruck.business_name}</p>
            </div>
            <button
              onClick={() => setSelectedTruck(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L10 10.414l-4.293 4.293a1 1 0 01-1.414 0l-5.657-5.657a1 1 0 00-1.414 0l-5.656 5.657a1 1 0 01-1.414 1.414l5.656 5.657a1 1 0 001.414 0l5.657-5.657z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            {selectedTruck.cuisine_types && (
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">🍴</span>
                <span>{selectedTruck.cuisine_types.join(', ')}</span>
              </div>
            )}

            {selectedTruck.distance_miles && (
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">📍</span>
                <span>{selectedTruck.distance_miles.toFixed(1)} miles away</span>
              </div>
            )}

            {selectedTruck.average_rating && (
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">⭐</span>
                <span>{selectedTruck.average_rating.toFixed(1)} ({selectedTruck.review_count} reviews)</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t">
              <button
                onClick={() => toggleFavorite(selectedTruck.id)}
                className={`text-sm font-medium flex items-center ${
                  favorites.has(selectedTruck.id)
                    ? 'text-red-600 hover:text-red-700'
                    : 'text-orange-500 hover:text-orange-600'
                }`}
              >
                {favorites.has(selectedTruck.id) ? (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 9.343l1.172-1.171a4 4 0 115.656 0L16.828 5.172a4 4 0 010 5.656L10.657 17l-1.171 1.171a4 4 0 01-5.656 0L3.172 10.828a4 4 0 010-5.656zm5.656 8.485L10 17.657l-1.172-1.171 4 4 0 015.656 0z" clipRule="evenodd" />
                    </svg>
                    Remove Favorite
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 9.343l1.172-1.171a4 4 0 115.656 0L16.828 5.172a4 4 0 010 5.656L10.657 17l-1.171 1.171a4 4 0 01-5.656 0L3.172 10.828a4 4 0 010-5.656zm8.485 1.657a1 1 0 11-1.414 1.414L10.657 18.485a1 1 0 01-1.414 0L4.243 13.243a1 1 0 010-1.414l6.364-6.364a1 1 0 011.414 0l6.364 6.364a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Add to Favorites
                  </>
                )}
              </button>

              <a
                href={`/truck/${selectedTruck.id}`}
                className="btn-primary text-sm px-3 py-2"
              >
                View Details
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {!window.google && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
          <div className="text-center">
            <div className="spinner w-8 h-8 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {/* Map attribution */}
      <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs text-gray-600">
        <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
          Google Maps
        </a>
      </div>
    </div>
  )
}

export default MapContainer