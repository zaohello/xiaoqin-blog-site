---
published: 2026-05-15T09:30:00Z
title: 为什么博客放在子域名上
slug: why-use-subdomain
featured: false
draft: false
category: 域名
tags:
  - 域名
  - 邮箱
  - Cloudflare
image: /assets/covers/subdomain-mail.svg
ogImage: /assets/covers/subdomain-mail.svg
description: 把博客放在 blog 子域名上，可以尽量把网站和域名邮箱隔离开，后续维护更省心。
seoTitle: 为什么博客放在子域名上
seoDescription: 从域名邮箱安全和后续维护的角度，记录为什么选择 blog 子域名来承载博客。
---

这次给博客选地址时，我最在意的一点其实不是“好不好看”，而是：**不要把现在正在用的域名邮箱弄坏。**

## 子域名为什么更稳

如果直接拿根域名去做博客，后面每次改解析、换部署方式、接入新服务时，都会更容易碰到邮箱相关记录。

而把博客放到 `blog.fanxiaoqin0852.com` 这种子域名上，好处会清楚很多：

- 邮箱继续留在根域名
- 博客单独解析
- 后面改站点时，不容易误碰邮件记录

## 对新手更友好

对小白来说，越少碰高风险配置越好。

子域名方案的好处不只是技术上更干净，也是在操作层面更安全。以后哪怕需要调整博客部署，通常也只需要盯着 `blog` 这一条记录看，不容易慌。

## 结论

如果根域名已经承担了邮箱、站点或别的用途，那博客优先放在子域名上，通常都是更稳的做法。
