# Didadi Brand Assets & Guidelines

此文件夹包含 Didadi 系统（及未来相关系统）的标准品牌资源。请遵循以下指南以保持品牌一致性。

## 资源清单 (Assets)

| 文件名 | 预览 (Preview) | 描述 (Description) | 推荐用途 (Usage) |
| :--- | :--- | :--- | :--- |
| **`logo-square.png`** | (Square Icon) | 方形图标，橙色 D 字母设计 | **Favicon** (浏览器标签页图标), **App Icon**, 或空间受限的场景。 |
| **`logo-full.png`** | (Full Logo) | 完整品牌标识 | **Web Header**, **Sidebar**, 登录页, 打印文档等正式场合。 |

## 使用指南 (Usage Guidelines)

### 1. 网页图标 (Favicon)

在 `index.html` 的 `<head>` 区域引用 `logo-square.png`。

```html
<!-- index.html -->
<head>
  <link rel="icon" type="image/png" href="/logo-square.png" />
  <!-- ... -->
</head>
```

### 2. 系统头部/侧边栏 (Header/Sidebar)

在应用程序的导航栏或侧边栏顶部，使用 `logo-full.png`。

**React 示例:**

```tsx
import logo from '../assets/branding/logo-full.png'; // 根据实际路径调整

function Sidebar() {
  return (
    <div className="sidebar-header">
      <img src={logo} alt="Didadi System" className="h-8 w-auto" />
    </div>
  );
}
```

### 3.  Theme Colors

*   **Do**: 浅色主题
*   **Do**: 选取主题颜色为橙色 (#FF6B00)。

---

> **Note for Developers**: 当启动新项目时，请将此文件夹中的资源复制到新项目的 `public` 或 `src/assets` 目录中，并参照上述规范使用。
