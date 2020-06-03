<template>
  <div id="app">
    <vue-particles
      color="#dedede"
      :particleOpacity="1"
      :particlesNumber="160"
      shapeType="circle"
      :particleSize="2"
      :lineLinked="false"
      :moveSpeed="0.1"
      :hoverEffect="false"
      :clickEffect="false"
      class="particules"
    ></vue-particles>
    <div v-if="screen" class="mobile">
      <p>
        oh, it seems like you're trying to reach the force on a small device.
      </p>
      <p>Don't worry ! Just grab your computer to discover the experience !</p>
    </div>
    <div
      v-else
      class="myApp"
      v-touch:swipe.bottom="upHandler"
      v-touch:swipe.top="downHandler"
      v-touch:swipe.right="leftHandler"
      v-touch:swipe.left="rightHandler"
    >
      <audioComp v-if="!soundCheck" />
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
    <div class="progress progress-down">Progress</div>
    <div class="progress progress-up">Progress</div>
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
import Navigation from '@/components/CompNavigation'
import compCredits from '@/components/CompCredits'
import audioComp from '@/components/CompAudio'
import { isMobile, preloadImages } from '@/tools/utils'
import { _ } from 'vue-underscore'
import gsap from 'gsap'

export default defineComponent({
  name: 'Application',
  components: {
    Navigation,
    compCredits,
    audioComp,
  },
  setup(props, ctx) {
    // Setup variables
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
    const soundCheck = computed(() => {
      return ctx.root.$route.name === 'Loader'
    })

    // Audio lists
    const audioMain = new Audio('../../assets/music/main.mp3')
    const audioCantina = new Audio('../../assets/music/cantina.mp3')
    const audioCantina2 = new Audio('../../assets/music/cantina2.mp3')
    const audioHistory = new Audio('../../assets/music/history.mp3')

    const sounds = [audioMain, audioCantina, audioCantina2, audioHistory]

    sounds.forEach((sound, index) => {
      sound.addEventListener('ended', () => {
        if (index === 3 || index === 2) {
          sounds[0].play()
        } else {
          sounds[index + 1].play()
        }
      })
    })

    // Wtach if audio bar is clicked
    watch(
      () => ctx.root.$store.state.checks.music,
      (value, prevValue) => {
        if (value && ctx.root.$route.name === 'History' && sounds[3].paused) {
          sounds[3].play()
        } else if (value) {
          sounds[ctx.root.$store.state.checks.player].play()
        }

        if (!value && prevValue) {
          sounds.forEach((sound, index) => {
            if (!sound.paused) {
              sound.pause()
              if (index !== 3) ctx.root.$store.commit('changeMusic', index)
            }
          })
        }
      }
    )

    // Wtach change route nam (history to other)
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
          }, 250)
        } else {
          if (!sounds[3].paused) {
            sounds[3].pause()
            sounds[0].play()
          }
        }
      }
    )

    // Navigation setup variable
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

    // Nav function up
    const upHandler = () => {
      if (
        route.value === 'History' &&
        !ctx.root.$store.state.checks.animation
      ) {
        return
      }

      // If is not Choice or Loader, arrow navigation
      if (
        route.value === 'Choice' ||
        route.value === 'Loader' ||
        ctx.root.$store.state.checks.nav
      )
        return

      ctx.root.$router.push({
        name: routes[index.value - 1].name,
      })
    }

    // Nav function down
    const downHandler = () => {
      if (
        route.value === 'History' &&
        !ctx.root.$store.state.checks.animation
      ) {
        return
      }

      // If is not Choice or Loader, arrow navigation
      if (
        route.value === 'Choice' ||
        route.value === 'Loader' ||
        ctx.root.$store.state.checks.nav
      )
        return

      if (route.value !== 'Numbers') {
        ctx.root.$router.push({
          name: routes[index.value + 1].name,
        })
      }
    }

    // Nav function left
    const leftHandler = () => {
      if (id.value > 1) {
        ctx.root.$router.push({
          name: route.value,
          params: { id: parseInt(id.value) - 1 },
        })
      }
    }

    // Nav function right
    const rightHandler = () => {
      if (id.value < 6) {
        ctx.root.$router.push({
          name: route.value,
          params: { id: parseInt(id.value) + 1 },
        })
      }
    }

    // Setup scroll variables
    const count = ref(0)
    const direction = ref('')
    const prevDir = ref(null)

    // Scroll function throttle
    const throttle_scroll = _.throttle(event => {
      // Scroll guard
      if (
        ctx.root.$store.state.checks.scroll ||
        route.value === 'Choice' ||
        route.value === 'Loader' ||
        (route.value === 'History' &&
          !ctx.root.$store.state.checks.animation) ||
        (route.value === 'Numbers' && !ctx.root.$store.state.checks.numbers)
      )
        return

      // Make the bar visible again
      document.querySelectorAll('.progress').forEach(el => {
        el.style.opacity = 0.5
      })

      if (event.deltaY > 0) {
        // Scroll guard
        if (route.value === 'Numbers') return

        direction.value = 'down'

        if (prevDir.value === null) {
          prevDir.value = 'down'
        } else {
          // If change direction wait bar 0
          if (prevDir.value !== direction.value) {
            ctx.root.$store.commit('changeScroll', true)

            gsap.to('.progress-down', {
              width: 0,
              duration: 0.5,
              onComplete: function() {
                ctx.root.$store.commit('changeScroll', false)
                prevDir.value = null
              },
            })
            count.value = 0
            return
          }
        }
      } else {
        // Scroll guard
        if (
          route.value === 'Numbers' &&
          document.querySelector('.numbers').scrollTop > 0
        )
          return

        direction.value = 'up'

        if (prevDir.value === null) {
          prevDir.value = 'up'
        } else {
          // If change direction wait bar 0
          if (prevDir.value !== direction.value) {
            ctx.root.$store.commit('changeScroll', true)
            gsap.to('.progress-up', {
              width: 0,
              duration: 0.5,
              onComplete: function() {
                ctx.root.$store.commit('changeScroll', false)
                prevDir.value = null
              },
            })
            count.value = 0
            return
          }
        }
      }
      prevDir.value = direction.value
      count.value += 2
      transitionScreen(count.value)
    }, 50)

    const transitionScreen = nbr => {
      if (nbr > 21) {
        // Block the scroll
        ctx.root.$store.commit('changeScroll', true)

        gsap.to(`.progress-${direction.value}`, {
          width: '100%',
          duration: 0.2,
          onComplete: changeScreen,
        })
      } else {
        nbr *= 5
        gsap.to(`.progress-${direction.value}`, {
          width: nbr + '%',
          duration: 0.2,
        })
      }
    }

    // Change the screen on the scroll and reset value
    const changeScreen = () => {
      // Change to top or bottom
      if (direction.value === 'down') {
        downHandler()
      } else {
        upHandler()
      }
      document.querySelectorAll('.progress').forEach(el => {
        el.style.opacity = 0
      })
      gsap.to('.progress', { width: 0, duration: 1 })
      count.value = 0
    }

    let scrollingTimeout = null

    onMounted(() => {
      // Scroll function with the throttle
      window.addEventListener('mousewheel', throttle_scroll)
      // Scroll function for the timeout to know if scroll is break or not
      window.addEventListener(
        'mousewheel',
        () => {
          // Scroll guard
          if (
            ctx.root.$store.state.checks.scroll ||
            route.value === 'Choice' ||
            route.value === 'Loader' ||
            (route.value === 'History' &&
              !ctx.root.$store.state.checks.animation) ||
            (route.value === 'Numbers' && !ctx.root.$store.state.checks.numbers)
          )
            return

          window.clearTimeout(scrollingTimeout)
          scrollingTimeout = setTimeout(function() {
            if (count.value > 21) return

            // If not 100% then let's begin it again
            gsap.to('.progress', { width: 0, duration: 1 })
            count.value = 0
          }, 66)
        },
        false
      )

      // Let's preload images
      preloadImages(ctx.root.$store.state.loader, ctx.root.$store, () => {
        ctx.root.$store.dispatch('LOAD_DATA')
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
            if (keyUp.value === true) {
              rightHandler()
            }
          }
          // left
          if (key === 37) {
            if (keyUp.value === true) {
              leftHandler()
            }
          }
          // down
          if (key === 40) {
            downHandler()
          }
          // up
          if (key === 38) {
            upHandler()
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
      () => ctx.root.$store.state.checks.credit,
      (value, prevValue) => {
        if (value && !prevValue) {
          creditAnimation.value = 'slide-bottom'
        } else {
          creditAnimation.value = 'slide-top'
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
      upHandler,
      rightHandler,
      leftHandler,
      downHandler,
      soundCheck,
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

::selection {
  color: #ffffff;
  background-color: rgba(255, 228, 3, 0.6);
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
  src: url('./assets/fonts/Roboto-Medium.woff2') format('woff2'),
    url('./assets/fonts/Roboto-Medium.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'roboto-black';
  src: url('./assets/fonts/Roboto-Black.woff2') format('woff2'),
    url('./assets/fonts/Roboto-Black.woff') format('woff');
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
  transition: all 0.3s ease-out;
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
  font-family: 'star_jediregular', sans-serif;
  letter-spacing: 0.1em;
  padding: 16rem;
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  position: absolute;
  top: 0;
  left: 0;

  p {
    &:first-child {
      margin-bottom: 20px;
    }
  }
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

.progress {
  background-color: #ffe403;
  opacity: 0.5;
  height: 5px;
  width: 0%;
  text-indent: 100%;
  white-space: nowrap;
  overflow: hidden;
  position: fixed;

  &-down {
    bottom: 0;
  }
  &-up {
    top: 0;
  }
}
</style>
