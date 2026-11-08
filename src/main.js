import { renderHeader, renderStoreNav, renderFooter, bindGlobalEvents } from './components/layout.js';
import { homePage, searchPage, aboutPage, notFoundPage } from './pages/home.js';
import { gamePage } from './pages/game.js';

/*
 * Tiny hash router. URLs look like:
 *   #/                 frontpage
 *   #/game/<id>        a game's page
 *   #/search/<query>   search results (also used for tag/category links)
 *   #/about            about page
 * Hash URLs work on any static host (GitHub Pages, Netlify, itch.io...) with no server config.
 */

let cleanup = null;

function safeDecode(s) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

function resolve() {
  const parts = location.hash.replace(/^#\/?/, '').split('/').map(safeDecode);
  const [route, arg] = parts;
  if (!route) return { page: homePage() };
  if (route === 'game' && arg) return { page: gamePage(arg) || notFoundPage() };
  if (route === 'search') return { page: arg ? searchPage(arg) : homePage(), query: arg || '' };
  if (route === 'about') return { page: aboutPage() };
  return { page: notFoundPage() };
}

function render() {
  if (typeof cleanup === 'function') cleanup();
  cleanup = null;

  const { page, query = '' } = resolve();
  document.title = `${page.title} :: Smoke`;
  document.getElementById('app').innerHTML = `
    ${renderHeader()}
    <main class="store">
      ${renderStoreNav(query)}
      ${page.html}
    </main>
    ${renderFooter()}`;
  window.scrollTo(0, 0);
  if (page.mount) cleanup = page.mount();
}

bindGlobalEvents();
window.addEventListener('hashchange', render);
render();
