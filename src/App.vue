<template>
  <div id="app">
    <div v-if="screen" class="mobile">
      The Force arriving soon on mobile !
    </div>
    <div v-else class="myApp">
      <!-- <vue-particles
        color="#dedede"
        :particleOpacity="1"
        :particlesNumber="160"
        shapeType="circle"
        :particleSize="2"
        :lineLinked="false"
        :moveSpeed="0.2"
        :hoverEffect="false"
        :clickEffect="false"
        class="particules"
      ></vue-particles> -->
      <transition name="fade">
        <Navigation v-if="navRender" />
      </transition>
      <transition name="fade" mode="out-in">
        <router-view class="router" :key="id" />
      </transition>
    </div>
    <transition name="fade" mode="out-in">
      <comp-credits v-if="creditsBool" />
    </transition>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  watch,
} from '@vue/composition-api'
import Navigation from '@/components/comp-navigation'
import compCredits from '@/components/comp-credits'
import { Howl } from 'howler'
import { isMobile, preloadImages } from '@/tools/utils'

export default defineComponent({
  name: 'Application',
  components: {
    Navigation,
    compCredits,
  },
  setup(props, ctx) {
    const keyUp = ref(true)
    const screen = ref(false)
    const creditsBool = computed(() => {
      return ctx.root.$store.state.checks.credit
    })

    var sound = new Howl({
      // src: ['../../assets/music/main.mp3'],
      src: ['main.mp3'],
      loop: true,
      volume: 0.5,
      onload: function() {
        sound.fade(0, 0.5, 3000)
      },
    })

    var myMusic = sound.play()

    const routes = ctx.root.$router.options.routes
    const route = computed(() => {
      return ctx.root.$route.name
    })
    const index = computed(() => {
      return routes.findIndex(x => x.name === route.value)
    })
    const id = computed(() => {
      return ctx.root.$route.params.id
    })
    const navRender = computed(() => {
      if (
        route.value !== 'Choice' &&
        route.value !== 'Loader' &&
        ctx.root.$store.state.checks.animation
      ) {
        return true
      } else {
        return false
      }
    })

    onMounted(() => {
      // Let's preload images
      preloadImages(ctx.root.$store.state.loader, () => {
        ctx.root.$store.commit('toggleCheck', 'loaded')
      })

      // Check is mobile version
      screen.value = isMobile(window)

      // Check is Mobile version on resize
      window.addEventListener('resize', () => {
        screen.value = isMobile(window)
      })

      // Navigation arrows
      document.addEventListener('keydown', e => {
        // Get the KeyCode
        const key = e.keyCode
        // if History and animation running return
        if (
          route.value === 'History' &&
          !ctx.root.$store.state.checks.animation
        ) {
          return
        }

        // If is not Choice or Loader, arrow navigation
        if (
          route.value !== 'Choice' &&
          route.value !== 'Loader' &&
          !ctx.root.$store.state.checks.nav
        ) {
          // right
          if (key === 39) {
            if (id.value < 6 && keyUp.value === true) {
              ctx.root.$router.push({
                name: route.value,
                params: { id: parseInt(id.value) + 1 },
              })
            }
          }
          // left
          if (key === 37) {
            if (id.value > 1 && keyUp.value === true) {
              ctx.root.$router.push({
                name: route.value,
                params: { id: parseInt(id.value) - 1 },
              })
            }
          }
          // down
          if (key === 40) {
            if (route.value !== 'Numbers') {
              ctx.root.$router.push({
                name: routes[index.value + 1].name,
              })
            }
          }
          // up
          if (key === 38) {
            ctx.root.$router.push({
              name: routes[index.value - 1].name,
            })
          }
        }

        keyUp.value = false
      })

      document.addEventListener('keyup', e => {
        if (
          e.keyCode === 39 ||
          e.keyCode === 37 ||
          e.keyCode === 38 ||
          e.keyCode === 40
        ) {
          keyUp.value = true
        }
      })
    })

    watch(
      () => ctx.root.$store.state.checks.music,
      (value, prevValue) => {
        if (value) {
          sound.play(myMusic)
          sound.fade(0, 0.5, 500, myMusic)
        }

        if (!value && prevValue) {
          sound.fade(0.5, 0, 500, myMusic)
          sound.on('fade', function() {
            if (this.volume === 0) sound.pause(myMusic)
          })
        }
      }
    )

    return {
      screen,
      navRender,
      id,
      creditsBool,
    }
  },
  beforeRoute(to, from, next) {
    next()
  },
})
</script>

<style lang="scss">
* {
  margin: 0;
}

@font-face {
  font-family: 'star_jediregular';
  src: url('./assets/fonts/starjedi-webfont.woff2') format('woff2'),
    url('./assets/fonts/starjedi-webfont.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'roboto';
  src: url('./assets/fonts/Roboto-Medium.ttf') format('ttf');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'roboto-black';
  src: url('./assets/fonts/Roboto-Black.ttf') format('ttf');
  font-weight: normal;
  font-style: normal;
}

body {
  background-color: #18181c;
  color: white;
  margin: 0 auto;
  padding: 0;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  line-height: 1.4;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

a {
  color: inherit;
  text-decoration: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.fade-history-enter-active,
.fade-history-leave-active {
  transition: all 0.15s ease;
}

.fade-history-enter,
.fade-history-leave-active {
  opacity: 0;
}

.mobile {
  color: white;
  font-family: star_jediregular;
  letter-spacing: 0.1em;
  padding: 40px;
  text-align: center;
}

.router {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
}

.particules {
  height: 100vh;
  width: 100vw;
  z-index: 1;
}
.blur {
  filter: blur(3px);
}
</style>
