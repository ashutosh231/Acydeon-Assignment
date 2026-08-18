import './Footer.css';

function Footer() {
  const directorySectionsRow1 = [
    {
      title: 'Albums',
      icon: 'lucide:music-2',
      links: ['English', 'Hindi', 'Telugu', 'Punjabi', 'Tamil'],
    },
    {
      title: 'Genres',
      icon: 'lucide:music-2',
      links: ['Bollywood Songs', 'Devotional Songs', 'Ghazals', 'Bhajan', 'Patriotic Songs'],
    },
    {
      title: 'Artists',
      icon: 'lucide:music-2',
      links: ['Arijit Singh', 'Honey Singh', 'Atif Aslam', 'A R Rahman', 'Lata Mangeshkar'],
    },
    {
      title: 'New Release',
      icon: 'lucide:music-2',
      links: ['New English Songs', 'New Hindi Songs', 'New Punjabi Songs', 'New Tamil Songs', 'New Telugu Songs'],
    },
    {
      title: 'Trending Songs',
      icon: 'lucide:music-2',
      links: [
        'Choli Ke Peeche',
        'Kasturi (From "Amar Prem Ki Prem Kahani")',
        'Chal Kudiye (From "Jigra")',
        'Hum Aapke Bina (From "Sikandar")',
        'Sajni',
      ],
    },
    {
      title: 'Trending Albums',
      icon: 'lucide:music-2',
      links: ['Laapataa Ladies', 'GLORY', 'Dunki', 'Dhamaka', 'Fighter'],
    },
  ];

  const directorySectionsRow2 = [
    {
      title: 'Old Songs',
      icon: 'lucide:music-2',
      links: ['Old Hindi Songs', 'Old English Songs', 'Old Punjabi Songs', 'Old Telugu Songs', 'Old Tamil Songs'],
    },
    {
      title: 'Podcasts',
      icon: 'lucide:mic',
      links: ['Sunday Suspense', 'Story Podcasts', 'Motivation Podcasts', "Riya's Retro", 'MD Motivation'],
    },
    {
      title: 'Gaana Hits',
      icon: 'lucide:heart',
      links: [
        'Bollywood Wedding Songs',
        'Valentine Day Songs',
        'Bollywood Mashups Songs',
        'Best of KK Songs',
        'Happy Birthday Songs',
      ],
    },
    {
      title: 'Latest Songs',
      icon: 'lucide:plus-circle',
      links: [
        'So Lene De (From "Ground Zero")',
        'Chor Bazari Phir Se (From "Bhool Chuk Maar")',
        'O Shera - Teer Te Taj',
        'Tumhe Dilliagi (From "Raid 2")',
        'Jaadu (From "Jewel Thief: The Heist Begins")',
      ],
    },
    {
      title: 'Devotional Songs',
      icon: 'lucide:sparkles',
      links: ['Hanuman Chalisa', 'Maa Ka Bulawa Aaya Hai', 'Maa Durga Songs', 'Bhajan Gold Songs', 'Ganpati Songs'],
    },
    {
      title: 'Moods & Radio',
      icon: 'lucide:radio',
      links: ['Romantic', 'Chill', 'Workout', 'Party', 'Sad'],
    },
  ];

  const quickLinks = [
    { label: 'About Us', icon: 'lucide:shield-check', href: '#' },
    { label: 'Terms & Conditions', icon: 'lucide:file-text', href: '#' },
    { label: 'Privacy Policy', icon: 'lucide:lock', href: '#' },
    { label: 'FAQ', icon: 'lucide:help-circle', href: '#' },
    { label: 'Contact Us', icon: 'lucide:headphones', href: '#' },
  ];

  return (
    <footer className="footer-master">
      <div className="footer-container">
        {/* =========================================================
            TOP ROW: Brand Story, Social Media, App Store Downloads
            ========================================================= */}
        <div className="footer-top-grid">
          {/* Col 1: Brand & Tagline */}
          <div className="footer-brand-section">
            <a href="#hero" className="footer-brand-logo font-display">
              gaana
            </a>
            <h3 className="footer-brand-tagline">Bas Bajna Chahiye Gaana</h3>
            <p className="footer-brand-desc">
              Turn up your vibe with the latest hits and top trending songs. From timeless classics to new favorites,
              everything you love is here.
            </p>
            <p className="footer-brand-subdesc">
              Stream anytime, anywhere, or download for offline listening. Gaana, your music. Your way.
            </p>
          </div>

          {/* Col 2: Stay Connected & Socials */}
          <div className="footer-social-section">
            <h4 className="footer-section-badge">STAY CONNECTED</h4>
            <div className="footer-social-row">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Facebook">
                <iconify-icon icon="ri:facebook-fill"></iconify-icon>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Instagram">
                <iconify-icon icon="ri:instagram-line"></iconify-icon>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="YouTube">
                <iconify-icon icon="ri:youtube-fill"></iconify-icon>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="X (Twitter)">
                <iconify-icon icon="ri:twitter-x-fill"></iconify-icon>
              </a>
              <a href="https://reddit.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Reddit">
                <iconify-icon icon="ri:reddit-fill"></iconify-icon>
              </a>
            </div>
            <p className="footer-social-text">Music updates, playlists, contests & more.</p>
            <a href="#" className="footer-social-link">
              Follow us on social media!
            </a>
          </div>

          {/* Col 3: App Store Badges */}
          <div className="footer-app-section">
            <h4 className="footer-section-badge">GET THE GAANA EXPERIENCE</h4>
            <p className="footer-app-desc">Download the app and enjoy uninterrupted music.</p>
            <div className="footer-badges-row">
              {/* Google Play Store Badge */}
              <a href="#" className="store-badge-btn" aria-label="Download on Google Play">
                <iconify-icon icon="logos:google-play-icon" style={{ fontSize: '20px' }}></iconify-icon>
                <div className="store-badge-text">
                  <span className="store-badge-sub">GET IT ON</span>
                  <span className="store-badge-main">Google Play</span>
                </div>
              </a>

              {/* Apple App Store Badge */}
              <a href="#" className="store-badge-btn" aria-label="Download on the App Store">
                <iconify-icon icon="ri:apple-fill" style={{ fontSize: '22px', color: '#ffffff' }}></iconify-icon>
                <div className="store-badge-text">
                  <span className="store-badge-sub">Download on the</span>
                  <span className="store-badge-main">App Store</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* =========================================================
            MIDDLE ROW: Quick Utility Bar with Separators
            ========================================================= */}
        <div className="footer-quick-bar">
          {quickLinks.map((link, idx) => (
            <div key={link.label} className="quick-bar-item-wrap">
              <a href={link.href} className="quick-bar-link">
                <iconify-icon icon={link.icon} style={{ fontSize: '15px', color: 'var(--gaana-red)' }}></iconify-icon>
                <span>{link.label}</span>
              </a>
              {idx < quickLinks.length - 1 && <span className="quick-bar-separator" />}
            </div>
          ))}
        </div>

        {/* =========================================================
            MUSIC DIRECTORY: 2 Rows x 6 Columns
            ========================================================= */}
        <div className="footer-directory-container">
          {/* Row 1 */}
          <div className="footer-directory-grid">
            {directorySectionsRow1.map((section) => (
              <div key={section.title} className="directory-column">
                <h4 className="directory-title">
                  <iconify-icon icon={section.icon} className="directory-title-icon"></iconify-icon>
                  <span>{section.title}</span>
                </h4>
                <ul className="directory-list">
                  {section.links.map((linkText) => (
                    <li key={linkText}>
                      <a href="#" className="directory-link">
                        {linkText}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href="#" className="directory-view-all">
                      View all
                    </a>
                  </li>
                </ul>
              </div>
            ))}
          </div>

          {/* Row 2 */}
          <div className="footer-directory-grid" style={{ marginTop: '28px' }}>
            {directorySectionsRow2.map((section) => (
              <div key={section.title} className="directory-column">
                <h4 className="directory-title">
                  <iconify-icon icon={section.icon} className="directory-title-icon"></iconify-icon>
                  <span>{section.title}</span>
                </h4>
                <ul className="directory-list">
                  {section.links.map((linkText) => (
                    <li key={linkText}>
                      <a href="#" className="directory-link">
                        {linkText}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href="#" className="directory-view-all">
                      View all
                    </a>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================
            BOTTOM ROW: Copyright, Made in India, Brand Statement
            ========================================================= */}
        <div className="footer-copyright-bar">
          <div className="footer-copyright-left">
            <span className="footer-mini-logo font-display">gaana</span>
            <span className="footer-copy-text">
              © Entertainment Network India Ltd. 2026. All Rights Reserved.
            </span>
          </div>

          <div className="footer-copyright-center">
            <span>Made with</span>
            <span className="footer-heart-icon">❤️</span>
            <span>in India</span>
          </div>

          <div className="footer-copyright-right">
            <span>Your music. Your mood. Only on Gaana.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
