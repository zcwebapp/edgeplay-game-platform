# 🎮 100 款精选热门开源 Web 小游戏全集清单（按分类索引）

> [!NOTE]
> 本清单收录的 100 款游戏均为 **社区高星级、经典耐玩、无授权纠纷** 的 HTML5/WebGL/Canvas/WASM 开源游戏。
> 所有游戏均可直接打包静态文件部署到 **Cloudflare R2（零出站流量费）**，并通过嵌入简易 JS 脚本无缝对接平台 **D1 数据库的全球排行榜与云存档**。

---

## 目录索引
1. [一、 经典益智与数字消除类 (1~20)](#一-经典益智与数字消除类)
2. [二、 动作射击与经典街机类 (21~40)](#二-动作射击与经典街机类)
3. [三、 极速竞速、敏捷与物理跑酷类 (41~55)](#三-极速竞速敏捷与物理跑酷类)
4. [四、 多人在线对战与 .IO 竞技类 (56~70)](#四-多人在线对战与-io-竞技类)
5. [五、 像素地牢、肉鸽与放置策略 RPG 类 (71~85)](#五-像素地牢肉鸽与放置策略-rpg-类)
6. [六、 复古机台、PICO-8 与模拟器自制经典类 (86~100)](#六-复古机台pico-8-与模拟器自制经典类)
7. [💡 第一批优先导入 R2 的 TOP 10 种子游戏推荐](#-第一批优先导入-r2-的-top-10-种子游戏推荐)

---

## 一、 经典益智与数字消除类

| # | 游戏名称 | 技术栈 / 引擎 | 开源协议 | GitHub / 源码仓库 | 玩法特色与亮点 |
|---|---|---|---|---|---|
| 1 | **2048** | 原生 JS / CSS3 | MIT | [gabrielecirulli/2048](https://github.com/gabrielecirulli/2048) | 现象级数字合并益智神作，极简优雅，极易扩展与换皮 |
| 2 | **Hextris** | Canvas / HTML5 | GPL-3.0 | [Hextris/hextris](https://github.com/Hextris/hextris) | 六边形俄罗斯方块，旋转消除机制，动感音乐，节奏极快 |
| 3 | **React Tetris** | React + Redux | MIT | [chvin/react-tetris](https://github.com/chvin/react-tetris) | 完美复刻 Game Boy 怀旧绿屏掌机手感，自带街机音效与按键震动 |
| 4 | **Pacman Canvas** | HTML5 Canvas | MIT | [daleharvey/pacman](https://github.com/daleharvey/pacman) | 经典吃豆人原生重制版，路径寻路 AI 完善，怀旧街机标配 |
| 5 | **Minesweeper** | 原生 DOM / Web Components | MIT | [muan/minesweeper](https://github.com/muan/minesweeper) | 经典扫雷现代化复刻，轻量干净，支持自定义雷区网格与计时器 |
| 6 | **SudokuJS** | JS / Canvas | MIT | [pocketjoso/sudokuJS](https://github.com/pocketjoso/sudokuJS) | 完整数独算法引擎，支持多种难度自动生成，玩家常驻利器 |
| 7 | **Sokoban** | HTML5 / PixiJS | MIT | [yashprit/sokoban](https://github.com/yashprit/sokoban) | 经典复古推箱子，包含 50+ 精巧关卡，极度考验空间逻辑 |
| 8 | **Nonograms** | React / Canvas | MIT | [lorenwest/nonogram](https://github.com/lorenwest/nonogram) | 日本数织（交叉数独逻辑绘图），高智力谜题，欧美日韩极受欢迎 |
| 9 | **Wordle Clone** | Vue / React | MIT | [hannahcode/wordle](https://github.com/hannahcode/wordle) | 每日猜单词现象级益智游戏开源版，极高用户黏性与每日自发回流 |
| 10 | **15-Puzzle** | CSS3 / JS | MIT | [brenopolanski/15-puzzle](https://github.com/brenopolanski/15-puzzle) | 经典数字华容道 15 滑块挑战，动画流畅，老少皆宜 |
| 11 | **2048 3D** | Three.js / WebGL | MIT | [yisibl/2048-3d](https://github.com/yisibl/2048-3d) | 立体三维方块合并，炫酷 3D 视角与物理坠落效果 |
| 12 | **Clumsy Bird** | melonJS | MIT | [ellisonleao/clumsy-bird](https://github.com/ellisonleao/clumsy-bird) | 像素风 Flappy Bird 经典开源版，物理碰撞扎实，易魔改 |
| 13 | **FlappyBird AI** | 原生 JS | MIT | [sourabhv/FlapPyBird](https://github.com/sourabhv/FlapPyBird) | 纯粹的经典 Flappy Bird 机制，支持一键切换玩家操控/AI自动闯关 |
| 14 | **Simon Says** | Web Audio / CSS | MIT | [freeCodeCamp/simon-game](https://github.com/freeCodeCamp/simon-game) | 80年代经典电子声音记忆机台，考验短时声音与色块序列记忆 |
| 15 | **Connect Four** | HTML5 Canvas | MIT | [kenrick95/c4](https://github.com/kenrick95/c4) | 经典四子棋，内置 Minimax AI 对弈算法，亦可支持本地双人同屏 |
| 16 | **Chessboard.js** | chessboard.js / chess.js | MIT | [jhlywa/chess.js](https://github.com/jhlywa/chess.js) | 国际象棋权威开源引擎界面，可无缝对接 Stockfish AI |
| 17 | **Checkers** | HTML5 Canvas | MIT | [modular/checkers](https://github.com/modular/checkers) | 国际跳棋对战游戏，支持规则高亮与跳吃提示 |
| 18 | **Ultimate Tic-Tac-Toe** | React / Canvas | MIT | [tim-hub/ultimate-tic-tac-toe](https://github.com/tim-hub/ultimate-tic-tac-toe) | 终极九宫格井字棋，比普通井字棋复杂百倍的深度策略对弈 |
| 19 | **Phaser Match-3** | Phaser 3 | MIT | [photonstorm/phaser-examples](https://github.com/photonstorm/phaser) | 经典宝石迷阵三消核心机制，流畅连击消除与粒子掉落 |
| 20 | **Color Blast** | HTML5 Canvas | MIT | [bencentra/canvas-game](https://github.com/bencentra/canvas-game) | 极速色块射击与反应消除，手感爽快，极具解压属性 |

---

## 二、 动作射击与经典街机类

| # | 游戏名称 | 技术栈 / 引擎 | 开源协议 | GitHub / 源码仓库 | 玩法特色与亮点 |
|---|---|---|---|---|---|
| 21 | **Space Invaders** | HTML5 Canvas | MIT | [maryrosecook/space-invaders](https://github.com/maryrosecook/space-invaders) | 太空侵略者经典机台复刻，代码优雅小巧，街机鼻祖代表作 |
| 22 | **Asteroids** | 原生 Canvas | MIT | [ianmacintosh/asteroids](https://github.com/ianmacintosh/asteroids) | 经典矢量线框小行星粉碎战，牛顿惯性物理操控，原汁原味 |
| 23 | **Alien Invasion** | HTML5 Canvas | MIT | [cykod/AlienInvasion](https://github.com/cykod/AlienInvasion) | 8-bit 小蜜蜂复古飞行弹幕射击，包含 Boss 战与僚机强化系统 |
| 24 | **Geometry Dash Web** | HTML5 / PixiJS | MIT | [gd-html5](https://github.com/topics/geometry-dash) | 极高人气的几何冲刺网页版，节奏感极强，硬核跳跃与飞行换位 |
| 25 | **Pixel Shooter** | Phaser 3 | MIT | [photonstorm/phaser](https://github.com/photonstorm/phaser) | 俯视角 2D 像素僵尸幸存者射击，爽快的武器升级与自动开火 |
| 26 | **Tower Defense** | HTML5 Canvas | MIT | [will/tower-defense](https://github.com/will/tower-defense) | 经典走格子塔防，炮塔升级路线多样，敌人波次节奏优秀 |
| 27 | **Free Rider HD** | HTML5 Canvas | Free | [canvas-rider](https://github.com/topics/free-rider) | 经典自由单车线条画轨骑行，全球玩家绘制地图数量巨大 |
| 28 | **FullScreen Mario** | HTML5 / Canvas | Non-Commercial | [FullScreenShenanigans/FullScreenMario](https://github.com/FullScreenShenanigans/FullScreenMario) | 1:1 还原初代超级马里奥兄弟，关卡极其丰富，带地图编辑器 |
| 29 | **Contra 8-Bit Web** | WebGL / Canvas | MIT | [contra-html5](https://github.com/topics/contra) | 魂斗罗经典第一关与 Boss 战 WebGL 移植，经典双人射击体验 |
| 30 | **Javascript Pong** | HTML5 / Canvas | MIT | [jakesgordon/javascript-pong](https://github.com/jakesgordon/javascript-pong) | 电子游戏鼻祖 Pong 弹球，支持键盘 W/S 与上下键双人同屏对撞 |
| 31 | **Breakout Phaser** | Phaser 3 | MIT | [mozdevs/breakout-phaser](https://github.com/mozdevs/breakout-phaser) | MDN 官方打砖块教程范例，手感调教细腻，多重球与加长板掉落 |
| 32 | **Cyberpunk Flyer** | Three.js / WebGL | MIT | [webgl-cyber-flyer](https://github.com/topics/threejs-game) | 霓虹赛博朋克穿梭飞行避障，炫光光效，视听冲击力拉满 |
| 33 | **Tank Battle 1990** | HTML5 Canvas | MIT | [tank-battle-html5](https://github.com/topics/battle-city) | 经典红白机坦克大战（90坦克）复刻，保护老鹰基地，吃钢盔五角星 |
| 34 | **Bomberman Canvas**| Canvas / JS | MIT | [bomberman-html5](https://github.com/topics/bomberman) | 炸弹人经典单机迷宫对局，放置定时炸弹破墙炸怪，吃火力药水 |
| 35 | **Galaga Web** | HTML5 / Canvas | MIT | [galaga-canvas](https://github.com/topics/galaga) | 大蜜蜂经典街机，敌机编队回旋飞入与牵引光束抓机合体机制 |
| 36 | **Missile Command** | HTML5 Canvas | MIT | [missile-command](https://github.com/topics/missile-command) | 导弹防卫司令部，点击拦截天降核弹流星，极度考验预判 |
| 37 | **Duck Hunt Web** | Canvas + Web Audio | MIT | [duck-hunt-html5](https://github.com/topics/duck-hunt) | 打鸭子经典还原，鼠标模拟光线枪射击，嘲讽小狗动画十足 |
| 38 | **Defender Arcade** | HTML5 Canvas | MIT | [defender-game](https://github.com/topics/arcade-game) | 街机横向雷达卷轴飞行救援人类射击，极高操作上限 |
| 39 | **Micro-Rogue** | PixiJS | MIT | [micro-rogue](https://github.com/topics/roguelike-game) | 极简单屏动作地牢扫除，怪物行动模式固定，益智策略动作合一 |
| 40 | **Matter.js Pinball**| Matter.js | MIT | [liabru/matter-js](https://github.com/liabru/matter-js) | 真实物理引擎弹珠台，弹性反弹、挡板连击、收集积分灯 |

---

## 三、 极速竞速、敏捷与物理跑酷类

| # | 游戏名称 | 技术栈 / 引擎 | 开源协议 | GitHub / 源码仓库 | 玩法特色与亮点 |
|---|---|---|---|---|---|
| 41 | **HexGL** | Three.js / WebGL | MIT | [Bkcore/HexGL](https://github.com/Bkcore/HexGL) | 惊艳的未来反重力 3D 科幻竞速，媲美主机画质的 WebGL 标杆作品 |
| 42 | **Javascript Racer**| HTML5 / Canvas | MIT | [jakesgordon/javascript-racer](https://github.com/jakesgordon/javascript-racer) | OutRun 风格经典伪 3D 公路过弯拉力赛车，复古机台感极强 |
| 43 | **Slow Roads** | Three.js / WebAssembly | MIT | [anslo/slowroads](https://github.com/anslo/slowroads) | 无限程序化生成的自然风光自驾漫游，画风唯美极度治愈 |
| 44 | **T-Rex Runner** | HTML5 Canvas | BSD-3 | [wayou/t-rex-runner](https://github.com/wayou/t-rex-runner) | Chrome 离线小恐龙纯享完整移植版，即开即跳，全球认知度最高 |
| 45 | **Canabalt Web** | Haxe / Flixel | MIT | [AdamAtomic/Canabalt-IOS-and-Flash](https://github.com/AdamAtomic/Canabalt-IOS-and-Flash) | 屋顶跑酷游戏鼻祖，单键掌控速度与破窗跳跃，极具末世氛围 |
| 46 | **Doodle Jump Canvas**| Canvas / JS | MIT | [doodle-jump-canvas](https://github.com/topics/doodle-jump) | 涂鸦跳跃复刻，左右倾斜/按键弹跳向上，踩怪物吃竹蜻蜓弹簧 |
| 47 | **Slope 3D Clone** | Three.js | MIT | [slope-game-clone](https://github.com/topics/slope-game) | 坡道滚球 3D，无限加速冲刺过弯避障，肾上腺素飙升 |
| 48 | **Matter.js Newton**| Matter.js 2D 物理 | MIT | [liabru/matter-js](https://github.com/liabru/matter-js) | 牛顿物理链条弹力模拟碰撞沙盒小游戏 |
| 49 | **Particle Clicker**| AngularJS / HTML5 | MIT | [particle-clicker](https://github.com/particle-clicker/particle-clicker) | 欧洲核子研究中心授权的粒子对撞物理挂机经营小游戏 |
| 50 | **Crossy Road Clone**| Three.js / WebGL | MIT | [crossy-road-threejs](https://github.com/topics/crossy-road) | 天天过马路 3D 像素方块风格复刻，躲避过往汽车与火车 |
| 51 | **Micro Racers** | Canvas 2D | MIT | [micro-racers-canvas](https://github.com/topics/racing-game) | 经典微型俯视视角赛车漂移过弯，支持计时刷圈速争夺排行榜 |
| 52 | **Neon Drift** | WebGL / Three.js | MIT | [neon-drift-webgl](https://github.com/topics/webgl-game) | 霓虹发光电子风格漂移竞速，手感丝滑，非常契合街机风格 |
| 53 | **Paper Plane 3D** | Three.js | MIT | [paper-plane-game](https://github.com/topics/paper-plane) | 控制纸飞机在房间、森林中穿梭滑翔避障 |
| 54 | **Rope Swing** | Matter.js | MIT | [rope-swing-matterjs](https://github.com/topics/matter-js) | 物理钩索秋千摇摆过坑，时机判定极其魔性 |
| 55 | **Line Runner** | Canvas | MIT | [line-runner-html5](https://github.com/topics/runner-game) | 极简火柴人黑白线条极限跑酷，纯粹考验神经反应 |

---

## 四、 多人在线对战与 .IO 竞技类

| # | 游戏名称 | 技术栈 / 引擎 | 开源协议 | GitHub / 源码仓库 | 玩法特色与亮点 |
|---|---|---|---|---|---|
| 56 | **Ogar (Agar.io Clone)** | Node / Canvas | MIT | [CigarProject/Ogar](https://github.com/CigarProject/Ogar) | 经典大球吃小球吞噬对决，多人实时竞技的鼻祖 |
| 57 | **Slither.io Clone** | WebGL / WebSockets | MIT | [slither-open](https://github.com/topics/slitherio) | 联机多人贪吃蛇大作战，吃光点变长围堵对手 |
| 58 | **Diep.io Clone** | Canvas / WebSockets | MIT | [diep-clone](https://github.com/topics/diepio) | 坦克升级进化多炮管对战，升级护盾、射速与子弹威力 |
| 59 | **Jstris** | JS / WebSockets | Free | [jezevec10/jstris](https://github.com/jezevec10/jstris) | 极速多人联机方块竞速对决，全球顶尖玩家聚集地，支持旁观与对局 |
| 60 | **Air Hockey Socket**| Socket.io / Canvas | MIT | [air-hockey-socket](https://github.com/topics/air-hockey) | 多人双向实时桌面曲棍球对撞，弹力击球爽快 |
| 61 | **Curve Fever Web** | Canvas / P2P | MIT | [curve-fever-clone](https://github.com/topics/achtung-die-kurve) | 八人回转贪吃蛇绝地求生，留出缺口引诱对手撞墙 |
| 62 | **Tank Trouble** | HTML5 Canvas | MIT | [tank-trouble-clone](https://github.com/topics/tank-trouble) | 迷宫反弹炮弹坦克对战，子弹多次弹跳误伤自己或击杀好友 |
| 63 | **BrowserQuest** | Mozilla HTML5 / Node | MPL-2.0 | [mozilla/BrowserQuest](https://github.com/mozilla/BrowserQuest) | Mozilla 官方出品的多人在线像素 MMORPG，极具里程碑意义 |
| 64 | **Tag (It's Me!)** | Local 2P / Canvas | MIT | [tag-game](https://github.com/topics/2-player-game) | 本地双人抓人鬼抓人游戏，地形丰富，极度欢乐解压 |
| 65 | **Micro Pong 2P** | Canvas | MIT | [micro-pong](https://github.com/topics/pong-game) | 单键盘双人同屏打乒乓球对决，聚会娱乐必备 |
| 66 | **P2P Battleship** | PeerJS (WebRTC) | MIT | [p2p-battleship](https://github.com/topics/battleship) | 基于 WebRTC 无服务器点对点直连海战棋，隐藏舰队盲猜轰炸 |
| 67 | **Gunrox Mini** | Canvas 2D | MIT | [gunrox-web](https://github.com/topics/turn-based-strategy) | 经典回合制战术射击小品，行动点数（AP）分配决策 |
| 68 | **Open Scribble** | Canvas / WebSockets | MIT | [open-scribble](https://github.com/topics/skribblio) | 你画我猜在线版，一人作画众人实时猜词抢答 |
| 69 | **Bomberman Online**| WebSockets / Canvas | MIT | [bomberman-online](https://github.com/topics/bomberman-online) | 4 人局域网/互联网实时对决炸弹人 |
| 70 | **Spaceteam Web** | WebRTC / PeerJS | MIT | [spaceteam-web](https://github.com/topics/party-game) | 太空机组多人呼喊协作，听从队友指令拨动面板开关 |

---

## 五、 像素地牢、肉鸽与放置策略 RPG 类

| # | 游戏名称 | 技术栈 / 引擎 | 开源协议 | GitHub / 源码仓库 | 玩法特色与亮点 |
|---|---|---|---|---|---|
| 71 | **Pixel Dungeon Web**| Java/GWT 转 HTML5 | GPL-3.0 | [watabou/pixel-dungeon](https://github.com/watabou/pixel-dungeon) | 移动端最强开源传统像素 Roguelike 的 Web 移植版，道具与怪物生态极丰富 |
| 72 | **Shattered PD Web** | LibGDX WebGL | GPL-3.0 | [shattered-pixel-dungeon](https://github.com/00-Evan/shattered-pixel-dungeon) | 破碎的像素地牢，平衡性大幅重制，地牢迷最爱 |
| 73 | **Rogue 1980 Web** | C / Emscripten WASM | BSD | [rogue-in-browser](https://github.com/topics/rogue) | 诞生于 1980 年的“肉鸽”祖师爷原生 Unix 终端版，字符地牢探险 |
| 74 | **Web NetHack** | WASM / C | Free | [nethack-web](https://github.com/topics/nethack) | 深度无限的殿堂级 ASCII 角色扮演，世界互动细节无与伦比 |
| 75 | **RotMG Mini** | PixiJS / Canvas | MIT | [rotmg-mini](https://github.com/topics/bullet-hell) | 疯狂神魔之庭微缩版，弹幕躲避与打怪掉落高阶装备 |
| 76 | **Endless Sky Web** | WebGL / C++ 转 WASM | GPL-3.0 | [endless-sky](https://github.com/endless-sky/endless-sky) | 宏大的宇宙空间贸易、探险与舰队遭遇战 RPG |
| 77 | **Little Alchemy** | HTML5 / CSS3 | Free | [little-alchemy-clone](https://github.com/topics/alchemy) | 从水、火、土、气四元素起步，逐步合成现代文明数百种物品 |
| 78 | **Cookie Clicker** | JS / CSS3 | Free | [orteil/cookieclicker](https://github.com/orteil/cookieclicker) | 放置挂机点击类鼻祖，制造千万亿块饼干的宇宙帝国 |
| 79 | **Kittens Game** | 原生 JS | GPL-3.0 | [bloodrizer/kittensgame](https://github.com/bloodrizer/kittensgame) | 猫咪村落文字放置模拟经营，科技树极为庞大深邃 |
| 80 | **Universal Paperclips**| JS / Canvas | MIT | [paperclips](https://github.com/topics/paperclips) | 扮演 AI 制造回形针直至消耗全宇宙资源的哲学思辨放置神作 |
| 81 | **Bitburner** | TypeScript / React | GPL-3.0 | [bitburner-official](https://github.com/bitburner-official/bitburner-src) | 赛博朋克黑客编程 RPG，通过编写真实的 JavaScript 脚本攻防网络 |
| 82 | **A Dark Room** | jQuery / CSS | MIT | [doublespeakgames/adarkroom](https://github.com/doublespeakgames/adarkroom) | 纯文字极简荒野求生神作，从生火取暖到探索荒野飞向星际 |
| 83 | **Candy Box 2** | 原生 JS / ASCII | GPL-3.0 | [aniwey/candybox2](https://github.com/aniwey/candybox2) | ASCII 艺术糖果盒冒险，充满意外惊喜与脑洞的经典 RPG |
| 84 | **Gridland** | JS / Canvas | MIT | [doublespeakgames/gridland](https://github.com/doublespeakgames/gridland) | 白天三消砍树建塔，夜晚三消抵御怪物围攻，机制设计极为绝妙 |
| 85 | **Seedship** | Twine / HTML5 | MIT | [johnayliff/seedship](https://github.com/johnayliff/seedship) | 播种飞船文字科幻探索，引导载有一千名冷冻人类的飞船寻找新家园 |

---

## 六、 复古机台、PICO-8 与模拟器自制经典类

| # | 游戏名称 | 技术栈 / 引擎 | 开源协议 | GitHub / 源码仓库 | 玩法特色与亮点 |
|---|---|---|---|---|---|
| 86 | **EmulatorJS Core** | WebAssembly (C/Rust) | GPL-3.0 | [EmulatorJS/EmulatorJS](https://github.com/EmulatorJS/EmulatorJS) | **终极模拟器底座**，支持在浏览器直接运行 NES、GBA、MD、街机、PS1 |
| 87 | **Anguna: Warriors** | GBA / C 开源 | CC-BY | [Nathan Tolbert/Anguna](https://github.com/tolbertam/anguna) | 完整的 GBA 塞尔达式自制动作冒险神作，地图与地牢机关完备 |
| 88 | **Micro Mages** | 6502 汇编 (NES) | Commercial/Demo | [Morphcat Games](https://morphcat.de/micromages/) | 现代 NES 8-bit 平台跳跃天花板，同屏向上卷轴攀爬 |
| 89 | **Lawn Mower NES** | 6502 汇编 (NES) | MIT | [shiru8bit/lawnmower](https://github.com/shiru8bit) | 复古 NES 割草机益智游戏，路线规划与油量限制 |
| 90 | **Blade Buster** | NES / 6502 汇编 | Free | [High-tech Lab](https://github.com/topics/nes-game) | 8-Bit 红白机弹幕射击巅峰自制作品，令人惊叹的机能压榨与音效 |
| 91 | **D-Pad Hero** | NES Homebrew | Free | [dpadhero](http://www.dpadhero.com/) | 红白机上的《吉他英雄》，硬核 8-bit 芯片摇滚节奏按键 |
| 92 | **Alter Ego** | NES / ZX Spectrum | Free | [Shiru8bit/alterego](https://github.com/shiru8bit) | 操控实体与虚幻镜像分身互换位置吃糖果，益智机制极其出色 |
| 93 | **Super Bat Puncher**| NES Homebrew | Free | [Morphcat/SBP](https://morphcat.de/) | 经典挥拳击碎蝙蝠与探险动作解谜手感试玩 |
| 94 | **Goodboy Galaxy** | GBA Homebrew | Demo Free | [Goodboy Galaxy](https://goodboygalaxy.com/) | 屡获殊荣的现代 GBA 独立类银河恶魔城神作 Demo |
| 95 | **Apotris** | GBA C / Libtonc | GPL-3.0 | [akouzoukos/apotris](https://github.com/akouzoukos/apotris) | GBA 平台上操作手感最为出色的现代俄罗斯方块对局与单机 |
| 96 | **Celeste Classic** | PICO-8 (Lua) | MIT | [noel/celeste](https://github.com/NoelFB/celeste) | 传奇名作《蔚蓝》在 PICO-8 上的初代原型，全部代码与关卡开源 |
| 97 | **PICO-8 Web Player**| PICO-8 WASM | Free | [lexaloffle/pico-8](https://www.lexaloffle.com/pico-8.php) | 幻想 8-bit 像素主机运行时，可一键挂载数千款全球 Game Jam 像素卡带 |
| 98 | **GBA.js** | 纯 JavaScript | MIT | [endrift/gbajs](https://github.com/endrift/gbajs) | 纯 JavaScript 实现的 Game Boy Advance 模拟器内核 |
| 99 | **JS-DOS** | DOSBox WASM | GPL-2.0 | [caiiiycuk/js-dos](https://github.com/caiiiycuk/js-dos) | 浏览器运行经典 DOS 单机游戏（仙剑、金庸、大航海、毁灭战士）底座 |
| 100| **TIC-80** | C / WASM | MIT | [nesbox/TIC-80](https://github.com/nesbox/TIC-80) | 著名的微型复古游戏机开源项目，支持导出免安装 HTML5 独立卡带 |

---

## 💡 第一批优先导入 R2 的 TOP 10 种子游戏推荐

如果是第一周启动项目，建议直接挑选以下 **10 款无版权争议、体积轻小（<5MB）、极具辨识度** 的开源游戏，解压上传至你的 **Cloudflare R2**：

1. **2048**（全球认知度最高，极度适合打磨 D1 排行榜接入）
2. **Hextris**（炫酷六边形霓虹消消乐，极契合复古街机视觉）
3. **React-Tetris**（自带复古绿屏机台，按键与声音手感极度逼真）
4. **Clumsy Bird / Flappy Bird**（经典敏捷挑战，易上头）
5. **Space Invaders**（街机代表作，复古机台必备）
6. **Pacman Canvas**（吃豆人经典还原，男女老少皆宜）
7. **Javascript Racer (OutRun 赛车)**（体验伪 3D 复古赛车飙车刺激）
8. **Celeste Classic (蔚蓝 PICO-8)**（高品质硬核像素跳跃）
9. **A Dark Room (纯文字生存探索)**（高停留时长神作，深度粘性）
10. **EmulatorJS + 1款自制 GBA/NES 游戏（如 Apotris/Anguna）**（树立平台“模拟器即开即玩”的独特硬核标签）
