import { createWebHashHistory, createRouter } from 'vue-router'

const Home = () => import('@/pages/Home/index.vue')
const Login = () => import('@/pages/Login/index.vue')
const Calendar = () => import('@/pages/Calendar/index.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  { path: '/calendar', name: 'Calendar', component: Calendar },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to, _form, next) => {
  const isLogin = window.localStorage.getItem('_authing_token')
  if (!isLogin) {
    if (to.path !== '/login') {
      next({ path: '/login' })
      window.$message.warning('请先完成登录')
    }
  }
  next()
  return Boolean(isLogin)
})
export default router
