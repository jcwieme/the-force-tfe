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
import * as utils from '@/tools/utils'
export default {
  name: 'Words',
  data() {
    return { keyUp: true }
  },
  computed: {
    words: function() {
      return utils
        .sortWords(this.$store.state.movies[this.$route.params.id - 1].dialogs)
        .slice(0, 20)
    },
  },
}
</script>

<style lang="scss" scoped>
.words {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  ul {
    width: 25%;
    column-count: 4;
  }
  div {
    color: white;
  }
}
</style>
