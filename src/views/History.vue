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
    <transition name="fade-history">
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
    const article = ref('one')
    const word = ref('Republic')
    let open = ref(false)
    const animationRotate = computed(() => {
      return ctx.root.$store.state.checks.animation
    })

    onMounted(() => {
      let words = document.querySelectorAll('.history__word')
      words.forEach(word => {
        word.addEventListener('mouseover', openWord)
        word.addEventListener('mouseout', closeWord)
      })

      if (!animationRotate.value) {
        const crawl = document.getElementById('crawl')
        const crawlContent = document.getElementById('crawl-content')
        const crawlContentStyle = crawlContent.style

        let crawlPos = crawl.clientHeight

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
          moveCrawl(elapsed * (0.1 * i))
        }

        requestAnimationFrame(init)
      }
    })

    onUpdated(() => {
      let words = document.querySelectorAll('.history__word')
      words.forEach(word => {
        word.addEventListener('mouseover', openWord)
        word.addEventListener('mouseout', closeWord)
      })
    })

    onBeforeUpdate(() => {
      let words = document.querySelectorAll('.history__word')
      words.forEach(word => {
        word.removeEventListener('click', openWord)
      })
    })
    let text = computed(() => {
      return ctx.root.$store.state.movies[ctx.root.$route.params.id - 1].text
    })
    let number = computed(() => {
      return ctx.root.$store.state.movies[ctx.root.$route.params.id - 1].number
    })
    let title = computed(() => {
      return ctx.root.$store.state.movies[
        ctx.root.$route.params.id - 1
      ].title.toUpperCase()
    })
    const openWord = e => {
      article.value = e.currentTarget.dataset.word
      word.value = e.currentTarget.innerText
      open.value = !open.value
    }

    const closeWord = () => {
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
  // width: 100%;
  // height: 100%;

  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // justify-content: center;

  font-family: roboto, sans-serif;
  // display: flex;
  // justify-content: center;
  height: 100%;
  width: 100%;
  color: #ffe403;
  text-align: justify;
  // overflow: hidden;
  perspective: calc(100vh * 0.4);

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
      font-size: calc(100vw * 0.024);
      margin-bottom: 50px;
    }

    h3 {
      font-size: calc(100vw * 0.04);
      text-align: center;
    }

    h4 {
      margin-bottom: 30px;
      font-size: calc(100vw * 0.05);
      line-height: 1;
      margin-top: 30px;
      margin-bottom: 50px;
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
  }

  &__message {
    font-size: calc(100vw * 0.014);
    margin-bottom: 30px;
    color: white;
    text-align: center;
  }

  &__base {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;

    h3 {
      font-size: calc(100vw * 0.014);
      text-align: center;
    }

    h4 {
      margin-bottom: 30px;
      font-size: calc(100vw * 0.02);
      text-align: center;
    }
  }

  &__text {
    width: 30vw;
    font-size: calc(100vw * 0.014);
    margin-bottom: 30px;
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
    right: 20px;
    transform: translateY(-50%);
    height: auto;
    width: calc(30vw - 86px);
    background-color: #18181c;
    border: 3px solid #ffe403;
    padding: 40px;

    pointer-events: none;

    color: white;

    h4 {
      color: #ffe403;
      font-size: calc(100vw * 0.015);
      margin-bottom: 20px;
    }

    img {
      width: calc(30vw - 86px);
      height: auto;
      margin-bottom: 20px;
    }
  }
}
</style>
