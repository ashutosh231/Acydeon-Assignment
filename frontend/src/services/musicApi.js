/* ============================================
   Frontend Music API Service
   Communicates strictly with our Node.js / Express Backend
   Never exposes RapidAPI keys or calls RapidAPI directly
   ============================================ */

const API_BASE_URLS = [
  import.meta.env.VITE_API_URL,
  'https://acydeon-assignment-backend.onrender.com/api/music',
  '/api/music',
  'http://localhost:3000/api/music',
  'http://localhost:5000/api/music',
  'http://localhost:5001/api/music',
].filter(Boolean);

let workingBaseUrl = null;

/**
 * Helper to fetch from backend with automatic base URL resolution and error handling
 */
async function fetchFromBackend(endpoint, params = {}) {
  const urlsToTry = workingBaseUrl
    ? [workingBaseUrl, ...API_BASE_URLS.filter((u) => u !== workingBaseUrl)]
    : API_BASE_URLS;

  const queryString = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null)
  ).toString();

  let lastError = null;

  for (const baseUrl of urlsToTry) {
    try {
      const fullUrl = `${baseUrl}${endpoint}${queryString ? `?${queryString}` : ''}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(fullUrl, {
        headers: {
          Accept: 'application/json',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      // AirTunes or misconfigured local port returns 403 on Mac
      if (response.status === 403) {
        continue;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error (HTTP ${response.status})`);
      }

      const data = await response.json();
      if (data && typeof data === 'object' && data.success) {
        workingBaseUrl = baseUrl;
        return data;
      }
    } catch (err) {
      lastError = err;
    }
  }

  console.warn(`[MusicAPI] Backend request failed for ${endpoint}:`, lastError?.message);
  return { success: false, tracks: [] };
}

/**
 * Search tracks via Express Backend -> Deezer RapidAPI
 */
export async function searchSongs(query, limit = 25) {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return [];
  }

  const res = await fetchFromBackend('/search', { q: query.trim(), limit });
  const rawTracks = Array.isArray(res.tracks) ? res.tracks : [];
  
  // Ensure all track image properties are populated
  return rawTracks.map((t) => {
    const art = t.artwork || t.thumbnail || t.image || t.cover || null;
    return {
      ...t,
      artwork: art,
      thumbnail: art,
      image: art,
    };
  });
}

/**
 * Fetch trending tracks via Express Backend -> Deezer RapidAPI
 */
export async function getTrendingSongs(limit = 25) {
  const res = await fetchFromBackend('/trending', { limit });
  return Array.isArray(res.tracks) ? res.tracks : [];
}

/**
 * Fetch songs by genre or mood via Express Backend -> Deezer RapidAPI
 */
export async function getSongsByGenre(genre, limit = 25) {
  if (!genre) return [];
  const cleanGenre = encodeURIComponent(genre.trim());
  const res = await fetchFromBackend(`/genre/${cleanGenre}`, { limit });
  return Array.isArray(res.tracks) ? res.tracks : [];
}

/**
 * Fetch specific song details by ID via Express Backend -> Deezer RapidAPI
 */
export async function getSongById(id) {
  if (!id) return null;
  const res = await fetchFromBackend(`/${encodeURIComponent(id)}`);
  return res.track || null;
}

export default {
  searchSongs,
  getTrendingSongs,
  getSongsByGenre,
  getSongById,
};
