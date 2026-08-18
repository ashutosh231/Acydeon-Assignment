function MoodTile({ mood, isSelected, onSelect }) {
  return (
    <div
      className={`mood-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(mood.id)}
      role="button"
      tabIndex={0}
      aria-label={`Play ${mood.name} music`}
    >
      <img src={mood.image} alt={mood.name} className="mood-card-bg" />
      <div className="mood-card-overlay" />

      <div className="mood-card-content">
        <div
          className="mood-icon-badge"
          style={{ borderColor: mood.color, color: mood.color }}
        >
          <iconify-icon
            icon={mood.icon}
            style={{ fontSize: '18px' }}
          ></iconify-icon>
        </div>
        <div className="mood-text-group">
          <h3 className="mood-card-title">{mood.name}</h3>
          <p className="mood-card-subtitle">{mood.subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export default MoodTile;
