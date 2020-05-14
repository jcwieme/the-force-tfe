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
      <transition :name="animation" :mode="mode">
        <router-view class="router" :key="id" />
      </transition>
    </div>
    <transition :name="creditAnimation">
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
    const screen = computed(() => {
      return ctx.root.$store.state.checks.screen
    })
    const creditsBool = computed(() => {
      return ctx.root.$store.state.checks.credit
    })
    const creditAnimation = ref('slide-top')
    const animation = computed(() => {
      return ctx.root.$store.state.animation.name
    })
    const mode = computed(() => {
      return ctx.root.$store.state.animation.mode
    })

    var sources = [
      '../../assets/music/main.ogg',
      '../../assets/music/cantina.ogg',
      '../../assets/music/cantina2.ogg',
      '../../assets/music/history.ogg',
    ]

    var sounds = []

    sources.forEach((el, index) => {
      sounds.push(
        new Howl({
          // src: [el],
          src: ['main.mp3'],
          preload: true,
          volume: 0.5,
          onend: function() {
            if (index === 2) {
              if (!sounds[0].playing()) {
                sounds[0].play()
                ctx.root.$store.commit('changeMusic', 0)
              }
            } else {
              if (!sounds[index + 1].playing()) {
                sounds[index + 1].play()
                ctx.root.$store.commit('changeMusic', index + 1)
              }
            }
          },
          onpause: function() {
            if (index === 3) return
            ctx.root.$store.commit('changeMusic', index)
          },
        })
      )
    })

    sounds[0].play()

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
      preloadImages(ctx.root.$store.state.loader, ctx.root.$store, () => {
        ctx.root.$store.commit('toggleCheck', 'loaded')
      })

      // Check is mobile version
      ctx.root.$store.commit('checkScreen', isMobile(window))

      // Check is Mobile version on resize
      window.addEventListener('resize', () => {
        ctx.root.$store.commit('checkScreen', isMobile(window))
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
          sounds[ctx.root.$store.state.checks.player].play()
        }

        if (!value && prevValue) {
          sounds.forEach(el => {
            if (el.playing()) el.pause()
          })
        }
      }
    )

    watch(
      () => ctx.root.$store.state.checks.credit,
      (value, prevValue) => {
        if (value && !prevValue) {
          creditAnimation.value = 'slide-bottom'
        } else {
          creditAnimation.value = 'slide-top'
        }
      }
    )

    watch(
      () => ctx.root.$route.name,
      (value, prevValue) => {
        if (!ctx.root.$store.state.checks.music) return

        if (
          (value === 'History' &&
            prevValue === 'Choice' &&
            !ctx.root.$store.state.checks.animation) ||
          (value === 'History' &&
            prevValue === undefined &&
            !ctx.root.$store.state.checks.animation)
        ) {
          sounds[0].pause()
          setTimeout(() => {
            sounds[3].play()
          }, 1250)
        } else {
          if (sounds[3].playing()) {
            sounds[3].pause()
            sounds[ctx.root.$store.state.checks.player].play()
          }
        }
      }
    )

    return {
      screen,
      navRender,
      id,
      creditsBool,
      animation,
      mode,
      creditAnimation,
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

:root {
  // font-size: 62.5%; // 10px
  font-size: calc(100vw * 0.006);
  --overlay-bg: #1867c0;
  --transition-duration: 2s;
}

::-webkit-scrollbar {
  display: none;
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
  padding: 0;
  position: relative;
  font-size: 1.6rem;
  line-height: 1.4;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'roboto', sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

// Transition
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

// Transition History
.fade-history-enter-active,
.fade-history-leave-active {
  transition: all 0.3s ease;
}

.fade-history-enter,
.fade-history-leave-active {
  opacity: 0;
}

.slide-top-enter-active,
.slide-top-leave-active,
.slide-bottom-enter-active,
.slide-bottom-leave-active {
  transition-duration: 750ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.slide-top-enter,
.slide-bottom-leave-active {
  opacity: 0;
  transform: translate(0, 100%);
}

.slide-top-leave-active,
.slide-bottom-enter {
  opacity: 0;
  transform: translate(0, -100%);
}

// Mobile screen
.mobile {
  color: white;
  font-family: star_jediregular;
  letter-spacing: 0.1em;
  padding: 4rem;
  width: calc(100vw - 8rem);
  height: calc(100vh - 8rem);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

// Router position
.router {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
}

// Particles position
.particules {
  height: 100vh;
  width: 100vw;
  z-index: 1;
}

// Blur filter
.blur {
  filter: blur(3px);
}
</style>
