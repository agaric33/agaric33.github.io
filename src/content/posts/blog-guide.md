---
title: rica-blog 使用指南
date: 2026-08-04
lastMod: 2026-08-05
summary: 这是一个使用 rica-blog 模版搭建的博客。本文将介绍如何使用模版进行开发并在github上部署，分析可能遇到的问题并给出解决方案。
category: 实操教程
tags: [Astro, guide, icon]
sticky: 1
---

## 前置条件

开发需要的前置条件。站主使用的版本如下，仅供参考。

| 配置/工具 | 版本                               | 作用                           |
| --------- | ---------------------------------- | ------------------------------ |
| node      | v22.23.1                           | 本项目推荐使用pnpm作为包管理器 |
| pnpm      | 11.20.0                            | 包管理器                       |
| vscode    | --                                 | 集成IDE，可以换成你常用的      |
| git       | git version 2.50.1 (Apple Git-155) | 版本管理工具                   |

## 安装步骤

### 克隆仓库

登录 Github 账号，打开 [agaric33/rica-blog](https://github.com/agaric33/rica-blog)，点击右上角的 Fork 按钮，将仓库克隆到你自己的账号下。

复制这个仓库的地址，打开终端，使用 `git clone` 命令将仓库克隆到本地。

### 安装依赖

```sh
cd rica-blog
npm install -g pnpm # 安装pnpm，如果已经安装可以跳过
pnpm install
```

根据recommend安装IDE插件`Astro`用于模版解析

### 命令介绍

本地运行

```sh
pnpm dev
```

打包静态文件

```sh
pnpm build
```

本地预览，打包完成后才能查看

```sh
pnpm preview
```

新建内容

```sh
pnpm new-friend # 新建友链，按照命令行提示输入即可
pnpm new-post # 新建时间为当地时间的md文件，内容为空
pnpm new-project # 新建项目，按照命令行提示输入即可
pnpm new-feeling # 新建随想，打开vim编辑器输入内容并新建
```

### 配置项

本项目中的绝大部分配置都定义在 `src/config.json` 文件中。

你应该首先将 `site.url` 修改成自己的域名，避免导航错误。

以下是配置项的说明：

```json
{
  "site": {
    "url": "", // 网站地址
    "title": "", // 网站标题
    "description": "", // 通用的网站描述 SEO
    "keywords": "", // 通用的网站关键词 SEO
    "lang": "zh-CN", // 网站的语言
    "favicon": "", // 浏览器图标，存放在 public 目录下
    "appleTouchIcon": "" // 苹果设备图标，存放在 public 目录下
  },
  "author": {
    "name": "", // 作者名称
    "twitterId": "", // 推特账号 ID，以 @ 开头，用于 Open Graph
    "avatar": "" // 作者头像地址
  },
  // 首页 Hero 组件
  "hero": {
    "name": "", // 显示的名称
    "bio": "", // 一句话介绍
    "description": "", // 补充描述
    // 社交账号
    "socials": [
      {
        "name": "", // 社交平台类型
        "icon": "", // 社交平台图标
        "url": "", // 链接
        "color": "", // 图标颜色
        "image": "", // 悬浮显示图片
        "text": "" // 悬浮显示文本
      }
    ],
    "yiyan": "" // 显示一言
  },
  "color": {
    // 强调色，请填写 16 进制颜色值。每次会从中随机取出一组
    "accent": [{ "light": "", "dark": "" }],
    // 背景色
    "bg": {
      "primary": { "light": "", "dark": "" },
      "secondary": { "light": "", "dark": "" }
    },
    // 文字颜色
    "text": {
      "primary": { "light": "", "dark": "" },
      "secondary": { "light": "", "dark": "" }
    },
    // 边框颜色
    "border": {
      "primary": { "light": "", "dark": "" }
    }
  },
  // 顶部导航栏
  "menus": [
    {
      "name": "首页",
      "link": "/",
      "icon": "icon-pantone"
    }
  ],
  "posts": {
    "perPage": 10 // 每一页显示的文章数量
  },
  "footer": {
    "startTime": "" // 博客网站开始时间 请使用 ISO 格式
  },
  // 赞助
  "sponsor": {
    "wechat": "" // 微信赞赏码图片地址
  },
  // 如果需要使用网站数据统计，将 enable 修改为 true，并填写对应的配置
  "analytics": {
    "enable": false,
    // https://analytics.google.com
    "google": {
      "measurementId": ""
    },
    // https://umami.is/docs
    "umami": {
      "serverUrl": "",
      "websiteId": ""
    },
    // https://clarity.microsoft.com/
    "microsoftClarity": {
      "projectId": ""
    }
  }
}
```

## 部署到github

当你完成本地开发，打包预览没有问题后，是时候进行部署了。这里只介绍最简单的部署到github上的操作。

1. 在你的github主页新建仓库`yourname.github.io`（就是一长串带.的名字），配置如下：

   | 配置                | 选项          | 说明           |
   | ------------------- | ------------- | -------------- |
   | Choose visibility * | public        | 必须设置为公开 |
   | Add README          | Off           | 保持仓库为空   |
   | Add .gitignore      | No .gitignore | 保持仓库为空   |
   | Add license         | No license    | 保持仓库为空   |

2. 将本地开发仓库的远程连接地址修改到新仓库

   ```bash
   git remote set-url origin https://github.com/yourname/yourname.github.io.git
   git remote -v #验证远程仓库地址
   ```

3. 在`.github/workflows`下新建脚本`deploy.yml`，这样当你每次使用git push提交代码后，将在仓库内自动打包构建。（注意无需上传打包后的dist文件夹）

   ```yml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [main]
     workflow_dispatch:

   permissions:
     contents: read
     pages: write
     id-token: write

   concurrency:
     group: pages
     cancel-in-progress: false

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4

         - name: Setup pnpm
           uses: pnpm/action-setup@v4

         - name: Setup Node
           uses: actions/setup-node@v4
           with:
             node-version: 22 #此处应修改为你的node版本
             cache: pnpm

         - name: Install dependencies
           run: pnpm install --frozen-lockfile

         - name: Build with Astro
           run: pnpm build

         - name: Upload artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: dist

     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       needs: build
       steps:
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```

4. 打开你的仓库 https://github.com/yourname/yourname.github.io ，点击顶部标签栏的Settings（设置），左侧菜单找到Pages，Source下拉框选择 `GitHub Actions`

5. 在仓库页面点击顶部Actions标签，会看到一条名为 Deploy to GitHub Pages 的 workflow 运行记录，点进去能看到两步：build 和 deploy。等待约 2-5 分钟，两个绿勾 ✅ 出现 = 部署成功

6. 回到刚才的Settings-Pages，显示`Your site is live at https://yourname.github.io/`，即可访问你的主页

### 内容更新

当更新了一篇文章或其他内容后，按照以下步骤即可自动更新到主页。

```bash
git add .
git commit -m 'feat: blog'
git push #github会自动构建
```

## 扩展/问题

### 自定义icon图标

本项目使用font-class 的方式引用图标。这些图标在 [iconfont](https://www.iconfont.cn/) 上进行管理和导出。以下是项目中所有可直接使用的图标。

![](/posts/icon-all-1.webp)

![](/posts/icon-all-2.webp)

当你在添加首页显示的社交账号时，你可能会想要使用这些图标。在对应的配置项中填写图标下面有 `icon-` 前缀的名称即可。

```jsx
"socials": [
  {
    "name": "Github",
    "icon": "icon-github",
    "url": "https://github.com/agaric33",
    "color": "rgb(24, 23, 23)"
  },
```

如果是在组件中使用图标，可以按照如下方式：

```jsx
<i class="iconfont icon-xxx"></i>
```

当你想使用自己定义的图标，请根据以下步骤进行：

首先在 [iconfont](https://www.iconfont.cn/) 上选择自己想要的图标并导出。导出具体操作路径：`iconfont-资源管理-我的项目-下载至本地`，你将获得包含以下文件的zip压缩包。

```
demo_index.html
demo.css
iconfont.css
iconfont.js
iconfont.json
iconfont.ttf
iconfont.woff
iconfont.woff2
```

如果你想替换掉全部iconfont图标，请替换以下文件：

```text
public/fonts/iconfont.ttf
public/fonts/iconfont.woff
public/fonts/iconfont.woff2
src/styles/iconfont.css
```

如果你想添加额外的iconfont图标，可以参考iconfont-extra相关文件。

1. 将上述3个字体文件和1个css文件更名iconfont -> iconfont-extra，并分别放入public/fonts、src/styles

2. 修改iconfont-extra.css

   ```css
   @font-face {
     font-family: 'iconfont'; /* Project id 5219577 */
     src:
       url('/fonts/iconfont-extra.woff2?t=1785849063682') format('woff2'),
       url('/fonts/iconfont-extra.woff?t=1785849063682') format('woff'),
       url('/fonts/iconfont-extra.ttf?t=1785849063682') format('truetype');
   } /* 修改url路径 */

   .iconfont {
     font-family: 'iconfont';
     font-style: normal;
     -webkit-font-smoothing: antialiased;
     -moz-osx-font-smoothing: grayscale;
   } /* 去掉important和font-size */
   ```

3. 在`src/styles/global.css`中添加iconfont-extra.css

   ```css
   @import './iconfont-extra.css';
   ```
