import React, { useState, useEffect } from 'react';
import axios from 'axios';

import DamageTypePieChart from '../components/Forest_Files/DamageTypePieChart';
import HeatMap            from '../components/Forest_Files/map/HeatMap';
import PredictionView     from '../components/Forest_Files/PredictionView';
import Header             from '../components/Forest_Files/Header';
import TimelineChart      from '../components/Forest_Files/TimelineChart';
import Filters            from '../components/Forest_Files/Filters';
import Summary            from '../components/Forest_Files/Summary';

// import { API_URL } from '../config';
import { uploadExcelFile } from '../components/Forest_Files/uploadExcel';   // ← NEW
import { API_URL_5, API_URL_6   } from '../config';

function Prediction() {
  /* ─────────────────────────── Data ─────────────────────────── */
  const [attackEvents,  setAttackEvents]  = useState([]);
  const [speciesOptions, setSpeciesOptions] = useState([]);
  const [summaryData,   setSummaryData]   = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [showPredictions, setShowPredictions] = useState(false);

  /* ───────────────────────── Filters state ───────────────────── */
  const [selectedSpecies,       setSelectedSpecies]       = useState([]);
  const [selectedDamageClasses, setSelectedDamageClasses] = useState([]);
  const [dateRange,             setDateRange]             = useState([null, null]);

  /* ───────────────────── Fetch initial data ──────────────────── */
  const bootstrap = async () => {
    try {
      const { data: filterData } = await axios.get(`${API_URL_6}/filter-options`);
      setSpeciesOptions(filterData.species);
      await fetchFilteredData();           // prime first view
    } catch (err) {
      console.error('Error fetching initial data:', err);
      setLoading(false);
    }
  };
  useEffect(() => {
    bootstrap();
  }, []);

  /* ───────────────────── Fetch filtered on change ────────────── */
  useEffect(() => {
    if (speciesOptions.length) fetchFilteredData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSpecies, selectedDamageClasses, dateRange]);

  /* ─────────────── helpers ─────────────── */
  const formatDateForQuery = (date) => date?.toISOString().split('T')[0];

  const fetchFilteredData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
  
      if (selectedSpecies.length) {
        const selectedSpeciesNames = speciesOptions
          .filter(species => selectedSpecies.includes(species.id))
          .map(species => species.common_name);
  
        selectedSpeciesNames.forEach(name => params.append('species_names', name));
      }
  
      if (selectedDamageClasses.length) {
        selectedDamageClasses.forEach(dc => params.append('damage_classes', dc));
      }
      if (dateRange[0]) {
        params.append('start_date', formatDateForQuery(dateRange[0]));
      }
      if (dateRange[1]) {
        params.append('end_date', formatDateForQuery(dateRange[1]));
      }
  
      const res = await axios.get(`${API_URL_5}/filtered-summary?${params.toString()}`);
  
      setAttackEvents(res.data.attack_events || []);
      setSummaryData(null);
    } catch (err) {
      console.error('Error fetching filtered data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  /* ───────────── Excel upload handler ───────────── */
  const handleFileSelect = async (e) => {
    const params = new URLSearchParams();

    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const freshEvents = await uploadExcelFile(file);
      const res = await axios.get(`${API_URL_5}/filtered-summary?${params.toString()}`);
      setAttackEvents(res.data.attack_events || []);
      bootstrap();
      console.log('freshEvents:', freshEvents); // Debugging line
      // /* reset filters so the user instantly sees everything they uploaded */
      // setSummaryData(null);

    } catch (err) {
      console.error(err, 'Upload failed');
      alert('Upload failed - check the console for details.');
    } finally {
      setLoading(false);
      e.target.value = '';           // allow same file to be picked again if needed
    }
  };

  /* ─────────────────────────── UI ─────────────────────────────── */
  return (
    <div className="min-h-screen">
      {/* <Header />  (uncomment if you still need it) */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Top Control Bar */}
        <div className="flex justify-between items-center mb-3">
          {/* Upload */}
          <div className="flex space-x-2">
            <button
              onClick={() => document.getElementById('fileUpload').click()}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded shadow hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              Upload Data
            </button>
            <input
              id="fileUpload"
              type="file"
              accept=".xlsx,.xls, .csv"
              className="hidden"
              onChange={handleFileSelect}          /* ← NOW ACTIVE */
            />
          </div>

          {/* Predictions toggle */}
          <button
            onClick={() => setShowPredictions(!showPredictions)}
            className="px-3 py-1.5 bg-emerald-600 text-white text-sm rounded shadow hover:bg-emerald-700 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            {showPredictions ? 'Hide Predictions' : 'View Predictions'}
          </button>
        </div>

        {/* Prediction modal */}
        {showPredictions && <div className="mb-4"><PredictionView /></div>}

        {/* Filters */}
        <div className="mb-4">
          <Filters
            species={speciesOptions}
            selectedSpecies={selectedSpecies}
            onSpeciesChange={setSelectedSpecies}
            selectedDamageClasses={selectedDamageClasses}
            onDamageClassChange={setSelectedDamageClasses}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            loadingSpecies={!speciesOptions.length}
          />
        </div>

        {/* Loading spinner */}
        {loading && (
          <div className="text-center p-3 mb-3">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-emerald-500 border-t-transparent"></div>
            <p className="mt-1 text-sm text-gray-600">Loading&nbsp;data…</p>
          </div>
        )}

        {/* Summary */}
        <div className="mb-4">
          {/* <Summary attackEvents={attackEvents} summary={summaryData}/> */}
          <Summary attackEvents={attackEvents} />
        </div>

        {/* Charts + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* LEFT */}
          <div className="flex flex-col space-y-4">
            <div className="bg-white rounded-lg shadow-md p-3">
            <TimelineChart
              data={attackEvents}   // ← no map needed!
              species={speciesOptions}
              selectedSpecies={selectedSpecies}
              height={200}
            />
            </div>
            <div className="bg-white rounded-lg shadow-md p-3">
              {/* <DamageTypePieChart
                filters={{ selectedSpecies, selectedDamageClasses, dateRange }}
              /> */}
              <DamageTypePieChart 
                filters={{ selectedSpecies, selectedDamageClasses, dateRange }}
                speciesOptions={speciesOptions}
              />

            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col">
            <div className="flex-grow bg-white rounded-lg shadow-md p-3">
              {/* <HeatMap /> */}
              <HeatMap
                filters={{ selectedSpecies, selectedDamageClasses, dateRange }}
                speciesOptions={speciesOptions}
                />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>WildGuard&nbsp;Dashboard&nbsp;v1.0&nbsp;|&nbsp;Wildlife&nbsp;Conflict&nbsp;Monitoring&nbsp;System</p>
        </div>
      </main>
    </div>
  );
}

