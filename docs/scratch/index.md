# Scratch 扩展开发教程

欢迎来到 Scratch 扩展开发教程！本教程将带你从零开始学习如何创建自定义 Scratch 扩展。

## 教程简介

Scratch 是全球最受欢迎的少儿编程平台之一。通过开发 Scratch 扩展，你可以：

- 🔌 连接各种硬件设备
- 🌐 调用外部 API 服务
- 🎮 创建自定义游戏功能
- 🤖 实现机器学习功能

## 目录

### 第一章：入门基础

- [1.1 Scratch 扩展简介](./1.1%20Scratch%20扩展简介.md) - 了解扩展的概念和基本结构
- [1.2 扩展开发环境搭建](./1.2%20扩展开发环境搭建.md) - 搭建开发环境

### 第二章：积木块设计

- [2.1 积木块类型详解](./2.1%20积木块类型详解.md) - 六种积木块类型的使用
- [2.2 参数类型与菜单](./2.2%20参数类型与菜单.md) - 参数设计和下拉菜单

### 第三章：实战应用

- [3.1 API 调用扩展](./3.1%20API%20调用扩展.md) - 网络请求和数据处理
- [3.2 硬件交互扩展](./3.2%20硬件交互扩展.md) - 串口、蓝牙通信

## 学习建议

### 前置知识

- JavaScript 基础语法
- 异步编程概念（Promise、async/await）
- 基本的 HTML/CSS 知识

### 学习路径

```mermaid
graph LR
    A[环境搭建] --> B[基础语法]
    B --> C[积木块设计]
    C --> D[API 扩展]
    D --> E[硬件扩展]
    E --> F[发布分享]
```

### 推荐工具

| 工具 | 用途 | 链接 |
|-----|-----|-----|
| TurboWarp | 快速开发测试 | https://turbowarp.org |
| VS Code | 代码编辑 | https://code.visualstudio.com |
| Node.js | 本地服务器 | https://nodejs.org |

## 快速开始

### 第一个扩展

```javascript
class HelloExtension {
    getInfo() {
        return {
            id: 'hello',
            name: '你好世界',
            color1: '#FF6680',
            blocks: [
                {
                    opcode: 'sayHello',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '向 [NAME] 问好',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '世界'
                        }
                    }
                }
            ]
        };
    }

    sayHello(args) {
        return `你好，${args.NAME}！`;
    }
}

Scratch.extensions.register(new HelloExtension());
```

### 在 TurboWarp 中测试

1. 打开 [TurboWarp 编辑器](https://turbowarp.org/editor)
2. 点击左下角 "添加扩展"
3. 选择 "自定义扩展"
4. 粘贴上面的代码
5. 点击 "确定" 加载扩展

## 常见问题

### Q: 为什么我的扩展无法加载？

A: 请检查：
- 代码语法是否正确
- 是否在 HTTPS 环境下运行
- 浏览器是否支持所需 API

### Q: 如何发布我的扩展？

A: 可以通过以下方式：
- 上传到 GitHub Pages
- 提交到 TurboWarp 扩展库
- 分享扩展 URL

### Q: 扩展支持哪些浏览器？

A: 推荐使用：
- Chrome 89+
- Edge 89+
- Firefox 90+

## 资源链接

- [Scratch 官方网站](https://scratch.mit.edu)
- [TurboWarp](https://turbowarp.org)
- [Scratch 扩展开发文档](https://en.scratch-wiki.info/wiki/Scratch_Extension)
- [GitHub - scratch-vm](https://github.com/LLK/scratch-vm)

## 贡献指南

欢迎对本教程提出建议和改进：

1. Fork 项目仓库
2. 创建新的分支
3. 提交修改
4. 发起 Pull Request

---

> 💡 **提示**：建议按照章节顺序学习，循序渐进掌握扩展开发技能。
