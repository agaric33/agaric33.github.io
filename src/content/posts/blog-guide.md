---
title: rica-blog 使用指南
date: 2026-08-04
lastMod: 2026-08-05
summary: 这是一个使用 rica-blog 模版搭建的博客。本文将介绍如何使用模版进行开发，分析可能遇到的问题并给出解决方案。
category: 实操教程
tags: [Astro, guide, icon]
sticky: 1
---

## 前置条件

开发需要的前置条件。站主使用的版本如下，仅供参考。

| 配置/工具 | 版本                               | 作用                           |
| --------- | ---------------------------------- | ------------------------------ |
| node      | v22.23.1                           | 本项目推荐使用pnpm作为包管理器 |
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

### 命令介绍

本地运行

```sh
pnpm dev
```

打包静态文件

```sh
pnpm build
```

本地预览

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
        "color": "" // 图标颜色
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
  // Waline 评论系统，前往 https://waline.js.org/ 查看
  "waline": {
    "serverURL": ""
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

## 部署

作者还没部署～

## 扩展/问题

### 自定义icon图标

本项目使用font-class 的方式引用图标。这些图标在 [iconfont](https://www.iconfont.cn/) 上进行管理和导出。以下是项目中所有可直接使用的图标。

<img src="https://github.com/agaric33/rica-blog/blob/main/public/icon-all-1.webp" alt="所有图标1" style="zoom: 67%;" />

<img src="https://github.com/agaric33/rica-blog/blob/main/public/icon-all-2.png" alt="所有图标2" style="zoom: 67%;" />

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
