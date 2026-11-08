# Smoke

A parody/homage of a certain game store, used to host free indie game downloads.
Nothing is for sale. Every "price" is a joke, and every "Buy" button is a **Download** button.

## Running it

Requires [Node.js](https://nodejs.org) (LTS version).

```bash
npm install      # first time only
npm run dev      # local dev server with live reload (http://localhost:5173)
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## Adding a game

1. Make a folder `public/games/<your-game-id>/` and put your images in it:
   - `header.png`: 460 × 215 (lists, game page sidebar)
   - `capsule.png`: 616 × 353 (frontpage carousel, optional)
   - `screenshot-1.png`, `screenshot-2.png`, … at 1280 × 720
2. Put the build somewhere downloadable:
   - **Small files:** drop a `.zip` in `public/downloads/` and use `downloads/my-game.zip` as the url.
   - **Large files:** host them on itch.io, GitHub Releases, Google Drive, etc. and paste the full `https://…` link.
3. Copy an existing entry in [`src/data/games.js`](src/data/games.js) and edit it. The comment at the top of that file documents every field.

The game then shows up on the frontpage carousel (if `featured: true`), in Special Offers, in the category tiles, in the tabs and in search, and it gets its own page at `#/game/<your-game-id>`.

## Project layout

```
index.html               page shell
public/                  static files copied as-is (game art, downloads, favicon)
src/data/games.js        <- THE file you edit to add games
src/main.js              hash router (#/, #/game/id, #/search/q, #/about)
src/pages/home.js        frontpage, search, about, 404
src/pages/game.js        individual game page (screenshots, download box, reviews)
src/components/          header/footer/search bar, price + download button
src/lib/utils.js         helpers (review score labels, dates, toast popups)
src/styles/main.css      all styling
```

## Deploying

`npm run build` produces a fully static `dist/` folder. It works on GitHub Pages, Netlify, Cloudflare Pages or any web host. The site uses `#/` URLs and relative asset paths, so it needs no server configuration.

## Disclaimer

Smoke is a parody and is not affiliated with Valve Corporation or Steam.
