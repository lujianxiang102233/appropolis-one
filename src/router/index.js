import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import home from '@/components/home'
import companies from '@/components/companies/companies'
import role from '@/components/companies/role'
import companyaccess from '@/components/companies/companyaccess'
import user from '@/components/companies/user'
import logs from '@/components/companies/logs'

import roleaccess from '@/components/companies/roleaccess'
Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/login',
      // name: 'login',
      component: login
    },
    {
      path: '/',
      // name: 'home',
      redirect: '/home'
    },
    {
      path: '/home',
      // name: 'home',
      component: home,
      children: [
        {
          path: '/companies',
          // name: 'companies',
          component: companies
        },
        {
          path: '/companyaccess',
          // name: 'companyaccess',
          component: companyaccess
        },
        {
          path: '/role',
          name: 'role',
          component: role
        },
        {
          path: '/user',
          // name: 'user',
          component: user
        },
        {
          path: '/roleaccess',
          component: roleaccess
        },
        {
          path: '/logs',
          component: logs
        }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token')
  if (token || to.path === '/login') {
    next()
  } else {
    next('/login')
  }
})
export default router
