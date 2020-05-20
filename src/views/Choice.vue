<template>
  <ul class="choice">
    <router-link
      v-for="(choice, index) in choices"
      :key="index"
      tag="li"
      :to="choice.path"
      class="choice__movie"
      :class="'choice__movie--' + index"
    >
      <comp-choice :choice="choice" />
    </router-link>
  </ul>
</template>

<script>
import { defineComponent, onMounted } from '@vue/composition-api'
import compChoice from '@/components/comp-choice'

export default defineComponent({
  name: 'Choice',
  components: {
    compChoice,
  },
  setup(props, ctx) {
    const choices = ctx.root.$store.state.choices

    onMounted(() => {
      document.querySelectorAll('.choice__movie').forEach(choice => {
        choice.addEventListener('mouseover', e => {
          document.querySelectorAll('.choice__movie').forEach(choice => {
            choice.classList.remove('choice__movie--actif')
          })
          e.currentTarget.classList.add('choice__movie--actif')
        })
        choice.addEventListener('mouseout', e => {
          e.currentTarget.classList.remove('choice__movie--actif')
        })
      })
    })

    return {
      choices,
    }
  },
})
</script>

<style lang="scss">
.choice {
  color: #ffe403;
  font-family: 'star_jediregular', sans-serif;
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

    &--actif {
      width: 60%;

      .choice__number {
        color: #ffe403;
        opacity: 0;

        transition: color 200ms ease, opacity 500ms 200ms ease;
      }

      .choice__franchise--star,
      .choice__franchise--wars {
        span {
          transform: translateY(0);
          opacity: 1;

          transition: transform 500ms 700ms ease, opacity 500ms 700ms ease;
        }
      }
      .choice__title {
        opacity: 1;

        transition: opacity 500ms 950ms ease;
      }
    }
  }

  &__el {
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
    font-size: 14rem;
    letter-spacing: 1rem;
    color: #18181c;
    text-shadow: -1px 1px 0 #ffe403, 1px 1px 0 #ffe403, 1px -1px 0 #ffe403,
      -1px -1px 0 #ffe403;
    height: 2ch;
  }

  &__animation {
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

  &__franchise {
    font-size: 9rem;
    color: #18181c;
    text-shadow: -1px 1px 0 #ffe403, 1px 1px 0 #ffe403, 1px -1px 0 #ffe403,
      -1px -1px 0 #ffe403;
    width: 115%;
    text-align: center;
    overflow-y: hidden;

    &--star {
      margin-bottom: 1rem;

      span {
        display: block;
        transform: translateY(100%);
        opacity: 0;
      }
    }

    &--wars {
      margin-top: -0.5rem;

      span {
        display: block;
        transform: translateY(-100%);
        opacity: 0;
      }
    }
  }
  &__title {
    text-align: center;
    font-size: 1.8rem;
    color: white;
    opacity: 0;
  }
}
</style>
