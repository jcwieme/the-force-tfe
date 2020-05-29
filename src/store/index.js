import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import loader from '@/assets/loader.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loader,
    movies: null,
    definitions: null,
    numbers: null,
    credits: null,
    activeMovie: null,
    wordsInMovie: [9380, 7566, 8078, 10336, 7707, 6604],
    linesInMovie: [946, 620, 783, 1038, 947, 719],
    posts: null,
    checks: {
      loaded: false,
      music: false,
      nav: false,
      credit: false,
      animation: false,
      screen: false,
      load: 0,
      player: 0,
      numbers: false,
      scroll: false,
    },
    arrows: {
      right: true,
      left: true,
      down: true,
    },
    animation: {
      name: 'slide-top',
      mode: '',
    },
    nextRoute: 'choice',
    choices: [
      {
        title: 'the phantom menace',
        path: 'movie/1/history',
        number: 'i',
      },
      {
        title: 'attack of the clones',
        path: 'movie/2/history',
        number: 'ii',
      },
      {
        title: 'revenge of the sith',
        path: 'movie/3/history',
        number: 'iii',
      },
      {
        title: 'a new hope',
        path: 'movie/4/history',
        number: 'iv',
      },
      {
        title: 'the empire strike back',
        path: 'movie/5/history',
        number: 'v',
      },
      {
        title: 'return of the jedi',
        path: 'movie/6/history',
        number: 'vi',
      },
    ],
  },
  mutations: {
    setActiveMovie(state, number) {
      state.activeMovie = number
    },
    arrows(state, options) {
      state.arrows[options.direction] = options.state
    },
    toggleCheck(state, name) {
      state.checks[name] = !state.checks[name]
    },
    checkScreen(state, option) {
      state.checks.screen = option
    },
    addLoad(state) {
      state.checks.load++
    },
    changeAnimation(state, options) {
      state.animation.name = options.name
      state.animation.mode = options.mode
    },
    changeMusic(state, option) {
      state.checks.player = option
    },
    changeScroll(state, option) {
      state.checks.scroll = option
    },
    changeRoute(state, option) {
      state.nextRoute = option
    },
    updatePosts(state, posts) {
      let data = null
      Object.keys(posts).forEach(name => {
        if (name === 'movies') {
          data = []
          Object.keys(posts[name]).forEach(movie => {
            data.push(posts[name][movie])
          })
        } else {
          data = posts[name]
        }
        state[name] = data
      })
    },
  },
  actions: {
    loadData({ commit }) {
      axios
        .get('https://the-force-a0fb6.firebaseio.com/datas.json')
        .then(response => {
          commit('updatePosts', response.data)
          commit('toggleCheck', 'loaded')
        })
    },
  },
  modules: {},
})
