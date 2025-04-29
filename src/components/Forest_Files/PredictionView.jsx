import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL_4 } from '../../config'

const PredictionView = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await axios.get(API_URL_4 + '/predictions');
        setPredictions(response.data);
      } catch (error) {
        console.error('Error fetching predictions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent mb-4"></div>
        <p>Loading predictions...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Prediction Data</h2>

      {predictions.length === 0 ? (
        <p className="text-gray-500">No prediction data available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Village</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Taluka</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Species</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Month</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Predicted Damage</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {predictions.map((pred) => (
                <tr key={pred.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{new Date('2025-05-01').toLocaleDateString()}</td>
                  {/* <td className="px-4 py-2">{new Date(pred.predicted_date).toLocaleDateString()}</td> */}
                  <td className="px-4 py-2">{pred.village}</td>
                  <td className="px-4 py-2">{pred.taluka}</td>
                  <td className="px-4 py-2">{pred.species}</td>
                  <td className="px-4 py-2">{pred.month}</td>
                  <td className="px-4 py-2 font-semibold text-emerald-700 capitalize">{pred.predicted_crop} {['cow', 'Bull'].some((animal)=> pred.predicted_crop.includes(animal)) ? "(Animal)" : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};


export default PredictionView;
