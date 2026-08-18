import { trendingSongs } from '../../data/content';
import SongListItem from './SongListItem';
import './TrendingNow.css';

function TrendingNow() {
  return (
    <section id="trending-now" className="fade-in-section fade-in-2 section-block">
      <div className="section-header">
        <h2 className="section-title">Trending Now</h2>
        <a href="#" id="view-all-trending" className="view-all-link">
          View All
        </a>
      </div>
      <div className="trending-grid">
        {trendingSongs.map((song) => (
          <SongListItem key={song.id} song={song} />
        ))}
      </div>
    </section>
  );
}

export default TrendingNow;
