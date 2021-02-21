/*
 * @Description: 
 * @version: 
 * @Author: CafuChino
 * @Date: 2021-02-20 13:50:35
 * @LastEditors: CafuChino
 * @LastEditTime: 2021-02-21 17:12:24
 */
module.exports = {
  lang:'zh-CN',
  title: 'Plop',
  description: 'Plop是一个小工具，它可以节省您的时间，并帮助您的团队构建具有一致性的新文件。',
  head: [['link', { rel: 'icon', href: 'https://i.loli.net/2021/02/20/v1oxqBQwtM2YKiC.png' }]],
  themeConfig: {
    sidebar:'auto',
    logo: 'https://i.loli.net/2021/02/20/v1oxqBQwtM2YKiC.png',
    repo: 'vuejs/vuepress',
    navbar: [
      // NavbarItem
      {
        text: '快速上手',
        link: '/gettingstarted/',
      },
      // NavbarGroup
      {
        text: '配置&APIs',
        children: ['/api/plopfile.md', '/api/builtInActions.md', '/api/builtInHelpers.md'],
      },
      {
        text: '进阶',
        link:'/further.md'
      },
      // 字符串 - 页面文件路径
      '/bar/README.md',
    ],
  }
}