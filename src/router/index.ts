import { createRouter, createWebHistory } from 'vue-router'
export const router = createRouter({
  history: createWebHistory(),
  routes: [],
})
// 是否已经加载了路由
// let isLoad = false
// router.beforeEach(async (to, from) => {
//   if (isLoad) return
//   const token = getCache('token')
//   if (token && token != '') {
//     const routes = router.getRoutes()
//     // 当前路由长度以及超过默认路由 或者本地存储了路由 则认为已经注册过
//     if (routes.length <= commonRoutes.length && to.fullPath !== '/login') {
//       //设置权限
//       await getInfo()
//       // 设置路由
//       await setDynamicRouter()
//       router.replace(to.path)
//       isLoad = true
//       return true
//     }
//   }
// })

export default router
