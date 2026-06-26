---
status: current
last_verified: 2026-06-25
---

# 状态管理规范

**关联规则：** R7, R10

---

## 四层分类

状态按生命周期从长到短分为四层：

### L1: Domain State（游戏事实）

| 属性 | 说明 |
|---|---|
| 内容 | 金币、货物、船只、当前港口、世界天数 |
| 存放 | World（SQLite） |
| 特征 | 需要存档、影响游戏规则 |
| 管理 | 通过 Server Action 读写 |

### L2: Navigation State（导航状态）

| 属性 | 说明 |
|---|---|
| 内容 | 当前页面、商品分类筛选 |
| 存放 | URL（路由 或 searchParams） |
| 特征 | 刷新后应保留、允许书签、允许深链接 |
| 管理 | 通过 `<Link>`、`useRouter`、`useSearchParams` |

### L3: Interaction State（交互状态）

| 属性 | 说明 |
|---|---|
| 内容 | 选中的商品、输入的数量、选中的目标港口、弹窗开关 |
| 存放 | 组件内 `useState` |
| 特征 | 刷新丢失不影响游戏、不参与游戏规则 |
| 管理 | 局部 state |

### L4: Visual State（纯视觉状态）

| 属性 | 说明 |
|---|---|
| 内容 | Toast 显示、Tooltip 展开、动画播放 |
| 存放 | 组件内 `useState` |
| 特征 | 生命周期极短（通常 < 1 秒） |
| 管理 | 局部 state |

## 决策公式

遇到新状态不知道放哪时，按顺序问：

```
Q1: 存档时要不要保存？
  ├── 是 → L1 World（SQLite）
  └── 否 → Q2

Q2: 刷新页面后要不要恢复？
  ├── 是 → L2 URL
  └── 否 → Q3

Q3: 只是当前操作过程中的临时选择？
  ├── 是 → L3 useState (Interaction)
  └── 否 → L4 useState (Visual)
```

## 示例对照表

| 状态 | 层级 | 存放位置 | 理由 |
|---|---|---|---|
| 金币数量 | L1 | World | 存档必须保留 |
| 当前港口 ID | L1 | World | 影响价格、航线计算 |
| 船舱货物列表 | L1 | World | 游戏事实 |
| 当前在哪个页面 | L2 | URL 路由 | 刷新后应回到同页 |
| 商品分类筛选 | L2 | URL searchParams 或 useState | 取决于 UX 需求 |
| 选中了哪个商品 | L3 | useState | 临时选择 |
| 购买数量输入 | L3 | useState | 临时输入 |
| 预览中的目标港口 | L3 | useState | 未确认，不属游戏事实 |
| 是否显示购买弹窗 | L3 | useState | UI 交互 |
| Toast 提示 | L4 | useState | 纯视觉表现 |
| Tooltip 展开 | L4 | useState | 纯视觉表现 |

## Zustand 规则

### MVP 阶段

**禁止引入 Zustand。**

原因：

- 没有需要跨组件共享的客户端状态（World 由 Server Action 返回）
- 所有 L1 状态在 SQLite 中，通过 Server Action 访问
- 所有 L2 状态在 URL 中
- 所有 L3/L4 状态在 `useState` 中
- Zustand 的成本（引入依赖、学习成本、维护成本）超过其收益

### 未来可能引入 Zustand 的条件

- 出现实时地图（需要每秒更新位置）
- 出现大量跨组件状态共享
- 出现复杂动画系统
- 出现需要频繁更新的客户端独有状态（非 Server Action 返回）

届时重新评估。
