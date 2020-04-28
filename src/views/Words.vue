<template>
  <div class="words">
    <ul id="v-for-object">
      <li v-for="(value, name) in words" :key="name">
        {{ value.word }} : {{ value.number }}
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
import * as utils from '@/tools/utils'
export default defineComponent({
  name: 'Words',
  setup(props, ctx) {
    const words = computed(() => {
      return utils
        .sortWords(
          ctx.root.$store.state.movies[ctx.root.$route.params.id - 1].dialogs
        )
        .slice(0, 160)
    })

    return {
      words,
    }
  },
})
</script>

<style lang="scss" scoped>
.words {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  ul {
    width: 55%;
    column-count: 6;
  }
  div {
    color: white;
  }
}
</style>
