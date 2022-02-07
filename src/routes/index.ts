import { createWebHashHistory, createRouter } from 'vue-router'

const Home = () => import('@/pages/Home/index.vue')
const Calendar = () => import('@/pages/Calendar/index.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    // redirect: "/calendar",
    component: Home
  },
  { path: '/calendar', name: 'Calendar', component: Calendar }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
