---
status: draft
last_verified: 2026-06-25
---

# 数据流

**关联规则：** R3, R5

---

## 核心数据流

所有游戏操作遵循同一数据流：

```
用户操作（点击按钮、提交表单）
  │
  ▼
Server Action 被调用
  │
  ├── Step 1: loadWorld(tx)
  │   └── 从 SQLite 读取 JSON → parse → World
  │
  ├── Step 2: UseCase.execute(world, input)
  │   └── 纯函数计算 → newWorld
  │         ├── 校验（钱够吗？容量够吗？港口可达？）
  │         ├── 执行（扣金币、加货物、推进天数）
  │         └── 返回新 World
  │
  ├── Step 3: saveWorld(tx, newWorld)
  │   └── World → JSON string → SQLite upsert
  │
  ├── Step 4: buildGameView(newWorld)
  │   └── World → GameView（渲染快照）
  │
  └── 返回 GameView 给客户端
        │
        ▼
      React 重新渲染
```

## 为什么是 Server Action 权威（而不是客户端先算）

一个被明确否掉的设计是「客户端先算，再异步保存」：

```
用户点击 → 客户端执行逻辑 → 更新 UI → 异步保存到 SQLite
```

否掉的原因：**客户端状态与存档状态可能不一致。**

| 问题 | 客户端先算 | Server Action 权威 |
|---|---|---|
| UI 显示的钱和 SQLite 里的钱是否一致 | 概率性不一致（异步保存失败、浏览器崩溃、竞态条件） | **不可能不一致**（World = 唯一真相源） |
| 调试时查哪个 | 需要同时查客户端 store 和 SQLite，对不上定位困难 | 查 SQLite 就是全部事实 |
| 加新字段改几处 | store 类型 + 序列化 + SQLite 三处 | 只在 World 类型一处 |
| 浏览器崩溃 | 丢当前操作（客户端内存里的状态没了） | 不丢（SQLite 中是上一个完整状态） |

### Server Action 权威路径

```
用户点击
  ↓
Server Action
  ├── loadWorld(tx)          ← 从 SQLite 读权威状态
  ├── execute(world, input)  ← 纯函数计算
  ├── saveWorld(tx, newWorld)← 写回 SQLite（同一事务）
  ├── buildGameView(newWorld)← 构建渲染快照
  └── 返回 GameView          ← 客户端只渲染
```

这个路径对回合制策略游戏来说，100-200ms 的往返是可接受的。禁用按钮 + "处理中..." 足以覆盖等待期。

**决策记录：** `docs/adr/ADR-0001-server-action-as-entry-point.md`

## 事务边界

Step 1-3 必须在同一个 `prisma.$transaction` 内完成。

```
prisma.$transaction([
  loadWorld,    // 读
  execute,      // 计算（纯函数，不涉及数据库）
  saveWorld,    // 写
])
```

失败 → 自动回滚 → SQLite 保持上一个完整状态。

详见事务用法：`docs/guides/prisma-usage.md`

## 读操作的数据流

某些操作不需要写数据库（如查看港口信息、预览价格）。

```
用户操作
  │
  ▼
Server Action
  ├── loadWorld(tx)
  ├── buildGameView(world)
  └── 返回 GameView
```

不需要事务，不需要 execute。

## SQLite 的角色

SQLite 在整个流程中的角色仅限于：

1. **保存**：World JSON → SQLite row
2. **读取**：SQLite row → World JSON
3. **恢复**：启动时从 SQLite 重建游戏状态

SQLite 不参与：
- 业务规则判断
- 价格计算
- 实时状态管理

## 为什么 SQLite 只做持久化

| 方案 | 问题 |
|---|---|
| 用 SQL 查询做实时价格计算 | 业务逻辑泄漏到数据库层 |
| 把运行时状态也放 SQLite | 每次 UI 操作都回源查询，延迟不必要 |
| 在 SQLite 里维护 session/连接状态 | 单机游戏不需要这种复杂度 |

全部游戏规则在 `src/game/` 的纯函数中完成，SQLite 只负责把结果存下来。
