import { useState, useRef } from 'react';
import { heroImage } from '../../data/content';
import { usePlayer } from '../../context/PlayerContext';
import FloatingNotes from './FloatingNotes';
import './Hero.css';

function Hero() {
  const { playTrack, currentTrack } = usePlayer();
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const toggleSound = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    if (!nextMuted) {
      videoRef.current.play().catch(() => {});
    }
    setIsMuted(nextMuted);
  };

  return (
    <section id="hero" className="hero-container">
      {/* Background Animated Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        poster={heroImage}
        className="hero-bg-video"
      >
        <source src="/can_you_make_this_image_into_a_gwr_video_mvp.mp4" type="video/mp4" />
        {/* Fallback image if video fails to load */}
        <img
          src={heroImage}
          alt="Woman with headphones"
          className="hero-bg-image"
        />
      </video>

      {/* Gradient overlay */}
      <div className="hero-overlay" />

      {/* Floating music notes */}
      <FloatingNotes />

      {/* Speaker Mute / Unmute Button */}
      <button
        type="button"
        className={`hero-sound-toggle-btn ${!isMuted ? 'sound-active' : ''}`}
        onClick={toggleSound}
        aria-label={isMuted ? 'Unmute video sound' : 'Mute video sound'}
        title={isMuted ? 'Click to unmute video sound' : 'Click to mute video sound'}
      >
        <iconify-icon
          icon={isMuted ? 'lucide:volume-x' : 'lucide:volume-2'}
          style={{ fontSize: '18px' }}
        ></iconify-icon>
        <span className="hero-sound-label">{isMuted ? 'Sound Off' : 'Sound On'}</span>
        {!isMuted && <span className="hero-sound-wave-dot" />}
      </button>

      {/* Text content with clean animated headline */}
      <div className="hero-content">
        <h1 className="hero-title font-display">
          Music that<br />
          <span className="hero-title-accent text-gradient animated-title-gradient">
            Feels Like You
          </span>
        </h1>
        <p className="hero-subtitle">
          Stream over 45 million+ songs across languages.
        </p>
        <p className="hero-subtitle hero-subtitle-second">
          Ad-free music, unlimited downloads.
        </p>
        <div className="hero-ctas">
          <button
            className="brand-gradient hero-btn-primary btn-glow"
            onClick={() => playTrack(currentTrack)}
            aria-label="Start streaming music"
          >
            Try Gaana Plus Free
            <iconify-icon icon="lucide:chevron-right" style={{ fontSize: '17px' }}></iconify-icon>
          </button>
          <button
            className="hero-btn-secondary"
            id="explore-btn"
            onClick={() => document.getElementById('top-charts')?.scrollIntoView({ behavior: 'smooth' })}
            aria-label="Explore Top Charts"
          >
            Explore Top Charts
          </button>
        </div>
        <p className="hero-trust">
          <iconify-icon icon="lucide:shield-check" style={{ fontSize: '16px' }}></iconify-icon>
          7-day free trial • Cancel anytime
        </p>
      </div>
    </section>
  );
}

export default Hero;
