<template>
  <ul class="choice">
    <router-link
      v-for="(choice, index) in choices"
      :key="index"
      tag="li"
      :to="choice.path"
      class="choice__movie"
    >
      <div class="choice__title">
        <span class="choice__number">{{ choice.number }}</span>
        <div class="choice__reveal">
          <span class="choice__star choice__star--top">
            <span>StaR</span>
          </span>
          <span class="choice__name">
            {{ choice.title }}
          </span>
          <span class="choice__star choice__star--bottom">
            <span>Wars</span>
          </span>
        </div>
      </div>
    </router-link>
  </ul>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'Choice',
  setup() {
    const choices = [
      {
        title: 'the phantom menace',
        path: 'movie/1/history',
        number: 'i',
      },
      {
        title: 'attack of the clones',
        path: 'movie/2/history',
        number: 'ii',
      },
      {
        title: 'revenge of the sith',
        path: 'movie/3/history',
        number: 'iii',
      },
      {
        title: 'a new hope',
        path: 'movie/4/history',
        number: 'iv',
      },
      {
        title: 'the empire strike back',
        path: 'movie/5/history',
        number: 'v',
      },
      {
        title: 'return of the jedi',
        path: 'movie/6/history',
        number: 'vi',
      },
    ]

    return {
      choices,
    }
  },
})
</script>

<style lang="scss">
.choice {
  color: #ffe403;
  font-family: star_jediregular;
  letter-spacing: 0.1em;
  text-decoration: none;
  list-style-type: none;
  margin: 0;
  padding: 0;

  height: 100vh;
  width: 100vw;

  display: table;
  table-layout: fixed;

  &__movie {
    display: table-cell;
    vertical-align: middle;
    position: relative;
    width: calc(100% / 6);
    height: 100%;
    transition: all 500ms ease;
    border-right: 3px solid #ffe403;

    overflow: hidden;

    cursor: pointer;

    &:last-child {
      border: none;
    }

    &:hover {
      width: 60%;

      .choice__number {
        color: #ffe403;
        opacity: 0;

        transition: color 200ms ease, opacity 500ms 200ms ease;
      }

      .choice__star--top,
      .choice__star--bottom {
        span {
          transform: translateY(0);
          opacity: 1;

          transition: transform 500ms 700ms ease, opacity 500ms 700ms ease;
        }
      }
      .choice__name {
        opacity: 1;

        transition: opacity 500ms 950ms ease;
      }
    }
  }

  &__title {
    width: 100%;
    height: 100%;

    position: relative;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  &__number {
    font-size: 140px;
    letter-spacing: 10px;
    color: #18181c;
    text-shadow: -1px 1px 0 #ffe403, 1px 1px 0 #ffe403, 1px -1px 0 #ffe403,
      -1px -1px 0 #ffe403;
  }

  &__reveal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;

    span {
      line-height: 1;
    }
  }

  &__star {
    font-size: 90px;
    color: #18181c;
    text-shadow: -1px 1px 0 #ffe403, 1px 1px 0 #ffe403, 1px -1px 0 #ffe403,
      -1px -1px 0 #ffe403;
    width: 115%;
    text-align: center;
    overflow-y: hidden;

    &--top {
      margin-bottom: 10px;

      span {
        display: block;
        transform: translateY(100%);
        opacity: 0;
      }
    }

    &--bottom {
      margin-top: -5px;

      span {
        display: block;
        transform: translateY(-100%);
        opacity: 0;
      }
    }
  }
  &__name {
    font-size: 18px;
    color: white;
    opacity: 0;
  }
}
</style>
