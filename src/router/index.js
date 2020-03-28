import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'
import Roles from '../utils/roles'
import Cookies from '../utils/cookie'
import Axios from 'axios'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function () {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach((to, from, next) => {
    const AUTH_TOKEN = Cookies.getCookie(Roles.AUTH_TOKEN_NAME);
    if (to.matched.some(record => record.meta.requiresAuth || record.meta.admin)) {
      if (AUTH_TOKEN == null) {
        next({
          path: '/login',
          params: { nextUrl: to.fullPath }
        })
      } else {
        if (to.matched.some(record => record.meta.admin)) {
          if (Roles.hasAnyRole(Roles.Role.ADMIN)) {
            next()
          } else {
            Router.app.$q.notify({
              color: 'red-4',
              textColor: 'white',
              icon: 'error',
              message: Router.app.$t('error.noPermission')
            })
            next(from)
          }
        } else {
          next()
        }
      }
    } else {
      next()
    }
  })
  return Router
}
