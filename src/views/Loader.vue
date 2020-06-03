<template>
  <div class="loader">
    <div class="loader__title">
      <h1>The Force</h1>
      <h2 class="loader__subtitle">An interactive Star Wars visualization</h2>
      <p id="introText">
        Using data collected from scripts dialogue as well as other sources,
        this interactive experience aims to make you want to see Star Wars
        movies. The Force visualizes character’s interactions, musics and some
        fun facts from the six first movies of Star Wars.
      </p>
    </div>
    <div class="loader__logo">
      <svg
        v-if="random === 1"
        version="1.1"
        id="Calque_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 83.2 93.2"
        style="enable-background:new 0 0 83.2 93.2;"
        xml:space="preserve"
      >
        <defs>
          <linearGradient id="theGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="100%" stop-color="transparent" id="check" />
            <stop offset="100%" stop-color="#fff" />
          </linearGradient>
        </defs>
        <g id="Calque_2_1_">
          <g id="Calque_1-2">
            <path
              class="loader__svg loader__svg--one"
              fill="url(#theGradient)"
              d="M81.2,46.8c0,6.3,0.3,12.7-0.2,18.9c-0.3,2.2-1.4,4.2-3.2,5.5c-11.1,6.7-22.5,13.2-33.8,19.4
              c-1.6,0.7-3.4,0.7-5.1-0.1C27.6,84.2,16.1,77.7,4.8,71C3.2,69.8,2.1,68,2,66C1.8,53.2,2,40.6,1.8,27.9c0-2.9,1.1-4.5,3.5-5.8
              C16.2,15.9,27.1,9.7,37.9,3.3c2.6-1.5,4.6-1.7,7.4-0.1c10.6,6.3,21.3,12.4,32.2,18.5c2.9,1.6,4.1,3.3,3.9,6.7
              C81,34.5,81.2,40.7,81.2,46.8L81.2,46.8z M78,46.7c0-5.8,0.2-11.7-0.1-17.6c-0.1-1.5-1.1-3.7-2.3-4.5c-10.4-6.2-21-12.3-31.8-18.2
              c-1.4-0.7-3.2-0.7-4.6,0C28.8,12.2,18.5,18.1,8.4,24.3c-1.6,1.2-2.7,3.1-2.9,5.2c-0.2,11.8-0.2,23.4,0,35.1
              c0.2,1.9,1.2,3.6,2.8,4.7c9.9,5.9,20.1,11.5,30,17.4c2.6,1.5,4.4,1.3,6.9-0.1C54.5,81,64,75.4,73.7,70.3c3.4-1.8,4.6-4.1,4.4-7.8
              C77.8,57.3,78,52,78,46.7z"
            />
            <path
              class="loader__svg loader__svg--one"
              d="M78,46.7c0,5.3-0.2,10.4,0.1,15.7c0.2,3.7-1,5.9-4.4,7.8C64,75.4,54.6,81,45.2,86.5c-2.5,1.4-4.3,1.6-6.9,0.1
              c-9.9-5.9-20.1-11.5-30-17.4c-1.5-1.1-2.6-2.8-2.8-4.7c-0.2-11.7-0.2-23.4,0-35.1c0.2-2,1.2-3.9,2.9-5.2
              c10.1-6.1,20.5-12,30.9-17.8c1.4-0.6,3.2-0.6,4.6,0.1c10.7,5.9,21.2,12,31.8,18.2c1.2,0.8,2.2,3,2.3,4.5
              C78.2,35.1,78,40.9,78,46.7z M75.1,46.8c0-5.3,0.3-10.4-0.1-15.7c-0.2-2-1.2-3.8-2.9-5.1c-9.3-5.5-18.6-10.9-28-16.1
              c-1.6-0.7-3.4-0.7-5,0.1C29.9,15.3,20.6,20.5,11.6,26c-1.6,1.1-2.8,3-3,5C8.2,41.5,8.2,51.9,8.5,62.3c0.2,2,1.2,3.9,2.9,5.1
              c9.1,5.5,18.3,10.7,27.6,15.9c1.7,0.8,3.6,0.8,5.4,0c9.4-5.1,18.5-10.5,27.7-15.6c2.5-1.3,3.2-3.1,3.1-5.6
              C74.9,57,75.1,51.9,75.1,46.8z"
            />
            <path
              class="loader__svg loader__svg--one"
              d="M75.1,46.8c0,5.1-0.1,10.1,0.1,15.2c0.1,2.7-0.7,4.3-3.1,5.6c-9.3,5.1-18.5,10.5-27.7,15.6
              c-1.7,0.8-3.6,0.8-5.4,0c-9.5-5.1-18.7-10.3-27.7-15.8c-1.6-1.2-2.7-3.1-2.9-5.2C8.2,51.9,8.2,41.5,8.5,31c0.2-2,1.3-3.8,3-5
              c9.1-5.5,18.3-10.8,27.6-16c1.6-0.8,3.4-0.8,5-0.1c9.5,5.2,18.8,10.5,28,16.1c1.6,1.2,2.7,3.1,2.9,5.1
              C75.3,36.4,75.1,41.6,75.1,46.8z M13.2,46.6c0.2,15.7,12.9,28.2,28.5,28.3c15.5-0.2,28-12.5,28.4-28c0.2-15.2-12.9-28.2-28.6-28.4
              C26.4,18.4,13.2,31.5,13.2,46.6z"
            />
            <path
              class="loader__svg loader__svg--one"
              fill="url(#theGradient)"
              d="M13.2,46.6c0-15.1,13.3-28.2,28.3-28.1c15.7,0.2,28.8,13.2,28.6,28.4c-0.4,15.5-12.9,27.8-28.4,28
              C26.1,74.8,13.4,62.3,13.2,46.6z M33.3,33.5l-0.8,0.4l-7-7.7l-5.3,4l7.3,6.6L27,37.5l-8.5-3.9l-2.6,6l10.6,3.6l-0.2,0.7H15.2v5.8
              H26l0.1,0.5l-10.4,3.6l2.7,5.9l9.7-4.5l0.5,0.7l-8.1,7.2l4.8,4.6l7.4-8.1l0.6,0.4l-4.8,9.9l6,2.5l4.3-11.9V73h6V60.9
              c1.6,4.6,2.8,7.9,4.1,11.5l6-2.6l-5-10.3l0.7-0.4l7.2,8.2l5.1-4.3l-8.1-7.3l0.4-0.6l9.9,4.8c0.9-2.2,1.5-4,2.3-6.1l-10.4-3.7
              l0.2-0.7h10.8v-5.7H57.3l-0.1-0.4l10.2-3.6L65,33.5l-10.5,5.1l-0.4-0.5l8.6-7.9L58,25.8l-6.3,6.8L50.9,32l3.9-8.3l-6-2.5
              c-1.4,4-2.6,7.6-3.8,11.1l-0.7-0.1V20.6h-5.9L39,31.3l-0.9,0.1l-3.6-10.2l-6.1,2.5L33.3,33.5z"
            />
            <path
              class="loader__svg loader__svg--one"
              d="M33.2,33.5l-5-9.9l6.1-2.4l3.7,10.1l0.9-0.1l-0.6-10.7h5.9v11.6l0.7,0.1c1.2-3.5,2.4-7,3.8-11.1l6.2,2.4
                l-3.9,8.3l0.8,0.6l6.3-6.8l4.7,4.4L54.3,38l0.4,0.5l10.5-5.1l2.5,6.1l-10.4,3.7l0.2,0.6H68v5.7H57.1l-0.2,0.7L67.3,54
                c-0.8,2-1.4,3.8-2.3,6.1L55,55.3l-0.4,0.6l8.1,7.3l-5.1,4.4l-7.2-8.4l-0.7,0.4l5,10.3l-6,2.6c-1.2-3.6-2.5-7-4.1-11.5v12.1h-6
                V60.4l-4.4,12l-6.1-2.5L33,60l-0.6-0.4l-7.3,8.1l-4.8-4.6l8.1-7.2l-0.5-0.7l-9.8,4.5l-2.7-5.9L26,50.3L26,49.8H15.2V44h11l0.2-0.7
                l-10.7-3.7l2.6-6l8.5,3.9l0.6-0.8l-7.3-6.6l5.3-4l7,7.7L33.2,33.5z"
            />
          </g>
        </g>
      </svg>
      <svg
        v-if="random === 2"
        version="1.1"
        id="Calque_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 81.9 75.4"
        style="enable-background:new 0 0 81.9 75.4;"
        xml:space="preserve"
      >
        <defs>
          <linearGradient id="theGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="100%" stop-color="transparent" id="check" />
            <stop offset="100%" stop-color="#fff" />
          </linearGradient>
        </defs>
        <path
          fill="url(#theGradient)"
          class="loader__svg loader__svg--two"
          d="M1.5,48.7L4.1,52l0.5-0.2c-1.2-3.2-2.8-6.3-3.5-9.6C0.2,38.5-0.1,34.8,0,31c0.3-3.5,1.1-7,2.4-10.3
            c0,7.8,1.8,14.6,7.3,20.3c-6.2-15.7-4-29.5,8.8-41c-5,10.2-1.7,19,4.4,27.3c1.8,2.5,2,4.2,0.6,6.9c-7.3,14-0.9,31.3,14.3,37.9
            c0.4-4.7,0.8-9.2,1.3-14.5l-5.3,3.6l2.6-6.3l-7-1l-0.1-0.8l7.2-1.3c-0.5-1.7-1-3.2-1.6-5.6l3.3,2.5c0.7-16.3,1.4-32,2.1-47.8h0.5
            c0.6,15.7,1.2,31.4,1.8,47.9l3.8-3.3l-2.2,6.2l7.5,1.3l-0.2,1l-7.3,0.8c0.9,2.1,1.7,4,2.9,6.9l-5.3-4.4c0.3,5.4,0.6,10,0.8,14.6
            c15.7-2.8,22.5-23.8,13.6-41.1c10-16.3,10.6-19.3,6.4-30.5c11.3,7,14,19.5,8.7,41.5l1.3,0.5L80,22.2c0.5,3.7,1.2,7.7,1.7,11.7
            c0.8,6.2-2.6,11.8-2.8,18.2C78.6,59,71.8,64,65.6,68C43.4,82.2,18,74.5,6,59c-2.2-2.9-3.7-6.4-5.5-9.6L1.5,48.7z"
        />
      </svg>
      <svg
        v-if="random === 3"
        version="1.1"
        id="Calque_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 87.5 88.3"
        style="enable-background:new 0 0 87.5 88.3;"
        xml:space="preserve"
      >
        <defs>
          <linearGradient id="theGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="100%" stop-color="transparent" id="check" />
            <stop offset="100%" stop-color="#fff" />
          </linearGradient>
        </defs>
        <path
          fill="url(#theGradient)"
          class="loader__svg loader__svg--three"
          d="M36.6,10.5l7-7.8l7.3,7.8c-1.2,3.4-2.3,6.3-3.9,10.4l7.7-6.4l5.2,5.3c-8.9,5.1-11.7,12.3-10.7,21.5
            c0.6,4.5,2.3,8.3,6.8,9.8s8.3-0.4,11.5-3.6c6.9-6.9,8.5-17.2,3.9-27.3c-1.3-2.9-3-5.6-4.7-8.6c13.7,7.9,21.1,27.3,16.8,43.2
            c-5,18.3-21.5,31.2-39.8,30.9C24.5,85.4,8.6,72.9,3.8,54.4c-4.1-16.3,3.4-35.6,15.2-42c-1.6,5.4-4.4,11.7-5.4,18.4
            c-1.1,7.7,2.3,14.3,9,18.8c5.9,3.9,12.2,1.8,14.7-4.9c3.4-8.9,0-18.1-9.3-24.8l4.7-5.2l7.6,6.3C39,17,37.8,13.9,36.6,10.5z"
        />
      </svg>
      <svg
        v-if="random === 4"
        version="1.1"
        id="Calque_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 75.1 89.7"
        style="enable-background:new 0 0 75.1 89.7;"
        xml:space="preserve"
      >
        <defs>
          <linearGradient id="theGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="100%" stop-color="transparent" id="check" />
            <stop offset="100%" stop-color="#fff" />
          </linearGradient>
        </defs>
        <g>
          <path
            fill="url(#theGradient)"
            class="loader__svg loader__svg--four"
            d="M45.9,53.1l11.7-18.7c2,3.1,3.8,5.9,5.4,8.8c0.5,1,0.5,2,0,3c-8.3,13.8-16.8,27.5-25.4,41.6
              c-8.6-14-17-27.4-25.1-40.9c-0.6-1.3-0.6-2.9,0.1-4.2c1.3-2.7,3.1-5.2,5.1-8.3l11.7,18.8c3.4-3.3,4.9-6.2,1.6-10.6
              c-3.4-4.7-8.2-9.9-8.3-15c0-4.9,5.3-9.7,8.2-14.6C32.9,9.4,35.1,6,37.6,2c5.1,8.2,10,16.2,14.7,24.1c0.6,1,0.3,3-0.3,4.1
              c-2.2,4.2-4.7,8.2-7.5,12C41.2,46.4,42,49.6,45.9,53.1z"
          />
          <path
            fill="url(#theGradient)"
            class="loader__svg loader__svg--four"
            d="M30.8,11.7c-2.9,2.7-5.5,5.8-8.8,7.8C2.4,31.5,2.9,60.4,23,71.9c3.3,1.9,6,5,8.6,7.9
		          C16.4,80.4,1.8,63.3,1.7,46.1C1.6,28.2,15.4,11,30.8,11.7z"
          />
          <path
            fill="url(#theGradient)"
            class="loader__svg loader__svg--four"
            d="M43.1,79.7c3-2.6,5.5-5.6,8.9-7.6c9.7-6.1,15.3-14.6,15.5-26.1c0.1-11.8-5.4-20.5-15.2-26.8
		          c-3-1.9-5.3-5-8.8-8.3C59.3,11.3,73.1,27.5,73.4,44C73.9,62.7,60.5,79.3,43.1,79.7z"
          />
        </g>
      </svg>
    </div>
    <div class="loader__tuto">
      <transition name="fade" mode="out-in">
        <p :key="i">
          {{ text }}
        </p>
      </transition>
    </div>
    <div class="loader__enter" :class="[loaded ? showClass : '']">
      <router-link class="loaded" :to="nextRoute" @click.native="toggleMusic()"
        >enter</router-link
      >
    </div>
    <div class="loader__headphones">
      <img src="../assets/img/loader/headphones.svg" alt="" />
      <div>
        <p>headphones</p>
        <p>recommended</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, ref, watch } from '@vue/composition-api'
