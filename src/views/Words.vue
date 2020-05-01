<template>
  <div class="words">
    <transition name="fade" mode="out-in">
      <div class="words__list" v-show="!searchActive">
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
              + {{ word.from.length - 2 }} other
            </p>
          </sub>
        </div>
      </div>
    </transition>
    <transition name="fade" mode="out-in">
      <div
        class="words__search"
        v-show="searchActive"
        :data-complete="searchAuto"
        :class="[
          canSearch ? 'words__search--active' : '',
          animSearched ? 'words__search--searched' : '',
        ]"
      >
        <div
          class="words__input"
          :class="[
            animSearched ? 'words__input--searched' : '',
            searchedWordNumber < 10 ? 'words__input--small' : '',
          ]"
          :data-number="searchedWordNumber"
        >
          {{ search }}
        </div>
        <sub
          class="words__search__sub"
          :class="[animSearched ? 'words__search__sub--actif' : '']"
        >
          <div class="words__imgs">
            <img
              v-for="char in searchedWordFrom.slice(0, 2)"
              :key="char.path"
              :src="char.path"
              alt="img"
              class="words__img"
            />
            <span v-if="searchedWordFrom.length - 2 > 0" class="words__more">
              +{{ searchedWordFrom.length - 2 }}
            </span>
          </div>
          <p v-for="char in searchedWordFrom.slice(0, 2)" :key="char.word">
            {{ char.character.toLowerCase() }}
          </p>
          <p v-if="searchedWordFrom.length - 2 > 0">
            + {{ searchedWordFrom.length - 2 }} other
          </p>
        </sub>
      </div>
    </transition>
    <div
      class="words__message"
      :class="[searchActive ? 'words__message--close' : '']"
    >
      <transition name="fade" mode="out-in">
        <img
          :src="[searchActive ? picto[1] : picto[0]]"
          alt="svg"
          class="svg--big"
          :key="searchActive"
        />
      </transition>

      <transition name="fade" mode="out-in">
        <p :key="text">{{ text }}</p>
      </transition>
    </div>
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

    const picto = ['/assets/img/keyboard.svg', '/assets/img/cross.svg']

    const search = ref('')
    const searchAuto = ref('')
    const number = ref('')
    const searchActive = ref(false)
    const text = ref('Type something')
    const canSearch = ref(false)
    const canEnter = ref(false)
    const animSearched = ref(false)
    const canDelete = ref(true)

    const searchedWordNumber = computed(() => {
      if (animSearched.value) {
        return filteredWordsForSearch.value.filter(
          el => el.word === search.value
        )[0].number
      } else {
        return filteredWordsForSearch.value[0].number
      }
    })

    const searchedWordFrom = computed(() => {
      if (animSearched.value) {
        return filteredWordsForSearch.value.filter(
          el => el.word === search.value
        )[0].from
      } else {
        return filteredWordsForSearch.value[0].from
      }
    })

    const filteredWordsForSearch = computed(() => {
      return sortArray(
        words.value.filter(el => {
          if (
            (el.word.slice(0, search.value.length) === search.value &&
              el.word.length > search.value.length) ||
            (el.word.slice(0, search.value.length) === search.value &&
              el.word.includes(search.value))
          ) {
            return el
          }
        })
      )
    })

    const words = computed(() => {
      return utils.sortWords(
        ctx.root.$store.state.movies[ctx.root.$store.state.activeMovie].dialogs,
        ctx.root.$store.state.activeMovie + 1
      )
    })

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

      document
        .querySelector('.words__message')
        .addEventListener('click', () => {
          if (searchActive.value) {
            if (animSearched.value) {
              animSearched.value = false
              setTimeout(() => {
                searchActive.value = false
                text.value = 'Type something'
                search.value = ''
              }, 350)
            } else {
              searchActive.value = false
              text.value = 'Type something'
              search.value = ''
            }
          }
        })

      document.addEventListener('keydown', e => {
        let charCode = e.keyCode
        if (
          (charCode > 64 && charCode < 91) ||
          (charCode > 96 && charCode < 123) ||
          charCode === 189
        ) {
          if (
            filteredWordsForSearch.value.length === 1 &&
            filteredWordsForSearch.value[0].word === search.value
          ) {
            console.log('last word')
            return
          }

          search.value += e.key
          searchActive.value = true
          text.value = 'Close'

          if (filteredWordsForSearch.value.length === 0) {
            //red border
            if (
              !document
                .querySelector('.words__search')
                .classList.contains('words__search--error')
            ) {
              document
                .querySelector('.words__search')
                .classList.add('words__search--error')
            }
            search.value = search.value.slice(0, -1)
          } else {
            if (
              document
                .querySelector('.words__search')
                .classList.contains('words__search--error')
            ) {
              document
                .querySelector('.words__search')
                .classList.remove('words__search--error')
            }
          }

          if (
            search.value === filteredWordsForSearch.value[0].word ||
            filteredWordsForSearch.value.filter(el => el.word === search.value)
              .length === 1
          ) {
            canSearch.value = true
            canEnter.value = true
          } else {
            canSearch.value = false
            canEnter.value = false
          }

          console.log(filteredWordsForSearch.value)
          searchAuto.value = filteredWordsForSearch.value[0].word
        }

        // Enter
        if (e.keyCode === 13) {
          if (canEnter.value) {
            searchAuto.value = ''
            canSearch.value = false
            animSearched.value = true
            canDelete.value = false
          }
        }

        // Delete
        if (e.keyCode === 8 && searchActive.value === true) {
          if (animSearched.value) {
            animSearched.value = false
            setTimeout(() => {
              search.value = search.value.slice(0, -1)
              searchAuto.value = filteredWordsForSearch.value[0].word
              canEnter.value = false
              canDelete.value = true
            }, 800)
          } else {
            if (canDelete.value) {
              search.value = search.value.slice(0, -1)
              document
                .querySelector('.words__search')
                .classList.remove('words__search--error')

              if (
                search.value === filteredWordsForSearch.value[0].word ||
                filteredWordsForSearch.value.filter(
                  el => el.word === search.value
                ).length === 1
              ) {
                setTimeout(() => {
                  canSearch.value = true
                }, 1000)
              } else {
                canSearch.value = false
              }
              searchAuto.value = filteredWordsForSearch.value[0].word
              canEnter.value = false
            } else {
              return
            }
          }
        }

        if (searchActive.value === true && search.value.length === 0) {
          searchActive.value = false
          text.value = 'Type something'
        }
      })
    })

    return {
      words,
      search,
      number,
      movieWords,
      searchActive,
      searchAuto,
      text,
      canSearch,
      animSearched,
      searchedWordNumber,
      searchedWordFrom,
      picto,
    }
  },
})
function sortArray(arr) {
  return arr.concat().sort(compare)
}

