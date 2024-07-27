import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FuncView from '../views/FuncView.vue'
import NotFound from '../views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/',
      name: 'func',
      component: FuncView
    },
    {
      path: "/:catchAll(.*)",
      name: "NotFound",
      component: NotFound,
    },
  ]
})

router.beforeEach(async (to, from, next) => {
	let json = await fetch(`${import.meta.env.VITE_SERVER}/folders/findFoldersByTitle?userID=${localStorage.getItem("userID")}&title=''`, {
		method: "GET", headers: { "Content-Type": "application/json", "Authorization": localStorage.getItem("token") },
	})

  if (json.status == 401 && to.name != "home") return next({ name: "home" })
  else if (json.status != 401 && to.name == "home") return next({ name: "func" })

  return next()
})

router.afterEach((to, from, failure) => {
  if (window != undefined) window.scrollTo({ top: 0 })
})

export default router
