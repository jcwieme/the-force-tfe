import Vue from 'vue'
import Vuex from 'vuex'

import movie1 from '@/assets/sw01.json'
import movie2 from '@/assets/sw02.json'
import movie3 from '@/assets/sw03.json'
import movie4 from '@/assets/sw04.json'
import movie5 from '@/assets/sw05.json'
import movie6 from '@/assets/sw06.json'
import definitions from '@/assets/definitions.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    movies: [movie1, movie2, movie3, movie4, movie5, movie6],
    definitions,
    activeMovie: null,
    arrowRight: true,
    arrowLeft: true,
    wordsInMovie: [9380, 7566, 8078, 10336, 7707, 6604],
    linesInMovie: [946, 620, 783, 1038, 947, 719],
  },
  mutations: {
    setActiveMovie(state, number) {
      state.activeMovie = number
    },
    falseArrowLeft(state) {
      state.arrowLeft = false
    },
    falseArrowRight(state) {
      state.arrowRight = false
    },
    trueArrowLeft(state) {
      state.arrowLeft = true
    },
    trueArrowRight(state) {
      state.arrowRight = true
    },
  },
  actions: {},
  modules: {},
})
