import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import { h } from 'vue'
import './custom.css'

// 自定义编辑链接组件，支持跳转到对应章节
const EditLink = () => {
  const { page, frontmatter } = useData()
  
  // 获取当前页面的相对路径
  const relativePath = page.value.relativePath
  // 获取当前 URL 的锚点（章节）
  const hash = typeof window !== 'undefined' ? window.location.hash : ''
  
  // 构建编辑链接，添加锚点定位到具体章节
  const editUrl = `https://github.com/shunianssy/foxcomputer/edit/main/docs/${relativePath}${hash}`
  
  return h('a', {
    href: editUrl,
    target: '_blank',
    rel: 'noopener noreferrer',
    class: 'edit-link'
  }, [
    h('span', { class: 'edit-link-icon' }, '✏️'),
    ' 在 GitHub 上编辑此页',
    hash ? ` (${hash.replace('#', '')})` : ''
  ])
}

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'doc-footer-before': () => h(EditLink)
    })
  }
}
