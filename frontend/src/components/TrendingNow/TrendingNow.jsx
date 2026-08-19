import { useState, useEffect } from 'react';
import { trendingSongs as staticTrendingSongs } from '../../data/content';
import { getTrendingSongs } from '../../services/musicApi';
import SongListItem from './SongListItem';
import './TrendingNow.css';

function TrendingNow() {
  const [songs, setSongs] = useState(staticTrendingSongs);

  useEffect(() => {
    let isMounted = true;
    getTrendingSongs(4)
      .then((tracks) => {
        if (isMounted && Array.isArray(tracks) && tracks.length > 0) {
          setSongs(tracks);
        }
      })
      .catch((err) => {
        console.warn('Trending tracks fetch fallback:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="trending-now" className="fade-in-section fade-in-2 section-block">
      <div className="section-header">
        <h2 className="section-title">Trending Now</h2>
        <a href="#trending-now" id="view-all-trending" className="view-all-link">
          View All
        </a>
      </div>
      <div className="trending-grid">
        {songs.map((song) => (
          <SongListItem key={song.id} song={song} />
        ))}
      </div>
    </section>
  );
}

export default TrendingNow;
