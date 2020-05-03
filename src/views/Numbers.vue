<template>
  <div class="numbers">
    <div>Numbers</div>
    <d3-bar />
  </div>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import d3Bar from '@/d3/d3-barchart'

export default defineComponent({
  name: 'Numbers',
  components: {
    d3Bar,
  },
  setup(props, ctx) {
    const numbers = computed(() => {
      return ctx.root.$store.state.numbers[ctx.root.$store.state.activeMovie]
    })

    const linesInMovies = computed(() => {
      return ctx.root.$store.state.linesInMovie.reduce((t, n) => t + n)
    })

    const wordsInMovies = computed(() => {
      return ctx.root.$store.state.wordsInMovie.reduce((t, n) => t + n)
    })

    const linesInMovie = computed(() => {
      return ctx.root.$store.state.linesInMovie[
        ctx.root.$store.state.activeMovie
      ]
    })

    const wordsInMovie = computed(() => {
      return ctx.root.$store.state.wordsInMovie[
        ctx.root.$store.state.activeMovie
      ]
    })

    console.log(
      wordsInMovies.value,
      linesInMovies.value,
      wordsInMovie.value,
      linesInMovie.value,
      numbers.value
    )

    return {
      numbers,
      linesInMovies,
      wordsInMovies,
      linesInMovie,
      wordsInMovie,
    }
  },
})
</script>

<style lang="scss">
.numbers {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
