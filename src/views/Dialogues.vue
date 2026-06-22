<template>
  <div class="data-viz dialogues section">
    <number-bubble />
    <d3-dialogues :data-dialogues="movieChoice" />
  </div>
</template>

<script>
import { defineComponent, computed, getCurrentInstance } from 'vue'
import d3Dialogues from '@/d3-components/D3DialoguesChart'
import numberBubble from '@/components/CompBubbleNumber'
import * as utils from '@/tools/utils'

export default defineComponent({
  name: 'Dialogues',
  components: {
    d3Dialogues,
    numberBubble,
  },
  setup() {
    const vm = getCurrentInstance().proxy
    // Setup variables
    const title = computed(() => {
      return vm.$store.state.movies[vm.$store.state.activeMovie].title
    })

    const movieChoice = computed(() => {
      return utils.filterMovies(
        vm.$store.state.movies[vm.$store.state.activeMovie].dialogs,
        vm.$route.params.id
      )
    })

    return {
      title,
      movieChoice,
    }
  },
})
</script>
