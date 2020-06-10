import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import CalculTaux from '../views/CalculTaux.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'Home',
  component: Home
}, {
  path: '/calculTaux',
  name: 'CalculTaux',
  component: CalculTaux
}]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router