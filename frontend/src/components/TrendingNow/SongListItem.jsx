import { usePlayer } from '../../context/PlayerContext';

function SongListItem({ song }) {
  const { currentTrack, isPlaying, playTrack } = usePlayer();
  const isThisPlaying = isPlaying && currentTrack.id === song.id;

  const handlePlay = (e) => {
    e.stopPropagation();
    playTrack(song);
  };

  return (
    <div
      className={`song-list-item ${isThisPlaying ? 'playing' : ''}`}
      onClick={() => playTrack(song)}
      tabIndex={0}
      role="button"
      aria-label={`Play ${song.name}`}
    >
      <div className="song-thumb">
        <img src={song.image} alt={song.name} />
        {isThisPlaying ? (
          <div className="song-playing-eq-overlay">
            <span className="eq-bar-anim bar-1" />
            <span className="eq-bar-anim bar-2" />
            <span className="eq-bar-anim bar-3" />
          </div>
        ) : (
          <div className="song-thumb-overlay" />
        )}
      </div>
      <div className="song-info">
        <p className={`song-name ${isThisPlaying ? 'active-song-name' : ''}`}>
          {song.name}
        </p>
        <p className="song-artist">{song.artist}</p>
      </div>
      <button
        className={`song-play-btn play-slide-btn ${isThisPlaying ? 'btn-playing' : ''}`}
        id={`play-${song.id}`}
        onClick={handlePlay}
        aria-label={isThisPlaying ? 'Pause' : 'Play'}
      >
        <iconify-icon
          icon={isThisPlaying ? 'lucide:pause' : 'lucide:play'}
          style={{ fontSize: '14px', marginLeft: isThisPlaying ? '0' : '2px' }}
        ></iconify-icon>
      </button>
    </div>
  );
}

export default SongListItem;
