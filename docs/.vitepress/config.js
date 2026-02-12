import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 获取侧边栏项目
 * @param {string} folder 文件夹名称（相对于项目根目录）
 */
function getSidebarItems(folder) {
  // 这里的 ../../ 是假设配置文件在 .vitepress/ 目录下，而 flask 目录在项目根目录
  // 如果 flask 目录在 .vitepress 同级，请确保路径指向正确
  const dirPath = path.resolve(__dirname, '../../', folder)
  
  if (!fs.existsSync(dirPath)) {
    console.warn(`目录不存在: ${dirPath}`)
    return []
  }

  // 获取文件夹下的所有 md 文件
  const items = fs.readdirSync(dirPath)
    .filter(file => file.endsWith('.md') && file.toLowerCase() !== 'index.md')
    .sort((a, b) => {
      // 提取文件名开头的数字进行排序，例如 "1.介绍.md"
      const nA = parseInt(a.match(/^\d+/)?.[0] || '999')
      const nB = parseInt(b.match(/^\d+/)?.[0] || '999')
      return nA - nB
    })
    .map(file => {
      const name = file.replace('.md', '')
      return {
        text: name, 
        // 这里的路径需要和 base 配置对应
        link: `/${folder}/${name}`
      }
    })

  return items
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
    lastUpdatedText: '最后更新于',

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    sidebar: {
      // 建议针对具体路径配置侧边栏，这样更灵活
      '/flask/': [
        {
          text: 'Flask 开发指南',
          collapsed: false,
          items: getSidebarItems('flask') 
        }
      ]
    },

    nav: [
      { text: '首页', link: '/' },
      { text: 'Flask 教程', link: '/flask/' } // 建议指向目录 index.md
    ],

    footer: {
      message: 'Released under the CC BY-NC-SA 4.0 License.',
      copyright: 'Copyright © 2024-2026 Shunianssy'
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/shunianssy/foxcomputer' }
    ],
    
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonWidgetTitle: '搜索文档' },
          modal: {
            displayDetails: '显示详情',
            resetButtonTitle: '清除查询',
            noResultsText: '未找到相关结果',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    }
  }
})
