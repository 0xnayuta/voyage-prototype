---
status: draft
last_verified: 2026-06-25
---

# 项目结构

---

## 目录树

```
src/
│
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # 根布局
│   ├── page.tsx                      # 港口总览 (/)
│   ├── market/page.tsx               # 交易所 (/market)
│   ├── ship/page.tsx                 # 造船厂 (/ship)
│   ├── cargo/page.tsx                # 船舱 (/cargo)
│   ├── navigation/page.tsx           # 航海图 (/navigation)
│   ├── voyage/page.tsx               # 航行中 (/voyage)
│   └── actions/
│       ├── save.ts                   # 读档/存档 Server Actions
│       ├── trade.ts                  # 买卖 Server Actions
│       └── travel.ts                 # 航行 Server Actions
│
├── components/                       # React 组件（纯渲染）
│   ├── StatusBar.tsx
│   ├── MarketPanel.tsx
│   ├── CargoHold.tsx
│   ├── NavigationMap.tsx
│   ├── VoyageScreen.tsx
│   └── ui/                           # 通用 UI 组件
│       ├── Button.tsx
│       ├── Modal.tsx
│       └── Toast.tsx
│
├── game/                             # 游戏引擎（纯函数领域逻辑）
│   ├── domain/
│   │   ├── types.ts                  # World、领域类型定义
│   │   ├── player.ts                 # 玩家逻辑
│   │   ├── market.ts                 # 价格计算
│   │   ├── trade.ts                  # 买卖逻辑
│   │   ├── navigation.ts             # 航行逻辑
│   │   └── ship.ts                   # 船只逻辑
│   ├── application/
│   │   ├── buy.usecase.ts            # 购买 UseCase
│   │   ├── sell.usecase.ts           # 卖出 UseCase
│   │   └── travel.usecase.ts         # 航行 UseCase
│   ├── view-builder/
│   │   ├── buildGameView.ts          # World → GameView 入口
│   │   ├── buildMarketView.ts        # 交易所 GameView
│   │   └── buildNavigationView.ts    # 航海图 GameView
│   └── event/
│       └── event-resolver.ts         # 随机事件逻辑（后续 Phase）
│
├── data/                             # 游戏内容配置（数据化）
│   ├── ports.ts                      # 港口配置
│   ├── goods.ts                      # 商品配置
│   ├── ships.ts                      # 船只配置
│   ├── events.ts                     # 随机事件配置
│   └── formulas.ts                   # 公式常量（航速系数、价格波动系数等）
│
├── lib/                              # 基础设施
│   └── prisma.ts                     # Prisma 单例
│
└── types/                            # 共享类型
    ├── world.ts                      # World 类型
    ├── game-view.ts                  # GameView 类型
    └── actions.ts                    # Server Action 入参/出参类型
```

## 目录职责

| 目录 | 职责 | 能否包含游戏规则 |
|---|---|---|
| `app/` | 路由 + Server Actions | 否（Server Action 只编排） |
| `components/` | React UI 组件 | 否 |
| `game/` | 所有游戏逻辑（纯函数） | 是 |
| `data/` | 配置数据（港口、商品、船只、公式） | 否（数据不是规则） |
| `lib/` | 基础设施（Prisma 等） | 否 |
| `types/` | TypeScript 类型定义 | 否 |

## 文件命名规范

| 目录 | 命名 | 示例 |
|---|---|---|
| `app/actions/` | kebab-case | `trade.ts` |
| `components/` | PascalCase | `MarketPanel.tsx` |
| `game/domain/` | kebab-case | `market.ts` |
| `game/application/` | kebab-case + `.usecase.ts` | `buy.usecase.ts` |
| `game/view-builder/` | PascalCase + `View` | `buildMarketView.ts` |
| `data/` | kebab-case + plural | `ports.ts`、`goods.ts` |
| `lib/` | kebab-case | `prisma.ts` |
| `types/` | kebab-case | `world.ts` |
