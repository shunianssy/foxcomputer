import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function getSidebarItems(folder) {
  const dirPath = path.resolve(__dirname, '../', folder)
  
  if (!fs.existsSync(dirPath)) return []

  // 获取文件夹下的所有 md 文件
  const items = fs.readdirSync(dirPath)
    .filter(file => file.endsWith('.md') && file.toLowerCase() !== 'index.md')
    .sort((a, b) => {
      const nA = parseFloat(a) || 0
      const nB = parseFloat(b) || 0
      return nA - nB
    })
    .map(file => {
      const name = file.replace('.md', '')
      return {
        text: name, 
        link: `/${folder}/${name}`
      }
    })

  // 在列表最前面插入“首页”选项
  return [
    { text: '首页', link: '/' },
    ...items
  ]
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

    sidebar: {
      // 匹配所有路径，确保侧边栏全局可见
      '/': [
        {
          text: '项目菜单',
          collapsed: false,
          items: getSidebarItems('flask') 
        }
      ]
    },

    nav: [
      { text: '首页', link: '/' },
      { text: 'Flask', link: '/flask/index' }
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
