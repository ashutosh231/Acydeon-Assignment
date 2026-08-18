import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../context/PlayerContext';

function YouTubeMiniPlayer() {
  const { setYtPlayerInstance, handleYtStateChange, playerError } = usePlayer();
  const playerContainerRef = useRef(null);
  const playerInstanceRef = useRef(null);
  const [isApiLoaded, setIsApiLoaded] = useState(
    () => typeof window !== 'undefined' && !!(window.YT && window.YT.Player)
  );

  // Load YouTube IFrame API script dynamically
  useEffect(() => {
    if (typeof window === 'undefined' || (window.YT && window.YT.Player)) {
      return;
    }

    const existingScript = document.getElementById('youtube-iframe-api-script');
    if (!existingScript) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const prevOnReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prevOnReady === 'function') prevOnReady();
      setIsApiLoaded(true);
    };
  }, []);

  // Initialize YT.Player once API is ready (kept alive permanently)
  useEffect(() => {
    if (!isApiLoaded || !playerContainerRef.current || playerInstanceRef.current) {
      return;
    }

    try {
      new window.YT.Player(playerContainerRef.current, {
        height: '124',
        width: '220',
        videoId: 'gRR34kv4N8w',
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          fs: 1,
          origin: window.location.origin,
          playsinline: 1,
          enablejsapi: 1,
        },
        events: {
          onReady: (event) => {
            playerInstanceRef.current = event.target;
            setYtPlayerInstance(event.target);
          },
          onStateChange: (event) => {
            handleYtStateChange(event);
          },
          onError: (event) => {
            console.warn('YouTube Player error code:', event.data);
            if (event.data === 150 || event.data === 101) {
              console.info('Video owner disabled embedding, skipping or trying next track.');
            }
          },
        },
      });
    } catch (e) {
      console.warn('YouTube Player initialization error:', e);
    }

    return () => {
      if (playerInstanceRef.current && typeof playerInstanceRef.current.destroy === 'function') {
        try {
          playerInstanceRef.current.destroy();
        } catch {
          // ignore cleanup error
        }
        playerInstanceRef.current = null;
        setYtPlayerInstance(null);
      }
    };
  }, [isApiLoaded, setYtPlayerInstance, handleYtStateChange]);

  return (
    <div className="np-yt-mini-wrapper" title="YouTube Video Player">
      <div id="youtube-mini-player-container" ref={playerContainerRef} className="np-yt-iframe-frame" />
      {playerError && (
        <div className="np-yt-error-badge">
          <iconify-icon icon="lucide:alert-circle" style={{ fontSize: '13px', color: '#ff2555' }}></iconify-icon>
          <span>{playerError}</span>
        </div>
      )}
    </div>
  );
}

export default YouTubeMiniPlayer;
