<template>
  <div class="section numbers">
    <div
      class="numbers__row"
      :class="[!checkNumbers ? 'numbers__row--border' : '']"
    >
      <d3-bar :data-bar="barChartDataWords" />
      <d3-pie :data-chart="sidesData" />
    </div>
    <div
      class="numbers__row"
      :class="[!checkNumbers ? 'numbers__row--fade' : '']"
    >
      <d3-pie :data-chart="racesData" />
      <d3-bar :data-bar="barChartData" />
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import d3Bar from '@/d3-components/D3BarChart'
import d3Pie from '@/d3-components/D3PieChart'

export default defineComponent({
  name: 'Numbers',
  components: {
    d3Bar,
    d3Pie,
  },
  setup(props, ctx) {
    const checkNumbers = computed(() => {
      return ctx.root.$store.state.checks.numbers
    })
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
        other: {
          global: 'average lines',
          title: 'Lines in the movie ',
          sub: `lines in the  ${ctx.root.$store.state.movies[
            ctx.root.$store.state.activeMovie
          ].number.toLowerCase()}`,
          class:
            'numbers__column--big numbers__column--right ' +
            (!checkNumbers.value ? 'numbers__column--border' : ''),
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
        other: {
          global: 'average words',
          title: 'how much words in the movie ?',
          sub: `words in the ${ctx.root.$store.state.movies[
            ctx.root.$store.state.activeMovie
          ].number.toLowerCase()}`,
          class:
            'numbers__column--big numbers__column--left ' +
            (!checkNumbers.value ? 'numbers__column--border' : ''),
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
            color: '#196890',
          },
          {
            name: 'aliens',
            value: racesNumbers.alien,
            color: '#9ACD32',
          },
          {
            name: 'droids',
            value: racesNumbers.droid,
            color: '#F5F5DC',
          },
        ],
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
            color: '#8D2426',
          },
          {
            name: 'light',
            value: sidesNumbers.light,
            color: '#196890',
          },
          {
            name: 'neutral',
            value: sidesNumbers.neutral,
            color: '#F5F5DC',
          },
        ],
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

    if (!checkNumbers.value) {
      setTimeout(() => {
        ctx.root.$store.commit('toggleCheck', 'numbers')
      }, 4400)
    }

    return {
      barChartData,
      barChartDataWords,
      racesData,
      sidesData,
      checkNumbers,
    }
  },
})
</script>

<style lang="scss">
.numbers {
  font-family: 'star_jediregular', sans-serif;
  letter-spacing: 0.1em;
  color: #ffe403;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  padding-top: 25rem;
  padding-bottom: 25rem;

  display: flex;
  flex-direction: column;
  align-items: center;

  overflow-y: scroll;
  overflow-x: hidden;

  // position: relative;

  &::before {
    content: '';
    width: 100%;
    height: 10vh;
    background-color: #18181c;
    opacity: 0.5;
    top: 0;
    left: 0;
    position: fixed;
  }

  &::after {
    content: '';
    width: 100%;
    height: 10vh;
    background-color: #18181c;
    opacity: 0.5;
    bottom: 0;
    left: 0;
    position: fixed;
  }

  &__row {
    width: calc((100vw * 0.72));
    box-sizing: border-box;
    min-height: fit-content;
    height: fit-content;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    padding: 0px 7.5rem;

    border-bottom: 1px solid white;
    border-top: 1px solid white;

    &--border {
      border-color: transparent;
      animation: border 500ms 3900ms forwards ease-in;
    }

    &--fade {
      opacity: 0;

      animation: fadeIn 500ms 3900ms forwards ease-in;
    }
  }

  &__column {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: fit-content;
    padding: 4rem 0px;

    &--big {
      width: calc(100vw * 0.39);
    }
    &--left {
      margin-right: calc(100vw * 0.03);
      border-right: 1px solid white;
    }
    &--right {
      margin-left: calc(100vw * 0.03);
      padding-left: calc(100vw * 0.03);
      border-left: 1px solid white;
    }
    &--small {
      width: calc(100vw * 0.2);
    }
    &--border {
      border-color: transparent;
      animation: border 500ms 3900ms forwards ease-in;
    }
  }

  &__title {
    &--fade {
      opacity: 0;

      animation: fadeIn 500ms 3900ms forwards ease-in;
    }
    color: white;
    font-size: calc(100vw * 0.014);
  }

  &__total {
    color: white;
    font-size: calc(100vw * 0.048);
    line-height: 1;
    margin-bottom: 1rem;
  }

  &__graph {
    margin: 3rem 0 2rem;
  }
  &__special {
    font-family: 'roboto-black', sans-serif;
  }
  &__info {
    &--fade {
      opacity: 0;

      animation: fadeIn 500ms 3900ms forwards ease-in;
    }
    p {
      white-space: nowrap;
    }
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes border {
  0% {
    border-color: transparent;
  }

  100% {
    border-color: white;
  }
}
</style>
