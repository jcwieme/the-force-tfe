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
      store.commit('toggleCheck', 'animation')
    }
  }
  if (to.name === 'Numbers') {
    store.commit('arrows', { direction: 'down', state: false })
  } else {
    store.commit('arrows', { direction: 'down', state: true })
  }
  if (to.params.id) {
    store.commit('setActiveMovie', to.params.id - 1)

    if (to.params.id.toString() !== '6' && to.params.id.toString() !== '1') {
      store.commit('arrows', { direction: 'left', state: true })
      store.commit('arrows', { direction: 'right', state: true })
    } else {
      if (to.params.id.toString() === '6') {
        store.commit('arrows', { direction: 'right', state: false })
      } else {
        store.commit('arrows', { direction: 'left', state: false })
      }
    }
  }

  if (from.name !== to.name) {
    if (
      !from.name ||
      from.name === 'Loader' ||
      from.name === 'Choice' ||
      to.name === 'Choice'
    ) {
      store.commit('changeAnimation', { name: 'fade', mode: 'out-in' })
    } else {
      let indexTo = routes.findIndex(el => el.name === to.name)
      let indexFrom = routes.findIndex(el => el.name === from.name)
      if (indexFrom < indexTo) {
        store.commit('changeAnimation', { name: 'slide-top', mode: '' })
      } else {
        store.commit('changeAnimation', { name: 'slide-bottom', mode: '' })
      }
    }
  } else {
    store.commit('changeAnimation', { name: 'fade', mode: 'out-in' })
  }
  next()
})

export default router
