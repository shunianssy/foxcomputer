import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 兼容 ESM 模式下的 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 自动生成侧边栏函数
 * @param {string} folder 文件夹路径 (相对于 docs 目录)
 */
function autoGenerateSidebar(folder) {
  // 这里的 ../../ 是因为 config.js 在 .vitepress 目录下
  const dirPath = path.resolve(__dirname, '../../', folder)
  
  if (!fs.existsSync(dirPath)) return []

  return fs.readdirSync(dirPath)
    .filter(file => {
      // 过滤掉 index.md 和非 markdown 文件
      return file.endsWith('.md') && file.toLowerCase() !== 'index.md'
    })
    .map(file => {
      const name = file.replace('.md', '')
      return {
        text: name.charAt(0).toUpperCase() + name.slice(1), // 首字母大写
        link: `/${folder}/${name}`
      }
    })
}

export default defineConfig({
  title: 'FoxComputer',
  description: '小狐狸提供的共享贡献计算机知识平台',
  base: '/',
  
  themeConfig: {
    logo: '/logo.png',
    
    // 侧边栏配置
    sidebar: {
      // 当用户在 /flask/ 路径下时，自动显示 flask 目录下的文件
      '/flask/': [
        {
          text: 'Flask',
          items: autoGenerateSidebar('flask')
        }
      ]
      // 如果以后有 python 目录，直接加一行即可：
      // '/python/': [{ text: 'Python 教程', items: autoGenerateSidebar('python') }]
    },

    aside: true,
    nav: [
      { text: 'Flask', link: '/flask/' }
    ],
    
    footer: {
      message: 'Released under the CC BY-NC-SA 4.0 License.',
      copyright: 'Copyright © 2024 Shunianssy'
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/shunianssy/foxcomputer' }
    ],
    
    search: {
      provider: 'local'
    }
  }
})
