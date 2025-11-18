import React, { createContext, useContext, useReducer, useEffect } from 'react'
import toast from 'react-hot-toast'
import { authService } from '../services/auth'

// Initial state
const initialState = {
  user: null,
  truck: null,
  loading: true,
  isAuthenticated: false,
  hasTruck: false
}

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  LOAD_USER_START: 'LOAD_USER_START',
  LOAD_USER_SUCCESS: 'LOAD_USER_SUCCESS',
  LOAD_USER_FAILURE: 'LOAD_USER_FAILURE',
  UPDATE_PROFILE: 'UPDATE_PROFILE'
}

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
    case AUTH_ACTIONS.LOAD_USER_START:
      return { ...state, loading: true }

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        truck: action.payload.truck || null,
        loading: false,
        isAuthenticated: true,
        hasTruck: !!action.payload.truck
      }

    case AUTH_ACTIONS.LOAD_USER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        truck: action.payload.truck || null,
        loading: false,
        isAuthenticated: true,
        hasTruck: !!action.payload.truck
      }

    case AUTH_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      }

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
    case AUTH_ACTIONS.LOAD_USER_FAILURE:
      return {
        ...state,
        loading: false,
        user: null,
        truck: null,
        isAuthenticated: false,
        hasTruck: false
      }

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        truck: null,
        loading: false,
        isAuthenticated: false,
        hasTruck: false
      }

    default:
      return state
  }
}

// Create context
const AuthContext = createContext()

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load user on mount
  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    dispatch({ type: AUTH_ACTIONS.LOAD_USER_START })

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        dispatch({ type: AUTH_ACTIONS.LOAD_USER_FAILURE })
        return
      }

      const response = await authService.getCurrentUser()
      dispatch({
        type: AUTH_ACTIONS.LOAD_USER_SUCCESS,
        payload: response.data
      })
    } catch (error) {
      localStorage.removeItem('token')
      dispatch({ type: AUTH_ACTIONS.LOAD_USER_FAILURE })
    }
  }

  const login = async (email, password, userType) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START })

    try {
      const response = await authService.login(email, password, userType)

      // Store token
      localStorage.setItem('token', response.data.token)

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: response.data
      })

      toast.success(`${userType === 'customer' ? 'Customer' : 'Owner'} login successful!`)
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE })
      toast.error(message)
      return { success: false, message }
    }
  }

  const register = async (userData, userType) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START })

    try {
      const response = await authService.register(userData, userType)

      // Store token
      localStorage.setItem('token', response.data.token)

      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: response.data
      })

      toast.success(`${userType === 'customer' ? 'Customer' : 'Owner'} registration successful!`)
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      dispatch({ type: AUTH_ACTIONS.REGISTER_FAILURE })
      toast.error(message)
      return { success: false, message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    dispatch({ type: AUTH_ACTIONS.LOGOUT })
    toast.success('Logged out successfully')
  }

  const updateProfile = async (userData) => {
    try {
      const response = await authService.updateProfile(userData)
      dispatch({
        type: AUTH_ACTIONS.UPDATE_PROFILE,
        payload: response.data
      })
      toast.success('Profile updated successfully!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    loadUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext