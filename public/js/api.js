/**
 * EdgePlay - Unified Frontend API Client & State Manager
 * Auto-detects Cloudflare Worker API; smoothly falls back to local persistence
 */

const LOCAL_SEED_GAMES = [
  // 1. Classic In-House / Arcade Games
  {
    id: 'game-2048',
    slug: '2048',
    title: '2048 Arcade Edition',
    description: 'Join numbers and get to the 2048 tile! Classic addictive sliding puzzle with retro sound FX.',
    category: 'puzzle',
    tags: ['Puzzle', 'Classic', 'Brain', '2048'],
    developer: 'Gabriele Cirulli / EdgePlay',
    entry_url: '/games/2048/index.html',
    thumbnail_url: '/covers/2048.svg',
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
    entry_url: '/games/snake/index.html',
    thumbnail_url: '/covers/snake.svg',
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
    entry_url: '/games/tetris/index.html',
    thumbnail_url: '/covers/tetris.svg',
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
    entry_url: '/games/flappy/index.html',
    thumbnail_url: '/covers/flappy.svg',
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
    entry_url: '/games/breakout/index.html',
    thumbnail_url: '/covers/breakout.svg',
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
    entry_url: '/games/galactic-guardian/index.html',
    thumbnail_url: '/covers/galactic.svg',
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
    entry_url: '/games/pacman/index.html',
    thumbnail_url: '/covers/pacman.svg',
    play_count: 350120,
    rating_avg: 4.9,
    is_featured: 0,
  },
  {
    id: 'hextris',
    slug: 'hextris',
    title: 'Hextris Hexagonal',
    description: 'Fast-paced hexagonal puzzle game inspired by Tetris. Rotate the hexagon to match colors.',
    category: 'puzzle',
    tags: ['Puzzle', 'Hex', 'Speed', 'HTML5'],
    developer: 'Logan Engstrom',
    entry_url: '/games/hextris/index.html',
    thumbnail_url: '/covers/hextris.svg',
    play_count: 142500,
    rating_avg: 4.6,
    is_featured: 0,
  },
  {
    id: 't-rex-runner',
    slug: 't-rex-runner',
    title: 'Cyber T-Rex Runner',
    description: 'Outrun the synthwave horizon! Jump over neon cacti and duck under robotic pterodactyls in this high-speed cybernetic runner.',
    category: 'arcade',
    tags: ['Arcade', 'Runner', 'Pixel', 'Cyberpunk', 'Speed'],
    developer: 'Wayou / EdgeStudio',
    entry_url: '/games/t-rex/index.html',
    thumbnail_url: '/covers/trex.svg',
    play_count: 365000,
    rating_avg: 4.9,
    is_featured: 1,
  },
  {
    id: 'vector-asteroids',
    slug: 'vector-asteroids',
    title: 'Vector Asteroids 1979',
    description: 'Pilot your triangular vector starship through deadly asteroid fields. Inertia thrust physics, fragmenting space rocks, and emergency hyperspace.',
    category: 'action',
    tags: ['Retro', 'Vector', 'Asteroids', 'Space', 'Arcade'],
    developer: 'Atari Tribute / EdgeStudio',
    entry_url: '/games/asteroids/index.html',
    thumbnail_url: '/covers/asteroids.svg',
    play_count: 288000,
    rating_avg: 4.8,
    is_featured: 1,
  },
  {
    id: 'cyber-minesweeper',
    slug: 'cyber-minesweeper',
    title: 'Cyber Minesweeper',
    description: 'Tactical grid logic deduction on an authentic retro computer terminal. Flag explosive landmines, track remaining hazards, and race against the clock.',
    category: 'puzzle',
    tags: ['Puzzle', 'Logic', 'Minesweeper', 'Retro', 'Brain'],
    developer: 'EdgeStudio',
    entry_url: '/games/minesweeper/index.html',
    thumbnail_url: '/covers/minesweeper.svg',
    play_count: 245000,
    rating_avg: 4.8,
    is_featured: 0,
  },
  {
    id: 'cyber-sokoban',
    slug: 'cyber-sokoban',
    title: 'Cyber Sokoban Crate Pusher',
    description: 'Push glowing energy cube crates into neon target sockets. Hand-crafted spatial logic levels with move undo and tactical planning.',
    category: 'puzzle',
    tags: ['Puzzle', 'Sokoban', 'Crates', 'Logic', 'Strategy'],
    developer: 'EdgeStudio',
    entry_url: '/games/sokoban/index.html',
    thumbnail_url: '/covers/sokoban.svg',
    play_count: 210000,
    rating_avg: 4.7,
    is_featured: 0,
  },
  {
    id: 'cyber-pong',
    slug: 'cyber-pong',
    title: 'Cyber Pong 1972',
    description: 'The birth of electronic gaming reborn with CRT phosphors and curve spin physics. Test your reflexes against an adaptive AI in a race to 7 points.',
    category: 'arcade',
    tags: ['Arcade', 'Pong', 'Classic', '1972', 'Retro'],
    developer: 'Atari Tribute / EdgeStudio',
    entry_url: '/games/pong/index.html',
    thumbnail_url: '/covers/pong.svg',
    play_count: 320000,
    rating_avg: 4.9,
    is_featured: 1,
  },
  {
    id: 'celeste-classic',
    slug: 'celeste-classic',
    title: 'Celeste Classic (PICO-8)',
    description: 'The original celebrated indie masterpiece prototype by Maddy Thorson & Noel Berry. Hardcore mountain climbing, precision dashing, and strawberry collecting.',
    category: 'action',
    tags: ['Action', 'Platformer', 'Pixel', 'PICO-8', 'Classic'],
    developer: 'Maddy Makes Games',
    entry_url: 'https://www.lexaloffle.com/bbs/widget.php?pid=celeste',
    thumbnail_url: '/covers/celeste.svg',
    play_count: 450000,
    rating_avg: 5.0,
    is_featured: 1,
  },
  {
    id: 'a-dark-room',
    slug: 'a-dark-room',
    title: 'A Dark Room',
    description: 'Awake in a cold, silent room. Stoke the dying fire, gather wood, explore the barren wilderness, build a settlement, and uncover a deep interstellar mystery.',
    category: 'casual',
    tags: ['RPG', 'Survival', 'Story', 'Minimalist', 'Text'],
    developer: 'Doublespeak Games',
    entry_url: 'https://adarkroom.doublespeakgames.com/',
    thumbnail_url: '/covers/darkroom.svg',
    play_count: 390000,
    rating_avg: 4.9,
    is_featured: 1,
  },
  {
    id: 'cookie-clicker',
    slug: 'cookie-clicker',
    title: 'Cookie Clicker Classic',
    description: 'The ultimate idle game that started a global craze. Bake billions of cookies, recruit grandmas, build cosmic cookie portals, and conquer the multiverse.',
    category: 'casual',
    tags: ['Casual', 'Idle', 'Clicker', 'Classic', 'Addictive'],
    developer: 'Orteil / DashNet',
    entry_url: 'https://orteil.dashnet.org/cookieclicker/',
    thumbnail_url: '/covers/cookie.svg',
    play_count: 670000,
    rating_avg: 4.9,
    is_featured: 1,
  },

  // 2. GamePix Network Curated Games
  {
    id: 'gp-slope-racing-3d',
    slug: 'slope-racing-3d',
    title: 'Slope Racing 3D',
    description: '3D running and rolling game with perfect controls, breath-taking speeds, and addictive downhill physics.',
    category: 'arcade',
    tags: ['3D', 'Racing', 'Arcade', 'Physics', 'Speed'],
    developer: 'GamePix Network',
    entry_url: 'https://play.gamepix.com/slope-racing-3d/embed?sid=1',
    thumbnail_url: 'https://games.assets.gamepix.com/GS7CA/thumbnail/small.png',
    play_count: 489000,
    rating_avg: 4.9,
    is_featured: 1,
  },
  {
    id: 'gp-moto-x3m-spooky',
    slug: 'moto-x3m-spooky-land',
    title: 'Moto X3M: Spooky Land',
    description: 'Drive your motorbike through Halloween-themed tracks filled with spine-chilling obstacles and stunt opportunities.',
    category: 'action',
    tags: ['Motorbike', 'Stunts', 'Racing', 'Physics'],
    developer: 'MadPuffers / GamePix',
    entry_url: 'https://play.gamepix.com/moto-x3m-spooky-land/embed?sid=1',
    thumbnail_url: 'https://games.assets.gamepix.com/7MS9M/thumbnail/small.png',
    play_count: 532000,
    rating_avg: 4.9,
    is_featured: 1,
  },
  {
    id: 'gp-cut-the-rope',
    slug: 'cut-the-rope',
    title: 'Cut The Rope',
    description: 'Cut the rope to feed candy to Om Nom! Collect gold stars and unlock exciting physics puzzle levels.',
    category: 'puzzle',
    tags: ['Physics', 'Puzzle', 'Classic', 'Om Nom'],
    developer: 'ZeptoLab / GamePix',
    entry_url: 'https://play.gamepix.com/cut-the-rope/embed?sid=1',
    thumbnail_url: 'https://games.assets.gamepix.com/40071/thumbnail/small.png',
    play_count: 620000,
    rating_avg: 5.0,
    is_featured: 1,
  },
  {
    id: 'gp-cut-the-rope-2',
    slug: 'cut-the-rope-2',
    title: 'Cut the Rope 2',
    description: 'Om Nom candy adventure continues! Fresh gameplay elements, new characters and tricky physics missions.',
    category: 'puzzle',
    tags: ['Physics', 'Puzzle', 'Om Nom', 'Cute'],
    developer: 'ZeptoLab / GamePix',
    entry_url: 'https://play.gamepix.com/cut-the-rope-2/embed?sid=1',
    thumbnail_url: 'https://games.assets.gamepix.com/40214/thumbnail/small.png',
    play_count: 410000,
    rating_avg: 4.9,
    is_featured: 0,
  },
  {
    id: 'gp-cut-the-rope-exp',
    slug: 'cut-the-rope-experiments',
    title: 'Cut the Rope Experiments',
    description: 'Help the Professor test Om Nom with suction cups, candy launchers, and water rockets.',
    category: 'puzzle',
    tags: ['Physics', 'Puzzle', 'Om Nom', 'Science'],
    developer: 'ZeptoLab / GamePix',
    entry_url: 'https://play.gamepix.com/cut-the-rope-experiments/embed?sid=1',
    thumbnail_url: 'https://games.assets.gamepix.com/40337/thumbnail/small.png',
    play_count: 345000,
    rating_avg: 4.8,
    is_featured: 0,
  },
  {
    id: 'gp-basketball-stars',
    slug: 'basketball-stars',
    title: 'Basketball Stars',
    description: '2-player fast-paced basketball game. Play with legends, shoot three-pointers, and slam home monstrous dunks!',
    category: 'action',
    tags: ['Sports', 'Basketball', '2 Player', 'Multiplayer'],
    developer: 'MadPuffers / GamePix',
    entry_url: 'https://play.gamepix.com/basketball-stars/embed?sid=1',
    thumbnail_url: 'https://games.assets.gamepix.com/35LBE/thumbnail/small.png',
    play_count: 512000,
    rating_avg: 4.9,
    is_featured: 1,
  },
  {
    id: 'gp-football-masters',
    slug: 'football-masters',
    title: 'Football Masters',
    description: 'Lead your national team to glory in the euro tournament! Unleash super shot abilities in dynamic 1v1 and 2v2 matches.',
    category: 'action',
    tags: ['Sports', 'Soccer', 'Football', '2 Player'],
    developer: 'MadPuffers / GamePix',
    entry_url: 'https://play.gamepix.com/football-masters/embed?sid=1',
    thumbnail_url: 'https://games.assets.gamepix.com/2TM7A/thumbnail/small.png',
    play_count: 395000,
    rating_avg: 4.8,
    is_featured: 0,
  },
  {
    id: 'gp-bomber-friends',
    slug: 'bomber-friends',
    title: 'Bomber Friends',
    description: 'Classic Bomberman action! Bomb opponents, collect power-ups, and be the last survivor on the battlefield.',
    category: 'arcade',
    tags: ['Bomberman', 'Arcade', 'Classic', 'Retro', 'Action'],
    developer: 'Hyperkani / GamePix',
    entry_url: 'https://play.gamepix.com/bomber-friends/embed?sid=1',
    thumbnail_url: 'https://games.assets.gamepix.com/40344/thumbnail/small.png',
    play_count: 467000,
    rating_avg: 4.9,
    is_featured: 1,
  },
  {
    id: 'gp-drunken-boxing-2',
    slug: 'drunken-boxing-2',
    title: 'Drunken Boxing 2',
    description: 'Hilarious ragdoll physics boxing simulation. Throw wild punches and knock your rival out of the ring!',
    category: 'action',
    tags: ['Fighting', 'Ragdoll', 'Physics', 'Boxing', 'Funny'],
    developer: 'RHM Interactive / GamePix',
    entry_url: 'https://play.gamepix.com/drunken-boxing-2/embed?sid=1',
    thumbnail_url: 'https://games.assets.gamepix.com/20XI2/thumbnail/small.png',
    play_count: 278000,
    rating_avg: 4.7,
    is_featured: 0,
  },
  {
    id: 'gp-fractal-combat-x',
    slug: 'fractal-combat-x',
    title: 'Fractal Combat X',
    description: 'Futuristic 3D arcade space-combat flight simulator across gorgeous fractal alien planets.',
    category: 'action',
    tags: ['3D', 'Space', 'Flight', 'Shooter', 'Sci-Fi'],
    developer: 'OYG / GamePix',
    entry_url: 'https://play.gamepix.com/fractal-combat-x/embed?sid=1',
    thumbnail_url: 'https://games.assets.gamepix.com/L6TL9/thumbnail/small.png',
    play_count: 310000,
    rating_avg: 4.8,
    is_featured: 0,
  },
  {
    id: 'gp-alpha-guns',
    slug: 'alpha-guns',
    title: 'Alpha Guns',
    description: 'Classic 2D side-scrolling run and gun shooter. Blast through enemy soldier armies and giant war robots.',
    category: 'action',
    tags: ['Shooter', 'Metal Slug', 'Run and Gun', 'Action'],
    developer: 'Rendered Ideas / GamePix',
    entry_url: 'https://play.gamepix.com/alpha-guns/embed?sid=1',
    thumbnail_url: 'https://games.assets.gamepix.com/40450/thumbnail/small.png',
    play_count: 356000,
    rating_avg: 4.8,
    is_featured: 0,
  },
  {
    id: 'gp-1941-frozen-front',
    slug: '1941-frozen-front',
    title: '1941 Frozen Front',
    description: 'Turn-based hex grid military strategy on the icy Eastern Front. Command tanks, infantry, artillery, and airstrikes.',
    category: 'puzzle',
    tags: ['Strategy', 'War', 'Turn-Based', 'Tanks', 'Tactics'],
    developer: 'HandyGames / GamePix',
    entry_url: 'https://play.gamepix.com/1941-frozen-front/embed?sid=1',
    thumbnail_url: 'https://games.assets.gamepix.com/40263/thumbnail/small.png',
    play_count: 245000,
    rating_avg: 4.7,
    is_featured: 0,
  },
  {
    id: 'gp-little-alchemy',
    slug: 'little-alchemy',
    title: 'Little Alchemy',
    description: 'Mix fire, water, earth, and air to invent hundreds of elements, dinosaur species, unicorns, and space stations!',
    category: 'puzzle',
    tags: ['Alchemy', 'Crafting', 'Puzzle', 'Discovery'],
    developer: 'Recloak / GamePix',
    entry_url: 'https://play.gamepix.com/little-alchemy/embed?sid=1',
    thumbnail_url: 'https://games.assets.gamepix.com/40232/thumbnail/small.png',
    play_count: 580000,
    rating_avg: 4.9,
    is_featured: 1,
  },
  {
    id: 'gp-fruit-blaster',
    slug: 'fruit-blaster',
    title: 'Fruit Blaster (Ninja)',
    description: 'Slice juicy flying watermelons, apples, and pineapples with blade precision while avoiding bombs.',
    category: 'casual',
    tags: ['Ninja', 'Slicing', 'Fruit', 'Casual', 'Fast'],
    developer: 'GamePix Network',
    entry_url: 'https://play.gamepix.com/fruit-blaster/embed?sid=1',
    thumbnail_url: 'https://games.assets.gamepix.com/20054/thumbnail/small.png',
    play_count: 320000,
    rating_avg: 4.7,
    is_featured: 0,
  },
  {
    id: 'gp-speed-pool-king',
    slug: 'speed-pool-king',
    title: 'Speed Pool King',
    description: 'High-speed 8-ball billiards challenge. Clear the pool table before the time runs out!',
    category: 'casual',
    tags: ['Sports', 'Billiards', 'Pool', 'Speed', '8-Ball'],
    developer: 'GamePix Network',
    entry_url: 'https://play.gamepix.com/speed-pool-king/embed?sid=1',
    thumbnail_url: 'https://games.assets.gamepix.com/20052/thumbnail/small.png',
    play_count: 260000,
    rating_avg: 4.6,
    is_featured: 0,
  },
  {
    id: 'gp-tower-crush',
    slug: 'tower-crush',
    title: 'Tower Crush',
    description: 'Build a multi-floor battle tower, equip laser cannons and flamethrowers, and crush enemy fortresses.',
    category: 'action',
    tags: ['Tower Defense', 'Strategy', 'Cannons', 'Action'],
    developer: 'Impossible Apps / GamePix',
    entry_url: 'https://play.gamepix.com/tower-crush/embed?sid=1',
    thumbnail_url: 'https://games.assets.gamepix.com/T02T0/thumbnail/small.png',
    play_count: 410000,
    rating_avg: 4.8,
    is_featured: 0,
  },
  {
    id: 'gp-helix-blitz',
    slug: 'helix-blitz',
    title: 'Helix Blitz',
    description: 'Drop the bouncing ball down the rotating spiral helix tower through matching colored platforms.',
    category: 'arcade',
    tags: ['Helix', 'Arcade', 'Drop', 'Casual', 'Speed'],
    developer: 'GamePix Network',
    entry_url: 'https://play.gamepix.com/helix-blitz/embed?sid=1',
    thumbnail_url: 'https://games.assets.gamepix.com/9I093/thumbnail/small.png',
    play_count: 334000,
    rating_avg: 4.7,
    is_featured: 0,
  },
  {
    id: 'gp-skyblock',
    slug: 'skyblock',
    title: 'SkyBlock Craft',
    description: 'Voxel sandbox survival on an isolated floating sky island! Mine resources, expand your land, and craft essential tools.',
    category: 'arcade',
    tags: ['Minecraft', 'Voxel', 'Skyblock', 'Crafting', 'Sandbox'],
    developer: 'GamePix Network',
    entry_url: 'https://play.gamepix.com/skyblock/embed?sid=1',
    thumbnail_url: 'https://games.assets.gamepix.com/4B1SB/thumbnail/small.png',
    play_count: 520000,
    rating_avg: 4.9,
    is_featured: 1,
  },
  {
    id: 'gp-pixel-on-titan',
    slug: 'pixel-on-titan',
    title: 'Pixel on Titan',
    description: 'Maneuver high-mobility gear across city rooftops and slash giant titans in intense pixel-art combat.',
    category: 'action',
    tags: ['Anime', 'Titan', 'Action', 'Pixel', 'Boss'],
    developer: 'GamePix Network',
    entry_url: 'https://play.gamepix.com/pixel-on-titan/embed?sid=1',
    thumbnail_url: 'https://games.assets.gamepix.com/54418/thumbnail/small.png',
    play_count: 290000,
    rating_avg: 4.8,
    is_featured: 0,
  },
  {
    id: 'gp-go-chicken-go',
    slug: 'go-chicken-go',
    title: 'Go Chicken Go!',
    description: 'Hilarious Crossy-Road style arcade challenge. Dodge raging traffic and trucks to cross 6 lanes of high-speed highway!',
    category: 'casual',
    tags: ['Crossy Road', 'Chicken', 'Arcade', 'Funny', 'Casual'],
    developer: 'GamePix Network',
    entry_url: 'https://play.gamepix.com/go-chicken-go/embed?sid=1',
    thumbnail_url: 'https://games.assets.gamepix.com/40448/thumbnail/small.png',
    play_count: 378000,
    rating_avg: 4.8,
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
      const res = await fetch(`${this.apiBase}/health`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        this.isWorkerAvailable = true;
        console.log('[EdgePlay] Connected to Cloudflare Edge Worker API');
      }
    } catch {
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

  // Games List - Always fetches directly from Worker API first
  async getGames({ category = 'all', search = '', sort = 'popular' } = {}) {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (search) params.append('search', search);
      if (sort) params.append('sort', sort);
      params.append('limit', '100'); // ensure all games are returned
      const res = await fetch(`${this.apiBase}/games?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          this.isWorkerAvailable = true;
          return json.data;
        }
      }
    } catch (e) {
      console.warn('[EdgePlay] Worker API error or offline, fallback to local catalogue:', e);
    }

    // Local fallback with all 36 games
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
    try {
      const res = await fetch(`${this.apiBase}/games/${idOrSlug}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          this.isWorkerAvailable = true;
          return json.data;
        }
      }
    } catch (e) {
      console.warn('[EdgePlay] Worker API error getting game detail:', e);
    }
    return LOCAL_SEED_GAMES.find(g => g.id === idOrSlug || g.slug === idOrSlug) || LOCAL_SEED_GAMES[0];
  }

  // Leaderboard
  async getLeaderboard(gameId) {
    try {
      const res = await fetch(`${this.apiBase}/leaderboards/${gameId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) return json.data;
      }
    } catch (e) {
      console.warn('[EdgePlay] Worker API error getting leaderboard:', e);
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
    return [...localScores, ...defaultScores].sort((a, b) => b.score - a.score).slice(0, 10);
  }

  // Submit High Score
  async submitScore(gameId, score, scoreDisplay) {
    const user = this.getUser();
    try {
      const res = await fetch(`${this.apiBase}/leaderboards/${gameId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          username: user.username,
          score,
          score_display: scoreDisplay,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) return json.data;
      }
    } catch (e) {
      console.warn('[EdgePlay] Online score submit error, saving locally:', e);
    }

    // Fallback: save to localStorage
    const storedScoresKey = `edgeplay_scores_${gameId}`;
    const scores = JSON.parse(localStorage.getItem(storedScoresKey) || '[]');
    const entry = {
      id: Date.now(),
      game_id: gameId,
      username: user.username,
      score,
      score_display: scoreDisplay || `${score.toLocaleString()} pts`,
    };
    scores.push(entry);
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem(storedScoresKey, JSON.stringify(scores.slice(0, 10)));
    return entry;
  }

  // Cloud Save System (R2 / Local fallback)
  async saveGameState(gameId, slotId, stateData, summary = 'Checkpoint') {
    const user = this.getUser();
    const payload = {
      user_id: user.id,
      slot_id: slotId,
      save_data: stateData,
      summary,
    };

    try {
      const res = await fetch(`${this.apiBase}/saves/${gameId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) return { success: true, cloud: true, meta: json.data };
      }
    } catch (e) {
      console.warn('[EdgePlay] Cloud save unavailable, falling back to Local Vault:', e);
    }

    // Local Vault Fallback
    const localVaultKey = `edgeplay_save_${user.id}_${gameId}_slot${slotId}`;
    const record = {
      saved_at: new Date().toISOString(),
      summary,
      slot_id: slotId,
      data: stateData,
    };
    localStorage.setItem(localVaultKey, JSON.stringify(record));
    return { success: true, cloud: false, local: true, record };
  }

  async loadGameState(gameId, slotId) {
    const user = this.getUser();
    try {
      const res = await fetch(`${this.apiBase}/saves/${gameId}?user_id=${user.id}&slot_id=${slotId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return { success: true, cloud: true, data: json.data };
        }
      }
    } catch (e) {
      console.warn('[EdgePlay] Cloud load fallback to local:', e);
    }

    const localVaultKey = `edgeplay_save_${user.id}_${gameId}_slot${slotId}`;
    const recordStr = localStorage.getItem(localVaultKey);
    if (recordStr) {
      try {
        const parsed = JSON.parse(recordStr);
        return { success: true, cloud: false, local: true, data: parsed.data };
      } catch {}
    }
    return { success: false, error: 'No save found' };
  }

  // Favorite toggle
  toggleFavorite(gameId) {
    const favs = this.getFavorites();
    const idx = favs.indexOf(gameId);
    if (idx >= 0) {
      favs.splice(idx, 1);
    } else {
      favs.push(gameId);
    }
    localStorage.setItem('edgeplay_favorites', JSON.stringify(favs));
    return favs.includes(gameId);
  }

  isFavorite(gameId) {
    return this.getFavorites().includes(gameId);
  }

  getFavorites() {
    return JSON.parse(localStorage.getItem('edgeplay_favorites') || '[]');
  }
}

// Global Export
window.edgeplayApi = new EdgePlayAPI();
