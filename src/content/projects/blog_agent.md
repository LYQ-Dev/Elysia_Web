---
title: 学习笔记自动生成工具
description: 考研学习笔记与个人日记一键 AI 生成工具，支持自动归档和 Git 推送。
image: ""
category: web
techStack:
  - Node.js
  - JavaScript
  - Express
  - Git
  - AI API
status: in-progress
sourceCode: https://github.com/LYQ-Dev/blog_agent_git
startDate: 2026-04-19
featured: false
tags:
  - AI
  - Automation
  - Markdown
---

# 学习笔记自动生成工具

考研学习笔记 / 个人日记一键 AI 生成、自动归档、一键 Git 推送。

GitHub 仓库：[LYQ-Dev/blog_agent_git](https://github.com/LYQ-Dev/blog_agent_git)

## 功能

- 支持数学、英语、408 专业课、日记 4 种类型自动生成
- AI 自动扩写学习内容，输出标准 Markdown
- 按日期自动归档：月-日 目录结构
- 一键保存到本地 Astro 博客目录
- 一键 Git 提交 + 推送到远程仓库
- 浏览器自动下载 .md 文件

## 启动

```bash
npm install
node server.js
```
