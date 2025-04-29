import { useState } from "react";
import { motion } from "framer-motion";
import { FaAppleAlt, FaLeaf, FaCalendarAlt } from "react-icons/fa";
import { API_URL_10 } from "../config";

const cropOptions = [
  { value: "cashew", label: "Cashew" },
  { value: "mango", label: "Mango" },
];
const TalukaOptions = [
  { value: "sawantwadi", label: "Sawantwadi" },
  { value: "kudal", label: "Kudal" },
  { value: "vengurla", label: "Vengurla" },
  { value: "malvan", label: "Malvan" },
  { value: "devgad", label: "Devgad" },
  { value: "kankavli", label: "Kankavli" },
  { value: "vaibhavwadi", label: "Vaibhavwadi" },
  { value: "dodamarg", label: "Dodamarg" },
];

const PredictionForm = ({ onGenerate, onClear }) => {
  const [cropType, setCropType] = useState("");
  const [talukaType, setTalukaType] = useState("");
  const [treeAge, setTreeAge] = useState(5);
  const [predictionDays, setPredictionDays] = useState(7);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      talukaType,
      cropType,
      treeAge,
      predictionDays,
    };

    try {
      const response = await fetch(`${API_URL_10}/weather_details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.text(); // since your backend just returns "OK"
        console.log("Server response:", data);
        // After successful prediction, show results
        onGenerate();
      } else {
        console.error("Server error");
      }
    } catch (error) {
      console.error("Error sending data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    // Clear form fields
    setCropType("");
    setTalukaType("");
    setTreeAge(5);
    setPredictionDays(7);

    // Hide PredictionResults
    onClear();
  };

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-6">
          <FaLeaf className="mr-2 text-primary-600" />
          Cultivation Prediction
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="talukaType" className="flex items-center">
                <FaAppleAlt className="mr-1 text-secondary-600" />
                Taluka
              </label>
              <select
                id="talukaType"
                className="input-field"
                value={talukaType}
                onChange={(e) => setTalukaType(e.target.value)}
                required
              >
                <option value="">Select Taluka</option>
                {TalukaOptions.map((taluka) => (
                  <option key={taluka.value} value={taluka.value}>
                    {taluka.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="cropType" className="flex items-center">
                <FaAppleAlt className="mr-1 text-secondary-600" />
                Crop
              </label>
              <select
                id="cropType"
                className="input-field"
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                required
              >
                <option value="">Select Crop Type</option>
                {cropOptions.map((crop) => (
                  <option key={crop.value} value={crop.value}>
                    {crop.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center">
                <FaLeaf className="mr-1 text-primary-600" />
                Tenure (years)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  value={treeAge}
                  onChange={(e) => setTreeAge(parseInt(e.target.value))}
                  min="0"
                  max="50"
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <span className="w-12 text-center font-medium text-gray-700">
                  {treeAge}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center">
                <FaCalendarAlt className="mr-1 text-accent-500" />
                Prediction Period (days)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  value={predictionDays}
                  onChange={(e) => setPredictionDays(parseInt(e.target.value))}
                  min="1"
                  max="30"
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <span className="w-12 text-center font-medium text-gray-700">
                  {predictionDays}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end" style={{ marginTop: "-20px" }}>
            <motion.button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                "Generate Prediction"
              )}
            </motion.button>

            <motion.button
              type="button"
              onClick={handleClear}
              className="btn btn-secondary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Clear
            </motion.button>
            {/* <motion.button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                "Generate Prediction"
              )}
            </motion.button> */}
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default PredictionForm;

// const PredictionForm = ({ onGenerate, onClear }) => {
//   const [cropType, setCropType] = useState("");
//   const [talukaType, setTalukaType] = useState("");
//   const [treeAge, setTreeAge] = useState(5);
//   const [predictionDays, setPredictionDays] = useState(7);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const payload = {
//       talukaType,
//       cropType,
//       treeAge,
//       predictionDays,
//     };

//     try {
//       const response = await fetch(`${API_URL}/weather_details`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         const data = await response.text();
//         console.log('Server response:', data);

//         // After successful prediction, show results
//         onGenerate();
//       } else {
//         console.error('Server error');
//       }
//     } catch (error) {
//       console.error('Error sending data:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleClear = () => {
//     // Clear form fields
//     setCropType("");
//     setTalukaType("");
//     setTreeAge(5);
//     setPredictionDays(7);

//     // Hide PredictionResults
//     onClear();
//   };

//   return (
//     <motion.div
//       className="card"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <div className="p-6">
//         <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-6">
//           <FaLeaf className="mr-2 text-primary-600" />
//           Cultivation Prediction
//         </h2>

//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {/* Taluka, Crop, Tenure, Prediction Days fields */}
//             {/* (Keep your original code here for fields) */}
//           </div>

//           <div className="flex justify-between mt-4">
//             <motion.button
//               type="submit"
//               className="btn btn-primary"
//               disabled={isSubmitting}
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//             >
//               {isSubmitting ? (
//                 <div className="flex items-center">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                   Processing...
//                 </div>
//               ) : (
//                 "Generate Prediction"
//               )}
//             </motion.button>

//             <motion.button
//               type="button"
//               onClick={handleClear}
//               className="btn btn-secondary"
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//             >
//               Clear
//             </motion.button>
//           </div>
//         </form>
//       </div>
//     </motion.div>
//   );
// };
