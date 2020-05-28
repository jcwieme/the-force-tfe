<template>
  <div class="nav">
    <!-- <div class="nav__sound" @click="toggleFn('music')">
      <div
        class="nav__bar"
        :class="[musicPlay ? 'nav__bar--actif' : '']"
        v-for="n in 6"
        :key="n"
      >
        Bar
      </div>
    </div> -->
    <div class="nav__arrows">
      <img
        v-for="arrow in arrows"
        :key="arrow.name"
        :src="arrow.path"
        alt="picto arrow"
        :class="`nav__arrow nav__${arrow.name}`"
        @click="changeNav(arrow.state)"
      />
    </div>
    <div class="nav__chapter">
      <h3 :data-number="chapter.number" :data-text="chapterText">
        {{ chapter.name }}
      </h3>
    </div>
    <div
      class="nav__title"
      :class="[isNavOpen ? 'nav__title--actif' : '']"
      ref="navRef"
    >
      <div class="nav__menu" @click="toggleFn('nav')">
        <div
          class="nav__btn"
          v-for="n in 3"
          :key="`btn${n}`"
          :class="`nav__btn--${n}`"
        >
          btn
        </div>
      </div>
      <h2 class="nav__movie">
        <p>
          Star Wars: <span>{{ title.number }}</span>
        </p>
        <p>{{ title.title }}</p>
      </h2>
      <div class="nav__choice">
        <ul class="nav__list">
          <router-link
            v-for="(route, index) in routes"
            :key="index"
            :to="{ path: route.path }"
            :data-number="route.number"
            tag="li"
            @click.native="toggleFn('nav')"
            >{{ route.title }}</router-link
          >
        </ul>
        <ul class="nav__extra">
          <div @click="toggleFn('credit')">Credits</div>
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
    // Get arrow's path
    const arrows = computed(() => {
      let store = ctx.root.$store.state.arrows
      let arrows = [
        {
          name: 'left',
          state: 'left',
          path: '../../assets/img/nav/left--actif.svg',
        },
        {
          name: 'right',
          state: 'right',
          path: '../../assets/img/nav/right--actif.svg',
        },
        {
          name: 'down',
          state: 'down',
          path: '../../assets/img/nav/down--actif.svg',
        },
        {
          name: 'up',
          state: 'up',
          path: '../../assets/img/nav/up--actif.svg',
        },
      ]

      if (!store.left) {
        arrows[0].path = '../../assets/img/nav/left--inactif.svg'
        arrows[0].state = 'left--inactif'
      }
      if (!store.right) {
        arrows[1].path = '../../assets/img/nav/right--inactif.svg'
        arrows[1].state = 'right--inactif'
      }
      if (!store.down) {
        arrows[2].path = '../../assets/img/nav/down--inactif.svg'
        arrows[2].state = 'down--inactif'
      }

      return arrows
    })

    // Check navigation open or not
    let isNavOpen = computed(() => {
      return ctx.root.$store.state.checks.nav
    })
    const navRef = ref(null)

    // Check music is playing
    // const musicPlay = computed(() => {
    //   return ctx.root.$store.state.checks.music
    // })

    const router = ctx.root.$router.options.routes
    const route = computed(() => {
      return ctx.root.$route.name
    })
    const index = computed(() => {
      return router.findIndex(x => x.name === route.value)
    })
    const id = computed(() => {
      return ctx.root.$route.params.id
    })

    const changeNav = name => {
      if (
        name === 'right--inactive' ||
        name === 'left--inactif' ||
        name === 'down--inactif'
      )
        return

      if (name === 'up') {
        ctx.root.$router.push({
          name: router[index.value - 1].name,
        })
      }

      if (name === 'down') {
        ctx.root.$router.push({
          name: router[index.value + 1].name,
        })
      }

      if (name === 'right') {
        if (id.value < 6) {
          ctx.root.$router.push({
            name: route.value,
            params: { id: parseInt(id.value) + 1 },
          })
        }
      }

      if (name === 'left') {
        if (id.value > 1) {
          ctx.root.$router.push({
            name: route.value,
            params: { id: parseInt(id.value) - 1 },
          })
        }
      }
    }

    // Chapter explanation texts
    const chapterText = computed(() => {
      switch (ctx.root.$route.name) {
        case 'History':
          return 'Iconic text of the Star Wars sagas, it will give you a preview of the movie. Do not hesitate to hover highlighted words!'
        case 'Dialogues':
          return 'Explore the interactions in the movie, the character who speaks most and with whom. Do not hesitate to hover the arcs for with the precise number of lines! (IMP. is the abbreviation for Imperial)'
        case 'Words':
          return 'Discover the most emblematic words of the movie and who said them. Write a word to find out how popular it is.'
        case 'Numbers':
          return 'Nothing better than a few graphics to get a general view of the movie. Discover the richness of the movie, the proportion of the dark side or the number of humans in each movie.'
      }
    })

    // Get routes for menu
    const routes = computed(() => {
      return [
        {
          path: '/choice',
          number: '',
          title: 'Back to movies',
        },
        {
          path: `/movie/${ctx.root.$route.params.id}/history`,
          number: '01',
          title: 'History',
        },
        {
          path: `/movie/${ctx.root.$route.params.id}/dialogues`,
          number: '02',
          title: 'Dialogues',
        },
        {
          path: `/movie/${ctx.root.$route.params.id}/words`,
          number: '03',
          title: 'Words',
        },
        {
          path: `/movie/${ctx.root.$route.params.id}/numbers`,
          number: '04',
          title: 'Numbers',
        },
      ]
    })

    // Get info dor the title
    const title = computed(() => {
      return {
        title:
          ctx.root.$store.state.movies[ctx.root.$store.state.activeMovie].title,
        number: ctx.root.$store.state.movies[
          ctx.root.$store.state.activeMovie
        ].number.toLowerCase(),
      }
    })

    // Toggle global function
    const toggleFn = state => {
      ctx.root.$store.commit('toggleCheck', state)
    }

    // Get chapter number
    const chapter = computed(() => {
      return {
        name: ctx.root.$route.name,
        number: '0' + (index.value - 1),
      }
    })

    const clickFunction = e => {
      if (!navRef.value.contains(e.target))
        ctx.root.$store.commit('toggleCheck', 'nav')
    }

    watch(
      () => ctx.root.$store.state.checks.nav,
      (value, prevValue) => {
        let sections = document.querySelector('.section')
        if (value) {
          sections.addEventListener('click', clickFunction)

          sections.classList.add('blur')
        }
        if (!value && prevValue !== undefined) {
          sections.classList.remove('blur')
          sections.removeEventListener('click', clickFunction)
        }
      }
    )

    return {
      arrows,
      isNavOpen,
      routes,
      title,
      chapter,
      navRef,
      // musicPlay,
      chapterText,
      toggleFn,
      changeNav,
    }
  },
})
</script>

