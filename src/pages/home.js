import { games } from '../data/games.js';
import { esc, formatDate, platformIcons, reviewSummary } from '../lib/utils.js';
import { priceBlock } from '../components/price.js';

const gameUrl = (g) => `#/game/${encodeURIComponent(g.id)}`;

/* ------------------------------------------------------------------ */
/* Featured & Recommended carousel                                     */
/* ------------------------------------------------------------------ */

/** Released games ranked by total "helpful" votes on their reviews (our fake sales chart). */
function topSellers() {
  const helpful = (g) => g.reviews.reduce((s, r) => s + r.helpful, 0);
  return games.filter((g) => !g.comingSoon).sort((a, b) => helpful(b) - helpful(a));
}

/* Crude little icons for the carousel's "one interesting fact" line. */
const REASON_ICONS = {
  chart: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 17 L12 9 L17 13 L27 4" stroke="#a4d007" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 4 H27 V10" stroke="#a4d007" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="3" y="22" width="5" height="8" fill="#fff"/><rect x="11" y="18" width="5" height="12" fill="#fff"/><rect x="19" y="14" width="5" height="16" fill="#fff"/></svg>`,
  star: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3 L19.5 12 L29 12.5 L21.5 18.5 L24 28 L16 22.5 L8 28 L10.5 18.5 L3 12.5 L12.5 12 Z" fill="#a4d007" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  calendar: `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="7" width="24" height="21" rx="2" fill="none" stroke="#fff" stroke-width="2.5"/><rect x="4" y="7" width="24" height="6" fill="#a4d007"/><path d="M10 4 V10 M22 4 V10" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg>`,
};

/**
 * The one interesting fact shown under the carousel screenshots, like Steam's
 * "Top Seller - Ranked #27 in your region". A game can set its own with
 * `carouselReason: { headline, detail, icon }` in games.js.
 */
function carouselReason(g) {
  if (g.carouselReason) return { icon: 'star', ...g.carouselReason };
  if (g.comingSoon) {
    return { icon: 'calendar', headline: 'Coming Soon', detail: `Releases ${formatDate(g.releaseDate)} (ish)` };
  }
  const rank = topSellers().indexOf(g) + 1;
  if (rank === 1) {
    return { icon: 'chart', headline: 'Top Seller', detail: 'Ranked #1 in your region (sold 0 copies)' };
  }
  return { icon: 'star', headline: 'Now Available', detail: 'Ranked #' + rank + ' out of ' + topSellers().length + ', which is fine' };
}

function carouselSlide(g, i) {
  const summary = reviewSummary(g);
  const thumbs = g.screenshots.slice(0, 4);
  const reason = carouselReason(g);
  return `
    <a class="carousel-slide ${i === 0 ? 'active' : ''}" href="${gameUrl(g)}" data-index="${i}">
      <div class="carousel-main" style="background-image:url('${esc(g.capsule || g.header)}')"></div>
      <div class="carousel-info">
        <div class="carousel-title" title="${esc(g.title)}">${esc(g.title)}</div>
        <div class="carousel-reviews">
          <span class="review-tone ${summary.tone}">${esc(summary.total ? summary.label : 'No user reviews')}</span>
          ${summary.total ? `<span class="muted">(${summary.total} Review${summary.total === 1 ? '' : 's'})</span>` : ''}
        </div>
        <div class="carousel-thumbs">
          ${thumbs.map((s) => `<div class="carousel-thumb" style="background-image:url('${esc(s)}')"></div>`).join('')}
        </div>
        <div class="carousel-reason">
          <span class="reason-icon">${REASON_ICONS[reason.icon] || REASON_ICONS.star}</span>
          <div>
            <div class="reason-big">${esc(reason.headline)}</div>
            <div class="reason-small">${esc(reason.detail)}</div>
          </div>
        </div>
        <div class="carousel-bottom">${priceBlock(g)}</div>
      </div>
    </a>`;
}

