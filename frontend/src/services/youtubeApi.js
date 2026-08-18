/* ============================================
   YouTube Music API Service Layer
   Search, Caching & Data Normalization
   ============================================ */

const SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

// In-memory query cache to preserve API quota
const searchCache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Curated verified YouTube music tracks for instant demo playback & search fallbacks
 */
export const verifiedDemoTracks = [
  {
    id: 'yt-husn',
    videoId: 'gRR34kv4N8w',
    title: 'Husn',
    name: 'Husn',
    artist: 'Anuv Jain',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&w=400&q=80',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&w=400&q=80',
    duration: 225,
  },
  {
    id: 'yt-aaj-ki-raat',
    videoId: 'hxMMW4rhBWA',
    title: 'Aaj Ki Raat',
    name: 'Aaj Ki Raat',
    artist: 'Stree 2 • Sachin-Jigar',
    thumbnail: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&w=400&q=80',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&w=400&q=80',
    duration: 192,
  },
  {
    id: 'yt-tauba-tauba',
    videoId: 'LK7-_dgAVQE',
    title: 'Tauba Tauba',
    name: 'Tauba Tauba',
    artist: 'Bad Newz • Karan Aujla',
    thumbnail: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?ixlib=rb-4.0.3&w=400&q=80',
    image: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?ixlib=rb-4.0.3&w=400&q=80',
    duration: 208,
  },
  {
    id: 'yt-kahani-suno',
    videoId: 'zBBM3ptzXoE',
    title: 'Kahani Suno 2.0',
    name: 'Kahani Suno 2.0',
    artist: 'Kaifi Khalil',
    thumbnail: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&w=400&q=80',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&w=400&q=80',
    duration: 175,
  },
  {
    id: 'yt-tum-mile',
    videoId: 'd9fA_8GZ3kQ',
    title: 'Tum Mile',
    name: 'Tum Mile',
    artist: 'Pritam • Neeraj Shridhar',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&w=400&q=80',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&w=400&q=80',
    duration: 342,
  },
  {
    id: 'yt-kesariya',
    videoId: 'BddP6PYo2gs',
    title: 'Kesariya',
    name: 'Kesariya',
    artist: 'Arijit Singh • Pritam',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&w=400&q=80',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&w=400&q=80',
    duration: 268,
  },
  {
    id: 'yt-lover',
    videoId: 'mH_LFkWxpI0',
    title: 'Lover',
    name: 'Lover',
    artist: 'Diljit Dosanjh',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&w=400&q=80',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&w=400&q=80',
    duration: 185,
  },
  {
    id: 'yt-with-you',
    videoId: '4qyZX_iwa_A',
    title: 'With You',
    name: 'With You',
    artist: 'AP Dhillon',
    thumbnail: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?ixlib=rb-4.0.3&w=400&q=80',
    image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?ixlib=rb-4.0.3&w=400&q=80',
    duration: 160,
  },
];

/**
 * Normalizes YouTube video item or track object into internal schema
 */
export function normalizeYouTubeTrack(raw) {
  if (!raw) return null;
  const videoId =
    raw.videoId ||
    (typeof raw.id === 'string' && raw.id.length === 11 ? raw.id : raw.id?.videoId) ||
    'gRR34kv4N8w';

  let rawTitle = raw.snippet?.title || raw.title || raw.name || 'Untitled Music';
  // Decode HTML entities
  const parser = typeof DOMParser !== 'undefined' ? new DOMParser() : null;
  if (parser) {
    const doc = parser.parseFromString(rawTitle, 'text/html');
    rawTitle = doc.body.textContent || rawTitle;
  }

  // Extract clean artist/song name
  let title = rawTitle;
  let artist = raw.snippet?.channelTitle || raw.artist || 'YouTube Music';

  if (rawTitle.includes(' - ')) {
    const parts = rawTitle.split(' - ');
    artist = parts[0].trim();
    title = parts.slice(1).join(' - ').replace(/\(.*?\)|\[.*?\]/g, '').trim();
  } else if (rawTitle.includes('|')) {
    const parts = rawTitle.split('|');
    title = parts[0].replace(/\(.*?\)|\[.*?\]/g, '').trim();
    artist = parts[1]?.trim() || artist;
  }

  const thumbnail =
    raw.snippet?.thumbnails?.high?.url ||
    raw.snippet?.thumbnails?.medium?.url ||
    raw.snippet?.thumbnails?.default?.url ||
    raw.thumbnail ||
    raw.image ||
    verifiedDemoTracks[0].thumbnail;

  return {
    id: `yt-${videoId}`,
    videoId,
    title: title || rawTitle,
    name: title || rawTitle,
    artist,
    thumbnail,
    image: thumbnail,
    duration: raw.duration || 210,
  };
}

