import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaLeaf } from 'react-icons/fa'
import { motion } from 'framer-motion'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    
    try {
      setLoading(true)
      await login(email, password)
      navigate('/auth/dashboard')
    } catch (error) {
      setError(error.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <motion.div 
              className="inline-flex items-center justify-center bg-primary-100 p-3 rounded-full mb-4"
              whileHover={{ rotate: 10 }}
            >
              <FaLeaf className="text-primary-600 text-3xl leaf-animation" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-800">AI Agriculture Chatbot</h1>
            <p className="text-gray-600 mt-2">Your virtual farming assistant</p>
          </div>
          
          {error && (
            <motion.div 
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              {error}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                // placeholder="At least 6 characters"
                required
                // minLength={6}
              />
            </div>
            
            <motion.button
              type="submit"
              className="btn btn-primary w-full mt-6"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </motion.button>
            <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/auth/signup')}
                className="text-primary-600 hover:underline"
              >
                Signup
              </button>
            </p>
          </div>

          </form>
          
          {/* <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Demo credentials: sindhudurg.agri@gmail.com / pavan
            </p>
          </div> */}
        </div>
        
        <div className="bg-primary-600 text-white p-4 text-center text-sm">
          Cultivate success with AI-powered agricultural insights
        </div>
      </motion.div>
    </div>
  )
}

export default Login