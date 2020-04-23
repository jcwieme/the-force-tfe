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
import Navigation from '@/components/navigation'

export default {
  name: 'Application',
  components: {
    Navigation,
  },
  data() {
    return {
      keyUp: true,
      screen: false,
    }
  },
  computed: {
    navRender: function() {
      if (this.$route.name !== 'Choice' && this.$route.name !== 'Loader') {
        return true
      } else {
        return false
      }
    },
  },
  created() {
    if (window.innerWidth > 1024) {
      this.screen = false
    } else {
      this.screen = true
    }

    window.addEventListener('resize', this.onResize)

    // Navigation arrows
    document.addEventListener('keydown', e => {
      if (this.$route.name !== 'Choice' || this.$route.name !== 'Loader') {
        if (e.keyCode === 39) {
          if (this.$route.params.id < 6 && this.keyUp === true) {
            let next = this.$route.params.id
            next++
            this.$router.push({
              name: this.$route.name,
              params: { id: next },
            })
          }
        }
        if (e.keyCode === 37) {
          if (this.$route.params.id > 1 && this.keyUp === true) {
            let before = this.$route.params.id - 1
            this.$router.push({
              name: this.$route.name,
              params: { id: before },
            })
          }
        }
        if (e.keyCode === 40) {
          switch (this.$route.name) {
            case 'History':
              this.$router.push({
                name: 'Dialogues',
              })
              break
            case 'Dialogues':
              this.$router.push({
                name: 'Words',
              })
              break
            case 'Words':
              this.$router.push({
                name: 'Numbers',
              })
              break
            case 'Numbers':
              this.$router.push({
                name: 'Credits',
              })
              break
          }
        }
        if (e.keyCode === 38) {
          switch (this.$route.name) {
            case 'History':
              this.$router.push({
                name: 'Choice',
              })
              break
            case 'Dialogues':
              this.$router.push({
                name: 'History',
              })
              break
            case 'Words':
              this.$router.push({
                name: 'Dialogues',
              })
              break
            case 'Numbers':
              this.$router.push({
                name: 'Words',
              })
              break
            case 'Credits':
              this.$router.push({
                name: 'Numbers',
              })
              break
          }
        }
      }

      this.keyUp = false
    })

    document.addEventListener('keyup', e => {
      if (
        e.keyCode === 39 ||
        e.keyCode === 37 ||
        e.keyCode === 38 ||
        e.keyCode === 40
      ) {
        this.keyUp = true
      }
    })
  },
  beforeRoute(to, from, next) {
    next()
  },
  methods: {
    onResize() {
      if (window.innerWidth > 1024) {
        this.screen = false
      } else {
        this.screen = true
      }
    },
  },
}
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
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
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
</style>
