import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * 深度递归生成侧边栏
 * @param {string} targetPath 绝对路径
 * @param {string} linkPath 路由前缀
 */
function getSidebarItems(targetPath, linkPath) {
  const items = []
  if (!fs.existsSync(targetPath)) return items

  const files = fs.readdirSync(targetPath)

  files.forEach(file => {
    const fullPath = path.join(targetPath, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      // 如果是文件夹，递归处理
      const children = getSidebarItems(fullPath, `${linkPath}${file}/`)
      if (children.length > 0) {
        items.push({
          text: file,
          items: children,
          collapsed: true // 子目录默认折叠，防止侧边栏过长
        })
      }
    } else if (file.endsWith('.md') && file.toLowerCase() !== 'index.md') {
      // 如果是 MD 文件，添加到列表
      const name = file.replace('.md', '')
      items.push({
        text: name, // 这里直接显示文件名，如 "1.1"
        link: `${linkPath}${name}`
      })
    }
  })

  // 排序逻辑：支持 1.1, 1.2 这种数字排序
  return items.sort((a, b) => {
    return a.text.localeCompare(b.text, undefined, { numeric: true, sensitivity: 'base' })
  })
}

export default defineConfig({
  title: 'FoxComputer',
  description: '小狐狸提供的共享贡献计算机知识平台',
  base: '/',
  
  themeConfig: {
    logo: '/logo.png',
    
    sidebar: {
      // 自动扫描 docs/flask 文件夹下的所有内容
      '/flask/': [
        {
          text: '🚀 Flask 完整教程',
          items: getSidebarItems(path.resolve(__dirname, '../../flask'), '/flask/')
        }
      ]
    },

    nav: [
      { text: 'Flask', link: '/flask/' }
    ],
    // ... 其他配置保持不变
    footer: {
      message: 'Released under the CC BY-NC-SA 4.0 License.',
      copyright: 'Copyright © 2024 Shunianssy'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/shunianssy/foxcomputer' }
    ],
    search: { provider: 'local' }
  }
})
