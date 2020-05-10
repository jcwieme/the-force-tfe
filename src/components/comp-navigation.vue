<template>
  <div class="nav">
    <div class="nav__sound" @click="toggleMusic()">
      <div class="nav__bar" :class="[musicPlay ? 'nav__bar--actif' : '']">
        Bar
      </div>
      <div class="nav__bar" :class="[musicPlay ? 'nav__bar--actif' : '']">
        Bar
      </div>
      <div class="nav__bar" :class="[musicPlay ? 'nav__bar--actif' : '']">
        Bar
      </div>
      <div class="nav__bar" :class="[musicPlay ? 'nav__bar--actif' : '']">
        Bar
      </div>
      <div class="nav__bar" :class="[musicPlay ? 'nav__bar--actif' : '']">
        Bar
      </div>
      <div class="nav__bar" :class="[musicPlay ? 'nav__bar--actif' : '']">
        Bar
      </div>
    </div>
    <div class="nav__arrows">
      <img
        src="../assets/img/nav/up--actif.svg"
        alt="actif up"
        class="nav__up"
      />
      <img
        :src="down ? downActif : downInactif"
        alt="actif down"
        class="nav__down"
      />
      <img
        :src="left ? leftActif : leftInactif"
        alt="actif left"
        class="nav__left"
      />
      <img
        :src="right ? rightActif : rightInactif"
        alt="actif right"
        class="nav__right"
      />
    </div>
    <div class="nav__chapter">
      <h3 :data-number="chapter" :data-text="chapterText">
        {{ this.$route.name }}
      </h3>
    </div>
    <div
      class="nav__title"
      :class="[isNavOpen ? 'nav__title--actif' : '']"
      ref="navRef"
    >
      <div class="nav__menu" @click="toggleNav">
        <div class="nav__btn nav__btn--top">btn1</div>
        <div class="nav__btn nav__btn--center">btn2</div>
        <div class="nav__btn nav__btn--bottom">btn3</div>
      </div>
      <h2 class="nav__movie">
        <span>Star Wars: {{ number }}</span>
        <span>{{ title }}</span>
      </h2>
      <div class="nav__choice">
        <ul class="nav__list">
          <router-link
            v-for="(route, index) in routes"
            :key="index"
            :to="{ path: route.path }"
            :data-number="route.number"
            tag="li"
            @click.native="toggleNav"
            >{{ route.title }}</router-link
          >
        </ul>
        <ul class="nav__extra">
          <div @click="toggleCredits()">Credits</div>
          <div>
            <a
              href="https://medium.com/@jeanchristophewieme/tfe-chapitre-1-la-t%C3%AAte-dans-les-%C3%A9toiles-ead3075aec9f"
              target="_blank"
              >medium</a
            >
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, ref, watch } from '@vue/composition-api'

