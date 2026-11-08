import { getGame } from '../data/games.js';
import { esc, formatDate, platformIcons, reviewSummary, toast } from '../lib/utils.js';
import { priceBlock, downloadButton } from '../components/price.js';

const AVATAR_COLORS = ['#4c6b22', '#2a475e', '#7a3b69', '#8f5b16', '#2f6f6f', '#5c2a2a', '#3d3d8f'];

function avatarFor(name) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  const color = AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  return `<div class="avatar" style="background:${color}">${esc(name[0] || '?').toUpperCase()}</div>`;
}

/* ---------------- Media viewer (big screenshot + strip) ---------------- */

function renderMedia(g) {
  const shots = g.screenshots;
  if (!shots.length) return '<div class="media-main empty">No screenshots. Use your imagination.</div>';
  return `
    <div class="media">
      <div class="media-main" id="media-main">
        <img src="${esc(shots[0])}" alt="${esc(g.title)} screenshot" id="media-img" />
      </div>
      <div class="media-strip">
        ${shots
          .map(
            (s, i) =>
              `<button class="media-thumb ${i === 0 ? 'active' : ''}" data-src="${esc(s)}"><img src="${esc(s)}" alt="" loading="lazy" /></button>`
          )
          .join('')}
      </div>
    </div>`;
}

/* ---------------- Reviews ---------------- */

function renderReview(r, i) {
  const thumb = r.recommended ? '&#x1F44D;' : '&#x1F44E;';
  return `
    <div class="review">
      <div class="review-author">
        ${avatarFor(r.author)}
        <div>
          <div class="review-name">${esc(r.author)}</div>
          <div class="muted small">${Math.floor(r.hours * 3) + 1} products in account</div>
        </div>
      </div>
      <div class="review-body">
        <div class="review-verdict ${r.recommended ? 'yes' : 'no'}">
          <span class="review-thumb">${thumb}</span>
          <div>
            <div class="verdict-text">${r.recommended ? 'Recommended' : 'Not Recommended'}</div>
            <div class="muted small">${Number(r.hours).toFixed(1)} hrs on record</div>
          </div>
        </div>
        <div class="muted small review-date">Posted: ${formatDate(r.date)}</div>
        <div class="review-text">${esc(r.text)}</div>
        <div class="review-helpful">
          <div class="muted small">Was this review helpful?</div>
          <button class="vote" data-review="${i}" data-kind="yes">&#x1F44D; Yes</button>
          <button class="vote" data-review="${i}" data-kind="no">&#x1F44E; No</button>
          <button class="vote" data-review="${i}" data-kind="funny">&#x1F602; Funny</button>
          <div class="muted small helpful-count" id="helpful-${i}">
            ${r.helpful} people found this review helpful &middot; ${r.funny} people found this review funny
          </div>
        </div>
      </div>
    </div>`;
}

function renderReviews(g) {
  const s = reviewSummary(g);
  return `
    <section class="game-section" id="reviews">
      <h2 class="game-section-title">Customer Reviews for ${esc(g.title)}</h2>
      <div class="review-summary-bar">
        <div>
          <div class="muted small">Overall Reviews:</div>
          <span class="review-tone ${s.tone} big">${esc(s.label)}</span>
          ${s.total ? `<span class="muted">(${s.total} reviews)</span>` : ''}
        </div>
        ${s.total ? `<div class="muted small">${s.positivePct}% of the ${s.total} user reviews for this game are positive. All reviewers are real and definitely not made up.</div>` : ''}
      </div>
      ${g.reviews.length ? g.reviews.map(renderReview).join('') : '<div class="list-empty">There are no reviews for this product yet. You could be the first! (You can\'t, there is no review button.)</div>'}
    </section>`;
}

/* ---------------- Page ---------------- */

