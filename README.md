# BIGGEST EMPIRE — Static eFootball Website

A complete static website designed to deploy directly to GitHub + Render.

## Included features

- Responsive mobile/desktop layout
- eFootball-inspired stadium/pitch background generated entirely with CSS
- Sticky navigation and mobile menu
- Dark/light visual mode
- Update cards with:
  - category filters
  - search
  - save/bookmark
  - reactions
  - detail modal
  - share/copy support
- Match Center with sample fixtures
- Browser notification reminder for the featured fixture
- Interactive formation/tactical board
- Gallery vault with lightbox modal
- WhatsApp community buttons using **+233 050 227 7502**
- Contact form that opens a WhatsApp message
- Local browser persistence using `localStorage`
- Visitor counter animation (visual/demo counter, not an analytics service)
- Accessible labels and reduced-motion support
- No Node.js, Docker, build command or backend required

## Deploy on Render

Create a **Static Site** connected to this GitHub repository.

Recommended settings:

- Build Command: leave empty
- Publish Directory: `.`
- Branch: `main`

The repository is intentionally static, so Render does not need a Dockerfile.

## GitHub

Upload the contents of this folder to the root of your repository:

- `index.html`
- `styles.css`
- `app.js`
- `assets/favicon.svg`
- `robots.txt`
- `README.md`

## Customize

Open `app.js` and edit:

- `CONFIG.whatsapp`
- `CONFIG.whatsappDisplay`
- `CONFIG.contactEmail`
- `state.posts`
- `state.matches`
- `state.gallery`

Replace the CSS-generated gallery/update visuals with real images later if desired.

### Important

The match center and visitor counter use local/static sample data. They are not claiming to be a live eFootball API feed. To make them truly live, connect a real data source/API and update the code accordingly.

The login section should point users to the official KONAMI service. Never collect KONAMI passwords on this website.

## Contact

Current WhatsApp contact configured in the site:

**+233 050 227 7502**