/**
 * Search music videos via YouTube Data API v3 by exact song name & artist
 */
export async function searchMusic(query, maxResults = 8) {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return [];
  }

  const cleanQuery = query.trim().replace(/[•·-]/g, ' ');
  const cacheKey = `yt_search_${cleanQuery.toLowerCase()}`;

  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

  // If no API key is provided, filter from verified local music library
  if (!apiKey) {
    const qLower = cleanQuery.toLowerCase();
    const matches = verifiedDemoTracks.filter(
      (t) =>
        t.title.toLowerCase().includes(qLower) ||
        t.artist.toLowerCase().includes(qLower) ||
        t.name.toLowerCase().includes(qLower)
    );
    const results = matches.length > 0 ? matches : verifiedDemoTracks.slice(0, 4);
    searchCache.set(cacheKey, { timestamp: Date.now(), data: results });
    return results;
  }

  try {
    const params = new URLSearchParams({
      part: 'snippet',
      type: 'video',
      videoEmbeddable: 'true',
      maxResults: String(maxResults),
      q: `${cleanQuery} song`,
      key: apiKey,
    });

    const res = await fetch(`${SEARCH_URL}?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`YouTube API HTTP ${res.status}`);
    }

    const data = await res.json();
    if (Array.isArray(data.items) && data.items.length > 0) {
      const tracks = data.items
        .map(normalizeYouTubeTrack)
        .filter((t) => t && t.videoId);

      if (tracks.length > 0) {
        searchCache.set(cacheKey, { timestamp: Date.now(), data: tracks });
        return tracks;
      }
    }

    // Secondary fallback without 'song' suffix
    const params2 = new URLSearchParams({
      part: 'snippet',
      type: 'video',
      videoEmbeddable: 'true',
      maxResults: String(maxResults),
      q: cleanQuery,
      key: apiKey,
    });
    const res2 = await fetch(`${SEARCH_URL}?${params2.toString()}`);
    if (res2.ok) {
      const data2 = await res2.json();
      if (Array.isArray(data2.items) && data2.items.length > 0) {
        const tracks2 = data2.items.map(normalizeYouTubeTrack).filter((t) => t && t.videoId);
        if (tracks2.length > 0) {
          searchCache.set(cacheKey, { timestamp: Date.now(), data: tracks2 });
          return tracks2;
        }
      }
    }

    return verifiedDemoTracks.slice(0, 4);
  } catch (err) {
    console.warn('YouTube Search API error, using curated fallback:', err.message);
    const qLower = cleanQuery.toLowerCase();
    const fallbackMatches = verifiedDemoTracks.filter(
      (t) =>
        t.title.toLowerCase().includes(qLower) ||
        t.artist.toLowerCase().includes(qLower)
    );
    return fallbackMatches.length > 0 ? fallbackMatches : verifiedDemoTracks.slice(0, 4);
  }
}

/**
 * Search and find the exact top YouTube videoId for a given song title and artist
 */
export async function findVideoIdBySongName(songName, artist = '') {
  if (!songName) return 'gRR34kv4N8w';
  const query = `${songName} ${artist}`.trim();
  const results = await searchMusic(query, 1);
  if (results && results.length > 0 && results[0].videoId) {
    return results[0].videoId;
  }
  return 'gRR34kv4N8w';
}

export default {
  searchMusic,
  findVideoIdBySongName,
  normalizeYouTubeTrack,
  verifiedDemoTracks,
};
