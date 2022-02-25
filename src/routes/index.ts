import { createWebHashHistory, createRouter } from 'vue-router'

const Home = () => import('@/pages/Home/index.vue')
const Login = () => import('@/pages/Login/index.vue')
const Calendar = () => import('@/pages/Calendar/index.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/login',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  { path: '/calendar', name: 'Calendar', component: Calendar }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