export default Prediction;




// -----------------------------BANNER - POSTER-----------------------------------------------
// import { motion } from "framer-motion";

// const Setting = () => {
//   return (
//     <div className="h-full flex items-center justify-center">
//       {/* Main Container */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="relative bg-gradient-to-r from-green-100 via-green-200 to-green-300 p-8 rounded-lg shadow-2xl text-center max-w-2xl mx-auto overflow-hidden"
//       >
//         {/* Background barrier stripes */}
//         <div className="absolute inset-0 bg-gradient-to-r from-green-100 via-white to-green-100 opacity-40"></div>

//         {/* Top Dots */}
//         <div className="absolute top-4 left-0 right-0 flex justify-center space-x-2">
//           <div className="h-3 w-3 rounded-full bg-gray-400"></div>
//           <div className="h-3 w-3 rounded-full bg-gray-400"></div>
//           <div className="h-3 w-3 rounded-full bg-gray-400"></div>
//         </div>

//         {/* Content */}
//         <div className="relative z-10">

//         <h1 className="text-4xl font-extrabold mb-4 text-green-700">
//             🚧 Please Click Below 🚧
//           </h1>
//           {/* <h1 className="text-4xl font-extrabold mb-4 text-green-700">
//             🚧 Under Process 🚧
//           </h1> */}
//           <p className="text-lg font-medium text-gray-700 mb-8">
//               Access the Forest Dashboard to continue with the ingestion process.
//           </p>
//           {/* <p className="text-lg font-medium text-gray-700 mb-8">
//             The conversion process is currently under development. Please check back later.
//           </p> */}

//           {/* Redirect Button */}
//           <a
//             href="http://192.168.35.7:2003/"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full shadow-md transition duration-300"
//           >
//             Go to Home
//           </a>
//         </div>

//         {/* Bottom Barrier */}
//         <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center h-8">
//           <div className="bg-green-500 w-8 h-2 mx-1 rounded"></div>
//           <div className="bg-green-500 w-8 h-2 mx-1 rounded"></div>
//           <div className="bg-green-500 w-8 h-2 mx-1 rounded"></div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Setting;




