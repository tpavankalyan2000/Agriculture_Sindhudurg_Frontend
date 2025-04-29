import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaBook, FaSearch, FaSeedling, FaWater, FaSun, FaBug } from 'react-icons/fa'

const categories = [
  {
    id: 'fruits',
    title: 'Fruit Cultivation',
    icon: FaSeedling,
    articles: [
      {
        id: 1,
        title: 'Apple Tree Care Guide',
        content: 'Apple trees require full sun and well-draining soil. Plant them in early spring or late fall. Water deeply and regularly during the growing season. Prune in late winter to maintain shape and encourage fruit production.',
      },
      {
        id: 2,
        title: 'Mango Tree Maintenance',
        content: 'Mango trees thrive in tropical climates with temperatures between 21-24°C. They need protection from strong winds and frost. Regular fertilization with NPK 6-6-6 helps ensure healthy growth and fruit production.',
      },
      {
        id: 3,
        title: 'Citrus Growing Tips',
        content: 'Citrus trees need 8 hours of sunlight daily. Plant in well-draining soil and water consistently. Feed with citrus-specific fertilizer every 6-8 weeks during growing season. Monitor for citrus leaf miners and other pests.',
      }
    ]
  },
  {
    id: 'irrigation',
    title: 'Irrigation Methods',
    icon: FaWater,
    articles: [
      {
        id: 4,
        title: 'Drip Irrigation Basics',
        content: 'Drip irrigation delivers water directly to plant roots, reducing water waste. Install emitters 18-24 inches apart. Maintain water pressure between 20-30 PSI for optimal performance.',
      },
      {
        id: 5,
        title: 'Watering Schedule Guide',
        content: 'Young trees need 5-10 gallons of water per week. Mature trees require deep watering every 10-14 days. Adjust based on rainfall and soil moisture levels.',
      }
    ]
  },
  {
    id: 'climate',
    title: 'Climate Adaptation',
    icon: FaSun,
    articles: [
      {
        id: 6,
        title: 'Heat Stress Management',
        content: 'Protect trees from extreme heat with shade cloth. Mulch around the base to retain moisture. Water early morning or late evening to reduce evaporation.',
      },
      {
        id: 7,
        title: 'Cold Protection Methods',
        content: 'Use frost protection blankets when temperatures drop below freezing. Install wind breaks to protect from cold drafts. Consider using heat lamps for sensitive species.',
      }
    ]
  },
  {
    id: 'pests',
    title: 'Pest Control',
    icon: FaBug,
    articles: [
      {
        id: 8,
        title: 'Common Fruit Tree Pests',
        content: 'Monitor for aphids, fruit flies, and borers. Use integrated pest management techniques. Apply neem oil or insecticidal soap for organic control.',
      },
      {
        id: 9,
        title: 'Disease Prevention',
        content: 'Maintain good air circulation through proper pruning. Remove fallen fruit and leaves. Apply fungicides preventatively during wet seasons.',
      }
    ]
  }
]

const KnowledgeBase = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  
  const filteredCategories = categories.filter(category => 
    !selectedCategory || category.id === selectedCategory
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <FaBook className="mr-3 text-primary-600" />
          Knowledge Base
        </h2>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-medium text-gray-700 mb-3">Categories</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  !selectedCategory ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
                }`}
              >
                All Categories
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === category.id ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <category.icon className="mr-2 h-4 w-4" />
                    {category.title}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="space-y-6">
            {filteredCategories.map(category => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                    <category.icon className="mr-2 text-primary-600" />
                    {category.title}
                  </h3>
                  <div className="space-y-6">
                    {category.articles
                      .filter(article =>
                        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        article.content.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map(article => (
                        <motion.div
                          key={article.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
                        >
                          <h4 className="text-lg font-medium text-gray-800 mb-2">
                            {article.title}
                          </h4>
                          <p className="text-gray-600">
                            {article.content}
                          </p>
                        </motion.div>
                      ))
                    }
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default KnowledgeBase