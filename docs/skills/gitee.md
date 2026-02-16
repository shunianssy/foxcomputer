# Gitee 新手入门指南

> 从零开始，快速上手 Gitee 协作开发

---

## 目录

- [什么是 Gitee](#什么是-gitee)
- [账号注册与配置](#账号注册与配置)
- [创建你的第一个仓库](#创建你的第一个仓库)
- [Fork 与 Pull Request](#fork-与-pull-request)
- [Issues 问题追踪](#issues-问题追踪)
- [Gitee Pages 静态网站](#gitee-pages-静态网站)
- [协作开发流程](#协作开发流程)
- [Gitee 特有功能](#gitee-特有功能)
- [常见问题](#常见问题)

---

## 什么是 Gitee

Gitee（码云）是中国最大的代码托管平台，基于 Git 版本控制系统，由开源中国运营。

### Gitee vs GitHub

| 特性 | Gitee | GitHub |
|------|-------|--------|
| 访问速度 | 国内访问快 | 国内访问较慢 |
| 私有仓库 | 免费不限数量 | 免费不限数量 |
| Pages 服务 | 需实名认证 | 免费使用 |
| CI/CD | Gitee Go | GitHub Actions |
| 企业版 | 有 | 有 |
| 国内生态 | 更好 | 一般 |

### 核心功能

| 功能 | 说明 |
|------|------|
| **仓库 (Repository)** | 存放项目代码的地方 |
| **Fork** | 复制别人的仓库到自己账号下 |
| **Pull Request** | Gitee 称为 PR，提交代码合并请求 |
| **Issues** | 问题追踪和讨论 |
| **Gitee Pages** | 免费静态网站托管（需实名认证） |
| **Gitee Go** | CI/CD 自动化工作流 |

---

## 账号注册与配置

### 注册账号

1. 访问 [gitee.com](https://gitee.com)
2. 点击 **注册** 按钮
3. 填写用户名、邮箱、密码
4. 验证邮箱地址

### 实名认证（推荐）

Gitee Pages 服务需要实名认证：

1. 点击头像 → **设置**
2. 左侧菜单选择 **实名认证**
3. 填写真实姓名和身份证号
4. 上传身份证照片（可选）
5. 等待审核（通常 1-3 个工作日）

### 配置 SSH 密钥（推荐）

```bash
# 生成 SSH 密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# Windows 查看公钥
type %USERPROFILE%\.ssh\id_ed25519.pub

# Linux/Mac 查看公钥
cat ~/.ssh/id_ed25519.pub
```

将公钥添加到 Gitee：
1. 点击头像 → **设置**
2. 左侧菜单选择 **SSH 公钥**
3. 点击 **添加公钥**
4. 粘贴公钥内容，点击 **确定**

### 验证连接

```bash
# 测试 SSH 连接
ssh -T git@gitee.com

# 成功提示
# Hi username! You've successfully authenticated...
```

### 配置 Git 用户信息

```bash
# 设置用户名和邮箱
git config --global user.name "Your Name"
git config --global user.email "your_email@example.com"

# 查看配置
git config --list
```

---

## 创建你的第一个仓库

### 在网页创建

1. 点击右上角 **+** → **新建仓库**
2. 填写仓库名称（如：`my-first-project`）
3. 添加仓库介绍（可选）
4. 选择公开或私有
5. 勾选 **使用 Readme 文件初始化这个仓库**
6. 点击 **创建**

### 克隆到本地

```bash
# HTTPS 方式
git clone https://gitee.com/用户名/仓库名.git

# SSH 方式（推荐）
git clone git@gitee.com:用户名/仓库名.git

# 进入项目目录
cd 仓库名
```

### 添加文件并推送

```bash
# 创建新文件
echo "# 我的项目" > README.md

# 添加到暂存区
git add .

# 提交更改
git commit -m "feat: 初始化项目"

# 推送到 Gitee
git push origin master
```

---

## Fork 与 Pull Request

### Fork 仓库

Fork 是将别人的项目复制到自己账号下，可以自由修改。

1. 打开目标仓库页面
2. 点击右上角 **Fork** 按钮
3. 选择目标空间，点击 **确认Fork**

### 克隆 Fork 的仓库

```bash
# 克隆你 Fork 的仓库
git clone git@gitee.com:你的用户名/仓库名.git

# 进入目录
cd 仓库名

# 添加上游仓库（保持同步）
git remote add upstream git@gitee.com:原作者/仓库名.git
```

### 保持 Fork 同步

```bash
# 获取上游更新
git fetch upstream

# 合并到本地分支
git merge upstream/master

# 推送到你的 Fork
git push origin master
```

### 创建 Pull Request

1. 在你的 Fork 中修改代码
2. 提交并推送到你的仓库
3. 访问原仓库页面
4. 点击 **Pull Requests** → **新建 Pull Request**
5. 选择比较分支，点击 **创建 Pull Request**
6. 填写标题和描述
7. 点击 **提交** 发送 PR

### PR 标题规范

| 前缀 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: 添加用户注册功能` |
| `fix` | 修复问题 | `fix: 修复登录验证错误` |
| `docs` | 文档更新 | `docs: 更新安装说明` |
| `refactor` | 代码重构 | `refactor: 优化查询性能` |
| `test` | 测试相关 | `test: 添加单元测试` |

---

## Issues 问题追踪

### 创建 Issue

1. 进入仓库页面
2. 点击 **Issues** → **新建 Issue**
3. 填写标题和描述
4. 添加标签
5. 指派负责人
6. 点击 **创建**

### Issue 模板示例

```markdown
## 问题描述
简要描述遇到的问题

## 复现步骤
1. 打开页面
2. 点击按钮
3. 观察错误

## 期望行为
描述期望的正确行为

## 实际行为
描述实际的错误行为

## 环境信息
- 操作系统：Windows 11
- 浏览器：Chrome 120
- 版本：v1.0.0

## 截图
如有必要，添加截图说明
```

### 关闭 Issue

```bash
# 在 commit 中关闭 Issue
git commit -m "fix: 修复登录问题，关闭 #123"

# PR 合并时关闭多个 Issue
# 关闭 #123, #124, #125
```

---

## Gitee Pages 静态网站

> ⚠️ 注意：Gitee Pages 需要实名认证后才能使用

### 创建个人主页

1. 创建名为 `用户名` 的仓库（与用户名相同）
2. 添加 `index.html` 文件
3. 进入仓库 **服务** → **Gitee Pages**
4. 选择部署分支和目录
5. 点击 **启动**
6. 访问 `https://用户名.gitee.io`

### 为项目创建主页

1. 进入仓库 **服务** → **Gitee Pages**
2. 选择部署分支
3. 选择部署目录（默认根目录）
4. 点击 **启动**
5. 等待部署完成
6. 访问 `https://用户名.gitee.io/仓库名`

### 简单主页示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的主页</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            line-height: 1.6;
        }
        h1 { color: #c71d23; }
        a { color: #c71d23; }
    </style>
</head>
<body>
    <h1>👋 你好，欢迎来到我的主页</h1>
    <p>我是一名开发者，热爱编程和开源。</p>
    <h2>项目</h2>
    <ul>
        <li><a href="#">项目一</a> - 项目描述</li>
        <li><a href="#">项目二</a> - 项目描述</li>
    </ul>
</body>
</html>
```

### 更新 Pages

```bash
# 推送新代码后，Pages 会自动更新
git add .
git commit -m "docs: 更新主页内容"
git push origin master

# 如果没有自动更新，手动更新：
# 进入仓库 → 服务 → Gitee Pages → 点击"更新"
```

---

## 协作开发流程

### 标准协作流程

```
1. Fork 仓库
     ↓
2. 克隆到本地
     ↓
3. 创建功能分支
     ↓
4. 编写代码
     ↓
5. 提交更改
     ↓
6. 推送到 Fork
     ↓
7. 创建 Pull Request
     ↓
8. 代码审查
     ↓
9. 合并代码
```

### 分支命名规范

| 分支类型 | 命名格式 | 示例 |
|----------|----------|------|
| 主分支 | `master` / `main` | `master` |
| 开发分支 | `develop` | `develop` |
| 功能分支 | `feature/功能名` | `feature/user-login` |
| 修复分支 | `fix/问题描述` | `fix/login-error` |
| 发布分支 | `release/版本号` | `release/v1.0.0` |

### 分支操作命令

```bash
# 创建并切换分支
git checkout -b feature/new-feature

# 切换回主分支
git checkout master

# 合并分支
git merge feature/new-feature

# 删除已合并的分支
git branch -d feature/new-feature
```

---

## Gitee 特有功能

### Gitee 企业版

适合团队协作，提供更多功能：
- 更精细的权限管理
- 代码质量分析
- 项目管理工具
- Wiki 文档

### Gitee Go（CI/CD）

自动化构建、测试、部署：

1. 进入仓库 **服务** → **Gitee Go**
2. 创建流水线
3. 配置构建步骤
4. 触发自动执行

### 开源中国生态

- 与开源中国博客联动
- 项目推荐和展示
- 开源软件评选

### 导入 GitHub 仓库

1. 点击右上角 **+** → **从 GitHub / GitLab 导入仓库**
2. 输入 GitHub 仓库地址
3. 选择是否私有
4. 点击 **导入**

### 镜像仓库

保持与 GitHub 仓库同步：

1. 进入仓库 **管理** → **仓库镜像管理**
2. 添加镜像地址
3. 设置同步频率
4. 保存设置

---

## 常见问题

### 如何删除仓库？

1. 进入仓库 **管理**
2. 左侧选择 **仓库设置**
3. 滚动到页面底部 **删除仓库**
4. 输入仓库名称确认删除

> ⚠️ 警告：删除操作不可恢复！

### 如何撤销最近的提交？

```bash
# 撤销最近一次提交，保留修改
git reset --soft HEAD^

# 撤销最近一次提交，丢弃修改
git reset --hard HEAD^

# 强制推送到远程（谨慎使用）
git push -f origin master
```

### 如何解决合并冲突？

1. 拉取最新代码
```bash
git pull origin master
```

2. 手动编辑冲突文件，选择保留的内容
```text
<<<<<<< HEAD
你的修改
=======
对方的修改
>>>>>>> branch-name
```

3. 提交解决后的文件
```bash
git add .
git commit -m "fix: 解决合并冲突"
git push origin master
```

### 如何找回删除的分支？

```bash
# 查看操作记录
git reflog

# 找到删除前的 commit ID，恢复分支
git checkout -b 分支名 commitID
```

### 如何忽略已提交的文件？

```bash
# 从 Git 中移除但保留本地文件
git rm --cached 文件名

# 批量移除
git rm -r --cached .

# 重新提交
git add .
git commit -m "chore: 更新 .gitignore"
```

### 推送被拒绝怎么办？

```bash
# 先拉取远程更改
git pull origin master --rebase

# 解决冲突后推送
git push origin master
```

### Gitee Pages 无法访问？

检查以下几点：
1. 是否完成实名认证
2. 仓库是否为公开
3. 是否正确启动 Pages 服务
4. 是否有 `index.html` 或 `index.md` 文件

### 如何同步 GitHub 仓库？

```bash
# 添加 GitHub 远程仓库
git remote add github https://github.com/用户名/仓库名.git

# 推送到 GitHub
git push github master

# 推送到 Gitee
git push origin master
```

---

## 快速参考卡片

| 操作 | 命令 |
|------|------|
| 克隆 | `git clone 地址` |
| 添加 | `git add .` |
| 提交 | `git commit -m "说明"` |
| 推送 | `git push origin 分支` |
| 拉取 | `git pull origin 分支` |
| 状态 | `git status` |
| 日志 | `git log --oneline` |
| 切换分支 | `git checkout 分支` |
| 创建分支 | `git checkout -b 新分支` |
| 合并分支 | `git merge 分支` |

---

## 学习资源

- [Gitee 官方文档](https://help.gitee.com)
- [Git 官方文档](https://git-scm.com/doc)
- [开源中国](https://www.oschina.net)
- [Pro Git 电子书](https://git-scm.com/book/zh/v2)

---

> 💡 提示：Gitee 是国内访问速度最快的代码托管平台，适合国内团队协作！
