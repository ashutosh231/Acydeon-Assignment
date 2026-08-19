import { useState, useRef, useEffect, useCallback } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import './NowPlaying.css';

function NowPlaying() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    currentTime,
    duration,
    seekTrack,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    isLiked,
    toggleLike,
    nextTrack,
    prevTrack,
    isShuffle,
    toggleShuffle,
    isRepeat,
    toggleRepeat,
    playlist,
    playTrack,
    formatTime,
    playerError,
  } = usePlayer();

  const [showQueue, setShowQueue] = useState(false);
  const [showDevices, setShowDevices] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('HD 320 kbps (Lossless)');
  const [showCinemaModal, setShowCinemaModal] = useState(false);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [dragProgressTime, setDragProgressTime] = useState(0);

  const progressBarRef = useRef(null);
  const volumeBarRef = useRef(null);
  const queueDrawerRef = useRef(null);
  const devicesPopupRef = useRef(null);

  const displayTime = isDraggingProgress ? dragProgressTime : currentTime;
  const progressPercent = duration > 0 ? (displayTime / duration) * 100 : 0;

  // Handle Progress Bar Click, Drag & Touch
  const handleSeekFromEvent = useCallback((e) => {
    if (!progressBarRef.current || duration <= 0) return;
    const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
    if (typeof clientX !== 'number') return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = clickX / rect.width;
    const targetSeconds = percent * duration;
    return targetSeconds;
  }, [duration]);

  const handleProgressBarMouseDown = (e) => {
    const targetSec = handleSeekFromEvent(e);
    if (typeof targetSec === 'number') {
      setIsDraggingProgress(true);
      setDragProgressTime(targetSec);
    }
  };

  const handleTouchStart = (e) => {
    const targetSec = handleSeekFromEvent(e);
    if (typeof targetSec === 'number') {
      setIsDraggingProgress(true);
      setDragProgressTime(targetSec);
    }
  };

  const handleTouchMove = (e) => {
    if (isDraggingProgress) {
      const targetSec = handleSeekFromEvent(e);
      if (typeof targetSec === 'number') {
        setDragProgressTime(targetSec);
      }
    }
  };

  const handleTouchEnd = () => {
    if (isDraggingProgress) {
      seekTrack(dragProgressTime);
      setIsDraggingProgress(false);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingProgress) {
        const targetSec = handleSeekFromEvent(e);
        if (typeof targetSec === 'number') {
          setDragProgressTime(targetSec);
        }
      }
    };

    const handleMouseUp = (e) => {
      if (isDraggingProgress) {
        const targetSec = handleSeekFromEvent(e);
        if (typeof targetSec === 'number') {
          seekTrack(targetSec);
        }
        setIsDraggingProgress(false);
      }
    };

    if (isDraggingProgress) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingProgress, handleSeekFromEvent, seekTrack]);

  // Handle Volume Click & Wheel
  const handleVolumeClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newVol = Math.max(0, Math.min(1, clickX / rect.width));
    setVolume(newVol);
  };

  const handleVolumeWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.05 : -0.05;
    setVolume(Math.max(0, Math.min(1, volume + delta)));
  };

  // Close overlays on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        queueDrawerRef.current &&
        !queueDrawerRef.current.contains(e.target) &&
        !e.target.closest('#np-queue-btn') &&
        !e.target.closest('#np-mobile-queue-btn')
      ) {
        setShowQueue(false);
      }
      if (
        devicesPopupRef.current &&
        !devicesPopupRef.current.contains(e.target) &&
        !e.target.closest('#np-devices-btn')
      ) {
        setShowDevices(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <>
      <div className={`now-playing ${isPlaying ? 'is-playing' : ''}`}>
        {/* Top Seek Progress Line (Mobile & Desktop Accent) */}
        <div
          className="np-top-progress-bar"
          ref={progressBarRef}
          onMouseDown={handleProgressBarMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="slider"
          aria-valuenow={Math.round(displayTime)}
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          tabIndex={0}
          title="Click or drag to seek"
        >
          <div
            className="np-top-progress-fill"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>

        {/* Left: Album Artwork + Track Details + Desktop Like */}
        <div className="np-song-info" onClick={() => setShowCinemaModal(true)} role="button" tabIndex={0}>
          <div className={`np-thumb-wrap ${isPlaying ? 'thumb-playing' : ''}`}>
            {isPlaying && <div className="np-thumb-glow-ring" />}
            <img
              src={currentTrack.thumbnail || currentTrack.image}
              alt={currentTrack.name || currentTrack.title}
              className="np-thumb-img"
            />
          </div>

          <div className="np-details">
            <div className="np-title-row">
              <p className="np-song-name">{currentTrack.name || currentTrack.title}</p>
              {playerError ? (
                <span className="np-preview-tag error-tag" title={playerError}>
                  {playerError}
                </span>
              ) : currentTrack.previewUrl ? (
                <span className="np-preview-tag" title="Deezer 30s MP3 Preview">
                  Preview
                </span>
              ) : null}
              {isPlaying && (
                <div className="np-live-eq">
                  <span className="eq-bar-anim bar-1" />
                  <span className="eq-bar-anim bar-2" />
                  <span className="eq-bar-anim bar-3" />
                </div>
              )}
            </div>
            <p className="np-artist">{currentTrack.artist}</p>
          </div>

          <button
            className={`np-icon-btn np-desktop-like-btn ${isLiked ? 'liked' : ''}`}
            aria-label={isLiked ? 'Unlike song' : 'Like song'}
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(currentTrack.id);
            }}
            title={isLiked ? 'Liked' : 'Like'}
          >
            <iconify-icon
              icon={isLiked ? 'lucide:heart' : 'lucide:heart'}
              style={{
                fontSize: '18px',
                color: isLiked ? '#ff2555' : 'inherit',
                fill: isLiked ? '#ff2555' : 'none',
              }}
            ></iconify-icon>
          </button>
        </div>

        {/* Mobile Quick Action Controls */}
        <div className="np-mobile-controls">
          <button
            className={`np-icon-btn ${isLiked ? 'liked' : ''}`}
            aria-label={isLiked ? 'Unlike song' : 'Like song'}
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(currentTrack.id);
            }}
            title={isLiked ? 'Liked' : 'Like'}
          >
            <iconify-icon
              icon={isLiked ? 'lucide:heart' : 'lucide:heart'}
              style={{
                fontSize: '19px',
                color: isLiked ? '#ff2555' : 'inherit',
                fill: isLiked ? '#ff2555' : 'none',
              }}
            ></iconify-icon>
          </button>
          <button
            className={`np-play-btn ${isPlaying ? 'playing' : ''}`}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            <iconify-icon
              icon={isPlaying ? 'lucide:pause' : 'lucide:play'}
              style={{ fontSize: '20px', marginLeft: isPlaying ? '0' : '2px' }}
            ></iconify-icon>
          </button>
          <button
            className="np-icon-btn"
            aria-label="Next track"
            onClick={(e) => {
              e.stopPropagation();
              nextTrack();
            }}
            title="Next Track"
          >
            <iconify-icon icon="lucide:skip-forward" style={{ fontSize: '19px' }}></iconify-icon>
          </button>
          <button
            className={`np-icon-btn ${showQueue ? 'active-control' : ''}`}
            id="np-mobile-queue-btn"
            aria-label="Queue"
            onClick={(e) => {
              e.stopPropagation();
              setShowQueue((prev) => !prev);
              setShowDevices(false);
            }}
            title="Queue"
          >
            <iconify-icon icon="lucide:list-music" style={{ fontSize: '19px' }}></iconify-icon>
          </button>
        </div>

        {/* Center: Playback Controls + Interactive Seek Bar (Desktop) */}
        <div className="np-center">
          <div className="np-controls">
            <button
              className={`np-icon-btn ${isShuffle ? 'active-control' : ''}`}
              aria-label="Shuffle"
              onClick={toggleShuffle}
              title={isShuffle ? 'Shuffle On' : 'Shuffle Off'}
            >
              <iconify-icon icon="lucide:shuffle" style={{ fontSize: '16px' }}></iconify-icon>
            </button>
            <button
              className="np-icon-btn"
              aria-label="Previous track"
              onClick={prevTrack}
              title="Previous Track"
            >
              <iconify-icon icon="lucide:skip-back" style={{ fontSize: '18px' }}></iconify-icon>
            </button>
            <button
              className={`np-play-btn ${isPlaying ? 'playing' : ''}`}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              onClick={togglePlay}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              <iconify-icon
                icon={isPlaying ? 'lucide:pause' : 'lucide:play'}
                style={{ fontSize: '20px', marginLeft: isPlaying ? '0' : '2px' }}
              ></iconify-icon>
            </button>
            <button
              className="np-icon-btn"
              aria-label="Next track"
              onClick={nextTrack}
              title="Next Track"
            >
              <iconify-icon icon="lucide:skip-forward" style={{ fontSize: '18px' }}></iconify-icon>
            </button>
            <button
              className={`np-icon-btn ${isRepeat ? 'active-control' : ''}`}
              aria-label="Repeat"
              onClick={toggleRepeat}
              title={isRepeat ? 'Repeat On' : 'Repeat Off'}
            >
              <iconify-icon icon="lucide:repeat" style={{ fontSize: '16px' }}></iconify-icon>
            </button>
          </div>

          {/* Progress Seek Bar */}
          <div className="np-progress-row">
            <span className="np-time">{formatTime(displayTime)}</span>
            <div
              className="np-progress-bar"
              onMouseDown={handleProgressBarMouseDown}
              role="slider"
              aria-valuenow={Math.round(displayTime)}
              aria-valuemin={0}
              aria-valuemax={Math.round(duration)}
              tabIndex={0}
              title="Click or drag to seek"
            >
              <div
                className="np-progress-fill"
                style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
              />
              <div
                className="np-progress-dot"
                style={{ left: `${Math.min(100, Math.max(0, progressPercent))}%` }}
              />
            </div>
            <span className="np-time">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Queue, Quality & Devices, Volume, Cinema Fullscreen */}
        <div className="np-right">
          {/* Queue Button */}
          <button
            className={`np-icon-btn ${showQueue ? 'active-control' : ''}`}
            id="np-queue-btn"
            aria-label="Queue"
            onClick={() => {
              setShowQueue((prev) => !prev);
              setShowDevices(false);
            }}
            title="Now Playing Queue"
          >
            <iconify-icon icon="lucide:list-music" style={{ fontSize: '17px' }}></iconify-icon>
          </button>

          {/* Audio Quality & Devices Button */}
          <button
            className={`np-icon-btn ${showDevices ? 'active-control' : ''}`}
            id="np-devices-btn"
            aria-label="Audio Output & Quality"
            onClick={() => {
              setShowDevices((prev) => !prev);
              setShowQueue(false);
            }}
            title="Audio Quality & Stream Settings"
          >
            <iconify-icon icon="lucide:monitor-speaker" style={{ fontSize: '17px' }}></iconify-icon>
          </button>

          {/* Volume Control */}
          <button
            className="np-icon-btn"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            onClick={toggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            <iconify-icon
              icon={
                isMuted || volume === 0
                  ? 'lucide:volume-x'
                  : volume < 0.5
                  ? 'lucide:volume-1'
                  : 'lucide:volume-2'
              }
              style={{ fontSize: '17px' }}
            ></iconify-icon>
          </button>
          <div
            className="np-volume-bar"
            ref={volumeBarRef}
            onClick={handleVolumeClick}
            onWheel={handleVolumeWheel}
            role="slider"
            aria-valuenow={isMuted ? 0 : Math.round(volume * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            tabIndex={0}
            title={`Volume: ${isMuted ? 'Muted' : Math.round(volume * 100) + '%'}`}
          >
            <div
              className="np-volume-fill"
              style={{ width: `${isMuted ? 0 : volume * 100}%` }}
            />
            <div
              className="np-volume-dot"
              style={{ left: `${isMuted ? 0 : volume * 100}%` }}
            />
          </div>

          {/* Fullscreen Visualizer Modal Button */}
          <button
            className={`np-icon-btn ${showCinemaModal ? 'active-control' : ''}`}
            aria-label="Fullscreen Player Mode"
            onClick={() => setShowCinemaModal((prev) => !prev)}
            title="Fullscreen Visualizer Player"
          >
            <iconify-icon icon="lucide:maximize-2" style={{ fontSize: '15px' }}></iconify-icon>
          </button>
        </div>
      </div>

      {/* =========================================================
          INTERACTIVE OVERLAY 1: Queue Drawer Popup
          ========================================================= */}
      {showQueue && (
        <div className="np-queue-drawer" ref={queueDrawerRef}>
          <div className="bottom-sheet-handle-bar" onClick={() => setShowQueue(false)} />
          <div className="queue-drawer-header">
            <div className="queue-header-left">
              <iconify-icon icon="lucide:list-music" style={{ fontSize: '16px', color: '#ff2555' }}></iconify-icon>
              <h4>Up Next ({playlist.length})</h4>
            </div>
            <button className="queue-close-btn" onClick={() => setShowQueue(false)} aria-label="Close Queue">
              <iconify-icon icon="lucide:x" style={{ fontSize: '16px' }}></iconify-icon>
            </button>
          </div>

          <div className="queue-track-list">
            {playlist.map((track, idx) => {
              const isCurrent =
                track.id === currentTrack.id ||
                track.name === currentTrack.name ||
                track.title === currentTrack.title;

              return (
                <div
                  key={track.id || idx}
                  className={`queue-track-item ${isCurrent ? 'current-queue-item' : ''}`}
                  onClick={() => {
                    playTrack(track);
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="queue-track-thumb-wrap">
                    <img src={track.thumbnail || track.image} alt={track.title || track.name} className="queue-thumb" />
                    {isCurrent && isPlaying ? (
                      <div className="queue-playing-overlay">
                        <span className="eq-bar-anim bar-1" />
                        <span className="eq-bar-anim bar-2" />
                      </div>
                    ) : (
                      <div className="queue-play-hover">
                        <iconify-icon icon="lucide:play" style={{ fontSize: '11px', color: '#fff' }}></iconify-icon>
                      </div>
                    )}
                  </div>

                  <div className="queue-track-info">
                    <p className="queue-track-name">{track.title || track.name}</p>
                    <p className="queue-track-artist">{track.artist}</p>
                  </div>

                  <span className="queue-track-dur">{formatTime(track.duration || 210)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================
          INTERACTIVE OVERLAY 2: Audio Quality & Devices Menu
          ========================================================= */}
      {showDevices && (
        <div className="np-devices-popup" ref={devicesPopupRef}>
          <div className="bottom-sheet-handle-bar" onClick={() => setShowDevices(false)} />
          <div className="devices-header">
            <div className="devices-header-left">
              <iconify-icon icon="lucide:settings-2" style={{ fontSize: '15px', color: '#ff2555' }}></iconify-icon>
              <h4>Audio Quality & Stream</h4>
            </div>
            <button className="queue-close-btn" onClick={() => setShowDevices(false)} aria-label="Close settings">
              <iconify-icon icon="lucide:x" style={{ fontSize: '15px' }}></iconify-icon>
            </button>
          </div>
          <div className="devices-list">
            {[
              { label: 'HD 320 kbps (Lossless)', badge: 'Dolby', desc: 'Ultra high fidelity streaming' },
              { label: 'High 256 kbps', badge: 'HQ', desc: 'Crisp dynamic sound' },
              { label: 'Standard 128 kbps', badge: 'Normal', desc: 'Data saver mode' },
            ].map((option) => (
              <div
                key={option.label}
                className={`device-option ${selectedQuality === option.label ? 'selected-device' : ''}`}
                onClick={() => setSelectedQuality(option.label)}
                role="button"
                tabIndex={0}
              >
                <div className="device-option-text">
                  <div className="device-option-title">
                    <span>{option.label}</span>
                    <span className="device-badge">{option.badge}</span>
                  </div>
                  <span className="device-desc">{option.desc}</span>
                </div>
                {selectedQuality === option.label && (
                  <iconify-icon icon="lucide:check" style={{ fontSize: '15px', color: '#ff2555' }}></iconify-icon>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          INTERACTIVE OVERLAY 3: Fullscreen Visualizer Player Modal
          ========================================================= */}
      {showCinemaModal && (
        <div className="np-cinema-modal-backdrop" onClick={() => setShowCinemaModal(false)}>
          <div className="np-cinema-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="cinema-modal-header">
              <div className="cinema-title-wrap">
                <span className="cinema-badge">HD Lossless • 320 kbps</span>
                <h3 className="cinema-song-title">{currentTrack.name || currentTrack.title}</h3>
                <span className="cinema-artist">{currentTrack.artist}</span>
              </div>
              <button
                className="cinema-close-btn"
                onClick={() => setShowCinemaModal(false)}
                aria-label="Close Fullscreen View"
              >
                <iconify-icon icon="lucide:x" style={{ fontSize: '20px' }}></iconify-icon>
              </button>
            </div>

            <div className="cinema-visualizer-wrap">
              <div
                className="cinema-backdrop-blur"
                style={{ backgroundImage: `url(${currentTrack.thumbnail || currentTrack.image})` }}
              />
              <div className="cinema-art-card">
                <div className={`cinema-art-ring ${isPlaying ? 'art-playing' : ''}`}>
                  <img
                    src={currentTrack.thumbnail || currentTrack.image}
                    alt={currentTrack.name || currentTrack.title}
                    className="cinema-art-img"
                  />
                </div>
                {isPlaying && (
                  <div className="cinema-waves">
                    <span className="wave-bar w1" />
                    <span className="wave-bar w2" />
                    <span className="wave-bar w3" />
                    <span className="wave-bar w4" />
                    <span className="wave-bar w5" />
                    <span className="wave-bar w6" />
                    <span className="wave-bar w7" />
                  </div>
                )}
              </div>

              <div className="cinema-modal-player-bar">
                <div className="cinema-controls-row">
                  <button className="np-icon-btn" onClick={prevTrack} aria-label="Previous">
                    <iconify-icon icon="lucide:skip-back" style={{ fontSize: '22px' }}></iconify-icon>
                  </button>
                  <button
                    className={`np-play-btn ${isPlaying ? 'playing' : ''}`}
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    style={{ width: '48px', height: '48px' }}
                  >
                    <iconify-icon
                      icon={isPlaying ? 'lucide:pause' : 'lucide:play'}
                      style={{ fontSize: '24px', marginLeft: isPlaying ? '0' : '2px' }}
                    ></iconify-icon>
                  </button>
                  <button className="np-icon-btn" onClick={nextTrack} aria-label="Next">
                    <iconify-icon icon="lucide:skip-forward" style={{ fontSize: '22px' }}></iconify-icon>
                  </button>
                </div>
                <div className="cinema-progress-row">
                  <span className="np-time">{formatTime(displayTime)}</span>
                  <div
                    className="np-progress-bar"
                    ref={progressBarRef}
                    onMouseDown={handleProgressBarMouseDown}
                    role="slider"
                    aria-valuenow={Math.round(displayTime)}
                    aria-valuemin={0}
                    aria-valuemax={Math.round(duration)}
                    tabIndex={0}
                  >
                    <div
                      className="np-progress-fill"
                      style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
                    />
                    <div
                      className="np-progress-dot"
                      style={{ left: `${Math.min(100, Math.max(0, progressPercent))}%` }}
                    />
                  </div>
                  <span className="np-time">{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NowPlaying;
