import { esc, formatPrice } from '../lib/utils.js';

/**
 * The classic green "-100%" discount box with the struck-out fake price.
 * Every game is always 100% off, because every game is free.
 */
export function priceBlock(game) {
  if (game.comingSoon) {
    return `<div class="price-block coming-soon"><span class="final">Coming Soon</span></div>`;
  }
  return `
    <div class="price-block">
      <span class="pct">-100%</span>
      <span class="prices">
        <span class="original">${formatPrice(game.fakeOriginalPrice)}</span>
        <span class="final">$0.00</span>
      </span>
    </div>`;
}

/** Big green "Download" button (Steam's "Add to Cart"). */
export function downloadButton(game, label = 'Download') {
  if (game.comingSoon || !game.download || !game.download.url) {
    return `<span class="btn-green disabled" title="Not out yet">Coming Soon</span>`;
  }
  const url = game.download.url;
  const isExternal = /^https?:\/\//i.test(url);
  // Local files get the `download` attribute so the browser saves them instead of opening them.
  const attrs = isExternal ? 'target="_blank" rel="noopener"' : 'download';
  return `<a class="btn-green" href="${esc(url)}" ${attrs}>${esc(label)}</a>`;
}
