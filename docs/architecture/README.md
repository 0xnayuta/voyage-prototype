---
status: draft
last_verified: 2026-06-25
---

# 系统架构设计

## 用途

存放项目的系统架构设计文档，包括：

- 整体架构概览
- 模块划分与依赖关系
- 数据流图
- 运行时架构
- 关键交互流程

## 边界

本目录描述「系统如何组织」，功能行为定义在 `specifications/`。

例如：

- `data-flow.md` — 用户操作从点击到存档的完整链路 → 在本目录
- `trade-system.md` — 买卖功能的输入、输出、规则 → 在 `specifications/`

## 命名规范

```
kebab-case-topic.md
```

### 示例

```
data-flow.md
module-dependencies.md
server-action-pipeline.md
```

## 本目录文档与 AGENTS.md 的关系

`../AGENTS.md`（架构宪法）是最高层级的设计总纲。

本目录的文档是宪法中每条原则的展开和细化。
