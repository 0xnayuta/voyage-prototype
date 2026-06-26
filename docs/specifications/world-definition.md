---
status: current
last_verified: 2026-06-25
---

# World 定义

**关联规则：** R2

---

## World 是什么

World 是游戏事实（Game Facts）的集合。

World 是存档的全部内容。每次存档时，整个 World 序列化为 JSON 写入 SQLite。

## World 包含的内容

```typescript
interface World {
  player: {
    name: string
    gold: number
    currentPortId: string
    day: number
  }
  ship: {
    typeId: string
    upgradeLevel: number
    cargo: CargoItem[]
  }
  // 后续 Phase 增加：
  // quests: QuestState[]
  // worldEvents: WorldEventState[]
}

interface CargoItem {
  goodId: string
  quantity: number
  buyPrice: number  // 每单位买入价，用于计算利润
}
```

## World 不包含的内容

- UI 状态（当前打开的面板、弹窗）
- 交互状态（当前选中的商品、输入框值）
- 视觉状态（Toast、Tooltip、动画）
- 临时选择（预览中的目标港口、选中的分类筛选）
- 渲染所需的计算产物（预估利润、预计航行天数）

详见状态分类：`docs/guides/state-management.md`

## 原则

World = 存档内容 = 游戏事实。

如果一个数据在「关闭页面重新加载」后不需要恢复，它不属于 World。

如果一个数据是「用户正在看什么、正在选什么、正在输入什么」，它不属于 World。
