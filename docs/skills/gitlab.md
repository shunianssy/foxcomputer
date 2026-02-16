# GitLab 新手入门指南

> 从零开始，快速上手 GitLab 协作开发

---

## 目录

- [什么是 GitLab](#什么是-gitlab)
- [账号注册与配置](#账号注册与配置)
- [创建你的第一个项目](#创建你的第一个项目)
- [Fork 与 Merge Request](#fork-与-merge-request)
- [Issues 问题追踪](#issues-问题追踪)
- [GitLab Pages 静态网站](#gitlab-pages-静态网站)
- [GitLab CI/CD](#gitlab-cicd)
- [协作开发流程](#协作开发流程)
- [常见问题](#常见问题)

---

## 什么是 GitLab

GitLab 是一个完整的 DevOps 平台，提供代码托管、CI/CD、项目管理等功能。

### GitLab vs GitHub vs Gitee

| 特性 | GitLab | GitHub | Gitee |
|------|--------|--------|-------|
| 访问速度 | 国内较慢 | 国内较慢 | 国内快 |
| 私有仓库 | 免费不限 | 免费不限 | 免费不限 |
| CI/CD | 内置强大 | Actions | Gitee Go |
| 自托管 | 免费支持 | 企业版 | 企业版 |
| Pages | 免费 | 免费 | 需实名 |
| 容器镜像库 | 内置 | 有 | 无 |

### 核心功能

| 功能 | 说明 |
|------|------|
| **项目 (Project)** | 存放项目代码的地方 |
| **Fork** | 复制别人的项目到自己账号下 |
| **Merge Request** | 简称 MR，提交代码合并请求 |
| **Issues** | 问题追踪和讨论 |
| **CI/CD** | 内置持续集成/持续部署 |
| **GitLab Pages** | 免费静态网站托管 |
| **Container Registry** | Docker 镜像仓库 |
| **Wiki** | 项目文档 |

---

## 账号注册与配置

### 注册账号

1. 访问 [gitlab.com](https://gitlab.com)
2. 点击 **Register** 注册
3. 填写用户名、邮箱、密码
4. 验证邮箱地址

### 配置 SSH 密钥（推荐）

```bash
# 生成 SSH 密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# Windows 查看公钥
type %USERPROFILE%\.ssh\id_ed25519.pub

# Linux/Mac 查看公钥
cat ~/.ssh/id_ed25519.pub
```

将公钥添加到 GitLab：
1. 点击头像 → **Edit profile**
2. 左侧菜单选择 **SSH Keys**
3. 点击 **Add new key**
4. 粘贴公钥内容，设置标题
5. 点击 **Add key**

### 验证连接

```bash
# 测试 SSH 连接
ssh -T git@gitlab.com

# 成功提示
# Welcome to GitLab, @username!
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

## 创建你的第一个项目

### 在网页创建

1. 点击右上角 **New project**
2. 选择 **Create blank project**
3. 填写项目名称（如：`my-first-project`）
4. 选择可见级别（公开/私有/内部）
5. 勾选 **Initialize repository with a README**
6. 点击 **Create project**

### 克隆到本地

```bash
# HTTPS 方式
git clone https://gitlab.com/用户名/项目名.git

# SSH 方式（推荐）
git clone git@gitlab.com:用户名/项目名.git

# 进入项目目录
cd 项目名
```

### 添加文件并推送

```bash
# 创建新文件
echo "# 我的项目" > README.md

# 添加到暂存区
git add .

# 提交更改
git commit -m "feat: 初始化项目"

# 推送到 GitLab
git push origin main
```

---

## Fork 与 Merge Request

### Fork 项目

Fork 是将别人的项目复制到自己账号下，可以自由修改。

1. 打开目标项目页面
2. 点击右上角 **Fork** 按钮
3. 选择目标命名空间
4. 点击 **Fork project**

### 克隆 Fork 的项目

```bash
# 克隆你 Fork 的项目
git clone git@gitlab.com:你的用户名/项目名.git

# 进入目录
cd 项目名

# 添加上游仓库（保持同步）
git remote add upstream git@gitlab.com:原作者/项目名.git
```

### 保持 Fork 同步

```bash
# 获取上游更新
git fetch upstream

# 合并到本地分支
git merge upstream/main

# 推送到你的 Fork
git push origin main
```

### 创建 Merge Request

GitLab 的 PR 称为 Merge Request (MR)：

1. 在你的 Fork 中修改代码
2. 提交并推送到你的仓库
3. 访问原项目页面
4. 点击 **Merge requests** → **New merge request**
5. 选择源分支和目标分支
6. 点击 **Compare branches and continue**
7. 填写标题和描述
8. 点击 **Create merge request**

### MR 标题规范

| 前缀 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: 添加用户注册功能` |
| `fix` | 修复问题 | `fix: 修复登录验证错误` |
| `docs` | 文档更新 | `docs: 更新安装说明` |
| `refactor` | 代码重构 | `refactor: 优化查询性能` |
| `test` | 测试相关 | `test: 添加单元测试` |
| `chore` | 构建/工具 | `chore: 更新依赖版本` |

---

## Issues 问题追踪

### 创建 Issue

1. 进入项目页面
2. 点击 **Issues** → **New issue**
3. 填写标题和描述
4. 添加标签
5. 指派负责人
6. 设置里程碑
7. 点击 **Create issue**

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

/label ~bug ~high-priority
/assign @username
/milestone %"v1.1.0"
```

### 快速操作命令

在 Issue 描述或评论中使用：

| 命令 | 说明 |
|------|------|
| `/close` | 关闭 Issue |
| `/reopen` | 重新打开 Issue |
| `/assign @user` | 指派负责人 |
| `/label ~标签` | 添加标签 |
| `/milestone %"名称"` | 设置里程碑 |
| `/estimate 2h` | 设置预估时间 |

### 关闭 Issue

```bash
# 在 commit 中关闭 Issue
git commit -m "fix: 修复登录问题，关闭 #123"

# MR 合并时关闭多个 Issue
# Closes #123, #124, #125
```

---

## GitLab Pages 静态网站

### 创建 Pages 网站

1. 进入项目 **Deploy** → **Pages**
2. 选择部署分支
3. 选择部署目录（默认根目录）
4. 点击 **Save changes**
5. 等待部署完成
6. 访问 `https://用户名.gitlab.io/项目名`

### 创建个人主页

1. 创建名为 `用户名.gitlab.io` 的项目
2. 添加 `index.html` 文件
3. 访问 `https://用户名.gitlab.io`

### 使用 .gitlab-ci.yml 自动部署

```yaml
# .gitlab-ci.yml
image: node:18

# 阶段定义
stages:
  - deploy

# Pages 部署任务
pages:
  stage: deploy
  script:
    - mkdir -p public
    - cp -r *.html *.css *.js public/ 2>/dev/null || true
    - cp -r dist/* public/ 2>/dev/null || true
  artifacts:
    paths:
      - public
  only:
    - main
```

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
        h1 { color: #fc6d26; }
        a { color: #fc6d26; }
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

---

## GitLab CI/CD

GitLab 内置强大的 CI/CD 功能，通过 `.gitlab-ci.yml` 配置。

### 基础配置示例

```yaml
# .gitlab-ci.yml

# 定义阶段
stages:
  - build
  - test
  - deploy

# 构建任务
build:
  stage: build
  image: node:18
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - dist/

# 测试任务
test:
  stage: test
  image: node:18
  script:
    - npm install
    - npm test
  dependencies:
    - build

# 部署任务
deploy:
  stage: deploy
  script:
    - echo "部署到生产环境"
  only:
    - main
  when: manual
```

### 常用配置说明

| 关键字 | 说明 |
|--------|------|
| `stages` | 定义执行阶段顺序 |
| `image` | 使用的 Docker 镜像 |
| `script` | 执行的命令 |
| `only` | 仅在指定分支执行 |
| `except` | 排除指定分支 |
| `when` | 执行时机（manual 手动触发） |
| `artifacts` | 构建产物，传递给下一阶段 |
| `cache` | 缓存依赖，加速构建 |

### Python 项目示例

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: python:3.11
  script:
    - pip install -r requirements.txt
    - pip install pytest
    - pytest tests/

build:
  stage: build
  image: python:3.11
  script:
    - pip install build
    - python -m build
  artifacts:
    paths:
      - dist/

deploy:
  stage: deploy
  image: python:3.11
  script:
    - pip install twine
    - twine upload dist/*
  only:
    - tags
  when: manual
```

---

## 协作开发流程

### 标准协作流程

```
1. Fork 项目
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
7. 创建 Merge Request
     ↓
8. 代码审查
     ↓
9. 合并代码
```

### 分支命名规范

| 分支类型 | 命名格式 | 示例 |
|----------|----------|------|
| 主分支 | `main` / `master` | `main` |
| 开发分支 | `develop` | `develop` |
| 功能分支 | `feature/功能名` | `feature/user-login` |
| 修复分支 | `fix/问题描述` | `fix/login-error` |
| 发布分支 | `release/版本号` | `release/v1.0.0` |
| 热修复分支 | `hotfix/问题描述` | `hotfix/critical-bug` |

### 分支操作命令

```bash
# 创建并切换分支
git checkout -b feature/new-feature

# 切换回主分支
git checkout main

# 合并分支
git merge feature/new-feature

# 删除已合并的分支
git branch -d feature/new-feature
```

### 保护分支设置

1. 进入项目 **Settings** → **Repository**
2. 展开 **Protected branches**
3. 点击 **Add protected branch**
4. 选择分支，设置保护规则

---

## 常见问题

### 如何删除项目？

1. 进入项目 **Settings** → **General**
2. 展开 **Advanced**
3. 滚动到 **Delete project**
4. 输入项目路径确认删除

> ⚠️ 警告：删除操作不可恢复！

### 如何撤销最近的提交？

```bash
# 撤销最近一次提交，保留修改
git reset --soft HEAD^

# 撤销最近一次提交，丢弃修改
git reset --hard HEAD^

# 强制推送到远程（谨慎使用）
git push -f origin main
```

### 如何解决合并冲突？

1. 拉取最新代码
```bash
git pull origin main
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
git push origin main
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
git pull origin main --rebase

# 解决冲突后推送
git push origin main
```

### CI/CD 流水线失败怎么办？

1. 查看失败日志
2. 检查 `.gitlab-ci.yml` 语法
3. 本地测试命令是否正常
4. 检查依赖版本兼容性

```bash
# 本地测试 CI 配置
gitlab-runner exec shell build
```

### 如何迁移 GitHub 项目？

1. 点击 **New project**
2. 选择 **Import project**
3. 选择 **GitHub**
4. 授权访问 GitHub
5. 选择要导入的项目
6. 点击 **Import**

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

- [GitLab 官方文档](https://docs.gitlab.com)
- [GitLab CI/CD 文档](https://docs.gitlab.com/ee/ci/)
- [Git 官方文档](https://git-scm.com/doc)
- [Pro Git 电子书](https://git-scm.com/book/zh/v2)

---

> 💡 提示：GitLab 是功能最完整的 DevOps 平台，适合需要完整 CI/CD 流程的团队！
