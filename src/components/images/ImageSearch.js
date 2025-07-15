"use client"
import React, { useState } from 'react';

const ImageSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  
  // Common anime-related tags for suggestions
  const commonTags = [
    'landscape', 'scenery', 'night', 'sunset', 'city',
    'beach', 'forest', 'mountains', 'sky', 'space',
    'school', 'classroom', 'bedroom', 'library', 'cafe',
    'sword', 'magic', 'mecha', 'cyberpunk', 'fantasy'
  ];
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim() !== '') {
      // Filter suggestions based on input
      const filtered = commonTags.filter(tag => 
        tag.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim());
    setSuggestions([]);
  };
  
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setSuggestions([]);
  };
  
  const handleTagClick = (tag) => {
    setQuery(tag);
    onSearch(tag);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative mb-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search for anime wallpapers (e.g., landscape, scenery, character names)"
            className="w-full bg-gray-900 border border-gray-800 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        
        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full bg-gray-900 border border-gray-800 mt-1 rounded-md shadow-lg">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </form>
      
      <div className="flex flex-wrap gap-2">
        <span key="popular-tags-label" className="text-gray-400 text-sm">Popular tags:</span>
        {commonTags.slice(0, 8).map((tag, index) => (
          <button
            key={index}
            onClick={() => handleTagClick(tag)}
            className="text-sm bg-gray-900 hover:bg-gray-800 text-gray-300 px-3 py-1 rounded-full transition-colors border border-gray-800"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageSearch;
