import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../contexts/AuthContext'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { register } = useAuth()
  const [userType, setUserType] = useState('customer')
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)

  // Initialize form data based on user type
  useEffect(() => {
    const type = searchParams.get('user')
    if (type === 'owner' || type === 'customer') {
      setUserType(type)
    }
    setFormData(getInitialFormData(type))
  }, [searchParams])

  const getInitialFormData = (type) => {
    if (type === 'customer') {
      return {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        profile_photo_url: '',
        preferred_cuisines: [],
        notification_radius_miles: 2
      }
    } else {
      return {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        business_name: '',
        truck_name: '',
        cuisine_types: [],
        description: '',
        logo_url: '',
        cover_photo_url: '',
        contact_phone: '',
        social_links: {}
      }
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleArrayChange = (e) => {
    const values = e.target.value.split(',').map(v => v.trim()).filter(v => v)
    setFormData({
      ...formData,
      [e.target.name]: values
    })
  }

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target
    const currentArray = formData[name] || []

    if (checked) {
      setFormData({
        ...formData,
        [name]: [...currentArray, value]
      })
    } else {
      setFormData({
        ...formData,
        [name]: currentArray.filter(item => item !== value)
      })
    }
  }

  const validateForm = () => {
    const errors = []

    // Common validations
    if (!formData.username || formData.username.length < 3) {
      errors.push('Username must be at least 3 characters')
    }
    if (!formData.email) {
      errors.push('Email is required')
    }
    if (!formData.password || formData.password.length < 8) {
      errors.push('Password must be at least 8 characters')
    }
    if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match')
    }

    // Customer-specific validations
    if (userType === 'customer') {
      if (!formData.preferred_cuisines || formData.preferred_cuisines.length === 0) {
        errors.push('Please select at least one preferred cuisine type')
      }
    }

    // Owner-specific validations
    if (userType === 'owner') {
      if (!formData.business_name) {
        errors.push('Business name is required')
      }
      if (!formData.truck_name) {
        errors.push('Truck name is required')
      }
      if (!formData.cuisine_types || formData.cuisine_types.length === 0) {
        errors.push('Please select at least one cuisine type')
      }
    }

    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = validateForm()
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error))
      return
    }

    setLoading(true)

    try {
      const result = await register(formData, userType)
      if (result.success) {
        navigate(userType === 'customer' ? '/customer/dashboard' : '/owner/dashboard')
      }
    } catch (error) {
      // Error is already handled in auth context
    } finally {
      setLoading(false)
    }
  }

  const toggleUserType = (type) => {
    setUserType(type)
    setFormData(getInitialFormData(type))
  }

  const cuisineOptions = [
    'American', 'Mexican', 'Italian', 'Asian', 'BBQ', 'Desserts', 'Vegan', 'Indian',
    'Thai', 'Japanese', 'Chinese', 'French', 'Mediterranean', 'Middle Eastern', 'African'
  ]

  return (
    <>
      <Helmet>
        <title>Register - TruckTrace</title>
        <meta name="description" content="Create your TruckTrace account" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05l2.476 2.95A1 1 0 008.081 18h3.838a1 1 0 00.761-.35L15.95 15H17a1 1 0 001-1V5a1 1 0 00-1-1H3z"/>
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900">TruckTrace</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-600">
              Create your {userType === 'customer' ? 'customer' : 'food truck owner'} account
            </h2>
          </div>

          {/* User Type Toggle */}
          <div className="bg-white rounded-lg shadow-md p-1 mb-6 flex">
            <button
              type="button"
              onClick={() => toggleUserType('customer')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                userType === 'customer'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => toggleUserType('owner')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                userType === 'owner'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Food Truck Owner
            </button>
          </div>

          <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Common Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username || ''}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Choose a username"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password || ''}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Create a password"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword || ''}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              {/* Customer-specific fields */}
              {userType === 'customer' && (
                <>
                  <div>
                    <label htmlFor="profile_photo_url" className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Photo URL (optional)
                    </label>
                    <input
                      id="profile_photo_url"
                      name="profile_photo_url"
                      type="url"
                      value={formData.profile_photo_url || ''}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Cuisine Types
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-4">
                      {cuisineOptions.map(cuisine => (
                        <label key={cuisine} className="flex items-center">
                          <input
                            type="checkbox"
                            name="preferred_cuisines"
                            value={cuisine}
                            checked={formData.preferred_cuisines?.includes(cuisine) || false}
                            onChange={handleCheckboxChange}
                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mr-2"
                          />
                          <span className="text-sm text-gray-700">{cuisine}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="notification_radius_miles" className="block text-sm font-medium text-gray-700 mb-2">
                      Notification Radius (miles)
                    </label>
                    <select
                      id="notification_radius_miles"
                      name="notification_radius_miles"
                      value={formData.notification_radius_miles || 2}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value={1}>1 mile</option>
                      <option value={2}>2 miles</option>
                      <option value={5}>5 miles</option>
                      <option value={10}>10 miles</option>
                      <option value={25}>25 miles</option>
                    </select>
                  </div>
                </>
              )}

              {/* Owner-specific fields */}
              {userType === 'owner' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name
                      </label>
                      <input
                        id="business_name"
                        name="business_name"
                        type="text"
                        required
                        value={formData.business_name || ''}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Your business name"
                      />
                    </div>

                    <div>
                      <label htmlFor="truck_name" className="block text-sm font-medium text-gray-700 mb-2">
                        Truck Name
                      </label>
                      <input
                        id="truck_name"
                        name="truck_name"
                        type="text"
                        required
                        value={formData.truck_name || ''}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Your truck name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cuisine Types
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-4">
                      {cuisineOptions.map(cuisine => (
                        <label key={cuisine} className="flex items-center">
                          <input
                            type="checkbox"
                            name="cuisine_types"
                            value={cuisine}
                            checked={formData.cuisine_types?.includes(cuisine) || false}
                            onChange={handleCheckboxChange}
                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mr-2"
                          />
                          <span className="text-sm text-gray-700">{cuisine}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Business Description (optional)
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description || ''}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Tell customers about your food truck..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700 mb-2">
                        Logo URL (optional)
                      </label>
                      <input
                        id="logo_url"
                        name="logo_url"
                        type="url"
                        value={formData.logo_url || ''}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="https://example.com/logo.jpg"
                      />
                    </div>

                    <div>
                      <label htmlFor="cover_photo_url" className="block text-sm font-medium text-gray-700 mb-2">
                        Cover Photo URL (optional)
                      </label>
                      <input
                        id="cover_photo_url"
                        name="cover_photo_url"
                        type="url"
                        value={formData.cover_photo_url || ''}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="https://example.com/cover.jpg"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone (optional)
                    </label>
                    <input
                      id="contact_phone"
                      name="contact_phone"
                      type="tel"
                      value={formData.contact_phone || ''}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="form-button flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="spinner w-4 h-4 mr-2"></div>
                      Creating account...
                    </>
                  ) : (
                    `Create ${userType === 'customer' ? 'Customer' : 'Owner'} Account`
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>

              <div className="mt-4 text-center">
                <Link
                  to={`/login?user=${userType}`}
                  className="font-medium text-orange-600 hover:text-orange-500"
                >
                  Sign in as {userType === 'customer' ? 'customer' : 'owner'}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">
            ← Back to home
          </Link>
        </div>
      </div>
    </>
  )
}

export default RegisterPage