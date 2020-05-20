import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueParticles from 'vue-particles'
import VueCompositionApi from '@vue/composition-api'
import underscore from 'vue-underscore'
import Vue2TouchEvents from 'vue2-touch-events'

Vue.use(VueCompositionApi)
Vue.use(VueParticles)
Vue.config.productionTip = false
Vue.use(underscore)
Vue.use(Vue2TouchEvents)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
