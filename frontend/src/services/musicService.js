/* ============================================
   Client-Side Music Service
   Curated Catalog & Track Normalization
   ============================================ */

import {
  chartItems,
  trendingSongs,
  justArrivedData,
  gaanaRecommendsData,
  popularInPunjabiData,
  indiePlaylistsData,
  mehfilEGhazalData,
  gaanaPartyCentralData,
  starGalleryData,
  radioStationsData,
  topSearchedArtistsData,
  popularInHindiData,
  moodRadioData,
  featuredArtists,
} from '../data/content';

/**
 * Curated initial demo tracks with Deezer preview URLs for instant playback
 */
export const demoTracks = [
  {
    id: '2556242672',
    title: 'Husn',
    name: 'Husn',
    artist: 'Anuv Jain',
    album: 'Husn',
    artwork: 'https://cdn-images.dzcdn.net/images/cover/bdcf70737dc185ef7ec866fb29591137/500x500-000000-80-0-0.jpg',
    thumbnail: 'https://cdn-images.dzcdn.net/images/cover/bdcf70737dc185ef7ec866fb29591137/500x500-000000-80-0-0.jpg',
    image: 'https://cdn-images.dzcdn.net/images/cover/bdcf70737dc185ef7ec866fb29591137/500x500-000000-80-0-0.jpg',
    previewUrl: 'https://cdnt-preview.dzcdn.net/api/1/1/c/3/c/0/c3cfe9e66020e7fcb1ce641e78a77de7.mp3',
    duration: 217,
    source: 'deezer',
  },
  {
    id: '3413329211',
    title: 'Sapphire (feat. Arijit Singh)',
    name: 'Sapphire (feat. Arijit Singh)',
    artist: 'Ed Sheeran • Arijit Singh',
    album: 'Sapphire',
    artwork: 'https://cdn-images.dzcdn.net/images/cover/32715eb33ab5e20b6c5be10da46a852c/500x500-000000-80-0-0.jpg',
    thumbnail: 'https://cdn-images.dzcdn.net/images/cover/32715eb33ab5e20b6c5be10da46a852c/500x500-000000-80-0-0.jpg',
    image: 'https://cdn-images.dzcdn.net/images/cover/32715eb33ab5e20b6c5be10da46a852c/500x500-000000-80-0-0.jpg',
    previewUrl: 'https://cdnt-preview.dzcdn.net/api/1/1/f/6/9/0/f69372e8cb46c2d5a99e2e08c9fe428b.mp3',
    duration: 180,
    source: 'deezer',
  },
  {
    id: '1824707627',
    title: 'Kesariya',
    name: 'Kesariya',
    artist: 'Pritam • Arijit Singh',
    album: 'Brahmastra',
    artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&w=400&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&w=400&q=80',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&w=400&q=80',
    previewUrl: 'https://cdnt-preview.dzcdn.net/api/1/1/c/3/c/0/c3cfe9e66020e7fcb1ce641e78a77de7.mp3',
    duration: 268,
    source: 'deezer',
  },
  {
    id: '3339628511',
    title: 'Trending Global Hits',
    name: 'Trending Global Hits',
    artist: 'Global Top Artists',
    album: 'Trending Pop Hits 2025',
    artwork: 'https://cdn-images.dzcdn.net/images/cover/ffa26f4b3fcdfcfcbc4ebac33625c673/500x500-000000-80-0-0.jpg',
    thumbnail: 'https://cdn-images.dzcdn.net/images/cover/ffa26f4b3fcdfcfcbc4ebac33625c673/500x500-000000-80-0-0.jpg',
    image: 'https://cdn-images.dzcdn.net/images/cover/ffa26f4b3fcdfcfcbc4ebac33625c673/500x500-000000-80-0-0.jpg',
    previewUrl: 'https://cdnt-preview.dzcdn.net/api/1/1/4/e/1/0/4e1e714bfeb48e256351637e1770067a.mp3',
    duration: 164,
    source: 'deezer',
  },
];

/**
 * Normalizes any raw song or playlist item into standard Track schema:
 * {
 *   id,
 *   title,
 *   name,
 *   artist,
 *   album,
 *   artwork,
 *   thumbnail,
 *   image,
 *   previewUrl,
 *   duration,
 *   genre,
 *   source
 * }
 */
export function normalizeTrack(raw) {
  if (!raw) return null;

  const id =
    raw.id !== undefined && raw.id !== null
      ? String(raw.id)
      : `track-${Math.random().toString(36).slice(2, 9)}`;

  const title = raw.title || raw.name || raw.topSong?.name || 'Untitled Song';
  const name = title;
  const artist =
    raw.artist ||
    raw.topSong?.artist ||
    raw.subtitle ||
    raw.tagline ||
    raw.label ||
    'Gaana Artist';

  const artwork =
    raw.artwork ||
    raw.thumbnail ||
    raw.image ||
    raw.topSong?.image ||
    demoTracks[0].artwork;

  const previewUrl =
    raw.previewUrl ||
    raw.preview ||
    null;

  const duration =
    typeof raw.duration === 'number' && !isNaN(raw.duration)
      ? raw.duration
      : raw.topSong?.duration || 30;

  return {
    id,
    title,
    name,
    artist,
    album: raw.album || null,
    artwork,
    thumbnail: artwork,
    image: artwork,
    previewUrl,
    duration,
    genre: raw.genre || null,
    source: raw.source || 'deezer',
  };
}

/**
 * Build aggregated local fallback searchable catalog from all content datasets
 */
const buildSearchCatalog = () => {
  const catalog = [];
  const seen = new Set();

  const addItems = (items) => {
    if (!Array.isArray(items)) return;
    items.forEach((item) => {
      if (!item) return;
      const normalized = normalizeTrack(item);
      const key = `${normalized.name}-${normalized.artist}`.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        catalog.push(normalized);
      }
    });
  };

  addItems(demoTracks);
  addItems(trendingSongs);
  addItems(chartItems);
  addItems(justArrivedData);
  addItems(gaanaRecommendsData);
  addItems(popularInPunjabiData);
  addItems(indiePlaylistsData);
  addItems(mehfilEGhazalData);
  addItems(gaanaPartyCentralData);
  addItems(starGalleryData);
  addItems(radioStationsData);
  addItems(topSearchedArtistsData);
  addItems(popularInHindiData);
  addItems(featuredArtists);

  Object.values(moodRadioData || {}).forEach((mood) => {
    if (mood?.songs) addItems(mood.songs);
  });

  return catalog;
};

const fullSearchCatalog = buildSearchCatalog();

/**
 * Local fallback search if backend network is unreachable
 */
export function searchLocalMusic(query, maxResults = 12) {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return [];
  }

  const q = query.trim().toLowerCase();

  const results = fullSearchCatalog.filter((track) => {
    if (!track) return false;
    const titleMatch = (track.title || '').toLowerCase().includes(q);
    const nameMatch = (track.name || '').toLowerCase().includes(q);
    const artistMatch = (track.artist || '').toLowerCase().includes(q);
    const albumMatch = (track.album || '').toLowerCase().includes(q);
    const genreMatch = (track.genre || '').toLowerCase().includes(q);
    return titleMatch || nameMatch || artistMatch || albumMatch || genreMatch;
  });

  return results.slice(0, maxResults);
}

export default {
  demoTracks,
  normalizeTrack,
  searchLocalMusic,
};
