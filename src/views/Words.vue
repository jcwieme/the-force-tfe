<template>
  <div class="words">
    <div class="words__list">
      <div v-for="(word, index) in bigFive" :key="index" class="words__el">
        <p class="words__word" :data-number="number">{{ word }}</p>
        <sub class="words__sub" :class="'words__sub--' + word"></sub>
      </div>
    </div>
    <input class="words__input" type="text" v-model="search" />
    <div :class="words"></div>
  </div>
</template>

<script>
import { defineComponent, computed, onMounted, ref } from '@vue/composition-api'
import * as utils from '@/tools/utils'
export default defineComponent({
  name: 'Words',
  setup(props, ctx) {
    const choiceWords = [
      ['jedi', 'master', 'chancellor', 'mesa', 'naboo'],
      ['master', 'jedi', 'senator', 'army', 'anakin'],
      ['jedi', 'anakin', 'master', 'chancellor', 'artoo'],
      ['beeps', 'luke', 'force', 'artoo', 'alderaan'],
      ['luke', 'artoo', 'chewie', 'vader', 'force'],
      ['luke', 'artoo', 'master', 'shield', 'jabba'],
    ]

    const search = ref('')
    const number = ref('')

    const words = computed(() => {
      return utils.sortWords(
        ctx.root.$store.state.movies[ctx.root.$store.state.activeMovie].dialogs
      )
    })

    const bigFive = computed(() => {
      return choiceWords[ctx.root.$store.state.activeMovie]
    })

    onMounted(() => {
      document.querySelectorAll('.words__word').forEach(el => {
        el.addEventListener('mouseover', e => {
          let word = e.currentTarget.innerText.toLowerCase()
          let filtered = words.value.filter(element => element.word === word)
          number.value = filtered[0].number
        })
      })
    })

    return {
      words,
      bigFive,
      search,
      number,
    }
  },
})
</script>

<style lang="scss">
.words {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  &__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
    width: 60%;
  }

  &__el {
    font-family: 'roboto-black';
    text-transform: capitalize;
    font-size: 64px;
    line-height: 1.2;
    margin-right: 50px;
    margin-left: 50px;
    margin-top: 70px;
  }

  &__word {
    display: inline-block;
    position: relative;
    cursor: pointer;

    &::before {
      content: '';
      position: absolute;
      left: -10px;
      bottom: 0;
      height: 30%;
      width: calc(100% + 20px);
      background-color: #ffe403;
      opacity: 0.5;
      transition: all 300ms ease;
    }

    &::after {
      content: attr(data-number);
      font-family: 'star_jediregular';
      position: absolute;
      top: -100px;
      left: -50px;
      font-size: 130px;
      opacity: 0;
      transform: translateY(-10px);
      z-index: -1;
      transition: all 0ms;
    }

    &:hover {
      &::after {
        content: attr(data-number);
        opacity: 0.5;
        transform: translateY(0);
        transition: all 500ms ease;
      }
      &::before {
        height: 100%;
        transition: all 500ms ease;
      }
    }
  }
  &__input {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: none;
  }
}
</style>
