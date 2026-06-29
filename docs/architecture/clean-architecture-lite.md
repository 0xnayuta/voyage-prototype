---
status: current
last_verified: 2026-06-25
---

# Clean Architecture Lite

**关联规则：** R1, R4, R6

---

## 分层总览

```
Electron Shell
  │ 提供桌面窗口、本地文件访问
  │
  ▼
Next.js (App Router)
  │ HTTP 服务 + 服务端渲染 + Server Actions
  │
  ├── React Components (UI Layer)
  │     └── 纯渲染层。只渲染 GameView，不包含任何游戏规则。
  │         用户操作通过 Server Action 提交。
  │
  ├── Server Actions + UseCase Orchestration
  │     └── 应用入口 + 用例编排。接收用户请求，调用一个或多个
  │         Domain 函数完成操作，保存存档，返回 GameView。
  │         职责是编排，不是计算。位于 app/actions/ 中。
  │
  ├── Domain / Game Engine (src/game/)
  │     └── 纯函数集合。World → Action → new World。
  │         所有游戏规则（价格计算、买卖校验、航行逻辑）都在这里。
  │         不依赖 React、Next.js、Prisma、HTTP。
  │
  ├── View Builder
  │     └── World → GameView 的转换器。组装渲染所需的数据。
  │         没有副作用，不修改 World。
  │
  └── Repository (Prisma)
        └── 数据读写层。只有 SQLite 的读写操作。
            不包含业务逻辑。只提供 loadWorld / saveWorld 等基础方法。
```

## 依赖方向

外层依赖内层，内层不感知外层。

```
UI → Server Actions (含编排) → Domain (核心)
                              → View Builder (只读 World)
                              → Repository (Prisma)
```

## 关键约束

### 禁止跨越

- Server Action **不能直接**调用 Prisma 做复杂查询
- React Component **不能直接**调用 Domain 函数
- Domain 函数 **不能**引用 React、Next.js、Prisma 的类型
- Repository **不能**包含 if/else 业务判断

### 允许的调用链
```
Server Action (含编排) → Domain (纯函数) → return newWorld
                                         → Repository → SQLite
                                         → View Builder → GameView
```

## 示例：买操作的调用链

```
用户点击「购买10个丝绸」
  │
  ▼
Server Action (app/actions/trade.ts)
  │ loadWorld(tx) + executeBuy + saveWorld(tx) + buildMarketView
  │
  ├── Domain (game/domain/trade.ts)
  │     └── executeBuy(world, input)       // 纯函数：扣钱、加货、价格冲击
  │
  ├── Repository (lib/repository.ts)
  │     └── saveWorld(tx, newWorld)
  │
  └── View Builder (game/view-builder/buildGameView.ts)
        └── buildMarketView(newWorld)
```
