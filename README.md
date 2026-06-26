# 纵横四海 (Seaforge)

Seaforge 是一款单人离线航海贸易经营游戏。灵感来源于 QQ 家园《纵横四海》——仅借鉴核心玩法，不复制原内容。

> 🚧 Phase 1 MVP（原型开发阶段）

---

## 技术栈

| 类别 | 选型 |
|---|---|
| 框架 | Next.js 16 (App Router) · React 19 |
| 语言 | TypeScript 5 (strict) |
| 数据库 | SQLite · Prisma 7 · libSQL |
| 包管理 | Bun |
| 代码规范 | Biome 2.2 (format + lint) |
| 测试 | Bun Test（单元）· Playwright（E2E） |
| CSS | Tailwind CSS 4 |

---

## 快速开始

**前置条件：** Bun ≥ 1.3

```bash
# 克隆并安装
git clone https://github.com/0xnayuta/Seaforge && cd Seaforge
bun install

# 初始化数据库
bunx prisma generate
bunx prisma db push

# 启动开发服务器 (webpack)
bun run dev
```

浏览器打开 http://localhost:3000 即可游玩。

---

## 可用命令

| 命令 | 作用 |
|---|---|
| `bun run dev` | 启动开发服务器 (webpack) |
| `bun run build` | 生产构建 |
| `bun run start` | 运行生产构建 |
| `bun run test` | 运行单元测试（`src/**/*.test.ts`） |
| `bun run lint` | Biome 代码检查 |
| `bun run format` | Biome 自动格式化 |
| `bun run docs:check` | 文档完整性校验（frontmatter + 内部链接） |
| `bunx prisma db push` | 推送 schema 变更到 SQLite |
| `bunx prisma migrate dev --name <desc>` | 创建迁移 |
| `bunx playwright test` | E2E 测试（Playwright） |

### 开发校验流程

修改代码后依次执行：

```bash
bun run build        # 编译检查（必须无错误）
bun run lint         # Biome 代码检查
bun run test         # 单元测试（全部通过）
bun run docs:check   # 涉及文档变更时执行
```

---

## 项目结构

### 主源码（src/）

```
src/
├── app/                        # Next.js 页面 + Server Actions
│   ├── page.tsx                # 港口总览 (/)
│   ├── market/                 # 交易所 (/market)
│   ├── cargo/                  # 船舱 (/cargo)
│   ├── navigation/             # 航海图 (/navigation)
│   ├── ship/                   # 造船厂 (/ship)
│   ├── voyage/                 # 航行中 (/voyage)
│   └── actions/                # Server Actions（存档、贸易、航行）
├── game/                       # 游戏引擎（纯函数，不依赖框架）
│   ├── domain/                 # 领域逻辑（价格、买卖、航行、船只）
│   ├── application/            # UseCase 编排（buy / sell / travel）
│   └── view-builder/           # World → GameView 转换器
├── data/                       # 游戏数据配置（港口、商品、船只、公式）
│   ├── ports.ts                # 3 港口：泉州、长崎、马六甲
│   ├── goods.ts                # 5 商品：丝绸、瓷器、香料、木材、玉石
│   ├── ships.ts                # 2 船只
│   └── formulas.ts             # 公式常量（航速系数、波动系数、回归率）
├── lib/                        # 基础设施（Prisma 单例、repository、DomainError 映射）
├── types/                      # 共享类型（World、GameView、Action 入参/出参）
├── components/                 # React UI 组件（纯渲染）
│   └── ui/                     # 通用组件（Button、Modal、QuantityInput、Toast）
└── e2e/                        # Playwright E2E 测试
prisma/
├── schema.prisma               # 存档表（Save + JSON 列模式）
└── migrations/                 # 迁移历史
```

### 文档目录（docs/）

```
docs/
├── adr/                        # 架构决策记录（ADR-0001 ~ 0003）
├── architecture/               # 系统架构设计（Clean Architecture Lite、数据流、路由）
├── specifications/             # 功能规格说明（World 定义、存档系统）
├── guides/                     # 开发规范（Prisma、状态管理、项目结构）
├── roadmap/                    # 路线图（Phase 1 MVP）
└── README.md                   # 文档索引中心
```

详见：[`docs/README.md`](docs/README.md)

---

## 核心架构

### Clean Architecture Lite

```
UI (React Components)
  → Server Actions（编排入口）
    → Application Layer（UseCases）
      → Domain / Game Engine（src/game/ 纯函数）
        → View Builder（World → GameView，只读）
        → Repository（Prisma → SQLite）
```

**依赖方向：** 外层依赖内层，内层不感知外层。

### 关键约束

| 规则 | 说明 | 文档 |
|---|---|---|
| R1 | 游戏规则必须在 `src/game/`，禁止出现在 Component / Server Action / Repository 中 | [`clean-architecture-lite.md`](docs/architecture/clean-architecture-lite.md) |
| R2 | World 只保存游戏事实，不保存 UI 状态 | [`world-definition.md`](docs/specifications/world-definition.md) |
| R3 | 所有写操作必须在 `prisma.$transaction` 内原子执行 | [`prisma-usage.md`](docs/guides/prisma-usage.md) |
| R4 | Server Action 只编排，不实现业务规则 | [`clean-architecture-lite.md`](docs/architecture/clean-architecture-lite.md) |
| R7 | MVP 阶段禁止引入 Zustand | [`state-management.md`](docs/guides/state-management.md) |

完整规则表（R1-R10）见：[`AGENTS.md`](AGENTS.md) §2.1

### 核心数据流

```
用户操作 → Server Action → loadWorld（读 SQLite）
  → execute（纯函数计算新 World）
  → saveWorld（写 SQLite，同一事务）
  → buildGameView（World → GameView）
  → 返回 GameView → React 渲染
```

- **Server Action 是唯一权威入口**：客户端只渲染，不执行游戏逻辑
- **事务完整性**：读→算→写必须在同一个 `prisma.$transaction` 内完成，任一异常自动回滚
- **状态分类**：L1 World / L2 URL / L3 useState / L4 useState 四层管理

---

## 测试

```bash
# 单元测试（83 个，覆盖 domain 纯函数 + View Builder）
bun run test

# E2E 测试（4 个场景，需先初始化测试数据库）
DATABASE_URL="file:./prisma/e2e-test.db" bunx prisma db push
bunx playwright test
```

---

## 开发规范

- **严格 TypeScript**：`strict: true`。禁止 `any` 类型
- **Domain 错误处理**：领域层抛 `DomainError(code)`，`lib/domain-errors.ts` 映射为中文消息
- **文件命名**：`game/domain/` 用 kebab-case、`components/` 用 PascalCase、`game/application/` 用 `.usecase.ts` 后缀
- **测试覆盖**：Domain 纯函数和 View Builder 必须有单元测试

完整开发规范见：[`AGENTS.md`](AGENTS.md)

---

## 许可证

私有项目，仅用于原型验证。
