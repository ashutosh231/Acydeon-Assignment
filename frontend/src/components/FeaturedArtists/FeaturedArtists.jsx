import { featuredArtists } from '../../data/content';
import { usePlayer } from '../../context/PlayerContext';
import './FeaturedArtists.css';

function FeaturedArtists() {
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  return (
    <section id="featured-artists" className="fade-in-section fade-in-3 section-block">
      <div className="section-header">
        <div>
          <h2 className="section-title">Featured Artists</h2>
        </div>
        <a href="#" id="view-all-artists" className="view-all-link">
          View All
        </a>
      </div>

      <div className="artists-grid">
        {featuredArtists.map((artist) => {
          const isArtistPlaying =
            isPlaying &&
            (currentTrack.artist?.includes(artist.name) ||
              currentTrack.name === artist.topSong?.name);

          return (
            <div
              key={artist.id}
              className={`artist-card ${isArtistPlaying ? 'playing' : ''}`}
              onClick={() =>
                playTrack({
                  id: `artist-${artist.id}`,
                  name: artist.topSong.name,
                  artist: artist.topSong.artist,
                  image: artist.image,
                  duration: artist.topSong.duration,
                })
              }
              tabIndex={0}
              role="button"
              aria-label={`Play ${artist.name}`}
            >
              <div className="artist-avatar-wrap">
                {isArtistPlaying && <div className="artist-playing-ring" />}
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="artist-avatar"
                />
                <div className="artist-avatar-overlay" />

                {isArtistPlaying ? (
                  <div className="artist-live-eq-badge">
                    <span className="eq-bar-anim bar-1" />
                    <span className="eq-bar-anim bar-2" />
                    <span className="eq-bar-anim bar-3" />
                  </div>
                ) : (
                  <div className="artist-play-indicator">
                    <iconify-icon
                      icon="lucide:play"
                      style={{ fontSize: '18px', marginLeft: '2px' }}
                    ></iconify-icon>
                  </div>
                )}
              </div>
              <h3 className={`artist-name ${isArtistPlaying ? 'active-artist-name' : ''}`}>
                {artist.name}
              </h3>
              <p className="artist-role">{artist.role}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default FeaturedArtists;
