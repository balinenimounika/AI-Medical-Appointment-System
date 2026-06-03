import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  )

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          const response = await axios.get('/api/auth/me')
          setUser(response.data.user)
        } catch (error) {
          console.error('Error fetching user:', error)
          localStorage.removeItem('token')
          setToken(null)
          delete axios.defaults.headers.common['Authorization']
        }
      }
      setLoading(false)
    }

    fetchUser()
  }, [token])

  useEffect(() => {
  if (isDarkMode) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}, [isDarkMode])

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password })
      const { token: newToken, user: userData } = response.data
      
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(userData)
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      }
    }
  }

  const signup = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData)
      const { token: newToken, user: newUser } = response.data
      
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(newUser)
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    delete axios.defaults.headers.common['Authorization']
  }

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isDarkMode,
    toggleTheme: () => setIsDarkMode(prev => !prev),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
