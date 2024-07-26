import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FuncView from '../views/FuncView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/main',
      name: 'func',
      component: () => FuncView
    },
  ]
})

router.beforeEach(async (to, from, next) => {
	let json = await fetch(`http://95.163.221.125:8080/folders/findFoldersByTitle?userID=${localStorage.getItem("userID")}&title=''`, {
		method: "GET", headers: { "Content-Type": "application/json", "Authorization": localStorage.getItem("token") },
	})

  if (json.status == 401 && to.name != "home") return next({ name: "home" })

  return next()
})

router.afterEach((to, from, failure) => {
  if (window != undefined) window.scrollTo({ top: 0 })
})

export default router
