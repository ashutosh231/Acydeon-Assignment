import { useRef, useState, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import './MusicCarousel.css';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80';

function MusicCarousel({
  id,
  title,
  subtitle,
  viewAllLink = '#',
  items = [],
  variant = 'standard', // 'standard' | 'artist-portrait' | 'circular-radio' | 'circular-artist'
  className = '',
}) {
  const { currentTrack, isPlaying, playTrack } = usePlayer();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [items]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const containerWidth = scrollRef.current.clientWidth;
    const scrollAmount = direction === 'left' ? -containerWidth * 0.75 : containerWidth * 0.75;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section id={id} className={`fade-in-section section-block music-carousel-section ${className}`}>
      {/* Section Header */}
      <div className="section-header carousel-header">
        <div className="carousel-title-col">
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="carousel-subheading">{subtitle}</p>}
        </div>

        <div className="carousel-actions">
          {viewAllLink && (
            <a href={viewAllLink} className="view-all-link" id={`view-all-${id}`}>
              <span>View All</span>
              <iconify-icon icon="lucide:arrow-right" style={{ fontSize: '13px' }}></iconify-icon>
            </a>
          )}
          <div className="carousel-nav-arrows">
            <button
              className={`carousel-arrow-btn ${!canScrollLeft ? 'disabled' : ''}`}
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label={`Scroll ${title} left`}
            >
              <iconify-icon icon="lucide:chevron-left" style={{ fontSize: '16px' }}></iconify-icon>
            </button>
            <button
              className={`carousel-arrow-btn ${!canScrollRight ? 'disabled' : ''}`}
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label={`Scroll ${title} right`}
            >
              <iconify-icon icon="lucide:chevron-right" style={{ fontSize: '16px' }}></iconify-icon>
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Track */}
      <div className={`carousel-track ${variant}-track`} ref={scrollRef}>
        {items.map((item) => {
          const isThisPlaying =
            isPlaying &&
            ((item.topSong && currentTrack.name === item.topSong.name) ||
              currentTrack.id === item.id ||
              currentTrack.name === item.title ||
              currentTrack.name === item.name);

          const handleCardClick = () => {
            if (item.topSong) {
              playTrack({
                id: item.id,
                videoId: item.topSong.videoId || item.videoId,
                name: item.topSong.name,
                title: item.topSong.name,
                artist: item.topSong.artist,
                image: item.image,
                thumbnail: item.image,
                duration: item.topSong.duration || 210,
              });
            } else {
              playTrack({
                id: item.id,
                videoId: item.videoId,
                name: item.title || item.name,
                title: item.title || item.name,
                artist: item.subtitle || item.tagline || item.label || 'Gaana Original',
                image: item.image,
                thumbnail: item.image,
                duration: 210,
              });
            }
          };

          /* VARIANT 1: Circular Radio Station */
          if (variant === 'circular-radio') {
            return (
              <div
                key={item.id}
                className={`carousel-item radio-station-card ${isThisPlaying ? 'playing' : ''}`}
                onClick={handleCardClick}
                tabIndex={0}
                role="button"
                aria-label={`Listen to ${item.title}`}
              >
                <div className="station-disc-wrap">
                  {isThisPlaying && <div className="station-live-pulse" />}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="station-disc-img"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                    }}
                  />
                  <div className="station-disc-overlay" />
                  {isThisPlaying ? (
                    <div className="station-live-badge">
                      <span className="eq-bar-anim bar-1" />
                      <span className="eq-bar-anim bar-2" />
                      <span className="eq-bar-anim bar-3" />
                    </div>
                  ) : (
                    <div className="station-play-btn">
                      <iconify-icon icon="lucide:radio" style={{ fontSize: '18px' }}></iconify-icon>
                    </div>
                  )}
                  {item.frequency && <span className="station-freq-tag">{item.frequency}</span>}
                </div>
                <h3 className={`station-title ${isThisPlaying ? 'active-text' : ''}`}>{item.title}</h3>
                <p className="station-sub">{item.frequency || 'Live Radio'}</p>
              </div>
            );
          }

          /* VARIANT 2: Circular Artist (Top Searched Artists) */
          if (variant === 'circular-artist') {
            return (
              <div
                key={item.id}
                className={`carousel-item round-artist-card ${isThisPlaying ? 'playing' : ''}`}
                onClick={handleCardClick}
                tabIndex={0}
                role="button"
                aria-label={`Play songs by ${item.name}`}
              >
                <div className="round-artist-avatar-wrap">
                  {isThisPlaying && <div className="artist-playing-ring" />}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="round-artist-avatar"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                    }}
                  />
                  <div className="round-artist-overlay" />
                  {isThisPlaying ? (
                    <div className="round-artist-eq-badge">
                      <span className="eq-bar-anim bar-1" />
                      <span className="eq-bar-anim bar-2" />
                      <span className="eq-bar-anim bar-3" />
                    </div>
                  ) : (
                    <div className="round-artist-play-icon">
                      <iconify-icon icon="lucide:play" style={{ fontSize: '18px', marginLeft: '2px' }}></iconify-icon>
                    </div>
                  )}
                </div>
                <h3 className={`round-artist-name ${isThisPlaying ? 'active-text' : ''}`}>{item.name}</h3>
                <p className="round-artist-label">{item.label}</p>
              </div>
            );
          }

          /* VARIANT 3: Portrait Star Gallery */
          if (variant === 'artist-portrait') {
            return (
              <div
                key={item.id}
                className={`carousel-item star-portrait-card ${isThisPlaying ? 'playing' : ''}`}
                onClick={handleCardClick}
                tabIndex={0}
                role="button"
                aria-label={`Play ${item.name}`}
              >
                <div className="star-image-wrap">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="star-image"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                    }}
                  />
                  <div className="star-gradient-overlay" />

                  {isThisPlaying && (
                    <div className="star-live-eq-badge">
                      <span className="eq-bar-anim bar-1" />
                      <span className="eq-bar-anim bar-2" />
                      <span className="eq-bar-anim bar-3" />
                    </div>
                  )}

                  <div className="star-content-overlay">
                    <span className="star-pill-badge">Celebrity Star</span>
                    <h3 className={`star-name ${isThisPlaying ? 'active-text' : ''}`}>{item.name}</h3>
                    <p className="star-tagline">{item.tagline}</p>
                  </div>

                  <button
                    className={`star-play-btn play-btn-circle ${isThisPlaying ? 'btn-playing' : ''}`}
                    aria-label={`Play songs of ${item.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick();
                    }}
                  >
                    <iconify-icon
                      icon={isThisPlaying ? 'lucide:pause' : 'lucide:play'}
                      style={{ fontSize: '16px', marginLeft: isThisPlaying ? '0' : '2px' }}
                    ></iconify-icon>
                  </button>
                </div>
              </div>
            );
          }

          /* VARIANT 4: Standard Music / Playlist Card */
          return (
            <div
              key={item.id}
              className={`carousel-item standard-music-card ${isThisPlaying ? 'playing' : ''}`}
              onClick={handleCardClick}
              tabIndex={0}
              role="button"
              aria-label={`Play ${item.title || item.name}`}
            >
              <div className="card-artwork-wrap">
                <img
                  src={item.image}
                  alt={item.title || item.name}
                  className="card-artwork"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                  }}
                />
                <div className="card-artwork-overlay" />

                {item.badge && <span className="card-lang-badge">{item.badge}</span>}

                {isThisPlaying && (
                  <div className="card-playing-eq-badge">
                    <span className="eq-bar-anim bar-1" />
                    <span className="eq-bar-anim bar-2" />
                    <span className="eq-bar-anim bar-3" />
                  </div>
                )}

                <button
                  className={`card-hover-play-btn play-btn-circle ${isThisPlaying ? 'btn-playing' : ''}`}
                  aria-label={isThisPlaying ? 'Pause' : `Play ${item.title || item.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick();
                  }}
                >
                  <iconify-icon
                    icon={isThisPlaying ? 'lucide:pause' : 'lucide:play'}
                    style={{ fontSize: '16px', marginLeft: isThisPlaying ? '0' : '2px' }}
                  ></iconify-icon>
                </button>
              </div>

              <div className="card-metadata">
                <h3 className={`card-title ${isThisPlaying ? 'active-text' : ''}`}>
                  {item.title || item.name}
                </h3>
                <p className="card-subtitle">{item.subtitle || item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default MusicCarousel;
