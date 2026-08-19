import { moods, moodRadioData } from '../../data/content';
import { usePlayer } from '../../context/PlayerContext';
import MoodTile from './MoodTile';
import './MoodsGenres.css';

function MoodsGenres() {
  const { selectedMood, setSelectedMood, playTrack, isPlaying, currentTrack } = usePlayer();

  const handleMoodSelect = (moodId) => {
    setSelectedMood(moodId);
    const radioInfo = moodRadioData[moodId];
    if (radioInfo?.songs && radioInfo.songs.length > 0) {
      playTrack(radioInfo.songs[0]);
    }
  };

  return (
    <div id="moods-section" className="moods-section-wrap">
      <div className="section-header moods-header">
        <div className="moods-header-text">
          <h2 className="section-title">Moods & Genres</h2>
          <p className="moods-subheading">
            Pick a mood, we'll play the perfect music for you.
          </p>
        </div>
        <a href="#moods-section" id="view-all-moods" className="view-all-link">
          View All
        </a>
      </div>

      <div className="moods-grid">
        {moods.map((mood) => {
          const radioInfo = moodRadioData[mood.id];
          const isMoodActive =
            selectedMood === mood.id ||
            (isPlaying &&
              radioInfo?.songs?.some(
                (s) => String(s.id) === String(currentTrack?.id) || s.name === currentTrack?.name
              ));

          return (
            <MoodTile
              key={mood.id}
              mood={mood}
              isSelected={isMoodActive}
              onSelect={handleMoodSelect}
            />
          );
        })}
      </div>
    </div>
  );
}

export default MoodsGenres;
