<template>
  <div class="nav">
    <div class="nav__sound">Sound: on</div>
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
      <h3 :data-number="chapter">
        {{ this.$route.name }}
      </h3>
    </div>
    <div class="nav__title" :class="[isNavOpen ? 'nav__title--actif' : '']">
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
            @click.native="closeNav"
            >{{ route.title }}</router-link
          >
        </ul>
        <ul class="nav__extra">
          <router-link to="/" tag="li">Credits</router-link>
          <a href="/" target="_blank">Case-Study</a>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'Navigation',
  setup(props, ctx) {
    const leftActif = ref('../../assets/img/nav/left--actif.svg')
    const leftInactif = ref('../../assets/img/nav/left--inactif.svg')
    const rightActif = ref('../../assets/img/nav/right--actif.svg')
    const rightInactif = ref('../../assets/img/nav/right--inactif.svg')
    const downActif = ref('../../assets/img/nav/down--actif.svg')
    const downInactif = ref('../../assets/img/nav/down--inactif.svg')
    let isNavOpen = ref(false)

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
      return ctx.root.$store.state.arrowLeft
    })
    const right = computed(() => {
      return ctx.root.$store.state.arrowRight
    })
    const down = computed(() => {
      if (ctx.root.$route.name === 'Numbers') {
        return false
      } else {
        return true
      }
    })

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
      let chapter = document.querySelector(
        `.${ctx.root.$route.name.toLowerCase()}`
      )
      if (chapter.classList.contains('blur')) {
        chapter.classList.remove('blur')
      } else {
        chapter.classList.add('blur')
      }
      isNavOpen.value = !isNavOpen.value
    }

    const closeNav = () => {
      isNavOpen.value = !isNavOpen.value
    }

    return {
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
      closeNav,
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

    z-index: 11;
  }
  &__arrows {
    position: fixed;
    bottom: 40px;
    right: 40px;

    width: 105px;
    height: 70px;

    img {
      width: 35px;
      height: 35px;
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

    li {
      cursor: pointer;
      transition: all 500ms ease;

      &:hover {
        color: #ffe403;
      }
    }

    a {
      cursor: pointer;
      text-decoration: none;
      color: inherit;
      margin-left: 7px;
      padding-left: 10px;

      position: relative;
      transition: all 500ms ease;

      &:hover {
        color: #ffe403;
      }

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
  }
}
</style>
