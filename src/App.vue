<template>
  <div id="app">
    <div v-if="screen" class="mobile">
      The Force arriving soon on mobile !
    </div>
    <div v-else class="myApp">
      <!-- <vue-particles
        color="#dedede"
        :particleOpacity="0.5"
        :particlesNumber="80"
        shapeType="circle"
        :particleSize="2"
        :lineLinked="false"
        :moveSpeed="1.5"
        :hoverEffect="false"
        :clickEffect="false"
        class="particules"
      ></vue-particles> -->
      <Navigation v-if="navRender" />
      <transition name="fade" mode="out-in">
        <router-view class="router" />
      </transition>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from '@vue/composition-api'
import Navigation from '@/components/navigation'

export default defineComponent({
  name: 'Application',
  components: {
    Navigation,
  },
  setup(props, ctx) {
    const keyUp = ref(true)
    const screen = ref(false)
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

    onMounted(() => {
      screen.value = checkSize()

      window.addEventListener('resize', onResize)

      // Navigation arrows
      document.addEventListener('keydown', e => {
        if (
          ctx.root.$route.name !== 'Choice' ||
          ctx.root.$route.name !== 'Loader'
        ) {
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
          if (e.keyCode === 37) {
            if (ctx.root.$route.params.id > 1 && keyUp.value === true) {
              let before = ctx.root.$route.params.id - 1
              ctx.root.$router.push({
                name: ctx.root.$route.name,
                params: { id: before },
              })
            }
          }
          if (e.keyCode === 40) {
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
              case 'Numbers':
                ctx.root.$router.push({
                  name: 'Credits',
                })
                break
            }
          }
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
              case 'Credits':
                ctx.root.$router.push({
                  name: 'Numbers',
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

    return {
      keyUp,
      screen,
      navRender,
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

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.mobile {
  color: white;
  font-family: star_jediregular;
  letter-spacing: 0.1em;
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
