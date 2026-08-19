import { usePlayer } from '../../context/PlayerContext';

function ChartCard({ chart }) {
  const { currentTrack, isPlaying, playTrack } = usePlayer();
  const isThisPlaying =
    isPlaying &&
    (currentTrack.name === chart.topSong?.name ||
      currentTrack.title === chart.topSong?.name ||
      String(currentTrack.id) === String(chart.id));

  const handlePlay = (e) => {
    e.stopPropagation();
    if (chart.topSong) {
      playTrack({
        id: chart.id,
        name: chart.topSong.name,
        title: chart.topSong.name,
        artist: chart.topSong.artist,
        artwork: chart.image,
        image: chart.image,
        thumbnail: chart.image,
        previewUrl: chart.topSong.previewUrl || chart.previewUrl || null,
        duration: chart.topSong.duration || 30,
      });
    } else {
      playTrack(chart);
    }
  };

  return (
    <div
      className={`chart-card chart-card-group ${isThisPlaying ? 'playing' : ''}`}
      onClick={handlePlay}
      tabIndex={0}
      role="button"
      aria-label={`Play ${chart.description}`}
    >
      <img
        src={chart.artwork || chart.image}
        className="chart-card-img"
        alt={chart.description}
      />
      <div className="chart-card-overlay">
        <h3 className="chart-card-title font-display">
          {chart.title}<br />{chart.subtitle}
        </h3>
        <p className="chart-card-desc">{chart.description}</p>
      </div>

      {isThisPlaying && (
        <div className="chart-playing-eq-badge">
          <span className="eq-bar-anim bar-1" />
          <span className="eq-bar-anim bar-2" />
          <span className="eq-bar-anim bar-3" />
        </div>
      )}

      <button
        className={`chart-play-btn play-btn-circle ${isThisPlaying ? 'btn-playing' : ''}`}
        id={`play-${chart.id}`}
        onClick={handlePlay}
        aria-label={isThisPlaying ? 'Pause' : 'Play'}
      >
        <iconify-icon
          icon={isThisPlaying ? 'lucide:pause' : 'lucide:play'}
          style={{ fontSize: '16px', marginLeft: isThisPlaying ? '0' : '2px' }}
        ></iconify-icon>
      </button>
    </div>
  );
}

export default ChartCard;
