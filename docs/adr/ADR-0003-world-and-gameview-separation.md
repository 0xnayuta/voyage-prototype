---
status: accepted
last_verified: 2026-06-25
---

# ADR-0003: Domain World 与 GameView 分离，View Builder 作为适配层

---

## 背景

Server Action 返回给 React 客户端的数据有两种设计方向：

1. **直接返回 World**：客户端拿到 Domain World 自己算 UI 需要的数据
2. **返回 GameView**：服务器算好 UI 需要的一切，客户端只渲染

核心问题是：**「UI 需要展示的数据」和「游戏事实」是否应该共享同一数据结构？**

---

## 备选方案

### 方案 A：直接返回 World，客户端自算

```
SQLite → World → 返回 → React 自己算港口视图、价格表、航线预估
```

优点：
- 数据「原始」，客户端自由组合

缺点：
- 计算逻辑（价格格式化、利润率、可达性判断）分散在客户端组件中
- 不同页面可能算出一致的结果（浮点精度、四舍五入策略）
- UI 改版时可能需要改 World 结构
- 客户端和服务端对同一概念可能有不同理解（什么是「可达港口」）

### 方案 B：World + GameView 分离（采纳）

```
SQLite → World → View Builder → GameView → React
```

```
World（Domain）     ← 只存游戏事实（需要存档的数据）
  │
  ▼
buildGameView(world)  ← View Builder（纯函数）
  │
  ▼
GameView（Render）  ← UI 所需的一切（不存档）
  │
  ▼
React 渲染
```

优点：
- World 只关心「游戏事实」，不关心 UI 如何展示
- 改 UI 布局、文案、颜色 → 只改 View Builder 和 React，不改 World，存档向前兼容
- 加新港口、新商品 → World 自动适配（新数据通过 View Builder 进入 GameView）
- 所有展示计算集中在 View Builder 中，一致性有保证
- View Builder 可独立单元测试

缺点：
- 多一层代码（View Builder）
- Server Action 中多一次函数调用

### 方案 C：胖 World（World 直接包含 UI 数据）

```
World {
  ...domain data
  displayPrices: { ... }     ← 算好的价格
  portDescriptionHtml: ...   ← 渲染好的港口描述
}
```

优点：
- 一次返回，客户端直接渲染

缺点：
- World 和 UI 耦合：改 UI 意味着数据迁移
- 存档体积膨胀（包含展示数据）
- 存档格式随 UI 版本变化，失去向前兼容性

---

## 决策

**采纳方案 B：Domain World 与 GameView 分离。**

### 理由

#### World 的稳定性优先

World 是存档格式。存档应该随着时间保持稳定。如果把 UI 展示数据塞进 World：

- 改 UI 意味着旧的存档格式不兼容
- 加新 UI 元素需要数据迁移
- World 类型因此膨胀

GameView 每次从当前 World 实时计算生成，不持久化。World 结构变了，View Builder 自动适配。不需要考虑 GameView 的数据迁移。

#### 聚焦「预览 vs 确认」原则

用户操作前的预览数据（预估利润、航行天数、价格比较）属于 GameView，不属于 World：

```
选中长崎（预览）                                     → useState（L3），不在 World
看到预估利润 + 航行天数                                → GameView 计算产物，不在 World
点击「确认出航」那一刻（currentPort = 长崎）            → World 更新
```

分界点在**确认动作**上。确认前的所有展示数据，由 View Builder 从当前 World 计算得出。

---

## 后果

### 正面

- World 类型定义清晰稳定，只包含需要存档的游戏事实
- GameView 类型随 UI 需求演进，不影响存档兼容性
- View Builder 是纯函数，可测试：`expect(buildHarborView(testWorld).portName).toBe("泉州")`
- 公式调整（航行速度、价格波动）只需改 View Builder 或 data 配置，World 不受影响

### 约束

- GameView 绝不进入 SQLite
- View Builder 是纯函数——不修改 World，不调用 Repository，不产生副作用
- 如果 React 需要渲染一个数据，但它在 View Builder 中计算不出来，说明这个数据不该存在

### GameView 的生命周期

```
生成：每次 Server Action 返回时由 buildGameView(world) 创建
消费：React 渲染
销毁：下一次 Server Action 返回新 GameView
持续：从不保存
```

---

## 参考资料

- `docs/architecture/view-builder-design.md` — View Builder 的具体接口和 GameView 类型
- `docs/specifications/world-definition.md` — World 只保存游戏事实
- `docs/guides/state-management.md` — L1-L4 状态分类，明确 GameView 不属于任何一层
