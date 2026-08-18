import { madeForYou } from '../../data/content';
import { usePlayer } from '../../context/PlayerContext';
import './MadeForYou.css';

function MadeForYou() {
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  return (
    <section id="made-for-you" className="fade-in-section fade-in-3 section-block">
      <div className="section-header">
        <div className="mfy-header-text">
          <h2 className="section-title">Made For You</h2>
          <p className="mfy-subheading">Music picked for your vibe.</p>
        </div>
        <a href="#" id="view-all-made-for-you" className="view-all-link">
          <span>View All</span>
          <iconify-icon icon="lucide:arrow-right" style={{ fontSize: '14px' }}></iconify-icon>
        </a>
      </div>

      <div className="made-for-you-grid">
        {madeForYou.map((item) => {
          const isItemPlaying =
            isPlaying &&
            (currentTrack.name === item.topSong.name ||
              currentTrack.id === item.id);

          const handlePlayMix = (e) => {
            if (e) e.stopPropagation();
            playTrack({
              id: item.id,
              name: item.topSong.name,
              artist: `${item.title} • ${item.topSong.artist}`,
              image: item.image,
              duration: item.topSong.duration,
            });
          };

          return (
            <div
              key={item.id}
              className={`mfy-card ${isItemPlaying ? 'playing' : ''}`}
              onClick={handlePlayMix}
              tabIndex={0}
              role="button"
              aria-label={`Play ${item.title}`}
            >
              <div className="mfy-image-wrap">
                <img src={item.image} alt={item.title} className="mfy-image" />
                <div className="mfy-overlay" />

                {isItemPlaying && (
                  <div className="mfy-playing-eq-badge">
                    <span className="eq-bar-anim bar-1" />
                    <span className="eq-bar-anim bar-2" />
                    <span className="eq-bar-anim bar-3" />
                  </div>
                )}

                <button
                  className={`mfy-play-btn play-btn-circle ${isItemPlaying ? 'btn-playing' : ''}`}
                  aria-label={isItemPlaying ? 'Pause' : `Play ${item.title}`}
                  onClick={handlePlayMix}
                >
                  <iconify-icon
                    icon={isItemPlaying ? 'lucide:pause' : 'lucide:play'}
                    style={{ fontSize: '16px', marginLeft: isItemPlaying ? '0' : '2px' }}
                  ></iconify-icon>
                </button>
              </div>
              <div className="mfy-info">
                <h3 className={`mfy-title ${isItemPlaying ? 'active-mfy-title' : ''}`}>
                  {item.title}
                </h3>
                <p className="mfy-desc">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default MadeForYou;
