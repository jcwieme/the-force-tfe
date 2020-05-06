<template>
  <div class="numbers">
    <div class="numbers__row">
      <d3-bar :data-bar="barChartDataWords" />
      <!-- <d3-pie :data-chart="racesData" /> -->
      <d3-bar :data-bar="barChartData" />
    </div>
    <!-- <div class="numbers__row">
      <div class="numbers__column numbers__column--big"></div>

      <d3-pie :data-chart="racesData" />
      <d3-pie :data-chart="sidesData" />
    </div> -->
  </div>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import d3Bar from '@/d3/d3-barchart'
import d3Pie from '@/d3/d3-piechart'

export default defineComponent({
  name: 'Numbers',
  components: {
    d3Bar,
    d3Pie,
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
            name: `average in star wars movies`,
            value: linesInMovies,
          },
          {
            name: `${ctx.root.$store.state.movies[
              ctx.root.$store.state.activeMovie
            ].number.toLowerCase()}`,
            value: linesInMovie,
          },
        ],
        size: {
          width: window.innerWidth * 0.7 * 0.3,
          height: window.innerHeight * 0.25,
        },
        other: {
          title: 'Lines in the movie ',
          sub: `lines in the  ${ctx.root.$store.state.movies[
            ctx.root.$store.state.activeMovie
          ].number.toLowerCase()}`,
          class: 'numbers__column--small',
          value: linesInMovie.value,
        },
      }
    })

    const barChartDataWords = computed(() => {
      return {
        id: 'words',
        data: [
          {
            name: `average in star wars movies`,
            value: wordsInMovies,
          },
          {
            name: `${ctx.root.$store.state.movies[
              ctx.root.$store.state.activeMovie
            ].number.toLowerCase()}`,
            value: wordsInMovie,
          },
        ],
        size: {
          width: window.innerWidth * 0.7 * 0.4,
          height: window.innerHeight * 0.25,
        },
        other: {
          title: 'how much words in the movie ?',
          sub: `words in the ${ctx.root.$store.state.movies[
            ctx.root.$store.state.activeMovie
          ].number.toLowerCase()}`,
          class: 'numbers__column--big',
          value: wordsInMovie.value,
        },
      }
    })

    const racesNumbers = {
      human: 0,
      alien: 0,
      droid: 0,
    }

    const sidesNumbers = {
      dark: 0,
      light: 0,
      neutral: 0,
    }

    numbers.value.forEach(element => {
      if (element.race === 'Human') racesNumbers.human++
      if (element.race === 'Alien') racesNumbers.alien++
      if (element.race === 'Droid') racesNumbers.droid++
      if (element.side === 'Dark') sidesNumbers.dark++
      if (element.side === 'Light') sidesNumbers.light++
      if (element.side === 'Neutral') sidesNumbers.neutral++
    })

    const racesData = computed(() => {
      return {
        id: 'pieRace',
        data: [
          {
            name: 'humans',
            value: racesNumbers.human,
            color: '#001eff',
          },
          {
            name: 'aliens',
            value: racesNumbers.alien,
            color: 'red',
          },
          {
            name: 'droids',
            value: racesNumbers.droid,
            color: '#ffe700',
          },
        ],
        size: window.innerHeight * 0.25,
        title: 'Races in the movie',
        sub:
          ctx.root.$store.state.activeMovie === 0
            ? 'characters are aliens'
            : 'characters are humans',
        class: 'numbers__column--small',
        value: Math.floor(
          (Math.max(...Object.values(racesNumbers)) /
            Object.values(racesNumbers).reduce((acc, i) => acc + i)) *
            100
        ),
      }
    })

    const sidesData = computed(() => {
      return {
        id: 'pieSide',
        data: [
          {
            name: 'dark',
            value: sidesNumbers.dark,
            color: 'red',
          },
          {
            name: 'light',
            value: sidesNumbers.light,
            color: '#001eff',
          },
          {
            name: 'neutral',
            value: sidesNumbers.neutral,
            color: '#ffe700',
          },
        ],
        size: window.innerHeight * 0.25,
        title: 'Ligth vs Dark side',
        sub: 'characters from light side',
        class: 'numbers__column--small',
        value: Math.floor(
          (Math.max(...Object.values(sidesNumbers)) /
            Object.values(sidesNumbers).reduce((acc, i) => acc + i)) *
            100
        ),
      }
    })

    return {
      barChartData,
      barChartDataWords,
      racesData,
      sidesData,
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

  &__row {
    width: 1100px;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    // padding: 0px 20px;

    // border-bottom: 1px solid #ffe403;
    // border-top: 1px solid #ffe403;
  }

  &__column {
    display: flex;
    flex-direction: column;
    height: 60%;
    padding: 40px 0px;

    &--big {
      width: calc(100vw * 0.39);
      margin-right: calc(100vw * 0.06);
      border-right: 1px solid #ffe403;
    }
    &--small {
      width: calc(100vw * 0.18);
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
    margin-bottom: 10px;
  }

  &__graph {
    margin: 30px 0 20px;
  }
  &__special {
    font-family: 'roboto-black';
  }
}
</style>
