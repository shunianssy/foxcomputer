import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'

export default defineConfig({
  title: 'FoxComputer',
  description: '小狐狸提供的共享贡献计算机知识平台',
  base: '/',
  
  themeConfig: {
    logo: '/logo.png',
    
    // 使用插件自动生成侧边栏
    sidebar: generateSidebar([
      {
        /* 扫描 flask 目录
           如果你有更多目录（比如 /python/），只需在这个数组里多加一个对象
        */
        documentRootPath: '/', 
        scanStartPath: 'flask',
        resolvePath: '/flask/',
        useTitleFromFileHeading: true, // 优先使用 Markdown 里的 # 标题
        collapsed: false,             // 默认展开
      }
    ]),

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
