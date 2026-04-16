# 📋 页面重构完成指南

## 🎯 重构内容摘要

本次重构统一了 4 个内容页面（音乐、书籍、运动、网站）以及项目页面的布局和功能，采用了现代化的卡片网格设计和可点击详情页机制。

---

## 📂 新系统结构

### 1. **Content Collections** 系统
所有内容页面现在由 Astro 的 Content Collections 管理，位于 `src/content/` 目录：

```
src/content/
├── songs/              # 歌曲内容 (.md 文件)
├── books/              # 书籍内容 (.md 文件)
├── sports/             # 运动内容 (.md 文件)
├── websites/           # 网站内容 (.md 文件)
└── projects/           # 项目内容 (.md 文件)
```

### 2. **卡片组件** \- 统一设计
新建了 4 个卡片组件，支持点击跳转：

- `SongCard.astro` - 紫色主题，显示艺术家、评分、标签
- `BookCard.astro` - 蓝色主题，显示作者、阅读状态、进度条
- `SportCard.astro` - 橙色主题，显示运动统计、难度、地点
- `WebsiteCard.astro` - 青色主题，显示分类、描述、评分

### 3. **列表页面** \- 统一模式
所有列表页面采用相同的架构：

```
页面结构:
1. 页面标题 + 副标题
2. FilterTabs 筛选栏 (按分类/状态/标签)
3. 卡片网格 (响应式 1-3 列)
4. 客户端动态筛选
```

- `/music` → 按标签筛选
- `/books` → 按阅读状态筛选 (阅读中/已完成/计划阅读/已放弃)
- `/sports` → 按运动分类筛选 (有氧/力量/柔韧性等)
- `/websites` → 按网站分类筛选
- `/projects` → 按项目分类筛选 (网页/移动/桌面/其他)

### 4. **详情页** \- 统一排版

所有详情页都采用相同的设计语言：

```
布局特点:
✓ 白色圆角卡片背景 (card-base)
✓ 丝滑淡入动画 (fadeInUp @0.5s)
✓ 元数据展示卡片
✓ Markdown 内容渲染
✓ 评论系统支持
✓ 相关外部链接按钮
✓ 深色/浅色模式支持
```

动画细节：
- 卡片本体：`fadeInUp 0.5s ease-out`
- 评论区域：延迟 `0.1s` 的 `fadeInUp`

---

## 🚀 如何添加新内容

### 添加歌曲

创建 `src/content/songs/song-name.md`：

```markdown
---
title: "歌曲名称"
artist: "艺术家"
album: "专辑名"
cover: "/images/songs/cover.webp"
link: "https://music.example.com"
tags: ["Pop", "Favorite"]
rating: 5
addDate: 2026-04-16
description: "歌曲描述"
---

## 关于这首歌

这是歌曲的详细内容...
```

### 添加书籍

创建 `src/content/books/book-name.md`：

```markdown
---
title: "书名"
author: "作者"
cover: "/images/books/cover.webp"
status: "completed"  # reading/completed/planned/abandoned
rating: 4.5
pages: 300
readPages: 300
category: "Fiction"
publishDate: 2024-01-01
readDate: 2026-04-16
tags: ["Fiction"]
publisher: "出版社"
link: "https://example.com"
---

## 书籍简介

书籍详细内容...
```

### 添加运动记录

创建 `src/content/sports/activity-name.md`：

```markdown
---
title: "晨跑"
category: "cardio"  # cardio/strength/flexibility/ball/outdoor/other
duration: 30
distance: 5.2
calories: 350
difficulty: "medium"  # easy/medium/hard
location: "公园"
date: 2026-04-16
image: "/images/sports/run.webp"
tags: ["Running", "Morning"]
---

## 运动记录详情

运动的详细信息和感受...
```

### 添加网站

创建 `src/content/websites/site-name.md`：

```markdown
---
title: "网站名称"
url: "https://example.com"
description: "网站描述"
icon: "/images/websites/icon.webp"
category: "工具"
tags: ["生产力", "推荐"]
rating: 4.5
addDate: 2026-04-16
useFrequency: "daily"  # daily/weekly/monthly/rarely
---

## 网站介绍

网站的详细介绍...
```

### 添加项目

创建 `src/content/projects/project-name.md`：

```markdown
---
title: "项目名"
description: "项目简介"
image: "/images/projects/project.webp"
category: "web"  # web/mobile/desktop/other
techStack: ["Astro", "React", "TypeScript"]
status: "completed"  # completed/in-progress/planned
startDate: 2024-01-15
endDate: 2024-06-30
featured: true
tags: ["Web", "Open Source"]
liveDemo: "https://demo.example.com"
sourceCode: "https://github.com/user/project"
visitUrl: "https://example.com"
---

## 项目概述

项目的详细描述...
```

---

## 🎨 卡片信息字段对比表

