import React, { useState, useEffect, useRef } from 'react';

const AutocompleteInput = ({ value, onChange, placeholder, icon: Icon, suggestions }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const wrapperRef = useRef(null);
  
    useEffect(() => {
      const filtered = suggestions.filter(item =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    }, [value, suggestions]);
  
    useEffect(() => {
      function handleClickOutside(event) {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);
  
    return (
      <div ref={wrapperRef} className="relative flex-1 flex flex-col items-center justify-center">
        <div className="relative w-full h-full flex items-center">
          <input
            type="text"
            className="w-full bg-white bg-opacity-0 hover:bg-opacity-10 h-full rounded-3xl text-right text-white text-lg lg:text-xl placeholder-white border-none focus:outline-none pr-12 pl-4"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsOpen(true)}
          />
          <Icon className="absolute right-4 text-white text-2xl" />
        </div>
        {isOpen && filteredSuggestions.length > 0 && (
          <ul className="absolute top-full z-10 w-full bg-darkGreen border border-white mt-1 rounded-md max-h-60 overflow-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-greeny hover:text-darkGreen cursor-pointer text-white text-right text-sm"
                onClick={() => {
                  onChange(suggestion);
                  setIsOpen(false);
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  export default AutocompleteInput;