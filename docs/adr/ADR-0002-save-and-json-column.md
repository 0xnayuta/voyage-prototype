---
status: accepted
last_verified: 2026-06-25
---

# ADR-0002: MVP 阶段采用 Save + JSON 列模式

---

## 背景

游戏状态需要持久化到 SQLite。有两种建模方式：

1. **细粒度关系表**：为 Player、Ship、Cargo、PortMarket 等每个实体建表
2. **Save + JSON 列**：一个 `save` 表，整个 World 序列化为 JSON 存入单一列

---

## 备选方案

### 方案 A：细粒度关系表

```prisma
model Player {
  id       String @id
  gold     Int
  portId   String
  day      Int
}

model Cargo {
  id       String @id
  playerId String
  goodId   String
  quantity Int
  buyPrice Int
}

model Ship { ... }
model PortMarket { ... }
```

优点：
- 可用 SQL 查询（统计总利润、航行次数）
- 数据库层保证数据完整性
- 便于外部工具直接操作数据

缺点：
- 每个实体增减字段都需要 Prisma migration
- World 结构频繁变动的 MVP 阶段，迁移成本高
- 多个表的原子写入需要跨表事务，代码复杂度增加
- 新增游戏功能需要同步建表 + migration + 类型定义

### 方案 B：Save + JSON 列

```prisma
model Save {
  id        String   @id @default(uuid())
  slot      Int
  data      String   // JSON: 整个 World 序列化
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

优点：
- 一次定义，任何 World 字段变更都不需要改 schema
- World 结构自由演进，不影响存档兼容性
- 读/写各一个函数（loadWorld / saveWorld），事务简单
- 新增游戏功能只需改 TypeScript 类型

缺点：
- 无法用 SQL 查询 cargo 等内部数据
- 数据完整性由应用层保证
- JSON 列体积随游戏状态增长，后续可能达到性能瓶颈

---

## 决策

**采纳方案 B：Save + JSON 列模式。**

### 理由

MVP 阶段的核心目标是**快速验证核心循环**，World 结构可能每周都在变：

- 今天 gold 是 number，明天可能加一个 goldHistory 数组
- 今天 cargo 是数组，明天可能按商品分类嵌套
- 今天一个 `save` 表结构永远不动

这种变动速度下，方案 A 的每次 migration 都在拖慢迭代。方案 B 让类型定义成为唯一需要维护的地方。

> 「先跑通，再优化。」

当需求稳定、World 结构不再频繁变动时，再迁移到细粒度关系表。

---

## 后果

### 正面

- MVP 阶段不需要写任何 Prisma migration（初始 schema 创建后就不再动）
- World 的 TypeScript 类型定义是事实上的 schema，改类型 = 改逻辑 = 改存档格式
- 学习成本低：新开发者看到的就是 `loadWorld` / `saveWorld` 两个函数

### 约束

- 永远不直接手写或修改 SQLite 中的 JSON——通过 Server Action + `saveWorld` 写入
- JSON 列内的数据完整性由 Domain 层的类型定义和校验保证
- 禁止在 SQLite 层面做业务查询（如 SELECT cargo FROM save WHERE ...）

### 后续切换条件

当以下任一条件满足时，考虑拆分为关系表：

1. 需要 SQL 查询玩家统计数据（总利润、航行次数）
2. 需要支持 MOD 系统，外部工具需要直接读写数据
3. 存档体积超过合理范围（如 > 1MB）
4. 需要云存档增量同步

新表创建后，旧 JSON 列可保留作为迁移数据源，或通过一次性的转换脚本迁移。

---

## 参考资料

- `docs/specifications/save-system.md` — 存档系统的具体实现
- `docs/guides/prisma-usage.md` — Prisma 使用规范
- `docs/specifications/world-definition.md` — World 类型定义
