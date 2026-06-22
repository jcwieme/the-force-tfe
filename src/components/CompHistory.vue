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
import { defineComponent, computed, getCurrentInstance } from 'vue'

export default defineComponent({
  name: 'CompHistory',
  props: {
    number: String,
    word: String,
  },
  setup(props) {
    const vm = getCurrentInstance().proxy
    let data = computed(() => {
      return vm.$store.state.definitions[props.number]
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
