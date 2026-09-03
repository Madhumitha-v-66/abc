import React, { useState } from 'react';
import { useCaptcha } from '../../context/CaptchaContext';
import { sounds } from '../../utils/sound';
import { Search, Filter, Sparkles, X } from 'lucide-react';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const WEIRD_AUTOCOMPLETE = [
  'how to tell if bread with wheels is a vehicle',
  'why is my on-screen keyboard backwards',
  'jobs where i do not need to solve Coffman deadlocks',
  'how to emotionally disconnect from a pending invitation',
  'is 73 bananas a good password strength',
  'how to close popup when button keeps running away',
  'Elon Tusk net worth in fake endorsements',
  'symptoms of 73% sad computer syndrome',
];

const RIDICULOUS_FILTERS = [
  'Most Relevant',
  'Probably Relevant',
  'Definitely Buy This',
  'Maybe',
  'Why Are You Searching This?',
  'Most Confusing',
  'Expired Opportunities Only',
  'Overpriced Consultancies',
];

export const SearchBarModal: React.FC<SearchBarProps> = ({ isOpen, onClose }) => {
  const { requireCaptcha } = useCaptcha();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Most Relevant');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchButtonPos, setSearchButtonPos] = useState({ x: 0, y: 0 });

  if (!isOpen) return null;

  // Search button moves slightly when hovered
  const handleButtonHover = () => {
    sounds.playBoing();
    setSearchButtonPos({
      x: (Math.random() - 0.5) * 40,
      y: (Math.random() - 0.5) * 20,
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    sounds.playDing();
    // MANDATORY CAPTCHA FOR SEARCHING!
    requireCaptcha(`Execute Search: "${query.slice(0, 15)}..."`, () => {
      setHasSearched(true);
      sounds.playDing();
    });
  };

  const handleAutocompleteClick = (suggestion: string) => {
    sounds.playKeypress();
    setQuery(suggestion);
  };

  return (
    <div className="search-modal-overlay">
      <div className="search-modal-card">
        <div className="search-modal-header">
          <div className="search-title-wrap">
            <Search size={22} className="search-header-icon" />
            <span className="search-title-text">GLOBAL RAGEBAIT INTELLIGENCE SEARCH</span>
          </div>
          <button className="search-close-x" onClick={onClose} title="Close search">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSearchSubmit} className="search-form-massive">
          {/* Huge search input with microscopic button */}
          <div className="search-input-container">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="TYPE YOUR DESIRED QUERIES HERE IN ALL CAPS OR COMIC SANS..."
              className="cursed-huge-search-input"
              autoFocus
            />

            {/* Tiny 6px / microscopic search button that dodges cursor */}
            <button
              type="submit"
              className="microscopic-search-button"
              style={{
                transform: `translate(${searchButtonPos.x}px, ${searchButtonPos.y}px)`,
                transition: 'transform 0.1s ease',
              }}
              onMouseEnter={handleButtonHover}
              title="Microscopic Search Execution Button (Click here to initiate CAPTCHA)"
            >
              go
            </button>
          </div>

          <div className="search-meta-note">
            *Notice: The search button is intentionally 12 pixels wide and flees upon cursor contact. Searching requires solving an algorithm CAPTCHA.
          </div>

          {/* Absurd Filters */}
          <div className="search-filters-row">
            <span className="filter-label">
              <Filter size={14} /> FILTER BY:
            </span>
            <div className="filter-pills-wrap">
              {RIDICULOUS_FILTERS.map(filter => (
                <button
                  key={filter}
                  type="button"
                  className={`filter-pill-btn ${activeFilter === filter ? 'filter-active' : ''}`}
                  onClick={() => {
                    sounds.playKeypress();
                    setActiveFilter(filter);
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Autocomplete suggestions */}
          <div className="search-suggestions-box">
            <div className="suggestions-header">
              <Sparkles size={14} /> HIGHLY IRRELEVANT AUTOCOMPLETE SUGGESTIONS:
            </div>
            <div className="suggestions-list">
              {WEIRD_AUTOCOMPLETE.map((item, idx) => (
                <div
                  key={idx}
                  className="suggestion-item"
                  onClick={() => handleAutocompleteClick(item)}
                >
                  <span className="sugg-arrow">➔</span> {item}
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Fake Search Results */}
        {hasSearched && (
          <div className="search-results-section">
            <h4 className="results-heading">
              RESULTS FOR: "{query}" [FILTER: {activeFilter.toUpperCase()}]
            </h4>
            <div className="result-card">
              <div className="result-title">1. Certificate in Identifying Loaves of Bread with Wheels</div>
              <div className="result-desc">
                Issued by the International Academy of Ambiguous CAPTCHA Vehicles. 99.4% of employers disregard this.
              </div>
            </div>
            <div className="result-card">
              <div className="result-title">2. How to Deal with 73% Sad Computers in Agile Teams</div>
              <div className="result-desc">
                A 4-part webinar hosted by a recruiter who has not responded to an email since 2018.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
