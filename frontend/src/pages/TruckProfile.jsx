import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { truckService } from '../services/truck'
import { favoriteService } from '../services/favorite'
import { useAuth } from '../contexts/AuthContext'

const TruckProfile = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [truck, setTruck] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState('info') // 'info', 'menu', 'reviews'

  useEffect(() => {
    loadTruck()
  }, [id])

  useEffect(() => {
    if (user && truck) {
      checkFavoriteStatus()
    }
  }, [user, truck])

  const loadTruck = async () => {
    try {
      setLoading(true)
      const response = await truckService.getTruckById(id)
      setTruck(response.data)
    } catch (error) {
      console.error('Error loading truck:', error)
      toast.error('Failed to load truck information')
      setTruck(null)
    } finally {
      setLoading(false)
    }
  }

  const checkFavoriteStatus = async () => {
    try {
      const response = await favoriteService.isFavorite(id)
      setIsFavorite(response.data.is_favorite)
    } catch (error) {
      console.error('Error checking favorite status:', error)
    }
  }

  const handleFavoriteToggle = async () => {
    if (!user) {
      toast.error('Please login to add favorites')
      return
    }

    try {
      if (isFavorite) {
        await favoriteService.removeFavorite({ truck_id: id })
        setIsFavorite(false)
        toast.success('Removed from favorites')
      } else {
        await favoriteService.addFavorite({ truck_id: id })
        setIsFavorite(true)
        toast.success('Added to favorites')
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast.error('Failed to update favorites')
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'Appetizers': '🥟',
      'Mains': '🍔',
      'Desserts': '🍰',
      'Drinks': '🥤',
      'Sides': '🍟',
      'Specials': '⭐'
    }
    return icons[category] || '🍴'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'text-green-600 bg-green-100'
      case 'closing_soon':
        return 'text-yellow-600 bg-yellow-100'
      case 'closed':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'open':
        return 'Open Now'
      case 'closing_soon':
        return 'Closing Soon'
      case 'closed':
        return 'Closed'
      default:
        return 'Unknown Status'
    }
  }

  const handleContactClick = (email) => {
    window.location.href = `mailto:${email}`
  }

  const handlePhoneClick = (phone) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(phone)
      toast.success('Phone number copied to clipboard!')
    }
  }

  const handleDirectionsClick = () => {
    if (truck?.current_location?.latitude && truck?.current_location?.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${truck.current_location.latitude},${truck.current_location.longitude}`
      window.open(url, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading truck information...</p>
        </div>
      </div>
    )
  }

  if (!truck) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v2m2 4H3m2 4h14a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z"/>
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Truck not found</h3>
          <p className="text-gray-600 mb-4">The food truck you're looking for doesn't exist or may have been removed.</p>
          <Link to="/customer/dashboard" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{truck.truck_name} - TruckTrace</title>
        <meta name="description" content={`${truck.business_name} - ${truck.cuisine_types.join(', ')} food truck in your area`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <Link to="/customer/dashboard" className="text-gray-600 hover:text-orange-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7-7-7"/>
                  </svg>
                </Link>
                <span className="text-gray-400">|</span>
                <span className="text-lg font-semibold text-gray-900">{truck.truck_name}</span>
              </div>

              {user && (
                <button
                  onClick={handleFavoriteToggle}
                  className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isFavorite
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                  }`}
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    {isFavorite ? (
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 9.343l1.172-1.171a4 4 0 115.656 0L16.828 5.172a4 4 0 010 5.656L10.657 17l-1.171 1.171a4 4 0 01-5.656 0L3.172 10.828a4 4 0 010-5.656zm5.656 8.485L10 17.657l16.485 8.485a1 1 0 11-1.414 1.414L10.657 18.485a1 1 0 01-1.414 0l-6.364-6.364a1 1 0 010-1.414z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 9.343l16.657 5.172a4 4 0 010 5.656L10.657 17l-1.171 1.171a4 4 0 01-5.656 0L3.172 10.828a4 4 0 010-5.656zm8.485 1.657a1 1 0 11-1.414 1.414L10.657 18.485a1 1 0 01-1.414 0l-6.364-6.364a1 1 0 010-1.414z" clipRule="evenodd" />
                    )}
                  </svg>
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Truck Info Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info Card */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  {truck.cover_photo_url ? (
                    <img
                      src={truck.cover_photo_url}
                      alt={truck.truck_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-24 h-24 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05l2.476 2.95A1 1 0 008.081 18h3.838a1 1 0 00.761-.35L15.95 15H17a1 1 0 001-1V5a1 1 0 00-1-1H3z"/>
                      </svg>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex-shrink-0">
                      {truck.logo_url ? (
                        <img
                          src={truck.logo_url}
                          alt={truck.truck_name}
                          className="w-16 h-16 rounded-lg object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-orange-500 flex items-center justify-center">
                          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05l2.476 2.95A1 1 0 008.081 18h3.838a1 1 0 00.761-.35L15.95 15H17a1 1 0 001-1V5a1 1 0 00-1-1H3z"/>
                          </svg>
                        </div>
                      )}
                    </div>

                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{truck.truck_name}</h1>
                      <p className="text-lg text-gray-600">{truck.business_name}</p>
                    </div>
                  </div>

                  {truck.description && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                      <p className="text-gray-600 leading-relaxed">{truck.description}</p>
                    </div>
                  )}

                  {/* Cuisine Types */}
                  {truck.cuisine_types && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-2">Cuisine Types</h3>
                      <div className="flex flex-wrap gap-2">
                        {truck.cuisine_types.map(cuisine => (
                          <span
                            key={cuisine}
                            className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                          >
                            {cuisine}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rating and Reviews */}
                  {truck.average_rating && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-2">Rating</h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292c.329.784.853.922.853.922s.524-.138.922-.922l1.07-3.292C13.477.006 13.952 0 14.75 0s.273.006.959.006c.297 0 .572.006.804.006s.47-.16.804-.006l1.02-3.134a2 2 0 00-1.935-1.896l-3.795-.882A2 2 0 004.25 2.482l-3.795-.882a2 2 0 00-1.935-1.896L12.525 6.81C12.252 7.08 2 7.471 2 7.75s.252-.671.525-.94l1.02-3.134A2 2 0 004.75 2.482l3.795-.882A2 2 0 001.935 1.896L12.525 12.19c12.748.006 13.477 0 14.275 0c.797 0 1.527.006 2.303.006l-1.02 3.134a2 2 0 001.935 1.896l3.795.882A2 2 0 0017.747 17.52l-3.795-.882A2 2 0 0020.752 14.72l-1.02-3.134a2 2 0 00-1.935 1.896L12.525 12.19c12.748.006 13.477 0 14.257 0c.797 0 1.527.006 2.303.006l-1.02 3.134a2 2 0 001.935 1.896l3.795.882A2 2 0 0017.747 19.52l-3.795-.882A2 2 0 0020.752 16.72l-1.02-3.134z"/>
                          </svg>
                          <span className="text-xl font-bold text-gray-900 ml-1">
                            {truck.average_rating.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-gray-600">
                          ({truck.review_count} {truck.review_count === 1 ? 'review' : 'reviews'})
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>

                    {truck.contact_phone && (
                      <button
                        onClick={() => handlePhoneClick(truck.contact_phone)}
                        className="w-full flex items-center justify-center space-x-2 text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        title="Click to copy phone number"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2v3a2 2 0 012 2h3.283l1.465 1.95A2 2 0 0114 14.657l-1.465-1.95H7a2 2 0 01-2-2V5a2 2 0 012-2h3zM3 8a1 1 0 000 2v8a1 1 0 001 1h6a1 1 0 001-1v-8a1 1 0 00-1-1z"/>
                        </svg>
                        <span>{truck.contact_phone}</span>
                      </button>
                    )}

                    {truck.owner_username && (
                      <div className="flex items-center justify-center space-x-2 text-left px-4 py-3 bg-gray-50 rounded-lg">
                        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a3 3 0 11-6 0 3 3 0 000 6zM21 12a9 9 0 11-18 0c0 .998.433 1.904 1.904s.982-.006 1.904-.006 2.8 0 0-4.93-.592-3.593-2.745l.545.545A7.967 7.967 0 0018 0l-4.93-.592a7.967 7.967 0 00-3.593-2.745l-.545.545a7.967 7.967 0 00-1.414 1.414z"/>
                        </svg>
                        <span>Owner: {truck.owner_username}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Card */}
              {truck.current_location && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900">Current Location</h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(truck.current_location.status)}`}>
                      {getStatusText(truck.current_location.status)}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-600 mb-2">{truck.current_location.address}</p>
                    <button
                      onClick={handleDirectionsClick}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-5.447A2 2 0 002 12.786L16.236 16.5l5.447 5.447A2 2 0 0018 17.894V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        <path d="M12 6a2 2 0 100 4v2a2 2 0 100-4z"/>
                      </svg>
                      Get Directions
                    </button>
                  </div>

                  <div className="text-sm text-gray-500">
                    Last updated: {new Date(truck.current_location.updated_at).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Menu and Reviews */}
            <div className="lg:col-span-1 space-y-6">
              {/* Tab Navigation */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex">
                    {['info', 'menu', 'reviews'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors duration-200 ${
                          activeTab === tab
                            ? 'border-orange-500 text-orange-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {/* Info Tab */}
                  {activeTab === 'info' && (
                    <div className="space-y-4">
                      <div className="text-sm text-gray-600">
                        <p className="mb-2">
                          <strong>Business Hours:</strong> Hours may vary by location and day.
                        </p>
                        <p className="mb-2">
                          <strong>Payment Methods:</strong> Cash and digital payments typically accepted.
                        </p>
                        <p>
                          <strong>Note:</strong> Call ahead to confirm availability and current location.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Menu Tab */}
                  {activeTab === 'menu' && (
                    <div className="space-y-4">
                      {truck.menu_items && truck.menu_items.length > 0 ? (
                        <div className="space-y-3">
                          {Object.entries(
                        truck.menu_items.reduce((acc, item) => {
                          if (!acc[item.category]) acc[item.category] = []
                          acc[item.category].push(item)
                          return acc
                        }, {})
                      ).map(([category, items]) => (
                        <div key={category}>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg">{getCategoryIcon(category)}</span>
                            <h4 className="font-semibold text-gray-900">{category}</h4>
                          </div>
                          <div className="space-y-2">
                            {items.map(item => (
                              <div key={item.id} className="border-l-2 border-gray-200 pl-4 py-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h5 className="font-medium text-gray-900">{item.name}</h5>
                                    {item.description && (
                                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                    )}
                                    {item.dietary_tags && item.dietary_tags.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {item.dietary_tags.map(tag => (
                                          <span
                                            key={tag}
                                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                                          >
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <div className="text-lg font-semibold text-gray-900">
                                      {formatPrice(item.price)}
                                    </div>
                                    {item.is_signature && (
                                      <div className="text-xs text-orange-600 font-medium">⭐ Signature</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))} else {
                        <div className="text-center py-8">
                          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 002-2h3M7 16a4 4 0 00-4 4v2m2 4h14a2 2 0 002-2v-2M7 8a1 1 0 000 2v8a1 1 0 001 1z"/>
                          </svg>
                          <p className="text-gray-600">Menu not available</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reviews Tab */}
                  {activeTab === 'reviews' && (
                    <div className="space-y-4">
                      <div className="text-center py-8">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292c.329.784.853.922.853.922s.524-.138.922-.922l1.07-3.292C13.477.006 13.952 0 14.75 0s.273.006.959.006c.297 0 .572.006.804.006s.47-.16.804-.006l1.02-3.134a2 2 0 00-1.935-1.896l-3.795-.882A2 2 0 004.25 2.482l-3.795-.882a2 2 0 00-1.935-1.896L12.525 6.81C12.252 7.08 2 7.471 2 7.75s.252-.671.525-.94l1.02-3.134A2 2 0 004.75 2.482l-3.795-.882A2 2 0 001.935 1.896L12.525 12.19c12.748.006 13.477 0 14.257 0C.797 0 1.527.006 2.303.006l-1.02 3.134a2 2 0 001.935 1.896l3.795.882A2 2 0 0017.747 17.52l-3.795-.882A2 2 0 0020.752 14.72l-1.02-3.134a2 2 0 00-1.935 1.896L12.525 12.19c12.748.006 13.477 0 14.257 0c.797 0 1.527.006 2.303.006l-1.02 3.134a2 2 0 001.935 1.896l3.795.882A2 2 0 0017.747 19.52l-3.795-.882A2 2 0 0020.752 16.72l-1.02-3.134z"/>
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Reviews Coming Soon</h3>
                        <p className="text-gray-600 mb-4">
                          The review system will be available in the next update. Currently, ratings are based on owner feedback and customer satisfaction.
                        </p>
                        <p className="text-sm text-gray-500">
                          Check back soon to leave reviews and read what other customers are saying about {truck.truck_name}!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default TruckProfile