-- ==============================================================================
-- EdgePlay 游戏平台 - Cloudflare D1 (SQLite) 数据库初始化脚本
-- ==============================================================================

-- 1. 用户与玩家鉴权表
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,                       -- 用户唯一 ID (UUID / OAuth UID)
    username TEXT NOT NULL,
    email TEXT UNIQUE,
    avatar_url TEXT,
    role TEXT DEFAULT 'player',                 -- 'player', 'creator', 'admin'
    is_vip INTEGER DEFAULT 0,                  -- 0: 普通用户, 1: VIP 会员 (去广告、多槽位存档)
    vip_expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. 游戏元数据表
CREATE TABLE IF NOT EXISTS games (
    id TEXT PRIMARY KEY,                       -- 唯一标识符，如 'space-invader-3d'
    slug TEXT UNIQUE NOT NULL,                 -- URL 友好的短链标识
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,                    -- 'action', 'puzzle', 'retro', 'arcade', etc.
    tags TEXT,                                 -- JSON 数组，如 '["2D", "Retro", "Pixel"]'
    developer TEXT,                            -- 开发者或版权发行方
    source_type TEXT DEFAULT 'self_hosted',     -- 'self_hosted' (R2), 'gamedistribution', 'gamepix'
    entry_url TEXT NOT NULL,                   -- 游戏入口地址 (R2 相对路径或第三方 iframe URL)
    thumbnail_url TEXT NOT NULL,               -- 游戏封面海报 WebP 地址
    orientation TEXT DEFAULT 'all',            -- 'landscape' (横屏), 'portrait' (竖屏), 'all'
    play_count INTEGER DEFAULT 0,              -- 累计游玩次数
    rating_avg REAL DEFAULT 5.0,               -- 平均评分 (1.0 ~ 5.0)
    rating_count INTEGER DEFAULT 0,            -- 参与评分人数
    status TEXT DEFAULT 'published',           -- 'draft', 'published', 'archived'
    is_featured INTEGER DEFAULT 0,             -- 1 为首页精选机台推荐
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_games_category ON games(category);
CREATE INDEX IF NOT EXISTS idx_games_plays ON games(play_count DESC);
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);

-- 3. 游戏排行榜表 (防刷榜与高分记录)
CREATE TABLE IF NOT EXISTS leaderboards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    score INTEGER NOT NULL,
    score_display TEXT,                        -- 格式化展示，如 "01:23.45" 或 "120,400 pts"
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_leaderboards_game_score ON leaderboards(game_id, score DESC);

