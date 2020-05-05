<template>
  <div class="numbers">
    <div class="numbers__bars">
      <d3-bar :data-bar="barChartDataWords" />
      <d3-bar :data-bar="barChartData" />
    </div>
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
      return Math.floor(
        ctx.root.$store.state.linesInMovie.reduce((t, n) => t + n) / 6
      )
    })

    const wordsInMovies = computed(() => {
      return Math.floor(
        ctx.root.$store.state.wordsInMovie.reduce((t, n) => t + n) / 6
      )
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

    const barChartData = computed(() => {
      return {
        id: 'lines',
        data: [
          {
            name: `${linesInMovies.value} lines on average`,
            value: linesInMovies,
          },
          {
            name: `${
              linesInMovie.value
            } lines in  ${ctx.root.$store.state.movies[
              ctx.root.$store.state.activeMovie
            ].number.toLowerCase()}`,
            value: linesInMovie,
          },
        ],
        size: {
          width: window.innerWidth * 0.7 * 0.3,
          height: window.innerHeight * 0.15,
        },
        other: {
          title: 'what about lines ?',
          sub: 'lines in the movie',
          class: 'numbers__bar--right',
          value: linesInMovie.value,
        },
      }
    })

    const barChartDataWords = computed(() => {
      return {
        id: 'words',
        data: [
          {
            name: `${wordsInMovies.value} words on average`,
            value: wordsInMovies,
          },
          {
            name: `${
              wordsInMovie.value
            } words in ${ctx.root.$store.state.movies[
              ctx.root.$store.state.activeMovie
            ].number.toLowerCase()}`,
            value: wordsInMovie,
          },
        ],
        size: {
          width: window.innerWidth * 0.7 * 0.4,
          height: window.innerHeight * 0.15,
        },
        other: {
          title: 'how much word in the movie ?',
          sub: 'words in the movie',
          class: 'numbers__bar--left',
          value: wordsInMovie.value,
        },
      }
    })

    console.log(barChartData.value, numbers.value)

    return {
      numbers,
      barChartData,
      barChartDataWords,
      linesInMovie,
      wordsInMovie,
    }
  },
})
</script>

<style lang="scss">
.numbers {
  font-family: star_jediregular;
  letter-spacing: 0.1em;
  color: #ffe403;
  width: 100%;
  height: 100%;

  display: flex;
  // flex-direction: column;
  align-items: center;
  justify-content: center;

  overflow: scroll;

  &__bars {
    width: 70%;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    // padding: 0px 20px;

    border-bottom: 1px solid #ffe403;
    border-top: 1px solid #ffe403;
  }

  &__bar {
    display: flex;
    flex-direction: column;
    height: 60%;
    padding: 40px 0px;

    &--left {
      width: 55%;
      margin-right: 5%;
      border-right: 1px solid #ffe403;
    }
  }

  &__title {
    color: white;
    font-size: 24px;
  }

  &__total {
    color: white;
    font-size: 80px;
    line-height: 1;
    margin-bottom: 20px;
  }

  &__graph {
    &--bar {
      margin: 40px 0 20px;
    }
  }
}
</style>
