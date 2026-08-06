---
title: git常用命令合集
date: 2026-08-06T21:51:08+08:00
summary: “哥，不好了！我刚刚执行了 git push origin main --force……”  “没事，别慌。趁公司还没发现，你赶紧把简历改改，我也顺便投一份。”
category: 分享
tags: [share, git]
---

git官方指南：https://git-scm.com/book/zh/v2

## 一、Git设置

1.打开终端，检验成功命令（查看版本号）：`git -v`

2.配置：用户名和邮箱，应用在每次提交代码版本时表明自己身份

第一次使用时要设置用户名和邮箱，之后不需要（修改用户名和邮箱也是以下命令）

```bash
# 全局设置
git config --global user.name 你的用户名
git config --global user.email 你的邮箱
# 单项目设置
git config user.name 你的用户名
git config user.email 你的邮箱
```

3.查看用户名和邮箱

```bash
git config user.name
git config user.email
```

## 二、Git常用命令

### 1.查看提交历史

| 命令                                         | 作用                                                                        | 备注                                                                                                   |
| -------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| git log                                      | 列出所有历史记录。按`PgUp`、`PgDn`、`↓`、`↑`控制显示，按`Q`退出历史记录列表 | 第一行的commit ...(HEAD -> master)代表提交到了master分支                                               |
| git log --pretty=full                        | 获取全部基本信息                                                            | 和git log同效                                                                                          |
| **git log --oneline**                        | 一行显示，简略信息                                                          | git log --pretty=oneline的简写                                                                         |
| git log --graph                              | 带图形的日志                                                                |                                                                                                        |
| git log --pretty=format:"%h - %an, %ar : %s" | 定制记录的显示格式                                                          | [Git - 查看提交历史 (git-scm.com)](https://git-scm.com/book/zh/v2/Git-基础-查看提交历史#pretty_format) |
| git log --auther='作者名'                    | 查看筛选后提交记录，指定作者名                                              |                                                                                                        |
| git reflog                                   | 查看本地提交历史                                                            | 包括revert                                                                                             |

### 2.本地仓库操作

| 命令                    | 作用                                                                                                                        | 备注                                                           |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| git init                | 初始化当前目录为仓库，初始化后会自动将当前仓库设置为master                                                                  | 会生成git的配置文件目录（隐藏）                                |
| git add .               | 将文件添加到本地仓库的提交缓存（注意.前有空格）                                                                             |                                                                |
| git add 文件标识        | 暂存指定文件                                                                                                                | 文件标识以终端为起始的相对路径                                 |
| git commit -m "message" | 提交并保存，说明不可省略（''和""都可以）[提交典范Conventional Commits](https://www.conventionalcommits.org/zh-hans/v1.0.0/) | 如果不使用-m，会调用终端的注释编辑器输入描述信息               |
| git commit --amend      | 重写上一次的提交信息                                                                                                        | 会进入编辑器界面                                               |
| git status              | 查看文件状态 - 详细信息                                                                                                     | modified修改但未提交                                           |
| git status -s           | 查看文件状态 - 简略信息                                                                                                     | A新添加未提交；M修改。提交了的文件且未改动的不会显示到这个里面 |

### 3.远程仓库操作

| 命令                                       | 作用                                                                                                                                                                                     | 备注                                               |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| git remote add origin 远程仓库地址         | 将本地仓库关联到远程仓库                                                                                                                                                                 | origin远程仓库，如果是远程仓库必须使用这个选项     |
| **git remote set-url origin 远程仓库地址** | 设置本地仓库关联的远程仓库地址                                                                                                                                                           | 支持HTTPS或SSH格式                                 |
| git push -u origin master                  | -u：将本地仓库master及其分支一起提交上去，这样你就可以在远程仓库上看到你在本地仓库的master中创建了多少分支，不加这个参数只将当前的master与远程的合并，没有分支的历史记录，也不能切换分支 | 一般空远程仓库第一次上传使用                       |
| git clone 远程仓库地址                     | 从0得到一个远程的Git仓库到本地使用，会自动以项目名作为项目最外层文件夹，不需要自新建进入再clone                                                                                          | 不需要初始化，使用该命令会自动帮我们初始化         |
| git fetch origin 分支                      | 获取远端分支的更新，git fetch获取全部更新，不会自动合并或修改工作目录                                                                                                                    | pull = fetch + merge                               |
| git pull origin 分支                       | 抓取，完整写法：git pull origin 远程分支名:本地分支名                                                                                                                                    | 该写法远程仓库与本地同名分支，完整写法可以任意分支 |
| git push origin 分支                       | 推送，完整写法：git push origin 本地分支名:远程分支名                                                                                                                                    | 需同名                                             |
| git pull 或 git push                       | 需要本地和远程分支建立链接                                                                                                                                                               |                                                    |
| **git remote -v**                          | 查看远程仓库地址：fetch代表可以拉取仓库，push代表可以推送。如果没有权限只能拉取的情况下不会显示push。（不加-v只看到仓库名称）                                                            |                                                    |
| git remote remove 分支名                   | 删除本地关联的远程仓库，可以用 git remote -v 看到关联情况                                                                                                                                | 一般使用`git remote remove origin`取消关联         |
| git branch -vv                             | 显示本地分支与远端分支的链接关系                                                                                                                                                         |                                                    |

### 4.分支操作

| 命令                                | 作用                     | 备注                                           |
| ----------------------------------- | ------------------------ | ---------------------------------------------- |
| git branch 分支名                   | 创建分支                 |                                                |
| **git checkout 分支名**             | 切换分支                 |                                                |
| git checkout -b 分支名              | 创建并切换分支           |                                                |
| **git branch**                      | 查看所有分支             | 分支前有星号的是当前分支                       |
| git branch -r                       | 查看远程仓库中的所有分支 |                                                |
| git branch -a                       | 查看本地和远端的所有分支 | 远程仓库中HEAD指向当前分支                     |
| git branch -D 分支名                | 删除本地分支             |                                                |
| git push origin --delete 远程分支名 | 删除远程分支             | 这里的远程分支名不需要加origin，输入分支名即可 |
| git merge 分支名                    | 合并分支                 |                                                |

当test分支开发完成提交至master时（合并前务必保证test分支最新，即已经包含了所有master内容）

```bash
 // 切换至提交合并的分支
 git checkout master
 // 合并test
 git merge test
```

**rebase操作**

| git rebase 目标分支名 | 将当前分支合并至目标分支   | 有冲突解决后git add，再git rebase --continue |
| --------------------- | -------------------------- | -------------------------------------------- |
| git rebase --abort    | 取消变基操作，恢复所有状态 | 例如有冲突时使用                             |

```bash
// 切换至要提交的分支
 git checkout test
// 将test提交至master
 git rebase master

// 切换回master
 git checkout master
// 让指针向前移动
 git merge test
```

### 5.tag标签

tag是相较于commit独立的系统，当提交被reset回退时，tag依旧存在，可以使用`git reset --hard commitID`命令恢复至tag提交状态。

| 命令                                 | 作用                   | 备注        |
| ------------------------------------ | ---------------------- | ----------- |
| git tag                              | 查看所有tag名          |             |
| git show 标签名                      | 查看某标签的详细信息   |             |
| git tag 标签名                       | 给最新的提交创建tag    |             |
| git tag -a 标签名 -m "注释" commitID | 创建带有说明的标签     | 本地创建tag |
| git push origin标签名                | 推送固定版本到远程仓库 |             |
| git push origin --tags               | 一次性推送本地 tag     |             |
| git tag -d 标签名                    | 删除一个本地标签       |             |
| git push origin :refs/tags/标签名    | 删除一个远程标签       |             |

### 6.回退、重做

**（1）reset**

1.工作区：未使用git add命令加入暂存区的文件；

2.暂存区：本次还未提交的新增文件（绿色U）、使用了git add命令后的文件；

3.本地仓库：git commit之后的文件在本地仓库；

4.远程仓库：git push之后文件推送到远程仓库。

| 命令                         | 作用                                                                   | 备注                                                                                      |
| ---------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| git reset --soft commiID     | 回滚点之后版本提交的文件将变为绿色存入暂存区中                         | 常用于取消上一次提交，将更改重新放入暂存区，以便进行修改后再次提交                        |
| **git reset --soft HEAD～n** | 回退n次提交，改动保留在暂存区                                          | 不用查询commitID，使用更方便                                                              |
| git reset --hard commiID     | 暂存区、工作区、回滚点之后已提交的文件全部丢弃                         | 永久性地丢弃本地的更改，谨慎使用                                                          |
| git reset --mixed commiID    | 暂存区和回滚点之后已提交的文件全部丢弃；工作区中的文件继续保留在工作区 | git reset的默认选项，常用于取消上一次提交，但保留更改在工作目录中，不放入暂存区【最常用】 |
| git reset --keep commiID     | 回滚点之后已提交的文件全部丢弃；暂存区内容保留；工作区所有文件撤销修改 | 用于保留提交内容但清空未提交的本地更改                                                    |

**（2）revert**

git revert是用于“反做”某一个版本，以达到撤销该版本的修改的目的。比如，我们commit了三个版本（A、B、C），突然想要撤销版本B，但又不想影响版本C的提交，就可以用 git revert 命令来反做版本B，生成新的版本D，版本D会保留版本C的内容，但撤销了版本B的内容。

注意：如果B修改了文件x，C也修改了文件x，则此时revert版本B会发生冲突，需要手动修改解决冲突

- revert后无冲突：git commit -m 'message'
- revert后发生冲突：解决冲突后git add + git commit

| 命令                   | 作用                               |
| ---------------------- | ---------------------------------- |
| git revert -n commitID | 反做某一版本，即撤销该版本做的修改 |

## 三、多人分支开发

这里以已有远程仓库，开发者从main创建新分支进行开发为例进行说明。多人分别创建不同分支进行开发，先push到远程仓库分支，再采用 pull request 的方式合并分支至master。

1. 将远程仓库clone到本地；
2. 在本地创建新的分支 `git checkout -b test`进行开发；
3. 开发完成后使用`git add .`、`git commit -m 'message'`提交到暂存区
4. 将本地分支推向远端分支
   1. 首次推送：git push -u origin test （首次用 -u 关联远程分支）
   2. 后续推送：git push
5. 到远程仓库页面，点击pull request按钮，填写标题和描述，选择目标分支（main），提交 PR。

## 四、本地新项目推送

1.在网站创建一个新的远程仓库，不要初始化生成README.md等文件

2.本地仓库 (init+)add+commit 正常完成提交

3.本地和远程的仓库建立关联`git remote add origin 远程仓库地址`，合并本地和远程仓库中的代码`git pull --allow-unrelated-histories origin master`

4.此时本地的README文件等大概率会冲突，修改完成add+commit后`git push origin master`即可将本地仓库推送至新的远程仓库。

## 五、可能遇到的问题

### 1.push报错

`HTTP 413 curl 22 The requested URL returned error: 413`

HTTP 413 状态码表示 “请求实体过大”（Request Entity Too Large），即文件、媒体、JSON 数据等超过了服务器配置所允许的最大大小，服务器因此拒绝处理请求。

解决思路：减少文件大小分片上传；在服务器端放宽限制；

### 2.配置ssh key

SSH key 用于身份认证，让本地 Git 与远程仓库（如 GitHub）之间安全通信，无需每次输入用户名密码。

```bash
# 1.生成 SSH key（邮箱换成你的）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 2.一路回车（默认路径 ~/.ssh/id_ed25519），可设置密码

# 3. 复制公钥到剪贴板（macOS）：以ssh_ed开头的文本
pbcopy < ~/.ssh/id_ed25519.pub

# 4. 到 GitHub → Settings → SSH and GPG keys → New SSH key，粘贴公钥

# 5. 测试连接
ssh -T git@github.com
```
