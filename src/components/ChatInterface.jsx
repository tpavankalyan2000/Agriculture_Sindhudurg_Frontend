import { useState, useRef, useEffect } from 'react'
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'

// Mock initial messages
const initialMessages = [
  {
    id: 1,
    type: 'bot',
    text: 'Hello! I\'m your AI Agriculture assistant. How can I help with your cultivation questions today?',
    timestamp: new Date()
  }
]

const ChatInterface = () => {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  
  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!input.trim()) return
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: input.trim(),
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    
    // Simulate bot response after a delay
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: generateBotResponse(input.trim()),
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }
  
  // Simple response generator based on user input
  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase()
    
    if (input.includes('apple') || input.includes('apples')) {
      return "Apple trees typically start bearing fruit 2-3 years after planting. For optimal growth, they need well-drained soil, full sun exposure, and regular watering. Based on your parameters, I recommend checking for pests like apple maggots and applying a balanced fertilizer in early spring."
    } else if (input.includes('orange') || input.includes('oranges')) {
      return "Orange trees usually take 3-5 years to produce fruit. They thrive in warm climates and require protection from frost. With your tree's age, focus on maintaining consistent moisture levels and watch for signs of citrus greening disease."
    } else if (input.includes('fertilizer') || input.includes('fertilize')) {
      return "For fruit trees, I recommend using a balanced fertilizer with an NPK ratio of 10-10-10 in early spring before new growth appears. Apply it around the drip line, not directly against the trunk, and water thoroughly afterward."
    } else if (input.includes('water') || input.includes('irrigation')) {
      return "Young fruit trees need consistent watering - about 5-10 gallons per week depending on soil conditions and weather. Established trees need deep, infrequent watering. Consider using drip irrigation to provide slow, steady moisture to the root zone."
    } else if (input.includes('pest') || input.includes('disease')) {
      return "Common fruit tree pests include aphids, borers, and fruit flies. For organic control, consider neem oil, insecticidal soap, or introducing beneficial insects. Regular inspection of leaves and fruit is essential for early detection."
    } else {
      return "To provide more specific advice about your fruit cultivation, I'd need more details about your specific conditions like soil type, climate zone, and any specific issues you're experiencing. What other information can you share about your agricultural situation?"
    }
  }
  
  return (
    <motion.div 
      className="card h-[500px] flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="p-4 bg-primary-50 border-b border-primary-100 flex items-center">
        <div className="bg-primary-100 rounded-full p-2 mr-3">
          <FaRobot className="text-primary-600 text-lg" />
        </div>
        <div>
          <h3 className="font-medium text-gray-800">Agriculture Assistant</h3>
          <p className="text-xs text-gray-500">AI-powered farming insights</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`chat-message ${message.type === 'user' ? 'user' : 'bot'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex">
                <div className={`rounded-full p-2 mr-2 ${message.type === 'user' ? 'bg-primary-100' : 'bg-white border border-gray-200'}`}>
                  {message.type === 'user' ? (
                    <FaUser className="text-primary-600 text-sm" />
                  ) : (
                    <FaRobot className="text-primary-600 text-sm" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm">
                    {message.text}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {format(message.timestamp, 'hh:mm a')}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              className="chat-message bot"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex">
                <div className="rounded-full p-2 mr-2 bg-white border border-gray-200">
                  <FaRobot className="text-primary-600 text-sm" />
                </div>
                <div className="flex items-center">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about cultivation, fruit trees, pests, etc..."
            className="flex-1 input-field"
          />
          <motion.button
            type="submit"
            className="btn btn-primary ml-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isTyping || !input.trim()}
          >
            <FaPaperPlane />
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}

export default ChatInterface