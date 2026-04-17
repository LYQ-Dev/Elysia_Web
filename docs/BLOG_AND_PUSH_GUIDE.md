# 博客写作与推送文件放置指南

本文档用于快速回答两个问题：

1. 我写不同栏目的内容时，文件到底该放哪里？
2. 我要推送上线时，哪些文件是必须改的，哪些是自动生成的？

适用仓库：Mizuki 当前工作区结构（2026-04）。

---

## 1. 一张表看懂所有栏目放置位置

| 栏目 | 页面路由 | 内容目录 | 推荐结构 | 备注 |
|---|---|---|---|---|
| 博客主文章 | `/posts/...` | `src/content/posts/` | `分类/条目目录/index.md` | 例如 `math/4-18/index.md` |
| 学习-数学 | `/learning/math/` | `src/content/posts/math/` | `4-18/index.md` | frontmatter 的 `category: math` |
| 学习-英语 | `/learning/english/` | `src/content/posts/english/` | `4-18/index.md` | frontmatter 的 `category: english` |
| 学习-专业课 | `/learning/major/` | `src/content/posts/408/` | `4-18/index.md` | 目录可叫 `408`，但 frontmatter 需要 `category: major` |
| 学习-择校 | `/learning/exam/` | 当前页面为静态页 | 暂无 content collection | 需要时可扩展为 posts 或独立 collection |
| 日记 | `/diary/` | `src/content/diary/` | `YYYY-MM-DD/index.md` + 图片同目录 | 图片在 frontmatter `images` 里写 `./1.jpg` |
| 歌曲 | `/music/` | `src/content/songs/` | `条目名/index.md` + 封面同目录 | 已支持本地封面 `cover: ./cover.webp` |
| 运动 | `/sports/` | `src/content/sports/` | `条目名/index.md` + 图片同目录 | 已支持本地图片 `image: ./run.webp` |
| 番剧 | `/anime/` | `src/content/anime/` | `条目名/index.md` + 封面同目录 | 已支持本地封面 `cover: ./cover.webp` |
| 书籍 | `/books/` | `src/content/books/` | `单文件 .md` | 当前详情路由仍按单段 slug，暂不建议改成 `目录/index.md` |
| 项目 | `/projects/` | `src/content/projects/` | `单文件 .md` | 同上，建议继续单文件 |
| 网站 | `/websites/` | `src/content/websites/` | `单文件 .md` | 同上，建议继续单文件 |
| 特殊页（关于/友链） | `/about/` `/friends/` | `src/content/spec/` | `about.md` `friends.md` | 特殊页面内容 |

---

## 2. 推荐目录模板

### 2.1 博客文章（学习记录也属于这类）

```text
src/content/posts/
  math/
    4-18/
      index.md
      cover.webp
```

说明：
- 图片可和 `index.md` 放同一目录。
- 文章内可用相对路径引用图片，例如 `![图](./cover.webp)`。

### 2.2 歌曲 / 运动 / 番剧（已统一为一条一个文件夹）

```text
src/content/songs/my-song/index.md
src/content/songs/my-song/cover.webp

src/content/sports/morning-run/index.md
src/content/sports/morning-run/run.webp

src/content/anime/my-anime/index.md
src/content/anime/my-anime/cover.webp
```

### 2.3 日记（推荐）

```text
src/content/diary/2026-04-18/index.md
src/content/diary/2026-04-18/1.jpg
src/content/diary/2026-04-18/2.jpg
```

frontmatter 示例：

```yaml
images: [./1.jpg, ./2.jpg]
```

说明：
- `pnpm dev` / `pnpm build` 前会执行脚本，将 `src/content/diary/` 下图片自动复制到 `public/diary-content/`。
- 所以日记图片的源文件应放在 `src/content/diary/日期目录/`，不需要手动维护 `public/diary-content/`。

---

## 3. 新建内容时最常用命令

### 3.1 新建博客文章（posts）

```bash
pnpm new-post -- math/4-18/index
```

会生成：

```text
src/content/posts/math/4-18/index.md
```

### 3.2 本地预览与检查

```bash
pnpm dev
pnpm check
```

---

## 4. 推送上线：你真正需要提交哪些文件

## 4.1 常规模式（最常用）

你只需要提交“内容源文件”：

- `src/content/**`
- `src/data/**`（如果你改了数据文件）
- `public/assets/**`（若封面图放公共目录）

然后推送代码仓库：

```bash
git add .
git commit -m "content: update"
git push
```

当前代码仓库的工作流文件：
- `.github/workflows/deploy.yml`

默认是代码仓库 push 到 `main` 后触发部署。

## 4.2 内容分离模式（content 仓库）

当前 `scripts/sync-content.js` 的同步映射是：

- `content/posts` -> `src/content/posts`
- `content/spec` -> `src/content/spec`
- `content/data` -> `src/data`
- `content/images` -> `public/images`

这意味着：
- 若你把 songs/sports/anime/books/projects/websites/diary 也放在独立 content 仓库，默认不会自动同步。
- 如需“所有栏目都走内容仓库”，要先扩展 `scripts/sync-content.js` 里的 `contentMappings`。

---

## 5. 推送到搜索引擎（可选）

如果你要做 IndexNow 提交：

1. 先构建，生成 sitemap：

```bash
pnpm build
```

2. 再提交：

```bash
pnpm submit
```

相关脚本：
- `scripts/indexnow-submit.js`

注意：
- 该脚本依赖 `.env` 中的 `INDEXNOW_KEY` 和 `INDEXNOW_HOST`。

---

## 6. 当前项目的关键约束（避免踩坑）

1. 专业课目录可用 `posts/408/...`，但 frontmatter 分类要写 `category: major`，否则不会出现在 `/learning/major/`。
2. songs/sports/anime 已支持 `条目目录/index.md`，并且详情 URL 已兼容目录结构。
3. books/projects/websites 当前仍建议单文件 `.md`，暂不建议直接改 `目录/index.md`。
4. 日记图片建议跟 `index.md` 同目录，并通过 `images: [./xx.jpg]` 引用。

---

## 7. 快速核对清单（每次发文前）

- [ ] 文件放在了正确栏目目录
- [ ] frontmatter 的 `category` 与栏目过滤规则一致
- [ ] 图片路径可访问（相对路径或绝对路径）
- [ ] `pnpm check` 通过（或至少本次改动无新增错误）
- [ ] 已 `git add/commit/push`

---

如果后续你希望“书籍/项目/网站”也统一成一条一文件夹结构，我可以再帮你一次性改路由和 slug 规则，做到所有栏目完全统一。