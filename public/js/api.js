/**
 * EdgePlay - Unified Frontend API Client & State Manager
 * Auto-detects Cloudflare Worker API; smoothly falls back to local persistence
 */

const LOCAL_SEED_GAMES = [
  {
    id: 'game-2048',
    slug: '2048',
    title: '2048 Arcade Edition',
    description: 'Join numbers and get to the 2048 tile! Classic addictive sliding puzzle with retro sound FX.',
    category: 'puzzle',
    tags: ['Puzzle', 'Classic', 'Brain', '2048'],
    developer: 'Gabriele Cirulli / EdgePlay',
    entry_url: 'games/2048/index.html',
    thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    play_count: 382410,
    rating_avg: 4.9,
    is_featured: 1,
  },
  {
    id: 'cyber-snake',
    slug: 'cyber-snake',
    title: 'Cyber Snake 1984',
    description: 'Classic retro snake game with neon phosphor CRT effects, speed boosts, and multiplier bonuses.',
    category: 'arcade',
    tags: ['Arcade', 'Retro', 'Snake', 'Neon'],
    developer: 'EdgeStudio',
    entry_url: 'games/snake/index.html',
    thumbnail_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    play_count: 294150,
    rating_avg: 4.8,
    is_featured: 1,
  },
  {
    id: 'tetris-classic',
    slug: 'tetris-classic',
    title: 'Tetris / Brick Drop',
    description: 'The ultimate classic falling block puzzle. Clear lines, trigger tetris combos, and hit high score!',
    category: 'puzzle',
    tags: ['Puzzle', 'Tetris', 'Blocks', 'Classic'],
    developer: 'EdgeStudio',
    entry_url: 'games/tetris/index.html',
    thumbnail_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    play_count: 412890,
    rating_avg: 5.0,
    is_featured: 1,
  },
  {
    id: 'flappy-bird',
    slug: 'flappy-bird',
    title: 'Pixel Flap Bird',
    description: 'Tap or press space to fly through retro pipe obstacles. Simple, challenging, and endlessly fun!',
    category: 'casual',
    tags: ['Casual', 'Arcade', 'Pixel', 'Physics'],
    developer: 'EdgeStudio',
    entry_url: 'games/flappy/index.html',
    thumbnail_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    play_count: 320400,
    rating_avg: 4.7,
    is_featured: 0,
  },
  {
    id: 'neon-breakout',
    slug: 'neon-breakout',
    title: 'Neon Breakout 3000',
    description: 'Smash neon bricks with bouncy balls and collect power-ups in this high-energy arcade classic.',
    category: 'action',
    tags: ['Action', 'Arcade', 'Breakout', 'Physics'],
    developer: 'EdgeStudio',
    entry_url: 'games/breakout/index.html',
    thumbnail_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
    play_count: 215600,
    rating_avg: 4.8,
    is_featured: 0,
  },
  {
    id: 'galactic-guardian',
    slug: 'galactic-guardian',
    title: 'Galactic Guardian',
    description: 'Defend the galaxy against incoming alien fleets in classic 8-bit vertical shmup style.',
    category: 'action',
    tags: ['Action', 'Shooter', 'Space', 'Retro'],
    developer: 'EdgeStudio',
    entry_url: 'games/breakout/index.html',
    thumbnail_url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
    play_count: 198300,
    rating_avg: 4.8,
    is_featured: 0,
  },
  {
    id: 'pacman-edge',
    slug: 'pacman-edge',
    title: 'Pac-Maze Arcade',
    description: 'Chomp dots, dodge ghosts, grab power pellets and clear the labyrinth in neon retro glory.',
    category: 'arcade',
    tags: ['Arcade', 'Maze', 'Classic', 'Retro'],
    developer: 'Namco Tribute',
    entry_url: 'games/snake/index.html',
    thumbnail_url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    play_count: 350120,
    rating_avg: 4.9,
    is_featured: 0,
  },
  {
    id: 'hextris',
    slug: 'hextris',
    title: 'Hextris Hexagonal',
    description: 'Fast-paced hexagonal puzzle game inspired by Tetris. Rotate the hexagon to match 3 colors.',
    category: 'puzzle',
    tags: ['Puzzle', 'Hex', 'Speed', 'HTML5'],
    developer: 'Logan Engstrom',
    entry_url: 'games/2048/index.html',
    thumbnail_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    play_count: 142500,
    rating_avg: 4.6,
    is_featured: 0,
  },
];

class EdgePlayAPI {
  constructor() {
    this.apiBase = '/api/v1';
    this.isWorkerAvailable = false;
    this.checkApiStatus();
  }

  async checkApiStatus() {
    try {
      const res = await fetch(`${this.apiBase}/health`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        this.isWorkerAvailable = true;
        console.log('[EdgePlay] Connected to Cloudflare Worker API');
      }
    } catch {
      this.isWorkerAvailable = false;
      console.log('[EdgePlay] Offline / Local mode active');
    }
  }

