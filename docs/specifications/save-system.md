---
status: draft
last_verified: 2026-06-25
---

# 存档系统

**关联规则：** R9

---

## 设计决策

MVP 阶段采用 **Save + JSON 列** 模式，而非拆分大量业务表。

## Prisma 模型

```prisma
model Save {
  id        String   @id @default(uuid())
  slot      Int      // 存档位编号（0 = 自动存档，1-N = 手动档位）
  data      String   // JSON：整个 World 序列化
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 原因

| 考虑 | JSON 列 | 拆分业务表 |
|---|---|---|
| MVP 开发速度 | 快，一次定义，到处可用 | 慢，每个实体都要建表 + 迁移 |
| 架构变动成本 | 低，World 结构随意改 | 高，改字段要迁移 |
| 查询灵活性 | 差，无法 SQL 查 cargo | 好 |
| 数据完整性 | 应用层保证 | 数据库层保证 |

Phase 2 或 Phase 3 有明确需求（如数据分析、MOD 支持、云存档迁移）时再演进为关系表。

## 存档操作

### 读档（loadWorld）

```typescript
async function loadWorld(tx: PrismaTx): Promise<World> {
  const save = await tx.save.findUnique({ where: { slot: 0 } })
  if (!save) return createDefaultWorld()
  return JSON.parse(save.data) as World
}
```

### 存档（saveWorld）

```typescript
async function saveWorld(tx: PrismaTx, world: World): Promise<void> {
  await tx.save.upsert({
    where: { slot: 0 },
    update: { data: JSON.stringify(world) },
    create: { slot: 0, data: JSON.stringify(world) },
  })
}
```

## 存档时机

- 每次游戏操作（Buy / Sell / Travel / 等）执行成功后自动存档
- 所有写操作在同一个 `prisma.$transaction` 中完成
- 不存在「手动存档」之外的显式触发操作——每次操作即存档

## 存档位规划

| Slot | 用途 | MVP |
|---|---|---|
| 0 | 自动存档（每次操作后写入） | 实现 |
| 1-3 | 手动存档位 | Phase 2 |

## 未来演进

当以下任一条件满足时，考虑拆分为关系表：

- 需要 SQL 查询玩家统计数据（总利润、航行次数）
- 需要支持 MOD 系统，外部工具需要直接读写数据
- 存档体积超过合理范围
- 需要云存档增量同步
