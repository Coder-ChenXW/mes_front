import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    meta: { roles: ['admin', 'hr', 'cutter', 'normal'] },
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'example', roles: ['admin', 'hr', 'cutter', 'normal'] }
    }]
  },
  {
    path: '/employee',
    component: Layout,
    meta: { roles: ['admin', 'hr'] },
    children: [
      {
        path: 'index',
        name: 'Employee',
        component: () => import('@/views/employee/index'),
        meta: { title: '员工管理', icon: 'user', roles: ['admin', 'hr'] }
      },
      { path: '*', redirect: '/404', hidden: true }
    ]
  },
  {
    path: '/product',
    component: Layout,
    meta: { roles: ['admin', 'hr'] },
    children: [
      {
        path: 'index',
        name: 'Product',
        component: () => import('@/views/product/index'),
        meta: { title: '产品管理', icon: 'nested', roles: ['admin', 'hr'] }
      },
      { path: '*', redirect: '/404', hidden: true }
    ]
  },
  {
    path: '/order',
    component: Layout,
    meta: { roles: ['admin', 'hr', 'cutter', 'steper'] },
    children: [
      {
        path: 'index',
        name: 'Order',
        component: () => import('@/views/order/index'),
        meta: { title: '订单管理', icon: 'form', roles: ['admin', 'hr', 'cutter', 'normal'] }
      },
      { path: '*', redirect: '/404', hidden: true }
    ]
  },
  {
    path: '/supplier',
    component: Layout,
    meta: { roles: ['admin', 'hr'] },
    children: [
      {
        path: 'index',
        name: 'Order',
        component: () => import('@/views/supplier/index'),
        meta: { title: '供应商管理', icon: 'el-icon-truck', roles: ['admin', 'hr'] }
      },
      { path: '*', redirect: '/404', hidden: true }
    ]
  },
  {
    path: '/purchase',
    component: Layout,
    meta: { title: '采购管理', icon: 'el-icon-shopping-cart-2', roles: ['admin', 'hr'] },
    children: [
      {
        path: 'index',
        name: 'purchase',
        component: () => import('@/views/purchase/index'),
        meta: { title: '采购管理', roles: ['admin', 'hr'] }
      },
      { path: '*', redirect: '/404', hidden: true }
    ]
  },
  {
    path: '/report',
    component: Layout,
    redirect: '/report/order',
    name: 'Report',
    meta: { title: '报表管理', icon: 'el-icon-data-analysis', roles: ['admin', 'hr'] },
    children: [
      {
        path: 'order',
        name: 'Order',
        component: () => import('@/views/report/order/index'),
        meta: { title: '对数表', icon: '', roles: ['admin', 'hr'] }
      },
      {
        path: 'craft',
        name: 'craft',
        component: () => import('@/views/report/craft/index'),
        meta: { title: '工艺表', icon: '', roles: ['admin', 'hr'] }
      },
      { path: '*', redirect: '/404', hidden: true }
    ]
  },
  {
    path: '/log',
    component: Layout,
    meta: { title: '日志管理', icon: 'el-icon-edit-outline', roles: ['admin', 'hr', 'cutter', 'steper'] },
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/log/index'),
        meta: { title: '日志管理', roles: ['admin', 'hr'] }
      },
      { path: '*', redirect: '/404', hidden: true }
    ]
  }
]

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }

]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
