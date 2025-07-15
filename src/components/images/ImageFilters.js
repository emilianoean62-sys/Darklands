"use client"
import React from 'react';

const ImageFilters = ({ filters, onFilterChange }) => {
  const handleRatingChange = (e) => {
    onFilterChange({ rating: e.target.value });
  };
  
  const handleOrderChange = (e) => {
    onFilterChange({ order: e.target.value });
  };
  
  const handleResolutionChange = (resolution) => {
    onFilterChange({ resolution });
  };

  return (
    <div className="bg-gray-900/70 rounded-lg p-4 border border-gray-800">
      <h3 className="text-lg font-medium mb-3">Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rating Filter */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Rating</label>
          <select
            value={filters.rating}
            onChange={handleRatingChange}
            className="w-full bg-gray-900 border border-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="safe">Safe</option>
            <option value="questionable">Questionable</option>
            <option value="explicit">Explicit</option>
          </select>
        </div>
        
        {/* Order Filter */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Sort By</label>
          <select
            value={filters.order}
            onChange={handleOrderChange}
            className="w-full bg-gray-900 border border-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="date">Date (Newest)</option>
            <option value="popularity">Popularity</option>
            <option value="random">Random</option>
          </select>
        </div>
        
        {/* Resolution Filter */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Resolution</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleResolutionChange('')}
              className={`text-xs px-3 py-1 rounded-full ${
                filters.resolution === '' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleResolutionChange('1920x1080')}
              className={`text-xs px-3 py-1 rounded-full ${
                filters.resolution === '1920x1080' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-800'
              }`}
            >
              1920x1080
            </button>
            <button
              onClick={() => handleResolutionChange('2560x1440')}
              className={`text-xs px-3 py-1 rounded-full ${
                filters.resolution === '2560x1440' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-800'
              }`}
            >
              2560x1440
            </button>
            <button
              onClick={() => handleResolutionChange('3840x2160')}
              className={`text-xs px-3 py-1 rounded-full ${
                filters.resolution === '3840x2160' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-800'
              }`}
            >
              4K
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageFilters;
