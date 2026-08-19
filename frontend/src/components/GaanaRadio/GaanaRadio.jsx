import { moodRadioData } from '../../data/content';
import { usePlayer } from '../../context/PlayerContext';
import './GaanaRadio.css';

function GaanaRadio() {
  const { selectedMood, playTrack, currentTrack, isPlaying } = usePlayer();
  const currentRadio = moodRadioData[selectedMood] || moodRadioData.chill;

  const handleListenNow = () => {
    if (currentRadio.songs && currentRadio.songs.length > 0) {
      playTrack(currentRadio.songs[0]);
    } else {
      playTrack({
        id: `radio-${selectedMood}`,
        name: currentRadio.title,
        title: currentRadio.title,
        artist: 'Gaana Radio Stream',
        artwork: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        duration: 180,
      });
    }
  };

  const isRadioPlaying =
    isPlaying &&
    currentRadio.songs?.some(
      (s) => String(s.id) === String(currentTrack?.id) || s.name === currentTrack?.name
    );

  return (
    <div className="radio-card-wrapper">
      {/* Invisible spacer to match the left Moods & Genres header height on desktop */}
      <div className="radio-header-align-spacer" aria-hidden="true" />

      <div
        className={`radio-card ${isRadioPlaying ? 'radio-playing-active' : ''}`}
        onClick={handleListenNow}
        role="button"
        tabIndex={0}
        aria-label={`Listen to ${currentRadio.title}`}
        style={{ cursor: 'pointer' }}
      >
        {/* Ambient red/magenta nebula glow behind vinyl */}
        <div className="radio-glow-bg" />

        {/* Left Content */}
        <div className="radio-content">
          <h3 className="radio-title font-display">Gaana Radio</h3>
          <p className="radio-desc">
            {currentRadio.description || 'Non-stop music for every mood.'}
          </p>
          <button
            className="radio-cta-btn"
            id="radio-listen-now-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleListenNow();
            }}
            aria-label="Listen to Gaana Radio"
          >
            <span>{isRadioPlaying ? 'Playing Live' : 'Listen Now'}</span>
            <iconify-icon
              icon={isRadioPlaying ? 'lucide:volume-2' : 'lucide:chevron-right'}
              class="radio-btn-arrow"
            ></iconify-icon>
          </button>
        </div>

        {/* Right Vinyl Record with Ambient Light & Music Animations */}
        <div className="vinyl-wrapper">
          {/* Pulsing Sound Waves radiating outward */}
          <div className="radio-soundwave wave-1" />
          <div className="radio-soundwave wave-2" />
          <div className="radio-soundwave wave-3" />

          {/* Floating musical notes emerging from the vinyl */}
          <div className="radio-music-note r-note-1">♪</div>
          <div className="radio-music-note r-note-2">♫</div>
          <div className="radio-music-note r-note-3">♬</div>
          <div className="radio-music-note r-note-4">♩</div>
          <div className="radio-music-note r-note-5">♪</div>

          <div className="vinyl-ambient-glow" />

          <div className="vinyl-disc">
            {/* Grooves & shine effect overlay */}
            <div className="vinyl-sheen" />
            <div className="vinyl-groove-rings" />

            {/* Center Label */}
            <div className="vinyl-center-label">
              <div className="vinyl-inner-ring" />
              <div className="vinyl-spindle-hole" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GaanaRadio;