function renderCarousel() {
  const featured = games.filter((g) => g.featured);
  if (!featured.length) return '';
  return `
  <section class="home-section">
    <h2 class="section-title">Featured &amp; Recommended <span class="muted">(by me)</span></h2>
    <div class="carousel" id="carousel">
      <button class="carousel-arrow left" data-dir="-1" aria-label="Previous">&lsaquo;</button>
      <div class="carousel-track">${featured.map(carouselSlide).join('')}</div>
      <button class="carousel-arrow right" data-dir="1" aria-label="Next">&rsaquo;</button>
    </div>
    <div class="carousel-dots">
      ${featured.map((_, i) => `<button class="dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Slide ${i + 1}"></button>`).join('')}
    </div>
  </section>`;
}

function mountCarousel() {
  const root = document.getElementById('carousel');
  if (!root) return () => {};
  const slides = [...root.querySelectorAll('.carousel-slide')];
  const dots = [...document.querySelectorAll('.carousel-dots .dot')];
  let current = 0;

  const show = (i) => {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle('active', n === current));
    dots.forEach((d, n) => d.classList.toggle('active', n === current));
  };

  root.querySelectorAll('.carousel-arrow').forEach((btn) =>
    btn.addEventListener('click', () => {
      show(current + Number(btn.dataset.dir));
      restart();
    })
  );
  dots.forEach((d) =>
    d.addEventListener('click', () => {
      show(Number(d.dataset.index));
      restart();
    })
  );

  // Hovering a thumbnail swaps the big image, like the real thing.
  slides.forEach((slide) => {
    const main = slide.querySelector('.carousel-main');
    const original = main.style.backgroundImage;
    slide.querySelectorAll('.carousel-thumb').forEach((t) => {
      t.addEventListener('mouseenter', () => (main.style.backgroundImage = t.style.backgroundImage));
      t.addEventListener('mouseleave', () => (main.style.backgroundImage = original));
    });
  });

  let timer;
  const restart = () => {
    clearInterval(timer);
    timer = setInterval(() => show(current + 1), 6000);
  };
  restart();
  return () => clearInterval(timer);
}

/* ------------------------------------------------------------------ */
/* Special offers                                                      */
/* ------------------------------------------------------------------ */

function renderSpecialOffers() {
  const offers = games.filter((g) => !g.comingSoon);
  if (!offers.length) return '';
  return `
  <section class="home-section">
    <h2 class="section-title">Special Offers</h2>
    <div class="offers-grid">
      ${offers
        .map(
          (g) => `
        <a class="offer-card" href="${gameUrl(g)}">
          <img src="${esc(g.header)}" alt="${esc(g.title)}" loading="lazy" />
          <div class="offer-body">
            <div class="offer-label">WEEKLONG DEAL</div>
            <div class="offer-ends">Offer ends: the heat death of the universe</div>
            ${priceBlock(g)}
          </div>
        </a>`
        )
        .join('')}
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ */
/* Browse by category (built from everyone's tags)                     */
/* ------------------------------------------------------------------ */

function renderCategories() {
  const counts = {};
  games.forEach((g) => g.tags.forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
  const tags = Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8);
  return `
  <section class="home-section" id="categories">
    <h2 class="section-title">Browse by Category</h2>
    <div class="category-grid">
      ${tags
        .map(
          ([tag, n], i) => `
        <a class="category-tile hue-${i % 8}" href="#/search/${encodeURIComponent(tag)}">
          <span class="category-name">${esc(tag)}</span>
          <span class="category-count">${n} game${n === 1 ? '' : 's'}</span>
        </a>`
        )
        .join('')}
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ */
/* Tabbed lists: New & Trending / Top Sellers / Upcoming               */
/* ------------------------------------------------------------------ */

export function listRow(g) {
  return `
    <a class="list-row" href="${gameUrl(g)}" data-id="${esc(g.id)}">
      <img class="list-cap" src="${esc(g.header)}" alt="" loading="lazy" />
      <div class="list-text">
        <div class="list-title">${esc(g.title)}</div>
        <div class="list-meta"><span class="platforms">${platformIcons(g.platforms)}</span> ${esc(g.tags.slice(0, 3).join(', '))}</div>
      </div>
      ${priceBlock(g)}
    </a>`;
}

function renderPreview(g) {
  const summary = reviewSummary(g);
  return `
    <div class="preview-title">${esc(g.title)}</div>
    <div class="preview-reviews">
      Overall user reviews: <span class="review-tone ${summary.tone}">${esc(summary.label)}</span>
      ${summary.total ? `<span class="muted">(${summary.total})</span>` : ''}
    </div>
    <div class="preview-tags">${g.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
    ${g.screenshots.slice(0, 4).map((s) => `<img class="preview-shot" src="${esc(s)}" alt="" loading="lazy" />`).join('')}`;
}

function renderTabs() {
  const released = games.filter((g) => !g.comingSoon);
  const lists = {
    new: [...released].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate)),
    top: topSellers(),
    upcoming: games.filter((g) => g.comingSoon),
  };
  const empty = '<div class="list-empty">Nothing here yet. The developer is working on it. Probably.</div>';
  const first = lists.new[0] || games[0];

  return `
  <section class="home-section" id="tabs">
    <div class="tabs">
      <button class="tab active" data-tab="new">New &amp; Trending</button>
      <button class="tab" data-tab="top" title="*Nothing is sold. Sorted by how helpful people found the reviews.">Top Sellers*</button>
      <button class="tab" data-tab="upcoming">Upcoming</button>
    </div>
    <div class="tab-body">
      <div class="tab-lists">
        ${Object.entries(lists)
          .map(
            ([key, list]) => `
          <div class="tab-list ${key === 'new' ? 'active' : ''}" data-list="${key}">
            ${list.length ? list.map(listRow).join('') : empty}
          </div>`
          )
          .join('')}
      </div>
      <aside class="tab-preview" id="tab-preview">${first ? renderPreview(first) : ''}</aside>
    </div>
  </section>`;
}

