<template>
  <div class="credits">
    <div class="credits__container">
      <div class="credits__title">
        <h2>Credits & Sources</h2>
        <p>
          All contents belong to
          <a href="https://www.disney.com/" target="_blank">Disney</a> -
          Copyrights to
          <a href="https://www.disney.com/" target="_blank">Disney</a>
        </p>
      </div>
      <div class="credits__data">
        <div
          class="credits__column"
          v-for="(column, i) in creditsArray"
          :key="`column__${i}`"
        >
          <div v-for="(list, j) in column" :key="`list__${j}`">
            <h3>{{ list.title }}</h3>
            <ul class="credits__list">
              <li
                class="credits__el"
                v-for="(link, k) in list.data"
                :key="`link__${k}`"
              >
                <a :href="link.path" target="_blank">{{ link.title }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="credits__close" @click="toggleCredits()">
      Close
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'comp-credits',
  setup(props, ctx) {
    const toggleCredits = () => {
      ctx.root.$store.commit('toggleCheck', 'credit')
    }
    const creditsArray = computed(() => {
      return ctx.root.$store.state.credits
    })

    return {
      toggleCredits,
      creditsArray,
    }
  },
})
</script>

<style lang="scss">
.credits {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  position: absolute;
  top: 0;
  left: 0;

  background-color: #3d4c53;

  z-index: 30;

  font-family: 'roboto';

  h3 {
    font-family: 'roboto';
    font-size: 36px;
    margin-bottom: 20px;
    // color: #ffe403;
  }

  &__container {
    width: fit-content;
    max-width: 1200px;
    margin: auto;
  }

  &__title {
    h2 {
      font-family: 'roboto-black';
      font-size: 90px;
      line-height: 0.85;
      max-width: 600px;
      margin-bottom: 20px;
    }
  }

  &__data {
    display: flex;
    justify-content: flex-start;

    margin-top: 50px;
  }

  &__list {
    padding: 0;
    list-style: none;

    margin-right: 150px;
    margin-bottom: 20px;
  }

  &__el {
    margin-bottom: 5px;
    transition: all 500ms ease;

    &:hover {
      color: #ffe403;
      transition: all 500ms ease;
    }
  }

  &__close {
    position: absolute;
    top: 40px;
    right: 40px;
    width: 25px;
    height: 25px;
    text-indent: 100%;
    overflow: hidden;
    white-space: nowrap;

    background-image: url('/assets/img/close.svg');
    background-repeat: no-repeat;
    background-size: contain;

    cursor: pointer;
    transition: all 500ms;

    &:hover {
      background-image: url('/assets/img/close--hover.svg');
      transition: all 500ms;
    }
  }
}
</style>
