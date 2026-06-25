---
status: archived
last_verified: 2026-06-25
---

# 文档归档

## 用途

存放已废弃的方案、历史版本的文档、被取代的分析。

包括：

- 被新 ADR 取代的旧 ADR
- 已完成的 Phase 规划
- 已放弃的设计方案及放弃原因
- 早期的调研草稿（已有正式文档后）

## 为什么需要归档

废弃不是删除。保留废弃文档的原因是：

1. 未来可能有人提出类似方案，归档记录解释了为什么当时被否
2. 被否定的方案的论证过程本身有价值
3. 归档比 Git 历史更容易搜索

## 命名规范

```
deprecated-YYYY-MM-DD-original-title.md
```

### 示例

```
deprecated-2026-06-25-zustand-proposal.md
deprecated-2026-06-28-old-port-data-model.md
```

## 维护约定

- 归档文档只增不删
- 在文档开头标注被什么取代、为什么归档
- 归档目录不做深度分类，全部平铺
