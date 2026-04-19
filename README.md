<div align="center">

<img src="logo.png" alt="Elysia" width="120" />

# Elysia Web

**A personal blog & portfolio site built with [Astro](https://astro.build) and the [Mizuki](https://github.com/LyraVoid/Mizuki) theme.**

[![CI](https://github.com/LYQ-Dev/Elysia_Web/actions/workflows/CI.yml/badge.svg)](https://github.com/LYQ-Dev/Elysia_Web/actions/workflows/CI.yml)
[![Deploy](https://github.com/LYQ-Dev/Elysia_Web/actions/workflows/deploy.yml/badge.svg)](https://github.com/LYQ-Dev/Elysia_Web/actions/workflows/deploy.yml)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Astro](https://img.shields.io/badge/Astro-6-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![pnpm](https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm&logoColor=white)](https://pnpm.io)

[🌐 Live Site](https://elysiaweb.vercel.app/) · [🐛 Report Bug](https://github.com/LYQ-Dev/Elysia_Web/issues/new?template=01-bug_report.yml) · [✨ Request Feature](https://github.com/LYQ-Dev/Elysia_Web/issues/new?template=02-feature_request.yml)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
- [Configuration](#️-configuration)
- [Content Management](#-content-management)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 About

Elysia Web is a personal blog and portfolio website. It is built upon the [Mizuki](https://github.com/LyraVoid/Mizuki) theme — a modern, elegant, and feature-rich Astro blog template. The site supports posts, diary entries, anime tracking, a photo album, a projects showcase, and more.

---

## ✨ Features

### 🎨 Design & UX
- **Modern & Elegant UI** — Clean, minimalist interface with beautiful typography
- **Fully Responsive** — Optimized for all screen sizes, from mobile to desktop
- **Dark / Light Mode** — Auto-detection with smooth manual toggling
- **Animated Banner** — Carousel wallpaper with optional wave effect
- **Page Transitions** — Smooth navigation powered by [Swup](https://swup.js.org/)

### 📝 Content
- **Blog Posts** — Categorized posts with tags, reading time, and related articles
- **Diary / Moments** — Social-media-style daily diary entries
- **Anime Tracking** — Track watch progress via Bangumi API, Bilibili API, or local config
- **Friends Links** — Showcase friend websites with card-style layouts
- **Projects Page** — Highlight personal projects
- **Photo Albums** — Lightbox gallery powered by [PhotoSwipe](https://photoswipe.com/)
- **Timeline & Archive** — Chronological view of all content

### 🔍 Search & Discovery
- **Full-text Search** — Fast, offline search powered by [Pagefind](https://pagefind.app/)
- **RSS Feed** — Auto-generated feed for subscribers
- **SEO Optimized** — Sitemap, Open Graph, and meta tag support

### 🛠 Technical
- **Enhanced Code Blocks** — [Expressive Code](https://expressive-code.com/) with syntax highlighting, line numbers, collapsible sections, and custom copy button
- **Math Support** — LaTeX rendering via [KaTeX](https://katex.org/)
- **Mermaid Diagrams** — Render flowcharts and diagrams in Markdown
- **Callouts / Admonitions** — `> [!NOTE]`, `> [!TIP]`, `> [!WARNING]` and more
- **GitHub Repository Cards** — Embed repo info with `::github{repo="user/repo"}`
- **Comment System** — Ready for [Twikoo](https://twikoo.js.org/) integration
- **IndexNow** — Push URL updates to search engines automatically
- **Content Separation** — Optionally sync content from a private repository

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | [Astro 6](https://astro.build) |
| UI Components | [Svelte 5](https://svelte.dev), [React 19](https://react.dev) |
| Styling | [TailwindCSS 4](https://tailwindcss.com) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Package Manager | [pnpm 10](https://pnpm.io) |
| Search | [Pagefind](https://pagefind.app/) |
| Deployment | [Vercel](https://vercel.com) / [GitHub Pages](https://pages.github.com) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v10+ (`npm install -g pnpm`)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/LYQ-Dev/Elysia_Web.git
cd Elysia_Web

# 2. Copy and configure environment variables
cp .env.example .env

# 3. Install dependencies
pnpm install

# 4. Start the development server
pnpm dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

### Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start local dev server at `localhost:4321` |
| `pnpm build` | Build the production site to `./dist/` |
| `pnpm preview` | Preview the production build locally |
| `pnpm check` | Run Astro type checking |
| `pnpm lint` | Lint and auto-fix source files |
| `pnpm format` | Format source files with Prettier |
| `pnpm new-post` | Scaffold a new blog post |
| `pnpm sync-content` | Sync content from an external repository |

---

## ⚙️ Configuration

All site settings are centralized in [`src/config.ts`](src/config.ts).

Key settings to update before deploying:

```ts
export const siteConfig: SiteConfig = {
  title: "Elysia",           // Site name shown in the browser tab
  subtitle: "Elysia",        // Subtitle / tagline
  siteURL: "https://your-domain.com/", // Your deployed URL (must end with /)
  siteStartDate: "2026-04-13",         // Used for the site-uptime counter
  lang: "zh_CN",                       // Site language
};
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the relevant values:

| Variable | Description |
|---|---|
| `ENABLE_CONTENT_SYNC` | Set to `true` to enable content separation mode |
| `CONTENT_REPO_URL` | URL of your external content repository |
| `INDEXNOW_KEY` | API key for IndexNow SEO submission |
| `INDEXNOW_HOST` | Your site's hostname for IndexNow |
| `BILI_SESSDATA` | Bilibili session token for watch-progress tracking |

---

## 📂 Content Management

Content lives in `src/content/` and is organized by type:

```
src/content/
├── posts/        # Blog articles (Markdown / MDX)
├── diary/        # Daily diary entries
├── anime/        # Anime watch records
├── projects/     # Project showcase cards
├── books/        # Book reading records
├── songs/        # Music records
├── sports/       # Exercise / activity logs
├── websites/     # Saved website bookmarks
└── spec/         # Special pages (about, friends)
```

### Creating a New Post

```bash
pnpm new-post
```

Follow the prompts to generate a new post with the correct frontmatter.

### Content Separation (Advanced)

You can keep your private content in a separate repository and sync it at build time. See [docs/CONTENT_SEPARATION.md](docs/CONTENT_SEPARATION.md) for the full guide.

---

## 🚢 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/LYQ-Dev/Elysia_Web)

1. Import the repository on [Vercel](https://vercel.com)
2. Set the **Framework Preset** to `Astro`
3. Add your environment variables in the Vercel dashboard
4. Deploy — Vercel will automatically redeploy on every push to `main`

### GitHub Pages

The repository includes a pre-configured GitHub Actions workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) that builds and deploys to the `pages` branch automatically on every push to `main`.

1. Push the repository to GitHub
2. Go to **Settings → Pages**
3. Set Source to **Deploy from a branch** → `pages` / `root`
4. Wait for the Actions workflow to complete

For Netlify and Cloudflare Pages setup, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

## 📁 Project Structure

```
Elysia_Web/
├── .github/                 # GitHub Actions workflows & templates
├── docs/                    # Project documentation
├── public/                  # Static assets (images, fonts, models)
├── scripts/                 # Build & utility scripts
├── src/
│   ├── components/          # UI components (Astro, Svelte, React)
│   ├── config.ts            # ⭐ Main site configuration
│   ├── content/             # Blog posts, diary, and other content
│   ├── layouts/             # Page layout templates
│   ├── pages/               # File-based routing
│   ├── plugins/             # Custom Remark / Rehype plugins
│   ├── styles/              # Global styles
│   └── types/               # TypeScript type definitions
├── astro.config.mjs         # Astro configuration
├── tailwind.config.cjs      # Tailwind CSS configuration
└── .env.example             # Environment variable template
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes (`git commit -m 'feat: add your feature'`)
4. Push to the branch (`git push origin feat/your-feature`)
5. Open a [Pull Request](.github/pull_request_template.md)

Please use the provided [Issue templates](.github/ISSUE_TEMPLATE/) when reporting bugs or requesting features.

---

## 📄 License

This project is licensed under the **Apache License 2.0** — see the [LICENSE](LICENSE) file for details.

The Mizuki theme is also licensed under the Apache License 2.0. See [LICENSE.MIT](LICENSE.MIT) for additional third-party license information.

---

<div align="center">

Built with ❤️ using [Astro](https://astro.build) and the [Mizuki](https://github.com/LyraVoid/Mizuki) theme.

</div>
