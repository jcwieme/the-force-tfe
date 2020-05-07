<template>
  <div class="section history">
    <h3>{{ number }}</h3>
    <h4>{{ title }}</h4>
    <div
      class="history__text"
      v-for="(p, index) in text"
      :key="index"
      v-html="p"
    ></div>
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

    onMounted(() => {
      let words = document.querySelectorAll('.history__word')
      words.forEach(word => {
        word.addEventListener('mouseover', openWord)
        word.addEventListener('mouseout', closeWord)
      })
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
        .intro
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
    }
  },
})
</script>

<style lang="scss">
.history {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  font-family: roboto, sans-serif;

  color: #ffe403;

  &__message {
    font-size: calc(100vw * 0.014);
    margin-bottom: 30px;
    color: white;
    text-align: center;
  }

  h3 {
    font-size: calc(100vw * 0.014);
  }

  h4 {
    margin-bottom: 30px;
    font-size: calc(100vw * 0.02);
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