function mountTabs() {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach((tab) =>
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.toggle('active', t === tab));
      document
        .querySelectorAll('.tab-list')
        .forEach((l) => l.classList.toggle('active', l.dataset.list === tab.dataset.tab));
    })
  );

  const preview = document.getElementById('tab-preview');
  document.querySelectorAll('.tab-list .list-row').forEach((row) =>
    row.addEventListener('mouseenter', () => {
      const g = games.find((x) => x.id === row.dataset.id);
      if (g && preview) preview.innerHTML = renderPreview(g);
    })
  );
}

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */

export function homePage() {
  return {
    title: 'Welcome to Smoke',
    html: `
      <div class="page home">
        ${renderCarousel()}
        ${renderSpecialOffers()}
        ${renderCategories()}
        ${renderTabs()}
      </div>`,
    mount() {
      const stopCarousel = mountCarousel();
      mountTabs();
      return stopCarousel;
    },
  };
}

export function searchPage(query) {
  const q = query.toLowerCase();
  const results = games.filter(
    (g) =>
      g.title.toLowerCase().includes(q) ||
      g.tags.some((t) => t.toLowerCase().includes(q)) ||
      g.shortDescription.toLowerCase().includes(q)
  );
  return {
    title: `Search: ${query}`,
    html: `
      <div class="page search">
        <h2 class="section-title">Search results for "${esc(query)}"</h2>
        <div class="search-count">${results.length} result${results.length === 1 ? '' : 's'} match your search.
          ${results.length === 0 ? 'Have you considered making that game yourself?' : ''}</div>
        <div class="search-results">${results.map(listRow).join('')}</div>
      </div>`,
  };
}

export function aboutPage() {
  return {
    title: 'About Smoke',
    html: `
      <div class="page about">
        <h2 class="section-title">About Smoke</h2>
        <div class="about-box">
          <p><strong>Smoke</strong> is the world's leading digital distribution platform for games made by this one developer.</p>
          <p>Every game is free. There is no client to install, no account to make, and no wallet to top up.
             Find a game, press the big green button, and it downloads. That's the whole thing.</p>
          <p>Over <strong>${games.length}</strong> games available. Concurrent users: <strong>probably just you</strong>.</p>
          <p class="muted">Smoke is a parody / homage and is not affiliated with Valve or Steam&reg;.</p>
        </div>
      </div>`,
  };
}

export function notFoundPage() {
  return {
    title: 'Not found',
    html: `
      <div class="page notfound">
        <h2 class="section-title">Oops, sorry!</h2>
        <div class="about-box">
          <p>An error was encountered while processing your request: this page went up in smoke.</p>
          <p><a href="#/">Back to the store</a></p>
        </div>
      </div>`,
  };
}
