<template>
  <div class="words">
    <div class="words__list">
      <div v-for="(word, index) in movieWords" :key="index" class="words__el">
        <p class="words__word" :data-number="word.number">{{ word.word }}</p>
        <sub class="words__sub" :class="'words__sub--' + word.word">
          <div class="words__imgs">
            <img
              v-for="char in word.from.slice(0, 2)"
              :key="char.path"
              :src="char.path"
              alt="img"
              class="words__img"
            />
            <span v-if="word.from.length - 2 > 0" class="words__more">
              +{{ word.from.length - 2 }}
            </span>
          </div>
          <p v-for="char in word.from.slice(0, 2)" :key="char.word">
            {{ char.character.toLowerCase() }}
          </p>
          <p v-if="word.from.length - 2 > 0">
            +{{ word.from.length - 2 }} other
          </p>
        </sub>
      </div>
    </div>
    <input class="words__input" type="text" v-model="search" />
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
      ['luke', 'force', 'artoo', 'alderaan', 'rebel'],
      ['luke', 'artoo', 'chewie', 'vader', 'force'],
      ['luke', 'artoo', 'master', 'shield', 'jabba'],
    ]

    const search = ref('')
    const number = ref('')

    const words = computed(() => {
      return utils.sortWords(
        ctx.root.$store.state.movies[ctx.root.$store.state.activeMovie].dialogs,
        ctx.root.$store.state.activeMovie + 1
      )
    })
    console.log(words.value)

    const movieWords = computed(() => {
      let filteredWords = []
      words.value.forEach(el => {
        choiceWords[ctx.root.$store.state.activeMovie].forEach(temp => {
          if (temp === el.word) {
            filteredWords.push(el)
          }
        })
      })
      return filteredWords
    })

    onMounted(() => {
      document.querySelectorAll('.words__word').forEach(el => {
        el.addEventListener('mouseover', e => {
          let word = e.currentTarget.innerText.toLowerCase()
          document
            .querySelector(`.words__sub--${word}`)
            .classList.add('words__sub--actif')
          e.currentTarget.classList.add('words__word--actif')
        })
        el.addEventListener('mouseout', e => {
          let word = e.currentTarget.innerText.toLowerCase()
          document
            .querySelector(`.words__sub--${word}`)
            .classList.remove('words__sub--actif')
          e.currentTarget.classList.remove('words__word--actif')
        })
      })
    })

    return {
      words,
      search,
      number,
      movieWords,
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

    &--actif {
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

  &__sub {
    display: flex;
    font-size: 14px;
    color: #ffe403;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    opacity: 0;
    transform: translateY(10px);
    transition: all 500ms ease;

    &--actif {
      opacity: 1;
      transform: translateY(0);
      transition: all 500ms ease;
    }

    p {
      margin-left: 5px;
      &:nth-child(2) {
        margin-left: 10px;
      }
      &::after {
        content: ',';
      }

      &:last-child {
        &::after {
          content: '';
        }
      }
    }
  }
  &__imgs {
    display: flex;
  }

  &__img {
    border-radius: 50%;
    width: 30px;
    height: 30px;

    &:nth-child(2) {
      margin-left: -20px;
    }
  }

  &__more {
    border-radius: 50%;
    width: 30px;
    height: 30px;
    background-color: #999;
    line-height: 1;
    margin-left: -20px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-family: 'roboto';
    font-size: 12px;
    color: white;
  }
}
</style>
