import { motion } from 'framer-motion'
import { FaCalendarAlt, FaLeaf } from 'react-icons/fa'
import { format } from 'date-fns'

const mockHistory = [
  {
    id: 1,
    date: new Date('2024-03-15'),
    fruitType: 'Apple',
    treeAge: 3,
    predictionDays: 30,
    status: 'Flowering',
    yield: '75-85 kg',
    accuracy: '92%'
  },
  {
    id: 2,
    date: new Date('2024-03-10'),
    fruitType: 'Orange',
    treeAge: 5,
    predictionDays: 15,
    status: 'Fruit Development',
    yield: '90-100 kg',
    accuracy: '88%'
  },
  {
    id: 3,
    date: new Date('2024-03-05'),
    fruitType: 'Mango',
    treeAge: 8,
    predictionDays: 20,
    status: 'Ripening',
    yield: '120-150 kg',
    accuracy: '95%'
  }
]

const History = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Prediction History</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <FaCalendarAlt />
          <span>Last 30 days</span>
        </div>
      </div>

      <div className="grid gap-6">
        {mockHistory.map((item, index) => (
          <motion.div
            key={item.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <FaLeaf className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{item.fruitType}</h3>
                    <p className="text-sm text-gray-500">{format(item.date, 'MMM d, yyyy')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">Accuracy</div>
                  <div className="text-lg font-semibold text-primary-600">{item.accuracy}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Tree Age</div>
                  <div className="font-semibold text-gray-800">{item.treeAge} years</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Prediction Period</div>
                  <div className="font-semibold text-gray-800">{item.predictionDays} days</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Growth Status</div>
                  <div className="font-semibold text-gray-800">{item.status}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Expected Yield</div>
                  <div className="font-semibold text-gray-800">{item.yield}</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default History