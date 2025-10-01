import { useState, useEffect, useRef } from 'react';
import './SearchBar.css';
import { countryNames } from './CountryNames';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const SearchBar = ({ onSearch, onInputChange, onFocus, onBlur }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!input) {
      setSuggestions([]);
      setShowSuggestions(false);
      setActiveIndex(-1);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
            input
          )}&limit=5&appid=${API_KEY}`
        );
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(true);
        setActiveIndex(-1);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [input]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city) => {
    setShowSuggestions(false);
    setActiveIndex(-1);
    onSearch(city.name);
    setInput('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setShowSuggestions(false);
      setActiveIndex(-1);
      onSearch(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(
        (prev) => (prev - 1 + suggestions.length) % suggestions.length
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0) {
        handleSelect(suggestions[activeIndex]);
      } else {
        handleSearch(e);
      }
    }
  };

  return (
    <div className="search-bar-container" ref={containerRef}>
      <div className="input-wrapper">
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Enter city"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (onInputChange) onInputChange(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          <button type="submit">Search</button>
        </form>

        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((city, index) => (
              <li
                key={index}
                onClick={() => handleSelect(city)}
                className={`suggestion-item ${
                  index === activeIndex ? 'active' : ''
                }`}
              >
                <span className="city-name">{city.name}</span>
                {city.country && (
                  <span className="country-name">
                    {city.state ? `, ${city.state}` : ''},{' '}
                    {countryNames[city.country] || city.country}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
