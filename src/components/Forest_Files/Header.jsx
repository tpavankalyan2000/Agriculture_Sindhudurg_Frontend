import React from 'react';
import { Download, AlertTriangle, Squirrel } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-emerald-800 to-emerald-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Squirrel className="h-8 w-8 text-white" />
            <div className="ml-3">
              <h1 className="text-2xl font-bold text-white">WildGuard</h1>
              <p className="text-emerald-200 text-sm">Wildlife Conflict Monitoring System</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex bg-emerald-700 bg-opacity-40 px-3 py-1 rounded-full items-center">
              <AlertTriangle size={16} className="text-amber-300 mr-2" />
              <span className="text-white text-sm">High alert in Eastern Range</span>
            </div>

            <button
              className="bg-white text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-md text-sm font-medium shadow-sm flex items-center transition-colors duration-200"
              aria-label="Download report"
            >
              <Download size={16} className="mr-2" />
              Report
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