<style lang="scss">
.nav {
  color: white;
  font-family: 'star_jediregular', sans-serif;
  letter-spacing: 0.1em;

  // &__sound {
  //   position: fixed;
  //   top: 4rem;
  //   right: 4rem;

  //   width: 2.8rem;
  //   height: 2rem;

  //   z-index: 11;

  //   cursor: pointer;
  // }

  // &__bar {
  //   background: white;
  //   opacity: 0.5;
  //   bottom: 0.1rem;
  //   height: 1.5rem;
  //   position: absolute;
  //   width: 0.3rem;
  //   text-indent: 100%;
  //   white-space: nowrap;
  //   overflow: hidden;
  //   transition: all 500ms ease;

  //   &--actif {
  //     opacity: 1;
  //     height: 0.3rem;
  //     transition: all 500ms ease;
  //     animation: sound 0ms -800ms linear infinite alternate;
  //   }

  //   &:nth-child(1) {
  //     left: 0.1rem;
  //     animation-duration: 1274ms;
  //     animation-delay: 40ms;
  //   }
  //   &:nth-child(2) {
  //     left: 0.5rem;
  //     animation-duration: 1233ms;
  //     animation-delay: 25ms;
  //   }
  //   &:nth-child(3) {
  //     left: 0.9rem;
  //     animation-duration: 1207ms;
  //     animation-delay: 10ms;
  //   }
  //   &:nth-child(4) {
  //     left: 1.3rem;
  //     animation-duration: 1258ms;
  //     animation-delay: 32ms;
  //   }
  //   &:nth-child(5) {
  //     left: 1.7rem;
  //     animation-duration: 1200ms;
  //     animation-delay: 4ms;
  //   }
  //   &:nth-child(6) {
  //     left: 2.1rem;
  //     animation-duration: 1227ms;
  //     animation-delay: 0ms;
  //   }
  // }
  &__arrows {
    position: fixed;
    bottom: 4rem;
    right: 4rem;
    z-index: 10;

    width: 8rem;
    height: 5.25rem;

    img {
      width: 2.5rem;
      height: 2.5rem;
    }
  }
  &__arrow {
    cursor: pointer;
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
    bottom: 4rem;
    left: 4rem;
    z-index: 10;
    cursor: pointer;

    font-size: 2rem;

    h3 {
      position: fixed;
      bottom: 4rem;
      left: 4rem;
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
        width: 25rem;
        font-family: 'roboto', sans-serif;
        transform-origin: left center;
        transform: rotate(90deg) translateX(20px);
        border: 2px solid #ffe403;
        background-color: #18181c;
        padding: 2rem;
        font-size: 1.4rem;
        pointer-events: none;
        opacity: 0;
        transition: all 300ms ease;
        z-index: 11;
        letter-spacing: 0;
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
    top: 4rem;
    left: 4rem;

    z-index: 11;

    display: flex;

    &--actif {
      .nav__choice {
        transform: translateX(0);
      }

      .nav__btn {
        &--1 {
          width: 4.5rem;
          transform-origin: center center;
          transform: translateY(1.7rem) rotate(45deg);

          transition: all 500ms ease, opacity 0s;
        }
        &--2 {
          opacity: 0;
        }
        &--3 {
          transform-origin: center center;
          transform: translateY(-1.7rem) rotate(-45deg);

          transition: all 500ms ease, opacity 0s;
        }
      }
    }
  }
  &__menu {
    width: 4.5rem;
    height: 4rem;

    align-self: center;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    z-index: 20;

    cursor: pointer;

    &:hover {
      .nav__btn {
        &--1 {
          width: 4.5rem;
        }
        &--2 {
          width: 4.5rem;
        }
      }
    }
  }
  &__btn {
    height: 0.6rem;
    background-color: white;

    overflow: hidden;
    text-indent: 100%;
    white-space: nowrap;

    transition: all 500ms ease, opacity 0s;

    &--1 {
      width: 2.5rem;
    }

    &--2 {
      width: 3.5rem;
    }
    &--3 {
      width: 4.5rem;
    }
  }
  &__movie {
    padding-left: 1rem;
    margin-left: 1rem;
    border-left: 0.6rem solid white;
    line-height: 1;
    height: 4.5rem;
    font-size: 2rem;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 20;

    span {
      color: #ffe403;
    }
  }

  &__choice {
    position: fixed;
    top: 0;
    left: 0;
    width: 44.5rem;
    height: 100vh;
    box-sizing: border-box;
    background-color: #18181c;
    border: 0.3rem solid #ffe403;
    z-index: 19;

    display: flex;

    transform: translateX(-100%);
    transition: all 500ms ease;
  }

  &__list {
    list-style: none;
    padding-left: 9.5rem;

    font-size: 3.5rem;

    display: flex;
    flex-direction: column;
    justify-content: center;

    li {
      margin-bottom: 7rem;
      position: relative;

      cursor: pointer;

      transition: all 500ms ease;

      &:last-child {
        margin-bottom: 0;
      }

      &:first-child {
        text-align: center;
        margin-bottom: 9rem;
        font-size: 2rem;
        font-family: 'roboto-black', sans-serif;
        letter-spacing: 0;
        text-transform: uppercase;
        &::after {
          content: '';
          height: 3px;
          background-color: white;
          width: 30%;
          position: absolute;
          bottom: -2.5rem;
          left: 50%;
          transform: translateX(-50%);
          transition: all 500ms ease;
        }
      }

      &::before {
        content: attr(data-number);
        position: absolute;
        top: -80%;
        left: -3.5rem;

        font-size: 6rem;

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
    bottom: 4rem;
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
        margin-left: 0.7rem;
        padding-left: 1rem;

        position: relative;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 0.3rem;
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

// @keyframes sound {
//   0% {
//     height: 0.3rem;
//   }
//   100% {
//     height: 1.5rem;
//   }
// }
</style>
