import { Routes, Route, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth } from './contexts/AuthContext'

// Pages
import LandingPage from './pages/LandingPage'
import CustomerDashboard from './pages/CustomerDashboard'
import TruckProfile from './pages/TruckProfile'
import OwnerDashboard from './pages/OwnerDashboard'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfileSettings from './pages/ProfileSettings'

// Protected route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, hasTruck } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole === 'customer' && hasTruck) {
    return <Navigate to="/owner/dashboard" replace />
  }

  if (requiredRole === 'owner' && !hasTruck) {
    return <Navigate to="/customer/dashboard" replace />
  }

  return children
}

// Public route component (redirects authenticated users)
const PublicRoute = ({ children }) => {
  const { user, loading, hasTruck } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (user) {
    return hasTruck ? <Navigate to="/owner/dashboard" replace /> : <Navigate to="/customer/dashboard" replace />
  }

  return children
}

function App() {
  return (
    <>
      <Helmet>
        <title>TruckTrace - Food Truck Location Sharing</title>
        <meta name="description" content="Connect with your favorite food trucks in real-time" />
        <meta property="og:title" content="TruckTrace - Food Truck Location Sharing" />
        <meta property="og:description" content="Connect with your favorite food trucks in real-time" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TruckTrace - Food Truck Location Sharing" />
        <meta name="twitter:description" content="Connect with your favorite food trucks in real-time" />
      </Helmet>

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* Customer Routes */}
        <Route path="/customer/dashboard" element={
          <ProtectedRoute requiredRole="customer">
            <CustomerDashboard />
          </ProtectedRoute>
        } />

        <Route path="/truck/:id" element={
          <ProtectedRoute requiredRole="customer">
            <TruckProfile />
          </ProtectedRoute>
        } />

        {/* Owner Routes */}
        <Route path="/owner/dashboard" element={
          <ProtectedRoute requiredRole="owner">
            <OwnerDashboard />
          </ProtectedRoute>
        } />

        {/* Shared Routes */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfileSettings />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App