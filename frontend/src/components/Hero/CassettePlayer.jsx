function CassettePlayer({ isPlaying = true }) {
  return (
    <svg
      viewBox="0 0 120 80"
      className={`cassette-body ${isPlaying ? 'reels-playing' : 'reels-paused'}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="cassetteGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer body */}
      <rect
        x="2"
        y="2"
        width="116"
        height="76"
        rx="8"
        fill="#1a1a2e"
        stroke="#ff2555"
        strokeWidth="1.5"
        opacity="0.95"
        filter="url(#cassetteGlow)"
      />

      {/* Inner window */}
      <rect
        x="8"
        y="6"
        width="104"
        height="50"
        rx="4"
        fill="#0d0d1a"
        stroke="#2a2a3e"
        strokeWidth="0.5"
      />

      {/* Reel left — static hub */}
      <circle
        cx="38"
        cy="30"
        r="16"
        fill="#2a1a30"
        stroke="#ff2555"
        strokeWidth="1"
        opacity="0.8"
      />
      {/* Reel left — spinning dashed ring */}
      <g
        className="reel-left"
        style={{
          transformBox: 'fill-box',
          transformOrigin: 'center',
          animationPlayState: isPlaying ? 'running' : 'paused',
        }}
      >
        <circle
          cx="38"
          cy="30"
          r="16"
          fill="none"
          stroke="#ff2555"
          strokeWidth="2"
          strokeDasharray="4 2"
          opacity="0.75"
        />
        <circle
          cx="38"
          cy="30"
          r="8"
          fill="#3a2a40"
          stroke="#ff2555"
          strokeWidth="0.5"
        />
        <circle cx="38" cy="30" r="2.5" fill="#ff2555" />
      </g>

      {/* Reel right — static hub */}
      <circle
        cx="82"
        cy="30"
        r="16"
        fill="#2a1a30"
        stroke="#ff2555"
        strokeWidth="1"
        opacity="0.8"
      />
      {/* Reel right — spinning dashed ring */}
      <g
        className="reel-right"
        style={{
          transformBox: 'fill-box',
          transformOrigin: 'center',
          animationPlayState: isPlaying ? 'running' : 'paused',
        }}
      >
        <circle
          cx="82"
          cy="30"
          r="16"
          fill="none"
          stroke="#ff2555"
          strokeWidth="2"
          strokeDasharray="4 2"
          opacity="0.75"
        />
        <circle
          cx="82"
          cy="30"
          r="8"
          fill="#3a2a40"
          stroke="#ff2555"
          strokeWidth="0.5"
        />
        <circle cx="82" cy="30" r="2.5" fill="#ff2555" />
      </g>

      {/* Tape line */}
      <line
        x1="54"
        y1="30"
        x2="66"
        y2="30"
        stroke="#ff2555"
        strokeWidth="2"
        opacity="0.7"
      />

      {/* Play indicator */}
      <g
        className="play-indicator"
        style={{
          animationPlayState: isPlaying ? 'running' : 'paused',
        }}
      >
        <polygon points="55,42 55,30 62,36" fill="#ff2555" opacity="0.9" />
      </g>

      {/* Bottom label bar */}
      <rect
        x="8"
        y="60"
        width="104"
        height="12"
        rx="2"
        fill="#1a1a2e"
        stroke="#2a2a3e"
        strokeWidth="0.5"
      />
      <text
        x="60"
        y="69"
        textAnchor="middle"
        fill="#ff2555"
        fontSize="7"
        fontFamily="monospace"
        fontWeight="bold"
      >
        gaana
      </text>
    </svg>
  );
}

export default CassettePlayer;
