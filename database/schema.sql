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

-- 初始精品与自带可玩游戏
INSERT OR IGNORE INTO games (id, slug, title, description, category, tags, developer, entry_url, thumbnail_url, play_count, rating_avg, is_featured)
VALUES 
('game-2048', '2048', '2048 Arcade Edition', 'Join numbers and get to the 2048 tile! Classic addictive sliding puzzle with retro sound FX.', 'puzzle', '["Puzzle", "Classic", "Brain", "2048"]', 'Gabriele Cirulli / EdgePlay', '/games/2048/index.html', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80', 382000, 4.9, 1),
('cyber-snake', 'cyber-snake', 'Cyber Snake 1984', 'Classic retro snake game with neon phosphor CRT effects, speed boosts, and multiplier bonuses.', 'arcade', '["Arcade", "Retro", "Snake", "Neon"]', 'EdgeStudio', '/games/snake/index.html', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80', 294000, 4.8, 1),
('tetris-classic', 'tetris-classic', 'Tetris / Brick Drop', 'The ultimate classic falling block puzzle. Clear lines, trigger tetris combos, and hit the high score!', 'puzzle', '["Puzzle", "Tetris", "Blocks", "Classic"]', 'EdgeStudio', '/games/tetris/index.html', 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80', 412000, 5.0, 1),
('flappy-bird', 'flappy-bird', 'Pixel Flap Bird', 'Tap or press space to fly through retro pipe obstacles. Simple, challenging, and endlessly fun!', 'casual', '["Casual", "Arcade", "Pixel", "Physics"]', 'EdgeStudio', '/games/flappy/index.html', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80', 320000, 4.7, 0),
('neon-breakout', 'neon-breakout', 'Neon Breakout 3000', 'Smash neon bricks with bouncy balls and collect power-ups in this high-energy arcade classic.', 'action', '["Action", "Arcade", "Breakout", "Physics"]', 'EdgeStudio', '/games/breakout/index.html', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80', 215000, 4.8, 0),
('galactic-guardian', 'galactic-guardian', 'Galactic Guardian', 'Defend the galaxy against incoming alien fleets in classic 8-bit vertical shmup style.', 'action', '["Action", "Shooter", "Space", "Retro"]', 'EdgeStudio', '/games/galactic-guardian/index.html', 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80', 198000, 4.8, 0),
('pacman-edge', 'pacman-edge', 'Pac-Maze Arcade', 'Chomp dots, dodge ghosts, grab power pellets and clear the labyrinth.', 'arcade', '["Arcade", "Maze", "Classic", "Retro"]', 'Namco Tribute', '/games/pacman/index.html', 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80', 350000, 4.9, 0),
('hextris', 'hextris', 'Hextris Hexagonal', 'Fast-paced hexagonal puzzle game inspired by Tetris. Rotate the hexagon to match colors.', 'puzzle', '["Puzzle", "Hex", "Speed", "HTML5"]', 'Logan Engstrom', '/games/hextris/index.html', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80', 142000, 4.6, 0);

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
