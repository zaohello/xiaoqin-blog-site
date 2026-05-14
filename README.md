# 小勤的博客

这是基于 `Fuwari` 改成的中文博客项目，目标站点是 `blog.fanxiaoqin0852.com`。

当前方案是：

- 前台：`Fuwari`
- 后台：`Pages CMS`
- 部署：`Cloudflare Pages`
- 域名：`blog.fanxiaoqin0852.com`
- 邮箱：继续保留在根域名 `fanxiaoqin0852.com`

## 现在已经做好了什么

- 已切换到 `Fuwari` 作为前台底座
- 已改成中文站点信息
- 已迁入 4 篇中文示例文章
- 已保留分类、标签、封面、草稿、SEO 字段
- 已接入 `Pages CMS` 配置文件 `.pages.yml`
- 已把站点域名预设为 `https://blog.fanxiaoqin0852.com`
- 已确认生产构建通过

## 本地运行

首次安装依赖：

```powershell
corepack pnpm install
```

启动开发环境：

```powershell
corepack pnpm dev
```

如果默认端口被占用，可以这样启动：

```powershell
corepack pnpm dev --host 127.0.0.1 --port 4322
```

生产构建：

```powershell
corepack pnpm build
```

本地预览构建结果：

```powershell
corepack pnpm preview
```

## 内容目录

文章内容在这里：

```text
src/content/posts/
```

关于页内容在这里：

```text
src/content/spec/about.md
```

封面图和站点图片建议放这里：

```text
public/assets/
```

## 文章字段

目前每篇文章支持这些字段：

```yaml
title: 你好，博客
published: 2026-05-14T12:00:00Z
updated:
draft: false
featured: true
category: 建站
tags:
  - 博客
  - Astro
image: /assets/covers/hello-blog.svg
ogImage: /assets/covers/hello-blog.svg
description: 这是摘要
seoTitle: 你好，博客
seoDescription: 这是 SEO 描述
```

说明：

- `draft: true` 的文章不会显示在站点前台
- `featured: true` 的文章会排在更前面
- `image` 是文章封面
- `ogImage` 是分享图

## 以后怎么发文章

后续不用自己手改 Markdown，发文流程会是：

1. 打开 `Pages CMS`
2. 登录 GitHub
3. 选中这个博客仓库
4. 新建或编辑文章
5. 点保存 / 发布
6. `Cloudflare Pages` 自动重新部署

## 还没完成的外部步骤

代码和本地站已经准备好了，但这些属于平台侧操作，还需要继续做：

1. 创建你自己的 GitHub 仓库
2. 把当前项目推到那个仓库
3. 在 Cloudflare Pages 里连接 GitHub 仓库
4. 在 Pages CMS 里连接这个仓库
5. 绑定 `blog.fanxiaoqin0852.com`

详细步骤见：

- [docs/deploy-cloudflare-pages.md](./docs/deploy-cloudflare-pages.md)

## 说明

- 这是一个新的 `Fuwari` 版项目目录
- 旧的 `AstroPaper` 项目仍然保留在旁边，方便回退或对比
- 子域名部署不会主动去改根域名邮箱记录
