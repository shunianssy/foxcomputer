import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'FoxComputer',
  description: '小狐狸提供的共享贡献计算机知识平台',
  base: '/',
  
  themeConfig: {
    logo: '/logo.png',
    
    nav: [
      { text: 'Flask', link: '/flask/' }
    ],
    
    sidebar: 'auto',
    
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
