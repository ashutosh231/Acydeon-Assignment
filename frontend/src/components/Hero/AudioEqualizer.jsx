const barHeights = [32, 64, 24, 56, 20, 48, 36, 64, 28, 44];
const delays = [0, 0.1, 0.2, 0.3, 0.15, 0.25, 0.35, 0.45, 0.05, 0.3];

function AudioEqualizer({ isPlaying = true }) {
  return (
    <div className={`equalizer ${isPlaying ? 'eq-playing' : 'eq-idle'}`}>
      {barHeights.map((h, i) => (
        <div
          key={i}
          className="eq-bar"
          style={{
            height: isPlaying ? `${h}px` : '12px',
            animationDelay: `${delays[i]}s`,
            animationPlayState: isPlaying ? 'running' : 'paused',
          }}
        />
      ))}
    </div>
  );
}

export default AudioEqualizer;
