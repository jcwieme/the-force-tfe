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
import { checkSize, preloadImages } from '@/tools/utils'

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
    const navRender = computed(() => {
      if (
        ctx.root.$route.name !== 'Choice' &&
        ctx.root.$route.name !== 'Loader' &&
        ctx.root.$store.state.animationRotate
      ) {
        return true
      } else {
        return false
      }
    })
    const keyTransitionHorizontal = computed(() => {
      return ctx.root.$route.params.id
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

    onMounted(() => {
      // Let's preload images
      preloadImages(ctx.root.$store.state.loader, () => {
        ctx.root.$store.commit('toggleCheck', 'loaded')
      })

      screen.value = checkSize(window)

      window.addEventListener('resize', () => {
        screen.value = checkSize(window)
      })

      // Navigation arrows
      document.addEventListener('keydown', e => {
        if (
          ctx.root.$route.name === 'History' &&
          !ctx.root.$store.state.animationRotate
        ) {
          return
        }
        if (
          (ctx.root.$route.name !== 'Choice' ||
            ctx.root.$route.name !== 'Loader') &&
          !ctx.root.$store.state.checks.nav
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

    // const checkSize = () => {
    //   if (window.innerWidth > 1024) {
    //     return false
    //   } else {
    //     return true
    //   }
    // }

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
