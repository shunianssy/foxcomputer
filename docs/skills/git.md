c# Git 命令速查手册

> 适用于新手和日常开发快速查找

---

## 目录

- [初次配置](#初次配置)
- [克隆仓库](#克隆仓库)
- [日常提交流程](#日常提交流程)
- [分支操作](#分支操作)
- [标签操作](#标签操作)
- [撤销与回退](#撤销与回退)
- [查看状态](#查看状态)
- [远程仓库](#远程仓库)
- [常见问题](#常见问题)

---ke

## 初次配置

首次使用 Git 需要配置用户信息：

```bash
# 设置用户名
git config --global user.name "Your Name"

# 设置邮箱
git config --global user.email "email@example.com"

# 查看当前配置
git config --list
```

---

## 克隆仓库

从远程仓库下载项目到本地：

```bash
# 克隆仓库
git clone https://github.com/shunianssy/foxcomputer.git

# 克隆指定分支
git clone -b 分支名 https://github.com/用户名/仓库名.git
```

---

## 日常提交流程

最常用的三步走：

```bash
# 第一步：添加所有修改到暂存区
git add .

# 第二步：提交到本地仓库（-m 后面是提交说明）
git commit -m "feat: 添加新功能"

# 第三步：推送到远程仓库
git push origin master
```

### 添加文件详解

```bash
# 添加所有修改
git add .
r
# 添加指定文件
git add 文件名

# 添加指定目录下所有文件
git add 目录名/
```

### 提交说明规范

| 前缀 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: 添加用户登录功能` |
| `fix` | 修复bug | `fix: 修复登录验证问题` |
| `docs` | 文档修改 | `docs: 更新README` |
| `style` | 代码格式 | `style: 格式化代码` |
| `refactor` | 重构代码 | `refactor: 重构用户模块` |
| `test` | 测试相关 | `test: 添加单元测试` |

---

## 分支操作

```bash
# 查看所有分支（* 表示当前分支）
git branch

# 创建新分支
git branch 分支名

# 切换分支
git checkout 分支名

# 创建并切换到新分支（推荐）
git checkout -b 分支名

# 合并分支到当前分支
git merge 分支名

# 删除本地分支
git branch -d 分支名

# 强制删除未合并的分支
git branch -D 分支名
```

---

## 标签操作

```bash
# 查看所有标签
git tag

# 创建带注释的标签
git tag -a v1.0.1 -m "Release v1.0.1"

# 创建轻量标签
git tag v1.0.1

# 推送标签到远程
git push origin v1.0.1

# 推送所有标签
git push origin --tags

# 删除本地标签
git tag -d v1.0.1

# 删除远程标签
git push origin --delete v1.0.1
```

---

## 撤销与回退

```bash
# 撤销工作区的修改（未 add）
git checkout -- 文件名

# 撤销暂存区的修改（已 add，未 commit）
git reset HEAD 文件名

# 回退到上一个版本
git reset --hard HEAD^

# 回退到指定版本
git reset --hard 版本号

# 查看提交历史（获取版本号）
git log

# 查看简洁历史
git log --oneline
```

---

## 查看状态

```bash
# 查看当前状态
git status

# 查看提交历史
git log

# 查看简洁历史（一行显示）
git log --oneline

# 查看文件修改内容
git diff

# 查看远程仓库地址
git remote -v
```

---

## 远程仓库

```bash
# 拉取最新代码
git pull origin master

# 推送代码
git push origin master

# 添加远程仓库
git remote add origin https://github.com/用户名/仓库名.git

# 修改远程仓库地址
git remote set-url origin 新地址
```

---

## 常见问题

### 如何撤销最近的 commit？

```bash
# 撤销最近一次 commit，保留修改
git reset --soft HEAD^

# 撤销最近一次 commit，丢弃修改
git reset --hard HEAD^
```

### 如何解决冲突？

1. 手动编辑冲突文件，选择保留的内容
2. `git add 冲突文件`
3. `git commit -m "解决冲突"`
4. `git push origin 分支名`

### 如何删除 Git 仓库？

```bash
# 删除 .git 目录即可删除整个 Git 仓库
rm -rf .git
```

> 注意：此操作不可逆，请谨慎使用！

### 忽略文件不生效？

```bash
# 清除缓存
git rm -r --cached .
git add .
git commit -m "更新 .gitignore"
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
