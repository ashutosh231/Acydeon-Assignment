# Gaana Homepage Redesign — Concept

> **Acdyon Technologies Frontend Challenge — Part 2**  
> An unofficial concept redesign of the Gaana homepage focusing on visual hierarchy, modern discovery, and a clear first-impression user experience.

---

## 📌 Project Overview

The primary objective of this redesign was to address the content-dense, visually crowded nature of Gaana's existing landing page. Instead of overwhelming users with unstructured media rows, this concept establishes a strong **first-3-second impression** with clear visual hierarchy, curated discovery categories, and interactive polish.

- **Value Proposition:** *"Music that Feels Like You"*
- **Primary Action:** *"Try Gaana Plus Free"*
- **Secondary Action:** *"Explore Top Charts"*
- **Design Language:** Modern dark aesthetic with signature Gaana red accents (`#e72c30`), subtle glassmorphism, and responsive grid/carousel layouts.

---

## ✨ Key Features

### 1. High-Impact Hero Section
- **Bold Brand Messaging:** Prominent headline and value proposition optimized for immediate engagement.
- **Dual Call-to-Action:** Direct conversion paths for subscription trial and content exploration.
- **Equalizer Micro-Interaction:** Custom CSS keyframe audio wave animation providing subtle motion without performance overhead.

### 2. Curated Discovery Layout
- **Top Charts & Trending Now:** Quick-access ranking lists with instant track preview playback.
- **Gaana Plus VIP Card:** Prominently positioned membership card highlighting ad-free and HD audio benefits.
- **Moods & Genres + Live Radio:** Color-coded mood cards paired with a dedicated 24/7 Gaana Radio station sidebar.
- **Multi-Variant Music Carousels:** Smooth horizontal scrolling carousels with custom card variants:
  - **Standard Album Cards:** *Just Arrived*, *Gaana Recommends*, *Popular in Punjabi*, *Indie Playlists*, *Mehfil-e-Ghazal*, *Gaana Party Central*, *Popular in Hindi*
  - **Portrait Cards:** *Star Gallery* (featuring Bollywood & regional icons)
  - **Circular Stations:** *Radio Frequencies*
  - **Circular Artist Avatars:** *Top Searched Artists*

### 3. Persistent Audio Player
- Global player state managed via React Context (`PlayerContext`).
- Real-time track progress bar, play/pause toggling, next/previous track controls, and volume adjustment.
- Synchronized with card click interactions across all sections.

### 4. Responsive & Accessible
- Fully responsive across desktop, tablet, and mobile breakpoints.
- Zero horizontal overflow.
- Clean semantic HTML structure and accessible button/link elements.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) |
| **Build Tool** | [Vite 8](https://vitejs.dev/) |
| **Styling** | Vanilla CSS (Custom Design Tokens, Flexbox, CSS Grid, Keyframe Animations) |
| **State Management** | React Context API (`PlayerContext`) |
| **Icons & Media** | SVG Icons & Real Artist/Album Photography |

---

## 📁 Repository Structure

```
Acydeon-Assignment/
├── DECISIONS.md              # Rationale, trade-offs, and verified AI usage documentation
├── README.md                 # Project documentation and setup guide
└── frontend/
    ├── public/               # Static public assets
    ├── src/
    │   ├── assets/           # Local graphics, logos, and icons
    │   ├── components/       # Modular UI components
    │   │   ├── Common/       # Reusable MusicCarousel & UI primitives
    │   │   ├── Footer/       # Page footer with navigation links
    │   │   ├── GaanaPlus/    # Gaana Plus subscription card
    │   │   ├── GaanaRadio/   # Live radio station widget
    │   │   ├── Hero/         # Hero banner & animated equalizer
    │   │   ├── MoodsGenres/  # Moods & genre category explorer
    │   │   ├── Navbar/       # Global navigation bar & search trigger
    │   │   ├── NowPlaying/   # Sticky bottom audio player bar
    │   │   ├── TopCharts/    # Top charts list
    │   │   └── TrendingNow/  # Trending tracks list
    │   ├── context/          # PlayerContext & audio playback state
    │   ├── data/             # Curated metadata & playlist content
    │   ├── styles/           # Component-level stylesheet modules
    │   ├── App.jsx           # Main application layout assembly
    │   ├── index.css         # Global design tokens, reset & base styles
    │   └── main.jsx          # React DOM entry point
    ├── index.html            # HTML template with Google Fonts
    ├── package.json          # Project dependencies and npm scripts
    └── vite.config.js        # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### Installation & Local Development

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to the local URL shown in your terminal (typically `http://localhost:5173`).

---

## 📦 Production Build

To create an optimized production build:

```bash
cd frontend
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 📄 Design Decisions & AI Verification

For detailed insights into:
1. **Why this approach was chosen** over building a fictional product or cloning the original layout,
2. **Key trade-offs** made under the challenge time constraint, and
3. **AI usage breakdown** and personal verification steps,

Please refer to [DECISIONS.md](DECISIONS.md).
