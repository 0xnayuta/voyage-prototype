---
status: draft
last_verified: 2026-06-25
---

# 项目规划与路线图

## 用途

存放项目各阶段的目标、任务分解、版本发布计划。

包括：

- Phase 目标定义
- 任务清单与优先级
- 完成标准（Definition of Done）
- 版本路线图

## 命名规范

路线图有两种文档类型：

### Phase 规划文档

用于定义某个开发阶段的具体目标。

```
phase-N-short-title.md
```

| 部分 | 说明 | 示例 |
|---|---|---|
| `N` | 阶段序号 | `1` |
| `short-title` | 阶段主题 | `mvp-core-loop` |

示例：

```
phase-1-mvp-core-loop.md
phase-2-combat-and-quests.md
```

### 时间线文档

用于记录某个月份的计划或回顾（可选）。

```
YYYY-MM-topic.md
```

示例：

```
2026-07-plan.md
2026-Q3-roadmap.md
```

## 维护约定

- 当前进行中的 Phase 文档保持在顶层
- 已完成的 Phase 文档移入 `../archive/`
- 已取消的计划标注原因后移入 `../archive/`
