
const routes = [
    {
      path: '/',
      component: () => import('../layouts/MainLayout.vue'),
      children: [
        { path: '', component: () => import('pages/Index.vue') }
      ],
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      component: () => import('../layouts/MainLayout.vue'),
      children: [
        { path: '', component: () => import('pages/Login.vue') }
      ]
    },
    {
      path: '/user-cabinet',
      component: () => import('../layouts/MainLayout.vue'),
      children: [
        { path: '', component: () => import('pages/UserCabinet.vue') }
      ],
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/registration',
      component: () => import('../layouts/MainLayout.vue'),
      children: [
        { path: '', component: () => import('pages/Registration.vue') }
      ]
    }, 
    {
      path: '/task-types',
      component: () => import('../layouts/MainLayout.vue'),
      children: [
        { path: '', component: () => import('../pages/TaskType.vue') }
      ]
    }
  ]
  
  // Always leave this as last one
  if (process.env.MODE !== 'ssr') {
    routes.push({
      path: '*',
      component: () => import('pages/Error404.vue')
    })
  }
  
  export default routes
  