export function gamePage(id) {
  const g = getGame(id);
  if (!g) return null;
  const s = reviewSummary(g);
  const req = g.systemRequirements || {};

  const html = `
  <div class="page game">
    <div class="breadcrumbs">
      <a href="#/">All Games</a> &gt; <a href="#/search/${encodeURIComponent(g.tags[0] || '')}">${esc(g.tags[0] || 'Games')}</a> &gt; ${esc(g.title)}
    </div>
    <div class="game-title-row">
      <h1 class="game-title">${esc(g.title)}</h1>
      <a href="#" class="community-hub" data-joke="The Community Hub is closed. It was never open.">Community Hub</a>
    </div>

    <div class="glance">
      ${renderMedia(g)}
      <div class="glance-side">
        <img class="glance-header" src="${esc(g.header)}" alt="${esc(g.title)}" />
        <p class="glance-desc">${esc(g.shortDescription)}</p>
        <table class="glance-table">
          <tr><td>All Reviews:</td><td><a href="#" data-scroll="reviews" class="review-tone ${s.tone}">${esc(s.label)}</a> ${s.total ? `<span class="muted">(${s.total})</span>` : ''}</td></tr>
          <tr><td>Release Date:</td><td>${g.comingSoon ? 'Coming ' + formatDate(g.releaseDate) + ' (ish)' : formatDate(g.releaseDate)}</td></tr>
          <tr><td>Developer:</td><td class="blue">${esc(g.developer)}</td></tr>
          <tr><td>Publisher:</td><td class="blue">${esc(g.publisher)}</td></tr>
        </table>
        <div class="muted small">Popular user-defined tags for this product:</div>
        <div class="glance-tags">${g.tags.map((t) => `<a class="tag" href="#/search/${encodeURIComponent(t)}">${esc(t)}</a>`).join('')}</div>
      </div>
    </div>

    <div class="action-bar">
      <button class="action-btn" id="wishlist-btn">Add to your wishlist</button>
      <button class="action-btn" data-joke="You are now following this game. It will not do anything.">Follow</button>
      <button class="action-btn" data-joke="Ignored. (Not really. We can't do that.)">Ignore</button>
      <span class="action-spacer"></span>
      <button class="action-btn" data-joke="Shared with no one. There is no friends list.">Share</button>
    </div>

    <div class="game-columns">
      <div class="game-left">
        <div class="purchase-box">
          <div class="purchase-title">${g.comingSoon ? 'Coming Soon:' : 'Download'} ${esc(g.title)}</div>
          <div class="purchase-sub">
            <span class="platforms">${platformIcons(g.platforms)}</span>
            ${g.download ? `<span class="muted small">v${esc(g.download.version)} &middot; ${esc(g.download.size)}</span>` : ''}
          </div>
          <div class="purchase-action">
            ${priceBlock(g)}
            ${downloadButton(g)}
          </div>
        </div>

        <section class="game-section">
          <h2 class="game-section-title">About This Game</h2>
          ${g.description.map((p) => `<p>${esc(p)}</p>`).join('')}
        </section>

        <section class="game-section">
          <h2 class="game-section-title">System Requirements</h2>
          <div class="sysreq">
            <div class="sysreq-head">MINIMUM:</div>
            <ul>
              ${req.os ? `<li><strong>OS:</strong> ${esc(req.os)}</li>` : ''}
              ${req.processor ? `<li><strong>Processor:</strong> ${esc(req.processor)}</li>` : ''}
              ${req.memory ? `<li><strong>Memory:</strong> ${esc(req.memory)}</li>` : ''}
              ${req.graphics ? `<li><strong>Graphics:</strong> ${esc(req.graphics)}</li>` : ''}
              ${req.storage ? `<li><strong>Storage:</strong> ${esc(req.storage)}</li>` : ''}
              ${req.notes ? `<li><strong>Additional Notes:</strong> ${esc(req.notes)}</li>` : ''}
            </ul>
          </div>
        </section>

        ${renderReviews(g)}
      </div>

      <aside class="game-right">
        <div class="side-box relevance">
          <div class="side-title">Is this game relevant to you?</div>
          <p>Sign in to see reasons why you may or may not like this based on your games, friends, and curators you follow.</p>
          <p class="muted small">Just kidding. You can't sign in. It's relevant. Trust us.</p>
        </div>
        <div class="side-box">
          <div class="side-row"><span class="muted">Title:</span> ${esc(g.title)}</div>
          <div class="side-row"><span class="muted">Genre:</span> ${esc(g.tags.slice(0, 2).join(', '))}</div>
          <div class="side-row"><span class="muted">Developer:</span> ${esc(g.developer)}</div>
          <div class="side-row"><span class="muted">Release Date:</span> ${formatDate(g.releaseDate)}</div>
          <div class="side-row"><span class="muted">Price:</span> free. it's free. they're all free.</div>
        </div>
        <div class="side-box">
          <div class="side-title">Smoke Achievements</div>
          <p class="muted small">There are 0 achievements available. Downloading this game counts as one, emotionally.</p>
        </div>
      </aside>
    </div>
  </div>`;

  return {
    title: g.title,
    html,
    mount() {
      // Screenshot strip
      const img = document.getElementById('media-img');
      document.querySelectorAll('.media-thumb').forEach((btn) =>
        btn.addEventListener('click', () => {
          img.src = btn.dataset.src;
          document.querySelectorAll('.media-thumb').forEach((b) => b.classList.toggle('active', b === btn));
        })
      );

      // Clicking the big screenshot opens a simple lightbox
      const main = document.getElementById('media-main');
      main?.addEventListener('click', () => {
        const box = document.createElement('div');
        box.className = 'lightbox';
        box.innerHTML = `<img src="${img.src}" alt="" />`;
        box.addEventListener('click', () => box.remove());
        document.body.appendChild(box);
      });

      // Wishlist joke
      const wish = document.getElementById('wishlist-btn');
      wish?.addEventListener('click', () => {
        wish.classList.toggle('on');
        wish.textContent = wish.classList.contains('on') ? '✔ On Wishlist' : 'Add to your wishlist';
        toast(wish.classList.contains('on') ? 'Wished. Your wish has been granted: it is free. Click Download.' : 'Unwished.');
      });

      // Review vote buttons (counts only live in this browser tab - there's no server)
      document.querySelectorAll('.vote').forEach((btn) =>
        btn.addEventListener('click', () => {
          if (btn.disabled) return;
          const r = g.reviews[Number(btn.dataset.review)];
          if (btn.dataset.kind === 'yes') r.helpful++;
          if (btn.dataset.kind === 'funny') r.funny++;
          btn.parentElement.querySelectorAll('.vote').forEach((b) => (b.disabled = true));
          btn.classList.add('voted');
          document.getElementById(`helpful-${btn.dataset.review}`).innerHTML =
            `${r.helpful} people found this review helpful &middot; ${r.funny} people found this review funny`;
          toast('Thank you! Your vote has been recorded in a database that does not exist.');
        })
      );
    },
  };
}
