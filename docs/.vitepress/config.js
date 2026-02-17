import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function getSidebarItems(folder) {
  const dirPath = path.resolve(__dirname, '../', folder)
  if (!fs.existsSync(dirPath)) return []

  return fs.readdirSync(dirPath)
    .filter(file => file.endsWith('.md') && file.toLowerCase() !== 'index.md')
    .sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0))
    .map(file => {
      const name = file.replace('.md', '')
      return {
        text: name,
        link: `/${folder}/${name}`
      }
    })
}

export default defineConfig({
  title: 'FoxComputer',
  description: '小狐狸提供的共享贡献计算机知识平台',
  base: '/',
  lang: 'zh-CN',

  // 配置 markdown 选项，避免 Jinja2 模板语法与 Vue 冲突
  markdown: {
    // 禁用默认的代码块行高亮，避免解析问题
    lineNumbers: false,
    // 使用 Prism.js 作为语法高亮引擎
    syntaxHighlight: 'prism',
    // 配置 Prism.js 语言支持
    prism: {
      // 注册自定义语言或启用内置语言
      languages: ['jinja2', 'env']
    }
  },
  
  // 忽略死链接检查
  ignoreDeadLinks: true,

  themeConfig: {
    logo: '/logo.png',
    
    // UI 汉化
    darkModeSwitchLabel: '主题',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部', 
    outlineTitle: '本页导读',

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    // --- 侧边栏配置 ---
    sidebar: {
      '/': [
        {
          text: '目录导航',
          items: [
            { text: '首页', link: '/' } // 在这里手动添加首页链接
          ]
        },
        {
          text: 'Python 入门教程',
          collapsed: false,
          items: getSidebarItems('python') 
        },
        {
          text: 'Flask 教程文档',
          collapsed: false,
          items: getSidebarItems('flask') 
        },
        {
          text: 'Django 教程文档',
          collapsed: false,
          items: getSidebarItems('django') 
        },
        {
          text: 'FastAPI 教程文档',
          collapsed: false,
          items: getSidebarItems('fastapi') 
        },
        {
          text: 'Godot 教程文档',
          collapsed: false,
          items: getSidebarItems('godot') 
        },
        {
          text: 'C++ 入门教程',
          collapsed: false,
          items: getSidebarItems('cpp') 
        },
        {
          text: 'Web 前端教程',
          collapsed: false,
          items: getSidebarItems('web') 
        },
        {
          text: '科技快报',
          collapsed: false,
          items: getSidebarItems('news') 
        },
        {
          text: '科技技能',
          collapsed: false,
          items: getSidebarItems('skills') 
        },
        {
          text: 'AI 知识',
          collapsed: false,
          items: getSidebarItems('ai') 
        },
        {
          text: '赛博扫盲',
          collapsed: false,
          items: getSidebarItems('literacy') 
        },
        {
          text: '解决问题系列',
          collapsed: false,
          items: getSidebarItems('troubleshooting') 
        }
      ]
    },

    // --- 导航栏配置 ---
    nav: [
      { text: '首页', link: '/' },
      { text: 'Python', link: '/python/index' },
      { text: 'Flask', link: '/flask/index' },
      { text: 'Django', link: '/django/index' },
      { text: 'FastAPI', link: '/fastapi/index' },
      { text: 'Godot', link: '/godot/index' },
      { text: 'C++', link: '/cpp/index' },
      { text: 'Web前端', link: '/web/index' },
      { text: '科技新闻', link: '/news/index' },
      { text: '科技技能', link: '/skills/index' },
      { text: 'AI 知识', link: '/ai/index' },
      { text: '赛博扫盲', link: '/literacy/index' },
      { text: '解决问题', link: '/troubleshooting/index' }
    ],

    footer: {
      message: 'Released under the CC BY-NC-SA 4.0 License.',
      copyright: 'Copyright © 2024 Shunianssy'
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/shunianssy/foxcomputer' }
    ],
    
    // 在 GitHub 上编辑此页
    editLink: {
      pattern: 'https://github.com/shunianssy/foxcomputer/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },
    
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档' },
          placeholder: '搜索文档'
        }
      }
    }
  }
})
