import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import ChatInterface from '../components/ChatInterface'
import PredictionForm from '../components/PredictionForm'
import PredictionResults from '../components/PredictionResults'
import History from './History'
import Prediction from './Prediction'
import Knowledge_Base from './KnowledgeBase'
import Help from './Help'
import Analysis from './Analysis'

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showResults, setShowResults] = useState(false);
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-green-50 to-white">
          <Routes>
            <Route path="/" element={<Navigate to="/auth/dashboard/chat" replace />} />

            <Route path="/chat" element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6">
                  <PredictionForm 
                    onGenerate={() => setShowResults(true)}
                    onClear={() => setShowResults(false)}
                  />
                  {showResults && <PredictionResults />}
                  <ChatInterface />
                </div>
              </div>
            } />

            {/* <Route path="/chat" element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6">
                  <PredictionForm />
                  <PredictionResults />
                  <ChatInterface />
                </div>
              </div>
            } /> */}
            <Route path="/history" element={<History />} />
            <Route path="/predictions" element={<Prediction />} />
            <Route path="/knowledge" element={<Knowledge_Base />} />
            <Route path="/help" element={<Help />} />
            <Route path="/analysis" element={<Analysis />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default Dashboard