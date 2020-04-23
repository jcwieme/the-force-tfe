<template>
  <div class="data-viz">
    <number-bubble />
    <d3-dialogues :data-dialogues="movieChoice" />
  </div>
</template>

<script>
import d3Dialogues from '@/d3/d3-dialogues.vue'
import numberBubble from '@/components/number-bubble.vue'
import * as utils from '@/tools/utils'

export default {
  name: 'Dialogues',
  components: {
    d3Dialogues,
    numberBubble,
  },
  computed: {
    title: function() {
      return this.$store.state.movies[this.$route.params.id - 1].title
    },
    movieChoice: function() {
      return utils.filterMovies(
        this.$store.state.movies[this.$route.params.id - 1].dialogs,
        this.$route.params.id
      )
    },
  },
}
</script>

<style lang="scss"></style>
