---
status: current
last_verified: 2026-06-25
---

# Prisma 使用规范

**关联规则：** R3, R5

---

## Prisma 单例

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

## 事务模板

所有写操作必须遵循以下模板：

```typescript
export async function someAction(formData: FormData) {
  return await prisma.$transaction(async (tx) => {
    // 1. 读档
    const world = await loadWorld(tx)

    // 2. 执行游戏逻辑（纯函数）
    const newWorld = executeSomeLogic(world, input)

    // 3. 保存
    await saveWorld(tx, newWorld)

    // 4. 构建 GameView
    return buildGameView(newWorld)
  })
  // 任何一个步骤抛出异常 → 事务自动回滚
  // SQLite 始终处于上一个完整状态
}
```

## 原则

### 单个事务原则

- 一个用户操作 = 一个事务
- 事务内只包含：读 → 计算 → 写
- 禁止在一个操作中拆分成多个事务

### 禁止的写法

```typescript
// ❌ 禁止：多个独立写入
await savePlayer(tx, player)
await saveCargo(tx, cargo)
await saveShip(tx, ship)

// ✅ 正确：写入世界整体
await saveWorld(tx, world)
```

### Repository 层约束

- Repository 方法只做 CRUD，不做业务判断
- Repository 不抛业务异常（如「余额不足」），只处理数据库异常
- 业务校验在 Domain 层完成

## 迁移工作流

```bash
# 修改 schema.prisma 后
npx prisma migrate dev --name describe-change

# 生产构建
npx prisma migrate deploy
```

## 为什么不是每个 Model 一个 Repository

MVP 采用 Save + JSON 列模式，只有一个 `save` 表。

一个 Repository = `loadWorld` + `saveWorld` 两个方法。

不需要为 Player、Cargo、Ship 分别建 Repository——它们都在 World 的 JSON 里。

当未来拆分业务表时，再按标准 Prisma 实践为每个 Model 建 Repository。
