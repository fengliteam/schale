---
title: "从Hexo到Astro博客1分钟迁移指南"
categories: Share
tags: ["Hexo", "Astro", "静态博客", "迁移"]
id: "hexo-to-astro-1-minute-migration-guide"
date: 2025-04-07 17:20:46
cover: "https://i0.wp.com/uxiaohan.github.io/v2/2025/04/1744018738123.webp"
recommend: false
---

:::note{type="info"}
🎉 本文将介绍如何将 Hexo 博客迁移到 Astro 博客，只需要 1 分钟即可完成！

作为 `Hexo` 的长期用户，我在 2024 年开始尝试 `Astro`，`Hexo` 基于模板引擎（EJS/Swig）的字符串拼接，而 `Astro` 采用基于 `Vite` 的组件化构建体系。`Hexo` 在 `hexo generate` 时完成全量渲染，`Astro` 在 `astro build` 时执行 `SSG`（静态站点生成）+ `ISR`（增量静态再生）。

`Astro` 的组件化架构、按需加载，构建速度、`Vite` 驱动，热更新速度快等现代化开发体验 深深吸引了我！
:::

### 项目结构对比

| Hexo         | Astro            | 说明         |
| ------------ | ---------------- | ------------ |
| \_config.yml | src/config.ts    | 配置文件     |
| source       | src/content/blog | 主内容目录   |
| themes       | src/components   | 组件目录     |
| public       | public           | 静态资源目录 |

## 迁移步骤详解

### 1. 初始化 Astro 项目

```bash
# 创建美妙的 Astro 项目
npm create astro@latest --template uxiaohan/vhAstro-Theme astro-blog
# 进入项目目录
cd astro-blog
# 安装依赖
npm install
# 本地预览
npm run dev
```

### 迁移文章内容

:::note{type="success"}
将 `Hexo` 博客的 `src/_posts/` 目录下的文章文件，复制到 `Astro` 的 `src/content/blog/` 目录下即可，然后自定义 `src/config.ts` 配置文件去自定义博客。

⚠️ `Hexo` 的部署、使用、自动化部署等方法 完全适用于 `Astro` 博客！

🎉 此时，你已成功迁移 Hexo 博客至 Astro 博客！
:::

### Vercel 自动部署

::btn[Vercel 一键部署]{link="https://vercel.com/new/clone?repository-url=https://github.com/uxiaohan/vhAstro-Theme"}

### Cloudflare Pages 自动部署

::btn[Cloudflare Pages 一键部署]{link="https://dash.cloudflare.com/?to=/:account/workers-and-pages/create/deploy-to-workers&repository=https://github.com/uxiaohan/vhAstro-Theme" type="warning"}

其他更多部署方式（简简单单闭眼部署），请参考 [Astro 官方文档](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)。

### 迁移后性能对比

| 指标            | Hexo  | Astro | 提升 |
| --------------- | ----- | ----- | ---- |
| 构建时间        | 12.3s | 5.1s  | 58%↑ |
| Lighthouse 性能 | 89    | 100   | 12%↑ |
| 页面大小        | 145KB | 23KB  | 84%↓ |

### 总结

迁移到 Astro 后，我的技术博客实现了：

- ✅ 构建速度提升 2.4 倍
- ✅ 页面性能评分全满分
- ✅ 开发体验现代化
- ✅ 扩展能力显著增强
