/** Small shared helpers. */

/** Escape text so it is safe to drop into an HTML template string. */
export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** '2026-09-14' -> '14 Sep, 2026' (Steam style) */
export function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return esc(iso);
  const month = d.toLocaleString('en-US', { month: 'short' });
  return `${d.getDate()} ${month}, ${d.getFullYear()}`;
}

export function formatPrice(n) {
  return '$' + Number(n || 0).toFixed(2);
}

/**
 * Works out a Steam-style review label from the review list.
 * Returns { label, tone, positivePct, total } where tone is
 * 'positive' | 'mixed' | 'negative' | 'none'.
 */
export function reviewSummary(game) {
  const reviews = game.reviews || [];
  const total = reviews.length;
  const positive = reviews.filter((r) => r.recommended).length;
  const pct = total ? Math.round((positive / total) * 100) : 0;

  let label;
  let tone;
  if (total === 0) {
    label = 'No user reviews';
    tone = 'none';
  } else if (pct >= 95) {
    label = 'Overwhelmingly Positive';
    tone = 'positive';
  } else if (pct >= 80) {
    label = 'Very Positive';
    tone = 'positive';
  } else if (pct >= 70) {
    label = 'Mostly Positive';
    tone = 'positive';
  } else if (pct >= 40) {
    label = 'Mixed';
    tone = 'mixed';
  } else if (pct >= 20) {
    label = 'Mostly Negative';
    tone = 'negative';
  } else {
    label = 'Overwhelmingly Negative';
    tone = 'negative';
  }

  if (game.reviewSummaryOverride) label = game.reviewSummaryOverride;
  return { label, tone, positivePct: pct, total };
}

/** Little inline platform icons (deliberately crude). */
const PLATFORM_ICONS = {
  windows: '<span class="plat" title="Windows">&#x229E;</span>',
  mac: '<span class="plat" title="macOS">&#x1F34E;</span>',
  linux: '<span class="plat" title="Linux">&#x1F427;</span>',
  browser: '<span class="plat" title="Plays in your browser">&#x1F310;</span>',
};

export function platformIcons(platforms = []) {
  return platforms.map((p) => PLATFORM_ICONS[p] || '').join('');
}

/** Pops up a little joke message at the bottom of the screen. */
export function toast(message) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), 2800);
}