function compare(a, b) {
  let comparison = 0
  if (a.word.length > b.word.length) {
    comparison = -1
  } else if (a.word.length < b.word.length) {
    comparison = 1
  }
  return comparison
}
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
    width: 70%;
  }

  &__el {
    font-family: 'roboto-black';
    text-transform: capitalize;
    font-size: calc(100vw * 0.038);
    line-height: 1.2;
    margin-right: calc(100vw * 0.03); // 50px
    margin-left: calc(100vw * 0.03);
    margin-top: calc(100vw * 0.042); // 70pxs
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
      top: calc(-100vw * 0.06);
      left: calc(-100vw * 0.03);
      font-size: calc(100vw * 0.077);
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
  &__search {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    font-size: calc(100vw * 0.038);
    padding: 10px 20px;
    width: 15ch;
    height: calc(100vw * 0.038);
    line-height: 1.2;
    border: 1px solid white;
    transition: border-color 500ms 800ms ease;

    &::after {
      content: attr(data-complete);
      color: rgba(255, 255, 255, 0.3);
      font-family: 'roboto-black';
      width: 100%;
      text-transform: capitalize;
      font-size: calc(100vw * 0.038);
      position: absolute;
      line-height: 1.2;
      left: 20px;
      top: 5px;
      z-index: -1;
    }
    &::before {
      content: '';
      background-image: url('/assets/img/enter.svg');
      background-repeat: no-repeat;
      background-position: center center;
      background-size: contain;
      height: 45px;
      width: 45px;
      position: absolute;
      right: -60px;
      top: 50%;
      transform: translateY(-50%);

      opacity: 0;
      transition: all 500ms ease;
    }

    &--active {
      transition: border-color 500ms ease;
      &::before {
        opacity: 1;
        transition: all 500ms ease;
      }
    }

    &--searched {
      border-color: transparent;

      transition: border-color 500ms ease;
    }

    &__sub {
      display: flex;
      font-size: calc(100vw * 0.0083);
      color: #ffe403;
      align-items: center;
      justify-content: center;
      margin-top: 85px;
      opacity: 0;
      transform: translateY(10px);
      transition: all 500ms ease;
      text-transform: capitalize;
      font-family: 'roboto-black';
      transition: all 500ms ease;

      &--actif {
        opacity: 1;
        transform: translateY(0);
        transition: all 500ms 1300ms ease;
      }

      p {
        margin-left: calc(100vw * 0.003); // 5px
        &:nth-child(2) {
          margin-left: calc(100vw * 0.006); // 10px
          &::after {
            content: ',';
          }
        }

        &:last-child {
          &::after {
            content: '';
          }
        }
      }
    }
    &--error {
      border-color: red;
      transition: border-color 300ms ease;
    }
  }
  &__input {
    color: white;
    font-family: 'roboto-black';
    text-transform: capitalize;
    white-space: nowrap;

    position: absolute;
    top: 5px;
    left: 20px;

    cursor: pointer;

    &::before {
      content: attr(data-number);
      font-family: 'star_jediregular';
      position: absolute;
      top: -75%;
      left: -1ch;
      font-size: 90px;
      opacity: 0;
      transform: translateY(-10px);
      z-index: -1;
      transition: all 0ms ease;
    }

    &--small {
      &::before {
        top: -75%;
        left: -0.4ch;
      }
    }

    &::after {
      content: '';
      position: absolute;
      left: -10px;
      bottom: 0;
      height: 0;
      width: calc(100% + 20px);
      background-color: #ffe403;
      opacity: 0.5;
      transition: all 300ms ease;
    }

    transition: all 300ms 500ms ease;
    &--searched {
      left: 50%;
      transform: translateX(-50%);

      transition: all 300ms 500ms ease;

      &::after {
        height: 30%;
        transition: height 300ms 1000ms ease;
      }

      &::before {
        content: attr(data-number);
        opacity: 0.5;
        transform: translateY(0);
        transition: all 500ms 1300ms ease;
      }
    }
  }

  &__sub {
    display: flex;
    font-size: calc(100vw * 0.0083);
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
      margin-left: calc(100vw * 0.003); // 5px
      &:nth-child(2) {
        margin-left: calc(100vw * 0.006); // 10px
        &::after {
          content: ',';
        }
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
    width: calc(100vw * 0.018); // 30px
    height: calc(100vw * 0.018);

    border: 1px solid #ffe403;

    &:nth-child(2) {
      margin-left: calc(-100vw * 0.012);
    }
  }

  &__more {
    border-radius: 50%;
    width: calc(100vw * 0.018);
    height: calc(100vw * 0.018);
    background-color: rgba(24, 24, 28, 0.9);
    line-height: 1;
    margin-left: calc(-100vw * 0.012);

    display: flex;
    align-items: center;
    justify-content: center;

    font-family: 'roboto';
    font-size: calc(100vw * 0.0072);
    color: white;

    border: 1px solid #ffe403;
  }

  &__message {
    position: fixed;
    left: 50%;
    bottom: 20px;
    transform: translateX(-50%);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &--close {
      cursor: pointer;
    }

    p {
      white-space: nowrap;
      font-family: 'star_jediregular';
      letter-spacing: 0.05em;
      color: #ffe403;
    }
  }
}

.svg {
  &--big {
    width: 75px;
    height: 55px;
    margin-bottom: 10px;
  }
  &--small {
    width: 35px;
    height: 35px;
    margin-bottom: 10px;
  }
}
</style>
