---
title: 友链Links
description: 我的小伙伴们～
comments: true
---

## 友链配置：供开发者参考

· 链接：若未配置链接，点击名片将不会触发页面跳转。

· 可通过order配置进行排序，order为数字，数字越大，排序越靠前，未配置order字段的名片默认order=0。

· 头像：若名片头像获取失败，将展示默认头像。

## 怎么申请友链？

想要交换友链的小伙伴们，欢迎去本站的 [Github 仓库](https://github.com/agaric33/rica-blog/tree/main/src/content/friends)提交一个 PR。审核通过后，就可以在这里展示啦。

请在`/src/content/friends/`目录下添加一个`<short-name>.yaml`文件，命名限制`英文小写/数字/短横线`，例如`github.yaml`。内容参考格式：

```yml
title: 名称
description: 一句话介绍下你的网站或者你自己
link: 网站/社媒地址
avatar: 头像链接
```
