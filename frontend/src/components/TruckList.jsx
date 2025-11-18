import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const TruckList = ({ trucks, onFavoriteToggle, favorites, showDistance = false }) => {
  const [imageErrors, setImageErrors] = useState(new Set())

  const handleImageError = (truckId) => {
    setImageErrors(prev => new Set(prev).add(truckId))
  }

  const handleFavoriteClick = (e, truckId) => {
    e.preventDefault()
    e.stopPropagation()
    onFavoriteToggle(truckId)
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
        return 'Unknown'
    }
  }

  const getDistanceDisplay = (distance) => {
    if (distance === null || distance === undefined) return null
    if (distance < 1) {
      return `${Math.round(distance * 5280)} ft away`
    }
    return `${distance.toFixed(1)} miles away`
  }

  if (trucks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v2m2 4H3m2 4h14a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z"/>
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No trucks found</h3>
        <p className="text-gray-600 mb-4">
          Try adjusting your search or filters to find more food trucks.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {trucks.map((truck) => (
        <div key={truck.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Truck Image */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                  {truck.logo_url && !imageErrors.has(truck.id) ? (
                    <img
                      src={truck.logo_url}
                      alt={truck.truck_name}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(truck.id)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-orange-500">
                      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05l2.476 2.95A1 1 0 008.081 18h3.838a1 1 0 00.761-.35L15.95 15H17a1 1 0 001-1V5a1 1 0 00-1-1H3z"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Truck Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 text-gray-900">
                      {truck.truck_name}
                    </h3>
                    <p className="text-sm text-gray-600">{truck.business_name}</p>
                  </div>

                  {/* Status Badge */}
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(truck.location_status)}`}>
                    {getStatusText(truck.location_status)}
                  </div>
                </div>

                {/* Cuisine Types */}
                {truck.cuisine_types && truck.cuisine_types.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {truck.cuisine_types.slice(0, 3).map(cuisine => (
                      <span
                        key={cuisine}
                        className="inline-block px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full"
                      >
                        {cuisine}
                      </span>
                    ))}
                    {truck.cuisine_types.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{truck.cuisine_types.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Distance and Rating */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-4">
                    {showDistance && truck.distance_miles && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <span>{getDistanceDisplay(truck.distance_miles)}</span>
                      </div>
                    )}

                    {truck.average_rating && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292c.329.784.853.922.853.922s.524-.138.922-.922l1.07-3.292C13.477.006 13.952 0 14.75 0s.273.006.959.006c.297 0 .572.006.804.006s.47-.16.804-.006l1.02-3.134a2 2 0 00-1.935-1.896l-3.795.882A2 2 0 004.25 2.482l-3.795-.882a2 2 0 00-1.935 1.896L2.525 6.81C2.252 7.08 2 7.471 2 7.75s.252-.671.525-.94l1.02-3.134A2 2 0 004.75 2.482l3.795-.882a2 2 0 001.935-1.896L12.525 6.81c12.748.006 13.477 0 14.275 0c.797 0 1.527.006 2.303.006l-1.02 3.134a2 2 0 001.935 1.896l3.795.882A2 2 0 0017.747 17.52l3.795-.882A2 2 0 0020.752 14.72l-1.02-3.134a2 2 0 00-1.935-1.896L12.525 12.19c12.748.006 13.477 0 14.257 0c.797 0 1.527.006 2.303.006l-1.02 3.134a2 2 0 001.935 1.896l3.795.882A2 2 0 0017.747 19.52l-3.795-.882A2 2 0 0020.752 16.72l-1.02-3.134z"/>
                        </svg>
                        <span className="font-medium">{truck.average_rating.toFixed(1)}</span>
                        <span className="text-gray-400">({truck.review_count})</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {truck.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {truck.description}
                  </p>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={(e) => handleFavoriteClick(e, truck.id)}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      favorites.has(truck.id)
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    }`}
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      {favorites.has(truck.id) ? (
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 9.343l1.172-1.171a4 4 0 115.656 0L16.828 5.172a4 4 0 010 5.656L10.657 17l-1.171 1.171a4 4 0 01-5.656 0L3.172 10.828a4 4 0 010-5.656zm5.656 8.485L10 17.657l16.485 8.485a1 1 0 11-1.414 1.414L10.657 18.485a1 1 0 01-1.414 0l-6.364-6.364a1 1 0 010-1.414z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 9.343l16.657 5.172a4 4 0 010 5.656L10.657 17l-1.171 1.171a4 4 0 01-5.656 0L3.172 10.828a4 4 0 010-5.656zm8.485 1.657a1 1 0 11-1.414 1.414L10.657 18.485a1 1 0 01-1.414 0l-6.364-6.364a1 1 0 010-1.414z" clipRule="evenodd" />
                      )}
                    </svg>
                    {favorites.has(truck.id) ? 'Remove' : 'Add to'} Favorites
                  </button>

                  <Link
                    to={`/truck/${truck.id}`}
                    className="btn-primary inline-flex items-center text-sm px-4"
                  >
                    View Details
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </Link>

                  {truck.contact_phone && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(truck.contact_phone)
                        toast.success('Phone number copied to clipboard!')
                      }}
                      className="btn-secondary inline-flex items-center text-sm px-3"
                      title="Copy phone number"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2v3a2 2 0 012 2h3.283l1.465 1.95A2 2 0 0114 14.657l-1.465-1.95H7a2 2 0 01-2-2V5a2 2 0 012-2h3zM3 8a1 1 0 000 2v8a1 1 0 001 1h6a1 1 0 001-1v-8a1 1 0 00-1-1z"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TruckList