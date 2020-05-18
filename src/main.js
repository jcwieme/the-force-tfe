import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueParticles from 'vue-particles'
import VueCompositionApi from '@vue/composition-api'
import underscore from 'vue-underscore'

Vue.use(VueCompositionApi)
Vue.use(VueParticles)
Vue.config.productionTip = false
Vue.use(underscore)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
