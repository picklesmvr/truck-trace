import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../contexts/AuthContext'

const ProfileSettings = () => {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    profile_photo_url: '',
    preferred_cuisines: [],
    notification_radius_miles: 2,
    push_notifications_enabled: false,
    current_password: '',
    new_password: '',
    confirm_new_password: ''
  })
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [showPasswordSection, setShowPasswordSection] = useState(false)

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        profile_photo_url: user.profile_photo_url || '',
        preferred_cuisines: user.preferred_cuisines || [],
        notification_radius_miles: user.notification_radius_miles || 2,
        push_notifications_enabled: user.push_notifications_enabled || false,
        current_password: '',
        new_password: '',
        confirm_new_password: ''
      })
    }
  }, [user])

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

  const validateProfileForm = () => {
    const errors = []

    if (!formData.username || formData.username.length < 3) {
      errors.push('Username must be at least 3 characters')
    }

    if (formData.profile_photo_url && !isValidUrl(formData.profile_photo_url)) {
      errors.push('Profile photo URL must be a valid URL')
    }

    return errors
  }

  const validatePasswordForm = () => {
    const errors = []

    if (!formData.current_password) {
      errors.push('Current password is required')
    }

    if (formData.new_password && formData.new_password.length < 8) {
      errors.push('New password must be at least 8 characters')
    }

    if (formData.new_password !== formData.confirm_new_password) {
      errors.push('Passwords do not match')
    }

    return errors
  }

  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()

    const errors = validateProfileForm()
    if (errors.length > 0) {
      errors.forEach(error => window.toast?.error(error))
      return
    }

    setLoading(true)

    try {
      const result = await updateProfile({
        username: formData.username,
        profile_photo_url: formData.profile_photo_url || null,
        preferred_cuisines: formData.preferred_cuisines,
        notification_radius_miles: formData.notification_radius_miles,
        push_notifications_enabled: formData.push_notifications_enabled
      })

      if (result.success) {
        // Update successful - reset password form
        setFormData(prev => ({
          ...prev,
          current_password: '',
          new_password: '',
          confirm_new_password: ''
        }))
        setShowPasswordSection(false)
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    const errors = validatePasswordForm()
    if (errors.length > 0) {
      errors.forEach(error => window.toast?.error(error))
      return
    }

    if (!formData.new_password) {
      window.toast?.error('New password is required')
      return
    }

    setLoading(true)

    try {
      // TODO: Implement password change functionality
      // For now, just show success message
      window.toast?.success('Password change coming soon!')

      // Reset password form
      setFormData(prev => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_new_password: ''
      }))
      setShowPasswordSection(false)
    } finally {
      setLoading(false)
    }
  }

  const cuisineOptions = [
    'American', 'Mexican', 'Italian', 'Asian', 'BBQ', 'Desserts', 'Vegan', 'Indian',
    'Thai', 'Japanese', 'Chinese', 'French', 'Mediterranean', 'Middle Eastern', 'African'
  ]

  return (
    <>
      <Helmet>
        <title>Profile Settings - TruckTrace</title>
        <meta name="description" content="Manage your TruckTrace profile settings" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white shadow-sm rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            </div>

            {/* Tabs */}
            <div className="px-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('general')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === 'general'
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    General
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === 'security'
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Security
                  </button>
                </nav>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            {/* General Settings Tab */}
            {activeTab === 'general' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
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
                      value={formData.username}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Your username"
                    />
                  </div>

                  <div>
                    <label htmlFor="profile_photo_url" className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Photo URL
                    </label>
                    <input
                      id="profile_photo_url"
                      name="profile_photo_url"
                      type="url"
                      value={formData.profile_photo_url}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="https://example.com/photo.jpg"
                    />
                    {formData.profile_photo_url && (
                      <div className="mt-2">
                        <img
                          src={formData.profile_photo_url}
                          alt="Profile preview"
                          className="h-16 w-16 rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Cuisine Types
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-4">
                    {cuisineOptions.map(cuisine => (
                      <label key={cuisine} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
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
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.preferred_cuisines?.length || 0} of {cuisineOptions.length} selected
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="notification_radius_miles" className="block text-sm font-medium text-gray-700 mb-2">
                      Notification Radius (miles)
                    </label>
                    <select
                      id="notification_radius_miles"
                      name="notification_radius_miles"
                      value={formData.notification_radius_miles}
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

                  <div className="flex items-center pt-6">
                    <input
                      id="push_notifications_enabled"
                      name="push_notifications_enabled"
                      type="checkbox"
                      checked={formData.push_notifications_enabled}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="push_notifications_enabled" className="ml-2 block text-sm text-gray-900">
                      Enable push notifications
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate('/customer/dashboard')}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="form-button"
                  >
                    {loading ? (
                      <>
                        <div className="spinner w-4 h-4 mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Security Settings Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Password Change</h3>
                      <p className="mt-1 text-sm text-yellow-700">
                        Password change functionality will be available in the next update. For security reasons, please use a strong password with uppercase, lowercase, and numbers.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => setShowPasswordSection(!showPasswordSection)}
                    className="w-full text-left px-4 py-3 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <span>Change Password</span>
                      <svg
                        className={`w-4 h-4 transform transition-transform ${showPasswordSection ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                </div>

                {showPasswordSection && (
                  <form onSubmit={handlePasswordSubmit} className="space-y-6 mt-4 pt-4 border-t border-gray-200">
                    <div>
                      <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        id="current_password"
                        name="current_password"
                        type="password"
                        required
                        value={formData.current_password}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter your current password"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          id="new_password"
                          name="new_password"
                          type="password"
                          required
                          value={formData.new_password}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="Enter new password"
                        />
                      </div>

                      <div>
                        <label htmlFor="confirm_new_password" className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          id="confirm_new_password"
                          name="confirm_new_password"
                          type="password"
                          required
                          value={formData.confirm_new_password}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            current_password: '',
                            new_password: '',
                            confirm_new_password: ''
                          }))
                          setShowPasswordSection(false)
                        }}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="form-button"
                      >
                        {loading ? (
                          <>
                            <div className="spinner w-4 h-4 mr-2"></div>
                            Updating...
                          </>
                        ) : (
                          'Update Password'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h2>
            <div className="space-y-4">
              <button
                onClick={() => {
                  window.toast?.info('Account deletion coming soon!')
                }}
                className="w-full text-left px-4 py-3 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors duration-200"
              >
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfileSettings