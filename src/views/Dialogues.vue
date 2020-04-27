<template>
  <div class="data-viz dialogues">
    <number-bubble />
    <d3-dialogues :data-dialogues="movieChoice" />
  </div>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
import d3Dialogues from '@/d3/d3-dialogues.vue'
import numberBubble from '@/components/number-bubble.vue'
import * as utils from '@/tools/utils'

export default defineComponent({
  name: 'Dialogues',
  components: {
    d3Dialogues,
    numberBubble,
  },
  setup(props, ctx) {
    const title = computed(() => {
      return ctx.root.$store.state.movies[ctx.root.$route.params.id - 1].title
    })

    const movieChoice = computed(() => {
      return utils.filterMovies(
        ctx.root.$store.state.movies[ctx.root.$route.params.id - 1].dialogs,
        ctx.root.$route.params.id
      )
    })

    return {
      title,
      movieChoice,
    }
  },
})
</script>

<style lang="scss"></style>
