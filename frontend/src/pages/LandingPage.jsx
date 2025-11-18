import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import truckImage from '../assets/truck-food.svg'

const LandingPage = () => {
  return (
    <>
      <Helmet>
        <title>TruckTrace - Find Your Favorite Food Trucks</title>
        <meta name="description" content="Connect with your favorite food trucks in real-time. Never miss your truck again!" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05l2.476 2.95A1 1 0 008.081 18h3.838a1 1 0 00.761-.35L15.95 15H17a1 1 0 001-1V5a1 1 0 00-1-1H3z"/>
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-900">TruckTrace</span>
              </div>
              <nav className="hidden md:flex space-x-8">
                <Link to="#features" className="text-gray-700 hover:text-orange-600 font-medium">Features</Link>
                <Link to="#about" className="text-gray-700 hover:text-orange-600 font-medium">About</Link>
                <Link to="/login" className="text-gray-700 hover:text-orange-600 font-medium">Login</Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-responsive-xl font-bold text-gray-900 mb-6">
                  Never Miss Your
                  <span className="text-orange-500 block">Favorite Food Truck</span>
                  Again
                </h1>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl">
                  Connect with food truck owners in real-time. Get instant location updates,
                  browse menus, and discover new trucks in your area.
                </p>

                {/* User Type Selection */}
                <div className="space-y-4">
                  <Link
                    to="/register?user=customer"
                    className="btn-primary w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                    </svg>
                    I'm a Customer
                  </Link>

                  <Link
                    to="/register?user=owner"
                    className="btn-outline w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05l2.476 2.95A1 1 0 008.081 18h3.838a1 1 0 00.761-.35L15.95 15H17a1 1 0 001-1V5a1 1 0 00-1-1H3z"/>
                    </svg>
                    I'm a Food Truck Owner
                  </Link>
                </div>

                <p className="mt-6 text-sm text-gray-500">
                  Already have an account?
                  <Link to="/login" className="text-orange-500 hover:text-orange-600 font-medium ml-1">
                    Sign in
                  </Link>
                </p>
              </div>

              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <img
                    src={truckImage}
                    alt="Food Truck Illustration"
                    className="w-full h-auto"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23f59e0b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'/%3E%3C/svg%3E"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-responsive-lg font-bold text-gray-900 mb-4">
                Everything You Need to Stay Connected
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Powerful features for both food truck owners and hungry customers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Customer Features */}
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Tracking</h3>
                <p className="text-gray-600">
                  Track your favorite food trucks in real-time and never miss them again
                </p>
              </div>

              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Favorites System</h3>
                <p className="text-gray-600">
                  Save your favorite trucks and get notifications when they're nearby
                </p>
              </div>

              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Menu Discovery</h3>
                <p className="text-gray-600">
                  Browse menus, prices, and specialties before you visit
                </p>
              </div>

              {/* Owner Features */}
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Engagement</h3>
                <p className="text-gray-600">
                  Connect directly with your customers and build loyalty
                </p>
              </div>

              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
                <p className="text-gray-600">
                  Track performance, popular items, and customer engagement
                </p>
              </div>

              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Updates</h3>
                <p className="text-gray-600">
                  Update your location with one click from anywhere
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-responsive-lg font-bold text-gray-900 mb-6">
              Bringing Food Lovers and Food Trucks Together
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              TruckTrace bridges the gap between food truck owners and hungry customers.
              No more guessing where your favorite truck will be next. No more missed customers
              because they couldn't find you. Real-time location sharing, menu discovery, and
              community engagement - all in one platform.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-orange-500 mb-2">500+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-500 mb-2">50+</div>
                <div className="text-gray-600">Food Trucks</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-500 mb-2">1000+</div>
                <div className="text-gray-600">Daily Connections</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05l2.476 2.95A1 1 0 008.081 18h3.838a1 1 0 00.761-.35L15.95 15H17a1 1 0 001-1V5a1 1 0 00-1-1H3z"/>
                  </svg>
                </div>
                <span className="text-lg font-semibold">TruckTrace</span>
              </div>
              <div className="text-center md:text-right">
                <p className="text-gray-400">© 2025 TruckTrace. All rights reserved.</p>
                <p className="text-gray-400 text-sm">Connecting communities through food.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default LandingPage