import Vue from "vue";
import Vuex from "vuex";

import movie1 from "@/assets/sw01.json";
import movie2 from "@/assets/sw02.json";
import movie3 from "@/assets/sw03.json";
import movie4 from "@/assets/sw04.json";
import movie5 from "@/assets/sw05.json";
import movie6 from "@/assets/sw06.json";
import definitions from "@/assets/definitions.json";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    movies: [movie1, movie2, movie3, movie4, movie5, movie6],
    definitions
  },
  mutations: {},
  actions: {},
  modules: {}
});
