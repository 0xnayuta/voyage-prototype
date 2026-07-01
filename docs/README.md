---
status: approved
last_verified: 2026-06-25
---

# 文档目录

本文档库是整个项目的知识中心，面向人类开发者和 AI Agent。

---

## 目录结构

```
docs/
│
├── README.md               ← 本文档：总索引与使用说明
│
├── adr/                    ← 架构决策记录
├── architecture/           ← 系统架构设计
├── guides/                 ← 开发指引与规范
├── reference/              ← 调研与参考资料
├── specifications/         ← 功能规格说明
├── roadmap/                ← 项目规划与路线图
├── issues/                 ← 待解决与讨论中的问题
├── audits/                 ← 架构与代码审计记录
├── archive/                ← 废弃与历史文档
└── assets/                 ← 图片、图表等资源文件
```

---

## 在什么时候查阅什么文档

| 场景 | 查阅 |
|---|---|
| 了解项目整体目标和架构 | `../AGENTS.md`（架构宪法）→ `architecture/` |
| 了解某个功能的具体行为 | `specifications/` |
| 了解为什么做了某个技术决策 | `adr/` |
| 了解当前正在做什么、下一步做什么 | `roadmap/` |
| 需要遵循的开发规范 | `guides/` |
| 有未解决的技术争议 | `issues/` |
| 想了解历史方案为何被放弃 | `archive/` |

---

## 文档命名规范

所有文档名称使用小写字母 + 连字符（kebab-case）。

### 通用规则

- 文件扩展名：`.md`
- 分隔符：连字符 `-`
- 禁止使用空格、下划线、中文文件名

### 各目录专用命名规则

| 目录 | 命名格式 | 示例 |
|---|---|---|
| `adr/` | `ADR-NNNN-title.md` | `ADR-0001-use-sqlite.md` |
| `architecture/` | `topic.md` | `data-flow.md` |
| `guides/` | `topic.md` | `coding-standards.md` |
| `reference/` | `source-topic.md` | `qq-zongheng-sihai-analysis.md` |
| `specifications/` | `topic.md` | `trade-system.md` |
| `roadmap/` | `phase-N-title.md` 或 `YYYY-MM-topic.md` | `phase-1-mvp.md` |
| `issues/` | `YYYY-MM-DD-short-title.md` | `2026-06-25-price-formula-debate.md` |
| `audits/` | `YYYY-MM-DD-topic.md` | `2026-06-30-architecture-audit.md` |
| `archive/` | `deprecated-YYYY-MM-DD-topic.md` | `deprecated-2026-06-25-old-world-model.md` |
| `assets/` | 见下方说明 | `architecture-overview.png` |

### 资源文件（assets/）

- 图片：`kebab-case-name.png` / `.jpg` / `.svg`
- 图表源文件：`kebab-case-name.drawio` / `.excalidraw`
- 不限制目录深度，可按子主题组织

---

## 写作原则

1. **事实优先：** 陈述结论和理由，避免模糊表述
2. **可追溯：** 引用决策时标注 ADR 编号
3. **维护责任人：** 文档头部标注创建日期和最后修改日期
4. **保持精简：** 能引用架构宪法则不重复，能链接则不内联

---

## 维护约定

- `adr/` 中的条目一经批准不再修改（通过新 ADR 取代）
- `roadmap/` 随 Phase 推进更新，旧规划移入 `archive/`
- `issues/` 中问题解决后，将结论摘要记入 `adr/` 或 `specifications/`，问题文档移入 `archive/`
- `archive/` 只增不删：历史是有效参考
