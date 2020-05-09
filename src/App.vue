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
      <Navigation v-if="navRender" />
      <transition name="fade" mode="out-in">
        <router-view class="router" :key="keyTransitionHorizontal" />
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
      return ctx.root.$store.state.isCreditsOpen
    })
    const navRender = computed(() => {
      if (
        ctx.root.$route.name !== 'Choice' &&
        ctx.root.$route.name !== 'Loader'
      ) {
        return true
      } else {
        return false
      }
    })
    const keyTransitionHorizontal = computed(() => {
      return ctx.root.$route.params.id
    })

    if (ctx.root.$store.state.activeMovie === 5) {
      ctx.root.$store.commit('falseArrowRight')
      ctx.root.$store.commit('trueArrowLeft')
    }

    var sound = new Howl({
      // src: ['../../assets/music/main.mp3'],
      src: ['main.mp3'],
      loop: true,
      volume: 0.5,
      autoplay: true,
    })

    onMounted(() => {
      const preloads = ctx.root.$store.state.loader

      function preloadImages(urls, allImagesLoadedCallback) {
        var loadedCounter = 0
        var toBeLoadedNumber = urls.length
        urls.forEach(function(url) {
          preloadImage(url, function() {
            loadedCounter++
            // console.log('Number of loaded images: ' + loadedCounter)
            if (loadedCounter == toBeLoadedNumber) {
              allImagesLoadedCallback()
            }
          })
        })
        function preloadImage(url, anImageLoadedCallback) {
          var img = new Image()
          img.onload = anImageLoadedCallback
          img.src = url.link
        }
      }

      // Let's call it:
      preloadImages(preloads, () => {
        ctx.root.$store.commit('loaded')
      })

      screen.value = checkSize()

      window.addEventListener('resize', onResize)

      // Navigation arrows
      document.addEventListener('keydown', e => {
        if (
          (ctx.root.$route.name !== 'Choice' ||
            ctx.root.$route.name !== 'Loader') &&
          !ctx.root.$store.state.isNavOpen
        ) {
          // right
          if (e.keyCode === 39) {
            if (ctx.root.$route.params.id < 6 && keyUp.value === true) {
              let next = ctx.root.$route.params.id
              next++
              ctx.root.$router.push({
                name: ctx.root.$route.name,
                params: { id: next },
              })
              if (next === 6) {
                ctx.root.$store.commit('falseArrowRight')
              }
              if (next === 2) {
                ctx.root.$store.commit('trueArrowLeft')
              }
            }
          }
          // left
          if (e.keyCode === 37) {
            if (ctx.root.$route.params.id > 1 && keyUp.value === true) {
              let before = ctx.root.$route.params.id - 1
              ctx.root.$router.push({
                name: ctx.root.$route.name,
                params: { id: before },
              })
              if (before === 1) {
                ctx.root.$store.commit('falseArrowLeft')
              }
              if (before === 5) {
                ctx.root.$store.commit('trueArrowRight')
              }
            }
          }
          // down
          if (e.keyCode === 40) {
            if (ctx.root.$route.name !== 'Numbers') {
              switch (ctx.root.$route.name) {
                case 'History':
                  ctx.root.$router.push({
                    name: 'Dialogues',
                  })
                  break
                case 'Dialogues':
                  ctx.root.$router.push({
                    name: 'Words',
                  })
                  break
                case 'Words':
                  ctx.root.$router.push({
                    name: 'Numbers',
                  })
                  break
              }
            }

            let movieNumber = ctx.root.$store.state.activeMovie + 1

            if (movieNumber === 1) {
              ctx.root.$store.commit('falseArrowLeft')
            } else {
              ctx.root.$store.commit('trueArrowLeft')
            }
            if (movieNumber === 6) {
              ctx.root.$store.commit('falseArrowRight')
            } else {
              ctx.root.$store.commit('trueArrowRight')
            }
          }
          // up
          if (e.keyCode === 38) {
            switch (ctx.root.$route.name) {
              case 'History':
                ctx.root.$router.push({
                  name: 'Choice',
                })
                break
              case 'Dialogues':
                ctx.root.$router.push({
                  name: 'History',
                })
                break
              case 'Words':
                ctx.root.$router.push({
                  name: 'Dialogues',
                })
                break
              case 'Numbers':
                ctx.root.$router.push({
                  name: 'Words',
                })
                break
            }
          }
        }

        if (
          ctx.root.$route.name === 'Choice' &&
          ctx.root.$store.state.activeMovie !== null
        ) {
          let movies = document.querySelectorAll('.choice__movie')

          // right
          if (e.keyCode === 39) {
            let movieNumber = ctx.root.$store.state.activeMovie + 1
            if (ctx.root.$store.state.activeMovie !== 5) {
              ctx.root.$store.commit('setActiveMovie', movieNumber)
              movies.forEach(movie => {
                movie.classList.remove('choice__movie--actif')
              })
              document
                .querySelector(`.choice__movie--${movieNumber}`)
                .classList.add('choice__movie--actif')
            }
          }
          // left
          if (e.keyCode === 37) {
            let movieNumber = ctx.root.$store.state.activeMovie - 1
            if (ctx.root.$store.state.activeMovie >= 0) {
              ctx.root.$store.commit('setActiveMovie', movieNumber)
              movies.forEach(movie => {
                movie.classList.remove('choice__movie--actif')
              })
              document
                .querySelector(`.choice__movie--${movieNumber}`)
                .classList.add('choice__movie--actif')
            }
          }

          // down
          if (e.keyCode === 40) {
            let movieNumber = ctx.root.$store.state.activeMovie + 1
            ctx.root.$router.push({
              name: 'History',
              params: {
                id: movieNumber,
              },
            })

            if (movieNumber === 1) {
              ctx.root.$store.commit('falseArrowLeft')
            } else {
              ctx.root.$store.commit('trueArrowLeft')
            }
            if (movieNumber === 6) {
              ctx.root.$store.commit('falseArrowRight')
            } else {
              ctx.root.$store.commit('trueArrowRight')
            }
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

      if (ctx.root.$store.state.activeMovie === 0) {
        ctx.root.$store.commit('falseArrowLeft')
        ctx.root.$store.commit('trueArrowRight')
      }
    })

    const onResize = () => {
      screen.value = checkSize()
    }

    const checkSize = () => {
      if (window.innerWidth > 1024) {
        return false
      } else {
        return true
      }
    }

    watch(
      () => ctx.root.$store.state.isMusicPlaying,
      (value, prevValue) => {
        if (value) {
          sound.play()
        }

        if (!value && prevValue) {
          sound.pause()
        }
      }
    )

    return {
      keyUp,
      screen,
      navRender,
      keyTransitionHorizontal,
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
