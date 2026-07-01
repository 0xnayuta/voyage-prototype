---
status: approved
last_verified: 2026-06-25
---

# 文档资源文件

## 用途

存放文档中引用的图片、图表、流程图、原型图、示意图等资源文件。

包括：

- 架构图、数据流图
- UI 原型截图或线框图
- 流程图（作为图片引用）
- 其他文档中使用的插图

## 目录约定

不限制深层目录结构，可按主题组织。

```
assets/
├── architecture/      ← 架构图
├── ui/                ← 界面截图与原型
├── flow/              ← 流程图
└── ...
```

## 命名规范

```
kebab-case-name.extension
```

### 示例

```
data-flow-overview.png
trade-system-flowchart.svg
harbor-view-mockup.png
```

## 源文件管理

建议保留可编辑的源文件（`.drawio`、`.excalidraw`、`.figma` 链接等），方便后续修改。

源文件与导出图片放在同一目录，文件名相同仅扩展名不同。

```
data-flow-overview.png     ← 导出的图片
data-flow-overview.drawio  ← 可编辑的源文件（如有）
```

## 引用方式

在 Markdown 文档中引用资源时使用相对路径：

```markdown
![数据流概览](../assets/architecture/data-flow-overview.png)
```