export default defineComponent({
  name: 'Navigation',
  setup(props, ctx) {
    const leftActif = ref('../../assets/img/nav/left--actif.svg')
    const leftInactif = ref('../../assets/img/nav/left--inactif.svg')
    const rightActif = ref('../../assets/img/nav/right--actif.svg')
    const rightInactif = ref('../../assets/img/nav/right--inactif.svg')
    const downActif = ref('../../assets/img/nav/down--actif.svg')
    const downInactif = ref('../../assets/img/nav/down--inactif.svg')
    let isNavOpen = computed(() => {
      return ctx.root.$store.state.checks.nav
    })

    const navRef = ref(null)

    const musicPlay = computed(() => {
      return ctx.root.$store.state.checks.music
    })

    const chapterText = computed(() => {
      switch (ctx.root.$route.name) {
        case 'History':
          return 'Iconic text of the Star Wars sagas, it will give you a preview of the film. Do not hesitate to hover highlighted words!'
        case 'Dialogues':
          return 'Explore the interactions in the film, the character who speaks most and with whom. Do not hesitate to hover the arcs for with the precise number of lines!'
        case 'Words':
          return 'Discover the most emblematic words of the film and who said them. Write a word to find out how popular it is.'
        case 'Numbers':
          return 'Nothing better than a few graphics to get a general view of the film.'
      }
    })

    const routes = computed(() => {
      return [
        {
          path: '/choice',
          number: '01',
          title: 'Choice',
        },
        {
          path: `/movie/${ctx.root.$route.params.id}/history`,
          number: '02',
          title: 'History',
        },
        {
          path: `/movie/${ctx.root.$route.params.id}/dialogues`,
          number: '03',
          title: 'Dialogues',
        },
        {
          path: `/movie/${ctx.root.$route.params.id}/words`,
          number: '04',
          title: 'Words',
        },
        {
          path: `/movie/${ctx.root.$route.params.id}/numbers`,
          number: '05',
          title: 'Numbers',
        },
      ]
    })
    const number = computed(() => {
      return ctx.root.$store.state.movies[
        ctx.root.$store.state.activeMovie
      ].number.toLowerCase()
    })
    const title = computed(() => {
      return ctx.root.$store.state.movies[ctx.root.$store.state.activeMovie]
        .title
    })
    const left = computed(() => {
      return ctx.root.$store.state.arrows.left
    })
    const right = computed(() => {
      return ctx.root.$store.state.arrows.right
    })
    const down = computed(() => {
      return ctx.root.$store.state.arrows.down
    })

    const toggleMusic = () => {
      ctx.root.$store.commit('toggleCheck', 'music')
    }

    const chapter = computed(() => {
      if (ctx.root.$route.name === 'History') {
        return '02'
      } else if (ctx.root.$route.name === 'Dialogues') {
        return '03'
      } else if (ctx.root.$route.name === 'Words') {
        return '04'
      } else {
        return '05'
      }
    })
    const toggleNav = () => {
      ctx.root.$store.commit('toggleCheck', 'nav')
    }

    const clickFunction = e => {
      if (!navRef.value.contains(e.target))
        ctx.root.$store.commit('toggleCheck', 'nav')
    }

    const toggleCredits = () => {
      ctx.root.$store.commit('toggleCheck', 'credit')
    }

    watch(
      () => ctx.root.$store.state.checks.nav,
      (value, prevValue) => {
        if (value) {
          document
            .querySelector('.section')
            .addEventListener('click', clickFunction)

          document.querySelector('.section').classList.add('blur')
        }
        if (!value && prevValue !== undefined) {
          document.querySelector('.section').classList.remove('blur')
          document
            .querySelector('.section')
            .removeEventListener('click', clickFunction)
        }
      }
    )

    return {
      toggleCredits,
      leftActif,
      leftInactif,
      rightActif,
      rightInactif,
      downActif,
      downInactif,
      isNavOpen,
      routes,
      number,
      title,
      left,
      right,
      down,
      chapter,
      toggleNav,
      navRef,
      musicPlay,
      toggleMusic,
      chapterText,
    }
  },
})
</script>

