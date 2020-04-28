<template>
  <div class="words">
    <div class="words__list">
      <div v-for="(word, index) in bigFive" :key="index" class="words__el">
        <p class="words__word">{{ word }}</p>
      </div>
    </div>
    <div :class="words"></div>
  </div>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
import * as utils from '@/tools/utils'
export default defineComponent({
  name: 'Words',
  setup(props, ctx) {
    const choiceWords = [
      ['jedi', 'master', 'chancellor', 'mesa', 'naboo'],
      ['master', 'jedi', 'senator', 'army', 'anakin'],
      ['jedi', 'anakin', 'master', 'chancellor', 'artoo'],
      ['beeps', 'luke', 'artoo', 'force', 'alderaan'],
      ['vader', 'luke', 'chewie', 'force', 'artoo'],
      ['luke', 'master', 'artoo', 'shield', 'jabba'],
    ]

    const words = computed(() => {
      return utils.sortWords(
        ctx.root.$store.state.movies[ctx.root.$store.state.activeMovie].dialogs
      )
    })

    const bigFive = computed(() => {
      return choiceWords[ctx.root.$store.state.activeMovie]
    })

    console.log(words)

    return {
      words,
      bigFive,
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
    margin-right: 50px;
    margin-left: 50px;
    margin-top: 50px;
  }

  &__word {
    display: inline-block;
    position: relative;
    cursor: pointer;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      height: 40%;
      width: 100%;
      background-color: #ffe403;
      opacity: 0.22;
      transition: all 300ms ease;
    }

    &:hover {
      &::before {
        height: 100%;
        transition: all 500ms ease;
      }
    }
  }
}
</style>
