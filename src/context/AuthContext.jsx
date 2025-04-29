import { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Check local storage for user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('agri_user')
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // Login function - in a real app, this would make an API call
  const login = async (email, password) => {
    // Simulate API request
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock validation
        if (email === 'sindhudurg.agri@maha.gov.in' && password === 'pavan') {
          const user = { id: 1, email, name: email.split('@')[0] }
          setCurrentUser(user)
          localStorage.setItem('agri_user', JSON.stringify(user))
          resolve(user)
        } else {
          reject(new Error('Invalid credentials'))
        }
      }, 1000)
    })
  }

  // Logout function
  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('agri_user')
  }

  const value = {
    currentUser,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}