<style lang="scss">
.nav {
  color: white;
  font-family: star_jediregular;
  letter-spacing: 0.1em;

  &__sound {
    position: fixed;
    top: 40px;
    right: 40px;

    width: 28px;
    height: 20px;

    z-index: 11;

    cursor: pointer;
  }

  &__bar {
    background: white;
    opacity: 0.5;
    bottom: 1px;
    height: 15px;
    position: absolute;
    width: 3px;
    text-indent: 100%;
    white-space: nowrap;
    overflow: hidden;
    transition: all 500ms ease;

    &--actif {
      opacity: 1;
      height: 3px;
      transition: all 500ms ease;
      animation: sound 0ms -800ms linear infinite alternate;
    }

    &:nth-child(1) {
      left: 1px;
      animation-duration: 1274ms;
      animation-delay: 40ms;
    }
    &:nth-child(2) {
      left: 5px;
      animation-duration: 1233ms;
      animation-delay: 25ms;
    }
    &:nth-child(3) {
      left: 9px;
      animation-duration: 1207ms;
      animation-delay: 10ms;
    }
    &:nth-child(4) {
      left: 13px;
      animation-duration: 1258ms;
      animation-delay: 32ms;
    }
    &:nth-child(5) {
      left: 17px;
      animation-duration: 1200ms;
      animation-delay: 4ms;
    }
    &:nth-child(6) {
      left: 21px;
      animation-duration: 1227ms;
      animation-delay: 0ms;
    }
  }
  &__arrows {
    position: fixed;
    bottom: 40px;
    right: 40px;
    z-index: 10;

    width: 80px;
    height: 52.5px;

    img {
      width: 25px;
      height: 25px;
    }
  }
  &__left {
    position: absolute;
    left: 0;
    bottom: 0;
  }
  &__right {
    position: absolute;
    right: 0;
    bottom: 0;
  }
  &__up {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
  }
  &__down {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
  }
  &__chapter {
    position: fixed;
    bottom: 40px;
    left: 40px;
    z-index: 10;
    cursor: pointer;

    font-size: 20px;

    h3 {
      position: relative;
      transform-origin: left center;
      transform: rotate(-90deg) translateY(100%);

      &::before {
        content: attr(data-number);
        top: -70%;
        left: 0;
        position: absolute;
        color: #ffe403;
      }

      &::after {
        content: attr(data-text);
        color: white;
        display: block;
        position: absolute;
        left: 50%;
        top: 0px;
        width: 250px;
        font-family: 'roboto';
        transform-origin: left center;
        transform: rotate(90deg) translateX(20px);
        border: 1px solid #ffe403;
        background-color: #18181c;
        padding: 20px;
        font-size: 14px;
        pointer-events: none;
        opacity: 0;
        transition: all 300ms ease;
      }

      &:hover {
        &::after {
          opacity: 1;
          transform: rotate(90deg) translateX(0px);
          transition: all 300ms ease;
        }
      }
    }
  }
  &__title {
    position: fixed;
    top: 40px;
    left: 40px;

    z-index: 11;

    display: flex;

    &--actif {
      .nav__choice {
        transform: translateX(0);
      }

      .nav__btn {
        &--top {
          width: 45px;
          transform-origin: center center;
          transform: translateY(17px) rotate(45deg);

          transition: all 500ms ease, opacity 0s;
        }
        &--center {
          opacity: 0;
        }
        &--bottom {
          transform-origin: center center;
          transform: translateY(-17px) rotate(-45deg);

          transition: all 500ms ease, opacity 0s;
        }
      }
    }
  }
  &__menu {
    width: 45px;
    height: 40px;

    align-self: center;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    z-index: 20;

    cursor: pointer;

    &:hover {
      .nav__btn {
        &--top {
          width: 45px;
        }
        &--center {
          width: 45px;
        }
      }
    }
  }
  &__btn {
    height: 6px;
    background-color: white;

    overflow: hidden;
    text-indent: 100%;
    white-space: nowrap;

    transition: all 500ms ease, opacity 0s;

    &--top {
      width: 25px;
    }

    &--center {
      width: 35px;
    }
    &--bottom {
      width: 45px;
    }
  }
  &__movie {
    padding-left: 10px;
    margin-left: 10px;
    border-left: 6px solid white;
    line-height: 1;
    height: 45px;
    font-size: 20px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 20;

    span {
      display: block;
    }
  }

  &__choice {
    position: fixed;
    top: 0;
    left: 0;
    width: 445px;
    height: calc(100vh - 6px);
    background-color: #18181c;
    border: 3px solid #ffe403;
    z-index: 19;

    display: flex;

    transform: translateX(-100%);
    transition: all 500ms ease;
  }

  &__list {
    list-style: none;
    padding-left: 95px;

    font-size: 35px;

    display: flex;
    flex-direction: column;
    justify-content: center;

    li {
      margin-bottom: 70px;
      position: relative;

      cursor: pointer;

      transition: all 500ms ease;

      &:last-child {
        margin-bottom: 0;
      }

      &::before {
        content: attr(data-number);
        position: absolute;
        top: -80%;
        left: -35px;

        font-size: 60px;

        color: #ffe403;
        opacity: 0.5;
        transition: all 500ms ease;
      }

      &:hover {
        color: #ffe403;

        &::before {
          color: white;
        }
      }
    }
  }
  &__extra {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    padding: 0;

    list-style: none;
    display: flex;
    justify-content: center;

    width: 100%;

    div {
      cursor: pointer;
      transition: all 500ms ease;

      &:last-child {
        margin-left: 7px;
        padding-left: 10px;

        position: relative;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 3px;
          height: 100%;
          background-color: white;
        }
      }

      &:hover {
        color: #ffe403;
      }
    }
  }
}

@keyframes sound {
  0% {
    height: 3px;
  }
  100% {
    height: 15px;
  }
}
</style>
