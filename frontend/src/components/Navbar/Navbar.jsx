import { useState, useEffect, useRef, useCallback } from 'react';
import { navLinks } from '../../data/content';
import { searchSongs } from '../../services/musicApi';
import { searchLocalMusic } from '../../services/musicService';
import { usePlayer } from '../../context/PlayerContext';
import './Navbar.css';

const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80';

const TRENDING_SEARCHES = [
  { title: 'Husn', artist: 'Anuv Jain', icon: 'lucide:flame' },
  { title: 'Kesariya', artist: 'Arijit Singh • Pritam', icon: 'lucide:heart' },
  { title: 'Tauba Tauba', artist: 'Karan Aujla', icon: 'lucide:sparkles' },
  { title: 'Sapphire (feat. Arijit Singh)', artist: 'Ed Sheeran', icon: 'lucide:music' },
  { title: 'Trending Global Hits', artist: 'Top Chart Hits', icon: 'lucide:disc' },
];

const POPULAR_CHIPS = ['Husn', 'Kesariya', 'Tauba Tauba', 'Arijit Singh', 'Ed Sheeran', 'Shreya Ghoshal', 'Punjabi Hits'];

function getTrackImage(track) {
  return (
    track?.artwork ||
    track?.thumbnail ||
    track?.image ||
    track?.cover ||
    DEFAULT_FALLBACK_IMAGE
  );
}

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '3:30';
  const totalSecs = Math.floor(seconds);
  const m = Math.floor(totalSecs / 60);
  const s = totalSecs % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function Navbar() {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const searchContainerRef = useRef(null);
  const desktopInputRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const mobileInputRef = useRef(null);
  const searchRequestIdRef = useRef(0);

  // Search execution with race condition prevention
  const performSearch = useCallback(async (queryText) => {
    const trimmed = queryText.trim();
    if (trimmed.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      setSelectedIndex(-1);
      return;
    }

    const currentReqId = ++searchRequestIdRef.current;
    setIsSearching(true);

    // Instant local catalog match for zero latency
    const instantLocalResults = searchLocalMusic(trimmed, 12);
    if (instantLocalResults.length > 0 && currentReqId === searchRequestIdRef.current) {
      setSearchResults(instantLocalResults);
    }

    try {
      const backendResults = await searchSongs(trimmed, 12);
      if (currentReqId === searchRequestIdRef.current) {
        if (Array.isArray(backendResults) && backendResults.length > 0) {
          setSearchResults(backendResults);
        } else if (instantLocalResults.length > 0) {
          setSearchResults(instantLocalResults);
        } else {
          const fallback = searchLocalMusic(trimmed, 12);
          setSearchResults(fallback);
        }
      }
    } catch (err) {
      console.warn('[Navbar Search] Backend search fallback:', err);
      if (currentReqId === searchRequestIdRef.current) {
        const fallback = searchLocalMusic(trimmed, 12);
        setSearchResults(fallback);
      }
    } finally {
      if (currentReqId === searchRequestIdRef.current) {
        setIsSearching(false);
      }
    }
  }, []);

  // Debounce search input
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      setSelectedIndex(-1);
      return;
    }

    const timer = setTimeout(() => {
      performSearch(searchQuery);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowResults(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus mobile input when mobile search opens
  useEffect(() => {
    if (isMobileSearchOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileSearchOpen]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setShowResults(true);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    setSelectedIndex(-1);
    desktopInputRef.current?.focus();
    mobileInputRef.current?.focus();
  };

  const handleTrackClick = (track) => {
    if (!track) return;
    playTrack(track);
    setShowResults(false);
    setIsMobileSearchOpen(false);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (term) => {
    setSearchQuery(term);
    setShowResults(true);
    performSearch(term);
    desktopInputRef.current?.focus();
    mobileInputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (!showResults && e.key !== 'Escape') {
      setShowResults(true);
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        searchResults.length > 0 ? (prev + 1) % searchResults.length : -1
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        searchResults.length > 0 ? (prev - 1 + searchResults.length) % searchResults.length : -1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        handleTrackClick(searchResults[selectedIndex]);
      } else if (searchResults.length > 0) {
        handleTrackClick(searchResults[0]);
      }
    } else if (e.key === 'Escape') {
      setShowResults(false);
      setSelectedIndex(-1);
      desktopInputRef.current?.blur();
      mobileInputRef.current?.blur();
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Left: Logo + Desktop Search */}
        <div className="navbar-left">
          <a href="#hero" id="nav-logo" className="navbar-logo font-display">
            gaana
            <span className="logo-note">♪</span>
          </a>

          {/* Desktop Search Bar & Live Dropdown */}
          <div className="navbar-search" ref={searchContainerRef}>
            <div className={`search-input-wrapper ${showResults ? 'focused' : ''}`}>
              <iconify-icon icon="lucide:search" class="search-icon"></iconify-icon>
              <input
                ref={desktopInputRef}
                type="text"
                placeholder="Search songs, artists, albums, playlists..."
                className="search-input"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => setShowResults(true)}
                onKeyDown={handleKeyDown}
                aria-label="Search music"
                aria-autocomplete="list"
                aria-expanded={showResults}
              />
              {isSearching ? (
                <div className="search-input-spinner">
                  <iconify-icon icon="lucide:loader-2" class="search-spin-icon"></iconify-icon>
                </div>
              ) : searchQuery ? (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={handleClear}
                  aria-label="Clear search"
                >
                  <iconify-icon icon="lucide:x" style={{ fontSize: '14px' }}></iconify-icon>
                </button>
              ) : null}
            </div>

            {/* Desktop Live Search Results & Suggestions Dropdown */}
            {showResults && (
              <div className="search-results-dropdown" role="listbox">
                {searchQuery.trim().length >= 2 ? (
                  <>
                    <div className="search-results-header">
                      <div className="search-results-header-left">
                        <iconify-icon icon="lucide:music" style={{ fontSize: '13px', color: '#ff2555' }}></iconify-icon>
                        <span>Tracks & Songs</span>
                      </div>
                      <div className="search-results-header-right">
                        {isSearching ? (
                          <span className="search-searching-badge">Searching...</span>
                        ) : (
                          <span className="search-count-badge">{searchResults.length} results</span>
                        )}
                      </div>
                    </div>

                    {isSearching && searchResults.length === 0 ? (
                      <div className="search-status-item">
                        <iconify-icon icon="lucide:loader-2" class="search-spin-icon"></iconify-icon>
                        <div className="search-status-text">
                          <p className="search-status-main">Searching music catalog...</p>
                          <p className="search-status-sub">Looking up tracks, singers & albums</p>
                        </div>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="search-results-list" tabIndex={-1}>
                        {searchResults.map((track, idx) => {
                          const isThisPlaying =
                            isPlaying &&
                            currentTrack &&
                            ((track.id && String(currentTrack.id) === String(track.id)) ||
                              (track.title && currentTrack.title === track.title) ||
                              (track.name && currentTrack.name === track.name));
                          const isSelected = selectedIndex === idx;

                          return (
                            <div
                              key={`${track.id || track.title || track.name}-${idx}`}
                              className={`search-result-item ${isThisPlaying ? 'active-search-item' : ''} ${
                                isSelected ? 'keyboard-selected' : ''
                              }`}
                              onClick={() => handleTrackClick(track)}
                              onMouseEnter={() => setSelectedIndex(idx)}
                              role="option"
                              aria-selected={isSelected}
                              tabIndex={0}
                            >
                              <div className="search-thumb-wrap">
                                <img
                                  src={getTrackImage(track)}
                                  alt={track.title || track.name || 'Song artwork'}
                                  className="search-thumb"
                                  loading="lazy"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                                  }}
                                />
                                {isThisPlaying ? (
                                  <div className="search-playing-eq-badge">
                                    <span className="eq-bar-anim bar-1" />
                                    <span className="eq-bar-anim bar-2" />
                                    <span className="eq-bar-anim bar-3" />
                                  </div>
                                ) : (
                                  <div className="search-play-overlay">
                                    <iconify-icon
                                      icon="lucide:play"
                                      style={{ fontSize: '13px', color: '#ffffff', marginLeft: '1px' }}
                                    ></iconify-icon>
                                  </div>
                                )}
                              </div>

                              <div className="search-item-info">
                                <div className="search-item-title-row">
                                  <p className={`search-item-title ${isThisPlaying ? 'active-text' : ''}`}>
                                    {track.title || track.name}
                                  </p>
                                  {track.album && <span className="search-item-album-tag">{track.album}</span>}
                                </div>
                                <p className="search-item-artist">{track.artist || 'Gaana Artist'}</p>
                              </div>

                              <div className="search-item-meta">
                                <span className="search-item-duration">{formatDuration(track.duration)}</span>
                                <button
                                  type="button"
                                  className={`search-item-play-btn ${isThisPlaying ? 'playing' : ''}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTrackClick(track);
                                  }}
                                  aria-label={`Play ${track.title || track.name}`}
                                >
                                  <iconify-icon
                                    icon={isThisPlaying ? 'lucide:pause' : 'lucide:play'}
                                    style={{ fontSize: '13px', marginLeft: isThisPlaying ? '0' : '1px' }}
                                  ></iconify-icon>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="search-status-item search-empty">
                        <div className="search-empty-icon-wrap">
                          <iconify-icon icon="lucide:music-2" style={{ fontSize: '24px', color: '#ff2555' }}></iconify-icon>
                        </div>
                        <p className="search-empty-title">No songs found for "{searchQuery}"</p>
                        <span className="search-empty-sub">Try searching for popular hits or artists:</span>
                        <div className="search-suggestions-chips">
                          {POPULAR_CHIPS.slice(0, 5).map((term) => (
                            <button
                              key={term}
                              type="button"
                              className="search-chip"
                              onClick={() => handleSuggestionClick(term)}
                            >
                              <iconify-icon icon="lucide:search" style={{ fontSize: '11px' }}></iconify-icon>
                              <span>{term}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* Suggestions when search bar is focused but query < 2 chars */
                  <div className="search-suggestions-panel">
                    <div className="search-suggestions-header">
                      <iconify-icon icon="lucide:trending-up" style={{ fontSize: '13px', color: '#ff2555' }}></iconify-icon>
                      <span>Trending & Recommended Searches</span>
                    </div>
                    <div className="search-suggestions-list">
                      {TRENDING_SEARCHES.map((item) => (
                        <div
                          key={item.title}
                          className="search-suggestion-item"
                          onClick={() => handleSuggestionClick(item.title)}
                          role="button"
                          tabIndex={0}
                        >
                          <div className="search-suggestion-icon">
                            <iconify-icon icon={item.icon} style={{ fontSize: '14px', color: '#ff2555' }}></iconify-icon>
                          </div>
                          <div className="search-suggestion-text">
                            <span className="search-suggestion-title">{item.title}</span>
                            <span className="search-suggestion-sub">{item.artist}</span>
                          </div>
                          <iconify-icon icon="lucide:arrow-up-right" class="search-suggestion-arrow"></iconify-icon>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Center: Nav Links (Desktop) */}
        <nav className="navbar-nav">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              id={link.id}
              className={`nav-link${link.active ? ' active' : ''}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: CTAs + Mobile Search Toggle + Profile */}
        <div className="navbar-right">
          {/* Mobile Search Button */}
          <button
            id="mobile-search-toggle-btn"
            className={`btn-mobile-search ${isMobileSearchOpen ? 'active' : ''}`}
            onClick={() => {
              setIsMobileSearchOpen((prev) => !prev);
              setShowResults(false);
            }}
            aria-label="Toggle mobile search"
          >
            <iconify-icon icon={isMobileSearchOpen ? 'lucide:x' : 'lucide:search'} style={{ fontSize: '18px' }}></iconify-icon>
          </button>

          <button className="btn-get-plus" id="nav-plus-btn">
            <span>Get Gaana Plus</span>
          </button>
          <button className="btn-get-app" id="nav-app-btn">
            Get App
          </button>
          <button className="btn-profile" aria-label="Profile">
            <iconify-icon icon="lucide:user" style={{ fontSize: '17px' }}></iconify-icon>
          </button>
        </div>
      </div>

      {/* Fullscreen Mobile Search Modal Overlay */}
      {isMobileSearchOpen && (
        <div className="mobile-search-modal-backdrop" onClick={() => setIsMobileSearchOpen(false)}>
          <div
            className="mobile-search-modal-content"
            onClick={(e) => e.stopPropagation()}
            ref={mobileSearchRef}
          >
            {/* Modal Header */}
            <div className="mobile-search-modal-header">
              <div className="mobile-search-input-wrap">
                <iconify-icon icon="lucide:search" class="mobile-search-input-icon"></iconify-icon>
                <input
                  ref={mobileInputRef}
                  type="text"
                  placeholder="Search songs, artists, albums..."
                  className="mobile-search-modal-input"
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  aria-label="Search music"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="mobile-search-modal-clear"
                    onClick={handleClear}
                    aria-label="Clear search"
                  >
                    <iconify-icon icon="lucide:x" style={{ fontSize: '15px' }}></iconify-icon>
                  </button>
                )}
              </div>
              <button
                type="button"
                className="mobile-search-modal-close"
                onClick={() => {
                  setIsMobileSearchOpen(false);
                  handleClear();
                }}
                aria-label="Close search"
              >
                Cancel
              </button>
            </div>

            {/* Modal Body */}
            <div className="mobile-search-modal-body">
              {searchQuery.trim().length >= 2 ? (
                isSearching && searchResults.length === 0 ? (
                  <div className="search-status-item mobile-search-loading">
                    <iconify-icon icon="lucide:loader-2" class="search-spin-icon"></iconify-icon>
                    <span>Searching music catalog...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="mobile-search-results-list">
                    <div className="mobile-search-count-header">
                      <span>{searchResults.length} Songs & Tracks Found</span>
                    </div>
                    {searchResults.map((track, idx) => {
                      const isThisPlaying =
                        isPlaying &&
                        currentTrack &&
                        ((track.id && String(currentTrack.id) === String(track.id)) ||
                          (track.title && currentTrack.title === track.title) ||
                          (track.name && currentTrack.name === track.name));

                      return (
                        <div
                          key={`mob-${track.id || track.title}-${idx}`}
                          className={`mobile-search-result-item ${isThisPlaying ? 'active-search-item' : ''}`}
                          onClick={() => handleTrackClick(track)}
                          role="button"
                          tabIndex={0}
                        >
                          <div className="search-thumb-wrap">
                            <img
                              src={getTrackImage(track)}
                              alt={track.title || track.name}
                              className="search-thumb"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                              }}
                            />
                            {isThisPlaying ? (
                              <div className="search-playing-eq-badge">
                                <span className="eq-bar-anim bar-1" />
                                <span className="eq-bar-anim bar-2" />
                                <span className="eq-bar-anim bar-3" />
                              </div>
                            ) : (
                              <div className="search-play-overlay">
                                <iconify-icon icon="lucide:play" style={{ fontSize: '13px', color: '#ffffff' }}></iconify-icon>
                              </div>
                            )}
                          </div>

                          <div className="search-item-info">
                            <p className={`search-item-title ${isThisPlaying ? 'active-text' : ''}`}>
                              {track.title || track.name}
                            </p>
                            <p className="search-item-artist">{track.artist || 'Gaana Artist'}</p>
                          </div>

                          <div className="mobile-search-item-right">
                            <span className="search-item-duration">{formatDuration(track.duration)}</span>
                            <div className={`mobile-play-btn-circle ${isThisPlaying ? 'playing' : ''}`}>
                              <iconify-icon
                                icon={isThisPlaying ? 'lucide:pause' : 'lucide:play'}
                                style={{ fontSize: '13px', marginLeft: isThisPlaying ? '0' : '1px' }}
                              ></iconify-icon>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="search-status-item search-empty">
                    <iconify-icon icon="lucide:music-2" style={{ fontSize: '26px', color: '#ff2555' }}></iconify-icon>
                    <p className="search-empty-title">No songs found for "{searchQuery}"</p>
                    <span className="search-empty-sub">Try searching for popular hits:</span>
                    <div className="search-suggestions-chips">
                      {POPULAR_CHIPS.map((term) => (
                        <button
                          key={term}
                          type="button"
                          className="search-chip"
                          onClick={() => handleSuggestionClick(term)}
                        >
                          <span>{term}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              ) : (
                <div className="mobile-search-trending-wrap">
                  <div className="search-suggestions-header">
                    <iconify-icon icon="lucide:trending-up" style={{ fontSize: '14px', color: '#ff2555' }}></iconify-icon>
                    <span>Trending Searches</span>
                  </div>
                  <div className="mobile-trending-chips">
                    {POPULAR_CHIPS.map((term) => (
                      <button
                        key={term}
                        type="button"
                        className="mobile-trending-chip"
                        onClick={() => handleSuggestionClick(term)}
                      >
                        <iconify-icon icon="lucide:search" style={{ fontSize: '12px', color: '#ff2555' }}></iconify-icon>
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mobile-trending-list">
                    {TRENDING_SEARCHES.map((item) => (
                      <div
                        key={item.title}
                        className="mobile-trending-item"
                        onClick={() => handleSuggestionClick(item.title)}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="search-suggestion-icon">
                          <iconify-icon icon={item.icon} style={{ fontSize: '15px', color: '#ff2555' }}></iconify-icon>
                        </div>
                        <div className="search-suggestion-text">
                          <span className="search-suggestion-title">{item.title}</span>
                          <span className="search-suggestion-sub">{item.artist}</span>
                        </div>
                        <iconify-icon icon="lucide:arrow-up-right" class="search-suggestion-arrow"></iconify-icon>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
