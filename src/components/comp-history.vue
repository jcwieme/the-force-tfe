<template>
  <transition name="fade">
    <div class="history__popup">
      <img :src="data.path" alt="def" />
      <h4>{{ title }}</h4>
      <p>{{ data.definition }}</p>
    </div>
  </transition>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'comp-choice',
  props: {
    number: String,
    word: String,
  },
  setup(props, ctx) {
    let data = computed(() => {
      return ctx.root.$store.state.definitions[props.number]
    })

    let title = computed(() => {
      return props.word
    })

    return {
      data,
      title,
    }
  },
})
</script>
