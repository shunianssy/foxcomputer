import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 自动化读取目录文件生成侧边栏列表
 */
function getSidebarItems(folder) {
  // 确保路径指向 docs/flask
  const dirPath = path.resolve(__dirname, '../', folder)
  
  if (!fs.existsSync(dirPath)) return []

  return fs.readdirSync(dirPath)
    .filter(file => file.endsWith('.md') && file.toLowerCase() !== 'index.md')
    .sort((a, b) => {
      // 提取文件名中的数字进行排序，例如 1.1 1.2 2.1
      const nA = parseFloat(a) || 0
      const nB = parseFloat(b) || 0
      return nA - nB
    })
    .map(file => {
      const name = file.replace('.md', '')
      return {
        text: name, // 侧边栏显示文件名
        link: `/${folder}/${name}`
      }
    })
}

export default defineConfig({
  title: 'FoxComputer',
  description: '小狐狸提供的共享贡献计算机知识平台',
  base: '/',
  
  // 语言设置为中文，会自动汉化部分内置文本
  lang: 'zh-CN',

  themeConfig: {
    logo: '/logo.png',
    
    // --- 汉化 UI 配置 ---
    darkModeSwitchLabel: '主题',
    sidebarMenuLabel: '菜单',      // 对应移动端 Menu 汉化
    returnToTopLabel: '返回顶部',  // 对应 Return to top 汉化
    outlineTitle: '本页导读',

    // 自定义上下页按钮文字
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    // --- 侧边栏配置 ---
    // 为了让首页也显示菜单，我们直接使用数组格式，或者匹配 '/' 路径
    sidebar: {
      // 匹配所有路径，确保首页和 Flask 目录都能看到菜单
      '/': [
        {
          text: 'Flask 教程文档',
          collapsed: false,
          items: getSidebarItems('flask') // 自动抓取 flask 文件夹下的所有 md
        }
      ]
    },

    nav: [
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
