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
          text: 'Flask 教程文档',
          collapsed: false,
          items: getSidebarItems('flask') 
        },
        {
          text: '科技快报',
          collapsed: false,
          items: getSidebarItems('news') 
        },
       {
          text: '赛博扫盲',
          collapsed: false,
          items: getSidebarItems('literacy') 
        }
      ]
    },

    // --- 导航栏配置 ---
    nav: [
      { text: '首页', link: '/' },
      { text: 'Flask', link: '/flask/index' },
      { text: '科技新闻', link: '/news/index' },
      { text: '赛博扫盲', link: '/literacy/index' }
    ],

    footer: {
      message: 'Released under the CC BY-NC-SA 4.0 License.',
      copyright: 'Copyright © 2024 Shunianssy'
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/shunianssy/foxcomputer' }
    ],
    
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
