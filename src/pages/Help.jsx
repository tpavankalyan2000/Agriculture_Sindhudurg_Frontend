import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaQuestionCircle, FaEnvelope, FaPhone, FaComments } from 'react-icons/fa'

const faqs = [
  {
    id: 1,
    question: 'How accurate are the growth predictions?',
    answer: 'Our AI model has been trained on extensive agricultural data and typically achieves 85-95% accuracy. Predictions are based on historical data, environmental conditions, and specific fruit characteristics.'
  },
  {
    id: 2,
    question: 'What factors influence the prediction results?',
    answer: 'Key factors include tree age, fruit type, local climate conditions, soil quality, irrigation methods, and historical growth patterns. The more accurate the input data, the better the predictions.'
  },
  {
    id: 3,
    question: 'How often should I update my cultivation parameters?',
    answer: 'We recommend updating your parameters every 2-4 weeks or whenever significant changes occur in growing conditions. Regular updates help maintain prediction accuracy.'
  },
  {
    id: 4,
    question: 'Can I export my prediction history?',
    answer: 'Yes, you can export your prediction history as CSV or PDF reports. This feature helps track growth patterns and improve future cultivation strategies.'
  },
  {
    id: 5,
    question: 'What should I do if the predictions seem incorrect?',
    answer: 'First, verify all input parameters are accurate. If issues persist, document the discrepancies and contact our support team for assistance in calibrating the predictions.'
  }
]

const Help = () => {
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', contactForm)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <FaQuestionCircle className="mr-3 text-primary-600" />
          Help & Support
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <motion.div
            className="bg-white rounded-lg shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <motion.div
                    key={faq.id}
                    className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <button
                      className="w-full text-left"
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-medium text-gray-800">{faq.question}</h4>
                        <span className="text-primary-600">
                          {expandedFaq === faq.id ? '−' : '+'}
                        </span>
                      </div>
                    </button>
                    {expandedFaq === faq.id && (
                      <motion.p
                        className="mt-2 text-gray-600"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                      >
                        {faq.answer}
                      </motion.p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          <motion.div
            className="bg-white rounded-lg shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Contact Support</h3>
              <div className="space-y-6">
                <div className="flex items-center text-gray-600">
                  <FaEnvelope className="h-5 w-5 text-primary-600 mr-3" />
                  support@agribot.com
                </div>
                <div className="flex items-center text-gray-600">
                  <FaPhone className="h-5 w-5 text-primary-600 mr-3" />
                  +1 (555) 123-4567
                </div>
                <div className="flex items-center text-gray-600">
                  <FaComments className="h-5 w-5 text-primary-600 mr-3" />
                  Live chat available 24/7
                </div>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      className="mt-1 input-field"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      className="mt-1 input-field"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                    <input
                      type="text"
                      className="mt-1 input-field"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea
                      className="mt-1 input-field"
                      rows="4"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                    ></textarea>
                  </div>
                  <motion.button
                    type="submit"
                    className="w-full btn btn-primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Send Message
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Help