<template>
  <div class="section history" id="crawl-container">
    <div class="history__crawl" id="crawl" v-show="!animationRotate">
      <div class="history__content" id="crawl-content">
        <h3>{{ number }}</h3>
        <h4>{{ title }}</h4>
        <div
          class="history__crawl--text"
          v-for="(p, index) in text.animation"
          :key="index"
          v-html="p"
        ></div>
      </div>
    </div>
    <transition name="fade">
      <div class="history__base" v-show="animationRotate">
        <h3>{{ number }}</h3>
        <h4>{{ title }}</h4>
        <div
          class="history__text"
          v-for="(p, index) in text.intro"
          :key="index"
          v-html="p"
        ></div>
      </div>
    </transition>
    <comp-history v-show="open" :number="article" :word="word" />
  </div>
</template>

<script>
import {
  defineComponent,
  computed,
  onMounted,
  ref,
  onUpdated,
  onBeforeUpdate,
  watch,
} from '@vue/composition-api'

import compHistory from '@/components/comp-history'

export default defineComponent({
  name: 'History',
  components: {
    compHistory,
  },
  setup(props, ctx) {
    // Variables
    const article = ref('one')
    const word = ref('Republic')
    let open = ref(false)
    const animationRotate = computed(() => {
      return ctx.root.$store.state.checks.animation
    })

    // Data for the view
    let text = computed(() => {
      if (ctx.root.$store.state.movies[ctx.root.$route.params.id - 1]) {
        return ctx.root.$store.state.movies[ctx.root.$route.params.id - 1].text
      } else {
        return ''
      }
    })
    let number = computed(() => {
      if (ctx.root.$store.state.movies[ctx.root.$route.params.id - 1]) {
        return ctx.root.$store.state.movies[ctx.root.$route.params.id - 1]
          .number
      } else {
        return ''
      }
    })
    let title = computed(() => {
      if (ctx.root.$store.state.movies[ctx.root.$route.params.id - 1]) {
        return ctx.root.$store.state.movies[
          ctx.root.$route.params.id - 1
        ].title.toUpperCase()
      } else {
        return ''
      }
    })

    onMounted(() => {
      let words = document.querySelectorAll('.history__word')
      words.forEach(word => {
        word.addEventListener('mouseover', functionWord)
        word.addEventListener('mouseout', functionWord)
      })

      if (!animationRotate.value) {
        const crawl = document.getElementById('crawl')
        const crawlContent = document.getElementById('crawl-content')
        const crawlContentStyle = crawlContent.style
        let crawlPos = crawl.clientHeight
        setTimeout(() => {
          const moveCrawl = distance => {
            crawlPos -= distance
            crawlContentStyle.top = crawlPos + 'px'
            if (crawlPos < -crawlContent.clientHeight) {
              ctx.root.$store.commit('toggleCheck', 'animation')
            } else {
              requestAnimationFrame(tick)
            }
          }
          let prevTime
          const init = time => {
            prevTime = time
            requestAnimationFrame(tick)
          }
          let i = 1
          const tick = time => {
            let elapsed = time - prevTime
            prevTime = time
            i += 0.001
            // time-scale of crawl, increase factor to go faster
            moveCrawl(elapsed * (0.05 * i))
          }
          requestAnimationFrame(init)
        }, 2000)
      }
    })

    onUpdated(() => {
      let words = document.querySelectorAll('.history__word')
      words.forEach(word => {
        word.addEventListener('mouseover', functionWord)
        word.addEventListener('mouseout', functionWord)
      })
    })

    onBeforeUpdate(() => {
      let words = document.querySelectorAll('.history__word')
      words.forEach(word => {
        word.removeEventListener('mouseover', functionWord)
      })
    })

    // Function hover
    const functionWord = e => {
      if (!open.value) {
        article.value = e.currentTarget.dataset.word
        word.value = e.currentTarget.innerText
      }
      open.value = !open.value
    }

    watch('$route.params.id', () => {
      open.value = false
    })

    return {
      text,
      number,
      title,
      article,
      word,
      open,
      animationRotate,
    }
  },
})
</script>

<style lang="scss">
.history {
  font-family: roboto, sans-serif;
  height: 100%;
  width: 100%;
  color: #ffe403;
  text-align: justify;
  perspective: 38rem;

  &__crawl {
    position: absolute;
    width: 100%;
    left: 0%;
    bottom: 15%;
    height: 100%;
    overflow: hidden;

    transform-origin: 50% 100%;
    transform: rotate3d(1, 0, 0, 45deg);
    mask-image: linear-gradient(
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0.66),
      rgba(0, 0, 0, 1)
    );

    cursor: default;

    &--text {
      width: 50vw;
      font-size: 3.5rem;
      margin-bottom: 5rem;
    }

    h3 {
      font-size: 5.8rem;
      text-align: center;
    }

    h4 {
      margin-bottom: 3rem; // 30px
      font-size: 7rem;
      line-height: 1;
      margin-top: 3rem;
      margin-bottom: 5rem;
      text-align: center;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 110%;
  }

  &__base {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;

    h3 {
      font-size: 2rem;
      text-align: center;
    }

    h4 {
      margin-bottom: 3rem;
      font-size: 3rem;
      text-align: center;
    }
  }

  &__text {
    width: 43rem;
    font-size: 2rem;
    margin-bottom: 3rem;
  }

  &__word {
    white-space: nowrap;
    position: relative;

    cursor: pointer;

    &:hover {
      &::before {
        height: 100%;
        transition: all 300ms ease;
      }
    }

    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 10px;
      background-color: rgba(255, 255, 255, 0.3);
      transition: all 300ms ease;
    }
  }

  &__popup {
    position: absolute;
    top: 50%;
    right: 2rem;
    transform: translateY(-50%);
    height: auto;
    width: calc(40rem - 86px);
    background-color: #18181c;
    border: 3px solid #ffe403;
    padding: 4rem;

    pointer-events: none;

    color: white;

    h4 {
      color: #ffe403;
      font-size: 2.2rem;
      margin-bottom: 2rem;
    }

    img {
      width: calc(40rem - 86px);
      height: auto;
      margin-bottom: 2rem;
    }
  }
}
</style>
