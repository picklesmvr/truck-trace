import { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { truckService } from '../services/truck'
import { favoriteService } from '../services/favorite'
import { useAuth } from '../contexts/AuthContext'
import { useGeolocation } from '../hooks/useGeolocation'
import MapContainer from '../components/MapContainer'
import TruckList from '../components/TruckList'
import FilterPanel from '../components/FilterPanel'

const CustomerDashboard = () => {
  const { user } = useAuth()
  const { location, loading: locationLoading, error: locationError } = useGeolocation()
  const [trucks, setTrucks] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('map') // 'map' or 'list'
  const [filters, setFilters] = useState({
    cuisine_types: [],
    search: '',
    radius: 5,
    sortBy: 'distance' // 'distance', 'rating', 'name'
  })
  const [favorites, setFavorites] = useState(new Set())

  // Load trucks on component mount and when filters/location change
  useEffect(() => {
    loadTrucks()
  }, [location, filters])

  const loadTrucks = async () => {
    try {
      setLoading(true)
      let response

      if (location) {
        // If we have user location, get nearby trucks
        response = await truckService.getNearbyTrucks(location.lat, location.lng, filters.radius)
        setTrucks(response.data.trucks || [])
      } else {
        // Otherwise, get all trucks with filters
        response = await truckService.getAllTrucks(filters)
        setTrucks(response.data || [])
      }
    } catch (error) {
      console.error('Error loading trucks:', error)
      toast.error('Failed to load food trucks')
      setTrucks([])
    } finally {
      setLoading(false)
    }
  }

  // Load user's favorites
  useEffect(() => {
    if (user) {
      loadFavorites()
    }
  }, [user])

  const loadFavorites = async () => {
    try {
      const response = await favoriteService.getFavorites()
      const favoriteIds = new Set(response.data.favorites.map(fav => fav.id))
      setFavorites(favoriteIds)
    } catch (error) {
      console.error('Error loading favorites:', error)
    }
  }

  // Filter trucks based on search term
  const filteredTrucks = useMemo(() => {
    let filtered = trucks

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(truck =>
        truck.truck_name.toLowerCase().includes(searchTerm) ||
        truck.business_name.toLowerCase().includes(searchTerm) ||
        truck.cuisine_types.some(cuisine => cuisine.toLowerCase().includes(searchTerm))
      )
    }

    if (filters.cuisine_types.length > 0) {
      filtered = filtered.filter(truck =>
        truck.cuisine_types.some(cuisine => filters.cuisine_types.includes(cuisine))
      )
    }

    // Sort trucks
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'distance':
          return (a.distance_miles || Infinity) - (b.distance_miles || Infinity)
        case 'rating':
          return (b.average_rating || 0) - (a.average_rating || 0)
        case 'name':
          return a.truck_name.localeCompare(b.truck_name)
        default:
          return 0
      }
    })

    return filtered
  }, [trucks, filters])

  const handleFavoriteToggle = async (truckId) => {
    try {
      if (favorites.has(truckId)) {
        await favoriteService.removeFavorite({ truck_id: truckId })
        setFavorites(prev => {
          const newFavorites = new Set(prev)
          newFavorites.delete(truckId)
          return newFavorites
        })
        toast.success('Removed from favorites')
      } else {
        await favoriteService.addFavorite({ truck_id: truckId })
        setFavorites(prev => {
          const newFavorites = new Set(prev)
          newFavorites.add(truckId)
          return newFavorites
        })
        toast.success('Added to favorites')
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast.error('Failed to update favorites')
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const cuisineOptions = [
    'American', 'Mexican', 'Italian', 'Asian', 'BBQ', 'Desserts', 'Vegan', 'Indian',
    'Thai', 'Japanese', 'Chinese', 'French', 'Mediterranean', 'Middle Eastern', 'African'
  ]

  if (loading && locationLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600">Finding food trucks near you...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Find Food Trucks - TruckTrace</title>
        <meta name="description" content="Discover food trucks near your location" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05l2.476 2.95A1 1 0 008.081 18h3.838a1 1 0 00.761-.35L15.95 15H17a1 1 0 001-1V5a1 1 0 00-1-1H3z"/>
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-gray-900">TruckTrace</h1>
              </div>

              <div className="flex items-center space-x-4">
                {/* User Info */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Welcome back,</span>
                  <span className="font-semibold text-gray-900">{user?.username}</span>
                </div>

                {/* Navigation Links */}
                <nav className="hidden sm:flex space-x-4">
                  <Link to="/favorites" className="text-gray-600 hover:text-orange-600 font-medium">
                    My Favorites
                  </Link>
                  <Link to="/profile" className="text-gray-600 hover:text-orange-600 font-medium">
                    Profile
                  </Link>
                  <button
                    onClick={() => {/* TODO: Implement logout */}}
                    className="text-gray-600 hover:text-red-600 font-medium"
                  >
                    Logout
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Location Error Banner */}
          {locationError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Location access denied</h3>
                  <p className="mt-1 text-sm text-yellow-700">
                    Please enable location access to find nearby trucks, or use search to find trucks anywhere.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-orange-500">{filteredTrucks.length}</div>
                <div className="text-sm text-gray-600">Trucks Found</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-500">{filters.radius} miles</div>
                <div className="text-sm text-gray-600">Search Radius</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-500">{favorites.size}</div>
                <div className="text-sm text-gray-600">Favorites</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-500">
                  {location ? 'Your Area' : 'All Areas'}
                </div>
                <div className="text-sm text-gray-600">Search Scope</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Panel */}
            <div className="lg:col-span-1">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                cuisineOptions={cuisineOptions}
              />
            </div>

            {/* Map/List View */}
            <div className="lg:col-span-3">
              {/* View Toggle */}
              <div className="bg-white rounded-lg shadow-sm p-1 mb-4 flex">
                <button
                  onClick={() => setView('map')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                    view === 'map'
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Map View
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                    view === 'list'
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  List View
                </button>
              </div>

              {/* Map or List Content */}
              {loading ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <div className="spinner w-8 h-8 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading food trucks...</p>
                </div>
              ) : filteredTrucks.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v2m2 4H3m2 4h14a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z"/>
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No food trucks found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or search for a different location.
                  </p>
                  <button
                    onClick={() => setFilters({ cuisine_types: [], search: '', radius: 5, sortBy: 'distance' })}
                    className="btn-outline"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  {view === 'map' ? (
                    <MapContainer
                      trucks={filteredTrucks}
                      userLocation={location}
                      onFavoriteToggle={handleFavoriteToggle}
                      favorites={favorites}
                      height="500px"
                    />
                  ) : (
                    <TruckList
                      trucks={filteredTrucks}
                      onFavoriteToggle={handleFavoriteToggle}
                      favorites={favorites}
                      showDistance={!!location}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default CustomerDashboard