import { gsap } from 'gsap'

export default defineComponent({
  name: 'Loader',
  setup(props, ctx) {
    const random = ref(Math.floor(Math.random() * 4) + 1)
    const showClass = ref('loader__enter--show')
    const loaded = computed(() => {
      return ctx.root.$store.state.checks.loaded
    })

    const nextRoute = computed(() => {
      return ctx.root.$store.state.nextRoute
    })

    const text = ref('')
    const texts = [
      'Navigate into the experience with the keyboard arrows',
      'Swipe between movies with the right and left arrow',
    ]
    const i = ref(0)
    text.value = texts[i.value % 2]

    setInterval(() => {
      i.value++

      text.value = texts[i.value % 2]
    }, 6000)

    const loadProgress = computed(() => {
      return (
        100 -
        (ctx.root.$store.state.checks.load /
          ctx.root.$store.state.loader.length) *
          90
      )
    })

    watch(loadProgress, () => {
      gsap.to('#theGradient stop', 0.5, {
        attr: { offset: `${loadProgress.value}%` },
      })
    })

    watch(loaded, () => {
      gsap.to('#theGradient stop', 1, {
        attr: { offset: `0%` },
      })
    })

    const toggleMusic = () => {
      ctx.root.$store.commit('toggleCheck', 'music')
    }

    return {
      random,
      showClass,
      loaded,
      i,
      text,
      toggleMusic,
      nextRoute,
    }
  },
})
</script>

