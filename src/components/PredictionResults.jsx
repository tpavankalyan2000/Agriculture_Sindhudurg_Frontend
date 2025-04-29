import { motion } from 'framer-motion'
import { FaSeedling, FaSun, FaCloudRain, FaThermometerHalf } from 'react-icons/fa'

const PredictionResults = ({ prediction }) => {
  const mockPrediction = {
    fruitType: 'Apple',
    growthStage: 'Flowering',
    expectedYield: '75-85 kg',
    waterNeeds: '15-20L/week',
    temperature: '20-25°C',
    humidity: '60-70%',
    nextMilestone: 'Fruit Development',
    daysToHarvest: 45,
    recommendations: [
      'Maintain consistent watering schedule',
      'Monitor for pest activity',
      'Ensure proper sunlight exposure',
      'Consider pruning for better air circulation'
    ]
  }

  const data = prediction || mockPrediction

  return (
    <motion.div
      className="card mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Prediction Results</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-primary-50 rounded-lg">
              <FaSeedling className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <div className="text-sm text-gray-600">Current Growth Stage</div>
                <div className="font-semibold text-gray-800">{data.growthStage}</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-secondary-50 rounded-lg">
              <FaSun className="h-8 w-8 text-secondary-600" />
              <div className="ml-4">
                <div className="text-sm text-gray-600">Expected Yield</div>
                <div className="font-semibold text-gray-800">{data.expectedYield}</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-accent-50 rounded-lg">
              <FaCloudRain className="h-8 w-8 text-accent-700" />
              <div className="ml-4">
                <div className="text-sm text-gray-600">Water Requirements</div>
                <div className="font-semibold text-gray-800">{data.waterNeeds}</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <FaThermometerHalf className="h-8 w-8 text-gray-600" />
              <div className="ml-4">
                <div className="text-sm text-gray-600">Optimal Temperature</div>
                <div className="font-semibold text-gray-800">{data.temperature}</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-4">Recommendations</h4>
            <ul className="space-y-3">
              {data.recommendations.map((rec, index) => (
                <motion.li
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 text-sm mr-3">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{rec}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PredictionResults