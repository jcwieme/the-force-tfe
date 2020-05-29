import Vue from 'vue'
import Vuex from 'vuex'

import movie1 from '@/assets/sw01.json'
import movie2 from '@/assets/sw02.json'
import movie3 from '@/assets/sw03.json'
import movie4 from '@/assets/sw04.json'
import movie5 from '@/assets/sw05.json'
import movie6 from '@/assets/sw06.json'
import numbers from '@/assets/numbers.json'
import loader from '@/assets/loader.json'
import credits from '@/assets/credits.json'
import definitions from '@/assets/definitions.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    movies: [movie1, movie2, movie3, movie4, movie5, movie6],
    definitions,
    activeMovie: null,
    wordsInMovie: [9380, 7566, 8078, 10336, 7707, 6604],
    linesInMovie: [946, 620, 783, 1038, 947, 719],
    numbers,
    credits,
    loader,
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
  },
  actions: {},
  modules: {},
})