-- 4. 玩家跨端云存档索引表 (指向 R2 真实存储键)
CREATE TABLE IF NOT EXISTS game_saves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    game_id TEXT NOT NULL,
    slot_id INTEGER DEFAULT 1,                 -- 存档槽位 (普通用户 1 槽，VIP 可享多槽位)
    r2_key TEXT NOT NULL,                      -- R2 存储 Key: 'saves/{user_id}/{game_id}_s{slot_id}.json'
    file_size INTEGER DEFAULT 0,               -- 存档大小 (字节)
    summary TEXT,                              -- 存档概要 (关卡、金币、阶段记录)
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, game_id, slot_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- 5. 玩家互动与游玩记录表
CREATE TABLE IF NOT EXISTS user_game_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    game_id TEXT NOT NULL,
    is_favorite INTEGER DEFAULT 0,             -- 1: 已收藏, 0: 未收藏
    last_played_at DATETIME,                   -- 最近游玩时间
    play_time_seconds INTEGER DEFAULT 0,       -- 累计游玩时长 (秒)
    UNIQUE(user_id, game_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- 6. 游戏评价与星级评论表
CREATE TABLE IF NOT EXISTS game_reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    rating INTEGER CHECK(rating >= 1 AND rating <= 5),
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==============================================================================
-- 初始测试种子数据 (Seed Data)
-- ==============================================================================

-- 初始玩家账号
INSERT OR IGNORE INTO users (id, username, email, avatar_url, role, is_vip)
VALUES 
('usr_001', 'PIXEL_KING', 'king@edgeplay.io', 'https://lh3.googleusercontent.com/aida/AEtjO1Urik7ct8cP-BhoraN6iIKgfpyEAdRje_6mi3VNEFSg3lshVtJ9bdGW3F25B899480ybNpzhpPj80XjuULkYFJNrJ7mCUPqGWtDooK-Epvdia-nNOaKHdv9RLbWS9ftZom4nRdQFWpDofSzqAuSs4Xyse1XExyP-D3JTXlTQ6bAR-4gN2ihlkwOmpH9CgoVcAWxayUgVRB2f6efv-EawVWRbZFXTqqKr_rJzDvGMS5UqRniZDxz0WzsYhrC', 'player', 1),
('usr_002', 'RETRO_RUNNER', 'runner@edgeplay.io', 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=120&auto=format&fit=crop&q=80', 'player', 0),
('usr_003', 'CYBER_ACE', 'ace@edgeplay.io', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80', 'player', 1);

-- 初始精品与自带可玩游戏 (全部包含对应风格的游戏封面)
INSERT OR REPLACE INTO games (id, slug, title, description, category, tags, developer, source_type, entry_url, thumbnail_url, orientation, play_count, rating_avg, is_featured)
VALUES 
('game-2048', '2048', '2048 Arcade Edition', 'Join numbers and get to the 2048 tile! Classic addictive sliding puzzle with retro sound FX.', 'puzzle', '["Puzzle", "Classic", "Brain", "2048"]', 'Gabriele Cirulli / EdgePlay', 'self_hosted', '/games/2048/index.html', '/covers/2048.svg', 'all', 382000, 4.9, 1),
('cyber-snake', 'cyber-snake', 'Cyber Snake 1984', 'Classic retro snake game with neon phosphor CRT effects, speed boosts, and multiplier bonuses.', 'arcade', '["Arcade", "Retro", "Snake", "Neon"]', 'EdgeStudio', 'self_hosted', '/games/snake/index.html', '/covers/snake.svg', 'all', 294000, 4.8, 1),
('tetris-classic', 'tetris-classic', 'Tetris / Brick Drop', 'The ultimate classic falling block puzzle. Clear lines, trigger tetris combos, and hit the high score!', 'puzzle', '["Puzzle", "Tetris", "Blocks", "Classic"]', 'EdgeStudio', 'self_hosted', '/games/tetris/index.html', '/covers/tetris.svg', 'portrait', 412000, 5.0, 1),
('flappy-bird', 'flappy-bird', 'Pixel Flap Bird', 'Tap or press space to fly through retro pipe obstacles. Simple, challenging, and endlessly fun!', 'casual', '["Casual", "Arcade", "Pixel", "Physics"]', 'EdgeStudio', 'self_hosted', '/games/flappy/index.html', '/covers/flappy.svg', 'all', 320000, 4.7, 0),
('neon-breakout', 'neon-breakout', 'Neon Breakout 3000', 'Smash neon bricks with bouncy balls and collect power-ups in this high-energy arcade classic.', 'action', '["Action", "Arcade", "Breakout", "Physics"]', 'EdgeStudio', 'self_hosted', '/games/breakout/index.html', '/covers/breakout.svg', 'landscape', 215000, 4.8, 0),
('galactic-guardian', 'galactic-guardian', 'Galactic Guardian', 'Defend the galaxy against incoming alien fleets in classic 8-bit vertical shmup style.', 'action', '["Action", "Shooter", "Space", "Retro"]', 'EdgeStudio', 'self_hosted', '/games/galactic-guardian/index.html', '/covers/galactic.svg', 'portrait', 198000, 4.8, 0),
('pacman-edge', 'pacman-edge', 'Pac-Maze Arcade', 'Chomp dots, dodge ghosts, grab power pellets and clear the labyrinth in neon retro glory.', 'arcade', '["Arcade", "Maze", "Classic", "Retro"]', 'Namco Tribute', 'self_hosted', '/games/pacman/index.html', '/covers/pacman.svg', 'all', 350000, 4.9, 0),
('hextris', 'hextris', 'Hextris Hexagonal', 'Fast-paced hexagonal puzzle game inspired by Tetris. Rotate the hexagon to match colors.', 'puzzle', '["Puzzle", "Hex", "Speed", "HTML5"]', 'Logan Engstrom', 'self_hosted', '/games/hextris/index.html', '/covers/hextris.svg', 'all', 142000, 4.6, 0),
('t-rex-runner', 't-rex-runner', 'Cyber T-Rex Runner', 'Outrun the synthwave horizon! Jump over neon cacti and duck under robotic pterodactyls in this high-speed cybernetic runner.', 'arcade', '["Arcade", "Runner", "Pixel", "Cyberpunk", "Speed"]', 'Wayou / EdgeStudio', 'self_hosted', '/games/t-rex/index.html', '/covers/trex.svg', 'landscape', 365000, 4.9, 1),
('vector-asteroids', 'vector-asteroids', 'Vector Asteroids 1979', 'Pilot your triangular vector starship through deadly asteroid fields. Inertia thrust physics, fragmenting space rocks, and emergency hyperspace.', 'action', '["Retro", "Vector", "Asteroids", "Space", "Arcade"]', 'Atari Tribute / EdgeStudio', 'self_hosted', '/games/asteroids/index.html', '/covers/asteroids.svg', 'all', 288000, 4.8, 1),
('cyber-minesweeper', 'cyber-minesweeper', 'Cyber Minesweeper', 'Tactical grid logic deduction on an authentic retro computer terminal. Flag explosive landmines, track remaining hazards, and race against the clock.', 'puzzle', '["Puzzle", "Logic", "Minesweeper", "Retro", "Brain"]', 'EdgeStudio', 'self_hosted', '/games/minesweeper/index.html', '/covers/minesweeper.svg', 'all', 245000, 4.8, 0),
('cyber-sokoban', 'cyber-sokoban', 'Cyber Sokoban Crate Pusher', 'Push glowing energy cube crates into neon target sockets. Hand-crafted spatial logic levels with move undo and tactical planning.', 'puzzle', '["Puzzle", "Sokoban", "Crates", "Logic", "Strategy"]', 'EdgeStudio', 'self_hosted', '/games/sokoban/index.html', '/covers/sokoban.svg', 'all', 210000, 4.7, 0),
('cyber-pong', 'cyber-pong', 'Cyber Pong 1972', 'The birth of electronic gaming reborn with CRT phosphors and curve spin physics. Test your reflexes against an adaptive AI in a race to 7 points.', 'arcade', '["Arcade", "Pong", "Classic", "1972", "Retro"]', 'Atari Tribute / EdgeStudio', 'self_hosted', '/games/pong/index.html', '/covers/pong.svg', 'landscape', 320000, 4.9, 1),
('celeste-classic', 'celeste-classic', 'Celeste Classic (PICO-8)', 'The original celebrated indie masterpiece prototype by Maddy Thorson & Noel Berry. Hardcore mountain climbing, precision dashing, and strawberry collecting.', 'action', '["Action", "Platformer", "Pixel", "PICO-8", "Classic"]', 'Maddy Makes Games', 'opensource', 'https://www.lexaloffle.com/bbs/widget.php?pid=celeste', '/covers/celeste.svg', 'landscape', 450000, 5.0, 1),
('a-dark-room', 'a-dark-room', 'A Dark Room', 'Awake in a cold, silent room. Stoke the dying fire, gather wood, explore the barren wilderness, build a settlement, and uncover a deep interstellar mystery.', 'casual', '["RPG", "Survival", "Story", "Minimalist", "Text"]', 'Doublespeak Games', 'opensource', 'https://adarkroom.doublespeakgames.com/', '/covers/darkroom.svg', 'all', 390000, 4.9, 1),
('cookie-clicker', 'cookie-clicker', 'Cookie Clicker Classic', 'The ultimate idle game that started a global craze. Bake billions of cookies, recruit grandmas, build cosmic cookie portals, and conquer the multiverse.', 'casual', '["Casual", "Idle", "Clicker", "Classic", "Addictive"]', 'Orteil / DashNet', 'opensource', 'https://orteil.dashnet.org/cookieclicker/', '/covers/cookie.svg', 'landscape', 670000, 4.9, 1),

-- GamePix 聚合分发网络精品大作
('gp-slope-racing-3d', 'slope-racing-3d', 'Slope Racing 3D', '3D running and rolling game with perfect controls, breath-taking speeds, and addictive downhill physics.', 'arcade', '["3D", "Racing", "Arcade", "Physics", "Speed"]', 'GamePix Network', 'gamepix', 'https://play.gamepix.com/slope-racing-3d/embed?sid=1', 'https://games.assets.gamepix.com/GS7CA/thumbnail/small.png', 'landscape', 489000, 4.9, 1),
('gp-moto-x3m-spooky', 'moto-x3m-spooky-land', 'Moto X3M: Spooky Land', 'Drive your motorbike through Halloween-themed tracks filled with spine-chilling obstacles and stunt opportunities.', 'action', '["Motorbike", "Stunts", "Racing", "Physics"]', 'MadPuffers / GamePix', 'gamepix', 'https://play.gamepix.com/moto-x3m-spooky-land/embed?sid=1', 'https://games.assets.gamepix.com/7MS9M/thumbnail/small.png', 'landscape', 532000, 4.9, 1),
('gp-cut-the-rope', 'cut-the-rope', 'Cut The Rope', 'Cut the rope to feed candy to Om Nom! Collect gold stars and unlock exciting physics puzzle levels.', 'puzzle', '["Physics", "Puzzle", "Classic", "Om Nom"]', 'ZeptoLab / GamePix', 'gamepix', 'https://play.gamepix.com/cut-the-rope/embed?sid=1', 'https://games.assets.gamepix.com/40071/thumbnail/small.png', 'portrait', 620000, 5.0, 1),
('gp-cut-the-rope-2', 'cut-the-rope-2', 'Cut the Rope 2', 'Om Nom candy adventure continues! Fresh gameplay elements, new characters and tricky physics missions.', 'puzzle', '["Physics", "Puzzle", "Om Nom", "Cute"]', 'ZeptoLab / GamePix', 'gamepix', 'https://play.gamepix.com/cut-the-rope-2/embed?sid=1', 'https://games.assets.gamepix.com/40214/thumbnail/small.png', 'portrait', 410000, 4.9, 0),
('gp-cut-the-rope-exp', 'cut-the-rope-experiments', 'Cut the Rope Experiments', 'Help the Professor test Om Nom with suction cups, candy launchers, and water rockets.', 'puzzle', '["Physics", "Puzzle", "Om Nom", "Science"]', 'ZeptoLab / GamePix', 'gamepix', 'https://play.gamepix.com/cut-the-rope-experiments/embed?sid=1', 'https://games.assets.gamepix.com/40337/thumbnail/small.png', 'portrait', 345000, 4.8, 0),
('gp-basketball-stars', 'basketball-stars', 'Basketball Stars', '2-player fast-paced basketball game. Play with legends, shoot three-pointers, and slam home monstrous dunks!', 'action', '["Sports", "Basketball", "2 Player", "Multiplayer"]', 'MadPuffers / GamePix', 'gamepix', 'https://play.gamepix.com/basketball-stars/embed?sid=1', 'https://games.assets.gamepix.com/35LBE/thumbnail/small.png', 'landscape', 512000, 4.9, 1),
('gp-football-masters', 'football-masters', 'Football Masters', 'Lead your national team to glory in the euro tournament! Unleash super shot abilities in dynamic 1v1 and 2v2 matches.', 'action', '["Sports", "Soccer", "Football", "2 Player"]', 'MadPuffers / GamePix', 'gamepix', 'https://play.gamepix.com/football-masters/embed?sid=1', 'https://games.assets.gamepix.com/2TM7A/thumbnail/small.png', 'landscape', 395000, 4.8, 0),
('gp-bomber-friends', 'bomber-friends', 'Bomber Friends', 'Classic Bomberman action! Bomb your friends, collect power-ups, and be the last survivor on the battlefield.', 'arcade', '["Bomberman", "Arcade", "Classic", "Retro", "Action"]', 'Hyperkani / GamePix', 'gamepix', 'https://play.gamepix.com/bomber-friends/embed?sid=1', 'https://games.assets.gamepix.com/40344/thumbnail/small.png', 'landscape', 467000, 4.9, 1),
('gp-drunken-boxing-2', 'drunken-boxing-2', 'Drunken Boxing 2', 'Hilarious ragdoll physics boxing simulation. Throw wild punches and knock your rival out of the ring!', 'action', '["Fighting", "Ragdoll", "Physics", "Boxing", "Funny"]', 'RHM Interactive / GamePix', 'gamepix', 'https://play.gamepix.com/drunken-boxing-2/embed?sid=1', 'https://games.assets.gamepix.com/20XI2/thumbnail/small.png', 'landscape', 278000, 4.7, 0),
('gp-fractal-combat-x', 'fractal-combat-x', 'Fractal Combat X', 'Futuristic 3D arcade space-combat flight simulator across gorgeous fractal alien planets.', 'action', '["3D", "Space", "Flight", "Shooter", "Sci-Fi"]', 'OYG / GamePix', 'gamepix', 'https://play.gamepix.com/fractal-combat-x/embed?sid=1', 'https://games.assets.gamepix.com/L6TL9/thumbnail/small.png', 'landscape', 310000, 4.8, 0),
('gp-alpha-guns', 'alpha-guns', 'Alpha Guns', 'Classic 2D side-scrolling run and gun shooter. Blast through enemy soldier armies and giant war robots.', 'action', '["Shooter", "Metal Slug", "Run and Gun", "Action"]', 'Rendered Ideas / GamePix', 'gamepix', 'https://play.gamepix.com/alpha-guns/embed?sid=1', 'https://games.assets.gamepix.com/40450/thumbnail/small.png', 'landscape', 356000, 4.8, 0),
('gp-1941-frozen-front', '1941-frozen-front', '1941 Frozen Front', 'Turn-based hex grid military strategy on the icy Eastern Front. Command tanks, infantry, artillery, and airstrikes.', 'puzzle', '["Strategy", "War", "Turn-Based", "Tanks", "Tactics"]', 'HandyGames / GamePix', 'gamepix', 'https://play.gamepix.com/1941-frozen-front/embed?sid=1', 'https://games.assets.gamepix.com/40263/thumbnail/small.png', 'landscape', 245000, 4.7, 0),
('gp-little-alchemy', 'little-alchemy', 'Little Alchemy', 'Mix fire, water, earth, and air to invent hundreds of elements, dinosaur species, unicorns, and space stations!', 'puzzle', '["Alchemy", "Crafting", "Puzzle", "Discovery"]', 'Recloak / GamePix', 'gamepix', 'https://play.gamepix.com/little-alchemy/embed?sid=1', 'https://games.assets.gamepix.com/40232/thumbnail/small.png', 'landscape', 580000, 4.9, 1),
('gp-fruit-blaster', 'fruit-blaster', 'Fruit Blaster (Ninja)', 'Slice juicy flying watermelons, apples, and pineapples with blade precision while avoiding bombs.', 'casual', '["Ninja", "Slicing", "Fruit", "Casual", "Fast"]', 'GamePix Network', 'gamepix', 'https://play.gamepix.com/fruit-blaster/embed?sid=1', 'https://games.assets.gamepix.com/20054/thumbnail/small.png', 'landscape', 320000, 4.7, 0),
('gp-speed-pool-king', 'speed-pool-king', 'Speed Pool King', 'High-speed 8-ball billiards challenge. Clear the pool table before the time runs out!', 'casual', '["Sports", "Billiards", "Pool", "Speed", "8-Ball"]', 'GamePix Network', 'gamepix', 'https://play.gamepix.com/speed-pool-king/embed?sid=1', 'https://games.assets.gamepix.com/20052/thumbnail/small.png', 'landscape', 260000, 4.6, 0),
('gp-tower-crush', 'tower-crush', 'Tower Crush', 'Build a multi-floor battle tower, equip laser cannons and flamethrowers, and crush enemy fortresses.', 'action', '["Tower Defense", "Strategy", "Cannons", "Action"]', 'Impossible Apps / GamePix', 'gamepix', 'https://play.gamepix.com/tower-crush/embed?sid=1', 'https://games.assets.gamepix.com/T02T0/thumbnail/small.png', 'landscape', 410000, 4.8, 0),
('gp-helix-blitz', 'helix-blitz', 'Helix Blitz', 'Drop the bouncing ball down the rotating spiral helix tower through matching colored platforms.', 'arcade', '["Helix", "Arcade", "Drop", "Casual", "Speed"]', 'GamePix Network', 'gamepix', 'https://play.gamepix.com/helix-blitz/embed?sid=1', 'https://games.assets.gamepix.com/9I093/thumbnail/small.png', 'landscape', 334000, 4.7, 0),
('gp-skyblock', 'skyblock', 'SkyBlock Craft', 'Voxel sandbox survival on an isolated floating sky island! Mine resources, expand your land, and craft essential tools.', 'arcade', '["Minecraft", "Voxel", "Skyblock", "Crafting", "Sandbox"]', 'GamePix Network', 'gamepix', 'https://play.gamepix.com/skyblock/embed?sid=1', 'https://games.assets.gamepix.com/4B1SB/thumbnail/small.png', 'landscape', 520000, 4.9, 1),
('gp-pixel-on-titan', 'pixel-on-titan', 'Pixel on Titan', 'Maneuver high-mobility gear across city rooftops and slash giant titans in intense pixel-art combat.', 'action', '["Anime", "Titan", "Action", "Pixel", "Boss"]', 'GamePix Network', 'gamepix', 'https://play.gamepix.com/pixel-on-titan/embed?sid=1', 'https://games.assets.gamepix.com/54418/thumbnail/small.png', 'landscape', 290000, 4.8, 0),
('gp-go-chicken-go', 'go-chicken-go', 'Go Chicken Go!', 'Hilarious Crossy-Road style arcade challenge. Dodge raging traffic and trucks to cross 6 lanes of high-speed highway!', 'casual', '["Crossy Road", "Chicken", "Arcade", "Funny", "Casual"]', 'GamePix Network', 'gamepix', 'https://play.gamepix.com/go-chicken-go/embed?sid=1', 'https://games.assets.gamepix.com/40448/thumbnail/small.png', 'landscape', 378000, 4.8, 0);

-- 初始排行榜分数
INSERT OR IGNORE INTO leaderboards (game_id, user_id, score, score_display)
VALUES 
('game-2048', 'usr_001', 32768, '32,768 pts'),
('game-2048', 'usr_002', 16384, '16,384 pts'),
('game-2048', 'usr_003', 8192, '8,192 pts'),
('cyber-snake', 'usr_001', 9850, '9,850 pts'),
('cyber-snake', 'usr_003', 7420, '7,420 pts'),
('tetris-classic', 'usr_002', 154200, '154,200 pts'),
('tetris-classic', 'usr_001', 128900, '128,900 pts'),
('neon-breakout', 'usr_003', 45800, '45,800 pts');
