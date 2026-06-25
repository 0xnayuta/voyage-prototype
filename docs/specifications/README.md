---
status: draft
last_verified: 2026-06-25
---

# 功能规格说明

## 用途

存放每个功能模块的规格定义，描述系统应该「做什么」和「表现为什么」。

包括：

- 功能输入、输出、边界条件
- 游戏规则的具体算法（如价格公式）
- 用户交互流程
- 状态转换规则
- 错误处理策略

## 与 architecture/ 的区别

| 本目录（specifications/） | architecture/ |
|---|---|
| 描述行为：做什么、规则是什么 | 描述结构：模块怎么分、数据怎么流 |
| 价格公式、买卖逻辑 | 数据流图、模块依赖 |

## 命名规范

```
kebab-case-topic.md
```

### 示例

```
trade-system.md
navigation-system.md
market-price-formula.md
save-system.md
```