  // User Profile & Coins
  getUser() {
    const saved = localStorage.getItem('edgeplay_user');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    const defaultUser = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      username: 'PIXEL_CHAMPION',
      coins: 100,
      avatar_url: 'https://lh3.googleusercontent.com/aida/AEtjO1Urik7ct8cP-BhoraN6iIKgfpyEAdRje_6mi3VNEFSg3lshVtJ9bdGW3F25B899480ybNpzhpPj80XjuULkYFJNrJ7mCUPqGWtDooK-Epvdia-nNOaKHdv9RLbWS9ftZom4nRdQFWpDofSzqAuSs4Xyse1XExyP-D3JTXlTQ6bAR-4gN2ihlkwOmpH9CgoVcAWxayUgVRB2f6efv-EawVWRbZFXTqqKr_rJzDvGMS5UqRniZDxz0WzsYhrC',
      is_vip: 1,
    };
    localStorage.setItem('edgeplay_user', JSON.stringify(defaultUser));
    return defaultUser;
  }

  updateUserCoins(amount) {
    const user = this.getUser();
    user.coins = Math.max(0, (user.coins || 0) + amount);
    localStorage.setItem('edgeplay_user', JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('coins_updated', { detail: user.coins }));
    return user.coins;
  }

  // Games List
  async getGames({ category = 'all', search = '', sort = 'popular' } = {}) {
    if (this.isWorkerAvailable) {
      try {
        const params = new URLSearchParams();
        if (category && category !== 'all') params.append('category', category);
        if (search) params.append('search', search);
        if (sort) params.append('sort', sort);
        const res = await fetch(`${this.apiBase}/games?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data.length > 0) return json.data;
        }
      } catch (e) {
        console.warn('API error, falling back to seed games:', e);
      }
    }

    // Local fallback
    let list = [...LOCAL_SEED_GAMES];
    if (category && category !== 'all') {
      list = list.filter(g => g.category.toLowerCase() === category.toLowerCase());
    }
    if (search && search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(g => g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q));
    }
    if (sort === 'popular') {
      list.sort((a, b) => b.play_count - a.play_count);
    } else if (sort === 'rating') {
      list.sort((a, b) => b.rating_avg - a.rating_avg);
    }
    return list;
  }

  // Game Detail
  async getGameById(idOrSlug) {
    if (this.isWorkerAvailable) {
      try {
        const res = await fetch(`${this.apiBase}/games/${idOrSlug}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) return json.data;
        }
      } catch (e) {
        console.warn('API error:', e);
      }
    }
    return LOCAL_SEED_GAMES.find(g => g.id === idOrSlug || g.slug === idOrSlug) || LOCAL_SEED_GAMES[0];
  }

  // Leaderboard
  async getLeaderboard(gameId) {
    if (this.isWorkerAvailable) {
      try {
        const res = await fetch(`${this.apiBase}/leaderboards/${gameId}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) return json.data;
        }
      } catch (e) {
        console.warn('API error:', e);
      }
    }

    // Local Mock Scores
    const storedScoresKey = `edgeplay_scores_${gameId}`;
    const localScores = JSON.parse(localStorage.getItem(storedScoresKey) || '[]');
    const defaultScores = [
      { id: 1, rank: 1, badge: '👑 CHAMPION', username: 'PIXEL_KING', score: 32768, score_display: '32,768 pts' },
      { id: 2, rank: 2, badge: '🥈 RUNNER UP', username: 'RETRO_RUNNER', score: 16384, score_display: '16,384 pts' },
      { id: 3, rank: 3, badge: '🥉 3RD PLACE', username: 'CYBER_ACE', score: 8192, score_display: '8,192 pts' },
      { id: 4, rank: 4, badge: '#4', username: 'BIT_WARRIOR', score: 4096, score_display: '4,096 pts' },
      { id: 5, rank: 5, badge: '#5', username: 'NEON_KNIGHT', score: 2048, score_display: '2,048 pts' },
    ];

    const combined = [...localScores, ...defaultScores].sort((a, b) => b.score - a.score);
    return combined.map((entry, idx) => ({
      ...entry,
      rank: idx + 1,
      badge: idx === 0 ? '👑 CHAMPION' : idx === 1 ? '🥈 RUNNER UP' : idx === 2 ? '🥉 3RD PLACE' : `#${idx + 1}`
    }));
  }

  // Submit High Score
  async submitScore(gameId, score) {
    const user = this.getUser();
    const formatted = `${score.toLocaleString()} pts`;

    if (this.isWorkerAvailable) {
      try {
        const res = await fetch(`${this.apiBase}/leaderboards`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            game_id: gameId,
            user_id: user.id,
            username: user.username,
            score: score,
            score_display: formatted,
          }),
        });
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch (e) {
        console.warn('API submit score error:', e);
      }
    }

    // Local save
    const storedScoresKey = `edgeplay_scores_${gameId}`;
    const localScores = JSON.parse(localStorage.getItem(storedScoresKey) || '[]');
    const newEntry = {
      id: Date.now(),
      game_id: gameId,
      user_id: user.id,
      username: user.username,
      score,
      score_display: formatted,
      created_at: new Date().toISOString(),
    };
    localScores.push(newEntry);
    localStorage.setItem(storedScoresKey, JSON.stringify(localScores));
    return newEntry;
  }

  // Favorites
  isFavorite(gameId) {
    const favs = JSON.parse(localStorage.getItem('edgeplay_favorites') || '[]');
    return favs.includes(gameId);
  }

  toggleFavorite(gameId) {
    let favs = JSON.parse(localStorage.getItem('edgeplay_favorites') || '[]');
    if (favs.includes(gameId)) {
      favs = favs.filter(id => id !== gameId);
    } else {
      favs.push(gameId);
    }
    localStorage.setItem('edgeplay_favorites', JSON.stringify(favs));
    return favs.includes(gameId);
  }
}

window.edgeplayApi = new EdgePlayAPI();
