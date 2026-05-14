# Cloudflare Pages 部署步骤

这份文档只讲外部平台操作，默认代码已经在本地准备好了。

## 你最终要得到的结果

- 博客前台：`blog.fanxiaoqin0852.com`
- 发文后台：`Pages CMS`
- 根域名邮箱：继续留在 `fanxiaoqin0852.com`

## 第 1 步：创建你自己的 GitHub 仓库

建议在 GitHub 新建一个空仓库，例如：

- `fanxiaoqin-blog`

注意：

- 不要勾选自动生成 `README`
- 不要勾选 `.gitignore`
- 不要勾选 `License`

## 第 2 步：把本地项目推到 GitHub

在这个项目目录里执行：

```powershell
git remote remove origin
git remote add origin <你的 GitHub 仓库地址>
git add .
git commit -m "feat: initialize fuwari blog"
git push -u origin main
```

如果默认分支不是 `main`，把最后一行分支名改掉。

## 第 3 步：在 Cloudflare Pages 连接 GitHub 仓库

Cloudflare 官方文档：

- [Connect your Git repository](https://developers.cloudflare.com/pages/get-started/git-integration/)

大致步骤：

1. 登录 Cloudflare
2. 进入 `Workers & Pages`
3. 选择 `Create application`
4. 选择 `Pages`
5. 选择 `Connect to Git`
6. 连接 GitHub
7. 选择你刚创建的博客仓库

构建设置建议填：

- Framework preset: `Astro`
- Build command: `corepack pnpm build`
- Build output directory: `dist`

## 第 4 步：绑定子域名

Cloudflare Pages 官方文档：

- [Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)

大致步骤：

1. 打开刚创建的 Pages 项目
2. 进入 `Custom domains`
3. 添加 `blog.fanxiaoqin0852.com`
4. 按 Cloudflare 提示完成绑定

## 第 5 步：不要碰根域名邮箱记录

这一块最重要，只记住一条：

- 只处理 `blog.fanxiaoqin0852.com`

不要去改根域名 `fanxiaoqin0852.com` 已有的这些记录：

- `MX`
- `SPF`
- `DKIM`
- `DMARC`

也就是说：

- 博客是博客
- 邮箱是邮箱
- 两边尽量分开

## 第 6 步：连接 Pages CMS

Pages CMS 官方文档：

- [Quick start](https://pagescms.org/docs/quick-start/)

大致步骤：

1. 打开 Pages CMS
2. 用 GitHub 账号登录
3. 安装它的 GitHub App
4. 选择这个博客仓库
5. 打开内容管理界面

因为仓库里已经有 `.pages.yml`，它会识别出：

- 文章集合
- 关于页
- 文章字段

## 第 7 步：发第一篇正式文章

建议第一次先这样做：

1. 打开后台里的文章列表
2. 新建一篇文章
3. 填标题、摘要、分类、标签、封面
4. 保持 `draft: false`
5. 保存 / 发布
6. 等 Cloudflare Pages 自动部署完成
7. 打开 `blog.fanxiaoqin0852.com` 查看结果

## 常见提醒

- 如果后台发了文但前台没变化，先看 Cloudflare Pages 最近一次部署是否成功
- 如果子域名打不开，先看自定义域名绑定状态
- 如果邮箱异常，优先检查是不是误改了根域名邮件记录
- 如果 Pages CMS 看不到字段，先确认仓库里的 `.pages.yml` 已经推到了 GitHub
