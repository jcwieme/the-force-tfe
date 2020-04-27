<template>
  <div class="choice__title">
    <span class="choice__number">{{ choice.number }}</span>
    <div class="choice__reveal">
      <span class="choice__star choice__star--top">
        <span>StaR</span>
      </span>
      <span class="choice__name">
        {{ choice.title }}
      </span>
      <span class="choice__star choice__star--bottom">
        <span>Wars</span>
      </span>
    </div>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'comp-choice',
  props: {
    choice: Object,
  },
})
</script>

<style lang="scss"></style>
