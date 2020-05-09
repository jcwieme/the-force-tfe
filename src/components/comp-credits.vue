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
        <div class="credits__column">
          <h3>Scripts</h3>
          <ul class="credits__list">
            <li class="credits__el">
              <a href="https://www.imsdb.com/" target="_blank">IMSDB</a>
            </li>
            <li class="credits__el">
              <a href="https://yts-subs.com/" target="_blank">YTS-Subs</a>
            </li>
          </ul>
          <h3>Sources</h3>
          <ul class="credits__list">
            <li class="credits__el">
              <a href="https://www.starwars.com/databank" target="_blank"
                >SW Databank</a
              >
            </li>
            <li class="credits__el">
              <a
                href="https://archive.org/details/13BinarySunsetAlternate/"
                target="_blank"
                >Archive.org</a
              >
            </li>
          </ul>
        </div>
        <div class="credits__column">
          <h3>Librairies</h3>
          <ul class="credits__list">
            <li class="credits__el">
              <a href="https://vuejs.org/" target="_blank">Vue.js</a>
            </li>
            <li class="credits__el">
              <a href="https://vue-particles.netlify.app/" target="_blank"
                >Vue Particles (Particles.js)</a
              >
            </li>
            <li class="credits__el">
              <a href="https://composition-api.vuejs.org/" target="_blank"
                >Vue Composition API</a
              >
            </li>
            <li class="credits__el">
              <a href="https://d3js.org/" target="_blank">D3.js</a>
            </li>
            <li class="credits__el">
              <a href="https://greensock.com/gsap/" target="_blank">GSAP</a>
            </li>
            <li class="credits__el">
              <a href="https://howlerjs.com/" target="_blank">Howler.js</a>
            </li>
          </ul>
        </div>
        <div class="credits__column">
          <h3>Other</h3>
          <ul class="credits__list">
            <li class="credits__el">
              <a
                href="https://medium.com/better-programming/create-a-star-wars-title-crawl-in-html-c25a76fea401"
                target="_blank"
                >Crawl Text</a
              >
            </li>
            <li class="credits__el">
              <a href="http://bl.ocks.org/" target="_blank">Bl.ocks.org</a>
            </li>
            <li class="credits__el">
              <a href="https://www.d3-graph-gallery.com/" target="_blank"
                >D3 Graph Gallery</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="credits__close" @click="toggleCredits()">
      Close
    </div>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'comp-credits',
  setup(props, ctx) {
    const toggleCredits = () => {
      ctx.root.$store.commit('toggleCredits')
    }

    return {
      toggleCredits,
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
  justify-content: center;
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
