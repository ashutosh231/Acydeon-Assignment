import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { verifiedDemoTracks, normalizeYouTubeTrack, searchMusic } from '../services/youtubeApi';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [playlist, setPlaylist] = useState(verifiedDemoTracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(verifiedDemoTracks[0].duration);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [likedTracks, setLikedTracks] = useState({ [verifiedDemoTracks[0].id]: true });
  const [selectedMood, setSelectedMood] = useState('romantic');
  const [playerError, setPlayerError] = useState(null);

  // Reference to the active YouTube Player instance & pending autoplay queue
  const ytPlayerRef = useRef(null);
  const pendingTrackRef = useRef(null);

  const currentTrack = playlist[currentTrackIndex] || verifiedDemoTracks[0];

  const setYtPlayerInstance = useCallback((player) => {
    ytPlayerRef.current = player;
    if (player && typeof player.setVolume === 'function') {
      player.setVolume(volume * 100);
      if (isMuted) {
        player.mute();
      }
    }
    // If a track was queued while player was initializing, immediately start it
    if (player && pendingTrackRef.current) {
      const vid = pendingTrackRef.current;
      pendingTrackRef.current = null;
      if (typeof player.loadVideoById === 'function') {
        player.loadVideoById(vid);
        if (typeof player.playVideo === 'function') {
          player.playVideo();
        }
      }
    }
  }, [volume, isMuted]);

  // Next track callback
  const nextTrack = useCallback(() => {
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
    setDuration(nextItem.duration || 210);
    setIsPlaying(true);

    if (ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
      ytPlayerRef.current.loadVideoById(nextItem.videoId);
      if (typeof ytPlayerRef.current.playVideo === 'function') {
        ytPlayerRef.current.playVideo();
      }
    }
  }, [isShuffle, playlist, currentTrackIndex]);

  // Previous track callback
  const prevTrack = useCallback(() => {
    if (playlist.length === 0) return;
    if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
      const cur = ytPlayerRef.current.getCurrentTime();
      if (cur > 4) {
        ytPlayerRef.current.seekTo(0, true);
        setCurrentTime(0);
        return;
      }
    }

    const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    const prevItem = playlist[prevIndex];
    setCurrentTrackIndex(prevIndex);
    setCurrentTime(0);
    setDuration(prevItem.duration || 210);
    setIsPlaying(true);

    if (ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
      ytPlayerRef.current.loadVideoById(prevItem.videoId);
      if (typeof ytPlayerRef.current.playVideo === 'function') {
        ytPlayerRef.current.playVideo();
      }
    }
  }, [playlist, currentTrackIndex]);

  // Handle YouTube Player state changes
  const handleYtStateChange = useCallback((event) => {
    // 1 = PLAYING, 2 = PAUSED, 0 = ENDED, 3 = BUFFERING
    if (event.data === 1) {
      setIsPlaying(true);
      setPlayerError(null);
      if (typeof event.target.getDuration === 'function') {
        const dur = event.target.getDuration();
        if (dur > 0) setDuration(dur);
      }
    } else if (event.data === 2) {
      setIsPlaying(false);
    } else if (event.data === 0) {
      if (isRepeat) {
        if (typeof event.target.seekTo === 'function') {
          event.target.seekTo(0, true);
          event.target.playVideo();
        }
      } else {
        nextTrack();
      }
    }
  }, [isRepeat, nextTrack]);

  // Time tracking ticker while video is playing
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
          const time = ytPlayerRef.current.getCurrentTime();
          if (typeof time === 'number' && !isNaN(time)) {
            setCurrentTime(time);
          }
          const dur = ytPlayerRef.current.getDuration?.();
          if (typeof dur === 'number' && dur > 0) {
            setDuration(dur);
          }
        }
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Toggle play/pause
  const togglePlay = () => {
    const player = ytPlayerRef.current;
    if (!player) return;

    if (isPlaying) {
      if (typeof player.pauseVideo === 'function') {
        player.pauseVideo();
      }
      setIsPlaying(false);
    } else {
      if (typeof player.playVideo === 'function') {
        player.playVideo();
      } else if (typeof player.loadVideoById === 'function') {
        player.loadVideoById(currentTrack.videoId);
      }
      setIsPlaying(true);
    }
  };

  // Play a specific track (searches YouTube API by song name and autoplays immediately)
  const playTrack = async (rawTrack) => {
    if (!rawTrack) return;
    let track = normalizeYouTubeTrack(rawTrack);

    const songTitle = rawTrack.name || rawTrack.title || track.title || track.name;
    const songArtist = rawTrack.artist || track.artist || '';

    // Search YouTube API by song name & artist to retrieve the exact working video ID
    try {
      const searchResults = await searchMusic(`${songTitle} ${songArtist}`, 1);
      if (searchResults && searchResults.length > 0 && searchResults[0].videoId) {
        track = {
          ...track,
          videoId: searchResults[0].videoId,
          title: songTitle,
          name: songTitle,
          artist: songArtist || searchResults[0].artist,
          thumbnail: searchResults[0].thumbnail || track.thumbnail,
          image: searchResults[0].image || track.image,
        };
      }
    } catch (err) {
      console.warn('YouTube search by song name fallback:', err);
    }

    const index = playlist.findIndex(
      (t) => t.videoId === track.videoId || t.name === track.name || t.id === track.id
    );

    if (index === -1) {
      setPlaylist((prev) => [track, ...prev]);
      setCurrentTrackIndex(0);
    } else {
      setCurrentTrackIndex(index);
    }

    setCurrentTime(0);
    setDuration(track.duration || 210);
    setIsPlaying(true);

    const player = ytPlayerRef.current;
    if (player && typeof player.loadVideoById === 'function') {
      player.loadVideoById(track.videoId);
      if (typeof player.playVideo === 'function') {
        player.playVideo();
      }
    } else {
      pendingTrackRef.current = track.videoId;
    }
  };

  // Seek to specific second
  const seekTrack = (seconds) => {
    const player = ytPlayerRef.current;
    const clampedTime = Math.max(0, Math.min(seconds, duration));
    if (player && typeof player.seekTo === 'function') {
      player.seekTo(clampedTime, true);
    }
    setCurrentTime(clampedTime);
  };

  // Set volume level (0 to 1)
  const setVolumeLevel = (val) => {
    const clampedVal = Math.max(0, Math.min(1, val));
    setVolume(clampedVal);
    const player = ytPlayerRef.current;
    if (player && typeof player.setVolume === 'function') {
      player.setVolume(clampedVal * 100);
      if (clampedVal > 0 && isMuted && typeof player.unMute === 'function') {
        player.unMute();
        setIsMuted(false);
      }
    }
  };

  // Toggle mute
  const toggleMute = () => {
    const player = ytPlayerRef.current;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (player) {
      if (nextMuted && typeof player.mute === 'function') {
        player.mute();
      } else if (!nextMuted && typeof player.unMute === 'function') {
        player.unMute();
      }
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
      const normalized = tracks.map(normalizeYouTubeTrack).filter(Boolean);
      setPlaylist(normalized);
      setCurrentTrackIndex(0);
      setCurrentTime(0);
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
        setYtPlayerInstance,
        handleYtStateChange,
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