| 字段 | 歌曲 | 书籍 | 运动 | 网站 | 项目 |
|------|------|------|------|------|------|
| 标题 | ✓ | ✓ | ✓ | ✓ | ✓ |
| 图片 | ✓ (cover) | ✓ (cover) | ✓ (optional) | ✓ (icon) | ✓ (image) |
| 评分 | ✓ | ✓ | ✗ | ✓ | ✗ |
| 分类标签 | ✓ (tags) | ✓ (tags) | ✓ (分类) | ✓ (分类) | ✓ (分类) |
| 状态指示 | ✗ | ✓ (status) | ✓ (难度) | ✓ (使用频率) | ✓ (状态) |
| 统计数据 | ✗ | ✓ (阅读进度) | ✓ (时长/距离/卡路里) | ✗ | ✗ |
| 外部链接 | ✓ | ✓ | ✗ | ✓ | ✓ (多个) |

---

## 🔄 页面路由对应表

| 页面 | 列表页面 | 详情页路由 | 数据源 |
|------|---------|----------|-------|
| 音乐 | `/music` | `/music/[slug]/` | `src/content/songs/` |
| 书籍 | `/books` | `/books/[slug]/` | `src/content/books/` |
| 运动 | `/sports` | `/sports/[slug]/` | `src/content/sports/` |
| 网站 | `/websites` | `/websites/[slug]/` | `src/content/websites/` |
| 项目 | `/projects` | `/projects/[slug]/` | `src/content/projects/` 或 `src/data/projects.ts` |

---

## 💡 功能特点

### ✨ 卡片网格
- **响应式布局**: 1 列 (移动) → 2 列 (平板) → 3 列 (桌面)
- **悬停效果**: 卡片向上浮起，阴影增加 (hover:shadow-xl hover:-translate-y-1)
- **图片缩放**: 悬停时图片放大 (group-hover:scale-105)
- **动画淡入**: 卡片页面加载时 0.5s 内淡入

### 🔍 FilterTabs 筛选
- **动态标签**: 根据数据自动生成筛选选项
- **计数显示**: 每个标签旁显示对应数量
- **客户端筛选**: 快速响应，无需页面刷新
- **持久状态**: 字段更改时实时筛选

### 📱 详情页
- **完整体验**: 标题、图片、元数据、Markdown 内容、评论
- **美观排版**: 白色圆角卡片背景，适配深色模式
- **动画过渡**: 丝滑的淡入动画，提升用户体验
- **评论系统**: 支持用户评论和互动

---

## 🎯 页面特色说明

### 学习记录页 与 新页面的对齐

新的详情页排版参考了学习记录的设计：

```css
/* 共同的排版元素 */
.card-base {
    /* 白色圆角卡片背景 */
    background-color: rgb(248, 250, 252);
    border-radius: var(--radius-large);
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(24px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fadeInUp {
    animation: fadeInUp 0.5s ease-out forwards;
}
```

---

## 🔨 自定义筛选脚本

每个列表页面下都有对应的筛选脚本，支持：

```javascript
// music.astro 中的标签筛选示例
document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll("[data-filter-value]");
    const cards = document.querySelectorAll("#music-grid > div[data-tags]");

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const filterValue = button.getAttribute("data-filter-value");
            const isAll = filterValue === "all";

            cards.forEach((card) => {
                if (isAll) {
                    card.style.display = "";
                } else {
                    const tags = JSON.parse(card.getAttribute("data-tags") || "[]");
                    card.style.display = tags.includes(filterValue) ? "" : "none";
                }
            });
        });
    });
});
```

---

## 📝 内容维护建议

1. **更新频率**: 定期为各类内容添加 Markdown 文件
2. **文件命名**: 使用英文 kebab-case 格式，如 `morning-run` 或 `my-favorite-song`
3. **图片管理**: 在 `public/images/` 下建立对应分类文件夹存放图片
4. **标签管理**: 建立标签规范，保持跨页面的一致性
5. **SEO 优化**: 在 Markdown 前置数据中填写完整的标题和描述

---

## 🚀 部署注意事项

1. **构建步骤**:
   ```bash
   pnpm install
   pnpm build
   ```

2. **静态文件扫描**: Content Collections 会自动扫描 `src/content/` 下的所有 Markdown 文件

3. **错误排查**:
   - 检查 YAML 前置数据格式（尤其是日期格式：YYYY-MM-DD）
   - 确保字段类型匹配 schema 定义
   - 检查 Markdown 文件编码为 UTF-8

---

## 📞 常见问题

**Q: 如何修改卡片的颜色主题？**
A: 各卡片组件中的颜色类在顶部定义，可自行调整。例如 SongCard 使用 `purple-500`，BookCard 使用 `blue-500`。

**Q: 详情页可以添加自定义内容吗？**
A: 可以，在对应的 Markdown 文件中自由编写，支持完整的 Markdown 语法和 HTML。

**Q: 如何创建新的筛选维度？**
A: 修改对应页面的筛选逻辑，改变 `data-attribute` 和筛选算法即可。

**Q: 可以删除卡片上的某些元素吗？**
A: 可以，卡片组件使用条件渲染，如果 frontmatter 中没有某个字段，该元素不会显示。

---

祝你使用愉快！✨
