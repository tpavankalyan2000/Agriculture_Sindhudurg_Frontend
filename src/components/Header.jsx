import { useAuth } from '../context/AuthContext'
import { FaBars, FaSignOutAlt, FaUser, FaBell, FaCog } from 'react-icons/fa'
import { motion } from 'framer-motion'

const Header = ({ toggleSidebar }) => {
  const { currentUser, logout } = useAuth()

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center">
        <button
          className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={toggleSidebar}
        >
          <FaBars className="h-5 w-5" />
        </button>
        
        <div className="hidden md:block ml-4">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
          <FaBell className="h-5 w-5" />
        </button>
        
        <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
          <FaCog className="h-5 w-5" />
        </button>
        
        <div className="flex items-center space-x-3">
          <motion.div 
            className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700"
            whileHover={{ scale: 1.05 }}
          >
            <FaUser className="h-4 w-4" />
          </motion.div>
          
          <div className="hidden md:block">
            <div className="text-sm font-medium text-gray-700">{currentUser?.name || 'User'}</div>
            <div className="text-xs text-gray-500">Agriculture Expert</div>
          </div>
          
          <motion.button
            onClick={logout}
            className="p-2 rounded-full hover:bg-gray-100"
            whileHover={{ scale: 1.05 }}
            title="Logout"
          >
            <FaSignOutAlt className="h-4 w-4 text-gray-500" />
          </motion.button>
        </div>
      </div>
    </header>
  )
}

export default Header