import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'FoxComputer',
  description: '小狐狸提供的共享贡献计算机知识平台',
  base: '/foxcomputer/',
  
  themeConfig: {
    logo: '/logo.png',
    
    nav:[
      { text: 'Flask', link: '/flask/' }
    ],
    
    sidebar: {
      '/guide/': [
        {
          text: 'Flask',
          items: [
            { text: '快速开始', link: '/flask/' }
          ]
        }
      ]
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/shunianssy/foxcomputer' }
    ]
  }
})
