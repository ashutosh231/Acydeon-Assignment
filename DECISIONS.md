# DECISIONS

## 1. Why this approach?

Rather than building a fictional concept from scratch or cloning the existing Gaana homepage pixel-for-pixel, I chose a focused concept redesign of Gaana's homepage experience. A real product provided authentic constraints and an established identity, while allowing me to directly tackle a UX challenge I identified in Gaana's existing homepage: its dense, content-heavy presentation. Instead of replicating endless rows of media, the redesign establishes a clearer visual hierarchy and a strong first-3-second impression with a distinct value proposition ("Music that Feels Like You"), prominent primary and secondary calls to action ("Try Gaana Plus Free" and "Explore Top Charts"), and curated discovery sections such as Top Charts, Trending Now, Moods & Genres, and regional collections. This preserves recognizable brand context while delivering a more modern, scannable, and engaging music discovery experience.

## 2. Trade-off

Under the assignment's time constraint, I prioritized visual polish, responsive layout design across desktop and mobile, content hierarchy, card hover states, and a subtle hero equalizer micro-interaction over functional backend complexity. The application is built as a high-fidelity static frontend rather than implementing real audio streaming infrastructure, user authentication, subscription billing, or live recommendation engines. With a full production week, the next steps would be integrating dynamic API data and streaming endpoints, conducting comprehensive accessibility audits, expanding interactive player states, optimizing asset loading and responsive images, conducting cross-browser QA, and validating the layout through usability testing and analytics.

## 3. AI usage

AI tools were utilized during development for initial design ideation, visual layout exploration, component scaffolding, and exploring visual directions. However, the final submission was personally reviewed, refined, and engineered. I personally structured and verified the layout hierarchy, tuned spacing, typography, and contrast, ensured robust mobile-to-desktop responsiveness without horizontal overflow, positioned CTAs for clarity, implemented the equalizer micro-animation, and removed unnecessary boilerplate and non-essential features to keep the codebase focused on the challenge requirements.