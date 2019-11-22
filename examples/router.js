import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () =>
        import('@/views/pages/index.vue'),
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: 'Home',
          component: () =>
            import(/* webpackChunkName: "home" */ '@/views/pages/home.vue')
        },
        {
          path: 'about',
          name: 'About',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () =>
            import(/* webpackChunkName: "about" */ '@/views/pages/about.vue')
        }
      ]
    },
    {
      path: '/demo_topology',
      name: 'DemoTopology',
      component: () =>
        import(/* webpackChunkName: "demo-topology" */ '@/views/demos/demo-topology.vue')
    },
    {
      path: '/mobile',
      name: 'Mobile',
      component: () =>
        import(/* webpackChunkName: "mobile" */ '@/views/pages/mobile.vue')
    },
    {
      path: '*',
      component: () =>
        import(/* webpackChunkName: "home" */ '@/views/error-pages/404.vue')
    }
  ]
})

/**
 * 验证
 */
router.beforeEach((to, from, next) => {
  if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
    if (to.path === '/mobile') {
      next()
    } else {
      next('/mobile')
    }
  } else {
    if (to.path === '/mobile') {
      next('/home')
    } else {
      next()
    }
  }
})

export default router
