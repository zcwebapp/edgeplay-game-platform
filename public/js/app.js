/**
 * EdgePlay - Main Application Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initLobby();
});

function initNavbar() {
  const user = window.edgeplayApi.getUser();
  const coinsEl = document.getElementById('navCoins');
  const avatarEl = document.getElementById('navAvatar');

  if (coinsEl) coinsEl.textContent = user.coins || 100;
  if (avatarEl && user.avatar_url) avatarEl.src = user.avatar_url;

  window.addEventListener('coins_updated', (e) => {
    if (coinsEl) coinsEl.textContent = e.detail;
  });

  const insertCoinBtn = document.getElementById('btnInsertCoin');
  if (insertCoinBtn) {
    insertCoinBtn.addEventListener('click', () => {
      window.retroAudio.playInsertCoin();
      const newCoins = window.edgeplayApi.updateUserCoins(10);
      showToast(`+10 COINS INSERTED! TOTAL: ${newCoins}`);
    });
  }
}

let allGames = [];
let currentCategory = 'all';

async function initLobby() {
  const gamesGrid = document.getElementById('gamesGrid');
  if (!gamesGrid) return; // Not on lobby page

  gamesGrid.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #ffcc00; font-family: var(--font-pixel); font-size: 12px;">
      <span class="animate-blink">LOADING ARCADE REEL...</span>
    </div>
  `;

  allGames = await window.edgeplayApi.getGames();
  renderGames(allGames);

  // Search Input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = allGames.filter(g => 
        (currentCategory === 'all' || g.category === currentCategory) &&
        (g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q))
      );
      renderGames(filtered);
    });
  }

  // Category Filter Pills
  const catPills = document.querySelectorAll('.cat-pill');
  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      window.retroAudio.playBlip();
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.dataset.category;

      if (currentCategory === 'favorites') {
        const favs = allGames.filter(g => window.edgeplayApi.isFavorite(g.id));
        renderGames(favs);
      } else {
        const filtered = currentCategory === 'all' 
          ? allGames 
          : allGames.filter(g => g.category.toLowerCase() === currentCategory.toLowerCase());
        renderGames(filtered);
      }
    });
  });
}

function renderGames(games) {
  const grid = document.getElementById('gamesGrid');
  const countEl = document.getElementById('gameCount');
  if (countEl) countEl.textContent = games.length;

  if (!grid) return;

  if (games.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #12121d; border: 2px dashed #2e2e48;">
        <p style="font-family: var(--font-pixel); font-size: 13px; color: #ff0055; margin-bottom: 8px;">NO GAMES FOUND</p>
        <p style="color: #888; font-size: 13px;">Try searching for another keyword or select [ALL GAMES].</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = games.map(game => {
    const isFav = window.edgeplayApi.isFavorite(game.id);
    return `
      <div class="game-card" data-id="${game.id}">
        <div style="position: relative; aspect-ratio: 16/10; overflow: hidden; background: #000;">
          <img src="${game.thumbnail_url}" alt="${game.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;">
          <div style="position: absolute; top: 8px; left: 8px; z-index: 2;">
            <span class="badge-pixel ${getBadgeColor(game.category)}">${game.category.toUpperCase()}</span>
          </div>
          <button class="fav-btn" onclick="toggleFav(event, '${game.id}')" style="position: absolute; top: 8px; right: 8px; z-index: 6; background: rgba(0,0,0,0.6); border: 1px solid #444; color: ${isFav ? '#ff0055' : '#888'}; padding: 4px 6px; cursor: pointer; border-radius: 2px;">
            ${isFav ? '★' : '☆'}
          </button>
          <div class="play-overlay">
            <a href="game.html?id=${game.slug || game.id}" class="btn-arcade" onclick="window.retroAudio.playGameStart()">
              ▶ PRESS START
            </a>
          </div>
        </div>
        <div style="padding: 14px; display: flex; flex-direction: column; flex: 1; justify-content: space-between;">
          <div>
            <h3 style="font-family: var(--font-title); font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 6px;">
              <a href="game.html?id=${game.slug || game.id}" style="color: inherit; text-decoration: none;">${game.title}</a>
            </h3>
            <p style="font-size: 12px; color: #8888aa; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 12px;">
              ${game.description}
            </p>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #222235; pt: 10px; font-family: var(--font-mono); font-size: 11px; color: #aaa;">
            <span style="color: #ffcc00;">★ ${game.rating_avg.toFixed(1)}</span>
            <span style="color: #00e5ff;">🕹️ ${formatPlays(game.play_count)}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function getBadgeColor(cat) {
  switch (cat.toLowerCase()) {
    case 'arcade': return 'badge-gold';
    case 'puzzle': return 'badge-cyan';
    case 'action': return 'badge-pink';
    case 'casual': return 'badge-green';
    default: return 'badge-purple';
  }
}

function formatPlays(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
  return num;
}

window.toggleFav = function(e, id) {
  e.stopPropagation();
  window.retroAudio.playBlip();
  const isFav = window.edgeplayApi.toggleFavorite(id);
  e.currentTarget.style.color = isFav ? '#ff0055' : '#888';
  e.currentTarget.textContent = isFav ? '★' : '☆';
  showToast(isFav ? 'Added to Favorites!' : 'Removed from Favorites');
};

function showToast(msg) {
  let toast = document.getElementById('retroToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'retroToast';
    toast.style.cssText = `
      position: fixed; bottom: 24px; right: 24px; z-index: 1000;
      background: #ffcc00; color: #000; font-family: var(--font-mono);
      font-weight: bold; font-size: 12px; padding: 10px 18px;
      border: 3px solid #000; box-shadow: 4px 4px 0px #000;
      transform: translateY(100px); opacity: 0; transition: all 0.25s ease;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';
  setTimeout(() => {
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
  }, 2200);
}
