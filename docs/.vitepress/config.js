import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 核心自动生成函数：支持排序和深度查找
 */
function getSidebarItems(dirName) {
  // 关键：确定 docs 的绝对路径
  // 如果你的 .vitepress 在 docs 目录下，这里向上跳两级
  const targetDir = path.resolve(__dirname, '../', dirName)
  
  if (!fs.existsSync(targetDir)) {
    console.warn(`目录不存在: ${targetDir}`)
    return []
  }

  return fs.readdirSync(targetDir)
    .filter(file => file.endsWith('.md') && file.toLowerCase() !== 'index.md')
    .sort((a, b) => {
      // 针对 1.1, 1.2 这种文件名进行逻辑排序
      return parseFloat(a) - parseFloat(b)
    })
    .map(file => {
      return {
        text: file.replace('.md', ''),
        link: `/${dirName}/${file.replace('.md', '')}`
      }
    })
}

export default defineConfig({
  title: 'FoxComputer',
  description: '小狐狸提供的共享贡献计算机知识平台',
  // 如果你部署在 https://<username>.github.io/ 根目录，这里填 '/'
  // 如果是 https://<username>.github.io/foxcomputer/，这里填 '/foxcomputer/'
  base: '/', 

  themeConfig: {
    logo: '/logo.png',
    
    sidebar: {
      // 匹配 /flask/ 路径下的所有页面
      '/flask/': [
        {
          text: 'Flask 详细教程',
          collapsed: false,
          items: getSidebarItems('flask') // 自动读取 docs/flask 目录
        }
      ]
    },

    nav: [
      { text: 'Flask 教程', link: '/flask/index' }
    ],

    // ... 其他配置
    search: { provider: 'local' }
  }
})
