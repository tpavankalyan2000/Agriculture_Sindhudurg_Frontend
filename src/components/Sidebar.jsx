import { Link, useLocation } from 'react-router-dom'
import { FaTimes, FaLeaf, FaComments, FaChartLine, FaBook, FaQuestionCircle, FaHistory } from 'react-icons/fa'
import { GiForest } from "react-icons/gi";
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { name: 'AI Chat', path: '/auth/dashboard/chat', icon: FaComments },
  { name: 'AI - Forest', path: '/auth/dashboard/predictions', icon: GiForest },
  { name: 'Analysis', path: '/auth/dashboard/analysis', icon: FaChartLine },
  { name: 'History', path: '/auth/dashboard/history', icon: FaHistory },
  { name: 'Knowledge Base', path: '/auth/dashboard/knowledge', icon: FaBook },
  { name: 'Help & Support', path: '/auth/dashboard/help', icon: FaQuestionCircle },
]

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation()
  
  const closeSidebar = () => {
    setIsOpen(false)
  }
  
  return (
    <>
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden fixed inset-0 bg-black z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <div 
        className={`w-72 bg-white border-r border-gray-200 fixed md:static inset-y-0 left-0 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } transition-transform duration-300 ease-in-out z-30 md:z-0`}
      >
        <div className="h-full flex flex-col">
          {/* Logo & Close Button */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
            <Link to="/auth/dashboard" className="flex items-center space-x-3">
              <motion.div 
                className="bg-primary-100 p-2 rounded-lg"
                whileHover={{ rotate: 10 }}
              >
                <FaLeaf className="text-primary-600 h-6 w-6 leaf-animation" />
              </motion.div>
              <span className="text-xl font-bold text-primary-700">AgriBot</span>
            </Link>
            
            <button
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={closeSidebar}
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-primary-600' : 'text-gray-500'}`} />
                  <span className="ml-3 font-medium">{item.name}</span>
                  {isActive && (
                    <motion.div
                      className="w-1.5 h-1.5 bg-primary-600 rounded-full ml-auto"
                      layoutId="sidebarIndicator"
                    />
                  )}
                </Link>
              )
            })}
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">
                <div className="font-medium mb-1">AI Agriculture Chatbot</div>
                <div className="text-xs text-gray-500">Version 0.1.0</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar