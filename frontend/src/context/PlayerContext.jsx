import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { demoTracks, normalizeTrack } from '../services/musicService';
import { getTrendingSongs, searchSongs } from '../services/musicApi';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [playlist, setPlaylist] = useState(demoTracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(demoTracks[0].duration || 30);
  const [volume, setVolumeState] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [likedTracks, setLikedTracks] = useState({ [demoTracks[0].id]: true });
  const [selectedMood, setSelectedMood] = useState('romantic');
  const [playerError, setPlayerError] = useState(null);
  const [hasPreview, setHasPreview] = useState(true);

  // Persistent HTML5 Audio element
  const audioRef = useRef(typeof Audio !== 'undefined' ? new Audio() : null);

  const currentTrack = playlist[currentTrackIndex] || demoTracks[0];

  // Helper to load and play audio from track object
  const playAudioTrack = useCallback(
    async (track, shouldAutoplay = true) => {
      const audio = audioRef.current;
      if (!audio) return;

      console.log('[PLAYER] selected track:', track);
      console.log('[PLAYER] previewUrl:', track?.previewUrl);

      let preview = track?.previewUrl;

      // If previewUrl is missing on static cards, resolve live from Deezer backend
      if (!preview || !preview.startsWith('http')) {
        try {
          const searchQuery = `${track.title || track.name} ${track.artist || ''}`
            .replace(/[•\-|()]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

          console.log('[PLAYER] Resolving preview from Deezer backend for:', searchQuery);
          const results = await searchSongs(searchQuery, 1);
          if (results && results.length > 0 && results[0].previewUrl) {
            preview = results[0].previewUrl;
            track.previewUrl = preview;
            track.artwork = results[0].artwork || track.artwork;
            track.duration = results[0].duration || track.duration;
            track.id = results[0].id || track.id;
          }
        } catch (err) {
          console.warn('[PLAYER] Auto-resolve error:', err.message);
        }
      }

      if (preview && typeof preview === 'string' && preview.startsWith('http')) {
        setHasPreview(true);
        setPlayerError(null);

        console.log('[PLAYER] loading audio:', preview);

        if (audio.src !== preview) {
          audio.src = preview;
          audio.currentTime = 0;
        }

        audio.volume = isMuted ? 0 : volume;
        audio.muted = isMuted;

        if (shouldAutoplay) {
          try {
            await audio.play();
            setIsPlaying(true);
            setPlayerError(null);
          } catch (error) {
            console.error('[PLAYER] playback failed:', error);
            setIsPlaying(false);
            setPlayerError('Playback error');
          }
        }
      } else {
        audio.pause();
        audio.removeAttribute('src');
        setHasPreview(false);
        setPlayerError('Preview unavailable');
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(track?.duration || 30);
      }
    },
    [volume, isMuted]
  );

  // Fetch initial live Deezer tracks from backend on mount
  useEffect(() => {
    let isMounted = true;
    getTrendingSongs(10)
      .then((tracks) => {
        if (isMounted && Array.isArray(tracks) && tracks.length > 0) {
          setPlaylist((prev) => {
            const liveIds = new Set(tracks.map((t) => String(t.id)));
            const remaining = prev.filter((t) => !liveIds.has(String(t.id)));
            return [...tracks, ...remaining];
          });
          // Update duration and source for the default top song
          if (tracks[0]) {
            setDuration(tracks[0].duration || 30);
            if (audioRef.current && tracks[0].previewUrl) {
              audioRef.current.src = tracks[0].previewUrl;
            }
          }
        }
      })
      .catch((err) => {
        console.warn('[PLAYER] Initial live trending tracks fallback:', err.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Next track callback
  const nextTrack = useCallback(async () => {
    if (playlist.length === 0) return;
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = (currentTrackIndex + 1) % playlist.length;
    }
    const nextItem = playlist[nextIndex];
    setCurrentTrackIndex(nextIndex);
    setCurrentTime(0);
    setDuration(nextItem.duration || 30);
    await playAudioTrack(nextItem, true);
  }, [isShuffle, playlist, currentTrackIndex, playAudioTrack]);

  // Previous track callback
  const prevTrack = useCallback(async () => {
    if (playlist.length === 0) return;
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    const prevItem = playlist[prevIndex];
    setCurrentTrackIndex(prevIndex);
    setCurrentTime(0);
    setDuration(prevItem.duration || 30);
    await playAudioTrack(prevItem, true);
  }, [playlist, currentTrackIndex, playAudioTrack]);

  // Attach native Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      console.log('[PLAYER] onloadedmetadata duration:', audio.duration);
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const onCanPlay = () => {
      console.log('[PLAYER] oncanplay readyState:', audio.readyState);
    };

    const onTimeUpdate = () => {
      if (!isNaN(audio.currentTime)) {
        setCurrentTime(audio.currentTime);
      }
    };

    const onPlay = () => {
      console.log('[PLAYER] onplay');
      setIsPlaying(true);
      setPlayerError(null);
    };

    const onPause = () => {
      console.log('[PLAYER] onpause');
      setIsPlaying(false);
    };

    const onEnded = () => {
      console.log('[PLAYER] onended');
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch((err) => console.error('[PLAYER] repeat playback failed:', err));
      } else {
        nextTrack();
      }
    };

    const onError = (e) => {
      console.error('[PLAYER] onerror:', audio.error, e);
      if (audio.error && audio.error.code !== 20) {
        setPlayerError('Preview unavailable');
        setIsPlaying(false);
      }
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('durationchange', onLoadedMetadata);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('durationchange', onLoadedMetadata);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [isRepeat, nextTrack]);

  // Toggle play/pause
  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (!currentTrack?.previewUrl && !hasPreview) {
        setPlayerError('Preview unavailable');
        return;
      }
      if (!audio.src && currentTrack?.previewUrl) {
        audio.src = currentTrack.previewUrl;
      }
      try {
        console.log('[PLAYER] loading audio:', audio.src);
        await audio.play();
        setIsPlaying(true);
        setPlayerError(null);
      } catch (error) {
        console.error('[PLAYER] playback failed:', error);
        setIsPlaying(false);
        setPlayerError('Playback error');
      }
    }
  };

  // Play a specific track (user clicked a song card / search result / button)
  const playTrack = async (rawTrack) => {
    if (!rawTrack) return;
    const track = normalizeTrack(rawTrack);

    setPlaylist((prev) => {
      const idx = prev.findIndex(
        (t) => String(t.id) === String(track.id) || (t.title === track.title && t.artist === track.artist)
      );
      if (idx === -1) {
        return [track, ...prev];
      } else {
        const updated = [...prev];
        updated[idx] = track; // Replace with fresh track object containing active token
        return updated;
      }
    });

    const index = playlist.findIndex(
      (t) => String(t.id) === String(track.id) || (t.title === track.title && t.artist === track.artist)
    );
    setCurrentTrackIndex(index === -1 ? 0 : index);

    setCurrentTime(0);
    setDuration(track.duration || 30);
    await playAudioTrack(track, true);
  };

  // Seek to specific second
  const seekTrack = (seconds) => {
    const clampedTime = Math.max(0, Math.min(seconds, duration));
    const audio = audioRef.current;
    if (audio && audio.src && !isNaN(audio.duration)) {
      try {
        audio.currentTime = clampedTime;
      } catch (e) {
        console.warn('[PLAYER] seek error:', e);
      }
    }
    setCurrentTime(clampedTime);
  };

  // Set volume level (0 to 1)
  const setVolumeLevel = (val) => {
    const clampedVal = Math.max(0, Math.min(1, val));
    setVolumeState(clampedVal);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = clampedVal;
      if (clampedVal > 0 && isMuted) {
        audio.muted = false;
        setIsMuted(false);
      }
    }
  };

  // Toggle mute
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    const audio = audioRef.current;
    if (audio) {
      audio.muted = nextMuted;
    }
  };

  // Like / Unlike toggle
  const toggleLike = (trackId) => {
    const id = trackId || currentTrack.id;
    setLikedTracks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleShuffle = () => {
    setIsShuffle((prev) => !prev);
  };

  const toggleRepeat = () => {
    setIsRepeat((prev) => !prev);
  };

  const setQueue = (tracks) => {
    if (Array.isArray(tracks) && tracks.length > 0) {
      const normalized = tracks.map(normalizeTrack).filter(Boolean);
      setPlaylist(normalized);
      setCurrentTrackIndex(0);
      setCurrentTime(0);
      setDuration(normalized[0].duration || 30);
      playAudioTrack(normalized[0], false);
    }
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const totalSecs = Math.floor(secs);
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isLiked = !!likedTracks[currentTrack.id];

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        isRepeat,
        isLiked,
        likedTracks,
        selectedMood,
        playlist,
        queue: playlist,
        currentIndex: currentTrackIndex,
        playerError,
        hasPreview,
        togglePlay,
        playTrack,
        nextTrack,
        playNext: nextTrack,
        prevTrack,
        playPrevious: prevTrack,
        seekTrack,
        seek: seekTrack,
        toggleLike,
        toggleMute,
        setVolume: setVolumeLevel,
        toggleShuffle,
        toggleRepeat,
        setIsShuffle,
        setIsRepeat,
        setSelectedMood: handleMoodSelect,
        setQueue,
        formatTime,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}

export default PlayerContext;
