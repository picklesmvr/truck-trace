import { useState, useEffect } from 'react'

const FilterPanel = ({ filters, onFilterChange, cuisineOptions }) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [localSearch, setLocalSearch] = useState(filters.search || '')
  const [localCuisines, setLocalCuisines] = useState(filters.cuisine_types || [])
  const [localRadius, setLocalRadius] = useState(filters.radius || 5)
  const [localSortBy, setLocalSortBy] = useState(filters.sortBy || 'distance')

  // Update parent when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({
        search: localSearch,
        cuisine_types: localCuisines,
        radius: localRadius,
        sortBy: localSortBy
      })
    }, 300) // Debounce search

    return () => clearTimeout(timer)
  }, [localSearch, localCuisines, localRadius, localSortBy, onFilterChange])

  const handleCuisineToggle = (cuisine) => {
    setLocalCuisines(prev =>
      prev.includes(cuisine)
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    )
  }

  const clearAllFilters = () => {
    setLocalSearch('')
    setLocalCuisines([])
    setLocalRadius(5)
    setLocalSortBy('distance')
  }

  const hasActiveFilters = localSearch || localCuisines.length > 0 || localRadius !== 5 || localSortBy !== 'distance'

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg
            className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search trucks, food items..."
                className="form-input pr-10"
              />
              {localSearch && (
                <button
                  onClick={() => setLocalSearch('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.707-1.707a1 1 0 00-1.414 1.414L8 12.414l1.707 1.707a1 1 0 001.414-1.414L10.414 12l1.707-1.707a1 1 0 00-1.414 1.414L10 10.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Distance Radius */}
          <div>
            <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-2">
              Distance Radius
            </label>
            <select
              id="radius"
              value={localRadius}
              onChange={(e) => setLocalRadius(Number(e.target.value))}
              className="form-input"
            >
              <option value={1}>1 mile</option>
              <option value={2}>2 miles</option>
              <option value={5}>5 miles</option>
              <option value={10}>10 miles</option>
              <option value={25}>25 miles</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              id="sortBy"
              value={localSortBy}
              onChange={(e) => setLocalSortBy(e.target.value)}
              className="form-input"
            >
              <option value="distance">Distance</option>
              <option value="rating">Rating</option>
              <option value="name">Name</option>
            </select>
          </div>

          {/* Cuisine Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuisine Types
              </label>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
              {cuisineOptions.map(cuisine => (
                <label key={cuisine} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={localCuisines.includes(cuisine)}
                    onChange={() => handleCuisineToggle(cuisine)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mr-3"
                  />
                  <span className="text-sm text-gray-700">{cuisine}</span>
                </label>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {localCuisines.length} of {cuisineOptions.length} selected
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="btn-secondary w-full text-sm"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default FilterPanel