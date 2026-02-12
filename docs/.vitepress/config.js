import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'

// 自动生成侧边栏
function getSidebarItems(dirPath = './docs') {
  const files = fs.readdirSync(path.resolve(__dirname, dirPath))
  const items = files
    .filter(file => fs.statSync(path.resolve(__dirname, dirPath, file)).isDirectory())
    .map(folder => ({
      text: folder,
      link: `/${folder}/`,
      items: getSidebarItems(path.join(dirPath, folder))
    }))
  return items
}

export default defineConfig({
  title: 'FoxComputer',
  description: '小狐狸提供的共享贡献计算机知识平台',
  base: '/',
  themeConfig: {
    logo: '/logo.png',
    sidebar: getSidebarItems('docs'), // 传入目录路径
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
