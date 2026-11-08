import { esc, toast } from '../lib/utils.js';
import { games } from '../data/games.js';

/** The wobbly hand-drawn "Smoke" logo. Deliberately not quite right. */
const LOGO_SVG = `
<svg class="logo-icon" viewBox="0 0 64 48" aria-hidden="true">
  <path d="M14 38 C4 38 3 26 12 24 C10 14 22 9 28 15 C31 6 47 6 48 17 C58 16 62 28 54 33 C57 41 46 44 42 39 C38 45 26 45 24 39 C20 42 15 41 14 38 Z"
        fill="#c7d5e0" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/>
  <circle cx="26" cy="26" r="2.6" fill="#171a21"/>
  <circle cx="38" cy="25" r="2.6" fill="#171a21"/>
  <path d="M27 32 Q32 36 38 31" stroke="#171a21" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>`;

export function renderHeader() {
  return `
  <header class="global-header">
    <div class="global-header-inner">
      <a href="#/" class="logo" title="Smoke&trade; (not a trademark)">
        ${LOGO_SVG}
        <span class="logo-text">SMOKE</span>
        <span class="logo-tm">&reg;?</span>
      </a>
      <nav class="global-nav">
        <a href="#/" class="active">STORE</a>
        <a href="#" data-joke="Your library is the games you downloaded. They are in your Downloads folder.">LIBRARY</a>
        <a href="#" data-joke="The community is you. Hi.">COMMUNITY</a>
        <a href="#/about">ABOUT</a>
        <a href="#" data-joke="Support is available Monday through never.">SUPPORT</a>
      </nav>
      <div class="global-actions">
        <a href="#" class="install-btn" data-joke="There is no Smoke client. Just click Download on a game.">
          <span class="install-icon">&#x2B07;</span> Install Smoke
        </a>
        <a href="#" class="login-link" data-joke="Accounts are a social construct.">login</a>
        <span class="divider">|</span>
        <a href="#" class="login-link" data-joke="Language: English (mostly)">language</a>
      </div>
    </div>
  </header>`;
}

/** The blue store navigation bar with the search box. */
export function renderStoreNav(activeQuery = '') {
  return `
  <div class="store-nav-wrap">
    <div class="store-nav">
      <a href="#/">Your Store</a>
      <a href="#/" data-scroll="tabs">New &amp; Noteworthy</a>
      <a href="#/" data-scroll="categories">Categories</a>
      <a href="#" data-joke="You have 0 Smoke Points. You will always have 0 Smoke Points.">Points Shop <span class="muted">(0 pts)</span></a>
      <a href="#" data-joke="News: still free.">News</a>
      <form class="store-search" id="store-search">
        <input type="text" name="q" placeholder="search the store (all ${games.length} games)" value="${esc(activeQuery)}" autocomplete="off" />
        <button type="submit" aria-label="Search">&#x1F50D;</button>
      </form>
    </div>
  </div>`;
}

export function renderFooter() {
  const year = new Date().getFullYear();
  return `
  <footer class="global-footer">
    <div class="footer-inner">
      <div class="footer-logo">${LOGO_SVG}<span>SMOKE</span></div>
      <p>
        &copy; ${year} Smoke Corporation (not a corporation). All rights reserved, some rights confused.
        All games on this site are free. Nothing is for sale. Your wallet can stay in your pocket.
      </p>
      <p class="footer-disclaimer">
        Smoke is a parody / homage and is not affiliated with, endorsed by, or anything to do with Valve Corporation or Steam&reg;.
        Please don't sue us, we have literally no money - everything is free.
      </p>
      <p class="footer-links">
        <a href="#/about">About Smoke</a> |
        <a href="#" data-joke="We don't collect anything. We can barely collect ourselves.">Privacy Policy</a> |
        <a href="#" data-joke="Legal: be nice.">Legal</a> |
        <a href="#" data-joke="Refunds: you paid $0.00. Here is your $0.00 back.">Refunds</a>
      </p>
    </div>
  </footer>`;
}

/**
 * Wires up the things that live on every page: joke links and the search form.
 * Called once at startup (uses event delegation, so it survives re-renders).
 */
export function bindGlobalEvents() {
  document.addEventListener('click', (e) => {
    const joke = e.target.closest('[data-joke]');
    if (joke) {
      e.preventDefault();
      toast(joke.dataset.joke);
      return;
    }
    const scroller = e.target.closest('[data-scroll]');
    if (scroller) {
      const target = document.getElementById(scroller.dataset.scroll);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  document.addEventListener('submit', (e) => {
    if (e.target.id === 'store-search') {
      e.preventDefault();
      const q = new FormData(e.target).get('q').toString().trim();
      location.hash = q ? `#/search/${encodeURIComponent(q)}` : '#/';
    }
  });
}
