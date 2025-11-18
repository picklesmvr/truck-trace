import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

const LoginPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const [userType, setUserType] = useState('customer')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  // Get user type from URL params
  useEffect(() => {
    const type = searchParams.get('user')
    if (type === 'owner' || type === 'customer') {
      setUserType(type)
    }
  }, [searchParams])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await login(formData.email, formData.password, userType)
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
    setFormData({ email: '', password: '' })
  }

  return (
    <>
      <Helmet>
        <title>Login - TruckTrace</title>
        <meta name="description" content="Login to your TruckTrace account" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
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
            <h2 className="text-lg font-semibold text-gray-600">Welcome back!</h2>
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
              Customer Login
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
              Owner Login
            </button>
          </div>

          <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <button
                  type="button"
                  className="text-sm text-orange-600 hover:text-orange-500 font-medium"
                  onClick={() => toast.info('Password reset coming soon!')}
                >
                  Forgot password?
                </button>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="form-button flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="spinner w-4 h-4 mr-2"></div>
                      Signing in...
                    </>
                  ) : (
                    `Sign in as ${userType === 'customer' ? 'Customer' : 'Owner'}`
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
                  <span className="px-2 bg-white text-gray-500">New to TruckTrace?</span>
                </div>
              </div>

              <div className="mt-4 text-center">
                <Link
                  to={`/register?user=${userType}`}
                  className="font-medium text-orange-600 hover:text-orange-500"
                >
                  Create your free {userType === 'customer' ? 'customer' : 'owner'} account
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

export default LoginPage