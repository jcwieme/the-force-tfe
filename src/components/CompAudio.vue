<template>
  <div class="nav__sound" @click="toggleFn('music')">
    <div
      class="nav__bar"
      :class="[musicPlay ? 'nav__bar--actif' : '']"
      v-for="n in 6"
      :key="n"
    >
      Bar
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'CompAudio',
  setup(props, ctx) {
    const musicPlay = computed(() => {
      return ctx.root.$store.state.checks.music
    })
    // Toggle global function
    const toggleFn = state => {
      ctx.root.$store.commit('toggleCheck', state)
    }
    return {
      musicPlay,
      toggleFn,
    }
  },
})
</script>

<style lang="scss">
.nav {
  &__sound {
    position: fixed;
    top: 4rem;
    right: 4rem;

    width: 2.8rem;
    height: 2rem;

    z-index: 11;

    cursor: pointer;
  }
  &__bar {
    background: white;
    opacity: 0.5;
    bottom: 0.1rem;
    height: 1.5rem;
    position: absolute;
    width: 0.3rem;
    text-indent: 100%;
    white-space: nowrap;
    overflow: hidden;
    transition: all 500ms ease;

    &--actif {
      opacity: 1;
      height: 0.3rem;
      transition: all 500ms ease;
      animation: sound 0ms -800ms linear infinite alternate;
    }

    &:nth-child(1) {
      left: 0.1rem;
      animation-duration: 1274ms;
      animation-delay: 40ms;
    }
    &:nth-child(2) {
      left: 0.5rem;
      animation-duration: 1233ms;
      animation-delay: 25ms;
    }
    &:nth-child(3) {
      left: 0.9rem;
      animation-duration: 1207ms;
      animation-delay: 10ms;
    }
    &:nth-child(4) {
      left: 1.3rem;
      animation-duration: 1258ms;
      animation-delay: 32ms;
    }
    &:nth-child(5) {
      left: 1.7rem;
      animation-duration: 1200ms;
      animation-delay: 4ms;
    }
    &:nth-child(6) {
      left: 2.1rem;
      animation-duration: 1227ms;
      animation-delay: 0ms;
    }
  }
}

@keyframes sound {
  0% {
    height: 0.3rem;
  }
  100% {
    height: 1.5rem;
  }
}
</style>