<style lang="scss">
.loader {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  padding: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'roboto', sans-serif;

  &__title {
    text-align: center;
    max-width: 70rem;
    h1 {
      font-family: 'star_jediregular', sans-serif;
      letter-spacing: 0.05em;
      font-size: 10.5rem;
      line-height: 1;
      opacity: 0;
      animation: rollUp 1000ms normal forwards;
    }
    h2 {
      font-size: 4rem;
      margin-bottom: 2.5rem;
      opacity: 0;
      animation: rollUp 1000ms 500ms normal forwards;
    }
    p {
      opacity: 0;
      animation: rollUp 1000ms 1000ms normal forwards;
    }
  }

  &__headphones {
    text-transform: uppercase;
    font-weight: bold;

    margin-top: auto;

    display: flex;
    flex-direction: row;
    opacity: 0;
    animation: rollUp 1000ms 2000ms normal forwards;

    img {
      height: 4rem;
      width: 4rem;

      margin-right: 1rem;
    }
  }

  &__logo {
    width: 25rem;
    height: 25rem;
    margin: auto;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  &__svg {
    // fill: none;
    stroke: #ffffff;
    stroke-width: 1;
    stroke-miterlimit: 10;
  }

  &__tuto {
    font-size: 2rem;
    color: #ffe403;
    text-shadow: 0px 0px 2px #d1bc03;
    opacity: 0;
    animation: rollUp 1000ms 1500ms normal forwards;
  }

  &__enter {
    margin: auto;
    opacity: 0;
    pointer-events: none;

    &--show {
      animation: rollUp 500ms 2000ms normal forwards;
      pointer-events: all;
    }
  }
}
.loaded {
  color: white;
  font-family: 'star_jediregular', sans-serif;
  letter-spacing: 0.1em;
  text-decoration: none;
  font-size: 4rem;
  border-bottom: 2px solid white;

  cursor: pointer;

  &:hover {
    color: #ffe403;
    border-color: #ffe403;
  }
}

@keyframes rollUp {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
