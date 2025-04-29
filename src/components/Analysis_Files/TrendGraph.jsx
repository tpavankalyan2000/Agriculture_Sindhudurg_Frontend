import { useEffect, useState, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { ChevronDown } from 'lucide-react';

// Reusable dropdown component
const MultiSelectDropdown = ({ label, options, selected, setSelected }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleOption = (value) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((item) => item !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDisplayText = () => {
    if (selected.length === 0) return `All ${label}`;
    if (selected.length === 1) return selected[0];
    return `${selected.length} ${label.toLowerCase()} selected`;
  };

  return (
    <div className="relative w-64" ref={dropdownRef}>
      <label className="block mb-1 font-medium">{label}:</label>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <span className="truncate">{getDisplayText()}</span>
        <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-md">
          {options.map((opt) => (
            <label key={opt} className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggleOption(opt)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

// Main chart component
const TrendGraphWithFilters = () => {
  const [data, setData] = useState({});
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState([]);
  const [cropList, setCropList] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('Total Cultivated Area (hectares)');
  const [chartData, setChartData] = useState([]);

  const metrics = [
    'Total Cultivated Area (hectares)',
    'Cultivation area(hectare)',
    'Productivity MT/(hectare)',
    'Production MT/(Hectare)'
  ];

  useEffect(() => {
    fetch('http://localhost:5050/parser/upload_excel')
      .then((res) => res.json())
      .then((resData) => {
        console.log("resData : ",resData);
        
        setData(resData);
        const districtKeys = Object.keys(resData);
        setDistricts(districtKeys);
        setSelectedDistrict(districtKeys.slice(0, 1)); // Default select 1st district
      });
  }, []);

  useEffect(() => {
    if (selectedDistrict.length === 0) return;

    const cropsSet = new Set();

    selectedDistrict.forEach((district) => {
      const years = Object.keys(data[district] || {});
      years.forEach((year) => {
        const crops = Object.keys(data[district]?.[year] || {});
        crops.forEach(crop => cropsSet.add(crop));
      });
    });

    const cropArray = Array.from(cropsSet);
    setCropList(cropArray);
    setSelectedCrop(cropArray.slice(0, 1)); // Default select 1st crop
  }, [selectedDistrict, data]);

  useEffect(() => {
    if (
      selectedDistrict.length === 0 ||
      selectedCrop.length === 0 ||
      !selectedMetric
    ) return;

    const transformed = [];

    selectedDistrict.forEach((district) => {
      const years = Object.entries(data[district] || {});
      years.forEach(([year, crops]) => {
        selectedCrop.forEach((crop) => {
          const metricValue = crops?.[crop]?.[selectedMetric] || 0;
          const existing = transformed.find((entry) => entry.year === year);
          if (existing) {
            existing[`${district}-${crop}`] = metricValue;
          } else {
            transformed.push({ year, [`${district}-${crop}`]: metricValue });
          }
        });
      });
    });

    setChartData(transformed);
  }, [selectedDistrict, selectedCrop, selectedMetric, data]);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Trend Analysis</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <MultiSelectDropdown
          label="District"
          options={districts}
          selected={selectedDistrict}
          setSelected={setSelectedDistrict}
        />

        <MultiSelectDropdown
          label="Crop"
          options={cropList}
          selected={selectedCrop}
          setSelected={setSelectedCrop}
        />

        <div>
          <label className="block font-medium">Metric:</label>
          <div className="flex flex-col space-y-1">
            {metrics.map((metric) => (
              <label key={metric} className="text-sm">
                <input
                  type="radio"
                  value={metric}
                  checked={selectedMetric === metric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="mr-1"
                />
                {metric}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Graph */}
      <div style={{ width: '100%', height: 500 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            {selectedDistrict.map((district) =>
              selectedCrop.map((crop) => (
                <Line
                  key={`${district}-${crop}`}
                  type="monotone"
                  dataKey={`${district}-${crop}`}
                  stroke="#82ca9d"
                  name={`${district} - ${crop}`}
                />
              ))
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendGraphWithFilters;