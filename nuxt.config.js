module.exports = {
  router: {
    linkActiveClass: 'active',
    extendRoutes(routes, resolve) {
      // 清除 Nuxt 基于 pages 的路由规则
      routes.splice(0)
      routes.push(
        ...[
          {
            path: '/',
            component: resolve(__dirname, 'pages/layout/'),
            children: [
              {
                path: '',
                name: 'home',
                component: resolve(__dirname, 'pages/home/'),
              },
              {
                path: '/login',
                name: 'login',
                component: resolve(__dirname, 'pages/login/'),
              },
              {
                path: '/register',
                name: 'register',
                component: resolve(__dirname, 'pages/login/'),
              },
              {
                path: '/profile/:username',
                name: 'profile',
                component: resolve(__dirname, 'pages/profile/'),
              },
              {
                path: '/settings',
                name: 'settings',
                component: resolve(__dirname, 'pages/settings/'),
              },
              {
                path: '/editor',
                name: 'editor',
                component: resolve(__dirname, 'pages/editor/'),
              },
              {
                path: '/article/:slug',
                name: 'article',
                component: resolve(__dirname, 'pages/article/'),
              },
            ]
          }
        ]
      )
    }
  },

  css: [
    {src:'element-ui/lib/theme-chalk/index.css'}
  ],

  // 注册插件
  plugins: [
    '~/plugins/request.js',
    '~/plugins/dayjs.js',
    {
      src: '~/plugins/element-ui.js',
      ssr: true,
    },
  ]
}