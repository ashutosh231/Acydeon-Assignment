import { useState, useEffect, useRef } from 'react';
import { navLinks } from '../../data/content';
import { searchMusic } from '../../services/youtubeApi';
import { usePlayer } from '../../context/PlayerContext';
import './Navbar.css';

function Navbar() {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef(null);

  // Debounced search logic for YouTube Music
  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchMusic(query, 8);
        setSearchResults(results);
      } catch (err) {
        console.warn('YouTube search error:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Click outside listener to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
    }
    setShowResults(true);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    setShowResults(false);
  };

  const handleTrackClick = (track) => {
    playTrack(track);
    handleClear();
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Left: Logo + Search */}
        <div className="navbar-left">
          <a href="#hero" id="nav-logo" className="navbar-logo font-display">
            gaana
            <span className="logo-note">♪</span>
          </a>

          {/* Search Bar & Live Dropdown */}
          <div className="navbar-search" ref={searchContainerRef}>
            <iconify-icon icon="lucide:search" class="search-icon"></iconify-icon>
            <input
              type="text"
              placeholder="Search songs, artists, albums, music videos..."
              className="search-input"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => setShowResults(true)}
              aria-label="Search music"
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={handleClear}
                aria-label="Clear search"
              >
                <iconify-icon icon="lucide:x" style={{ fontSize: '14px' }}></iconify-icon>
              </button>
            )}

            {/* Live Search Results Dropdown */}
            {showResults && searchQuery.trim().length >= 2 && (
              <div className="search-results-dropdown">
                {isSearching ? (
                  <div className="search-status-item">
                    <iconify-icon icon="lucide:loader-2" class="search-spin-icon"></iconify-icon>
                    <span>Searching YouTube Music...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="search-results-list">
                    <div className="search-results-header">
                      <span>YouTube Music Results</span>
                      <span className="search-count-badge">{searchResults.length} videos</span>
                    </div>
                    {searchResults.map((track) => {
                      const isThisPlaying =
                        isPlaying &&
                        (currentTrack.videoId === track.videoId ||
                          currentTrack.name === track.name ||
                          currentTrack.title === track.title);
                      return (
                        <div
                          key={track.id || track.videoId}
                          className={`search-result-item ${isThisPlaying ? 'active-search-item' : ''}`}
                          onClick={() => handleTrackClick(track)}
                          role="button"
                          tabIndex={0}
                        >
                          <div className="search-thumb-wrap">
                            <img
                              src={track.thumbnail || track.image}
                              alt={track.title || track.name}
                              className="search-thumb"
                            />
                            <div className="search-play-overlay">
                              <iconify-icon
                                icon={isThisPlaying ? 'lucide:pause' : 'lucide:play'}
                                style={{ fontSize: '12px', color: '#ffffff' }}
                              ></iconify-icon>
                            </div>
                          </div>
                          <div className="search-item-info">
                            <p className="search-item-title">{track.title || track.name}</p>
                            <p className="search-item-artist">{track.artist}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="search-status-item search-empty">
                    <iconify-icon icon="lucide:music-2" style={{ fontSize: '20px', color: '#ff2555' }}></iconify-icon>
                    <p>No videos found for "{searchQuery}"</p>
                    <span className="search-empty-sub">Try searching for songs like Husn, Kesariya, or Tauba Tauba.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Center: Nav Links */}
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

        {/* Right: CTAs + Profile */}
        <div className="navbar-right">
          <button className="btn-get-plus" id="nav-plus-btn">
            Get Gaana Plus
          </button>
          <button className="btn-get-app" id="nav-app-btn">
            Get App
          </button>
          <button className="btn-profile" aria-label="Profile">
            <iconify-icon icon="lucide:user" style={{ fontSize: '17px' }}></iconify-icon>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
