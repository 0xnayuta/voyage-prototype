# Code Review: origin/master → master

## Summary

**8/8 reviewers completed.** 79 unit tests pass. Full game loop E2E verified.

---

## Findings by Priority

### P1 — Must fix before next commit

| # | File | Issue |
|---|------|-------|
| 1 | `src/game/domain/voyage.ts:83-104` | `generateVoyageEvents` 使用顺序 `break`，导致事件概率偏斜。模板[N] 只有当前 N-1 个全部失败才会触发，stated 5%的事件实际约 2.5%。需改为加权随机选择。 |
| 2 | `src/app/actions/trade.ts:15-37` | `Number(formData.get("quantity"))` 产生 `NaN` 时，`NaN <= 0` 为 false，绕过校验。`executeBuy`/`executeSell` 因此算出 NaN 数量/价格，污染存档数据。 |
| 3 | `src/app/navigation/page.tsx:99-108` | 出航确认按钮的 `isPending` 来自 `loadNavigationView` 的 `useActionState`，而不是 `startTravel` 的。发送航行中按钮不 disabled，可双击重复提交。 |
| 4 | `src/game/view-builder/buildGameView.ts:150-163` | `buildShipView` 未检查 `world.voyage`，航行中 `canUpgrade` 仍为 true，UI 显示可升级，点按后从域层抛出"航行中无法升级"错误。 |
| 5 | `docs/roadmap/phase-1-mvp.md:129` | Phase 1.2 标题标注"计划中"，但全部功能已实现验证。 |
| 6 | `docs/roadmap/phase-1-mvp.md:262-272` | 完成标准复选框仍是 `[ ]`，已实现的功能应标为 `[x]`。 |
| 7 | `src/game/view-builder/__tests__/buildGameView.test.ts:3-9` | `buildVoyageView` 无测试覆盖。 |

### P2 — Should fix before next release

| # | File | Issue |
|---|------|-------|
| 8 | `src/game/domain/types.ts:8-10` | `GoodId` 单行包装类型从未被引用，应删除。 |
| 9 | `src/data/goods.ts:46-52` | `timber`（木材）类别为 `'food'`，应改为 `'metal'` 或其他合理类别。 |
| 10 | `src/game/domain/voyage.ts:135-151` | `applyVoyageEvents` 中，`event.cargoLoss` 超过选中货物数量时，超出的丢失量被静默丢弃。 |
| 11 | `src/game/view-builder/buildGameView.ts:99` | `NavigationView` 的 `estimatedProfit` 被 `Math.max(0, …)` 截断，亏损航线的负利润不展示。 |
| 12 | `src/app/actions/save.ts:12-14` | 所有只读 `load*` 操作不必要地包裹在 `prisma.$transaction` 中，应直接传入 `prisma`。 |
| 13 | `src/app/market/page.tsx:27-37` | `doBuy` 使用 `try { … } finally { … }` 无 `catch`，服务器错误被静默吞掉。 |
| 14 | `src/app/cargo/page.tsx:25-34` | `doSell` 同上，无错误处理。 |
| 15 | `src/app/page.tsx:26-31` | `doNewGame` 同上，无错误处理。 |
| 16 | `docs/roadmap/phase-1-mvp.md:130-203` | Phase 1.2 引用已过期的文件路径和函数名。 |

### P3 — Low priority

| # | File | Issue |
|---|------|-------|
| 17 | `src/game/domain/market.ts:42-49` | `getCurrentPrice` 对未知港口/商品返回 0（静默失败），建议 throw。 |
| 18 | `src/app/voyage/page.tsx:109-111` | 事件列表 key 仅截取描述前 8 字符，同日前 8 字相同的事件会造成 key 冲突。 |

---

## Clean findings (no issues)

| Module | Verdict |
|--------|---------|
| Domain unit tests | ✅ 79/79 pass, 覆盖充分 |
| Infrastructure (Prisma, lib, configs) | ✅ 结构正确，适配器模式正确，迁移锁文件无误 |
