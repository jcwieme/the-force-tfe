import Vue from 'vue'
import VueRouter from 'vue-router'
import Loader from '@/views/Loader.vue'
import Choice from '@/views/Choice.vue'
import Words from '@/views/Words.vue'
import Dialogues from '@/views/Dialogues.vue'
import Numbers from '@/views/Numbers.vue'
import History from '@/views/History.vue'

import store from '@/store/'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Loader',
    component: Loader,
  },
  {
    path: '/choice',
    name: 'Choice',
    component: Choice,
  },
  {
    path: '/movie/:id/history',
    name: 'History',
    component: History,
  },
  {
    path: '/movie/:id/dialogues',
    name: 'Dialogues',
    component: Dialogues,
  },
  {
    path: '/movie/:id/words',
    name: 'Words',
    component: Words,
  },
  {
    path: '/movie/:id/numbers',
    name: 'Numbers',
    component: Numbers,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  if (from.name === null) {
    if (to.name !== 'History' && to.name !== 'Loader' && to.name !== 'Choice') {
      store.commit('toggleAnimation')
    }
  }
  if (to.params.id) {
    store.commit('setActiveMovie', to.params.id - 1)

    if (to.params.id === '6' && from.name === 'Choice') {
      store.commit('falseArrowRight')
    }

    if (to.params.id === '1' && from.name === 'Choice') {
      store.commit('falseArrowLeft')
    }
  }
  next()
})

export default router
