import { PlayerProvider } from './context/PlayerContext';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import TopCharts from './components/TopCharts/TopCharts';
import TrendingNow from './components/TrendingNow/TrendingNow';
import GaanaPlus from './components/GaanaPlus/GaanaPlus';
import MoodsGenres from './components/MoodsGenres/MoodsGenres';
import GaanaRadio from './components/GaanaRadio/GaanaRadio';
import MusicCarousel from './components/Common/MusicCarousel';
import Footer from './components/Footer/Footer';
import NowPlaying from './components/NowPlaying/NowPlaying';

import {
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
} from './data/content';

function App() {
  return (
    <PlayerProvider>
      <div className="min-h-screen app-container">
        {/* Existing Navbar */}
        <Navbar />

        <main className="page-content">
          {/* Existing Hero */}
          <Hero />

          {/* Existing Top Section: Top Charts + Trending Now on left, Gaana Plus on right */}
          <div className="top-layout-row section-block">
            <div className="top-layout-main">
              <TopCharts />
              <TrendingNow />
            </div>
            <div className="top-layout-side">
              <GaanaPlus />
            </div>
          </div>

          {/* Existing Middle Section: Moods & Genres on left, Gaana Radio Card on right */}
          <div id="moods" className="moods-radio-layout section-block">
            <div className="moods-main-col">
              <MoodsGenres />
            </div>
            <div className="radio-sidebar-col">
              <GaanaRadio />
            </div>
          </div>

          {/* 1. JUST ARRIVED */}
          <MusicCarousel
            id="just-arrived"
            title="Just Arrived"
            subtitle="Latest drops, trending tracks & fresh albums"
            items={justArrivedData}
            variant="standard"
          />

          {/* 2. GAANA RECOMMENDS */}
          <MusicCarousel
            id="gaana-recommends"
            title="Gaana Recommends"
            subtitle="Personalized mixes based on your taste & moods"
            items={gaanaRecommendsData}
            variant="standard"
          />

          {/* 3. POPULAR IN PUNJABI */}
          <MusicCarousel
            id="popular-punjabi"
            title="Popular in Punjabi"
            subtitle="Chart-topping Punjabi beats, hip-hop & anthems"
            items={popularInPunjabiData}
            variant="standard"
          />

          {/* 4. INDIE PLAYLISTS */}
          <MusicCarousel
            id="indie-playlists"
            title="Indie Playlists"
            subtitle="Acoustic stories, indie pop & homegrown talent"
            items={indiePlaylistsData}
            variant="standard"
          />

          {/* 5. MEHFIL-E-GHAZAL */}
          <MusicCarousel
            id="mehfil-e-ghazal"
            title="Mehfil-e-Ghazal"
            subtitle="Timeless classical poetry, velvet vocals & nostalgic sur"
            items={mehfilEGhazalData}
            variant="standard"
          />

          {/* 6. GAANA PARTY CENTRAL */}
          <MusicCarousel
            id="party-central"
            title="Gaana Party Central"
            subtitle="High-octane club bangers, EDM drops & remix hits"
            items={gaanaPartyCentralData}
            variant="standard"
          />

          {/* 7. STAR GALLERY */}
          <MusicCarousel
            id="star-gallery"
            title="Star Gallery"
            subtitle="Iconic Bollywood & regional superstars in the spotlight"
            items={starGalleryData}
            variant="artist-portrait"
          />

          {/* 8. RADIO */}
          <MusicCarousel
            id="radio-stations"
            title="Radio"
            subtitle="24/7 curated non-stop music streams & frequencies"
            items={radioStationsData}
            variant="circular-radio"
          />

          {/* 9. TOP SEARCHED ARTISTS */}
          <MusicCarousel
            id="top-searched-artists"
            title="Top Searched Artists"
            subtitle="Most streamed singers, musicians & composers this week"
            items={topSearchedArtistsData}
            variant="circular-artist"
          />

          {/* 10. POPULAR IN HINDI */}
          <MusicCarousel
            id="popular-hindi"
            title="Popular in Hindi"
            subtitle="Biggest Bollywood soundtrack hits & trending hindi melodies"
            items={popularInHindiData}
            variant="standard"
          />
        </main>

        {/* Existing Footer */}
        <Footer />

        {/* Existing Sticky Now Playing Music Player */}
        <NowPlaying />
      </div>
    </PlayerProvider>
  );
}

export default App;
