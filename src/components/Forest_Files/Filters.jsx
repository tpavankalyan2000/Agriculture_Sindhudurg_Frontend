import React from 'react';
import { Filter, Calendar, X, ChevronDown } from 'lucide-react';

const Filters = ({
    species,
    selectedSpecies,
    onSpeciesChange,
    selectedDamageClasses,
    onDamageClassChange,
    dateRange,
    onDateRangeChange,
    loadingSpecies = false
  }) => {
    const [showSpeciesDropdown, setShowSpeciesDropdown] = React.useState(false);
    const [showDamageClassDropdown, setShowDamageClassDropdown] = React.useState(false);
  
    const speciesDropdownRef = React.useRef(null);
    const damageClassDropdownRef = React.useRef(null);
  
    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (speciesDropdownRef.current && !speciesDropdownRef.current.contains(event.target)) {
          setShowSpeciesDropdown(false);
        }
        if (damageClassDropdownRef.current && !damageClassDropdownRef.current.contains(event.target)) {
          setShowDamageClassDropdown(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
  
    const toggleSpecies = (id) => {
      if (selectedSpecies.includes(id)) {
        onSpeciesChange(selectedSpecies.filter(s => s !== id));
      } else {
        onSpeciesChange([...selectedSpecies, id]);
      }
    };
  
    const toggleDamageClass = (damageClass) => {
      if (selectedDamageClasses.includes(damageClass)) {
        onDamageClassChange(selectedDamageClasses.filter(dc => dc !== damageClass));
      } else {
        onDamageClassChange([...selectedDamageClasses, damageClass]);
      }
    };
  
    const handleStartDateChange = (e) => {
      const startDate = e.target.value ? new Date(e.target.value) : null;
      onDateRangeChange([startDate, dateRange[1]]);
    };
  
    const handleEndDateChange = (e) => {
      const endDate = e.target.value ? new Date(e.target.value) : null;
      onDateRangeChange([dateRange[0], endDate]);
    };
  
    const clearAllFilters = () => {
      onSpeciesChange([]);
      onDamageClassChange([]);
      onDateRangeChange([null, null]);
    };
 
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      {/* Title Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter size={18} className="text-emerald-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        </div>
 
        {(selectedSpecies.length > 0 || selectedDamageClasses.length > 0 || dateRange[0] || dateRange[1]) && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-emerald-600 hover:text-emerald-800 flex items-center"
          >
            <X size={14} className="mr-1" />
            Clear all
          </button>
        )}
      </div>
 
      {/* Filter Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 
        {/* Species Dropdown */}
        <div className="relative" ref={speciesDropdownRef}>
          <button
            onClick={() => setShowSpeciesDropdown(!showSpeciesDropdown)}
            className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <span className="truncate">
              {selectedSpecies.length === 0
                ? "All Species"
                : selectedSpecies.length === 1
                  ? species.find(s => s.id === selectedSpecies[0])?.common_name
                  : `${selectedSpecies.length} species selected`}
            </span>
            <ChevronDown size={16} className={`transition-transform duration-200 ${showSpeciesDropdown ? 'rotate-180' : ''}`} />
          </button>
 
          {showSpeciesDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {loadingSpecies ? (
                <div className="p-4 text-center text-gray-500">Loading species...</div>
              ) : (
                species.map((s) => (
                  <div
                    key={s.id}
                    className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-emerald-50 ${
                      selectedSpecies.includes(s.id) ? 'bg-emerald-50' : ''
                    }`}
                    onClick={() => toggleSpecies(s.id)}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-emerald-600 border-gray-300 rounded"
                        checked={selectedSpecies.includes(s.id)}
                        readOnly
                      />
                      <span className="ml-3 block truncate">{s.common_name}</span>
                    </div>
                    {s.scientific && (
                      <span className="text-xs text-gray-500 ml-7 block">{s.scientific}</span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
 
       
 
        {/* Date Range Inputs */}
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <input
              type="date"
              className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 p-2"
              value={dateRange[0] ? formatDateForInput(dateRange[0]) : ''}
              onChange={handleStartDateChange}
            />
          </div>
          <div className="relative flex-1">
            <input
              type="date"
              className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 p-2"
              value={dateRange[1] ? formatDateForInput(dateRange[1]) : ''}
              onChange={handleEndDateChange}
              min={dateRange[0] ? formatDateForInput(dateRange[0]) : ''}
            />
          </div>
        </div>
      </div>
 
    </div>
  );
};
 
 
function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
  }
  
  function getDamageClassLabel(damageClass) {
    switch (damageClass) {
      case 'Crop': return "Crop Damage";
      case 'Livestock': return "Livestock Attack";
      case 'Property': return "Property Damage";
      case 'Human': return "Human Attack";
      default: return "Unknown";
    }
  }

  
export default Filters;
 
 